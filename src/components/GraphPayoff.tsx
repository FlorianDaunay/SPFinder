// src/components/GraphPayoff.tsx
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { generatePayoffCurve, OptionData } from '../lib/generatePayoffCurve';

interface GraphPayoffProps {
    productId: string;
    options: OptionData[];
}


const GraphPayoff: React.FC<GraphPayoffProps> = ({ productId }) => {
    const [data, setData] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const fetchAndCompute = async () => {
            const db = getFirestore();
            const optionsRef = collection(db, 'structuredProducts', productId, 'options');
            const snapshot = await getDocs(optionsRef);

            const options: OptionData[] = snapshot.docs.map((doc) => {
                const d = doc.data();
                return {
                    name: d.name,
                    strike: Number(d.strike ?? 0),
                    coupon: Number(d.coupon ?? 0),
                    knockIn: Number(d.knockIn ?? 0),
                    knockOut: Number(d.knockOut ?? 0),
                    c: Number(d.c ?? 0),
                    p: Number(d.p ?? 0),
                    leverage: Number(d.leverage ?? 1),
                };
            });

            const points = generatePayoffCurve(options);
            setData(points);
        };

        fetchAndCompute();
    }, [productId]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="x"
                    label={{ value: 'Spot Price', position: 'insideBottomRight', offset: -5 }}
                />
                <YAxis
                    label={{ value: 'Payoff', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line
                    type="monotone"
                    dataKey="y"
                    stroke="#007bff"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GraphPayoff;
