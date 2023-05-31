export type EnvConfig = {
    dbName?: string;
    envName?: string;
    envRpcUrl: string;
    envWssRpcUrl?: string;
    stores?: {
        abarMemos?: StoreMeta;
    };
};
export type StoreMeta = {
    store: string;
    storeConfig: any;
    index?: string[];
};
export declare const DEFAULT_ENV_CONFIG: EnvConfig;
//# sourceMappingURL=config.d.ts.map