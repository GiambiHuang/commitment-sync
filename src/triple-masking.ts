import * as ledger from 'findora-wallet-wasm/web-lightweight';
import { AbarMemo, Account } from './types';

export const getLedger = async () => {
  try {
    return ledger;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const initLedger = async () => {
  try {
    const ledger: any = await getLedger();
    if (typeof ledger?.default === 'function') {
      await ledger?.default();
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const decryptAbarMemo = async (abarMemo: AbarMemo, axfrSecretKey: Account['axfrSecretKey']): Promise<boolean> => {
  const ledger = await getLedger();
  const [_, myMemoData] = abarMemo;
  const aXfrSecretKeyConverted = (ledger as any).axfr_keypair_from_string(axfrSecretKey);
  const abarOwnerMemo = (ledger as any).AxfrOwnerMemo.from_json(myMemoData);
  // let decryptedAbar: Uint8Array;
  try {
    (ledger as any).try_decrypt_axfr_memo(abarOwnerMemo, aXfrSecretKeyConverted);
    return true;
  } catch (error) {
    return false;
  }
}
