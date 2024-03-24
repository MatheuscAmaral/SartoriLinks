import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseApp = initializeApp({
    apiKey: "AIzaSyD71SwxlVTxVqfne-Vx5DsrZY1IGwkyxC0",
    authDomain: "sartorilinks.firebaseapp.com",
    projectId: "sartorilinks",
});

const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export default db;