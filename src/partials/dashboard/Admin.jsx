import React from 'react';

function Admin() {

  return (
<div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
  <div className="px-5 pt-5">
    <h2 className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2">
      Nombre d'admin
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
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 20v-9l-4 1.125V20h4Zm0 0h8m-8 0V6.66667M16 20v-9l4 1.125V20h-4Zm0 0V6.66667M18 8l-6-4-6 4m5 1h2m-2 3h2"/>
  </svg>
  </div>

  {/* Nombre d'admin */}
  <div className="flex flex-col items-center justify-center flex-1 py-6">
    <div className="text-5xl font-bold text-gray-900 dark:text-white">
      3
    </div>
  </div>
</div>
  );
}

export default Admin;
