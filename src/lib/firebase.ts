import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  collection,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore DB using the specific databaseId if present
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || undefined
);

/**
 * Real-time listener for a single document stored under `app_data/{docId}`
 */
export function subscribeToDoc<T>(
  docId: string,
  onData: (data: T) => void,
  fallbackData: T
) {
  const docRef = doc(db, 'app_data', docId);
  return onSnapshot(
    docRef,
    (snapshot: any) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as T;
        if (data && Object.keys(data).length > 0) {
          onData(data);
          return;
        }
      }
      // Check localStorage first to preserve user modifications
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setDoc(docRef, parsed as any, { merge: true }).catch(console.error);
            onData(parsed);
            return;
          }
        }
      } catch {
        // ignore parse error
      }
      // Fallback
      setDoc(docRef, fallbackData as any, { merge: true }).catch(console.error);
      onData(fallbackData);
    },
    (error) => {
      console.warn(`Firestore sync error for ${docId}:`, error);
    }
  );
}

/**
 * Save / update a document stored under `app_data/{docId}`
 */
export async function saveDoc<T extends object>(docId: string, data: T) {
  try {
    const docRef = doc(db, 'app_data', docId);
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`Failed to save ${docId} to Firestore:`, error);
  }
}

/**
 * Save array document
 */
export async function saveDocArray<T>(docId: string, items: T[]) {
  try {
    const docRef = doc(db, 'app_data', docId);
    await setDoc(docRef, { items });
  } catch (error) {
    console.error(`Failed to save array ${docId} to Firestore:`, error);
  }
}

/**
 * Real-time listener for an array document stored under `app_data/{docId}`
 */
export function subscribeToDocArray<T>(
  docId: string,
  onData: (items: T[]) => void,
  fallbackData: T[]
) {
  const docRef = doc(db, 'app_data', docId);
  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          onData(data.items as T[]);
          return;
        }
      }
      // Check localStorage first to preserve user modified items and custom uploaded images
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setDoc(docRef, { items: parsed }).catch(console.error);
            onData(parsed);
            return;
          }
        }
      } catch {
        // ignore parse error
      }
      // Fallback
      setDoc(docRef, { items: fallbackData }).catch(console.error);
      onData(fallbackData);
    },
    (error) => {
      console.warn(`Firestore sync error for array ${docId}:`, error);
    }
  );
}
