import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
import { set } from 'date-fns';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Classe() {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [ajoutModal, setAjoutModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [deleteModal, setDeleteModal] = useState(false);

    const [classes, setClasses] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [description, setDescription] = useState('');
    const [niveau, setNiveau] = useState('');
    const [selectedClasse, setSelectedClasse] = useState(null);
    const [classeToDelete, setClasseToDelete] = useState(null);

const fetchClasses = async () => {
    try {  
      const response = await AxiosInstance.get('/api/admin/classes/');
      setClasses(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Erreur lors du chargement des classes', error);
      setErrorMessage('Erreur lors du chargement des classes');
    }
  };
  
  useEffect(() => {
    fetchClasses();
  }, []);
  
const handleAddClasse = async () => {
    try {
      await AxiosInstance.post('/api/admin/classes/', {
        niveau: niveau,
        description: description
      });
  
      await fetchClasses();
  
      setSuccessMessage("Classe ajoutée avec succès !");
      setErrorMessage("");
      setNiveau("");
      setDescription("");
      setAjoutModal(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      setErrorMessage("Erreur lors de l'ajout de la classe.");
      setSuccessMessage("");
      setAjoutModal(false);
    }
};

const handleUpdateClasse = async () => {
    if (!selectedClasse) return;
  
    try {  
      // Convertir updatedStatus en booléen
      const isActiveBool = updatedStatus === 'active' || updatedStatus === true;
  
      const response = await AxiosInstance.patch(
        `/api/admin/classes/${selectedClasse.id}/`,
        {
          niveau: niveau,
          description: description,
          is_active: isActiveBool,
        }
      );
  
      setClasses((prevClasses) =>
        prevClasses.map((classe) =>
          classe.id === selectedClasse.id
            ? { ...classe, niveau: niveau, description: description, is_active: isActiveBool }
            : classe
        )
      );
  
      setSuccessMessage('Classe mise à jour avec succès !');
      setErrorMessage('');
      setUpdateModal(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour :', error);
      setErrorMessage('Erreur lors de la mise à jour de la classe.');
      setSuccessMessage('');
    }
  };
  
  const handleDeleteClasse = async (classeId) => {
    try {
      await AxiosInstance.delete(`/api/admin/classes/${classeId}/`);
  
      // Met à jour la liste des classes en retirant celle supprimée
      setClasses(prevClasses => prevClasses.filter(classe => classe.id !== classeId));
  
      setSuccessMessage("Classe supprimée avec succès !");
      setErrorMessage("");
      setDeleteModal(false);
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      setErrorMessage("Erreur lors de la suppression de la classe.");
      setSuccessMessage("");
      setDeleteModal(false);
    }
  };
    
  useEffect(() => {
    if (errorMessage) {
    const timer = setTimeout(() => {
        setErrorMessage('');
    }, 3000);
    return () => clearTimeout(timer);
    }
    }, [errorMessage]);

useEffect(() => {
    if (successMessage) {
    const timer = setTimeout(() => {
        setSuccessMessage('');
    }, 3000);
    return () => clearTimeout(timer);
    }
}, [successMessage]);

    
  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {successMessage && (
            <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
            )}
            {errorMessage && (
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
            )}

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
            <div className="mb-4 sm:mb-0 w-full">
                <div className="flex items-start justify-between w-full">
                    <div>
                        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Les Classes</h1>
                    </div>
                    <button onClick={() => setAjoutModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition">
                    Ajouter
                    </button>
                </div>

                {/* Modal de l'ajout d'une classe */}
                {ajoutModal && (
                    <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Formulaire d'ajout
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                Niveau
                            </label>

                            <input 
                            value={niveau}
                            onChange={(e) => setNiveau(e.target.value)}                            
                            className="bg-white dark:bg-gray-800 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full" type="text"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                Description
                            </label>

                            <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}                            
                            className="bg-white dark:bg-gray-800 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                            rows={4}
                            ></textarea>
                        </div>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setAjoutModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={handleAddClasse}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                Ajouter
                            </button>
                        </div>   
                        </div>
                    </div>
                )}

                {/* Modal de modification d'une classe */}
                {updateModal && (
                <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Formulaire de modification
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Niveau
                        </label>
                        <input
                        value={niveau}
                        onChange={(e) => setNiveau(e.target.value)}
                        className="bg-white dark:bg-gray-800 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                        type="text"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                        Description
                        </label>
                        <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white dark:bg-gray-800 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full"
                        rows={4}
                        />
                    </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                Status
                            </label>
                            <select
                            value={updatedStatus}
                            onChange={(e) => setUpdatedStatus(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                            <option value="active">En cours</option>
                            <option value="inactive">Terminé</option>
                        </select>                        
                        </div>

                    <div className="flex space-x-4">
                        <button
                        onClick={() => setUpdateModal(false)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                        Fermer
                        </button>
                        <button
                        onClick={handleUpdateClasse}
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
                        Êtes-vous sûr de vouloir supprimer la matière <span className="font-medium">"{classeToDelete?.niveau}"</span> ?
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
                            handleDeleteClasse(classeToDelete.id);
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

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Liste des classes</h2>
                    <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-2">Id</th>
                            <th className="p-2">Niveau</th>
                            <th className="p-2">Description</th>
                            <th className="p-2">Statut</th>
                            <th className="p-2">Action</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {classes
                        .map((classe, index) => (
                        <tr key={classe.id}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{classe.niveau}</td>
                            <td className="p-2">{classe.description}</td>
                            <td className={`p-2 ${classe.is_active === true ? 'text-green-600' : 'text-red-600'}`}>
                              {classe.is_active == true ? 'En cours' : 'Terminé'}
                            </td>
                            
                            <td className="p-2">
                              {/* Bouton Modifier */}
                              <button
                                onClick={() => {
                                    setSelectedClasse(classe);
                                    setNiveau(classe.niveau);
                                    setDescription(classe.description);
                                    setUpdatedStatus(classe.is_active ? 'active' : 'inactive');
                                    setUpdateModal(true);
                                }}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-700 p-2 transition-colors duration-200"
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

                              {/* Bouton Supprimer */}
                              <button
                                onClick={() => {
                                setClasseToDelete(classe);
                                setDeleteModal(true);
                            }}
                              
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-700 p-2 transition-colors duration-200"
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
                            </td>
                        </tr>
                        ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            </div>

          </div>
          <Footer />
        </main>

        <Banner />

      </div>
    </div>
  );
}

export default Classe;