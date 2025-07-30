import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

// Interface pour les entrées de mot de passe
export interface PasswordEntry {
  id?: string;
  userId: string;
  title: string;
  identifier: string;
  section: string;
  type?: string;
  // Champs pour comptes classiques
  password?: string;
  notes?: string;
  // Champs spécifiques aux cartes bancaires
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardholderName?: string;
  bankName?: string;
  pinCode?: string;
  // Champs pour connexions sociales
  selectedServices?: string[];
  // Champs pour crypto
  publicKey?: string;
  privateKey?: string;
  recoveryPhrase?: string;
  // Métadonnées
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

const COLLECTION_NAME = 'passwords';

// Récupérer tous les mots de passe d'un utilisateur
export const getUserPasswords = async (userId: string): Promise<PasswordEntry[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const passwords: PasswordEntry[] = [];

    querySnapshot.forEach((doc) => {
      passwords.push({
        id: doc.id,
        ...doc.data()
      } as PasswordEntry);
    });

    // Trier côté client au lieu de Firestore (évite l'index composé)
    return passwords.sort((a, b) => a.title.localeCompare(b.title));
  } catch (error) {
    console.error('Erreur lors de la récupération des mots de passe:', error);
    throw error;
  }
};

// Ajouter un nouveau mot de passe
export const addPassword = async (userId: string, passwordData: Omit<PasswordEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...passwordData,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    console.log('Mot de passe ajouté avec ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de l\'ajout du mot de passe:', error);
    throw error;
  }
};

// Mettre à jour un mot de passe existant
export const updatePassword = async (passwordId: string, passwordData: Partial<PasswordEntry>): Promise<void> => {
  try {
    const passwordRef = doc(db, COLLECTION_NAME, passwordId);
    await updateDoc(passwordRef, {
      ...passwordData,
      updatedAt: Timestamp.now()
    });

    console.log('Mot de passe mis à jour:', passwordId);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error);
    throw error;
  }
};

// Supprimer un mot de passe
export const deletePassword = async (passwordId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, passwordId));
    console.log('Mot de passe supprimé:', passwordId);
  } catch (error) {
    console.error('Erreur lors de la suppression du mot de passe:', error);
    throw error;
  }
};

// Fonction utilitaire pour générer la section (première lettre)
export const generateSection = (title: string): string => {
  return title.charAt(0).toUpperCase();
};

// Fonction utilitaire pour générer l'identifiant affiché selon le type
export const generateDisplayIdentifier = (entry: PasswordEntry): string => {
  switch (entry.type) {
    case 'card':
      return entry.cardNumber ? `•••• •••• •••• ${entry.cardNumber.slice(-4)}` : 'Carte bancaire';
    case 'social':
      return entry.selectedServices?.length > 0 ?
        `${entry.selectedServices.length} service(s) connecté(s)` :
        'Connexions sociales';
    case 'unique':
      return 'Mot de passe unique';
    case 'crypto':
      return 'Portefeuille crypto';
    default:
      return entry.identifier || '';
  }
}; 