import React from 'react';
import Flow from '../../images/cursus.png';

function Cursus() {
  return (
    <div className="bg-gray-100 flex flex-col items-center p-2">
      <h2 className="text-3xl font-bold text-center text-gray-800 mt-2 mb-2">
        Cursus de Formation
      </h2>
      <img
        src={Flow}
        alt="Cursus"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}

export default Cursus;
