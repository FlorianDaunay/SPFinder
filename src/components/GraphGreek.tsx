// src/components/GraphGreek.tsx
import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import * as greeks from '../lib/greekFunctions';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { OptionData } from '../types';

interface GraphGreekProps {
    productId: string;
    greekName: keyof typeof greeks;
    T: number;        // temps (années)
    r: number;        // taux
    sigma: number;    // volatilité (ex: 0.3)
    options: OptionData[];
}

const GraphGreek: React.FC<GraphGreekProps> = ({ productId, greekName, T, r, sigma }) => {
    const [data, setData] = useState<{ x: number; y: number }[]>([]);

    useEffect(() => {
        const computeGreek = async () => {
            const db = getFirestore();
            const optionsRef = collection(db, 'structuredProducts', productId, 'options');
            const snapshot = await getDocs(optionsRef);

            const strikes: number[] = snapshot.docs.map((doc) => Number(doc.data().strike || 0));
            const K = strikes.length > 0 ? strikes[0] : 100; // simplification : on prend le 1er strike

            const result: { x: number; y: number }[] = [];
            const greekFn = greeks[greekName];

            if (!greekFn) {
                console.warn(`Greek function "${greekName}" not found.`);
                return;
            }

            for (let S = 50; S <= 150; S += 1) {
                try {
                    const [, y] = greekFn(K, T, r, sigma, S);
                    result.push({ x: S, y });
                } catch (err) {
                    console.warn(`Erreur grec ${greekName} à S=${S}:`, err);
                }
            }

            setData(result);
        };

        computeGreek();
    }, [productId, greekName, T, r, sigma]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" label={{ value: 'Spot Price', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: greekName, angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line type="monotone" dataKey="y" stroke="#00c49f" strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default GraphGreek;
