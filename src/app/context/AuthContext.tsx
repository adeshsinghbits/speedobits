"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    User,
} from "firebase/auth";
import { auth } from "../firebase/config";

// Define the shape of the context
interface AuthContextType {
    user: User | null;
    googleSignIn: () => Promise<void>;
    logOut: () => Promise<void>;
}

// Create context with default empty implementation
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the provider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

const logOut = async () => {
try {
    await signOut(auth);
    } catch (error) {
    console.error("Logout error:", error);
    }
};

useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
    });

    return () => unsubscribe();
}, []);

return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
    {children}
    </AuthContext.Provider>
);
};

// Custom hook for easier access
export const useUserAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useUserAuth must be used within an AuthContextProvider");
    }
    return context;
};
