import React from 'react';

function Professeur() {

  return (
<div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
  <div className="px-5 pt-5">
    <h2 className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2">
      Nombre de professeur
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
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.7141 15h4.268c.4043 0 .732-.3838.732-.8571V3.85714c0-.47338-.3277-.85714-.732-.85714H6.71411c-.55228 0-1 .44772-1 1v4m10.99999 7v-3h3v3h-3Zm-3 6H6.71411c-.55228 0-1-.4477-1-1 0-1.6569 1.34315-3 3-3h2.99999c1.6569 0 3 1.3431 3 3 0 .5523-.4477 1-1 1Zm-1-9.5c0 1.3807-1.1193 2.5-2.5 2.5s-2.49999-1.1193-2.49999-2.5S8.8334 9 10.2141 9s2.5 1.1193 2.5 2.5Z"/>
  </svg>
  </div>

  {/* Nombre de prof */}
  <div className="flex flex-col items-center justify-center flex-1 py-6">
    <div className="text-5xl font-bold text-gray-900 dark:text-white">
      10
    </div>
  </div>
</div>
  );
}

export default Professeur;
