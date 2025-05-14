import * as React from 'react';
import { useState, } from 'react';
import axios from 'axios';
import { Upload as UploadIcon, X, Film, Send } from 'lucide-react';
import { useNavigate } from "react-router-dom"
import '../LeCss/upload.css';

// Définition des catégories par type de film
const categories = {
  courtMetrage: [
    { name: "Drames", id: "court-drama" },
    { name: "Comédies", id: "court-comedy" },
    { name: "Documentaires", id: "court-documentary" },
    { name: "Animation", id: "court-animation" },
    { name: "Expérimental", id: "court-experimental" },
    { name: "Thrillers", id: "court-thriller" },
    { name: "Science-Fiction", id: "court-scifi" }
  ],
  longMetrage: [
    { name: "Drames", id: "long-drama" },
    { name: "Comédies", id: "long-comedy" },
    { name: "Documentaires", id: "long-documentary" },
    { name: "Thrillers", id: "long-thriller" },
    { name: "Science-Fiction", id: "long-scifi" },
    { name: "Animation", id: "long-animation" },
    { name: "Expérimental", id: "long-experimental" }
  ]
};

export default function Upload() {
  const navigate = useNavigate();



  // État pour stocker le fichier vidéo sélectionné
  const [file, setFile] = useState(null);
  
  // États pour stocker les métadonnées de la vidéo
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('');
  const [category, setCategory] = useState('');
  
  // État pour stocker la miniature de la vidéo
  const [thumbnail, setThumbnail] = useState(null);
  
  // État pour gérer l'animation de glisser-déposer
  const [dragActive, setDragActive] = useState(false);

  // État pour gérer la progression de l'upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');

  // Fonction pour gérer les événements de glisser-déposer
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Fonction pour gérer le dépôt d'un fichier
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const uploadedFile = e.dataTransfer.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('video/')) {
      setFile(uploadedFile);
      setError('');
    } else {
      setError('Format de fichier non supporté. Veuillez sélectionner une vidéo.');
    }
  };

  const handleFileInput = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('video/')) {
      setFile(uploadedFile);
      setError('');
    } else if (uploadedFile) {
      setError('Format de fichier non supporté. Veuillez sélectionner une vidéo.');
    }
  };

  const handleThumbnailInput = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith('image/')) {
      setThumbnail(uploadedFile);
      setError('');
    } else if (uploadedFile) {
      setError('Format de miniature non supporté. Veuillez sélectionner une image.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!file) {
      setError("Veuillez sélectionner une vidéo");
      return;
    }

    if (!title.trim()) {
      setError("Veuillez entrer un titre");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("username", sessionStorage.getItem("username"));

    try {
      setUploadStatus('uploading');
      
      // Afficher l'URL complète dans la console pour débogage
      console.log("URL de l'upload:", "http://10.10.2.107:8181/videosUpload/upload");
      console.log("FormData:", {
        file: file.name,
        title,
        description,
        category,
        username: sessionStorage.getItem("username")
      });

      const response = await axios.post(
        "http://10.10.2.107:8181/videosUpload/upload", 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        setUploadStatus('success');
        alert('Vidéo uploadée avec succès!');
        // Rediriger vers la page feed après un upload réussi
        navigate('/feed');
      }
    } catch (error) {
      setUploadStatus('error');
      console.error('Erreur lors de l\'upload:', error);
      
      // Afficher un message d'erreur plus détaillé
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un statut d'erreur
        console.error('Réponse du serveur:', error.response.data);
        setError(`Erreur du serveur: ${error.response.status} - ${error.response.data.error || 'Erreur inconnue'}`);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        setError("Erreur: Le serveur n'a pas répondu. Vérifiez qu'il est en cours d'exécution.");
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        setError(`Erreur: ${error.message}`);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="upload-container">
      <div className="upload-content">
        <h1>Mettre en ligne une vidéo</h1>
        
        {error && (
          <div className="error-message" style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffecec', borderRadius: '5px' }}>
            {error}
          </div>
        )}
        
        {!file ? (
          <div 
            className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-icon">
              <UploadIcon size={48} />
            </div>
            <p className="upload-text">Glissez et déposez vos fichiers vidéo pour les mettre en ligne</p>
            <p className="upload-subtext">Vos vidéos resteront privées jusqu'à leur publication</p>
            <label className="select-file-button">
              SÉLECTIONNER UN FICHIER
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileInput}
                hidden
              />
            </label>
          </div>
        ) : (
          <form encType="multipart/form-data" onSubmit={handleSubmit} className="upload-form">
            <div className="form-grid">
              {/* Section détails */}
              <div className="details-section">
                <h2>Détails</h2>
                <div className="form-group">
                  <label htmlFor="title">Titre (obligatoire)</label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ajoutez un titre qui décrit votre vidéo"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Présentez votre vidéo à vos spectateurs"
                    rows="4"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="format">Format</label>
                    <select
                      id="format"
                      value={format}
                      onChange={(e) => {setFormat(e.target.value); setCategory("");}}
                    >
                      <option value="">Sélectionner</option>
                      <option value="courtMetrage">Court Métrage</option>
                      <option value="longMetrage">Long Métrage</option>
                    </select>
                  </div>
                  {format && (
                  <div className="form-group">
                    <label htmlFor="subcategory">Catégorie</label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Sélectionner</option>
                      {categories[format]?.map((categorieVid) => (
                        <option key={categorieVid.id} value={categorieVid.id}>{categorieVid.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                </div>
              </div>

              {/* Section miniature */}
              <div className="thumbnail-section">
                <h2>Miniature</h2>
                <p className="thumbnail-info">
                  Sélectionnez ou importez une image qui représente bien votre vidéo
                </p>
                <div className="thumbnail-upload">
                  <label className="thumbnail-input">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailInput}
                      hidden
                    />
                    <div className="thumbnail-placeholder">
                      {thumbnail ? (
                        <img 
                          src={URL.createObjectURL(thumbnail)} 
                          alt="Miniature"
                          className="thumbnail-preview"
                        />
                      ) : (
                        <Film size={32} />
                      )}
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Section fichier */}
            <div className="file-section">
              <div className="file-info">
                <Film size={24} />
                <span className="file-name">{file.name}</span>
                <button type="button" className="remove-file" onClick={removeFile}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Afficher la progression de l'upload */}
            {uploadStatus === 'uploading' && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p>Upload en cours: {uploadProgress}%</p>
              </div>
            )}

            {/* Boutons d'action */}
            <div className="form-actions">
              <button type="submit" className="submit-buttonAndy">
                <Send size={18} />
                Mettre en ligne
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
