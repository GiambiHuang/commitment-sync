import { db } from './db';
import { AbarMemo } from './types';

export const getMAS = (): Promise<number> => {
  return new Promise((resolve => {
    fetch(db.queryURL + '/get_max_atxo_sid')
      .then(response => response.json())
      .then(resolve)
  }))
}

export const getAbarMemos = (from: number): Promise<{ next: number, memos: AbarMemo[] }> => {
  const to = Math.max(0, from - 100);
  return new Promise((resolve => {
    fetch(db.queryURL + `/get_abar_memos?start=${to}&end=${from}`)
      .then(response => response.json())
      .then(memos => {
        resolve({ next: to > 0 ? to - 1 : -1, memos });
      })
  }))
}

export const getCommitment = (sid: number): Promise<string> => {
  return new Promise((resolve => {
    fetch(db.queryURL + `/get_abar_commitment/${sid}`)
      .then(response => response.json())
      .then(commitment => {
        resolve(commitment);
      })
  }))
}
