const STORE_ABAR_MEMOS = 'abar_memos';
// const STORE_COMMITMENTS = 'commitments' as const;
export const DEFAULT_ENV_CONFIG = {
    dbName: 'commitment_sync',
    envName: 'testnet',
    envRpcUrl: 'https://prod-testnet.prod.findora.org',
    envWssRpcUrl: 'wss://prod-testnet.prod.findora.org:8546',
    stores: {
        abarMemos: {
            store: STORE_ABAR_MEMOS,
            storeConfig: { keyPath: 'sid' },
            index: ['publickey'],
        },
    },
};
//# sourceMappingURL=config.js.map