import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";

const Auth = () => {
  const location = useLocation();
  const auth = useAuth();
  if (!auth.user) {
    return <Navigate to="/" state={{ path: location.pathname ,search: location?.search }} />;
  }
  return <Outlet />;
};
export default Auth;