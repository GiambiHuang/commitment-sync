export type EnvConfig = {
  dbName?: string;
  envName?: string;
  envBaseURL?: string;
  envQueryPort?: string;
  stores?: {
    accounts?: StoreMeta;
    abarMemos?: StoreMeta;
    commitments?: StoreMeta;
  }
}

export type StoreMeta = {
  store: string;
  storeConfig: any;
}

const STORE_ABAR_MEMOS = 'abar_memos' as const;
const STORE_ACCOUNTS = 'accounts' as const;
const STORE_COMMITMENTS = 'commitments' as const;

export const DEFAULT_ENV_CONFIG: EnvConfig = {
  dbName: 'commitment_sync',
  envName: 'qa02',
  envBaseURL: 'https://dev-qa02.dev.findora.org',
  envQueryPort: '8667',
  stores: {
    accounts: {
      store: STORE_ACCOUNTS,
      storeConfig: { keyPath: 'axfrPublicKey' },
    },
    abarMemos: {
      store: STORE_ABAR_MEMOS,
      storeConfig: { keyPath: 'sid' },
    },
    commitments: {
      store: STORE_COMMITMENTS,
      storeConfig: { keyPath: 'sid' },
    }
  },
};
