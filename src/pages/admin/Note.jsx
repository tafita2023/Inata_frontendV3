import React, { useState, useEffect } from 'react';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';

function NoteAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [matieres, setMatieres] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [notes, setNotes] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedAnnee, setSelectedAnnee] = useState("");

  const [anneesDisponibles, setAnneesDisponibles] = useState([]);

  const [filterSemestre, setFilterSemestre] = useState("");

  /** Charger classes */
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await AxiosInstance.get('/api/admin/classes/');
        setClasses(res.data);
        if (res.data.length) setSelectedClasse(res.data[0].id.toString());
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

  /** Charger matières */
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const res = await AxiosInstance.get("/api/admin/matieres/");
        setMatieres(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatieres();
  }, []);

  /** Charger évaluations */
  const fetchEvaluations = async () => {
    if (!selectedMatiere) return;
    try {
      const res = await AxiosInstance.get(
        `/api/admin/evaluations/?matiere=${selectedMatiere.id}`
      );
      setEvaluations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  /** Charger notes */
  const fetchNotes = async (matiereId) => {
    if (!selectedClasse) return;

    try {

      const params = {
        matiere: matiereId,
        classe: selectedClasse
      };
      if (selectedAnnee) params.annee = selectedAnnee;

      const res = await AxiosInstance.get(
        `/api/admin/notes/etudiants/`, params
      );

      const etudiantsMap = {};

      res.data.forEach(note => {
        const etudiantId = note.etudiant;

        if (!etudiantsMap[etudiantId]) {
          etudiantsMap[etudiantId] = {
            id: etudiantId,
            nom: note.etudiant_nom || "-",
            prenom: note.etudiant_prenom || "-",
            annee: note.etudiant_annee,
            notes: []
          };
        }

        etudiantsMap[etudiantId].notes.push({
          id: note.id,
          valeur: note.valeur,
          remarque: note.remarque,
          evaluation: note.evaluation,
          evaluation_nom: note.evaluation_nom,
          semestre: note.semestre
        });
      });

      setNotes(Object.values(etudiantsMap));

      // Liste des années disponibles
      const annees = [...new Set(res.data.map(n => n.etudiant_annee))];
      setAnneesDisponibles(annees);

    } catch (err) {
      console.error("Erreur:", err.response?.data || err);
      setNotes([]);
    }
  };

  /** Charger notes à chaque changement */
  useEffect(() => {
    if (selectedMatiere && selectedClasse) {
      fetchNotes(selectedMatiere.id);
      fetchEvaluations();
    }
  }, [selectedClasse, selectedMatiere, selectedAnnee]);

  const filteredMatieres = matieres.filter(m => {
    if (!selectedClasse) return true;
    const classeId = typeof m.classe === 'object' ? m.classe.id : m.classe;
    return classeId.toString() === selectedClasse;
  });

  return (
    <div className="flex h-screen overflow-hidden">

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestion des notes</h1>

            {/* Filtre Classe */}
            <div className="flex items-center mb-6 gap-6">
              <div className="flex items-center gap-2">
                <p>Classe :</p>
                <select
                  value={selectedClasse}
                  onChange={(e) => setSelectedClasse(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[120px]"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.niveau} {c.nom}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Liste Matières */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Matières</h2>

                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-300 text-xs font-semibold uppercase">
                      <tr>
                        <th className="p-2">ID</th>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredMatieres.map(m => (
                        <tr key={m.id}>
                          <td className="p-2">{m.id}</td>
                          <td className="p-2">{m.nom}</td>
                          <td className="p-2">
                            <button
                              onClick={() => {
                                setSelectedMatiere(m);
                                setViewModalOpen(true);
                                fetchNotes(m.id);
                                fetchEvaluations();
                                setFilterSemestre("");
                              }}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              Voir notes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
              </div>
            </div>

            {/* MODAL NOTES */}
            {viewModalOpen && selectedMatiere && (
  <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-6xl overflow-x-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-semibold">
          Notes {selectedMatiere.nom}
        </h2>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {/* Filtre année */}
          <div className="flex items-center gap-2">
            <p>Année :</p>
            <select
              value={selectedAnnee}
              onChange={(e) => setSelectedAnnee(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[120px]"
            >
              <option value="">Toutes</option>
              {anneesDisponibles.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Filtre semestre */}
          <div className="flex items-center gap-2">
            <p>Semestre :</p>
            <select
              value={filterSemestre}
              onChange={(e) => setFilterSemestre(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2"
            >
              <option value="">Tous</option>
              <option value="1">Semestre 1</option>
              <option value="2">Semestre 2</option>
            </select>
          </div>
        </div>

        {/* Bouton fermer */}
        <button
          onClick={() => setViewModalOpen(false)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          Fermer
        </button>
      </div>

      {/* Tableau notes */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Prénom
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Année
              </th>
              {evaluations
                .filter(ev => !filterSemestre || String(ev.semestre) === filterSemestre)
                .map(ev => (
                  <th 
                    key={ev.id} 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[120px]"
                  >
                    <div className="flex flex-col">
                      <span>{ev.nom}</span>
                      {ev.type === "examen" && (
                        <span className="text-xs text-red-500 dark:text-red-400">(Examen)</span>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>

          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {notes.length === 0 ? (
              <tr>
                <td 
                  colSpan={4 + evaluations.filter(ev => !filterSemestre || String(ev.semestre) === filterSemestre).length} 
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun étudiant trouvé
                </td>
              </tr>
            ) : (
              notes.map((n, index) => {
                // Filtrer les évaluations UNE FOIS avant de mapper
                const filteredEvaluations = evaluations.filter(
                  ev => !filterSemestre || String(ev.semestre) === filterSemestre
                );
                
                // Créer un map des notes pour un accès rapide
                const notesMap = {};
                n.notes?.forEach(note => {
                  notesMap[note.evaluation] = note.valeur;
                });
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {n.nom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {n.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {n.annee}
                    </td>
                    {filteredEvaluations.map(ev => (
                      <td 
                        key={ev.id} 
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center"
                      >
                        {notesMap[ev.id] !== undefined ? notesMap[ev.id] : "-"}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  </div>
)}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default NoteAdmin;
