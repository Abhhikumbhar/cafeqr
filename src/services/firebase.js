// Firebase Configuration & Services for The 7 Cafe
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from "firebase/firestore";

// The 7 Cafe Official Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyDHSnML6NToampyqRy-2iV2m91KjSyQ-8s",
  authDomain: "the7cafe.firebaseapp.com",
  projectId: "the7cafe",
  storageBucket: "the7cafe.firebasestorage.app",
  messagingSenderId: "562245898314",
  appId: "1:562245898314:web:337c952f5deff2d7f7d6b3",
  measurementId: "G-PJQ1WY3HXL"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Analytics safely
export let analytics = null;
if (typeof window !== "undefined") {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch((err) => {
      console.warn("Firebase Analytics not supported in this environment:", err);
    });
}

// Initialize Cloud Firestore
export const db = getFirestore(app);

// Helper: Save new order to Firestore
export async function saveOrderToFirestore(order) {
  if (!db || !order || !order.id) return false;
  try {
    const orderRef = doc(db, "orders", order.id);
    await setDoc(orderRef, {
      ...order,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn("Firestore saveOrder notice (rules/network):", error.message);
    return false;
  }
}

// Helper: Update order status in Firestore
export async function updateOrderStatusInFirestore(orderId, newStatus, tableId) {
  if (!db || !orderId) return false;
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      ...(tableId ? { tableId } : {}),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.warn("Firestore updateStatus notice (rules/network):", error.message);
    return false;
  }
}

// Helper: Subscribe to real-time live orders from Firestore
export function subscribeToFirestoreOrders(onNewOrUpdatedOrder) {
  if (!db) return () => {};
  try {
    const ordersCol = collection(db, "orders");
    const q = query(ordersCol, orderBy("createdAt", "desc"), limit(50));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const data = change.doc.data();
          if (data && onNewOrUpdatedOrder) {
            onNewOrUpdatedOrder(data, change.type);
          }
        });
      },
      (error) => {
        console.warn("Firestore onSnapshot notice (rules/network):", error.message);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn("Firestore subscription error:", err);
    return () => {};
  }
}
