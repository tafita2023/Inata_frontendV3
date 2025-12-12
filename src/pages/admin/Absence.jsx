import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';

function Absence() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [filterType, setFilterType] = useState('etud');
  const [typeAbsence, setTypeAbsence] = useState('etud');

  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedEtudiant, setSelectedEtudiant] = useState('');
  const [selectedProf, setSelectedProf] = useState('');

  const [classes, setClasses] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [profs, setProfs] = useState([]);
  const [absences, setAbsences] = useState([]);

  const token = localStorage.getItem('authToken');

  // ------------------- Fonctions pour récupérer les données -------------------

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/classes/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(response.data);
      if (response.data.length > 0) setSelectedClasse(response.data[0].id.toString());
    } catch (error) {
      console.error('Erreur fetchClasses:', error);
    }
  };

  const fetchProfs = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/admin/professeurs/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfs(response.data);
    } catch (error) {
      console.error('Erreur fetchProfs:', error);
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
      const response = await axios.get('http://127.0.0.1:8000/api/absences/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAbsences(response.data);
    } catch (error) {
      console.error('Erreur fetchAbsences:', error);
    }
  };

  // ------------------- useEffect pour charger initialement -------------------

  useEffect(() => {
    fetchClasses();
    fetchProfs();
    fetchAbsences();
  }, []);

  useEffect(() => {
    fetchEtudiants(selectedClasse);
  }, [selectedClasse]);

  // ------------------- Ajouter une absence -------------------

  const ajouterAbsence = async () => {
    try {
      const data =
        typeAbsence === 'etud'
          ? { personne: selectedEtudiant }
          : { personne: selectedProf };

      await axios.post('http://127.0.0.1:8000/api/absences/', data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsModalOpen(false);
      setSelectedClasse('');
      setSelectedEtudiant('');
      setSelectedProf('');

      fetchAbsences();
    } catch (error) {
      console.error('Erreur ajouterAbsence:', error.response?.data || error);
    }
  };

  // ------------------- Render -------------------

  // Filtrer les absences selon le type
  const filteredAbsences = absences.filter(
    a => (filterType === 'etud' && a.personne_role === 'etud') ||
         (filterType === 'prof' && a.personne_role === 'prof')
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              Liste des absents ({filterType === 'etud' ? 'Étudiants' : 'Professeurs'})
            </h1>

            {/* Filtre et bouton Ajouter */}
            <div className="sm:flex sm:items-center mb-8">
              <select
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[120px] pr-2"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="etud">Étudiants</option>
                <option value="prof">Professeurs</option>
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

                  <label className="block mb-2 text-sm">Type</label>
                  <select
                    className="w-full px-2 py-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
                    value={typeAbsence}
                    onChange={(e) => setTypeAbsence(e.target.value)}
                  >
                    <option value="etud">Étudiant</option>
                    <option value="prof">Professeur</option>
                  </select>

                  {typeAbsence === 'etud' && (
                    <>
                      <label className="block mb-2 text-sm">Classe</label>
                      <select
                        className="w-full px-2 py-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
                        value={selectedClasse}
                        onChange={(e) => setSelectedClasse(e.target.value)}
                      >
                        <option value="">-- Choisir une classe --</option>
                        {Array.isArray(classes) && classes.map(c => (
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
                        {Array.isArray(etudiants) && etudiants.map(e => (
                          <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                        ))}
                      </select>
                    </>
                  )}

                  {typeAbsence === 'prof' && (
                    <>
                      <label className="block mb-2 text-sm">Professeur</label>
                      <select
                        className="w-full px-2 py-2 mb-4 rounded bg-gray-100 dark:bg-gray-700"
                        value={selectedProf}
                        onChange={(e) => setSelectedProf(e.target.value)}
                      >
                        <option value="">-- Choisir un professeur --</option>
                        {Array.isArray(profs) && profs.map(p => (
                          <option key={p.id} value={p.id}>{p.nom} {p.prenom}</option>
                        ))}
                      </select>
                    </>
                  )}

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

            {/* Tableau absents */}
            <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
              <table className="table-auto w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs uppercase">
                  <tr>
                    <th className="p-2">#</th>
                    <th className="p-2">Nom</th>
                    <th className="p-2">Prénom</th>
                    {filterType === 'etud' && <th className="p-2">Classe</th>}
                    {filterType === 'prof' && <th className="p-2">Rôle</th>}
                    <th className="p-2">Date</th>
                    <th className="p-2">Justifiée</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAbsences.length > 0 ? (
                    filteredAbsences.map((a, index) => (
                      <tr key={a.id}>
                        <td className="p-2">{index + 1}</td>
                        <td className="p-2">{a.personne_nom}</td>
                        <td className="p-2">{a.personne_prenom}</td>
                        {filterType === 'etud' && <td className="p-2">{a.personne_classe}</td>}
                        {filterType === 'prof' && <td className="p-2">Professeur</td>}
                        <td className="p-2">{a.date}</td>
                        <td className={`p-2 ${a.justifiee ? 'text-green-600' : 'text-red-600'}`}>
                          {a.justifiee ? 'Oui' : 'Non'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={filterType === 'etud' ? 5 : 5} className="text-center p-4 text-gray-500">
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

export default Absence;
