import React from "react";
import girlHoldingADog from "./images/mendog.png";
import homepageDog from "./images/homepageDog.png";
import footPrint from "./images/footPrint.png";
import { Link } from "react-router-dom";

const HomeLandingContainer = (props) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="home-container">
      <div className="homeContainer-left">
        <div>
          <p className="home-title">
            <div className="home-titlePlusPng">
              <p>Animalele tale </p>
              <img src={homepageDog} alt="Câine stând jos" />
            </div>
            Sunt
            <br />
            Prioritatea Noastră
          </p>
          <p className="home-second-para">
            {props.description}
          </p>
        </div>
        <div className="adopt-btn">
          <Link to="./pets">
            <button className="Home-button" onClick={scrollToTop}>
              <p>Adoptă un animal</p>
              <img src={footPrint} alt="urma de labă" />
            </button>
          </Link>
        </div>
      </div>
      <div className="homeContainer-right">
        <img src={girlHoldingADog} alt="Fată ținând un câine în brațe" />
      </div>
    </div>
  );
};

export default HomeLandingContainer;
