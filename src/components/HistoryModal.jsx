import React from "react";

const HistoryModal = ({ isOpen, onClose, history }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">Modification History</h2>
        <ul>
          {history.map((entry, index) => (
            <li key={index} className="mb-2">
              <strong>{entry.editDate}</strong> - Modified by {entry.user.username}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="rounded-md bg-green-600 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default HistoryModal;
