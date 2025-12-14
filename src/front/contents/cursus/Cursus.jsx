import React from 'react';

const Cursus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
            Bacheliers Scientifiques et Techniques
          </h1>
          <p className="text-gray-600">Diagramme des parcours académiques et professionnels</p>
        </header>

        {/* Diagramme principal - version desktop */}
        <div className="hidden lg:block">
          <DesktopDiagram />
        </div>

        {/* Diagramme principal - version mobile */}
        <div className="block lg:hidden">
          <MobileDiagram />
        </div>

        <div className="mt-12 p-6 bg-white rounded-xl shadow-md max-w-2xl mx-auto">
          <h2 className="text-xl font-bold text-blue-800 mb-4">Légende des parcours</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <span className="font-medium">Parcours MDW</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">Parcours DA</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
              <span className="font-medium">Parcours RSI</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour la version desktop
const DesktopDiagram = () => {
  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-8">
      {/* Ligne horizontale centrale */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
      
      {/* TRONC COMMUN */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 shadow-sm">
          <h3 className="font-bold text-blue-800 text-lg mb-2">TRONC COMMUN</h3>
          <div className="space-y-2">
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-700">L1 : 51 - 52</p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-700">L2 : 53 - 54</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vie Active (après L2) */}
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
        <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-200 shadow-sm text-center w-48">
          <h3 className="font-bold text-rose-800 text-lg mb-1">Vie Active</h3>
          <p className="text-rose-700">Technicien Supérieur Informatique</p>
        </div>
      </div>

      {/* Parcours MDW */}
      <div className="absolute left-1/3 top-1/4 transform -translate-x-1/2">
        <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200 shadow-sm text-center w-56">
          <h3 className="font-bold text-purple-800 text-lg mb-1">Parcours MDW</h3>
          <p className="text-purple-700">Multimédia et Développement Web</p>
        </div>
      </div>

      {/* Parcours DA */}
      <div className="absolute left-1/2 top-1/4 transform -translate-x-1/2">
        <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 shadow-sm text-center w-56">
          <h3 className="font-bold text-green-800 text-lg mb-1">Parcours DA</h3>
          <p className="text-green-700">Développement d'Applications</p>
        </div>
      </div>

      {/* Parcours RSI */}
      <div className="absolute left-2/3 top-1/4 transform -translate-x-1/2">
        <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200 shadow-sm text-center w-56">
          <h3 className="font-bold text-amber-800 text-lg mb-1">Parcours RSI</h3>
          <p className="text-amber-700">Réseaux et Systèmes Informatiques</p>
        </div>
      </div>

      {/* L3 */}
      <div className="absolute left-1/2 top-3/4 transform -translate-x-1/2">
        <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 shadow-sm text-center w-48">
          <h3 className="font-bold text-indigo-800 text-lg mb-1">L3</h3>
          <p className="text-indigo-700">S5 - S6</p>
        </div>
      </div>

      {/* Vie Active (après L3) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-200 shadow-sm text-center w-48">
          <h3 className="font-bold text-rose-800 text-lg mb-1">Vie Active</h3>
          <p className="text-rose-700">Master Informatique</p>
        </div>
      </div>

      {/* Flèches de connexion */}
      <div className="absolute left-1/4 top-1/2 w-1/4 h-0.5 bg-blue-300 transform -translate-y-1/2"></div>
      
      <div className="absolute left-1/3 top-1/4 w-0.5 h-1/4 bg-purple-300"></div>
      <div className="absolute left-1/2 top-1/4 w-0.5 h-1/4 bg-green-300"></div>
      <div className="absolute left-2/3 top-1/4 w-0.5 h-1/4 bg-amber-300"></div>
      
      <div className="absolute left-1/3 top-3/4 w-1/3 h-0.5 bg-indigo-300 transform -translate-y-1/2"></div>
      
      {/* Points de connexion */}
      <div className="absolute left-1/4 top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute left-1/3 top-1/4 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2"></div>
      <div className="absolute left-1/2 top-1/4 w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2"></div>
      <div className="absolute left-2/3 top-1/4 w-3 h-3 bg-amber-500 rounded-full transform -translate-x-1/2"></div>
      <div className="absolute left-1/2 top-3/4 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2"></div>
    </div>
  );
};

// Composant pour la version mobile
const MobileDiagram = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* TRONC COMMUN */}
      <div className="mb-8">
        <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-200 shadow-sm text-center">
          <h3 className="font-bold text-blue-800 text-lg mb-2">TRONC COMMUN</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-700">L1 : 51 - 52</p>
            </div>
            <div className="bg-white p-2 rounded border border-blue-100">
              <p className="font-medium text-blue-700">L2 : 53 - 54</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche vers le bas depuis TRONC COMMUN */}
      <div className="flex justify-center mb-6">
        <div className="w-0.5 h-8 bg-blue-300"></div>
      </div>

      {/* Vie Active (après L2) */}
      <div className="mb-8 flex justify-center">
        <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-200 shadow-sm text-center w-full max-w-xs">
          <h3 className="font-bold text-rose-800 text-lg mb-1">Vie Active</h3>
          <p className="text-rose-700">Technicien Supérieur Informatique</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis Vie Active */}
      <div className="flex justify-center mb-6">
        <div className="w-0.5 h-8 bg-rose-300"></div>
        <div className="absolute w-8 h-0.5 bg-rose-300 mt-8"></div>
      </div>

      {/* Parcours */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Parcours MDW */}
        <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-200 shadow-sm text-center">
          <h3 className="font-bold text-purple-800 text-lg mb-1">Parcours MDW</h3>
          <p className="text-purple-700">Multimédia et Développement Web</p>
        </div>

        {/* Parcours DA */}
        <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200 shadow-sm text-center">
          <h3 className="font-bold text-green-800 text-lg mb-1">Parcours DA</h3>
          <p className="text-green-700">Développement d'Applications</p>
        </div>

        {/* Parcours RSI */}
        <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200 shadow-sm text-center">
          <h3 className="font-bold text-amber-800 text-lg mb-1">Parcours RSI</h3>
          <p className="text-amber-700">Réseaux et Systèmes Informatiques</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis les parcours */}
      <div className="flex justify-center mb-6">
        <div className="w-0.5 h-8 bg-indigo-300"></div>
      </div>

      {/* L3 */}
      <div className="mb-8 flex justify-center">
        <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-200 shadow-sm text-center w-full max-w-xs">
          <h3 className="font-bold text-indigo-800 text-lg mb-1">L3</h3>
          <p className="text-indigo-700">S5 - S6</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis L3 */}
      <div className="flex justify-center mb-6">
        <div className="w-0.5 h-8 bg-indigo-300"></div>
      </div>

      {/* Vie Active (après L3) */}
      <div className="flex justify-center">
        <div className="bg-rose-50 p-4 rounded-xl border-2 border-rose-200 shadow-sm text-center w-full max-w-xs">
          <h3 className="font-bold text-rose-800 text-lg mb-1">Vie Active</h3>
          <p className="text-rose-700">Master Informatique</p>
        </div>
      </div>
    </div>
  );
};

export default Cursus;