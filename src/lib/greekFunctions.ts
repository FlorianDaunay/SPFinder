import { d1, d2, normCDF, normPDF } from "./mathUtils";



const exp = Math.exp;
const sqrt = Math.sqrt;

export function deltaCall(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    return [S, normCDF(d1(S, K, T, r, sigma))];
}

export function deltaPut(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    return [S, normCDF(d1(S, K, T, r, sigma)) - 1];
}

export function vega(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = S * exp(-r * T) * normPDF(d1(S, K, T, r, sigma)) * sqrt(T);
    return [S, y];
}

export function gamma(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = normPDF(d1(S, K, T, r, sigma)) / (S * sigma * sqrt(T));
    return [S, y];
}

export function thetaCall(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = -((S * normPDF(d1(S, K, T, r, sigma)) * sigma) / (2 * sqrt(T)))
        - r * K * exp(-r * T) * normCDF(d2(S, K, T, r, sigma));
    return [S, y];
}

export function thetaPut(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = -((S * normPDF(d1(S, K, T, r, sigma)) * sigma) / (2 * sqrt(T)))
        + r * K * exp(-r * T) * normCDF(-d2(S, K, T, r, sigma));
    return [S, y];
}

export function rhoCall(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = K * T * exp(-r * T) * normCDF(d2(S, K, T, r, sigma));
    return [S, y];
}

export function rhoPut(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const y = -K * T * exp(-r * T) * normCDF(-d2(S, K, T, r, sigma));
    return [S, y];
}

export function charmCall(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = -exp(-r) * (normPDF(d1v) * -d2v / (2 * T) - r * normCDF(d1v));
    return [S, y];
}

export function charmPut(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = exp(-r) * (-normPDF(d1v) * d2v / (2 * T) + r * normCDF(-d1v));
    return [S, y];
}

export function vanna(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const y = sqrt(T) * normPDF(d1v) * (1 - d1v);
    return [S, y];
}

export function volga(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = sqrt(T) * normPDF(d1v) * (d1v * d2v / sigma);
    return [S, y];
}

export function zomma(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = -normPDF(d1v) / (S * sigma ** 2 * sqrt(T)) * (1 - d1v * d2v);
    return [S, y];
}

export function color(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const term = (2 * r * T - d2v * sigma * sqrt(T)) / (sigma * sqrt(T));
    const y = normPDF(d1v) / (2 * S * T * sigma * sqrt(T)) * (1 + d1v * term);
    return [S, y];
}

export function speed(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const y = -normPDF(d1v) * (d1v + sigma * sqrt(T)) / (S ** 2 * T * sigma ** 2);
    return [S, y];
}

export function ultima(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = -normPDF(d1v) * S * (sqrt(T) / sigma ** 2) *
        (d1v ** 2 + d2v ** 2 + d1v * d2v - d1v ** 2 * d2v ** 2);
    return [S, y];
}

export function veta(K: number, T: number, r: number, sigma: number, S: number): [number, number] {
    const d1v = d1(S, K, T, r, sigma);
    const d2v = d2(S, K, T, r, sigma);
    const y = normPDF(d1v) * S * sqrt(T) *
        (-1 * (1 + (d1v * d2v) / (2 * T)) + d1v * (r / (sigma * sqrt(T))));
    return [S, y];
}
