import React from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '../../hooks/usePermissions';

const RoleGuard = ({ children, allowedRoles = [], requiredPermissions = [] }) => {
  const { userRole, hasPermission, isLoggedIn } = usePermissions();

  // Se não estiver logado, redirecionar para login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Verificar por roles permitidos
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Verificar por permissões específicas
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission => 
      hasPermission(permission)
    );
    
    if (!hasRequiredPermissions) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default RoleGuard;
