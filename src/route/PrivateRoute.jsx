import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, roles, currentUser, loading }) {
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - currentUser:', currentUser);
  console.log('PrivateRoute - roles required:', roles);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500 text-lg">Chargement...</p>
      </div>
    );
  }

  if (!currentUser) {
    console.log('Redirection vers /login - aucun utilisateur');
    return <Navigate to="/login" replace />;
  }

  const userRole = currentUser.role?.toLowerCase();
  console.log('Rôle utilisateur:', userRole);

  if (roles && !roles.map(r => r.toLowerCase()).includes(userRole)) {
    console.log('Redirection vers /not-found - rôle non autorisé');
    return <Navigate to="/not-found" replace />;
  }

  return children;
}