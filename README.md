# KeyBox — Gestionnaire de mots de passe

Application web (PWA) qui permet à un utilisateur de **centraliser ses identifiants et informations sensibles** (mots de passe, cartes bancaires, portefeuilles crypto, codes uniques, connexions sociales) dans un espace personnel protégé par un compte, accessible depuis mobile et ordinateur.

> Le nom affiché dans l'interface est **KeyBox**. Le dépôt et certains textes historiques utilisent encore « Password Vault ».

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Firebase](https://img.shields.io/badge/Firebase-11-orange)

---

## À qui s'adresse l'application

Particuliers souhaitant regrouper leurs identifiants et données sensibles dans une seule application, synchronisée sur leurs appareils via un compte personnel. L'application est en français.

> ⚠️ KeyBox ne capture **pas** automatiquement les mots de passe depuis d'autres sites ou applications. Chaque entrée est **saisie manuellement** via l'interface.

---

## État réel des fonctionnalités

Le tableau ci-dessous distingue ce qui est **opérationnel**, **partiel**, **trompeur dans l'ancien README** ou **présent mais inutilisé**, sur la base du code source.

### ✅ Opérationnel

- **Création de compte** (email, mot de passe, nom d'affichage) via Firebase Authentication.
- **Connexion / déconnexion** avec messages d'erreur en français.
- **Gestion des entrées (CRUD)** : ajout, consultation, modification, suppression, stockées dans Firestore.
- **5 types d'entrées**, chacun avec ses champs dédiés :
  - **Compte classique** : identifiant + mot de passe + notes
  - **« Se connecter avec »** : sélection de services (Apple, Google, Microsoft, Facebook, Twitter, LinkedIn, GitHub, Slack, Windows) + notes
  - **Mot de passe unique** : code WiFi, digicode, etc.
  - **Carte bancaire** : n° de carte (formaté), expiration, CVV, nom du porteur, banque, code PIN
  - **Portefeuille crypto** : clé publique, clé privée, phrase de récupération
- **Copie dans le presse-papiers** champ par champ (mot de passe, n° de carte, CVV, PIN, clés, etc.).
- **Masquage / affichage** des valeurs sensibles (icône œil) en consultation.
- **Regroupement alphabétique** des entrées par première lettre du titre.
- **Déconnexion automatique après inactivité** (Jamais, 1, 5, 15 ou 30 min), avec un avertissement 30 secondes avant, préférence conservée dans le navigateur (`localStorage`).
- **Changement du mot de passe du compte** (avec ré-authentification et exigence : 8+ caractères, au moins 1 majuscule et 1 chiffre).
- **Export / Import chiffré** d'une sauvegarde : fichier JSON chiffré **AES‑256‑GCM** avec clé dérivée par **PBKDF2 (SHA‑256, 310 000 itérations)** à partir d'une *passphrase* choisie. Import en mode **Fusionner** ou **Remplacer tout**.
- **Isolation des données par utilisateur** côté serveur (règles Firestore : chaque utilisateur n'accède qu'à ses propres documents).
- **PWA installable** (manifeste + service worker) sur mobile et ordinateur, avec routage SPA géré sur Vercel (`vercel.json`).

### 🟡 Partiel / incomplet

- **Recherche** : une barre de recherche est affichée en bas du tableau de bord, mais le texte saisi **n'est pas appliqué** au filtrage de la liste (le champ est inopérant en l'état).
- **Synchronisation multi-appareils** : les données sont bien centralisées dans Firestore et donc partagées entre appareils d'un même compte, **mais** le chargement se fait **ponctuellement à l'ouverture** (`getDocs`), et non en **temps réel** (pas de `onSnapshot`). Il faut recharger/se reconnecter pour voir les changements faits ailleurs.

### ⚠️ À corriger dans la communication (anciennes affirmations inexactes)

- **« Chiffrement local AES‑256 des mots de passe stockés » / « phrase maître »** : **inexact**. Les champs sensibles (mot de passe, n° de carte, CVV, PIN, clés privées, phrase de récupération, notes) sont enregistrés **en clair** dans Firestore. Le chiffrement AES‑256‑GCM/PBKDF2 ne s'applique **qu'au fichier d'export/import**, pas aux données stockées en base. Il n'existe pas de « phrase maître » pour le coffre.
- **Écran de chargement** de 1,5 s à l'ouverture : il s'agit d'un délai **artificiel** (`setTimeout`), non d'un vrai temps de chargement des données.

### 🧩 Présent dans le code mais non utilisé

- Composants `Header` et `Footer` (`src/components/layout/`) : définis mais **non rendus** (`Layout` n'affiche que son contenu). Les liens « Mentions légales / Confidentialité / Contact » du `Footer` ne sont donc pas affichés et pointent vers `#`.
- **Firebase Storage** est initialisé (`getStorage`) mais n'est utilisé par aucune fonctionnalité.
- Le fichier `test-app.cmd` mentionné dans l'ancien README **n'existe pas** dans le dépôt.

---

## Pile technique

| Domaine | Technologie |
| --- | --- |
| Front-end | React 18 + TypeScript 5 |
| Build / dev | Vite 7 |
| Styles | Tailwind CSS 3 (thème sombre, accent orange `#F97316`) |
| Icônes | lucide-react |
| Routage | react-router-dom 7 (`BrowserRouter`) |
| Authentification | Firebase Authentication (email / mot de passe) |
| Base de données | Cloud Firestore (collection `passwords`) |
| Chiffrement sauvegarde | Web Crypto API (AES‑GCM + PBKDF2) |
| Déploiement | Vercel (SPA) |

> Note : l'interface utilise un thème **sombre avec accent orange**, et non une palette strictement monochrome comme l'indiquait l'ancien README.

---

## Structure du projet

```
src/
├── components/
│   ├── auth/           # ProtectedRoute (accès réservé aux connectés)
│   ├── icons/          # VaultIcon
│   ├── layout/         # Layout (utilisé) + Header/Footer (non rendus)
│   ├── modals/         # AddPassword, ViewPassword, ChangePassword, Backup
│   ├── ui/             # Button, Card, Input, Modal
│   ├── AutoLogoutSelector.tsx
│   ├── CopyNotification.tsx
│   └── LoadingScreen.tsx
├── contexts/           # AuthContext, ToastContext
├── firebase/           # firebaseConfig (Auth, Firestore, Storage)
├── pages/              # Login, Register, Dashboard
├── services/           # passwordService (CRUD Firestore)
├── utils/              # crypto (AES-GCM / PBKDF2 pour export/import)
└── styles/             # index.css (Tailwind)
public/                 # manifest.json, sw.js, icônes PWA
```

Routes : `/login`, `/register`, `/vault` (protégée). `/`, `/dashboard` et toute route inconnue redirigent vers `/vault`.

---

## Installation et lancement

Prérequis : Node.js et un projet Firebase (Authentication + Firestore).

```bash
# 1. Installer les dépendances
npm install

# 2. Démarrer en développement (http://localhost:5173)
npm run dev

# 3. Construire la version de production (dossier dist/)
npm run build

# 4. Prévisualiser le build de production
npm run preview
```

> Scripts disponibles dans `package.json` : `dev`, `build`, `preview`. (Aucun script de test ou de lint n'est défini.)

---

## Configuration

### Variables d'environnement (obligatoires)

Créer un fichier `.env` (ou `.env.local`) à la racine. **Ne jamais committer de secret** ; seuls les **noms** des variables sont listés ici :

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Ces mêmes variables doivent être renseignées dans les **variables d'environnement du projet Vercel**.

### Firebase

1. Créer un projet sur [console.firebase.google.com](https://console.firebase.google.com/).
2. Activer **Authentication** → méthode **E-mail/Mot de passe**.
3. Activer **Cloud Firestore**.
4. Déployer les règles de sécurité (`firestore.rules`) :

```bash
firebase deploy --only firestore:rules
```

5. Ajouter le domaine de déploiement dans **Firebase Console → Authentication → Settings → Domaines autorisés**.

Un guide détaillé est disponible dans [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

> Le dépôt contient aussi un `firebase.json` dont la section *hosting* pointe vers `public/`. Cette configuration **n'est pas adaptée** à un déploiement du build Vite (dont la sortie est `dist/`) et ne concerne pas le déploiement Vercel actuel.

---

## Déploiement (Vercel)

- Framework détecté : **Vite** (build `vite build`, sortie `dist/`).
- Le fichier `vercel.json` ajoute une règle de **réécriture SPA** (toutes les routes → `index.html`) pour éviter les erreurs 404 sur les routes internes et au lancement de la PWA, ainsi que des en-têtes `no-cache` pour `sw.js` et `manifest.json`.
- Déploiement déclenché par un `git push` sur la branche `main`.

---

## Sécurité — à connaître

- ✅ **Authentification requise** et **cloisonnement par utilisateur** appliqué côté serveur via les règles Firestore.
- ✅ **Sauvegardes chiffrées** (export/import) : le fichier exporté est chiffré par une passphrase (AES‑256‑GCM / PBKDF2).
- ⚠️ **Données stockées en clair** : les entrées (mots de passe, cartes, clés, notes…) sont enregistrées **non chiffrées** dans Firestore. Leur confidentialité repose uniquement sur l'authentification et les règles d'accès, **pas** sur un chiffrement de bout en bout.
- ⚠️ **Mot de passe de compte** : minimum imposé à la création (6 caractères) ; exigence renforcée lors d'un changement (8+ caractères, 1 majuscule, 1 chiffre).

---

## Support

- Problèmes / évolutions : ouvrir une *issue* sur le dépôt GitHub.
- Configuration Firebase : voir [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

---

**KeyBox** — gestionnaire personnel d'identifiants (React + Firebase), installable en PWA.
