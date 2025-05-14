import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Chrome, GithubIcon } from "lucide-react";
import axios from "axios"; 
import "../LeCss/auth.css";

const API_URL= "http://10.10.2.107:8181"

const Register = ({auth, setAuth}) => {
  const [utilisateur, setUtilisateur] = useState({
    username: "",
    lastName: "",
    name: "",
    bio: "",
    email: "",
    password: "",
  });

  console.log(API_URL)
  const setAttribut = (e) => {
    const value = e.target.value;
    setUtilisateur({ ...utilisateur, [e.target.name]: value });
  };

  const navigate = useNavigate();

  const submitNewClient = (e) => {
    e.preventDefault();
    axios
      .post(`${API_URL}/userAccess/createAccount`, utilisateur)
      .then(response => {
        setAuth(true);
        sessionStorage.setItem("userId", response.data.id);
        sessionStorage.setItem("username", response.data.username)
        navigate(`/profile/${response.data.id}`);
      })
      .catch((error) => {
        console.error("Erreur lors de la création du compte:", error);
      });
  };

  // Fonction pour gérer l'inscription via Google
  const handleGoogleRegister = () => {
    console.log("Inscription avec Google"); /*pas implémenté*/
  };

  // Fonction pour gérer l'inscription via GitHub
  const handleGithubRegister = () => {
    console.log("Inscription avec GitHub"); /*pas implémenté*/
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Inscription</h2>
          <p>Rejoignez Filmare dès aujourd'hui</p>
        </div>

        <form onSubmit={submitNewClient} className="auth-form" method="post">
          <div className="form-group1">
            <label htmlFor="username">Nom d'utilisateur</label>
            <div className="input-with-icon">
              <User size={20} className="input-icon" />
              <input
                id="username"
                type="text"
                name="username"
                value={utilisateur.username}
                onChange={setAttribut}
                placeholder="Votre nom d'utilisateur"
                required
              />
            </div>
          </div>

          <div className="form-group1">
            <label htmlFor="email">Adresse email</label>
            <div className="input-with-icon">
              <Mail size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                name="email"
                value={utilisateur.email}
                onChange={setAttribut}
                placeholder="exemple@email.com"
                required
              />
            </div>
          </div>

          <div className="form-group1">
            <label htmlFor="password">Mot de passe</label>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type="password"
                name="password"
                value={utilisateur.password}
                onChange={setAttribut}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="terms-checkbox">
            <label className="checkbox-container">
              <input id="conditions" type="checkbox" required />
              <span className="checkmark"></span>
              J'accepte les{" "}
              <Link to="/terms" className="auth-link">
              conditions d'utilisation
              </Link>
            </label>
          </div>

          <button id="submit" type="submit" className="submit-button">
            S'inscrire
          </button>
        </form>

        <div className="separator">
          <span>ou continuer avec</span>
        </div>

        <div className="social-auth">
          <button onClick={handleGoogleRegister} className="social-button google">
            <Chrome size={20} />
            <span>Google</span> {/*pas implémenté*/}
          </button>
          <button onClick={handleGithubRegister} className="social-button github">
            <GithubIcon size={20} />
            <span>GitHub</span> {/*pas implémenté*/}
          </button>
        </div>

        <p className="auth-footer">
          Déjà un compte ?{" "}
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;