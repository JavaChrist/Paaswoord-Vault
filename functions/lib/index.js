"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webauthnApi = void 0;
// Firebase Functions WebAuthn endpoints (Express app)
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@simplewebauthn/server");
admin.initializeApp();
const db = admin.firestore();
const DEFAULT_RPID = process.env.WEBAUTHN_RPID || 'localhost';
const DEFAULT_ORIGIN = process.env.WEBAUTHN_ORIGIN || `https://${DEFAULT_RPID}`;
function deriveOriginAndRpID(req) {
    try {
        const headerOrigin = req.headers['origin'] || '';
        if (headerOrigin && headerOrigin.startsWith('https://')) {
            const url = new URL(headerOrigin);
            return { origin: headerOrigin, rpID: url.hostname };
        }
        const forwardedProto = req.headers['x-forwarded-proto'] || 'https';
        const forwardedHost = req.headers['x-forwarded-host'] || req.headers['host'] || DEFAULT_RPID;
        const builtOrigin = `${forwardedProto}://${forwardedHost}`;
        const url = new URL(builtOrigin);
        return { origin: builtOrigin, rpID: url.hostname };
    }
    catch {
        return { origin: DEFAULT_ORIGIN, rpID: DEFAULT_RPID };
    }
}
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
app.use(express_1.default.json());
app.post('/webauthn/generate-registration-options', async (req, res) => {
    const { userId, email } = req.body;
    const { rpID } = deriveOriginAndRpID(req);
    const userDoc = db.collection('webauthn').doc(userId);
    const options = await (0, server_1.generateRegistrationOptions)({
        rpName: 'Password Vault',
        rpID,
        userID: userId,
        userName: email,
        attestationType: 'none',
        authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
    });
    await userDoc.set({ challenge: options.challenge }, { merge: true });
    res.json({ options });
});
app.post('/webauthn/verify-registration', async (req, res) => {
    const { userId, attestation } = req.body;
    const { origin, rpID } = deriveOriginAndRpID(req);
    const userDoc = db.collection('webauthn').doc(userId);
    const snap = await userDoc.get();
    const expectedChallenge = snap.get('challenge');
    const verification = await (0, server_1.verifyRegistrationResponse)({
        response: attestation,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
    });
    if (!verification.verified || !verification.registrationInfo)
        return res.status(400).send('Invalid');
    const { credentialPublicKey, credentialID, counter } = verification.registrationInfo;
    await userDoc.set({
        credential: {
            credentialID: Buffer.from(credentialID).toString('base64url'),
            publicKey: Buffer.from(credentialPublicKey).toString('base64url'),
            counter,
        },
    }, { merge: true });
    res.json({ ok: true });
});
app.post('/webauthn/generate-authentication-options', async (req, res) => {
    const { userId } = req.body;
    const { rpID } = deriveOriginAndRpID(req);
    const userDoc = db.collection('webauthn').doc(userId);
    const snap = await userDoc.get();
    const cred = snap.get('credential');
    const options = await (0, server_1.generateAuthenticationOptions)({
        rpID,
        userVerification: 'required',
        allowCredentials: cred ? [{ id: Buffer.from(cred.credentialID, 'base64url') }] : [],
    });
    await userDoc.set({ challenge: options.challenge }, { merge: true });
    res.json({ options });
});
app.post('/webauthn/verify-authentication', async (req, res) => {
    const { userId, assertion } = req.body;
    const { origin, rpID } = deriveOriginAndRpID(req);
    const userDoc = db.collection('webauthn').doc(userId);
    const snap = await userDoc.get();
    const expectedChallenge = snap.get('challenge');
    const cred = snap.get('credential');
    if (!cred)
        return res.status(400).send('No credential');
    const verification = await (0, server_1.verifyAuthenticationResponse)({
        response: assertion,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        authenticator: {
            counter: cred.counter,
            credentialID: Buffer.from(cred.credentialID, 'base64url'),
            credentialPublicKey: Buffer.from(cred.publicKey, 'base64url'),
        },
    });
    if (!verification.verified || !verification.authenticationInfo)
        return res.status(400).send('Invalid');
    const { newCounter } = verification.authenticationInfo;
    await userDoc.set({ credential: { ...cred, counter: newCounter } }, { merge: true });
    res.json({ ok: true });
});
exports.webauthnApi = functions.https.onRequest(app);
