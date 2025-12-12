import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';

function Devoir() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [devoirs, setDevoirs] = useState([]);

  // 🔹 Gestion des messages
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // 🔹 Récupérer les devoirs de la classe de l'étudiant connecté
  useEffect(() => {
    const fetchDevoirsEtudiant = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(
          'http://127.0.0.1:8000/api/etudiant/devoirs/', // endpoint spécifique étudiant
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setDevoirs(res.data);
      } catch (err) {
        console.error(err);
        setErrorMessage('Impossible d\'afficher les devoirs !');
      }
    };

    fetchDevoirsEtudiant();
  }, []);

  // 🔹 Fonction de téléchargement
  const downloadFile = async (filename) => {
    try {
      const token = localStorage.getItem('authToken');
      const cleanFilename = filename.split('/').pop();

      const response = await fetch(
        `http://127.0.0.1:8000/api/professeur/telecharger/${cleanFilename}`,
        {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error('Erreur lors du téléchargement');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', cleanFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erreur téléchargement :', err);
      setErrorMessage('Impossible de télécharger le fichier !');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {successMessage && <SuccessMessage message={successMessage} />}
            {errorMessage && <ErrorMessage message={errorMessage} />}

            <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestion des devoirs</h1>

            {/* 🔹 Tableau des devoirs */}
            <div className="overflow-x-auto mb-4">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-50 dark:bg-gray-700 text-xs font-semibold text-gray-400 dark:text-gray-300 uppercase">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Titre</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Classe</th>
                    <th className="p-2">Matière</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Date fin</th>
                    <th className="p-2">Statut</th>
                    <th className="p-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {devoirs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-4 text-center text-gray-500">
                        Aucun devoir trouvé
                      </td>
                    </tr>
                  ) : (
                    devoirs.map((d, index) => (
                      <tr key={d.id}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{d.titre}</td>
                        <td className="p-2">{d.description || '-'}</td>
                        <td className="p-2">{d.classe?.niveau || '-'}</td>
                        <td className="p-2">{d.matiere?.nom || '-'}</td>
                        <td className="p-2 capitalize">{d.type}</td>
                        <td className="p-2">
                          {d.date_fin
                            ? new Date(d.date_fin).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </td>
                        <td className="p-2">{d.statut || '-'}</td>
                        <td className="p-2 text-center">
                          {d.fichier ? (
                            <button
                              onClick={() => downloadFile(d.fichier)}
                              className="inline-flex items-center justify-center bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600 transition-colors duration-200 shadow-sm"
                            >
                              <svg
                                className="w-5 h-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
                                />
                              </svg>
                              <span className="ml-1 text-sm font-medium">Télécharger</span>
                            </button>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Devoir;
