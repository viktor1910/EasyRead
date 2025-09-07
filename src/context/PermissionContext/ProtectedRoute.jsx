import React from "react";
import usePermission from "./usePermission";
import PropTypes from "prop-types";
import NoPermission from "../../pages/NoPermission";

/**
 * ProtectedRoute component to guard routes based on module permission.
 * @param {React.ReactNode} children - The component to render if permitted.
 * @param {string} module - The module name to check permission for.
 * @param {string} [redirectTo='/login'] - Path to redirect if not permitted.
 */
const ProtectedRoute = ({ children, module = [], redirectTo = "/login" }) => {
  const hasPermission = usePermission(module);

  if (!hasPermission) {
    return <NoPermission />;
  }

  return children;
};

export default ProtectedRoute;
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  module: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]).isRequired,
  redirectTo: PropTypes.string,
};
