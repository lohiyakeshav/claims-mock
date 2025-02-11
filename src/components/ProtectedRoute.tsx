import { isAuthenticated } from '@/utils/auth'; // Assuming you have an isAuthenticated utility
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuth = isAuthenticated();
  console.log("User is authenticated:", isAuth); // Debug log

  // Allow access to the homepage even if not authenticated
  if (!isAuth && window.location.pathname === '/') {
    return children;
  }

  // Redirect to login for other protected routes
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 