import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../global";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
} from "@fortawesome/free-solid-svg-icons";

const ChapterManagerModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);

  const proccessingMessage = "Proccessing...";
  const successMessage = "Object deleted successfully";
  const permissionDeniedMessage = "Permission Denied!";

  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSelection = (item) => {
    // onRowClick(item);
  };

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const handleDelete = (id) => {
    setModalMessage(proccessingMessage);
    setIsModalOpen(true);

    axios
      .delete(`${getBaseUrl()}/chapters/${id}`, config)
      .then((response) => {
        if (response.status === 200) {
          setModalMessage(successMessage);
          setData((prevData) => prevData.filter((item) => item.id !== id));
        } else {
          console.error("Failed to delete item");
        }
      })
      .catch((error) => {
        setModalMessage(error.response.data)
        console.error("Error occurred while deleting item:", error);
      });
  };

  useEffect(() => {
    axios
      .get(getBaseUrl() + "/chapters/my", config)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="max-h-72 overflow-y-auto border border-gray-300">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-300 sticky top-0 z-10">
              <tr>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  ID
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Name
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Parent Legion
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Marines Count
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  World
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-100 cursor-pointer transition-colors duration-200`}
                  onClick={() => handleSelection(item)}
                >
                  <td className="px-2 py-1 text-sm text-gray-600">{item.id}</td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.name}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.parentLegion}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.marinesCount}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.world}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
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
        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="rounded-md bg-green-600 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterManagerModal;
