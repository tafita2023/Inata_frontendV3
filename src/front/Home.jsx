import React from 'react';
import Header from './partials/Header';
import Footer from './partials/Footer';
import HeroSection from './partials/HeroSection';
import FeatureSection from './partials/FeaturesSection';

function Home() {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-gray-600 min-h-screen">
            <Header />
            <HeroSection />
            <FeatureSection />
            <Footer />
        </div>
    );
}

export default Home;