import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import api from "../api";
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/login",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );
      localStorage.setItem("token", response.data.access_token);
      navigate("/status");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Error logging in. Please check your username and password.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/sky-bg.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 max-w-md w-full space-y-8 bg-gray-100 bg-opacity-80 p-10 rounded-xl shadow-xl">
        <div>
          <div className="flex justify-center">
            <FaPlane className="h-12 w-12 text-indigo-600" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
            Sign in to Interglobe Aviation
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="runway-button group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="icon-container">
                <FaPlane className="h-5 w-5 text-white" />
              </span>
              <span className="button-text">Sign In</span>
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-3 text-center text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-2">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
