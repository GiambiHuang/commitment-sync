import { decryptAbarMemos, getLedger } from '../triple-masking';
import { DEFAULT_ENV_CONFIG } from './config';
import { getMAS, getAbarMemos, getCommitment } from '../apis';
import getRanges from '../utils/getRanges';
class SyncStore {
    db = {};
    // private wsProvider = {} as WebSocket;
    dbFullName = '';
    initialized = false;
    queryURL = '';
    envConfig = DEFAULT_ENV_CONFIG;
    blockNumber = 0;
    constructor() {
        getLedger();
    }
    setEnvConfig(newEnvConfig) {
        this.envConfig.dbName = newEnvConfig.dbName || DEFAULT_ENV_CONFIG.dbName;
        this.envConfig.envRpcUrl = newEnvConfig.envRpcUrl || DEFAULT_ENV_CONFIG.envRpcUrl;
        this.envConfig.envName = newEnvConfig.envName || DEFAULT_ENV_CONFIG.envName;
        this.envConfig.envWssRpcUrl = newEnvConfig.envWssRpcUrl || DEFAULT_ENV_CONFIG.envWssRpcUrl;
    }
    async init(config = DEFAULT_ENV_CONFIG) {
        this.setEnvConfig(config);
        const { dbName, envName, envRpcUrl, envWssRpcUrl, stores = {}, } = this.envConfig;
        this.dbFullName = `${dbName}_${envName}`;
        this.queryURL = [envRpcUrl, ':8667'].filter(Boolean).join('');
        this.initialized = false;
        if (envWssRpcUrl) {
            // const socket = new WebSocket(envWssRpcUrl);
            // // Connection opened
            // socket.addEventListener("open", () => {
            //     socket.send(JSON.stringify({"jsonrpc":"2.0", "id": 1, "method": "eth_subscribe", "params": ["newHeads"]}));
            // });
            // // Listen for messages
            // socket.addEventListener("message", (event) => {
            //   console.log("Message from server ", JSON.parse(event.data));
            // });
            // this.wsProvider = socket as WebSocket;
        }
        return new Promise((resolve, reject) => {
            if (window?.indexedDB) {
                const request = window.indexedDB.open(this.dbFullName, 2);
                request.onsuccess = (event) => {
                    const { result } = event.target;
                    this.setDB(result);
                    resolve(true);
                };
                request.onupgradeneeded = async (event) => {
                    const { result } = event.target;
                    const storesObject = Object.values(stores);
                    for (const objectStore of storesObject) {
                        const store = result.createObjectStore(objectStore.store, objectStore.storeConfig);
                        for (const index of (objectStore.index || [])) {
                            store.createIndex(index, index, { unique: false });
                        }
                    }
                    this.setDB(result);
                    resolve(true);
                };
            }
            else {
                reject(false);
            }
        }).finally(async () => {
            setTimeout(() => {
                this.checkSync();
            }, 100);
        });
    }
    setDB(db) {
        this.db = db;
        this.initialized = true;
        // this.db.onversionchange = () => {
        //   db.close();
        //   console.log("A new version of this page is ready. Please reload or close this tab!");
        // };
    }
    async fetchLatestMAS() {
        const [mas, masInDB] = await Promise.all([
            getMAS(this.queryURL),
            this.getCurrentMas(),
        ]);
        console.log(`latest mas: ${mas}, the mas in db: ${masInDB}`);
        return [mas, +masInDB];
    }
    fetchAbarMemos(from, end) {
        const ranges = getRanges(from, end);
        return Promise.all(ranges.map(range => getAbarMemos(range[0], range[1], this.queryURL)));
    }
    addAbarMemos(abarMemos) {
        if (!this.initialized)
            throw new Error('DB hasn\'t been initialized.');
        return new Promise((resolve, reject) => {
            const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            tx.oncomplete = () => {
                console.log('addAbarMemos: saved!');
                resolve(true);
            };
            tx.onerror = reject;
            tx.onabort = reject;
            for (const abarMemo of abarMemos) {
                store.put(abarMemo);
            }
        });
    }
    async getOwnedAbars(wallet) {
        const ledger = await getLedger();
        const [encryptedAbarMemos, undecryptedAbarMemos,] = await Promise.all([
            this.getAbarMemos(wallet.publickey),
            this.getAbarMemos(),
        ]);
        const ownedAbarMemos = await decryptAbarMemos(undecryptedAbarMemos, wallet.privateStr);
        let newEncryptedAbarMemos = [];
        if (ownedAbarMemos.length) {
            const commitments = await Promise.all(ownedAbarMemos.map(abarMemo => getCommitment(abarMemo.sid, this.queryURL)));
            newEncryptedAbarMemos = ownedAbarMemos.map((abarMemos, idx) => ({
                ...abarMemos,
                publickey: wallet.publickey,
                commitment: ledger.base64_to_base58(commitments[idx]),
            }));
            this.addAbarMemos(newEncryptedAbarMemos);
        }
        return encryptedAbarMemos.concat(newEncryptedAbarMemos);
    }
    // addCommitments (commitments: CommitmentSchema[]) {
    //   if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    //   return new Promise((resolve, reject) => {
    //     const { store: storeName = '' } = this.envConfig.stores?.commitments ?? {};
    //     const tx = this.db.transaction(storeName, 'readwrite');
    //     const store = tx.objectStore(storeName);
    //     tx.oncomplete = () => {
    //       console.log('commitment: saved!');
    //       resolve(true);
    //     }
    //     tx.onerror = reject;
    //     tx.onabort = reject;
    //     for (const commitmentItem of commitments) {
    //       store.put({ ...commitmentItem });
    //     }
    //   })
    // }
    getCurrentMas() {
        if (!this.initialized)
            throw new Error('DB hasn\'t been initialized.');
        return new Promise((resolve, reject) => {
            const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const openCursorRequest = store.openKeyCursor(null, 'prev');
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                const maxKey = cursor && cursor.key;
                resolve(maxKey || -1);
            };
            openCursorRequest.onerror = (event) => {
                console.log(event);
                reject('error');
            };
        });
    }
    getAbarMemos(publickey = '') {
        if (!this.initialized)
            throw new Error('DB hasn\'t been initialized.');
        const idbKeyRange = IDBKeyRange.only(publickey);
        return new Promise((resolve, reject) => {
            const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
            const tx = this.db.transaction(storeName, 'readwrite');
            const store = tx.objectStore(storeName);
            const index = store.index('publickey');
            const openCursorRequest = index.openCursor(idbKeyRange);
            const abarMemos = [];
            openCursorRequest.onsuccess = () => {
                const cursor = openCursorRequest.result;
                if (cursor) {
                    abarMemos.push(cursor.value);
                    cursor.continue();
                }
                else {
                    resolve(abarMemos);
                }
            };
            openCursorRequest.onerror = reject;
        });
        // const idbKeyRange = end ? IDBKeyRange.bound(start, end) : IDBKeyRange.lowerBound(start);
        // return new Promise((resolve, reject) => {
        //   const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
        //   const store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
        //   const openCursorRequest = store.openCursor(idbKeyRange);
        //   const abarMemos: AbarMemoSchema[] = [];
        //   openCursorRequest.onsuccess = () => {
        //     const cursor = openCursorRequest.result;
        //     if (cursor) {
        //       abarMemos.push(cursor.value);
        //       cursor.continue();
        //     } else {
        //       resolve(abarMemos);
        //     }
        //   }
        //   openCursorRequest.onerror = (event) => {
        //     console.log(event);
        //     reject('error');
        //   }
        // })
    }
    async checkSync() {
        const [mas, masInDB] = await this.fetchLatestMAS();
        if (mas > masInDB) {
            const results = await this.fetchAbarMemos(masInDB, mas);
            const abarMemos = results
                .flatMap(rangeMemos => rangeMemos.map((memo) => ({ sid: memo[0], memo, publickey: '', commitment: '' })));
            await this.addAbarMemos(abarMemos);
        }
    }
    async getCommitments(wallet) {
        await this.checkSync();
        const ownedAbars = await this.getOwnedAbars(wallet);
        return ownedAbars.map(abar => abar.commitment);
    }
    close() {
        this.db.close && this.db.close();
        // this.wsProvider.close();
    }
}
export const syncStore = new SyncStore();
//# sourceMappingURL=index.js.map