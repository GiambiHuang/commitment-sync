import { db } from './db';
import { Account } from './types';

export const add = (account: Account) => {
  return db.addAccount({ ...account, lastSid: 0 });
}

// export const get = () => {

// }

// export const remove = () => {

// }
