import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';
import '../LeCss/about.css';

export default function About() {
  // Données des membres de l'équipe
  const teamMembers = [
    {
      name: "Andy Lamothe",
      role: "Étudiant / Développeur Full Stack ",
      bio: "Passionné par le développement web et le cinéma indépendant. Créateur principal de Filmare.",
      image: "/andyImage.jpg", // chemin vers photo
      links: {
        github: "https://github.com/AndeezMTL",
        linkedin: "http://linkedin.com/in/andy-lamothe-07113b21b",
        email: "mailto:Andylamothe22@hotmail.com"
      }
    },
    {
      name: "Mikhaël François",
      role: "Développeur Full Stack",
      bio: "Développeur interessé par les artistes indépendants et leurs oeuvres.",
      image: "/imageMikhael.jpg", // chemin vers photo
      links: {
        github: "https://github.com/MikhaelFrn",
        linkedin: "https://linkedin.com/in/mikhaël-françois-1407bz1507xa",
        email: "mailto:mikhael.francois@collegemv.qc.ca"
      }
    }
    // ajouter d'autres membres ici
  ];

  return (
    <div className="about-container">
      {/* Section héro avec titre principal */}
      <section className="about-hero">
        <h1>À Propos de Filmare</h1>
        <p className="about-description">
          Filmare est une plateforme dédiée aux créateurs de films indépendants, 
          offrant un espace unique pour partager et découvrir des œuvres cinématographiques originales.
        </p>
      </section>

      {/* Section mission */}
      <section className="mission-section">
        <div className="mission-content">
          <h2>Notre Mission</h2>
          <p>
            Nous croyons en la puissance du cinéma indépendant pour raconter des histoires uniques 
            et authentiques. Notre mission est de créer une communauté vibrante où les créateurs 
            peuvent partager leur vision et connecter avec un public passionné.
          </p>
        </div>
      </section>

      {/* Section équipe */}
      <section className="team-section">
        <h2>Notre Équipe</h2>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <div className="member-image-container">
                <img src={member.image} alt={member.name} className="member-image" />
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                <div className="member-social">
                  <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <Github size={20} />
                  </a>
                  <a href={member.links.linkedin} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <Linkedin size={20} />
                  </a>
                  <a href={member.links.email} className="social-icon">
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section valeurs */}
      <section className="values-section">
        <h2>Nos Valeurs</h2>
        <div className="values-grid">
          <div className="value-item">
            <h3>Créativité</h3>
            <p>Nous encourageons l'expression artistique unique et innovante.</p>
          </div>
          <div className="value-item">
            <h3>Communauté</h3>
            <p>Nous construisons un espace collaboratif et bienveillant.</p>
          </div>
          <div className="value-item">
            <h3>Qualité</h3>
            <p>Nous promouvons l'excellence dans la création cinématographique.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
