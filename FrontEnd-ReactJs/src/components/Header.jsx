import React from "react";
import { Link, useNavigate } from "react-router-dom";
// Importation des icônes nécessaires
import { User, Upload, LogOut } from "lucide-react";
// Importation du logo
import logoFilm from "/logo.png";
//import logoPicture from "../../public/pfp.svg";
// Importation des styles CSS
import "../../src/LeCss/header.css";


import { MessageSquare } from "lucide-react";


const Header = ({ auth, setAuth, searchQuery, setSearchQuery }) => {
  const navigate = useNavigate();
  // État pour gérer l'ouverture/fermeture du menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Variable booléenne qui indique si le menu est ouvert
  const open = Boolean(anchorEl);
  
  
  // Fonction qui gère l'ouverture du menu
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Fonction qui gère la fermeture du menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAuth(false);
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("id");
    navigate("/");
  };

  return (
    <header className="header">
      {/* Section gauche du header avec le logo et le titre */}
      <div className="header-left">
        <Link to="/">
          <img src={logoFilm} alt="Logo" className="logoAndy" />
        </Link>
        <h1 className="andyh1"><span className="andyspan">f</span>ilmare</h1>
      </div>

      {/* Section droite du header avec la barre de recherche et le menu */}
      <div className="header-right">
        {auth ? (
          <>
            <Link to="/chat">
              <button className="icon-button">
                <MessageSquare size={24} />
              </button>
            </Link>
            
            <input
              type="search"
              placeholder="Recherchez vos films"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            /> {/*pas implémenté*/}

            <Link to="/upload">
              <button className="icon-button">
                <Upload size={24} />
              </button>
            </Link>

            <div className="user-menu">
              <button
                className="icon-button"
                onClick={handleClick}
              >
                
                <User size={24} />
              </button>
              {open && (
                <div className="menu-dropdown">
                  <Link to={`/profile/${localStorage.getItem("id")}`} className="menu-item" onClick={handleClose}>
                    <User size={20} />
                    <span>Mon Profil</span>
                  </Link>
                  <button onClick={handleLogout} className="menu-item">
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                  </button>
                  <svg onClick={handleClose} className="close-svg" xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 -960 960 960" width="24px" fill="#FF7777"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg> 
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-button login">
              Connexion
            </Link>
            <Link to="/register" className="auth-button register">
              Inscription
            </Link>
          </div>
        )}
      </div>

    </header>
  );
};

export default Header;
