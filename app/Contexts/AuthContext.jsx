// contexts/AuthContext.jsx

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mustChangePassword, setMustChangePassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            if (authService.isAuthenticated()) {
                const storedUser = authService.getUser();
                if (storedUser) {
                    setUser(storedUser);
                    setMustChangePassword(storedUser.mustChangePassword || false);
                }
                
                // Verify token is still valid
                const result = await authService.getCurrentUser();
                if (result.success) {
                    setUser(result.user);
                    setMustChangePassword(result.user.mustChangePassword || false);
                } else {
                    await logout();
                }
            }
        } catch (error) {
            console.error('Error loading user:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (usernameOrEmail, password) => {
        const result = await authService.login(usernameOrEmail, password);
        
        if (result.success) {
            setUser(result.data.user);
            setMustChangePassword(result.data.mustChangePassword || false);
            toast.success(result.data.message || 'Login successful!');
            
            // Return the result so login page can handle routing
            return { 
                success: true, 
                mustChangePassword: result.data.mustChangePassword,
                user: result.data.user
            };
        }
        
        toast.error(result.message || 'Login failed');
        return { success: false, message: result.message };
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setMustChangePassword(false);
        toast.success('Logged out successfully');
        router.push('/');
    };

    const changePassword = async (currentPassword, newPassword) => {
        const result = await authService.changePassword(currentPassword, newPassword);
        
        if (result.success) {
            setMustChangePassword(false);
            const userData = authService.getUser();
            if (userData) {
                userData.mustChangePassword = false;
                setUser(userData);
            }
            toast.success(result.message || 'Password changed successfully!');
        } else {
            toast.error(result.message || 'Failed to change password');
        }
        
        return result;
    };

    const value = {
        user,
        loading,
        mustChangePassword,
        login,
        logout,
        changePassword,
        isAuthenticated: authService.isAuthenticated(),
        hasRole: (role) => authService.hasRole(role),
        hasAnyRole: (roles) => authService.hasAnyRole(roles),
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};