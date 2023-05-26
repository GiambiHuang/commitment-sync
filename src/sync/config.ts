export type EnvConfig = {
  dbName?: string;
  envName?: string;
  envRpcUrl: string;
  envWssRpcUrl?: string;
  stores?: {
    abarMemos?: StoreMeta;
    // commitments?: StoreMeta;
  }
}

export type StoreMeta = {
  store: string;
  storeConfig: any;
  index?: string[];
}

const STORE_ABAR_MEMOS = 'abar_memos' as const;
// const STORE_COMMITMENTS = 'commitments' as const;

export const DEFAULT_ENV_CONFIG: EnvConfig = {
  dbName: 'commitment_sync',
  envName: 'testnet',
  envRpcUrl: 'https://prod-testnet.prod.findora.org:8667',
  envWssRpcUrl: 'wss://prod-testnet.prod.findora.org:8546',
  stores: {
    abarMemos: {
      store: STORE_ABAR_MEMOS,
      storeConfig: { keyPath: 'sid' },
      index: ['publickey'],
    },
  },
};
