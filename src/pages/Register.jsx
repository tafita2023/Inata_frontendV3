import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LogoInata from '../images/InATA2.png';
import BackgroundImage from "../images/background.jpg";
import AxiosInstance from '../components/instance/AxiosInstance';

const Register = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [role, setRole] = useState(""); // rôle récupéré depuis le token
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    phone: "",
    classe_id: "",
    date_naissance: "",
    lieu_naissance: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Récupérer le rôle depuis le token
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await AxiosInstance.get(`/api/invitation/${token}/`);
        setRole(res.data.role);
        // Si ce n'est pas un étudiant, supprimer les champs inutiles
        if (res.data.role !== "etud") {
          setForm(prev => ({
            ...prev,
            date_naissance: "",
            lieu_naissance: "",
            classe_id: ""
          }));
        }
      } catch (err) {
        setErrorMessage("Lien invalide ou expiré");
      }
    };
    fetchRole();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      setForm({ ...form, [name]: value.replace(/\D/g, "") });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const passwordCriteria = (password) => ({
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[\W_]/.test(password),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!validatePassword(form.password)) {
      setErrorMessage(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial."
      );
      setLoading(false);
      return;
    }

    try {
      await AxiosInstance.post(`/api/register/${token}/`, form, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccessMessage("Inscription réussie !");
      setErrorMessage("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      const msg = err.response?.data?.detail || "Erreur d'inscription";
      setErrorMessage(msg);
      setSuccessMessage("");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-center bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Popup succès */}
      {successMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
             style={{ backgroundColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">{successMessage}</p>
            <svg className="mx-auto mb-4" width="80" height="80" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#4ade80" strokeWidth="2"/>
              <path
                fill="none" stroke="#4ade80" strokeWidth="4"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="48" strokeDashoffset="48"
                d="M14 27l7 7 16-16">
                <animate attributeName="stroke-dashoffset" from="48" to="0" dur="0.5s" fill="freeze" begin="0.2s"/>
              </path>
            </svg>
          </div>
        </div>
      )}

      {/* Popup erreur */}
      {errorMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50"
             style={{ backgroundColor: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm w-full">
            <p className="text-lg font-semibold mb-4">{errorMessage}</p>
            <svg className="mx-auto mb-4" width="80" height="80" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="25" fill="none" stroke="#f87171" strokeWidth="2"/>
              <line x1="16" y1="16" x2="36" y2="36" stroke="#f87171" strokeWidth="4" strokeLinecap="round"/>
              <line x1="36" y1="16" x2="16" y2="36" stroke="#f87171" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      )}

      {/* Formulaire avec scroll uniquement */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md m-5 mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col items-center">
          <img src={LogoInata} alt="logo" className="w-32 h-32 mb-4" />
          <h1 className="text-xl font-semibold text-gray-800 text-center">
            Institut des Arts et des Technologies Avancées
          </h1>
          <h2 className="text-2xl font-bold text-blue-600 text-center mb-6">
            Inscription
          </h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div className="relative">
            <input
              id="nom"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="nom"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Nom
            </label>
          </div>

          {/* Prénom */}
          <div className="relative">
            <input
              id="prenom"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="prenom"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Prénom
            </label>
          </div>

          {/* Champs étudiants uniquement */}
          {role === "etud" && (
            <>
              {/* Date de naissance */}
              <div className="relative">
                <input
                  id="date_naissance"
                  name="date_naissance"
                  type="date"
                  value={form.date_naissance}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <label
                  htmlFor="date_naissance"
                  className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                            peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
                >
                  Date de naissance
                </label>
              </div>

              {/* Lieux de naissance */}
              <div className="relative">
                <input
                  id="lieu_naissance"
                  name="lieu_naissance"
                  value={form.lieu_naissance}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <label
                  htmlFor="lieu_naissance"
                  className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                            peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                            peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
                >
                  Lieux de naissance
                </label>
              </div>
            </>
          )}

          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Email
            </label>
          </div>

          {/* Téléphone */}
          <div className="relative">
            <input
              id="phone"
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder=" "
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="phone"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
                        peer-focus:-top-3 peer-focus:text-gray-700 peer-focus:text-base cursor-text"
            >
              Téléphone
            </label>
          </div>

          {/* Mot de passe */}
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              placeholder=" "
              autoComplete="new-password"
              spellCheck="false"
              className="peer w-full px-4 pt-6 pb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-3 text-gray-600 text-base font-medium bg-white px-1 transition-all 
                        peer-placeholder-shown:top-6 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base 
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

          {/* Critères mot de passe */}
          <div className="mt-2 space-y-1 text-sm">
            {Object.entries(passwordCriteria(form.password)).map(([key, valid]) => (
              <div key={key} className="flex items-center space-x-2">
                {valid ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                <span>
                  {key === "length" && "Au moins 8 caractères"}
                  {key === "uppercase" && "Au moins 1 majuscule"}
                  {key === "lowercase" && "Au moins 1 minuscule"}
                  {key === "number" && "Au moins 1 chiffre"}
                  {key === "special" && "Au moins 1 caractère spécial"}
                </span>
              </div>
            ))}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
