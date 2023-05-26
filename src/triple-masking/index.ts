import { AbarMemoSchema } from '../types/types';

let isInit = false;

type LedgerForWeb = typeof import('findora-wallet-wasm/bundler/wasm.js');

export const getLedger = async (): Promise<LedgerForWeb> => {
  const ledger = await import('findora-wallet-wasm/bundler/wasm.js');
  if (!isInit) {
    isInit = true;
    await ledger.init_noah();
  }
  return ledger;
};

export const decryptAbarMemos = async (abarMemos: AbarMemoSchema[], privateStr: string): Promise<AbarMemoSchema[]> => {
  const ledger = await getLedger();
  const ownedAbarMemos: AbarMemoSchema[] = [];
  for (const abarMemo of abarMemos) {
    const [_, myMemoData] = abarMemo.memo;
    const axfrSpendKey = ledger.create_keypair_from_secret(`"${privateStr}"`);
    const abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
    try {
      ledger.try_decrypt_axfr_memo(abarOwnerMemo, axfrSpendKey);
      ownedAbarMemos.push(abarMemo)
    } catch (_) {
    }
  }
  return ownedAbarMemos;
}
