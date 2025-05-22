import React from "react";
import developerPng from "./images/dog.png";

const Contact = () => {
  return (
    <div className="contactUs-main-container">
      <div className="contactUs-left-para">
        <h3>Apasa</h3>
        <i class="fa fa-envelope"></i>
        <a class="mail-links" href="strelka@moldova.md">
          strelka@moldova.md
        </a>
        <i class="fa fa-instagram"></i>
        <a class="mail-links" href="https://www.instagram.com/strelka/">
          @Strelka
        </a>

        <i class="fa fa-phone"></i>
        <a class="mail-links" href="tel:+923019583959">
          +373 60882854
        </a>
      </div>
      <div className="contactUs-pic">
        <img src={developerPng} alt="Profile"/>
      </div>
    </div>
  );
};

export default Contact;
