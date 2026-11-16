// Firebase Firestore Cloud Database Service
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

let firestoreDb = null;

export function initFirebase(config) {
  if (!config || !config.apiKey || !config.projectId) {
    return null;
  }

  try {
    const app = !getApps().length ? initializeApp(config) : getApp();
    firestoreDb = getFirestore(app);
    return firestoreDb;
  } catch (err) {
    console.error('Firebase initialization error:', err);
    return null;
  }
}

export function getDb() {
  return firestoreDb;
}
