import axios from "axios";

const instance = axios.create({
  baseURL: "https://role-base-backend.onrender.com", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // this is for handling cookies like JWT
});

// Request Interceptor
instance.interceptors.request.use(
  (config) => {
    // Add any common request modifications here (e.g., adding Authorization header)
    // Example: if you need to set Authorization token from localStorage or Redux:
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers['Authorization'] = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    // Handle request error
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor
instance.interceptors.response.use(
  (response) => {
    // You can handle success response here globally
    // For example, check for authentication token expiry or manipulate the response data if needed.
    console.log("Intercepted Response:", response);
    return response;
  },
  (error) => {
    // Handle error response
    if (error.response) {
      // Server responded with a non-2xx status code
      console.error("Response error:", error.response);
      // Example: If token expired, log out the user
      if (error.response.status === 401) {
        // You can dispatch a logout action or redirect to login page
        console.log("Unauthorized - Logging out");
        // Redirect to login page or dispatch a logout action
      }
      // Handle other types of errors globally (e.g., 500, 404, etc.)
      // Display an appropriate message for different HTTP status codes
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // No response was received (network issues, server downtime)
      console.error("No response received:", error.request);
      return Promise.reject("Network error, please try again.");
    } else {
      // Other errors (error in setting up the request)
      console.error("Error:", error.message);
      return Promise.reject(error.message);
    }
  }
);

export const get = (url, params) => instance.get(url, { params });
export const post = (url, data) => instance.post(url, data);
export const put = (url, data) => instance.put(url, data);
export const deleteUser = (url) => instance.delete(url);
