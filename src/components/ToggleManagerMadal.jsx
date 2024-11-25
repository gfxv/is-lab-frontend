import React from "react";

const ToggleManagerModal = ({ text, openModal }) => {
  return (
    <button
      onClick={openModal}
      className="rounded-md bg-orange-500 py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:shadow-none hover:bg-orange-600 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
    >
      {text}
    </button>
  );
};

export default ToggleManagerModal;
