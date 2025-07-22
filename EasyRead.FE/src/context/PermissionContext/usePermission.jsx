import { useContext, useCallback } from "react";
import { ProfileContext } from "../ProfileContext/ProfileContext";

// Example permission structure in profile:
// profile.permissions = [
//   { module: 'user', feature: 'edit', function: 'update' },
//   { module: 'user', feature: 'view' },
//   { module: 'admin' }
// ]

/**
 * permissionArray: [
 *   { module: 'user', feature: 'edit', function: 'update' },
 *   { module: 'admin' }
 * ]
 */

const matchPermission = (profilePerm, checkPerm) => {
  if (checkPerm.module && profilePerm.module !== checkPerm.module) return false;
  if (checkPerm.feature && profilePerm.feature !== checkPerm.feature)
    return false;
  if (checkPerm.function && profilePerm.function !== checkPerm.function)
    return false;
  return true;
};

const usePermission = () => {
  const { profile } = useContext(ProfileContext);

  const checkPermission = useCallback(
    (permissionArray = []) => {
      if (
        !profile?.permissions ||
        !Array.isArray(permissionArray) ||
        permissionArray.length === 0
      ) {
        return false;
      }
      return permissionArray.some((checkPerm) =>
        profile.permissions.some((profilePerm) =>
          matchPermission(profilePerm, checkPerm)
        )
      );
    },
    [profile]
  );

  return { checkPermission };
};

export default usePermission;
