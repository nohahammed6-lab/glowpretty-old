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
    { includeMetadataChanges: true },
    (snapshot: any) => {
      if (snapshot.exists()) {
        onData(snapshot.data() as T);
      } else if (!snapshot.metadata?.hasPendingWrites) {
        // First time initialization if doc doesn't exist yet
        setDoc(docRef, fallbackData as any, { merge: true }).catch(console.error);
        onData(fallbackData);
      }
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
    { includeMetadataChanges: true },
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.items)) {
          onData(data.items as T[]);
          return;
        }
      }
      if (!snapshot.metadata.hasPendingWrites) {
        // Initialize with fallback
        setDoc(docRef, { items: fallbackData }).catch(console.error);
        onData(fallbackData);
      }
    },
    (error) => {
      console.warn(`Firestore sync error for array ${docId}:`, error);
    }
  );
}
