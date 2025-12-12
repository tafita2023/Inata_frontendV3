import React from 'react';

const PopupMessage = ({ message }) => {
  return (
<div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
  <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center max-w-sm w-full">
    <p className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{message}</p>
    <svg
      className="mx-auto mb-4"
      width="80"
      height="80"
      viewBox="0 0 52 52"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="26"
        cy="26"
        r="25"
        fill="none"
        stroke="#f87171"
        strokeWidth="2"
      />
      <line
        x1="16"
        y1="16"
        x2="36"
        y2="36"
        stroke="#f87171"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.3s" fill="freeze" begin="0.2s" />
      </line>
      <line
        x1="36"
        y1="16"
        x2="16"
        y2="36"
        stroke="#f87171"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <animate attributeName="stroke-dashoffset" from="28" to="0" dur="0.3s" fill="freeze" begin="0.3s" />
      </line>
    </svg>
  </div>
</div>
  );
};

export default PopupMessage;
