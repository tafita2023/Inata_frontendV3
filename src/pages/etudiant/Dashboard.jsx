import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import Roue from '../../charts/DoughnutChart';
import Calendar from '../../partials/dashboard/Agenda';

import Eleve from '../../partials/dashboard/Eleve';
import Prof from '../../partials/dashboard/Professeur';
import Admin from '../../partials/dashboard/Admin';

import Banner from '../../partials/Banner';
import PopupMessage from '../../components/PopupMessage';
import { useLocation } from 'react-router-dom';

function Dashboard({ currentUser }) {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

    // Afficher le popup de bienvenue
    useEffect(() => {
      if (location.state?.showWelcome) {
        // Vérifier le rôle de l'utilisateur
        if (currentUser?.role?.toLowerCase() === "diplome") {
          setPopupMessage("Bon retour parmis nous !");
        } else {
          setPopupMessage("Bonjour, bienvenue !");
        }
    
        setShowPopup(true);
    
        const timer = setTimeout(() => {
          setShowPopup(false);
        }, 3000);
    
        // Nettoyer state pour ne pas afficher le popup à chaque fois
        window.history.replaceState({}, document.title);
      }
    }, [location.state, currentUser]);
    
  return (
    <div className="flex h-screen overflow-hidden">
      {showPopup && (
        <PopupMessage
          message={popupMessage}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">

              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>

            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">

              <Eleve />
              <Roue />
              <Eleve />
              <Calendar />
            </div>

          </div>
        </main>
        <Footer />

        <Banner />

      </div>
    </div>
  );
}

export default Dashboard;