import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore DB using the specific databaseId if present
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId || undefined
);

// In-Memory Multi-Layer Cache for instantaneous cross-component and in-app browser state
const memoryCache = new Map<string, string>();

// Broadcast Channel for 0ms cross-tab and cross-window sync
let syncChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    syncChannel = new BroadcastChannel('glow_pretty_realtime_sync');
  }
} catch {}

function getStoredJson(docId: string): string {
  if (memoryCache.has(docId)) {
    return memoryCache.get(docId)!;
  }
  try {
    const session = sessionStorage.getItem(`glow_${docId}`);
    if (session) {
      memoryCache.set(docId, session);
      return session;
    }
  } catch {}
  try {
    const local = localStorage.getItem(`glow_${docId}`);
    if (local) {
      memoryCache.set(docId, local);
      return local;
    }
  } catch {}
  return '';
}

function persistJson(docId: string, json: string) {
  memoryCache.set(docId, json);
  try {
    sessionStorage.setItem(`glow_${docId}`, json);
  } catch {}
  try {
    localStorage.setItem(`glow_${docId}`, json);
  } catch {}
  if (syncChannel) {
    try {
      syncChannel.postMessage({ docId, json, timestamp: Date.now() });
    } catch {}
  }
}

/**
 * Real-time listener for a single document stored under `app_data/{docId}`
 * Optimized for Instagram / In-App Browsers with immediate parallel getDoc
 */
export function subscribeToDoc<T extends object>(
  docId: string,
  onData: (data: T) => void,
  fallbackData: T
) {
  const docRef = doc(db, 'app_data', docId);
  let lastJson = getStoredJson(docId);

  // Fast direct fetch over HTTP to prevent WebView WebSocket delay
  getDoc(docRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as T;
        const validData = remoteData || fallbackData;
        const newJson = JSON.stringify(validData);
        if (newJson !== lastJson) {
          lastJson = newJson;
          persistJson(docId, newJson);
          onData(validData);
        }
      }
    })
    .catch((err) => {
      console.warn(`Initial fast getDoc for ${docId}:`, err);
    });

  // Listen to BroadcastChannel for instant local cross-tab updates
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.docId === docId && event.data.json) {
      if (event.data.json !== lastJson) {
        lastJson = event.data.json;
        try {
          const parsed = JSON.parse(event.data.json);
          onData(parsed);
        } catch {}
      }
    }
  };
  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }

  // Real-time Firestore snapshot listener
  const unsubscribeSnapshot = onSnapshot(
    docRef,
    (snapshot: any) => {
      if (snapshot.exists()) {
        const remoteData = snapshot.data() as T;
        const validData = remoteData || fallbackData;
        const newJson = JSON.stringify(validData);
        persistJson(docId, newJson);
        if (newJson !== lastJson) {
          lastJson = newJson;
          onData(validData);
        }
        return;
      }

      // If document doesn't exist remotely yet, check local storage or fallback
      let localData: T | null = null;
      const stored = getStoredJson(docId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && typeof parsed === 'object') {
            localData = parsed;
          }
        } catch {}
      }

      const dataToUse = localData || fallbackData;
      const cleanDataToUse = JSON.parse(JSON.stringify(dataToUse));
      setDoc(docRef, cleanDataToUse, { merge: true }).catch(console.error);
      const finalJson = JSON.stringify(dataToUse);
      persistJson(docId, finalJson);
      if (finalJson !== lastJson) {
        lastJson = finalJson;
        onData(dataToUse);
      }
    },
    (error) => {
      console.warn(`Firestore sync error for ${docId}:`, error);
      const stored = getStoredJson(docId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && JSON.stringify(parsed) !== lastJson) {
            lastJson = JSON.stringify(parsed);
            onData(parsed);
          }
        } catch {}
      }
    }
  );

  return () => {
    unsubscribeSnapshot();
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
  };
}

/**
 * Save / update a document stored under `app_data/{docId}`
 */
export async function saveDoc<T extends object>(docId: string, data: T) {
  const json = JSON.stringify(data);
  persistJson(docId, json);
  try {
    const docRef = doc(db, 'app_data', docId);
    const cleanData = JSON.parse(json);
    await setDoc(docRef, cleanData, { merge: true });
  } catch (error) {
    console.error(`Failed to save ${docId} to Firestore:`, error);
  }
}

/**
 * Save array document
 */
export async function saveDocArray<T>(docId: string, items: T[]) {
  const json = JSON.stringify(items);
  persistJson(docId, json);
  try {
    const docRef = doc(db, 'app_data', docId);
    const cleanItems = JSON.parse(json);
    await setDoc(docRef, { items: cleanItems });
  } catch (error) {
    console.error(`Failed to save array ${docId} to Firestore:`, error);
  }
}

/**
 * Real-time listener for an array document stored under `app_data/{docId}`
 * Optimized for Instagram / In-App Browsers with immediate parallel getDoc
 */
export function subscribeToDocArray<T>(
  docId: string,
  onData: (items: T[]) => void,
  fallbackData: T[]
) {
  const docRef = doc(db, 'app_data', docId);
  let lastJson = getStoredJson(docId);

  // Fast direct fetch over HTTP to prevent WebView WebSocket delay
  getDoc(docRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const remoteItems = (data && Array.isArray(data.items)) ? (data.items as T[]) : [];
        const newJson = JSON.stringify(remoteItems);
        if (newJson !== lastJson) {
          lastJson = newJson;
          persistJson(docId, newJson);
          onData(remoteItems);
        }
      }
    })
    .catch((err) => {
      console.warn(`Initial fast getDoc for array ${docId}:`, err);
    });

  // Listen to BroadcastChannel for instant local cross-tab updates
  const handleBroadcast = (event: MessageEvent) => {
    if (event.data && event.data.docId === docId && event.data.json) {
      if (event.data.json !== lastJson) {
        lastJson = event.data.json;
        try {
          const parsed = JSON.parse(event.data.json);
          if (Array.isArray(parsed)) {
            onData(parsed);
          }
        } catch {}
      }
    }
  };
  if (syncChannel) {
    syncChannel.addEventListener('message', handleBroadcast);
  }

  // Real-time Firestore snapshot listener
  const unsubscribeSnapshot = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const remoteItems = (data && Array.isArray(data.items)) ? (data.items as T[]) : [];
        const newJson = JSON.stringify(remoteItems);
        persistJson(docId, newJson);
        if (newJson !== lastJson) {
          lastJson = newJson;
          onData(remoteItems);
        }
        return;
      }

      let localData: T[] | null = null;
      const stored = getStoredJson(docId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            localData = parsed;
          }
        } catch {}
      }

      const dataToUse = localData !== null ? localData : fallbackData;
      const cleanDataToUse = JSON.parse(JSON.stringify(dataToUse));
      setDoc(docRef, { items: cleanDataToUse }).catch(console.error);
      const finalJson = JSON.stringify(dataToUse);
      persistJson(docId, finalJson);
      if (finalJson !== lastJson) {
        lastJson = finalJson;
        onData(dataToUse);
      }
    },
    (error) => {
      console.warn(`Firestore sync error for array ${docId}:`, error);
      const stored = getStoredJson(docId);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && JSON.stringify(parsed) !== lastJson) {
            lastJson = JSON.stringify(parsed);
            onData(parsed);
          }
        } catch {}
      }
    }
  );

  return () => {
    unsubscribeSnapshot();
    if (syncChannel) {
      syncChannel.removeEventListener('message', handleBroadcast);
    }
  };
}
