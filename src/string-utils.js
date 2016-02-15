export function replaceAll(input, replaceThis, withThis) {
    let res = input;

    while(res.indexOf(replaceThis) > -1) {
        res = res.replace(replaceThis, withThis);
    }

    return res;
}