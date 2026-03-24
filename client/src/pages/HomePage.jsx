import React from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { logOutUser } from "../service/authApi";

const HomePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useSession();
  const handleLogout = async () => {
    try {
      const { data } = await logOutUser();
      logout(data);
    } catch (error) {
      console.log("Error:  ", error.message);
    }
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto mt-10 ">
      <h2 className="text-xl font-semibold mb-4">
        Welcome, {user?.data?.username || "User"}!
      </h2>
      <p>You have Successfully logged in and verifyied your 2FA</p>
      <button
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
