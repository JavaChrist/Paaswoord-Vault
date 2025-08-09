// Stocke la wrapped key (clé AES chiffrée) en IndexedDB via l'API idb-keyval-like

const DB_NAME = 'vault-db';
const STORE_NAME = 'keys';
const WRAPPED_KEY_KEY = 'wrappedVaultKey';

function withDb<T>(fn: (db: IDBDatabase) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(DB_NAME, 1);
    openReq.onupgradeneeded = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      const db = openReq.result;
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        fn(db as unknown as IDBDatabase & { __tx?: IDBTransaction });
        // Resolve is handled inside fn via request events
      } catch (e) {
        reject(e);
      }
    };
  });
}

function idbGet<T = unknown>(key: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(DB_NAME, 1);
    openReq.onupgradeneeded = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    };
  });
}

function idbSet<T = unknown>(key: string, value: T): Promise<void> {
  return new Promise((resolve, reject) => {
    const openReq = indexedDB.open(DB_NAME, 1);
    openReq.onupgradeneeded = () => {
      const db = openReq.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    openReq.onerror = () => reject(openReq.error);
    openReq.onsuccess = () => {
      const db = openReq.result;
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(value as unknown as any, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    };
  });
}

export interface WrappedKeyRecord {
  wrappedKey: ArrayBuffer; // AES-GCM ciphertext
  iv: Uint8Array; // 12 bytes
  alg: 'AES-GCM';
  createdAt: number;
}

export async function getWrappedKey(): Promise<WrappedKeyRecord | undefined> {
  const data = await idbGet<WrappedKeyRecord>(WRAPPED_KEY_KEY);
  if (!data) return undefined;
  // Ensure types
  return {
    ...data,
    wrappedKey: data.wrappedKey instanceof ArrayBuffer ? data.wrappedKey : new Uint8Array(data.wrappedKey as any).buffer,
    iv: data.iv instanceof Uint8Array ? data.iv : new Uint8Array(data.iv as any),
  };
}

export async function setWrappedKey(record: WrappedKeyRecord): Promise<void> {
  await idbSet(WRAPPED_KEY_KEY, record);
}

export async function unwrapMasterKey(record: WrappedKeyRecord, unwrapKey: CryptoKey): Promise<CryptoKey> {
  // On suppose que wrappedKey = AES-GCM(masterKeyBytes, iv, tag)
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: record.iv },
    unwrapKey,
    record.wrappedKey,
  );
  return crypto.subtle.importKey(
    'raw',
    decrypted,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

const UNWRAP_KEY_KEY = 'unwrapKey';

export async function setUnwrapKey(key: CryptoKey): Promise<void> {
  // CryptoKey est structured-clonable dans IndexedDB sur navigateurs modernes
  await idbSet(UNWRAP_KEY_KEY, key as unknown as any);
}

export async function getUnwrapKey(): Promise<CryptoKey | undefined> {
  const key = await idbGet<CryptoKey>(UNWRAP_KEY_KEY);
  return key;
}


