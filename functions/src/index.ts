// Firebase Functions WebAuthn endpoints (Express app)
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express, { Request, Response } from 'express';
import cors from 'cors';
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

admin.initializeApp();
const db = admin.firestore();

const rpID = process.env.WEBAUTHN_RPID || 'localhost';
const origin = process.env.WEBAUTHN_ORIGIN || `https://${rpID}`;

interface StoredCredential {
  credentialID: string;
  publicKey: string;
  counter: number;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.post('/webauthn/generate-registration-options', async (req: Request, res: Response) => {
  const { userId, email } = req.body as { userId: string; email: string };
  const userDoc = db.collection('webauthn').doc(userId);
  const options = await generateRegistrationOptions({
    rpName: 'Password Vault',
    rpID,
    userID: userId as any,
    userName: email,
    attestationType: 'none',
    authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
  } as any);
  await userDoc.set({ challenge: options.challenge }, { merge: true });
  res.json({ options });
});

app.post('/webauthn/verify-registration', async (req: Request, res: Response) => {
  const { userId, attestation } = req.body as any;
  const userDoc = db.collection('webauthn').doc(userId);
  const snap = await userDoc.get();
  const expectedChallenge = snap.get('challenge');
  const verification = await verifyRegistrationResponse({
    response: attestation,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });
  if (!verification.verified || !verification.registrationInfo) return res.status(400).send('Invalid');
  const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
  await userDoc.set({
    credential: {
      credentialID: (credentialID as any),
      publicKey: (credentialPublicKey as any),
      counter,
    } as StoredCredential,
  }, { merge: true });
  res.json({ ok: true });
});

app.post('/webauthn/generate-authentication-options', async (req: Request, res: Response) => {
  const { userId } = req.body as { userId: string };
  const userDoc = db.collection('webauthn').doc(userId);
  const snap = await userDoc.get();
  const cred = snap.get('credential') as StoredCredential | undefined;
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    allowCredentials: cred ? [{ id: cred.credentialID }] : [],
  } as any);
  await userDoc.set({ challenge: options.challenge }, { merge: true });
  res.json({ options });
});

app.post('/webauthn/verify-authentication', async (req: Request, res: Response) => {
  const { userId, assertion } = req.body as any;
  const userDoc = db.collection('webauthn').doc(userId);
  const snap = await userDoc.get();
  const expectedChallenge = snap.get('challenge');
  const cred = snap.get('credential') as StoredCredential | undefined;
  if (!cred) return res.status(400).send('No credential');

  const verification = await verifyAuthenticationResponse({
    response: assertion,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: ({
      counter: cred.counter,
      credentialID: Buffer.from(cred.credentialID, 'base64url'),
      credentialPublicKey: Buffer.from(cred.publicKey, 'base64url'),
    } as any),
  } as any);
  if (!verification.verified || !verification.authenticationInfo) return res.status(400).send('Invalid');
  const { newCounter } = verification.authenticationInfo;
  await userDoc.set({ credential: { ...cred, counter: newCounter } }, { merge: true });
  res.json({ ok: true });
});

export const webauthnApi = functions.https.onRequest(app);


