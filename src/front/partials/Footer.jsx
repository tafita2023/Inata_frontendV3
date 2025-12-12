import React from 'react';
import Logo from '../../images/InATA2.png';
import Oracle from '../../images/oracle.png';
import Vmware from '../../images/vmware.png';
import Cisco from '../../images/cisco.png';
import Pearson from '../../images/pearson.png';

const Footer = () => {
  return (
<footer className="bg-gray-800 text-white py-5">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2 text-center">Institut des Arts et des Technologies Avancées</h3>
        <img src={Logo} alt="InATA" className="max-w-38 max-h-38 object-contain" />
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-semibold mb-4">Contact</h4>
        <address className="text-gray-400 not-italic text-center">
          <p>Face Fokontany Ankadivato II L</p>
          <p className="mt-2">Tél: +261 32 07 620 00</p>
          <p>Email: contact@inata.org</p>
        </address>
      </div>
      <div className="flex flex-col items-center">
        <h4 className="text-lg font-semibold mb-4">Contacts</h4>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fill-rule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clip-rule="evenodd"/>
              <path d="M7.2 8.809H4V19.5h3.2V8.809Z" />
            </svg>

          </a>
          <a href="#" className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>

          <a href="#" className="text-gray-400 hover:text-white">
          <svg class="w-6 h-6" aria-hidden="true" width="24" height="24" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m3.5 5.5 7.893 6.036a1 1 0 0 0 1.214 0L20.5 5.5M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"/>
          </svg>
          </a>

        </div>
      </div>

      <div className="flex flex-col items-center">
        <h3 className="text-xl font-bold mb-2 text-center">Partenaires</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-center">
            <img src={Oracle} alt="Oracle" className="max-w-24 max-h-24 object-contain" />
          </div>
          <div className="flex items-center justify-center">
            <img src={Vmware} alt="Vmware" className="max-w-24 max-h-21 object-contain" />
          </div>
          <div className="flex items-center justify-center">
            <img src={Cisco} alt="Cisco" className="max-w-24 max-h-24 object-contain" />
          </div>
          <div className="flex items-center justify-center">
            <img src={Pearson} alt="Pearson" className="max-w-24 max-h-30 object-contain" />
          </div>
        </div>
      </div>

    </div>
    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
      <p>&copy; Copyright {new Date().getFullYear()} InATA. Tous droits réservés.</p>
    </div>
  </div>
</footer>
  );
};

export default Footer;