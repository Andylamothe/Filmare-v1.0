import { useState, useEffect } from "react"
import { MessageCircle, ThumbsUp, Send, ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import axios from "axios";
import "../LeCss/watch.css"

function Watch({auth, setAuth}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // État pour stocker la note donnée au film
  
  // État pour stocker le commentaire en cours de rédaction
  const [comment, setComment] = useState("")
  
  // État pour gérer l'affichage/masquage des commentaires
  const [showComments, setShowComments] = useState(false)

  // pas implémenté
  useEffect(() => {
    // Vérification de l'authentification
    if (!auth) {
      navigate("/login");
      return;
    }

    const fetchVideoData = async () => {
      try {
        const response = await axios.get(`http://10.10.2.107:8181/videos/${id}/details`);
        setVideoData(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération de la vidéo:", error);
        if (error.response && error.response.status === 404) {
          setError("Vidéo non trouvée");
        } else {
          setError("Impossible de charger la vidéo");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [auth, navigate, id]);

  

  // Si l'utilisateur n'est pas authentifié, ne rien afficher
  if (!auth) {
    return null;
  }

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!videoData) {
    return <div className="error">Vidéo non trouvée</div>;
  }

  const { video, comments, creator } = videoData;

  // Fonction pour gérer la soumission d'un commentaire
  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (comment.trim()) {
      console.log("Commentaire soumis:", comment)
      setComment("")
    }
  }

  return (
    <div className="watch-container">
      {/* En-tête avec le bouton retour et le titre */}
      <div className="video-header">
        <Link to="/feed" className="back-button">
          <ArrowLeft />
          Retour
        </Link>
        <div className="header-content">
          <h1>{video.title}</h1>
          <div className="movie-meta">
            <span>Par {creator.username}</span>
            <span className="separator">•</span>
            <span>{video.category}</span>
            <span className="separator">•</span>
            <span>{video.views} vues</span>
          </div>
        </div>
      </div>

      {/* Lecteur vidéo */}
      <div className="video-section">
        <video controls className="video-player">
          <source src={`http://10.10.2.107:8181/videos/${id}/stream`} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos.
        </video>
      </div>

      {/* Informations du film */}
      <div className="content-section">
        <div className="movie-info">
          <p className="description">{video.description}</p>
        </div>

        {/* Section notation et commentaires */}
        <div className="interaction-section">
          <div className="rating-section">
            <p>Note : {video.rating}</p>
            <button 
              className="like-button"
              onClick={() => {
                axios.post(`http://10.10.2.107:8181/videos/${id}/like`, null, {
                  params: { username: localStorage.getItem("username") }
                });
              }}
            >
              <ThumbsUp />
              J'aime
            </button>
          </div>

          <button 
            className="comments-toggle"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle />
            Commentaires ({comments.length})
          </button>
        </div>

        {/* Section commentaires */}
        {showComments && (
          <div className="comments-section">
            <form onSubmit={handleCommentSubmit} className="comment-form">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Partagez votre avis sur cette vidéo..."
                className="comment-input"
              />
              <button type="submit" className="submit-button">
                <Send size={20} />
              </button>
            </form>

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="comment-content">
                    <div className="comment-header">
                      <h3>{comment.creator.username}</h3>
                      <span className="comment-time">Il y a 2 heures</span>
                    </div>
                    <p>{comment.commentsTexte}</p>
                    <div className="comment-actions">
                      <button>
                        <ThumbsUp size={16} />
                        <span>{comment.likes}</span>
                      </button>
                      <button>
                        <MessageCircle size={16} />
                        <span>Répondre</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Watch

