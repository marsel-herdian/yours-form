import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import type { RootState } from '../app/store';

export default function ProtectedRoute() {
  // Check if user is logged in
  const user = useSelector((state: RootState) => state.auth.user);

  // redirect to login page if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
