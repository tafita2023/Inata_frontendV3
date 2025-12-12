import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';

function AbsenceProfesseur() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState('');

  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [absences, setAbsences] = useState([]);

  const token = localStorage.getItem('authToken');

  // ------------------- Récupérer les données -------------------
  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/classes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
    } catch (error) {
      console.error('Erreur fetchClasses:', error);
    }
  };

  const fetchEtudiants = async (classeId) => {
    if (!classeId) return setEtudiants([]);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/professeur/classes/${classeId}/etudiants/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEtudiants(response.data);
    } catch (error) {
      console.error('Erreur fetchEtudiants:', error);
    }
  };

  const fetchAbsences = async () => {
    try {
      // Utilisation de l’API spéciale pour les professeurs
      const response = await axios.get('http://127.0.0.1:8000/api/absences/prof/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAbsences(response.data);
    } catch (error) {
      console.error('Erreur fetchAbsences:', error);
    }
  };

  // ------------------- useEffect -------------------
  useEffect(() => {
    fetchClasses();
    fetchAbsences();
  }, []);

  useEffect(() => {
    fetchEtudiants(selectedClasse);
  }, [selectedClasse]);

  // ------------------- Ajouter une absence -------------------
  const ajouterAbsence = async () => {
    if (!selectedEtudiant) return alert("Veuillez sélectionner un étudiant !");
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/absences/',
        { personne: selectedEtudiant },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsModalOpen(false);
      setSelectedClasse('');
      setSelectedEtudiant('');
      fetchAbsences();
    } catch (error) {
      console.error('Erreur ajouterAbsence:', error.response?.data || error);
    }
  };

  // ------------------- Filtrer par classe -------------------
  const absencesFiltrees = selectedClasse
    ? absences.filter(a => a.classe_id === parseInt(selectedClasse))
    : absences;

  // ------------------- Render -------------------
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Étudiants absents
            </h1>

            {/* Filtre par classe et bouton Ajouter */}
            <div className="sm:flex sm:items-center mb-8">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[150px]"
                value={selectedClasse}
                onChange={(e) => setSelectedClasse(e.target.value)}
              >
                <option value="">Toutes les classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.niveau}</option>
                ))}
              </select>

              <button
                onClick={() => setIsModalOpen(true)}
                className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
              >
                Ajouter
              </button>
            </div>

            {/* Modal ajout */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Ajouter une absence
                  </h2>

                  <label className="block mb-2 text-sm">Classe</label>
                  <select
                    className="w-full px-2 py-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
                    value={selectedClasse}
                    onChange={(e) => setSelectedClasse(e.target.value)}
                  >
                    <option value="">-- Choisir une classe --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.niveau}</option>
                    ))}
                  </select>

                  <label className="block mb-2 text-sm">Étudiant</label>
                  <select
                    className="w-full px-2 py-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
                    value={selectedEtudiant}
                    onChange={(e) => setSelectedEtudiant(e.target.value)}
                  >
                    <option value="">-- Choisir un étudiant --</option>
                    {etudiants.map(e => (
                      <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                    ))}
                  </select>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={ajouterAbsence}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tableau des absences */}
            <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Nom</th>
                    <th className="p-2">Prénom</th>
                    <th className="p-2">Classe</th>
                    <th className="p-2">Date</th>
                    <th className="p-2">Justifiée</th>
                  </tr>
                </thead>
                <tbody>
                  {absencesFiltrees.length > 0 ? (
                    absencesFiltrees.map((a, index) => (
                      <tr key={a.id}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{a.etudiant_nom}</td>
                        <td className="p-2">{a.etudiant_prenom}</td>
                        <td className="p-2">{a.classe_nom}</td>
                        <td className="p-2">{a.date}</td>
                        <td className={`p-2 ${a.justifiee ? 'text-green-600' : 'text-red-600'}`}>
                          {a.justifiee ? 'Oui' : 'Non'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center p-4 text-gray-500">
                        Aucune absence
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
          <Footer />
        </main>
        <Banner />
      </div>
    </div>
  );
}

export default AbsenceProfesseur;
