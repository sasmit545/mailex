import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";


const AuthContext = createContext();

export function useFirebase() {
    return useContext(AuthContext);
}

export function FirebaseProvider({ children, app }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const auth = getAuth(app);
    const db = getFirestore(app);

    const login = async () => {
        setLoading(true);
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setCurrentUser(result.user);
        setLoading(false);
    }

    // TODO: remove loading, login, logout ect. Leave just user app and add auth (more roubust approach)
    const value = {
        user: currentUser,
        login,
        loading,
        logout: () => signOut(auth),
        db,
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, [auth]);



    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


