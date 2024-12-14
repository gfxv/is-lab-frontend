import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faCheck } from "@fortawesome/free-solid-svg-icons";

import { useGlobalState } from "../../providers/GlobalStateContext";

import axios from "axios";
import { getBaseUrl } from "../../global";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const { token } = useGlobalState();
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const handleAccept = (request) => {
    axios
      .post(getBaseUrl() + "/admin/accept", request, config)
      .then((response) => {
        updateRequestStatus(request.id)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDeny = (request) => {
    axios
      .post(getBaseUrl() + "/admin/deny", request, config)
      .then((response) => {
        updateRequestStatus(request.id)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const updateRequestStatus = (id) => {
    setTimeout(() => {
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== id)
      );
    }, 300);
  };

  useEffect(() => {
    axios
      .get(getBaseUrl() + "/admin/pending", config)
      .then((response) => {
        setRequests(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  return (
    <div>
      <table className="w-2/4 m-auto overflow-x-auto mt-1 bg-white border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
            <th className="px-2 py-1 text-left">ID</th>
            <th className="w-2/4 px-2 py-1 text-left">User</th>
            <th className="w-1/5 px-2 py-1 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className={`transition ${
                request.status === "accepted"
                  ? "bg-green-100"
                  : request.status === "denied"
                  ? "bg-red-100"
                  : ""
              }`}
            >
              <td className="px-2 py-2">{request.id}</td>
              <td className="px-2 py-2 text-left">{request.user.username}</td>
              <td className="px-2 py-2 text-center">
                <button
                  onClick={() => handleAccept(request)}
                  className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  <FontAwesomeIcon icon={faCheck} className="px-1" />
                </button>
                <button
                  onClick={() => handleDeny(request)}
                  className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faX} className="px-1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
