import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';

function EmploiDuTempsEtudiant() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emploiDuTemps, setEmploiDuTemps] = useState({});
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [classeNom, setClasseNom] = useState('');

  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const horaires = [
    '08:00-09:00',
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
  ];

  const getMatiereColor = (id) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900',
      'bg-green-100 dark:bg-green-900',
      'bg-yellow-100 dark:bg-yellow-900',
      'bg-red-100 dark:bg-red-900',
      'bg-purple-100 dark:bg-purple-900',
      'bg-pink-100 dark:bg-pink-900',
      'bg-indigo-100 dark:bg-indigo-900'
    ];
    return colors[id % colors.length];
  };

  // Fonction pour calculer la longueur d'un bloc
  const calculateBlockLength = (jour, horaire, matiereId) => {
    if (!matiereId) return 0;
    const startIndex = horaires.indexOf(horaire);
    let length = 1;
    for (let i = startIndex + 1; i < horaires.length; i++) {
      const nextMatiere = emploiDuTemps[jour]?.[horaires[i]];
      if (nextMatiere?.id === matiereId) {
        length++;
      } else break;
    }
    return length;
  };

  // Déterminer si la cellule doit être rendue
  const shouldRenderCell = (jour, horaire) => {
    const matiere = emploiDuTemps[jour]?.[horaire];
    if (!matiere) return true;
    const index = horaires.indexOf(horaire);
    if (index === 0) return true;
    const prevMatiere = emploiDuTemps[jour]?.[horaires[index-1]];
    return !prevMatiere || prevMatiere.id !== matiere.id;
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

  // 🔹 Récupérer l'étudiant connecté
  useEffect(() => {
    const fetchEtudiant = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('http://127.0.0.1:8000/api/etudiant/info/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEtudiant(res.data);
        setClasseNom(res.data.classe_nom || '');
      } catch (err) {
        console.error('Erreur récupération étudiant :', err);
        setErrorMessage("Impossible de récupérer les infos de l'étudiant.");
      } finally {
        setLoading(false);
      }
    };
    fetchEtudiant();
  }, []);

  // 🔹 Remplir l'emploi du temps
  useEffect(() => {
    if (!etudiant || !etudiant.classe_id) return;

    const fetchEmploi = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`http://127.0.0.1:8000/api/etudiant/emplois-du-temps/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // Adapter les données au format attendu par le frontend
        const emploiData = res.data.emploi_du_temps;
        const formattedEmploi = {};
        
        jours.forEach(jour => {
          formattedEmploi[jour] = {};
          horaires.forEach(horaire => {
            const matiereData = emploiData[jour]?.[horaire];
            if (matiereData) {
              formattedEmploi[jour][horaire] = {
                id: matiereData.matiere, // Utiliser l'ID de la matière pour la fusion
                matiere_nom: matiereData.matiere_nom,
                professeur_nom: matiereData.professeur_nom,
                salle_nom: matiereData.salle_nom
              };
            } else {
              formattedEmploi[jour][horaire] = null;
            }
          });
        });
        
        setEmploiDuTemps(formattedEmploi);
        setClasseNom(res.data.classe_nom);
      } catch (err) {
        console.error('Erreur récupération emploi du temps :', err);
        setErrorMessage("Impossible de récupérer l'emploi du temps.");
      }
    };

    fetchEmploi();
  }, [etudiant]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow p-6">
          {successMessage && (
            <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />
          )}
          {errorMessage && (
            <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />
          )}

          <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
            Mon emploi du temps {classeNom && `- ${classeNom}`}
          </h1>
          {loading ? (
            <div className="text-center text-gray-500">Chargement de l'emploi du temps...</div>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded shadow p-4">
              <table className="table-auto w-full text-left border-collapse">
                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Heure</th>
                    {jours.map(j => (
                      <th key={j} className="p-2 border border-gray-200 dark:border-gray-700 text-center">
                        {j.charAt(0).toUpperCase() + j.slice(1)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100 dark:divide-gray-700">
                  {horaires.map((horaire, index) => (
                    <tr key={horaire}>
                      <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium text-center">
                        {horaire}
                      </td>
                      {jours.map(jour => {
                        const matiere = emploiDuTemps[jour]?.[horaire];
                        
                        // Utiliser la même logique que dans l'admin
                        const isStartOfBlock = !matiere || 
                          (index === 0 || emploiDuTemps[jour]?.[horaires[index-1]]?.id !== matiere.id);
                        
                        const blockLength = isStartOfBlock && matiere ? 
                          calculateBlockLength(jour, horaire, matiere.id) : 1;
                        
                        if (!isStartOfBlock) {
                          return null;
                        }
                        
                        return (
                          <td
                            key={`${jour}-${horaire}`}
                            className={`p-2 border border-gray-200 dark:border-gray-700 text-center align-middle 
                              ${matiere ? getMatiereColor(matiere.id) : ''}`}
                            rowSpan={blockLength > 1 ? blockLength : 1}
                          >
                            {matiere ? (
                              <div className="flex flex-col items-center justify-center h-full">
                                <div className="font-semibold">{matiere.matiere_nom}</div>
                                {matiere.professeur_nom && (
                                  <div className="text-xs italic text-gray-600 dark:text-gray-400">
                                    {matiere.professeur_nom}
                                  </div>
                                )}
                                {blockLength > 1 && (
                                  <div className="text-xs text-gray-500 mt-1">{blockLength}h</div>
                                )}
                              </div>
                            ) : (
                              <div className="text-gray-400">-</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default EmploiDuTempsEtudiant;