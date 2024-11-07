import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAuBfOCgfEwiP4MRTXGOE7rGT6TTAxLKTY",
  authDomain: "webflow-ba876.firebaseapp.com",
  projectId: "webflow-ba876",
  storageBucket: "webflow-ba876.firebasestorage.app",
  messagingSenderId: "1012507830628",
  appId: "1:1012507830628:web:a7ea7d65270d7649e7b271",
  measurementId: "G-E8EF56707C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Firebase data operations
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      userId: auth.currentUser?.uid,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
    return { id, ...data };
  } catch (error) {
    console.error("Error updating document:", error);
    throw error;
  }
};

export const deleteDocument = async (collectionName: string, id: string) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
};

export const getUserDocuments = async (collectionName: string) => {
  try {
    const q = query(
      collection(db, collectionName), 
      where("userId", "==", auth.currentUser?.uid)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting documents:", error);
    throw error;
  }
};