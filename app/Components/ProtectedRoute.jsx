// components/ProtectedRoute.jsx

'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, loading, hasAnyRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push('/login');
            } else if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
                router.push('/unauthorized');
            }
        }
    }, [loading, isAuthenticated, allowedRoles, router, hasAnyRole]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;