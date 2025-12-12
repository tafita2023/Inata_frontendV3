import React from 'react';

const PopupMessage = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg text-center max-w-sm w-full">
        <p className="text-lg font-semibold mb-4">{message}</p>
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
            stroke="#4ade80"
            strokeWidth="2"
          />
          <path
            fill="none"
            stroke="#4ade80"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="48"
            strokeDashoffset="48"
            d="M14 27l7 7 16-16"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="48"
              to="0"
              dur="0.5s"
              fill="freeze"
              begin="0.2s"
            />
          </path>
        </svg>
      </div>
    </div>
  );
};

export default PopupMessage;
