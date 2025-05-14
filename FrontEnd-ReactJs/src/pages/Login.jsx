import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"
import { Mail, Lock, GithubIcon, Chrome } from "lucide-react"
import "../LeCss/auth.css"

const Login = ({auth, setAuth}) => {
  
  const API_URL= "http://10.10.2.107:8181"

  const [user, setUser] = useState({id : "", username : "", password  : ""});

  const [denied, setDenied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  // État pour gérer l'option "Se souvenir de moi"
  const [rememberMe, setRememberMe] = useState(false)

  const handleChange = (e) => {
    setUser({...user, [e.target.name] : e.target.value});
  }
 
  // Fonction appelée lors de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =  await axios.post(`${API_URL}/userAccess/signin?username=${user.username}&password=${user.password}`);
      if (response.data) {
        setAuth(true);
        sessionStorage.setItem("username", user.username);
        sessionStorage.setItem("id", response.data.id);
        navigate(`/profile/${localStorage.getItem("userId")}`);
      } else {
        setDenied(true);
        setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
      }
        navigate(`/profile/${sessionStorage.getItem("userId")}`);
      } catch(error) {
      console.error("Erreur lors de la connection:", error);
      setDenied(true);
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");

    };
  }

  // Fonction pour gérer la connexion via Google
  const handleGoogleLogin = () => {
    console.log("Connexion avec Google")
  } //pas implémenté

  // Fonction pour gérer la connexion via GitHub
  const handleGithubLogin = () => {
    console.log("Connexion avec GitHub")
  } //pas implémenté

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Connexion</h2>
          <p>Bienvenue sur Filmare</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {denied && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">username</label>
            <div className="input-with-icon">
              <Mail size={20} className="input-icon" />
              <input
                name="username"
                onChange={handleChange}
                placeholder="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="password-label">
              <label htmlFor="password">Mot de passe</label>
              <Link to="/forgot-password" className="forgot-password">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="input-with-icon">
              <Lock size={20} className="input-icon" />
              <input
                name="password"
                type="password"
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="remember-me">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="checkmark"></span>
              Se souvenir de moi
            </label>
          </div>

          <button id="submit" type="submit" className="submit-button">
            Se connecter
          </button>
        </form>

        <div className="separator">
          <span>ou continuer avec</span>
        </div>

        <div className="social-auth">
          <button onClick={handleGoogleLogin} className="social-button google">
            <Chrome size={20} />
            <span>Google</span>
          </button>
          <button onClick={handleGithubLogin} className="social-button github">
            <GithubIcon size={20} />
            <span>GitHub</span>
          </button>
        </div>

        <p className="auth-footer">
          Pas encore de compte ?{" "}
          <Link to="/register" className="auth-link">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login

