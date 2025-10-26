import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  restricted?: boolean; // If true, authenticated users will be redirected
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard',
  restricted = false 
}) => {
  // If route is restricted and user is authenticated, redirect to dashboard
  if (restricted && isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }
  
  return <>{children}</>;
};

export default PublicRoute;