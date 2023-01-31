
## local testing
```bash
$ yarn
$ yarn build:dev
$ yarn start

## Available on http://127.0.0.1:8080
```

---

## Library Usage

### required dependency
```json
{
  "dependencies": {
    "findora-wallet-wasm": "https://github.com/FindoraNetwork/wasm-js-bindings.git#develop"
  }
}
```

```js
import { db } from 'commitment-sync';
// initial db first
db.init();

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
```js
import { commitment } from 'commitment-sync';
commitment.syncAll()
```