import { db } from "./db";
import { FetchWorkerResponse } from "./types";
// import { fetchLatestMemos } from "./abarMemo";

export const syncAll = async () => {
  const accounts = await db.getAccounts();

  // @ts-ignore
  const fetchWorker = new Worker(new URL('./web-worker/fetch.ts', import.meta.url));
  const fetchResult: FetchWorkerResponse = await new Promise((resolve) => {
    fetchWorker.postMessage({});
    fetchWorker.onmessage = (e) => {
      fetchWorker.terminate();
      resolve(e.data)
    }
  })
  console.log('Message received fetch worker:', fetchResult);

  if (fetchResult.success && fetchResult.mas) {
    for (const account of accounts) {
      if (account.lastSid >= fetchResult.mas) continue;
      console.log(account.axfrPublicKey);
      console.log(`account last sid: ${account.lastSid}`);
      // @ts-ignore
      const worker = new Worker(new URL('./web-worker/sync.ts', import.meta.url));
      worker.postMessage({
        account,
        startIdx: account.lastSid,
      });
      worker.onmessage = (e) => {
        const { commitments, account } = e.data;
        worker.terminate();
        db.addCommitments(commitments);
        console.log('Message received from worker:', e.data);
      }
    }
  }
}