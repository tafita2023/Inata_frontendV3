import React from 'react';

function Matieres() {

  return (
<div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
  <div className="px-5 pt-5">
    <h2 className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2">
      Nombre de matières
    </h2>
  </div>

  {/* Icône */}
  <div className="flex items-center justify-center py-4">
    <svg
      className="w-12 h-12 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"/>
  </svg>
  </div>

  {/* Nombre d'étudiant */}
  <div className="flex flex-col items-center justify-center flex-1 py-6">
    <div className="text-5xl font-bold text-gray-800 dark:text-white">
      12
    </div>
  </div>
</div>
  );
}

export default Matieres;
