import { useState, useEffect } from 'react';
import { addDocument, updateDocument, deleteDocument, getUserDocuments } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const useFirestore = (collectionName: string) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadDocuments = async () => {
      if (!user) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const docs = await getUserDocuments(collectionName);
        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError('Failed to load documents');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [collectionName, user]);

  const add = async (data: any) => {
    try {
      const newDoc = await addDocument(collectionName, data);
      setDocuments(prev => [...prev, newDoc]);
      return newDoc;
    } catch (err) {
      setError('Failed to add document');
      throw err;
    }
  };

  const update = async (id: string, data: any) => {
    try {
      const updatedDoc = await updateDocument(collectionName, id, data);
      setDocuments(prev => 
        prev.map(doc => doc.id === id ? { ...doc, ...data } : doc)
      );
      return updatedDoc;
    } catch (err) {
      setError('Failed to update document');
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteDocument(collectionName, id);
      setDocuments(prev => prev.filter(doc => doc.id !== id));
    } catch (err) {
      setError('Failed to delete document');
      throw err;
    }
  };

  return {
    documents,
    loading,
    error,
    add,
    update,
    remove
  };
};