import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { onSnapshot, doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
  //     setUser(currentUser);
  //     if (currentUser) {
  //       const userDoc = await getDoc(doc(db, "users", currentUser.uid));
  //       setUserData(userDoc.exists() ? userDoc.data() : null);
  //     } else {
  //       setUserData(null);
  //     }
  //   });

  //   return () => unsubscribe();
  // }, []);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Listen for user data changes in real-time
        const userRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          }
        });

        return () => unsubscribeUser(); // Cleanup Firestore listener
      } else {
        setUserData(null);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
