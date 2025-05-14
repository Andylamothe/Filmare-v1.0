import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import '../LeCss/notfound.css';

function NotFound() {
    // Pas d'états dans ce composant car il est statique
    // Il affiche simplement une page d'erreur 404 avec des boutons de navigation
    
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <div className="error-code">404</div>
                <h1>Page non trouvée</h1>
                <p>Désolé, la page que vous recherchez n'existe pas.</p>
                
                <div className="action-buttons">
                    <Link to="/" className="home-button">
                        <Home size={20} />
                        Retour à l'accueil
                    </Link>
                    <button 
                        onClick={() => window.history.back()} 
                        className="back-button"
                    >
                        <ArrowLeft size={20} />
                        Page précédente
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NotFound;