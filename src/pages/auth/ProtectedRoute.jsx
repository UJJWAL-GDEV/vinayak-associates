import PropTypes from 'prop-types';
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, isAuthenticated, redirect }) {
  
  if (!isAuthenticated) {
     return <Navigate to={redirect} />;
  }
  return children;
}


ProtectedRoute.propTypes = {
  children: PropTypes.elementType.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  redirect: PropTypes.string,
};

export default ProtectedRoute;