import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";

import SidebarLinkGroup from "./SidebarLinkGroup";
import LogoInata from '../images/Inata2.png';

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  variant = 'default',
}) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === "true");

  const [openDropdown, setOpenDropdown] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://127.0.0.1:8000/api/utilisateur-connecte/", {
          
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Utilisateur connecté :", response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du rôle", error);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchCurrentUser();
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (!sidebarOpen || sidebar.current.contains(target) || trigger.current.contains(target)) return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div className="min-w-fit">
      {/* Sidebar backdrop (mobile only) */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex lg:flex! flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-[100dvh] overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:w-64! shrink-0 bg-white dark:bg-gray-800 p-4 transition-all duration-200 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} ${variant === 'v2' ? 'border-r border-gray-200 dark:border-gray-700/60' : 'rounded-r-2xl shadow-xs'}`}>

        {/* Sidebar header */}
        <div className="relative flex flex-col items-center pt-4">
          {/* Bouton (en haut à droite) */}
          <button
            ref={trigger}
            className="absolute right-3 top-3 lg:hidden text-gray-500 hover:text-gray-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className={`shrink-0 w-6 h-6 transition-transform duration-300 ${
                sidebarExpanded ? 'rotate-0' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 10L7 12l2 2M12 5v14M5 4h14c.55 0 1 .45 1 1v14c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1Z" />
            </svg>
          </button>

          {/* Logo centré */}
          <NavLink end to="/dashboard" className="block mb-1">
            <img
              className={`rounded-full transition-all duration-300 ease-in-out ${
                sidebarExpanded ? 'w-32 h-32' : 'w-8 h-8'
              }`}
              src={LogoInata}
              alt="Logo"
            />
          </NavLink>

          {/* Texte InATA centré sous le logo */}
          <div
            className={`text-center font-semibold transition-all duration-300 ease-in-out ${
              sidebarExpanded ? 'text-2xl' : 'text-sm'
            }`}
          >
            InATA
          </div>
        </div>

        {/* Links */}
        <div className="space-y-8">

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end w-full">
          <div className="w-12 pl-4 pr-3">
          <button
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400 transition-colors duration-200"
          >
            <span className="sr-only">Expand / collapse sidebar</span>
            <svg
              className={`shrink-0 w-6 h-6 transition-transform duration-300 ${
                sidebarExpanded ? 'rotate-180' : ''
              }`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m7 10 1.99994 1.9999-1.99994 2M12 5v14M5 4h14c.5523 0 1 .44772 1 1v14c0 .5523-.4477 1-1 1H5c-.55228 0-1-.4477-1-1V5c0-.55228.44772-1 1-1Z"/>
            </svg>
          </button>
          </div>
        </div>

          {/* Pages group */}
          <div className="mt-2">
            <h3 className="text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold pl-3">
              <span className="hidden lg:block lg:sidebar-expanded:hidden 2xl:hidden text-center w-6 mb-2" aria-hidden="true">
                •••
              </span>
              <span className="lg:hidden lg:sidebar-expanded:block 2xl:block">Pages</span>
            </h3>
            <ul className="">

              {/* Dashboard Admin */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/dashboard")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/admin/dashboard"
                  className={({ isActive }) =>
                    `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                      isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 stroke-current ${
                        pathname.includes("admin/dashboard") ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      >
                      <path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm14 18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4ZM5 11a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Zm14 2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4Z"/>
                    </svg>
                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200" title="Dashboard">
                      Dashboard
                    </span>

                  </div>
                </NavLink>
              </li>
              )}

              {/* Utilisateurs */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/utilisateurs")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/admin/utilisateurs"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/utilisateurs") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 stroke-current ${
                        pathname.includes("admin/utilisateurs") ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                      width="24"
                      height="24"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M7 19H5a1 1 0 0 1-1-1v-1a3 3 0 0 1 3-3h1m4-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm7.441 1.559a1.907 1.907 0 0 1 0 2.698l-6.069 6.069L10 19l.674-3.372 6.07-6.07a1.907 1.907 0 0 1 2.697 0Z" />
                    </svg>
                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200" title="Utilisateurs">
                      Utilisateurs
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Classe */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/classe")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/classes"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/classe") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('admin/classe') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M3.78552 9.5 12.7855 14l9-4.5-9-4.5-8.99998 4.5Zm0 0V17m3-6v6.2222c0 .3483 2 1.7778 5.99998 1.7778 4 0 6-1.3738 6-1.7778V11" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Niveau
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Matière */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/matiere")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/matieres"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/matiere") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('admin/matiere') 
                      ? 'text-violet-500' 
                      : 'text-gray-400 dark:text-gray-500'
                      }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"/>
                  </svg>
                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Matières
                    </span>
                  </div>
                </div>
                </NavLink>
              </li>
              )}

              {/* Notes Admin */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/notes")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/admin/notes"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/notes") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <svg
                            className={`shrink-0 stroke-current ${
                              pathname.includes('notes') 
                                ? 'text-violet-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke-width="2"
                          >
                            <path d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/>
                          </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Notes
                    </span>
                  </div>
                </div>
                </NavLink>
              </li>
              )}

              {/* Emploi du temps Admin */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/emploi_du_temps")
                ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/emploi_du_temps"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/emploi_du_temps") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('admin/emploi_du_temps')
                        ? 'text-violet-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Emploi du temps
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Absence Admin */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/absence")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/absence"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/absence") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('admin/absence') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <path d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Absences
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Ecolage */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/ecolage")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/ecolage"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/ecolage") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('admin/ecolage') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18"/>
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Ecolages
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Bulletins */}
              {currentUser?.role?.toLowerCase() === "admin" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("admin/bulletin")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/admin/bulletin"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("admin/bulletins") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 stroke-current ${
                        pathname.includes('admin/bulletins') 
                          ? 'text-violet-500' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      >
                      <path d="M10 3v4a1 1 0 0 1-1 1H5m8-2h3m-3 3h3m-4 3v6m4-3H8M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM8 12v6h8v-6H8Z"/>
                    </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Bulletins
                    </span>
                  </div>
                </NavLink>
              </li>
               )}

               {/* Menu professeur */}

              {/* Dashboard Prof */}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/dashboard")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/professeur/dashboard"
                  className={({ isActive }) =>
                    `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                      isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 stroke-current ${
                        pathname.includes("professeur/dashboard") ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      >
                      <path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm14 18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4ZM5 11a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Zm14 2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4Z"/>
                    </svg>
                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200" title="Dashboard">
                      Dashboard
                    </span>

                  </div>
                </NavLink>
              </li>
              )}

              {/* Emploi du temps Prof*/}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/emploi_du_temps")
                ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/professeur/emploi_du_temps"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("professeur/emploi_du_temps") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('professeur/emploi_du_temps')
                        ? 'text-violet-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Emploi du temps
                    </span>
                  </div>
                </NavLink>
              </li>
              )}
              
              {/* Notes prof */}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/notes")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/professeur/notes"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("notes") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <svg
                            className={`shrink-0 stroke-current ${
                              pathname.includes('professeur/notes') 
                                ? 'text-violet-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke-width="2"
                          >
                            <path d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/>
                          </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Notes
                    </span>
                  </div>
                </div>
                </NavLink>
              </li>
              )}

              {/* Absence Prof */}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/absence")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/professeur/absence"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("professeur/absence") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('professeur/absence') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <path d="m11.5 11.5 2.071 1.994M4 10h5m11 0h-1.5M12 7V4M7 7V4m10 3V4m-7 13H8v-2l5.227-5.292a1.46 1.46 0 0 1 2.065 2.065L10 17Zm-5 3h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Absences
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Devoir Prof */}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/devoir")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/professeur/devoir"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("professeur/devoir") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('professeur/devoir') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Devoir
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Devoir Prof */}
              {currentUser?.role?.toLowerCase() === "prof" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("professeur/salaire")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/professeur/salaire"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("professeur/salaire") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('professeur/salaire') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M8 7V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-1M3 18v-7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Salaire
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

               {/* Menu etudiant */}

              {/* Dashboard */}
              {["etud", "diplome"].includes(currentUser?.role?.toLowerCase()) && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("etudiant/dashboard")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/etudiant/dashboard"
                  className={({ isActive }) =>
                    `block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                      isActive ? "" : "hover:text-gray-900 dark:hover:text-white"
                    }`
                  }
                >
                  <div className="flex items-center">
                    <svg
                      className={`shrink-0 stroke-current ${
                        pathname.includes("etudiant/dashboard") ? "text-violet-500" : "text-gray-400 dark:text-gray-500"
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 22 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      >
                      <path d="M5 3a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5Zm14 18a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4ZM5 11a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5Zm14 2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4Z"/>
                    </svg>
                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200" title="Dashboard">
                      Dashboard
                    </span>

                  </div>
                </NavLink>
              </li>
              )}

              {/* Emploi du temps */}
              {currentUser?.role?.toLowerCase() === "etud" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("etudiant/emploi_du_temps")
                ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/etudiant/emploi_du_temps"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("etudiant/emploi_du_temps") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('etudiant/emploi_du_temps')
                        ? 'text-violet-500'
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 10h16m-8-3V4M7 7V4m10 3V4M5 20h14a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Zm3-7h.01v.01H8V13Zm4 0h.01v.01H12V13Zm4 0h.01v.01H16V13Zm-8 4h.01v.01H8V17Zm4 0h.01v.01H12V17Zm4 0h.01v.01H16V17Z" />
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Emploi du temps
                    </span>
                  </div>
                </NavLink>
              </li>
              )}
              
              {/* Notes  */}
              {["etud", "diplome"].includes(currentUser?.role?.toLowerCase()) && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("etudiant/notes")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                <NavLink
                  end
                  to="/etudiant/notes"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("notes") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                  <svg
                            className={`shrink-0 stroke-current ${
                              pathname.includes('etudiant/notes') 
                                ? 'text-violet-500' 
                                : 'text-gray-400 dark:text-gray-500'
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 22 22"
                            fill="none"
                            stroke-width="2"
                          >
                            <path d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/>
                          </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Notes
                    </span>
                  </div>
                </div>
                </NavLink>
              </li>
              )}

              {/* Devoir */}
              {currentUser?.role?.toLowerCase() === "etud" && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("etudiant/devoir")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/etudiant/devoir"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("etudiant/devoir") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('etudiant/devoir') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.03v13m0-13c-2.819-.831-4.715-1.076-8.029-1.023A.99.99 0 0 0 3 6v11c0 .563.466 1.014 1.03 1.007 3.122-.043 5.018.212 7.97 1.023m0-13c2.819-.831 4.715-1.076 8.029-1.023A.99.99 0 0 1 21 6v11c0 .563-.466 1.014-1.03 1.007-3.122-.043-5.018.212-7.97 1.023"/>
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Devoir
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

              {/* Ecolage */}
              {["etud", "diplome"].includes(currentUser?.role?.toLowerCase()) && (
              <li className={`pl-2.5 pr-3 py-2 mb-2 rounded-lg mb-0.5 last:mb-0 bg-linear-to-r transition-colors duration-150 ${
                pathname.includes("etudiant/ecolage")
                  ? "from-violet-500/[0.12] dark:from-violet-500/[0.24] to-violet-500/[0.04]"
                  : "hover:from-violet-500/[0.08] hover:to-violet-500/[0.03] dark:hover:from-violet-500/[0.12] dark:hover:to-violet-500/[0.04]"
              }`}>
                  <NavLink
                  end
                  to="/etudiant/ecolage"
                  className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                    pathname.includes("etudiant/ecolage") ? "" : "hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  <div className="flex items-center">
                  <svg
                    className={`shrink-0 stroke-current ${
                      pathname.includes('etudiant/ecolage') 
                        ? 'text-violet-500' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 14h2m3 0h4m2 2h2m0 0h2m-2 0v2m0-2v-2m-5 4H4c-.55228 0-1-.4477-1-1V7c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v4M3 10h18"/>
                  </svg>

                    <span className="text-sm font-medium ml-2 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                      Ecolages
                    </span>
                  </div>
                </NavLink>
              </li>
              )}

            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Sidebar;
