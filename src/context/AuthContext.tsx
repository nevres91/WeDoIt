import {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { onSnapshot, doc, setDoc } from "firebase/firestore";
import { UserData } from "../types";

interface AuthContextType {
  user: User | null;
  userData: UserData;
  setUserData: React.Dispatch<SetStateAction<UserData>>; //Check if error appears
  logout: () => Promise<void>;
  updateUserData: (newData: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    let unsubscribeUser: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (unsubscribeUser) {
        unsubscribeUser();
      }

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            setUserData(null);
          }
        });
      } else {
        setUserData(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUser) {
        unsubscribeUser();
      }
    };
  }, []);

  const updateUserData = async (newData: Partial<UserData>) => {
    if (!user) {
      throw new Error("No authenticated user found");
    }

    const userRef = doc(db, "users", user.uid);
    try {
      await setDoc(userRef, newData, { merge: true }); // Use setDoc with merge
      // The onSnapshot listener will automatically update userData state
    } catch (error) {
      console.error("Error updating user data:", error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, userData, logout, setUserData, updateUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
