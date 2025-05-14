import React, { useState, useEffect } from "react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import '../LeCss/profile.css'

export default function Profile({auth, setAuth}) {
  const navigate = useNavigate();
  const id = sessionStorage.getItem("userId");
  const [utilisateur, setUtilisateur] = useState({
    lastName: "",
    name: "",
    bio: "",
    profilepicture: ""
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });




  // Fonction pour gérer le changement d'image de profil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Création d'un URL temporaire pour prévisualiser l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setUtilisateur({ ...utilisateur, profilepicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onInputChange = (e) => {
    setMessage({ type: '', text: '' }); // Efface le message
    setUtilisateur({
      ...utilisateur,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    if (sessionStorage.getItem("userId") != null){loadUser();}
    else{
      console.error("ID Manquant")
    }  
  }, []);

  useEffect(() => {
  if (!auth) {
    console.log("veuillez vous connecter");
    navigate("/login");
    }
  }, [auth, navigate]
);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://10.10.2.107:8181/userAccess/getUtilisateurById/${id}`);
      console.log(id)
      console.log(result)
      setAuth(true);
      setUtilisateur(result.data);
    } catch (error) {
      console.error("Err: ", error);
    }
  };

  const onSubmit = async (e) => {
    try {
      e.preventDefault();
      await axios.put(`http://10.10.2.107:8181/userAccess/customer/${id}`, utilisateur);
      setEditing(false); // Sortie du mode édition après soumission
      navigate(`/profile/${id}`);
    } catch (error) {
      console.error("Err: ", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Mon Profil</h2>
          <p>Gérez vos informations personnelles</p>
        </div>

        <div className="profile-content">
          <div className="profile-photo-section">
            {utilisateur.profilepicture ? (
              <img 
                src={utilisateur.profilepicture} 
                alt="Photo de profil" 
                className="profile-image"
              />
            ) : (
              <div className="no-profile-image">
                <p>Aucune photo de profil</p>
              </div>
            )}
            {editing && (
              <div className="form-group1">
                <label>Photo de profil</label>
                <input 
                  type="file" 
                  onChange={handleImageChange}
                  className="file-input" 
                />
              </div>
            )}
          </div>

          {editing ? (
            <form onSubmit={onSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Prénom</label>
                <div className="input-with-icon">
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={utilisateur.name}
                    onChange={onInputChange}
                    placeholder="Votre prénom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom</label>
                <div className="input-with-icon">
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={utilisateur.lastName}
                    onChange={onInputChange}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Biographie</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={utilisateur.bio}
                  onChange={onInputChange}
                  rows="4"
                  placeholder="Parlez-nous de vous..."
                  className="bio-textarea"
                />
              </div>

              <button id="submit" type="submit" className="submit-button">
                Enregistrer
              </button>
            </form>
          ) : (
            <div className="profile-details auth-form">
              <div className="form-group">
                <label>Prénom</label>
                <p id="name" className="info-text">{utilisateur.name}</p>
              </div>
              <div className="form-group">
                <label>Nom</label>
                <p className="info-text">{utilisateur.lastName}</p>
              </div>
              <div className="form-group">
                <label>Biographie</label>
                <p className="info-text">{utilisateur.bio || "Aucune biographie"}</p>
              </div>
              <button id="modifier" onClick={() => setEditing(true)} className="submit-button">
                Modifier
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
