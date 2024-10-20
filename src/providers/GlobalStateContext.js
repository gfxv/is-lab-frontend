import React, { createContext, useContext, useState } from "react";

import axios from "axios";
import { getBaseUrl } from "../global";

const GlobalStateContext = createContext();

const GlobalStateProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("username"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const login = (username, token) => {
    setUser(username);
    setToken(token);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("username");
    localStorage.removeItem("token");
  };


  const checkIsAdmin = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    };

    axios
      .get(getBaseUrl() + "/admin/is-admin", config)
      .then((response) => {
        setIsAdmin(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <GlobalStateContext.Provider
      value={{ user, token, isAdmin, checkIsAdmin, login, logout }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  return useContext(GlobalStateContext);
};

export { GlobalStateProvider, useGlobalState };
