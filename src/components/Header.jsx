import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignOutAlt,
  faCrown,
  faAnglesUp,
  faUsers,
  faTableList,
} from "@fortawesome/free-solid-svg-icons";

import { useGlobalState } from "../providers/GlobalStateContext";

import axios from "axios";
import { getBaseUrl } from "../global";

const Header = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isAdminRequestSent, setIsAdminRequestSent] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, token, isAdmin, checkIsAdmin } = useGlobalState();

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };
  const sendAdminRequest = () => {
    if (isAdminRequestSent) return;
    axios
      .post(getBaseUrl() + "/admin/new", {}, config)
      .then((response) => {
        setIsAdminRequestSent(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  useEffect(() => {
    checkIsAdmin();

    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <header className="flex justify-between items-center p-3 bg-black text-white">
      <div className="relative">
        <h1 className="text-xl font-bold">Lab #1</h1>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="focus:outline-none">
          {user}
          {isAdmin && <FontAwesomeIcon icon={faCrown} className="ml-2" />}
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-lg">
            <Link
              to="/dashboard"
              className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200"
            >
              <FontAwesomeIcon icon={faTableList} className="mr-2" />
              Dashboard
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200"
              >
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Admin Requests
              </Link>
            )}

            {/* TODO: later */}
            {!isAdmin && (
              <div
                onClick={sendAdminRequest}
                className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200 hover:cursor-pointer"
              >
                <FontAwesomeIcon icon={faAnglesUp} className="mr-2" />
                Request Admin Role
              </div>
            )}

            <div
              onClick={logout}
              className="flex items-center px-4 py-2 rounded-md hover:bg-gray-200 hover:cursor-pointer"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
              Logout
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
