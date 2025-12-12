import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';

function Salaire() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paiements, setPaiements] = useState([]);
  const [professeurs, setProfesseurs] = useState([]);
  const [salaires, setSalaires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProfessors, setLoadingProfessors] = useState(true);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalProfOpen, setIsModalProfOpen] = useState(false);
  const [isModalMonthOpen, setIsModalMonthOpen] = useState(false);
  const [selectedProf, setSelectedProf] = useState(null);
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [montantTotal, setMontantTotal] = useState(0);

  // Récupérer le token depuis localStorage
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");
  
  const api = axios.create({
    baseURL: "http://127.0.0.1:8000",
    headers: { 
      Authorization: token ? `Bearer ${token}` : '',
      "Content-Type": "application/json"
    }
  });

  const availableMonths = [
    { id: 1, name: 'Janvier' }, { id: 2, name: 'Février' }, { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' }, { id: 5, name: 'Mai' }, { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' }, { id: 8, name: 'Août' }, { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' }, { id: 11, name: 'Novembre' }, { id: 12, name: 'Décembre' },
  ];

  // Fetch des professeurs séparément
  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        setLoadingProfessors(true);
        const response = await api.get('/api/admin/professeurs/');
        console.log('Professeurs chargés:', response.data);
        if (Array.isArray(response.data)) {
          setProfesseurs(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setProfesseurs(response.data.data);
        } else if (response.data && Array.isArray(response.data.professeurs)) {
          setProfesseurs(response.data.professeurs);
        } else {
          console.warn('Format de données inattendu pour les professeurs:', response.data);
          setProfesseurs([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des professeurs:', error);
        setErrorMessage('Impossible de charger la liste des professeurs');
        
        // Données de test pour débogage
        setProfesseurs([
          { id: 1, nom: 'Dupont', prenom: 'Jean' },
          { id: 2, nom: 'Martin', prenom: 'Sophie' },
          { id: 3, nom: 'Durand', prenom: 'Pierre' }
        ]);
      } finally {
        setLoadingProfessors(false);
      }
    };

    fetchProfesseurs();
  }, []);

  // Fetch des paiements et salaires
  useEffect(() => {
    const fetchOtherData = async () => {
      try {
        setLoading(true);
        const [resPaiements, resSalaires] = await Promise.all([
          api.get('/api/paiements-prof/'),
          api.get('/api/salaires-prof/')
        ]);
        
        console.log('Paiements chargés:', resPaiements.data);
        console.log('Salaires chargés:', resSalaires.data);
        
        // Gérer différents formats de réponse
        const paiementsData = Array.isArray(resPaiements.data) 
          ? resPaiements.data 
          : (resPaiements.data?.data || resPaiements.data?.paiements || []);
        
          const salairesData = Array.isArray(resSalaires.data)
          ? resSalaires.data
          : (resSalaires.data?.data || resSalaires.data?.salaires || []);
        
        const normalizedSalaires = salairesData.map(s => ({
          ...s,
          professeur: s.professeur?.id || s.professeur_id || null,
          classe: s.classe?.id || s.classe_id || null,
          matiere: s.matiere?.id || s.matiere_id || null,
          montant: parseFloat(s.montant || 0),
        }));
        
        setSalaires(normalizedSalaires);
        
        setPaiements(paiementsData);
        setSalaires(salairesData);
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        if (err.response?.status === 401) {
          setErrorMessage('Session expirée. Veuillez vous reconnecter.');
        } else {
          setErrorMessage('Erreur lors du chargement des données');
        }
        setPaiements([]);
        setSalaires([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOtherData();
  }, []);

  // Calculer le montant total quand le professeur ou les mois changent
  useEffect(() => {
    if (selectedProf && selectedMonths.length > 0) {
      calculateMontantTotal();
    } else {
      setMontantTotal(0);
    }
  }, [selectedProf, selectedMonths]);

  // Calculer le salaire total du professeur pour les mois sélectionnés
  const calculateMontantTotal = () => {
    if (!selectedProf || selectedMonths.length === 0) return 0;
  
    const salaireMensuel = getSalaireMensuel(selectedProf.id);
    const total = salaireMensuel * selectedMonths.length;
    setMontantTotal(total);
    return total;
  };
    
  // Récupérer les mois déjà payés pour ce professeur
  const getMoisDejaPayes = () => {
    if (!selectedProf) return [];
    
    const profPaiements = paiements.filter(p => {
      if (!p) return false;
      
      const profId = p.professeur_id 
        || (p.professeur && typeof p.professeur === "object" ? p.professeur.id : null)
        || (typeof p.professeur === "string" ? parseInt(p.professeur) : null);
      
      return profId && parseInt(profId) === parseInt(selectedProf.id);
    });
    
    console.log('Paiements du prof:', profPaiements);
    
    // Extraire tous les mois déjà payés
    const moisPayes = [];
    profPaiements.forEach(p => {
      if (p.mois && Array.isArray(p.mois)) {
        p.mois.forEach(mois => {
          if (mois && !moisPayes.includes(mois)) {
            moisPayes.push(mois);
          }
        });
      } else if (p.frais_mensuels && Array.isArray(p.frais_mensuels)) {
        p.frais_mensuels.forEach(f => {
          if (f.mois && !moisPayes.includes(f.mois)) {
            moisPayes.push(f.mois);
          }
        });
      }
    });
    
    console.log('Mois déjà payés:', moisPayes);
    return moisPayes;
  };

  const toggleMonthSelection = (month) => {
    const moisPayes = getMoisDejaPayes();
    
    // Vérifier si le mois est déjà payé
    if (moisPayes.includes(month.name)) {
      setErrorMessage(`Le mois ${month.name} est déjà payé pour ce professeur`);
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setSelectedMonths(prev =>
      prev.some(m => m.id === month.id)
        ? prev.filter(m => m.id !== month.id)
        : [...prev, month]
    );
    setErrorMessage('');
  };

  // Fonction pour effectuer le paiement
  const handlePaiement = async () => {
    if (!selectedProf || selectedMonths.length === 0) {
      setErrorMessage('Veuillez sélectionner un professeur et au moins un mois');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    if (montantTotal <= 0) {
      setErrorMessage('Le montant total doit être supérieur à 0');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setLoading(true);
    try {
      // Préparer les données pour l'API
      const data = {
        professeur_id: selectedProf.id,
        mois: selectedMonths.map(m => m.name),
        montant_total: montantTotal,
        statut: "payé"
      };

      console.log('Données envoyées au paiement:', data);

      const response = await api.post('/api/paiements-prof/', data);
      
      console.log('Réponse du paiement:', response.data);
      
      // Ajouter le nouveau paiement à la liste
      setPaiements(prev => [response.data, ...prev]);
      
      // Afficher un message de succès
      setSuccessMessage(`Paiement de ${montantTotal.toLocaleString('fr-FR')} Ar effectué avec succès pour ${selectedProf.nom} ${selectedProf.prenom}`);
      
      // Réinitialiser les modales et sélections
      setIsModalMonthOpen(false);
      setSelectedProf(null);
      setSelectedMonths([]);
      setMontantTotal(0);
      
      // Fermer le message de succès après 5 secondes
      setTimeout(() => setSuccessMessage(''), 5000);
      
    } catch (error) {
      console.error('Erreur lors du paiement:', error);
      let errorMsg = 'Erreur lors du paiement';
      
      if (error.response) {
        console.error('Détails erreur:', error.response.data);
        errorMsg = error.response.data?.detail 
          || error.response.data?.message 
          || (typeof error.response.data === 'object' 
              ? Object.values(error.response.data).join(', ') 
              : errorMsg);
      } else if (error.request) {
        errorMsg = 'Pas de réponse du serveur';
      } else {
        errorMsg = error.message;
      }
      
      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getMonthButtonStyle = (month) => {
    const moisPayes = getMoisDejaPayes();
    const isSelected = selectedMonths.some(m => m.id === month.id);
    
    if (moisPayes.includes(month.name)) {
      return 'px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-gray-200 cursor-not-allowed';
    }
    
    return `px-3 py-1 rounded-full text-sm font-medium transition ${
      isSelected
        ? 'bg-green-500 text-white hover:bg-green-600'
        : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
    }`;
  };

  // Calculer le salaire mensuel d'un professeur
  const getSalaireMensuel = (profId) => {
    return salaires
      .filter(s => parseInt(s.professeur) === parseInt(profId))
      .reduce((sum, s) => sum + s.montant, 0);
  };
  
  // Récupérer le nom complet du professeur
  const getProfesseurName = (paiement) => {
    if (!paiement) return 'Inconnu';
    
    if (paiement.professeur_nom) {
      return paiement.professeur_nom;
    }
    
    if (paiement.professeur && typeof paiement.professeur === 'object') {
      return `${paiement.professeur.nom || ''} ${paiement.professeur.prenom || ''}`.trim();
    }
    
    // Chercher dans la liste des professeurs
    const profId = paiement.professeur_id 
      || (paiement.professeur && typeof paiement.professeur === 'string' ? parseInt(paiement.professeur) : null);
    
    if (profId) {
      const prof = professeurs.find(p => p.id === profId);
      if (prof) {
        return `${prof.nom || ''} ${prof.prenom || ''}`.trim();
      }
    }
    
    return 'Professeur inconnu';
  };

  useEffect(() => { if (errorMessage) { const t = setTimeout(() => setErrorMessage(''), 3000); return () => clearTimeout(t); } }, [errorMessage]);
  useEffect(() => { if (successMessage) { const t = setTimeout(() => setSuccessMessage(''), 3000); return () => clearTimeout(t); } }, [successMessage]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-4">
            Les Paiements des professeurs
          </h1>

          <div className="mb-4 flex justify-end">
            <button
              onClick={() => setIsModalProfOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || loadingProfessors}
            >
              {loading ? 'Chargement...' : 'Payer un professeur'}
            </button>
          </div>

          {/* Modal sélection du professeur */}
          {isModalProfOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Sélectionnez le professeur
                </h2>
                
                <div className="mb-4">
                  {loadingProfessors ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Chargement des professeurs...</p>
                    </div>
                  ) : (
                    <>
                      <select
                        value={selectedProf?.id || ""}
                        onChange={(e) => {
                          const profId = e.target.value;
                          if (profId) {
                            const prof = professeurs.find(p => p.id === parseInt(profId));
                            setSelectedProf(prof);
                            console.log('Professeur sélectionné:', prof);
                          } else {
                            setSelectedProf(null);
                          }
                          setErrorMessage('');
                        }}
                        className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="" disabled>-- Choisissez un professeur --</option>
                        {professeurs.length > 0 ? (
                          professeurs.map(prof => (
                            <option key={prof.id} value={prof.id}>
                              {prof.nom} {prof.prenom}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>Aucun professeur disponible</option>
                        )}
                      </select>
                      
                      {professeurs.length === 0 && !loadingProfessors && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          Aucun professeur trouvé. Veuillez vérifier la connexion au serveur.
                        </p>
                      )}
                    </>
                  )}
                </div>
                
                {selectedProf && (
                  <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Salaire mensuel :{' '}
                      <span className="font-semibold">
                        {getSalaireMensuel(selectedProf.id).toLocaleString('fr-FR')} Ar
                      </span>
                    </p>
                    {getSalaireMensuel(selectedProf.id) === 0 && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        ⚠ Ce professeur n'a pas de salaire défini
                      </p>
                    )}
                  </div>
                )}
                
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setIsModalProfOpen(false);
                      setSelectedProf(null);
                      setErrorMessage('');
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => {
                      if (selectedProf) {
                        const salaireMensuel = getSalaireMensuel(selectedProf.id);
                        
                        if (salaireMensuel === 0) {
                          setErrorMessage('Ce professeur n\'a pas de salaire défini. Veuillez d\'abord définir son salaire.');
                          setTimeout(() => setErrorMessage(''), 4000);
                          return;
                        }
                        
                        setIsModalProfOpen(false);
                        setIsModalMonthOpen(true);
                        setSelectedMonths([]);
                        setErrorMessage('');
                      } else {
                        setErrorMessage('Veuillez sélectionner un professeur');
                        setTimeout(() => setErrorMessage(''), 3000);
                      }
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                    disabled={loading || !selectedProf}
                  >
                    Suivant
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal sélection des mois */}
          {isModalMonthOpen && selectedProf && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Payer {selectedProf.nom} {selectedProf.prenom}
                </h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Sélectionnez les mois à payer :
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {availableMonths.map(month => (
                      <button
                        key={month.id}
                        type="button"
                        onClick={() => toggleMonthSelection(month)}
                        className={getMonthButtonStyle(month)}
                        disabled={getMoisDejaPayes().includes(month.name) || loading}
                      >
                        {month.name}
                      </button>
                    ))}
                  </div>
                  
                  {selectedMonths.length > 0 && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded">
                      <p className="font-medium text-gray-800 dark:text-gray-200">
                        Mois sélectionnés : {selectedMonths.map(m => m.name).join(', ')}
                      </p>
                      <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-2">
                        Montant total : {montantTotal.toLocaleString('fr-FR')} Ar
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ({selectedMonths.length} mois × {getSalaireMensuel(selectedProf.id).toLocaleString('fr-FR')} Ar)
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-4 justify-end">
                  <button
                    onClick={() => {
                      setIsModalMonthOpen(false);
                      setSelectedMonths([]);
                      setErrorMessage('');
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition disabled:opacity-50"
                    disabled={loading}
                  >
                    Retour
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition disabled:opacity-50"
                    onClick={handlePaiement}
                    disabled={selectedMonths.length === 0 || loading || montantTotal <= 0}
                  >
                    {loading ? 'Paiement en cours...' : `Payer ${montantTotal.toLocaleString('fr-FR')} Ar`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Historique des paiements */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Historique des paiements
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Chargement des paiements...</p>
                </div>
              ) : (!paiements || paiements.length === 0) ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  Aucun paiement trouvé
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Professeur</th>
                        <th className="p-3 text-left">Mois</th>
                        <th className="p-3 text-left">Montant</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {Array.isArray(paiements) && paiements.map((p, index) => (
                        <tr key={p.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{getProfesseurName(p)}</td>
                          <td className="p-3">
                            {p.mois && Array.isArray(p.mois)
                              ? p.mois.join(", ")
                              : p.frais_mensuels?.length
                                ? p.frais_mensuels.map(f => f.mois).join(", ")
                                : "-"}
                          </td>
                          <td className="p-3 font-medium">{parseFloat(p.montant_total || 0).toLocaleString('fr-FR')} Ar</td>
                          <td className="p-3">
                            {p.date_creation 
                              ? new Date(p.date_creation).toLocaleDateString('fr-FR')
                              : p.created_at
                              ? new Date(p.created_at).toLocaleDateString('fr-FR')
                              : 'Date inconnue'}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                p.statut?.toLowerCase() === "payé"
                                  ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                                  : p.statut?.toLowerCase() === "en attente"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                                  : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                              }`}
                            >
                              {p.statut || "Non payé"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </main>

        <Footer />
        <Banner />
      </div>
    </div>
  );
}

export default Salaire;