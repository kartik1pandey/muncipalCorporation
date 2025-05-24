import { useUser } from '@clerk/clerk-react';
import { hasPermission, getRoleName } from '../config/roles';

export const useAuth = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  const getUserRole = () => {
    if (!isSignedIn || !user) return null;
    // Get role from user's public metadata
    return user.publicMetadata.role || null;
  };

  const can = (resource, action) => {
    const role = getUserRole();
    return hasPermission(role, resource, action);
  };

  const getRoleDisplayName = () => {
    const role = getUserRole();
    return getRoleName(role);
  };

  return {
    isLoaded,
    isSignedIn,
    user,
    getUserRole,
    can,
    getRoleDisplayName
  };
}; 