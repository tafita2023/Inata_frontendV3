import React, { useState, useEffect } from "react";
import Sidebar from "../../partials/Sidebar";
import Header from "../../partials/Header";
import Footer from "../../partials/Footer";
import SuccessMessage from "../../components/status/Success";
import ErrorMessage from "../../components/status/Error";
import UserAvatar from '../../images/profil.jpg';
import AxiosInstance from "../instance/AxiosInstance";

// Icônes yeux
const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
    fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 
       2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 
       0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
    fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 
       0-8.268-2.943-9.542-7a10.05 10.05 0 012.133-3.362m3.185
       -2.436A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 
       9.542 7a9.977 9.977 0 01-4.52 5.309" />
    <line x1="3" y1="3" x2="21" y2="21"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

function Profil() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    phone: '',
    role: '',
    photo: null,
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Timer pour messages
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 4000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Récupération infos utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // LocalStorage
        const nom = localStorage.getItem('userNom') || '';
        const prenom = localStorage.getItem('userPrenom') || '';
        const role = localStorage.getItem('userRole') || '';
        const email = localStorage.getItem('userEmail') || '';
        const phone = localStorage.getItem('userPhone') || '';
        const photo = localStorage.getItem('userPhoto') || null;

        setUser(prev => ({ ...prev, nom, prenom, role, email, phone, photo }));
        setPreviewPhoto(photo || UserAvatar);

        // API
        const response = await AxiosInstance.get("/utilisateur-connecte/");
        const userData = response.data;

        // Construire URL complète photo
        let apiPhotoUrl = userData.photo || null;
        if (apiPhotoUrl && !apiPhotoUrl.startsWith('http')) {
          apiPhotoUrl = `${AxiosInstance.defaults.baseURL}${apiPhotoUrl}`;
        }

        setUser(prev => ({
          ...prev,
          nom: userData.nom || prev.nom,
          prenom: userData.prenom || prev.prenom,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
          role: userData.role || prev.role,
          photo: apiPhotoUrl,
        }));

        setPreviewPhoto(apiPhotoUrl || photo || UserAvatar);

        // Mise à jour localStorage
        localStorage.setItem('userNom', userData.nom || '');
        localStorage.setItem('userPrenom', userData.prenom || '');
        localStorage.setItem('userEmail', userData.email || '');
        localStorage.setItem('userPhone', userData.phone || '');
        localStorage.setItem('userRole', userData.role || '');
        localStorage.setItem('userId', userData.id || '');
        if (apiPhotoUrl) localStorage.setItem('userPhoto', apiPhotoUrl);

      } catch (error) {
        console.error('❌ Erreur récupération données:', error);
        const photo = localStorage.getItem('userPhoto');
        setPreviewPhoto(photo || UserAvatar);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreviewPhoto(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await AxiosInstance.put("/api/user/modifier-photo/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      let newPhotoUrl = response.data.photo;
      if (newPhotoUrl && !newPhotoUrl.startsWith('http')) {
        newPhotoUrl = `${AxiosInstance.defaults.baseURL}${newPhotoUrl}`;
      }

      setUser(prev => ({ ...prev, photo: newPhotoUrl }));
      setPreviewPhoto(newPhotoUrl);
      localStorage.setItem('userPhoto', newPhotoUrl);
      setSuccessMessage("Photo mise à jour avec succès");

    } catch (err) {
      console.error("❌ Erreur upload photo:", err);
      setErrorMessage("Erreur lors de l'upload de la photo");
      const oldPhoto = localStorage.getItem('userPhoto');
      setPreviewPhoto(oldPhoto || UserAvatar);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.new_password && user.new_password !== user.confirm_password) {
      setErrorMessage("Les mots de passe ne correspondent pas");
      return;
    }

    const formData = new FormData();
    Object.keys(user).forEach((key) => {
      if (user[key] !== null && user[key] !== undefined && user[key] !== '') {
        formData.append(key, user[key]);
      }
    });

    try {
      const response = await AxiosInstance.put("/api/user/modifier-profil/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Informations mises à jour avec succès");

      const updatedUser = response.data.user || response.data;

      let photoUrl = updatedUser.photo || user.photo;
      if (photoUrl && !photoUrl.startsWith('http')) {
        photoUrl = `${AxiosInstance.defaults.baseURL}${photoUrl}`;
      }

      setUser(prev => ({
        ...prev,
        nom: updatedUser.nom || prev.nom,
        prenom: updatedUser.prenom || prev.prenom,
        email: updatedUser.email || prev.email,
        phone: updatedUser.phone || prev.phone,
        photo: photoUrl,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));

      setPreviewPhoto(photoUrl || UserAvatar);

      localStorage.setItem('userNom', updatedUser.nom || user.nom);
      localStorage.setItem('userPrenom', updatedUser.prenom || user.prenom);
      localStorage.setItem('userEmail', updatedUser.email || user.email);
      localStorage.setItem('userPhone', updatedUser.phone || user.phone);
      if (photoUrl) localStorage.setItem('userPhoto', photoUrl);

      setModalOpen(false);
      setErrorMessage("");

    } catch (err) {
      console.error('❌ Erreur mise à jour:', err);
      setErrorMessage(err.response?.data?.message || "Erreur lors de la mise à jour");
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return "";
    const digits = phone.replace(/\D/g, "");
    const match = digits.match(/^(\d{3})(\d{2})(\d{3})(\d{2})$/);
    return match ? `${match[1]} ${match[2]} ${match[3]} ${match[4]}` : phone;
  };

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-gray-900 dark:text-white">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="p-6 flex justify-center items-center h-64">
            <p>Chargement des données...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden dark:bg-gray-900 dark:text-white">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="p-6">
          <h1 className="text-3xl font-bold mb-10">Mon Profil</h1>

          {successMessage && <SuccessMessage message={successMessage} onClose={() => setSuccessMessage('')} />}
          {errorMessage && <ErrorMessage message={errorMessage} onClose={() => setErrorMessage('')} />}

          {/* --- CARD PROFIL --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
  {/* TITRE */}
  <div className="text-center mb-6">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mes informations</h2>
    <hr className="mt-4 mb-6 border-gray-300 dark:border-gray-600" />
  </div>

  {/* PHOTO + INFOS */}
  <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
    {/* PHOTO */}
    <div className="flex flex-col items-center relative">
      <img
        src={previewPhoto || UserAvatar}
        alt="Profil"
        className="w-56 h-56 rounded-full object-cover border-4 border-gray-300 dark:border-gray-700"
        onError={(e) => { e.target.src = UserAvatar; }}
      />
      <label className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700
                        text-white w-10 h-10 rounded-full flex items-center justify-center
                        cursor-pointer shadow-lg">
        <input type="file" className="hidden" onChange={handlePhotoChange} accept="image/*" />
        <svg className="w-6 h-6 text-white"
             xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 18V8a1 1 0 0 1 1-1h1.5l1.707-1.707A1 1 0 0 1 8.914 5h6.172a1 1 0 0 1 .707.293L17.5 7H19a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
      </label>
    </div>

    {/* INFOS */}
    <div className="text-lg space-y-5 flex-1">
      <p className="flex"><span className="font-semibold w-28">Nom :</span> {user.nom}</p>
      <p className="flex"><span className="font-semibold w-28">Prénom :</span> {user.prenom}</p>
      <p className="flex"><span className="font-semibold w-28">Email :</span> {user.email}</p>
      <p className="flex"><span className="font-semibold w-28">Téléphone :</span> {formatPhone(user.phone)}</p>
      <p className="flex"><span className="font-semibold w-28">Rôle :</span> {
        { admin: "Administrateur", prof: "Professeur", etud: "Étudiant" }[user.role] || user.role
      }</p>
    </div>
  </div>

  {/* BOUTON MODIFIER */}
  <div className="mt-6 flex justify-center md:justify-end">
    <button
      onClick={() => setModalOpen(true)}
      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
    >
      <svg
        className="w-6 h-6"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"/>
      </svg>
      Modifier
    </button>
  </div>
</div>
        </main>

        <Footer />
      </div>

      {/* --- MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl 
                          w-[480px] max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6">Modifier mes informations</h2>

            {/* FORMULAIRE SANS PHOTO */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block font-medium mb-1">Nom</label>
                <input type="text" name="nom" value={user.nom || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
              </div>

              <div>
                <label className="block font-medium mb-1">Prénom</label>
                <input type="text" name="prenom" value={user.prenom || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
              </div>

              <div>
                <label className="block font-medium mb-1">Email</label>
                <input type="email" name="email" value={user.email || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
              </div>

              <div>
                <label className="block font-medium mb-1">Téléphone</label>
                <input type="tel" name="phone" value={user.phone || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
              </div>

              {/* Mot de passe */}
              <div className="relative">
                <label className="block font-medium mb-1">Mot de passe actuel</label>
                <input type={showPassword.current ? "text" : "password"} name="current_password"
                       value={user.current_password || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
                <button type="button" className="absolute right-3 top-[42px]"
                        onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}>
                  {showPassword.current ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>

              <div className="relative">
                <label className="block font-medium mb-1">Nouveau mot de passe</label>
                <input type={showPassword.new ? "text" : "password"} name="new_password"
                       value={user.new_password || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
                <button type="button" className="absolute right-3 top-[42px]"
                        onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}>
                  {showPassword.new ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>

              <div className="relative">
                <label className="block font-medium mb-1">Confirmer le nouveau mot de passe</label>
                <input type={showPassword.confirm ? "text" : "password"} name="confirm_password"
                       value={user.confirm_password || ""} onChange={handleChange}
                       className="w-full p-3 rounded border dark:bg-gray-700 dark:border-gray-600"/>
                <button type="button" className="absolute right-3 top-[42px]"
                        onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}>
                  {showPassword.confirm ? <EyeOpen /> : <EyeClosed />}
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button type="button" onClick={() => setModalOpen(false)}
                        className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700">Annuler</button>
                <button type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profil;
