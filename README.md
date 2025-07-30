# 🚀 React Starter - Template Complet

Un starter React moderne et générique pour démarrer rapidement vos projets web avec une base solide et des composants prêts à l'emploi.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Vite](https://img.shields.io/badge/Vite-7-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)

## ✨ Fonctionnalités

- 🔐 **Authentification complète** avec Firebase Auth
- 🎨 **Composants UI** modernes avec Tailwind CSS
- 🛣️ **Routing** avec React Router et routes protégées
- 📱 **Design responsive** avec Header et Footer
- ⚡ **Performance** optimisée avec Vite
- 🔧 **TypeScript** pour la sécurité des types
- 🌐 **PWA ready** avec service worker
- 📦 **Structure organisée** et évolutive

## 🛠️ Technologies incluses

- **Frontend :** React 18 + TypeScript
- **Build :** Vite 7 pour un développement ultra-rapide
- **Styling :** Tailwind CSS pour un design moderne
- **Auth :** Firebase Authentication
- **Routing :** React Router avec protection des routes
- **Icons :** Lucide React pour les icônes
- **PWA :** Configuration service worker incluse

## 🚀 Installation rapide

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd react-vite-tailwind-firebase-pwa-starter-v2
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration Firebase (optionnel)

```bash
# Copier le fichier d'exemple
cp .env.example .env

# Remplir avec vos clés Firebase
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Lancer le projet

```bash
npm run dev
```

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/                    # Composants UI réutilisables
│   │   ├── Button.tsx         # Bouton avec variantes
│   │   ├── Input.tsx          # Input avec label et erreurs
│   │   ├── Card.tsx           # Carte de contenu
│   │   └── Modal.tsx          # Modal responsive
│   ├── layout/                # Composants de mise en page
│   │   ├── Header.tsx         # En-tête avec navigation
│   │   ├── Footer.tsx         # Pied de page
│   │   └── Layout.tsx         # Layout principal
│   └── auth/                  # Composants d'authentification
│       └── ProtectedRoute.tsx # Protection des routes
├── contexts/                  # Contextes React
│   └── AuthContext.tsx        # Gestion de l'authentification
├── pages/                     # Pages de l'application
│   ├── Login.tsx              # Page de connexion
│   ├── Register.tsx           # Page d'inscription
│   ├── Dashboard.tsx          # Page d'accueil
│   └── Profile.tsx            # Page profil utilisateur
├── firebase/                  # Configuration Firebase
│   └── firebaseConfig.ts      # Setup Firebase
└── styles/                    # Styles globaux
    └── index.css              # Styles Tailwind
```

## 🎨 Composants UI disponibles

### Button

Bouton réutilisable avec 4 variantes et 3 tailles.

```tsx
import Button from './components/ui/Button';

// Variantes
<Button variant="primary">Bouton principal</Button>
<Button variant="secondary">Bouton secondaire</Button>
<Button variant="danger">Bouton danger</Button>
<Button variant="outline">Bouton outline</Button>

// Tailles
<Button size="sm">Petit</Button>
<Button size="md">Moyen</Button>
<Button size="lg">Grand</Button>

// État de chargement
<Button isLoading={true}>En cours...</Button>
```

### Input

Input avec label, aide et gestion d'erreurs.

```tsx
import Input from "./components/ui/Input";

<Input
  label="Email"
  type="email"
  placeholder="votre@email.com"
  error="Email invalide"
  helperText="Utilisez votre email professionnel"
/>;
```

### Card

Carte pour structurer le contenu.

```tsx
import Card from "./components/ui/Card";

<Card padding="lg">
  <h3>Titre de la carte</h3>
  <p>Contenu de la carte</p>
</Card>;
```

### Modal

Modal responsive avec overlay.

```tsx
import Modal from "./components/ui/Modal";

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Titre du modal"
  size="lg"
>
  <p>Contenu du modal</p>
</Modal>;
```

## 🔐 Authentification

### AuthContext

Le contexte d'authentification gère l'état utilisateur et les méthodes d'auth.

```tsx
import { useAuth } from "./contexts/AuthContext";

function MonComposant() {
  const { currentUser, login, logout, register } = useAuth();

  // Vérifier si l'utilisateur est connecté
  if (currentUser) {
    return <div>Bonjour {currentUser.displayName}</div>;
  }

  return <div>Non connecté</div>;
}
```

### Routes protégées

Utilisez `ProtectedRoute` pour protéger vos pages.

```tsx
import ProtectedRoute from "./components/auth/ProtectedRoute";

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminPage />
    </ProtectedRoute>
  }
/>;
```

### Mode Demo (pour tester sans Firebase)

Le starter inclut un mode demo pour tester sans configuration Firebase :

- **Email :** `demo@example.com`
- **Mot de passe :** `demo123`

## 🎯 Personnalisation

### 1. Changer le titre et logo

Modifiez dans `src/components/layout/Header.tsx` :

```tsx
<h1 className="text-xl font-semibold text-gray-900">
  Mon Application // ← Changez ici
</h1>
```

### 2. Modifier la navigation

Dans `src/components/layout/Header.tsx`, modifiez le tableau `navigation` :

```tsx
const navigation = [
  { name: "Accueil", href: "/dashboard" },
  { name: "Mes Projets", href: "/projects" }, // ← Personnalisez
  { name: "Équipe", href: "/team" }, // ← Ajoutez vos pages
  { name: "Paramètres", href: "/settings" },
];
```

### 3. Ajouter une nouvelle page

1. Créez votre composant dans `src/pages/`
2. Ajoutez la route dans `src/App.tsx`
3. Ajoutez le lien dans la navigation

```tsx
// 1. Créer MaNouvellePage.tsx
export default function MaNouvellePage() {
  return <div>Ma nouvelle page</div>;
}

// 2. Ajouter dans App.tsx
<Route
  path="/ma-page"
  element={
    <ProtectedRoute>
      <Layout>
        <MaNouvellePage />
      </Layout>
    </ProtectedRoute>
  }
/>;
```

### 4. Personnaliser les couleurs

Modifiez le fichier `tailwind.config.js` pour vos couleurs de marque :

```js
theme: {
  extend: {
    colors: {
      primary: {
        500: '#votre-couleur-principale',
        600: '#votre-couleur-principale-foncée',
      }
    }
  }
}
```

## 🔧 Configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Créez un nouveau projet
3. Activez Authentication > Sign-in method > Email/Password

### 2. Obtenir les clés de configuration

1. Project Settings > General > Your apps
2. Ajoutez une app web
3. Copiez les clés dans votre fichier `.env`

### 3. Activer le mode production

Dans `src/contexts/AuthContext.tsx`, commentez le mode demo et décommentez Firebase :

```tsx
useEffect(() => {
  // MODE DEMO - commentez ces lignes
  // setCurrentUser(demoUser);
  // setLoading(false);

  // Configuration Firebase normale - décommentez
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user);
    setLoading(false);
  });

  return unsubscribe;
}, []);
```

## 📱 PWA (Progressive Web App)

Le starter est configuré comme PWA avec :

- `manifest.json` pour l'installation
- Service Worker pour le cache
- Icons responsive

Pour personnaliser :

1. Modifiez `public/manifest.json`
2. Remplacez les icônes dans `public/`
3. Configurez `public/sw.js` selon vos besoins

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Aperçu du build

```bash
npm run preview
```

### Déploiement recommandé

- **Vercel** : `npm i -g vercel && vercel`
- **Netlify** : Drag & drop du dossier `dist/`
- **Firebase Hosting** : `firebase deploy`

## 📋 Scripts disponibles

```bash
npm run dev          # Démarrer en mode développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Linter le code
```

## 🤝 Contribution

Ce starter est conçu pour être un point de départ. N'hésitez pas à :

- Ajouter vos propres composants
- Améliorer l'accessibilité
- Optimiser les performances
- Ajouter des tests

## 📄 Licence

MIT - Utilisez librement pour vos projets personnels et commerciaux.

---

**🎯 Bon développement !** Ce starter vous fait gagner des heures de setup initial. Concentrez-vous sur ce qui compte : votre logique métier unique.

# 🔐 Password Vault

**Gestionnaire de mots de passe sécurisé** avec chiffrement local AES-256 et sauvegarde Firebase chiffrée.

## ✨ Fonctionnalités

- 🔐 **Gestion complète des mots de passe** (Comptes, Cartes, Crypto, etc.)
- 🔑 **Authentification Firebase** sécurisée
- 📱 **Synchronisation multi-appareils** en temps réel
- 🎨 **Interface style "Sésame"** avec design moderne (noir/orange)
- 🚀 **React + TypeScript + Vite** pour des performances optimales
- ☁️ **Sauvegarde Firestore** avec règles de sécurité
- 📋 **Copie individuelle** de tous les champs (CVV, PIN, clés crypto...)
- 🔍 **Recherche** et organisation par sections alphabétiques

## 🚀 Démarrage rapide

### **Option 1 : Script automatique**

```bash
# Double-clic sur ce fichier :
test-app.cmd
```

### **Option 2 : Manuel**

```bash
npm run dev
```

L'application sera disponible sur : **http://localhost:5173**

## 📱 Types de comptes supportés

- **🧑 Comptes classiques** : Email/mot de passe traditionnels
- **🌐 Connexions sociales** : "Se connecter avec" (Google, Apple, etc.)
- **🔑 Mots de passe uniques** : Codes WiFi, digicodes, etc.
- **💳 Cartes bancaires** : Numéro, CVV, PIN, date d'expiration
- **₿ Portefeuilles crypto** : Clés publiques/privées, phrases de récupération

## 🏗️ Architecture

```
src/
├── components/        # Composants UI réutilisables
├── contexts/         # Context React (AuthContext)
├── firebase/         # Configuration Firebase
├── pages/           # Pages principales (Login, Dashboard)
├── services/        # Services (vaultService)
├── types/           # Types TypeScript
├── utils/           # Utilitaires (crypto)
└── styles/          # Styles Tailwind
```

## 🔐 Sécurité

### **Chiffrement local**

- **AES-256-GCM** : Chiffrement symétrique moderne
- **PBKDF2** : Dérivation de clé avec 100,000 itérations
- **Salt unique** : Généré aléatoirement pour chaque entrée
- **Phrase maître** : Jamais stockée, utilisée uniquement pour dériver les clés

### **Stockage sécurisé**

- Seules les **données déjà chiffrées** sont envoyées à Firebase
- Métadonnées (titre, site) non chiffrées pour la recherche
- Données sensibles (mot de passe, notes) chiffrées avec la phrase maître

## 🎨 Design

Le projet respecte les règles de design monochrome :

- ✅ Uniquement noir, blanc et nuances de gris
- ✅ Pas d'alert() JavaScript (modales personnalisées)
- ✅ Icônes Lucide React en noir/gris
- ✅ Interface professionnelle et épurée

## 📋 TODO - Prochaines fonctionnalités

- [ ] Système de phrase maître après connexion
- [ ] Modal d'ajout/modification d'entrées
- [ ] Générateur de mots de passe avancé
- [ ] Export JSON chiffré
- [ ] Intégration WebDAV pour NAS
- [ ] Analyse de sécurité des mots de passe
- [ ] Mode hors ligne (PWA)

## 🛠️ Développement

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm run dev

# Build de production
npm run build
```

## 🔥 Configuration Firebase

### **🚨 IMPORTANT : Firebase est maintenant OBLIGATOIRE**

L'application utilise Firestore pour synchroniser tes mots de passe entre appareils.

### **📋 Guide complet :**
👉 **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Guide détaillé étape par étape

### **⚡ Configuration rapide :**

1. **Créer un projet Firebase** sur [console.firebase.google.com](https://console.firebase.google.com/)
2. **Activer Authentication** (Email/Password)
3. **Activer Firestore Database**
4. **Créer un fichier `.env`** :

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

5. **Déployer les règles de sécurité** :
```bash
firebase deploy --only firestore:rules
```

---

**🔐 Développé selon les standards de sécurité et de design de Christian**

_Password Vault v1.0 - Gestionnaire de mots de passe nouvelle génération_
