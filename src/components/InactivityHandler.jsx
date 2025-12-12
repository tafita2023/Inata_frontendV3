import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const InactivityHandler = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('authToken')) return;

    let timer;

    const logout = () => {
      localStorage.clear();
      alert('Vous avez été déconnecté pour cause d’inactivité.');
      navigate('/login');
    };

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer(); // Initialise le timer dès le chargement

    return () => {
      clearTimeout(timer);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [navigate]);

  return null; // Ce composant n'affiche rien
};

export default InactivityHandler;
