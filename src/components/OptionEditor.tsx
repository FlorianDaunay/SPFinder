// src/components/OptionEditor.tsx
import React, { useEffect, useState } from 'react';
import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    addDoc,
} from 'firebase/firestore';
import debounce from 'lodash.debounce';
import '../styles/options.css';
import { optionList } from '../lib/payoffFunctions';
import { OptionData } from '../types';


interface OptionEditorProps {
    productId: string;
    options: OptionData[];
    setOptions: React.Dispatch<React.SetStateAction<OptionData[]>>;
    refreshGraphs: () => void;
    editable: boolean;
}


const OptionEditor: React.FC<OptionEditorProps> = ({ productId, options, setOptions, refreshGraphs, editable }) => {

    const db = getFirestore();
    const [showSaved, setShowSaved] = useState(false);


    useEffect(() => {
        const fetchOptions = async () => {
            const colRef = collection(db, 'structuredProducts', productId, 'options');
            const snap = await getDocs(colRef);
            const data: OptionData[] = snap.docs.map((d) => ({
                id: d.id,
                name: d.data().name || '',
                strike: Number(d.data().strike || 0),
                coupon: Number(d.data().coupon || 0),
                knockIn: Number(d.data().knockIn || 0),
                knockOut: Number(d.data().knockOut || 0),
                c: Number(d.data().c || 0),
                p: Number(d.data().p || 0),
                leverage: Number(d.data().leverage || 1),
            }));
            setOptions(data); // propagate to parent
        };
        fetchOptions();
    }, [productId]);


    const debouncedSave = debounce(async (id: string, updated: OptionData) => {
        const ref = doc(db, 'structuredProducts', productId, 'options', id);
        await updateDoc(ref, updated as Record<string, any>);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 1500);

        refreshGraphs(); // ✅ only after save completes
    }, 500);

    const handleChange = (id: string, field: keyof OptionData, value: string) => {
        const newOptions = options.map((opt) =>
            opt.id === id ? { ...opt, [field]: field === 'name' ? value : Number(value) } : opt
        );
        setOptions(newOptions);
        debouncedSave(id, newOptions.find((o) => o.id === id)!); // only saves and refreshes after debounce
    };

    const handleDelete = async (id: string) => {
        const ref = doc(db, 'structuredProducts', productId, 'options', id);
        await deleteDoc(ref);
        setOptions((prev: OptionData[]) =>
            prev.filter((o) => o.id !== id)
        );
        refreshGraphs();


    };

    const handleAddOption = async () => {
        const defaultOption = {
            name: 'longCall',
            strike: 100,
            coupon: 0,
            knockIn: 0,
            knockOut: 0,
            c: 0,
            p: 0,
            leverage: 1,
        };

        const colRef = collection(db, 'structuredProducts', productId, 'options');
        const docRef = await addDoc(colRef, defaultOption);

        setOptions((prev: OptionData[]) => [
            ...prev,
            { id: docRef.id, ...defaultOption },
        ]);
        refreshGraphs();


    };

    return (
        <div className="options-list">

            <button onClick={handleAddOption} disabled={!editable} className="add-button">
                ➕ Ajouter une option
            </button>

            {showSaved && <div className="save-popup">✔️ Modifications enregistrées</div>}

            {options.map((opt) => (
                <div key={opt.id} className="option-card">
                    <div className="option-header">
                        <strong>{opt.name}</strong>
                        <button
                            onClick={() => handleDelete(opt.id)}
                            disabled={!editable}
                            className="delete-button"
                        >
                            🗑️
                        </button>
                    </div>

                    {/* Render the name selector first */}
                    <div className="option-field">
                        <label>name</label>
                        <select
                            value={opt.name}
                            onChange={(e) =>
                                handleChange(opt.id, 'name', e.target.value)
                            }
                            disabled={!editable}
                        >
                            {optionList.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Then render all other numeric fields dynamically */}
                    {Object.entries(opt).map(([key, value]) =>
                        key !== "id" && key !== "name" ? (
                            <div className="option-field" key={key}>
                                <label>{key}</label>
                                <input
                                    type="number"
                                    value={value}
                                    onChange={(e) => handleChange(opt.id, key as keyof OptionData, e.target.value)}
                                    disabled={!editable}
                                />
                            </div>
                        ) : null
                    )}
                </div>
            ))}
        </div>
    );

};

export default OptionEditor;
