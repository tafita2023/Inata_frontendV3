import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
import Photo from '../../images/user-36-06.jpg';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Utilisateur() {
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedClasse, setSelectedClasse] = useState("");
    const [classes, setClasses] = useState([]);

    const handleGenerateLink = async (role, classeId = null) => {
      try {
        const backendRoleMap = {
          admin: 'admin',
          prof: 'prof',
          etud: 'etud',
        };
        const backendRole = backendRoleMap[role];
    
        if (!backendRole) {
          setErrorMessage('Rôle invalide');
          setSuccessMessage('');
          return;
        }
    
        const payload = { role: backendRole };
        if (backendRole === 'etud' && classeId) {
          payload.classe_id = classeId;
        }
    
        const response = await AxiosInstance.post('/api/admin/generate-invite/', payload);
    
        if ((response.status === 201 || response.status === 200) && response.data.invite_link) {
          setInviteLink(response.data.invite_link);
          setIsModalOpen(true);
          setSuccessMessage('Lien généré avec succès');
          setErrorMessage('');
        } else {
          setIsModalOpen(false);
          setErrorMessage('Impossible de générer le lien');
          setSuccessMessage('');
        }
      } catch (error) {
        console.error('Erreur:', error);
        setIsModalOpen(false);
        let message = 'Erreur de connexion au serveur';
        if (error.response) {
          const status = error.response.status;
          if (status === 401) message = 'Session expirée, veuillez vous reconnecter';
          else if (status === 403) message = 'Permission refusée - Seuls les administrateurs peuvent générer des liens';
          else message = `Erreur: ${error.response.data?.error || error.message}`;
        }
        setErrorMessage(message);
        setSuccessMessage('');
      }
    };
                  
    const handleUpdateUser = async () => {
        if (!selectedUser) return;
      
        try {
          const response = await AxiosInstance.patch(
            `/api/admin/utilisateurs/modifier/${selectedUser.id}/`,
            {
              role: updatedRole,
              is_active: updatedStatus === 'active',
            }
          );
      
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUser.id
                ? { ...user, role: updatedRole, is_active: updatedStatus === 'active' }
                : user
            )
          );
      
          setSuccessMessage('Utilisateur mis à jour avec succès');
          setErrorMessage('');
          setUpdateModal(false);
        } catch (error) {
          console.error('Erreur lors de la mise à jour', error);
          setErrorMessage('Échec de la mise à jour');
          setSuccessMessage('');
        }
      };
        
      const handleDeleteUser = async () => {
        if (!userToDelete) return;
      
        try {
          await AxiosInstance.delete(`/api/admin/utilisateurs/supprimer/${userToDelete.id}/`);
      
          setUsers((prevUsers) => prevUsers.filter(user => user.id !== userToDelete.id));
          setSuccessMessage('Utilisateur supprimé avec succès');
          setErrorMessage('');
          setDeleteModal(false);
          setUserToDelete(null);
        } catch (error) {
          console.error('Erreur lors de la suppression', error);
          setErrorMessage("Échec de la suppression de l'utilisateur");
          setSuccessMessage('');
          setIsDeleteModalOpen(false);
        }
      };
      

    useEffect(() => {
    const fetchUsers = async () => {
        try {
        const response = await AxiosInstance.get('/api/admin/utilisateurs/');
        setUsers(response.data);
        setErrorMessage(''); 
        } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs', error);
        setErrorMessage('Erreur lors du chargement des utilisateurs');
        }
    };

    fetchUsers();
    }, []);

    useEffect(() => {
      const fetchClasses = async () => {
        try {
          const response = await AxiosInstance.get('/api/admin/classes/');
          setClasses(response.data);
        } catch (error) {
          console.error("Erreur récupération classes:", error);
        }
      };
      fetchClasses();
    }, []);    

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


    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('etud');
    const [inviteLink, setInviteLink] = useState('');
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [updatedRole, setUpdatedRole] = useState('');
    const [updatedStatus, setUpdatedStatus] = useState('');
    const [filterRole, setFilterRole] = useState('admin');
    const [filterClasse, setFilterClasse] = useState('');
    const [userToDelete, setUserToDelete] = useState(null);

    const [deleteModal, setDeleteModal] = useState(false);
    const formatPhone = (phone) => {
      if (!phone) return "";
      const digits = phone.replace(/\D/g, "");
      const match = digits.match(/^(\d{3})(\d{2})(\d{3})(\d{2})$/);
      return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
    };
  
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
                        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Les utilisateurs</h1>
                        
                        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            Filtre par rôle
                        </p>
                        <select
                        id="filterRole"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-8 w-full xs:w-auto min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem_1rem]">
                            <option value="admin">Administrateur</option>
                            <option value="prof">Professeur</option>
                            <option value="etud">Etudiant</option>
                            <option value="diplome">Diplomé</option>
                        </select>
                        {filterRole === 'etud' && (
                          <>
                            <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap pl-4">
                              Filtre par classe
                            </p>
                            <select
                              value={filterClasse}
                              onChange={(e) => setFilterClasse(e.target.value)}
                              className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 pr-8 w-full xs:w-auto min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem_1rem]"
                            >
                              <option value="">Toutes les classes</option>
                              {classes.map((c) => (
                                <option key={c.id} value={c.niveau}>{c.niveau}</option>
                              ))}
                            </select>
                          </>
                        )}
                        </div>                    
                    </div>
                    <div className="flex gap-2">
                  <button
                    onClick={() => setIsRoleModalOpen(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
                  >
                    Inscription
                  </button>
                  <button
                    onClick={async () => {
                      try {
                                      const response = await AxiosInstance.post(
                          '/api/admin/promotion/'
                        );
                        setSuccessMessage(`Promotion réussie : ${response.data.promus} promus, ${response.data.redoublants} redoublants`);
                      } catch (error) {
                        setErrorMessage('Erreur lors de la promotion');
                      }
                    }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-sm hover:bg-indigo-600 transition"
                  >
                    Promouvoir
                  </button>
                </div>

                </div>


                {isRoleModalOpen && (
                  <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Sélectionnez un rôle
                      </h2>

                      {/* Choix du rôle */}
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        <option value="admin">Administrateur</option>
                        <option value="prof">Professeur</option>
                        <option value="etud">Étudiant</option>
                      </select>

                      {/* Choix de la classe seulement si rôle étudiant */}
                      {selectedRole === 'etud' && (
                        <select
                          value={selectedClasse}
                          onChange={(e) => setSelectedClasse(e.target.value)}
                          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                          <option value="">Sélectionnez une classe</option>
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>{c.niveau}</option>
                          ))}
                        </select>
                      )}

                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setIsRoleModalOpen(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={async () => {
                            await handleGenerateLink(selectedRole, selectedClasse);
                            setIsRoleModalOpen(false);
                            setIsModalOpen(true);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Générer le lien
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Modal du lien d'inscription */}
                {isModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Lien d’inscription
                        </h2>

                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                            Copiez le lien suivant pour l'inscription
                        </p>

                        <input className="bg-white dark:bg-gray-800 rounded-sm shadow text-sm px-2 py-2 mb-4 w-full" type="text" value={inviteLink} readOnly/>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(inviteLink);
                                    setIsModalOpen(false);
                                }}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                Copier
                            </button>
                        </div>   
                        </div>
                    </div>
                )}

                {/* Modal de modification */}
                {updateModal && (
                    <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                            Formulaire de modifiction
                        </h2>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                                Rôle
                            </label>
                            <select
                            value={updatedRole}
                            onChange={(e) => setUpdatedRole(e.target.value)}
                            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 mb-4 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            >
                            <option value="">Choisir un rôle</option>
                            <option value="admin">Administrateur</option>
                            <option value="prof">Professeur</option>
                            <option value="etud">Étudiant</option>
                        </select>                        
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
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
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
                                onClick={handleUpdateUser}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                Enregistrer
                            </button>
                        </div>   
                        </div>
                    </div>
                )}

                {/* Modal de suppression */}
                {deleteModal && (
                    <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 max-w-full">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Êtes-vous sûr de vouloir supprimer {userToDelete?.prenom} ?
                        </h2>

                        <div className="flex space-x-4">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Fermer
                            </button>
                            <button
                                onClick={handleDeleteUser}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                                >
                                Supprimer
                            </button>
                        </div>   
                        </div>
                    </div>
                )}

                {/* Information sur l'utilisateur */}
                {viewModal && selectedUser && (
                  <div className="fixed inset-0 backdrop-blur-none bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96 sm:w-[500px] max-h-[100vh] overflow-y-auto break-words">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Informations sur l'utilisateur
                      </h2>

                      <div className="mb-5 flex justify-center">
                      <img
                        src={
                          selectedUser.photo
                            ? `${selectedUser.photo}`  // préfixe si chemin relatif
                            : Photo
                        }
                        alt="Photo de l'utilisateur"
                        className="w-38 h-40 rounded object-cover shadow mb-4"
                      />
                      </div>

                      <div className="mb-5 grid">
                        <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Nom :</span>
                          <span className="font-medium">{selectedUser.nom}</span>
                        </div>

                        <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Prénom :</span>
                          <span className="font-medium">{selectedUser.prenom}</span>
                        </div>

                        {selectedUser.role === "etud" && (
                          <>
                            <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                              <span className="text-gray-500 dark:text-gray-400 mr-1">Date de naissance :</span>
                              <span className="font-medium">{selectedUser.date_naissance}</span>
                            </div>

                            <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                              <span className="text-gray-500 dark:text-gray-400 mr-1">Lieu de naissance :</span>
                              <span className="font-medium">{selectedUser.lieu_naissance}</span>
                            </div>

                            <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                              <span className="text-gray-500 dark:text-gray-400 mr-1">Classe :</span>
                              <span className="font-medium">{selectedUser.classe}</span>
                            </div>
                          </>
                        )}

                        <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Rôle :</span>
                          <span className="font-medium">
                            {selectedUser.role === "etud" ? "Étudiant" : selectedUser.role === "prof" ? "Professeur" : selectedUser.role === "diplome" ? "Diplomé" : selectedUser.role}
                          </span>
                        </div>

                        <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Email :</span>
                          <span className="font-medium">{selectedUser.email}</span>
                        </div>

                        <div className="inline-flex items-center text-sm text-gray-900 dark:text-white mb-2">
                          <span className="text-gray-500 dark:text-gray-400 mr-1">Téléphone :</span>
                          <span className="font-medium">{formatPhone(selectedUser.phone)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <button
                          onClick={() => setViewModal(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Fermer
                        </button>
                      </div>
                    </div>
                  </div>
                )}


            </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Liste des utilisateurs</h2>
                    <div className="overflow-x-auto">
                    <table className="table-auto w-full text-left">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                        <tr>
                            <th className="p-2">Id</th>
                            <th className="p-2">Nom</th>
                            <th className="p-2">Prenom</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Statut</th>
                            <th className="p-2">Action</th>
                        </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                        {users
                        .filter(user => !filterRole || user.role === filterRole)
                        .filter(user => !filterClasse || user.classe === filterClasse)
                        .map((user, index) => (
                        <tr key={user.id}>
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{user.nom}</td>
                            <td className="p-2">{user.prenom}</td>
                            <td className="p-2">{user.email}</td>
                            <td className={`p-2 ${user.is_active === true ? 'text-green-600' : 'text-red-600'}`}>
                              {user.is_active == true ? 'Actif' : 'Inactif'}
                            </td>

                            <td className="p-2">
                            <div className="flex items-center gap-3">
                              {/* Bouton information */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setViewModal(true);
                                }}
                                className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-700 p-2 mt-2 transition-colors duration-200"
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
                                    strokeWidth={2}
                                    d="M7 8h10M7 12h6m5-10H6a2 2 0 00-2 2v16l4-4h12a2 2 0 002-2V4a2 2 0 00-2-2z"
                                  />
                                </svg>
                              </button>
                              {/* Bouton Modifier */}
                              <button
                                onClick={() => {
                                  setSelectedUser(user);
                                  setUpdatedRole(user.role);
                                  setUpdatedStatus(user.is_active ? 'active' : 'inactive');
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
                                  setUserToDelete(user);
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
                            </div>
                            </td>
                        </tr>
                        ))}
                        {users.filter(user => (!filterRole || user.role === filterRole) && (!filterClasse || user.classe === filterClasse)).length === 0 && (
                          <tr>
                            <td colSpan="7" className="p-4 text-center text-gray-500 dark:text-gray-400">
                              Aucun utilisateur disponible pour ce filtre.
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

        <Banner />

      </div>
    </div>
    
  );
}

export default Utilisateur;