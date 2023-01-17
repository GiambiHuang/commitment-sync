import { db } from './db';
import * as account from './account';
import * as abarMemo from './abarMemo';
import * as commitment from './commitment';

declare global {
  interface Window {
    db: any;
    abarMemo: any;
    account: any;
    commitment: any;
  }
}

window.db = db;
window.account = account;
window.abarMemo = abarMemo;
window.commitment = commitment;
