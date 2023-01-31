import { decryptAbarMemo, initLedger } from '../triple-masking';
import { AccountSchema } from "../types";
import { getCommitment } from '../apis';
import { db } from '../db';
import { EnvConfig } from '../config';

type SyncWorkerData = {
  account: AccountSchema;
  startIdx: number;
  envConfig?: EnvConfig;
}

self.onmessage = async function (e) {
  var window = globalThis;
  window.window = globalThis as any;
  const { account, startIdx } = e.data as SyncWorkerData;
  await Promise.all([
    db.init(),
    initLedger()
  ]);
  const memos = await db.getAbarMemos(startIdx);
  const promiseResults = await Promise.all(
    memos.map(memoItem =>
      decryptAbarMemo(memoItem.memo, account.axfrSecretKey)
        .then(isDecrypted => isDecrypted ?
          getCommitment(memoItem.sid, db.queryURL) :
          Promise.resolve('')
        )
        .then(commitment => commitment ?
          ({
            axfrPublicKey: account.axfrPublicKey,
            sid: memoItem.sid,
            commitment,
          }) :
          undefined
        )
    )
  );
  db.close();
  self.postMessage({
    commitments: promiseResults.filter(Boolean),
    account,
  });
}
export default null as any;
