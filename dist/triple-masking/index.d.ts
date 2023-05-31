import { AbarMemoSchema } from '../types/types';
type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');
export declare const getLedger: () => Promise<LedgerForWeb>;
export declare const decryptAbarMemos: (abarMemos: AbarMemoSchema[], privateStr: string) => Promise<AbarMemoSchema[]>;
export {};
//# sourceMappingURL=index.d.ts.map