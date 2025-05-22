import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

const Footer = (props) => {
  return (
    <footer className="footer">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="PawFinds Logo" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div className="below-footer">
        <p>
          <a className="mail-links" href="patrasculaur06@gmail.com">
            patrasculaur06@gmail.com
          </a>
        </p>
          <p>
          <a
            className="contact-links"
            href="https://github.com/Sanifarixx"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-github"></i> GitHub
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
        </p>
        <p>&copy; Patrascu Laurentiu</p>
      </div>
    </footer>
  );
};

export default Footer;
