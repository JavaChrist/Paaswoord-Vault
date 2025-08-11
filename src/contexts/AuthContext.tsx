import { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [idleSince, setIdleSince] = useState<number | null>(null);
  const AUTO_LOGOUT_MS = 15 * 60 * 1000; // 15 minutes

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(result.user, { displayName });
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Auto-logout on inactivity
  useEffect(() => {
    const resetIdle = () => setIdleSince(Date.now());
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click', 'visibilitychange'];
    events.forEach((evt) => window.addEventListener(evt, resetIdle, { passive: true }));
    resetIdle();

    const interval = window.setInterval(async () => {
      if (!currentUser) return;
      if (!idleSince) return;
      const inactiveMs = Date.now() - idleSince;
      if (inactiveMs >= AUTO_LOGOUT_MS) {
        try {
          await signOut(auth);
        } finally {
          setIdleSince(null);
        }
      }
    }, 30 * 1000); // check every 30s

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, resetIdle));
      window.clearInterval(interval);
    };
  }, [currentUser, idleSince]);

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Messages d'erreur en français
function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'Aucun utilisateur trouvé avec cet email';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/weak-password':
      return 'Le mot de passe est trop faible';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Réessayez plus tard';
    case 'auth/network-request-failed':
      return 'Erreur réseau. Vérifiez votre connexion';
    case 'auth/requires-recent-login':
      return 'Reconnectez-vous pour effectuer cette action';
    default:
      return 'Erreur d\'authentification';
  }
} 