# 🔐 Password Vault

**Gestionnaire de mots de passe sécurisé** avec chiffrement local AES-256 et sauvegarde Firebase chiffrée.

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Firebase](https://img.shields.io/badge/Firebase-10-orange)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-success)

## ✨ Fonctionnalités

- 🔐 **Gestion manuelle des mots de passe** - Ajout manuel via interface dédiée
- 🔑 **Authentification Firebase** sécurisée
- 📱 **Synchronisation multi-appareils** en temps réel
- 🎨 **Interface moderne** avec design épuré
- 🚀 **React + TypeScript + Vite** pour des performances optimales
- ☁️ **Sauvegarde Firestore** avec règles de sécurité
- 📋 **Copie individuelle** de tous les champs (mots de passe, CVV, PIN, clés crypto...)
- 🔍 **Recherche** et organisation par sections alphabétiques
- 📱 **PWA** - Installable sur mobile et desktop

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

## 🌐 Application en ligne

🚀 **Application déployée** : [https://password-vault-your-domain.vercel.app](https://password-vault-your-domain.vercel.app)

**Comment ça fonctionne :**

- ➕ **Ajout manuel** : Clic sur "+" pour ajouter un nouveau mot de passe
- 🔄 **Synchronisation** : Automatiquement synchronisé entre tous tes appareils
- 📱 **Multi-plateforme** : Fonctionne sur mobile, tablette et desktop
- 🔒 **Sécurisé** : Chaque utilisateur voit uniquement ses propres données

**⚠️ Important :** Password Vault ne capture PAS automatiquement tes mots de passe depuis d'autres sites. Tu dois les ajouter manuellement via l'interface de l'application.

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

## 🚀 Déploiement Vercel

### **Déploiement automatique :**

1. **Push sur GitHub** : `git push origin main`
2. **Vercel détecte** automatiquement les changements
3. **Déploiement** en quelques secondes
4. **URL mise à jour** automatiquement

### **Configuration Vercel :**

**Variables d'environnement** (obligatoires) :

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

**Domaine autorisé Firebase :**

- Ajouter ton domaine Vercel dans Firebase Console → Authentication → Settings

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

### **🚨 IMPORTANT : Firebase est OBLIGATOIRE**

L'application utilise Firebase Authentication et Firestore pour synchroniser tes mots de passe entre appareils en temps réel.

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

## 📞 Support

- 📧 **Problèmes** : Créer une issue sur GitHub
- 🔧 **Firebase** : Consulter [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
- 🚀 **Vercel** : Variables d'environnement requises

---

**🔐 Password Vault v1.0** - Gestionnaire de mots de passe sécurisé avec synchronisation multi-appareils
