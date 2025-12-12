import React, { useState, useEffect } from 'react';
import Sidebar from '../../partials/Sidebar';
import Header from '../../partials/Header';
import Footer from '../../partials/Footer';

import Calendar from '../../partials/dashboard/Agenda';
import Eleve from '../../partials/dashboard/Eleve';
import Task from '../../partials/dashboard/Task';

import Banner from '../../partials/Banner';
import PopupMessage from '../../components/PopupMessage';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const displayPopups = async () => {
      if (location.state?.showWelcome) {
        setPopupMessage('Bonjour, bienvenue !');
        setShowPopup(true);

        // Fermer le popup de bienvenue après 3s
        setTimeout(() => setShowPopup(false), 3000);
        // Nettoyer state pour ne pas réafficher le popup à chaque navigation
        window.history.replaceState({}, document.title);
      }
    };

    displayPopups();
  }, [location.state]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Popup de bienvenue */}
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
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">Dashboard</h1>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
              <Eleve />
              <Eleve />
              <Eleve />
              <Calendar />
              <Task />
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
