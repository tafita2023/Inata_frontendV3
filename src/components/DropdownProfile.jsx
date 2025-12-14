import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Transition from '../utils/Transition';
import { useNavigate } from "react-router-dom";
import { useThemeProvider } from "../utils/ThemeContext";
import AxiosInstance from "../instance/AxiosInstance"; // Import AxiosInstance

import UserAvatar from '../images/user-36-07.jpg';

function DropdownProfile({ align }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userNom, setUserNom] = useState('');
  const [userPrenom, setUserPrenom] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userPhoto, setUserPhoto] = useState(UserAvatar); // valeur par défaut

  const navigate = useNavigate();
  const { changeCurrentTheme } = useThemeProvider();

  const trigger = useRef(null);
  const dropdown = useRef(null);

  // Récupérer l'image avec AxiosInstance
  const getUserPhoto = async () => {
    try {
      const response = await AxiosInstance.get("/api/utilisateur-connecte/");
      const photo = response.data.photo;

      // Si la photo existe et que l'URL n'est pas complète, ajouter le préfixe de base
      if (photo && !photo.startsWith('http')) {
        setUserPhoto(`${AxiosInstance.defaults.baseURL}${photo}`);
      } else {
        setUserPhoto(photo || UserAvatar);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la photo:', error);
      setUserPhoto(UserAvatar); // Utiliser l'avatar par défaut en cas d'erreur
    }
  };

  useEffect(() => {
    const nom = localStorage.getItem('userNom');
    const prenom = localStorage.getItem('userPrenom');
    const role = localStorage.getItem('userRole');
    const photo = localStorage.getItem('userPhoto');

    if (nom) setUserNom(nom);
    if (prenom) setUserPrenom(prenom);
    if (role) setUserRole(role);

    // Charger la photo de l'utilisateur avec AxiosInstance
    if (photo) {
      setUserPhoto(photo);
    } else {
      getUserPhoto(); // Récupérer l'image si elle n'est pas dans le localStorage
    }
  }, []);

  // Écoute les changements de localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const photo = localStorage.getItem('userPhoto');
      if (photo && !photo.startsWith('http')) {
        setUserPhoto(`${AxiosInstance.defaults.baseURL}${photo}`);
      } else {
        setUserPhoto(photo || UserAvatar);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, [dropdownOpen]);

  // Fermer si touche Esc
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [dropdownOpen]);

  // Formater le rôle
  const roleMap = {
    admin: 'Administrateur',
    prof: 'Professeur',
    etud: 'Étudiant',
  };
  const displayRole = roleMap[userRole] || userRole;

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="inline-flex justify-center items-center group"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <img
          className="w-7 h-8 rounded-full"
          src={userPhoto || UserAvatar}
          width="32"
          height="32"
          alt="User"
          onError={(e) => { e.target.src = UserAvatar; }} // Au cas où l'image ne se charge pas
        />
        <div className="flex items-center truncate">
          <span className="truncate ml-2 text-sm font-medium text-gray-600 dark:text-gray-100 group-hover:text-gray-800 dark:group-hover:text-white">
            {userPrenom || 'Utilisateur'}
          </span>
          <svg className="w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500" viewBox="0 0 12 12">
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`origin-top-right z-10 absolute top-full min-w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 py-1.5 rounded-lg shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          <div className="pt-0.5 pb-2 px-3 mb-1 border-b border-gray-200 dark:border-gray-700/60">
            <div className="font-medium text-gray-800 dark:text-gray-100">{userNom || 'Utilisateur'}</div>
            <div className="font-medium text-gray-800 dark:text-gray-100">{userPrenom || 'Utilisateur'}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic">{displayRole || 'Rôle inconnu'}</div>
          </div>
          <ul>
            <li>
              <Link
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                to="/profil"
                onClick={() => setDropdownOpen(false)}
              >
                Paramettres
              </Link>
            </li>
            <li>
              <button
                className="font-medium text-sm text-violet-500 hover:text-violet-600 dark:hover:text-violet-400 flex items-center py-1 px-3"
                onClick={() => {
                  setDropdownOpen(false);
                  localStorage.removeItem('authToken');
                  localStorage.removeItem('userNom');
                  localStorage.removeItem('userPrenom');
                  localStorage.removeItem('userRole');
                  localStorage.removeItem('userPhoto');
                  setUserNom('');
                  setUserPrenom('');
                  setUserRole('');
                  setUserPhoto(UserAvatar);
                  changeCurrentTheme("light");
                  navigate("/");
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;
