import React, { useState, useEffect } from "react";
import { getBaseUrl } from "../global";
import axios from "axios";

const ImportHistoryModal = ({ isOpen, onClose }) => {
  const [data, setData] = useState([]);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  };

  const downloadFile = (filename) => {
    axios
      .get(getBaseUrl() + `/import/download/${filename}`, {
        responseType: "blob",
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  useEffect(() => {
    axios
      .get(getBaseUrl() + "/import/history", config)
      .then((response) => {
        console.log(response);
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [data]);

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
                  Status
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Rows Added
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  Imported By
                </th>
                <th className="px-2 py-1 text-left text-sm font-medium text-gray-700">
                  File
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item) => (
                <tr
                  key={item.id}
                  className={`hover:bg-gray-100 cursor-pointer transition-colors duration-200`}
                  onClick={() => downloadFile(item.minioFilename)}
                >
                  <td className="px-2 py-1 text-sm text-gray-600">{item.id}</td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.status}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.rowsAdded}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.user.username}
                  </td>
                  <td className="px-2 py-1 text-sm text-gray-600">
                    {item.minioFilename}
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

export default ImportHistoryModal;
