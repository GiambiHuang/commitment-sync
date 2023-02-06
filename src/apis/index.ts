import { db } from '../db';
import { AbarMemo } from '../types/types';

export const getMAS = (queryURL?: string): Promise<number> => {
  return new Promise((resolve => {
    fetch((queryURL || db.queryURL) + '/get_max_atxo_sid')
      .then(response => response.json())
      .then(resolve)
  }))
}

export const getAbarMemos = (from: number, queryURL?: string): Promise<{ next: number, memos: AbarMemo[] }> => {
  const next = from + 100;
  return new Promise((resolve => {
    fetch((queryURL || db.queryURL) + `/get_abar_memos?start=${from}&end=${next}`)
      .then(response => response.json())
      .then(memos => {
        resolve({ next: next + 1, memos });
      })
  }))
}

export const getCommitment = (sid: number, queryURL?: string): Promise<string> => {
  return new Promise((resolve => {
    fetch((queryURL || db.queryURL) + `/get_abar_commitment/${sid}`)
      .then(response => response.json())
      .then(commitment => {
        resolve(commitment);
      })
  }))
}
