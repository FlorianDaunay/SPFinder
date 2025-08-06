// src/lib/generatePayoffCurve.ts
import { payoffMap } from './payoffFunctions';

export interface OptionData {
    name: string; // ex: "longCall", "shortPutUpOut", etc.
    strike?: number;
    coupon?: number;
    knockIn?: number;
    knockOut?: number;
    c?: number;
    p?: number;
    leverage?: number;
}

export function generatePayoffCurve(options: OptionData[]): { x: number; y: number }[] {
    const result: { x: number; y: number }[] = [];

    for (let x = 50; x <= 150; x += 1) {
        let totalPayoff = 0;

        for (const opt of options) {
            const {
                name,
                strike = 0,
                coupon = 0,
                knockIn = 0,
                knockOut = 0,
                c = 0,
                p = 0,
                leverage = 1,
            } = opt;

            const fnFactory = payoffMap[name];
            if (!fnFactory) {
                console.warn(`Unknown payoff type: ${name}`);
                continue;
            }

            // On détecte le nombre d'arguments attendus par la fonction
            const fn =
                fnFactory.length === 2
                    ? fnFactory(strike, c || p)
                    : fnFactory(strike, knockIn || knockOut, coupon || c || p);

            totalPayoff += leverage * fn(x);
        }

        result.push({ x, y: totalPayoff });
    }

    return result;
}
