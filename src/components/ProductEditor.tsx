// src/components/ProductEditor.tsx
import React, { useEffect, useState } from 'react';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import GraphPayoff from './GraphPayoff';
import GraphGreek from './GraphGreek';
import OptionEditor from './OptionEditor';
import { useUser } from '../hooks/useUserData';
import '../styles/productEditor.css';
import { OptionData } from '../types';

const greekList = [
    'deltaCall',
    'deltaPut',
    'gamma',
    'vega',
    'thetaCall',
    'thetaPut',
    'rhoCall',
    'rhoPut',
    'charmCall',
    'charmPut',
    'vanna',
    'volga',
    'zomma',
    'color',
    'speed',
    'ultima',
    'veta',
] as const;



type GreekName = (typeof greekList)[number];


interface ProductEditorProps {
    productId: string;
    updateProductNameInList: (id: string, name: string) => void;
}


const ProductEditor: React.FC<ProductEditorProps> = ({ productId, updateProductNameInList }) => {

    const user = useUser();
    const db = getFirestore();

    const [productName, setProductName] = useState<string>('Nom du produit');

    const [T, setT] = useState(1);       // Temps jusqu’à maturité
    const [r, setR] = useState(0.01);    // Taux
    const [sigma, setSigma] = useState(0.3); // Volatilité

    const [activeGreeks, setActiveGreeks] = useState<GreekName[]>(['deltaCall']);

    const [options, setOptions] = useState<OptionData[]>([]);

    const [editable, setEditable] = useState(false);


    const [refreshKey, setRefreshKey] = useState(0); // <-- Forcer refresh

    const refreshGraphs = () => {
        setRefreshKey(prev => prev + 1);
    };


    useEffect(() => {
        const fetchProduct = async () => {
            if (!user || !productId) return;
            const docSnap = await getDoc(doc(db, 'structuredProducts', productId));
            if (docSnap.exists()) {
                setProductName(docSnap.data()?.name || 'Produit sans nom');
            }
        };
        fetchProduct();
    }, [user, productId]);

    const toggleGreek = (g: GreekName) => {
        setActiveGreeks((prev) =>
            prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
        );
    };

    const saveProductName = async () => {
        if (!productId) return;
        const ref = doc(db, 'structuredProducts', productId);
        await updateDoc(ref, { name: productName });
        updateProductNameInList(productId, productName);
    };

    if (!productId) return <div className="product-editor">Sélectionne un produit à gauche.</div>;

    return (
        <div className="product-editor-layout">
            {/* LEFT SIDE */}
            <div className="product-main">
                {editable ? (
                    <input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        onBlur={saveProductName}
                        className="editable-product-name"
                    />
                ) : (
                    <h3>{productName}</h3>
                )}

                <div className="product-graphs">
                    <div className="graph-section">
                        <h3>Payoff</h3>
                        <GraphPayoff key={refreshKey} productId={productId} options={options} />
                    </div>
                    <div className="graph-section">
                        <h3>Greeks</h3>
                        <div className="sliders">
                            <label>
                                T: {T.toFixed(2)}
                                <input type="range" min="0.1" max="5" step="0.1" value={T} onChange={(e) => setT(Number(e.target.value))} />
                            </label>
                            <label>
                                r: {(r * 100).toFixed(2)}%
                                <input type="range" min="0" max="0.1" step="0.001" value={r} onChange={(e) => setR(Number(e.target.value))} />
                            </label>
                            <label>
                                σ: {(sigma * 100).toFixed(1)}%
                                <input type="range" min="0.01" max="1" step="0.01" value={sigma} onChange={(e) => setSigma(Number(e.target.value))} />
                            </label>
                        </div>
                        <div className="greek-selectors">
                            {greekList.map((g) => (
                                <label key={g}>
                                    <input
                                        type="checkbox"
                                        checked={activeGreeks.includes(g)}
                                        onChange={() => toggleGreek(g)}
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                        {activeGreeks.map((g) => (
                            <GraphGreek
                                key={`${g}-${refreshKey}`}
                                productId={productId}
                                greekName={g}
                                options={options}
                                T={T}
                                r={r}
                                sigma={sigma}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={() => setEditable((prev) => !prev)} className={`edit-button ${editable ? 'edit-mode' : 'locked-mode'}`}>
                {editable ? '🔒 Verrouiller' : '✏️ Modifier'}
            </button>

            {/* RIGHT SIDE */}
            <div className="product-options-panel">
                <h3>Options</h3>
                <OptionEditor
                    productId={productId}
                    options={options}
                    setOptions={setOptions}
                    refreshGraphs={refreshGraphs}
                    editable={editable}
                />
            </div>
        </div >
    );

};

export default ProductEditor;
