(function () {
    'use strict';

    let wasm;

    let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

    cachedTextDecoder.decode();

    let cachegetUint8Memory0 = null;
    function getUint8Memory0() {
        if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
        }
        return cachegetUint8Memory0;
    }

    function getStringFromWasm0(ptr, len) {
        return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
    }

    const heap = new Array(32).fill(undefined);

    heap.push(undefined, null, true, false);

    let heap_next = heap.length;

    function addHeapObject(obj) {
        if (heap_next === heap.length) heap.push(heap.length + 1);
        const idx = heap_next;
        heap_next = heap[idx];

        heap[idx] = obj;
        return idx;
    }

    function getObject(idx) { return heap[idx]; }

    function dropObject(idx) {
        if (idx < 36) return;
        heap[idx] = heap_next;
        heap_next = idx;
    }

    function takeObject(idx) {
        const ret = getObject(idx);
        dropObject(idx);
        return ret;
    }

    let WASM_VECTOR_LEN = 0;

    let cachedTextEncoder = new TextEncoder('utf-8');

    const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
        ? function (arg, view) {
        return cachedTextEncoder.encodeInto(arg, view);
    }
        : function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    });

    function passStringToWasm0(arg, malloc, realloc) {

        if (realloc === undefined) {
            const buf = cachedTextEncoder.encode(arg);
            const ptr = malloc(buf.length);
            getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
            WASM_VECTOR_LEN = buf.length;
            return ptr;
        }

        let len = arg.length;
        let ptr = malloc(len);

        const mem = getUint8Memory0();

        let offset = 0;

        for (; offset < len; offset++) {
            const code = arg.charCodeAt(offset);
            if (code > 0x7F) break;
            mem[ptr + offset] = code;
        }

        if (offset !== len) {
            if (offset !== 0) {
                arg = arg.slice(offset);
            }
            ptr = realloc(ptr, len, len = offset + arg.length * 3);
            const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
            const ret = encodeString(arg, view);

            offset += ret.written;
        }

        WASM_VECTOR_LEN = offset;
        return ptr;
    }

    let cachegetInt32Memory0 = null;
    function getInt32Memory0() {
        if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
            cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
        }
        return cachegetInt32Memory0;
    }

    function debugString(val) {
        // primitive types
        const type = typeof val;
        if (type == 'number' || type == 'boolean' || val == null) {
            return  `${val}`;
        }
        if (type == 'string') {
            return `"${val}"`;
        }
        if (type == 'symbol') {
            const description = val.description;
            if (description == null) {
                return 'Symbol';
            } else {
                return `Symbol(${description})`;
            }
        }
        if (type == 'function') {
            const name = val.name;
            if (typeof name == 'string' && name.length > 0) {
                return `Function(${name})`;
            } else {
                return 'Function';
            }
        }
        // objects
        if (Array.isArray(val)) {
            const length = val.length;
            let debug = '[';
            if (length > 0) {
                debug += debugString(val[0]);
            }
            for(let i = 1; i < length; i++) {
                debug += ', ' + debugString(val[i]);
            }
            debug += ']';
            return debug;
        }
        // Test for built-in
        const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
        let className;
        if (builtInMatches.length > 1) {
            className = builtInMatches[1];
        } else {
            // Failed to match the standard '[object ClassName]'
            return toString.call(val);
        }
        if (className == 'Object') {
            // we're a user defined class or Object
            // JSON.stringify avoids problems with cycles, and is generally much
            // easier than looping through ownProperties of `val`.
            try {
                return 'Object(' + JSON.stringify(val) + ')';
            } catch (_) {
                return 'Object';
            }
        }
        // errors
        if (val instanceof Error) {
            return `${val.name}: ${val.message}\n${val.stack}`;
        }
        // TODO we could test for more things here, like `Set`s and `Map`s.
        return className;
    }
    /**
    * Returns the git commit hash and commit date of the commit this library was built against.
    * @returns {string}
    */
    function build_id() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.build_id(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Generates random Base64 encoded asset type as a Base64 string. Used in asset definitions.
    * @see {@link
    * module:Findora-Wasm~TransactionBuilder#add_operation_create_asset|add_operation_create_asset}
    * for instructions on how to define an asset with a new
    * asset type
    * @returns {string}
    */
    function random_asset_type() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.random_asset_type(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Creates a new asset code with prefixing-hashing the original code to query the ledger.
    * @param {string} asset_code_string
    * @returns {string}
    */
    function hash_asset_code(asset_code_string) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(asset_code_string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.hash_asset_code(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    let stack_pointer = 32;

    function addBorrowedObject(obj) {
        if (stack_pointer == 1) throw new Error('out of js stack');
        heap[--stack_pointer] = obj;
        return stack_pointer;
    }
    /**
    * Generates asset type as a Base64 string from a JSON-serialized JavaScript value.
    * @param {any} val
    * @returns {string}
    */
    function asset_type_from_jsvalue(val) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.asset_type_from_jsvalue(retptr, addBorrowedObject(val));
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            heap[stack_pointer++] = undefined;
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Given a serialized state commitment and transaction, returns true if the transaction correctly
    * hashes up to the state commitment and false otherwise.
    * @param {string} state_commitment - String representing the state commitment.
    * @param {string} authenticated_txn - String representing the transaction.
    * @see {@link module:Network~Network#getTxn|Network.getTxn} for instructions on fetching a transaction from the ledger.
    * @see {@link module:Network~Network#getStateCommitment|Network.getStateCommitment}
    * for instructions on fetching a ledger state commitment.
    * @throws Will throw an error if the state commitment or the transaction fails to deserialize.
    * @param {string} state_commitment
    * @param {string} authenticated_txn
    * @returns {boolean}
    */
    function verify_authenticated_txn(state_commitment, authenticated_txn) {
        var ptr0 = passStringToWasm0(state_commitment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(authenticated_txn, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.verify_authenticated_txn(ptr0, len0, ptr1, len1);
        return ret !== 0;
    }

    /**
    * ...
    * @returns {XfrPublicKey}
    */
    function get_null_pk() {
        var ret = wasm.get_null_pk();
        return XfrPublicKey.__wrap(ret);
    }

    const u32CvtShim = new Uint32Array(2);

    const uint64CvtShim = new BigUint64Array(u32CvtShim.buffer);

    function _assertClass(instance, klass) {
        if (!(instance instanceof klass)) {
            throw new Error(`expected instance of ${klass.name}`);
        }
        return instance.ptr;
    }

    function isLikeNone(x) {
        return x === undefined || x === null;
    }

    let cachegetUint32Memory0 = null;
    function getUint32Memory0() {
        if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
            cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
        }
        return cachegetUint32Memory0;
    }

    function getArrayJsValueFromWasm0(ptr, len) {
        const mem = getUint32Memory0();
        const slice = mem.subarray(ptr / 4, ptr / 4 + len);
        const result = [];
        for (let i = 0; i < slice.length; i++) {
            result.push(takeObject(slice[i]));
        }
        return result;
    }
    /**
    * Build transfer from account balance to utxo tx.
    * @param {XfrPublicKey} recipient - UTXO Asset receiver.
    * @param {u64} amount - Transfer amount.
    * @param {string} sk - Ethereum wallet private key.
    * @param {u64} nonce - Transaction nonce for sender.
    * @param {XfrPublicKey} recipient
    * @param {BigInt} amount
    * @param {string} sk
    * @param {BigInt} nonce
    * @returns {string}
    */
    function transfer_to_utxo_from_account(recipient, amount, sk, nonce) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(recipient, XfrPublicKey);
            var ptr0 = recipient.ptr;
            recipient.ptr = 0;
            uint64CvtShim[0] = amount;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            var ptr2 = passStringToWasm0(sk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len2 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = nonce;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            wasm.transfer_to_utxo_from_account(retptr, ptr0, low1, high1, ptr2, len2, low3, high3);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Recover ecdsa private key from mnemonic.
    * @param {string} phrase
    * @param {string} password
    * @returns {string}
    */
    function recover_sk_from_mnemonic(phrase, password) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.recover_sk_from_mnemonic(retptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Recover ethereum address from ecdsa private key, eg. 0x73c71...
    * @param {string} sk
    * @returns {string}
    */
    function recover_address_from_sk(sk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(sk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.recover_address_from_sk(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Serialize ethereum address used to abci query nonce.
    * @param {string} address
    * @returns {string}
    */
    function get_serialized_address(address) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.get_serialized_address(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Generate new anonymous keys
    * @returns {AnonKeys}
    */
    function gen_anon_keys() {
        var ret = wasm.gen_anon_keys();
        return AnonKeys.__wrap(ret);
    }

    /**
    * Get balance for an Anonymous Blind Asset Record
    * @param {AnonAssetRecord} abar - ABAR for which balance needs to be queried
    * @param {AxfrOwnerMemo} memo - memo corresponding to the abar
    * @param keypair {AXfrKeyPair} - AXfrKeyPair of the ABAR owner
    * @param MTLeafInfo {mt_leaf_info} - the Merkle proof of the ABAR from commitment tree
    * @throws Will throw an error if abar fails to open
    * @param {AnonAssetRecord} abar
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} keypair
    * @param {MTLeafInfo} mt_leaf_info
    * @returns {BigInt}
    */
    function get_anon_balance(abar, memo, keypair, mt_leaf_info) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(abar, AnonAssetRecord);
            var ptr0 = abar.ptr;
            abar.ptr = 0;
            _assertClass(memo, AxfrOwnerMemo);
            var ptr1 = memo.ptr;
            memo.ptr = 0;
            _assertClass(keypair, AXfrKeyPair);
            var ptr2 = keypair.ptr;
            keypair.ptr = 0;
            _assertClass(mt_leaf_info, MTLeafInfo);
            var ptr3 = mt_leaf_info.ptr;
            mt_leaf_info.ptr = 0;
            wasm.get_anon_balance(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n4 = uint64CvtShim[0];
            return n4;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * Get OABAR (Open ABAR) using the ABAR, OwnerMemo and MTLeafInfo
    * @param {AnonAssetRecord} abar - ABAR which needs to be opened
    * @param {AxfrOwnerMemo} memo - memo corresponding to the abar
    * @param keypair {AXfrKeyPair} - AXfrKeyPair of the ABAR owner
    * @param MTLeafInfo {mt_leaf_info} - the Merkle proof of the ABAR from commitment tree
    * @throws Will throw an error if abar fails to open
    * @param {AnonAssetRecord} abar
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} keypair
    * @param {MTLeafInfo} mt_leaf_info
    * @returns {any}
    */
    function get_open_abar(abar, memo, keypair, mt_leaf_info) {
        _assertClass(abar, AnonAssetRecord);
        var ptr0 = abar.ptr;
        abar.ptr = 0;
        _assertClass(memo, AxfrOwnerMemo);
        var ptr1 = memo.ptr;
        memo.ptr = 0;
        _assertClass(keypair, AXfrKeyPair);
        var ptr2 = keypair.ptr;
        keypair.ptr = 0;
        _assertClass(mt_leaf_info, MTLeafInfo);
        var ptr3 = mt_leaf_info.ptr;
        mt_leaf_info.ptr = 0;
        var ret = wasm.get_open_abar(ptr0, ptr1, ptr2, ptr3);
        return takeObject(ret);
    }

    /**
    * Generate nullifier hash using ABAR, OwnerMemo and MTLeafInfo
    * @param {AnonAssetRecord} abar - ABAR for which balance needs to be queried
    * @param {AxfrOwnerMemo} memo - memo corresponding to the abar
    * @param keypair {AXfrKeyPair} - AXfrKeyPair of the ABAR owner
    * @param MTLeafInfo {mt_leaf_info} - the Merkle proof of the ABAR from commitment tree
    * @throws Will throw an error if abar fails to open
    * @param {AnonAssetRecord} abar
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} keypair
    * @param {MTLeafInfo} mt_leaf_info
    * @returns {string}
    */
    function gen_nullifier_hash(abar, memo, keypair, mt_leaf_info) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(abar, AnonAssetRecord);
            var ptr0 = abar.ptr;
            abar.ptr = 0;
            _assertClass(memo, AxfrOwnerMemo);
            var ptr1 = memo.ptr;
            memo.ptr = 0;
            _assertClass(keypair, AXfrKeyPair);
            var ptr2 = keypair.ptr;
            keypair.ptr = 0;
            _assertClass(mt_leaf_info, MTLeafInfo);
            var ptr3 = mt_leaf_info.ptr;
            mt_leaf_info.ptr = 0;
            wasm.gen_nullifier_hash(retptr, ptr0, ptr1, ptr2, ptr3);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Returns a JavaScript object containing decrypted owner record information,
    * where `amount` is the decrypted asset amount, and `asset_type` is the decrypted asset type code.
    *
    * @param {ClientAssetRecord} record - Owner record.
    * @param {OwnerMemo} owner_memo - Owner memo of the associated record.
    * @param {XfrKeyPair} keypair - Keypair of asset owner.
    * @see {@link module:Findora-Wasm~ClientAssetRecord#from_json_record|ClientAssetRecord.from_json_record} for information about how to construct an asset record object
    * from a JSON result returned from the ledger server.
    * @param {ClientAssetRecord} record
    * @param {OwnerMemo | undefined} owner_memo
    * @param {XfrKeyPair} keypair
    * @returns {any}
    */
    function open_client_asset_record(record, owner_memo, keypair) {
        _assertClass(record, ClientAssetRecord);
        let ptr0 = 0;
        if (!isLikeNone(owner_memo)) {
            _assertClass(owner_memo, OwnerMemo);
            ptr0 = owner_memo.ptr;
            owner_memo.ptr = 0;
        }
        _assertClass(keypair, XfrKeyPair);
        var ret = wasm.open_client_asset_record(record.ptr, ptr0, keypair.ptr);
        return takeObject(ret);
    }

    /**
    * Extracts the public key as a string from a transfer key pair.
    * @param {XfrKeyPair} key_pair
    * @returns {string}
    */
    function get_pub_key_str(key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key_pair, XfrKeyPair);
            wasm.get_pub_key_str(retptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Extracts the private key as a string from a transfer key pair.
    * @param {XfrKeyPair} key_pair
    * @returns {string}
    */
    function get_priv_key_str(key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key_pair, XfrKeyPair);
            wasm.get_priv_key_str(retptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} phrase
    * @param {number} num
    * @returns {string}
    */
    function get_priv_key_hex_str_by_mnemonic(phrase, num) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.get_priv_key_hex_str_by_mnemonic(retptr, ptr0, len0, num);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} hex_priv_key
    * @returns {XfrKeyPair}
    */
    function get_keypair_by_pri_key(hex_priv_key) {
        var ptr0 = passStringToWasm0(hex_priv_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.get_keypair_by_pri_key(ptr0, len0);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * @param {string} hex_priv_key
    * @returns {string}
    */
    function get_pub_key_hex_str_by_priv_key(hex_priv_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(hex_priv_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.get_pub_key_hex_str_by_priv_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} hex_pub_key
    * @returns {string}
    */
    function get_address_by_public_key(hex_pub_key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(hex_pub_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.get_address_by_public_key(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Extracts the public key as a string from a transfer key pair.
    * @param {XfrKeyPair} key_pair
    * @returns {string}
    */
    function get_pub_key_str_old(key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key_pair, XfrKeyPair);
            wasm.get_pub_key_str_old(retptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Extracts the private key as a string from a transfer key pair.
    * @param {XfrKeyPair} key_pair
    * @returns {string}
    */
    function get_priv_key_str_old(key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key_pair, XfrKeyPair);
            wasm.get_priv_key_str_old(retptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Creates a new transfer key pair.
    * @returns {XfrKeyPair}
    */
    function new_keypair() {
        var ret = wasm.new_keypair();
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Creates a new transfer key pair.
    * @returns {XfrKeyPair}
    */
    function new_keypair_old() {
        var ret = wasm.new_keypair_old();
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Generates a new keypair deterministically from a seed string and an optional name.
    * @param {string} seed_str
    * @param {string | undefined} name
    * @returns {XfrKeyPair}
    */
    function new_keypair_from_seed(seed_str, name) {
        var ptr0 = passStringToWasm0(seed_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(name) ? 0 : passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ret = wasm.new_keypair_from_seed(ptr0, len0, ptr1, len1);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Returns base64 encoded representation of an XfrPublicKey.
    * @param {XfrPublicKey} key
    * @returns {string}
    */
    function public_key_to_base64(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key, XfrPublicKey);
            wasm.public_key_to_base64(retptr, key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Converts a base64 encoded public key string to a public key.
    * @param {string} pk
    * @returns {XfrPublicKey}
    */
    function public_key_from_base64(pk) {
        var ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.public_key_from_base64(ptr0, len0);
        return XfrPublicKey.__wrap(ret);
    }

    /**
    * Expresses a transfer key pair as a hex-encoded string.
    * To decode the string, use `keypair_from_str` function.
    * @param {XfrKeyPair} key_pair
    * @returns {string}
    */
    function keypair_to_str(key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key_pair, XfrKeyPair);
            wasm.keypair_to_str(retptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Constructs a transfer key pair from a hex-encoded string.
    * The encode a key pair, use `keypair_to_str` function.
    * @param {string} str
    * @returns {XfrKeyPair}
    */
    function keypair_from_str(str) {
        var ptr0 = passStringToWasm0(str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.keypair_from_str(ptr0, len0);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Generates a new credential issuer key.
    * @param {JsValue} attributes - Array of attribute types of the form `[{name: "credit_score",
    * size: 3}]`. The size refers to byte-size of the credential. In this case, the "credit_score"
    * attribute is represented as a 3 byte string "760". `attributes` is the list of attribute types
    * that the issuer can sign off on.
    * @param {any} attributes
    * @returns {CredentialIssuerKeyPair}
    */
    function wasm_credential_issuer_key_gen(attributes) {
        var ret = wasm.wasm_credential_issuer_key_gen(addHeapObject(attributes));
        return CredentialIssuerKeyPair.__wrap(ret);
    }

    /**
    * Verifies a credential commitment. Used to confirm that a credential is tied to a ledger
    * address.
    * @param {CredIssuerPublicKey} issuer_pub_key - The credential issuer that has attested to the
    * credentials that have been committed to.
    * @param {CredentialCommitment} Credential commitment
    * @param {CredPoK} Proof of knowledge of the underlying commitment
    * @param {XfrPublicKey} Ledger address linked to this credential commitment.
    * @throws Will throw an error during verification failure (i.e. the supplied ledger address is
    * incorrect, the commitment is tied to a different credential issuer, or the proof of knowledge is
    * invalid, etc.)
    * @param {CredIssuerPublicKey} issuer_pub_key
    * @param {CredentialCommitment} commitment
    * @param {CredentialPoK} pok
    * @param {XfrPublicKey} xfr_pk
    */
    function wasm_credential_verify_commitment(issuer_pub_key, commitment, pok, xfr_pk) {
        _assertClass(issuer_pub_key, CredIssuerPublicKey);
        _assertClass(commitment, CredentialCommitment);
        _assertClass(pok, CredentialPoK);
        _assertClass(xfr_pk, XfrPublicKey);
        wasm.wasm_credential_verify_commitment(issuer_pub_key.ptr, commitment.ptr, pok.ptr, xfr_pk.ptr);
    }

    /**
    * Generates a new reveal proof from a credential commitment key.
    * @param {CredUserSecretKey} user_secret_key - Secret key of the credential user who owns
    * the credentials.
    * @param {Credential} credential - Credential whose attributes will be revealed.
    * @param {JsValue} reveal_fields - Array of strings representing attribute fields to reveal.
    * @throws Will throw an error if a reveal proof cannot be generated from the credential
    * or ```reveal_fields``` fails to deserialize.
    * @param {CredUserSecretKey} user_secret_key
    * @param {Credential} credential
    * @param {CredentialCommitmentKey} key
    * @param {any} reveal_fields
    * @returns {CredentialPoK}
    */
    function wasm_credential_open_commitment(user_secret_key, credential, key, reveal_fields) {
        _assertClass(user_secret_key, CredUserSecretKey);
        _assertClass(credential, Credential);
        _assertClass(key, CredentialCommitmentKey);
        var ret = wasm.wasm_credential_open_commitment(user_secret_key.ptr, credential.ptr, key.ptr, addHeapObject(reveal_fields));
        return CredentialPoK.__wrap(ret);
    }

    /**
    * Generates a new credential user key.
    * @param {CredIssuerPublicKey} issuer_pub_key - The credential issuer that can sign off on this
    * user's attributes.
    * @param {CredIssuerPublicKey} issuer_pub_key
    * @returns {CredentialUserKeyPair}
    */
    function wasm_credential_user_key_gen(issuer_pub_key) {
        _assertClass(issuer_pub_key, CredIssuerPublicKey);
        var ret = wasm.wasm_credential_user_key_gen(issuer_pub_key.ptr);
        return CredentialUserKeyPair.__wrap(ret);
    }

    /**
    * Generates a signature on user attributes that can be used to create a credential.
    * @param {CredIssuerSecretKey} issuer_secret_key - Secret key of credential issuer.
    * @param {CredUserPublicKey} user_public_key - Public key of credential user.
    * @param {JsValue} attributes - Array of attribute assignments of the form `[{name: "credit_score",
    * val: "760"}]`.
    * @throws Will throw an error if the signature cannot be generated.
    * @param {CredIssuerSecretKey} issuer_secret_key
    * @param {CredUserPublicKey} user_public_key
    * @param {any} attributes
    * @returns {CredentialSignature}
    */
    function wasm_credential_sign(issuer_secret_key, user_public_key, attributes) {
        _assertClass(issuer_secret_key, CredIssuerSecretKey);
        _assertClass(user_public_key, CredUserPublicKey);
        var ret = wasm.wasm_credential_sign(issuer_secret_key.ptr, user_public_key.ptr, addHeapObject(attributes));
        return CredentialSignature.__wrap(ret);
    }

    /**
    * Generates a signature on user attributes that can be used to create a credential.
    * @param {CredIssuerPublicKey} issuer_public_key - Public key of credential issuer.
    * @param {CredentialSignature} signature - Credential issuer signature on attributes.
    * @param {JsValue} attributes - Array of attribute assignments of the form `[{name: "credit_score",
    * val: "760"}]'.
    * @param {CredIssuerPublicKey} issuer_public_key
    * @param {CredentialSignature} signature
    * @param {any} attributes
    * @returns {Credential}
    */
    function create_credential(issuer_public_key, signature, attributes) {
        try {
            _assertClass(issuer_public_key, CredIssuerPublicKey);
            _assertClass(signature, CredentialSignature);
            var ret = wasm.create_credential(issuer_public_key.ptr, signature.ptr, addBorrowedObject(attributes));
            return Credential.__wrap(ret);
        } finally {
            heap[stack_pointer++] = undefined;
        }
    }

    /**
    * Generates a credential commitment. A credential commitment can be used to selectively reveal
    * attribute assignments.
    * @param {CredUserSecretKey} user_secret_key - Secret key of credential user.
    * @param {XfrPublicKey} user_public_key - Ledger signing key to link this credential to.
    * @param {Credential} credential - Credential object.
    * @param {CredUserSecretKey} user_secret_key
    * @param {XfrPublicKey} user_public_key
    * @param {Credential} credential
    * @returns {CredentialCommitmentData}
    */
    function wasm_credential_commit(user_secret_key, user_public_key, credential) {
        _assertClass(user_secret_key, CredUserSecretKey);
        _assertClass(user_public_key, XfrPublicKey);
        _assertClass(credential, Credential);
        var ret = wasm.wasm_credential_commit(user_secret_key.ptr, user_public_key.ptr, credential.ptr);
        return CredentialCommitmentData.__wrap(ret);
    }

    /**
    * Selectively reveals attributes committed to in a credential commitment
    * @param {CredUserSecretKey} user_sk - Secret key of credential user.
    * @param {Credential} credential - Credential object.
    * @param {JsValue} reveal_fields - Array of string names representing credentials to reveal (i.e.
    * `["credit_score"]`).
    * @param {CredUserSecretKey} user_sk
    * @param {Credential} credential
    * @param {any} reveal_fields
    * @returns {CredentialRevealSig}
    */
    function wasm_credential_reveal(user_sk, credential, reveal_fields) {
        _assertClass(user_sk, CredUserSecretKey);
        _assertClass(credential, Credential);
        var ret = wasm.wasm_credential_reveal(user_sk.ptr, credential.ptr, addHeapObject(reveal_fields));
        return CredentialRevealSig.__wrap(ret);
    }

    /**
    * Verifies revealed attributes from a commitment.
    * @param {CredIssuerPublicKey} issuer_pub_key - Public key of credential issuer.
    * @param {JsValue} attributes - Array of attribute assignments to check of the form `[{name: "credit_score",
    * val: "760"}]`.
    * @param {CredentialCommitment} commitment - Commitment to the credential.
    * @param {CredentialPoK} pok - Proof that the credential commitment is valid and commits
    * to the attribute values being revealed.
    * @param {CredIssuerPublicKey} issuer_pub_key
    * @param {any} attributes
    * @param {CredentialCommitment} commitment
    * @param {CredentialPoK} pok
    */
    function wasm_credential_verify(issuer_pub_key, attributes, commitment, pok) {
        _assertClass(issuer_pub_key, CredIssuerPublicKey);
        _assertClass(commitment, CredentialCommitment);
        _assertClass(pok, CredentialPoK);
        wasm.wasm_credential_verify(issuer_pub_key.ptr, addHeapObject(attributes), commitment.ptr, pok.ptr);
    }

    /**
    * Returns information about traceable assets for a given transfer.
    * @param {JsValue} xfr_body - JSON of a transfer note from a transfer operation.
    * @param {AssetTracerKeyPair} tracer_keypair - Asset tracer keypair.
    * @param {JsValue} candidate_assets - List of asset types traced by the tracer keypair.
    * @param {any} xfr_body
    * @param {AssetTracerKeyPair} tracer_keypair
    * @param {any} _candidate_assets
    * @returns {any}
    */
    function trace_assets(xfr_body, tracer_keypair, _candidate_assets) {
        _assertClass(tracer_keypair, AssetTracerKeyPair);
        var ret = wasm.trace_assets(addHeapObject(xfr_body), tracer_keypair.ptr, addHeapObject(_candidate_assets));
        return takeObject(ret);
    }

    /**
    * Returns bech32 encoded representation of an XfrPublicKey.
    * @param {XfrPublicKey} key
    * @returns {string}
    */
    function public_key_to_bech32(key) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(key, XfrPublicKey);
            wasm.public_key_to_bech32(retptr, key.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Converts a bech32 encoded public key string to a public key.
    * @param {string} addr
    * @returns {XfrPublicKey}
    */
    function public_key_from_bech32(addr) {
        var ptr0 = passStringToWasm0(addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.public_key_from_bech32(ptr0, len0);
        return XfrPublicKey.__wrap(ret);
    }

    /**
    * @param {string} pk
    * @returns {string}
    */
    function bech32_to_base64(pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.bech32_to_base64(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} pk
    * @returns {string}
    */
    function bech32_to_base64_old(pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.bech32_to_base64_old(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} pk
    * @returns {string}
    */
    function base64_to_bech32(pk) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(pk, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.base64_to_bech32(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} data
    * @returns {string}
    */
    function base64_to_base58(data) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.base64_to_base58(retptr, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    function getArrayU8FromWasm0(ptr, len) {
        return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
    }
    /**
    * @param {string} key_pair
    * @param {string} password
    * @returns {Uint8Array}
    */
    function encryption_pbkdf2_aes256gcm(key_pair, password) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(key_pair, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.encryption_pbkdf2_aes256gcm(retptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v2 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v2;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    function passArray8ToWasm0(arg, malloc) {
        const ptr = malloc(arg.length * 1);
        getUint8Memory0().set(arg, ptr / 1);
        WASM_VECTOR_LEN = arg.length;
        return ptr;
    }
    /**
    * @param {Uint8Array} enc_key_pair
    * @param {string} password
    * @returns {string}
    */
    function decryption_pbkdf2_aes256gcm(enc_key_pair, password) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passArray8ToWasm0(enc_key_pair, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(password, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            wasm.decryption_pbkdf2_aes256gcm(retptr, ptr0, len0, ptr1, len1);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @param {string} sk_str
    * @returns {XfrKeyPair}
    */
    function create_keypair_from_secret(sk_str) {
        var ptr0 = passStringToWasm0(sk_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.create_keypair_from_secret(ptr0, len0);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * @param {XfrKeyPair} kp
    * @returns {XfrPublicKey}
    */
    function get_pk_from_keypair(kp) {
        _assertClass(kp, XfrKeyPair);
        var ret = wasm.get_pk_from_keypair(kp.ptr);
        return XfrPublicKey.__wrap(ret);
    }

    /**
    * Randomly generate a 12words-length mnemonic.
    * @returns {string}
    */
    function generate_mnemonic_default() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.generate_mnemonic_default(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Generate mnemonic with custom length and language.
    * - @param `wordslen`: acceptable value are one of [ 12, 15, 18, 21, 24 ]
    * - @param `lang`: acceptable value are one of [ "en", "zh", "zh_traditional", "fr", "it", "ko", "sp", "jp" ]
    * @param {number} wordslen
    * @param {string} lang
    * @returns {string}
    */
    function generate_mnemonic_custom(wordslen, lang) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            var ptr0 = passStringToWasm0(lang, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.generate_mnemonic_custom(retptr, wordslen, ptr0, len0);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Restore the XfrKeyPair from a mnemonic with a default bip44-path,
    * that is "m/44'/917'/0'/0/0" ("m/44'/coin'/account'/change/address").
    * @param {string} phrase
    * @returns {XfrKeyPair}
    */
    function restore_keypair_from_mnemonic_default(phrase) {
        var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.restore_keypair_from_mnemonic_default(ptr0, len0);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Restore the XfrKeyPair from a mnemonic with a default bip44-path,
    * that is "m/44'/917'/0'/0/0" ("m/44'/coin'/account'/change/address").
    * @param {string} phrase
    * @returns {XfrKeyPair}
    */
    function restore_keypair_from_mnemonic_ed25519(phrase) {
        var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.restore_keypair_from_mnemonic_ed25519(ptr0, len0);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Restore the XfrKeyPair from a mnemonic with custom params,
    * in bip44 form.
    * @param {string} phrase
    * @param {string} lang
    * @param {BipPath} path
    * @returns {XfrKeyPair}
    */
    function restore_keypair_from_mnemonic_bip44(phrase, lang, path) {
        var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(lang, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        _assertClass(path, BipPath);
        var ret = wasm.restore_keypair_from_mnemonic_bip44(ptr0, len0, ptr1, len1, path.ptr);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * Restore the XfrKeyPair from a mnemonic with custom params,
    * in bip49 form.
    * @param {string} phrase
    * @param {string} lang
    * @param {BipPath} path
    * @returns {XfrKeyPair}
    */
    function restore_keypair_from_mnemonic_bip49(phrase, lang, path) {
        var ptr0 = passStringToWasm0(phrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = passStringToWasm0(lang, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        _assertClass(path, BipPath);
        var ret = wasm.restore_keypair_from_mnemonic_bip49(ptr0, len0, ptr1, len1, path.ptr);
        return XfrKeyPair.__wrap(ret);
    }

    /**
    * ID of FRA, in `String` format.
    * @returns {string}
    */
    function fra_get_asset_code() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fra_get_asset_code(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * Fee smaller than this value will be denied.
    * @returns {BigInt}
    */
    function fra_get_minimal_fee() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fra_get_minimal_fee(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * Fee smaller than this value will be denied.
    * @returns {BigInt}
    */
    function fra_get_minimal_fee_for_bar_to_abar() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.fra_get_minimal_fee_for_bar_to_abar(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * Anon fee for a given number of inputs & outputs
    * @param {number} n_inputs
    * @param {number} n_outputs
    * @returns {number}
    */
    function get_anon_fee(n_inputs, n_outputs) {
        var ret = wasm.get_anon_fee(n_inputs, n_outputs);
        return ret >>> 0;
    }

    /**
    * The destination for fee to be transfered to.
    * @returns {XfrPublicKey}
    */
    function fra_get_dest_pubkey() {
        var ret = wasm.fra_get_dest_pubkey();
        return XfrPublicKey.__wrap(ret);
    }

    /**
    * The system address used to reveive delegation principals.
    * @returns {string}
    */
    function get_delegation_target_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.get_coinbase_address(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @returns {string}
    */
    function get_coinbase_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.get_coinbase_address(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @returns {string}
    */
    function get_coinbase_principal_address() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.get_coinbase_address(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            return getStringFromWasm0(r0, r1);
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
            wasm.__wbindgen_free(r0, r1);
        }
    }

    /**
    * @returns {BigInt}
    */
    function get_delegation_min_amount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.get_delegation_min_amount(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * @returns {BigInt}
    */
    function get_delegation_max_amount() {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            wasm.get_delegation_max_amount(retptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            u32CvtShim[0] = r0;
            u32CvtShim[1] = r1;
            const n0 = uint64CvtShim[0];
            return n0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * @param {string} key_str
    * @returns {AXfrPubKey}
    */
    function axfr_pubkey_from_string(key_str) {
        var ptr0 = passStringToWasm0(key_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.axfr_pubkey_from_string(ptr0, len0);
        return AXfrPubKey.__wrap(ret);
    }

    /**
    * @param {string} key_str
    * @returns {AXfrKeyPair}
    */
    function axfr_keypair_from_string(key_str) {
        var ptr0 = passStringToWasm0(key_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.axfr_keypair_from_string(ptr0, len0);
        return AXfrKeyPair.__wrap(ret);
    }

    /**
    * @param {string} key_str
    * @returns {XPublicKey}
    */
    function x_pubkey_from_string(key_str) {
        var ptr0 = passStringToWasm0(key_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.x_pubkey_from_string(ptr0, len0);
        return XPublicKey.__wrap(ret);
    }

    /**
    * @param {string} key_str
    * @returns {XSecretKey}
    */
    function x_secretkey_from_string(key_str) {
        var ptr0 = passStringToWasm0(key_str, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ret = wasm.x_secretkey_from_string(ptr0, len0);
        return XSecretKey.__wrap(ret);
    }

    /**
    * @param {any} json
    * @returns {AnonAssetRecord}
    */
    function abar_from_json(json) {
        var ret = wasm.abar_from_json(addHeapObject(json));
        return AnonAssetRecord.__wrap(ret);
    }

    /**
    * Decrypts an ABAR with owner memo and decryption key
    * @param {AnonAssetRecord} abar
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} keypair
    * @returns {AmountAssetType}
    */
    function open_abar(abar, memo, keypair) {
        _assertClass(abar, AnonAssetRecord);
        var ptr0 = abar.ptr;
        abar.ptr = 0;
        _assertClass(memo, AxfrOwnerMemo);
        var ptr1 = memo.ptr;
        memo.ptr = 0;
        _assertClass(keypair, AXfrKeyPair);
        var ret = wasm.open_abar(ptr0, ptr1, keypair.ptr);
        return AmountAssetType.__wrap(ret);
    }

    /**
    * Decrypts the owner anon memo.
    * * `memo` - Owner anon memo to decrypt
    * * `key_pair` - Owner anon keypair
    * * `abar` - Associated anonymous blind asset record to check memo info against.
    * Return Error if memo info does not match the commitment or public key.
    * Return Ok(amount, asset_type, blinding) otherwise.
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} key_pair
    * @param {AnonAssetRecord} abar
    * @returns {AxfrOwnerMemoInfo}
    */
    function decrypt_axfr_memo(memo, key_pair, abar) {
        _assertClass(memo, AxfrOwnerMemo);
        _assertClass(key_pair, AXfrKeyPair);
        _assertClass(abar, AnonAssetRecord);
        var ret = wasm.decrypt_axfr_memo(memo.ptr, key_pair.ptr, abar.ptr);
        return AxfrOwnerMemoInfo.__wrap(ret);
    }

    /**
    * Try to decrypt the owner memo to check if it is own.
    * * `memo` - Owner anon memo need to decrypt.
    * * `key_pair` - the memo bytes.
    * Return Ok(amount, asset_type, blinding) if memo is own.
    * @param {AxfrOwnerMemo} memo
    * @param {AXfrKeyPair} key_pair
    * @returns {Uint8Array}
    */
    function try_decrypt_axfr_memo(memo, key_pair) {
        try {
            const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
            _assertClass(memo, AxfrOwnerMemo);
            _assertClass(key_pair, AXfrKeyPair);
            wasm.try_decrypt_axfr_memo(retptr, memo.ptr, key_pair.ptr);
            var r0 = getInt32Memory0()[retptr / 4 + 0];
            var r1 = getInt32Memory0()[retptr / 4 + 1];
            var v0 = getArrayU8FromWasm0(r0, r1).slice();
            wasm.__wbindgen_free(r0, r1 * 1);
            return v0;
        } finally {
            wasm.__wbindgen_add_to_stack_pointer(16);
        }
    }

    /**
    * Parse the owner memo from bytes.
    * * `bytes` - the memo plain bytes.
    * * `key_pair` - the memo bytes.
    * * `abar` - Associated anonymous blind asset record to check memo info against.
    * Return Error if memo info does not match the commitment.
    * Return Ok(amount, asset_type, blinding) otherwise.
    * @param {Uint8Array} bytes
    * @param {AXfrKeyPair} key_pair
    * @param {AnonAssetRecord} abar
    * @returns {AxfrOwnerMemoInfo}
    */
    function parse_axfr_memo(bytes, key_pair, abar) {
        var ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        _assertClass(key_pair, AXfrKeyPair);
        _assertClass(abar, AnonAssetRecord);
        var ret = wasm.parse_axfr_memo(ptr0, len0, key_pair.ptr, abar.ptr);
        return AxfrOwnerMemoInfo.__wrap(ret);
    }

    /**
    * Convert Commitment to AnonAssetRecord.
    * @param {BLSScalar} commitment
    * @returns {AnonAssetRecord}
    */
    function commitment_to_aar(commitment) {
        _assertClass(commitment, BLSScalar);
        var ptr0 = commitment.ptr;
        commitment.ptr = 0;
        var ret = wasm.commitment_to_aar(ptr0);
        return AnonAssetRecord.__wrap(ret);
    }

    function handleError(f) {
        return function () {
            try {
                return f.apply(this, arguments);

            } catch (e) {
                wasm.__wbindgen_exn_store(addHeapObject(e));
            }
        };
    }
    /**
    * Keypair associated with an Anonymous records. It is used to spending it.
    * The key pair for anonymous payment.
    */
    class AXfrKeyPair {

        static __wrap(ptr) {
            const obj = Object.create(AXfrKeyPair.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_axfrkeypair_free(ptr);
        }
    }
    /**
    * The public key.
    */
    class AXfrPubKey {

        static __wrap(ptr) {
            const obj = Object.create(AXfrPubKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_axfrpubkey_free(ptr);
        }
    }
    /**
    */
    class AmountAssetType {

        static __wrap(ptr) {
            const obj = Object.create(AmountAssetType.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_amountassettype_free(ptr);
        }
        /**
        * @returns {BigInt}
        */
        get amount() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.__wbg_get_amountassettype_amount(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                u32CvtShim[0] = r0;
                u32CvtShim[1] = r1;
                const n0 = uint64CvtShim[0];
                return n0;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
        /**
        * @param {BigInt} arg0
        */
        set amount(arg0) {
            uint64CvtShim[0] = arg0;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            wasm.__wbg_set_amountassettype_amount(this.ptr, low0, high0);
        }
        /**
        * @returns {string}
        */
        get asset_type() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.amountassettype_asset_type(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    * Asset record to be put as leaves on the tree.
    */
    class AnonAssetRecord {

        static __wrap(ptr) {
            const obj = Object.create(AnonAssetRecord.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_anonassetrecord_free(ptr);
        }
        /**
        * The commitment.
        * @returns {BLSScalar}
        */
        get commitment() {
            var ret = wasm.__wbg_get_anonassetrecord_commitment(this.ptr);
            return BLSScalar.__wrap(ret);
        }
        /**
        * The commitment.
        * @param {BLSScalar} arg0
        */
        set commitment(arg0) {
            _assertClass(arg0, BLSScalar);
            var ptr0 = arg0.ptr;
            arg0.ptr = 0;
            wasm.__wbg_set_anonassetrecord_commitment(this.ptr, ptr0);
        }
    }
    /**
    * AnonKeys is used to store keys for Anon proofs
    */
    class AnonKeys {

        static __wrap(ptr) {
            const obj = Object.create(AnonKeys.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_anonkeys_free(ptr);
        }
        /**
        * @param {any} json
        * @returns {AnonKeys}
        */
        static from_json(json) {
            try {
                var ret = wasm.anonkeys_from_json(addBorrowedObject(json));
                return AnonKeys.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * @returns {any}
        */
        to_json() {
            var ret = wasm.anonkeys_to_json(this.ptr);
            return takeObject(ret);
        }
        /**
        * @returns {string}
        */
        get secret_key() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.anonkeys_secret_key(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @param {string} secret_key
        */
        set secret_key(secret_key) {
            var ptr0 = passStringToWasm0(secret_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.anonkeys_set_secret_key(this.ptr, ptr0, len0);
        }
        /**
        * @returns {string}
        */
        get pub_key() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.anonkeys_pub_key(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @param {string} pub_key
        */
        set pub_key(pub_key) {
            var ptr0 = passStringToWasm0(pub_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            wasm.anonkeys_set_pub_key(this.ptr, ptr0, len0);
        }
    }
    /**
    * Structure that enables clients to construct complex transfers.
    */
    class AnonTransferOperationBuilder {

        static __wrap(ptr) {
            const obj = Object.create(AnonTransferOperationBuilder.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_anontransferoperationbuilder_free(ptr);
        }
        /**
        * new is a constructor for AnonTransferOperationBuilder
        * @param {BigInt} seq_id
        * @returns {AnonTransferOperationBuilder}
        */
        static new(seq_id) {
            uint64CvtShim[0] = seq_id;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.anontransferoperationbuilder_new(low0, high0);
            return AnonTransferOperationBuilder.__wrap(ret);
        }
        /**
        * add_input is used to add a new input source for Anon Transfer
        * @param {AnonAssetRecord} abar - input ABAR to transfer
        * @param {AxfrOwnerMemo} memo - memo corresponding to the input abar
        * @param keypair {AXfrKeyPair} - AXfrKeyPair of the ABAR owner
        * @param MTLeafInfo {mt_leaf_info} - the Merkle proof of the ABAR from commitment tree
        * @throws Will throw an error if abar fails to open, input fails to get added to Operation
        * @param {AnonAssetRecord} abar
        * @param {AxfrOwnerMemo} memo
        * @param {AXfrKeyPair} keypair
        * @param {MTLeafInfo} mt_leaf_info
        * @returns {AnonTransferOperationBuilder}
        */
        add_input(abar, memo, keypair, mt_leaf_info) {
            const ptr = this.__destroy_into_raw();
            _assertClass(abar, AnonAssetRecord);
            _assertClass(memo, AxfrOwnerMemo);
            _assertClass(keypair, AXfrKeyPair);
            _assertClass(mt_leaf_info, MTLeafInfo);
            var ptr0 = mt_leaf_info.ptr;
            mt_leaf_info.ptr = 0;
            var ret = wasm.anontransferoperationbuilder_add_input(ptr, abar.ptr, memo.ptr, keypair.ptr, ptr0);
            return AnonTransferOperationBuilder.__wrap(ret);
        }
        /**
        * add_output is used to add a output to the Anon Transfer
        * @param amount {u64} - amount to be sent to the receiver
        * @param to {AXfrPubKey} - original pub key of receiver
        * @throws error if ABAR fails to be built
        * @param {BigInt} amount
        * @param {string} asset_type
        * @param {AXfrPubKey} to
        * @returns {AnonTransferOperationBuilder}
        */
        add_output(amount, asset_type, to) {
            const ptr = this.__destroy_into_raw();
            uint64CvtShim[0] = amount;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(asset_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            _assertClass(to, AXfrPubKey);
            var ptr2 = to.ptr;
            to.ptr = 0;
            var ret = wasm.anontransferoperationbuilder_add_output(ptr, low0, high0, ptr1, len1, ptr2);
            return AnonTransferOperationBuilder.__wrap(ret);
        }
        /**
        * add_keypair is used to add the sender's keypair for the nullifier generation
        * @param to {AXfrKeyPair} - original keypair of sender
        * @throws error if ABAR fails to be built
        * @param {AXfrKeyPair} keypair
        * @returns {AnonTransferOperationBuilder}
        */
        add_keypair(keypair) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, AXfrKeyPair);
            var ret = wasm.anontransferoperationbuilder_add_keypair(ptr, keypair.ptr);
            return AnonTransferOperationBuilder.__wrap(ret);
        }
        /**
        * get_expected_fee is used to gather extra FRA that needs to be spent to make the transaction
        * have enough fees.
        * @returns {BigInt}
        */
        get_expected_fee() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.anontransferoperationbuilder_get_expected_fee(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                u32CvtShim[0] = r0;
                u32CvtShim[1] = r1;
                const n0 = uint64CvtShim[0];
                return n0;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
        /**
        * get_total_fee_estimate
        * @returns {BigInt}
        */
        get_total_fee_estimate() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.anontransferoperationbuilder_get_total_fee_estimate(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                u32CvtShim[0] = r0;
                u32CvtShim[1] = r1;
                const n0 = uint64CvtShim[0];
                return n0;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
        /**
        * get_commitments returns a list of all the commitments for receiver public keys
        * @returns {any}
        */
        get_commitments() {
            var ret = wasm.anontransferoperationbuilder_get_commitments(this.ptr);
            return takeObject(ret);
        }
        /**
        * get_commitment_map returns a hashmap of all the commitments mapped to public key, asset, amount
        * @returns {any}
        */
        get_commitment_map() {
            var ret = wasm.anontransferoperationbuilder_get_commitment_map(this.ptr);
            return takeObject(ret);
        }
        /**
        * build is used to build proof the Transfer Operation
        * @returns {AnonTransferOperationBuilder}
        */
        build() {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.anontransferoperationbuilder_build(ptr);
            return AnonTransferOperationBuilder.__wrap(ret);
        }
        /**
        * transaction returns the prepared Anon Transfer Operation
        * @param nonce {NoReplayToken} - nonce of the txn to be added to the operation
        * @returns {string}
        */
        transaction() {
            try {
                const ptr = this.__destroy_into_raw();
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.anontransferoperationbuilder_transaction(retptr, ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    * When an asset is defined, several options governing the assets must be
    * specified:
    * 1. **Traceable**: Records and identities of traceable assets can be decrypted by a provided tracing key. By defaults, assets do not have
    * any tracing policies.
    * 2. **Transferable**: Non-transferable assets can only be transferred once from the issuer to another user. By default, assets are transferable.
    * 3. **Updatable**: Whether the asset memo can be updated. By default, assets are not updatable.
    * 4. **Transfer signature rules**: Signature weights and threshold for a valid transfer. By
    *    default, there are no special signature requirements.
    * 5. **Max units**: Optional limit on the total number of units of this asset that can be issued.
    *    By default, assets do not have issuance caps.
    * @see {@link module:Findora-Wasm~TracingPolicies|TracingPolicies} for more information about tracing policies.
    * @see {@link module:Findora-Wasm~TransactionBuilder#add_operation_update_memo|add_operation_update_memo} for more information about how to add
    * a memo update operation to a transaction.
    * @see {@link module:Findora-Wasm~SignatureRules|SignatureRules} for more information about co-signatures.
    * @see {@link
    * module:Findora-Wasm~TransactionBuilder#add_operation_create_asset|add_operation_create_asset}
    * for information about how to add asset rules to an asset definition.
    */
    class AssetRules {

        static __wrap(ptr) {
            const obj = Object.create(AssetRules.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_assetrules_free(ptr);
        }
        /**
        * Create a default set of asset rules. See class description for defaults.
        * @returns {AssetRules}
        */
        static new() {
            var ret = wasm.assetrules_new();
            return AssetRules.__wrap(ret);
        }
        /**
        * Adds an asset tracing policy.
        * @param {TracingPolicy} policy - Tracing policy for the new asset.
        * @param {TracingPolicy} policy
        * @returns {AssetRules}
        */
        add_tracing_policy(policy) {
            const ptr = this.__destroy_into_raw();
            _assertClass(policy, TracingPolicy);
            var ret = wasm.assetrules_add_tracing_policy(ptr, policy.ptr);
            return AssetRules.__wrap(ret);
        }
        /**
        * Set a cap on the number of units of this asset that can be issued.
        * @param {BigInt} max_units - Maximum number of units that can be issued.
        * @param {BigInt} max_units
        * @returns {AssetRules}
        */
        set_max_units(max_units) {
            const ptr = this.__destroy_into_raw();
            uint64CvtShim[0] = max_units;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.assetrules_set_max_units(ptr, low0, high0);
            return AssetRules.__wrap(ret);
        }
        /**
        * Transferability toggle. Assets that are not transferable can only be transferred by the asset
        * issuer.
        * @param {boolean} transferable - Boolean indicating whether asset can be transferred.
        * @param {boolean} transferable
        * @returns {AssetRules}
        */
        set_transferable(transferable) {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.assetrules_set_transferable(ptr, transferable);
            return AssetRules.__wrap(ret);
        }
        /**
        * The updatable flag determines whether the asset memo can be updated after issuance.
        * @param {boolean} updatable - Boolean indicating whether asset memo can be updated.
        * @see {@link module:Findora-Wasm~TransactionBuilder#add_operation_update_memo|add_operation_update_memo} for more information about how to add
        * a memo update operation to a transaction.
        * @param {boolean} updatable
        * @returns {AssetRules}
        */
        set_updatable(updatable) {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.assetrules_set_updatable(ptr, updatable);
            return AssetRules.__wrap(ret);
        }
        /**
        * Co-signature rules. Assets with co-signatue rules require additional weighted signatures to
        * be transferred.
        * @param {SignatureRules} multisig_rules - Co-signature restrictions.
        * @param {SignatureRules} multisig_rules
        * @returns {AssetRules}
        */
        set_transfer_multisig_rules(multisig_rules) {
            const ptr = this.__destroy_into_raw();
            _assertClass(multisig_rules, SignatureRules);
            var ptr0 = multisig_rules.ptr;
            multisig_rules.ptr = 0;
            var ret = wasm.assetrules_set_transfer_multisig_rules(ptr, ptr0);
            return AssetRules.__wrap(ret);
        }
        /**
        * Set the decimal number of asset. Return error string if failed, otherwise return changed asset.
        * #param {Number} decimals - The number of decimals used to set its user representation.
        * Decimals should be 0 ~ 255.
        * @param {number} decimals
        * @returns {AssetRules}
        */
        set_decimals(decimals) {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.assetrules_set_decimals(ptr, decimals);
            return AssetRules.__wrap(ret);
        }
    }
    /**
    * Key pair used by asset tracers to decrypt asset amounts, types, and identity
    * commitments associated with traceable asset transfers.
    * @see {@link module:Findora-Wasm.TracingPolicy|TracingPolicy} for information about tracing policies.
    * @see {@link module:Findora-Wasm~AssetRules#add_tracing_policy|add_tracing_policy} for information about how to add a tracing policy to
    * an asset definition.
    */
    class AssetTracerKeyPair {

        static __wrap(ptr) {
            const obj = Object.create(AssetTracerKeyPair.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_assettracerkeypair_free(ptr);
        }
        /**
        * Creates a new tracer key pair.
        * @returns {AssetTracerKeyPair}
        */
        static new() {
            var ret = wasm.assettracerkeypair_new();
            return AssetTracerKeyPair.__wrap(ret);
        }
    }
    /**
    * Object representing an asset definition. Used to fetch tracing policies and any other
    * information that may be required to construct a valid transfer or issuance.
    */
    class AssetType {

        static __wrap(ptr) {
            const obj = Object.create(AssetType.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_assettype_free(ptr);
        }
        /**
        * Builds an asset type from a JSON-encoded JavaScript value.
        * @param {JsValue} val - JSON-encoded asset type fetched from ledger server with the `asset_token/{code}` route.
        * Note: The first field of an asset type is `properties`. See the example below.
        *
        * @example
        * "properties":{
        *   "code":{
        *     "val":[151,8,106,38,126,101,250,236,134,77,83,180,43,152,47,57,83,30,60,8,132,218,48,52,167,167,190,244,34,45,78,80]
        *   },
        *   "issuer":{"key":“iFW4jY_DQVSGED05kTseBBn0BllPB9Q9escOJUpf4DY=”},
        *   "memo":“test memo”,
        *   "asset_rules":{
        *     "transferable":true,
        *     "updatable":false,
        *     "transfer_multisig_rules":null,
        *     "max_units":5000
        *   }
        * }
        *
        * @see {@link module:Findora-Network~Network#getAssetProperties|Network.getAsset} for information about how to
        * fetch an asset type from the ledger server.
        * @param {any} json
        * @returns {AssetType}
        */
        static from_json(json) {
            try {
                var ret = wasm.assettype_from_json(addBorrowedObject(json));
                return AssetType.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * Fetch the tracing policies associated with this asset type.
        * @returns {TracingPolicies}
        */
        get_tracing_policies() {
            var ret = wasm.assettype_get_tracing_policies(this.ptr);
            return TracingPolicies.__wrap(ret);
        }
    }
    /**
    * Object representing an authenticable asset record. Clients can validate authentication proofs
    * against a ledger state commitment.
    */
    class AuthenticatedAssetRecord {

        static __wrap(ptr) {
            const obj = Object.create(AuthenticatedAssetRecord.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_authenticatedassetrecord_free(ptr);
        }
        /**
        * Given a serialized state commitment, returns true if the
        * authenticated UTXO proofs validate correctly and false otherwise. If the proofs validate, the
        * asset record contained in this structure exists on the ledger and is unspent.
        * @param {string} state_commitment - String representing the state commitment.
        * @see {@link module:Findora-Network~Network#getStateCommitment|getStateCommitment} for instructions on fetching a ledger state commitment.
        * @throws Will throw an error if the state commitment fails to deserialize.
        * @param {string} state_commitment
        * @returns {boolean}
        */
        is_valid(state_commitment) {
            var ptr0 = passStringToWasm0(state_commitment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ret = wasm.authenticatedassetrecord_is_valid(this.ptr, ptr0, len0);
            return ret !== 0;
        }
        /**
        * Builds an AuthenticatedAssetRecord from a JSON-encoded asset record returned from the ledger
        * server.
        * @param {JsValue} val - JSON-encoded asset record fetched from ledger server.
        * @see {@link module:Findora-Network~Network#getUtxo|Network.getUtxo} for information about how to
        * fetch an asset record from the ledger server.
        * @param {any} record
        * @returns {AuthenticatedAssetRecord}
        */
        static from_json_record(record) {
            try {
                var ret = wasm.authenticatedassetrecord_from_json_record(addBorrowedObject(record));
                return AuthenticatedAssetRecord.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
    }
    /**
    * Asset owner memo. Contains information needed to decrypt an asset record.
    * @see {@link module:Findora-Wasm.ClientAssetRecord|ClientAssetRecord} for more details about asset records.
    */
    class AxfrOwnerMemo {

        static __wrap(ptr) {
            const obj = Object.create(AxfrOwnerMemo.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_axfrownermemo_free(ptr);
        }
        /**
        * Builds an owner memo from a JSON-serialized JavaScript value.
        * @param {JsValue} val - JSON owner memo fetched from query server with the `get_owner_memo/{sid}` route,
        * where `sid` can be fetched from the query server with the `get_owned_utxos/{address}` route. See the example below.
        *
        * @example
        * {
        *   "blind_share":[91,251,44,28,7,221,67,155,175,213,25,183,70,90,119,232,212,238,226,142,159,200,54,19,60,115,38,221,248,202,74,248],
        *   "lock":{"ciphertext":[119,54,117,136,125,133,112,193],"encoded_rand":"8KDql2JphPB5WLd7-aYE1bxTQAcweFSmrqymLvPDntM="}
        * }
        * @param {any} val
        * @returns {AxfrOwnerMemo}
        */
        static from_json(val) {
            try {
                var ret = wasm.axfrownermemo_from_json(addBorrowedObject(val));
                return AxfrOwnerMemo.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * Creates a clone of the owner memo.
        * @returns {AxfrOwnerMemo}
        */
        clone() {
            var ret = wasm.axfrownermemo_clone(this.ptr);
            return AxfrOwnerMemo.__wrap(ret);
        }
    }
    /**
    * Asset owner memo decrypted info. contains amount, asset_type and blind.
    */
    class AxfrOwnerMemoInfo {

        static __wrap(ptr) {
            const obj = Object.create(AxfrOwnerMemoInfo.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_axfrownermemoinfo_free(ptr);
        }
        /**
        * @returns {BigInt}
        */
        get amount() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.__wbg_get_amountassettype_amount(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                u32CvtShim[0] = r0;
                u32CvtShim[1] = r1;
                const n0 = uint64CvtShim[0];
                return n0;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
        /**
        * @returns {string}
        */
        get asset_type() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.axfrownermemoinfo_asset_type(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @returns {BLSScalar}
        */
        get blind() {
            var ret = wasm.axfrownermemoinfo_blind(this.ptr);
            return BLSScalar.__wrap(ret);
        }
    }
    /**
    * The wrapped struct for [`ark_bls12_381::G1Projective`](https://docs.rs/ark-bls12-381/0.3.0/ark_bls12_381/g1/type.G1Projective.html)
    */
    class BLSG1 {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_blsg1_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`ark_bls12_381::G2Projective`](https://docs.rs/ark-bls12-381/0.3.0/ark_bls12_381/g2/type.G2Projective.html)
    */
    class BLSG2 {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_blsg2_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`Fp12<ark_bls12_381::Fq12Parameters>`](https://docs.rs/ark-bls12-381/0.3.0/ark_bls12_381/fq12/struct.Fq12Parameters.html),
    * which is the pairing result
    */
    class BLSGt {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_blsgt_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`ark_bls12_381::Fr`](https://docs.rs/ark-bls12-381/0.3.0/ark_bls12_381/fr/struct.FrParameters.html)
    */
    class BLSScalar {

        static __wrap(ptr) {
            const obj = Object.create(BLSScalar.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_blsscalar_free(ptr);
        }
    }
    /**
    * Use this struct to express a Bip44/Bip49 path.
    */
    class BipPath {

        static __wrap(ptr) {
            const obj = Object.create(BipPath.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_bippath_free(ptr);
        }
        /**
        * @param {number} coin
        * @param {number} account
        * @param {number} change
        * @param {number} address
        * @returns {BipPath}
        */
        static new(coin, account, change, address) {
            var ret = wasm.bippath_new(coin, account, change, address);
            return BipPath.__wrap(ret);
        }
    }
    /**
    * This object represents an asset record owned by a ledger key pair.
    * @see {@link module:Findora-Wasm.open_client_asset_record|open_client_asset_record} for information about how to decrypt an encrypted asset
    * record.
    */
    class ClientAssetRecord {

        static __wrap(ptr) {
            const obj = Object.create(ClientAssetRecord.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_clientassetrecord_free(ptr);
        }
        /**
        * Builds a client record from a JSON-encoded JavaScript value.
        *
        * @param {JsValue} val - JSON-encoded autehtnicated asset record fetched from ledger server with the `utxo_sid/{sid}` route,
        * where `sid` can be fetched from the query server with the `get_owned_utxos/{address}` route.
        * Note: The first field of an asset record is `utxo`. See the example below.
        *
        * @example
        * "utxo":{
        *   "amount":{
        *     "NonConfidential":5
        *   },
        *  "asset_type":{
        *     "NonConfidential":[113,168,158,149,55,64,18,189,88,156,133,204,156,46,106,46,232,62,69,233,157,112,240,132,164,120,4,110,14,247,109,127]
        *   },
        *   "public_key":"Glf8dKF6jAPYHzR_PYYYfzaWqpYcMvnrIcazxsilmlA="
        * }
        *
        * @see {@link module:Findora-Network~Network#getUtxo|Network.getUtxo} for information about how to
        * fetch an asset record from the ledger server.
        * @param {any} val
        * @returns {ClientAssetRecord}
        */
        static from_json(val) {
            try {
                var ret = wasm.clientassetrecord_from_json(addBorrowedObject(val));
                return ClientAssetRecord.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * ClientAssetRecord ==> JsValue
        * @returns {any}
        */
        to_json() {
            var ret = wasm.clientassetrecord_to_json(this.ptr);
            return takeObject(ret);
        }
    }
    /**
    * Public key of a credential issuer.
    */
    class CredIssuerPublicKey {

        static __wrap(ptr) {
            const obj = Object.create(CredIssuerPublicKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credissuerpublickey_free(ptr);
        }
    }
    /**
    * Secret key of a credential issuer.
    */
    class CredIssuerSecretKey {

        static __wrap(ptr) {
            const obj = Object.create(CredIssuerSecretKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credissuersecretkey_free(ptr);
        }
    }
    /**
    * Public key of a credential user.
    */
    class CredUserPublicKey {

        static __wrap(ptr) {
            const obj = Object.create(CredUserPublicKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_creduserpublickey_free(ptr);
        }
    }
    /**
    * Secret key of a credential user.
    */
    class CredUserSecretKey {

        static __wrap(ptr) {
            const obj = Object.create(CredUserSecretKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credusersecretkey_free(ptr);
        }
    }
    /**
    * A user credential that can be used to selectively reveal credential attributes.
    * @see {@link module:Findora-Wasm.wasm_credential_commit|wasm_credential_commit} for information about how to commit to a credential.
    * @see {@link module:Findora-Wasm.wasm_credential_reveal|wasm_credential_reveal} for information about how to selectively reveal credential
    * attributes.
    */
    class Credential {

        static __wrap(ptr) {
            const obj = Object.create(Credential.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credential_free(ptr);
        }
    }
    /**
    * Commitment to a credential record.
    * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
    * credential commitment.
    */
    class CredentialCommitment {

        static __wrap(ptr) {
            const obj = Object.create(CredentialCommitment.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialcommitment_free(ptr);
        }
    }
    /**
    * Commitment to a credential record, proof that the commitment is valid, and credential key that can be used
    * to open a commitment.
    */
    class CredentialCommitmentData {

        static __wrap(ptr) {
            const obj = Object.create(CredentialCommitmentData.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialcommitmentdata_free(ptr);
        }
        /**
        * Returns the underlying credential commitment.
        * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
        * credential commitment.
        * @returns {CredentialCommitment}
        */
        get_commitment() {
            var ret = wasm.credentialcommitmentdata_get_commitment(this.ptr);
            return CredentialCommitment.__wrap(ret);
        }
        /**
        * Returns the underlying proof of knowledge that the credential is valid.
        * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
        * credential commitment.
        * @returns {CredentialPoK}
        */
        get_pok() {
            var ret = wasm.credentialcommitmentdata_get_pok(this.ptr);
            return CredentialPoK.__wrap(ret);
        }
        /**
        * Returns the key used to generate the commitment.
        * @see {@link module:Findora-Wasm.wasm_credential_open_commitment|wasm_credential_open_commitment} for information about how to open a
        * credential commitment.
        * @returns {CredentialCommitmentKey}
        */
        get_commit_key() {
            var ret = wasm.credentialcommitmentdata_get_commit_key(this.ptr);
            return CredentialCommitmentKey.__wrap(ret);
        }
    }
    /**
    * Key used to generate a credential commitment.
    * @see {@link module:Findora-Wasm.wasm_credential_open_commitment|wasm_credential_open_commitment} for information about how to
    * open a credential commitment.
    */
    class CredentialCommitmentKey {

        static __wrap(ptr) {
            const obj = Object.create(CredentialCommitmentKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialcommitmentkey_free(ptr);
        }
    }
    /**
    * Key pair of a credential issuer.
    */
    class CredentialIssuerKeyPair {

        static __wrap(ptr) {
            const obj = Object.create(CredentialIssuerKeyPair.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialissuerkeypair_free(ptr);
        }
        /**
        * Returns the credential issuer's public key.
        * @returns {CredIssuerPublicKey}
        */
        get_pk() {
            var ret = wasm.credentialissuerkeypair_get_pk(this.ptr);
            return CredIssuerPublicKey.__wrap(ret);
        }
        /**
        * Returns the credential issuer's secret key.
        * @returns {CredIssuerSecretKey}
        */
        get_sk() {
            var ret = wasm.credentialissuerkeypair_get_sk(this.ptr);
            return CredIssuerSecretKey.__wrap(ret);
        }
        /**
        * Convert the key pair to a serialized value that can be used in the browser.
        * @returns {any}
        */
        to_json() {
            var ret = wasm.credentialissuerkeypair_to_json(this.ptr);
            return takeObject(ret);
        }
        /**
        * Generate a key pair from a JSON-serialized JavaScript value.
        * @param {any} val
        * @returns {CredentialIssuerKeyPair}
        */
        static from_json(val) {
            try {
                var ret = wasm.credentialissuerkeypair_from_json(addBorrowedObject(val));
                return CredentialIssuerKeyPair.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
    }
    /**
    * Proof that a credential is a valid re-randomization of a credential signed by a certain asset
    * issuer.
    * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
    * credential commitment.
    */
    class CredentialPoK {

        static __wrap(ptr) {
            const obj = Object.create(CredentialPoK.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialpok_free(ptr);
        }
    }
    /**
    * Reveal signature of a credential record.
    */
    class CredentialRevealSig {

        static __wrap(ptr) {
            const obj = Object.create(CredentialRevealSig.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialrevealsig_free(ptr);
        }
        /**
        * Returns the underlying credential commitment.
        * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
        * credential commitment.
        * @returns {CredentialCommitment}
        */
        get_commitment() {
            var ret = wasm.credentialcommitmentdata_get_commitment(this.ptr);
            return CredentialCommitment.__wrap(ret);
        }
        /**
        * Returns the underlying proof of knowledge that the credential is valid.
        * @see {@link module:Findora-Wasm.wasm_credential_verify_commitment|wasm_credential_verify_commitment} for information about how to verify a
        * credential commitment.
        * @returns {CredentialPoK}
        */
        get_pok() {
            var ret = wasm.credentialrevealsig_get_pok(this.ptr);
            return CredentialPoK.__wrap(ret);
        }
    }
    /**
    * Signature of a credential record.
    */
    class CredentialSignature {

        static __wrap(ptr) {
            const obj = Object.create(CredentialSignature.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialsignature_free(ptr);
        }
    }
    /**
    * Key pair of a credential user.
    */
    class CredentialUserKeyPair {

        static __wrap(ptr) {
            const obj = Object.create(CredentialUserKeyPair.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_credentialuserkeypair_free(ptr);
        }
        /**
        * Returns the credential issuer's public key.
        * @returns {CredUserPublicKey}
        */
        get_pk() {
            var ret = wasm.credentialuserkeypair_get_pk(this.ptr);
            return CredUserPublicKey.__wrap(ret);
        }
        /**
        * Returns the credential issuer's secret key.
        * @returns {CredUserSecretKey}
        */
        get_sk() {
            var ret = wasm.credentialuserkeypair_get_sk(this.ptr);
            return CredUserSecretKey.__wrap(ret);
        }
        /**
        * Convert the key pair to a serialized value that can be used in the browser.
        * @returns {any}
        */
        to_json() {
            var ret = wasm.credentialuserkeypair_to_json(this.ptr);
            return takeObject(ret);
        }
        /**
        * Generate a key pair from a JSON-serialized JavaScript value.
        * @param {any} val
        * @returns {CredentialUserKeyPair}
        */
        static from_json(val) {
            try {
                var ret = wasm.credentialuserkeypair_from_json(addBorrowedObject(val));
                return CredentialUserKeyPair.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
    }
    /**
    */
    class FeeInputs {

        static __wrap(ptr) {
            const obj = Object.create(FeeInputs.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_feeinputs_free(ptr);
        }
        /**
        * @returns {FeeInputs}
        */
        static new() {
            var ret = wasm.feeinputs_new();
            return FeeInputs.__wrap(ret);
        }
        /**
        * @param {BigInt} am
        * @param {TxoRef} tr
        * @param {ClientAssetRecord} ar
        * @param {OwnerMemo | undefined} om
        * @param {XfrKeyPair} kp
        */
        append(am, tr, ar, om, kp) {
            uint64CvtShim[0] = am;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(tr, TxoRef);
            var ptr1 = tr.ptr;
            tr.ptr = 0;
            _assertClass(ar, ClientAssetRecord);
            var ptr2 = ar.ptr;
            ar.ptr = 0;
            let ptr3 = 0;
            if (!isLikeNone(om)) {
                _assertClass(om, OwnerMemo);
                ptr3 = om.ptr;
                om.ptr = 0;
            }
            _assertClass(kp, XfrKeyPair);
            var ptr4 = kp.ptr;
            kp.ptr = 0;
            wasm.feeinputs_append(this.ptr, low0, high0, ptr1, ptr2, ptr3, ptr4);
        }
        /**
        * @param {BigInt} am
        * @param {TxoRef} tr
        * @param {ClientAssetRecord} ar
        * @param {OwnerMemo | undefined} om
        * @param {XfrKeyPair} kp
        * @returns {FeeInputs}
        */
        append2(am, tr, ar, om, kp) {
            const ptr = this.__destroy_into_raw();
            uint64CvtShim[0] = am;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(tr, TxoRef);
            var ptr1 = tr.ptr;
            tr.ptr = 0;
            _assertClass(ar, ClientAssetRecord);
            var ptr2 = ar.ptr;
            ar.ptr = 0;
            let ptr3 = 0;
            if (!isLikeNone(om)) {
                _assertClass(om, OwnerMemo);
                ptr3 = om.ptr;
                om.ptr = 0;
            }
            _assertClass(kp, XfrKeyPair);
            var ret = wasm.feeinputs_append2(ptr, low0, high0, ptr1, ptr2, ptr3, kp.ptr);
            return FeeInputs.__wrap(ret);
        }
    }
    /**
    * The wrapped struct for `ark_ed_on_bls12_381::Fr`
    */
    class JubjubScalar {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_jubjubscalar_free(ptr);
        }
    }
    /**
    */
    class MTLeafInfo {

        static __wrap(ptr) {
            const obj = Object.create(MTLeafInfo.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_mtleafinfo_free(ptr);
        }
        /**
        * @param {any} json
        * @returns {MTLeafInfo}
        */
        static from_json(json) {
            try {
                var ret = wasm.mtleafinfo_from_json(addBorrowedObject(json));
                return MTLeafInfo.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * @returns {any}
        */
        to_json() {
            var ret = wasm.mtleafinfo_to_json(this.ptr);
            return takeObject(ret);
        }
    }
    /**
    * A Merkle tree node.
    */
    class MTNode {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_mtnode_free(ptr);
        }
        /**
        * The left child of its parent in a three-ary tree.
        * @returns {BLSScalar}
        */
        get left() {
            var ret = wasm.__wbg_get_anonassetrecord_commitment(this.ptr);
            return BLSScalar.__wrap(ret);
        }
        /**
        * The left child of its parent in a three-ary tree.
        * @param {BLSScalar} arg0
        */
        set left(arg0) {
            _assertClass(arg0, BLSScalar);
            var ptr0 = arg0.ptr;
            arg0.ptr = 0;
            wasm.__wbg_set_anonassetrecord_commitment(this.ptr, ptr0);
        }
        /**
        * The mid child of its parent in a three-ary tree.
        * @returns {BLSScalar}
        */
        get mid() {
            var ret = wasm.__wbg_get_mtnode_mid(this.ptr);
            return BLSScalar.__wrap(ret);
        }
        /**
        * The mid child of its parent in a three-ary tree.
        * @param {BLSScalar} arg0
        */
        set mid(arg0) {
            _assertClass(arg0, BLSScalar);
            var ptr0 = arg0.ptr;
            arg0.ptr = 0;
            wasm.__wbg_set_mtnode_mid(this.ptr, ptr0);
        }
        /**
        * The right child of its parent in a three-ary tree.
        * @returns {BLSScalar}
        */
        get right() {
            var ret = wasm.__wbg_get_mtnode_right(this.ptr);
            return BLSScalar.__wrap(ret);
        }
        /**
        * The right child of its parent in a three-ary tree.
        * @param {BLSScalar} arg0
        */
        set right(arg0) {
            _assertClass(arg0, BLSScalar);
            var ptr0 = arg0.ptr;
            arg0.ptr = 0;
            wasm.__wbg_set_mtnode_right(this.ptr, ptr0);
        }
        /**
        * Whether this node is the left child of the parent.
        * @returns {number}
        */
        get is_left_child() {
            var ret = wasm.__wbg_get_mtnode_is_left_child(this.ptr);
            return ret;
        }
        /**
        * Whether this node is the left child of the parent.
        * @param {number} arg0
        */
        set is_left_child(arg0) {
            wasm.__wbg_set_mtnode_is_left_child(this.ptr, arg0);
        }
        /**
        * Whether this node is the mid child of the parent.
        * @returns {number}
        */
        get is_mid_child() {
            var ret = wasm.__wbg_get_mtnode_is_mid_child(this.ptr);
            return ret;
        }
        /**
        * Whether this node is the mid child of the parent.
        * @param {number} arg0
        */
        set is_mid_child(arg0) {
            wasm.__wbg_set_mtnode_is_mid_child(this.ptr, arg0);
        }
        /**
        * Whether this node is the right child of the parent.
        * @returns {number}
        */
        get is_right_child() {
            var ret = wasm.__wbg_get_mtnode_is_right_child(this.ptr);
            return ret;
        }
        /**
        * Whether this node is the right child of the parent.
        * @param {number} arg0
        */
        set is_right_child(arg0) {
            wasm.__wbg_set_mtnode_is_right_child(this.ptr, arg0);
        }
    }
    /**
    * Asset owner memo. Contains information needed to decrypt an asset record.
    * @see {@link module:Findora-Wasm.ClientAssetRecord|ClientAssetRecord} for more details about asset records.
    */
    class OwnerMemo {

        static __wrap(ptr) {
            const obj = Object.create(OwnerMemo.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_ownermemo_free(ptr);
        }
        /**
        * Builds an owner memo from a JSON-serialized JavaScript value.
        * @param {JsValue} val - JSON owner memo fetched from query server with the `get_owner_memo/{sid}` route,
        * where `sid` can be fetched from the query server with the `get_owned_utxos/{address}` route. See the example below.
        *
        * @example
        * {
        *   "blind_share":[91,251,44,28,7,221,67,155,175,213,25,183,70,90,119,232,212,238,226,142,159,200,54,19,60,115,38,221,248,202,74,248],
        *   "lock":{"ciphertext":[119,54,117,136,125,133,112,193],"encoded_rand":"8KDql2JphPB5WLd7-aYE1bxTQAcweFSmrqymLvPDntM="}
        * }
        * @param {any} val
        * @returns {OwnerMemo}
        */
        static from_json(val) {
            try {
                var ret = wasm.ownermemo_from_json(addBorrowedObject(val));
                return OwnerMemo.__wrap(ret);
            } finally {
                heap[stack_pointer++] = undefined;
            }
        }
        /**
        * Creates a clone of the owner memo.
        * @returns {OwnerMemo}
        */
        clone() {
            var ret = wasm.ownermemo_clone(this.ptr);
            return OwnerMemo.__wrap(ret);
        }
    }
    /**
    * The wrapped struct for [`ark_bulletproofs::curve::secp256k1::G1Projective`](https://github.com/FindoraNetwork/ark-bulletproofs/blob/main/src/curve/secp256k1/g1.rs)
    */
    class SECP256K1G1 {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_secp256k1g1_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`ark_bulletproofs::curve::secp256k1::Fr`](https://github.com/FindoraNetwork/ark-bulletproofs/blob/main/src/curve/secp256k1/fr.rs)
    */
    class SECP256K1Scalar {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_secp256k1scalar_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`ark_bulletproofs::curve::secq256k1::G1Projective`](https://github.com/FindoraNetwork/ark-bulletproofs/blob/main/src/curve/secq256k1/g1.rs)
    */
    class SECQ256K1G1 {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_secq256k1g1_free(ptr);
        }
    }
    /**
    * The wrapped struct for [`ark_bulletproofs::curve::secq256k1::Fr`](https://github.com/FindoraNetwork/ark-bulletproofs/blob/main/src/curve/secq256k1/fr.rs)
    */
    class SECQ256K1Scalar {

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_secq256k1scalar_free(ptr);
        }
    }
    /**
    * Stores threshold and weights for a multisignature requirement.
    */
    class SignatureRules {

        static __wrap(ptr) {
            const obj = Object.create(SignatureRules.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_signaturerules_free(ptr);
        }
        /**
        * Creates a new set of co-signature rules.
        *
        * @param {BigInt} threshold - Minimum sum of signature weights that is required for an asset
        * transfer.
        * @param {JsValue} weights - Array of public key weights of the form `[["kAb...", BigInt(5)]]', where the
        * first element of each tuple is a base64 encoded public key and the second is the key's
        * associated weight.
        * @param {BigInt} threshold
        * @param {any} weights
        * @returns {SignatureRules}
        */
        static new(threshold, weights) {
            uint64CvtShim[0] = threshold;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.signaturerules_new(low0, high0, addHeapObject(weights));
            return SignatureRules.__wrap(ret);
        }
    }
    /**
    * A collection of tracing policies. Use this object when constructing asset transfers to generate
    * the correct tracing proofs for traceable assets.
    */
    class TracingPolicies {

        static __wrap(ptr) {
            const obj = Object.create(TracingPolicies.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_tracingpolicies_free(ptr);
        }
    }
    /**
    * Tracing policy for asset transfers. Can be configured to track credentials, the asset type and
    * amount, or both.
    */
    class TracingPolicy {

        static __wrap(ptr) {
            const obj = Object.create(TracingPolicy.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_tracingpolicy_free(ptr);
        }
        /**
        * @param {AssetTracerKeyPair} tracing_key
        * @returns {TracingPolicy}
        */
        static new_with_tracing(tracing_key) {
            _assertClass(tracing_key, AssetTracerKeyPair);
            var ret = wasm.tracingpolicy_new_with_tracing(tracing_key.ptr);
            return TracingPolicy.__wrap(ret);
        }
        /**
        * @param {AssetTracerKeyPair} tracing_key
        * @param {CredIssuerPublicKey} cred_issuer_key
        * @param {any} reveal_map
        * @param {boolean} tracing
        * @returns {TracingPolicy}
        */
        static new_with_identity_tracing(tracing_key, cred_issuer_key, reveal_map, tracing) {
            _assertClass(tracing_key, AssetTracerKeyPair);
            _assertClass(cred_issuer_key, CredIssuerPublicKey);
            var ret = wasm.tracingpolicy_new_with_identity_tracing(tracing_key.ptr, cred_issuer_key.ptr, addHeapObject(reveal_map), tracing);
            return TracingPolicy.__wrap(ret);
        }
    }
    /**
    * Structure that allows users to construct arbitrary transactions.
    */
    class TransactionBuilder {

        static __wrap(ptr) {
            const obj = Object.create(TransactionBuilder.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_transactionbuilder_free(ptr);
        }
        /**
        * @param am: amount to pay
        * @param kp: owner's XfrKeyPair
        * @param {XfrKeyPair} kp
        * @returns {TransactionBuilder}
        */
        add_fee_relative_auto(kp) {
            const ptr = this.__destroy_into_raw();
            _assertClass(kp, XfrKeyPair);
            var ptr0 = kp.ptr;
            kp.ptr = 0;
            var ret = wasm.transactionbuilder_add_fee_relative_auto(ptr, ptr0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Use this func to get the necessary infomations for generating `Relative Inputs`
        *
        * - TxoRef::Relative("Element index of the result")
        * - ClientAssetRecord::from_json("Element of the result")
        * @returns {any[]}
        */
        get_relative_outputs() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.transactionbuilder_get_relative_outputs(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                var v0 = getArrayJsValueFromWasm0(r0, r1).slice();
                wasm.__wbindgen_free(r0, r1 * 4);
                return v0;
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
            }
        }
        /**
        * As the last operation of any transaction,
        * add a static fee to the transaction.
        * @param {FeeInputs} inputs
        * @returns {TransactionBuilder}
        */
        add_fee(inputs) {
            const ptr = this.__destroy_into_raw();
            _assertClass(inputs, FeeInputs);
            var ptr0 = inputs.ptr;
            inputs.ptr = 0;
            var ret = wasm.transactionbuilder_add_fee(ptr, ptr0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * As the last operation of BarToAbar transaction,
        * add a static fee to the transaction.
        * @param {FeeInputs} inputs
        * @returns {TransactionBuilder}
        */
        add_fee_bar_to_abar(inputs) {
            const ptr = this.__destroy_into_raw();
            _assertClass(inputs, FeeInputs);
            var ptr0 = inputs.ptr;
            inputs.ptr = 0;
            var ret = wasm.transactionbuilder_add_fee_bar_to_abar(ptr, ptr0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * A simple fee checker for mainnet v1.0.
        *
        * SEE [check_fee](ledger::data_model::Transaction::check_fee)
        * @returns {boolean}
        */
        check_fee() {
            var ret = wasm.transactionbuilder_check_fee(this.ptr);
            return ret !== 0;
        }
        /**
        * Create a new transaction builder.
        * @param {BigInt} seq_id - Unique sequence ID to prevent replay attacks.
        * @param {BigInt} seq_id
        * @returns {TransactionBuilder}
        */
        static new(seq_id) {
            uint64CvtShim[0] = seq_id;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.transactionbuilder_new(low0, high0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Deserialize transaction builder from string.
        * @param {string} s
        * @returns {TransactionBuilder}
        */
        static from_string(s) {
            var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_from_string(ptr0, len0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransactionBuilder to add an asset definition operation to a transaction builder instance.
        * @example <caption> Error handling </caption>
        * try {
        *     await wasm.add_operation_create_asset(wasm.new_keypair(), "test_memo", wasm.random_asset_type(), wasm.AssetRules.default());
        * } catch (err) {
        *     console.log(err)
        * }
        *
        * @param {XfrKeyPair} key_pair -  Issuer XfrKeyPair.
        * @param {string} memo - Text field for asset definition.
        * @param {string} token_code - Optional Base64 string representing the token code of the asset to be issued.
        * If empty, a token code will be chosen at random.
        * @param {AssetRules} asset_rules - Asset rules object specifying which simple policies apply
        * to the asset.
        * @param {XfrKeyPair} key_pair
        * @param {string} memo
        * @param {string} token_code
        * @param {AssetRules} asset_rules
        * @returns {TransactionBuilder}
        */
        add_operation_create_asset(key_pair, memo, token_code, asset_rules) {
            const ptr = this.__destroy_into_raw();
            _assertClass(key_pair, XfrKeyPair);
            var ptr0 = passStringToWasm0(memo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(token_code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            _assertClass(asset_rules, AssetRules);
            var ptr2 = asset_rules.ptr;
            asset_rules.ptr = 0;
            var ret = wasm.transactionbuilder_add_operation_create_asset(ptr, key_pair.ptr, ptr0, len0, ptr1, len1, ptr2);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @ignore
        * @param {XfrKeyPair} key_pair
        * @param {string} memo
        * @param {string} token_code
        * @param {string} _policy_choice
        * @param {AssetRules} asset_rules
        * @returns {TransactionBuilder}
        */
        add_operation_create_asset_with_policy(key_pair, memo, token_code, _policy_choice, asset_rules) {
            const ptr = this.__destroy_into_raw();
            _assertClass(key_pair, XfrKeyPair);
            var ptr0 = passStringToWasm0(memo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(token_code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ptr2 = passStringToWasm0(_policy_choice, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len2 = WASM_VECTOR_LEN;
            _assertClass(asset_rules, AssetRules);
            var ptr3 = asset_rules.ptr;
            asset_rules.ptr = 0;
            var ret = wasm.transactionbuilder_add_operation_create_asset_with_policy(ptr, key_pair.ptr, ptr0, len0, ptr1, len1, ptr2, len2, ptr3);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransactionBuilder to add an asset issuance to a transaction builder instance.
        *
        * Use this function for simple one-shot issuances.
        *
        * @param {XfrKeyPair} key_pair  - Issuer XfrKeyPair.
        * and types of traced assets.
        * @param {string} code - base64 string representing the token code of the asset to be issued.
        * @param {BigInt} seq_num - Issuance sequence number. Every subsequent issuance of a given asset type must have a higher sequence number than before.
        * @param {BigInt} amount - Amount to be issued.
        * @param {boolean} conf_amount - `true` means the asset amount is confidential, and `false` means it's nonconfidential.
        * @param {XfrKeyPair} key_pair
        * @param {string} code
        * @param {BigInt} seq_num
        * @param {BigInt} amount
        * @param {boolean} conf_amount
        * @returns {TransactionBuilder}
        */
        add_basic_issue_asset(key_pair, code, seq_num, amount, conf_amount) {
            const ptr = this.__destroy_into_raw();
            _assertClass(key_pair, XfrKeyPair);
            var ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = seq_num;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            uint64CvtShim[0] = amount;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            var ret = wasm.transactionbuilder_add_basic_issue_asset(ptr, key_pair.ptr, ptr0, len0, low1, high1, low2, high2, conf_amount);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Adds an operation to the transaction builder that adds a hash to the ledger's custom data
        * store.
        * @param {XfrKeyPair} auth_key_pair - Asset creator key pair.
        * @param {String} code - base64 string representing token code of the asset whose memo will be updated.
        * transaction validates.
        * @param {String} new_memo - The new asset memo.
        * @see {@link module:Findora-Wasm~AssetRules#set_updatable|AssetRules.set_updatable} for more information about how
        * to define an updatable asset.
        * @param {XfrKeyPair} auth_key_pair
        * @param {string} code
        * @param {string} new_memo
        * @returns {TransactionBuilder}
        */
        add_operation_update_memo(auth_key_pair, code, new_memo) {
            const ptr = this.__destroy_into_raw();
            _assertClass(auth_key_pair, XfrKeyPair);
            var ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ptr1 = passStringToWasm0(new_memo, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_add_operation_update_memo(ptr, auth_key_pair.ptr, ptr0, len0, ptr1, len1);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Adds an operation to the transaction builder that converts a bar to abar.
        *
        * @param {XfrKeyPair} auth_key_pair - input bar owner key pair
        * @param {AXfrPubKey} abar_pubkey - abar receiver's public key
        * @param {TxoSID} input_sid - txo sid of input bar
        * @param {ClientAssetRecord} input_record -
        * @param {string} seed
        * @param {XfrKeyPair} auth_key_pair
        * @param {AXfrPubKey} abar_pubkey
        * @param {BigInt} txo_sid
        * @param {ClientAssetRecord} input_record
        * @param {OwnerMemo | undefined} owner_memo
        * @returns {TransactionBuilder}
        */
        add_operation_bar_to_abar(seed, auth_key_pair, abar_pubkey, txo_sid, input_record, owner_memo) {
            const ptr = this.__destroy_into_raw();
            var ptr0 = passStringToWasm0(seed, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            _assertClass(auth_key_pair, XfrKeyPair);
            _assertClass(abar_pubkey, AXfrPubKey);
            uint64CvtShim[0] = txo_sid;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            _assertClass(input_record, ClientAssetRecord);
            let ptr2 = 0;
            if (!isLikeNone(owner_memo)) {
                _assertClass(owner_memo, OwnerMemo);
                ptr2 = owner_memo.ptr;
                owner_memo.ptr = 0;
            }
            var ret = wasm.transactionbuilder_add_operation_bar_to_abar(ptr, ptr0, len0, auth_key_pair.ptr, abar_pubkey.ptr, low1, high1, input_record.ptr, ptr2);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Adds an operation to transaction builder which converts an abar to a bar.
        *
        * @param {AnonAssetRecord} input - the ABAR to be converted
        * @param {AxfrOwnerMemo} axfr owner_memo - the corresponding owner_memo of the ABAR to be converted
        * @param {MTLeafInfo} mt_leaf_info - the Merkle Proof of the ABAR
        * @param {AXfrKeyPair} from_keypair - the owners Anon Key pair
        * @param {XfrPublic} recipient - the BAR owner public key
        * @param {bool} conf_amount - whether the BAR amount should be confidential
        * @param {bool} conf_type - whether the BAR asset type should be confidential
        * @param {AnonAssetRecord} input
        * @param {AxfrOwnerMemo} owner_memo
        * @param {MTLeafInfo} mt_leaf_info
        * @param {AXfrKeyPair} from_keypair
        * @param {XfrPublicKey} recipient
        * @param {boolean} conf_amount
        * @param {boolean} conf_type
        * @returns {TransactionBuilder}
        */
        add_operation_abar_to_bar(input, owner_memo, mt_leaf_info, from_keypair, recipient, conf_amount, conf_type) {
            const ptr = this.__destroy_into_raw();
            _assertClass(input, AnonAssetRecord);
            var ptr0 = input.ptr;
            input.ptr = 0;
            _assertClass(owner_memo, AxfrOwnerMemo);
            var ptr1 = owner_memo.ptr;
            owner_memo.ptr = 0;
            _assertClass(mt_leaf_info, MTLeafInfo);
            var ptr2 = mt_leaf_info.ptr;
            mt_leaf_info.ptr = 0;
            _assertClass(from_keypair, AXfrKeyPair);
            _assertClass(recipient, XfrPublicKey);
            var ret = wasm.transactionbuilder_add_operation_abar_to_bar(ptr, ptr0, ptr1, ptr2, from_keypair.ptr, recipient.ptr, conf_amount, conf_type);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Returns a list of commitment base64 strings as json
        * @returns {any}
        */
        get_commitments() {
            var ret = wasm.transactionbuilder_get_commitments(this.ptr);
            return takeObject(ret);
        }
        /**
        * Adds an operation to transaction builder which transfer a Anon Blind Asset Record
        *
        * @param {AnonAssetRecord} input - input abar
        * @param {AxfrOwnerMemo} axfr owner_memo - input owner memo
        * @param {AXfrKeyPair} from_keypair - abar sender's private key
        * @param {AXfrPubKey} to_pub_key - receiver's Anon public key
        * @param {u64} to_amount - amount to send to receiver
        * @param {AnonAssetRecord} input
        * @param {AxfrOwnerMemo} owner_memo
        * @param {MTLeafInfo} mt_leaf_info
        * @param {AXfrKeyPair} from_keypair
        * @param {AXfrPubKey} to_pub_key
        * @param {BigInt} to_amount
        * @returns {TransactionBuilder}
        */
        add_operation_anon_transfer(input, owner_memo, mt_leaf_info, from_keypair, to_pub_key, to_amount) {
            const ptr = this.__destroy_into_raw();
            _assertClass(input, AnonAssetRecord);
            var ptr0 = input.ptr;
            input.ptr = 0;
            _assertClass(owner_memo, AxfrOwnerMemo);
            var ptr1 = owner_memo.ptr;
            owner_memo.ptr = 0;
            _assertClass(mt_leaf_info, MTLeafInfo);
            var ptr2 = mt_leaf_info.ptr;
            mt_leaf_info.ptr = 0;
            _assertClass(from_keypair, AXfrKeyPair);
            _assertClass(to_pub_key, AXfrPubKey);
            uint64CvtShim[0] = to_amount;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            var ret = wasm.transactionbuilder_add_operation_anon_transfer(ptr, ptr0, ptr1, ptr2, from_keypair.ptr, to_pub_key.ptr, low3, high3);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} keypair
        * @param {BigInt} amount
        * @param {string} validator
        * @returns {TransactionBuilder}
        */
        add_operation_delegate(keypair, amount, validator) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            uint64CvtShim[0] = amount;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(validator, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_add_operation_delegate(ptr, keypair.ptr, low0, high0, ptr1, len1);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} keypair
        * @returns {TransactionBuilder}
        */
        add_operation_undelegate(keypair) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            var ret = wasm.transactionbuilder_add_operation_undelegate(ptr, keypair.ptr);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} keypair
        * @param {BigInt} am
        * @param {string} target_validator
        * @returns {TransactionBuilder}
        */
        add_operation_undelegate_partially(keypair, am, target_validator) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            uint64CvtShim[0] = am;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ptr1 = passStringToWasm0(target_validator, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_add_operation_undelegate_partially(ptr, keypair.ptr, low0, high0, ptr1, len1);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} keypair
        * @returns {TransactionBuilder}
        */
        add_operation_claim(keypair) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            var ret = wasm.transactionbuilder_add_operation_claim(ptr, keypair.ptr);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} keypair
        * @param {BigInt} am
        * @returns {TransactionBuilder}
        */
        add_operation_claim_custom(keypair, am) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            uint64CvtShim[0] = am;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.transactionbuilder_add_operation_claim_custom(ptr, keypair.ptr, low0, high0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Adds an operation to the transaction builder that support transfer utxo asset to ethereum address.
        * @param {XfrKeyPair} keypair - Asset creator key pair.
        * @param {String} ethereum_address - The address to receive Ethereum assets.
        * @param {XfrKeyPair} keypair
        * @param {string} ethereum_address
        * @param {BigInt} amount
        * @param {string | undefined} asset
        * @param {string | undefined} lowlevel_data
        * @returns {TransactionBuilder}
        */
        add_operation_convert_account(keypair, ethereum_address, amount, asset, lowlevel_data) {
            const ptr = this.__destroy_into_raw();
            _assertClass(keypair, XfrKeyPair);
            var ptr0 = passStringToWasm0(ethereum_address, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            uint64CvtShim[0] = amount;
            const low1 = u32CvtShim[0];
            const high1 = u32CvtShim[1];
            var ptr2 = isLikeNone(asset) ? 0 : passStringToWasm0(asset, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len2 = WASM_VECTOR_LEN;
            var ptr3 = isLikeNone(lowlevel_data) ? 0 : passStringToWasm0(lowlevel_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len3 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_add_operation_convert_account(ptr, keypair.ptr, ptr0, len0, low1, high1, ptr2, len2, ptr3, len3);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Adds a serialized transfer asset operation to a transaction builder instance.
        * @param {string} op - a JSON-serialized transfer operation.
        * @see {@link module:Findora-Wasm~TransferOperationBuilder} for details on constructing a transfer operation.
        * @throws Will throw an error if `op` fails to deserialize.
        * @param {string} op
        * @returns {TransactionBuilder}
        */
        add_transfer_operation(op) {
            const ptr = this.__destroy_into_raw();
            var ptr0 = passStringToWasm0(op, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ret = wasm.transactionbuilder_add_transfer_operation(ptr, ptr0, len0);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Builds the anon operations from pre-notes
        * @returns {TransactionBuilder}
        */
        build() {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.transactionbuilder_build(ptr);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} kp
        * @returns {TransactionBuilder}
        */
        sign(kp) {
            const ptr = this.__destroy_into_raw();
            _assertClass(kp, XfrKeyPair);
            var ret = wasm.transactionbuilder_sign(ptr, kp.ptr);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * @param {XfrKeyPair} kp
        * @returns {TransactionBuilder}
        */
        sign_origin(kp) {
            const ptr = this.__destroy_into_raw();
            _assertClass(kp, XfrKeyPair);
            var ret = wasm.transactionbuilder_sign_origin(ptr, kp.ptr);
            return TransactionBuilder.__wrap(ret);
        }
        /**
        * Extracts the serialized form of a transaction.
        * @returns {string}
        */
        transaction() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.transactionbuilder_transaction(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * Calculates transaction handle.
        * @returns {string}
        */
        transaction_handle() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.transactionbuilder_transaction_handle(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * Fetches a client record from a transaction.
        * @param {number} idx - Record to fetch. Records are added to the transaction builder sequentially.
        * @param {number} idx
        * @returns {ClientAssetRecord}
        */
        get_owner_record(idx) {
            var ret = wasm.transactionbuilder_get_owner_record(this.ptr, idx);
            return ClientAssetRecord.__wrap(ret);
        }
        /**
        * Fetches an owner memo from a transaction
        * @param {number} idx - Owner memo to fetch. Owner memos are added to the transaction builder sequentially.
        * @param {number} idx
        * @returns {OwnerMemo | undefined}
        */
        get_owner_memo(idx) {
            var ret = wasm.transactionbuilder_get_owner_memo(this.ptr, idx);
            return ret === 0 ? undefined : OwnerMemo.__wrap(ret);
        }
    }
    /**
    * Structure that enables clients to construct complex transfers.
    */
    class TransferOperationBuilder {

        static __wrap(ptr) {
            const obj = Object.create(TransferOperationBuilder.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_transferoperationbuilder_free(ptr);
        }
        /**
        * Create a new transfer operation builder.
        * @returns {TransferOperationBuilder}
        */
        static new() {
            var ret = wasm.transferoperationbuilder_new();
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to add an input to a transfer operation builder.
        * @param {TxoRef} txo_ref - Absolute or relative utxo reference
        * @param {string} asset_record - Serialized client asset record to serve as transfer input. This record must exist on the
        * ledger for the transfer to be valid.
        * @param {OwnerMemo} owner_memo - Opening parameters.
        * @param tracing_key {AssetTracerKeyPair} - Tracing key, must be added to traceable
        * assets.
        * @param {XfrKeyPair} key - Key pair associated with the input.
        * @param {BigInt} amount - Amount of input record to transfer.
        * @see {@link module:Findora-Wasm~TxoRef#create_absolute_txo_ref|TxoRef.create_absolute_txo_ref}
        * or {@link module:Findora-Wasm~TxoRef#create_relative_txo_ref|TxoRef.create_relative_txo_ref} for details on txo
        * references.
        * @see {@link module:Findora-Network~Network#getUtxo|Network.getUtxo} for details on fetching blind asset records.
        * @throws Will throw an error if `oar` or `txo_ref` fail to deserialize.
        * @param {TxoRef} txo_ref
        * @param {ClientAssetRecord} asset_record
        * @param {OwnerMemo | undefined} owner_memo
        * @param {TracingPolicies} tracing_policies
        * @param {XfrKeyPair} key
        * @param {BigInt} amount
        * @returns {TransferOperationBuilder}
        */
        add_input_with_tracing(txo_ref, asset_record, owner_memo, tracing_policies, key, amount) {
            const ptr = this.__destroy_into_raw();
            _assertClass(txo_ref, TxoRef);
            var ptr0 = txo_ref.ptr;
            txo_ref.ptr = 0;
            _assertClass(asset_record, ClientAssetRecord);
            var ptr1 = asset_record.ptr;
            asset_record.ptr = 0;
            let ptr2 = 0;
            if (!isLikeNone(owner_memo)) {
                _assertClass(owner_memo, OwnerMemo);
                ptr2 = owner_memo.ptr;
                owner_memo.ptr = 0;
            }
            _assertClass(tracing_policies, TracingPolicies);
            _assertClass(key, XfrKeyPair);
            uint64CvtShim[0] = amount;
            const low3 = u32CvtShim[0];
            const high3 = u32CvtShim[1];
            var ret = wasm.transferoperationbuilder_add_input_with_tracing(ptr, ptr0, ptr1, ptr2, tracing_policies.ptr, key.ptr, low3, high3);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to add an input to a transfer operation builder.
        * @param {TxoRef} txo_ref - Absolute or relative utxo reference
        * @param {string} asset_record - Serialized client asset record to serve as transfer input. This record must exist on the
        * ledger for the transfer to be valid
        * @param {OwnerMemo} owner_memo - Opening parameters.
        * @param {XfrKeyPair} key - Key pair associated with the input.
        * @param {BigInt} amount - Amount of input record to transfer
        * or {@link module:Findora-Wasm~TxoRef#create_relative_txo_ref|TxoRef.create_relative_txo_ref} for details on txo
        * references.
        * @see {@link module:Findora-Network~Network#getUtxo|Network.getUtxo} for details on fetching blind asset records.
        * @throws Will throw an error if `oar` or `txo_ref` fail to deserialize.
        * @param {TxoRef} txo_ref
        * @param {ClientAssetRecord} asset_record
        * @param {OwnerMemo | undefined} owner_memo
        * @param {XfrKeyPair} key
        * @param {BigInt} amount
        * @returns {TransferOperationBuilder}
        */
        add_input_no_tracing(txo_ref, asset_record, owner_memo, key, amount) {
            const ptr = this.__destroy_into_raw();
            _assertClass(txo_ref, TxoRef);
            var ptr0 = txo_ref.ptr;
            txo_ref.ptr = 0;
            _assertClass(asset_record, ClientAssetRecord);
            let ptr1 = 0;
            if (!isLikeNone(owner_memo)) {
                _assertClass(owner_memo, OwnerMemo);
                ptr1 = owner_memo.ptr;
                owner_memo.ptr = 0;
            }
            _assertClass(key, XfrKeyPair);
            uint64CvtShim[0] = amount;
            const low2 = u32CvtShim[0];
            const high2 = u32CvtShim[1];
            var ret = wasm.transferoperationbuilder_add_input_no_tracing(ptr, ptr0, asset_record.ptr, ptr1, key.ptr, low2, high2);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to add an output to a transfer operation builder.
        *
        * @param {BigInt} amount - amount to transfer to the recipient.
        * @param {XfrPublicKey} recipient - public key of the recipient.
        * @param tracing_key {AssetTracerKeyPair} - Optional tracing key, must be added to traced
        * assets.
        * @param code {string} - String representation of the asset token code.
        * @param conf_amount {boolean} - `true` means the output's asset amount is confidential, and `false` means it's nonconfidential.
        * @param conf_type {boolean} - `true` means the output's asset type is confidential, and `false` means it's nonconfidential.
        * @throws Will throw an error if `code` fails to deserialize.
        * @param {BigInt} amount
        * @param {XfrPublicKey} recipient
        * @param {TracingPolicies} tracing_policies
        * @param {string} code
        * @param {boolean} conf_amount
        * @param {boolean} conf_type
        * @returns {TransferOperationBuilder}
        */
        add_output_with_tracing(amount, recipient, tracing_policies, code, conf_amount, conf_type) {
            const ptr = this.__destroy_into_raw();
            uint64CvtShim[0] = amount;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(recipient, XfrPublicKey);
            _assertClass(tracing_policies, TracingPolicies);
            var ptr1 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.transferoperationbuilder_add_output_with_tracing(ptr, low0, high0, recipient.ptr, tracing_policies.ptr, ptr1, len1, conf_amount, conf_type);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to add an output to a transfer operation builder.
        *
        * @param {BigInt} amount - amount to transfer to the recipient
        * @param {XfrPublicKey} recipient - public key of the recipient
        * @param code {string} - String representaiton of the asset token code
        * @param conf_amount {boolean} - `true` means the output's asset amount is confidential, and `false` means it's nonconfidential.
        * @param conf_type {boolean} - `true` means the output's asset type is confidential, and `false` means it's nonconfidential.
        * @throws Will throw an error if `code` fails to deserialize.
        * @param {BigInt} amount
        * @param {XfrPublicKey} recipient
        * @param {string} code
        * @param {boolean} conf_amount
        * @param {boolean} conf_type
        * @returns {TransferOperationBuilder}
        */
        add_output_no_tracing(amount, recipient, code, conf_amount, conf_type) {
            const ptr = this.__destroy_into_raw();
            uint64CvtShim[0] = amount;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            _assertClass(recipient, XfrPublicKey);
            var ptr1 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            var ret = wasm.transferoperationbuilder_add_output_no_tracing(ptr, low0, high0, recipient.ptr, ptr1, len1, conf_amount, conf_type);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to ensure the transfer inputs and outputs are balanced.
        * This function will add change outputs for all unspent portions of input records.
        * @throws Will throw an error if the transaction cannot be balanced.
        * @returns {TransferOperationBuilder}
        */
        balance() {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.transferoperationbuilder_balance(ptr);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to finalize the transaction.
        *
        * @throws Will throw an error if input and output amounts do not add up.
        * @throws Will throw an error if not all record owners have signed the transaction.
        * @returns {TransferOperationBuilder}
        */
        create() {
            const ptr = this.__destroy_into_raw();
            var ret = wasm.transferoperationbuilder_create(ptr);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to add a signature to the operation.
        *
        * All input owners must sign.
        *
        * @param {XfrKeyPair} kp - key pair of one of the input owners.
        * @param {XfrKeyPair} kp
        * @returns {TransferOperationBuilder}
        */
        sign(kp) {
            const ptr = this.__destroy_into_raw();
            _assertClass(kp, XfrKeyPair);
            var ret = wasm.transferoperationbuilder_sign(ptr, kp.ptr);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * @returns {string}
        */
        builder() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.transferoperationbuilder_builder(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
        /**
        * @param {string} s
        * @returns {TransferOperationBuilder}
        */
        static from_string(s) {
            var ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            var ret = wasm.transferoperationbuilder_from_string(ptr0, len0);
            return TransferOperationBuilder.__wrap(ret);
        }
        /**
        * Wraps around TransferOperationBuilder to extract an operation expression as JSON.
        * @returns {string}
        */
        transaction() {
            try {
                const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
                wasm.transferoperationbuilder_transaction(retptr, this.ptr);
                var r0 = getInt32Memory0()[retptr / 4 + 0];
                var r1 = getInt32Memory0()[retptr / 4 + 1];
                return getStringFromWasm0(r0, r1);
            } finally {
                wasm.__wbindgen_add_to_stack_pointer(16);
                wasm.__wbindgen_free(r0, r1);
            }
        }
    }
    /**
    * Indicates whether the TXO ref is an absolute or relative value.
    */
    class TxoRef {

        static __wrap(ptr) {
            const obj = Object.create(TxoRef.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_txoref_free(ptr);
        }
        /**
        * Creates a relative txo reference as a JSON string. Relative txo references are offset
        * backwards from the operation they appear in -- 0 is the most recent, (n-1) is the first output
        * of the transaction.
        *
        * Use relative txo indexing when referring to outputs of intermediate operations (e.g. a
        * transaction containing both an issuance and a transfer).
        *
        * # Arguments
        * @param {BigInt} idx -  Relative TXO (transaction output) SID.
        * @param {BigInt} idx
        * @returns {TxoRef}
        */
        static relative(idx) {
            uint64CvtShim[0] = idx;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.txoref_relative(low0, high0);
            return TxoRef.__wrap(ret);
        }
        /**
        * Creates an absolute transaction reference as a JSON string.
        *
        * Use absolute txo indexing when referring to an output that has been assigned a utxo index (i.e.
        * when the utxo has been committed to the ledger in an earlier transaction).
        *
        * # Arguments
        * @param {BigInt} idx -  Txo (transaction output) SID.
        * @param {BigInt} idx
        * @returns {TxoRef}
        */
        static absolute(idx) {
            uint64CvtShim[0] = idx;
            const low0 = u32CvtShim[0];
            const high0 = u32CvtShim[1];
            var ret = wasm.txoref_absolute(low0, high0);
            return TxoRef.__wrap(ret);
        }
    }
    /**
    * The public key for the hybrid encryption scheme.
    */
    class XPublicKey {

        static __wrap(ptr) {
            const obj = Object.create(XPublicKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_xpublickey_free(ptr);
        }
    }
    /**
    * The secret key for the hybrid encryption scheme.
    */
    class XSecretKey {

        static __wrap(ptr) {
            const obj = Object.create(XSecretKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_xsecretkey_free(ptr);
        }
    }
    /**
    * The keypair for confidential transfer.
    */
    class XfrKeyPair {

        static __wrap(ptr) {
            const obj = Object.create(XfrKeyPair.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_xfrkeypair_free(ptr);
        }
        /**
        * The public key.
        * @returns {XfrPublicKey}
        */
        get pub_key() {
            var ret = wasm.__wbg_get_xfrkeypair_pub_key(this.ptr);
            return XfrPublicKey.__wrap(ret);
        }
        /**
        * The public key.
        * @param {XfrPublicKey} arg0
        */
        set pub_key(arg0) {
            _assertClass(arg0, XfrPublicKey);
            var ptr0 = arg0.ptr;
            arg0.ptr = 0;
            wasm.__wbg_set_xfrkeypair_pub_key(this.ptr, ptr0);
        }
    }
    /**
    * The public key wrapper for confidential transfer, for WASM compatability.
    */
    class XfrPublicKey {

        static __wrap(ptr) {
            const obj = Object.create(XfrPublicKey.prototype);
            obj.ptr = ptr;

            return obj;
        }

        __destroy_into_raw() {
            const ptr = this.ptr;
            this.ptr = 0;

            return ptr;
        }

        free() {
            const ptr = this.__destroy_into_raw();
            wasm.__wbg_xfrpublickey_free(ptr);
        }
    }

    async function load(module, imports) {
        if (typeof Response === 'function' && module instanceof Response) {
            if (typeof WebAssembly.instantiateStreaming === 'function') {
                try {
                    return await WebAssembly.instantiateStreaming(module, imports);

                } catch (e) {
                    if (module.headers.get('Content-Type') != 'application/wasm') {
                        console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                    } else {
                        throw e;
                    }
                }
            }

            const bytes = await module.arrayBuffer();
            return await WebAssembly.instantiate(bytes, imports);

        } else {
            const instance = await WebAssembly.instantiate(module, imports);

            if (instance instanceof WebAssembly.Instance) {
                return { instance, module };

            } else {
                return instance;
            }
        }
    }

    async function init(input) {
        if (typeof input === 'undefined') {
            input = new URL('wasm_bg.wasm', (document.currentScript && document.currentScript.src || new URL('index.js', document.baseURI).href));
        }
        const imports = {};
        imports.wbg = {};
        imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
            var ret = getStringFromWasm0(arg0, arg1);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
            takeObject(arg0);
        };
        imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
            const obj = getObject(arg1);
            var ret = JSON.stringify(obj === undefined ? null : obj);
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
            var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
            var ret = getObject(arg0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_now_4abbca4ef2aba8d6 = function(arg0) {
            var ret = getObject(arg0).now();
            return ret;
        };
        imports.wbg.__wbg_randomFillSync_f20541303a990429 = handleError(function(arg0, arg1, arg2) {
            getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
        });
        imports.wbg.__wbg_getRandomValues_f308e7233e5601b7 = handleError(function(arg0, arg1) {
            getObject(arg0).getRandomValues(getObject(arg1));
        });
        imports.wbg.__wbg_crypto_8fd02d72c4ba6c5c = function(arg0) {
            var ret = getObject(arg0).crypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_object = function(arg0) {
            const val = getObject(arg0);
            var ret = typeof(val) === 'object' && val !== null;
            return ret;
        };
        imports.wbg.__wbg_process_bd02d71a65cf734c = function(arg0) {
            var ret = getObject(arg0).process;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_versions_1d70d407cb23129d = function(arg0) {
            var ret = getObject(arg0).versions;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_node_0091cdf1ffa73e4d = function(arg0) {
            var ret = getObject(arg0).node;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_msCrypto_7e1e6014bddd75de = function(arg0) {
            var ret = getObject(arg0).msCrypto;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_require_b06abd91965488c8 = handleError(function() {
            var ret = module.require;
            return addHeapObject(ret);
        });
        imports.wbg.__wbindgen_is_function = function(arg0) {
            var ret = typeof(getObject(arg0)) === 'function';
            return ret;
        };
        imports.wbg.__wbg_get_0c6963cbab34fbb6 = handleError(function(arg0, arg1) {
            var ret = Reflect.get(getObject(arg0), getObject(arg1));
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_call_cb478d88f3068c91 = handleError(function(arg0, arg1) {
            var ret = getObject(arg0).call(getObject(arg1));
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_self_05c54dcacb623b9a = handleError(function() {
            var ret = self.self;
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_window_9777ce446d12989f = handleError(function() {
            var ret = window.window;
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_globalThis_f0ca0bbb0149cf3d = handleError(function() {
            var ret = globalThis.globalThis;
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_global_c3c8325ae8c7f1a9 = handleError(function() {
            var ret = global.global;
            return addHeapObject(ret);
        });
        imports.wbg.__wbindgen_is_undefined = function(arg0) {
            var ret = getObject(arg0) === undefined;
            return ret;
        };
        imports.wbg.__wbg_newnoargs_3efc7bfa69a681f9 = function(arg0, arg1) {
            var ret = new Function(getStringFromWasm0(arg0, arg1));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_call_f5e0576f61ee7461 = handleError(function(arg0, arg1, arg2) {
            var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
            return addHeapObject(ret);
        });
        imports.wbg.__wbg_buffer_ebc6c8e75510eae3 = function(arg0) {
            var ret = getObject(arg0).buffer;
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_length_317f0dd77f7a6673 = function(arg0) {
            var ret = getObject(arg0).length;
            return ret;
        };
        imports.wbg.__wbg_new_135e963dedf67b22 = function(arg0) {
            var ret = new Uint8Array(getObject(arg0));
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_set_4a5072a31008e0cb = function(arg0, arg1, arg2) {
            getObject(arg0).set(getObject(arg1), arg2 >>> 0);
        };
        imports.wbg.__wbg_newwithlength_78dc302d31527318 = function(arg0) {
            var ret = new Uint8Array(arg0 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbg_subarray_34c228a45c72d146 = function(arg0, arg1, arg2) {
            var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
            return addHeapObject(ret);
        };
        imports.wbg.__wbindgen_is_string = function(arg0) {
            var ret = typeof(getObject(arg0)) === 'string';
            return ret;
        };
        imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
            var ret = debugString(getObject(arg1));
            var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len0 = WASM_VECTOR_LEN;
            getInt32Memory0()[arg0 / 4 + 1] = len0;
            getInt32Memory0()[arg0 / 4 + 0] = ptr0;
        };
        imports.wbg.__wbindgen_throw = function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        };
        imports.wbg.__wbindgen_rethrow = function(arg0) {
            throw takeObject(arg0);
        };
        imports.wbg.__wbindgen_memory = function() {
            var ret = wasm.memory;
            return addHeapObject(ret);
        };

        if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
            input = fetch(input);
        }



        const { instance, module } = await load(await input, imports);

        wasm = instance.exports;
        init.__wbindgen_wasm_module = module;

        return wasm;
    }

    var ledger = /*#__PURE__*/Object.freeze({
        __proto__: null,
        build_id: build_id,
        random_asset_type: random_asset_type,
        hash_asset_code: hash_asset_code,
        asset_type_from_jsvalue: asset_type_from_jsvalue,
        verify_authenticated_txn: verify_authenticated_txn,
        get_null_pk: get_null_pk,
        transfer_to_utxo_from_account: transfer_to_utxo_from_account,
        recover_sk_from_mnemonic: recover_sk_from_mnemonic,
        recover_address_from_sk: recover_address_from_sk,
        get_serialized_address: get_serialized_address,
        gen_anon_keys: gen_anon_keys,
        get_anon_balance: get_anon_balance,
        get_open_abar: get_open_abar,
        gen_nullifier_hash: gen_nullifier_hash,
        open_client_asset_record: open_client_asset_record,
        get_pub_key_str: get_pub_key_str,
        get_priv_key_str: get_priv_key_str,
        get_priv_key_hex_str_by_mnemonic: get_priv_key_hex_str_by_mnemonic,
        get_keypair_by_pri_key: get_keypair_by_pri_key,
        get_pub_key_hex_str_by_priv_key: get_pub_key_hex_str_by_priv_key,
        get_address_by_public_key: get_address_by_public_key,
        get_pub_key_str_old: get_pub_key_str_old,
        get_priv_key_str_old: get_priv_key_str_old,
        new_keypair: new_keypair,
        new_keypair_old: new_keypair_old,
        new_keypair_from_seed: new_keypair_from_seed,
        public_key_to_base64: public_key_to_base64,
        public_key_from_base64: public_key_from_base64,
        keypair_to_str: keypair_to_str,
        keypair_from_str: keypair_from_str,
        wasm_credential_issuer_key_gen: wasm_credential_issuer_key_gen,
        wasm_credential_verify_commitment: wasm_credential_verify_commitment,
        wasm_credential_open_commitment: wasm_credential_open_commitment,
        wasm_credential_user_key_gen: wasm_credential_user_key_gen,
        wasm_credential_sign: wasm_credential_sign,
        create_credential: create_credential,
        wasm_credential_commit: wasm_credential_commit,
        wasm_credential_reveal: wasm_credential_reveal,
        wasm_credential_verify: wasm_credential_verify,
        trace_assets: trace_assets,
        public_key_to_bech32: public_key_to_bech32,
        public_key_from_bech32: public_key_from_bech32,
        bech32_to_base64: bech32_to_base64,
        bech32_to_base64_old: bech32_to_base64_old,
        base64_to_bech32: base64_to_bech32,
        base64_to_base58: base64_to_base58,
        encryption_pbkdf2_aes256gcm: encryption_pbkdf2_aes256gcm,
        decryption_pbkdf2_aes256gcm: decryption_pbkdf2_aes256gcm,
        create_keypair_from_secret: create_keypair_from_secret,
        get_pk_from_keypair: get_pk_from_keypair,
        generate_mnemonic_default: generate_mnemonic_default,
        generate_mnemonic_custom: generate_mnemonic_custom,
        restore_keypair_from_mnemonic_default: restore_keypair_from_mnemonic_default,
        restore_keypair_from_mnemonic_ed25519: restore_keypair_from_mnemonic_ed25519,
        restore_keypair_from_mnemonic_bip44: restore_keypair_from_mnemonic_bip44,
        restore_keypair_from_mnemonic_bip49: restore_keypair_from_mnemonic_bip49,
        fra_get_asset_code: fra_get_asset_code,
        fra_get_minimal_fee: fra_get_minimal_fee,
        fra_get_minimal_fee_for_bar_to_abar: fra_get_minimal_fee_for_bar_to_abar,
        get_anon_fee: get_anon_fee,
        fra_get_dest_pubkey: fra_get_dest_pubkey,
        get_delegation_target_address: get_delegation_target_address,
        get_coinbase_address: get_coinbase_address,
        get_coinbase_principal_address: get_coinbase_principal_address,
        get_delegation_min_amount: get_delegation_min_amount,
        get_delegation_max_amount: get_delegation_max_amount,
        axfr_pubkey_from_string: axfr_pubkey_from_string,
        axfr_keypair_from_string: axfr_keypair_from_string,
        x_pubkey_from_string: x_pubkey_from_string,
        x_secretkey_from_string: x_secretkey_from_string,
        abar_from_json: abar_from_json,
        open_abar: open_abar,
        decrypt_axfr_memo: decrypt_axfr_memo,
        try_decrypt_axfr_memo: try_decrypt_axfr_memo,
        parse_axfr_memo: parse_axfr_memo,
        commitment_to_aar: commitment_to_aar,
        AXfrKeyPair: AXfrKeyPair,
        AXfrPubKey: AXfrPubKey,
        AmountAssetType: AmountAssetType,
        AnonAssetRecord: AnonAssetRecord,
        AnonKeys: AnonKeys,
        AnonTransferOperationBuilder: AnonTransferOperationBuilder,
        AssetRules: AssetRules,
        AssetTracerKeyPair: AssetTracerKeyPair,
        AssetType: AssetType,
        AuthenticatedAssetRecord: AuthenticatedAssetRecord,
        AxfrOwnerMemo: AxfrOwnerMemo,
        AxfrOwnerMemoInfo: AxfrOwnerMemoInfo,
        BLSG1: BLSG1,
        BLSG2: BLSG2,
        BLSGt: BLSGt,
        BLSScalar: BLSScalar,
        BipPath: BipPath,
        ClientAssetRecord: ClientAssetRecord,
        CredIssuerPublicKey: CredIssuerPublicKey,
        CredIssuerSecretKey: CredIssuerSecretKey,
        CredUserPublicKey: CredUserPublicKey,
        CredUserSecretKey: CredUserSecretKey,
        Credential: Credential,
        CredentialCommitment: CredentialCommitment,
        CredentialCommitmentData: CredentialCommitmentData,
        CredentialCommitmentKey: CredentialCommitmentKey,
        CredentialIssuerKeyPair: CredentialIssuerKeyPair,
        CredentialPoK: CredentialPoK,
        CredentialRevealSig: CredentialRevealSig,
        CredentialSignature: CredentialSignature,
        CredentialUserKeyPair: CredentialUserKeyPair,
        FeeInputs: FeeInputs,
        JubjubScalar: JubjubScalar,
        MTLeafInfo: MTLeafInfo,
        MTNode: MTNode,
        OwnerMemo: OwnerMemo,
        SECP256K1G1: SECP256K1G1,
        SECP256K1Scalar: SECP256K1Scalar,
        SECQ256K1G1: SECQ256K1G1,
        SECQ256K1Scalar: SECQ256K1Scalar,
        SignatureRules: SignatureRules,
        TracingPolicies: TracingPolicies,
        TracingPolicy: TracingPolicy,
        TransactionBuilder: TransactionBuilder,
        TransferOperationBuilder: TransferOperationBuilder,
        TxoRef: TxoRef,
        XPublicKey: XPublicKey,
        XSecretKey: XSecretKey,
        XfrKeyPair: XfrKeyPair,
        XfrPublicKey: XfrPublicKey,
        'default': init
    });

    Promise.resolve().then(function () { return wasm_bg$1; });
    const getLedger = async () => {
        try {
            return ledger;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    };
    const initLedger = async () => {
        try {
            console.log(new URL('findora-wallet-wasm/web-lightweight/wasm_bg.wasm', (document.currentScript && document.currentScript.src || new URL('index.js', document.baseURI).href)));
            const ledger = await getLedger();
            if (typeof ledger?.default === 'function') {
                await ledger?.default();
            }
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    };

    const STORE_ABAR_MEMOS = 'abar_memos';
    const STORE_ACCOUNTS = 'accounts';
    const STORE_COMMITMENTS = 'commitments';
    const DEFAULT_ENV_CONFIG = {
        dbName: 'commitment_sync',
        envName: 'qa02',
        envBaseURL: 'https://dev-qa02.dev.findora.org',
        envQueryPort: '8667',
        stores: {
            accounts: {
                store: STORE_ACCOUNTS,
                storeConfig: { keyPath: 'axfrPublicKey' },
            },
            abarMemos: {
                store: STORE_ABAR_MEMOS,
                storeConfig: { keyPath: 'sid' },
            },
            commitments: {
                store: STORE_COMMITMENTS,
                storeConfig: { keyPath: 'sid' },
            }
        },
    };

    class CommitmentDB {
        db = {};
        static envConfig = DEFAULT_ENV_CONFIG;
        static setEnvConfig(newEnvConfig) {
            this.envConfig = newEnvConfig;
        }
        dbFullName = '';
        initialized = false;
        queryURL = '';
        constructor() {
            initLedger();
        }
        init() {
            const { dbName, envName, envBaseURL, envQueryPort, stores = {}, } = CommitmentDB.envConfig;
            this.dbFullName = `${dbName}_${envName}`;
            this.queryURL = [envBaseURL, envQueryPort && `:${envQueryPort}`].filter(Boolean).join('');
            this.initialized = false;
            if (window.indexedDB) {
                const request = window.indexedDB.open(this.dbFullName);
                request.onsuccess = (event) => {
                    const { result } = event.target;
                    this.setDB(result);
                };
                request.onupgradeneeded = (event) => {
                    const { result } = event.target;
                    const storesObject = Object.values(stores);
                    for (const objectStore of storesObject) {
                        result.createObjectStore(objectStore.store, objectStore.storeConfig);
                    }
                    this.setDB(result);
                };
            }
        }
        setDB(db) {
            this.db = db;
            this.initialized = true;
            // this.db.onversionchange = () => {
            //   db.close();
            //   console.log("A new version of this page is ready. Please reload or close this tab!");
            // };
        }
        addAccount(account) {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.accounts ?? {};
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                tx.oncomplete = () => {
                    resolve(true);
                };
                tx.onerror = reject;
                tx.onabort = reject;
                store.put(account);
            });
        }
        addAbarMemos(abarMemos) {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                tx.oncomplete = () => {
                    console.log('addAbarMemos: saved!');
                    resolve(true);
                };
                tx.onerror = reject;
                tx.onabort = reject;
                for (const abarMemo of abarMemos) {
                    store.put(abarMemo);
                }
            });
        }
        getAccounts() {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.accounts ?? {};
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const storeRequest = store.getAll();
                storeRequest.onsuccess = () => {
                    resolve(storeRequest.result);
                };
                storeRequest.onerror = reject;
            });
        }
        addCommitments(commitments) {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.commitments ?? {};
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                tx.oncomplete = () => {
                    console.log('commitment: saved!');
                    resolve(true);
                };
                tx.onerror = reject;
                tx.onabort = reject;
                for (const commitmentItem of commitments) {
                    store.put({ ...commitmentItem });
                }
            });
        }
        getCurrentMas() {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
                const tx = this.db.transaction(storeName, 'readwrite');
                const store = tx.objectStore(storeName);
                const openCursorRequest = store.openKeyCursor(null, 'prev');
                openCursorRequest.onsuccess = () => {
                    const cursor = openCursorRequest.result;
                    const maxKey = cursor && cursor.key;
                    resolve(maxKey || -1);
                };
                openCursorRequest.onerror = (event) => {
                    console.log(event);
                    reject('error');
                };
            });
        }
        getAbarMemos(start = 0, end) {
            if (!this.initialized)
                throw new Error('DB hasn\'t been initialized.');
            const idbKeyRange = end ? IDBKeyRange.bound(start, end) : IDBKeyRange.lowerBound(start);
            return new Promise((resolve, reject) => {
                const { store: storeName = '' } = CommitmentDB.envConfig.stores?.abarMemos ?? {};
                const store = this.db.transaction(storeName, 'readwrite').objectStore(storeName);
                const openCursorRequest = store.openCursor(idbKeyRange);
                const abarMemos = [];
                openCursorRequest.onsuccess = () => {
                    const cursor = openCursorRequest.result;
                    if (cursor) {
                        abarMemos.push(cursor.value);
                        cursor.continue();
                    }
                    else {
                        resolve(abarMemos);
                    }
                };
                openCursorRequest.onerror = (event) => {
                    console.log(event);
                    reject('error');
                };
            });
        }
    }
    const db = new CommitmentDB();

    const add = (account) => {
        return db.addAccount({ ...account, lastSid: 0 });
    };
    // export const get = () => {
    // }
    // export const remove = () => {
    // }

    var account = /*#__PURE__*/Object.freeze({
        __proto__: null,
        add: add
    });

    const getMAS = () => {
        return new Promise((resolve => {
            fetch(db.queryURL + '/get_max_atxo_sid')
                .then(response => response.json())
                .then(resolve);
        }));
    };
    const getAbarMemos = (from) => {
        const to = Math.max(0, from - 100);
        return new Promise((resolve => {
            fetch(db.queryURL + `/get_abar_memos?start=${to}&end=${from}`)
                .then(response => response.json())
                .then(memos => {
                resolve({ next: to > 0 ? to - 1 : -1, memos });
            });
        }));
    };

    const fetchLatestMemos = async () => {
        try {
            let mas = await getMAS();
            const currentMas = await db.getCurrentMas();
            if (currentMas >= mas)
                return;
            while (mas > currentMas) {
                const { next, memos } = await getAbarMemos(mas);
                db.addAbarMemos(memos.map(memo => ({ sid: memo[0], memo })));
                mas = next;
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    const get = (filter) => {
        const { from = 0, end } = filter || {};
        return db.getAbarMemos(from, end);
    };

    var abarMemo = /*#__PURE__*/Object.freeze({
        __proto__: null,
        fetchLatestMemos: fetchLatestMemos,
        get: get
    });

    var WorkerClass = null;

    try {
        var WorkerThreads =
            typeof module !== 'undefined' && typeof module.require === 'function' && module.require('worker_threads') ||
            typeof __non_webpack_require__ === 'function' && __non_webpack_require__('worker_threads') ||
            typeof require === 'function' && require('worker_threads');
        WorkerClass = WorkerThreads.Worker;
    } catch(e) {} // eslint-disable-line

    function decodeBase64$1(base64, enableUnicode) {
        return Buffer.from(base64, 'base64').toString(enableUnicode ? 'utf16' : 'utf8');
    }

    function createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64$1(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        return function WorkerFactory(options) {
            return new WorkerClass(body, Object.assign({}, options, { eval: true }));
        };
    }

    function decodeBase64(base64, enableUnicode) {
        var binaryString = atob(base64);
        if (enableUnicode) {
            var binaryView = new Uint8Array(binaryString.length);
            for (var i = 0, n = binaryString.length; i < n; ++i) {
                binaryView[i] = binaryString.charCodeAt(i);
            }
            return String.fromCharCode.apply(null, new Uint16Array(binaryView.buffer));
        }
        return binaryString;
    }

    function createURL(base64, sourcemapArg, enableUnicodeArg) {
        var sourcemap = sourcemapArg === undefined ? null : sourcemapArg;
        var enableUnicode = enableUnicodeArg === undefined ? false : enableUnicodeArg;
        var source = decodeBase64(base64, enableUnicode);
        var start = source.indexOf('\n', 10) + 1;
        var body = source.substring(start) + (sourcemap ? '\/\/# sourceMappingURL=' + sourcemap : '');
        var blob = new Blob([body], { type: 'application/javascript' });
        return URL.createObjectURL(blob);
    }

    function createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg) {
        var url;
        return function WorkerFactory(options) {
            url = url || createURL(base64, sourcemapArg, enableUnicodeArg);
            return new Worker(url, options);
        };
    }

    var kIsNodeJS = Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';

    function isNodeJS() {
        return kIsNodeJS;
    }

    function createBase64WorkerFactory(base64, sourcemapArg, enableUnicodeArg) {
        if (isNodeJS()) {
            return createBase64WorkerFactory$2(base64, sourcemapArg, enableUnicodeArg);
        }
        return createBase64WorkerFactory$1(base64, sourcemapArg, enableUnicodeArg);
    }

    var WorkerFactory = createBase64WorkerFactory('Lyogcm9sbHVwLXBsdWdpbi13ZWItd29ya2VyLWxvYWRlciAqLwooZnVuY3Rpb24gKCkgewogICAgJ3VzZSBzdHJpY3QnOwoKICAgIGxldCB3YXNtOwoKICAgIGxldCBjYWNoZWRUZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigndXRmLTgnLCB7IGlnbm9yZUJPTTogdHJ1ZSwgZmF0YWw6IHRydWUgfSk7CgogICAgY2FjaGVkVGV4dERlY29kZXIuZGVjb2RlKCk7CgogICAgbGV0IGNhY2hlZ2V0VWludDhNZW1vcnkwID0gbnVsbDsKICAgIGZ1bmN0aW9uIGdldFVpbnQ4TWVtb3J5MCgpIHsKICAgICAgICBpZiAoY2FjaGVnZXRVaW50OE1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRVaW50OE1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHsKICAgICAgICAgICAgY2FjaGVnZXRVaW50OE1lbW9yeTAgPSBuZXcgVWludDhBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gY2FjaGVnZXRVaW50OE1lbW9yeTA7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0U3RyaW5nRnJvbVdhc20wKHB0ciwgbGVuKSB7CiAgICAgICAgcmV0dXJuIGNhY2hlZFRleHREZWNvZGVyLmRlY29kZShnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIsIHB0ciArIGxlbikpOwogICAgfQoKICAgIGNvbnN0IGhlYXAgPSBuZXcgQXJyYXkoMzIpLmZpbGwodW5kZWZpbmVkKTsKCiAgICBoZWFwLnB1c2godW5kZWZpbmVkLCBudWxsLCB0cnVlLCBmYWxzZSk7CgogICAgbGV0IGhlYXBfbmV4dCA9IGhlYXAubGVuZ3RoOwoKICAgIGZ1bmN0aW9uIGFkZEhlYXBPYmplY3Qob2JqKSB7CiAgICAgICAgaWYgKGhlYXBfbmV4dCA9PT0gaGVhcC5sZW5ndGgpIGhlYXAucHVzaChoZWFwLmxlbmd0aCArIDEpOwogICAgICAgIGNvbnN0IGlkeCA9IGhlYXBfbmV4dDsKICAgICAgICBoZWFwX25leHQgPSBoZWFwW2lkeF07CgogICAgICAgIGhlYXBbaWR4XSA9IG9iajsKICAgICAgICByZXR1cm4gaWR4OwogICAgfQoKICAgIGZ1bmN0aW9uIGdldE9iamVjdChpZHgpIHsgcmV0dXJuIGhlYXBbaWR4XTsgfQoKICAgIGZ1bmN0aW9uIGRyb3BPYmplY3QoaWR4KSB7CiAgICAgICAgaWYgKGlkeCA8IDM2KSByZXR1cm47CiAgICAgICAgaGVhcFtpZHhdID0gaGVhcF9uZXh0OwogICAgICAgIGhlYXBfbmV4dCA9IGlkeDsKICAgIH0KCiAgICBmdW5jdGlvbiB0YWtlT2JqZWN0KGlkeCkgewogICAgICAgIGNvbnN0IHJldCA9IGdldE9iamVjdChpZHgpOwogICAgICAgIGRyb3BPYmplY3QoaWR4KTsKICAgICAgICByZXR1cm4gcmV0OwogICAgfQoKICAgIGxldCBXQVNNX1ZFQ1RPUl9MRU4gPSAwOwoKICAgIGxldCBjYWNoZWRUZXh0RW5jb2RlciA9IG5ldyBUZXh0RW5jb2RlcigndXRmLTgnKTsKCiAgICBjb25zdCBlbmNvZGVTdHJpbmcgPSAodHlwZW9mIGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZUludG8gPT09ICdmdW5jdGlvbicKICAgICAgICA/IGZ1bmN0aW9uIChhcmcsIHZpZXcpIHsKICAgICAgICByZXR1cm4gY2FjaGVkVGV4dEVuY29kZXIuZW5jb2RlSW50byhhcmcsIHZpZXcpOwogICAgfQogICAgICAgIDogZnVuY3Rpb24gKGFyZywgdmlldykgewogICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpOwogICAgICAgIHZpZXcuc2V0KGJ1Zik7CiAgICAgICAgcmV0dXJuIHsKICAgICAgICAgICAgcmVhZDogYXJnLmxlbmd0aCwKICAgICAgICAgICAgd3JpdHRlbjogYnVmLmxlbmd0aAogICAgICAgIH07CiAgICB9KTsKCiAgICBmdW5jdGlvbiBwYXNzU3RyaW5nVG9XYXNtMChhcmcsIG1hbGxvYywgcmVhbGxvYykgewoKICAgICAgICBpZiAocmVhbGxvYyA9PT0gdW5kZWZpbmVkKSB7CiAgICAgICAgICAgIGNvbnN0IGJ1ZiA9IGNhY2hlZFRleHRFbmNvZGVyLmVuY29kZShhcmcpOwogICAgICAgICAgICBjb25zdCBwdHIgPSBtYWxsb2MoYnVmLmxlbmd0aCk7CiAgICAgICAgICAgIGdldFVpbnQ4TWVtb3J5MCgpLnN1YmFycmF5KHB0ciwgcHRyICsgYnVmLmxlbmd0aCkuc2V0KGJ1Zik7CiAgICAgICAgICAgIFdBU01fVkVDVE9SX0xFTiA9IGJ1Zi5sZW5ndGg7CiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBsZXQgbGVuID0gYXJnLmxlbmd0aDsKICAgICAgICBsZXQgcHRyID0gbWFsbG9jKGxlbik7CgogICAgICAgIGNvbnN0IG1lbSA9IGdldFVpbnQ4TWVtb3J5MCgpOwoKICAgICAgICBsZXQgb2Zmc2V0ID0gMDsKCiAgICAgICAgZm9yICg7IG9mZnNldCA8IGxlbjsgb2Zmc2V0KyspIHsKICAgICAgICAgICAgY29uc3QgY29kZSA9IGFyZy5jaGFyQ29kZUF0KG9mZnNldCk7CiAgICAgICAgICAgIGlmIChjb2RlID4gMHg3RikgYnJlYWs7CiAgICAgICAgICAgIG1lbVtwdHIgKyBvZmZzZXRdID0gY29kZTsKICAgICAgICB9CgogICAgICAgIGlmIChvZmZzZXQgIT09IGxlbikgewogICAgICAgICAgICBpZiAob2Zmc2V0ICE9PSAwKSB7CiAgICAgICAgICAgICAgICBhcmcgPSBhcmcuc2xpY2Uob2Zmc2V0KTsKICAgICAgICAgICAgfQogICAgICAgICAgICBwdHIgPSByZWFsbG9jKHB0ciwgbGVuLCBsZW4gPSBvZmZzZXQgKyBhcmcubGVuZ3RoICogMyk7CiAgICAgICAgICAgIGNvbnN0IHZpZXcgPSBnZXRVaW50OE1lbW9yeTAoKS5zdWJhcnJheShwdHIgKyBvZmZzZXQsIHB0ciArIGxlbik7CiAgICAgICAgICAgIGNvbnN0IHJldCA9IGVuY29kZVN0cmluZyhhcmcsIHZpZXcpOwoKICAgICAgICAgICAgb2Zmc2V0ICs9IHJldC53cml0dGVuOwogICAgICAgIH0KCiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gb2Zmc2V0OwogICAgICAgIHJldHVybiBwdHI7CiAgICB9CgogICAgbGV0IGNhY2hlZ2V0SW50MzJNZW1vcnkwID0gbnVsbDsKICAgIGZ1bmN0aW9uIGdldEludDMyTWVtb3J5MCgpIHsKICAgICAgICBpZiAoY2FjaGVnZXRJbnQzMk1lbW9yeTAgPT09IG51bGwgfHwgY2FjaGVnZXRJbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHsKICAgICAgICAgICAgY2FjaGVnZXRJbnQzMk1lbW9yeTAgPSBuZXcgSW50MzJBcnJheSh3YXNtLm1lbW9yeS5idWZmZXIpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gY2FjaGVnZXRJbnQzMk1lbW9yeTA7CiAgICB9CgogICAgZnVuY3Rpb24gZGVidWdTdHJpbmcodmFsKSB7CiAgICAgICAgLy8gcHJpbWl0aXZlIHR5cGVzCiAgICAgICAgY29uc3QgdHlwZSA9IHR5cGVvZiB2YWw7CiAgICAgICAgaWYgKHR5cGUgPT0gJ251bWJlcicgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHwgdmFsID09IG51bGwpIHsKICAgICAgICAgICAgcmV0dXJuICBgJHt2YWx9YDsKICAgICAgICB9CiAgICAgICAgaWYgKHR5cGUgPT0gJ3N0cmluZycpIHsKICAgICAgICAgICAgcmV0dXJuIGAiJHt2YWx9ImA7CiAgICAgICAgfQogICAgICAgIGlmICh0eXBlID09ICdzeW1ib2wnKSB7CiAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gdmFsLmRlc2NyaXB0aW9uOwogICAgICAgICAgICBpZiAoZGVzY3JpcHRpb24gPT0gbnVsbCkgewogICAgICAgICAgICAgICAgcmV0dXJuICdTeW1ib2wnOwogICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgcmV0dXJuIGBTeW1ib2woJHtkZXNjcmlwdGlvbn0pYDsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICBpZiAodHlwZSA9PSAnZnVuY3Rpb24nKSB7CiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSB2YWwubmFtZTsKICAgICAgICAgICAgaWYgKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnICYmIG5hbWUubGVuZ3RoID4gMCkgewogICAgICAgICAgICAgICAgcmV0dXJuIGBGdW5jdGlvbigke25hbWV9KWA7CiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICByZXR1cm4gJ0Z1bmN0aW9uJzsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvLyBvYmplY3RzCiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodmFsKSkgewogICAgICAgICAgICBjb25zdCBsZW5ndGggPSB2YWwubGVuZ3RoOwogICAgICAgICAgICBsZXQgZGVidWcgPSAnWyc7CiAgICAgICAgICAgIGlmIChsZW5ndGggPiAwKSB7CiAgICAgICAgICAgICAgICBkZWJ1ZyArPSBkZWJ1Z1N0cmluZyh2YWxbMF0pOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGZvcihsZXQgaSA9IDE7IGkgPCBsZW5ndGg7IGkrKykgewogICAgICAgICAgICAgICAgZGVidWcgKz0gJywgJyArIGRlYnVnU3RyaW5nKHZhbFtpXSk7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgZGVidWcgKz0gJ10nOwogICAgICAgICAgICByZXR1cm4gZGVidWc7CiAgICAgICAgfQogICAgICAgIC8vIFRlc3QgZm9yIGJ1aWx0LWluCiAgICAgICAgY29uc3QgYnVpbHRJbk1hdGNoZXMgPSAvXFtvYmplY3QgKFteXF1dKylcXS8uZXhlYyh0b1N0cmluZy5jYWxsKHZhbCkpOwogICAgICAgIGxldCBjbGFzc05hbWU7CiAgICAgICAgaWYgKGJ1aWx0SW5NYXRjaGVzLmxlbmd0aCA+IDEpIHsKICAgICAgICAgICAgY2xhc3NOYW1lID0gYnVpbHRJbk1hdGNoZXNbMV07CiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgLy8gRmFpbGVkIHRvIG1hdGNoIHRoZSBzdGFuZGFyZCAnW29iamVjdCBDbGFzc05hbWVdJwogICAgICAgICAgICByZXR1cm4gdG9TdHJpbmcuY2FsbCh2YWwpOwogICAgICAgIH0KICAgICAgICBpZiAoY2xhc3NOYW1lID09ICdPYmplY3QnKSB7CiAgICAgICAgICAgIC8vIHdlJ3JlIGEgdXNlciBkZWZpbmVkIGNsYXNzIG9yIE9iamVjdAogICAgICAgICAgICAvLyBKU09OLnN0cmluZ2lmeSBhdm9pZHMgcHJvYmxlbXMgd2l0aCBjeWNsZXMsIGFuZCBpcyBnZW5lcmFsbHkgbXVjaAogICAgICAgICAgICAvLyBlYXNpZXIgdGhhbiBsb29waW5nIHRocm91Z2ggb3duUHJvcGVydGllcyBvZiBgdmFsYC4KICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIHJldHVybiAnT2JqZWN0KCcgKyBKU09OLnN0cmluZ2lmeSh2YWwpICsgJyknOwogICAgICAgICAgICB9IGNhdGNoIChfKSB7CiAgICAgICAgICAgICAgICByZXR1cm4gJ09iamVjdCc7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLy8gZXJyb3JzCiAgICAgICAgaWYgKHZhbCBpbnN0YW5jZW9mIEVycm9yKSB7CiAgICAgICAgICAgIHJldHVybiBgJHt2YWwubmFtZX06ICR7dmFsLm1lc3NhZ2V9XG4ke3ZhbC5zdGFja31gOwogICAgICAgIH0KICAgICAgICAvLyBUT0RPIHdlIGNvdWxkIHRlc3QgZm9yIG1vcmUgdGhpbmdzIGhlcmUsIGxpa2UgYFNldGBzIGFuZCBgTWFwYHMuCiAgICAgICAgcmV0dXJuIGNsYXNzTmFtZTsKICAgIH0KICAgIC8qKgogICAgKiBSZXR1cm5zIHRoZSBnaXQgY29tbWl0IGhhc2ggYW5kIGNvbW1pdCBkYXRlIG9mIHRoZSBjb21taXQgdGhpcyBsaWJyYXJ5IHdhcyBidWlsdCBhZ2FpbnN0LgogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGJ1aWxkX2lkKCkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB3YXNtLmJ1aWxkX2lkKHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEdlbmVyYXRlcyByYW5kb20gQmFzZTY0IGVuY29kZWQgYXNzZXQgdHlwZSBhcyBhIEJhc2U2NCBzdHJpbmcuIFVzZWQgaW4gYXNzZXQgZGVmaW5pdGlvbnMuCiAgICAqIEBzZWUge0BsaW5rCiAgICAqIG1vZHVsZTpGaW5kb3JhLVdhc21+VHJhbnNhY3Rpb25CdWlsZGVyI2FkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0fGFkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0fQogICAgKiBmb3IgaW5zdHJ1Y3Rpb25zIG9uIGhvdyB0byBkZWZpbmUgYW4gYXNzZXQgd2l0aCBhIG5ldwogICAgKiBhc3NldCB0eXBlCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gcmFuZG9tX2Fzc2V0X3R5cGUoKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHdhc20ucmFuZG9tX2Fzc2V0X3R5cGUocmV0cHRyKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogQ3JlYXRlcyBhIG5ldyBhc3NldCBjb2RlIHdpdGggcHJlZml4aW5nLWhhc2hpbmcgdGhlIG9yaWdpbmFsIGNvZGUgdG8gcXVlcnkgdGhlIGxlZGdlci4KICAgICogQHBhcmFtIHtzdHJpbmd9IGFzc2V0X2NvZGVfc3RyaW5nCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gaGFzaF9hc3NldF9jb2RlKGFzc2V0X2NvZGVfc3RyaW5nKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoYXNzZXRfY29kZV9zdHJpbmcsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20uaGFzaF9hc3NldF9jb2RlKHJldHB0ciwgcHRyMCwgbGVuMCk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgbGV0IHN0YWNrX3BvaW50ZXIgPSAzMjsKCiAgICBmdW5jdGlvbiBhZGRCb3Jyb3dlZE9iamVjdChvYmopIHsKICAgICAgICBpZiAoc3RhY2tfcG9pbnRlciA9PSAxKSB0aHJvdyBuZXcgRXJyb3IoJ291dCBvZiBqcyBzdGFjaycpOwogICAgICAgIGhlYXBbLS1zdGFja19wb2ludGVyXSA9IG9iajsKICAgICAgICByZXR1cm4gc3RhY2tfcG9pbnRlcjsKICAgIH0KICAgIC8qKgogICAgKiBHZW5lcmF0ZXMgYXNzZXQgdHlwZSBhcyBhIEJhc2U2NCBzdHJpbmcgZnJvbSBhIEpTT04tc2VyaWFsaXplZCBKYXZhU2NyaXB0IHZhbHVlLgogICAgKiBAcGFyYW0ge2FueX0gdmFsCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gYXNzZXRfdHlwZV9mcm9tX2pzdmFsdWUodmFsKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHdhc20uYXNzZXRfdHlwZV9mcm9tX2pzdmFsdWUocmV0cHRyLCBhZGRCb3Jyb3dlZE9iamVjdCh2YWwpKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBHaXZlbiBhIHNlcmlhbGl6ZWQgc3RhdGUgY29tbWl0bWVudCBhbmQgdHJhbnNhY3Rpb24sIHJldHVybnMgdHJ1ZSBpZiB0aGUgdHJhbnNhY3Rpb24gY29ycmVjdGx5CiAgICAqIGhhc2hlcyB1cCB0byB0aGUgc3RhdGUgY29tbWl0bWVudCBhbmQgZmFsc2Ugb3RoZXJ3aXNlLgogICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVfY29tbWl0bWVudCAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHN0YXRlIGNvbW1pdG1lbnQuCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBhdXRoZW50aWNhdGVkX3R4biAtIFN0cmluZyByZXByZXNlbnRpbmcgdGhlIHRyYW5zYWN0aW9uLgogICAgKiBAc2VlIHtAbGluayBtb2R1bGU6TmV0d29ya35OZXR3b3JrI2dldFR4bnxOZXR3b3JrLmdldFR4bn0gZm9yIGluc3RydWN0aW9ucyBvbiBmZXRjaGluZyBhIHRyYW5zYWN0aW9uIGZyb20gdGhlIGxlZGdlci4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOk5ldHdvcmt+TmV0d29yayNnZXRTdGF0ZUNvbW1pdG1lbnR8TmV0d29yay5nZXRTdGF0ZUNvbW1pdG1lbnR9CiAgICAqIGZvciBpbnN0cnVjdGlvbnMgb24gZmV0Y2hpbmcgYSBsZWRnZXIgc3RhdGUgY29tbWl0bWVudC4KICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBzdGF0ZSBjb21taXRtZW50IG9yIHRoZSB0cmFuc2FjdGlvbiBmYWlscyB0byBkZXNlcmlhbGl6ZS4KICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlX2NvbW1pdG1lbnQKICAgICogQHBhcmFtIHtzdHJpbmd9IGF1dGhlbnRpY2F0ZWRfdHhuCiAgICAqIEByZXR1cm5zIHtib29sZWFufQogICAgKi8KICAgIGZ1bmN0aW9uIHZlcmlmeV9hdXRoZW50aWNhdGVkX3R4bihzdGF0ZV9jb21taXRtZW50LCBhdXRoZW50aWNhdGVkX3R4bikgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc3RhdGVfY29tbWl0bWVudCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAoYXV0aGVudGljYXRlZF90eG4sIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICB2YXIgcmV0ID0gd2FzbS52ZXJpZnlfYXV0aGVudGljYXRlZF90eG4ocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7CiAgICAgICAgcmV0dXJuIHJldCAhPT0gMDsKICAgIH0KCiAgICAvKioKICAgICogLi4uCiAgICAqIEByZXR1cm5zIHtYZnJQdWJsaWNLZXl9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X251bGxfcGsoKSB7CiAgICAgICAgdmFyIHJldCA9IHdhc20uZ2V0X251bGxfcGsoKTsKICAgICAgICByZXR1cm4gWGZyUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgfQoKICAgIGNvbnN0IHUzMkN2dFNoaW0gPSBuZXcgVWludDMyQXJyYXkoMik7CgogICAgY29uc3QgdWludDY0Q3Z0U2hpbSA9IG5ldyBCaWdVaW50NjRBcnJheSh1MzJDdnRTaGltLmJ1ZmZlcik7CgogICAgZnVuY3Rpb24gX2Fzc2VydENsYXNzKGluc3RhbmNlLCBrbGFzcykgewogICAgICAgIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2Yga2xhc3MpKSB7CiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgZXhwZWN0ZWQgaW5zdGFuY2Ugb2YgJHtrbGFzcy5uYW1lfWApOwogICAgICAgIH0KICAgICAgICByZXR1cm4gaW5zdGFuY2UucHRyOwogICAgfQoKICAgIGZ1bmN0aW9uIGlzTGlrZU5vbmUoeCkgewogICAgICAgIHJldHVybiB4ID09PSB1bmRlZmluZWQgfHwgeCA9PT0gbnVsbDsKICAgIH0KCiAgICBsZXQgY2FjaGVnZXRVaW50MzJNZW1vcnkwID0gbnVsbDsKICAgIGZ1bmN0aW9uIGdldFVpbnQzMk1lbW9yeTAoKSB7CiAgICAgICAgaWYgKGNhY2hlZ2V0VWludDMyTWVtb3J5MCA9PT0gbnVsbCB8fCBjYWNoZWdldFVpbnQzMk1lbW9yeTAuYnVmZmVyICE9PSB3YXNtLm1lbW9yeS5idWZmZXIpIHsKICAgICAgICAgICAgY2FjaGVnZXRVaW50MzJNZW1vcnkwID0gbmV3IFVpbnQzMkFycmF5KHdhc20ubWVtb3J5LmJ1ZmZlcik7CiAgICAgICAgfQogICAgICAgIHJldHVybiBjYWNoZWdldFVpbnQzMk1lbW9yeTA7CiAgICB9CgogICAgZnVuY3Rpb24gZ2V0QXJyYXlKc1ZhbHVlRnJvbVdhc20wKHB0ciwgbGVuKSB7CiAgICAgICAgY29uc3QgbWVtID0gZ2V0VWludDMyTWVtb3J5MCgpOwogICAgICAgIGNvbnN0IHNsaWNlID0gbWVtLnN1YmFycmF5KHB0ciAvIDQsIHB0ciAvIDQgKyBsZW4pOwogICAgICAgIGNvbnN0IHJlc3VsdCA9IFtdOwogICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2xpY2UubGVuZ3RoOyBpKyspIHsKICAgICAgICAgICAgcmVzdWx0LnB1c2godGFrZU9iamVjdChzbGljZVtpXSkpOwogICAgICAgIH0KICAgICAgICByZXR1cm4gcmVzdWx0OwogICAgfQogICAgLyoqCiAgICAqIEJ1aWxkIHRyYW5zZmVyIGZyb20gYWNjb3VudCBiYWxhbmNlIHRvIHV0eG8gdHguCiAgICAqIEBwYXJhbSB7WGZyUHVibGljS2V5fSByZWNpcGllbnQgLSBVVFhPIEFzc2V0IHJlY2VpdmVyLgogICAgKiBAcGFyYW0ge3U2NH0gYW1vdW50IC0gVHJhbnNmZXIgYW1vdW50LgogICAgKiBAcGFyYW0ge3N0cmluZ30gc2sgLSBFdGhlcmV1bSB3YWxsZXQgcHJpdmF0ZSBrZXkuCiAgICAqIEBwYXJhbSB7dTY0fSBub25jZSAtIFRyYW5zYWN0aW9uIG5vbmNlIGZvciBzZW5kZXIuCiAgICAqIEBwYXJhbSB7WGZyUHVibGljS2V5fSByZWNpcGllbnQKICAgICogQHBhcmFtIHtCaWdJbnR9IGFtb3VudAogICAgKiBAcGFyYW0ge3N0cmluZ30gc2sKICAgICogQHBhcmFtIHtCaWdJbnR9IG5vbmNlCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gdHJhbnNmZXJfdG9fdXR4b19mcm9tX2FjY291bnQocmVjaXBpZW50LCBhbW91bnQsIHNrLCBub25jZSkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MocmVjaXBpZW50LCBYZnJQdWJsaWNLZXkpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHJlY2lwaWVudC5wdHI7CiAgICAgICAgICAgIHJlY2lwaWVudC5wdHIgPSAwOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gYW1vdW50OwogICAgICAgICAgICBjb25zdCBsb3cxID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDEgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKHNrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4yID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gbm9uY2U7CiAgICAgICAgICAgIGNvbnN0IGxvdzMgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMyA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHdhc20udHJhbnNmZXJfdG9fdXR4b19mcm9tX2FjY291bnQocmV0cHRyLCBwdHIwLCBsb3cxLCBoaWdoMSwgcHRyMiwgbGVuMiwgbG93MywgaGlnaDMpOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBSZWNvdmVyIGVjZHNhIHByaXZhdGUga2V5IGZyb20gbW5lbW9uaWMuCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaHJhc2UKICAgICogQHBhcmFtIHtzdHJpbmd9IHBhc3N3b3JkCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gcmVjb3Zlcl9za19mcm9tX21uZW1vbmljKHBocmFzZSwgcGFzc3dvcmQpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwaHJhc2UsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocGFzc3dvcmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20ucmVjb3Zlcl9za19mcm9tX21uZW1vbmljKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIFJlY292ZXIgZXRoZXJldW0gYWRkcmVzcyBmcm9tIGVjZHNhIHByaXZhdGUga2V5LCBlZy4gMHg3M2M3MS4uLgogICAgKiBAcGFyYW0ge3N0cmluZ30gc2sKICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiByZWNvdmVyX2FkZHJlc3NfZnJvbV9zayhzaykgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHNrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLnJlY292ZXJfYWRkcmVzc19mcm9tX3NrKHJldHB0ciwgcHRyMCwgbGVuMCk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIFNlcmlhbGl6ZSBldGhlcmV1bSBhZGRyZXNzIHVzZWQgdG8gYWJjaSBxdWVyeSBub25jZS4KICAgICogQHBhcmFtIHtzdHJpbmd9IGFkZHJlc3MKICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBnZXRfc2VyaWFsaXplZF9hZGRyZXNzKGFkZHJlc3MpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChhZGRyZXNzLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmdldF9zZXJpYWxpemVkX2FkZHJlc3MocmV0cHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogR2VuZXJhdGUgbmV3IGFub255bW91cyBrZXlzCiAgICAqIEByZXR1cm5zIHtBbm9uS2V5c30KICAgICovCiAgICBmdW5jdGlvbiBnZW5fYW5vbl9rZXlzKCkgewogICAgICAgIHZhciByZXQgPSB3YXNtLmdlbl9hbm9uX2tleXMoKTsKICAgICAgICByZXR1cm4gQW5vbktleXMuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIEdldCBiYWxhbmNlIGZvciBhbiBBbm9ueW1vdXMgQmxpbmQgQXNzZXQgUmVjb3JkCiAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBhYmFyIC0gQUJBUiBmb3Igd2hpY2ggYmFsYW5jZSBuZWVkcyB0byBiZSBxdWVyaWVkCiAgICAqIEBwYXJhbSB7QXhmck93bmVyTWVtb30gbWVtbyAtIG1lbW8gY29ycmVzcG9uZGluZyB0byB0aGUgYWJhcgogICAgKiBAcGFyYW0ga2V5cGFpciB7QVhmcktleVBhaXJ9IC0gQVhmcktleVBhaXIgb2YgdGhlIEFCQVIgb3duZXIKICAgICogQHBhcmFtIE1UTGVhZkluZm8ge210X2xlYWZfaW5mb30gLSB0aGUgTWVya2xlIHByb29mIG9mIHRoZSBBQkFSIGZyb20gY29tbWl0bWVudCB0cmVlCiAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhYmFyIGZhaWxzIHRvIG9wZW4KICAgICogQHBhcmFtIHtBbm9uQXNzZXRSZWNvcmR9IGFiYXIKICAgICogQHBhcmFtIHtBeGZyT3duZXJNZW1vfSBtZW1vCiAgICAqIEBwYXJhbSB7QVhmcktleVBhaXJ9IGtleXBhaXIKICAgICogQHBhcmFtIHtNVExlYWZJbmZvfSBtdF9sZWFmX2luZm8KICAgICogQHJldHVybnMge0JpZ0ludH0KICAgICovCiAgICBmdW5jdGlvbiBnZXRfYW5vbl9iYWxhbmNlKGFiYXIsIG1lbW8sIGtleXBhaXIsIG10X2xlYWZfaW5mbykgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYWJhciwgQW5vbkFzc2V0UmVjb3JkKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBhYmFyLnB0cjsKICAgICAgICAgICAgYWJhci5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MobWVtbywgQXhmck93bmVyTWVtbyk7CiAgICAgICAgICAgIHZhciBwdHIxID0gbWVtby5wdHI7CiAgICAgICAgICAgIG1lbW8ucHRyID0gMDsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleXBhaXIsIEFYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdmFyIHB0cjIgPSBrZXlwYWlyLnB0cjsKICAgICAgICAgICAga2V5cGFpci5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MobXRfbGVhZl9pbmZvLCBNVExlYWZJbmZvKTsKICAgICAgICAgICAgdmFyIHB0cjMgPSBtdF9sZWFmX2luZm8ucHRyOwogICAgICAgICAgICBtdF9sZWFmX2luZm8ucHRyID0gMDsKICAgICAgICAgICAgd2FzbS5nZXRfYW5vbl9iYWxhbmNlKHJldHB0ciwgcHRyMCwgcHRyMSwgcHRyMiwgcHRyMyk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgIHUzMkN2dFNoaW1bMV0gPSByMTsKICAgICAgICAgICAgY29uc3QgbjQgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICByZXR1cm4gbjQ7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEdldCBPQUJBUiAoT3BlbiBBQkFSKSB1c2luZyB0aGUgQUJBUiwgT3duZXJNZW1vIGFuZCBNVExlYWZJbmZvCiAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBhYmFyIC0gQUJBUiB3aGljaCBuZWVkcyB0byBiZSBvcGVuZWQKICAgICogQHBhcmFtIHtBeGZyT3duZXJNZW1vfSBtZW1vIC0gbWVtbyBjb3JyZXNwb25kaW5nIHRvIHRoZSBhYmFyCiAgICAqIEBwYXJhbSBrZXlwYWlyIHtBWGZyS2V5UGFpcn0gLSBBWGZyS2V5UGFpciBvZiB0aGUgQUJBUiBvd25lcgogICAgKiBAcGFyYW0gTVRMZWFmSW5mbyB7bXRfbGVhZl9pbmZvfSAtIHRoZSBNZXJrbGUgcHJvb2Ygb2YgdGhlIEFCQVIgZnJvbSBjb21taXRtZW50IHRyZWUKICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGFiYXIgZmFpbHMgdG8gb3BlbgogICAgKiBAcGFyYW0ge0Fub25Bc3NldFJlY29yZH0gYWJhcgogICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG1lbW8KICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0ga2V5cGFpcgogICAgKiBAcGFyYW0ge01UTGVhZkluZm99IG10X2xlYWZfaW5mbwogICAgKiBAcmV0dXJucyB7YW55fQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9vcGVuX2FiYXIoYWJhciwgbWVtbywga2V5cGFpciwgbXRfbGVhZl9pbmZvKSB7CiAgICAgICAgX2Fzc2VydENsYXNzKGFiYXIsIEFub25Bc3NldFJlY29yZCk7CiAgICAgICAgdmFyIHB0cjAgPSBhYmFyLnB0cjsKICAgICAgICBhYmFyLnB0ciA9IDA7CiAgICAgICAgX2Fzc2VydENsYXNzKG1lbW8sIEF4ZnJPd25lck1lbW8pOwogICAgICAgIHZhciBwdHIxID0gbWVtby5wdHI7CiAgICAgICAgbWVtby5wdHIgPSAwOwogICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBBWGZyS2V5UGFpcik7CiAgICAgICAgdmFyIHB0cjIgPSBrZXlwYWlyLnB0cjsKICAgICAgICBrZXlwYWlyLnB0ciA9IDA7CiAgICAgICAgX2Fzc2VydENsYXNzKG10X2xlYWZfaW5mbywgTVRMZWFmSW5mbyk7CiAgICAgICAgdmFyIHB0cjMgPSBtdF9sZWFmX2luZm8ucHRyOwogICAgICAgIG10X2xlYWZfaW5mby5wdHIgPSAwOwogICAgICAgIHZhciByZXQgPSB3YXNtLmdldF9vcGVuX2FiYXIocHRyMCwgcHRyMSwgcHRyMiwgcHRyMyk7CiAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogR2VuZXJhdGUgbnVsbGlmaWVyIGhhc2ggdXNpbmcgQUJBUiwgT3duZXJNZW1vIGFuZCBNVExlYWZJbmZvCiAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBhYmFyIC0gQUJBUiBmb3Igd2hpY2ggYmFsYW5jZSBuZWVkcyB0byBiZSBxdWVyaWVkCiAgICAqIEBwYXJhbSB7QXhmck93bmVyTWVtb30gbWVtbyAtIG1lbW8gY29ycmVzcG9uZGluZyB0byB0aGUgYWJhcgogICAgKiBAcGFyYW0ga2V5cGFpciB7QVhmcktleVBhaXJ9IC0gQVhmcktleVBhaXIgb2YgdGhlIEFCQVIgb3duZXIKICAgICogQHBhcmFtIE1UTGVhZkluZm8ge210X2xlYWZfaW5mb30gLSB0aGUgTWVya2xlIHByb29mIG9mIHRoZSBBQkFSIGZyb20gY29tbWl0bWVudCB0cmVlCiAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhYmFyIGZhaWxzIHRvIG9wZW4KICAgICogQHBhcmFtIHtBbm9uQXNzZXRSZWNvcmR9IGFiYXIKICAgICogQHBhcmFtIHtBeGZyT3duZXJNZW1vfSBtZW1vCiAgICAqIEBwYXJhbSB7QVhmcktleVBhaXJ9IGtleXBhaXIKICAgICogQHBhcmFtIHtNVExlYWZJbmZvfSBtdF9sZWFmX2luZm8KICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBnZW5fbnVsbGlmaWVyX2hhc2goYWJhciwgbWVtbywga2V5cGFpciwgbXRfbGVhZl9pbmZvKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhhYmFyLCBBbm9uQXNzZXRSZWNvcmQpOwogICAgICAgICAgICB2YXIgcHRyMCA9IGFiYXIucHRyOwogICAgICAgICAgICBhYmFyLnB0ciA9IDA7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhtZW1vLCBBeGZyT3duZXJNZW1vKTsKICAgICAgICAgICAgdmFyIHB0cjEgPSBtZW1vLnB0cjsKICAgICAgICAgICAgbWVtby5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5cGFpciwgQVhmcktleVBhaXIpOwogICAgICAgICAgICB2YXIgcHRyMiA9IGtleXBhaXIucHRyOwogICAgICAgICAgICBrZXlwYWlyLnB0ciA9IDA7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhtdF9sZWFmX2luZm8sIE1UTGVhZkluZm8pOwogICAgICAgICAgICB2YXIgcHRyMyA9IG10X2xlYWZfaW5mby5wdHI7CiAgICAgICAgICAgIG10X2xlYWZfaW5mby5wdHIgPSAwOwogICAgICAgICAgICB3YXNtLmdlbl9udWxsaWZpZXJfaGFzaChyZXRwdHIsIHB0cjAsIHB0cjEsIHB0cjIsIHB0cjMpOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBSZXR1cm5zIGEgSmF2YVNjcmlwdCBvYmplY3QgY29udGFpbmluZyBkZWNyeXB0ZWQgb3duZXIgcmVjb3JkIGluZm9ybWF0aW9uLAogICAgKiB3aGVyZSBgYW1vdW50YCBpcyB0aGUgZGVjcnlwdGVkIGFzc2V0IGFtb3VudCwgYW5kIGBhc3NldF90eXBlYCBpcyB0aGUgZGVjcnlwdGVkIGFzc2V0IHR5cGUgY29kZS4KICAgICoKICAgICogQHBhcmFtIHtDbGllbnRBc3NldFJlY29yZH0gcmVjb3JkIC0gT3duZXIgcmVjb3JkLgogICAgKiBAcGFyYW0ge093bmVyTWVtb30gb3duZXJfbWVtbyAtIE93bmVyIG1lbW8gb2YgdGhlIGFzc29jaWF0ZWQgcmVjb3JkLgogICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleXBhaXIgLSBLZXlwYWlyIG9mIGFzc2V0IG93bmVyLgogICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtfkNsaWVudEFzc2V0UmVjb3JkI2Zyb21fanNvbl9yZWNvcmR8Q2xpZW50QXNzZXRSZWNvcmQuZnJvbV9qc29uX3JlY29yZH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byBjb25zdHJ1Y3QgYW4gYXNzZXQgcmVjb3JkIG9iamVjdAogICAgKiBmcm9tIGEgSlNPTiByZXN1bHQgcmV0dXJuZWQgZnJvbSB0aGUgbGVkZ2VyIHNlcnZlci4KICAgICogQHBhcmFtIHtDbGllbnRBc3NldFJlY29yZH0gcmVjb3JkCiAgICAqIEBwYXJhbSB7T3duZXJNZW1vIHwgdW5kZWZpbmVkfSBvd25lcl9tZW1vCiAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5cGFpcgogICAgKiBAcmV0dXJucyB7YW55fQogICAgKi8KICAgIGZ1bmN0aW9uIG9wZW5fY2xpZW50X2Fzc2V0X3JlY29yZChyZWNvcmQsIG93bmVyX21lbW8sIGtleXBhaXIpIHsKICAgICAgICBfYXNzZXJ0Q2xhc3MocmVjb3JkLCBDbGllbnRBc3NldFJlY29yZCk7CiAgICAgICAgbGV0IHB0cjAgPSAwOwogICAgICAgIGlmICghaXNMaWtlTm9uZShvd25lcl9tZW1vKSkgewogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Mob3duZXJfbWVtbywgT3duZXJNZW1vKTsKICAgICAgICAgICAgcHRyMCA9IG93bmVyX21lbW8ucHRyOwogICAgICAgICAgICBvd25lcl9tZW1vLnB0ciA9IDA7CiAgICAgICAgfQogICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5vcGVuX2NsaWVudF9hc3NldF9yZWNvcmQocmVjb3JkLnB0ciwgcHRyMCwga2V5cGFpci5wdHIpOwogICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIEV4dHJhY3RzIHRoZSBwdWJsaWMga2V5IGFzIGEgc3RyaW5nIGZyb20gYSB0cmFuc2ZlciBrZXkgcGFpci4KICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlfcGFpcgogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9wdWJfa2V5X3N0cihrZXlfcGFpcikgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5X3BhaXIsIFhmcktleVBhaXIpOwogICAgICAgICAgICB3YXNtLmdldF9wdWJfa2V5X3N0cihyZXRwdHIsIGtleV9wYWlyLnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEV4dHJhY3RzIHRoZSBwcml2YXRlIGtleSBhcyBhIHN0cmluZyBmcm9tIGEgdHJhbnNmZXIga2V5IHBhaXIuCiAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5X3BhaXIKICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBnZXRfcHJpdl9rZXlfc3RyKGtleV9wYWlyKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlfcGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHdhc20uZ2V0X3ByaXZfa2V5X3N0cihyZXRwdHIsIGtleV9wYWlyLnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwaHJhc2UKICAgICogQHBhcmFtIHtudW1iZXJ9IG51bQogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9wcml2X2tleV9oZXhfc3RyX2J5X21uZW1vbmljKHBocmFzZSwgbnVtKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocGhyYXNlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmdldF9wcml2X2tleV9oZXhfc3RyX2J5X21uZW1vbmljKHJldHB0ciwgcHRyMCwgbGVuMCwgbnVtKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGhleF9wcml2X2tleQogICAgKiBAcmV0dXJucyB7WGZyS2V5UGFpcn0KICAgICovCiAgICBmdW5jdGlvbiBnZXRfa2V5cGFpcl9ieV9wcmlfa2V5KGhleF9wcml2X2tleSkgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoaGV4X3ByaXZfa2V5LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20uZ2V0X2tleXBhaXJfYnlfcHJpX2tleShwdHIwLCBsZW4wKTsKICAgICAgICByZXR1cm4gWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGhleF9wcml2X2tleQogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9wdWJfa2V5X2hleF9zdHJfYnlfcHJpdl9rZXkoaGV4X3ByaXZfa2V5KSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoaGV4X3ByaXZfa2V5LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmdldF9wdWJfa2V5X2hleF9zdHJfYnlfcHJpdl9rZXkocmV0cHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGhleF9wdWJfa2V5CiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X2FkZHJlc3NfYnlfcHVibGljX2tleShoZXhfcHViX2tleSkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKGhleF9wdWJfa2V5LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmdldF9hZGRyZXNzX2J5X3B1YmxpY19rZXkocmV0cHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogRXh0cmFjdHMgdGhlIHB1YmxpYyBrZXkgYXMgYSBzdHJpbmcgZnJvbSBhIHRyYW5zZmVyIGtleSBwYWlyLgogICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleV9wYWlyCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X3B1Yl9rZXlfc3RyX29sZChrZXlfcGFpcikgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5X3BhaXIsIFhmcktleVBhaXIpOwogICAgICAgICAgICB3YXNtLmdldF9wdWJfa2V5X3N0cl9vbGQocmV0cHRyLCBrZXlfcGFpci5wdHIpOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBFeHRyYWN0cyB0aGUgcHJpdmF0ZSBrZXkgYXMgYSBzdHJpbmcgZnJvbSBhIHRyYW5zZmVyIGtleSBwYWlyLgogICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleV9wYWlyCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X3ByaXZfa2V5X3N0cl9vbGQoa2V5X3BhaXIpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleV9wYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgd2FzbS5nZXRfcHJpdl9rZXlfc3RyX29sZChyZXRwdHIsIGtleV9wYWlyLnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIENyZWF0ZXMgYSBuZXcgdHJhbnNmZXIga2V5IHBhaXIuCiAgICAqIEByZXR1cm5zIHtYZnJLZXlQYWlyfQogICAgKi8KICAgIGZ1bmN0aW9uIG5ld19rZXlwYWlyKCkgewogICAgICAgIHZhciByZXQgPSB3YXNtLm5ld19rZXlwYWlyKCk7CiAgICAgICAgcmV0dXJuIFhmcktleVBhaXIuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIENyZWF0ZXMgYSBuZXcgdHJhbnNmZXIga2V5IHBhaXIuCiAgICAqIEByZXR1cm5zIHtYZnJLZXlQYWlyfQogICAgKi8KICAgIGZ1bmN0aW9uIG5ld19rZXlwYWlyX29sZCgpIHsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5uZXdfa2V5cGFpcl9vbGQoKTsKICAgICAgICByZXR1cm4gWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogR2VuZXJhdGVzIGEgbmV3IGtleXBhaXIgZGV0ZXJtaW5pc3RpY2FsbHkgZnJvbSBhIHNlZWQgc3RyaW5nIGFuZCBhbiBvcHRpb25hbCBuYW1lLgogICAgKiBAcGFyYW0ge3N0cmluZ30gc2VlZF9zdHIKICAgICogQHBhcmFtIHtzdHJpbmcgfCB1bmRlZmluZWR9IG5hbWUKICAgICogQHJldHVybnMge1hmcktleVBhaXJ9CiAgICAqLwogICAgZnVuY3Rpb24gbmV3X2tleXBhaXJfZnJvbV9zZWVkKHNlZWRfc3RyLCBuYW1lKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWVkX3N0ciwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciBwdHIxID0gaXNMaWtlTm9uZShuYW1lKSA/IDAgOiBwYXNzU3RyaW5nVG9XYXNtMChuYW1lLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20ubmV3X2tleXBhaXJfZnJvbV9zZWVkKHB0cjAsIGxlbjAsIHB0cjEsIGxlbjEpOwogICAgICAgIHJldHVybiBYZnJLZXlQYWlyLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBSZXR1cm5zIGJhc2U2NCBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIGFuIFhmclB1YmxpY0tleS4KICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IGtleQogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIHB1YmxpY19rZXlfdG9fYmFzZTY0KGtleSkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5LCBYZnJQdWJsaWNLZXkpOwogICAgICAgICAgICB3YXNtLnB1YmxpY19rZXlfdG9fYmFzZTY0KHJldHB0ciwga2V5LnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIENvbnZlcnRzIGEgYmFzZTY0IGVuY29kZWQgcHVibGljIGtleSBzdHJpbmcgdG8gYSBwdWJsaWMga2V5LgogICAgKiBAcGFyYW0ge3N0cmluZ30gcGsKICAgICogQHJldHVybnMge1hmclB1YmxpY0tleX0KICAgICovCiAgICBmdW5jdGlvbiBwdWJsaWNfa2V5X2Zyb21fYmFzZTY0KHBrKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciByZXQgPSB3YXNtLnB1YmxpY19rZXlfZnJvbV9iYXNlNjQocHRyMCwgbGVuMCk7CiAgICAgICAgcmV0dXJuIFhmclB1YmxpY0tleS5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogRXhwcmVzc2VzIGEgdHJhbnNmZXIga2V5IHBhaXIgYXMgYSBoZXgtZW5jb2RlZCBzdHJpbmcuCiAgICAqIFRvIGRlY29kZSB0aGUgc3RyaW5nLCB1c2UgYGtleXBhaXJfZnJvbV9zdHJgIGZ1bmN0aW9uLgogICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleV9wYWlyCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24ga2V5cGFpcl90b19zdHIoa2V5X3BhaXIpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleV9wYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgd2FzbS5rZXlwYWlyX3RvX3N0cihyZXRwdHIsIGtleV9wYWlyLnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIENvbnN0cnVjdHMgYSB0cmFuc2ZlciBrZXkgcGFpciBmcm9tIGEgaGV4LWVuY29kZWQgc3RyaW5nLgogICAgKiBUaGUgZW5jb2RlIGEga2V5IHBhaXIsIHVzZSBga2V5cGFpcl90b19zdHJgIGZ1bmN0aW9uLgogICAgKiBAcGFyYW0ge3N0cmluZ30gc3RyCiAgICAqIEByZXR1cm5zIHtYZnJLZXlQYWlyfQogICAgKi8KICAgIGZ1bmN0aW9uIGtleXBhaXJfZnJvbV9zdHIoc3RyKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChzdHIsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5rZXlwYWlyX2Zyb21fc3RyKHB0cjAsIGxlbjApOwogICAgICAgIHJldHVybiBYZnJLZXlQYWlyLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBHZW5lcmF0ZXMgYSBuZXcgY3JlZGVudGlhbCBpc3N1ZXIga2V5LgogICAgKiBAcGFyYW0ge0pzVmFsdWV9IGF0dHJpYnV0ZXMgLSBBcnJheSBvZiBhdHRyaWJ1dGUgdHlwZXMgb2YgdGhlIGZvcm0gYFt7bmFtZTogImNyZWRpdF9zY29yZSIsCiAgICAqIHNpemU6IDN9XWAuIFRoZSBzaXplIHJlZmVycyB0byBieXRlLXNpemUgb2YgdGhlIGNyZWRlbnRpYWwuIEluIHRoaXMgY2FzZSwgdGhlICJjcmVkaXRfc2NvcmUiCiAgICAqIGF0dHJpYnV0ZSBpcyByZXByZXNlbnRlZCBhcyBhIDMgYnl0ZSBzdHJpbmcgIjc2MCIuIGBhdHRyaWJ1dGVzYCBpcyB0aGUgbGlzdCBvZiBhdHRyaWJ1dGUgdHlwZXMKICAgICogdGhhdCB0aGUgaXNzdWVyIGNhbiBzaWduIG9mZiBvbi4KICAgICogQHBhcmFtIHthbnl9IGF0dHJpYnV0ZXMKICAgICogQHJldHVybnMge0NyZWRlbnRpYWxJc3N1ZXJLZXlQYWlyfQogICAgKi8KICAgIGZ1bmN0aW9uIHdhc21fY3JlZGVudGlhbF9pc3N1ZXJfa2V5X2dlbihhdHRyaWJ1dGVzKSB7CiAgICAgICAgdmFyIHJldCA9IHdhc20ud2FzbV9jcmVkZW50aWFsX2lzc3Vlcl9rZXlfZ2VuKGFkZEhlYXBPYmplY3QoYXR0cmlidXRlcykpOwogICAgICAgIHJldHVybiBDcmVkZW50aWFsSXNzdWVyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogVmVyaWZpZXMgYSBjcmVkZW50aWFsIGNvbW1pdG1lbnQuIFVzZWQgdG8gY29uZmlybSB0aGF0IGEgY3JlZGVudGlhbCBpcyB0aWVkIHRvIGEgbGVkZ2VyCiAgICAqIGFkZHJlc3MuCiAgICAqIEBwYXJhbSB7Q3JlZElzc3VlclB1YmxpY0tleX0gaXNzdWVyX3B1Yl9rZXkgLSBUaGUgY3JlZGVudGlhbCBpc3N1ZXIgdGhhdCBoYXMgYXR0ZXN0ZWQgdG8gdGhlCiAgICAqIGNyZWRlbnRpYWxzIHRoYXQgaGF2ZSBiZWVuIGNvbW1pdHRlZCB0by4KICAgICogQHBhcmFtIHtDcmVkZW50aWFsQ29tbWl0bWVudH0gQ3JlZGVudGlhbCBjb21taXRtZW50CiAgICAqIEBwYXJhbSB7Q3JlZFBvS30gUHJvb2Ygb2Yga25vd2xlZGdlIG9mIHRoZSB1bmRlcmx5aW5nIGNvbW1pdG1lbnQKICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IExlZGdlciBhZGRyZXNzIGxpbmtlZCB0byB0aGlzIGNyZWRlbnRpYWwgY29tbWl0bWVudC4KICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGR1cmluZyB2ZXJpZmljYXRpb24gZmFpbHVyZSAoaS5lLiB0aGUgc3VwcGxpZWQgbGVkZ2VyIGFkZHJlc3MgaXMKICAgICogaW5jb3JyZWN0LCB0aGUgY29tbWl0bWVudCBpcyB0aWVkIHRvIGEgZGlmZmVyZW50IGNyZWRlbnRpYWwgaXNzdWVyLCBvciB0aGUgcHJvb2Ygb2Yga25vd2xlZGdlIGlzCiAgICAqIGludmFsaWQsIGV0Yy4pCiAgICAqIEBwYXJhbSB7Q3JlZElzc3VlclB1YmxpY0tleX0gaXNzdWVyX3B1Yl9rZXkKICAgICogQHBhcmFtIHtDcmVkZW50aWFsQ29tbWl0bWVudH0gY29tbWl0bWVudAogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWxQb0t9IHBvawogICAgKiBAcGFyYW0ge1hmclB1YmxpY0tleX0geGZyX3BrCiAgICAqLwogICAgZnVuY3Rpb24gd2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50KGlzc3Vlcl9wdWJfa2V5LCBjb21taXRtZW50LCBwb2ssIHhmcl9waykgewogICAgICAgIF9hc3NlcnRDbGFzcyhpc3N1ZXJfcHViX2tleSwgQ3JlZElzc3VlclB1YmxpY0tleSk7CiAgICAgICAgX2Fzc2VydENsYXNzKGNvbW1pdG1lbnQsIENyZWRlbnRpYWxDb21taXRtZW50KTsKICAgICAgICBfYXNzZXJ0Q2xhc3MocG9rLCBDcmVkZW50aWFsUG9LKTsKICAgICAgICBfYXNzZXJ0Q2xhc3MoeGZyX3BrLCBYZnJQdWJsaWNLZXkpOwogICAgICAgIHdhc20ud2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50KGlzc3Vlcl9wdWJfa2V5LnB0ciwgY29tbWl0bWVudC5wdHIsIHBvay5wdHIsIHhmcl9way5wdHIpOwogICAgfQoKICAgIC8qKgogICAgKiBHZW5lcmF0ZXMgYSBuZXcgcmV2ZWFsIHByb29mIGZyb20gYSBjcmVkZW50aWFsIGNvbW1pdG1lbnQga2V5LgogICAgKiBAcGFyYW0ge0NyZWRVc2VyU2VjcmV0S2V5fSB1c2VyX3NlY3JldF9rZXkgLSBTZWNyZXQga2V5IG9mIHRoZSBjcmVkZW50aWFsIHVzZXIgd2hvIG93bnMKICAgICogdGhlIGNyZWRlbnRpYWxzLgogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWx9IGNyZWRlbnRpYWwgLSBDcmVkZW50aWFsIHdob3NlIGF0dHJpYnV0ZXMgd2lsbCBiZSByZXZlYWxlZC4KICAgICogQHBhcmFtIHtKc1ZhbHVlfSByZXZlYWxfZmllbGRzIC0gQXJyYXkgb2Ygc3RyaW5ncyByZXByZXNlbnRpbmcgYXR0cmlidXRlIGZpZWxkcyB0byByZXZlYWwuCiAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhIHJldmVhbCBwcm9vZiBjYW5ub3QgYmUgZ2VuZXJhdGVkIGZyb20gdGhlIGNyZWRlbnRpYWwKICAgICogb3IgYGBgcmV2ZWFsX2ZpZWxkc2BgYCBmYWlscyB0byBkZXNlcmlhbGl6ZS4KICAgICogQHBhcmFtIHtDcmVkVXNlclNlY3JldEtleX0gdXNlcl9zZWNyZXRfa2V5CiAgICAqIEBwYXJhbSB7Q3JlZGVudGlhbH0gY3JlZGVudGlhbAogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWxDb21taXRtZW50S2V5fSBrZXkKICAgICogQHBhcmFtIHthbnl9IHJldmVhbF9maWVsZHMKICAgICogQHJldHVybnMge0NyZWRlbnRpYWxQb0t9CiAgICAqLwogICAgZnVuY3Rpb24gd2FzbV9jcmVkZW50aWFsX29wZW5fY29tbWl0bWVudCh1c2VyX3NlY3JldF9rZXksIGNyZWRlbnRpYWwsIGtleSwgcmV2ZWFsX2ZpZWxkcykgewogICAgICAgIF9hc3NlcnRDbGFzcyh1c2VyX3NlY3JldF9rZXksIENyZWRVc2VyU2VjcmV0S2V5KTsKICAgICAgICBfYXNzZXJ0Q2xhc3MoY3JlZGVudGlhbCwgQ3JlZGVudGlhbCk7CiAgICAgICAgX2Fzc2VydENsYXNzKGtleSwgQ3JlZGVudGlhbENvbW1pdG1lbnRLZXkpOwogICAgICAgIHZhciByZXQgPSB3YXNtLndhc21fY3JlZGVudGlhbF9vcGVuX2NvbW1pdG1lbnQodXNlcl9zZWNyZXRfa2V5LnB0ciwgY3JlZGVudGlhbC5wdHIsIGtleS5wdHIsIGFkZEhlYXBPYmplY3QocmV2ZWFsX2ZpZWxkcykpOwogICAgICAgIHJldHVybiBDcmVkZW50aWFsUG9LLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBHZW5lcmF0ZXMgYSBuZXcgY3JlZGVudGlhbCB1c2VyIGtleS4KICAgICogQHBhcmFtIHtDcmVkSXNzdWVyUHVibGljS2V5fSBpc3N1ZXJfcHViX2tleSAtIFRoZSBjcmVkZW50aWFsIGlzc3VlciB0aGF0IGNhbiBzaWduIG9mZiBvbiB0aGlzCiAgICAqIHVzZXIncyBhdHRyaWJ1dGVzLgogICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJQdWJsaWNLZXl9IGlzc3Vlcl9wdWJfa2V5CiAgICAqIEByZXR1cm5zIHtDcmVkZW50aWFsVXNlcktleVBhaXJ9CiAgICAqLwogICAgZnVuY3Rpb24gd2FzbV9jcmVkZW50aWFsX3VzZXJfa2V5X2dlbihpc3N1ZXJfcHViX2tleSkgewogICAgICAgIF9hc3NlcnRDbGFzcyhpc3N1ZXJfcHViX2tleSwgQ3JlZElzc3VlclB1YmxpY0tleSk7CiAgICAgICAgdmFyIHJldCA9IHdhc20ud2FzbV9jcmVkZW50aWFsX3VzZXJfa2V5X2dlbihpc3N1ZXJfcHViX2tleS5wdHIpOwogICAgICAgIHJldHVybiBDcmVkZW50aWFsVXNlcktleVBhaXIuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIEdlbmVyYXRlcyBhIHNpZ25hdHVyZSBvbiB1c2VyIGF0dHJpYnV0ZXMgdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBjcmVkZW50aWFsLgogICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJTZWNyZXRLZXl9IGlzc3Vlcl9zZWNyZXRfa2V5IC0gU2VjcmV0IGtleSBvZiBjcmVkZW50aWFsIGlzc3Vlci4KICAgICogQHBhcmFtIHtDcmVkVXNlclB1YmxpY0tleX0gdXNlcl9wdWJsaWNfa2V5IC0gUHVibGljIGtleSBvZiBjcmVkZW50aWFsIHVzZXIuCiAgICAqIEBwYXJhbSB7SnNWYWx1ZX0gYXR0cmlidXRlcyAtIEFycmF5IG9mIGF0dHJpYnV0ZSBhc3NpZ25tZW50cyBvZiB0aGUgZm9ybSBgW3tuYW1lOiAiY3JlZGl0X3Njb3JlIiwKICAgICogdmFsOiAiNzYwIn1dYC4KICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSBzaWduYXR1cmUgY2Fubm90IGJlIGdlbmVyYXRlZC4KICAgICogQHBhcmFtIHtDcmVkSXNzdWVyU2VjcmV0S2V5fSBpc3N1ZXJfc2VjcmV0X2tleQogICAgKiBAcGFyYW0ge0NyZWRVc2VyUHVibGljS2V5fSB1c2VyX3B1YmxpY19rZXkKICAgICogQHBhcmFtIHthbnl9IGF0dHJpYnV0ZXMKICAgICogQHJldHVybnMge0NyZWRlbnRpYWxTaWduYXR1cmV9CiAgICAqLwogICAgZnVuY3Rpb24gd2FzbV9jcmVkZW50aWFsX3NpZ24oaXNzdWVyX3NlY3JldF9rZXksIHVzZXJfcHVibGljX2tleSwgYXR0cmlidXRlcykgewogICAgICAgIF9hc3NlcnRDbGFzcyhpc3N1ZXJfc2VjcmV0X2tleSwgQ3JlZElzc3VlclNlY3JldEtleSk7CiAgICAgICAgX2Fzc2VydENsYXNzKHVzZXJfcHVibGljX2tleSwgQ3JlZFVzZXJQdWJsaWNLZXkpOwogICAgICAgIHZhciByZXQgPSB3YXNtLndhc21fY3JlZGVudGlhbF9zaWduKGlzc3Vlcl9zZWNyZXRfa2V5LnB0ciwgdXNlcl9wdWJsaWNfa2V5LnB0ciwgYWRkSGVhcE9iamVjdChhdHRyaWJ1dGVzKSk7CiAgICAgICAgcmV0dXJuIENyZWRlbnRpYWxTaWduYXR1cmUuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIEdlbmVyYXRlcyBhIHNpZ25hdHVyZSBvbiB1c2VyIGF0dHJpYnV0ZXMgdGhhdCBjYW4gYmUgdXNlZCB0byBjcmVhdGUgYSBjcmVkZW50aWFsLgogICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJQdWJsaWNLZXl9IGlzc3Vlcl9wdWJsaWNfa2V5IC0gUHVibGljIGtleSBvZiBjcmVkZW50aWFsIGlzc3Vlci4KICAgICogQHBhcmFtIHtDcmVkZW50aWFsU2lnbmF0dXJlfSBzaWduYXR1cmUgLSBDcmVkZW50aWFsIGlzc3VlciBzaWduYXR1cmUgb24gYXR0cmlidXRlcy4KICAgICogQHBhcmFtIHtKc1ZhbHVlfSBhdHRyaWJ1dGVzIC0gQXJyYXkgb2YgYXR0cmlidXRlIGFzc2lnbm1lbnRzIG9mIHRoZSBmb3JtIGBbe25hbWU6ICJjcmVkaXRfc2NvcmUiLAogICAgKiB2YWw6ICI3NjAifV0nLgogICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJQdWJsaWNLZXl9IGlzc3Vlcl9wdWJsaWNfa2V5CiAgICAqIEBwYXJhbSB7Q3JlZGVudGlhbFNpZ25hdHVyZX0gc2lnbmF0dXJlCiAgICAqIEBwYXJhbSB7YW55fSBhdHRyaWJ1dGVzCiAgICAqIEByZXR1cm5zIHtDcmVkZW50aWFsfQogICAgKi8KICAgIGZ1bmN0aW9uIGNyZWF0ZV9jcmVkZW50aWFsKGlzc3Vlcl9wdWJsaWNfa2V5LCBzaWduYXR1cmUsIGF0dHJpYnV0ZXMpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoaXNzdWVyX3B1YmxpY19rZXksIENyZWRJc3N1ZXJQdWJsaWNLZXkpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moc2lnbmF0dXJlLCBDcmVkZW50aWFsU2lnbmF0dXJlKTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uY3JlYXRlX2NyZWRlbnRpYWwoaXNzdWVyX3B1YmxpY19rZXkucHRyLCBzaWduYXR1cmUucHRyLCBhZGRCb3Jyb3dlZE9iamVjdChhdHRyaWJ1dGVzKSk7CiAgICAgICAgICAgIHJldHVybiBDcmVkZW50aWFsLl9fd3JhcChyZXQpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEdlbmVyYXRlcyBhIGNyZWRlbnRpYWwgY29tbWl0bWVudC4gQSBjcmVkZW50aWFsIGNvbW1pdG1lbnQgY2FuIGJlIHVzZWQgdG8gc2VsZWN0aXZlbHkgcmV2ZWFsCiAgICAqIGF0dHJpYnV0ZSBhc3NpZ25tZW50cy4KICAgICogQHBhcmFtIHtDcmVkVXNlclNlY3JldEtleX0gdXNlcl9zZWNyZXRfa2V5IC0gU2VjcmV0IGtleSBvZiBjcmVkZW50aWFsIHVzZXIuCiAgICAqIEBwYXJhbSB7WGZyUHVibGljS2V5fSB1c2VyX3B1YmxpY19rZXkgLSBMZWRnZXIgc2lnbmluZyBrZXkgdG8gbGluayB0aGlzIGNyZWRlbnRpYWwgdG8uCiAgICAqIEBwYXJhbSB7Q3JlZGVudGlhbH0gY3JlZGVudGlhbCAtIENyZWRlbnRpYWwgb2JqZWN0LgogICAgKiBAcGFyYW0ge0NyZWRVc2VyU2VjcmV0S2V5fSB1c2VyX3NlY3JldF9rZXkKICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IHVzZXJfcHVibGljX2tleQogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWx9IGNyZWRlbnRpYWwKICAgICogQHJldHVybnMge0NyZWRlbnRpYWxDb21taXRtZW50RGF0YX0KICAgICovCiAgICBmdW5jdGlvbiB3YXNtX2NyZWRlbnRpYWxfY29tbWl0KHVzZXJfc2VjcmV0X2tleSwgdXNlcl9wdWJsaWNfa2V5LCBjcmVkZW50aWFsKSB7CiAgICAgICAgX2Fzc2VydENsYXNzKHVzZXJfc2VjcmV0X2tleSwgQ3JlZFVzZXJTZWNyZXRLZXkpOwogICAgICAgIF9hc3NlcnRDbGFzcyh1c2VyX3B1YmxpY19rZXksIFhmclB1YmxpY0tleSk7CiAgICAgICAgX2Fzc2VydENsYXNzKGNyZWRlbnRpYWwsIENyZWRlbnRpYWwpOwogICAgICAgIHZhciByZXQgPSB3YXNtLndhc21fY3JlZGVudGlhbF9jb21taXQodXNlcl9zZWNyZXRfa2V5LnB0ciwgdXNlcl9wdWJsaWNfa2V5LnB0ciwgY3JlZGVudGlhbC5wdHIpOwogICAgICAgIHJldHVybiBDcmVkZW50aWFsQ29tbWl0bWVudERhdGEuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIFNlbGVjdGl2ZWx5IHJldmVhbHMgYXR0cmlidXRlcyBjb21taXR0ZWQgdG8gaW4gYSBjcmVkZW50aWFsIGNvbW1pdG1lbnQKICAgICogQHBhcmFtIHtDcmVkVXNlclNlY3JldEtleX0gdXNlcl9zayAtIFNlY3JldCBrZXkgb2YgY3JlZGVudGlhbCB1c2VyLgogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWx9IGNyZWRlbnRpYWwgLSBDcmVkZW50aWFsIG9iamVjdC4KICAgICogQHBhcmFtIHtKc1ZhbHVlfSByZXZlYWxfZmllbGRzIC0gQXJyYXkgb2Ygc3RyaW5nIG5hbWVzIHJlcHJlc2VudGluZyBjcmVkZW50aWFscyB0byByZXZlYWwgKGkuZS4KICAgICogYFsiY3JlZGl0X3Njb3JlIl1gKS4KICAgICogQHBhcmFtIHtDcmVkVXNlclNlY3JldEtleX0gdXNlcl9zawogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWx9IGNyZWRlbnRpYWwKICAgICogQHBhcmFtIHthbnl9IHJldmVhbF9maWVsZHMKICAgICogQHJldHVybnMge0NyZWRlbnRpYWxSZXZlYWxTaWd9CiAgICAqLwogICAgZnVuY3Rpb24gd2FzbV9jcmVkZW50aWFsX3JldmVhbCh1c2VyX3NrLCBjcmVkZW50aWFsLCByZXZlYWxfZmllbGRzKSB7CiAgICAgICAgX2Fzc2VydENsYXNzKHVzZXJfc2ssIENyZWRVc2VyU2VjcmV0S2V5KTsKICAgICAgICBfYXNzZXJ0Q2xhc3MoY3JlZGVudGlhbCwgQ3JlZGVudGlhbCk7CiAgICAgICAgdmFyIHJldCA9IHdhc20ud2FzbV9jcmVkZW50aWFsX3JldmVhbCh1c2VyX3NrLnB0ciwgY3JlZGVudGlhbC5wdHIsIGFkZEhlYXBPYmplY3QocmV2ZWFsX2ZpZWxkcykpOwogICAgICAgIHJldHVybiBDcmVkZW50aWFsUmV2ZWFsU2lnLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBWZXJpZmllcyByZXZlYWxlZCBhdHRyaWJ1dGVzIGZyb20gYSBjb21taXRtZW50LgogICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJQdWJsaWNLZXl9IGlzc3Vlcl9wdWJfa2V5IC0gUHVibGljIGtleSBvZiBjcmVkZW50aWFsIGlzc3Vlci4KICAgICogQHBhcmFtIHtKc1ZhbHVlfSBhdHRyaWJ1dGVzIC0gQXJyYXkgb2YgYXR0cmlidXRlIGFzc2lnbm1lbnRzIHRvIGNoZWNrIG9mIHRoZSBmb3JtIGBbe25hbWU6ICJjcmVkaXRfc2NvcmUiLAogICAgKiB2YWw6ICI3NjAifV1gLgogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWxDb21taXRtZW50fSBjb21taXRtZW50IC0gQ29tbWl0bWVudCB0byB0aGUgY3JlZGVudGlhbC4KICAgICogQHBhcmFtIHtDcmVkZW50aWFsUG9LfSBwb2sgLSBQcm9vZiB0aGF0IHRoZSBjcmVkZW50aWFsIGNvbW1pdG1lbnQgaXMgdmFsaWQgYW5kIGNvbW1pdHMKICAgICogdG8gdGhlIGF0dHJpYnV0ZSB2YWx1ZXMgYmVpbmcgcmV2ZWFsZWQuCiAgICAqIEBwYXJhbSB7Q3JlZElzc3VlclB1YmxpY0tleX0gaXNzdWVyX3B1Yl9rZXkKICAgICogQHBhcmFtIHthbnl9IGF0dHJpYnV0ZXMKICAgICogQHBhcmFtIHtDcmVkZW50aWFsQ29tbWl0bWVudH0gY29tbWl0bWVudAogICAgKiBAcGFyYW0ge0NyZWRlbnRpYWxQb0t9IHBvawogICAgKi8KICAgIGZ1bmN0aW9uIHdhc21fY3JlZGVudGlhbF92ZXJpZnkoaXNzdWVyX3B1Yl9rZXksIGF0dHJpYnV0ZXMsIGNvbW1pdG1lbnQsIHBvaykgewogICAgICAgIF9hc3NlcnRDbGFzcyhpc3N1ZXJfcHViX2tleSwgQ3JlZElzc3VlclB1YmxpY0tleSk7CiAgICAgICAgX2Fzc2VydENsYXNzKGNvbW1pdG1lbnQsIENyZWRlbnRpYWxDb21taXRtZW50KTsKICAgICAgICBfYXNzZXJ0Q2xhc3MocG9rLCBDcmVkZW50aWFsUG9LKTsKICAgICAgICB3YXNtLndhc21fY3JlZGVudGlhbF92ZXJpZnkoaXNzdWVyX3B1Yl9rZXkucHRyLCBhZGRIZWFwT2JqZWN0KGF0dHJpYnV0ZXMpLCBjb21taXRtZW50LnB0ciwgcG9rLnB0cik7CiAgICB9CgogICAgLyoqCiAgICAqIFJldHVybnMgaW5mb3JtYXRpb24gYWJvdXQgdHJhY2VhYmxlIGFzc2V0cyBmb3IgYSBnaXZlbiB0cmFuc2Zlci4KICAgICogQHBhcmFtIHtKc1ZhbHVlfSB4ZnJfYm9keSAtIEpTT04gb2YgYSB0cmFuc2ZlciBub3RlIGZyb20gYSB0cmFuc2ZlciBvcGVyYXRpb24uCiAgICAqIEBwYXJhbSB7QXNzZXRUcmFjZXJLZXlQYWlyfSB0cmFjZXJfa2V5cGFpciAtIEFzc2V0IHRyYWNlciBrZXlwYWlyLgogICAgKiBAcGFyYW0ge0pzVmFsdWV9IGNhbmRpZGF0ZV9hc3NldHMgLSBMaXN0IG9mIGFzc2V0IHR5cGVzIHRyYWNlZCBieSB0aGUgdHJhY2VyIGtleXBhaXIuCiAgICAqIEBwYXJhbSB7YW55fSB4ZnJfYm9keQogICAgKiBAcGFyYW0ge0Fzc2V0VHJhY2VyS2V5UGFpcn0gdHJhY2VyX2tleXBhaXIKICAgICogQHBhcmFtIHthbnl9IF9jYW5kaWRhdGVfYXNzZXRzCiAgICAqIEByZXR1cm5zIHthbnl9CiAgICAqLwogICAgZnVuY3Rpb24gdHJhY2VfYXNzZXRzKHhmcl9ib2R5LCB0cmFjZXJfa2V5cGFpciwgX2NhbmRpZGF0ZV9hc3NldHMpIHsKICAgICAgICBfYXNzZXJ0Q2xhc3ModHJhY2VyX2tleXBhaXIsIEFzc2V0VHJhY2VyS2V5UGFpcik7CiAgICAgICAgdmFyIHJldCA9IHdhc20udHJhY2VfYXNzZXRzKGFkZEhlYXBPYmplY3QoeGZyX2JvZHkpLCB0cmFjZXJfa2V5cGFpci5wdHIsIGFkZEhlYXBPYmplY3QoX2NhbmRpZGF0ZV9hc3NldHMpKTsKICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBSZXR1cm5zIGJlY2gzMiBlbmNvZGVkIHJlcHJlc2VudGF0aW9uIG9mIGFuIFhmclB1YmxpY0tleS4KICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IGtleQogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIHB1YmxpY19rZXlfdG9fYmVjaDMyKGtleSkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5LCBYZnJQdWJsaWNLZXkpOwogICAgICAgICAgICB3YXNtLnB1YmxpY19rZXlfdG9fYmVjaDMyKHJldHB0ciwga2V5LnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIENvbnZlcnRzIGEgYmVjaDMyIGVuY29kZWQgcHVibGljIGtleSBzdHJpbmcgdG8gYSBwdWJsaWMga2V5LgogICAgKiBAcGFyYW0ge3N0cmluZ30gYWRkcgogICAgKiBAcmV0dXJucyB7WGZyUHVibGljS2V5fQogICAgKi8KICAgIGZ1bmN0aW9uIHB1YmxpY19rZXlfZnJvbV9iZWNoMzIoYWRkcikgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoYWRkciwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciByZXQgPSB3YXNtLnB1YmxpY19rZXlfZnJvbV9iZWNoMzIocHRyMCwgbGVuMCk7CiAgICAgICAgcmV0dXJuIFhmclB1YmxpY0tleS5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IHBrCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gYmVjaDMyX3RvX2Jhc2U2NChwaykgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHBrLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmJlY2gzMl90b19iYXNlNjQocmV0cHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IHBrCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gYmVjaDMyX3RvX2Jhc2U2NF9vbGQocGspIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwaywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgd2FzbS5iZWNoMzJfdG9fYmFzZTY0X29sZChyZXRwdHIsIHB0cjAsIGxlbjApOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBAcGFyYW0ge3N0cmluZ30gcGsKICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBiYXNlNjRfdG9fYmVjaDMyKHBrKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocGssIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20uYmFzZTY0X3RvX2JlY2gzMihyZXRwdHIsIHB0cjAsIGxlbjApOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBAcGFyYW0ge3N0cmluZ30gZGF0YQogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGJhc2U2NF90b19iYXNlNTgoZGF0YSkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKGRhdGEsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20uYmFzZTY0X3RvX2Jhc2U1OChyZXRwdHIsIHB0cjAsIGxlbjApOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIGZ1bmN0aW9uIGdldEFycmF5VThGcm9tV2FzbTAocHRyLCBsZW4pIHsKICAgICAgICByZXR1cm4gZ2V0VWludDhNZW1vcnkwKCkuc3ViYXJyYXkocHRyIC8gMSwgcHRyIC8gMSArIGxlbik7CiAgICB9CiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGtleV9wYWlyCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZAogICAgKiBAcmV0dXJucyB7VWludDhBcnJheX0KICAgICovCiAgICBmdW5jdGlvbiBlbmNyeXB0aW9uX3Bia2RmMl9hZXMyNTZnY20oa2V5X3BhaXIsIHBhc3N3b3JkKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoa2V5X3BhaXIsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocGFzc3dvcmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20uZW5jcnlwdGlvbl9wYmtkZjJfYWVzMjU2Z2NtKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB2YXIgdjIgPSBnZXRBcnJheVU4RnJvbVdhc20wKHIwLCByMSkuc2xpY2UoKTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxICogMSk7CiAgICAgICAgICAgIHJldHVybiB2MjsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiBwYXNzQXJyYXk4VG9XYXNtMChhcmcsIG1hbGxvYykgewogICAgICAgIGNvbnN0IHB0ciA9IG1hbGxvYyhhcmcubGVuZ3RoICogMSk7CiAgICAgICAgZ2V0VWludDhNZW1vcnkwKCkuc2V0KGFyZywgcHRyIC8gMSk7CiAgICAgICAgV0FTTV9WRUNUT1JfTEVOID0gYXJnLmxlbmd0aDsKICAgICAgICByZXR1cm4gcHRyOwogICAgfQogICAgLyoqCiAgICAqIEBwYXJhbSB7VWludDhBcnJheX0gZW5jX2tleV9wYWlyCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBwYXNzd29yZAogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGRlY3J5cHRpb25fcGJrZGYyX2FlczI1NmdjbShlbmNfa2V5X3BhaXIsIHBhc3N3b3JkKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc0FycmF5OFRvV2FzbTAoZW5jX2tleV9wYWlyLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAocGFzc3dvcmQsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHdhc20uZGVjcnlwdGlvbl9wYmtkZjJfYWVzMjU2Z2NtKHJldHB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSk7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBza19zdHIKICAgICogQHJldHVybnMge1hmcktleVBhaXJ9CiAgICAqLwogICAgZnVuY3Rpb24gY3JlYXRlX2tleXBhaXJfZnJvbV9zZWNyZXQoc2tfc3RyKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChza19zdHIsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVhdGVfa2V5cGFpcl9mcm9tX3NlY3JldChwdHIwLCBsZW4wKTsKICAgICAgICByZXR1cm4gWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrcAogICAgKiBAcmV0dXJucyB7WGZyUHVibGljS2V5fQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9wa19mcm9tX2tleXBhaXIoa3ApIHsKICAgICAgICBfYXNzZXJ0Q2xhc3Moa3AsIFhmcktleVBhaXIpOwogICAgICAgIHZhciByZXQgPSB3YXNtLmdldF9wa19mcm9tX2tleXBhaXIoa3AucHRyKTsKICAgICAgICByZXR1cm4gWGZyUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBSYW5kb21seSBnZW5lcmF0ZSBhIDEyd29yZHMtbGVuZ3RoIG1uZW1vbmljLgogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGdlbmVyYXRlX21uZW1vbmljX2RlZmF1bHQoKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHdhc20uZ2VuZXJhdGVfbW5lbW9uaWNfZGVmYXVsdChyZXRwdHIpOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBHZW5lcmF0ZSBtbmVtb25pYyB3aXRoIGN1c3RvbSBsZW5ndGggYW5kIGxhbmd1YWdlLgogICAgKiAtIEBwYXJhbSBgd29yZHNsZW5gOiBhY2NlcHRhYmxlIHZhbHVlIGFyZSBvbmUgb2YgWyAxMiwgMTUsIDE4LCAyMSwgMjQgXQogICAgKiAtIEBwYXJhbSBgbGFuZ2A6IGFjY2VwdGFibGUgdmFsdWUgYXJlIG9uZSBvZiBbICJlbiIsICJ6aCIsICJ6aF90cmFkaXRpb25hbCIsICJmciIsICJpdCIsICJrbyIsICJzcCIsICJqcCIgXQogICAgKiBAcGFyYW0ge251bWJlcn0gd29yZHNsZW4KICAgICogQHBhcmFtIHtzdHJpbmd9IGxhbmcKICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBnZW5lcmF0ZV9tbmVtb25pY19jdXN0b20od29yZHNsZW4sIGxhbmcpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChsYW5nLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmdlbmVyYXRlX21uZW1vbmljX2N1c3RvbShyZXRwdHIsIHdvcmRzbGVuLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogUmVzdG9yZSB0aGUgWGZyS2V5UGFpciBmcm9tIGEgbW5lbW9uaWMgd2l0aCBhIGRlZmF1bHQgYmlwNDQtcGF0aCwKICAgICogdGhhdCBpcyAibS80NCcvOTE3Jy8wJy8wLzAiICgibS80NCcvY29pbicvYWNjb3VudCcvY2hhbmdlL2FkZHJlc3MiKS4KICAgICogQHBhcmFtIHtzdHJpbmd9IHBocmFzZQogICAgKiBAcmV0dXJucyB7WGZyS2V5UGFpcn0KICAgICovCiAgICBmdW5jdGlvbiByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19kZWZhdWx0KHBocmFzZSkgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocGhyYXNlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20ucmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfZGVmYXVsdChwdHIwLCBsZW4wKTsKICAgICAgICByZXR1cm4gWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogUmVzdG9yZSB0aGUgWGZyS2V5UGFpciBmcm9tIGEgbW5lbW9uaWMgd2l0aCBhIGRlZmF1bHQgYmlwNDQtcGF0aCwKICAgICogdGhhdCBpcyAibS80NCcvOTE3Jy8wJy8wLzAiICgibS80NCcvY29pbicvYWNjb3VudCcvY2hhbmdlL2FkZHJlc3MiKS4KICAgICogQHBhcmFtIHtzdHJpbmd9IHBocmFzZQogICAgKiBAcmV0dXJucyB7WGZyS2V5UGFpcn0KICAgICovCiAgICBmdW5jdGlvbiByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19lZDI1NTE5KHBocmFzZSkgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocGhyYXNlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20ucmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfZWQyNTUxOShwdHIwLCBsZW4wKTsKICAgICAgICByZXR1cm4gWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogUmVzdG9yZSB0aGUgWGZyS2V5UGFpciBmcm9tIGEgbW5lbW9uaWMgd2l0aCBjdXN0b20gcGFyYW1zLAogICAgKiBpbiBiaXA0NCBmb3JtLgogICAgKiBAcGFyYW0ge3N0cmluZ30gcGhyYXNlCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBsYW5nCiAgICAqIEBwYXJhbSB7QmlwUGF0aH0gcGF0aAogICAgKiBAcmV0dXJucyB7WGZyS2V5UGFpcn0KICAgICovCiAgICBmdW5jdGlvbiByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19iaXA0NChwaHJhc2UsIGxhbmcsIHBhdGgpIHsKICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHBocmFzZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAobGFuZywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIF9hc3NlcnRDbGFzcyhwYXRoLCBCaXBQYXRoKTsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5yZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19iaXA0NChwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwYXRoLnB0cik7CiAgICAgICAgcmV0dXJuIFhmcktleVBhaXIuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIFJlc3RvcmUgdGhlIFhmcktleVBhaXIgZnJvbSBhIG1uZW1vbmljIHdpdGggY3VzdG9tIHBhcmFtcywKICAgICogaW4gYmlwNDkgZm9ybS4KICAgICogQHBhcmFtIHtzdHJpbmd9IHBocmFzZQogICAgKiBAcGFyYW0ge3N0cmluZ30gbGFuZwogICAgKiBAcGFyYW0ge0JpcFBhdGh9IHBhdGgKICAgICogQHJldHVybnMge1hmcktleVBhaXJ9CiAgICAqLwogICAgZnVuY3Rpb24gcmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfYmlwNDkocGhyYXNlLCBsYW5nLCBwYXRoKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwaHJhc2UsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGxhbmcsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICBfYXNzZXJ0Q2xhc3MocGF0aCwgQmlwUGF0aCk7CiAgICAgICAgdmFyIHJldCA9IHdhc20ucmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfYmlwNDkocHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcGF0aC5wdHIpOwogICAgICAgIHJldHVybiBYZnJLZXlQYWlyLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBJRCBvZiBGUkEsIGluIGBTdHJpbmdgIGZvcm1hdC4KICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBmcmFfZ2V0X2Fzc2V0X2NvZGUoKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIHdhc20uZnJhX2dldF9hc3NldF9jb2RlKHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEZlZSBzbWFsbGVyIHRoYW4gdGhpcyB2YWx1ZSB3aWxsIGJlIGRlbmllZC4KICAgICogQHJldHVybnMge0JpZ0ludH0KICAgICovCiAgICBmdW5jdGlvbiBmcmFfZ2V0X21pbmltYWxfZmVlKCkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB3YXNtLmZyYV9nZXRfbWluaW1hbF9mZWUocmV0cHRyKTsKICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgIHUzMkN2dFNoaW1bMF0gPSByMDsKICAgICAgICAgICAgdTMyQ3Z0U2hpbVsxXSA9IHIxOwogICAgICAgICAgICBjb25zdCBuMCA9IHVpbnQ2NEN2dFNoaW1bMF07CiAgICAgICAgICAgIHJldHVybiBuMDsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogRmVlIHNtYWxsZXIgdGhhbiB0aGlzIHZhbHVlIHdpbGwgYmUgZGVuaWVkLgogICAgKiBAcmV0dXJucyB7QmlnSW50fQogICAgKi8KICAgIGZ1bmN0aW9uIGZyYV9nZXRfbWluaW1hbF9mZWVfZm9yX2Jhcl90b19hYmFyKCkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB3YXNtLmZyYV9nZXRfbWluaW1hbF9mZWVfZm9yX2Jhcl90b19hYmFyKHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgIHUzMkN2dFNoaW1bMV0gPSByMTsKICAgICAgICAgICAgY29uc3QgbjAgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICByZXR1cm4gbjA7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEFub24gZmVlIGZvciBhIGdpdmVuIG51bWJlciBvZiBpbnB1dHMgJiBvdXRwdXRzCiAgICAqIEBwYXJhbSB7bnVtYmVyfSBuX2lucHV0cwogICAgKiBAcGFyYW0ge251bWJlcn0gbl9vdXRwdXRzCiAgICAqIEByZXR1cm5zIHtudW1iZXJ9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X2Fub25fZmVlKG5faW5wdXRzLCBuX291dHB1dHMpIHsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5nZXRfYW5vbl9mZWUobl9pbnB1dHMsIG5fb3V0cHV0cyk7CiAgICAgICAgcmV0dXJuIHJldCA+Pj4gMDsKICAgIH0KCiAgICAvKioKICAgICogVGhlIGRlc3RpbmF0aW9uIGZvciBmZWUgdG8gYmUgdHJhbnNmZXJlZCB0by4KICAgICogQHJldHVybnMge1hmclB1YmxpY0tleX0KICAgICovCiAgICBmdW5jdGlvbiBmcmFfZ2V0X2Rlc3RfcHVia2V5KCkgewogICAgICAgIHZhciByZXQgPSB3YXNtLmZyYV9nZXRfZGVzdF9wdWJrZXkoKTsKICAgICAgICByZXR1cm4gWGZyUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBUaGUgc3lzdGVtIGFkZHJlc3MgdXNlZCB0byByZXZlaXZlIGRlbGVnYXRpb24gcHJpbmNpcGFscy4KICAgICogQHJldHVybnMge3N0cmluZ30KICAgICovCiAgICBmdW5jdGlvbiBnZXRfZGVsZWdhdGlvbl90YXJnZXRfYWRkcmVzcygpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgd2FzbS5nZXRfY29pbmJhc2VfYWRkcmVzcyhyZXRwdHIpOwogICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgfQogICAgfQoKICAgIC8qKgogICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgKi8KICAgIGZ1bmN0aW9uIGdldF9jb2luYmFzZV9hZGRyZXNzKCkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB3YXNtLmdldF9jb2luYmFzZV9hZGRyZXNzKHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X2NvaW5iYXNlX3ByaW5jaXBhbF9hZGRyZXNzKCkgewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICB3YXNtLmdldF9jb2luYmFzZV9hZGRyZXNzKHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEByZXR1cm5zIHtCaWdJbnR9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X2RlbGVnYXRpb25fbWluX2Ftb3VudCgpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgd2FzbS5nZXRfZGVsZWdhdGlvbl9taW5fYW1vdW50KHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgIHUzMkN2dFNoaW1bMV0gPSByMTsKICAgICAgICAgICAgY29uc3QgbjAgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICByZXR1cm4gbjA7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEByZXR1cm5zIHtCaWdJbnR9CiAgICAqLwogICAgZnVuY3Rpb24gZ2V0X2RlbGVnYXRpb25fbWF4X2Ftb3VudCgpIHsKICAgICAgICB0cnkgewogICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgd2FzbS5nZXRfZGVsZWdhdGlvbl9tYXhfYW1vdW50KHJldHB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgIHUzMkN2dFNoaW1bMV0gPSByMTsKICAgICAgICAgICAgY29uc3QgbjAgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICByZXR1cm4gbjA7CiAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICB9CiAgICB9CgogICAgLyoqCiAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlfc3RyCiAgICAqIEByZXR1cm5zIHtBWGZyUHViS2V5fQogICAgKi8KICAgIGZ1bmN0aW9uIGF4ZnJfcHVia2V5X2Zyb21fc3RyaW5nKGtleV9zdHIpIHsKICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKGtleV9zdHIsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICB2YXIgcmV0ID0gd2FzbS5heGZyX3B1YmtleV9mcm9tX3N0cmluZyhwdHIwLCBsZW4wKTsKICAgICAgICByZXR1cm4gQVhmclB1YktleS5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGtleV9zdHIKICAgICogQHJldHVybnMge0FYZnJLZXlQYWlyfQogICAgKi8KICAgIGZ1bmN0aW9uIGF4ZnJfa2V5cGFpcl9mcm9tX3N0cmluZyhrZXlfc3RyKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChrZXlfc3RyLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20uYXhmcl9rZXlwYWlyX2Zyb21fc3RyaW5nKHB0cjAsIGxlbjApOwogICAgICAgIHJldHVybiBBWGZyS2V5UGFpci5fX3dyYXAocmV0KTsKICAgIH0KCiAgICAvKioKICAgICogQHBhcmFtIHtzdHJpbmd9IGtleV9zdHIKICAgICogQHJldHVybnMge1hQdWJsaWNLZXl9CiAgICAqLwogICAgZnVuY3Rpb24geF9wdWJrZXlfZnJvbV9zdHJpbmcoa2V5X3N0cikgewogICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoa2V5X3N0ciwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIHZhciByZXQgPSB3YXNtLnhfcHVia2V5X2Zyb21fc3RyaW5nKHB0cjAsIGxlbjApOwogICAgICAgIHJldHVybiBYUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBAcGFyYW0ge3N0cmluZ30ga2V5X3N0cgogICAgKiBAcmV0dXJucyB7WFNlY3JldEtleX0KICAgICovCiAgICBmdW5jdGlvbiB4X3NlY3JldGtleV9mcm9tX3N0cmluZyhrZXlfc3RyKSB7CiAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChrZXlfc3RyLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgdmFyIHJldCA9IHdhc20ueF9zZWNyZXRrZXlfZnJvbV9zdHJpbmcocHRyMCwgbGVuMCk7CiAgICAgICAgcmV0dXJuIFhTZWNyZXRLZXkuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIEBwYXJhbSB7YW55fSBqc29uCiAgICAqIEByZXR1cm5zIHtBbm9uQXNzZXRSZWNvcmR9CiAgICAqLwogICAgZnVuY3Rpb24gYWJhcl9mcm9tX2pzb24oanNvbikgewogICAgICAgIHZhciByZXQgPSB3YXNtLmFiYXJfZnJvbV9qc29uKGFkZEhlYXBPYmplY3QoanNvbikpOwogICAgICAgIHJldHVybiBBbm9uQXNzZXRSZWNvcmQuX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIERlY3J5cHRzIGFuIEFCQVIgd2l0aCBvd25lciBtZW1vIGFuZCBkZWNyeXB0aW9uIGtleQogICAgKiBAcGFyYW0ge0Fub25Bc3NldFJlY29yZH0gYWJhcgogICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG1lbW8KICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0ga2V5cGFpcgogICAgKiBAcmV0dXJucyB7QW1vdW50QXNzZXRUeXBlfQogICAgKi8KICAgIGZ1bmN0aW9uIG9wZW5fYWJhcihhYmFyLCBtZW1vLCBrZXlwYWlyKSB7CiAgICAgICAgX2Fzc2VydENsYXNzKGFiYXIsIEFub25Bc3NldFJlY29yZCk7CiAgICAgICAgdmFyIHB0cjAgPSBhYmFyLnB0cjsKICAgICAgICBhYmFyLnB0ciA9IDA7CiAgICAgICAgX2Fzc2VydENsYXNzKG1lbW8sIEF4ZnJPd25lck1lbW8pOwogICAgICAgIHZhciBwdHIxID0gbWVtby5wdHI7CiAgICAgICAgbWVtby5wdHIgPSAwOwogICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBBWGZyS2V5UGFpcik7CiAgICAgICAgdmFyIHJldCA9IHdhc20ub3Blbl9hYmFyKHB0cjAsIHB0cjEsIGtleXBhaXIucHRyKTsKICAgICAgICByZXR1cm4gQW1vdW50QXNzZXRUeXBlLl9fd3JhcChyZXQpOwogICAgfQoKICAgIC8qKgogICAgKiBEZWNyeXB0cyB0aGUgb3duZXIgYW5vbiBtZW1vLgogICAgKiAqIGBtZW1vYCAtIE93bmVyIGFub24gbWVtbyB0byBkZWNyeXB0CiAgICAqICogYGtleV9wYWlyYCAtIE93bmVyIGFub24ga2V5cGFpcgogICAgKiAqIGBhYmFyYCAtIEFzc29jaWF0ZWQgYW5vbnltb3VzIGJsaW5kIGFzc2V0IHJlY29yZCB0byBjaGVjayBtZW1vIGluZm8gYWdhaW5zdC4KICAgICogUmV0dXJuIEVycm9yIGlmIG1lbW8gaW5mbyBkb2VzIG5vdCBtYXRjaCB0aGUgY29tbWl0bWVudCBvciBwdWJsaWMga2V5LgogICAgKiBSZXR1cm4gT2soYW1vdW50LCBhc3NldF90eXBlLCBibGluZGluZykgb3RoZXJ3aXNlLgogICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG1lbW8KICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0ga2V5X3BhaXIKICAgICogQHBhcmFtIHtBbm9uQXNzZXRSZWNvcmR9IGFiYXIKICAgICogQHJldHVybnMge0F4ZnJPd25lck1lbW9JbmZvfQogICAgKi8KICAgIGZ1bmN0aW9uIGRlY3J5cHRfYXhmcl9tZW1vKG1lbW8sIGtleV9wYWlyLCBhYmFyKSB7CiAgICAgICAgX2Fzc2VydENsYXNzKG1lbW8sIEF4ZnJPd25lck1lbW8pOwogICAgICAgIF9hc3NlcnRDbGFzcyhrZXlfcGFpciwgQVhmcktleVBhaXIpOwogICAgICAgIF9hc3NlcnRDbGFzcyhhYmFyLCBBbm9uQXNzZXRSZWNvcmQpOwogICAgICAgIHZhciByZXQgPSB3YXNtLmRlY3J5cHRfYXhmcl9tZW1vKG1lbW8ucHRyLCBrZXlfcGFpci5wdHIsIGFiYXIucHRyKTsKICAgICAgICByZXR1cm4gQXhmck93bmVyTWVtb0luZm8uX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIFRyeSB0byBkZWNyeXB0IHRoZSBvd25lciBtZW1vIHRvIGNoZWNrIGlmIGl0IGlzIG93bi4KICAgICogKiBgbWVtb2AgLSBPd25lciBhbm9uIG1lbW8gbmVlZCB0byBkZWNyeXB0LgogICAgKiAqIGBrZXlfcGFpcmAgLSB0aGUgbWVtbyBieXRlcy4KICAgICogUmV0dXJuIE9rKGFtb3VudCwgYXNzZXRfdHlwZSwgYmxpbmRpbmcpIGlmIG1lbW8gaXMgb3duLgogICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG1lbW8KICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0ga2V5X3BhaXIKICAgICogQHJldHVybnMge1VpbnQ4QXJyYXl9CiAgICAqLwogICAgZnVuY3Rpb24gdHJ5X2RlY3J5cHRfYXhmcl9tZW1vKG1lbW8sIGtleV9wYWlyKSB7CiAgICAgICAgdHJ5IHsKICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhtZW1vLCBBeGZyT3duZXJNZW1vKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleV9wYWlyLCBBWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHdhc20udHJ5X2RlY3J5cHRfYXhmcl9tZW1vKHJldHB0ciwgbWVtby5wdHIsIGtleV9wYWlyLnB0cik7CiAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICB2YXIgdjAgPSBnZXRBcnJheVU4RnJvbVdhc20wKHIwLCByMSkuc2xpY2UoKTsKICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxICogMSk7CiAgICAgICAgICAgIHJldHVybiB2MDsKICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgIH0KICAgIH0KCiAgICAvKioKICAgICogUGFyc2UgdGhlIG93bmVyIG1lbW8gZnJvbSBieXRlcy4KICAgICogKiBgYnl0ZXNgIC0gdGhlIG1lbW8gcGxhaW4gYnl0ZXMuCiAgICAqICogYGtleV9wYWlyYCAtIHRoZSBtZW1vIGJ5dGVzLgogICAgKiAqIGBhYmFyYCAtIEFzc29jaWF0ZWQgYW5vbnltb3VzIGJsaW5kIGFzc2V0IHJlY29yZCB0byBjaGVjayBtZW1vIGluZm8gYWdhaW5zdC4KICAgICogUmV0dXJuIEVycm9yIGlmIG1lbW8gaW5mbyBkb2VzIG5vdCBtYXRjaCB0aGUgY29tbWl0bWVudC4KICAgICogUmV0dXJuIE9rKGFtb3VudCwgYXNzZXRfdHlwZSwgYmxpbmRpbmcpIG90aGVyd2lzZS4KICAgICogQHBhcmFtIHtVaW50OEFycmF5fSBieXRlcwogICAgKiBAcGFyYW0ge0FYZnJLZXlQYWlyfSBrZXlfcGFpcgogICAgKiBAcGFyYW0ge0Fub25Bc3NldFJlY29yZH0gYWJhcgogICAgKiBAcmV0dXJucyB7QXhmck93bmVyTWVtb0luZm99CiAgICAqLwogICAgZnVuY3Rpb24gcGFyc2VfYXhmcl9tZW1vKGJ5dGVzLCBrZXlfcGFpciwgYWJhcikgewogICAgICAgIHZhciBwdHIwID0gcGFzc0FycmF5OFRvV2FzbTAoYnl0ZXMsIHdhc20uX193YmluZGdlbl9tYWxsb2MpOwogICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgIF9hc3NlcnRDbGFzcyhrZXlfcGFpciwgQVhmcktleVBhaXIpOwogICAgICAgIF9hc3NlcnRDbGFzcyhhYmFyLCBBbm9uQXNzZXRSZWNvcmQpOwogICAgICAgIHZhciByZXQgPSB3YXNtLnBhcnNlX2F4ZnJfbWVtbyhwdHIwLCBsZW4wLCBrZXlfcGFpci5wdHIsIGFiYXIucHRyKTsKICAgICAgICByZXR1cm4gQXhmck93bmVyTWVtb0luZm8uX193cmFwKHJldCk7CiAgICB9CgogICAgLyoqCiAgICAqIENvbnZlcnQgQ29tbWl0bWVudCB0byBBbm9uQXNzZXRSZWNvcmQuCiAgICAqIEBwYXJhbSB7QkxTU2NhbGFyfSBjb21taXRtZW50CiAgICAqIEByZXR1cm5zIHtBbm9uQXNzZXRSZWNvcmR9CiAgICAqLwogICAgZnVuY3Rpb24gY29tbWl0bWVudF90b19hYXIoY29tbWl0bWVudCkgewogICAgICAgIF9hc3NlcnRDbGFzcyhjb21taXRtZW50LCBCTFNTY2FsYXIpOwogICAgICAgIHZhciBwdHIwID0gY29tbWl0bWVudC5wdHI7CiAgICAgICAgY29tbWl0bWVudC5wdHIgPSAwOwogICAgICAgIHZhciByZXQgPSB3YXNtLmNvbW1pdG1lbnRfdG9fYWFyKHB0cjApOwogICAgICAgIHJldHVybiBBbm9uQXNzZXRSZWNvcmQuX193cmFwKHJldCk7CiAgICB9CgogICAgZnVuY3Rpb24gaGFuZGxlRXJyb3IoZikgewogICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICByZXR1cm4gZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpOwoKICAgICAgICAgICAgfSBjYXRjaCAoZSkgewogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2V4bl9zdG9yZShhZGRIZWFwT2JqZWN0KGUpKTsKICAgICAgICAgICAgfQogICAgICAgIH07CiAgICB9CiAgICAvKioKICAgICogS2V5cGFpciBhc3NvY2lhdGVkIHdpdGggYW4gQW5vbnltb3VzIHJlY29yZHMuIEl0IGlzIHVzZWQgdG8gc3BlbmRpbmcgaXQuCiAgICAqIFRoZSBrZXkgcGFpciBmb3IgYW5vbnltb3VzIHBheW1lbnQuCiAgICAqLwogICAgY2xhc3MgQVhmcktleVBhaXIgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKEFYZnJLZXlQYWlyLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYXhmcmtleXBhaXJfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBUaGUgcHVibGljIGtleS4KICAgICovCiAgICBjbGFzcyBBWGZyUHViS2V5IHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShBWGZyUHViS2V5LnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYXhmcnB1YmtleV9mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqLwogICAgY2xhc3MgQW1vdW50QXNzZXRUeXBlIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShBbW91bnRBc3NldFR5cGUucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19hbW91bnRhc3NldHR5cGVfZnJlZShwdHIpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEByZXR1cm5zIHtCaWdJbnR9CiAgICAgICAgKi8KICAgICAgICBnZXQgYW1vdW50KCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JnX2dldF9hbW91bnRhc3NldHR5cGVfYW1vdW50KHJldHB0ciwgdGhpcy5wdHIpOwogICAgICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICAgICAgdTMyQ3Z0U2hpbVswXSA9IHIwOwogICAgICAgICAgICAgICAgdTMyQ3Z0U2hpbVsxXSA9IHIxOwogICAgICAgICAgICAgICAgY29uc3QgbjAgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICAgICAgcmV0dXJuIG4wOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhcmcwCiAgICAgICAgKi8KICAgICAgICBzZXQgYW1vdW50KGFyZzApIHsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IGFyZzA7CiAgICAgICAgICAgIGNvbnN0IGxvdzAgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMCA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHdhc20uX193Ymdfc2V0X2Ftb3VudGFzc2V0dHlwZV9hbW91bnQodGhpcy5wdHIsIGxvdzAsIGhpZ2gwKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgZ2V0IGFzc2V0X3R5cGUoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgICAgIHdhc20uYW1vdW50YXNzZXR0eXBlX2Fzc2V0X3R5cGUocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBBc3NldCByZWNvcmQgdG8gYmUgcHV0IGFzIGxlYXZlcyBvbiB0aGUgdHJlZS4KICAgICovCiAgICBjbGFzcyBBbm9uQXNzZXRSZWNvcmQgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKEFub25Bc3NldFJlY29yZC5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2Fub25hc3NldHJlY29yZF9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVGhlIGNvbW1pdG1lbnQuCiAgICAgICAgKiBAcmV0dXJucyB7QkxTU2NhbGFyfQogICAgICAgICovCiAgICAgICAgZ2V0IGNvbW1pdG1lbnQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLl9fd2JnX2dldF9hbm9uYXNzZXRyZWNvcmRfY29tbWl0bWVudCh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBCTFNTY2FsYXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVGhlIGNvbW1pdG1lbnQuCiAgICAgICAgKiBAcGFyYW0ge0JMU1NjYWxhcn0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IGNvbW1pdG1lbnQoYXJnMCkgewogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXJnMCwgQkxTU2NhbGFyKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBhcmcwLnB0cjsKICAgICAgICAgICAgYXJnMC5wdHIgPSAwOwogICAgICAgICAgICB3YXNtLl9fd2JnX3NldF9hbm9uYXNzZXRyZWNvcmRfY29tbWl0bWVudCh0aGlzLnB0ciwgcHRyMCk7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIEFub25LZXlzIGlzIHVzZWQgdG8gc3RvcmUga2V5cyBmb3IgQW5vbiBwcm9vZnMKICAgICovCiAgICBjbGFzcyBBbm9uS2V5cyB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQW5vbktleXMucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19hbm9ua2V5c19mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHthbnl9IGpzb24KICAgICAgICAqIEByZXR1cm5zIHtBbm9uS2V5c30KICAgICAgICAqLwogICAgICAgIHN0YXRpYyBmcm9tX2pzb24oanNvbikgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYW5vbmtleXNfZnJvbV9qc29uKGFkZEJvcnJvd2VkT2JqZWN0KGpzb24pKTsKICAgICAgICAgICAgICAgIHJldHVybiBBbm9uS2V5cy5fX3dyYXAocmV0KTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICB0b19qc29uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hbm9ua2V5c190b19qc29uKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgZ2V0IHNlY3JldF9rZXkoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgICAgIHdhc20uYW5vbmtleXNfc2VjcmV0X2tleShyZXRwdHIsIHRoaXMucHRyKTsKICAgICAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHNlY3JldF9rZXkKICAgICAgICAqLwogICAgICAgIHNldCBzZWNyZXRfa2V5KHNlY3JldF9rZXkpIHsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChzZWNyZXRfa2V5LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmFub25rZXlzX3NldF9zZWNyZXRfa2V5KHRoaXMucHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgZ2V0IHB1Yl9rZXkoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgICAgIHdhc20uYW5vbmtleXNfcHViX2tleShyZXRwdHIsIHRoaXMucHRyKTsKICAgICAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHB1Yl9rZXkKICAgICAgICAqLwogICAgICAgIHNldCBwdWJfa2V5KHB1Yl9rZXkpIHsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChwdWJfa2V5LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB3YXNtLmFub25rZXlzX3NldF9wdWJfa2V5KHRoaXMucHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU3RydWN0dXJlIHRoYXQgZW5hYmxlcyBjbGllbnRzIHRvIGNvbnN0cnVjdCBjb21wbGV4IHRyYW5zZmVycy4KICAgICovCiAgICBjbGFzcyBBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYW5vbnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogbmV3IGlzIGEgY29uc3RydWN0b3IgZm9yIEFub25UcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXIKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBzZXFfaWQKICAgICAgICAqIEByZXR1cm5zIHtBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgc3RhdGljIG5ldyhzZXFfaWQpIHsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IHNlcV9pZDsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYW5vbnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9uZXcobG93MCwgaGlnaDApOwogICAgICAgICAgICByZXR1cm4gQW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBhZGRfaW5wdXQgaXMgdXNlZCB0byBhZGQgYSBuZXcgaW5wdXQgc291cmNlIGZvciBBbm9uIFRyYW5zZmVyCiAgICAgICAgKiBAcGFyYW0ge0Fub25Bc3NldFJlY29yZH0gYWJhciAtIGlucHV0IEFCQVIgdG8gdHJhbnNmZXIKICAgICAgICAqIEBwYXJhbSB7QXhmck93bmVyTWVtb30gbWVtbyAtIG1lbW8gY29ycmVzcG9uZGluZyB0byB0aGUgaW5wdXQgYWJhcgogICAgICAgICogQHBhcmFtIGtleXBhaXIge0FYZnJLZXlQYWlyfSAtIEFYZnJLZXlQYWlyIG9mIHRoZSBBQkFSIG93bmVyCiAgICAgICAgKiBAcGFyYW0gTVRMZWFmSW5mbyB7bXRfbGVhZl9pbmZvfSAtIHRoZSBNZXJrbGUgcHJvb2Ygb2YgdGhlIEFCQVIgZnJvbSBjb21taXRtZW50IHRyZWUKICAgICAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiBhYmFyIGZhaWxzIHRvIG9wZW4sIGlucHV0IGZhaWxzIHRvIGdldCBhZGRlZCB0byBPcGVyYXRpb24KICAgICAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBhYmFyCiAgICAgICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG1lbW8KICAgICAgICAqIEBwYXJhbSB7QVhmcktleVBhaXJ9IGtleXBhaXIKICAgICAgICAqIEBwYXJhbSB7TVRMZWFmSW5mb30gbXRfbGVhZl9pbmZvCiAgICAgICAgKiBAcmV0dXJucyB7QW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9pbnB1dChhYmFyLCBtZW1vLCBrZXlwYWlyLCBtdF9sZWFmX2luZm8pIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGFiYXIsIEFub25Bc3NldFJlY29yZCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhtZW1vLCBBeGZyT3duZXJNZW1vKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleXBhaXIsIEFYZnJLZXlQYWlyKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKG10X2xlYWZfaW5mbywgTVRMZWFmSW5mbyk7CiAgICAgICAgICAgIHZhciBwdHIwID0gbXRfbGVhZl9pbmZvLnB0cjsKICAgICAgICAgICAgbXRfbGVhZl9pbmZvLnB0ciA9IDA7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFub250cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfYWRkX2lucHV0KHB0ciwgYWJhci5wdHIsIG1lbW8ucHRyLCBrZXlwYWlyLnB0ciwgcHRyMCk7CiAgICAgICAgICAgIHJldHVybiBBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIGFkZF9vdXRwdXQgaXMgdXNlZCB0byBhZGQgYSBvdXRwdXQgdG8gdGhlIEFub24gVHJhbnNmZXIKICAgICAgICAqIEBwYXJhbSBhbW91bnQge3U2NH0gLSBhbW91bnQgdG8gYmUgc2VudCB0byB0aGUgcmVjZWl2ZXIKICAgICAgICAqIEBwYXJhbSB0byB7QVhmclB1YktleX0gLSBvcmlnaW5hbCBwdWIga2V5IG9mIHJlY2VpdmVyCiAgICAgICAgKiBAdGhyb3dzIGVycm9yIGlmIEFCQVIgZmFpbHMgdG8gYmUgYnVpbHQKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBhc3NldF90eXBlCiAgICAgICAgKiBAcGFyYW0ge0FYZnJQdWJLZXl9IHRvCiAgICAgICAgKiBAcmV0dXJucyB7QW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9vdXRwdXQoYW1vdW50LCBhc3NldF90eXBlLCB0bykgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gYW1vdW50OwogICAgICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGFzc2V0X3R5cGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyh0bywgQVhmclB1YktleSk7CiAgICAgICAgICAgIHZhciBwdHIyID0gdG8ucHRyOwogICAgICAgICAgICB0by5wdHIgPSAwOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hbm9udHJhbnNmZXJvcGVyYXRpb25idWlsZGVyX2FkZF9vdXRwdXQocHRyLCBsb3cwLCBoaWdoMCwgcHRyMSwgbGVuMSwgcHRyMik7CiAgICAgICAgICAgIHJldHVybiBBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIGFkZF9rZXlwYWlyIGlzIHVzZWQgdG8gYWRkIHRoZSBzZW5kZXIncyBrZXlwYWlyIGZvciB0aGUgbnVsbGlmaWVyIGdlbmVyYXRpb24KICAgICAgICAqIEBwYXJhbSB0byB7QVhmcktleVBhaXJ9IC0gb3JpZ2luYWwga2V5cGFpciBvZiBzZW5kZXIKICAgICAgICAqIEB0aHJvd3MgZXJyb3IgaWYgQUJBUiBmYWlscyB0byBiZSBidWlsdAogICAgICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0ga2V5cGFpcgogICAgICAgICogQHJldHVybnMge0Fub25UcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfa2V5cGFpcihrZXlwYWlyKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBBWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFub250cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfYWRkX2tleXBhaXIocHRyLCBrZXlwYWlyLnB0cik7CiAgICAgICAgICAgIHJldHVybiBBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIGdldF9leHBlY3RlZF9mZWUgaXMgdXNlZCB0byBnYXRoZXIgZXh0cmEgRlJBIHRoYXQgbmVlZHMgdG8gYmUgc3BlbnQgdG8gbWFrZSB0aGUgdHJhbnNhY3Rpb24KICAgICAgICAqIGhhdmUgZW5vdWdoIGZlZXMuCiAgICAgICAgKiBAcmV0dXJucyB7QmlnSW50fQogICAgICAgICovCiAgICAgICAgZ2V0X2V4cGVjdGVkX2ZlZSgpIHsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICAgICAgd2FzbS5hbm9udHJhbnNmZXJvcGVyYXRpb25idWlsZGVyX2dldF9leHBlY3RlZF9mZWUocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgICAgICB1MzJDdnRTaGltWzFdID0gcjE7CiAgICAgICAgICAgICAgICBjb25zdCBuMCA9IHVpbnQ2NEN2dFNoaW1bMF07CiAgICAgICAgICAgICAgICByZXR1cm4gbjA7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogZ2V0X3RvdGFsX2ZlZV9lc3RpbWF0ZQogICAgICAgICogQHJldHVybnMge0JpZ0ludH0KICAgICAgICAqLwogICAgICAgIGdldF90b3RhbF9mZWVfZXN0aW1hdGUoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgICAgIHdhc20uYW5vbnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9nZXRfdG90YWxfZmVlX2VzdGltYXRlKHJldHB0ciwgdGhpcy5wdHIpOwogICAgICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICAgICAgdTMyQ3Z0U2hpbVswXSA9IHIwOwogICAgICAgICAgICAgICAgdTMyQ3Z0U2hpbVsxXSA9IHIxOwogICAgICAgICAgICAgICAgY29uc3QgbjAgPSB1aW50NjRDdnRTaGltWzBdOwogICAgICAgICAgICAgICAgcmV0dXJuIG4wOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIGdldF9jb21taXRtZW50cyByZXR1cm5zIGEgbGlzdCBvZiBhbGwgdGhlIGNvbW1pdG1lbnRzIGZvciByZWNlaXZlciBwdWJsaWMga2V5cwogICAgICAgICogQHJldHVybnMge2FueX0KICAgICAgICAqLwogICAgICAgIGdldF9jb21taXRtZW50cygpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYW5vbnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9nZXRfY29tbWl0bWVudHModGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIGdldF9jb21taXRtZW50X21hcCByZXR1cm5zIGEgaGFzaG1hcCBvZiBhbGwgdGhlIGNvbW1pdG1lbnRzIG1hcHBlZCB0byBwdWJsaWMga2V5LCBhc3NldCwgYW1vdW50CiAgICAgICAgKiBAcmV0dXJucyB7YW55fQogICAgICAgICovCiAgICAgICAgZ2V0X2NvbW1pdG1lbnRfbWFwKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hbm9udHJhbnNmZXJvcGVyYXRpb25idWlsZGVyX2dldF9jb21taXRtZW50X21hcCh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogYnVpbGQgaXMgdXNlZCB0byBidWlsZCBwcm9vZiB0aGUgVHJhbnNmZXIgT3BlcmF0aW9uCiAgICAgICAgKiBAcmV0dXJucyB7QW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGJ1aWxkKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hbm9udHJhbnNmZXJvcGVyYXRpb25idWlsZGVyX2J1aWxkKHB0cik7CiAgICAgICAgICAgIHJldHVybiBBbm9uVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIHRyYW5zYWN0aW9uIHJldHVybnMgdGhlIHByZXBhcmVkIEFub24gVHJhbnNmZXIgT3BlcmF0aW9uCiAgICAgICAgKiBAcGFyYW0gbm9uY2Uge05vUmVwbGF5VG9rZW59IC0gbm9uY2Ugb2YgdGhlIHR4biB0byBiZSBhZGRlZCB0byB0aGUgb3BlcmF0aW9uCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgdHJhbnNhY3Rpb24oKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLmFub250cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfdHJhbnNhY3Rpb24ocmV0cHRyLCBwdHIpOwogICAgICAgICAgICAgICAgdmFyIHIwID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDBdOwogICAgICAgICAgICAgICAgdmFyIHIxID0gZ2V0SW50MzJNZW1vcnkwKClbcmV0cHRyIC8gNCArIDFdOwogICAgICAgICAgICAgICAgcmV0dXJuIGdldFN0cmluZ0Zyb21XYXNtMChyMCwgcjEpOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKDE2KTsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9mcmVlKHIwLCByMSk7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogV2hlbiBhbiBhc3NldCBpcyBkZWZpbmVkLCBzZXZlcmFsIG9wdGlvbnMgZ292ZXJuaW5nIHRoZSBhc3NldHMgbXVzdCBiZQogICAgKiBzcGVjaWZpZWQ6CiAgICAqIDEuICoqVHJhY2VhYmxlKio6IFJlY29yZHMgYW5kIGlkZW50aXRpZXMgb2YgdHJhY2VhYmxlIGFzc2V0cyBjYW4gYmUgZGVjcnlwdGVkIGJ5IGEgcHJvdmlkZWQgdHJhY2luZyBrZXkuIEJ5IGRlZmF1bHRzLCBhc3NldHMgZG8gbm90IGhhdmUKICAgICogYW55IHRyYWNpbmcgcG9saWNpZXMuCiAgICAqIDIuICoqVHJhbnNmZXJhYmxlKio6IE5vbi10cmFuc2ZlcmFibGUgYXNzZXRzIGNhbiBvbmx5IGJlIHRyYW5zZmVycmVkIG9uY2UgZnJvbSB0aGUgaXNzdWVyIHRvIGFub3RoZXIgdXNlci4gQnkgZGVmYXVsdCwgYXNzZXRzIGFyZSB0cmFuc2ZlcmFibGUuCiAgICAqIDMuICoqVXBkYXRhYmxlKio6IFdoZXRoZXIgdGhlIGFzc2V0IG1lbW8gY2FuIGJlIHVwZGF0ZWQuIEJ5IGRlZmF1bHQsIGFzc2V0cyBhcmUgbm90IHVwZGF0YWJsZS4KICAgICogNC4gKipUcmFuc2ZlciBzaWduYXR1cmUgcnVsZXMqKjogU2lnbmF0dXJlIHdlaWdodHMgYW5kIHRocmVzaG9sZCBmb3IgYSB2YWxpZCB0cmFuc2Zlci4gQnkKICAgICogICAgZGVmYXVsdCwgdGhlcmUgYXJlIG5vIHNwZWNpYWwgc2lnbmF0dXJlIHJlcXVpcmVtZW50cy4KICAgICogNS4gKipNYXggdW5pdHMqKjogT3B0aW9uYWwgbGltaXQgb24gdGhlIHRvdGFsIG51bWJlciBvZiB1bml0cyBvZiB0aGlzIGFzc2V0IHRoYXQgY2FuIGJlIGlzc3VlZC4KICAgICogICAgQnkgZGVmYXVsdCwgYXNzZXRzIGRvIG5vdCBoYXZlIGlzc3VhbmNlIGNhcHMuCiAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc21+VHJhY2luZ1BvbGljaWVzfFRyYWNpbmdQb2xpY2llc30gZm9yIG1vcmUgaW5mb3JtYXRpb24gYWJvdXQgdHJhY2luZyBwb2xpY2llcy4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbX5UcmFuc2FjdGlvbkJ1aWxkZXIjYWRkX29wZXJhdGlvbl91cGRhdGVfbWVtb3xhZGRfb3BlcmF0aW9uX3VwZGF0ZV9tZW1vfSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8gYWRkCiAgICAqIGEgbWVtbyB1cGRhdGUgb3BlcmF0aW9uIHRvIGEgdHJhbnNhY3Rpb24uCiAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc21+U2lnbmF0dXJlUnVsZXN8U2lnbmF0dXJlUnVsZXN9IGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGNvLXNpZ25hdHVyZXMuCiAgICAqIEBzZWUge0BsaW5rCiAgICAqIG1vZHVsZTpGaW5kb3JhLVdhc21+VHJhbnNhY3Rpb25CdWlsZGVyI2FkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0fGFkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0fQogICAgKiBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIGFkZCBhc3NldCBydWxlcyB0byBhbiBhc3NldCBkZWZpbml0aW9uLgogICAgKi8KICAgIGNsYXNzIEFzc2V0UnVsZXMgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKEFzc2V0UnVsZXMucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19hc3NldHJ1bGVzX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBDcmVhdGUgYSBkZWZhdWx0IHNldCBvZiBhc3NldCBydWxlcy4gU2VlIGNsYXNzIGRlc2NyaXB0aW9uIGZvciBkZWZhdWx0cy4KICAgICAgICAqIEByZXR1cm5zIHtBc3NldFJ1bGVzfQogICAgICAgICovCiAgICAgICAgc3RhdGljIG5ldygpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYXNzZXRydWxlc19uZXcoKTsKICAgICAgICAgICAgcmV0dXJuIEFzc2V0UnVsZXMuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQWRkcyBhbiBhc3NldCB0cmFjaW5nIHBvbGljeS4KICAgICAgICAqIEBwYXJhbSB7VHJhY2luZ1BvbGljeX0gcG9saWN5IC0gVHJhY2luZyBwb2xpY3kgZm9yIHRoZSBuZXcgYXNzZXQuCiAgICAgICAgKiBAcGFyYW0ge1RyYWNpbmdQb2xpY3l9IHBvbGljeQogICAgICAgICogQHJldHVybnMge0Fzc2V0UnVsZXN9CiAgICAgICAgKi8KICAgICAgICBhZGRfdHJhY2luZ19wb2xpY3kocG9saWN5KSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhwb2xpY3ksIFRyYWNpbmdQb2xpY3kpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hc3NldHJ1bGVzX2FkZF90cmFjaW5nX3BvbGljeShwdHIsIHBvbGljeS5wdHIpOwogICAgICAgICAgICByZXR1cm4gQXNzZXRSdWxlcy5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBTZXQgYSBjYXAgb24gdGhlIG51bWJlciBvZiB1bml0cyBvZiB0aGlzIGFzc2V0IHRoYXQgY2FuIGJlIGlzc3VlZC4KICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBtYXhfdW5pdHMgLSBNYXhpbXVtIG51bWJlciBvZiB1bml0cyB0aGF0IGNhbiBiZSBpc3N1ZWQuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gbWF4X3VuaXRzCiAgICAgICAgKiBAcmV0dXJucyB7QXNzZXRSdWxlc30KICAgICAgICAqLwogICAgICAgIHNldF9tYXhfdW5pdHMobWF4X3VuaXRzKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBtYXhfdW5pdHM7CiAgICAgICAgICAgIGNvbnN0IGxvdzAgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMCA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFzc2V0cnVsZXNfc2V0X21heF91bml0cyhwdHIsIGxvdzAsIGhpZ2gwKTsKICAgICAgICAgICAgcmV0dXJuIEFzc2V0UnVsZXMuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVHJhbnNmZXJhYmlsaXR5IHRvZ2dsZS4gQXNzZXRzIHRoYXQgYXJlIG5vdCB0cmFuc2ZlcmFibGUgY2FuIG9ubHkgYmUgdHJhbnNmZXJyZWQgYnkgdGhlIGFzc2V0CiAgICAgICAgKiBpc3N1ZXIuCiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRyYW5zZmVyYWJsZSAtIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIGFzc2V0IGNhbiBiZSB0cmFuc2ZlcnJlZC4KICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJhbnNmZXJhYmxlCiAgICAgICAgKiBAcmV0dXJucyB7QXNzZXRSdWxlc30KICAgICAgICAqLwogICAgICAgIHNldF90cmFuc2ZlcmFibGUodHJhbnNmZXJhYmxlKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFzc2V0cnVsZXNfc2V0X3RyYW5zZmVyYWJsZShwdHIsIHRyYW5zZmVyYWJsZSk7CiAgICAgICAgICAgIHJldHVybiBBc3NldFJ1bGVzLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFRoZSB1cGRhdGFibGUgZmxhZyBkZXRlcm1pbmVzIHdoZXRoZXIgdGhlIGFzc2V0IG1lbW8gY2FuIGJlIHVwZGF0ZWQgYWZ0ZXIgaXNzdWFuY2UuCiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0YWJsZSAtIEJvb2xlYW4gaW5kaWNhdGluZyB3aGV0aGVyIGFzc2V0IG1lbW8gY2FuIGJlIHVwZGF0ZWQuCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtflRyYW5zYWN0aW9uQnVpbGRlciNhZGRfb3BlcmF0aW9uX3VwZGF0ZV9tZW1vfGFkZF9vcGVyYXRpb25fdXBkYXRlX21lbW99IGZvciBtb3JlIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byBhZGQKICAgICAgICAqIGEgbWVtbyB1cGRhdGUgb3BlcmF0aW9uIHRvIGEgdHJhbnNhY3Rpb24uCiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHVwZGF0YWJsZQogICAgICAgICogQHJldHVybnMge0Fzc2V0UnVsZXN9CiAgICAgICAgKi8KICAgICAgICBzZXRfdXBkYXRhYmxlKHVwZGF0YWJsZSkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hc3NldHJ1bGVzX3NldF91cGRhdGFibGUocHRyLCB1cGRhdGFibGUpOwogICAgICAgICAgICByZXR1cm4gQXNzZXRSdWxlcy5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBDby1zaWduYXR1cmUgcnVsZXMuIEFzc2V0cyB3aXRoIGNvLXNpZ25hdHVlIHJ1bGVzIHJlcXVpcmUgYWRkaXRpb25hbCB3ZWlnaHRlZCBzaWduYXR1cmVzIHRvCiAgICAgICAgKiBiZSB0cmFuc2ZlcnJlZC4KICAgICAgICAqIEBwYXJhbSB7U2lnbmF0dXJlUnVsZXN9IG11bHRpc2lnX3J1bGVzIC0gQ28tc2lnbmF0dXJlIHJlc3RyaWN0aW9ucy4KICAgICAgICAqIEBwYXJhbSB7U2lnbmF0dXJlUnVsZXN9IG11bHRpc2lnX3J1bGVzCiAgICAgICAgKiBAcmV0dXJucyB7QXNzZXRSdWxlc30KICAgICAgICAqLwogICAgICAgIHNldF90cmFuc2Zlcl9tdWx0aXNpZ19ydWxlcyhtdWx0aXNpZ19ydWxlcykgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MobXVsdGlzaWdfcnVsZXMsIFNpZ25hdHVyZVJ1bGVzKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBtdWx0aXNpZ19ydWxlcy5wdHI7CiAgICAgICAgICAgIG11bHRpc2lnX3J1bGVzLnB0ciA9IDA7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFzc2V0cnVsZXNfc2V0X3RyYW5zZmVyX211bHRpc2lnX3J1bGVzKHB0ciwgcHRyMCk7CiAgICAgICAgICAgIHJldHVybiBBc3NldFJ1bGVzLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFNldCB0aGUgZGVjaW1hbCBudW1iZXIgb2YgYXNzZXQuIFJldHVybiBlcnJvciBzdHJpbmcgaWYgZmFpbGVkLCBvdGhlcndpc2UgcmV0dXJuIGNoYW5nZWQgYXNzZXQuCiAgICAgICAgKiAjcGFyYW0ge051bWJlcn0gZGVjaW1hbHMgLSBUaGUgbnVtYmVyIG9mIGRlY2ltYWxzIHVzZWQgdG8gc2V0IGl0cyB1c2VyIHJlcHJlc2VudGF0aW9uLgogICAgICAgICogRGVjaW1hbHMgc2hvdWxkIGJlIDAgfiAyNTUuCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVjaW1hbHMKICAgICAgICAqIEByZXR1cm5zIHtBc3NldFJ1bGVzfQogICAgICAgICovCiAgICAgICAgc2V0X2RlY2ltYWxzKGRlY2ltYWxzKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmFzc2V0cnVsZXNfc2V0X2RlY2ltYWxzKHB0ciwgZGVjaW1hbHMpOwogICAgICAgICAgICByZXR1cm4gQXNzZXRSdWxlcy5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogS2V5IHBhaXIgdXNlZCBieSBhc3NldCB0cmFjZXJzIHRvIGRlY3J5cHQgYXNzZXQgYW1vdW50cywgdHlwZXMsIGFuZCBpZGVudGl0eQogICAgKiBjb21taXRtZW50cyBhc3NvY2lhdGVkIHdpdGggdHJhY2VhYmxlIGFzc2V0IHRyYW5zZmVycy4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbS5UcmFjaW5nUG9saWN5fFRyYWNpbmdQb2xpY3l9IGZvciBpbmZvcm1hdGlvbiBhYm91dCB0cmFjaW5nIHBvbGljaWVzLgogICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtfkFzc2V0UnVsZXMjYWRkX3RyYWNpbmdfcG9saWN5fGFkZF90cmFjaW5nX3BvbGljeX0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byBhZGQgYSB0cmFjaW5nIHBvbGljeSB0bwogICAgKiBhbiBhc3NldCBkZWZpbml0aW9uLgogICAgKi8KICAgIGNsYXNzIEFzc2V0VHJhY2VyS2V5UGFpciB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQXNzZXRUcmFjZXJLZXlQYWlyLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYXNzZXR0cmFjZXJrZXlwYWlyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBDcmVhdGVzIGEgbmV3IHRyYWNlciBrZXkgcGFpci4KICAgICAgICAqIEByZXR1cm5zIHtBc3NldFRyYWNlcktleVBhaXJ9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgbmV3KCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hc3NldHRyYWNlcmtleXBhaXJfbmV3KCk7CiAgICAgICAgICAgIHJldHVybiBBc3NldFRyYWNlcktleVBhaXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIE9iamVjdCByZXByZXNlbnRpbmcgYW4gYXNzZXQgZGVmaW5pdGlvbi4gVXNlZCB0byBmZXRjaCB0cmFjaW5nIHBvbGljaWVzIGFuZCBhbnkgb3RoZXIKICAgICogaW5mb3JtYXRpb24gdGhhdCBtYXkgYmUgcmVxdWlyZWQgdG8gY29uc3RydWN0IGEgdmFsaWQgdHJhbnNmZXIgb3IgaXNzdWFuY2UuCiAgICAqLwogICAgY2xhc3MgQXNzZXRUeXBlIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShBc3NldFR5cGUucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19hc3NldHR5cGVfZnJlZShwdHIpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEJ1aWxkcyBhbiBhc3NldCB0eXBlIGZyb20gYSBKU09OLWVuY29kZWQgSmF2YVNjcmlwdCB2YWx1ZS4KICAgICAgICAqIEBwYXJhbSB7SnNWYWx1ZX0gdmFsIC0gSlNPTi1lbmNvZGVkIGFzc2V0IHR5cGUgZmV0Y2hlZCBmcm9tIGxlZGdlciBzZXJ2ZXIgd2l0aCB0aGUgYGFzc2V0X3Rva2VuL3tjb2RlfWAgcm91dGUuCiAgICAgICAgKiBOb3RlOiBUaGUgZmlyc3QgZmllbGQgb2YgYW4gYXNzZXQgdHlwZSBpcyBgcHJvcGVydGllc2AuIFNlZSB0aGUgZXhhbXBsZSBiZWxvdy4KICAgICAgICAqCiAgICAgICAgKiBAZXhhbXBsZQogICAgICAgICogInByb3BlcnRpZXMiOnsKICAgICAgICAqICAgImNvZGUiOnsKICAgICAgICAqICAgICAidmFsIjpbMTUxLDgsMTA2LDM4LDEyNiwxMDEsMjUwLDIzNiwxMzQsNzcsODMsMTgwLDQzLDE1Miw0Nyw1Nyw4MywzMCw2MCw4LDEzMiwyMTgsNDgsNTIsMTY3LDE2NywxOTAsMjQ0LDM0LDQ1LDc4LDgwXQogICAgICAgICogICB9LAogICAgICAgICogICAiaXNzdWVyIjp7ImtleSI64oCcaUZXNGpZX0RRVlNHRUQwNWtUc2VCQm4wQmxsUEI5UTllc2NPSlVwZjREWT3igJ19LAogICAgICAgICogICAibWVtbyI64oCcdGVzdCBtZW1v4oCdLAogICAgICAgICogICAiYXNzZXRfcnVsZXMiOnsKICAgICAgICAqICAgICAidHJhbnNmZXJhYmxlIjp0cnVlLAogICAgICAgICogICAgICJ1cGRhdGFibGUiOmZhbHNlLAogICAgICAgICogICAgICJ0cmFuc2Zlcl9tdWx0aXNpZ19ydWxlcyI6bnVsbCwKICAgICAgICAqICAgICAibWF4X3VuaXRzIjo1MDAwCiAgICAgICAgKiAgIH0KICAgICAgICAqIH0KICAgICAgICAqCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1OZXR3b3Jrfk5ldHdvcmsjZ2V0QXNzZXRQcm9wZXJ0aWVzfE5ldHdvcmsuZ2V0QXNzZXR9IGZvciBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8KICAgICAgICAqIGZldGNoIGFuIGFzc2V0IHR5cGUgZnJvbSB0aGUgbGVkZ2VyIHNlcnZlci4KICAgICAgICAqIEBwYXJhbSB7YW55fSBqc29uCiAgICAgICAgKiBAcmV0dXJucyB7QXNzZXRUeXBlfQogICAgICAgICovCiAgICAgICAgc3RhdGljIGZyb21fanNvbihqc29uKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hc3NldHR5cGVfZnJvbV9qc29uKGFkZEJvcnJvd2VkT2JqZWN0KGpzb24pKTsKICAgICAgICAgICAgICAgIHJldHVybiBBc3NldFR5cGUuX193cmFwKHJldCk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBGZXRjaCB0aGUgdHJhY2luZyBwb2xpY2llcyBhc3NvY2lhdGVkIHdpdGggdGhpcyBhc3NldCB0eXBlLgogICAgICAgICogQHJldHVybnMge1RyYWNpbmdQb2xpY2llc30KICAgICAgICAqLwogICAgICAgIGdldF90cmFjaW5nX3BvbGljaWVzKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hc3NldHR5cGVfZ2V0X3RyYWNpbmdfcG9saWNpZXModGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gVHJhY2luZ1BvbGljaWVzLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBPYmplY3QgcmVwcmVzZW50aW5nIGFuIGF1dGhlbnRpY2FibGUgYXNzZXQgcmVjb3JkLiBDbGllbnRzIGNhbiB2YWxpZGF0ZSBhdXRoZW50aWNhdGlvbiBwcm9vZnMKICAgICogYWdhaW5zdCBhIGxlZGdlciBzdGF0ZSBjb21taXRtZW50LgogICAgKi8KICAgIGNsYXNzIEF1dGhlbnRpY2F0ZWRBc3NldFJlY29yZCB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQXV0aGVudGljYXRlZEFzc2V0UmVjb3JkLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYXV0aGVudGljYXRlZGFzc2V0cmVjb3JkX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBHaXZlbiBhIHNlcmlhbGl6ZWQgc3RhdGUgY29tbWl0bWVudCwgcmV0dXJucyB0cnVlIGlmIHRoZQogICAgICAgICogYXV0aGVudGljYXRlZCBVVFhPIHByb29mcyB2YWxpZGF0ZSBjb3JyZWN0bHkgYW5kIGZhbHNlIG90aGVyd2lzZS4gSWYgdGhlIHByb29mcyB2YWxpZGF0ZSwgdGhlCiAgICAgICAgKiBhc3NldCByZWNvcmQgY29udGFpbmVkIGluIHRoaXMgc3RydWN0dXJlIGV4aXN0cyBvbiB0aGUgbGVkZ2VyIGFuZCBpcyB1bnNwZW50LgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlX2NvbW1pdG1lbnQgLSBTdHJpbmcgcmVwcmVzZW50aW5nIHRoZSBzdGF0ZSBjb21taXRtZW50LgogICAgICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtTmV0d29ya35OZXR3b3JrI2dldFN0YXRlQ29tbWl0bWVudHxnZXRTdGF0ZUNvbW1pdG1lbnR9IGZvciBpbnN0cnVjdGlvbnMgb24gZmV0Y2hpbmcgYSBsZWRnZXIgc3RhdGUgY29tbWl0bWVudC4KICAgICAgICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgc3RhdGUgY29tbWl0bWVudCBmYWlscyB0byBkZXNlcmlhbGl6ZS4KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZV9jb21taXRtZW50CiAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0KICAgICAgICAqLwogICAgICAgIGlzX3ZhbGlkKHN0YXRlX2NvbW1pdG1lbnQpIHsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChzdGF0ZV9jb21taXRtZW50LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5hdXRoZW50aWNhdGVkYXNzZXRyZWNvcmRfaXNfdmFsaWQodGhpcy5wdHIsIHB0cjAsIGxlbjApOwogICAgICAgICAgICByZXR1cm4gcmV0ICE9PSAwOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEJ1aWxkcyBhbiBBdXRoZW50aWNhdGVkQXNzZXRSZWNvcmQgZnJvbSBhIEpTT04tZW5jb2RlZCBhc3NldCByZWNvcmQgcmV0dXJuZWQgZnJvbSB0aGUgbGVkZ2VyCiAgICAgICAgKiBzZXJ2ZXIuCiAgICAgICAgKiBAcGFyYW0ge0pzVmFsdWV9IHZhbCAtIEpTT04tZW5jb2RlZCBhc3NldCByZWNvcmQgZmV0Y2hlZCBmcm9tIGxlZGdlciBzZXJ2ZXIuCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1OZXR3b3Jrfk5ldHdvcmsjZ2V0VXR4b3xOZXR3b3JrLmdldFV0eG99IGZvciBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8KICAgICAgICAqIGZldGNoIGFuIGFzc2V0IHJlY29yZCBmcm9tIHRoZSBsZWRnZXIgc2VydmVyLgogICAgICAgICogQHBhcmFtIHthbnl9IHJlY29yZAogICAgICAgICogQHJldHVybnMge0F1dGhlbnRpY2F0ZWRBc3NldFJlY29yZH0KICAgICAgICAqLwogICAgICAgIHN0YXRpYyBmcm9tX2pzb25fcmVjb3JkKHJlY29yZCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYXV0aGVudGljYXRlZGFzc2V0cmVjb3JkX2Zyb21fanNvbl9yZWNvcmQoYWRkQm9ycm93ZWRPYmplY3QocmVjb3JkKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gQXV0aGVudGljYXRlZEFzc2V0UmVjb3JkLl9fd3JhcChyZXQpOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIEFzc2V0IG93bmVyIG1lbW8uIENvbnRhaW5zIGluZm9ybWF0aW9uIG5lZWRlZCB0byBkZWNyeXB0IGFuIGFzc2V0IHJlY29yZC4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbS5DbGllbnRBc3NldFJlY29yZHxDbGllbnRBc3NldFJlY29yZH0gZm9yIG1vcmUgZGV0YWlscyBhYm91dCBhc3NldCByZWNvcmRzLgogICAgKi8KICAgIGNsYXNzIEF4ZnJPd25lck1lbW8gewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKEF4ZnJPd25lck1lbW8ucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19heGZyb3duZXJtZW1vX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBCdWlsZHMgYW4gb3duZXIgbWVtbyBmcm9tIGEgSlNPTi1zZXJpYWxpemVkIEphdmFTY3JpcHQgdmFsdWUuCiAgICAgICAgKiBAcGFyYW0ge0pzVmFsdWV9IHZhbCAtIEpTT04gb3duZXIgbWVtbyBmZXRjaGVkIGZyb20gcXVlcnkgc2VydmVyIHdpdGggdGhlIGBnZXRfb3duZXJfbWVtby97c2lkfWAgcm91dGUsCiAgICAgICAgKiB3aGVyZSBgc2lkYCBjYW4gYmUgZmV0Y2hlZCBmcm9tIHRoZSBxdWVyeSBzZXJ2ZXIgd2l0aCB0aGUgYGdldF9vd25lZF91dHhvcy97YWRkcmVzc31gIHJvdXRlLiBTZWUgdGhlIGV4YW1wbGUgYmVsb3cuCiAgICAgICAgKgogICAgICAgICogQGV4YW1wbGUKICAgICAgICAqIHsKICAgICAgICAqICAgImJsaW5kX3NoYXJlIjpbOTEsMjUxLDQ0LDI4LDcsMjIxLDY3LDE1NSwxNzUsMjEzLDI1LDE4Myw3MCw5MCwxMTksMjMyLDIxMiwyMzgsMjI2LDE0MiwxNTksMjAwLDU0LDE5LDYwLDExNSwzOCwyMjEsMjQ4LDIwMiw3NCwyNDhdLAogICAgICAgICogICAibG9jayI6eyJjaXBoZXJ0ZXh0IjpbMTE5LDU0LDExNywxMzYsMTI1LDEzMywxMTIsMTkzXSwiZW5jb2RlZF9yYW5kIjoiOEtEcWwySnBoUEI1V0xkNy1hWUUxYnhUUUFjd2VGU21ycXltTHZQRG50TT0ifQogICAgICAgICogfQogICAgICAgICogQHBhcmFtIHthbnl9IHZhbAogICAgICAgICogQHJldHVybnMge0F4ZnJPd25lck1lbW99CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgZnJvbV9qc29uKHZhbCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uYXhmcm93bmVybWVtb19mcm9tX2pzb24oYWRkQm9ycm93ZWRPYmplY3QodmFsKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gQXhmck93bmVyTWVtby5fX3dyYXAocmV0KTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIENyZWF0ZXMgYSBjbG9uZSBvZiB0aGUgb3duZXIgbWVtby4KICAgICAgICAqIEByZXR1cm5zIHtBeGZyT3duZXJNZW1vfQogICAgICAgICovCiAgICAgICAgY2xvbmUoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmF4ZnJvd25lcm1lbW9fY2xvbmUodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQXhmck93bmVyTWVtby5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogQXNzZXQgb3duZXIgbWVtbyBkZWNyeXB0ZWQgaW5mby4gY29udGFpbnMgYW1vdW50LCBhc3NldF90eXBlIGFuZCBibGluZC4KICAgICovCiAgICBjbGFzcyBBeGZyT3duZXJNZW1vSW5mbyB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQXhmck93bmVyTWVtb0luZm8ucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19heGZyb3duZXJtZW1vaW5mb19mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHJldHVybnMge0JpZ0ludH0KICAgICAgICAqLwogICAgICAgIGdldCBhbW91bnQoKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICBjb25zdCByZXRwdHIgPSB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoLTE2KTsKICAgICAgICAgICAgICAgIHdhc20uX193YmdfZ2V0X2Ftb3VudGFzc2V0dHlwZV9hbW91bnQocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICB1MzJDdnRTaGltWzBdID0gcjA7CiAgICAgICAgICAgICAgICB1MzJDdnRTaGltWzFdID0gcjE7CiAgICAgICAgICAgICAgICBjb25zdCBuMCA9IHVpbnQ2NEN2dFNoaW1bMF07CiAgICAgICAgICAgICAgICByZXR1cm4gbjA7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHJldHVybnMge3N0cmluZ30KICAgICAgICAqLwogICAgICAgIGdldCBhc3NldF90eXBlKCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLmF4ZnJvd25lcm1lbW9pbmZvX2Fzc2V0X3R5cGUocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEByZXR1cm5zIHtCTFNTY2FsYXJ9CiAgICAgICAgKi8KICAgICAgICBnZXQgYmxpbmQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmF4ZnJvd25lcm1lbW9pbmZvX2JsaW5kKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIEJMU1NjYWxhci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHdyYXBwZWQgc3RydWN0IGZvciBbYGFya19ibHMxMl8zODE6OkcxUHJvamVjdGl2ZWBdKGh0dHBzOi8vZG9jcy5ycy9hcmstYmxzMTItMzgxLzAuMy4wL2Fya19ibHMxMl8zODEvZzEvdHlwZS5HMVByb2plY3RpdmUuaHRtbCkKICAgICovCiAgICBjbGFzcyBCTFNHMSB7CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2Jsc2cxX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHdyYXBwZWQgc3RydWN0IGZvciBbYGFya19ibHMxMl8zODE6OkcyUHJvamVjdGl2ZWBdKGh0dHBzOi8vZG9jcy5ycy9hcmstYmxzMTItMzgxLzAuMy4wL2Fya19ibHMxMl8zODEvZzIvdHlwZS5HMlByb2plY3RpdmUuaHRtbCkKICAgICovCiAgICBjbGFzcyBCTFNHMiB7CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2Jsc2cyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHdyYXBwZWQgc3RydWN0IGZvciBbYEZwMTI8YXJrX2JsczEyXzM4MTo6RnExMlBhcmFtZXRlcnM+YF0oaHR0cHM6Ly9kb2NzLnJzL2Fyay1ibHMxMi0zODEvMC4zLjAvYXJrX2JsczEyXzM4MS9mcTEyL3N0cnVjdC5GcTEyUGFyYW1ldGVycy5odG1sKSwKICAgICogd2hpY2ggaXMgdGhlIHBhaXJpbmcgcmVzdWx0CiAgICAqLwogICAgY2xhc3MgQkxTR3QgewoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19ibHNndF9mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFRoZSB3cmFwcGVkIHN0cnVjdCBmb3IgW2BhcmtfYmxzMTJfMzgxOjpGcmBdKGh0dHBzOi8vZG9jcy5ycy9hcmstYmxzMTItMzgxLzAuMy4wL2Fya19ibHMxMl8zODEvZnIvc3RydWN0LkZyUGFyYW1ldGVycy5odG1sKQogICAgKi8KICAgIGNsYXNzIEJMU1NjYWxhciB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQkxTU2NhbGFyLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfYmxzc2NhbGFyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVXNlIHRoaXMgc3RydWN0IHRvIGV4cHJlc3MgYSBCaXA0NC9CaXA0OSBwYXRoLgogICAgKi8KICAgIGNsYXNzIEJpcFBhdGggewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKEJpcFBhdGgucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19iaXBwYXRoX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gY29pbgogICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGFjY291bnQKICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjaGFuZ2UKICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRyZXNzCiAgICAgICAgKiBAcmV0dXJucyB7QmlwUGF0aH0KICAgICAgICAqLwogICAgICAgIHN0YXRpYyBuZXcoY29pbiwgYWNjb3VudCwgY2hhbmdlLCBhZGRyZXNzKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmJpcHBhdGhfbmV3KGNvaW4sIGFjY291bnQsIGNoYW5nZSwgYWRkcmVzcyk7CiAgICAgICAgICAgIHJldHVybiBCaXBQYXRoLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBUaGlzIG9iamVjdCByZXByZXNlbnRzIGFuIGFzc2V0IHJlY29yZCBvd25lZCBieSBhIGxlZGdlciBrZXkgcGFpci4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbS5vcGVuX2NsaWVudF9hc3NldF9yZWNvcmR8b3Blbl9jbGllbnRfYXNzZXRfcmVjb3JkfSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIGRlY3J5cHQgYW4gZW5jcnlwdGVkIGFzc2V0CiAgICAqIHJlY29yZC4KICAgICovCiAgICBjbGFzcyBDbGllbnRBc3NldFJlY29yZCB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ2xpZW50QXNzZXRSZWNvcmQucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19jbGllbnRhc3NldHJlY29yZF9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQnVpbGRzIGEgY2xpZW50IHJlY29yZCBmcm9tIGEgSlNPTi1lbmNvZGVkIEphdmFTY3JpcHQgdmFsdWUuCiAgICAgICAgKgogICAgICAgICogQHBhcmFtIHtKc1ZhbHVlfSB2YWwgLSBKU09OLWVuY29kZWQgYXV0ZWh0bmljYXRlZCBhc3NldCByZWNvcmQgZmV0Y2hlZCBmcm9tIGxlZGdlciBzZXJ2ZXIgd2l0aCB0aGUgYHV0eG9fc2lkL3tzaWR9YCByb3V0ZSwKICAgICAgICAqIHdoZXJlIGBzaWRgIGNhbiBiZSBmZXRjaGVkIGZyb20gdGhlIHF1ZXJ5IHNlcnZlciB3aXRoIHRoZSBgZ2V0X293bmVkX3V0eG9zL3thZGRyZXNzfWAgcm91dGUuCiAgICAgICAgKiBOb3RlOiBUaGUgZmlyc3QgZmllbGQgb2YgYW4gYXNzZXQgcmVjb3JkIGlzIGB1dHhvYC4gU2VlIHRoZSBleGFtcGxlIGJlbG93LgogICAgICAgICoKICAgICAgICAqIEBleGFtcGxlCiAgICAgICAgKiAidXR4byI6ewogICAgICAgICogICAiYW1vdW50Ijp7CiAgICAgICAgKiAgICAgIk5vbkNvbmZpZGVudGlhbCI6NQogICAgICAgICogICB9LAogICAgICAgICogICJhc3NldF90eXBlIjp7CiAgICAgICAgKiAgICAgIk5vbkNvbmZpZGVudGlhbCI6WzExMywxNjgsMTU4LDE0OSw1NSw2NCwxOCwxODksODgsMTU2LDEzMywyMDQsMTU2LDQ2LDEwNiw0NiwyMzIsNjIsNjksMjMzLDE1NywxMTIsMjQwLDEzMiwxNjQsMTIwLDQsMTEwLDE0LDI0NywxMDksMTI3XQogICAgICAgICogICB9LAogICAgICAgICogICAicHVibGljX2tleSI6IkdsZjhkS0Y2akFQWUh6Ul9QWVlZZnphV3FwWWNNdm5ySWNhenhzaWxtbEE9IgogICAgICAgICogfQogICAgICAgICoKICAgICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLU5ldHdvcmt+TmV0d29yayNnZXRVdHhvfE5ldHdvcmsuZ2V0VXR4b30gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0bwogICAgICAgICogZmV0Y2ggYW4gYXNzZXQgcmVjb3JkIGZyb20gdGhlIGxlZGdlciBzZXJ2ZXIuCiAgICAgICAgKiBAcGFyYW0ge2FueX0gdmFsCiAgICAgICAgKiBAcmV0dXJucyB7Q2xpZW50QXNzZXRSZWNvcmR9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgZnJvbV9qc29uKHZhbCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uY2xpZW50YXNzZXRyZWNvcmRfZnJvbV9qc29uKGFkZEJvcnJvd2VkT2JqZWN0KHZhbCkpOwogICAgICAgICAgICAgICAgcmV0dXJuIENsaWVudEFzc2V0UmVjb3JkLl9fd3JhcChyZXQpOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ2xpZW50QXNzZXRSZWNvcmQgPT0+IEpzVmFsdWUKICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICB0b19qc29uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jbGllbnRhc3NldHJlY29yZF90b19qc29uKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogUHVibGljIGtleSBvZiBhIGNyZWRlbnRpYWwgaXNzdWVyLgogICAgKi8KICAgIGNsYXNzIENyZWRJc3N1ZXJQdWJsaWNLZXkgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKENyZWRJc3N1ZXJQdWJsaWNLZXkucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19jcmVkaXNzdWVycHVibGlja2V5X2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU2VjcmV0IGtleSBvZiBhIGNyZWRlbnRpYWwgaXNzdWVyLgogICAgKi8KICAgIGNsYXNzIENyZWRJc3N1ZXJTZWNyZXRLZXkgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKENyZWRJc3N1ZXJTZWNyZXRLZXkucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19jcmVkaXNzdWVyc2VjcmV0a2V5X2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogUHVibGljIGtleSBvZiBhIGNyZWRlbnRpYWwgdXNlci4KICAgICovCiAgICBjbGFzcyBDcmVkVXNlclB1YmxpY0tleSB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ3JlZFVzZXJQdWJsaWNLZXkucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19jcmVkdXNlcnB1YmxpY2tleV9mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFNlY3JldCBrZXkgb2YgYSBjcmVkZW50aWFsIHVzZXIuCiAgICAqLwogICAgY2xhc3MgQ3JlZFVzZXJTZWNyZXRLZXkgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKENyZWRVc2VyU2VjcmV0S2V5LnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfY3JlZHVzZXJzZWNyZXRrZXlfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBBIHVzZXIgY3JlZGVudGlhbCB0aGF0IGNhbiBiZSB1c2VkIHRvIHNlbGVjdGl2ZWx5IHJldmVhbCBjcmVkZW50aWFsIGF0dHJpYnV0ZXMuCiAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc20ud2FzbV9jcmVkZW50aWFsX2NvbW1pdHx3YXNtX2NyZWRlbnRpYWxfY29tbWl0fSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIGNvbW1pdCB0byBhIGNyZWRlbnRpYWwuCiAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc20ud2FzbV9jcmVkZW50aWFsX3JldmVhbHx3YXNtX2NyZWRlbnRpYWxfcmV2ZWFsfSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIHNlbGVjdGl2ZWx5IHJldmVhbCBjcmVkZW50aWFsCiAgICAqIGF0dHJpYnV0ZXMuCiAgICAqLwogICAgY2xhc3MgQ3JlZGVudGlhbCB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ3JlZGVudGlhbC5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2NyZWRlbnRpYWxfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBDb21taXRtZW50IHRvIGEgY3JlZGVudGlhbCByZWNvcmQuCiAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc20ud2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50fHdhc21fY3JlZGVudGlhbF92ZXJpZnlfY29tbWl0bWVudH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byB2ZXJpZnkgYQogICAgKiBjcmVkZW50aWFsIGNvbW1pdG1lbnQuCiAgICAqLwogICAgY2xhc3MgQ3JlZGVudGlhbENvbW1pdG1lbnQgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKENyZWRlbnRpYWxDb21taXRtZW50LnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfY3JlZGVudGlhbGNvbW1pdG1lbnRfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBDb21taXRtZW50IHRvIGEgY3JlZGVudGlhbCByZWNvcmQsIHByb29mIHRoYXQgdGhlIGNvbW1pdG1lbnQgaXMgdmFsaWQsIGFuZCBjcmVkZW50aWFsIGtleSB0aGF0IGNhbiBiZSB1c2VkCiAgICAqIHRvIG9wZW4gYSBjb21taXRtZW50LgogICAgKi8KICAgIGNsYXNzIENyZWRlbnRpYWxDb21taXRtZW50RGF0YSB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ3JlZGVudGlhbENvbW1pdG1lbnREYXRhLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfY3JlZGVudGlhbGNvbW1pdG1lbnRkYXRhX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBSZXR1cm5zIHRoZSB1bmRlcmx5aW5nIGNyZWRlbnRpYWwgY29tbWl0bWVudC4KICAgICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc20ud2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50fHdhc21fY3JlZGVudGlhbF92ZXJpZnlfY29tbWl0bWVudH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byB2ZXJpZnkgYQogICAgICAgICogY3JlZGVudGlhbCBjb21taXRtZW50LgogICAgICAgICogQHJldHVybnMge0NyZWRlbnRpYWxDb21taXRtZW50fQogICAgICAgICovCiAgICAgICAgZ2V0X2NvbW1pdG1lbnQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmNyZWRlbnRpYWxjb21taXRtZW50ZGF0YV9nZXRfY29tbWl0bWVudCh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBDcmVkZW50aWFsQ29tbWl0bWVudC5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBSZXR1cm5zIHRoZSB1bmRlcmx5aW5nIHByb29mIG9mIGtub3dsZWRnZSB0aGF0IHRoZSBjcmVkZW50aWFsIGlzIHZhbGlkLgogICAgICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbS53YXNtX2NyZWRlbnRpYWxfdmVyaWZ5X2NvbW1pdG1lbnR8d2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50fSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIHZlcmlmeSBhCiAgICAgICAgKiBjcmVkZW50aWFsIGNvbW1pdG1lbnQuCiAgICAgICAgKiBAcmV0dXJucyB7Q3JlZGVudGlhbFBvS30KICAgICAgICAqLwogICAgICAgIGdldF9wb2soKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmNyZWRlbnRpYWxjb21taXRtZW50ZGF0YV9nZXRfcG9rKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIENyZWRlbnRpYWxQb0suX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogUmV0dXJucyB0aGUga2V5IHVzZWQgdG8gZ2VuZXJhdGUgdGhlIGNvbW1pdG1lbnQuCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtLndhc21fY3JlZGVudGlhbF9vcGVuX2NvbW1pdG1lbnR8d2FzbV9jcmVkZW50aWFsX29wZW5fY29tbWl0bWVudH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byBvcGVuIGEKICAgICAgICAqIGNyZWRlbnRpYWwgY29tbWl0bWVudC4KICAgICAgICAqIEByZXR1cm5zIHtDcmVkZW50aWFsQ29tbWl0bWVudEtleX0KICAgICAgICAqLwogICAgICAgIGdldF9jb21taXRfa2V5KCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsY29tbWl0bWVudGRhdGFfZ2V0X2NvbW1pdF9rZXkodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQ3JlZGVudGlhbENvbW1pdG1lbnRLZXkuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIEtleSB1c2VkIHRvIGdlbmVyYXRlIGEgY3JlZGVudGlhbCBjb21taXRtZW50LgogICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtLndhc21fY3JlZGVudGlhbF9vcGVuX2NvbW1pdG1lbnR8d2FzbV9jcmVkZW50aWFsX29wZW5fY29tbWl0bWVudH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0bwogICAgKiBvcGVuIGEgY3JlZGVudGlhbCBjb21taXRtZW50LgogICAgKi8KICAgIGNsYXNzIENyZWRlbnRpYWxDb21taXRtZW50S2V5IHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShDcmVkZW50aWFsQ29tbWl0bWVudEtleS5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2NyZWRlbnRpYWxjb21taXRtZW50a2V5X2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogS2V5IHBhaXIgb2YgYSBjcmVkZW50aWFsIGlzc3Vlci4KICAgICovCiAgICBjbGFzcyBDcmVkZW50aWFsSXNzdWVyS2V5UGFpciB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ3JlZGVudGlhbElzc3VlcktleVBhaXIucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19jcmVkZW50aWFsaXNzdWVya2V5cGFpcl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogUmV0dXJucyB0aGUgY3JlZGVudGlhbCBpc3N1ZXIncyBwdWJsaWMga2V5LgogICAgICAgICogQHJldHVybnMge0NyZWRJc3N1ZXJQdWJsaWNLZXl9CiAgICAgICAgKi8KICAgICAgICBnZXRfcGsoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmNyZWRlbnRpYWxpc3N1ZXJrZXlwYWlyX2dldF9wayh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBDcmVkSXNzdWVyUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFJldHVybnMgdGhlIGNyZWRlbnRpYWwgaXNzdWVyJ3Mgc2VjcmV0IGtleS4KICAgICAgICAqIEByZXR1cm5zIHtDcmVkSXNzdWVyU2VjcmV0S2V5fQogICAgICAgICovCiAgICAgICAgZ2V0X3NrKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsaXNzdWVya2V5cGFpcl9nZXRfc2sodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQ3JlZElzc3VlclNlY3JldEtleS5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBDb252ZXJ0IHRoZSBrZXkgcGFpciB0byBhIHNlcmlhbGl6ZWQgdmFsdWUgdGhhdCBjYW4gYmUgdXNlZCBpbiB0aGUgYnJvd3Nlci4KICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICB0b19qc29uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsaXNzdWVya2V5cGFpcl90b19qc29uKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIHRha2VPYmplY3QocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBHZW5lcmF0ZSBhIGtleSBwYWlyIGZyb20gYSBKU09OLXNlcmlhbGl6ZWQgSmF2YVNjcmlwdCB2YWx1ZS4KICAgICAgICAqIEBwYXJhbSB7YW55fSB2YWwKICAgICAgICAqIEByZXR1cm5zIHtDcmVkZW50aWFsSXNzdWVyS2V5UGFpcn0KICAgICAgICAqLwogICAgICAgIHN0YXRpYyBmcm9tX2pzb24odmFsKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsaXNzdWVya2V5cGFpcl9mcm9tX2pzb24oYWRkQm9ycm93ZWRPYmplY3QodmFsKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gQ3JlZGVudGlhbElzc3VlcktleVBhaXIuX193cmFwKHJldCk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICBoZWFwW3N0YWNrX3BvaW50ZXIrK10gPSB1bmRlZmluZWQ7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogUHJvb2YgdGhhdCBhIGNyZWRlbnRpYWwgaXMgYSB2YWxpZCByZS1yYW5kb21pemF0aW9uIG9mIGEgY3JlZGVudGlhbCBzaWduZWQgYnkgYSBjZXJ0YWluIGFzc2V0CiAgICAqIGlzc3Vlci4KICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbS53YXNtX2NyZWRlbnRpYWxfdmVyaWZ5X2NvbW1pdG1lbnR8d2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50fSBmb3IgaW5mb3JtYXRpb24gYWJvdXQgaG93IHRvIHZlcmlmeSBhCiAgICAqIGNyZWRlbnRpYWwgY29tbWl0bWVudC4KICAgICovCiAgICBjbGFzcyBDcmVkZW50aWFsUG9LIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShDcmVkZW50aWFsUG9LLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfY3JlZGVudGlhbHBva19mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFJldmVhbCBzaWduYXR1cmUgb2YgYSBjcmVkZW50aWFsIHJlY29yZC4KICAgICovCiAgICBjbGFzcyBDcmVkZW50aWFsUmV2ZWFsU2lnIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShDcmVkZW50aWFsUmV2ZWFsU2lnLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfY3JlZGVudGlhbHJldmVhbHNpZ19mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogUmV0dXJucyB0aGUgdW5kZXJseWluZyBjcmVkZW50aWFsIGNvbW1pdG1lbnQuCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtLndhc21fY3JlZGVudGlhbF92ZXJpZnlfY29tbWl0bWVudHx3YXNtX2NyZWRlbnRpYWxfdmVyaWZ5X2NvbW1pdG1lbnR9IGZvciBpbmZvcm1hdGlvbiBhYm91dCBob3cgdG8gdmVyaWZ5IGEKICAgICAgICAqIGNyZWRlbnRpYWwgY29tbWl0bWVudC4KICAgICAgICAqIEByZXR1cm5zIHtDcmVkZW50aWFsQ29tbWl0bWVudH0KICAgICAgICAqLwogICAgICAgIGdldF9jb21taXRtZW50KCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsY29tbWl0bWVudGRhdGFfZ2V0X2NvbW1pdG1lbnQodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQ3JlZGVudGlhbENvbW1pdG1lbnQuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogUmV0dXJucyB0aGUgdW5kZXJseWluZyBwcm9vZiBvZiBrbm93bGVkZ2UgdGhhdCB0aGUgY3JlZGVudGlhbCBpcyB2YWxpZC4KICAgICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc20ud2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50fHdhc21fY3JlZGVudGlhbF92ZXJpZnlfY29tbWl0bWVudH0gZm9yIGluZm9ybWF0aW9uIGFib3V0IGhvdyB0byB2ZXJpZnkgYQogICAgICAgICogY3JlZGVudGlhbCBjb21taXRtZW50LgogICAgICAgICogQHJldHVybnMge0NyZWRlbnRpYWxQb0t9CiAgICAgICAgKi8KICAgICAgICBnZXRfcG9rKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFscmV2ZWFsc2lnX2dldF9wb2sodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQ3JlZGVudGlhbFBvSy5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU2lnbmF0dXJlIG9mIGEgY3JlZGVudGlhbCByZWNvcmQuCiAgICAqLwogICAgY2xhc3MgQ3JlZGVudGlhbFNpZ25hdHVyZSB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoQ3JlZGVudGlhbFNpZ25hdHVyZS5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2NyZWRlbnRpYWxzaWduYXR1cmVfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBLZXkgcGFpciBvZiBhIGNyZWRlbnRpYWwgdXNlci4KICAgICovCiAgICBjbGFzcyBDcmVkZW50aWFsVXNlcktleVBhaXIgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKENyZWRlbnRpYWxVc2VyS2V5UGFpci5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX2NyZWRlbnRpYWx1c2Vya2V5cGFpcl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogUmV0dXJucyB0aGUgY3JlZGVudGlhbCBpc3N1ZXIncyBwdWJsaWMga2V5LgogICAgICAgICogQHJldHVybnMge0NyZWRVc2VyUHVibGljS2V5fQogICAgICAgICovCiAgICAgICAgZ2V0X3BrKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsdXNlcmtleXBhaXJfZ2V0X3BrKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIENyZWRVc2VyUHVibGljS2V5Ll9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFJldHVybnMgdGhlIGNyZWRlbnRpYWwgaXNzdWVyJ3Mgc2VjcmV0IGtleS4KICAgICAgICAqIEByZXR1cm5zIHtDcmVkVXNlclNlY3JldEtleX0KICAgICAgICAqLwogICAgICAgIGdldF9zaygpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uY3JlZGVudGlhbHVzZXJrZXlwYWlyX2dldF9zayh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBDcmVkVXNlclNlY3JldEtleS5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBDb252ZXJ0IHRoZSBrZXkgcGFpciB0byBhIHNlcmlhbGl6ZWQgdmFsdWUgdGhhdCBjYW4gYmUgdXNlZCBpbiB0aGUgYnJvd3Nlci4KICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICB0b19qc29uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5jcmVkZW50aWFsdXNlcmtleXBhaXJfdG9fanNvbih0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiB0YWtlT2JqZWN0KHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogR2VuZXJhdGUgYSBrZXkgcGFpciBmcm9tIGEgSlNPTi1zZXJpYWxpemVkIEphdmFTY3JpcHQgdmFsdWUuCiAgICAgICAgKiBAcGFyYW0ge2FueX0gdmFsCiAgICAgICAgKiBAcmV0dXJucyB7Q3JlZGVudGlhbFVzZXJLZXlQYWlyfQogICAgICAgICovCiAgICAgICAgc3RhdGljIGZyb21fanNvbih2YWwpIHsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLmNyZWRlbnRpYWx1c2Vya2V5cGFpcl9mcm9tX2pzb24oYWRkQm9ycm93ZWRPYmplY3QodmFsKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gQ3JlZGVudGlhbFVzZXJLZXlQYWlyLl9fd3JhcChyZXQpOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqLwogICAgY2xhc3MgRmVlSW5wdXRzIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShGZWVJbnB1dHMucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19mZWVpbnB1dHNfZnJlZShwdHIpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEByZXR1cm5zIHtGZWVJbnB1dHN9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgbmV3KCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5mZWVpbnB1dHNfbmV3KCk7CiAgICAgICAgICAgIHJldHVybiBGZWVJbnB1dHMuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IGFtCiAgICAgICAgKiBAcGFyYW0ge1R4b1JlZn0gdHIKICAgICAgICAqIEBwYXJhbSB7Q2xpZW50QXNzZXRSZWNvcmR9IGFyCiAgICAgICAgKiBAcGFyYW0ge093bmVyTWVtbyB8IHVuZGVmaW5lZH0gb20KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga3AKICAgICAgICAqLwogICAgICAgIGFwcGVuZChhbSwgdHIsIGFyLCBvbSwga3ApIHsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IGFtOwogICAgICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3ModHIsIFR4b1JlZik7CiAgICAgICAgICAgIHZhciBwdHIxID0gdHIucHRyOwogICAgICAgICAgICB0ci5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXIsIENsaWVudEFzc2V0UmVjb3JkKTsKICAgICAgICAgICAgdmFyIHB0cjIgPSBhci5wdHI7CiAgICAgICAgICAgIGFyLnB0ciA9IDA7CiAgICAgICAgICAgIGxldCBwdHIzID0gMDsKICAgICAgICAgICAgaWYgKCFpc0xpa2VOb25lKG9tKSkgewogICAgICAgICAgICAgICAgX2Fzc2VydENsYXNzKG9tLCBPd25lck1lbW8pOwogICAgICAgICAgICAgICAgcHRyMyA9IG9tLnB0cjsKICAgICAgICAgICAgICAgIG9tLnB0ciA9IDA7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtwLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdmFyIHB0cjQgPSBrcC5wdHI7CiAgICAgICAgICAgIGtwLnB0ciA9IDA7CiAgICAgICAgICAgIHdhc20uZmVlaW5wdXRzX2FwcGVuZCh0aGlzLnB0ciwgbG93MCwgaGlnaDAsIHB0cjEsIHB0cjIsIHB0cjMsIHB0cjQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbQogICAgICAgICogQHBhcmFtIHtUeG9SZWZ9IHRyCiAgICAgICAgKiBAcGFyYW0ge0NsaWVudEFzc2V0UmVjb3JkfSBhcgogICAgICAgICogQHBhcmFtIHtPd25lck1lbW8gfCB1bmRlZmluZWR9IG9tCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtwCiAgICAgICAgKiBAcmV0dXJucyB7RmVlSW5wdXRzfQogICAgICAgICovCiAgICAgICAgYXBwZW5kMihhbSwgdHIsIGFyLCBvbSwga3ApIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IGFtOwogICAgICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3ModHIsIFR4b1JlZik7CiAgICAgICAgICAgIHZhciBwdHIxID0gdHIucHRyOwogICAgICAgICAgICB0ci5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXIsIENsaWVudEFzc2V0UmVjb3JkKTsKICAgICAgICAgICAgdmFyIHB0cjIgPSBhci5wdHI7CiAgICAgICAgICAgIGFyLnB0ciA9IDA7CiAgICAgICAgICAgIGxldCBwdHIzID0gMDsKICAgICAgICAgICAgaWYgKCFpc0xpa2VOb25lKG9tKSkgewogICAgICAgICAgICAgICAgX2Fzc2VydENsYXNzKG9tLCBPd25lck1lbW8pOwogICAgICAgICAgICAgICAgcHRyMyA9IG9tLnB0cjsKICAgICAgICAgICAgICAgIG9tLnB0ciA9IDA7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtwLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uZmVlaW5wdXRzX2FwcGVuZDIocHRyLCBsb3cwLCBoaWdoMCwgcHRyMSwgcHRyMiwgcHRyMywga3AucHRyKTsKICAgICAgICAgICAgcmV0dXJuIEZlZUlucHV0cy5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHdyYXBwZWQgc3RydWN0IGZvciBgYXJrX2VkX29uX2JsczEyXzM4MTo6RnJgCiAgICAqLwogICAgY2xhc3MgSnVianViU2NhbGFyIHsKCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfanVianVic2NhbGFyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICovCiAgICBjbGFzcyBNVExlYWZJbmZvIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShNVExlYWZJbmZvLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfbXRsZWFmaW5mb19mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHthbnl9IGpzb24KICAgICAgICAqIEByZXR1cm5zIHtNVExlYWZJbmZvfQogICAgICAgICovCiAgICAgICAgc3RhdGljIGZyb21fanNvbihqc29uKSB7CiAgICAgICAgICAgIHRyeSB7CiAgICAgICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5tdGxlYWZpbmZvX2Zyb21fanNvbihhZGRCb3Jyb3dlZE9iamVjdChqc29uKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gTVRMZWFmSW5mby5fX3dyYXAocmV0KTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIGhlYXBbc3RhY2tfcG9pbnRlcisrXSA9IHVuZGVmaW5lZDsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICB0b19qc29uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5tdGxlYWZpbmZvX3RvX2pzb24odGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBBIE1lcmtsZSB0cmVlIG5vZGUuCiAgICAqLwogICAgY2xhc3MgTVROb2RlIHsKCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfbXRub2RlX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBUaGUgbGVmdCBjaGlsZCBvZiBpdHMgcGFyZW50IGluIGEgdGhyZWUtYXJ5IHRyZWUuCiAgICAgICAgKiBAcmV0dXJucyB7QkxTU2NhbGFyfQogICAgICAgICovCiAgICAgICAgZ2V0IGxlZnQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLl9fd2JnX2dldF9hbm9uYXNzZXRyZWNvcmRfY29tbWl0bWVudCh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBCTFNTY2FsYXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVGhlIGxlZnQgY2hpbGQgb2YgaXRzIHBhcmVudCBpbiBhIHRocmVlLWFyeSB0cmVlLgogICAgICAgICogQHBhcmFtIHtCTFNTY2FsYXJ9IGFyZzAKICAgICAgICAqLwogICAgICAgIHNldCBsZWZ0KGFyZzApIHsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGFyZzAsIEJMU1NjYWxhcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gYXJnMC5wdHI7CiAgICAgICAgICAgIGFyZzAucHRyID0gMDsKICAgICAgICAgICAgd2FzbS5fX3diZ19zZXRfYW5vbmFzc2V0cmVjb3JkX2NvbW1pdG1lbnQodGhpcy5wdHIsIHB0cjApOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFRoZSBtaWQgY2hpbGQgb2YgaXRzIHBhcmVudCBpbiBhIHRocmVlLWFyeSB0cmVlLgogICAgICAgICogQHJldHVybnMge0JMU1NjYWxhcn0KICAgICAgICAqLwogICAgICAgIGdldCBtaWQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLl9fd2JnX2dldF9tdG5vZGVfbWlkKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIEJMU1NjYWxhci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBUaGUgbWlkIGNoaWxkIG9mIGl0cyBwYXJlbnQgaW4gYSB0aHJlZS1hcnkgdHJlZS4KICAgICAgICAqIEBwYXJhbSB7QkxTU2NhbGFyfSBhcmcwCiAgICAgICAgKi8KICAgICAgICBzZXQgbWlkKGFyZzApIHsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGFyZzAsIEJMU1NjYWxhcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gYXJnMC5wdHI7CiAgICAgICAgICAgIGFyZzAucHRyID0gMDsKICAgICAgICAgICAgd2FzbS5fX3diZ19zZXRfbXRub2RlX21pZCh0aGlzLnB0ciwgcHRyMCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVGhlIHJpZ2h0IGNoaWxkIG9mIGl0cyBwYXJlbnQgaW4gYSB0aHJlZS1hcnkgdHJlZS4KICAgICAgICAqIEByZXR1cm5zIHtCTFNTY2FsYXJ9CiAgICAgICAgKi8KICAgICAgICBnZXQgcmlnaHQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLl9fd2JnX2dldF9tdG5vZGVfcmlnaHQodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gQkxTU2NhbGFyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFRoZSByaWdodCBjaGlsZCBvZiBpdHMgcGFyZW50IGluIGEgdGhyZWUtYXJ5IHRyZWUuCiAgICAgICAgKiBAcGFyYW0ge0JMU1NjYWxhcn0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IHJpZ2h0KGFyZzApIHsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGFyZzAsIEJMU1NjYWxhcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gYXJnMC5wdHI7CiAgICAgICAgICAgIGFyZzAucHRyID0gMDsKICAgICAgICAgICAgd2FzbS5fX3diZ19zZXRfbXRub2RlX3JpZ2h0KHRoaXMucHRyLCBwdHIwKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXaGV0aGVyIHRoaXMgbm9kZSBpcyB0aGUgbGVmdCBjaGlsZCBvZiB0aGUgcGFyZW50LgogICAgICAgICogQHJldHVybnMge251bWJlcn0KICAgICAgICAqLwogICAgICAgIGdldCBpc19sZWZ0X2NoaWxkKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5fX3diZ19nZXRfbXRub2RlX2lzX2xlZnRfY2hpbGQodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gcmV0OwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFdoZXRoZXIgdGhpcyBub2RlIGlzIHRoZSBsZWZ0IGNoaWxkIG9mIHRoZSBwYXJlbnQuCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IGlzX2xlZnRfY2hpbGQoYXJnMCkgewogICAgICAgICAgICB3YXNtLl9fd2JnX3NldF9tdG5vZGVfaXNfbGVmdF9jaGlsZCh0aGlzLnB0ciwgYXJnMCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV2hldGhlciB0aGlzIG5vZGUgaXMgdGhlIG1pZCBjaGlsZCBvZiB0aGUgcGFyZW50LgogICAgICAgICogQHJldHVybnMge251bWJlcn0KICAgICAgICAqLwogICAgICAgIGdldCBpc19taWRfY2hpbGQoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLl9fd2JnX2dldF9tdG5vZGVfaXNfbWlkX2NoaWxkKHRoaXMucHRyKTsKICAgICAgICAgICAgcmV0dXJuIHJldDsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXaGV0aGVyIHRoaXMgbm9kZSBpcyB0aGUgbWlkIGNoaWxkIG9mIHRoZSBwYXJlbnQuCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IGlzX21pZF9jaGlsZChhcmcwKSB7CiAgICAgICAgICAgIHdhc20uX193Ymdfc2V0X210bm9kZV9pc19taWRfY2hpbGQodGhpcy5wdHIsIGFyZzApOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIFdoZXRoZXIgdGhpcyBub2RlIGlzIHRoZSByaWdodCBjaGlsZCBvZiB0aGUgcGFyZW50LgogICAgICAgICogQHJldHVybnMge251bWJlcn0KICAgICAgICAqLwogICAgICAgIGdldCBpc19yaWdodF9jaGlsZCgpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uX193YmdfZ2V0X210bm9kZV9pc19yaWdodF9jaGlsZCh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiByZXQ7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV2hldGhlciB0aGlzIG5vZGUgaXMgdGhlIHJpZ2h0IGNoaWxkIG9mIHRoZSBwYXJlbnQuCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IGlzX3JpZ2h0X2NoaWxkKGFyZzApIHsKICAgICAgICAgICAgd2FzbS5fX3diZ19zZXRfbXRub2RlX2lzX3JpZ2h0X2NoaWxkKHRoaXMucHRyLCBhcmcwKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogQXNzZXQgb3duZXIgbWVtby4gQ29udGFpbnMgaW5mb3JtYXRpb24gbmVlZGVkIHRvIGRlY3J5cHQgYW4gYXNzZXQgcmVjb3JkLgogICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1XYXNtLkNsaWVudEFzc2V0UmVjb3JkfENsaWVudEFzc2V0UmVjb3JkfSBmb3IgbW9yZSBkZXRhaWxzIGFib3V0IGFzc2V0IHJlY29yZHMuCiAgICAqLwogICAgY2xhc3MgT3duZXJNZW1vIHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShPd25lck1lbW8ucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19vd25lcm1lbW9fZnJlZShwdHIpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEJ1aWxkcyBhbiBvd25lciBtZW1vIGZyb20gYSBKU09OLXNlcmlhbGl6ZWQgSmF2YVNjcmlwdCB2YWx1ZS4KICAgICAgICAqIEBwYXJhbSB7SnNWYWx1ZX0gdmFsIC0gSlNPTiBvd25lciBtZW1vIGZldGNoZWQgZnJvbSBxdWVyeSBzZXJ2ZXIgd2l0aCB0aGUgYGdldF9vd25lcl9tZW1vL3tzaWR9YCByb3V0ZSwKICAgICAgICAqIHdoZXJlIGBzaWRgIGNhbiBiZSBmZXRjaGVkIGZyb20gdGhlIHF1ZXJ5IHNlcnZlciB3aXRoIHRoZSBgZ2V0X293bmVkX3V0eG9zL3thZGRyZXNzfWAgcm91dGUuIFNlZSB0aGUgZXhhbXBsZSBiZWxvdy4KICAgICAgICAqCiAgICAgICAgKiBAZXhhbXBsZQogICAgICAgICogewogICAgICAgICogICAiYmxpbmRfc2hhcmUiOls5MSwyNTEsNDQsMjgsNywyMjEsNjcsMTU1LDE3NSwyMTMsMjUsMTgzLDcwLDkwLDExOSwyMzIsMjEyLDIzOCwyMjYsMTQyLDE1OSwyMDAsNTQsMTksNjAsMTE1LDM4LDIyMSwyNDgsMjAyLDc0LDI0OF0sCiAgICAgICAgKiAgICJsb2NrIjp7ImNpcGhlcnRleHQiOlsxMTksNTQsMTE3LDEzNiwxMjUsMTMzLDExMiwxOTNdLCJlbmNvZGVkX3JhbmQiOiI4S0RxbDJKcGhQQjVXTGQ3LWFZRTFieFRRQWN3ZUZTbXJxeW1MdlBEbnRNPSJ9CiAgICAgICAgKiB9CiAgICAgICAgKiBAcGFyYW0ge2FueX0gdmFsCiAgICAgICAgKiBAcmV0dXJucyB7T3duZXJNZW1vfQogICAgICAgICovCiAgICAgICAgc3RhdGljIGZyb21fanNvbih2YWwpIHsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLm93bmVybWVtb19mcm9tX2pzb24oYWRkQm9ycm93ZWRPYmplY3QodmFsKSk7CiAgICAgICAgICAgICAgICByZXR1cm4gT3duZXJNZW1vLl9fd3JhcChyZXQpOwogICAgICAgICAgICB9IGZpbmFsbHkgewogICAgICAgICAgICAgICAgaGVhcFtzdGFja19wb2ludGVyKytdID0gdW5kZWZpbmVkOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ3JlYXRlcyBhIGNsb25lIG9mIHRoZSBvd25lciBtZW1vLgogICAgICAgICogQHJldHVybnMge093bmVyTWVtb30KICAgICAgICAqLwogICAgICAgIGNsb25lKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS5vd25lcm1lbW9fY2xvbmUodGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gT3duZXJNZW1vLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBUaGUgd3JhcHBlZCBzdHJ1Y3QgZm9yIFtgYXJrX2J1bGxldHByb29mczo6Y3VydmU6OnNlY3AyNTZrMTo6RzFQcm9qZWN0aXZlYF0oaHR0cHM6Ly9naXRodWIuY29tL0ZpbmRvcmFOZXR3b3JrL2Fyay1idWxsZXRwcm9vZnMvYmxvYi9tYWluL3NyYy9jdXJ2ZS9zZWNwMjU2azEvZzEucnMpCiAgICAqLwogICAgY2xhc3MgU0VDUDI1NksxRzEgewoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19zZWNwMjU2azFnMV9mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFRoZSB3cmFwcGVkIHN0cnVjdCBmb3IgW2BhcmtfYnVsbGV0cHJvb2ZzOjpjdXJ2ZTo6c2VjcDI1NmsxOjpGcmBdKGh0dHBzOi8vZ2l0aHViLmNvbS9GaW5kb3JhTmV0d29yay9hcmstYnVsbGV0cHJvb2ZzL2Jsb2IvbWFpbi9zcmMvY3VydmUvc2VjcDI1NmsxL2ZyLnJzKQogICAgKi8KICAgIGNsYXNzIFNFQ1AyNTZLMVNjYWxhciB7CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3NlY3AyNTZrMXNjYWxhcl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFRoZSB3cmFwcGVkIHN0cnVjdCBmb3IgW2BhcmtfYnVsbGV0cHJvb2ZzOjpjdXJ2ZTo6c2VjcTI1NmsxOjpHMVByb2plY3RpdmVgXShodHRwczovL2dpdGh1Yi5jb20vRmluZG9yYU5ldHdvcmsvYXJrLWJ1bGxldHByb29mcy9ibG9iL21haW4vc3JjL2N1cnZlL3NlY3EyNTZrMS9nMS5ycykKICAgICovCiAgICBjbGFzcyBTRUNRMjU2SzFHMSB7CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3NlY3EyNTZrMWcxX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHdyYXBwZWQgc3RydWN0IGZvciBbYGFya19idWxsZXRwcm9vZnM6OmN1cnZlOjpzZWNxMjU2azE6OkZyYF0oaHR0cHM6Ly9naXRodWIuY29tL0ZpbmRvcmFOZXR3b3JrL2Fyay1idWxsZXRwcm9vZnMvYmxvYi9tYWluL3NyYy9jdXJ2ZS9zZWNxMjU2azEvZnIucnMpCiAgICAqLwogICAgY2xhc3MgU0VDUTI1NksxU2NhbGFyIHsKCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193Ymdfc2VjcTI1Nmsxc2NhbGFyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU3RvcmVzIHRocmVzaG9sZCBhbmQgd2VpZ2h0cyBmb3IgYSBtdWx0aXNpZ25hdHVyZSByZXF1aXJlbWVudC4KICAgICovCiAgICBjbGFzcyBTaWduYXR1cmVSdWxlcyB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoU2lnbmF0dXJlUnVsZXMucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ19zaWduYXR1cmVydWxlc19mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ3JlYXRlcyBhIG5ldyBzZXQgb2YgY28tc2lnbmF0dXJlIHJ1bGVzLgogICAgICAgICoKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSB0aHJlc2hvbGQgLSBNaW5pbXVtIHN1bSBvZiBzaWduYXR1cmUgd2VpZ2h0cyB0aGF0IGlzIHJlcXVpcmVkIGZvciBhbiBhc3NldAogICAgICAgICogdHJhbnNmZXIuCiAgICAgICAgKiBAcGFyYW0ge0pzVmFsdWV9IHdlaWdodHMgLSBBcnJheSBvZiBwdWJsaWMga2V5IHdlaWdodHMgb2YgdGhlIGZvcm0gYFtbImtBYi4uLiIsIEJpZ0ludCg1KV1dJywgd2hlcmUgdGhlCiAgICAgICAgKiBmaXJzdCBlbGVtZW50IG9mIGVhY2ggdHVwbGUgaXMgYSBiYXNlNjQgZW5jb2RlZCBwdWJsaWMga2V5IGFuZCB0aGUgc2Vjb25kIGlzIHRoZSBrZXkncwogICAgICAgICogYXNzb2NpYXRlZCB3ZWlnaHQuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gdGhyZXNob2xkCiAgICAgICAgKiBAcGFyYW0ge2FueX0gd2VpZ2h0cwogICAgICAgICogQHJldHVybnMge1NpZ25hdHVyZVJ1bGVzfQogICAgICAgICovCiAgICAgICAgc3RhdGljIG5ldyh0aHJlc2hvbGQsIHdlaWdodHMpIHsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IHRocmVzaG9sZDsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uc2lnbmF0dXJlcnVsZXNfbmV3KGxvdzAsIGhpZ2gwLCBhZGRIZWFwT2JqZWN0KHdlaWdodHMpKTsKICAgICAgICAgICAgcmV0dXJuIFNpZ25hdHVyZVJ1bGVzLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBBIGNvbGxlY3Rpb24gb2YgdHJhY2luZyBwb2xpY2llcy4gVXNlIHRoaXMgb2JqZWN0IHdoZW4gY29uc3RydWN0aW5nIGFzc2V0IHRyYW5zZmVycyB0byBnZW5lcmF0ZQogICAgKiB0aGUgY29ycmVjdCB0cmFjaW5nIHByb29mcyBmb3IgdHJhY2VhYmxlIGFzc2V0cy4KICAgICovCiAgICBjbGFzcyBUcmFjaW5nUG9saWNpZXMgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFRyYWNpbmdQb2xpY2llcy5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3RyYWNpbmdwb2xpY2llc19mcmVlKHB0cik7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFRyYWNpbmcgcG9saWN5IGZvciBhc3NldCB0cmFuc2ZlcnMuIENhbiBiZSBjb25maWd1cmVkIHRvIHRyYWNrIGNyZWRlbnRpYWxzLCB0aGUgYXNzZXQgdHlwZSBhbmQKICAgICogYW1vdW50LCBvciBib3RoLgogICAgKi8KICAgIGNsYXNzIFRyYWNpbmdQb2xpY3kgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFRyYWNpbmdQb2xpY3kucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ190cmFjaW5ncG9saWN5X2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0ge0Fzc2V0VHJhY2VyS2V5UGFpcn0gdHJhY2luZ19rZXkKICAgICAgICAqIEByZXR1cm5zIHtUcmFjaW5nUG9saWN5fQogICAgICAgICovCiAgICAgICAgc3RhdGljIG5ld193aXRoX3RyYWNpbmcodHJhY2luZ19rZXkpIHsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKHRyYWNpbmdfa2V5LCBBc3NldFRyYWNlcktleVBhaXIpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFjaW5ncG9saWN5X25ld193aXRoX3RyYWNpbmcodHJhY2luZ19rZXkucHRyKTsKICAgICAgICAgICAgcmV0dXJuIFRyYWNpbmdQb2xpY3kuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtBc3NldFRyYWNlcktleVBhaXJ9IHRyYWNpbmdfa2V5CiAgICAgICAgKiBAcGFyYW0ge0NyZWRJc3N1ZXJQdWJsaWNLZXl9IGNyZWRfaXNzdWVyX2tleQogICAgICAgICogQHBhcmFtIHthbnl9IHJldmVhbF9tYXAKICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdHJhY2luZwogICAgICAgICogQHJldHVybnMge1RyYWNpbmdQb2xpY3l9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgbmV3X3dpdGhfaWRlbnRpdHlfdHJhY2luZyh0cmFjaW5nX2tleSwgY3JlZF9pc3N1ZXJfa2V5LCByZXZlYWxfbWFwLCB0cmFjaW5nKSB7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyh0cmFjaW5nX2tleSwgQXNzZXRUcmFjZXJLZXlQYWlyKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGNyZWRfaXNzdWVyX2tleSwgQ3JlZElzc3VlclB1YmxpY0tleSk7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYWNpbmdwb2xpY3lfbmV3X3dpdGhfaWRlbnRpdHlfdHJhY2luZyh0cmFjaW5nX2tleS5wdHIsIGNyZWRfaXNzdWVyX2tleS5wdHIsIGFkZEhlYXBPYmplY3QocmV2ZWFsX21hcCksIHRyYWNpbmcpOwogICAgICAgICAgICByZXR1cm4gVHJhY2luZ1BvbGljeS5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU3RydWN0dXJlIHRoYXQgYWxsb3dzIHVzZXJzIHRvIGNvbnN0cnVjdCBhcmJpdHJhcnkgdHJhbnNhY3Rpb25zLgogICAgKi8KICAgIGNsYXNzIFRyYW5zYWN0aW9uQnVpbGRlciB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoVHJhbnNhY3Rpb25CdWlsZGVyLnByb3RvdHlwZSk7CiAgICAgICAgICAgIG9iai5wdHIgPSBwdHI7CgogICAgICAgICAgICByZXR1cm4gb2JqOwogICAgICAgIH0KCiAgICAgICAgX19kZXN0cm95X2ludG9fcmF3KCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLnB0cjsKICAgICAgICAgICAgdGhpcy5wdHIgPSAwOwoKICAgICAgICAgICAgcmV0dXJuIHB0cjsKICAgICAgICB9CgogICAgICAgIGZyZWUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHdhc20uX193YmdfdHJhbnNhY3Rpb25idWlsZGVyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0gYW06IGFtb3VudCB0byBwYXkKICAgICAgICAqIEBwYXJhbSBrcDogb3duZXIncyBYZnJLZXlQYWlyCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtwCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX2ZlZV9yZWxhdGl2ZV9hdXRvKGtwKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrcCwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciBwdHIwID0ga3AucHRyOwogICAgICAgICAgICBrcC5wdHIgPSAwOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfYWRkX2ZlZV9yZWxhdGl2ZV9hdXRvKHB0ciwgcHRyMCk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVXNlIHRoaXMgZnVuYyB0byBnZXQgdGhlIG5lY2Vzc2FyeSBpbmZvbWF0aW9ucyBmb3IgZ2VuZXJhdGluZyBgUmVsYXRpdmUgSW5wdXRzYAogICAgICAgICoKICAgICAgICAqIC0gVHhvUmVmOjpSZWxhdGl2ZSgiRWxlbWVudCBpbmRleCBvZiB0aGUgcmVzdWx0IikKICAgICAgICAqIC0gQ2xpZW50QXNzZXRSZWNvcmQ6OmZyb21fanNvbigiRWxlbWVudCBvZiB0aGUgcmVzdWx0IikKICAgICAgICAqIEByZXR1cm5zIHthbnlbXX0KICAgICAgICAqLwogICAgICAgIGdldF9yZWxhdGl2ZV9vdXRwdXRzKCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9nZXRfcmVsYXRpdmVfb3V0cHV0cyhyZXRwdHIsIHRoaXMucHRyKTsKICAgICAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgICAgIHZhciB2MCA9IGdldEFycmF5SnNWYWx1ZUZyb21XYXNtMChyMCwgcjEpLnNsaWNlKCk7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEgKiA0KTsKICAgICAgICAgICAgICAgIHJldHVybiB2MDsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBBcyB0aGUgbGFzdCBvcGVyYXRpb24gb2YgYW55IHRyYW5zYWN0aW9uLAogICAgICAgICogYWRkIGEgc3RhdGljIGZlZSB0byB0aGUgdHJhbnNhY3Rpb24uCiAgICAgICAgKiBAcGFyYW0ge0ZlZUlucHV0c30gaW5wdXRzCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX2ZlZShpbnB1dHMpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGlucHV0cywgRmVlSW5wdXRzKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBpbnB1dHMucHRyOwogICAgICAgICAgICBpbnB1dHMucHRyID0gMDsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9mZWUocHRyLCBwdHIwKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBBcyB0aGUgbGFzdCBvcGVyYXRpb24gb2YgQmFyVG9BYmFyIHRyYW5zYWN0aW9uLAogICAgICAgICogYWRkIGEgc3RhdGljIGZlZSB0byB0aGUgdHJhbnNhY3Rpb24uCiAgICAgICAgKiBAcGFyYW0ge0ZlZUlucHV0c30gaW5wdXRzCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX2ZlZV9iYXJfdG9fYWJhcihpbnB1dHMpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGlucHV0cywgRmVlSW5wdXRzKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBpbnB1dHMucHRyOwogICAgICAgICAgICBpbnB1dHMucHRyID0gMDsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9mZWVfYmFyX3RvX2FiYXIocHRyLCBwdHIwKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBBIHNpbXBsZSBmZWUgY2hlY2tlciBmb3IgbWFpbm5ldCB2MS4wLgogICAgICAgICoKICAgICAgICAqIFNFRSBbY2hlY2tfZmVlXShsZWRnZXI6OmRhdGFfbW9kZWw6OlRyYW5zYWN0aW9uOjpjaGVja19mZWUpCiAgICAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0KICAgICAgICAqLwogICAgICAgIGNoZWNrX2ZlZSgpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2NoZWNrX2ZlZSh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiByZXQgIT09IDA7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ3JlYXRlIGEgbmV3IHRyYW5zYWN0aW9uIGJ1aWxkZXIuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gc2VxX2lkIC0gVW5pcXVlIHNlcXVlbmNlIElEIHRvIHByZXZlbnQgcmVwbGF5IGF0dGFja3MuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gc2VxX2lkCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgc3RhdGljIG5ldyhzZXFfaWQpIHsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IHNlcV9pZDsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX25ldyhsb3cwLCBoaWdoMCk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogRGVzZXJpYWxpemUgdHJhbnNhY3Rpb24gYnVpbGRlciBmcm9tIHN0cmluZy4KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgc3RhdGljIGZyb21fc3RyaW5nKHMpIHsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChzLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfZnJvbV9zdHJpbmcocHRyMCwgbGVuMCk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV3JhcHMgYXJvdW5kIFRyYW5zYWN0aW9uQnVpbGRlciB0byBhZGQgYW4gYXNzZXQgZGVmaW5pdGlvbiBvcGVyYXRpb24gdG8gYSB0cmFuc2FjdGlvbiBidWlsZGVyIGluc3RhbmNlLgogICAgICAgICogQGV4YW1wbGUgPGNhcHRpb24+IEVycm9yIGhhbmRsaW5nIDwvY2FwdGlvbj4KICAgICAgICAqIHRyeSB7CiAgICAgICAgKiAgICAgYXdhaXQgd2FzbS5hZGRfb3BlcmF0aW9uX2NyZWF0ZV9hc3NldCh3YXNtLm5ld19rZXlwYWlyKCksICJ0ZXN0X21lbW8iLCB3YXNtLnJhbmRvbV9hc3NldF90eXBlKCksIHdhc20uQXNzZXRSdWxlcy5kZWZhdWx0KCkpOwogICAgICAgICogfSBjYXRjaCAoZXJyKSB7CiAgICAgICAgKiAgICAgY29uc29sZS5sb2coZXJyKQogICAgICAgICogfQogICAgICAgICoKICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5X3BhaXIgLSAgSXNzdWVyIFhmcktleVBhaXIuCiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWVtbyAtIFRleHQgZmllbGQgZm9yIGFzc2V0IGRlZmluaXRpb24uCiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW5fY29kZSAtIE9wdGlvbmFsIEJhc2U2NCBzdHJpbmcgcmVwcmVzZW50aW5nIHRoZSB0b2tlbiBjb2RlIG9mIHRoZSBhc3NldCB0byBiZSBpc3N1ZWQuCiAgICAgICAgKiBJZiBlbXB0eSwgYSB0b2tlbiBjb2RlIHdpbGwgYmUgY2hvc2VuIGF0IHJhbmRvbS4KICAgICAgICAqIEBwYXJhbSB7QXNzZXRSdWxlc30gYXNzZXRfcnVsZXMgLSBBc3NldCBydWxlcyBvYmplY3Qgc3BlY2lmeWluZyB3aGljaCBzaW1wbGUgcG9saWNpZXMgYXBwbHkKICAgICAgICAqIHRvIHRoZSBhc3NldC4KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5X3BhaXIKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtZW1vCiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG9rZW5fY29kZQogICAgICAgICogQHBhcmFtIHtBc3NldFJ1bGVzfSBhc3NldF9ydWxlcwogICAgICAgICogQHJldHVybnMge1RyYW5zYWN0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0KGtleV9wYWlyLCBtZW1vLCB0b2tlbl9jb2RlLCBhc3NldF9ydWxlcykgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5X3BhaXIsIFhmcktleVBhaXIpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKG1lbW8sIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciBwdHIxID0gcGFzc1N0cmluZ1RvV2FzbTAodG9rZW5fY29kZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMSA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGFzc2V0X3J1bGVzLCBBc3NldFJ1bGVzKTsKICAgICAgICAgICAgdmFyIHB0cjIgPSBhc3NldF9ydWxlcy5wdHI7CiAgICAgICAgICAgIGFzc2V0X3J1bGVzLnB0ciA9IDA7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9hZGRfb3BlcmF0aW9uX2NyZWF0ZV9hc3NldChwdHIsIGtleV9wYWlyLnB0ciwgcHRyMCwgbGVuMCwgcHRyMSwgbGVuMSwgcHRyMik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQGlnbm9yZQogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlfcGFpcgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG1lbW8KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0b2tlbl9jb2RlCiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gX3BvbGljeV9jaG9pY2UKICAgICAgICAqIEBwYXJhbSB7QXNzZXRSdWxlc30gYXNzZXRfcnVsZXMKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2FjdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfb3BlcmF0aW9uX2NyZWF0ZV9hc3NldF93aXRoX3BvbGljeShrZXlfcGFpciwgbWVtbywgdG9rZW5fY29kZSwgX3BvbGljeV9jaG9pY2UsIGFzc2V0X3J1bGVzKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlfcGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAobWVtbywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMCh0b2tlbl9jb2RlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcHRyMiA9IHBhc3NTdHJpbmdUb1dhc20wKF9wb2xpY3lfY2hvaWNlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4yID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXNzZXRfcnVsZXMsIEFzc2V0UnVsZXMpOwogICAgICAgICAgICB2YXIgcHRyMyA9IGFzc2V0X3J1bGVzLnB0cjsKICAgICAgICAgICAgYXNzZXRfcnVsZXMucHRyID0gMDsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9vcGVyYXRpb25fY3JlYXRlX2Fzc2V0X3dpdGhfcG9saWN5KHB0ciwga2V5X3BhaXIucHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xLCBwdHIyLCBsZW4yLCBwdHIzKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNhY3Rpb25CdWlsZGVyIHRvIGFkZCBhbiBhc3NldCBpc3N1YW5jZSB0byBhIHRyYW5zYWN0aW9uIGJ1aWxkZXIgaW5zdGFuY2UuCiAgICAgICAgKgogICAgICAgICogVXNlIHRoaXMgZnVuY3Rpb24gZm9yIHNpbXBsZSBvbmUtc2hvdCBpc3N1YW5jZXMuCiAgICAgICAgKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlfcGFpciAgLSBJc3N1ZXIgWGZyS2V5UGFpci4KICAgICAgICAqIGFuZCB0eXBlcyBvZiB0cmFjZWQgYXNzZXRzLgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUgLSBiYXNlNjQgc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgdG9rZW4gY29kZSBvZiB0aGUgYXNzZXQgdG8gYmUgaXNzdWVkLgogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IHNlcV9udW0gLSBJc3N1YW5jZSBzZXF1ZW5jZSBudW1iZXIuIEV2ZXJ5IHN1YnNlcXVlbnQgaXNzdWFuY2Ugb2YgYSBnaXZlbiBhc3NldCB0eXBlIG11c3QgaGF2ZSBhIGhpZ2hlciBzZXF1ZW5jZSBudW1iZXIgdGhhbiBiZWZvcmUuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gYW1vdW50IC0gQW1vdW50IHRvIGJlIGlzc3VlZC4KICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZl9hbW91bnQgLSBgdHJ1ZWAgbWVhbnMgdGhlIGFzc2V0IGFtb3VudCBpcyBjb25maWRlbnRpYWwsIGFuZCBgZmFsc2VgIG1lYW5zIGl0J3Mgbm9uY29uZmlkZW50aWFsLgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlfcGFpcgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGNvZGUKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBzZXFfbnVtCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gYW1vdW50CiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZfYW1vdW50CiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX2Jhc2ljX2lzc3VlX2Fzc2V0KGtleV9wYWlyLCBjb2RlLCBzZXFfbnVtLCBhbW91bnQsIGNvbmZfYW1vdW50KSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlfcGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoY29kZSwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IHNlcV9udW07CiAgICAgICAgICAgIGNvbnN0IGxvdzEgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMSA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBhbW91bnQ7CiAgICAgICAgICAgIGNvbnN0IGxvdzIgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMiA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9hZGRfYmFzaWNfaXNzdWVfYXNzZXQocHRyLCBrZXlfcGFpci5wdHIsIHB0cjAsIGxlbjAsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMiwgY29uZl9hbW91bnQpOwogICAgICAgICAgICByZXR1cm4gVHJhbnNhY3Rpb25CdWlsZGVyLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEFkZHMgYW4gb3BlcmF0aW9uIHRvIHRoZSB0cmFuc2FjdGlvbiBidWlsZGVyIHRoYXQgYWRkcyBhIGhhc2ggdG8gdGhlIGxlZGdlcidzIGN1c3RvbSBkYXRhCiAgICAgICAgKiBzdG9yZS4KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0gYXV0aF9rZXlfcGFpciAtIEFzc2V0IGNyZWF0b3Iga2V5IHBhaXIuCiAgICAgICAgKiBAcGFyYW0ge1N0cmluZ30gY29kZSAtIGJhc2U2NCBzdHJpbmcgcmVwcmVzZW50aW5nIHRva2VuIGNvZGUgb2YgdGhlIGFzc2V0IHdob3NlIG1lbW8gd2lsbCBiZSB1cGRhdGVkLgogICAgICAgICogdHJhbnNhY3Rpb24gdmFsaWRhdGVzLgogICAgICAgICogQHBhcmFtIHtTdHJpbmd9IG5ld19tZW1vIC0gVGhlIG5ldyBhc3NldCBtZW1vLgogICAgICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbX5Bc3NldFJ1bGVzI3NldF91cGRhdGFibGV8QXNzZXRSdWxlcy5zZXRfdXBkYXRhYmxlfSBmb3IgbW9yZSBpbmZvcm1hdGlvbiBhYm91dCBob3cKICAgICAgICAqIHRvIGRlZmluZSBhbiB1cGRhdGFibGUgYXNzZXQuCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGF1dGhfa2V5X3BhaXIKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlCiAgICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3X21lbW8KICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2FjdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfb3BlcmF0aW9uX3VwZGF0ZV9tZW1vKGF1dGhfa2V5X3BhaXIsIGNvZGUsIG5ld19tZW1vKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhhdXRoX2tleV9wYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChjb2RlLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKG5ld19tZW1vLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfYWRkX29wZXJhdGlvbl91cGRhdGVfbWVtbyhwdHIsIGF1dGhfa2V5X3BhaXIucHRyLCBwdHIwLCBsZW4wLCBwdHIxLCBsZW4xKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBBZGRzIGFuIG9wZXJhdGlvbiB0byB0aGUgdHJhbnNhY3Rpb24gYnVpbGRlciB0aGF0IGNvbnZlcnRzIGEgYmFyIHRvIGFiYXIuCiAgICAgICAgKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBhdXRoX2tleV9wYWlyIC0gaW5wdXQgYmFyIG93bmVyIGtleSBwYWlyCiAgICAgICAgKiBAcGFyYW0ge0FYZnJQdWJLZXl9IGFiYXJfcHVia2V5IC0gYWJhciByZWNlaXZlcidzIHB1YmxpYyBrZXkKICAgICAgICAqIEBwYXJhbSB7VHhvU0lEfSBpbnB1dF9zaWQgLSB0eG8gc2lkIG9mIGlucHV0IGJhcgogICAgICAgICogQHBhcmFtIHtDbGllbnRBc3NldFJlY29yZH0gaW5wdXRfcmVjb3JkIC0KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzZWVkCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGF1dGhfa2V5X3BhaXIKICAgICAgICAqIEBwYXJhbSB7QVhmclB1YktleX0gYWJhcl9wdWJrZXkKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSB0eG9fc2lkCiAgICAgICAgKiBAcGFyYW0ge0NsaWVudEFzc2V0UmVjb3JkfSBpbnB1dF9yZWNvcmQKICAgICAgICAqIEBwYXJhbSB7T3duZXJNZW1vIHwgdW5kZWZpbmVkfSBvd25lcl9tZW1vCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX29wZXJhdGlvbl9iYXJfdG9fYWJhcihzZWVkLCBhdXRoX2tleV9wYWlyLCBhYmFyX3B1YmtleSwgdHhvX3NpZCwgaW5wdXRfcmVjb3JkLCBvd25lcl9tZW1vKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoc2VlZCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGF1dGhfa2V5X3BhaXIsIFhmcktleVBhaXIpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYWJhcl9wdWJrZXksIEFYZnJQdWJLZXkpOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gdHhvX3NpZDsKICAgICAgICAgICAgY29uc3QgbG93MSA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gxID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGlucHV0X3JlY29yZCwgQ2xpZW50QXNzZXRSZWNvcmQpOwogICAgICAgICAgICBsZXQgcHRyMiA9IDA7CiAgICAgICAgICAgIGlmICghaXNMaWtlTm9uZShvd25lcl9tZW1vKSkgewogICAgICAgICAgICAgICAgX2Fzc2VydENsYXNzKG93bmVyX21lbW8sIE93bmVyTWVtbyk7CiAgICAgICAgICAgICAgICBwdHIyID0gb3duZXJfbWVtby5wdHI7CiAgICAgICAgICAgICAgICBvd25lcl9tZW1vLnB0ciA9IDA7CiAgICAgICAgICAgIH0KICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9vcGVyYXRpb25fYmFyX3RvX2FiYXIocHRyLCBwdHIwLCBsZW4wLCBhdXRoX2tleV9wYWlyLnB0ciwgYWJhcl9wdWJrZXkucHRyLCBsb3cxLCBoaWdoMSwgaW5wdXRfcmVjb3JkLnB0ciwgcHRyMik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQWRkcyBhbiBvcGVyYXRpb24gdG8gdHJhbnNhY3Rpb24gYnVpbGRlciB3aGljaCBjb252ZXJ0cyBhbiBhYmFyIHRvIGEgYmFyLgogICAgICAgICoKICAgICAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBpbnB1dCAtIHRoZSBBQkFSIHRvIGJlIGNvbnZlcnRlZAogICAgICAgICogQHBhcmFtIHtBeGZyT3duZXJNZW1vfSBheGZyIG93bmVyX21lbW8gLSB0aGUgY29ycmVzcG9uZGluZyBvd25lcl9tZW1vIG9mIHRoZSBBQkFSIHRvIGJlIGNvbnZlcnRlZAogICAgICAgICogQHBhcmFtIHtNVExlYWZJbmZvfSBtdF9sZWFmX2luZm8gLSB0aGUgTWVya2xlIFByb29mIG9mIHRoZSBBQkFSCiAgICAgICAgKiBAcGFyYW0ge0FYZnJLZXlQYWlyfSBmcm9tX2tleXBhaXIgLSB0aGUgb3duZXJzIEFub24gS2V5IHBhaXIKICAgICAgICAqIEBwYXJhbSB7WGZyUHVibGljfSByZWNpcGllbnQgLSB0aGUgQkFSIG93bmVyIHB1YmxpYyBrZXkKICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gY29uZl9hbW91bnQgLSB3aGV0aGVyIHRoZSBCQVIgYW1vdW50IHNob3VsZCBiZSBjb25maWRlbnRpYWwKICAgICAgICAqIEBwYXJhbSB7Ym9vbH0gY29uZl90eXBlIC0gd2hldGhlciB0aGUgQkFSIGFzc2V0IHR5cGUgc2hvdWxkIGJlIGNvbmZpZGVudGlhbAogICAgICAgICogQHBhcmFtIHtBbm9uQXNzZXRSZWNvcmR9IGlucHV0CiAgICAgICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG93bmVyX21lbW8KICAgICAgICAqIEBwYXJhbSB7TVRMZWFmSW5mb30gbXRfbGVhZl9pbmZvCiAgICAgICAgKiBAcGFyYW0ge0FYZnJLZXlQYWlyfSBmcm9tX2tleXBhaXIKICAgICAgICAqIEBwYXJhbSB7WGZyUHVibGljS2V5fSByZWNpcGllbnQKICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZl9hbW91bnQKICAgICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gY29uZl90eXBlCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX29wZXJhdGlvbl9hYmFyX3RvX2JhcihpbnB1dCwgb3duZXJfbWVtbywgbXRfbGVhZl9pbmZvLCBmcm9tX2tleXBhaXIsIHJlY2lwaWVudCwgY29uZl9hbW91bnQsIGNvbmZfdHlwZSkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoaW5wdXQsIEFub25Bc3NldFJlY29yZCk7CiAgICAgICAgICAgIHZhciBwdHIwID0gaW5wdXQucHRyOwogICAgICAgICAgICBpbnB1dC5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Mob3duZXJfbWVtbywgQXhmck93bmVyTWVtbyk7CiAgICAgICAgICAgIHZhciBwdHIxID0gb3duZXJfbWVtby5wdHI7CiAgICAgICAgICAgIG93bmVyX21lbW8ucHRyID0gMDsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKG10X2xlYWZfaW5mbywgTVRMZWFmSW5mbyk7CiAgICAgICAgICAgIHZhciBwdHIyID0gbXRfbGVhZl9pbmZvLnB0cjsKICAgICAgICAgICAgbXRfbGVhZl9pbmZvLnB0ciA9IDA7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhmcm9tX2tleXBhaXIsIEFYZnJLZXlQYWlyKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKHJlY2lwaWVudCwgWGZyUHVibGljS2V5KTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9vcGVyYXRpb25fYWJhcl90b19iYXIocHRyLCBwdHIwLCBwdHIxLCBwdHIyLCBmcm9tX2tleXBhaXIucHRyLCByZWNpcGllbnQucHRyLCBjb25mX2Ftb3VudCwgY29uZl90eXBlKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBSZXR1cm5zIGEgbGlzdCBvZiBjb21taXRtZW50IGJhc2U2NCBzdHJpbmdzIGFzIGpzb24KICAgICAgICAqIEByZXR1cm5zIHthbnl9CiAgICAgICAgKi8KICAgICAgICBnZXRfY29tbWl0bWVudHMoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9nZXRfY29tbWl0bWVudHModGhpcy5wdHIpOwogICAgICAgICAgICByZXR1cm4gdGFrZU9iamVjdChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEFkZHMgYW4gb3BlcmF0aW9uIHRvIHRyYW5zYWN0aW9uIGJ1aWxkZXIgd2hpY2ggdHJhbnNmZXIgYSBBbm9uIEJsaW5kIEFzc2V0IFJlY29yZAogICAgICAgICoKICAgICAgICAqIEBwYXJhbSB7QW5vbkFzc2V0UmVjb3JkfSBpbnB1dCAtIGlucHV0IGFiYXIKICAgICAgICAqIEBwYXJhbSB7QXhmck93bmVyTWVtb30gYXhmciBvd25lcl9tZW1vIC0gaW5wdXQgb3duZXIgbWVtbwogICAgICAgICogQHBhcmFtIHtBWGZyS2V5UGFpcn0gZnJvbV9rZXlwYWlyIC0gYWJhciBzZW5kZXIncyBwcml2YXRlIGtleQogICAgICAgICogQHBhcmFtIHtBWGZyUHViS2V5fSB0b19wdWJfa2V5IC0gcmVjZWl2ZXIncyBBbm9uIHB1YmxpYyBrZXkKICAgICAgICAqIEBwYXJhbSB7dTY0fSB0b19hbW91bnQgLSBhbW91bnQgdG8gc2VuZCB0byByZWNlaXZlcgogICAgICAgICogQHBhcmFtIHtBbm9uQXNzZXRSZWNvcmR9IGlucHV0CiAgICAgICAgKiBAcGFyYW0ge0F4ZnJPd25lck1lbW99IG93bmVyX21lbW8KICAgICAgICAqIEBwYXJhbSB7TVRMZWFmSW5mb30gbXRfbGVhZl9pbmZvCiAgICAgICAgKiBAcGFyYW0ge0FYZnJLZXlQYWlyfSBmcm9tX2tleXBhaXIKICAgICAgICAqIEBwYXJhbSB7QVhmclB1YktleX0gdG9fcHViX2tleQogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IHRvX2Ftb3VudAogICAgICAgICogQHJldHVybnMge1RyYW5zYWN0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9vcGVyYXRpb25fYW5vbl90cmFuc2ZlcihpbnB1dCwgb3duZXJfbWVtbywgbXRfbGVhZl9pbmZvLCBmcm9tX2tleXBhaXIsIHRvX3B1Yl9rZXksIHRvX2Ftb3VudCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoaW5wdXQsIEFub25Bc3NldFJlY29yZCk7CiAgICAgICAgICAgIHZhciBwdHIwID0gaW5wdXQucHRyOwogICAgICAgICAgICBpbnB1dC5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Mob3duZXJfbWVtbywgQXhmck93bmVyTWVtbyk7CiAgICAgICAgICAgIHZhciBwdHIxID0gb3duZXJfbWVtby5wdHI7CiAgICAgICAgICAgIG93bmVyX21lbW8ucHRyID0gMDsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKG10X2xlYWZfaW5mbywgTVRMZWFmSW5mbyk7CiAgICAgICAgICAgIHZhciBwdHIyID0gbXRfbGVhZl9pbmZvLnB0cjsKICAgICAgICAgICAgbXRfbGVhZl9pbmZvLnB0ciA9IDA7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhmcm9tX2tleXBhaXIsIEFYZnJLZXlQYWlyKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKHRvX3B1Yl9rZXksIEFYZnJQdWJLZXkpOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gdG9fYW1vdW50OwogICAgICAgICAgICBjb25zdCBsb3czID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDMgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfYWRkX29wZXJhdGlvbl9hbm9uX3RyYW5zZmVyKHB0ciwgcHRyMCwgcHRyMSwgcHRyMiwgZnJvbV9rZXlwYWlyLnB0ciwgdG9fcHViX2tleS5wdHIsIGxvdzMsIGhpZ2gzKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleXBhaXIKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWxpZGF0b3IKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2FjdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfb3BlcmF0aW9uX2RlbGVnYXRlKGtleXBhaXIsIGFtb3VudCwgdmFsaWRhdG9yKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IGFtb3VudDsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMCh2YWxpZGF0b3IsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9hZGRfb3BlcmF0aW9uX2RlbGVnYXRlKHB0ciwga2V5cGFpci5wdHIsIGxvdzAsIGhpZ2gwLCBwdHIxLCBsZW4xKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleXBhaXIKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2FjdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfb3BlcmF0aW9uX3VuZGVsZWdhdGUoa2V5cGFpcikgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5cGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9hZGRfb3BlcmF0aW9uX3VuZGVsZWdhdGUocHRyLCBrZXlwYWlyLnB0cik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlwYWlyCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gYW0KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0YXJnZXRfdmFsaWRhdG9yCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX29wZXJhdGlvbl91bmRlbGVnYXRlX3BhcnRpYWxseShrZXlwYWlyLCBhbSwgdGFyZ2V0X3ZhbGlkYXRvcikgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5cGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBhbTsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHB0cjEgPSBwYXNzU3RyaW5nVG9XYXNtMCh0YXJnZXRfdmFsaWRhdG9yLCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4xID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfYWRkX29wZXJhdGlvbl91bmRlbGVnYXRlX3BhcnRpYWxseShwdHIsIGtleXBhaXIucHRyLCBsb3cwLCBoaWdoMCwgcHRyMSwgbGVuMSk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlwYWlyCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX29wZXJhdGlvbl9jbGFpbShrZXlwYWlyKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXlwYWlyLCBYZnJLZXlQYWlyKTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9vcGVyYXRpb25fY2xhaW0ocHRyLCBrZXlwYWlyLnB0cik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlwYWlyCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gYW0KICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2FjdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfb3BlcmF0aW9uX2NsYWltX2N1c3RvbShrZXlwYWlyLCBhbSkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5cGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBhbTsKICAgICAgICAgICAgY29uc3QgbG93MCA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gwID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF9vcGVyYXRpb25fY2xhaW1fY3VzdG9tKHB0ciwga2V5cGFpci5wdHIsIGxvdzAsIGhpZ2gwKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBBZGRzIGFuIG9wZXJhdGlvbiB0byB0aGUgdHJhbnNhY3Rpb24gYnVpbGRlciB0aGF0IHN1cHBvcnQgdHJhbnNmZXIgdXR4byBhc3NldCB0byBldGhlcmV1bSBhZGRyZXNzLgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXlwYWlyIC0gQXNzZXQgY3JlYXRvciBrZXkgcGFpci4KICAgICAgICAqIEBwYXJhbSB7U3RyaW5nfSBldGhlcmV1bV9hZGRyZXNzIC0gVGhlIGFkZHJlc3MgdG8gcmVjZWl2ZSBFdGhlcmV1bSBhc3NldHMuCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleXBhaXIKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBldGhlcmV1bV9hZGRyZXNzCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gYW1vdW50CiAgICAgICAgKiBAcGFyYW0ge3N0cmluZyB8IHVuZGVmaW5lZH0gYXNzZXQKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nIHwgdW5kZWZpbmVkfSBsb3dsZXZlbF9kYXRhCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYWRkX29wZXJhdGlvbl9jb252ZXJ0X2FjY291bnQoa2V5cGFpciwgZXRoZXJldW1fYWRkcmVzcywgYW1vdW50LCBhc3NldCwgbG93bGV2ZWxfZGF0YSkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa2V5cGFpciwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAoZXRoZXJldW1fYWRkcmVzcywgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgdWludDY0Q3Z0U2hpbVswXSA9IGFtb3VudDsKICAgICAgICAgICAgY29uc3QgbG93MSA9IHUzMkN2dFNoaW1bMF07CiAgICAgICAgICAgIGNvbnN0IGhpZ2gxID0gdTMyQ3Z0U2hpbVsxXTsKICAgICAgICAgICAgdmFyIHB0cjIgPSBpc0xpa2VOb25lKGFzc2V0KSA/IDAgOiBwYXNzU3RyaW5nVG9XYXNtMChhc3NldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMiA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgdmFyIHB0cjMgPSBpc0xpa2VOb25lKGxvd2xldmVsX2RhdGEpID8gMCA6IHBhc3NTdHJpbmdUb1dhc20wKGxvd2xldmVsX2RhdGEsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjMgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9hZGRfb3BlcmF0aW9uX2NvbnZlcnRfYWNjb3VudChwdHIsIGtleXBhaXIucHRyLCBwdHIwLCBsZW4wLCBsb3cxLCBoaWdoMSwgcHRyMiwgbGVuMiwgcHRyMywgbGVuMyk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQWRkcyBhIHNlcmlhbGl6ZWQgdHJhbnNmZXIgYXNzZXQgb3BlcmF0aW9uIHRvIGEgdHJhbnNhY3Rpb24gYnVpbGRlciBpbnN0YW5jZS4KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcCAtIGEgSlNPTi1zZXJpYWxpemVkIHRyYW5zZmVyIG9wZXJhdGlvbi4KICAgICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc21+VHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyfSBmb3IgZGV0YWlscyBvbiBjb25zdHJ1Y3RpbmcgYSB0cmFuc2ZlciBvcGVyYXRpb24uCiAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYG9wYCBmYWlscyB0byBkZXNlcmlhbGl6ZS4KICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvcAogICAgICAgICogQHJldHVybnMge1RyYW5zYWN0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF90cmFuc2Zlcl9vcGVyYXRpb24ob3ApIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBwYXNzU3RyaW5nVG9XYXNtMChvcCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNhY3Rpb25idWlsZGVyX2FkZF90cmFuc2Zlcl9vcGVyYXRpb24ocHRyLCBwdHIwLCBsZW4wKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBCdWlsZHMgdGhlIGFub24gb3BlcmF0aW9ucyBmcm9tIHByZS1ub3RlcwogICAgICAgICogQHJldHVybnMge1RyYW5zYWN0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGJ1aWxkKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfYnVpbGQocHRyKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zYWN0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtwCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNhY3Rpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgc2lnbihrcCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3Moa3AsIFhmcktleVBhaXIpOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2FjdGlvbmJ1aWxkZXJfc2lnbihwdHIsIGtwLnB0cik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrcAogICAgICAgICogQHJldHVybnMge1RyYW5zYWN0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIHNpZ25fb3JpZ2luKGtwKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrcCwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9zaWduX29yaWdpbihwdHIsIGtwLnB0cik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2FjdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogRXh0cmFjdHMgdGhlIHNlcmlhbGl6ZWQgZm9ybSBvZiBhIHRyYW5zYWN0aW9uLgogICAgICAgICogQHJldHVybnMge3N0cmluZ30KICAgICAgICAqLwogICAgICAgIHRyYW5zYWN0aW9uKCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl90cmFuc2FjdGlvbihyZXRwdHIsIHRoaXMucHRyKTsKICAgICAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ2FsY3VsYXRlcyB0cmFuc2FjdGlvbiBoYW5kbGUuCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgdHJhbnNhY3Rpb25faGFuZGxlKCkgewogICAgICAgICAgICB0cnkgewogICAgICAgICAgICAgICAgY29uc3QgcmV0cHRyID0gd2FzbS5fX3diaW5kZ2VuX2FkZF90b19zdGFja19wb2ludGVyKC0xNik7CiAgICAgICAgICAgICAgICB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl90cmFuc2FjdGlvbl9oYW5kbGUocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIEZldGNoZXMgYSBjbGllbnQgcmVjb3JkIGZyb20gYSB0cmFuc2FjdGlvbi4KICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZHggLSBSZWNvcmQgdG8gZmV0Y2guIFJlY29yZHMgYXJlIGFkZGVkIHRvIHRoZSB0cmFuc2FjdGlvbiBidWlsZGVyIHNlcXVlbnRpYWxseS4KICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpZHgKICAgICAgICAqIEByZXR1cm5zIHtDbGllbnRBc3NldFJlY29yZH0KICAgICAgICAqLwogICAgICAgIGdldF9vd25lcl9yZWNvcmQoaWR4KSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9nZXRfb3duZXJfcmVjb3JkKHRoaXMucHRyLCBpZHgpOwogICAgICAgICAgICByZXR1cm4gQ2xpZW50QXNzZXRSZWNvcmQuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogRmV0Y2hlcyBhbiBvd25lciBtZW1vIGZyb20gYSB0cmFuc2FjdGlvbgogICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGlkeCAtIE93bmVyIG1lbW8gdG8gZmV0Y2guIE93bmVyIG1lbW9zIGFyZSBhZGRlZCB0byB0aGUgdHJhbnNhY3Rpb24gYnVpbGRlciBzZXF1ZW50aWFsbHkuCiAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gaWR4CiAgICAgICAgKiBAcmV0dXJucyB7T3duZXJNZW1vIHwgdW5kZWZpbmVkfQogICAgICAgICovCiAgICAgICAgZ2V0X293bmVyX21lbW8oaWR4KSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zYWN0aW9uYnVpbGRlcl9nZXRfb3duZXJfbWVtbyh0aGlzLnB0ciwgaWR4KTsKICAgICAgICAgICAgcmV0dXJuIHJldCA9PT0gMCA/IHVuZGVmaW5lZCA6IE93bmVyTWVtby5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogU3RydWN0dXJlIHRoYXQgZW5hYmxlcyBjbGllbnRzIHRvIGNvbnN0cnVjdCBjb21wbGV4IHRyYW5zZmVycy4KICAgICovCiAgICBjbGFzcyBUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXIgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3RyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ3JlYXRlIGEgbmV3IHRyYW5zZmVyIG9wZXJhdGlvbiBidWlsZGVyLgogICAgICAgICogQHJldHVybnMge1RyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIHN0YXRpYyBuZXcoKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9uZXcoKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHRvIGFkZCBhbiBpbnB1dCB0byBhIHRyYW5zZmVyIG9wZXJhdGlvbiBidWlsZGVyLgogICAgICAgICogQHBhcmFtIHtUeG9SZWZ9IHR4b19yZWYgLSBBYnNvbHV0ZSBvciByZWxhdGl2ZSB1dHhvIHJlZmVyZW5jZQogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGFzc2V0X3JlY29yZCAtIFNlcmlhbGl6ZWQgY2xpZW50IGFzc2V0IHJlY29yZCB0byBzZXJ2ZSBhcyB0cmFuc2ZlciBpbnB1dC4gVGhpcyByZWNvcmQgbXVzdCBleGlzdCBvbiB0aGUKICAgICAgICAqIGxlZGdlciBmb3IgdGhlIHRyYW5zZmVyIHRvIGJlIHZhbGlkLgogICAgICAgICogQHBhcmFtIHtPd25lck1lbW99IG93bmVyX21lbW8gLSBPcGVuaW5nIHBhcmFtZXRlcnMuCiAgICAgICAgKiBAcGFyYW0gdHJhY2luZ19rZXkge0Fzc2V0VHJhY2VyS2V5UGFpcn0gLSBUcmFjaW5nIGtleSwgbXVzdCBiZSBhZGRlZCB0byB0cmFjZWFibGUKICAgICAgICAqIGFzc2V0cy4KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5IC0gS2V5IHBhaXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4KICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQgLSBBbW91bnQgb2YgaW5wdXQgcmVjb3JkIHRvIHRyYW5zZmVyLgogICAgICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbX5UeG9SZWYjY3JlYXRlX2Fic29sdXRlX3R4b19yZWZ8VHhvUmVmLmNyZWF0ZV9hYnNvbHV0ZV90eG9fcmVmfQogICAgICAgICogb3Ige0BsaW5rIG1vZHVsZTpGaW5kb3JhLVdhc21+VHhvUmVmI2NyZWF0ZV9yZWxhdGl2ZV90eG9fcmVmfFR4b1JlZi5jcmVhdGVfcmVsYXRpdmVfdHhvX3JlZn0gZm9yIGRldGFpbHMgb24gdHhvCiAgICAgICAgKiByZWZlcmVuY2VzLgogICAgICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtTmV0d29ya35OZXR3b3JrI2dldFV0eG98TmV0d29yay5nZXRVdHhvfSBmb3IgZGV0YWlscyBvbiBmZXRjaGluZyBibGluZCBhc3NldCByZWNvcmRzLgogICAgICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGBvYXJgIG9yIGB0eG9fcmVmYCBmYWlsIHRvIGRlc2VyaWFsaXplLgogICAgICAgICogQHBhcmFtIHtUeG9SZWZ9IHR4b19yZWYKICAgICAgICAqIEBwYXJhbSB7Q2xpZW50QXNzZXRSZWNvcmR9IGFzc2V0X3JlY29yZAogICAgICAgICogQHBhcmFtIHtPd25lck1lbW8gfCB1bmRlZmluZWR9IG93bmVyX21lbW8KICAgICAgICAqIEBwYXJhbSB7VHJhY2luZ1BvbGljaWVzfSB0cmFjaW5nX3BvbGljaWVzCiAgICAgICAgKiBAcGFyYW0ge1hmcktleVBhaXJ9IGtleQogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IGFtb3VudAogICAgICAgICogQHJldHVybnMge1RyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9pbnB1dF93aXRoX3RyYWNpbmcodHhvX3JlZiwgYXNzZXRfcmVjb3JkLCBvd25lcl9tZW1vLCB0cmFjaW5nX3BvbGljaWVzLCBrZXksIGFtb3VudCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3ModHhvX3JlZiwgVHhvUmVmKTsKICAgICAgICAgICAgdmFyIHB0cjAgPSB0eG9fcmVmLnB0cjsKICAgICAgICAgICAgdHhvX3JlZi5wdHIgPSAwOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXNzZXRfcmVjb3JkLCBDbGllbnRBc3NldFJlY29yZCk7CiAgICAgICAgICAgIHZhciBwdHIxID0gYXNzZXRfcmVjb3JkLnB0cjsKICAgICAgICAgICAgYXNzZXRfcmVjb3JkLnB0ciA9IDA7CiAgICAgICAgICAgIGxldCBwdHIyID0gMDsKICAgICAgICAgICAgaWYgKCFpc0xpa2VOb25lKG93bmVyX21lbW8pKSB7CiAgICAgICAgICAgICAgICBfYXNzZXJ0Q2xhc3Mob3duZXJfbWVtbywgT3duZXJNZW1vKTsKICAgICAgICAgICAgICAgIHB0cjIgPSBvd25lcl9tZW1vLnB0cjsKICAgICAgICAgICAgICAgIG93bmVyX21lbW8ucHRyID0gMDsKICAgICAgICAgICAgfQogICAgICAgICAgICBfYXNzZXJ0Q2xhc3ModHJhY2luZ19wb2xpY2llcywgVHJhY2luZ1BvbGljaWVzKTsKICAgICAgICAgICAgX2Fzc2VydENsYXNzKGtleSwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBhbW91bnQ7CiAgICAgICAgICAgIGNvbnN0IGxvdzMgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMyA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9hZGRfaW5wdXRfd2l0aF90cmFjaW5nKHB0ciwgcHRyMCwgcHRyMSwgcHRyMiwgdHJhY2luZ19wb2xpY2llcy5wdHIsIGtleS5wdHIsIGxvdzMsIGhpZ2gzKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHRvIGFkZCBhbiBpbnB1dCB0byBhIHRyYW5zZmVyIG9wZXJhdGlvbiBidWlsZGVyLgogICAgICAgICogQHBhcmFtIHtUeG9SZWZ9IHR4b19yZWYgLSBBYnNvbHV0ZSBvciByZWxhdGl2ZSB1dHhvIHJlZmVyZW5jZQogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IGFzc2V0X3JlY29yZCAtIFNlcmlhbGl6ZWQgY2xpZW50IGFzc2V0IHJlY29yZCB0byBzZXJ2ZSBhcyB0cmFuc2ZlciBpbnB1dC4gVGhpcyByZWNvcmQgbXVzdCBleGlzdCBvbiB0aGUKICAgICAgICAqIGxlZGdlciBmb3IgdGhlIHRyYW5zZmVyIHRvIGJlIHZhbGlkCiAgICAgICAgKiBAcGFyYW0ge093bmVyTWVtb30gb3duZXJfbWVtbyAtIE9wZW5pbmcgcGFyYW1ldGVycy4KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga2V5IC0gS2V5IHBhaXIgYXNzb2NpYXRlZCB3aXRoIHRoZSBpbnB1dC4KICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQgLSBBbW91bnQgb2YgaW5wdXQgcmVjb3JkIHRvIHRyYW5zZmVyCiAgICAgICAgKiBvciB7QGxpbmsgbW9kdWxlOkZpbmRvcmEtV2FzbX5UeG9SZWYjY3JlYXRlX3JlbGF0aXZlX3R4b19yZWZ8VHhvUmVmLmNyZWF0ZV9yZWxhdGl2ZV90eG9fcmVmfSBmb3IgZGV0YWlscyBvbiB0eG8KICAgICAgICAqIHJlZmVyZW5jZXMuCiAgICAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6RmluZG9yYS1OZXR3b3Jrfk5ldHdvcmsjZ2V0VXR4b3xOZXR3b3JrLmdldFV0eG99IGZvciBkZXRhaWxzIG9uIGZldGNoaW5nIGJsaW5kIGFzc2V0IHJlY29yZHMuCiAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYG9hcmAgb3IgYHR4b19yZWZgIGZhaWwgdG8gZGVzZXJpYWxpemUuCiAgICAgICAgKiBAcGFyYW0ge1R4b1JlZn0gdHhvX3JlZgogICAgICAgICogQHBhcmFtIHtDbGllbnRBc3NldFJlY29yZH0gYXNzZXRfcmVjb3JkCiAgICAgICAgKiBAcGFyYW0ge093bmVyTWVtbyB8IHVuZGVmaW5lZH0gb3duZXJfbWVtbwogICAgICAgICogQHBhcmFtIHtYZnJLZXlQYWlyfSBrZXkKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBhZGRfaW5wdXRfbm9fdHJhY2luZyh0eG9fcmVmLCBhc3NldF9yZWNvcmQsIG93bmVyX21lbW8sIGtleSwgYW1vdW50KSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyh0eG9fcmVmLCBUeG9SZWYpOwogICAgICAgICAgICB2YXIgcHRyMCA9IHR4b19yZWYucHRyOwogICAgICAgICAgICB0eG9fcmVmLnB0ciA9IDA7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhhc3NldF9yZWNvcmQsIENsaWVudEFzc2V0UmVjb3JkKTsKICAgICAgICAgICAgbGV0IHB0cjEgPSAwOwogICAgICAgICAgICBpZiAoIWlzTGlrZU5vbmUob3duZXJfbWVtbykpIHsKICAgICAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhvd25lcl9tZW1vLCBPd25lck1lbW8pOwogICAgICAgICAgICAgICAgcHRyMSA9IG93bmVyX21lbW8ucHRyOwogICAgICAgICAgICAgICAgb3duZXJfbWVtby5wdHIgPSAwOwogICAgICAgICAgICB9CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrZXksIFhmcktleVBhaXIpOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gYW1vdW50OwogICAgICAgICAgICBjb25zdCBsb3cyID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDIgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfYWRkX2lucHV0X25vX3RyYWNpbmcocHRyLCBwdHIwLCBhc3NldF9yZWNvcmQucHRyLCBwdHIxLCBrZXkucHRyLCBsb3cyLCBoaWdoMik7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV3JhcHMgYXJvdW5kIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlciB0byBhZGQgYW4gb3V0cHV0IHRvIGEgdHJhbnNmZXIgb3BlcmF0aW9uIGJ1aWxkZXIuCiAgICAgICAgKgogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IGFtb3VudCAtIGFtb3VudCB0byB0cmFuc2ZlciB0byB0aGUgcmVjaXBpZW50LgogICAgICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IHJlY2lwaWVudCAtIHB1YmxpYyBrZXkgb2YgdGhlIHJlY2lwaWVudC4KICAgICAgICAqIEBwYXJhbSB0cmFjaW5nX2tleSB7QXNzZXRUcmFjZXJLZXlQYWlyfSAtIE9wdGlvbmFsIHRyYWNpbmcga2V5LCBtdXN0IGJlIGFkZGVkIHRvIHRyYWNlZAogICAgICAgICogYXNzZXRzLgogICAgICAgICogQHBhcmFtIGNvZGUge3N0cmluZ30gLSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGFzc2V0IHRva2VuIGNvZGUuCiAgICAgICAgKiBAcGFyYW0gY29uZl9hbW91bnQge2Jvb2xlYW59IC0gYHRydWVgIG1lYW5zIHRoZSBvdXRwdXQncyBhc3NldCBhbW91bnQgaXMgY29uZmlkZW50aWFsLCBhbmQgYGZhbHNlYCBtZWFucyBpdCdzIG5vbmNvbmZpZGVudGlhbC4KICAgICAgICAqIEBwYXJhbSBjb25mX3R5cGUge2Jvb2xlYW59IC0gYHRydWVgIG1lYW5zIHRoZSBvdXRwdXQncyBhc3NldCB0eXBlIGlzIGNvbmZpZGVudGlhbCwgYW5kIGBmYWxzZWAgbWVhbnMgaXQncyBub25jb25maWRlbnRpYWwuCiAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgYGNvZGVgIGZhaWxzIHRvIGRlc2VyaWFsaXplLgogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IGFtb3VudAogICAgICAgICogQHBhcmFtIHtYZnJQdWJsaWNLZXl9IHJlY2lwaWVudAogICAgICAgICogQHBhcmFtIHtUcmFjaW5nUG9saWNpZXN9IHRyYWNpbmdfcG9saWNpZXMKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlCiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZfYW1vdW50CiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZfdHlwZQogICAgICAgICogQHJldHVybnMge1RyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9vdXRwdXRfd2l0aF90cmFjaW5nKGFtb3VudCwgcmVjaXBpZW50LCB0cmFjaW5nX3BvbGljaWVzLCBjb2RlLCBjb25mX2Ftb3VudCwgY29uZl90eXBlKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBhbW91bnQ7CiAgICAgICAgICAgIGNvbnN0IGxvdzAgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMCA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhyZWNpcGllbnQsIFhmclB1YmxpY0tleSk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyh0cmFjaW5nX3BvbGljaWVzLCBUcmFjaW5nUG9saWNpZXMpOwogICAgICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGNvZGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9hZGRfb3V0cHV0X3dpdGhfdHJhY2luZyhwdHIsIGxvdzAsIGhpZ2gwLCByZWNpcGllbnQucHRyLCB0cmFjaW5nX3BvbGljaWVzLnB0ciwgcHRyMSwgbGVuMSwgY29uZl9hbW91bnQsIGNvbmZfdHlwZSk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV3JhcHMgYXJvdW5kIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlciB0byBhZGQgYW4gb3V0cHV0IHRvIGEgdHJhbnNmZXIgb3BlcmF0aW9uIGJ1aWxkZXIuCiAgICAgICAgKgogICAgICAgICogQHBhcmFtIHtCaWdJbnR9IGFtb3VudCAtIGFtb3VudCB0byB0cmFuc2ZlciB0byB0aGUgcmVjaXBpZW50CiAgICAgICAgKiBAcGFyYW0ge1hmclB1YmxpY0tleX0gcmVjaXBpZW50IC0gcHVibGljIGtleSBvZiB0aGUgcmVjaXBpZW50CiAgICAgICAgKiBAcGFyYW0gY29kZSB7c3RyaW5nfSAtIFN0cmluZyByZXByZXNlbnRhaXRvbiBvZiB0aGUgYXNzZXQgdG9rZW4gY29kZQogICAgICAgICogQHBhcmFtIGNvbmZfYW1vdW50IHtib29sZWFufSAtIGB0cnVlYCBtZWFucyB0aGUgb3V0cHV0J3MgYXNzZXQgYW1vdW50IGlzIGNvbmZpZGVudGlhbCwgYW5kIGBmYWxzZWAgbWVhbnMgaXQncyBub25jb25maWRlbnRpYWwuCiAgICAgICAgKiBAcGFyYW0gY29uZl90eXBlIHtib29sZWFufSAtIGB0cnVlYCBtZWFucyB0aGUgb3V0cHV0J3MgYXNzZXQgdHlwZSBpcyBjb25maWRlbnRpYWwsIGFuZCBgZmFsc2VgIG1lYW5zIGl0J3Mgbm9uY29uZmlkZW50aWFsLgogICAgICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIGBjb2RlYCBmYWlscyB0byBkZXNlcmlhbGl6ZS4KICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBhbW91bnQKICAgICAgICAqIEBwYXJhbSB7WGZyUHVibGljS2V5fSByZWNpcGllbnQKICAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlCiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZfYW1vdW50CiAgICAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGNvbmZfdHlwZQogICAgICAgICogQHJldHVybnMge1RyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcn0KICAgICAgICAqLwogICAgICAgIGFkZF9vdXRwdXRfbm9fdHJhY2luZyhhbW91bnQsIHJlY2lwaWVudCwgY29kZSwgY29uZl9hbW91bnQsIGNvbmZfdHlwZSkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gYW1vdW50OwogICAgICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MocmVjaXBpZW50LCBYZnJQdWJsaWNLZXkpOwogICAgICAgICAgICB2YXIgcHRyMSA9IHBhc3NTdHJpbmdUb1dhc20wKGNvZGUsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjEgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9hZGRfb3V0cHV0X25vX3RyYWNpbmcocHRyLCBsb3cwLCBoaWdoMCwgcmVjaXBpZW50LnB0ciwgcHRyMSwgbGVuMSwgY29uZl9hbW91bnQsIGNvbmZfdHlwZSk7CiAgICAgICAgICAgIHJldHVybiBUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXIuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogV3JhcHMgYXJvdW5kIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlciB0byBlbnN1cmUgdGhlIHRyYW5zZmVyIGlucHV0cyBhbmQgb3V0cHV0cyBhcmUgYmFsYW5jZWQuCiAgICAgICAgKiBUaGlzIGZ1bmN0aW9uIHdpbGwgYWRkIGNoYW5nZSBvdXRwdXRzIGZvciBhbGwgdW5zcGVudCBwb3J0aW9ucyBvZiBpbnB1dCByZWNvcmRzLgogICAgICAgICogQHRocm93cyBXaWxsIHRocm93IGFuIGVycm9yIGlmIHRoZSB0cmFuc2FjdGlvbiBjYW5ub3QgYmUgYmFsYW5jZWQuCiAgICAgICAgKiBAcmV0dXJucyB7VHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyfQogICAgICAgICovCiAgICAgICAgYmFsYW5jZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20udHJhbnNmZXJvcGVyYXRpb25idWlsZGVyX2JhbGFuY2UocHRyKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHRvIGZpbmFsaXplIHRoZSB0cmFuc2FjdGlvbi4KICAgICAgICAqCiAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgaW5wdXQgYW5kIG91dHB1dCBhbW91bnRzIGRvIG5vdCBhZGQgdXAuCiAgICAgICAgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgbm90IGFsbCByZWNvcmQgb3duZXJzIGhhdmUgc2lnbmVkIHRoZSB0cmFuc2FjdGlvbi4KICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBjcmVhdGUoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9jcmVhdGUocHRyKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHRvIGFkZCBhIHNpZ25hdHVyZSB0byB0aGUgb3BlcmF0aW9uLgogICAgICAgICoKICAgICAgICAqIEFsbCBpbnB1dCBvd25lcnMgbXVzdCBzaWduLgogICAgICAgICoKICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga3AgLSBrZXkgcGFpciBvZiBvbmUgb2YgdGhlIGlucHV0IG93bmVycy4KICAgICAgICAqIEBwYXJhbSB7WGZyS2V5UGFpcn0ga3AKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBzaWduKGtwKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMuX19kZXN0cm95X2ludG9fcmF3KCk7CiAgICAgICAgICAgIF9hc3NlcnRDbGFzcyhrcCwgWGZyS2V5UGFpcik7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9zaWduKHB0ciwga3AucHRyKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBAcmV0dXJucyB7c3RyaW5nfQogICAgICAgICovCiAgICAgICAgYnVpbGRlcigpIHsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICAgICAgd2FzbS50cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfYnVpbGRlcihyZXRwdHIsIHRoaXMucHRyKTsKICAgICAgICAgICAgICAgIHZhciByMCA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAwXTsKICAgICAgICAgICAgICAgIHZhciByMSA9IGdldEludDMyTWVtb3J5MCgpW3JldHB0ciAvIDQgKyAxXTsKICAgICAgICAgICAgICAgIHJldHVybiBnZXRTdHJpbmdGcm9tV2FzbTAocjAsIHIxKTsKICAgICAgICAgICAgfSBmaW5hbGx5IHsKICAgICAgICAgICAgICAgIHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigxNik7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fZnJlZShyMCwgcjEpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQHBhcmFtIHtzdHJpbmd9IHMKICAgICAgICAqIEByZXR1cm5zIHtUcmFuc2Zlck9wZXJhdGlvbkJ1aWxkZXJ9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgZnJvbV9zdHJpbmcocykgewogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHMsIHdhc20uX193YmluZGdlbl9tYWxsb2MsIHdhc20uX193YmluZGdlbl9yZWFsbG9jKTsKICAgICAgICAgICAgdmFyIGxlbjAgPSBXQVNNX1ZFQ1RPUl9MRU47CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnRyYW5zZmVyb3BlcmF0aW9uYnVpbGRlcl9mcm9tX3N0cmluZyhwdHIwLCBsZW4wKTsKICAgICAgICAgICAgcmV0dXJuIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlci5fX3dyYXAocmV0KTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBXcmFwcyBhcm91bmQgVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyIHRvIGV4dHJhY3QgYW4gb3BlcmF0aW9uIGV4cHJlc3Npb24gYXMgSlNPTi4KICAgICAgICAqIEByZXR1cm5zIHtzdHJpbmd9CiAgICAgICAgKi8KICAgICAgICB0cmFuc2FjdGlvbigpIHsKICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgIGNvbnN0IHJldHB0ciA9IHdhc20uX193YmluZGdlbl9hZGRfdG9fc3RhY2tfcG9pbnRlcigtMTYpOwogICAgICAgICAgICAgICAgd2FzbS50cmFuc2Zlcm9wZXJhdGlvbmJ1aWxkZXJfdHJhbnNhY3Rpb24ocmV0cHRyLCB0aGlzLnB0cik7CiAgICAgICAgICAgICAgICB2YXIgcjAgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMF07CiAgICAgICAgICAgICAgICB2YXIgcjEgPSBnZXRJbnQzMk1lbW9yeTAoKVtyZXRwdHIgLyA0ICsgMV07CiAgICAgICAgICAgICAgICByZXR1cm4gZ2V0U3RyaW5nRnJvbVdhc20wKHIwLCByMSk7CiAgICAgICAgICAgIH0gZmluYWxseSB7CiAgICAgICAgICAgICAgICB3YXNtLl9fd2JpbmRnZW5fYWRkX3RvX3N0YWNrX3BvaW50ZXIoMTYpOwogICAgICAgICAgICAgICAgd2FzbS5fX3diaW5kZ2VuX2ZyZWUocjAsIHIxKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBJbmRpY2F0ZXMgd2hldGhlciB0aGUgVFhPIHJlZiBpcyBhbiBhYnNvbHV0ZSBvciByZWxhdGl2ZSB2YWx1ZS4KICAgICovCiAgICBjbGFzcyBUeG9SZWYgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFR4b1JlZi5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3R4b3JlZl9mcmVlKHB0cik7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogQ3JlYXRlcyBhIHJlbGF0aXZlIHR4byByZWZlcmVuY2UgYXMgYSBKU09OIHN0cmluZy4gUmVsYXRpdmUgdHhvIHJlZmVyZW5jZXMgYXJlIG9mZnNldAogICAgICAgICogYmFja3dhcmRzIGZyb20gdGhlIG9wZXJhdGlvbiB0aGV5IGFwcGVhciBpbiAtLSAwIGlzIHRoZSBtb3N0IHJlY2VudCwgKG4tMSkgaXMgdGhlIGZpcnN0IG91dHB1dAogICAgICAgICogb2YgdGhlIHRyYW5zYWN0aW9uLgogICAgICAgICoKICAgICAgICAqIFVzZSByZWxhdGl2ZSB0eG8gaW5kZXhpbmcgd2hlbiByZWZlcnJpbmcgdG8gb3V0cHV0cyBvZiBpbnRlcm1lZGlhdGUgb3BlcmF0aW9ucyAoZS5nLiBhCiAgICAgICAgKiB0cmFuc2FjdGlvbiBjb250YWluaW5nIGJvdGggYW4gaXNzdWFuY2UgYW5kIGEgdHJhbnNmZXIpLgogICAgICAgICoKICAgICAgICAqICMgQXJndW1lbnRzCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gaWR4IC0gIFJlbGF0aXZlIFRYTyAodHJhbnNhY3Rpb24gb3V0cHV0KSBTSUQuCiAgICAgICAgKiBAcGFyYW0ge0JpZ0ludH0gaWR4CiAgICAgICAgKiBAcmV0dXJucyB7VHhvUmVmfQogICAgICAgICovCiAgICAgICAgc3RhdGljIHJlbGF0aXZlKGlkeCkgewogICAgICAgICAgICB1aW50NjRDdnRTaGltWzBdID0gaWR4OwogICAgICAgICAgICBjb25zdCBsb3cwID0gdTMyQ3Z0U2hpbVswXTsKICAgICAgICAgICAgY29uc3QgaGlnaDAgPSB1MzJDdnRTaGltWzFdOwogICAgICAgICAgICB2YXIgcmV0ID0gd2FzbS50eG9yZWZfcmVsYXRpdmUobG93MCwgaGlnaDApOwogICAgICAgICAgICByZXR1cm4gVHhvUmVmLl9fd3JhcChyZXQpOwogICAgICAgIH0KICAgICAgICAvKioKICAgICAgICAqIENyZWF0ZXMgYW4gYWJzb2x1dGUgdHJhbnNhY3Rpb24gcmVmZXJlbmNlIGFzIGEgSlNPTiBzdHJpbmcuCiAgICAgICAgKgogICAgICAgICogVXNlIGFic29sdXRlIHR4byBpbmRleGluZyB3aGVuIHJlZmVycmluZyB0byBhbiBvdXRwdXQgdGhhdCBoYXMgYmVlbiBhc3NpZ25lZCBhIHV0eG8gaW5kZXggKGkuZS4KICAgICAgICAqIHdoZW4gdGhlIHV0eG8gaGFzIGJlZW4gY29tbWl0dGVkIHRvIHRoZSBsZWRnZXIgaW4gYW4gZWFybGllciB0cmFuc2FjdGlvbikuCiAgICAgICAgKgogICAgICAgICogIyBBcmd1bWVudHMKICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBpZHggLSAgVHhvICh0cmFuc2FjdGlvbiBvdXRwdXQpIFNJRC4KICAgICAgICAqIEBwYXJhbSB7QmlnSW50fSBpZHgKICAgICAgICAqIEByZXR1cm5zIHtUeG9SZWZ9CiAgICAgICAgKi8KICAgICAgICBzdGF0aWMgYWJzb2x1dGUoaWR4KSB7CiAgICAgICAgICAgIHVpbnQ2NEN2dFNoaW1bMF0gPSBpZHg7CiAgICAgICAgICAgIGNvbnN0IGxvdzAgPSB1MzJDdnRTaGltWzBdOwogICAgICAgICAgICBjb25zdCBoaWdoMCA9IHUzMkN2dFNoaW1bMV07CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLnR4b3JlZl9hYnNvbHV0ZShsb3cwLCBoaWdoMCk7CiAgICAgICAgICAgIHJldHVybiBUeG9SZWYuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgfQogICAgLyoqCiAgICAqIFRoZSBwdWJsaWMga2V5IGZvciB0aGUgaHlicmlkIGVuY3J5cHRpb24gc2NoZW1lLgogICAgKi8KICAgIGNsYXNzIFhQdWJsaWNLZXkgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFhQdWJsaWNLZXkucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ194cHVibGlja2V5X2ZyZWUocHRyKTsKICAgICAgICB9CiAgICB9CiAgICAvKioKICAgICogVGhlIHNlY3JldCBrZXkgZm9yIHRoZSBoeWJyaWQgZW5jcnlwdGlvbiBzY2hlbWUuCiAgICAqLwogICAgY2xhc3MgWFNlY3JldEtleSB7CgogICAgICAgIHN0YXRpYyBfX3dyYXAocHRyKSB7CiAgICAgICAgICAgIGNvbnN0IG9iaiA9IE9iamVjdC5jcmVhdGUoWFNlY3JldEtleS5wcm90b3R5cGUpOwogICAgICAgICAgICBvYmoucHRyID0gcHRyOwoKICAgICAgICAgICAgcmV0dXJuIG9iajsKICAgICAgICB9CgogICAgICAgIF9fZGVzdHJveV9pbnRvX3JhdygpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5wdHI7CiAgICAgICAgICAgIHRoaXMucHRyID0gMDsKCiAgICAgICAgICAgIHJldHVybiBwdHI7CiAgICAgICAgfQoKICAgICAgICBmcmVlKCkgewogICAgICAgICAgICBjb25zdCBwdHIgPSB0aGlzLl9fZGVzdHJveV9pbnRvX3JhdygpOwogICAgICAgICAgICB3YXNtLl9fd2JnX3hzZWNyZXRrZXlfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBUaGUga2V5cGFpciBmb3IgY29uZmlkZW50aWFsIHRyYW5zZmVyLgogICAgKi8KICAgIGNsYXNzIFhmcktleVBhaXIgewoKICAgICAgICBzdGF0aWMgX193cmFwKHB0cikgewogICAgICAgICAgICBjb25zdCBvYmogPSBPYmplY3QuY3JlYXRlKFhmcktleVBhaXIucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ194ZnJrZXlwYWlyX2ZyZWUocHRyKTsKICAgICAgICB9CiAgICAgICAgLyoqCiAgICAgICAgKiBUaGUgcHVibGljIGtleS4KICAgICAgICAqIEByZXR1cm5zIHtYZnJQdWJsaWNLZXl9CiAgICAgICAgKi8KICAgICAgICBnZXQgcHViX2tleSgpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHdhc20uX193YmdfZ2V0X3hmcmtleXBhaXJfcHViX2tleSh0aGlzLnB0cik7CiAgICAgICAgICAgIHJldHVybiBYZnJQdWJsaWNLZXkuX193cmFwKHJldCk7CiAgICAgICAgfQogICAgICAgIC8qKgogICAgICAgICogVGhlIHB1YmxpYyBrZXkuCiAgICAgICAgKiBAcGFyYW0ge1hmclB1YmxpY0tleX0gYXJnMAogICAgICAgICovCiAgICAgICAgc2V0IHB1Yl9rZXkoYXJnMCkgewogICAgICAgICAgICBfYXNzZXJ0Q2xhc3MoYXJnMCwgWGZyUHVibGljS2V5KTsKICAgICAgICAgICAgdmFyIHB0cjAgPSBhcmcwLnB0cjsKICAgICAgICAgICAgYXJnMC5wdHIgPSAwOwogICAgICAgICAgICB3YXNtLl9fd2JnX3NldF94ZnJrZXlwYWlyX3B1Yl9rZXkodGhpcy5wdHIsIHB0cjApOwogICAgICAgIH0KICAgIH0KICAgIC8qKgogICAgKiBUaGUgcHVibGljIGtleSB3cmFwcGVyIGZvciBjb25maWRlbnRpYWwgdHJhbnNmZXIsIGZvciBXQVNNIGNvbXBhdGFiaWxpdHkuCiAgICAqLwogICAgY2xhc3MgWGZyUHVibGljS2V5IHsKCiAgICAgICAgc3RhdGljIF9fd3JhcChwdHIpIHsKICAgICAgICAgICAgY29uc3Qgb2JqID0gT2JqZWN0LmNyZWF0ZShYZnJQdWJsaWNLZXkucHJvdG90eXBlKTsKICAgICAgICAgICAgb2JqLnB0ciA9IHB0cjsKCiAgICAgICAgICAgIHJldHVybiBvYmo7CiAgICAgICAgfQoKICAgICAgICBfX2Rlc3Ryb3lfaW50b19yYXcoKSB7CiAgICAgICAgICAgIGNvbnN0IHB0ciA9IHRoaXMucHRyOwogICAgICAgICAgICB0aGlzLnB0ciA9IDA7CgogICAgICAgICAgICByZXR1cm4gcHRyOwogICAgICAgIH0KCiAgICAgICAgZnJlZSgpIHsKICAgICAgICAgICAgY29uc3QgcHRyID0gdGhpcy5fX2Rlc3Ryb3lfaW50b19yYXcoKTsKICAgICAgICAgICAgd2FzbS5fX3diZ194ZnJwdWJsaWNrZXlfZnJlZShwdHIpOwogICAgICAgIH0KICAgIH0KCiAgICBhc3luYyBmdW5jdGlvbiBsb2FkKG1vZHVsZSwgaW1wb3J0cykgewogICAgICAgIGlmICh0eXBlb2YgUmVzcG9uc2UgPT09ICdmdW5jdGlvbicgJiYgbW9kdWxlIGluc3RhbmNlb2YgUmVzcG9uc2UpIHsKICAgICAgICAgICAgaWYgKHR5cGVvZiBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZVN0cmVhbWluZyA9PT0gJ2Z1bmN0aW9uJykgewogICAgICAgICAgICAgICAgdHJ5IHsKICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgV2ViQXNzZW1ibHkuaW5zdGFudGlhdGVTdHJlYW1pbmcobW9kdWxlLCBpbXBvcnRzKTsKCiAgICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7CiAgICAgICAgICAgICAgICAgICAgaWYgKG1vZHVsZS5oZWFkZXJzLmdldCgnQ29udGVudC1UeXBlJykgIT0gJ2FwcGxpY2F0aW9uL3dhc20nKSB7CiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybigiYFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nYCBmYWlsZWQgYmVjYXVzZSB5b3VyIHNlcnZlciBkb2VzIG5vdCBzZXJ2ZSB3YXNtIHdpdGggYGFwcGxpY2F0aW9uL3dhc21gIE1JTUUgdHlwZS4gRmFsbGluZyBiYWNrIHRvIGBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZWAgd2hpY2ggaXMgc2xvd2VyLiBPcmlnaW5hbCBlcnJvcjpcbiIsIGUpOwoKICAgICAgICAgICAgICAgICAgICB9IGVsc2UgewogICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlOwogICAgICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQoKICAgICAgICAgICAgY29uc3QgYnl0ZXMgPSBhd2FpdCBtb2R1bGUuYXJyYXlCdWZmZXIoKTsKICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlKGJ5dGVzLCBpbXBvcnRzKTsKCiAgICAgICAgfSBlbHNlIHsKICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBhd2FpdCBXZWJBc3NlbWJseS5pbnN0YW50aWF0ZShtb2R1bGUsIGltcG9ydHMpOwoKICAgICAgICAgICAgaWYgKGluc3RhbmNlIGluc3RhbmNlb2YgV2ViQXNzZW1ibHkuSW5zdGFuY2UpIHsKICAgICAgICAgICAgICAgIHJldHVybiB7IGluc3RhbmNlLCBtb2R1bGUgfTsKCiAgICAgICAgICAgIH0gZWxzZSB7CiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CgogICAgYXN5bmMgZnVuY3Rpb24gaW5pdChpbnB1dCkgewogICAgICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICd1bmRlZmluZWQnKSB7CiAgICAgICAgICAgIGlucHV0ID0gbmV3IFVSTCgnd2FzbV9iZy53YXNtJywgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQgJiYgZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmMgfHwgbmV3IFVSTCgnc3luYy5qcycsIGRvY3VtZW50LmJhc2VVUkkpLmhyZWYpKTsKICAgICAgICB9CiAgICAgICAgY29uc3QgaW1wb3J0cyA9IHt9OwogICAgICAgIGltcG9ydHMud2JnID0ge307CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9zdHJpbmdfbmV3ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkgewogICAgICAgICAgICB2YXIgcmV0ID0gZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfZHJvcF9yZWYgPSBmdW5jdGlvbihhcmcwKSB7CiAgICAgICAgICAgIHRha2VPYmplY3QoYXJnMCk7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2pzb25fc2VyaWFsaXplID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkgewogICAgICAgICAgICBjb25zdCBvYmogPSBnZXRPYmplY3QoYXJnMSk7CiAgICAgICAgICAgIHZhciByZXQgPSBKU09OLnN0cmluZ2lmeShvYmogPT09IHVuZGVmaW5lZCA/IG51bGwgOiBvYmopOwogICAgICAgICAgICB2YXIgcHRyMCA9IHBhc3NTdHJpbmdUb1dhc20wKHJldCwgd2FzbS5fX3diaW5kZ2VuX21hbGxvYywgd2FzbS5fX3diaW5kZ2VuX3JlYWxsb2MpOwogICAgICAgICAgICB2YXIgbGVuMCA9IFdBU01fVkVDVE9SX0xFTjsKICAgICAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAxXSA9IGxlbjA7CiAgICAgICAgICAgIGdldEludDMyTWVtb3J5MCgpW2FyZzAgLyA0ICsgMF0gPSBwdHIwOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9qc29uX3BhcnNlID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkgewogICAgICAgICAgICB2YXIgcmV0ID0gSlNPTi5wYXJzZShnZXRTdHJpbmdGcm9tV2FzbTAoYXJnMCwgYXJnMSkpOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9vYmplY3RfY2xvbmVfcmVmID0gZnVuY3Rpb24oYXJnMCkgewogICAgICAgICAgICB2YXIgcmV0ID0gZ2V0T2JqZWN0KGFyZzApOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193Ymdfbm93XzRhYmJjYTRlZjJhYmE4ZDYgPSBmdW5jdGlvbihhcmcwKSB7CiAgICAgICAgICAgIHZhciByZXQgPSBnZXRPYmplY3QoYXJnMCkubm93KCk7CiAgICAgICAgICAgIHJldHVybiByZXQ7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19yYW5kb21GaWxsU3luY19mMjA1NDEzMDNhOTkwNDI5ID0gaGFuZGxlRXJyb3IoZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikgewogICAgICAgICAgICBnZXRPYmplY3QoYXJnMCkucmFuZG9tRmlsbFN5bmMoZ2V0QXJyYXlVOEZyb21XYXNtMChhcmcxLCBhcmcyKSk7CiAgICAgICAgfSk7CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfZ2V0UmFuZG9tVmFsdWVzX2YzMDhlNzIzM2U1NjAxYjcgPSBoYW5kbGVFcnJvcihmdW5jdGlvbihhcmcwLCBhcmcxKSB7CiAgICAgICAgICAgIGdldE9iamVjdChhcmcwKS5nZXRSYW5kb21WYWx1ZXMoZ2V0T2JqZWN0KGFyZzEpKTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19jcnlwdG9fOGZkMDJkNzJjNGJhNmM1YyA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5jcnlwdG87CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX29iamVjdCA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgY29uc3QgdmFsID0gZ2V0T2JqZWN0KGFyZzApOwogICAgICAgICAgICB2YXIgcmV0ID0gdHlwZW9mKHZhbCkgPT09ICdvYmplY3QnICYmIHZhbCAhPT0gbnVsbDsKICAgICAgICAgICAgcmV0dXJuIHJldDsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JnX3Byb2Nlc3NfYmQwMmQ3MWE2NWNmNzM0YyA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5wcm9jZXNzOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfdmVyc2lvbnNfMWQ3MGQ0MDdjYjIzMTI5ZCA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS52ZXJzaW9uczsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JnX25vZGVfMDA5MWNkZjFmZmE3M2U0ZCA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5ub2RlOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfbXNDcnlwdG9fN2UxZTYwMTRiZGRkNzVkZSA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5tc0NyeXB0bzsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JnX3JlcXVpcmVfYjA2YWJkOTE5NjU0ODhjOCA9IGhhbmRsZUVycm9yKGZ1bmN0aW9uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gbW9kdWxlLnJlcXVpcmU7CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfSk7CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19mdW5jdGlvbiA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IHR5cGVvZihnZXRPYmplY3QoYXJnMCkpID09PSAnZnVuY3Rpb24nOwogICAgICAgICAgICByZXR1cm4gcmV0OwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfZ2V0XzBjNjk2M2NiYWIzNGZiYjYgPSBoYW5kbGVFcnJvcihmdW5jdGlvbihhcmcwLCBhcmcxKSB7CiAgICAgICAgICAgIHZhciByZXQgPSBSZWZsZWN0LmdldChnZXRPYmplY3QoYXJnMCksIGdldE9iamVjdChhcmcxKSk7CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfSk7CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfY2FsbF9jYjQ3OGQ4OGYzMDY4YzkxID0gaGFuZGxlRXJyb3IoZnVuY3Rpb24oYXJnMCwgYXJnMSkgewogICAgICAgICAgICB2YXIgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLmNhbGwoZ2V0T2JqZWN0KGFyZzEpKTsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19zZWxmXzA1YzU0ZGNhY2I2MjNiOWEgPSBoYW5kbGVFcnJvcihmdW5jdGlvbigpIHsKICAgICAgICAgICAgdmFyIHJldCA9IHNlbGYuc2VsZjsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ193aW5kb3dfOTc3N2NlNDQ2ZDEyOTg5ZiA9IGhhbmRsZUVycm9yKGZ1bmN0aW9uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gd2luZG93LndpbmRvdzsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxUaGlzX2YwY2EwYmJiMDE0OWNmM2QgPSBoYW5kbGVFcnJvcihmdW5jdGlvbigpIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdsb2JhbFRoaXMuZ2xvYmFsVGhpczsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19nbG9iYWxfYzNjODMyNWFlOGM3ZjFhOSA9IGhhbmRsZUVycm9yKGZ1bmN0aW9uKCkgewogICAgICAgICAgICB2YXIgcmV0ID0gZ2xvYmFsLmdsb2JhbDsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2lzX3VuZGVmaW5lZCA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKSA9PT0gdW5kZWZpbmVkOwogICAgICAgICAgICByZXR1cm4gcmV0OwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfbmV3bm9hcmdzXzNlZmM3YmZhNjlhNjgxZjkgPSBmdW5jdGlvbihhcmcwLCBhcmcxKSB7CiAgICAgICAgICAgIHZhciByZXQgPSBuZXcgRnVuY3Rpb24oZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JnX2NhbGxfZjVlMDU3NmY2MWVlNzQ2MSA9IGhhbmRsZUVycm9yKGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5jYWxsKGdldE9iamVjdChhcmcxKSwgZ2V0T2JqZWN0KGFyZzIpKTsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9KTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19idWZmZXJfZWJjNmM4ZTc1NTEwZWFlMyA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5idWZmZXI7CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19sZW5ndGhfMzE3ZjBkZDc3ZjdhNjY3MyA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IGdldE9iamVjdChhcmcwKS5sZW5ndGg7CiAgICAgICAgICAgIHJldHVybiByZXQ7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19uZXdfMTM1ZTk2M2RlZGY2N2IyMiA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdmFyIHJldCA9IG5ldyBVaW50OEFycmF5KGdldE9iamVjdChhcmcwKSk7CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19zZXRfNGE1MDcyYTMxMDA4ZTBjYiA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEsIGFyZzIpIHsKICAgICAgICAgICAgZ2V0T2JqZWN0KGFyZzApLnNldChnZXRPYmplY3QoYXJnMSksIGFyZzIgPj4+IDApOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmdfbmV3d2l0aGxlbmd0aF83OGRjMzAyZDMxNTI3MzE4ID0gZnVuY3Rpb24oYXJnMCkgewogICAgICAgICAgICB2YXIgcmV0ID0gbmV3IFVpbnQ4QXJyYXkoYXJnMCA+Pj4gMCk7CiAgICAgICAgICAgIHJldHVybiBhZGRIZWFwT2JqZWN0KHJldCk7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diZ19zdWJhcnJheV8zNGMyMjhhNDVjNzJkMTQ2ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSwgYXJnMikgewogICAgICAgICAgICB2YXIgcmV0ID0gZ2V0T2JqZWN0KGFyZzApLnN1YmFycmF5KGFyZzEgPj4+IDAsIGFyZzIgPj4+IDApOwogICAgICAgICAgICByZXR1cm4gYWRkSGVhcE9iamVjdChyZXQpOwogICAgICAgIH07CiAgICAgICAgaW1wb3J0cy53YmcuX193YmluZGdlbl9pc19zdHJpbmcgPSBmdW5jdGlvbihhcmcwKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB0eXBlb2YoZ2V0T2JqZWN0KGFyZzApKSA9PT0gJ3N0cmluZyc7CiAgICAgICAgICAgIHJldHVybiByZXQ7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX2RlYnVnX3N0cmluZyA9IGZ1bmN0aW9uKGFyZzAsIGFyZzEpIHsKICAgICAgICAgICAgdmFyIHJldCA9IGRlYnVnU3RyaW5nKGdldE9iamVjdChhcmcxKSk7CiAgICAgICAgICAgIHZhciBwdHIwID0gcGFzc1N0cmluZ1RvV2FzbTAocmV0LCB3YXNtLl9fd2JpbmRnZW5fbWFsbG9jLCB3YXNtLl9fd2JpbmRnZW5fcmVhbGxvYyk7CiAgICAgICAgICAgIHZhciBsZW4wID0gV0FTTV9WRUNUT1JfTEVOOwogICAgICAgICAgICBnZXRJbnQzMk1lbW9yeTAoKVthcmcwIC8gNCArIDFdID0gbGVuMDsKICAgICAgICAgICAgZ2V0SW50MzJNZW1vcnkwKClbYXJnMCAvIDQgKyAwXSA9IHB0cjA7CiAgICAgICAgfTsKICAgICAgICBpbXBvcnRzLndiZy5fX3diaW5kZ2VuX3Rocm93ID0gZnVuY3Rpb24oYXJnMCwgYXJnMSkgewogICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0U3RyaW5nRnJvbVdhc20wKGFyZzAsIGFyZzEpKTsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fcmV0aHJvdyA9IGZ1bmN0aW9uKGFyZzApIHsKICAgICAgICAgICAgdGhyb3cgdGFrZU9iamVjdChhcmcwKTsKICAgICAgICB9OwogICAgICAgIGltcG9ydHMud2JnLl9fd2JpbmRnZW5fbWVtb3J5ID0gZnVuY3Rpb24oKSB7CiAgICAgICAgICAgIHZhciByZXQgPSB3YXNtLm1lbW9yeTsKICAgICAgICAgICAgcmV0dXJuIGFkZEhlYXBPYmplY3QocmV0KTsKICAgICAgICB9OwoKICAgICAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyB8fCAodHlwZW9mIFJlcXVlc3QgPT09ICdmdW5jdGlvbicgJiYgaW5wdXQgaW5zdGFuY2VvZiBSZXF1ZXN0KSB8fCAodHlwZW9mIFVSTCA9PT0gJ2Z1bmN0aW9uJyAmJiBpbnB1dCBpbnN0YW5jZW9mIFVSTCkpIHsKICAgICAgICAgICAgaW5wdXQgPSBmZXRjaChpbnB1dCk7CiAgICAgICAgfQoKCgogICAgICAgIGNvbnN0IHsgaW5zdGFuY2UsIG1vZHVsZSB9ID0gYXdhaXQgbG9hZChhd2FpdCBpbnB1dCwgaW1wb3J0cyk7CgogICAgICAgIHdhc20gPSBpbnN0YW5jZS5leHBvcnRzOwogICAgICAgIGluaXQuX193YmluZGdlbl93YXNtX21vZHVsZSA9IG1vZHVsZTsKCiAgICAgICAgcmV0dXJuIHdhc207CiAgICB9CgogICAgdmFyIGxlZGdlciA9IC8qI19fUFVSRV9fKi9PYmplY3QuZnJlZXplKHsKICAgICAgICBfX3Byb3RvX186IG51bGwsCiAgICAgICAgYnVpbGRfaWQ6IGJ1aWxkX2lkLAogICAgICAgIHJhbmRvbV9hc3NldF90eXBlOiByYW5kb21fYXNzZXRfdHlwZSwKICAgICAgICBoYXNoX2Fzc2V0X2NvZGU6IGhhc2hfYXNzZXRfY29kZSwKICAgICAgICBhc3NldF90eXBlX2Zyb21fanN2YWx1ZTogYXNzZXRfdHlwZV9mcm9tX2pzdmFsdWUsCiAgICAgICAgdmVyaWZ5X2F1dGhlbnRpY2F0ZWRfdHhuOiB2ZXJpZnlfYXV0aGVudGljYXRlZF90eG4sCiAgICAgICAgZ2V0X251bGxfcGs6IGdldF9udWxsX3BrLAogICAgICAgIHRyYW5zZmVyX3RvX3V0eG9fZnJvbV9hY2NvdW50OiB0cmFuc2Zlcl90b191dHhvX2Zyb21fYWNjb3VudCwKICAgICAgICByZWNvdmVyX3NrX2Zyb21fbW5lbW9uaWM6IHJlY292ZXJfc2tfZnJvbV9tbmVtb25pYywKICAgICAgICByZWNvdmVyX2FkZHJlc3NfZnJvbV9zazogcmVjb3Zlcl9hZGRyZXNzX2Zyb21fc2ssCiAgICAgICAgZ2V0X3NlcmlhbGl6ZWRfYWRkcmVzczogZ2V0X3NlcmlhbGl6ZWRfYWRkcmVzcywKICAgICAgICBnZW5fYW5vbl9rZXlzOiBnZW5fYW5vbl9rZXlzLAogICAgICAgIGdldF9hbm9uX2JhbGFuY2U6IGdldF9hbm9uX2JhbGFuY2UsCiAgICAgICAgZ2V0X29wZW5fYWJhcjogZ2V0X29wZW5fYWJhciwKICAgICAgICBnZW5fbnVsbGlmaWVyX2hhc2g6IGdlbl9udWxsaWZpZXJfaGFzaCwKICAgICAgICBvcGVuX2NsaWVudF9hc3NldF9yZWNvcmQ6IG9wZW5fY2xpZW50X2Fzc2V0X3JlY29yZCwKICAgICAgICBnZXRfcHViX2tleV9zdHI6IGdldF9wdWJfa2V5X3N0ciwKICAgICAgICBnZXRfcHJpdl9rZXlfc3RyOiBnZXRfcHJpdl9rZXlfc3RyLAogICAgICAgIGdldF9wcml2X2tleV9oZXhfc3RyX2J5X21uZW1vbmljOiBnZXRfcHJpdl9rZXlfaGV4X3N0cl9ieV9tbmVtb25pYywKICAgICAgICBnZXRfa2V5cGFpcl9ieV9wcmlfa2V5OiBnZXRfa2V5cGFpcl9ieV9wcmlfa2V5LAogICAgICAgIGdldF9wdWJfa2V5X2hleF9zdHJfYnlfcHJpdl9rZXk6IGdldF9wdWJfa2V5X2hleF9zdHJfYnlfcHJpdl9rZXksCiAgICAgICAgZ2V0X2FkZHJlc3NfYnlfcHVibGljX2tleTogZ2V0X2FkZHJlc3NfYnlfcHVibGljX2tleSwKICAgICAgICBnZXRfcHViX2tleV9zdHJfb2xkOiBnZXRfcHViX2tleV9zdHJfb2xkLAogICAgICAgIGdldF9wcml2X2tleV9zdHJfb2xkOiBnZXRfcHJpdl9rZXlfc3RyX29sZCwKICAgICAgICBuZXdfa2V5cGFpcjogbmV3X2tleXBhaXIsCiAgICAgICAgbmV3X2tleXBhaXJfb2xkOiBuZXdfa2V5cGFpcl9vbGQsCiAgICAgICAgbmV3X2tleXBhaXJfZnJvbV9zZWVkOiBuZXdfa2V5cGFpcl9mcm9tX3NlZWQsCiAgICAgICAgcHVibGljX2tleV90b19iYXNlNjQ6IHB1YmxpY19rZXlfdG9fYmFzZTY0LAogICAgICAgIHB1YmxpY19rZXlfZnJvbV9iYXNlNjQ6IHB1YmxpY19rZXlfZnJvbV9iYXNlNjQsCiAgICAgICAga2V5cGFpcl90b19zdHI6IGtleXBhaXJfdG9fc3RyLAogICAgICAgIGtleXBhaXJfZnJvbV9zdHI6IGtleXBhaXJfZnJvbV9zdHIsCiAgICAgICAgd2FzbV9jcmVkZW50aWFsX2lzc3Vlcl9rZXlfZ2VuOiB3YXNtX2NyZWRlbnRpYWxfaXNzdWVyX2tleV9nZW4sCiAgICAgICAgd2FzbV9jcmVkZW50aWFsX3ZlcmlmeV9jb21taXRtZW50OiB3YXNtX2NyZWRlbnRpYWxfdmVyaWZ5X2NvbW1pdG1lbnQsCiAgICAgICAgd2FzbV9jcmVkZW50aWFsX29wZW5fY29tbWl0bWVudDogd2FzbV9jcmVkZW50aWFsX29wZW5fY29tbWl0bWVudCwKICAgICAgICB3YXNtX2NyZWRlbnRpYWxfdXNlcl9rZXlfZ2VuOiB3YXNtX2NyZWRlbnRpYWxfdXNlcl9rZXlfZ2VuLAogICAgICAgIHdhc21fY3JlZGVudGlhbF9zaWduOiB3YXNtX2NyZWRlbnRpYWxfc2lnbiwKICAgICAgICBjcmVhdGVfY3JlZGVudGlhbDogY3JlYXRlX2NyZWRlbnRpYWwsCiAgICAgICAgd2FzbV9jcmVkZW50aWFsX2NvbW1pdDogd2FzbV9jcmVkZW50aWFsX2NvbW1pdCwKICAgICAgICB3YXNtX2NyZWRlbnRpYWxfcmV2ZWFsOiB3YXNtX2NyZWRlbnRpYWxfcmV2ZWFsLAogICAgICAgIHdhc21fY3JlZGVudGlhbF92ZXJpZnk6IHdhc21fY3JlZGVudGlhbF92ZXJpZnksCiAgICAgICAgdHJhY2VfYXNzZXRzOiB0cmFjZV9hc3NldHMsCiAgICAgICAgcHVibGljX2tleV90b19iZWNoMzI6IHB1YmxpY19rZXlfdG9fYmVjaDMyLAogICAgICAgIHB1YmxpY19rZXlfZnJvbV9iZWNoMzI6IHB1YmxpY19rZXlfZnJvbV9iZWNoMzIsCiAgICAgICAgYmVjaDMyX3RvX2Jhc2U2NDogYmVjaDMyX3RvX2Jhc2U2NCwKICAgICAgICBiZWNoMzJfdG9fYmFzZTY0X29sZDogYmVjaDMyX3RvX2Jhc2U2NF9vbGQsCiAgICAgICAgYmFzZTY0X3RvX2JlY2gzMjogYmFzZTY0X3RvX2JlY2gzMiwKICAgICAgICBiYXNlNjRfdG9fYmFzZTU4OiBiYXNlNjRfdG9fYmFzZTU4LAogICAgICAgIGVuY3J5cHRpb25fcGJrZGYyX2FlczI1NmdjbTogZW5jcnlwdGlvbl9wYmtkZjJfYWVzMjU2Z2NtLAogICAgICAgIGRlY3J5cHRpb25fcGJrZGYyX2FlczI1NmdjbTogZGVjcnlwdGlvbl9wYmtkZjJfYWVzMjU2Z2NtLAogICAgICAgIGNyZWF0ZV9rZXlwYWlyX2Zyb21fc2VjcmV0OiBjcmVhdGVfa2V5cGFpcl9mcm9tX3NlY3JldCwKICAgICAgICBnZXRfcGtfZnJvbV9rZXlwYWlyOiBnZXRfcGtfZnJvbV9rZXlwYWlyLAogICAgICAgIGdlbmVyYXRlX21uZW1vbmljX2RlZmF1bHQ6IGdlbmVyYXRlX21uZW1vbmljX2RlZmF1bHQsCiAgICAgICAgZ2VuZXJhdGVfbW5lbW9uaWNfY3VzdG9tOiBnZW5lcmF0ZV9tbmVtb25pY19jdXN0b20sCiAgICAgICAgcmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfZGVmYXVsdDogcmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfZGVmYXVsdCwKICAgICAgICByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19lZDI1NTE5OiByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19lZDI1NTE5LAogICAgICAgIHJlc3RvcmVfa2V5cGFpcl9mcm9tX21uZW1vbmljX2JpcDQ0OiByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19iaXA0NCwKICAgICAgICByZXN0b3JlX2tleXBhaXJfZnJvbV9tbmVtb25pY19iaXA0OTogcmVzdG9yZV9rZXlwYWlyX2Zyb21fbW5lbW9uaWNfYmlwNDksCiAgICAgICAgZnJhX2dldF9hc3NldF9jb2RlOiBmcmFfZ2V0X2Fzc2V0X2NvZGUsCiAgICAgICAgZnJhX2dldF9taW5pbWFsX2ZlZTogZnJhX2dldF9taW5pbWFsX2ZlZSwKICAgICAgICBmcmFfZ2V0X21pbmltYWxfZmVlX2Zvcl9iYXJfdG9fYWJhcjogZnJhX2dldF9taW5pbWFsX2ZlZV9mb3JfYmFyX3RvX2FiYXIsCiAgICAgICAgZ2V0X2Fub25fZmVlOiBnZXRfYW5vbl9mZWUsCiAgICAgICAgZnJhX2dldF9kZXN0X3B1YmtleTogZnJhX2dldF9kZXN0X3B1YmtleSwKICAgICAgICBnZXRfZGVsZWdhdGlvbl90YXJnZXRfYWRkcmVzczogZ2V0X2RlbGVnYXRpb25fdGFyZ2V0X2FkZHJlc3MsCiAgICAgICAgZ2V0X2NvaW5iYXNlX2FkZHJlc3M6IGdldF9jb2luYmFzZV9hZGRyZXNzLAogICAgICAgIGdldF9jb2luYmFzZV9wcmluY2lwYWxfYWRkcmVzczogZ2V0X2NvaW5iYXNlX3ByaW5jaXBhbF9hZGRyZXNzLAogICAgICAgIGdldF9kZWxlZ2F0aW9uX21pbl9hbW91bnQ6IGdldF9kZWxlZ2F0aW9uX21pbl9hbW91bnQsCiAgICAgICAgZ2V0X2RlbGVnYXRpb25fbWF4X2Ftb3VudDogZ2V0X2RlbGVnYXRpb25fbWF4X2Ftb3VudCwKICAgICAgICBheGZyX3B1YmtleV9mcm9tX3N0cmluZzogYXhmcl9wdWJrZXlfZnJvbV9zdHJpbmcsCiAgICAgICAgYXhmcl9rZXlwYWlyX2Zyb21fc3RyaW5nOiBheGZyX2tleXBhaXJfZnJvbV9zdHJpbmcsCiAgICAgICAgeF9wdWJrZXlfZnJvbV9zdHJpbmc6IHhfcHVia2V5X2Zyb21fc3RyaW5nLAogICAgICAgIHhfc2VjcmV0a2V5X2Zyb21fc3RyaW5nOiB4X3NlY3JldGtleV9mcm9tX3N0cmluZywKICAgICAgICBhYmFyX2Zyb21fanNvbjogYWJhcl9mcm9tX2pzb24sCiAgICAgICAgb3Blbl9hYmFyOiBvcGVuX2FiYXIsCiAgICAgICAgZGVjcnlwdF9heGZyX21lbW86IGRlY3J5cHRfYXhmcl9tZW1vLAogICAgICAgIHRyeV9kZWNyeXB0X2F4ZnJfbWVtbzogdHJ5X2RlY3J5cHRfYXhmcl9tZW1vLAogICAgICAgIHBhcnNlX2F4ZnJfbWVtbzogcGFyc2VfYXhmcl9tZW1vLAogICAgICAgIGNvbW1pdG1lbnRfdG9fYWFyOiBjb21taXRtZW50X3RvX2FhciwKICAgICAgICBBWGZyS2V5UGFpcjogQVhmcktleVBhaXIsCiAgICAgICAgQVhmclB1YktleTogQVhmclB1YktleSwKICAgICAgICBBbW91bnRBc3NldFR5cGU6IEFtb3VudEFzc2V0VHlwZSwKICAgICAgICBBbm9uQXNzZXRSZWNvcmQ6IEFub25Bc3NldFJlY29yZCwKICAgICAgICBBbm9uS2V5czogQW5vbktleXMsCiAgICAgICAgQW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcjogQW5vblRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlciwKICAgICAgICBBc3NldFJ1bGVzOiBBc3NldFJ1bGVzLAogICAgICAgIEFzc2V0VHJhY2VyS2V5UGFpcjogQXNzZXRUcmFjZXJLZXlQYWlyLAogICAgICAgIEFzc2V0VHlwZTogQXNzZXRUeXBlLAogICAgICAgIEF1dGhlbnRpY2F0ZWRBc3NldFJlY29yZDogQXV0aGVudGljYXRlZEFzc2V0UmVjb3JkLAogICAgICAgIEF4ZnJPd25lck1lbW86IEF4ZnJPd25lck1lbW8sCiAgICAgICAgQXhmck93bmVyTWVtb0luZm86IEF4ZnJPd25lck1lbW9JbmZvLAogICAgICAgIEJMU0cxOiBCTFNHMSwKICAgICAgICBCTFNHMjogQkxTRzIsCiAgICAgICAgQkxTR3Q6IEJMU0d0LAogICAgICAgIEJMU1NjYWxhcjogQkxTU2NhbGFyLAogICAgICAgIEJpcFBhdGg6IEJpcFBhdGgsCiAgICAgICAgQ2xpZW50QXNzZXRSZWNvcmQ6IENsaWVudEFzc2V0UmVjb3JkLAogICAgICAgIENyZWRJc3N1ZXJQdWJsaWNLZXk6IENyZWRJc3N1ZXJQdWJsaWNLZXksCiAgICAgICAgQ3JlZElzc3VlclNlY3JldEtleTogQ3JlZElzc3VlclNlY3JldEtleSwKICAgICAgICBDcmVkVXNlclB1YmxpY0tleTogQ3JlZFVzZXJQdWJsaWNLZXksCiAgICAgICAgQ3JlZFVzZXJTZWNyZXRLZXk6IENyZWRVc2VyU2VjcmV0S2V5LAogICAgICAgIENyZWRlbnRpYWw6IENyZWRlbnRpYWwsCiAgICAgICAgQ3JlZGVudGlhbENvbW1pdG1lbnQ6IENyZWRlbnRpYWxDb21taXRtZW50LAogICAgICAgIENyZWRlbnRpYWxDb21taXRtZW50RGF0YTogQ3JlZGVudGlhbENvbW1pdG1lbnREYXRhLAogICAgICAgIENyZWRlbnRpYWxDb21taXRtZW50S2V5OiBDcmVkZW50aWFsQ29tbWl0bWVudEtleSwKICAgICAgICBDcmVkZW50aWFsSXNzdWVyS2V5UGFpcjogQ3JlZGVudGlhbElzc3VlcktleVBhaXIsCiAgICAgICAgQ3JlZGVudGlhbFBvSzogQ3JlZGVudGlhbFBvSywKICAgICAgICBDcmVkZW50aWFsUmV2ZWFsU2lnOiBDcmVkZW50aWFsUmV2ZWFsU2lnLAogICAgICAgIENyZWRlbnRpYWxTaWduYXR1cmU6IENyZWRlbnRpYWxTaWduYXR1cmUsCiAgICAgICAgQ3JlZGVudGlhbFVzZXJLZXlQYWlyOiBDcmVkZW50aWFsVXNlcktleVBhaXIsCiAgICAgICAgRmVlSW5wdXRzOiBGZWVJbnB1dHMsCiAgICAgICAgSnVianViU2NhbGFyOiBKdWJqdWJTY2FsYXIsCiAgICAgICAgTVRMZWFmSW5mbzogTVRMZWFmSW5mbywKICAgICAgICBNVE5vZGU6IE1UTm9kZSwKICAgICAgICBPd25lck1lbW86IE93bmVyTWVtbywKICAgICAgICBTRUNQMjU2SzFHMTogU0VDUDI1NksxRzEsCiAgICAgICAgU0VDUDI1NksxU2NhbGFyOiBTRUNQMjU2SzFTY2FsYXIsCiAgICAgICAgU0VDUTI1NksxRzE6IFNFQ1EyNTZLMUcxLAogICAgICAgIFNFQ1EyNTZLMVNjYWxhcjogU0VDUTI1NksxU2NhbGFyLAogICAgICAgIFNpZ25hdHVyZVJ1bGVzOiBTaWduYXR1cmVSdWxlcywKICAgICAgICBUcmFjaW5nUG9saWNpZXM6IFRyYWNpbmdQb2xpY2llcywKICAgICAgICBUcmFjaW5nUG9saWN5OiBUcmFjaW5nUG9saWN5LAogICAgICAgIFRyYW5zYWN0aW9uQnVpbGRlcjogVHJhbnNhY3Rpb25CdWlsZGVyLAogICAgICAgIFRyYW5zZmVyT3BlcmF0aW9uQnVpbGRlcjogVHJhbnNmZXJPcGVyYXRpb25CdWlsZGVyLAogICAgICAgIFR4b1JlZjogVHhvUmVmLAogICAgICAgIFhQdWJsaWNLZXk6IFhQdWJsaWNLZXksCiAgICAgICAgWFNlY3JldEtleTogWFNlY3JldEtleSwKICAgICAgICBYZnJLZXlQYWlyOiBYZnJLZXlQYWlyLAogICAgICAgIFhmclB1YmxpY0tleTogWGZyUHVibGljS2V5LAogICAgICAgICdkZWZhdWx0JzogaW5pdAogICAgfSk7CgogICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbiAoKSB7IHJldHVybiB3YXNtX2JnJDE7IH0pOwogICAgY29uc3QgZ2V0TGVkZ2VyID0gYXN5bmMgKCkgPT4gewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIHJldHVybiBsZWRnZXI7CiAgICAgICAgfQogICAgICAgIGNhdGNoIChlcnJvcikgewogICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7CiAgICAgICAgICAgIHJldHVybiBudWxsOwogICAgICAgIH0KICAgIH07CiAgICBjb25zdCBpbml0TGVkZ2VyID0gYXN5bmMgKCkgPT4gewogICAgICAgIHRyeSB7CiAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ldyBVUkwoJ2ZpbmRvcmEtd2FsbGV0LXdhc20vd2ViLWxpZ2h0d2VpZ2h0L3dhc21fYmcud2FzbScsIChkb2N1bWVudC5jdXJyZW50U2NyaXB0ICYmIGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjIHx8IG5ldyBVUkwoJ3N5bmMuanMnLCBkb2N1bWVudC5iYXNlVVJJKS5ocmVmKSkpOwogICAgICAgICAgICBjb25zdCBsZWRnZXIgPSBhd2FpdCBnZXRMZWRnZXIoKTsKICAgICAgICAgICAgaWYgKHR5cGVvZiBsZWRnZXI/LmRlZmF1bHQgPT09ICdmdW5jdGlvbicpIHsKICAgICAgICAgICAgICAgIGF3YWl0IGxlZGdlcj8uZGVmYXVsdCgpOwogICAgICAgICAgICB9CiAgICAgICAgICAgIHJldHVybiB0cnVlOwogICAgICAgIH0KICAgICAgICBjYXRjaCAoZXJyb3IpIHsKICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpOwogICAgICAgICAgICByZXR1cm4gZmFsc2U7CiAgICAgICAgfQogICAgfTsKCiAgICAvLyBpbXBvcnQgaW5pdCBmcm9tICdmaW5kb3JhLXdhbGxldC13YXNtL3dlYi1saWdodHdlaWdodCc7CiAgICBzZWxmLm9ubWVzc2FnZSA9IGFzeW5jIGZ1bmN0aW9uIChlKSB7CiAgICAgICAgdmFyIHdpbmRvdyA9IGdsb2JhbFRoaXM7CiAgICAgICAgd2luZG93LndpbmRvdyA9IGdsb2JhbFRoaXM7CiAgICAgICAgZS5kYXRhOwogICAgICAgIGF3YWl0IGluaXRMZWRnZXIoKTsKICAgICAgICBjb25zdCBsZWRnZXIgPSBhd2FpdCBnZXRMZWRnZXIoKTsKICAgICAgICBjb25zb2xlLmxvZyhsZWRnZXI/Lmdlbl9hbm9uX2tleXMoKSk7CiAgICAgICAgLy8gaW5pdCgpOwogICAgICAgIC8vIGNvbnN0IHByb21pc2VSZXN1bHRzID0gYXdhaXQgUHJvbWlzZS5hbGwoCiAgICAgICAgLy8gICBtZW1vcy5tYXAobWVtb0l0ZW0gPT4gZGVjcnlwdEFiYXJNZW1vKG1lbW9JdGVtLm1lbW8sIGFjY291bnQuYXhmclNlY3JldEtleSkpCiAgICAgICAgLy8gKTsKICAgICAgICAvLyBjb25zb2xlLmxvZygncHJvbWlzZVJlc3VsdHM6JywgcHJvbWlzZVJlc3VsdHMpOwogICAgICAgIHNlbGYucG9zdE1lc3NhZ2UoJ2hpaGloaScpOwogICAgfTsKCiAgICBmdW5jdGlvbiBfbG9hZFdhc21Nb2R1bGUgKHN5bmMsIGZpbGVwYXRoLCBzcmMsIGltcG9ydHMpIHsKICAgICAgZnVuY3Rpb24gX2luc3RhbnRpYXRlT3JDb21waWxlKHNvdXJjZSwgaW1wb3J0cywgc3RyZWFtKSB7CiAgICAgICAgdmFyIGluc3RhbnRpYXRlRnVuYyA9IHN0cmVhbSA/IFdlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nIDogV2ViQXNzZW1ibHkuaW5zdGFudGlhdGU7CiAgICAgICAgdmFyIGNvbXBpbGVGdW5jID0gc3RyZWFtID8gV2ViQXNzZW1ibHkuY29tcGlsZVN0cmVhbWluZyA6IFdlYkFzc2VtYmx5LmNvbXBpbGU7CgogICAgICAgIGlmIChpbXBvcnRzKSB7CiAgICAgICAgICByZXR1cm4gaW5zdGFudGlhdGVGdW5jKHNvdXJjZSwgaW1wb3J0cykKICAgICAgICB9IGVsc2UgewogICAgICAgICAgcmV0dXJuIGNvbXBpbGVGdW5jKHNvdXJjZSkKICAgICAgICB9CiAgICAgIH0KCiAgICAgIAogICAgdmFyIGJ1ZiA9IG51bGw7CiAgICB2YXIgaXNOb2RlID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudmVyc2lvbnMgIT0gbnVsbCAmJiBwcm9jZXNzLnZlcnNpb25zLm5vZGUgIT0gbnVsbDsKCiAgICBpZiAoZmlsZXBhdGggJiYgaXNOb2RlKSB7CiAgICAgIAogICAgdmFyIGZzID0gcmVxdWlyZSgiZnMiKTsKICAgIHZhciBwYXRoID0gcmVxdWlyZSgicGF0aCIpOwoKICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7CiAgICAgIGZzLnJlYWRGaWxlKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIGZpbGVwYXRoKSwgKGVycm9yLCBidWZmZXIpID0+IHsKICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgewogICAgICAgICAgcmVqZWN0KGVycm9yKTsKICAgICAgICB9IGVsc2UgewogICAgICAgICAgcmVzb2x2ZShfaW5zdGFudGlhdGVPckNvbXBpbGUoYnVmZmVyLCBpbXBvcnRzLCBmYWxzZSkpOwogICAgICAgIH0KICAgICAgfSk7CiAgICB9KTsKCiAgICB9IGVsc2UgaWYgKGZpbGVwYXRoKSB7CiAgICAgIAogICAgcmV0dXJuIF9pbnN0YW50aWF0ZU9yQ29tcGlsZShmZXRjaChmaWxlcGF0aCksIGltcG9ydHMsIHRydWUpOwoKICAgIH0KCiAgICBpZiAoaXNOb2RlKSB7CiAgICAgIAogICAgYnVmID0gQnVmZmVyLmZyb20oc3JjLCAnYmFzZTY0Jyk7CgogICAgfSBlbHNlIHsKICAgICAgCiAgICB2YXIgcmF3ID0gZ2xvYmFsVGhpcy5hdG9iKHNyYyk7CiAgICB2YXIgcmF3TGVuZ3RoID0gcmF3Lmxlbmd0aDsKICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KG5ldyBBcnJheUJ1ZmZlcihyYXdMZW5ndGgpKTsKICAgIGZvcih2YXIgaSA9IDA7IGkgPCByYXdMZW5ndGg7IGkrKykgewogICAgICAgYnVmW2ldID0gcmF3LmNoYXJDb2RlQXQoaSk7CiAgICB9CgogICAgfQoKCiAgICAgIGlmKHN5bmMpIHsKICAgICAgICB2YXIgbW9kID0gbmV3IFdlYkFzc2VtYmx5Lk1vZHVsZShidWYpOwogICAgICAgIHJldHVybiBpbXBvcnRzID8gbmV3IFdlYkFzc2VtYmx5Lkluc3RhbmNlKG1vZCwgaW1wb3J0cykgOiBtb2QKICAgICAgfSBlbHNlIHsKICAgICAgICByZXR1cm4gX2luc3RhbnRpYXRlT3JDb21waWxlKGJ1ZiwgaW1wb3J0cywgZmFsc2UpCiAgICAgIH0KICAgIH0KCiAgICBmdW5jdGlvbiB3YXNtX2JnKGltcG9ydHMpe3JldHVybiBfbG9hZFdhc21Nb2R1bGUoMCwgJzgwZDZiYzRkNTdhOTRjMzUud2FzbScsIG51bGwsIGltcG9ydHMpfQoKICAgIHZhciB3YXNtX2JnJDEgPSAvKiNfX1BVUkVfXyovT2JqZWN0LmZyZWV6ZSh7CiAgICAgICAgX19wcm90b19fOiBudWxsLAogICAgICAgICdkZWZhdWx0Jzogd2FzbV9iZwogICAgfSk7Cgp9KSgpOwoK', null, false);
    /* eslint-enable */

    const syncAll = async () => {
        await fetchLatestMemos();
        const accounts = await db.getAccounts();
        let currentMAS = await getMAS();
        let memos = [];
        while (currentMAS >= 0) {
            const fromIdx = Math.max(0, currentMAS - 99);
            const abarsMemos = await db.getAbarMemos(fromIdx, currentMAS);
            memos = memos.concat(abarsMemos);
            currentMAS = fromIdx - 1;
        }
        for (const account of accounts) {
            const syncWorker = new WorkerFactory();
            syncWorker.postMessage({ account, memos });
        }
        // const abarMemos = await db.
        // for (const abarMemoItem of abarMemos) {
        //   const { sid, memo } = abarMemoItem;
        //   const isDecrypted = await decryptAbarMemo(memo, zkAccount);
        //   console.log(sid);
        //   console.log('isDecrypted:', isDecrypted);
        //   if (isDecrypted) {
        //     const commitment = await Apis.getCommitment(sid);
        //     this.addCommitment(commitment, sid, zkAccount.axfrPublicKey)
        //   }
        // }
    };

    var commitment = /*#__PURE__*/Object.freeze({
        __proto__: null,
        syncAll: syncAll
    });

    window.db = db;
    window.account = account;
    window.abarMemo = abarMemo;
    window.commitment = commitment;

    function _loadWasmModule (sync, filepath, src, imports) {
      function _instantiateOrCompile(source, imports, stream) {
        var instantiateFunc = stream ? WebAssembly.instantiateStreaming : WebAssembly.instantiate;
        var compileFunc = stream ? WebAssembly.compileStreaming : WebAssembly.compile;

        if (imports) {
          return instantiateFunc(source, imports)
        } else {
          return compileFunc(source)
        }
      }

      
    var buf = null;
    var isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null;

    if (filepath && isNode) {
      
    var fs = require("fs");
    var path = require("path");

    return new Promise((resolve, reject) => {
      fs.readFile(path.resolve(__dirname, filepath), (error, buffer) => {
        if (error != null) {
          reject(error);
        } else {
          resolve(_instantiateOrCompile(buffer, imports, false));
        }
      });
    });

    } else if (filepath) {
      
    return _instantiateOrCompile(fetch(filepath), imports, true);

    }

    if (isNode) {
      
    buf = Buffer.from(src, 'base64');

    } else {
      
    var raw = globalThis.atob(src);
    var rawLength = raw.length;
    buf = new Uint8Array(new ArrayBuffer(rawLength));
    for(var i = 0; i < rawLength; i++) {
       buf[i] = raw.charCodeAt(i);
    }

    }


      if(sync) {
        var mod = new WebAssembly.Module(buf);
        return imports ? new WebAssembly.Instance(mod, imports) : mod
      } else {
        return _instantiateOrCompile(buf, imports, false)
      }
    }

    function wasm_bg(imports){return _loadWasmModule(0, '80d6bc4d57a94c35.wasm', null, imports)}

    var wasm_bg$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': wasm_bg
    });

})();
//# sourceMappingURL=index.js.map
