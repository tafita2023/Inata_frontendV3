import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function Ecolage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [modalClasse, setModalClasse] = useState(null);
  const [paiements, setPaiements] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [selectedEtudiant, setSelectedEtudiant] = useState('');
  const [montant, setMontant] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const allMonths = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  // Messages temporisés
  useEffect(() => { if (errorMessage) { const t = setTimeout(() => setErrorMessage(''), 3000); return () => clearTimeout(t); } }, [errorMessage]);
  useEffect(() => { if (successMessage) { const t = setTimeout(() => setSuccessMessage(''), 3000); return () => clearTimeout(t); } }, [successMessage]);

  // Charger les classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/classes/');
        setClasses(response.data);
        if (response.data.length > 0) setSelectedClasse(response.data[0].id);
      } catch (error) { console.error(error); }
    };
    fetchClasses();
  }, []);

  // Charger tous les paiements
  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await AxiosInstance.get('/api/admin/paiements/');
        setPaiements(response.data);
      } catch (error) { console.error(error); setErrorMessage('Erreur lors du chargement des paiements'); }
    };
    fetchPaiements();
  }, []);

  // Charger étudiants et montant selon la classe du popup
  useEffect(() => {
    if (!modalClasse) { setEtudiants([]); setSelectedEtudiant(''); return; }

    const fetchEtudiants = async () => {
      try {
        const response = await AxiosInstance.get(`/api/admin/classes/${modalClasse}/etudiants/`);
        setEtudiants(response.data);
      } catch (error) { console.error(error); setErrorMessage('Erreur lors du chargement des étudiants'); setEtudiants([]); }
    };

    const fetchMontant = async () => {
      try {
        const response = await AxiosInstance.get(`/api/admin/frais-classe/${modalClasse}/`);
        setMontant(response.data.montant);
      } catch (error) { console.error(error); setMontant(''); }
    };

    fetchEtudiants();
    fetchMontant();
  }, [modalClasse]);

  // Vérifier les mois déjà payés pour un étudiant
  const getMoisDejaPayes = (etudiantId) => {
    const etudiantPaiements = paiements.filter(p => p.etudiant === etudiantId);
    let moisPayes = [];
    etudiantPaiements.forEach(p => {
      if (p.mois_payes && Array.isArray(p.mois_payes)) {
        p.mois_payes.forEach(moisComplet => {
          const mois = moisComplet.replace(/\(\d{4}-\d{4}\)/, '').trim();
          moisPayes.push(mois);
        });
      }
    });
    return moisPayes;
  };

  // Toggle sélection multiple des mois
  const toggleMonthSelection = (month) => {
    const moisPayes = getMoisDejaPayes(parseInt(selectedEtudiant));
    if (moisPayes.includes(month)) {
      setErrorMessage(`Le mois ${month} est déjà payé`);
      return;
    }
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month));
    } else {
      setSelectedMonths([...selectedMonths, month]);
    }
  };

  // Ajouter un paiement Liquide
  const handleAddPaiementLiquide = async () => {
    if (!selectedEtudiant) return setErrorMessage('Veuillez sélectionner un étudiant');
    if (!selectedMonths.length) return setErrorMessage('Veuillez sélectionner au moins un mois');
    if (!montant || isNaN(parseFloat(montant))) return setErrorMessage('Montant invalide');

    const moisDejaPayes = getMoisDejaPayes(parseInt(selectedEtudiant));
    const conflit = selectedMonths.filter(mois => moisDejaPayes.includes(mois));
    if (conflit.length > 0) return setErrorMessage(`Impossible : ces mois sont déjà payés -> ${conflit.join(', ')}`);

    setLoading(true);
    try {
      const montantTotal = parseFloat(montant) * selectedMonths.length;
      const data = { etudiant: parseInt(selectedEtudiant), montant_total: montantTotal.toString(), mode_paiement: 'liquide', mois: selectedMonths.map(m => m.toString()) };

      await AxiosInstance.post("/api/admin/paiements/ajouter/", data);

      setSuccessMessage('Paiement enregistré avec succès !');
      setIsModalOpen(false);
      setSelectedMonths([]);

      const paiementsRes = await AxiosInstance.get("/api/admin/paiements/");
      setPaiements(paiementsRes.data);

    } catch (err) {
      console.error("Erreur API:", err.response?.data);
      const message = err.response?.data?.mois
        ? `Impossible : ${err.response.data.mois}`
        : err.response?.data?.error || "Erreur lors de l'enregistrement du paiement";
      setErrorMessage(message);
      setIsModalOpen(false);
    } finally { setLoading(false); }
  };

  const getStatutColor = (statut) => (!statut ? 'text-red-600' : statut.toLowerCase() === 'payé' ? 'text-green-600' : 'text-red-600');

  const paiementsFiltres = paiements.filter(p => {
    const classeObj = classes.find(c => c.id === selectedClasse);
    return classeObj ? p.classe === classeObj.niveau : true;
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}
          <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">Les Paiements</h1>

          {/* Filtre et bouton ajouter */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            <div className="flex items-center space-x-2">
              <p className="mr-2">Filtre par classe</p>
              <select value={selectedClasse || ''} onChange={(e) => setSelectedClasse(parseInt(e.target.value))} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 min-w-[120px]">
                {classes.map((classe) => (<option key={classe.id} value={classe.id}>{classe.niveau} {classe.nom}</option>))}
              </select>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition">Ajouter</button>
          </div>

          {/* Popup paiement liquide */}
          {isModalOpen && (
            <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Paiement Liquide</h2>

                <select value={modalClasse || ''} onChange={(e) => setModalClasse(parseInt(e.target.value))} className="w-full mb-2 p-2 rounded shadow">
                  <option value="">Sélectionner une classe</option>
                  {classes.map((classe) => (<option key={classe.id} value={classe.id}>{classe.niveau} {classe.nom}</option>))}
                </select>

                <select value={selectedEtudiant} onChange={(e) => setSelectedEtudiant(e.target.value)} className="w-full mb-2 p-2 rounded shadow" disabled={!modalClasse}>
                  <option value="">Sélectionner un étudiant</option>
                  {etudiants.map((et) => (<option key={et.id} value={et.id}>{et.nom} {et.prenom}</option>))}
                </select>

                <div className="w-full mb-2 p-2 rounded shadow bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                  Montant à payer par mois : {montant ? `${montant} Ar` : "-"}
                </div>

                {/* Boutons mois sélection */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {allMonths.map((month) => {
                    const moisPayes = getMoisDejaPayes(parseInt(selectedEtudiant));
                    const disabled = moisPayes.includes(month);
                    return (
                      <button
                        key={month}
                        onClick={() => !disabled && toggleMonthSelection(month)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          disabled ? 'bg-gray-400 text-gray-200 cursor-not-allowed' :
                          selectedMonths.includes(month) ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                        }`}
                      >
                        {month}
                      </button>
                    )
                  })}
                </div>

                <div className="flex justify-end space-x-2">
                  <button onClick={() => setIsModalOpen(false)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Annuler</button>
                  <button onClick={handleAddPaiementLiquide} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">{loading ? 'Ajout...' : 'Ajouter'}</button>
                </div>
              </div>
            </div>
          )}

          {/* Tableau des paiements */}
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Liste des paiements</h2>
              <div className="overflow-x-auto">
                <table className="table-auto w-full text-left">
                  <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                      <th className="p-2">Id</th>
                      <th className="p-2">Nom de l'étudiant</th>
                      <th className="p-2">Montant</th>
                      <th className="p-2">Date</th>
                      <th className="p-2">Mois</th>
                      <th className="p-2">Statut</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                    {paiementsFiltres.length > 0 ? paiementsFiltres.map((p, i) => (
                      <tr key={p.id}>
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{p.nom} {p.prenom}</td>
                        <td className="p-2">{p.montant_total}</td>
                        <td className="p-2">{new Date(p.date_creation).toLocaleDateString("fr-FR")}</td>
                        <td className="p-2">
                          {p.mois_payes && Array.isArray(p.mois_payes) 
                            ? (() => {
                                const moisSansAnnee = [];
                                let annee = '';
                                p.mois_payes.forEach(moisComplet => {
                                  // Extraire l'année (format 2025-2026)
                                  const anneeMatch = moisComplet.match(/(\d{4}-\d{4})/);
                                  if (anneeMatch && !annee) annee = anneeMatch[0];

                                  // Extraire le mois sans l'année
                                  const mois = moisComplet.replace(annee, '').replace('(', '').replace(')', '').trim();
                                  if (mois) moisSansAnnee.push(mois);
                                });

                                // Retourner le format "Mois1, Mois2 (Année)"
                                if (moisSansAnnee.length > 0) {
                                  return annee ? `${moisSansAnnee.join(', ')} (${annee})` : moisSansAnnee.join(', ');
                                }
                                return '-';
                              })()
                            : '-'
                          }
                        </td>
                        <td className={`p-2 ${getStatutColor(p.statut)}`}>{p.statut}</td>
                        <td className="p-2">...</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="7" className="p-4 text-center text-gray-500">Aucun paiement disponible pour cette classe.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
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
