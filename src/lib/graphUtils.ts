import { StructuredProductOption } from "../types";
import { payoffMap } from "./payoffFunctions";

export const generatePayoffCurve = (
    options: StructuredProductOption[],
    typeMap: Record<number, string> // optionId → type from optionList
) => {
    const data = [];

    for (let x = 50; x <= 150; x += 1) {
        let total = 0;

        for (const option of options) {
            const type = typeMap[option.optionId];
            const formula = payoffMap[type];

            if (!formula) continue;

            const getPayoff = formula(
                option.strike,
                option.knockIn || option.knockOut || option.coupon || 0,
                option.c || option.p || 0
            );

            total += getPayoff(x);
        }

        data.push({ x, y: total });
    }

    return data;
};


export const generateDummyPoints = (
    formula: (strike: number, time: number, rate: number, volatility: number, S: number) => [number, number],
    time: number,
    rate: number,
    volatility: number
) => {
    const points = [];
    const strike = 100;

    for (let s = 50; s <= 150; s += 1) {
        const [x, y] = formula(strike, time, rate, volatility, s);
        points.push({ x, y });
    }

    return points;
};


