import { Outlet } from "react-router-dom";
import { validateToken } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useEffect } from "react";
import { logOut } from "../../redux/features/authSlice";

const Private = () => {
  const userdata = useSelector((state: RootState) => state.auth.user);
  const token = localStorage.getItem('token');
  const isAuthenticated =token && userdata && validateToken(token);
  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(!isAuthenticated){
      dispatch(logOut())
    }
  },[isAuthenticated])
  return isAuthenticated && <Outlet />
};

export default Private;
