import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../app/providers/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Rediriger vers la page de connexion en sauvegardant la page demandée
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
