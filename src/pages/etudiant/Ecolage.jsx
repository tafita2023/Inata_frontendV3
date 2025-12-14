import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
import { loadStripe } from "@stripe/stripe-js";
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

const stripePromise = loadStripe("pk_test_51S4zL6Fea6zLnBKddrJe9f6XK1Gk90KcNMsz4s5K6iiPubvxCxBEOj5Oob7iZI3kXvAxsmtOszrSIBg5CB7OLwRV00mInpPhSF");

function Ecolage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paiements, setPaiements] = useState([]);
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState([]);

  const availableMonths = [
    { id: 1, name: 'Janvier' }, { id: 2, name: 'Février' }, { id: 3, name: 'Mars' },
    { id: 4, name: 'Avril' }, { id: 5, name: 'Mai' }, { id: 6, name: 'Juin' },
    { id: 7, name: 'Juillet' }, { id: 8, name: 'Août' }, { id: 9, name: 'Septembre' },
    { id: 10, name: 'Octobre' }, { id: 11, name: 'Novembre' }, { id: 12, name: 'Décembre' },
  ];

  // ⚡ Gestion messages Stripe après redirection
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('success') === 'true') {
      setSuccessMessage('Paiement effectué avec succès !');
      fetchPaiements();
      window.history.replaceState({}, document.title, location.pathname);
    }
    if (params.get('canceled') === 'true') {
      setErrorMessage('Paiement annulé ou échoué.');
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search]);

  useEffect(() => { if (errorMessage) { const t = setTimeout(() => setErrorMessage(''), 5000); return () => clearTimeout(t); } }, [errorMessage]);
  useEffect(() => { if (successMessage) { const t = setTimeout(() => setSuccessMessage(''), 5000); return () => clearTimeout(t); } }, [successMessage]);

  const fetchPaiements = async () => {
    try {
      console.log('🔍 Récupération des paiements depuis: /api/etudiant/paiements/');
      
      // Utilisez l'URL complète avec /api/
      const res = await AxiosInstance.get('/api/etudiant/paiements/');
      
      console.log('✅ Réponse API:', {
        status: res.status,
        data: res.data,
        count: Array.isArray(res.data) ? res.data.length : 'inconnu'
      });
      
      // Debug: affichez les données brutes
      if (res.data) {
        console.log('📋 Données brutes reçues:', JSON.stringify(res.data, null, 2));
      }
      
      // Traitement selon différents formats possibles
      let paiementsData = [];
      
      if (Array.isArray(res.data)) {
        // Format 1: Tableau direct
        paiementsData = res.data;
        console.log(`📊 Format tableau: ${paiementsData.length} paiements`);
      } else if (res.data && res.data.results) {
        // Format 2: Pagination Django REST
        paiementsData = res.data.results;
        console.log(`📊 Format paginé: ${paiementsData.length} paiements`);
      } else if (res.data && res.data.paiements) {
        // Format 3: Votre format personnalisé
        paiementsData = res.data.paiements;
        console.log(`📊 Format personnalisé: ${paiementsData.length} paiements`);
      } else {
        console.warn('⚠ Format inconnu, tentative avec données directes');
        paiementsData = res.data || [];
      }
      
      // Debug chaque paiement
      console.log('📝 Détail des paiements:');
      paiementsData.forEach((p, i) => {
        console.log(`  ${i+1}. ID: ${p.id}, Statut: "${p.statut}", Montant: ${p.montant_total}, Date: ${p.date_creation}`);
        if (p.frais_mensuels && Array.isArray(p.frais_mensuels)) {
          console.log(`     Frais: ${p.frais_mensuels.map(f => f.mois).join(', ')}`);
        }
      });
      
      setPaiements(paiementsData);
      
    } catch (err) {
      console.error("❌ Erreur complète fetchPaiements:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        fullUrl: `${AxiosInstance.defaults.baseURL || ''}/api/etudiant/paiements/`
      });
      
      // Message d'erreur plus précis
      if (err.response) {
        if (err.response.status === 404) {
          setErrorMessage('Endpoint non trouvé. URL: /api/etudiant/paiements/');
        } else if (err.response.status === 401) {
          setErrorMessage('Non authentifié. Veuillez vous reconnecter.');
        } else {
          setErrorMessage(`Erreur serveur (${err.response.status}): ${err.response.data?.detail || 'Erreur inconnue'}`);
        }
      } else if (err.request) {
        setErrorMessage('Pas de réponse du serveur. Vérifiez votre connexion.');
      } else {
        setErrorMessage(`Erreur: ${err.message}`);
      }
    }
  };
    
  useEffect(() => { fetchPaiements(); }, []);

  // 🔹 Récupérer les mois déjà payés
  const getMoisDejaPayes = () => {
    let moisPayes = [];
    paiements.forEach(p => {
      if (p.frais_mensuels && Array.isArray(p.frais_mensuels)) {
        p.frais_mensuels.forEach(f => { if (f.mois) moisPayes.push(f.mois); });
      }
    });
    return moisPayes;
  };

  // 🔹 Sélection des mois
  const toggleMonthSelection = (month) => {
    const moisPayes = getMoisDejaPayes();
    if (moisPayes.includes(month.name)) {
      setErrorMessage(`Le mois ${month.name} est déjà payé`);
      return;
    }
    setSelectedMonths(prev => prev.some(m => m.id === month.id) ? prev.filter(m => m.id !== month.id) : [...prev, month]);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMonths([]);
  };

  const handlePaiement = async () => {
    if (selectedMonths.length === 0) {
      setErrorMessage('Veuillez sélectionner au moins un mois');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) { setErrorMessage('Token d\'authentification manquant'); setLoading(false); return; }

      const moisNoms = selectedMonths.map(m => m.name);

      // Création des frais pour tous les mois sélectionnés
      await Promise.all(
        moisNoms.map(mois => 
          AxiosInstance.post("/api/etudiant/ajouter-frais/", { mois }, 
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })
        )
      );

      // Récupérer les frais non payés correspondant aux mois sélectionnés
      const res = await AxiosInstance.get("/api/etudiant/frais_disponibles/", { headers: { Authorization: `Bearer ${token}` } });
      const fraisIds = res.data.filter(f => moisNoms.includes(f.mois)).map(f => f.id);

      if (fraisIds.length === 0) { setErrorMessage("Aucun frais disponible pour les mois sélectionnés."); setLoading(false); return; }

      // Créer session Stripe et rediriger
      const stripeRes = await AxiosInstance.post(
        "/api/paiements/stripe-session/",
        { frais_ids: fraisIds },
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      if (!stripeRes.data.session_id) throw new Error('Session ID non reçu du serveur');

      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId: stripeRes.data.session_id });
      if (error) { console.error('Erreur Stripe:', error); setErrorMessage(`Erreur Stripe: ${error.message}`); }

    } catch (err) {
      console.error('Erreur détaillée:', err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message || 'Erreur lors de la création du paiement';
      setErrorMessage(errorMsg);
    } finally { setLoading(false); }
  };

  // Style boutons mois avec mois payés grisés
  const getMonthButtonStyle = (month) => {
    const moisPayes = getMoisDejaPayes();
    const isSelected = selectedMonths.some(m => m.id === month.id);
    if (moisPayes.includes(month.name)) return 'px-3 py-1 rounded-full text-sm font-medium bg-gray-400 text-gray-200 cursor-not-allowed';
    return `px-3 py-1 rounded-full text-sm font-medium transition ${isSelected ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="grow px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-4">Les Paiements</h1>

          <div className="mb-4 flex justify-end">
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
              Payer les frais
            </button>
          </div>

          {/* Modal de sélection des mois */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Sélectionnez les mois à payer</h2>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {selectedMonths.length > 0 ? `${selectedMonths.length} mois sélectionné(s)` : 'Aucun mois sélectionné'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableMonths.map(month => (
                      <button
                        key={month.id}
                        onClick={() => toggleMonthSelection(month)}
                        className={getMonthButtonStyle(month)}
                        type="button"
                      >
                        {month.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition" disabled={loading}>Annuler</button>
                  <button onClick={handlePaiement} disabled={loading || selectedMonths.length === 0} className={`px-4 py-2 rounded transition ${loading || selectedMonths.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
                    {loading ? 'Redirection...' : `Payer (${selectedMonths.length})`}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Historique des paiements */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Historique des paiements</h2>
              {paiements.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">Aucun paiement trouvé</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                      <tr>
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Mois</th>
                        <th className="p-3 text-left">Montant</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                      {paiements.map((p, index) => (
                        <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="p-3">{index + 1}</td>
                          <td className="p-3">{p.frais_mensuels && p.frais_mensuels.length > 0 ? p.frais_mensuels.map(f => f.mois).join(", ") : '-'}</td>
                          <td className="p-3">{p.montant_total} Ar</td>
                          <td className="p-3">{new Date(p.date_creation).toLocaleDateString('fr-FR')}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${p.statut?.toLowerCase() === 'payé' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}>
                              {p.statut}
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

export default Ecolage;
