import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Banner from '../../partials/Banner';
import Footer from '../../partials/Footer';
import ErrorMessage from '../../components/status/Error';
import SuccessMessage from '../../components/status/Success';


function EmploiDuTemps() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClasse, setSelectedClasse] = useState('');
  const [selectedSalle, setSelectedSalle] = useState('');
  const [classes, setClasses] = useState([]);
  const [salles, setSalles] = useState([]);
  const [emploiDuTemps, setEmploiDuTemps] = useState({});
  const [draggedMatiere, setDraggedMatiere] = useState(null);
  const [matieresModal, setMatieresModal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [salleModalOpen, setSalleModalOpen] = useState(false);
  const [addEditSalleModalOpen, setAddEditSalleModalOpen] = useState(false);
  const [selectedSalleEdit, setSelectedSalleEdit] = useState(null);
  const [salleNomEdit, setSalleNomEdit] = useState("");
  const [salleDescription, setSalleDescription] = useState("");
  const [salleIsActive, setSalleIsActive] = useState(true);

  const horaires = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '14:00-15:00', '15:00-16:00'];
  const jours = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  const joursLabels = {
    lundi: 'Lundi',
    mardi: 'Mardi',
    mercredi: 'Mercredi',
    jeudi: 'Jeudi',
    vendredi: 'Vendredi'
  };

  const [salleClasse, setSalleClasse] = useState(null);

  const openAddEditSalleModal = (salle = null) => {
    setSelectedSalleEdit(salle);
    setSalleNomEdit(salle ? salle.salle : "");
    setSalleDescription(salle ? salle.description : "");
    setSalleIsActive(salle ? salle.is_active : true);
    setAddEditSalleModalOpen(true);
  };

  const handleSaveSalle = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        salle: salleNomEdit,
        description: salleDescription,
      };
  
      if (selectedSalleEdit) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/salle/${selectedSalleEdit.id}/`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/admin/salle/",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
  
      // Rafraîchir la liste des salles
      const res = await axios.get("http://127.0.0.1:8000/api/admin/salle/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalles(res.data);
      setAddEditSalleModalOpen(false);
      alert("Salle Ajouter avec succès !");
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite lors de l'ajout de la salle.");
    }
  };

  // Supprimer salle
  const handleDeleteSalle = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette salle ?")) return;
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8000/api/admin/salle/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSalles(salles.filter(s => s.id !== id));
      alert("Salle Supprimer avec succès !");
    } catch (err) {
      console.error(err);
      alert("Une erreur s'est produite lors de la suppression de la salle.");
    }
  };
  // Charger les classes au montage du composant
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/classes/', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        setClasses(response.data);
        if (response.data.length > 0) {
          setSelectedClasse(response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des classes :', error);
        setErrorMessage("Erreur lors du chargement des classes");
      }
    };
    fetchClasses();
  }, []);

  // Charger les salles au montage du composant
  useEffect(() => {
    const fetchSalle = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://127.0.0.1:8000/api/admin/salle/', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        setSalles(response.data);
        if (response.data.length > 0) {
          setSelectedSalle(response.data[0].id.toString());
        }
      } catch (error) {
        console.error('Erreur lors du chargement des salles :', error);
      }
    };
    fetchSalle();
  }, []);

  // Initialiser un emploi du temps vide
  const initializeEmptyEmploi = () => {
    const emptyEmploi = {};
    jours.forEach(jour => {
      emptyEmploi[jour] = {};
      horaires.forEach(horaire => {
        emptyEmploi[jour][horaire] = null;
      });
    });
    return emptyEmploi;
  };

  // Charger l'emploi du temps de la classe sélectionnée
  const fetchEmploiForSelectedClass = async () => {
    if (!selectedClasse) {
      setEmploiDuTemps(initializeEmptyEmploi());
      setSalleClasse(null);
      return;
    }
  
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admin/emplois-du-temps/?classe_id=${selectedClasse}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const nouvelEmploi = initializeEmptyEmploi();
      let salleTrouvee = null; // ← on stocke la salle ici
  
      response.data.forEach(item => {
        const jour = item.jour?.toLowerCase();
        if (!item.creneaux) return;
  
        item.creneaux.forEach(creneau => {
          if (!creneau.horaire) return;
  
          const horaire = creneau.horaire.replace(/\s/g, '');
          if (!horaires.includes(horaire)) return;
  
          // Trouver le nom de la salle
          let nomSalle = null;
          if (creneau.salle) {
            const salleObj = salles.find(s => s.id === Number(creneau.salle));
            nomSalle = salleObj ? salleObj.salle : null;
          }
  
          // On stocke la première salle trouvée pour le span
          if (!salleTrouvee && nomSalle) {
            salleTrouvee = nomSalle;
          }
  
          nouvelEmploi[jour][horaire] = {
            id: creneau.matiere,
            nom: creneau.matiere_nom,
            professeur_nom: creneau.professeur_nom,
            salle_nom: nomSalle,
            salle_id: creneau.salle ? Number(creneau.salle) : null
          };
        });
      });
  
      setEmploiDuTemps(nouvelEmploi);
      setSalleClasse(salleTrouvee); // ← ici on met la salle dans le state
  
    } catch (error) {
      console.error('Erreur lors du chargement de l\'emploi du temps :', error);
      setEmploiDuTemps(initializeEmptyEmploi());
      setSalleClasse(null);
    }
  };
    
  // Après fetchEmploiForSelectedClass ou handleSaveEmploi
const updateSallesStatus = () => {
  const updatedSalles = salles.map(s => {
    // Vérifier si cette salle est utilisée dans l'emploi du temps
    let occupied = false;
    Object.keys(emploiDuTemps).forEach(jour => {
      Object.keys(emploiDuTemps[jour]).forEach(horaire => {
        const matiere = emploiDuTemps[jour][horaire];
        if (matiere && matiere.salle_id === s.id) {
          occupied = true;
        }
      });
    });
    return { ...s, is_active: occupied };
  });
  setSalles(updatedSalles);
};

useEffect(() => {
  if (salles.length === 0) return;
  
  const updatedSalles = salles.map(s => {
    let occupied = false;
    Object.keys(emploiDuTemps).forEach(jour => {
      Object.keys(emploiDuTemps[jour]).forEach(horaire => {
        const matiere = emploiDuTemps[jour][horaire];
        if (matiere && matiere.salle_id === s.id) {
          occupied = true;
        }
      });
    });
    return { ...s, is_active: occupied };
  });

  setSalles(updatedSalles);
}, [emploiDuTemps]);

  // Charger l'emploi du temps à chaque changement de classe
  useEffect(() => {
    fetchEmploiForSelectedClass();
  }, [selectedClasse]);

  // Charger les matières quand le modal s'ouvre
  useEffect(() => {
    const fetchMatieresForModal = async () => {
      if (!isModalOpen || !selectedClasse) {
        setMatieresModal([]);
        return;
      }

      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        let endpoints = [
          `http://127.0.0.1:8000/api/admin/matieres/?classe_id=${selectedClasse}`,
          `http://127.0.0.1:8000/api/admin/matieres/?classe=${selectedClasse}`,
          `http://127.0.0.1:8000/api/admin/matieres/`,
        ];

        let matieresData = [];

        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(endpoint, {
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (Array.isArray(response.data)) {
              matieresData = response.data;
              break;
            } else if (response.data.results && Array.isArray(response.data.results)) {
              matieresData = response.data.results;
              break;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              matieresData = response.data.data;
              break;
            }
          } catch {
            continue;
          }
        }

        if (matieresData.length > 0 && selectedClasse) {
          matieresData = matieresData.filter(matiere => 
            matiere.classe_id == selectedClasse || 
            matiere.classe == selectedClasse ||
            (matiere.classes && matiere.classes.includes(parseInt(selectedClasse)))
          );
        }

        setMatieresModal(matieresData);
      } catch {
        setMatieresModal([
          { id: 1, nom: 'Mathématiques', professeur_nom: 'Dupont' },
          { id: 2, nom: 'Français', professeur_nom: 'Martin' },
          { id: 3, nom: 'Histoire', professeur_nom: 'Leroy' },
          { id: 4, nom: 'Géographie', professeur_nom: 'Moreau' },
          { id: 5, nom: 'SVT', professeur_nom: 'Simon' },
          { id: 6, nom: 'Physique', professeur_nom: 'Laurent' },
          { id: 7, nom: 'Anglais', professeur_nom: 'Petit' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (isModalOpen) {
      fetchMatieresForModal();
    }
  }, [isModalOpen, selectedClasse]);

  // Drag and drop
  const handleDragStart = (e, matiere) => {
    setDraggedMatiere(matiere);
    e.dataTransfer.setData('text/plain', matiere.id);
  };
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, jour, horaire) => {
    e.preventDefault();
    if (!draggedMatiere) return;
    const updatedEmploi = { ...emploiDuTemps };
    if (!updatedEmploi[jour]) updatedEmploi[jour] = {};
    updatedEmploi[jour][horaire] = draggedMatiere;
    setEmploiDuTemps(updatedEmploi);
    setDraggedMatiere(null);
  };

  // Sauvegarder l'emploi du temps
  const handleSaveEmploi = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Token d\'authentification manquant');
        return;
      }

      const saveData = [];
      Object.keys(emploiDuTemps).forEach(jour => {
        Object.keys(emploiDuTemps[jour]).forEach(horaire => {
          const matiere = emploiDuTemps[jour][horaire];
          if (matiere && matiere.id) {
            saveData.push({
              classe: parseInt(selectedClasse),
              jour,
              horaire,
              matiere: matiere.id,
              salle: parseInt(selectedSalle)
            });
          }
        });
      });

      if (saveData.length === 0) {
        setErrorMessage("Aucune matière à sauvegarder");
        setSuccessMessage("");
        return;
      }

      const response = await axios.post(
        'http://127.0.0.1:8000/api/admin/emplois-du-temps/',
        saveData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );

      if (response.status === 201) {
        setSuccessMessage("Emploi du temps sauvegardé avec succès !");
        setErrorMessage("");
        setIsModalOpen(false);
      } else {
        setErrorMessage("Erreur lors de la sauvegarde");
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(error);
      console.log('Erreur lors de la sauvegarde');
    }
  };

  // Calculer la longueur d'un bloc
  const calculateBlockLength = (jour, horaire, matiereId) => {
    if (!matiereId) return 0;
    const startIndex = horaires.indexOf(horaire);
    let length = 1;
    for (let i = startIndex + 1; i < horaires.length; i++) {
      if (emploiDuTemps[jour]?.[horaires[i]]?.id === matiereId) {
        length++;
      } else break;
    }
    return length;
  };

  // Étendre ou réduire une matière
  const extendMatiere = (jour, horaire, direction) => {
    const updatedEmploi = { ...emploiDuTemps };
    const startIndex = horaires.indexOf(horaire);
    const currentLength = calculateBlockLength(jour, horaire, updatedEmploi[jour]?.[horaire]?.id);
    const newLength = Math.max(1, currentLength + direction);

    for (let i = startIndex; i < startIndex + newLength; i++) {
      if (i < horaires.length) {
        if (!updatedEmploi[jour]) updatedEmploi[jour] = {};
        updatedEmploi[jour][horaires[i]] = updatedEmploi[jour][horaire];
      }
    }
    for (let i = startIndex + newLength; i < horaires.length; i++) {
      if (updatedEmploi[jour]?.[horaires[i]]?.id === updatedEmploi[jour][horaire]?.id) {
        updatedEmploi[jour][horaires[i]] = null;
      }
    }
    setEmploiDuTemps(updatedEmploi);
  };

  // Supprimer une matière
  const removeMatiere = (jour, horaire) => {
    const updatedEmploi = { ...emploiDuTemps };
    const matiereId = updatedEmploi[jour]?.[horaire]?.id;
    if (matiereId) {
      horaires.forEach(h => {
        if (updatedEmploi[jour]?.[h]?.id === matiereId) updatedEmploi[jour][h] = null;
      });
      setEmploiDuTemps(updatedEmploi);
    }
  };

  // Générer une couleur
  const getMatiereColor = (id) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900',
      'bg-green-100 dark:bg-green-900',
      'bg-yellow-100 dark:bg-yellow-900',
      'bg-red-100 dark:bg-red-900',
      'bg-purple-100 dark:bg-purple-900',
      'bg-pink-100 dark:bg-pink-900',
      'bg-indigo-100 dark:bg-indigo-900',
    ];
    return colors[id % colors.length];
  };

  // Déterminer si la cellule doit être rendue (pour rowSpan)
  const shouldRenderCell = (jour, horaire) => {
    const matiere = emploiDuTemps[jour]?.[horaire];
    if (!matiere) return true;
    const index = horaires.indexOf(horaire);
    if (index === 0) return true;
    const prevMatiere = emploiDuTemps[jour]?.[horaires[index-1]];
    return !prevMatiere || prevMatiere.id !== matiere.id;
  };

  const classeSelectionnee = React.useMemo(
    () => classes.find(c => c.id.toString() === selectedClasse),
    [classes, selectedClasse]
  );
    
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
        {/* Site header */}
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
                    <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold mb-2">
                      Les emplois du temps
                    </h1>
                    <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        Filtre par classe
                      </p>
                      <select 
                        value={selectedClasse} 
                        onChange={(e) => setSelectedClasse(e.target.value)}
                        className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full xs:w-auto min-w-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      >
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.niveau} {classe.nom}
                          </option>
                        ))}
                      </select>
                      
                    </div>                    
                  </div>

                  {/* Les deux boutons alignés à droite et espacés */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setIsModalOpen(true)} 
                      className="bg-blue-500 text-white px-4 py-2 rounded-sm hover:bg-blue-600 transition"
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => setSalleModalOpen(true)}
                      className="bg-green-500 text-white px-4 py-2 rounded-sm hover:bg-green-600 transition"
                    >
                      Salle
                    </button>

                  </div>
                </div>

                {/* Modal de modification de l'emploi du temps */}
                {isModalOpen && (
                  <div className="fixed inset-0 backdrop-blur-sm bg-black/30 dark:bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
                      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Édition de l'emploi du temps - {classes.find(c => c.id.toString() === selectedClasse)?.niveau} {classes.find(c => c.id.toString() === selectedClasse)?.nom}
                      </h2>

                      {/* Sélection de la salle */}
                      <div className="mb-4 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Salle de la classe
                        </label>
                        <select
                          value={selectedSalle}
                          onChange={(e) => setSelectedSalle(e.target.value)}
                          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          {salles.map(salle => (
                            <option key={salle.id} value={salle.id}>
                              {salle.salle}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex gap-6 flex-1 min-h-0">
                        {/* Liste des matières (à droite) */}
                        <div className="w-1/4 flex flex-col">
                          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200">
                            Matières disponibles
                          </h3>
                          <div className="space-y-2 overflow-y-auto flex-1">
                            {loading ? (
                              <div className="text-center py-4 text-gray-500">
                                Chargement des matières...
                              </div>
                            ) : matieresModal.length === 0 ? (
                              <div className="text-center py-4 text-gray-500">
                                Aucune matière disponible pour cette classe
                              </div>
                            ) : (
                              matieresModal.map(matiere => (
                                <div
                                  key={matiere.id}
                                  draggable
                                  onDragStart={(e) => handleDragStart(e, matiere)}
                                  className="p-3 bg-gray-100 dark:bg-gray-700 rounded cursor-move hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  <div className="font-medium">{matiere.nom}</div>
                                  {matiere.professeur_nom && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      {matiere.professeur_nom} {matiere.professeur_prenom}
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Emploi du temps (à gauche) */}
                        <div className="w-3/4 flex flex-col min-h-0">
                          <div className="overflow-auto flex-1">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
                                  <th className="p-2 border border-gray-300 dark:border-gray-600 min-w-[100px]">Horaire</th>
                                  {jours.map(jour => (
                                    <th key={jour} className="p-2 border border-gray-300 dark:border-gray-600 min-w-[150px]">
                                      {joursLabels[jour]}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {horaires.map((horaire, index) => (
                                  <tr key={horaire}>
                                    <td className="p-2 border border-gray-300 dark:border-gray-600 font-medium sticky left-0 bg-white dark:bg-gray-800 z-5">
                                      {horaire}
                                    </td>
                                    {jours.map(jour => {
                                      if (!shouldRenderCell(jour, horaire)) return null;
                                      
                                      const matiere = emploiDuTemps[jour] && emploiDuTemps[jour][horaire];
                                      const blockLength = matiere ? calculateBlockLength(jour, horaire, matiere.id) : 1;
                                      
                                      return (
                                        <td 
                                          key={`${jour}-${horaire}`}
                                          className="p-2 border border-gray-300 dark:border-gray-600 min-w-[150px]"
                                          onDragOver={handleDragOver}
                                          onDrop={(e) => handleDrop(e, jour, horaire)}
                                          rowSpan={blockLength}
                                          style={{ 
                                            verticalAlign: 'top',
                                            backgroundColor: matiere ? getMatiereColor(matiere.id) : 'transparent'
                                          }}
                                        >
                                          {matiere ? (
                                            <div className="flex flex-col h-full">
                                              <div className="font-medium">{matiere.nom}</div>
                                              {matiere.professeur_nom && (
                                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                  {matiere.professeur_nom} {matiere.professeur_prenom}
                                                </div>
                                              )}
                                              <div className="mt-auto pt-2 flex justify-between">
                                                <button 
                                                  onClick={() => extendMatiere(jour, horaire, -1)}
                                                  className="text-xs p-1 bg-gray-200 dark:bg-gray-600 rounded"
                                                  disabled={blockLength <= 1}
                                                >
                                                  -
                                                </button>
                                                <span className="text-xs">{blockLength}h</span>
                                                <button 
                                                  onClick={() => extendMatiere(jour, horaire, 1)}
                                                  className="text-xs p-1 bg-gray-200 dark:bg-gray-600 rounded"
                                                  disabled={index + blockLength >= horaires.length}
                                                >
                                                  +
                                                </button>
                                              </div>
                                              <button 
                                                onClick={() => removeMatiere(jour, horaire)}
                                                className="text-xs text-red-500 mt-2 flex items-center justify-center w-full"
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
                                          ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                                              -
                                            </div>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-4 mt-6">
                        <button
                          onClick={() => setIsModalOpen(false)}
                          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveEmploi}
                          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                        >
                          Sauvegarder
                        </button>
                      </div>   
                    </div>
                  </div>
                )}

                { salleModalOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-lg max-h-[80vh] overflow-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                          Gestion des salles
                        </h2>
                        <button
                        onClick={() => openAddEditSalleModal()}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition text-sm mb-4"
                      >
                        Ajouter une salle
                      </button>
                      </div>

                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {salles.map((salle) => (
                          <li key={salle.id} className="flex justify-between items-center py-2">
                            <span className="text-gray-800 dark:text-gray-200">{salle.salle} <span className="text-gray-600 dark:text-gray-400 ml-4">({salle.description})</span></span>
                            <div className="flex items-center">
                              <button
                                onClick={() => openAddEditSalleModal(salle)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-600 mr-2"
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
                              {/* Bouton supprimer */}
                              <button
                                onClick={() => handleDeleteSalle(salle.id)}
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-600"
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
                          </li>
                        ))}
                      </ul>

                      <button
                          onClick={() => setSalleModalOpen(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition mt-4"
                          >
                          Fermer
                        </button>

                    </div>
                  </div>
                )}

                { addEditSalleModalOpen && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        {selectedSalleEdit ? "Modifier" : "Ajouter"} une salle
                      </h2>
                      <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">Nom de la salle</label>
                        <input
                          type="text"
                          value={salleNomEdit}
                          onChange={(e) => setSalleNomEdit(e.target.value)}
                          className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-sm shadow text-sm px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200 mb-1">Description</label>
                        <textarea
                          value={salleDescription}
                          onChange={(e) => setSalleDescription(e.target.value)}
                          className="w-full px-3 py-2 border rounded-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setAddEditSalleModalOpen(false)}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                        >
                          Annuler
                        </button>
                        <button
                          onClick={handleSaveSalle}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                        >
                          Enregistrer
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </div>

            {/* Affichage de l'emploi du temps */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 bg-white dark:bg-gray-800 rounded-sm shadow-lg p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Emploi du temps - {classeSelectionnee?.niveau} {classeSelectionnee?.nom}
                {salleClasse && (
                  <span className="text-sm font-normal text-gray-600 dark:text-gray-400 ml-2">
                  Salle de cours : {salleClasse}
                  </span>
                )}
              </h2>

                <div className="overflow-x-auto">
                  <table className="table-auto w-full text-left border-collapse">
                    <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Horaire</th>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Lundi</th>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Mardi</th>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Mercredi</th>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Jeudi</th>
                        <th className="p-2 border border-gray-200 dark:border-gray-700 text-center">Vendredi</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {horaires.map((horaire, index) => (
                        <tr key={horaire}>
                          <td className="p-2 border border-gray-200 dark:border-gray-700 font-medium text-center">
                            {horaire}
                          </td>
                          {jours.map(jour => {
                            const matiere = emploiDuTemps[jour] && emploiDuTemps[jour][horaire];
                            
                            const isStartOfBlock = !matiere || 
                              (index === 0 || emploiDuTemps[jour]?.[horaires[index-1]]?.id !== matiere.id);
                            
                            const blockLength = isStartOfBlock && matiere ? 
                              calculateBlockLength(jour, horaire, matiere.id) : 1;
                            
                            if (!isStartOfBlock) {
                              return null;
                            }
                            
                            return (
                                  <td
                                    key={jour}
                                    className={`p-2 border border-gray-200 dark:border-gray-700 text-center align-middle 
                                      ${matiere ? getMatiereColor(matiere.id) : ''}`}
                                    rowSpan={blockLength > 1 ? blockLength : 1}
                                  >
                                  {matiere ? (
                                  <div className="flex flex-col items-center justify-center h-full">
                                    <div className="font-medium">{matiere.nom}</div>
                                    {matiere.professeur_nom && (
                                      <div className="text-xs text-gray-600 dark:text-gray-400">
                                        Prof : {matiere.professeur_nom}
                                      </div>
                                    )}
                                    {blockLength > 1 && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {blockLength}h
                                      </div>
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

export default EmploiDuTemps;