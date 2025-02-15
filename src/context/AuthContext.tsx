import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { onSnapshot, doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any;
  setUserData: any;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any>(null);

  // useEffect(() => {
  //   const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);

  //     if (firebaseUser) {
  //       const userRef = doc(db, "users", firebaseUser.uid);
  //       console.log("FIREBASE USER UID:", firebaseUser.uid)

  //       // Store Firestore unsubscribe function
  //       const unsubscribeUser = onSnapshot(userRef, (doc) => {
  //         if (doc.exists()) {
  //           setUserData(doc.data());
  //         }
  //       });

  //       // Ensure Firestore listener is cleaned up properly
  //       return () => {
  //         unsubscribeUser();
  //       };
  //     } else {
  //       setUserData(null);
  //     }
  //   });

  //   // Cleanup Auth listener properly
  //   return () => {
  //     unsubscribeAuth();
  //   };
  // }, []);
  useEffect(() => {
    // console.log("Auth state change triggered");

    let unsubscribeUser: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // console.log(
      //   "Firebase user changed:",
      //   firebaseUser ? firebaseUser.uid : "No user"
      // );

      setUser(firebaseUser);

      if (unsubscribeUser) {
        // console.log("Cleaning up previous Firestore listener");
        unsubscribeUser();
      }

      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);

        // console.log(
        //   "Setting up Firestore listener for user:",
        //   firebaseUser.uid
        // );

        unsubscribeUser = onSnapshot(userRef, (doc) => {
          if (doc.exists()) {
            // console.log(
            //   "Firestore update for user:",
            //   firebaseUser.uid,
            //   "Data:",
            //   doc.data()
            // );
            setUserData(doc.data());
          } else {
            // console.log(
            //   "Firestore document does not exist for user:",
            //   firebaseUser.uid
            // );
            setUserData(null);
          }
        });
      } else {
        // console.log("No authenticated user, setting userData to null");
        setUserData(null);
      }
    });

    return () => {
      // console.log("Cleaning up Auth listener");
      unsubscribeAuth();
      if (unsubscribeUser) {
        // console.log("Cleaning up last Firestore listener");
        unsubscribeUser();
      }
    };
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, userData, logout, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
