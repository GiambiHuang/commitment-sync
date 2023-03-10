import { initLedger } from '../triple-masking';
import { DEFAULT_ENV_CONFIG, EnvConfig } from './config';
import { AbarMemoSchema, AccountSchema, CommitmentSchema } from '../types/types';

interface ICommitmentDB {
  dbFullName: string;
  initialized: boolean;
  queryURL: string;
  envConfig: EnvConfig;
}

class CommitmentDB implements ICommitmentDB {
  private db = {} as IDBDatabase;

  dbFullName = '';
  initialized = false;
  queryURL = '';
  envConfig = DEFAULT_ENV_CONFIG;

  constructor () {
    initLedger();
  }

  setEnvConfig (newEnvConfig: EnvConfig) {
    this.envConfig.dbName = newEnvConfig.dbName || DEFAULT_ENV_CONFIG.dbName;
    this.envConfig.envBaseURL = newEnvConfig.envBaseURL || DEFAULT_ENV_CONFIG.envBaseURL;
    this.envConfig.envName = newEnvConfig.envName || DEFAULT_ENV_CONFIG.envName;
    this.envConfig.envQueryPort = newEnvConfig.envQueryPort || DEFAULT_ENV_CONFIG.envQueryPort;
  }

  init (config: EnvConfig = DEFAULT_ENV_CONFIG) {
    this.setEnvConfig(config);
    const {
      dbName,
      envName,
      envBaseURL,
      envQueryPort,
      stores = {},
    } = this.envConfig;

    this.dbFullName = `${dbName}_${envName}`;
    this.queryURL = [envBaseURL, envQueryPort && `:${envQueryPort}`].filter(Boolean).join('');

    this.initialized = false;
    return new Promise((resolve, reject) => {
      if (window?.indexedDB) {
        const request = window.indexedDB.open(this.dbFullName);
        request.onsuccess = (event) => {
          const { result } = event.target as IDBOpenDBRequest;
          this.setDB(result);
          resolve(true);
        }
        request.onupgradeneeded = (event) => {
          const { result } = event.target as IDBOpenDBRequest;
          const storesObject = Object.values(stores);
          for (const objectStore of storesObject) {
            const store = result.createObjectStore(objectStore.store, objectStore.storeConfig);
            for (const index of (objectStore.index || [])) {
              store.createIndex(index, index, { unique: false });
            }
          }
          this.setDB(result);
          resolve(true);
        }
      } else {
        reject(false);
      }
    })
  }

  private setDB (db: IDBDatabase) {
    this.db = db;
    this.initialized = true;
    // this.db.onversionchange = () => {
    //   db.close();
    //   console.log("A new version of this page is ready. Please reload or close this tab!");
    // };
  }

  addAccount (account: AccountSchema) {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.accounts ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      tx.oncomplete = () => {
        resolve(true);
      }
      tx.onerror = reject;
      tx.onabort = reject;
      store.put(account);
    })
  }

  addAbarMemos (abarMemos: AbarMemoSchema[]) {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      tx.oncomplete = () => {
        console.log('addAbarMemos: saved!');
        resolve(true);
      }
      tx.onerror = reject;
      tx.onabort = reject;
      for (const abarMemo of abarMemos) {
        store.put(abarMemo);
      }
    })
  }

  getAccounts (): Promise<AccountSchema[]> {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.accounts ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const storeRequest = store.getAll();
      storeRequest.onsuccess = () => {
        resolve(storeRequest.result);
      }
      storeRequest.onerror = reject;
    })
  }

  addCommitments (commitments: CommitmentSchema[]) {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.commitments ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      tx.oncomplete = () => {
        console.log('commitment: saved!');
        resolve(true);
      }
      tx.onerror = reject;
      tx.onabort = reject;
      for (const commitmentItem of commitments) {
        store.put({ ...commitmentItem });
      }
    })
  }

  getCurrentMas (): Promise<IDBValidKey> {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const openCursorRequest = store.openKeyCursor(null, 'prev')
      openCursorRequest.onsuccess = () => {
        const cursor = openCursorRequest.result;
        const maxKey = cursor && cursor.key;
        resolve(maxKey || -1);
      }
      openCursorRequest.onerror = (event) => {
        console.log(event);
        reject('error');
      }
    })
  }

  getAbarMemos (start = 0, end?: number): Promise<AbarMemoSchema[]> {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    const idbKeyRange = end ? IDBKeyRange.bound(start, end) : IDBKeyRange.lowerBound(start);
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.abarMemos ?? {};
      const store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
      const openCursorRequest = store.openCursor(idbKeyRange);
      const abarMemos: AbarMemoSchema[] = [];
      openCursorRequest.onsuccess = () => {
        const cursor = openCursorRequest.result;
        if (cursor) {
          abarMemos.push(cursor.value);
          cursor.continue();
        } else {
          resolve(abarMemos);
        }
      }
      openCursorRequest.onerror = (event) => {
        console.log(event);
        reject('error');
      }
    })
  }

  getCommitments (axfrPublicKey: AccountSchema['axfrPublicKey']): Promise<CommitmentSchema[]> {
    if (!this.initialized) throw new Error('DB hasn\'t been initialized.');
    return new Promise((resolve, reject) => {
      const { store: storeName = '' } = this.envConfig.stores?.commitments ?? {};
      const tx = this.db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const index = store.index('axfrPublicKey');
      const indexRequest: IDBRequest<CommitmentSchema[]> = index.get(axfrPublicKey);
      indexRequest.onsuccess = () => {
        resolve(indexRequest.result || []);
      }
      indexRequest.onerror = reject;
    })
  }

  close () {
    this.db.close && this.db.close();
  }
}

export const db = new CommitmentDB();
