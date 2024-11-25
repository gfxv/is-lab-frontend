import React from "react";

const ToggleManagerModal = ({ text, openModal, color, hoverColor }) => {
  return (
    <button
      onClick={openModal}
      className={`rounded-md ${color} py-2 px-3 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:shadow-none hover:${hoverColor} active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none`}
    >
      {text}
    </button>
  );
};

export default ToggleManagerModal;
