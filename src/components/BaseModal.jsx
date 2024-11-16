import React, { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const BaseModal = ({ isOpen, onClose, message }) => {

  if (!isOpen) return null; // If the modal isn't open, render nothing

  const handleModalClick = (e) => {
    e.stopPropagation(); // Prevent closing on clicking inside the modal
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-96"
        onClick={handleModalClick}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Status</h3>
          <button
            className="text-xl text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="text-lg">
          <p>{message}</p>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BaseModal;
