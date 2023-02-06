import { db } from '../db';
import { EnvConfig } from '../config';
import * as Apis from '../apis';

type FetchWorkerData = {
  envConfig?: EnvConfig;
}

self.onmessage = async function (e) {
  var window = globalThis;
  window.window = globalThis as any;
  const { envConfig } = e.data as FetchWorkerData;
  try {
    await db.init(envConfig);
    const mas = await Apis.getMAS();
    let currentMas = await db.getCurrentMas();
    console.log(`current mas: ${currentMas}, latest mas: ${mas}`);
    if (currentMas >= mas) {
      self.postMessage({ success: true, message: 'latest abar was already fetched', mas });
    };
    while (mas > currentMas) {
      const { next, memos } = await Apis.getAbarMemos((currentMas as number) + 1);
      await db.addAbarMemos(memos.map(memo => ({ sid: memo[0], memo })));
      currentMas = next;
    }
    self.postMessage({ success: true, mas });
  } catch (error) {
    self.postMessage({ success: false, message: (error as Error).message });
  } finally {
    db.close();
  }
}

export {};
