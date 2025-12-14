import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Devoir() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [classes, setClasses] = useState([]);
  const [selectedClasseTable, setSelectedClasseTable] = useState(""); // 🔹 Pour le tableau
  const [selectedClassePopup, setSelectedClassePopup] = useState(""); // 🔹 Pour le popup

  const [matiereProf, setMatiereProf] = useState([]);
  const [matiereClassePopup, setMatiereClassePopup] = useState([]); // 🔹 Pour le popup
  const [selectedMatiere, setSelectedMatiere] = useState("");

  const [annees, setAnnees] = useState([]);
  const [selectedAnnee, setSelectedAnnee] = useState("");

  const [devoirs, setDevoirs] = useState([]);
  const [selectedDevoir, setSelectedDevoir] = useState(null);

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("exercice");
  const [fichier, setFichier] = useState(null);
  const [dateFin, setDateFin] = useState("");

  // 🔹 Récupérer classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await AxiosInstance.get("/api/admin/classes/");
        setClasses(res.data);
        if (res.data.length) setSelectedClasseTable(res.data[0].id);
      } catch (err) {
        console.error(err);
      }
    };
    fetchClasses();
  }, []);

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

  // 🔹 Récupérer toutes les matières du professeur
  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await AxiosInstance.get("/api/professeur/matieres/");
        setMatiereProf(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMatieres();
  }, []);

  // 🔹 Filtrer matières du popup selon la classe choisie
  useEffect(() => {
    if (!selectedClassePopup) {
      setMatiereClassePopup([]);
      setSelectedMatiere("");
      return;
    }

    const filtered = matiereProf.filter((m) => {
      if (Array.isArray(m.classes)) {
        return m.classes.some(
          (c) =>
            c.id === parseInt(selectedClassePopup) ||
            c === parseInt(selectedClassePopup)
        );
      }
      if (m.classe) {
        return (
          m.classe.id === parseInt(selectedClassePopup) ||
          m.classe === parseInt(selectedClassePopup)
        );
      }
      return false;
    });

    setMatiereClassePopup(filtered);
    if (filtered.length) setSelectedMatiere(filtered[0].id);
    else setSelectedMatiere("");
  }, [selectedClassePopup, matiereProf]);

  // 🔹 Récupérer devoirs selon la classe du tableau
  const fetchDevoirs = async () => {
    if (!selectedClasseTable) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await AxiosInstance.get(
        `/api/professeur/devoirs/?classe=${selectedClasseTable}`
      );
      setDevoirs(res.data);
    } catch (err) {
      console.error(err);
      setErrorMessage("Impossible d'afficher les devoirs !");
    }
  };

  useEffect(() => {
    fetchDevoirs();
  }, [selectedClasseTable, selectedAnnee]);

  // 🔹 Ouvrir le popup
  const openAddModal = (devoir = null) => {
    setSelectedDevoir(devoir);

    if (devoir) {
      setTitre(devoir.titre);
      setDescription(devoir.description || "");
      setType(devoir.type);
      setSelectedClassePopup(devoir.classe.id);
      setSelectedMatiere(devoir.matiere.id);
    } else {
      setTitre("");
      setDescription("");
      setType("exercice");
      setFichier(null);
      setSelectedClassePopup("");
      setSelectedMatiere("");
    }

    setAddModalOpen(true);
  };

  // 🔹 Enregistrer devoir
  const handleSaveDevoir = async () => {
    if (!selectedClassePopup || !titre || !selectedMatiere) {
      setErrorMessage("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const formData = new FormData();

      formData.append("titre", titre);
      formData.append("description", description || "");
      formData.append("classe_id", selectedClassePopup);
      formData.append("matiere_id", selectedMatiere);
      formData.append("type", type);

      if (dateFin) formData.append("date_fin", dateFin);
      if (fichier) formData.append("fichier", fichier);

      if (selectedDevoir) {
        await AxiosInstance.put(
          `/api/professeur/devoirs/${selectedDevoir.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        setSuccessMessage("Devoir modifié avec succès !");
      } else {
        await AxiosInstance.post(
          `/api/professeur/devoirs/`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
        setSuccessMessage("Devoir ajouté avec succès !");
      }

      setAddModalOpen(false);
      fetchDevoirs();
    } catch (err) {
      console.error("Erreur API:", err.response || err);
      if (err.response && err.response.data) {
        const errors = Object.entries(err.response.data)
          .map(([key, val]) => `${key}: ${val}`)
          .join("\n");
        setErrorMessage(errors);
      } else {
        setErrorMessage("Erreur lors de l'ajout du devoir.");
      }
    }
  };

  // 🔹 Fonction de téléchargement
  const downloadFile = async (filename) => {
    try {
      const token = localStorage.getItem("authToken");
  
      const cleanFilename = filename.split('/').pop();
  
      const response = await fetch(
        `/api/professeur/telecharger/${cleanFilename}`,
        { // ❌ pas de / final
          method: "GET",
        }
      );
  
      if (!response.ok) throw new Error("Erreur lors du téléchargement");
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", cleanFilename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur téléchargement :", err);
      setErrorMessage("Impossible de télécharger le fichier !");
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

            {/* 🔹 Filtres + bouton alignés */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <p>Classe :</p>
                  <select
                    value={selectedClasseTable}
                    onChange={(e) => setSelectedClasseTable(parseInt(e.target.value))}
                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem_1rem]"
                    >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.niveau} {c.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <p>Année :</p>
                  <input
                    type="text"
                    value={selectedAnnee}
                    onChange={(e) => setSelectedAnnee(e.target.value)}
                    placeholder="ex: 2025-2026"
                    className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2"
                  />
                </div>
              </div>

              <button
                onClick={() => openAddModal()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Ajouter Devoir
              </button>
            </div>

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
                        <td className="p-2">{d.description || "-"}</td>
                        <td className="p-2">{d.classe?.niveau || "-"}</td>
                        <td className="p-2">{d.matiere?.nom || "-"}</td>
                        <td className="p-2 capitalize">{d.type}</td>
                        <td className="p-2">
                          {d.date_fin
                            ? new Date(d.date_fin).toLocaleDateString('fr-FR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })
                            : "-"}
                        </td>
                        <td className="p-2">{d.statut || "-"}</td>
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
    "-"
  )}
</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* 🔹 Popup ajout/modif */}
            {addModalOpen && (
              <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-40">
                <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                  <h2 className="text-lg font-semibold mb-4">
                    {selectedDevoir ? "Modifier" : "Ajouter"} Devoir
                  </h2>

                  <div className="flex flex-col gap-3 mb-4">
                    <label>Titre</label>
                    <input
                      type="text"
                      placeholder="Titre"
                      value={titre}
                      onChange={(e) => setTitre(e.target.value)}
                      className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-4 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />

                    <div>
                      <label>Description</label>
                      <textarea
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div>
                      <label>Classe</label>
                      <select
                        value={selectedClassePopup}
                        onChange={(e) => setSelectedClassePopup(parseInt(e.target.value))}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="">Sélectionner une classe</option>
                        {classes.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.niveau} {c.nom}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label>Matière</label>
                      <select
                        value={selectedMatiere}
                        onChange={(e) => setSelectedMatiere(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        {matiereClassePopup.length > 0 ? (
                          matiereClassePopup.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.nom}
                            </option>
                          ))
                        ) : (
                          <option value="">Aucune matière disponible</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label>Type</label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="exercice">Exercice</option>
                        <option value="examen">Examen</option>
                      </select>
                    </div>

                    <div>
                      <label>Date de fin</label>
                      <input
                        type="date"
                        value={dateFin}
                        onChange={(e) => setDateFin(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-1 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium">Fichier</label>
                      <label
                        htmlFor="fichier"
                        className="cursor-pointer flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <span>{fichier ? fichier.name : "Choisir un fichier..."}</span>
                        <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs ml-3">
                          Parcourir
                        </span>
                      </label>
                      <input
                        id="fichier"
                        type="file"
                        onChange={(e) => setFichier(e.target.files[0])}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setAddModalOpen(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveDevoir}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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

export default Devoir;
