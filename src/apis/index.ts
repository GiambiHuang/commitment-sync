import { AbarMemo } from '../types/types';

export const getMAS = (queryURL?: string): Promise<number> => {
  return new Promise((resolve => {
    fetch(queryURL + '/get_max_atxo_sid')
      .then(response => response.json())
      .then(resolve)
  }))
}

export const getAbarMemos = (from: number, end: number, queryURL?: string): Promise<AbarMemo[]> => {
  return new Promise((resolve => {
    fetch(queryURL + `/get_abar_memos?start=${from}&end=${end}`)
      .then(response => response.json())
      .then(memos => {
        resolve(memos);
      })
  }))
}

export const getCommitment = (sid: number, queryURL?: string): Promise<string> => {
  return new Promise((resolve => {
    fetch(queryURL + `/get_abar_commitment/${sid}`)
      .then(response => response.json())
      .then(commitment => {
        resolve(commitment);
      })
  }))
}
