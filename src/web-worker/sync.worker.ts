// import { decryptAbarMemo } from '../triple-masking';
import { getCommitment } from '../apis';
import { syncStore } from '../sync';
import { EnvConfig } from '../sync/config';
import { CommitmentSchema } from '../types/types';

type SyncWorkerData = {
  mas: number
  config?: EnvConfig;
}

self.onmessage = async function (e) {
  // var window = globalThis;
  // window.window = globalThis as any;
  // const { mas, config } = e.data as SyncWorkerData;
  // try {
  //   await Promise.all([
  //     db.init(config),
  //     initLedger()
  //   ]);
  //   const accounts = await db.getAccounts();
  //   for (const account of accounts) {
  //     if (account.lastSid >= mas) continue;
  //     console.log(account.axfrPublicKey);
  //     console.log(`account last sid: ${account.lastSid}`);
  //     const memos = await db.getAbarMemos(account.lastSid);
  //     const promiseResults = await Promise.all(
  //       memos.map(memoItem =>
  //         decryptAbarMemo(memoItem.memo, account.axfrSecretKey)
  //           .then(isDecrypted => isDecrypted ?
  //             getCommitment(memoItem.sid, db.queryURL) :
  //             Promise.resolve('')
  //           )
  //           .then(commitment => commitment ?
  //             ({
  //               axfrPublicKey: account.axfrPublicKey,
  //               sid: memoItem.sid,
  //               commitment,
  //             }) :
  //             undefined
  //           )
  //       )
  //     );
  //     const commitments: CommitmentSchema[] = [];
  //     for (const result of promiseResults) {
  //       if (result) commitments.push(result);
  //     }
  //     // const commitments = promiseResults.filter(Boolean);
  //     db.addCommitments(commitments);
  //   }
  //   self.postMessage({ success: true, mas });
  // } catch (error) {
  //   self.postMessage({ success: false, message: (error as Error).message });
  // } finally {
  //   db.close();
  // }
}

export default null as any;
