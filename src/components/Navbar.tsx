// src/components/Navbar.tsx
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useUser } from '../hooks/useUserData';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
    const user = useUser();
    const auth = getAuth();

    const handleLogout = async () => {
        await signOut(auth);
        window.location.href = '/#/login'; // redirige vers login
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <h1>Structured Product Editor</h1>
            </div>
            <div className="navbar-right">
                {user && <span className="user-email">{user.email}</span>}
                <button onClick={handleLogout}>Déconnexion</button>
            </div>
        </header>
    );
};

export default Navbar;
