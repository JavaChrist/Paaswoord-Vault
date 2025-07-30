# Configuration Firebase pour Password Vault

## 🚀 Étapes de configuration

### 1. Créer un projet Firebase
1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Créer un projet"
3. Donnez un nom à votre projet (ex: "password-vault-perso")
4. Activez Google Analytics (optionnel)
5. Créez le projet

### 2. Configurer Authentication
1. Dans la console Firebase, allez dans **Authentication**
2. Cliquez sur **Get started**
3. Allez dans l'onglet **Sign-in method**
4. Activez **Email/Password**
5. Sauvegardez

### 3. Configurer Firestore Database
1. Dans la console Firebase, allez dans **Firestore Database**
2. Cliquez sur **Create database**
3. Choisissez **Start in test mode** (temporaire)
4. Sélectionnez une région proche de vous
5. Créez la base de données

### 4. Obtenir la configuration de l'app
1. Dans la console Firebase, allez dans **Project Settings** (⚙️)
2. Descendez vers **Your apps**
3. Cliquez sur **Add app** puis sélectionnez **Web** (</>)
4. Donnez un nom à votre app (ex: "Password Vault Web")
5. **Copiez les valeurs de configuration**

### 5. Configurer les variables d'environnement
1. Créez un fichier `.env` à la racine du projet
2. Ajoutez vos variables Firebase :

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### 6. Déployer les règles de sécurité Firestore
1. Installez Firebase CLI :
```bash
npm install -g firebase-tools
```

2. Connectez-vous à Firebase :
```bash
firebase login
```

3. Initialisez Firebase dans votre projet :
```bash
firebase init firestore
```

4. Copiez le contenu de `firestore.rules` dans le fichier généré
5. Déployez les règles :
```bash
firebase deploy --only firestore:rules
```

## 🔒 Sécurité

Les règles Firestore garantissent que :
- ✅ Seuls les utilisateurs authentifiés peuvent accéder aux données
- ✅ Chaque utilisateur ne voit que ses propres mots de passe
- ✅ Impossible d'accéder aux données d'autres utilisateurs
- ✅ Protection contre les accès non autorisés

## 📱 Synchronisation multi-appareils

Une fois configuré, vos mots de passe seront automatiquement synchronisés entre :
- 💻 Ordinateur de bureau
- 📱 Téléphone mobile
- 🌐 Navigateurs web
- ⚡ Temps réel sur tous les appareils

## 🛠️ Dépannage

### Erreur "Impossible de charger les mots de passe"
- Vérifiez que les variables d'environnement sont correctes
- Assurez-vous que Firestore est activé
- Vérifiez que les règles Firestore sont déployées

### Erreur de connexion
- Vérifiez qu'Authentication est activé
- Assurez-vous qu'Email/Password est configuré
- Vérifiez le domaine autorisé dans Firebase

## 📈 Prochaines étapes

Une fois configuré, vous pourrez :
1. ✅ Créer un compte utilisateur
2. ✅ Ajouter vos mots de passe
3. ✅ Les voir sur tous vos appareils
4. ✅ Modifier/supprimer en temps réel
5. ✅ Profiter de la synchronisation automatique ! 