import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Matiere() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uniteOpen, setUniteOpen] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedUnite, setSelectedUnite] = useState('');
  const [unites, setUnites] = useState([]);
  const [uniteNom, setUniteNom] = useState('');
  const [matieres, setMatieres] = useState([]);
  const [matiereNom, setMatiereNom] = useState('');
  const [statut, setStatut] = useState('active');
  const [classes, setClasses] = useState([]);  
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedProfesseur, setSelectedProfesseur] = useState('');
  const [professeurs, setProfesseurs] = useState([]);
  const [selectedMatiereId, setSelectedMatiereId] = useState(null);
  const [matiereToDelete, setMatiereToDelete] = useState(null);
  const [selectedNiveau, setSelectedNiveau] = useState('');

  const fetchMatieres = async () => {
    try {
      let url = '/api/admin/matieres/?ordering=id';
          
      if (selectedNiveau) {
        url += `&classe=${selectedNiveau}`;
      }
      
      const response = await AxiosInstance.get(url);
      setMatieres(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des matières', error);
      setErrorMessage('Erreur lors du chargement des matières');
    }
  };

  useEffect(() => {
    fetchMatieres();
  }, [selectedNiveau]);

  const handleClasseChange = (e) => {
    setSelectedNiveau(e.target.value);
  };
  
  const handleAddMatiere = async () => {
    try {
      await AxiosInstance.post('/api/admin/matieres/', {
        nom: matiereNom,
        unite: selectedUnite, // 🔥 Correction: utiliser selectedUnite
        professeur: selectedProfesseur,
        classe: selectedClasse,
        is_active: statut === 'active',
      });

      await fetchMatieres();
      setSuccessMessage("Matière ajoutée avec succès !");
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error.response?.data || error.message);
      setErrorMessage("Erreur lors de l'ajout de la matière.");
    }
  };

  const handleUpdateMatiere = async () => {
    if (!selectedMatiereId) return;
  
    try {
      const updatedData = {
        nom: matiereNom,
        unite: selectedUnite, // 🔥 Correction: utiliser selectedUnite
        professeur: selectedProfesseur,
        classe: selectedClasse,
        is_active: statut === 'active',
      };
  
      // Mise à jour optimiste locale
      setMatieres(prevMatieres => 
        prevMatieres.map(matiere =>
          matiere.id === selectedMatiereId ? { ...matiere, ...updatedData } : matiere
        )
      );
  
      await AxiosInstance.put(`/api/admin/matieres/${selectedMatiereId}/`, updatedData);
  
      setSuccessMessage("Matière modifiée avec succès !");
      setUpdateModal(false);
      resetForm();
      
    } catch (error) {
      console.error("Erreur lors de la modification :", error.response?.data || error.message);
      setErrorMessage("Erreur lors de la modification de la matière.");
      fetchMatieres();
    }
  };  

  const resetForm = () => {
    setMatiereNom('');
    setSelectedUnite(''); // 🔥 Correction: reset selectedUnite
    setSelectedProfesseur('');
    setSelectedClasse('');
    setStatut('active');
    setSelectedMatiereId(null);
  };

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/classes/');
        setClasses(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des classes :', error);
      }
    };
    fetchClasses();
  }, []);

  const handleDeleteMatiere = async (matiereId) => {
    try {
      await AxiosInstance.delete(`/api/admin/matieres/${matiereId}/`);
      
      setSuccessMessage("Matière supprimée avec succès !");
      fetchMatieres();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setErrorMessage("Erreur lors de la suppression de la matière.");
    }
  };

  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/professeurs/');
        setProfesseurs(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des professeurs :', error);
      }
    };
    fetchProfesseurs();
  }, []);

  // Récupérer les unités
  useEffect(() => {
    const fetchUnites = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/unites/');
        setUnites(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des unités', error);
      }
    };
    fetchUnites();
  }, []);

  // Ajouter une unité
  const handleAddUnite = async () => {
    try {
      const response = await AxiosInstance.post('/api/admin/unites/', {
        nom: uniteNom,
      });

      // Mettre à jour l'état local
      setUnites(prevUnites => [...prevUnites, response.data]);

      // Fermer le modal et reset
      setUniteOpen(false);
      setUniteNom('');

      // Afficher message de succès
      setSuccessMessage("Unité ajoutée avec succès !");
      
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'unité :", error);
      
      // Message d'erreur spécifique
      if (error.response?.data?.nom) {
        setErrorMessage(error.response.data.nom[0]);
      } else if (error.response?.data?.detail) {
        setErrorMessage(error.response.data.detail);
      } else {
        setErrorMessage("Erreur lors de l'ajout de l'unité");
      }
    }
  };

  // Gestion des messages
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

  // Pré-remplir le formulaire de modification
  const openUpdateModal = (matiere) => {
    setSelectedMatiereId(matiere.id);
    setSelectedClasse(matiere.classe);
    setMatiereNom(matiere.nom);
    setSelectedUnite(matiere.unite || '');
    setSelectedProfesseur(matiere.professeur);
    setStatut(matiere.is_active ? 'active' : 'inactive');
    setUpdateModal(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
            {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0 w-full">
                <div className="flex items-start justify-between w-full">
                  <div>
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Les Matières</h1>
                    <div className="flex items-center mb-4">
                      <p className="mr-2">Filtre par classe</p>
                      <select
                        value={selectedNiveau}
                        onChange={handleClasseChange}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-4 min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem_1rem]"
                      >
                        <option value="">Toutes les classes</option>
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.niveau} {classe.nom}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="m-2 flex space-x-2">
                    <button onClick={() => setUniteOpen(true)} className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition">
                      Ajouter Unité
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition">
                      Ajouter Matières
                    </button>
                  </div>
                </div>

                {/* Modal d'ajout unité*/}
                {uniteOpen && (
                  <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-full">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Le formulaire d'ajout</h2>

                      {/* Unité */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Unité</p>
                      <input 
                        value={uniteNom}
                        onChange={(e) => setUniteNom(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full" 
                        type="text"
                        placeholder="Unité d'enseignement"
                      />

                      {/* Boutons */}
                      <div className="flex space-x-4 justify-end">
                        <button
                          onClick={() => setUniteOpen(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleAddUnite}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Ajouter
                        </button>
                      </div>   
                    </div>
                  </div>
                )}

                {/* Modal d'ajout matière*/}
                {isModalOpen && (
                  <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-full">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Le formulaire d'ajout</h2>

                      {/* Classe */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Classe</p>
                      <select
                        value={selectedClasse}
                        onChange={(e) => setSelectedClasse(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner une classe</option>
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.niveau} {classe.nom}
                          </option>
                        ))}
                      </select>

                      {/* Unité */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Unité</p>
                      <select
                        value={selectedUnite}
                        onChange={(e) => setSelectedUnite(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner une unité</option>
                        {unites.map((unite) => (
                          <option key={unite.id} value={unite.id}>
                            {unite.nom}
                          </option>
                        ))}
                      </select>

                      {/* Matière */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Matière</p>
                      <input 
                        value={matiereNom}
                        onChange={(e) => setMatiereNom(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full" 
                        type="text"
                        placeholder="Nom de la matière"
                      />

                      {/* Professeur */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Professeur</p>
                      <select
                        value={selectedProfesseur}
                        onChange={(e) => setSelectedProfesseur(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner un professeur</option>
                        {professeurs.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nom} {prof.prenom}
                          </option>
                        ))}
                      </select>

                      {/* Statut */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Statut</p>
                      <select 
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="active">En cours</option>
                        <option value="inactive">Terminé</option>
                      </select>

                      {/* Boutons */}
                      <div className="flex space-x-4 justify-end">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleAddMatiere}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Ajouter
                        </button>
                      </div>   
                    </div>
                  </div>
                )}

                {/* Modal de modification */}
                {updateModal && (
                  <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-full">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Formulaire de modification</h2>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Classe</p>
                      <select
                        value={selectedClasse}
                        onChange={(e) => setSelectedClasse(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner une classe</option>
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.niveau} {classe.nom}
                          </option>
                        ))}
                      </select>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Unité</p>
                      <select
                        value={selectedUnite}
                        onChange={(e) => setSelectedUnite(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner une unité</option>
                        {unites.map((unite) => (
                          <option key={unite.id} value={unite.id}>
                            {unite.nom}
                          </option>
                        ))}
                      </select>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Matière</p>
                      <input
                        type="text"
                        value={matiereNom}
                        onChange={(e) => setMatiereNom(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      />

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Professeur</p>
                      <select
                        value={selectedProfesseur}
                        onChange={(e) => setSelectedProfesseur(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="">Sélectionner un professeur</option>
                        {professeurs.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nom} {prof.prenom}
                          </option>
                        ))}
                      </select>

                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">Statut</p>
                      <select
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                      >
                        <option value="active">En cours</option>
                        <option value="inactive">Terminé</option>
                      </select>

                      <div className="flex space-x-4 justify-end">
                        <button
                          onClick={() => setUpdateModal(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleUpdateMatiere}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Modifier
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal de suppression */}
                {deleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-full mx-4">
                    <div className="flex flex-col items-center">
                        {/* Icône d'avertissement */}
                        <div className="mb-4 text-red-500 dark:text-red-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        </div>
                        
                        <h2 className="text-lg font-semibold mb-2 text-center text-gray-900 dark:text-gray-100">
                        Confirmer la suppression
                        </h2>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 text-center">
                        Êtes-vous sûr de vouloir supprimer la matière <span className="font-medium">"{matiereToDelete?.nom}"</span> ?
                        <br />
                        Cette action est irréversible.
                        </p>

                        <div className="flex space-x-4 w-full">
                        <button
                            onClick={() => setDeleteModal(false)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => {
                            handleDeleteMatiere(matiereToDelete.id);
                            setDeleteModal(false);
                            }}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-200 flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer
                        </button>
                        </div>
                    </div>
                    </div>
                </div>
                )}
              </div>
            </div>

          {/* Liste des matières */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Liste des matières</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="p-2">#</th>
                      <th className="p-2">Unité</th>
                      <th className="p-2">Matières</th>
                      <th className="p-2">Niveau</th>
                      <th className="p-2">Professeurs</th>
                      <th className="p-2">Statut</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                    {matieres
                      .filter(matiere => !selectedNiveau || matiere.classe.toString() === selectedNiveau)
                      .map((matiere, index) => {
                        const prof = professeurs.find(p => p.id === matiere.professeur);
                        const classe = classes.find(c => c.id === matiere.classe);
                        const unite = unites.find(u => u.id === matiere.unite);
                        return (
                          <tr key={matiere.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{unite ? unite.nom : '-'}</td>
                            <td className="p-2">{matiere.nom}</td>
                            <td className="p-2">{classe ? `${classe.niveau}` : ''}</td>
                            <td className="p-2">{prof ? `${prof.nom} ${prof.prenom}` : ''}</td>
                            <td className={`p-2 ${matiere.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {matiere.is_active ? 'En cours' : 'Terminé'}
                            </td>
                            <td className="p-2">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => openUpdateModal(matiere)}
                                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 transition-colors duration-200"
                                  title="Modifier"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
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
                                  onClick={() => {
                                    setMatiereToDelete(matiere);
                                    setDeleteModal(true);
                                  }}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 transition-colors duration-200"
                                  title="Supprimer"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5"
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
                            </td>
                          </tr>
                        );
                      })}
                    {matieres.filter(matiere => !selectedNiveau || matiere.classe.toString() === selectedNiveau).length === 0 && (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400">
                          Aucune matière disponible {selectedNiveau ? 'pour cette classe' : ''}.
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

      </div>
    </div>
  );
}

export default Matiere;