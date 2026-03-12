import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('access_token');

  // If no token exists, redirect to login (use absolute path)
  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  // If token exists, render the child component (the Dashboard)
  return <Outlet />;
};

export default ProtectedRoute;
