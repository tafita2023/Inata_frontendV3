import React, { useState, useEffect } from "react";
import axios from "axios";

// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function FraisScolarite() {
  const [classes, setClasses] = useState([]); // Frais existants
  const [allClasses, setAllClasses] = useState([]); // Toutes les classes pour dropdown
  const [selectedFrais, setSelectedFrais] = useState(null); // Pour modifier
  const [newMontant, setNewMontant] = useState("");
  const [newClasse, setNewClasse] = useState(""); // Pour modifier ou ajouter
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const token = localStorage.getItem("authToken");

  // Charger les frais et toutes les classes
  useEffect(() => {
    if (!token) return;

    AxiosInstance
      .get("/api/admin/frais-classe/")
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));

    AxiosInstance
      .get("/api/admin/classes/")
      .then((res) => setAllClasses(res.data))
      .catch((err) => console.error(err));
  }, [token]);

  // Ouvrir popup Modifier
  const handleEdit = (frais) => {
    setSelectedFrais(frais);
    setNewMontant(frais.montant);
    setNewClasse(frais.classe); // id de la classe
    setShowModal(true);
  };

  // Sauvegarder modification
  const handleSave = async () => {
    if (!selectedFrais || !newMontant || !newClasse) return;

    try {
      await AxiosInstance.put(
        `/api/admin/frais-classe/${selectedFrais.id}/`,
        { classe: newClasse, montant: newMontant }
      );

      setClasses((prev) =>
        prev.map((f) =>
          f.id === selectedFrais.id
            ? { ...f, classe: newClasse, montant: newMontant, classe_niveau: allClasses.find(c => c.id === newClasse).niveau }
            : f
        )
      );

      setShowModal(false);
      setSelectedFrais(null);
      setNewMontant("");
      setNewClasse("");
      alert("Ajouter avec success!");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour des frais");
    }
  };

  // Supprimer un frais
  const handleDelete = async (fraisId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce frais ?")) return;

    try {
      await AxiosInstance.delete(
        `/api/admin/frais-classe/${fraisId}/`)

      setClasses((prev) => prev.filter((f) => f.id !== fraisId));
      alert("Ecolage ajouter avec success!");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  // Ouvrir popup Ajouter
  const handleAdd = () => {
    setNewMontant("");
    setNewClasse("");
    setShowAddModal(true);
  };

  // Sauvegarder nouvel ajout
  const handleAddSave = async () => {
    if (!newClasse || !newMontant) return;

    try {
      const res = await AxiosInstance.post(
        `/api/admin/frais-classe/`,
        { classe: newClasse, montant: newMontant }
      );

      const classeObj = allClasses.find((c) => c.id === newClasse);
      setClasses((prev) => [...prev, { ...res.data, classe_niveau: classeObj.niveau }]);
      setShowAddModal(false);
      setNewMontant("");
      setNewClasse("");
      alert("Ecolage ajouter avec success!");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout des frais");
    }
  };

  // Classes disponibles pour ajouter (exclure celles déjà avec frais)
  const availableClasses = allClasses.filter(
    (c) => !classes.some((f) => f.classe === c.id)
  );

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Frais de scolarité par classe
        </h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Ajouter
        </button>
      </header>

      <div className="p-3 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                #
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                Classe
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300">
                Montant
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-300 w-40">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {classes.map((frais, index) => (
              <tr key={frais.id}>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">{index + 1}</td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {frais.classe_niveau 
                    ? frais.classe_niveau 
                    : allClasses.find(c => c.id === frais.classe)?.niveau ?? "–"}
                </td>
                <td className="px-6 py-4 text-gray-800 dark:text-gray-100">
                  {frais.montant} Ar
                </td>
                <td className="px-6 py-4 w-40 flex gap-2">
                  <button
                    onClick={() => handleEdit(frais)}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(frais.id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popups Modifier et Ajouter restent inchangés */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Modifier les frais
            </h3>

            <select
              value={newClasse}
              onChange={(e) => setNewClasse(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionnez une classe</option>
              {allClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.niveau}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={newMontant}
              onChange={(e) => setNewMontant(e.target.value)}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-red-300 hover:bg-red-400"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Ajouter des frais
            </h3>

            <select
              value={newClasse}
              onChange={(e) => setNewClasse(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md mb-4 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">Sélectionnez une classe</option>
              {availableClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.niveau}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={newMontant}
              onChange={(e) => setNewMontant(e.target.value)}
              placeholder="Montant"
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-gray-100"
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSave}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FraisScolarite;
