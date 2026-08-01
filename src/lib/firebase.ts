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

  let localData: T | null = null;
  try {
    const saved = localStorage.getItem(`glow_${docId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        localData = parsed;
      }
    }
  } catch {
    // ignore parse error
  }

  return onSnapshot(
    docRef,
    (snapshot: any) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as T;
        if (remoteData && Object.keys(remoteData).length > 0) {
          if (localData && Object.keys(localData).length > 0) {
            const isLocalCustomized = JSON.stringify(localData) !== JSON.stringify(fallbackData);
            const isRemoteDefault = JSON.stringify(remoteData) === JSON.stringify(fallbackData);

            if (isLocalCustomized && isRemoteDefault) {
              setDoc(docRef, localData as any, { merge: true }).catch(console.error);
              onData(localData);
              return;
            }
          }

          try {
            localStorage.setItem(`glow_${docId}`, JSON.stringify(remoteData));
          } catch {}
          onData(remoteData);
          return;
        }
      }

      const dataToUse = localData || fallbackData;
      setDoc(docRef, dataToUse as any, { merge: true }).catch(console.error);
      try {
        localStorage.setItem(`glow_${docId}`, JSON.stringify(dataToUse));
      } catch {}
      onData(dataToUse);
    },
    (error) => {
      console.warn(`Firestore sync error for ${docId}:`, error);
      if (localData) {
        onData(localData);
      }
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
    localStorage.setItem(`glow_${docId}`, JSON.stringify(items));
  } catch (e) {
    console.warn(`localStorage save error for ${docId}:`, e);
  }
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

  let localData: T[] | null = null;
  try {
    const saved = localStorage.getItem(`glow_${docId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        localData = parsed;
      }
    }
  } catch {
    // ignore parse error
  }

  return onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          const remoteItems = data.items as T[];

          if (localData && localData.length > 0) {
            const isLocalCustomized = JSON.stringify(localData) !== JSON.stringify(fallbackData);
            const isRemoteDefault = JSON.stringify(remoteItems) === JSON.stringify(fallbackData);

            if (isLocalCustomized && isRemoteDefault) {
              setDoc(docRef, { items: localData }).catch(console.error);
              onData(localData);
              return;
            }
          }

          try {
            localStorage.setItem(`glow_${docId}`, JSON.stringify(remoteItems));
          } catch {}
          onData(remoteItems);
          return;
        }
      }

      const dataToUse = (localData && localData.length > 0) ? localData : fallbackData;
      setDoc(docRef, { items: dataToUse }).catch(console.error);
      try {
        localStorage.setItem(`glow_${docId}`, JSON.stringify(dataToUse));
      } catch {}
      onData(dataToUse);
    },
    (error) => {
      console.warn(`Firestore sync error for array ${docId}:`, error);
      if (localData) {
        onData(localData);
      }
    }
  );
}
