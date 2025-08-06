import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { SliderProvider } from "./context/SliderContext";

import './styles/app.css';







const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<React.StrictMode>
    <AuthProvider>
        <SliderProvider>
            <App />
        </SliderProvider>
    </AuthProvider>
</React.StrictMode>);
