import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaTrashAlt,
  FaUserShield,
  FaPowerOff,
  FaPlus,
  FaSignOutAlt,
} from "react-icons/fa"; // Import icons
import { deleteUser, get, post, put } from "../services/ApiEndpoint"; // Import post for adding users
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // For navigation

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false); // State for modal visibility
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate();

  // Fetch users
  useEffect(() => {
    const GetUsers = async () => {
      try {
        const request = await get("/api/admin/getuser");
        const response = request.data;
        if (request.status === 200) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users.");
      }
    };
    GetUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    try {
      const request = await deleteUser(`/api/admin/delet/${id}`);
      const response = request.data;
      if (request.status === 200) {
        toast.success(response.message);
        setUsers(users.filter((user) => user._id !== id));
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("You cannot delete an admin.");
      }
    }
  };

  // Change role
  const handleRoleChange = async (id, currentRole) => {
    try {
      if (currentRole !== "admin") {
        const request = await put(`/api/admin/changeRole/${id}`, {
          role: "admin",
        });
        const response = request.data;
        if (request.status === 200) {
          toast.success(response.message);
          setUsers(
            users.map((user) =>
              user._id === id ? { ...user, role: "admin" } : user
            )
          );
        }
      } else {
        toast.error("Cannot promote yourself to admin.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Admin can't change another admin role.");
    }
  };

  // Change status
  const handleStatusChange = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      const request = await put(`/api/admin/changeStatus/${id}`, {
        status: newStatus,
      });
      const response = request.data;

      if (request.status === 200) {
        toast.success(response.message);
        setUsers(
          users.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error changing status.");
    }
  };

  // Add user
  const handleAddUser = async () => {
    try {
      const request = await post("/api/admin/addUser", newUser); // Endpoint for adding user
      const response = request.data;
      if (request.status === 200) {
        toast.success("User added successfully!");
        setUsers([...users, response.user]); // Add new user to the list
        setShowAddUser(false); // Close the modal
        setNewUser({ name: "", email: "", password: "", role: "user" }); // Reset the form
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to add user.");
    }
  };

  // Logout
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-semibold text-gray-800">Manage Users</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-red-600 text-sm"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
          <button
            onClick={() => setShowAddUser(true)}
            className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center hover:bg-green-600 text-sm"
          >
            <FaPlus className="mr-2" /> Add User
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300 ease-in-out transform hover:scale-105"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-700">
                  {user.name}
                </h3>
                <span
                  className={`text-sm py-1 px-3 rounded-full ${
                    user.status === "active"
                      ? "bg-green-200 text-green-600"
                      : "bg-red-200 text-red-600"
                  }`}
                >
                  {user.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">{user.email}</p>

              <div className="flex justify-between items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-blue-200 text-blue-600"
                        : "bg-yellow-200 text-yellow-600"
                    }`}
                  >
                    {user.role}
                  </span>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleRoleChange(user._id, user.role)}
                      className="bg-blue-500 text-white py-1 px-3 rounded-md text-xs hover:bg-blue-600 flex items-center"
                    >
                      <FaUserShield className="mr-1" /> Promote
                    </button>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => handleStatusChange(user._id, user.status)}
                    className="bg-yellow-500 text-white py-1 px-4 rounded-md text-xs hover:bg-yellow-600 flex items-center"
                  >
                    <FaPowerOff className="mr-1" /> Toggle Status
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-md text-xs hover:bg-red-600 flex items-center"
                  >
                    <FaTrashAlt className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-6 text-gray-500">
            No users found
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Add New User
            </h3>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="Name"
              className="w-full border p-2 rounded-md mb-4"
            />
            <input
              type="email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              placeholder="Email"
              className="w-full border p-2 rounded-md mb-4"
            />
            <input
              type="password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              placeholder="Password"
              className="w-full border p-2 rounded-md mb-4"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddUser(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
