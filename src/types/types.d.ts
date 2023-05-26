export type AbarMemo = [
  number,
  {
    ctext: number[];
    point: string;
  },
]

export type AccountSchema = Account &{
  lastSid: number;
}

export type AbarMemoSchema = {
  sid: number;
  memo: AbarMemo;
  publickey: string;
  commitment: string;
}

export type CommitmentSchema = {
  commitment: string;
  sid: number;
  axfrPublicKey: Account['axfrPublicKey'];
}

export type FetchWorkerResponse = {
  success: boolean;
  message?: string;
  mas?: number;
}

export type Wallet = {
  privateStr: string;
  publickey: string;
  // address: string;
  // keypair: string;
}
