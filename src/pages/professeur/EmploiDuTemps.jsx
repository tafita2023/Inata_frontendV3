import React, { useState, useEffect } from 'react';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
// Lien pour gerer les version local et de production
import AxiosInstance from '../../components/instance/AxiosInstance';

function EmploiDuTemps() {
  const horaires = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'];
  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [emploiDuTemps, setEmploiDuTemps] = useState({});
  const [salles, setSalles] = useState([]);
  const [salleClasse, setSalleClasse] = useState(null);

  const initializeEmptyEmploi = () => {
    const empty = {};
    jours.forEach(j => {
      empty[j] = {};
      horaires.forEach(h => empty[j][h] = null);
    });
    return empty;
  };

  const getMatiereColor = (id) => {
    const colors = ['bg-blue-100 dark:bg-blue-900','bg-green-100 dark:bg-green-900','bg-yellow-100 dark:bg-yellow-900','bg-red-100 dark:bg-red-900','bg-purple-100 dark:bg-purple-900','bg-pink-100 dark:bg-pink-900','bg-indigo-100 dark:bg-indigo-900'];
    return colors[id % colors.length];
  };

  // Charger classes et salles
  useEffect(() => {
    AxiosInstance.get('/api/admin/classes/')
      .then(res => { setClasses(res.data); if(res.data.length>0) setSelectedClasse(res.data[0].id.toString()); });
    AxiosInstance.get('/api/admin/salle/')
      .then(res => setSalles(res.data));
  }, []);

  // Charger emploi du temps
  useEffect(() => {
    if(!selectedClasse) return;
    AxiosInstance.get(`/api/admin/emplois-du-temps/?classe_id=${selectedClasse}`)
      .then(res => {
        const nouvelEmploi = initializeEmptyEmploi();
        let salleTrouvee = null;
        res.data.forEach(item => {
          const jour = item.jour?.toLowerCase();
          if(!item.creneaux) return;
          item.creneaux.forEach(c => {
            if(!c.horaire) return;
            const horaire = c.horaire.replace(/\s/g,'');
            if(!horaires.includes(horaire)) return;
            let nomSalle = null;
            if(c.salle){
              const s = salles.find(s => s.id === Number(c.salle));
              nomSalle = s ? s.salle : null;
            }
            if(!salleTrouvee && nomSalle) salleTrouvee = nomSalle;
            nouvelEmploi[jour][horaire] = { id:c.matiere, nom:c.matiere_nom, professeur_nom:c.professeur_nom, salle_nom:nomSalle };
          });
        });
        setEmploiDuTemps(nouvelEmploi);
        setSalleClasse(salleTrouvee);
      });
  }, [selectedClasse, salles]);

  const calculateBlockLength = (jour, horaire, matiereId) => {
    if(!matiereId || !emploiDuTemps[jour]) return 0;
    const startIndex = horaires.indexOf(horaire);
    let length = 1;
    for(let i=startIndex+1;i<horaires.length;i++){
      if(emploiDuTemps[jour][horaires[i]]?.id === matiereId) length++; else break;
    }
    return length;
  };

  const classeSelectionnee = classes.find(c => c.id.toString() === selectedClasse);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow p-6">
        <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
        Les emplois du temps
        </h1>
          <div className="mb-4 flex items-center gap-4">
            <label className="text-gray-600 dark:text-gray-400">Filtre par classe :</label>
            <select
              value={selectedClasse}
              onChange={e => setSelectedClasse(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full xs:w-auto min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
              {classes.map(c => <option key={c.id} value={c.id}>{c.niveau} {c.nom}</option>)}
            </select>
            {salleClasse && <span className="ml-4 text-gray-600 dark:text-gray-400">Salle : {salleClasse}</span>}
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto w-full text-left border-collapse">
              <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Horaire</th>
                  {jours.map(j => <th key={j} className="p-2 border border-gray-200 dark:border-gray-700 text-center">{j.charAt(0).toUpperCase() + j.slice(1)}</th>)}
                </tr>
              </thead>
              <tbody className="text-sm">
                {horaires.map((h, idx) => (
                  <tr key={h}>
                    <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium text-center">{h}</td>
                    {jours.map(j => {
                      const matiere = emploiDuTemps[j]?.[h];
                      const isStart = !matiere || (idx===0 || emploiDuTemps[j][horaires[idx-1]]?.id !== matiere.id);
                      const rowSpan = isStart && matiere ? calculateBlockLength(j,h,matiere.id) : 1;
                      if(!isStart) return null;
                      return (
                        <td key={j} rowSpan={rowSpan} className={`p-2 border border-gray-200 dark:border-gray-700 text-center align-middle ${matiere ? getMatiereColor(matiere.id) : ''}`}>
                          {matiere ? (
                            <div className="flex flex-col items-center justify-center h-full">
                              <div className="font-medium text-gray-800 dark:text-gray-100">{matiere.nom}</div>
                              {matiere.professeur_nom && <div className="text-xs text-gray-800 dark:text-gray-100">Prof : {matiere.professeur_nom}</div>}
                            </div>
                          ) : <div className="text-gray-400">-</div>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <Banner />
        <Footer />
      </div>
    </div>
  );
}

export default EmploiDuTemps;
