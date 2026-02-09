import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated, user } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        // Redirect to login page, but save the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
