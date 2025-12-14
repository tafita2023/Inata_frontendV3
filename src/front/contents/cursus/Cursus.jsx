import React from 'react';
import CursusImg from '../../../images/cursus.png';

function Cursus() {
  return (
    <div className="bg-gray-100 flex flex-col items-center p-4">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Cursus de Formation
      </h2>
      {/* Image responsive et assez grande */}
      <img
        src={CursusImg}
        alt="Cursus"
        className="w-full max-w-4xl h-auto object-contain"
      />
    </div>
  );
}

export default Cursus;
