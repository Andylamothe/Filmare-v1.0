;import * as React from 'react';
import '../LeCss/home.css'
import '../LeCss/homepage.css'

import { Link } from 'react-router-dom';
import { Play, Upload, Users, Award } from "lucide-react"


const features = [
  {
    icon: Upload,
    title: "Téléversement Facile",
    description: "Partagez vos films avec notre communauté en quelques clics.",
  },
  {
    icon: Users,
    title: "Collaborez",
    description: "Connectez-vous avec d'autres créateurs, trouvez des talents et réalisez votre vision.",
  },
  {
    icon: Award,
    title: "Soyez Reconnu",
    description: "Profiter d'une plateforme spécialisé pour les créateurs et gagnez en visibilité.",
  },
]

function Homepage() {

  return (
    <div className="page-container">


      {/* Hero Section */}
      <div className='container1'>
      <section className="hero-section">
       
        <div className="hero-content">
          <h1 className="hero-title">Partagez Votre Vision</h1>
          <p className="hero-description">
            Rejoignez une communauté de cinéastes indépendants passionnés. Créez, collaborez et partagez vos histoires
            uniques avec le monde.
          </p>
          <div className="button-group">
            <Link to="/Upload">
            <button className="primary-button">
              <Upload className="mr-2 h-4 w-4" /> Téléverser Votre Film
            </button>
            </Link>
            
            <Link to="/feed">
            <button className="secondary-button">
              <Play className="mr-2 h-4 w-4" /> Explorer les Films
            </button>
            </Link>
          </div>
        </div>
      </section>
      </div>


      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">Donnez Vie à Votre Passion Cinématographique</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-item">
              <feature.icon className="feature-icon" />
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Homepage

