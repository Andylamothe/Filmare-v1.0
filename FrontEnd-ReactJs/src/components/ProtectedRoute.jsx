import { Navigate } from 'react-router-dom';

// Props pour rajouter n'importe quel routes que je veux protéger
const ProtectedRoute = ({ children, auth }) => {
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute; 