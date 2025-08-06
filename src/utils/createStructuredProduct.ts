// src/utils/createStructuredProduct.ts
import { getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    getDoc,
    updateDoc,
    setDoc,
} from 'firebase/firestore';

export async function createStructuredProduct(name = 'Nouveau produit') {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error('Utilisateur non connecté');

    const db = getFirestore();

    // Étape 1 — Créer le produit avec ownerId
    const docRef = await addDoc(collection(db, 'structuredProducts'), {
        name,
        ownerId: user.uid,
        createdAt: Date.now(),
    });

    // Étape 2 — Ajouter l’ID dans le profil utilisateur
    const userDocRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
        await setDoc(userDocRef, {
            myStructuredProductIds: [docRef.id],
        });
    } else {
        const current = userSnap.data().myStructuredProductIds || [];
        if (!current.includes(docRef.id)) {
            await updateDoc(userDocRef, {
                myStructuredProductIds: [...current, docRef.id],
            });
        }
    }

    // Étape 3 — Mémoriser l’ID sélectionné
    localStorage.setItem('selectedProductId', docRef.id);

    return docRef.id;
}
