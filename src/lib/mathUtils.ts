export function d1(
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number
): number {
    if (T === 0 || sigma === 0) return 0;
    return (Math.log(S / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * Math.sqrt(T));
}

export function d2(
    S: number,
    K: number,
    T: number,
    r: number,
    sigma: number
): number {
    return d1(S, K, T, r, sigma) - sigma * Math.sqrt(T);
}

export function normCDF(x: number): number {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

export function normPDF(x: number): number {
    return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
}

function erf(x: number): number {
    // Numerical approximation (Abramowitz and Stegun, 7.1.26)
    const sign = x >= 0 ? 1 : -1;
    const a1 = 0.254829592,
        a2 = -0.284496736,
        a3 = 1.421413741,
        a4 = -1.453152027,
        a5 = 1.061405429,
        p = 0.3275911;
    const absX = Math.abs(x);
    const t = 1 / (1 + p * absX);
    const y =
        1 -
        (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
            t *
            Math.exp(-absX * absX));
    return sign * y;
}
