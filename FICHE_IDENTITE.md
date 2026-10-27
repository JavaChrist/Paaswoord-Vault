# KeyBox

## Présentation en une phrase
KeyBox est une application web (installable comme application mobile) qui permet à une personne de ranger au même endroit ses mots de passe, cartes bancaires, portefeuilles crypto et autres codes personnels, dans un espace protégé par un compte et accessible depuis plusieurs appareils.

## Public visé
Les particuliers qui veulent regrouper leurs identifiants et informations sensibles dans une seule application en français, plutôt que de les noter un peu partout. L'application ne s'adresse pas à un usage d'entreprise et ne récupère pas automatiquement les mots de passe : chaque information est saisie à la main.

## Problème résolu
Éviter d'oublier ou de disperser ses mots de passe, codes et numéros de carte. KeyBox offre un endroit unique pour les enregistrer, les retrouver facilement (classés par ordre alphabétique) et les recopier d'un geste, avec la possibilité de faire une sauvegarde protégée par un mot de passe.

## Fonctionnalités principales
- **Compte personnel sécurisé** : création de compte, connexion et déconnexion ; chaque utilisateur ne voit que ses propres données.
- **Enregistrement de plusieurs types d'informations** : comptes classiques, connexions « Se connecter avec », codes uniques (WiFi, digicode…), cartes bancaires et portefeuilles crypto.
- **Consultation et copie rapide** : affichage/masquage des valeurs sensibles et copie d'un champ (mot de passe, numéro, code…) en un clic.
- **Déconnexion automatique** après une durée d'inactivité choisie (jamais, 1, 5, 15 ou 30 minutes), avec un avertissement avant déconnexion.
- **Sauvegarde et restauration chiffrées** : export d'un fichier de sauvegarde protégé par un mot de passe, puis réimport possible.

## Statut
**En développement / version préliminaire.**

Ce qui justifie ce statut et les limites importantes à connaître :
- Les fonctions principales (compte, ajout/consultation/modification/suppression d'entrées, copie, déconnexion automatique, sauvegarde chiffrée) **fonctionnent**.
- **Limite de sécurité majeure** : les informations enregistrées (mots de passe, cartes, clés…) sont stockées **en clair** dans la base de données. Leur protection repose sur le compte et les règles d'accès, mais **pas** sur un chiffrement des données stockées. Seul le fichier de sauvegarde exporté est, lui, chiffré.
- La **barre de recherche** est affichée mais **ne filtre pas encore** la liste.
- La **synchronisation entre appareils** fonctionne au chargement de l'application, mais **pas en temps réel** (il faut recharger pour voir les modifications faites sur un autre appareil).
- Des éléments d'interface (pied de page avec mentions légales / confidentialité / contact) sont présents dans le code mais **non affichés**.

## Adresse du site
À confirmer. Les fichiers du projet ne contiennent qu'une URL d'exemple. Une adresse réelle a toutefois été observée en fonctionnement pendant les échanges : **https://paaswoord-vault.vercel.app** (dépôt GitHub associé : `JavaChrist/Paaswoord-Vault`). Cette adresse est à **reconfirmer comme étant bien l'URL officielle et actuellement en ligne**.
