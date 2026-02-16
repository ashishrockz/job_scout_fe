import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export interface GuestGuardProps {
    children: React.ReactNode;
}

/**
 * GuestGuard - Redirects authenticated users away from auth pages
 * Used for login/signup pages to prevent logged-in users from accessing them
 */
export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element {
    const { isAuthenticated, loading } = useAuth();

    // Show loading state
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/copilot" replace />;
    }

    return <>{children}</>;
}
