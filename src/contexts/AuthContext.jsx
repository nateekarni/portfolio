import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = useCallback(async () => {
        try {
            const response = await authAPI.verify();
            setIsAuthenticated(response.authenticated);
        } catch (error) {
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback(async (token) => {
        try {
            setIsLoading(true);
            await authAPI.login(token);
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            setIsLoading(true);
            await authAPI.logout();
            setIsAuthenticated(false);
            return { success: true };
        } catch (error) {
            // Even if logout fails, clear local state
            setIsAuthenticated(false);
            return { success: false, error: error.message };
        } finally {
            setIsLoading(false);
        }
    }, []);

    const value = {
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
