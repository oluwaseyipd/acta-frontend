import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, clearAuthSession } from '@/lib/auth';

const ProtectedRoute = () => {
  const isAuth = isAuthenticated();

  // If session is expired or no valid tokens exist, redirect immediately to login
  if (!isAuth) {
    clearAuthSession();
    return <Navigate to="/auth/signin" replace />;
  }

  // If token exists and is valid, render the child component (the Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;

