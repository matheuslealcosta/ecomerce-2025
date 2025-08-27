import { useAuthStore } from '../store/authStore';
import { RoleMatrix } from '../utils/permissions';

export const usePermissions = () => {
  const { user } = useAuthStore();

  const hasPermission = (permission) => {
    if (!user || !user.role) return false;
    
    const rolePermissions = RoleMatrix[user.role] || [];
    return rolePermissions.includes(permission);
  };

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions) => {
    return permissions.every(permission => hasPermission(permission));
  };

  const canAccess = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      comprador: 1,
      vendedor: 2,
      gestor: 3,
      superadmin: 4,
    };

    const userLevel = roleHierarchy[user.role] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    userRole: user?.role,
    isLoggedIn: !!user,
  };
};
