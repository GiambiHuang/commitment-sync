import { db } from "./db";
import { decryptAbarMemo } from "./triple-masking";
import { AbarMemo, AbarMemoSchema, Account } from "./types";
import { fetchLatestMemos } from "./abarMemo";
import { getMAS } from "./apis";
import SyncWorker from 'web-worker:./web-worker/sync';

export const syncAll = async () => {
  await fetchLatestMemos();
  const accounts = await db.getAccounts();
  let currentMAS = await getMAS();
  let memos: AbarMemoSchema[] = [];
  while (currentMAS >= 0) {
    const fromIdx = Math.max(0, currentMAS - 99);
    const abarsMemos = await db.getAbarMemos(fromIdx, currentMAS);
    memos = memos.concat(abarsMemos);
    currentMAS = fromIdx - 1;
  }
  for (const account of accounts) {
    const syncWorker = new SyncWorker();
    syncWorker.postMessage({ account, memos });
  }
  // const abarMemos = await db.
  // for (const abarMemoItem of abarMemos) {
  //   const { sid, memo } = abarMemoItem;
  //   const isDecrypted = await decryptAbarMemo(memo, zkAccount);
  //   console.log(sid);
  //   console.log('isDecrypted:', isDecrypted);
  //   if (isDecrypted) {
  //     const commitment = await Apis.getCommitment(sid);
  //     this.addCommitment(commitment, sid, zkAccount.axfrPublicKey)
  //   }
  // }
}