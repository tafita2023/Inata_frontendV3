import React, { useState } from 'react';

function Footer() {
    return (
        <footer className="px-4 sm:px-6 lg:px-8 w-full max-w-9xl mx-auto mb-2">
            <div className="container-fluid">
                <div className="row text-muted">
                    <div className="col-6 text-start">
                        <p className="mb-0">
                            <a href="/dashboard" className="text-muted">
                                <strong>&copy; Copyright InATA {new Date().getFullYear()}. Tout droit réservés</strong>
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;