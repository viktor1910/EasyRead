import { useCallback } from "react";

// Mock permission system - for development purposes
// In a real app, this would connect to actual authentication/authorization context

/**
 * Mock user profile with permissions
 */
const mockProfile = {
  id: 1,
  email: "user@example.com",
  name: "Test User",
  permissions: [
    { module: 'user', feature: 'view' },
    { module: 'user', feature: 'edit' },
    { module: 'payment', feature: 'access' },
    { module: 'order', feature: 'create' },
    { module: 'admin' } // Admin has access to everything
  ]
};

const matchPermission = (profilePerm, checkPerm) => {
  if (checkPerm.module && profilePerm.module !== checkPerm.module) return false;
  if (checkPerm.feature && profilePerm.feature !== checkPerm.feature)
    return false;
  if (checkPerm.function && profilePerm.function !== checkPerm.function)
    return false;
  return true;
};

const usePermission = () => {
  // Using mock profile for now - replace with real context when available
  const profile = mockProfile;

  const checkPermission = useCallback(
    (permissionArray = []) => {
      // For development - allow all access if no specific permissions required
      if (!Array.isArray(permissionArray) || permissionArray.length === 0) {
        return true;
      }

      if (!profile?.permissions) {
        return true; // Allow access for development
      }

      return permissionArray.some((checkPerm) =>
        profile.permissions.some((profilePerm) =>
          matchPermission(profilePerm, checkPerm)
        )
      );
    },
    [profile]
  );

  return { checkPermission, profile };
};

export default usePermission;
