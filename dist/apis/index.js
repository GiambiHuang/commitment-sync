export const getMAS = (queryURL) => {
    return new Promise((resolve => {
        fetch(queryURL + '/get_max_atxo_sid')
            .then(response => response.json())
            .then(resolve);
    }));
};
export const getAbarMemos = (from, end, queryURL) => {
    return new Promise((resolve => {
        fetch(queryURL + `/get_abar_memos?start=${from}&end=${end}`)
            .then(response => response.json())
            .then(memos => {
            resolve(memos);
        });
    }));
};
export const getCommitment = (sid, queryURL) => {
    return new Promise((resolve => {
        fetch(queryURL + `/get_abar_commitment/${sid}`)
            .then(response => response.json())
            .then(commitment => {
            resolve(commitment);
        });
    }));
};
//# sourceMappingURL=index.js.map