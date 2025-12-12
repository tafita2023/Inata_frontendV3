import { useState } from 'react';
import Logo from './../images/InATA2.png';
import Code from './../images/code.jpg';
import Multi from './../images/multimedia.jpg';
import Program from './../images/program.jpg';
import Cloud from './../images/cloud.jpg';

const Parcours = () => {
  // Options disponibles
  const options = [
    { id: 1, name: 'Tronc Commun (L1 - L2)' },
    { id: 2, name: 'Multimedia et Developpement web (L3)' },
    { id: 3, name: 'Developpement d\'applications (L3)' },
    { id: 4, name: 'Système et Reseaux Informatiques (L3)' },
  ];

  // Données complètes pour chaque option (texte + image)
  const parcoursData = {
    'tronc commun (l1 - l2)': {
      text: `Le tronc commun en L1 et L2 fournit les bases fondamentales en informatique :
      - Algorithmique et programmation
      - Mathématiques pour l'informatique
      - Architecture des ordinateurs
      - Systèmes d'exploitation
      - Bases de données
      - Réseaux informatiques
      
      Cette formation commune permet d'acquérir les compétences nécessaires pour choisir sa spécialisation en L3.`,
      image: Code
    },
    'multimedia et developpement web (l3)': {
      text: `Spécialisation Multimédia et Développement Web (L3) :
      - Développement front-end (HTML5, CSS3, JavaScript)
      - Frameworks modernes (React, Angular, Vue.js)
      - Conception d'interfaces utilisateur (UI/UX)
      - Développement back-end (Node.js, PHP)
      - Gestion de contenu (CMS)
      - Animation et graphisme numérique
      
      Cette spécialisation forme aux métiers de développeur web full-stack et concepteur d'interfaces.`,
      image: Multi
    },
    'developpement d\'applications (l3)': {
      text: `Spécialisation Développement d'Applications (L3) :
      - Programmation orientée objet avancée
      - Développement mobile (Android, iOS)
      - Architecture logicielle
      - Bases de données avancées
      - Méthodes agiles
      - Sécurité des applications
      
      Cette formation prépare aux métiers de développeur d'applications mobiles et logiciels.`,
      image: Program
    },
    'système et reseaux informatiques (l3)': {
      text: `Spécialisation Systèmes et Réseaux Informatiques (L3) :
      - Administration systèmes (Windows Server, Linux)
      - Virtualisation et cloud computing
      - Sécurité des réseaux
      - Routage et commutation avancés
      - Supervision réseau
      - Cybersécurité
      
      Cette spécialisation forme aux métiers d'administrateur systèmes et réseaux.`,
      image: Cloud
    }
  };

  const [selectedOption, setSelectedOption] = useState(options[0].name.toLowerCase());

  return (
    <section className="bg-gray-100 py-5">
      <div className="container mx-auto p-4 max-w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Parcours Académiques</h2>
        
        {/* Sélecteur d'options */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.name.toLowerCase())}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedOption === option.name.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.name}
            </button>
          ))}
        </div>
        
        {/* Carte avec texte et image */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            {/* Partie image */}
            <div className="md:w-1/3">
              <img 
                src={parcoursData[selectedOption].image} 
                alt={options.find(opt => opt.name.toLowerCase() === selectedOption)?.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Partie texte */}
            <div className="p-6 md:w-2/3">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">
                {options.find(opt => opt.name.toLowerCase() === selectedOption)?.name}
              </h3>
              <div className="text-gray-600 whitespace-pre-line">
                {parcoursData[selectedOption].text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Parcours;