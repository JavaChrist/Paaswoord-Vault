## Notes WebAuthn / Passkeys (FaceID / Windows Hello)

### Ce qui est implémenté
- Client
  - `src/components/FaceUnlockButton.tsx` (états, détection UVPA)
  - `src/services/webauthnClient.ts` (`registerPasskey`, `authenticatePasskey`) avec `VITE_FUNCTIONS_BASE_URL` > `VITE_API_BASE_URL` > `/api`
  - `src/stores/vaultKeyStore.ts` (`getWrappedKey`, `setWrappedKey`, `unwrapMasterKey`, `setUnwrapKey`, `getUnwrapKey`)
  - `src/pages/Login.tsx`: tentative auto FaceID au démarrage + modale d’activation post-1er login + fallback mot de passe
  - `src/pages/Dashboard.tsx`: Paramètres → "Activer FaceID / Windows Hello"
- Serveur (Firebase Functions Express)
  - `functions/src/index.ts`
    - `POST /webauthn/generate-registration-options`
    - `POST /webauthn/verify-registration`
    - `POST /webauthn/generate-authentication-options`
    - `POST /webauthn/verify-authentication`
    - `GET  /webauthn/debug` (diagnostic rpID/origin/credential)
  - Auto-déduction `rpID`/`origin` depuis headers (Origin/x-forwarded-*)
  - Firestore: `webauthn/{userId}` avec `challenge` + `credential(credentialID, publicKey, counter)` en base64url
- Hosting / PWA
  - `firebase.json`: rewrites `/api/**` → `webauthnApi` + SPA fallback `**` → `/index.html`
  - `public/sw.js`: scope-aware, SPA fallback, cache statique
  - `public/manifest.json`: `start_url` + `scope` = `/`

Branche: `feature/webauthn-passkeys`

### Problème en cours
- Activation FaceID échoue sur iPhone (aucun Passkey enregistré)
- Bouton login affiche "Aucun Passkey enregistré pour cet appareil/utilisateur"

### Check-list à faire demain
1) Déploiement
   - `firebase deploy --only functions,hosting`
   - `.env` prod: `VITE_API_BASE_URL=/api` (ou `VITE_FUNCTIONS_BASE_URL` si appel direct)
2) Diagnostic rpID/origin (sur iPhone)
   - `https://<domaine>/api/webauthn/debug?userId=<UID>`
   - Vérifier `rpID` = hostname, `origin` = `https://<domaine>`
3) Activation Passkey
   - Dashboard → Paramètres → "Activer FaceID / Windows Hello"
   - Réseau: `generate-registration-options` (200) → prompt Face ID → `verify-registration` (200)
4) iOS
   - iOS ≥ 16.4, Face ID actif, iCloud Trousseau ON
   - Si souci cache/icônes: supprimer icône, Réglages > Safari > Avancé > Données de site → supprimer, réinstaller
5) Icônes PWA
   - Remplacer `public/icon180.png`, `icon192.png`, `icon512.png` par les visuels finaux

### Notes techniques
- Après 1er login (mot de passe), persister la clé d’enveloppe locale via `setUnwrapKey()` pour permettre `unwrapMasterKey()` après WebAuthn.
- Sur Windows sans Windows Hello, pas d’authentificateur plateforme.

### Commandes utiles
- Build Functions: `npm --prefix functions run build`
- Déploiement: `firebase deploy --only functions,hosting`

