import React from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const ProtectedRoute = (props) => {
  const auth = useSelector((state) => state.auth);

  console.log("auth");
  console.log(auth);
  if (auth.account) {
    if (props && props["teacher"]) {
      if (auth.account.is_staff) {
        return <Outlet {...props} />;
      } else {
        return <Navigate to={"/"} />;
      } 

    } else if (props && props["admin"]) {
      if (auth.account.is_superuser) {
        return <Outlet {...props} />;
      } else {
        return <Navigate to={"/"} />;
      } 
    }


    return <Outlet {...props} />;
  } else if (!auth.account) {
    return <Navigate to={"/Homepage"} />;
  } else {
    return <div>Not found</div>;
  }
};

export default ProtectedRoute;