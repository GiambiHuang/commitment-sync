import { db } from "./db";
import { FetchWorkerResponse } from "./types";
// import { fetchLatestMemos } from "./abarMemo";

export const syncAll = async () => {
  const accounts = await db.getAccounts();

  // check if there is any the latest abar and save it to indexeddb
  const fetchWorker = new Worker(new URL('./web-worker/fetch.worker.ts', import.meta.url));
  const fetchResult: FetchWorkerResponse = await new Promise((resolve) => {
    fetchWorker.postMessage({});
    fetchWorker.onmessage = (e) => {
      fetchWorker.terminate();
      resolve(e.data)
    }
  })
  console.log('Message received fetch worker:', fetchResult);

  // if (fetchResult.success && fetchResult.mas) {
  //   for (const account of accounts) {
  //     if (account.lastSid >= fetchResult.mas) continue;
  //     console.log(account.axfrPublicKey);
  //     console.log(`account last sid: ${account.lastSid}`);
  //     // @ts-ignore
  //     // const worker = new Worker(new URL('./web-worker/sync.ts', import.meta.url));
  //     const sync = new SyncWorker();
  //     sync.postMessage({
  //       account,
  //       startIdx: account.lastSid,
  //     });
  //     sync.onmessage = (e) => {
  //       const { commitments, account } = e.data;
  //       sync.terminate();
  //       db.addCommitments(commitments);
  //       console.log('Message received from worker:', e.data);
  //     }
  //   }
  // }
}