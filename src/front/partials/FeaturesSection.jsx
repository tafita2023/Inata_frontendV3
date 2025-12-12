import React, { useState } from 'react';
import Etudiant from '../../images/etudiant.jpg'
import Fond from '../../images/fond.jpg'

const FeaturesSection = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  const toggleCard = (index) => {
    if (flippedCard === index) {
      setFlippedCard(null); // Ferme la carte si on clique dessus à nouveau
    } else {
      setFlippedCard(index); // Ouvre la nouvelle carte et ferme les autres
    }
  };

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 3v4a1 1 0 0 1-1 1H5m14-4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1ZM9 12h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Zm5.697 2.395v-.733l1.269-1.219v2.984l-1.268-1.032Z" />
        </svg>
      ),
      title: "Multimédia",
      description: "Formation complète en création et gestion de contenu multimédia."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 7h.01m3.486 1.513h.01m-6.978 0h.01M6.99 12H7m9 4h2.706a1.957 1.957 0 0 0 1.883-1.325A9 9 0 1 0 3.043 12.89 9.1 9.1 0 0 0 8.2 20.1a8.62 8.62 0 0 0 3.769.9 2.013 2.013 0 0 0 2.03-2v-.857A2.036 2.036 0 0 1 16 16Z" />
        </svg>
      ),
      title: "Arts plastic",
      description: "Compétences en arts plastiques, axées sur l'expression créative et les techniques artistiques."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1M5 12h14M5 12a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1m-2 3h.01M14 15h.01M17 9h.01M14 9h.01" />
        </svg>
      ),
      title: "Réseaux Informatiques (Préparation au CCNA)",
      description: "Préparation approfondie pour les certifications CCNA et gestion des réseaux."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m8 8-4 4 4 4m8 0 4-4-4-4m-2-3-4 14" />
        </svg>
      ),
      title: "Développement d'Applications (POO)",
      description: "Apprentissage des principes de la programmation orientée objet pour le développement d'applications."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 6c0 1.657-3.134 3-7 3S5 7.657 5 6m14 0c0-1.657-3.134-3-7-3S5 4.343 5 6m14 0v6M5 6v6m0 0c0 1.657 3.134 3 7 3s7-1.343 7-3M5 12v6c0 1.657 3.134 3 7 3s7-1.343 7-3v-6" />
        </svg>
      ),
      title: "Développement de Bases de Données",
      description: "Conception et gestion de bases de données pour des applications robustes."
    },
    {
      icon: (
        <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 0 0-2 2v4m5-6h8M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m0 0h3a2 2 0 0 1 2 2v4m0 0v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6m18 0s-4 2-9 2-9-2-9-2m9-2h.01" />
        </svg>
      ),
      title: "Gestion de Projet TIC",
      description: "Compétences en gestion de projet pour les technologies de l'information et de la communication."
    }
  ];
  
  return (
    <section id="programmes" className="py-20 bg-gray-200" >
      <div className="container mx-auto px-6">
      <div className="rounded-lg text-gray-800 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4" >
        <div className="md:col-span-2 bg-white p-5 rounded-lg shadow flex items-center justify-center" style={{
          backgroundImage: `url(${Fond})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
          <div className="text-left text-dark" style={{ fontSize: '22px' }}>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Présentation de l'InATA</h2>

            <p>L'Institut des Arts et des Technologies Avancées (InATA) est un établissement d'enseignement supérieur privé fondé en 2003 par l'Association pour la Promotion et le Développement des Arts et des Technologies Avancées (APDEV-ATA), légalement constituée.</p>
            <br />
            <p>Autorisé par le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESupReS), InATA est spécialisé dans l'enseignement des « Arts plastiques » et des « Technologies de l'Information et de la Communication ».</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow flex items-center justify-center">
          <img src={Etudiant} alt="Logo" className="w-full h-auto rounded-lg" />
        </div>
      </div>
      </div>
      
        <h2 className="text-3xl font-bold text-center text-gray-800 mt-20 mb-12">Domaines d'enseignement et d'intervention</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative h-64 cursor-pointer"
              onClick={() => toggleCard(index)}
            >
              {/* Carte avec effet 3D */}
              <div className={`relative w-full h-full transition-all duration-500 preserve-3d ${
                flippedCard === index ? 'rotate-y-180' : ''
              }`}>
                
                {/* Face avant (hover effects) */}
                <div className={`absolute inset-0 bg-white p-8 rounded-lg shadow-md backface-hidden transition-all duration-300
                  hover:shadow-xl hover:-translate-y-2 hover:scale-105 border border-gray-100 hover:border-blue-200`}>
                  <div className="flex justify-center mb-6 transition-transform duration-300 hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800 transition-colors duration-300 hover:text-blue-600 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-4 text-center">
                    Voir plus
                  </p>
                </div>
                
                {/* Face arrière */}
                <div className="absolute inset-0 bg-white p-8 rounded-lg shadow-md backface-hidden rotate-y-180 border border-gray-100">
                  <div className="h-full flex flex-col justify-center items-center text-center">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                    <p className="text-gray-500 text-sm mt-4">
                      Cliquez pour revenir
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;