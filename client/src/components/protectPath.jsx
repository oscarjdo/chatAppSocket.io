import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

function protectPath() {
  const userState = useSelector((state) => state.userState);

  if (!userState.id) {
    return <Navigate to={"/login"} replace />;
  }

  return <Outlet />;
}

export default protectPath;
