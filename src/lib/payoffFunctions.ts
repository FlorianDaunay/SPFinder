type PayoffFn = (x: number) => number;

export const payoffMap: Record<string, (...args: number[]) => PayoffFn> = {
    longCall: (K, c) => (x) => Math.max(x - K, 0) - c,
    shortCall: (K, c) => (x) => Math.min(K - x, 0) + c,
    longPut: (K, p) => (x) => Math.max(K - x, 0) - p,
    shortPut: (K, p) => (x) => Math.min(x - K, 0) + p,

    longCallDownIn: (K, Ki, c) => (x) => Math.max(x < Ki ? x - K : 0, 0) - c,
    shortCallDownIn: (K, Ki, c) => (x) => Math.min(x < Ki ? K - x : 0, 0) + c,
    longCallDownOut: (K, Ko, c) => (x) => Math.max(x > Ko ? x - K : 0, 0) - c,
    shortCallDownOut: (K, Ko, c) => (x) => Math.min(x > Ko ? K - x : 0, 0) + c,

    longCallUpIn: (K, Ki, c) => (x) => Math.max(x > Ki ? x - K : 0, 0) - c,
    shortCallUpIn: (K, Ki, c) => (x) => Math.min(x > Ki ? K - x : 0, 0) + c,
    longCallUpOut: (K, Ko, c) => (x) => Math.max(x < Ko ? x - K : 0, 0) - c,
    shortCallUpOut: (K, Ko, c) => (x) => Math.min(x < Ko ? K - x : 0, 0) + c,

    longPutDownIn: (K, Ki, p) => (x) => Math.max(x < Ki ? K - x : 0, 0) - p,
    shortPutDownIn: (K, Ki, p) => (x) => Math.min(x < Ki ? x - K : 0, 0) + p,
    longPutDownOut: (K, Ko, p) => (x) => Math.max(x > Ko ? K - x : 0, 0) - p,
    shortPutDownOut: (K, Ko, p) => (x) => Math.min(x > Ko ? x - K : 0, 0) + p,

    longPutUpIn: (K, Ki, p) => (x) => Math.max(x > Ki ? K - x : 0, 0) - p,
    shortPutUpIn: (K, Ki, p) => (x) => Math.min(x > Ki ? x - K : 0, 0) + p,
    longPutUpOut: (K, Ko, p) => (x) => Math.max(x < Ko ? K - x : 0, 0) - p,
    shortPutUpOut: (K, Ko, p) => (x) => Math.min(x < Ko ? x - K : 0, 0) + p,

    longCallDigit: (K, coupon, c) => (x) => (x > K ? coupon - c : -c),
    shortCallDigit: (K, coupon, c) => (x) => (x > K ? c - coupon : c),
    longPutDigit: (K, coupon, p) => (x) => (x < K ? coupon - p : -p),
    shortPutDigit: (K, coupon, p) => (x) => (x < K ? p - coupon : p),
};

export const optionList = Object.keys(payoffMap);
