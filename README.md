<!-- 
# local testing
```bash
$ yarn
$ yarn build:dev
$ yarn start

## Available on http://127.0.0.1:8080
```

--- -->

# Production build

```bash
$ yarn
$ yarn build
```


---

### required dependency
```json
{
  "dependencies": {
    "findora-wallet-wasm": "https://github.com/FindoraNetwork/wasm-js-bindings.git#develop"
  }
}
```

### initial indexedDB
```ts
import { db } from 'commitment-sync';

// initial db first
const envConfig = {
  dbName: 'commitment_sync',
  envName: 'qa02',
  envBaseURL: 'https://dev-qa02.dev.findora.org',
  envQueryPort: '8667',
};

db.init(envConfig);
```

## account module
```js
import { account } from 'commitment-sync';
account.add({
  axfrPublicKey: string;
  axfrSecretKey: string;
})
```
---
## commitment module

- commitment.syncAll(WorkerScriptURL, WorkerScriptURL)
```js
import { commitment } from 'commitment-sync';

// sync commitments for all accounts
const result = await commitment.syncAll(
  new URL('commitment-sync/fetch-worker.js', import.meta.url),
  new URL('commitment-sync/sync-worker.js', import.meta.url),
)

// result:
// {
//   success: boolean,
//   message?: string, // error message
// }
```

- commitment.get()
```js
import { commitment } from 'commitment-sync';

// get account's commitments
const axfrPublicKey = '';
const commitments = await commitment.get(axfrPublicKey);

// commitments:CommitmentSchema[]
```