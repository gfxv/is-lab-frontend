import React, { useState } from "react";
import { getBaseUrl } from "../global";
import axios from "axios";

const ImportModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "multipart/form-data",
    },
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('file', file);

    axios
      .post(getBaseUrl() + "/import", formData, config)
      .then((response) => {
        setUploadSuccess('File uploaded successfully!');
      })
      .catch((error) => {
        setError("Import Failed")
        console.log(error)
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  // Close the modal
  const closeModal = () => {
    onClose();
    setFile(null);
    setError(null);
    setUploadSuccess(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Import File</h2>
        <div className="flex justify-center mt-4">
          <div className="mt-4">
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full border-2 border-gray-300 p-2 rounded-lg mb-4"
            />

            {isUploading && (
              <div className="text-center text-blue-600">Uploading...</div>
            )}

            {uploadSuccess && (
              <div className="text-center text-green-600">{uploadSuccess}</div>
            )}

            {error && <div className="text-center text-red-600">{error}</div>}

            <div className="flex justify-center mt-4">
              <button
                onClick={() => {closeModal(); onClose()}}
                className="rounded-md bg-red-600 mr-2 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              >
                Close
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className={`px-6 py-2 rounded-lg text-white ${
                  isUploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } transition duration-200`}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
