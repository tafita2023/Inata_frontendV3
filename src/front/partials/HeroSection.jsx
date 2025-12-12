import React from 'react';
import Modele from '../images/etudiants2.jpg';

const HeroSection = () => {
  return (
    <section
      id="accueil"
      className="relative text-white"
      style={{
        backgroundImage: `url(${Modele})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}      
      <div className="container mx-auto px-6 h-full flex items-center pt-20"> {/* pt-20 pour descendre un peu depuis le haut */}
        <div className="w-full md:w-1/2 text-white"> {/* text-white pour meilleur contraste */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Bienvenue à l'InATA</h1>
          <p className="text-xl mb-8">Une éducation de qualité pour préparer les leaders de demain</p>
          <div className="flex space-x-4">
            <button className="border-2 border-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-800 transition duration-300">
              En savoir plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;