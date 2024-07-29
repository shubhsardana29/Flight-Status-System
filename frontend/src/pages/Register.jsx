import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import api from "../api";
import '../styles/Login.css'; 

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/register", {
        username,
        email,
        password,
      });
      setSuccess(response.data.message);
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error registering:", error);
      setError("Registration failed. Please try again.");
      setSuccess("");
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
            Join Interglobe Aviation
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Begin your journey with us
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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
              <span className="button-text">Register</span>
            </button>
          </div>
        </form>
        {error && (
          <div className="mt-3 text-center text-sm text-red-600 bg-red-100 border border-red-400 rounded-md p-2">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-3 text-center text-sm text-green-600 bg-green-100 border border-green-400 rounded-md p-2">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;