// import init from 'findora-wallet-wasm/web-lightweight';
import { initLedger, getLedger } from "../triple-masking";
import { AbarMemoSchema, AccountSchema } from "../types";

type SyncWorkerData = {
  account: AccountSchema;
  memos: AbarMemoSchema[];
}

self.onmessage = async function (e) {
  var window = globalThis;
  window.window = globalThis as any;
  const { account, memos } = e.data as SyncWorkerData;
  await initLedger();
  const ledger = await getLedger();
  console.log(ledger?.gen_anon_keys())
  // init();
  // const promiseResults = await Promise.all(
  //   memos.map(memoItem => decryptAbarMemo(memoItem.memo, account.axfrSecretKey))
  // );
  // console.log('promiseResults:', promiseResults);
  self.postMessage('hihihi');
}
