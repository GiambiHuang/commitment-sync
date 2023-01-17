import { decryptAbarMemo, initLedger } from './triple-masking';
import * as Apis from './apis';
import { AbarMemo, Account } from './types';

interface ICommitmentStoreProps {
  fetchBaseURL?: string;
  dbName?: string;
  env?: string;
}

interface ICommitmentStore {
  dbName: string;
  initialized: boolean;
  fetching: boolean;
  fetchBaseURL: string;
}

type ZkAccountStore = {
  lastSid: number;
} & Account;

const DEFAULT_DB_NAME = 'commitment_store' as const;
const DEFAULT_ENV = 'qa02' as const;
const STORE_ABAR_MEMOS = 'abar_memos' as const;
const STORE_ACCOUNTS = 'accounts' as const;
const STORE_COMMITMENTS = 'commitments' as const;
const DEFAULT_FETCH_BASE_URL = 'https://dev-qa02.dev.findora.org' as const;

const objectStoresMeta = [
  {
    store: STORE_ABAR_MEMOS,
    storeConfig: { keyPath: 'sid' },
  },
  {
    store: STORE_ACCOUNTS,
    storeConfig: { keyPath: 'axfrPublicKey' },
  },
  {
    store: STORE_COMMITMENTS,
    storeConfig: { keyPath: 'sid' },
  }
];


class CommitmentStore implements ICommitmentStore {
  private db = {} as IDBDatabase;
  dbName = '';
  initialized = false;
  fetching = false;
  fetchBaseURL = '';

  init (props?: ICommitmentStoreProps) {
    const {
      dbName = DEFAULT_DB_NAME,
      env = DEFAULT_ENV,
      fetchBaseURL = DEFAULT_FETCH_BASE_URL,
    } = props || {};

    this.dbName = `${dbName}_${env}`;
    this.fetchBaseURL = fetchBaseURL;

    this.initialized = false;
    if (window.indexedDB) {
      const request = window.indexedDB.open(this.dbName);
      request.onsuccess = (event) => {
        const { result } = event.target as IDBOpenDBRequest;
        this.setDB(result);
        initLedger();
      }
      request.onupgradeneeded = (event) => {
        const { result } = event.target as IDBOpenDBRequest;
        for (const objectStore of objectStoresMeta) {
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

  addZkAccount (account: Account): Promise<boolean> {
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_ACCOUNTS, 'readwrite');
      const store = tx.objectStore(STORE_ACCOUNTS);
      tx.oncomplete = () => {
        resolve(true);
      }
      store.put({ ...account, lastSid: 0 });
    })
  }

  getZkAccount (publicKey: Account['axfrPublicKey']): Promise<ZkAccountStore> {
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_ACCOUNTS, 'readwrite');
      const store = tx.objectStore(STORE_ACCOUNTS);
      const storeRequest = store.get(publicKey);
      storeRequest.onsuccess = () => {
        console.log(storeRequest.result);
        resolve(storeRequest.result);
      };
    })
  }

  async syncZkAccount (axfrPublicKey: Account['axfrPublicKey']) {
    const zkAccount = await this.getZkAccount(axfrPublicKey);
    const abarMemos = await this.getAbarMemos(zkAccount.lastSid);
    console.log('abarMemos:', abarMemos);
    for (const abarMemoItem of abarMemos) {
      const { sid, memo } = abarMemoItem;
      const isDecrypted = await decryptAbarMemo(memo, zkAccount.axfrSecretKey);
      console.log(sid);
      console.log('isDecrypted:', isDecrypted);
      if (isDecrypted) {
        const commitment = await Apis.getCommitment(sid);
        this.addCommitment(commitment, sid, zkAccount.axfrPublicKey)
      }
    }
  }

  private getCurrentMasFromDB (): Promise<IDBValidKey> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(STORE_ABAR_MEMOS, 'readwrite');
      const store = tx.objectStore(STORE_ABAR_MEMOS);
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

  async fetchLatestAbarMemos () {
    if (!this.initialized) {
      console.log('db has not been initialized');
      return;
    }
    if (this.fetching) {
      console.log('already in fetching');
      return;
    }
    this.fetching = true;
    try {
      let mas = await Apis.getMAS();
      const currentMas = await this.getCurrentMasFromDB();
      if (currentMas >= mas) return;
      while (mas > currentMas) {
        // Api.Network.getAbarMemos
        const { next, memos } = await Apis.getAbarMemos(mas);
        this.addAbarMemos(memos);
        mas = next;
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.fetching = false;
    }
  }

  addAbarMemos (abarMemos: AbarMemo[]): Promise<boolean> {
    return new Promise(resolve => {
      const tx = this.db.transaction(STORE_ABAR_MEMOS, 'readwrite');
      const store = tx.objectStore(STORE_ABAR_MEMOS);
      tx.oncomplete = () => {
        console.log('saved');
        resolve(true);
      }
      for (const abarMemo of abarMemos) {
        store.put({ sid: abarMemo[0], memo: abarMemo });
      }
    })
  }

  getAbarMemos (startSid: number): Promise<{ sid: number, memo: AbarMemo }[]> {
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_ABAR_MEMOS, 'readonly');
      const store = tx.objectStore(STORE_ABAR_MEMOS);
      const storeRequest = store.getAll();
      storeRequest.onsuccess = () => {
        resolve(storeRequest.result);
      };
    })
  }

  addCommitment (commitment: string, sid: number, axfrPublicKey: Account['axfrPublicKey']): Promise<boolean> {
    return new Promise((resolve) => {
      const tx = this.db.transaction(STORE_COMMITMENTS, 'readwrite');
      const store = tx.objectStore(STORE_COMMITMENTS);
      tx.oncomplete = () => {
        resolve(true);
      }
      store.put({ commitment, sid, axfrPublicKey });
    })
  }
}

// account.add()
// account.delete()
// account.get('publicKey').sync()
// account.get('publicKey').isSync
const commitmentStore = new CommitmentStore();
declare global {
  interface Window { commitmentStore: any; }
}
window.commitmentStore = commitmentStore;
// commitmentStore.fetchAbarMemos();
export default commitmentStore;
