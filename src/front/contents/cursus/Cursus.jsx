import React from 'react';

const Cursus = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
           Cursus universitaire
          </h1>
          <p className="text-gray-600"> Bacheliers Scientifiques et Techniques</p>
        </header>

        {/* Diagramme principal - version desktop */}
        <div className="hidden lg:block">
          <DesktopDiagram />
        </div>

        {/* Diagramme principal - version mobile */}
        <div className="block lg:hidden">
          <MobileDiagram />
        </div>

      </div>
    </div>
  );
};

// Composant pour la version desktop améliorée
// Composant pour la version desktop avec disposition verticale
const DesktopDiagram = () => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      {/* Ligne verticale centrale */}
      <div className="absolute left-1/2 top-20 bottom-20 w-0.5 bg-gradient-to-b from-blue-400 via-green-400 to-indigo-400 transform -translate-x-1/2"></div>
      
      {/* Conteneur principal avec grille */}
      <div className="relative">
        {/* Niveau 1: TRONC COMMUN */}
        <div className="flex justify-center mb-12">
          <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200 shadow-lg w-80 text-center">
            <h3 className="font-bold text-blue-800 text-xl mb-3">TRONC COMMUN</h3>
            <div className="grid grid-cols-2 gap-3">
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
        <div className="flex justify-center mb-12">
          <div className="w-1 h-16 bg-blue-400"></div>
          <div className="absolute w-4 h-4 border-b-2 border-r-2 border-blue-400 transform rotate-45 mt-14"></div>
        </div>

        {/* Niveau 2: Options après L2 */}
        <div className="flex justify-center mb-12">
          <div className="grid grid-cols-3 gap-8 w-full max-w-4xl mx-auto">
            {/* Vie Active (après L2) - Option directe */}
            <div className="bg-rose-50 p-5 rounded-xl border-2 border-rose-300 shadow-lg text-center relative">
              <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
              <p className="text-rose-700 font-medium">Technicien Supérieur Informatique</p>
              {/* Flèche horizontale vers la droite depuis cette option */}
              <div className="absolute right-0 top-1/2 w-8 h-0.5 bg-rose-400 transform translate-x-full -translate-y-1/2"></div>
              <div className="absolute right-0 top-1/2 w-2 h-2 border-t-2 border-r-2 border-rose-400 transform rotate-45 translate-x-full -translate-y-1/2"></div>
            </div>

            {/* Début des parcours (connecteur) */}
            <div className="relative flex items-center justify-center">
              <div className="text-center">
                <div className="text-gray-500 font-medium mb-2">Choix de parcours</div>
                <div className="w-6 h-6 bg-gray-400 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Espace vide pour l'alignement */}
            <div></div>
          </div>
        </div>

        {/* Flèche centrale unique vers le bas depuis le connecteur */}
        <div className="flex justify-center mb-12">
          <div className="w-1 h-16 bg-gray-400"></div>
          <div className="absolute w-4 h-4 border-b-2 border-r-2 border-gray-400 transform rotate-45 mt-14"></div>
        </div>

        {/* Niveau 3: Les trois parcours en ligne */}
        <div className="mb-12">
          <div className="grid grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
            {/* Parcours MDW - PAS de flèche en bas */}
            <div className="bg-purple-50 p-6 rounded-xl border-2 border-purple-300 shadow-lg text-center">
              <h3 className="font-bold text-purple-800 text-xl mb-2">Parcours MDW</h3>
              <p className="text-purple-700 font-medium">Multimédia et Développement Web</p>
            </div>

            {/* Parcours DA - SEULEMENT celui-ci a une flèche vers le bas */}
            <div className="bg-green-50 p-6 rounded-xl border-2 border-green-300 shadow-lg text-center relative">
              <h3 className="font-bold text-green-800 text-xl mb-2">Parcours DA</h3>
              <p className="text-green-700 font-medium">Développement d'Applications</p>
              {/* Flèche verticale vers le bas depuis DA */}
              <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-green-400 transform -translate-x-1/2 translate-y-full"></div>
            </div>

            {/* Parcours RSI - PAS de flèche en bas */}
            <div className="bg-amber-50 p-6 rounded-xl border-2 border-amber-300 shadow-lg text-center">
              <h3 className="font-bold text-amber-800 text-xl mb-2">Parcours RSI</h3>
              <p className="text-amber-700 font-medium">Réseaux et Systèmes Informatiques</p>
            </div>
          </div>
        </div>

        {/* Flèche unique vers le bas depuis DA */}
        <div className="flex justify-center mb-12">
          <div className="w-1 h-16 bg-green-400"></div>
          <div className="absolute w-4 h-4 border-b-2 border-r-2 border-indigo-400 transform rotate-45 mt-14"></div>
        </div>

        {/* Niveau 4: L3 */}
        <div className="flex justify-center mb-12">
          <div className="bg-indigo-50 p-6 rounded-xl border-2 border-indigo-300 shadow-lg text-center w-80">
            <h3 className="font-bold text-indigo-800 text-xl mb-2">L3</h3>
            <p className="text-indigo-700 font-bold text-xl">S5 - S6</p>
          </div>
        </div>

        {/* Flèche vers le bas depuis L3 */}
        <div className="flex justify-center mb-12">
          <div className="w-1 h-16 bg-indigo-400"></div>
          <div className="absolute w-4 h-4 border-b-2 border-r-2 border-indigo-400 transform rotate-45 mt-14"></div>
        </div>

        {/* Niveau 5: Vie Active finale */}
        <div className="flex justify-center">
          <div className="bg-rose-50 p-6 rounded-xl border-2 border-rose-300 shadow-lg text-center w-80">
            <h3 className="font-bold text-rose-800 text-xl mb-2">Vie Active</h3>
            <p className="text-rose-700 font-medium text-xl">Master Informatique</p>
          </div>
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
              <p className="font-bold text-blue-700 text-lg">L1 : S1 - S2</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm">
              <p className="font-bold text-blue-700 text-lg">L2 : S3 - S4</p>
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