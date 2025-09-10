import { useAuth } from "../context/AuthContext";

/**
 * Custom hook để kiểm tra role và authentication
 */
export const useRoleCheck = () => {
  const { user, hasRole, hasAnyRole, isAuthenticated } = useAuth();

  const isAdmin = () => hasRole("admin");
  const isUser = () => hasRole("user");
  const isGuest = () => hasRole("guest");

  const canAccessAdmin = () => isAdmin();
  const canAccessUserArea = () => isAuthenticated() && (isUser() || isAdmin());

  return {
    user,
    isAdmin,
    isUser,
    isGuest,
    canAccessAdmin,
    canAccessUserArea,
    isAuthenticated,
    hasRole,
    hasAnyRole,
  };
};
