import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';

import './css/style.css';
import './charts/ChartjsConfig';

import PrivateRoute from './route/PrivateRoute';
import InactivityHandler from './components/InactivityHandler';

import Profile from './components/profile/profile';

// Pages Admin
import Dashboard from './pages/admin/Dashboard';
import Utilisateur from './pages/admin/Utilisateur';
import Classe from './pages/admin/Classe';
import Matiere from './pages/admin/Matiere';
import Note from './pages/admin/Note';
import Edt from './pages/admin/EmploiDuTemps';
import Absence from './pages/admin/Absence';
import Ecolage from './pages/admin/Ecolage';
import Salaire from './pages/admin/Salaire';
import Bulletin from './pages/admin/Bulletin';
import NoteProf from './pages/professeur/Notes';

// Pages Professeur
import DashboardProf from './pages/professeur/Dashboard';
import EmploiProf from './pages/professeur/EmploiDuTemps'
import AbsenceProf from './pages/professeur/Absence';
import DevoirProf from './pages/professeur/Devoir';

// Pages Etudiant
import DashboardEtud from './pages/etudiant/Dashboard';
import EcolageEtud from './pages/etudiant/Ecolage';
import DevoirEtud from './pages/etudiant/Devoir';
import NoteEtud from './pages/etudiant/Notes';
import EmploiEtud from './pages/etudiant/EmploiDuTemps';

// Pages Front
import Home from './front/Home';
import Formation from './front/Formation';
import Academique from './front/Academique';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Lien pour gerer les version local et de production
import AxiosInstance from './components/instance/AxiosInstance';

function App() {
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  //  Décoder un JWT pour vérifier l'expiration
  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  //  Rafraîchir le token si nécessaire
  const refreshToken = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) return null;

    try {
      const res = await AxiosInstance.post("/api/token/refresh/", { refresh });
      localStorage.setItem("authToken", res.data.access);
      return res.data.access;
    } catch (err) {
      console.error("Impossible de rafraîchir le token :", err.response?.data || err.message);
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      return null;
    }
  };

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
  }, [location.pathname]);

  // Stock les information de l'utilisateur
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        let token = localStorage.getItem("authToken");
        if (!token) {
          setLoadingUser(false);
          return;
        }
  
        const decoded = decodeToken(token);
        if (decoded?.exp && decoded.exp < Date.now() / 1000) {
          token = await refreshToken();
          if (!token) {
            setLoadingUser(false);
            return;
          }
        }
  
        const response = await AxiosInstance.get("/api/utilisateur-connecte/", {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        // Préparer la photo
        let photoUrl = response.data.photo || '';
        if (photoUrl && !photoUrl.startsWith('http')) {
          photoUrl = `${import.meta.env.VITE_API_BASE_URL_DEPLOY}${photoUrl}`;
        }
  
        setCurrentUser({ ...response.data, photo: photoUrl });
      } catch (error) {
        console.error("Erreur fetch user:", error.response?.data || error.message);
        localStorage.removeItem("authToken");
        setCurrentUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
  
    fetchCurrentUser();
  }, []);
  
  return (
    <>
      <InactivityHandler />

      <Routes>
        {/* Routes publiques */}
        <Route path="/not-found" element={<NotFound />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/formation/cursus" element={<Formation />} />
        <Route exact path="/formation/academique" element={<Academique />} />
        <Route exact path="/register/:token" element={<Register />} />
        <Route exact path="/login" element={<Login setCurrentUser={setCurrentUser} />} />
        <Route path="/profil" element={<Profile />} />
        {/* Route réservée admin */}
        <Route exact path="/admin/dashboard" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Dashboard />
          </PrivateRoute>
        } />
        <Route exact path="/admin/utilisateurs" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Utilisateur />
          </PrivateRoute>
        } />
        <Route exact path="/admin/classes" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Classe />
          </PrivateRoute>
        } />
        <Route exact path="/admin/matieres" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Matiere />
          </PrivateRoute>
        } />
        <Route exact path="/admin/notes" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Note />
          </PrivateRoute>
        } />
        <Route exact path="/admin/emploi_du_temps" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Edt />
          </PrivateRoute>
        } />
        <Route exact path="/admin/absence" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Absence />
          </PrivateRoute>
        } />
        <Route exact path="/admin/ecolage" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Ecolage />
          </PrivateRoute>
        } />
        <Route exact path="/admin/salaire" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Salaire />
          </PrivateRoute>
        } />
        <Route exact path="/admin/bulletin" element={
          <PrivateRoute roles={['admin']} currentUser={currentUser} loading={loadingUser}>
            <Bulletin />
          </PrivateRoute>
        } />

        {/* Route réservée prof */}
        <Route exact path="/professeur/dashboard" element={
          <PrivateRoute roles={['prof']} currentUser={currentUser} loading={loadingUser}>
            <DashboardProf />
          </PrivateRoute>
        } />
          <Route exact path="/professeur/absence" element={
          <PrivateRoute roles={['prof']} currentUser={currentUser} loading={loadingUser}>
            <AbsenceProf />
          </PrivateRoute>
        } />

        <Route exact path="/professeur/notes" element={
          <PrivateRoute roles={['prof']} currentUser={currentUser} loading={loadingUser}>
            <NoteProf />
          </PrivateRoute>
        } />
        <Route exact path="/professeur/emploi_du_temps" element={
          <PrivateRoute roles={['prof']} currentUser={currentUser} loading={loadingUser}>
            <EmploiProf />
          </PrivateRoute>
        } />

        <Route exact path="/professeur/devoir" element={
          <PrivateRoute roles={['prof']} currentUser={currentUser} loading={loadingUser}>
            <DevoirProf />
          </PrivateRoute>
        } />

        {/* Route réservée etudiant */}
        <Route exact path="/etudiant/dashboard" element={
          <PrivateRoute roles={['etud', 'diplome']} currentUser={currentUser} loading={loadingUser}>
            <DashboardEtud currentUser={currentUser}/>
          </PrivateRoute>
        } />

        <Route exact path="/etudiant/ecolage" element={
          <PrivateRoute roles={['etud']} currentUser={currentUser} loading={loadingUser}>
            <EcolageEtud />
          </PrivateRoute>
        } />

        <Route exact path="/etudiant/emploi_du_temps" element={
          <PrivateRoute roles={['etud']} currentUser={currentUser} loading={loadingUser}>
            <EmploiEtud />
          </PrivateRoute>
        } />

         <Route exact path="/etudiant/notes" element={
          <PrivateRoute roles={['etud', 'diplome']} currentUser={currentUser} loading={loadingUser}>
            <NoteEtud />
          </PrivateRoute>
        } />

        <Route exact path="/etudiant/devoir" element={
          <PrivateRoute roles={['etud']} currentUser={currentUser} loading={loadingUser}>
            <DevoirEtud />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
