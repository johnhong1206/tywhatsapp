import { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { auth, db } from "../config/firebase";
import { User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User

        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, [db, auth]);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
