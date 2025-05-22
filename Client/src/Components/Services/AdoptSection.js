import React from "react";
import adoptPet from "./images/adoptPet.png";
import { Link } from "react-router-dom";

const AdoptSection = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="adopt-section">
      <h2>Adoptă un animal</h2>
      <img src={adoptPet} alt="Animal fericit" />

      <p>
        Bine ai venit la programul nostru de adopție a animalelor! A adopta un
        animal este o modalitate minunată de a aduce bucurie și companie în viața ta.
      </p>

      <h3>Beneficiile adopției unui animal</h3>
      <ul>
        <li>Oferă un cămin plin de iubire unui animal care are nevoie</li>
        <li>Experimentează dragostea necondiționată a unui animal</li>
        <li>Creează amintiri de neuitat și momente prețioase</li>
      </ul>

      <h3>Procesul de adopție</h3>
      <ol>
        <li>Completează o cerere de adopție</li>
        <li>Întâlnește personal animalele potențiale</li>
        <li>Finalizează documentele necesare</li>
      </ol>

      <h3>Responsabilități</h3>
      <p>
        Adopția unui animal implică responsabilități, cum ar fi hrănirea, îngrijirea,
        exercițiul regulat și asigurarea îngrijirii medicale.
      </p>

      <Link to="/pets">
        <button className="cta-button" onClick={scrollToTop}>Găsește animalul perfect pentru tine</button>
      </Link>
    </section>
  );
};

export default AdoptSection;
