import { EnvConfig } from './config';
import { Wallet } from '../types/types';
interface ISyncStore {
    dbFullName: string;
    initialized: boolean;
    queryURL: string;
    envConfig: EnvConfig;
}
declare class SyncStore implements ISyncStore {
    private db;
    dbFullName: string;
    initialized: boolean;
    queryURL: string;
    envConfig: EnvConfig;
    blockNumber: number;
    constructor();
    setEnvConfig(newEnvConfig: EnvConfig): void;
    init(config?: EnvConfig): Promise<unknown>;
    private setDB;
    private fetchLatestMAS;
    private fetchAbarMemos;
    private addAbarMemos;
    private getOwnedAbars;
    private getCurrentMas;
    private getAbarMemos;
    checkSync(): Promise<void>;
    getCommitments(wallet: Wallet): Promise<string[]>;
    close(): void;
}
export declare const syncStore: SyncStore;
export {};
//# sourceMappingURL=index.d.ts.map