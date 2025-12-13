import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
import Photo from '../../images/user-36-06.jpg';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Bulletin() {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterClasse, setFilterClasse] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const [downloadModal, setDownloadModal] = useState(false);
  const [downloadClasse, setDownloadClasse] = useState('');
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/utilisateurs/');
        const etudiants = response.data.filter(user => user.role === 'etud');
        const etudiantsAvecMoyenne = etudiants.map(user => {
          let moyenne = 0;
          if (user.notes && user.notes.length > 0) {
            const somme = user.notes.reduce((acc, note) => acc + note.note, 0);
            moyenne = (somme / user.notes.length).toFixed(2);
          }
          return { ...user, moyenne };
        });
        setUsers(etudiantsAvecMoyenne);
      } catch (error) {
        console.error('Erreur lors du chargement des étudiants', error);
        setErrorMessage('Erreur lors du chargement des étudiants');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/classes/');
        setClasses(response.data);
      } catch (error) {
        console.error("Erreur récupération classes:", error);
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    if (errorMessage) {
    const timer = setTimeout(() => {
        setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timer);
    }
    }, [errorMessage]);

useEffect(() => {
    if (successMessage) {
    const timer = setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
    return () => clearTimeout(timer);
    }
}, [successMessage]);

const telechargerBulletins = async () => {
  if (!downloadClasse) {
    setErrorMessage("Veuillez choisir une classe.");
    return;
  }
  try {
    const response = await AxiosInstance.get(
      `/api/admin/bulletins/download/class/${downloadClasse}/`,
      { 
        responseType: 'blob' 
      });

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `bulletins_${downloadClasse}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setSuccessMessage("Téléchargement réussi !");
    setDownloadModal(false);
  } catch (error) {
    console.error(error);
    setErrorMessage("Erreur lors du téléchargement.");
  }
};  
  // Fonction pour télécharger le bulletin d'un étudiant spécifique
const telechargerBulletinIndividuel = async (etudiantId, etudiantNom, etudiantPrenom) => {
  try {
    const response = await AxiosInstance.get(
      `/api/admin/bulletins/download/${etudiantId}/`,
      { 
        responseType: 'blob' 
      }
    );

    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `bulletin_${etudiantNom}_${etudiantPrenom}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    setSuccessMessage(`Bulletin de ${etudiantNom} ${etudiantPrenom} téléchargé !`);
  } catch (error) {
    console.error('Erreur téléchargement bulletin:', error);
    setErrorMessage('Erreur lors du téléchargement du bulletin');
  }
};

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
                Relevé de note des étudiants
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={() => setDownloadModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Télécharger
                </button>
            </div>
            </div>

            {/* Filtre et recherche */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Filtre par classe :</p>
                <select
                  value={filterClasse}
                  onChange={(e) => setFilterClasse(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-36"
                >
                  <option value="">Toutes</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.niveau}>{c.niveau}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Recherche :</label>
                <div className="relative flex-1 max-w-xs">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nom ou prénom"
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm pl-10 pr-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                  <svg
                    className="w-5 h-5 text-gray-400 dark:text-gray-300 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeWidth="2" d="M21 21l-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Tableau étudiants */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-2">Id</th>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Prénom</th>
                        <th className="p-2">Classe</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {users
                        .filter(user => !filterClasse || user.classe === filterClasse)
                        .filter(user =>
                          !searchTerm ||
                          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map((user, index) => (
                          <tr key={user.id}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{user.nom}</td>
                            <td className="p-2">{user.prenom}</td>
                            <td className="p-2">{user.classe}</td>
                            <td className="p-2">
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setViewModal(true);
                                }}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-700 p-2 mt-2 transition-colors duration-200"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-6 h-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                    <path stroke="currentColor" stroke-width="2" d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"/>
                                    <path stroke="currentColor" stroke-width="2" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                </svg>
                              </button>

                              <button
                                onClick={() => telechargerBulletinIndividuel(user.id, user.nom, user.prenom)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-700 p-2 mt-2 transition-colors duration-200"
                                >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01"/>
                                </svg>
                              </button>

                            </td>
                          </tr>
                        ))}
                      {users
                        .filter(user => !filterClasse || user.classe === filterClasse)
                        .filter(user =>
                          !searchTerm ||
                          user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.prenom.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500 dark:text-gray-400">
                              Aucun étudiant disponible pour ce filtre.
                            </td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
          <Footer />
        </main>
        <Banner />
      </div>

      {/* Modal Aperçu Bulletin */}
      {viewModal && selectedUser && (
        <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 sm:w-[500px] max-h-[100vh] overflow-y-auto break-words">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Aperçu du bulletin
            </h2>
            <div className="mb-5 flex justify-center">
              <img
                src={selectedUser.photo ? `${selectedUser.photo}` : Photo}
                alt="Photo de l'étudiant"
                className="w-38 h-40 rounded object-cover shadow mb-4"
              />
            </div>
            <div className="mb-5 grid">
              <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                <span className="text-gray-500 dark:text-gray-400 mr-1">Nom :</span>
                <span className="font-medium">{selectedUser.nom}</span>
              </div>
              <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                <span className="text-gray-500 dark:text-gray-400 mr-1">Prénom :</span>
                <span className="font-medium">{selectedUser.prenom}</span>
              </div>
              <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                <span className="text-gray-500 dark:text-gray-400 mr-1">Classe :</span>
                <span className="font-medium">{selectedUser.classe}</span>
              </div>
              <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                <span className="text-gray-500 dark:text-gray-400 mr-1">Moyenne :</span>
                <span className="font-medium">{selectedUser.moyenne ?? '-'}</span>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setViewModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

    {downloadModal && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-80 sm:w-96 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Télécharger tous les bulletins
        </h2>
        <div className="mb-4">
            <label className="block mb-2 text-sm text-gray-600 dark:text-gray-400">
            Choisir la classe :
            </label>
            <select
            value={downloadClasse}
            onChange={(e) => setDownloadClasse(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
            <option value="">Sélectionner une classe</option>
            {classes.map(c => (
                <option key={c.id} value={c.niveau}>{c.niveau}</option>
            ))}
            </select>
        </div>
        <div className="flex justify-end gap-2">
            <button
            onClick={() => setDownloadModal(false)}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
            >
            Annuler
            </button>
            <button
                onClick={telechargerBulletins}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
            Télécharger
            </button>
        </div>
        </div>
    </div>
    )}

    </div>
  );
}

export default Bulletin;