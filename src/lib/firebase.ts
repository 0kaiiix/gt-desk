import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  writeBatch,
  getDocs,
  query,
} from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { Pedestal } from '../types';
import firebaseConfigData from '../../firebase-applet-config.json';

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
  firestoreDatabaseId: firebaseConfigData.firestoreDatabaseId || '(default)',
};

// Initialize Firebase App instance
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Authenticate anonymously in background
signInAnonymously(auth).catch((err) => {
  console.warn('Anonymous sign-in warning:', err);
});

const PEDESTALS_COLLECTION = 'pedestals';

/**
 * Sanitize pedestal object for Firestore:
 * Firestore rejects `undefined` values. Convert any optional/undefined fields cleanly.
 */
export function sanitizeForFirestore(p: Pedestal): Record<string, any> {
  let cleanNewCode = p.newCode || p.newLocation || `${p.zone}#${p.colIndex}-${p.slotIndex}`;
  if (cleanNewCode.startsWith('(') && cleanNewCode.includes(')')) {
    cleanNewCode = cleanNewCode.replace(/^\([^)]*\)/, '');
  }

  const cleanObj: Record<string, any> = {
    id: p.id,
    userName: p.userName || '',
    customerId: p.customerId || '',
    oldCode: p.oldCode || '',
    newCode: cleanNewCode,
    newLocation: p.newLocation || cleanNewCode,
    zone: p.zone,
    colIndex: p.colIndex,
    slotIndex: p.slotIndex,
    row: p.row ?? p.slotIndex,
    col: p.col ?? p.colIndex,
    oldZone: p.oldZone || p.zone,
    oldRow: p.oldRow ?? p.slotIndex,
    oldCol: p.oldCol ?? p.colIndex,
    status: p.status === 'moved' ? 'moved' : 'pending',
    updatedAt: p.updatedAt || new Date().toISOString(),
  };

  if (p.notes && p.notes.trim()) {
    cleanObj.notes = p.notes.trim();
  } else {
    cleanObj.notes = '';
  }

  return cleanObj;
}

/**
 * Parse document snapshot data back into strongly typed Pedestal.
 */
export function parsePedestalFromFirestore(data: any, fallbackId?: string): Pedestal {
  let cleanNewCode = data.newCode || data.newLocation || `${data.zone}#${data.colIndex}-${data.slotIndex}`;
  if (cleanNewCode.startsWith('(') && cleanNewCode.includes(')')) {
    cleanNewCode = cleanNewCode.replace(/^\([^)]*\)/, '');
  }

  return {
    id: data.id || fallbackId || '',
    userName: data.userName || '',
    customerId: data.customerId || '',
    oldCode: data.oldCode || '',
    newCode: cleanNewCode,
    newLocation: data.newLocation || cleanNewCode,
    zone: data.zone || 'A區',
    colIndex: Number(data.colIndex) || 1,
    slotIndex: Number(data.slotIndex) || 1,
    row: Number(data.row) || Number(data.slotIndex) || 1,
    col: Number(data.col) || Number(data.colIndex) || 1,
    oldZone: data.oldZone || data.zone || 'A區',
    oldRow: Number(data.oldRow) || Number(data.slotIndex) || 1,
    oldCol: Number(data.oldCol) || Number(data.colIndex) || 1,
    status: data.status === 'moved' ? 'moved' : 'pending',
    notes: data.notes && data.notes.trim() ? data.notes.trim() : undefined,
    updatedAt: data.updatedAt,
  };
}

/**
 * Sort pedestals predictably by Zone (A -> B -> C), colIndex (1..N), slotIndex (1..N)
 */
export function sortPedestals(list: Pedestal[]): Pedestal[] {
  const zoneOrder: Record<string, number> = { 'A區': 1, 'B區': 2, 'C區': 3 };
  return [...list].sort((a, b) => {
    const zA = zoneOrder[a.zone] || 99;
    const zB = zoneOrder[b.zone] || 99;
    if (zA !== zB) return zA - zB;
    if (a.colIndex !== b.colIndex) return a.colIndex - b.colIndex;
    return a.slotIndex - b.slotIndex;
  });
}

/**
 * Subscribe to real-time changes in pedestals collection.
 * Automatically seeds the database with initial data if the collection is empty.
 */
export function subscribeToPedestals(
  initialData: Pedestal[],
  onUpdate: (pedestals: Pedestal[]) => void,
  onError?: (error: Error) => void
): () => void {
  const pedestalsCol = collection(db, PEDESTALS_COLLECTION);
  const q = query(pedestalsCol);

  const unsubscribe = onSnapshot(
    q,
    { includeMetadataChanges: false },
    async (snapshot) => {
      try {
        if (snapshot.empty) {
          // Initialize database if empty
          console.log('Pedestals collection is empty in Firestore, seeding 199 initial records...');
          await seedInitialPedestals(initialData);
          onUpdate(sortPedestals(initialData));
          return;
        }

        const itemsMap = new Map<string, Pedestal>();
        let hadLegacyPrefix = false;
        let needsSyncFix = false;

        snapshot.forEach((docSnap) => {
          const raw = docSnap.data();
          if (raw.newCode && typeof raw.newCode === 'string' && raw.newCode.startsWith('(')) {
            hadLegacyPrefix = true;
          }
          const pedestal = parsePedestalFromFirestore(raw, docSnap.id);

          // 自動校正 GT1222 (Jin in A區#1-5) 與 GT6211 (Kimber in C區#2-1)
          if (pedestal.id === 'pedestal-A-1-5' || pedestal.customerId === 'GT1222') {
            if (
              pedestal.customerId !== 'GT1222' ||
              pedestal.userName !== 'Jin' ||
              pedestal.oldCode !== 'A區#1-5' ||
              pedestal.newLocation !== 'A區#1-5'
            ) {
              pedestal.customerId = 'GT1222';
              pedestal.userName = 'Jin';
              pedestal.oldCode = 'A區#1-5';
              pedestal.oldZone = 'A區';
              pedestal.oldCol = 1;
              pedestal.oldRow = 5;
              pedestal.newLocation = 'A區#1-5';
              pedestal.newCode = 'A區#1-5';
              pedestal.status = 'moved';
              needsSyncFix = true;
            }
          } else if (pedestal.id === 'pedestal-C-2-1' || pedestal.customerId === 'GT6211') {
            if (
              pedestal.customerId !== 'GT6211' ||
              pedestal.userName !== 'Kimber' ||
              pedestal.oldCode !== 'C區#2-1' ||
              pedestal.newLocation !== 'B區#6-6'
            ) {
              pedestal.customerId = 'GT6211';
              pedestal.userName = 'Kimber';
              pedestal.oldCode = 'C區#2-1';
              pedestal.oldZone = 'C區';
              pedestal.oldCol = 2;
              pedestal.oldRow = 1;
              pedestal.newLocation = 'B區#6-6';
              pedestal.newCode = 'B區#6-6';
              needsSyncFix = true;
            }
          }

          itemsMap.set(pedestal.id, pedestal);
        });

        // Ensure all 199 initial pedestals are present
        const mergedList: Pedestal[] = [];
        initialData.forEach((defaultItem) => {
          if (itemsMap.has(defaultItem.id)) {
            mergedList.push(itemsMap.get(defaultItem.id)!);
          } else {
            mergedList.push(defaultItem);
          }
        });

        const sorted = sortPedestals(mergedList);

        // If legacy prefix or custom fixes were detected in Firestore documents, silently update Firestore in batch
        if (hadLegacyPrefix || needsSyncFix) {
          saveAllPedestalsToFirestore(sorted).catch((err) => {
            console.warn('Silently updated corrected locations in Firestore:', err);
          });
        }

        onUpdate(sorted);
      } catch (err) {
        console.error('Error processing Firestore snapshot:', err);
        if (onError && err instanceof Error) onError(err);
      }
    },
    (error) => {
      console.error('Firestore snapshot listener error:', error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Seed all initial pedestals into Firestore in a batch.
 */
export async function seedInitialPedestals(items: Pedestal[]): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  items.forEach((item) => {
    const docRef = doc(db, PEDESTALS_COLLECTION, item.id);
    const sanitized = sanitizeForFirestore({ ...item, updatedAt: now });
    batch.set(docRef, sanitized);
  });
  await batch.commit();
}

/**
 * Update a single pedestal's status in Firestore in real time.
 */
export async function updatePedestalStatusInFirestore(
  id: string,
  newStatus: 'pending' | 'moved'
): Promise<void> {
  const docRef = doc(db, PEDESTALS_COLLECTION, id);
  await setDoc(
    docRef,
    {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Batch update multiple pedestals' status in Firestore in real time.
 */
export async function batchUpdatePedestalsStatusInFirestore(
  ids: string[],
  targetStatus: 'pending' | 'moved'
): Promise<void> {
  if (ids.length === 0) return;
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  ids.forEach((id) => {
    const docRef = doc(db, PEDESTALS_COLLECTION, id);
    batch.set(
      docRef,
      {
        status: targetStatus,
        updatedAt: now,
      },
      { merge: true }
    );
  });
  await batch.commit();
}

/**
 * Update full pedestal information (e.g. customerId, userName, notes) in real time.
 */
export async function updatePedestalInFirestore(updated: Pedestal): Promise<void> {
  const docRef = doc(db, PEDESTALS_COLLECTION, updated.id);
  const sanitized = sanitizeForFirestore({
    ...updated,
    updatedAt: new Date().toISOString(),
  });
  await setDoc(docRef, sanitized, { merge: true });
}

/**
 * Save all pedestals in a batch (e.g. after slot swapping or full reorder).
 */
export async function saveAllPedestalsToFirestore(items: Pedestal[]): Promise<void> {
  if (items.length === 0) return;
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  items.forEach((item) => {
    const docRef = doc(db, PEDESTALS_COLLECTION, item.id);
    const sanitized = sanitizeForFirestore({
      ...item,
      updatedAt: now,
    });
    batch.set(docRef, sanitized);
  });
  await batch.commit();
}

/**
 * Fetch all pedestals directly from Firestore once.
 */
export async function fetchAllPedestalsFromFirestore(): Promise<Pedestal[]> {
  const pedestalsCol = collection(db, PEDESTALS_COLLECTION);
  const q = query(pedestalsCol);
  const snapshot = await getDocs(q);
  const items: Pedestal[] = [];
  snapshot.forEach((docSnap) => {
    items.push(parsePedestalFromFirestore(docSnap.data(), docSnap.id));
  });
  return sortPedestals(items);
}

/**
 * Reset all pedestals in Firestore back to default initial specifications.
 */
export async function resetPedestalsInFirestore(defaultItems: Pedestal[]): Promise<void> {
  const batch = writeBatch(db);
  const now = new Date().toISOString();
  defaultItems.forEach((item) => {
    const docRef = doc(db, PEDESTALS_COLLECTION, item.id);
    const sanitized = sanitizeForFirestore({
      ...item,
      updatedAt: now,
    });
    batch.set(docRef, sanitized);
  });
  await batch.commit();
}
