import React, { createContext, useContext, useEffect, useState } from 'react';
import { insforge } from '../lib/insforge';

const AuthContext = createContext({
    user: null,
    loading: true,
    setUser: () => { },
});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if there is an active session on load
        const checkSession = async () => {
            try {
                const { data } = await insforge.auth.getCurrentSession();
                setUser(data.session?.user ?? null);
            } catch (error) {
                console.error("Session check failed", error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
