import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogoInata from '../images/InATA2.png';
import Background from '../images/background.jpg';
import ErrorMessage from '../components/status/Error';
import SuccessMessage from '../components/status/Success';

// Lien pour gerer les version local et de production
import AxiosInstance from './components/instance/AxiosInstance';

const Login = ({ setCurrentUser }) => {
  const [emailInput, setEmailInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
  
    try {
      console.log("🌐 Tentative de connexion avec:", emailInput);
  
      // 🔑 Login
      const response = await AxiosInstance.post("/api/login/", {
        email: emailInput,
        password
      });
  
      console.log("✅ Réponse login:", response.data);
  
      // Récupérer le token
      const token = response.data.access || response.data.token;
      if (!token) throw new Error("Aucun token reçu");
  
      localStorage.setItem("authToken", token);
  
      // 🔑 Récupérer l'utilisateur connecté
      const me = await AxiosInstance.post("/api/utilisateur-connecte/", {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      console.log("👤 Utilisateur connecté:", me.data);
  
      // Préparer la photo avec URL complète
      let photoUrl = me.data.photo || '';
      if (photoUrl && !photoUrl.startsWith('http')) {
        photoUrl = `http://127.0.0.1:8000${photoUrl}`;
      }
  
      // Mettre à jour le state global
      setCurrentUser({ ...me.data, photo: photoUrl });
  
      // Stocker dans localStorage
      localStorage.setItem("userNom", me.data.nom || '');
      localStorage.setItem("userPrenom", me.data.prenom || '');
      localStorage.setItem("userRole", me.data.role || '');
      localStorage.setItem("userEmail", me.data.email || '');
      localStorage.setItem("userPhone", me.data.phone || '');
      localStorage.setItem("userId", me.data.id || '');
      localStorage.setItem("userPhoto", photoUrl);
  
      // Redirection selon rôle
      const redirectPath =
      me.data.role === "admin"
        ? "/admin/dashboard"
        : me.data.role === "prof"
          ? "/professeur/dashboard"
          : (me.data.role === "etud" || me.data.role === "diplome")
            ? "/etudiant/dashboard"
            : "/";
      
      navigate(redirectPath, { state: { showWelcome: true } });
  
    } catch (err) {
      console.error("❌ Erreur:", err);
      setErrorMessage("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div className="min-h-screen bg-center bg-no-repeat flex items-center justify-center" style={{ 
      backgroundImage: "url(${Background})", 
      backgroundSize: "cover",
      backgroundPosition: "center"
    }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex flex-col items-center">
          <img src={LogoInata} alt="logo" className="w-32 h-32 mb-4" />
          <h1 className="text-xl font-semibold text-center text-gray-800 mb-2">
            Institut des Arts et des Technologies Avancées
          </h1>
          <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">Connexion</h2>
        </div>

        {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
        {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              placeholder=" "
              autoComplete="username"
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all
                        peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Email
            </label>
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              autoComplete="current-password"
              className="peer w-full px-4 pt-5 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all
                        peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Mot de passe
            </label>
            <button
              type="button"
              className="absolute right-3 top-5 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.05 10.05 0 012.133-3.362m3.185-2.436A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.977 9.977 0 01-4.52 5.309M15 12a3 3 0 00-3-3" />
                  <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
