import React, { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { useSliders } from "../context/SliderContext";
import { generateDummyPoints, generatePayoffCurve } from "../lib/graphUtils";
import { StructuredProductOption } from "../types";

// Types
interface DataPoint {
    x: number;
    y: number;
}

interface GreekChartProps {
    title: string;
    formula?: (
        strike: number,
        time: number,
        rate: number,
        volatility: number,
        S: number
    ) => [number, number];

    // Only used for the Payoff graph
    options?: StructuredProductOption[];
    optionTypeMap?: Record<number, string>; // Maps optionId to type string
}

const GreekChart = ({ title, formula, options, optionTypeMap }: GreekChartProps) => {
    const { time, rate, volatility } = useSliders();
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        if (title.toLowerCase().includes("payoff")) {
            if (!options || !optionTypeMap) {
                console.warn("Missing options or type map for payoff chart");
                return;
            }
            const points = generatePayoffCurve(options, optionTypeMap);
            setData(points);
        } else if (formula) {
            const points = generateDummyPoints(formula, time, rate, volatility);
            setData(points);
        }
    }, [title, time, rate, volatility, formula, options, optionTypeMap]);

    return (
        <div style={{ marginBottom: "2rem" }}>
            <h4 style={{ marginBottom: "0.5rem" }}>{title}</h4>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="x" label={{ value: "S", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Value", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="y" stroke="#0070f3" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GreekChart;
