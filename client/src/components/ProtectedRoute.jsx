import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useSession();
  console.log("The loggedin user is ", isLoggedIn);
  // if (loading) {
  //   return <div>Loading ...</div>;
  // }
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
