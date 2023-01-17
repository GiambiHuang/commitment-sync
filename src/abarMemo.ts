import { db } from './db';
import * as Apis from './apis';

export const fetchLatestMemos = async () => {
  try {
    let mas = await Apis.getMAS();
    const currentMas = await db.getCurrentMas();
    if (currentMas >= mas) return;
    while (mas > currentMas) {
      const { next, memos } = await Apis.getAbarMemos(mas);
      db.addAbarMemos(memos.map(memo => ({ sid: memo[0], memo })));
      mas = next;
    }
  } catch (error) {
    console.log(error);
  }
}

export const get = (filter?: { from: number, end?: number }) => {
  const { from = 0, end } = filter || {};
  return db.getAbarMemos(from, end);
}
