import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { post } from "../services/ApiEndpoint";
import { Logout } from "../redux/AuthSlice";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast for notifications

export default function Home() {
  const user = useSelector((state) => state.Auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const gotoAdmin = () => {
    navigate("/admin");
  };

  const handleLogout = async () => {
    try {
      const request = await post("/api/auth/logout");
      const response = request.data;
      if (request.status === 200) {
        dispatch(Logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center py-8">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        {user ? (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Welcome, {user.name}
            </h2>
            <div className="space-y-4">
              <button
                className="w-full bg-red-500 text-white py-2 px-4 rounded-md text-lg hover:bg-red-600 transition duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
              {user.role === "admin" && (
                <button
                  className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg hover:bg-blue-600 transition duration-300"
                  onClick={gotoAdmin}
                >
                  Go To Admin
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Please log in to access your account.
            </h2>
            <button
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-lg hover:bg-blue-600 transition duration-300"
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
