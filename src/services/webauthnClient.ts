import { startAuthentication, startRegistration } from '@simplewebauthn/browser';
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
  AuthenticationResponseJSON,
} from '@simplewebauthn/types';

export interface WebAuthnRegistrationOptionsResponse { options: PublicKeyCredentialCreationOptionsJSON }

export interface WebAuthnRegistrationVerifyRequest {
  userId: string;
  email: string;
  attestation: RegistrationResponseJSON;
}

export interface WebAuthnAuthenticationOptionsResponse { options: PublicKeyCredentialRequestOptionsJSON }

export interface WebAuthnAuthenticationVerifyRequest {
  userId: string;
  assertion: AuthenticationResponseJSON;
}

// Réponses renvoyées par le navigateur

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function postJson<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export async function registerPasskey(userId: string, email: string): Promise<void> {
  console.info('[WebAuthn] Demande des options de registration');
  const { options } = await postJson<WebAuthnRegistrationOptionsResponse>(
    '/webauthn/generate-registration-options',
    { userId, email },
  );

  const attestation = await startRegistration(options);
  console.info('[WebAuthn] Attestation obtenue');

  await postJson<void>('/webauthn/verify-registration', {
    userId,
    email,
    attestation,
  } satisfies WebAuthnRegistrationVerifyRequest);

  console.info('[WebAuthn] Enregistré avec succès');
  try { localStorage.setItem('passkeyUserId', userId); } catch { }
}

export async function authenticatePasskey(userId: string): Promise<void> {
  console.info('[WebAuthn] Demande des options d\'authentification');
  const { options } = await postJson<WebAuthnAuthenticationOptionsResponse>(
    '/webauthn/generate-authentication-options',
    { userId },
  );

  const assertion = await startAuthentication(options);
  console.info('[WebAuthn] Assertion obtenue');

  await postJson<void>('/webauthn/verify-authentication', {
    userId,
    assertion,
  } satisfies WebAuthnAuthenticationVerifyRequest);

  console.info('[WebAuthn] Authentifié avec succès');
}


