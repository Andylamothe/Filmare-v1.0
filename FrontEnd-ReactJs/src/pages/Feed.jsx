
import axios from 'axios';
import React, { useState, useEffect } from "react"
import { Play, Info, X } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import "../LeCss/homepage.css"

const API_URL= "http://10.10.2.107:8181"

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

function Feed() {
  const searchVid = async (categoryId) => {
    try {
      const response = await axios.get(`${API_URL}/videos/categories/${categoryId}`);
      if (response.data) {
        setVideoListByCategory(prev => ({...prev, [categoryId]: response.data}));
        if (response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          setFeaturedVideo(response.data[randomIndex]);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Erreur lors de la recherche de vidéos:", error);
      setError("Impossible de charger les vidéos");
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [videoListByCategory, setVideoListByCategory] = useState({});
  const [featuredVideo, setFeaturedVideo] = useState(null);
  useEffect(() => {
    const categoriesMovie = [...categories.courtMetrage, ...categories.longMetrage];
    categoriesMovie.forEach(categorie => {
      searchVid(categorie.id);
    });
  }, []);

  // Données du film vedette
  const featuredMovie = featuredVideo ? {
    title: featuredVideo.title,
    description: featuredVideo.description,
    director: featuredVideo.creator ? featuredVideo.creator.username : "Anonyme",
    genre: featuredVideo.category,
    id: featuredVideo.id
  } : {
    title: "Titre du Film en Vedette",
    description: "Une description détaillée du film qui explique l'histoire, le contexte et ce qui rend ce film unique. Ce film explore des thèmes profonds et offre une perspective nouvelle sur le cinéma indépendant.",
    director: "Anonyme",
    genre: "Drame",
    id: null
  };

  return (
    <div className="feed-container">
      {/* Hero Section - Film en vedette */}
      <section 
        className="featured-section"
        style={{ 
          backgroundImage: `url('/film-poster.png')`
        }}
      >
        <div className="featured-content">
          <h1 className="featured-title">{featuredMovie.title}</h1>
          <p className="featured-description">
            {featuredMovie.description.substring(0, 150)}...
          </p>
          <div className="featured-buttons">
          <Link to={`/watch/${featuredMovie.id}`} className="play-button">
              <Play className="button-icon" />
              Lecture
            </Link>
            <button className="info-button" onClick={() => setShowModal(true)}>
              <Info className="button-icon" />
              Plus d'infos
            </button>
          </div>
        </div>
        <div className="featured-overlay" />
      </section>

      {/* Modal d'informations */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            <div className="modal-header">
              <h2>{featuredMovie.title}</h2>
            </div>
            <div className="modal-body">
              <div className="modal-info">
                <p><strong>Réalisateur:</strong> {featuredMovie.director}</p>
                <p><strong>Genre:</strong> {featuredMovie.genre}</p>
              </div>
              <div className="modal-description">
                <h3>Synopsis</h3>
                <p>{featuredMovie.description}</p>
              </div>
              <div className="modal-actions">
                <Link to={`/watch/${featuredMovie.id}`} className="modal-play-button">
                  <Play className="button-icon" />
                  Lecture
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section Courts Métrages */}
      <section className="films-type-section">
        <h2 className="section-title">Courts Métrages</h2>
        {categories.courtMetrage.map((category) => (
          <div key={category.id} className="category-row">
            <h3 className="category-title">{category.name}</h3>
            <div className="films-slider">
              {videoListByCategory[category.id]?.map((video, i) => (
                <div 
                  key={video.id} 
                  className="film-card"
                  onMouseEnter={() => setHoveredFilm(`${video.title}`)}
                  onMouseLeave={() => setHoveredFilm(null)}
                >
                  <Link to={`/watch/${video.id}`} className="film-link film-poster-container">
                      <img 
                        src="/film-poster.png" 
                        alt={`${category.name} ${i + 1}`} 
                        className="film-poster" 
                      />
                      <div className="film-hover-info">
                        <Play className="hover-play-icon" />
                        <div className="film-details">
                          <h4 className="film-title">{video.title}</h4>
                          <p className="film-genre">{category.name}</p>
                        </div>
                      </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Section Longs Métrages */}
      <section className="films-type-section">
        <h2 className="section-title">Longs Métrages</h2>
        {categories.longMetrage.map((category) => (
          <div key={category.id} className="category-row">
            <h3 className="category-title">{category.name}</h3>
            <div className="films-slider">
              {videoListByCategory[category.id]?.map((video, i) => (
                <div 
                  key={video.id} 
                  className="film-card"
                  onMouseEnter={() => setHoveredFilm(`${video.title}`)}
                  onMouseLeave={() => setHoveredFilm(null)}
                >
                  <Link to={`/watch/${video.id}`} className="film-link film-poster-container">
                      <img 
                        src="/film-poster.png" 
                        alt={`${category.name} ${i + 1}`} 
                        className="film-poster" 
                      />
                        <div className="film-hover-info">
                          <Play className="hover-play-icon" />
                          <div className="film-details">
                            <h4 className="film-title">{video.title}</h4>
                            <p className="film-genre">{category.name}</p>
                          </div>
                        </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default Feed

