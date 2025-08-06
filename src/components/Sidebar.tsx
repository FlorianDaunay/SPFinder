import React, { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { useUser } from '../hooks/useUserData';
import '../styles/sidebar.css';
import { createStructuredProduct } from '../utils/createStructuredProduct';

interface ProductEntry {
    id: string;
    name: string;
}

interface SidebarProps {
    selectedId: string | null;
    setSelectedId: (id: string) => void;
    productNames: Record<string, string>;
}


const Sidebar: React.FC<SidebarProps> = ({ selectedId, setSelectedId, productNames }) => {
    const [products, setProducts] = useState<ProductEntry[]>([]);
    const user = useUser();
    const db = getFirestore();

    useEffect(() => {
        const fetchProducts = async () => {
            if (!user) return;
            const q = query(
                collection(db, 'structuredProducts'),
                where('ownerId', '==', user.uid)
            );
            const snap = await getDocs(q);
            const productList = snap.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || 'Produit sans nom',
            }));
            setProducts(productList);
        };
        fetchProducts();
    }, [user]);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        // TODO: Propagate selection if needed
    };

    const handleCreate = async () => {
        try {
            const newId = await createStructuredProduct();

            // Re-fetch le doc pour avoir son nom (ou ajoute-le à la main si tu connais la valeur initiale)
            const newDoc = await getDoc(doc(db, 'structuredProducts', newId));
            const newProduct = {
                id: newId,
                name: newDoc.data()?.name || 'Produit sans nom',
            };

            setProducts(prev => [...prev, newProduct]); // Ajoute dans la liste
            setSelectedId(newId); // Sélectionne directement
        } catch (err: any) {
            console.error('Erreur création produit :', err);
            alert('Erreur : ' + (err.message || 'opération refusée'));
        }
    };


    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <h2>Mes produits</h2>
                <button onClick={handleCreate}>+ Nouveau</button>
            </div>
            <ul className="product-list">
                {products.map((prod) => (
                    <li
                        key={prod.id}
                        className={selectedId === prod.id ? 'selected' : ''}
                        onClick={() => handleSelect(prod.id)}
                    >
                        {productNames[prod.id] || prod.name}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
