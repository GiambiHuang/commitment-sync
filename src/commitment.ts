import { db } from "./db";
import { FetchWorkerResponse, Account } from "./types";

export const syncAll = async (fetchWorkerScript?: URL, syncWorkerScript?: URL) => {
  return new Promise(async (resolve, reject) => {
    // check if there is any the latest abar and save it to indexeddb
    const fetchWorker = new Worker(
      fetchWorkerScript || new URL('./web-worker/fetch.worker.ts', import.meta.url)
      // new URL('commitment-sync/fetch-worker.js', import.meta.url)
      // new URL('./web-worker/fetch.worker.ts', import.meta.url)
    );
    const fetchResult: FetchWorkerResponse = await new Promise((resolve) => {
      fetchWorker.postMessage({
        config: db.envConfig,
      });
      fetchWorker.onmessage = (e) => {
        fetchWorker.terminate();
        resolve(e.data)
      }
    })
    console.log('Message received fetch worker:', fetchResult);

    if (fetchResult.success && fetchResult.mas) {
      const syncWorker = new Worker(
        syncWorkerScript || new URL('./web-worker/sync.worker.ts', import.meta.url)
      );
      syncWorker.postMessage({
        mas: fetchResult.mas,
        config: db.envConfig,
        // startIdx: account.lastSid,
      });
      syncWorker.onmessage = (e) => {
        syncWorker.terminate();
        console.log('Message received from worker:', e.data);
        resolve(e.data);
      }
    } else {
      reject();
    }
  });
}

export const get = async (axfrPublicKey: Account['axfrPublicKey']) => {
  return db.getCommitments(axfrPublicKey);
}
