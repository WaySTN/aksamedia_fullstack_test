import { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authData, setAuthData] = useLocalStorage('auth_user', null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user exists in localStorage on mount
        if (authData && authData.token) {
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, [authData]);

    const login = async (username, password) => {
        try {
            const { response, data } = await authApi.login(username, password);

            if (response.ok && data.status === 'success') {
                const userData = {
                    token: data.data.token,
                    id: data.data.admin.id,
                    username: data.data.admin.username,
                    name: data.data.admin.name,
                    email: data.data.admin.email,
                    phone: data.data.admin.phone,
                };
                setAuthData(userData);
                setIsAuthenticated(true);
                return { success: true };
            }

            return { success: false, message: data.message || 'Login gagal' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'Terjadi kesalahan saat login' };
        }
    };

    const logout = async () => {
        try {
            await authApi.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAuthData(null);
            setIsAuthenticated(false);
            window.localStorage.removeItem('auth_user');
        }
    };

    const updateUser = (newUserData) => {
        setAuthData({ ...authData, ...newUserData });
    };

    // Expose user data (without token for security)
    const user = authData ? {
        id: authData.id,
        username: authData.username,
        name: authData.name,
        email: authData.email,
        phone: authData.phone,
    } : null;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
        );
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
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
