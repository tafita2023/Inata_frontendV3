import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function NoteEtudiant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [matieres, setMatieres] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSemestre, setSelectedSemestre] = useState(''); // 🔹 état pour le filtre

  // 🔹 Récupérer les matières de l'étudiant
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await AxiosInstance.get('/api/etudiant/matieres/');
        setMatieres(res.data);
      } catch (err) {
        console.error('Erreur fetchMatieres:', err);
      }
    };
    fetchMatieres();
  }, []);

  // 🔹 Récupérer les notes d'une matière
  const fetchNotesMatiere = async (matiereId) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await AxiosInstance.get(`/api/etudiant/notes/${matiereId}/`);
      setNotes(res.data);
      setSelectedSemestre('');
    } catch (err) {
      console.error('Erreur fetchNotesMatiere:', err);
    }
  };

  const openNotesModal = (matiere) => {
    setSelectedMatiere(matiere);
    fetchNotesMatiere(matiere.id);
    setViewModalOpen(true);
  };

  // 🔹 Fonction pour filtrer les notes selon le semestre
  const filteredNotes = notes.filter(
    (n) => !selectedSemestre || n.semestre === parseInt(selectedSemestre)
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Mes matières
          </h1>

          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow p-4">
            <table className="table-auto w-full text-left">
              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                <tr>
                  <th className="p-2">Id</th>
                  <th className="p-2">Nom de la matière</th>
                  <th className="p-2">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                {matieres.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-500">
                      Aucune matière disponible.
                    </td>
                  </tr>
                ) : (
                  matieres.map((matiere, idx) => (
                    <tr key={matiere.id}>
                      <td className="p-2">{idx + 1}</td> {/* 🔹 ID commence par 1 */}
                      <td className="p-2">{matiere.nom}</td>
                      <td className="p-2">
                        <button
                          onClick={() => openNotesModal(matiere)}
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 p-2"
                        >
                          Voir les notes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Modal notes par matière */}
          {viewModalOpen && selectedMatiere && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-3xl">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Notes - {selectedMatiere.nom}
                </h2>

                {/* 🔹 Filtre semestre */}
                <div className="mb-4">
                  <label className="mr-2 font-medium text-gray-700 dark:text-gray-200">
                    Filtrer par semestre :
                  </label>
                  <select
                    className="border border-gray-300 rounded px-2 py-1 dark:bg-gray-700 dark:text-gray-200"
                    value={selectedSemestre}
                    onChange={(e) => setSelectedSemestre(e.target.value)}
                  >
                    <option value="">Tous</option>
                    <option value="1">Semestre 1</option>
                    <option value="2">Semestre 2</option>
                  </select>
                </div>

                <div className="overflow-x-auto mb-4">
                  <table className="table-auto w-full text-left">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-2">Id</th>
                        <th className="p-2">Évaluation</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Semestre</th>
                        <th className="p-2">Note</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredNotes.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">
                            Aucune note disponible pour cette matière.
                          </td>
                        </tr>
                      ) : (
                        filteredNotes.map((n, idx) => (
                          <tr key={idx}>
                            <td className="p-2">{idx + 1}</td> {/* ID commence par 1 */}
                            <td className="p-2">{n.evaluation_nom}</td>
                            <td className="p-2">{n.type}</td>
                            <td className="p-2">{n.semestre}</td>
                            <td className="p-2">{n.valeur}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setViewModalOpen(false)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default NoteEtudiant;
