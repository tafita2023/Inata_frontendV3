import React from 'react';

const Cursus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
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
              <span className="font-medium">Parcours MDW - Multimédia et Développement Web</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span className="font-medium">Parcours DA - Développement d'Applications</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-amber-500 rounded-full mr-2"></div>
              <span className="font-medium">Parcours RSI - Réseaux et Systèmes Informatiques</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant pour la version desktop améliorée
const DesktopDiagram = () => {
  return (
    <div className="relative bg-white rounded-2xl shadow-xl p-8 min-h-[600px]">
      {/* Ligne horizontale centrale principale */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2"></div>
      
      {/* TRONC COMMUN - Positionné à gauche */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg w-64">
          <h3 className="font-bold text-blue-800 text-xl mb-3">TRONC COMMUN</h3>
          <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-700 text-lg">L1 : 51 - 52</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-700 text-lg">L2 : 53 - 54</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche de TRONC COMMUN vers les parcours */}
      <div className="absolute left-72 top-1/2 w-32 h-0.5 bg-blue-400 transform -translate-y-1/2"></div>
      <div className="absolute left-72 top-1/2 w-4 h-4 border-t-2 border-r-2 border-blue-400 transform rotate-45 -translate-y-1/2 translate-x-32"></div>

      {/* Vie Active (après L2) - Positionné en haut */}
      <div className="absolute left-1/3 top-1/4 transform -translate-x-1/2">
        <div className="bg-rose-50 p-5 rounded-xl border-2 border-rose-300 shadow-lg text-center w-72">
          <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
          <p className="text-rose-700 font-medium">Technicien Supérieur Informatique</p>
        </div>
      </div>

      {/* Parcours MDW */}
      <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-purple-50 p-5 rounded-xl border-2 border-purple-300 shadow-lg text-center w-64">
          <h3 className="font-bold text-purple-800 text-xl mb-2">Parcours MDW</h3>
          <p className="text-purple-700 font-medium">Multimédia et Développement Web</p>
        </div>
      </div>

      {/* Parcours DA */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-green-50 p-5 rounded-xl border-2 border-green-300 shadow-lg text-center w-64">
          <h3 className="font-bold text-green-800 text-xl mb-2">Parcours DA</h3>
          <p className="text-green-700 font-medium">Développement d'Applications</p>
        </div>
      </div>

      {/* Parcours RSI */}
      <div className="absolute left-3/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-300 shadow-lg text-center w-64">
          <h3 className="font-bold text-amber-800 text-xl mb-2">Parcours RSI</h3>
          <p className="text-amber-700 font-medium">Réseaux et Systèmes Informatiques</p>
        </div>
      </div>

      {/* Flèches depuis les parcours vers L3 */}
      <div className="absolute left-1/4 top-1/2 w-0.5 h-20 bg-purple-400 transform translate-y-20"></div>
      <div className="absolute left-1/2 top-1/2 w-0.5 h-20 bg-green-400 transform translate-y-20"></div>
      <div className="absolute left-3/4 top-1/2 w-0.5 h-20 bg-amber-400 transform translate-y-20"></div>

      {/* L3 - Positionné en bas */}
      <div className="absolute left-1/2 bottom-1/4 transform -translate-x-1/2">
        <div className="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-300 shadow-lg text-center w-72">
          <h3 className="font-bold text-indigo-800 text-xl mb-2">L3</h3>
          <p className="text-indigo-700 font-bold text-lg">S5 - S6</p>
        </div>
      </div>

      {/* Flèche depuis L3 vers Vie Active finale */}
      <div className="absolute left-1/2 bottom-1/4 w-0.5 h-20 bg-indigo-400 transform -translate-y-20 -translate-x-1/2"></div>

      {/* Vie Active (après L3) - Positionné à droite */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <div className="bg-rose-50 p-6 rounded-xl border-2 border-rose-300 shadow-lg text-center w-72">
          <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
          <p className="text-rose-700 font-medium text-lg">Master Informatique</p>
        </div>
      </div>

      {/* Flèche de L3 vers Vie Active finale */}
      <div className="absolute left-1/2 bottom-1/4 w-64 h-0.5 bg-indigo-400 transform translate-y-10 translate-x-32"></div>
      <div className="absolute left-1/2 bottom-1/4 w-4 h-4 border-t-2 border-r-2 border-indigo-400 transform rotate-45 translate-y-10 translate-x-96"></div>

      {/* Points de connexion */}
      <div className="absolute left-1/4 top-1/2 w-3 h-3 bg-purple-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
      <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
      <div className="absolute left-3/4 top-1/2 w-3 h-3 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
      <div className="absolute left-1/2 bottom-1/4 w-3 h-3 bg-indigo-500 rounded-full transform -translate-x-1/2 shadow-lg"></div>

      {/* Légende des flèches */}
      <div className="absolute left-1/3 top-1/4 transform -translate-x-1/2 -translate-y-10">
        <div className="flex items-center text-sm text-gray-500">
          <div className="w-8 h-0.5 bg-rose-300 mr-2"></div>
          <span>Option après L2</span>
        </div>
      </div>
    </div>
  );
};

// Composant pour la version mobile (inchangé mais amélioré pour la cohérence)
const MobileDiagram = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      {/* TRONC COMMUN */}
      <div className="mb-8">
        <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg text-center">
          <h3 className="font-bold text-blue-800 text-xl mb-3">TRONC COMMUN</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-700 text-lg">L1 : 51 - 52</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-700 text-lg">L2 : 53 - 54</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flèche vers le bas depuis TRONC COMMUN */}
      <div className="flex justify-center mb-6">
        <div className="w-1 h-12 bg-blue-400"></div>
        <div className="absolute w-4 h-4 border-b-2 border-r-2 border-blue-400 transform rotate-45 mt-10"></div>
      </div>

      {/* Vie Active (après L2) */}
      <div className="mb-8 flex justify-center">
        <div className="bg-rose-50 p-5 rounded-xl border-2 border-rose-300 shadow-lg text-center w-full max-w-md">
          <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
          <p className="text-rose-700 font-medium">Technicien Supérieur Informatique</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis Vie Active */}
      <div className="flex justify-center mb-6">
        <div className="w-1 h-12 bg-rose-400"></div>
        <div className="absolute w-4 h-4 border-b-2 border-r-2 border-rose-400 transform rotate-45 mt-12"></div>
      </div>

      {/* Parcours */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* Parcours MDW */}
        <div className="bg-purple-50 p-5 rounded-xl border-2 border-purple-300 shadow-lg text-center">
          <h3 className="font-bold text-purple-800 text-xl mb-2">Parcours MDW</h3>
          <p className="text-purple-700 font-medium">Multimédia et Développement Web</p>
        </div>

        {/* Parcours DA */}
        <div className="bg-green-50 p-5 rounded-xl border-2 border-green-300 shadow-lg text-center">
          <h3 className="font-bold text-green-800 text-xl mb-2">Parcours DA</h3>
          <p className="text-green-700 font-medium">Développement d'Applications</p>
        </div>

        {/* Parcours RSI */}
        <div className="bg-amber-50 p-5 rounded-xl border-2 border-amber-300 shadow-lg text-center">
          <h3 className="font-bold text-amber-800 text-xl mb-2">Parcours RSI</h3>
          <p className="text-amber-700 font-medium">Réseaux et Systèmes Informatiques</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis les parcours */}
      <div className="flex justify-center mb-6">
        <div className="w-1 h-12 bg-indigo-400"></div>
        <div className="absolute w-4 h-4 border-b-2 border-r-2 border-indigo-400 transform rotate-45 mt-12"></div>
      </div>

      {/* L3 */}
      <div className="mb-8 flex justify-center">
        <div className="bg-indigo-50 p-5 rounded-xl border-2 border-indigo-300 shadow-lg text-center w-full max-w-md">
          <h3 className="font-bold text-indigo-800 text-xl mb-2">L3</h3>
          <p className="text-indigo-700 font-bold text-lg">S5 - S6</p>
        </div>
      </div>

      {/* Flèche vers le bas depuis L3 */}
      <div className="flex justify-center mb-6">
        <div className="w-1 h-12 bg-indigo-400"></div>
        <div className="absolute w-4 h-4 border-b-2 border-r-2 border-indigo-400 transform rotate-45 mt-12"></div>
      </div>

      {/* Vie Active (après L3) */}
      <div className="flex justify-center">
        <div className="bg-rose-50 p-5 rounded-xl border-2 border-rose-300 shadow-lg text-center w-full max-w-md">
          <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
          <p className="text-rose-700 font-medium text-lg">Master Informatique</p>
        </div>
      </div>
    </div>
  );
};

export default Cursus;