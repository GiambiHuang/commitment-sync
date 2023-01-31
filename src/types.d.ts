declare var __IN_LOCAL__: boolean;

export type Account = {
  axfrPublicKey: string;
  axfrSecretKey: string;
}

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
