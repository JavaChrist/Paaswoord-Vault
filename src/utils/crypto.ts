// Simple AES-GCM + PBKDF2 helpers for exporting/importing encrypted backups

export interface EncryptedPayload {
  v: number;
  alg: 'AES-GCM';
  kdf: 'PBKDF2';
  salt: string; // base64url
  iv: string; // base64url
  ciphertext: string; // base64url
  ts: string; // ISO timestamp
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let str = '';
  b.forEach((n) => (str += String.fromCharCode(n)));
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url: string): Uint8Array {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const pad = b64.length % 4 === 0 ? '' : '='.repeat(4 - (b64.length % 4));
  const bin = atob(b64 + pad);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations: 310000,
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptJSON(payload: unknown, passphrase: string): Promise<EncryptedPayload> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);
  const enc = new TextEncoder();
  const plaintext = enc.encode(JSON.stringify(payload));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, plaintext);
  return {
    v: 1,
    alg: 'AES-GCM',
    kdf: 'PBKDF2',
    salt: toBase64Url(salt),
    iv: toBase64Url(iv),
    ciphertext: toBase64Url(ct),
    ts: new Date().toISOString(),
  };
}

export async function decryptJSON<T = unknown>(data: EncryptedPayload, passphrase: string): Promise<T> {
  if (data.v !== 1 || data.alg !== 'AES-GCM' || data.kdf !== 'PBKDF2') {
    throw new Error('Format de sauvegarde invalide');
  }
  const salt = fromBase64Url(data.salt);
  const iv = fromBase64Url(data.iv);
  const key = await deriveKey(passphrase, salt);
  const ct = fromBase64Url(data.ciphertext);
  const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
  const dec = new TextDecoder();
  return JSON.parse(dec.decode(pt));
}


