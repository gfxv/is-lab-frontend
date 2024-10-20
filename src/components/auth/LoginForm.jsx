import React, { useState } from "react";

import axios from "axios";
import { getBaseUrl } from "../../global";
import { useNavigate, Link } from "react-router-dom";

import { useGlobalState } from '../../providers/GlobalStateContext';

const LoginForm = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useGlobalState();

  const navigate = useNavigate();

  const handleSubmitAuth = async (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      alert("Username and password can't be empty");
    }

    try {
      const response = await axios.post(getBaseUrl() + "/auth/login", {
        username,
        password,
      });
      const { token } = response.data;
      login(username, token);

      console.log("Login successful:", token);
      navigate("/dashboard")
    } catch (err) {
      setError("Login failed. Please check your username and password.");
      console.error("Error:", err.message);
    }
  };

  return (
    <div class="w-full max-w-lg m-auto py-6 px-8 h-80 mt-20 bg-white rounded shadow-xl">
      <form onSubmit={handleSubmitAuth}>
        <div class="mb-6">
          <label for="name" class="block text-gray-800 font-bold">
            Name:
          </label>
          <input
            type="text"
            required
            name="name"
            id="name"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid="false"
            class="w-full border border-gray-300 py-2 pl-3 rounded-md mt-2 outline-none"
          />
        </div>
        <div>
          <label for="password" class="block text-gray-800 font-bold">
            Password:
          </label>
          <input
            type="password"
            required
            name="password"
            id="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            class="w-full border border-gray-300 py-2 pl-3 rounded-md mt-2 outline-none "
          />
        </div>
        {error && <div class="mt-2 text-red-600">{error}</div>}
        <button class="cursor-pointer py-2 px-4 block mt-6 bg-blue-500 text-white font-bold w-full text-center rounded-md">
          Login
        </button>

        <div className="flex justify-end mt-4">
          <Link to="/register" className="text-gray-600 hover:underline">
            Don't have an account? Register here.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
