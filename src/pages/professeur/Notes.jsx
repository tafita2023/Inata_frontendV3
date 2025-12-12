import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';

function Note() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addEvalModalOpen, setAddEvalModalOpen] = useState(false);
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  const [editEvalModalOpen, setEditEvalModalOpen] = useState(false);

  const [matieres, setMatieres] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [notes, setNotes] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [classes, setClasses] = useState([]);

  const [selectedMatiere, setSelectedMatiere] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState("");
  const [selectedSemestre, setSelectedSemestre] = useState("");
  const [selectedEtudiant, setSelectedEtudiant] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  const [noteValeur, setNoteValeur] = useState("");
  const [noteRemarque, setNoteRemarque] = useState("");
  const [newEvalNom, setNewEvalNom] = useState("");
  const [newEvalSemestre, setNewEvalSemestre] = useState(1);
  const [newEvalType, setNewEvalType] = useState("devoir"); // 🟢 nouveau champ

  const [editEvalNom, setEditEvalNom] = useState("");
  const [editEvalSemestre, setEditEvalSemestre] = useState(1);
  const [editEvalType, setEditEvalType] = useState("devoir");
  const [filterSemestre, setFilterSemestre] = useState("");

  // 🔹 Récupérer les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/classes/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClasses(response.data);
        const l1 = response.data.find(c => c.niveau === "L1");
        if (l1) setSelectedClasse(l1.id.toString());
      } catch (error) {
        console.error('Erreur lors du chargement des classes :', error);
      }
    };
    fetchClasses();
  }, []);
  
  const handleClasseChange = (e) => setSelectedClasse(e.target.value);
  const handleFilterSemestreChange = (e) => setFilterSemestre(e.target.value);

  // 🔹 Récupérer les matières du prof
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://127.0.0.1:8000/api/professeur/matieres/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMatieres(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatieres();
  }, []);

  // 🔹 Récupérer les évaluations
  const fetchEvaluations = async () => {
    if (!selectedMatiere) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`http://127.0.0.1:8000/api/professeur/evaluations/?matiere=${selectedMatiere.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvaluations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Récupérer notes et étudiants
  const fetchNotes = async (matiereId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(
        `http://127.0.0.1:8000/api/professeur/notes/${matiereId}/etudiants/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotes(res.data);
    } catch (err) {
      console.error("Erreur fetchNotes:", err);
    }
  };
      
  useEffect(() => {
    if (selectedMatiere && selectedClasse) {
      fetchNotes(selectedMatiere.id);
      fetchEvaluations();
    }
  }, [selectedClasse, selectedSemestre, selectedMatiere]);

  const filteredMatieres = matieres.filter(m => {
    if (!selectedClasse) return true;
    const classeId = typeof m.classe === 'object' ? m.classe.id : m.classe;
    return classeId.toString() === selectedClasse;
  });

  const openAddModal = (etudiant, note = null) => {
    setSelectedEtudiant(etudiant);
    setSelectedNote(note);
    setSelectedEvaluation(note ? note.evaluation : null);
    setNoteValeur(note ? note.valeur : "");
    setNoteRemarque(note ? note.remarque : "");
    setAddModalOpen(true);
  };

  const handleSaveNote = async () => {
    if (!selectedEtudiant || !selectedEvaluation) return;

    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        etudiant: selectedEtudiant.id,
        evaluation: selectedEvaluation.id,
        valeur: noteValeur,
        remarque: noteRemarque,
      };

      if (selectedNote) {
        await axios.put(`http://127.0.0.1:8000/api/professeur/notes/${selectedNote.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://127.0.0.1:8000/api/professeur/notes/`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchNotes(selectedMatiere.id);
      setAddModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (note) => {
    if (!note) return;
    
    if (!window.confirm(`Voulez-vous vraiment supprimer la note de ${note.etudiant_nom || ''} pour l'évaluation ${note.evaluation_nom || ''} ?`)) {
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/professeur/notes/${note.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Rafraîchir les notes comme pour l'ajout/modification
      fetchNotes(selectedMatiere.id);
  
      alert("Note supprimée avec succès !");
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };
    
  const handleSaveEvaluation = async () => {
    if (!selectedMatiere || !newEvalNom) return;
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        nom: newEvalNom,
        matiere: selectedMatiere.id,
        semestre: newEvalSemestre,
        type: newEvalType
      };

      await axios.post(
        "http://127.0.0.1:8000/api/professeur/evaluations/",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchEvaluations();
      setAddEvalModalOpen(false);
      setNewEvalNom("");
      setNewEvalType("devoir");
      alert("Evaluation ajouter avec success")
    } catch (err) {
      console.error(err);
    }
  };

  const openEditEval = (evalItem) => {
    setSelectedEvaluation(evalItem);
    setEditEvalNom(evalItem.nom);
    setEditEvalSemestre(evalItem.semestre);
    setEditEvalType(evalItem.type);
    setEditEvalModalOpen(true);
  };

  // 🔹 Sauvegarde édition
  const handleUpdateEvaluation = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.put(
        `http://127.0.0.1:8000/api/professeur/evaluations/${selectedEvaluation.id}/`,
        {
          nom: editEvalNom,
          semestre: editEvalSemestre,
          matiere: selectedMatiere.id,
          // ajoute "type" seulement si ton modèle contient ce champ
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ✅ Met à jour directement dans le state
      setEvaluations((prevEvals) =>
        prevEvals.map((ev) =>
          ev.id === selectedEvaluation.id ? response.data : ev
        )
      );
  
      setEditEvalModalOpen(false);
      alert("Évaluation modifiée avec succès !");
    } catch (err) {
      console.error("Erreur update eval", err.response?.data || err);
      alert("Erreur lors de la modification de l'évaluation !");
    }
  };

  const handleDeleteEvaluation = async (evaluationId) => {
    if (!window.confirm("⚠️ Voulez-vous vraiment supprimer cette évaluation ?")) {
      return; // l'utilisateur a annulé
    }
  
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://127.0.0.1:8000/api/professeur/evaluations/${evaluationId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // ✅ Supprimer localement pour mise à jour immédiate
      setEvaluations((prevEvals) =>
        prevEvals.filter((ev) => ev.id !== evaluationId)
      );
  
      alert("Évaluation supprimée avec succès !");
    } catch (err) {
      console.error("Erreur suppression eval", err.response?.data || err);
      alert("Erreur lors de la suppression !");
    }
  };  
    
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0 w-full">
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                      Les Notes des élèves
                    </h1>
                    <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        <p className="mr-2">Filtre par classe</p>
                        <select
                          value={selectedClasse}
                          onChange={handleClasseChange}
                          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          {classes.map(classe => (
                            <option key={classe.id} value={classe.id}>
                              {classe.niveau} {classe.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des matières */}
            <div className="grid grid-cols-12 gap-6 mb-6">
              <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Mes matières</h2>
                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-2">Id</th>
                        <th className="p-2">Nom de la matière</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {filteredMatieres.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="p-4 text-center text-gray-500">Aucune matière disponible pour cette classe.</td>
                        </tr>
                      ) : filteredMatieres.map(matiere => (
                        <tr key={matiere.id}>
                          <td className="p-2">{matiere.id}</td>
                          <td className="p-2">{matiere.nom}</td>
                          <td className="p-2">
                            <button
                              onClick={() => {
                                setSelectedMatiere(matiere);
                                setViewModalOpen(true);
                                fetchNotes(matiere.id);
                                fetchEvaluations();
                                setFilterSemestre("");
                              }}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 p-2"
                            >
                              Voir les notes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal d'affichage des notes */}
            {viewModalOpen && selectedMatiere && (
              <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-3xl">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Notes {selectedMatiere.nom}
                    </h2>
                    <div className="flex">
                    <button
                    onClick={() => setEvalModalOpen(true)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition text-sm mr-2"
                    >
                      Afficher Évaluation
                    </button>

                    <button
                      onClick={() => setAddEvalModalOpen(true)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm"
                    >
                      Ajouter Évaluation
                    </button>
                    </div>
                  </div>

                  {/* 🔹 Filtres */}
                  <div className="flex space-x-4 mb-4">
                    <div className="flex items-center">
                      <p className="mr-2">Semestre :</p>
                      <select
                        value={filterSemestre}
                        onChange={handleFilterSemestreChange}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Tous</option>
                        <option value="1">Semestre 1</option>
                        <option value="2">Semestre 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto mb-4">
                    <table className="table-auto w-full text-left">
                      <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                          <th className="p-2">Id</th>
                          <th className="p-2">Nom</th>
                          <th className="p-2">Prénom</th>
                          {evaluations
                            .filter(ev => !filterSemestre || ev.semestre.toString() === filterSemestre)
                            .map(ev => (
                              <th
                                key={ev.id}
                                className={`p-2 ${ev.type === "examen" ? "bg-yellow-100 dark:bg-yellow-800" : ""}`}
                              >
                                {ev.nom} {ev.type === "examen" && "(Examen)"}
                              </th>
                            ))}
                          <th className="p-2">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {notes.length === 0 ? (
                          <tr>
                            <td colSpan={3 + evaluations.length} className="p-4 text-center text-gray-500">
                              Aucun étudiant trouvé pour cette classe.
                            </td>
                          </tr>
                        ) : (
                          notes.map((n, idx) => (
                            <tr key={idx}>
                              <td className="p-2">{idx + 1}</td>
                              <td className="p-2">{n.nom || "-"}</td>
                              <td className="p-2">{n.prenom || "-"}</td>
                              {evaluations
                                .filter(ev => !filterSemestre || ev.semestre.toString() === filterSemestre)
                                .map(ev => {
                                  const notesPourEval = (n.notes || []).filter(note => {
                                    const noteEvalId = typeof note.evaluation === "object" ? note.evaluation.id : note.evaluation;
                                    return noteEvalId === ev.id;
                                  });

                                  return (
                                    <td key={ev.id} className="p-2">
                                      {notesPourEval.length > 0 ? (
                                        <div className="flex items-center justify-between">
                                          <span>{notesPourEval[0].valeur}</span>
                                          <button
                                            onClick={() => openAddModal(n, notesPourEval[0])}
                                            className="ml-2 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-700"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="w-4 h-4"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M16.862 3.487a2.25 2.25 0 013.182 3.182L7.5 19.313l-4.5 1.125 1.125-4.5L16.862 3.487z"
                                              />
                                            </svg>
                                          </button>
                                          <button
                                            onClick={() => handleDeleteNote(notesPourEval[0])}
                                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-700 p-2"
                                          >
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              className="w-4 h-4"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                              strokeWidth={2}
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                              />
                                            </svg>
                                          </button>
                                        </div>
                                      ) : (
                                        "-"
                                      )}
                                    </td>
                                  );
                                })}
                              <td className="p-2">
                                <button
                                  onClick={() => openAddModal(n)}
                                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 p-2"
                                >
                                  Ajouter
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex space-x-4">
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

            {/* Modals d'ajout/modification notes et évaluations */}
            {addModalOpen && selectedEtudiant && selectedMatiere && (
              <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    {selectedNote ? "Modifier" : "Ajouter"} la note de {selectedEtudiant.nom} {selectedEtudiant.prenom}
                  </h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Évaluation</label>
                    <select
                      value={selectedEvaluation?.id || ""}
                      onChange={(e) => {
                        const evalSelected = evaluations.find(ev => ev.id === parseInt(e.target.value));
                        setSelectedEvaluation(evalSelected);
                      }}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="">Sélectionner une évaluation</option>
                      {evaluations
                        .filter(ev => !filterSemestre || ev.semestre.toString() === filterSemestre)
                        .map(ev => (
                          <option key={ev.id} value={ev.id}>
                            {ev.nom} (S{ev.semestre}) {ev.type === "examen" ? "- Examen" : ""}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Valeur</label>
                    <input
                      type="number"
                      value={noteValeur}
                      onChange={(e) => setNoteValeur(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Remarque</label>
                    <input
                      type="text"
                      value={noteRemarque}
                      onChange={(e) => setNoteRemarque(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setAddModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveNote}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {addEvalModalOpen && selectedMatiere && (
              <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Ajouter une évaluation à {selectedMatiere.nom}
                  </h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Nom de l'évaluation</label>
                    <input
                      type="text"
                      value={newEvalNom}
                      onChange={(e) => setNewEvalNom(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Semestre</label>
                    <select
                      value={newEvalSemestre}
                      onChange={(e) => setNewEvalSemestre(parseInt(e.target.value))}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value={1}>Semestre 1</option>
                      <option value={2}>Semestre 2</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Type</label>
                    <select
                      value={newEvalType}
                      onChange={(e) => setNewEvalType(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    >
                      <option value="devoir">Devoir</option>
                      <option value="examen">Examen</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setAddEvalModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveEvaluation}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                    >
                      Enregistrer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Liste des évaluations */}
            {evalModalOpen && selectedMatiere && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Évaluations - {selectedMatiere.nom}
                  </h2>

                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {evaluations
                      .filter(ev => ev.matiere === selectedMatiere.id)
                      .map(ev => (
                        <li key={ev.id} className="flex justify-between items-center py-2">
                          {/* Texte à gauche */}
                          <div>
                            <p className="text-gray-800 dark:text-gray-200 font-medium">
                              {ev.nom} (Semestre {ev.semestre}) {ev.type === "examen" && "🎓 Examen"}
                            </p>
                          </div>

                          {/* Boutons à droite */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditEval(ev)}
                              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 p-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteEvaluation(ev.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-700 p-2"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setEvalModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Edit Evaluation */}
            {editEvalModalOpen && selectedEvaluation && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                  <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                    Modifier Évaluation
                  </h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Nom</label>
                    <input
                      type="text"
                      value={editEvalNom}
                      onChange={(e) => setEditEvalNom(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Semestre</label>
                    <select
                      value={editEvalSemestre}
                      onChange={(e) => setEditEvalSemestre(parseInt(e.target.value))}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full"
                    >
                      <option value={1}>Semestre 1</option>
                      <option value={2}>Semestre 2</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-200 mb-1">Type</label>
                    <select
                      value={editEvalType}
                      onChange={(e) => setEditEvalType(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full"
                    >
                      <option value="devoir">Devoir</option>
                      <option value="examen">Examen</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditEvalModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleUpdateEvaluation}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Enregistrer
                    </button>
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

export default Note;

