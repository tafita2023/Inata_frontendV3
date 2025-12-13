import React, { useState, useEffect } from "react";
// ❌ plus besoin de axios ici
// import axios from "axios";

// ✅ Instance Axios centralisée (local / prod)
import AxiosInstance from "../../components/instance/AxiosInstance";

function SalaireProf() {
  const [salaires, setSalaires] = useState([]);
  const [allClasses, setAllClasses] = useState([]);
  const [allMatieres, setAllMatieres] = useState([]);
  const [allProfesseurs, setAllProfesseurs] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState("");

  const [selectedSalaire, setSelectedSalaire] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    professeur: "",
    classe: "",
    matiere: "",
    montant: ""
  });

  // =======================
  // CHARGEMENT INITIAL
  // =======================
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          classesRes,
          salairesRes,
          matieresRes,
          profsRes
        ] = await Promise.all([
          AxiosInstance.get("/api/admin/classes/"),
          AxiosInstance.get("/api/salaires-prof/"),
          AxiosInstance.get("/api/admin/matieres/"),
          AxiosInstance.get("/api/admin/professeurs/")
        ]);

        setAllClasses(classesRes.data);
        setSalaires(Array.isArray(salairesRes.data) ? salairesRes.data : []);
        setAllMatieres(Array.isArray(matieresRes.data) ? matieresRes.data : []);
        setAllProfesseurs(profsRes.data);

        if (classesRes.data.length > 0) {
          setSelectedClasse(classesRes.data[0].id.toString());
        }
      } catch (err) {
        console.error("Erreur chargement données :", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // =======================
  // FILTRES
  // =======================
  const getProfesseursFiltres = () => {
    if (!selectedClasse) return allProfesseurs;

    const matieresClasse = allMatieres.filter(
      m => m.classe == selectedClasse
    );

    const professeurIds = [
      ...new Set(
        matieresClasse
          .map(m => m.professeur?.id || m.professeur)
          .filter(Boolean)
      )
    ];

    return allProfesseurs.filter(p => professeurIds.includes(p.id));
  };

  const getMatieresParProfesseur = (profId) => {
    if (!selectedClasse || !profId) return [];
    return allMatieres.filter(
      m =>
        m.classe == selectedClasse &&
        (m.professeur?.id == profId || m.professeur == profId)
    );
  };

  const getSalairesFiltres = () => {
    if (!selectedClasse) return salaires;
    return salaires.filter(s =>
      parseInt(s.classe?.id || s.classe) === parseInt(selectedClasse)
    );
  };

  // =======================
  // HELPERS AFFICHAGE
  // =======================
  const getProfesseurName = (prof) => {
    if (!prof) return "—";
    if (typeof prof === "object") return `${prof.nom} ${prof.prenom}`;
    const p = allProfesseurs.find(p => p.id == prof);
    return p ? `${p.nom} ${p.prenom}` : "—";
  };

  const getClasseName = (classe) => {
    if (!classe) return "—";
    if (typeof classe === "object") return classe.niveau;
    const c = allClasses.find(c => c.id == classe);
    return c ? c.niveau : "—";
  };

  const getMatiereName = (matiere) => {
    if (!matiere) return "—";
    if (typeof matiere === "object") return matiere.nom;
    const m = allMatieres.find(m => m.id == matiere);
    return m ? m.nom : "—";
  };

  // =======================
  // FORM HANDLERS
  // =======================
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "classe") {
      setSelectedClasse(value);
      setFormData({
        ...formData,
        classe: value,
        professeur: "",
        matiere: ""
      });
    } else if (name === "professeur") {
      setFormData(prev => ({
        ...prev,
        professeur: value,
        matiere: ""
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    if (error) setError("");
  };

  // =======================
  // AJOUT
  // =======================
  const handleAddSalaire = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.professeur || !formData.classe || !formData.matiere || !formData.montant) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    try {
      const response = await AxiosInstance.post("/api/salaires-prof/", {
        professeur_id: Number(formData.professeur),
        classe_id: Number(formData.classe),
        matiere_id: Number(formData.matiere),
        montant: Number(formData.montant)
      });

      setSalaires(prev => [...prev, response.data]);
      setShowAddModal(false);
      setFormData({ professeur: "", classe: selectedClasse, matiere: "", montant: "" });
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'ajout");
    }
  };

  // =======================
  // MODIFICATION
  // =======================
  const handleEditSalaire = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await AxiosInstance.put(
        `/api/salaires-prof/${selectedSalaire.id}/`,
        {
          professeur_id: Number(formData.professeur),
          classe_id: Number(formData.classe),
          matiere_id: Number(formData.matiere),
          montant: Number(formData.montant)
        }
      );

      setSalaires(prev =>
        prev.map(s => s.id === selectedSalaire.id ? response.data : s)
      );

      setShowEditModal(false);
      setSelectedSalaire(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la modification");
    }
  };

  // =======================
  // SUPPRESSION
  // =======================
  const handleDeleteSalaire = async (id) => {
    if (!window.confirm("Supprimer ce salaire ?")) return;

    try {
      await AxiosInstance.delete(`/api/salaires-prof/${id}/`);
      setSalaires(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // =======================
  // PRÉPARER ÉDITION
  // =======================
  const prepareEdit = (salaire) => {
    setSelectedSalaire(salaire);
    setSelectedClasse((salaire.classe?.id || salaire.classe).toString());

    setFormData({
      professeur: (salaire.professeur?.id || salaire.professeur).toString(),
      classe: (salaire.classe?.id || salaire.classe).toString(),
      matiere: (salaire.matiere?.id || salaire.matiere).toString(),
      montant: salaire.montant.toString()
    });

    setShowEditModal(true);
    setError("");
  };

  const salairesFiltres = getSalairesFiltres();
  const professeursFiltres = getProfesseursFiltres();

  // =======================
  // RENDER
  // =======================
  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Salaire des professeurs
        </h2>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          onClick={() => {
            setFormData({
              professeur: "",
              classe: selectedClasse || (allClasses.length > 0 ? allClasses[0].id.toString() : ""),
              matiere: "",
              montant: ""
            });
            setShowAddModal(true);
            setError("");
          }}
        >
          Ajouter
        </button>
      </header>

      <div className="p-3">
        {/* Filtre par classe */}
        <div className="mb-4">
          <label className="mr-2 text-gray-700 dark:text-gray-200">Filtrer par classe :</label>
          <select
            value={selectedClasse}
            onChange={(e) => {
              setSelectedClasse(e.target.value);
            }}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[120px] dark:text-gray-100"
          >
            <option value="">Toutes les classes</option>
            {allClasses.map((classe) => (
              <option key={classe.id} value={classe.id}>
                {classe.niveau}
              </option>
            ))}
          </select>
        </div>

        {/* Modal d'ajout */}
        {showAddModal && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Ajouter un salaire</h3>
              {error && (
                <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleAddSalaire} className="flex flex-col gap-3">
                <select
                  name="classe"
                  required
                  value={formData.classe}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                >
                  <option value="">Sélectionner une classe</option>
                  {allClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.niveau}
                    </option>
                  ))}
                </select>
                
                <select
                  name="professeur"
                  required
                  value={formData.professeur}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                  disabled={!formData.classe}
                >
                  <option value="">Sélectionner un professeur</option>
                  {formData.classe && getProfesseursFiltres().map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} {p.prenom}
                    </option>
                  ))}
                  {formData.classe && getProfesseursFiltres().length === 0 && (
                    <option disabled>Aucun professeur pour cette classe</option>
                  )}
                </select>
                
                <select
                  name="matiere"
                  required
                  value={formData.matiere}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                  disabled={!formData.classe || !formData.professeur}
                >
                  <option value="">Sélectionner une matière</option>
                  {getMatieresFiltreesParProfesseur().map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                  {formData.classe && formData.professeur && getMatieresFiltreesParProfesseur().length === 0 && (
                    <option disabled>Ce professeur n'a pas de matière dans cette classe</option>
                  )}
                </select>
                
                <input
                  name="montant"
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Montant en Ariary"
                  value={formData.montant}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                />
                
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setError("");
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    disabled={!formData.classe || !formData.professeur || !formData.matiere || !formData.montant}
                  >
                    Ajouter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de modification */}
        {showEditModal && selectedSalaire && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 dark:text-gray-100">Modifier le salaire</h3>
              {error && (
                <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleEditSalaire} className="flex flex-col gap-3">
                <select
                  name="classe"
                  required
                  value={formData.classe}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                >
                  {allClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.niveau}
                    </option>
                  ))}
                </select>
                <select
                  name="professeur"
                  required
                  value={formData.professeur}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                >
                  {getProfesseursFiltres().map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nom} {p.prenom}
                    </option>
                  ))}
                </select>
                <select
                  name="matiere"
                  required
                  value={formData.matiere}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                >
                  {matieresPourEdition.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nom}
                    </option>
                  ))}
                </select>
                <input
                  name="montant"
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Montant"
                  value={formData.montant}
                  onChange={handleInputChange}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 dark:text-gray-100"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedSalaire(null);
                      setError("");
                    }}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Annuler
                  </button>
                  <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                    Modifier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">#</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Professeur</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Classe</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Matière</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Montant</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-40">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="mt-2">Chargement des données...</p>
                  </td>
                </tr>
              ) : salairesFiltres.length > 0 ? (
                salairesFiltres.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                      {getProfesseurName(item.professeur)}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                      {getClasseName(item.classe)}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                      {getMatiereName(item.matiere)}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-100 font-medium">
                      {parseFloat(item.montant).toLocaleString('fr-FR')} Ar
                    </td>
                    <td className="px-6 py-4 w-40 flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 font-medium transition"
                        onClick={() => prepareEdit(item)}
                      >
                      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                      </svg>
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 font-medium transition"
                        onClick={() => handleDeleteSalaire(item.id)}
                      >
                      <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                      </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {salaires.length === 0 
                      ? "Aucun salaire enregistré. Cliquez sur 'Ajouter' pour commencer." 
                      : selectedClasse 
                        ? `Aucun salaire trouvé pour la classe ${getClasseName(selectedClasse)}`
                        : "Aucun salaire trouvé"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SalaireProf;
