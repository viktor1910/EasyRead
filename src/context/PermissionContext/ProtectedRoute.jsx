import React from "react";
import PropTypes from "prop-types";
import { useAuth } from "../AuthContext";
import NoPermission from "../../pages/NoPermission";

/**
 * ProtectedRoute component to guard routes based on user role.
 * @param {React.ReactNode} children - The component to render if permitted.
 * @param {string|string[]} requiredRole - Required role(s) to access the route.
 * @param {boolean} requireAuth - Whether authentication is required.
 */
const ProtectedRoute = ({
  children,
  requiredRole = null,
  requireAuth = true,
}) => {
  const { user, isAuthenticated, hasRole, hasAnyRole, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Check authentication if required
  if (requireAuth && !isAuthenticated()) {
    // Redirect to login page
    window.location.href = "/login";
    return null;
  }

  // Check role permissions if specified
  if (requiredRole) {
    let hasPermission = false;

    if (Array.isArray(requiredRole)) {
      hasPermission = hasAnyRole(requiredRole);
    } else {
      hasPermission = hasRole(requiredRole);
    }

    if (!hasPermission) {
      return <NoPermission />;
    }
  }

  return children;
};

export default ProtectedRoute;

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  requireAuth: PropTypes.bool,
};
