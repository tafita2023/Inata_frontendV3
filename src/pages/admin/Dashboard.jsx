import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';
import Graphique from '../../partials/dashboard/Graphique';
import Task from '../../partials/dashboard/Task';
import Calendar from '../../partials/dashboard/Calendar';
import Frais from '../../partials/dashboard/FraisScolarite';
import Paiemment from '../../partials/dashboard/Paiement';
import SalaireProf from '../../partials/dashboard/SalaireProf';

import Banner from '../../partials/Banner';
import PopupMessage from '../../components/PopupMessage';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

    // Afficher le popup de bienvenue
    useEffect(() => {
      // Si la navigation a passé "showWelcome", on affiche le popup
      if (location.state?.showWelcome) {
        setPopupMessage('Bonjour, bienvenue !');
        setShowPopup(true);
        const timer = setTimeout(() => {
          setShowPopup(false);

          const userPhoto = localStorage.getItem("userPhoto") || "";
        if (!userPhoto || userPhoto === "null") {
          setShowAddPhotoPopup(true);
        }
        }, 3000);
  
        // Nettoyer state pour ne pas afficher le popup à chaque fois
        window.history.replaceState({}, document.title);
      }}, [location.state]);

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

              <Graphique />
              <Frais />
              <SalaireProf />
              <Paiemment />
              <Task />
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