import { initLedger } from './triple-masking';
import { DEFAULT_ENV_CONFIG, EnvConfig } from './config';
import { AbarMemoSchema, AccountSchema, CommitmentSchema } from './types';

interface ICommitmentDB {
  dbFullName: string;
  initialized: boolean;
  queryURL: string;
}

class CommitmentDB implements ICommitmentDB {
  private db = {} as IDBDatabase;
  static envConfig = DEFAULT_ENV_CONFIG;
  static setEnvConfig (newEnvConfig: EnvConfig) {
    this.envConfig = newEnvConfig;
  }
  dbFullName = '';
  initialized = false;
  queryURL = '';

  constructor () {
    initLedger();
  }

  init () {
    const {
      dbName,
      envName,
      envBaseURL,
      envQueryPort,
      stores = {},
    } = CommitmentDB.envConfig;

    this.dbFullName = `${dbName}_${envName}`;
    this.queryURL = [envBaseURL, envQueryPort && `:${envQueryPort}`].filter(Boolean).join('');

    this.initialized = false;
    if (window.indexedDB) {
      const request = window.indexedDB.open(this.dbFullName);
      request.onsuccess = (event) => {
        const { result } = event.target as IDBOpenDBRequest;
        this.setDB(result);
      }
      request.onupgradeneeded = (event) => {
        const { result } = event.target as IDBOpenDBRequest;
        const storesObject = Object.values(stores);
        for (const objectStore of storesObject) {
          result.createObjectStore(objectStore.store, objectStore.storeConfig);
        }
        this.setDB(result);
      }
    }
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.accounts ?? {};
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.accounts ?? {};
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.commitments ?? {};
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
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
      const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
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
}

export const db = new CommitmentDB();
