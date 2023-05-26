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
    "findora-wallet-wasm": "https://github.com/FindoraNetwork/wasm-js-bindings.git#0.4.0-release"
  }
}
```

### initial indexedDB
```ts
import { syncStore } from 'commitment-sync';

// initial db first
const envConfig = {
  dbName: 'commitment_sync',
  envName: 'testnet',
  envRpcUrl: 'https://prod-testnet.prod.findora.org:8667',
};

syncStore.init(envConfig);
```

- ## get commitments by wallet
  - **syncStore.getCommitments(wallet): Promise<string[]>**
    ```js
    import { syncStore } from 'commitment-sync';
    
    const wallet = {
      privateStr: '',
      publickey: '',
    };

    syncStore
      .getCommitments(wallet)
      .then((commitments: string[]) => {})
    ```

<!-- - ## commitment module
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

  - commitment.get(axfrPublicKey: string)
    ```js
    import { commitment } from 'commitment-sync';

    // get account's commitments
    const axfrPublicKey = '';
    const commitments = await commitment.get(axfrPublicKey);

    // commitments:CommitmentSchema[]
    ``` -->