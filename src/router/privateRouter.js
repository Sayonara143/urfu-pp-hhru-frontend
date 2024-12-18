import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { sync } from '../store/asyncAction/auth'

export const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useSelector(state => state.auth);
  let location = useLocation();

  if (loading) {
    return <p>Checking authenticaton..</p>;
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children
}
