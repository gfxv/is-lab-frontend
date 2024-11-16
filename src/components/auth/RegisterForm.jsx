import React, { useState } from "react";

import axios from "axios";
import { getBaseUrl } from "../../global";

import { useNavigate, Link } from "react-router-dom";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeadedPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmitAuth = async (e) => {
    e.preventDefault();
    if (username === "" && password === "") {
      setError("Username and password can't be empty")
      return;
    }

    if (password !== repeatedPassword) {
      setError("Passwords are not the same")
      return;
    }

    try {
      const response = await axios.post(getBaseUrl() + "/auth/register", {
        username,
        password,
      });
      console.log("Register successful:", response.data);
      navigate("/login")
    } catch (err) {
      setError(
        "Register failed. " + err.message
      );
    }
  };

  return (
    <div className="w-full max-w-lg m-auto py-6 px-8 mt-20 bg-white rounded shadow-xl">
      <form onSubmit={handleSubmitAuth}>
        <div className="mb-6">
          <label htmlFor="name" className="block text-gray-800 font-bold">
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
            className="w-full border border-gray-300 py-2 pl-3 rounded-md mt-2 outline-none"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-800 font-bold">
            Password:
          </label>
          <input
            type="password"
            required
            name="password"
            id="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 py-2 pl-3 rounded-md mt-2 outline-none "
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-800 font-bold">
            Repeat password:
          </label>
          <input
            type="password"
            required
            name="r-password"
            id="r-password"
            placeholder="password"
            onChange={(e) => setRepeadedPassword(e.target.value)}
            className="w-full border border-gray-300 py-2 pl-3 rounded-md mt-2 outline-none "
          />
        </div>
        {error && <div className="mt-2 text-red-600">{error}</div>}
        <button className="cursor-pointer py-2 px-4 block mt-6 bg-blue-500 text-white font-bold w-full text-center rounded-md">
          Register
        </button>
        <div className="flex justify-end mt-4">
          <Link to="/login" className="text-gray-600 hover:underline">
            Already have an account? Login here.
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
