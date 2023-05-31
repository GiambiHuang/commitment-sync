let isInit = false;
export const getLedger = async () => {
    const ledger = await import('findora-wallet-wasm/bundler/wasm.js');
    if (!isInit) {
        isInit = true;
        await ledger.init_noah();
    }
    return ledger;
};
export const decryptAbarMemos = async (abarMemos, privateStr) => {
    const ledger = await getLedger();
    const ownedAbarMemos = [];
    for (const abarMemo of abarMemos) {
        const [_, myMemoData] = abarMemo.memo;
        const axfrSpendKey = ledger.create_keypair_from_secret(`"${privateStr}"`);
        const abarOwnerMemo = ledger.AxfrOwnerMemo.from_json(myMemoData);
        try {
            ledger.try_decrypt_axfr_memo(abarOwnerMemo, axfrSpendKey);
            ownedAbarMemos.push(abarMemo);
        }
        catch (_) {
        }
    }
    return ownedAbarMemos;
};
//# sourceMappingURL=index.js.map