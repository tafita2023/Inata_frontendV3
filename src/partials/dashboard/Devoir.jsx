import React from 'react';

function Devoir() {

  return (
<div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
  <div className="px-5 pt-5">
    <h2 className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-2">
      Nombre de devoir
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
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
  </svg>
  </div>


  {/* Nombre d'étudiant */}
  <div className="flex flex-col items-center justify-center flex-1 py-6">
    <div className="text-5xl font-bold text-gray-800 dark:text-white">
      4
    </div>
  </div>
</div>
  );
}

export default Devoir;
