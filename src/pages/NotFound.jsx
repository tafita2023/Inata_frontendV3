import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <style>{`
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .bounce {
          display: inline-block;
          animation-name: bounce;
          animation-duration: 1s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-1 {
          animation-delay: 0.2s;
        }
        .delay-2 {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="text-center">
        <h1 className="text-8xl font-bold text-blue-600">
          <span className="bounce delay-0">4</span>
          <span className="bounce delay-1">0</span>
          <span className="bounce delay-2">4</span>
        </h1>

        <p className="mt-4 text-xl text-gray-700"><span className="text-2xl font-bold">Oups !</span> Page non trouvée.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retour
        </button>
      </div>
    </div>
  );
};

export default NotFound;
