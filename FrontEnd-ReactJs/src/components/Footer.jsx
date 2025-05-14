import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import "../../src/LeCss/footer.css"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-sections">
          <div className="footer-section">
            <h3>À propos de Filmare</h3>
            <p>Plateforme de partage de films indépendants, créée par des passionnés pour des passionnés.</p>
          </div>
          
          <div className="footer-section">
            <h3>Navigation</h3>
            <nav className="footer-nav">
              <Link to="/" className="footer-link">Accueil</Link>
              <Link to="/feed" className="footer-link">Explorer</Link>
              <Link to="/upload" className="footer-link">Téléverser</Link>
              <Link to="/about" className="footer-link">À propos</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>Légal</h3>
            <nav className="footer-nav">
              <Link to="/privacy" className="footer-link">Confidentialité</Link>
              <Link to="/terms" className="footer-link">Conditions</Link>
              <Link to="/contact" className="footer-link">Contact</Link>
            </nav>
          </div>

          <div className="footer-section">
            <h3>Suivez-nous</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link">
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Andy Lamothe. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

