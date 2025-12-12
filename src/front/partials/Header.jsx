import React, { useState, useEffect } from 'react';
import LogoInata from '../../images/InATA2.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProgramsDropdownOpen, setIsProgramsDropdownOpen] = useState(false);
  const [isNestedDropdownOpen, setIsNestedDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
        setIsProgramsDropdownOpen(false);
        setIsNestedDropdownOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.dropdown-container') &&
        !event.target.closest('.mobile-menu-container')
      ) {
        setIsProgramsDropdownOpen(false);
        setIsNestedDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsProgramsDropdownOpen(false);
    setIsNestedDropdownOpen(false);
  };

  const toggleProgramsDropdown = () => {
    setIsProgramsDropdownOpen(!isProgramsDropdownOpen);
    // Close nested dropdown if parent dropdown closed
    if (isProgramsDropdownOpen) {
      setIsNestedDropdownOpen(false);
    }
  };

  const toggleNestedDropdown = (e) => {
    e.stopPropagation(); // Prevent closing parent dropdown
    setIsNestedDropdownOpen(!isNestedDropdownOpen);
  };

  const closeAllMenus = () => {
    setIsProgramsDropdownOpen(false);
    setIsNestedDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Mobile helpers
  const onMobileDropdownLinkClick = () => {
    closeAllMenus();
  };

  const onMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="container mx-auto max-w-6xl px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img src={LogoInata} alt="Logo École" className="h-12" />
            <span className="ml-3 text-2xl font-semibold text-gray-900">InATA</span>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:block">
            <ul className="flex space-x-10 items-center">
              <li>
                <a href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                  Accueil
                </a>
              </li>
              <li className="relative dropdown-container">
                <button
                  onClick={toggleProgramsDropdown}
                  className="flex items-center text-gray-700 hover:text-blue-600 font-medium focus:outline-none"
                  aria-expanded={isProgramsDropdownOpen}
                  aria-haspopup="true"
                >
                  Formations
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      isProgramsDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProgramsDropdownOpen && (
                  <div
                    className="absolute z-50 mt-2 w-56 bg-white rounded-lg shadow-md py-2 ring-1 ring-black ring-opacity-5"
                    role="menu"
                    aria-label="Formations dropdown"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      href="/formation/cursus"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsProgramsDropdownOpen(false)}
                    >
                      Cursus de formation 
                    </a>
                    <a
                      href="/formation/academique"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsProgramsDropdownOpen(false)}
                    >
                      Parcours Academique
                    </a>
                    <a
                      href="/"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsProgramsDropdownOpen(false)}
                    >
                      Professionnelles
                    </a>
                    <a
                      href="/"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsProgramsDropdownOpen(false)}
                    >
                      Master Pro des Infrastructures IT
                    </a>
                  </div>
                )}
              </li>
              <li>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300">
                  Contact
                </a>
              </li>

              <li>
                <a
                  href="/login"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-sm"
                >
                  Login
                </a>
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none"
            aria-label="Toggle menu"
            onClick={toggleMobileMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav
            className="md:hidden mt-4 mobile-menu-container rounded-lg bg-white shadow-md py-4 px-6"
            aria-label="Mobile menu"
          >
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="block font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                  onClick={onMobileMenuLinkClick}
                >
                  Accueil
                </a>
              </li>
              <li>
                <button
                  className="w-full flex justify-between items-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition focus:outline-none"
                  onClick={toggleProgramsDropdown}
                  aria-expanded={isProgramsDropdownOpen}
                  aria-controls="mobile-programs-dropdown"
                >
                  Formations
                  <svg
                    className={`ml-1 h-4 w-4 transition-transform duration-300 ${
                      isProgramsDropdownOpen ? 'transform rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProgramsDropdownOpen && (
                  <div
                    id="mobile-programs-dropdown"
                    className="pl-4 mt-2 space-y-2"
                    role="menu"
                    aria-label="Formations dropdown"
                  >
                    <a
                      href="/formation/cursus"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                      role="menuitem"
                      tabIndex={0}
                      onClick={onMobileDropdownLinkClick}
                    >
                      Cursus de formation 
                    </a>
                    {/* Mobile nested dropdown */}
                    <div className="space-y-1">
                      <button
                        onClick={toggleNestedDropdown}
                        className="w-full flex justify-between items-center font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={isNestedDropdownOpen}
                        type="button"
                      >
                        Académiques
                        <svg
                          className={`ml-2 h-4 w-4 transition-transform duration-300 ${
                            isNestedDropdownOpen ? 'transform rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isNestedDropdownOpen && (
                        <div className="pl-4 space-y-1" role="menu" aria-label="Académiques submenu">
                          <a
                            href="/"
                            className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                            role="menuitem"
                            tabIndex={0}
                            onClick={onMobileDropdownLinkClick}
                          >
                            Parcours : Tronc Commun (L1 - L2)
                          </a>
                          <a
                            href="/"
                            className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                            role="menuitem"
                            tabIndex={0}
                            onClick={onMobileDropdownLinkClick}
                          >
                            Parcours : Multimedia et Developpement web (L3)
                          </a>

                          <a
                            href="/"
                            className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                            role="menuitem"
                            tabIndex={0}
                            onClick={onMobileDropdownLinkClick}
                          >
                            Parcours : Developpement d'application (L3)
                          </a>

                          <a
                            href="/"
                            className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                            role="menuitem"
                            tabIndex={0}
                            onClick={onMobileDropdownLinkClick}
                          >
                            Parcours : Système et Reseaux Informatique (L3)
                          </a>
                        </div>
                      )}
                    </div>

                    <a
                      href="/"
                      className="block text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                      role="menuitem"
                      tabIndex={0}
                      onClick={onMobileDropdownLinkClick}
                    >
                      Professionnelles
                    </a>

                    <a
                      href="/"
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 rounded-md"
                      role="menuitem"
                      tabIndex={0}
                      onClick={() => setIsProgramsDropdownOpen(false)}
                    >
                      Master Pro des Infrastructures IT
                    </a>

                  </div>
                )}
              </li>
              <li>
                <a
                  href="#contact"
                  className="block font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md px-3 py-2 transition"
                  onClick={onMobileMenuLinkClick}
                >
                  Contact
                </a>
              </li>
              <a
                href="/login"
                className="ml-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-sm"
              >
                Login
              </a>

            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

