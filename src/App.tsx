// src/App.tsx
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import Home from "./pages/Home";

import { useAuth } from "./context/AuthContext";
import Authpage from "./pages/AuthPage";



const App = () => {
    const { user } = useAuth();

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={user ? <Navigate to="/" /> : <Authpage />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Authpage />} />

                <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
            </Routes>
        </HashRouter>
    );
};

export default App;

