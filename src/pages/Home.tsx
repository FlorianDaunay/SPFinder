import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductEditor from '../components/ProductEditor';
import '../styles/home.css';

const Home: React.FC = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const [productNames, setProductNames] = useState<Record<string, string>>({});

    const updateProductNameInList = (id: string, newName: string) => {
        setProductNames(prev => ({ ...prev, [id]: newName }));
    };

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-grid">
                <aside className="sidebar">
                    <Sidebar selectedId={selectedId} setSelectedId={setSelectedId} productNames={productNames} />
                </aside>
                <main className="main-content">
                    {selectedId ? (
                        <ProductEditor productId={selectedId} updateProductNameInList={updateProductNameInList} />
                    ) : (
                        <div className="product-editor">Sélectionne un produit à gauche.</div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Home;
