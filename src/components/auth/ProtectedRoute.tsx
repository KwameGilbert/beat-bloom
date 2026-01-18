/**
 * Protected Route Component
 * 
 * Wraps routes that require authentication
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'producer' | 'artist' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // Not authenticated - redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check if required
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    // Admins can access all routes
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

/**
 * Guest Route Component
 * 
 * Redirects authenticated users away from auth pages
 */
interface GuestRouteProps {
  children: React.ReactNode;
}

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  // Already authenticated - redirect to home or intended destination
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/home';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
