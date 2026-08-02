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
export function subscribeToDoc<T extends object>(
  docId: string,
  onData: (data: T) => void,
  fallbackData: T
) {
  const docRef = doc(db, 'app_data', docId);

  return onSnapshot(
    docRef,
    (snapshot: any) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as T;
        const validData = remoteData || fallbackData;
        try {
          localStorage.setItem(`glow_${docId}`, JSON.stringify(validData));
        } catch {}
        onData(validData);
        return;
      }

      let localData: T | null = null;
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            localData = parsed;
          }
        }
      } catch {}

      const dataToUse = localData || fallbackData;
      const cleanDataToUse = JSON.parse(JSON.stringify(dataToUse));
      setDoc(docRef, cleanDataToUse, { merge: true }).catch(console.error);
      try {
        localStorage.setItem(`glow_${docId}`, JSON.stringify(dataToUse));
      } catch {}
      onData(dataToUse);
    },
    (error) => {
      console.warn(`Firestore sync error for ${docId}:`, error);
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          onData(JSON.parse(saved));
        }
      } catch {}
    }
  );
}

/**
 * Save / update a document stored under `app_data/{docId}`
 */
export async function saveDoc<T extends object>(docId: string, data: T) {
  try {
    localStorage.setItem(`glow_${docId}`, JSON.stringify(data));
  } catch (e) {
    console.warn(`localStorage save error for ${docId}:`, e);
  }
  try {
    const docRef = doc(db, 'app_data', docId);
    const cleanData = JSON.parse(JSON.stringify(data));
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error(`Failed to save ${docId} to Firestore:`, error);
  }
}

/**
 * Save array document
 */
export async function saveDocArray<T>(docId: string, items: T[]) {
  try {
    localStorage.setItem(`glow_${docId}`, JSON.stringify(items));
  } catch (e) {
    console.warn(`localStorage save error for ${docId}:`, e);
  }
  try {
    const docRef = doc(db, 'app_data', docId);
    const cleanItems = JSON.parse(JSON.stringify(items));
    await setDoc(docRef, { items: cleanItems });
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
        const remoteItems = (data && Array.isArray(data.items)) ? (data.items as T[]) : [];
        try {
          localStorage.setItem(`glow_${docId}`, JSON.stringify(remoteItems));
        } catch {}
        onData(remoteItems);
        return;
      }

      let localData: T[] | null = null;
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            localData = parsed;
          }
        }
      } catch {}

      const dataToUse = localData !== null ? localData : fallbackData;
      const cleanDataToUse = JSON.parse(JSON.stringify(dataToUse));
      setDoc(docRef, { items: cleanDataToUse }).catch(console.error);
      try {
        localStorage.setItem(`glow_${docId}`, JSON.stringify(dataToUse));
      } catch {}
      onData(dataToUse);
    },
    (error) => {
      console.warn(`Firestore sync error for array ${docId}:`, error);
      try {
        const saved = localStorage.getItem(`glow_${docId}`);
        if (saved) {
          onData(JSON.parse(saved));
        }
      } catch {}
    }
  );
}
