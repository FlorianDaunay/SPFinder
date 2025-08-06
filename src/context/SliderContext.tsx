import React, { createContext, useContext, useState } from "react";

interface SliderContextType {
    time: number;
    rate: number;
    volatility: number;
    setTime: (val: number) => void;
    setRate: (val: number) => void;
    setVolatility: (val: number) => void;
}

const SliderContext = createContext<SliderContextType | undefined>(undefined);

export const useSliders = () => {
    const ctx = useContext(SliderContext);
    if (!ctx) throw new Error("useSliders must be used inside SliderProvider");
    return ctx;
};

export const SliderProvider = ({ children }: { children: React.ReactNode }) => {
    const [time, setTime] = useState(1);
    const [rate, setRate] = useState(5);
    const [volatility, setVolatility] = useState(30);

    return (
        <SliderContext.Provider
            value={{ time, rate, volatility, setTime, setRate, setVolatility }}
        >
            {children}
        </SliderContext.Provider>
    );
};
