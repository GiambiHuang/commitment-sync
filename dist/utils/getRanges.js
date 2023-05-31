export default function (from, end) {
    let fromNum = Math.max(from, 0);
    const length = Math.ceil((end - fromNum) / 100);
    const ranges = [];
    for (let num = 0; num < length; num++) {
        if (fromNum > end)
            break;
        ranges.push([fromNum, fromNum + 100]);
        fromNum += 101;
    }
    return ranges;
}
//# sourceMappingURL=getRanges.js.map