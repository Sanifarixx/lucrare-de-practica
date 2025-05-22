import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/UseAuthContext";

const Navbar = (props) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  
  const [theme, setTheme] = useState(() => {
   
    return localStorage.getItem("theme") || "light";
  });

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();
  };

  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="Logo PawFinds" />
          <p>{props.title}</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li><Link to="/">Acasă</Link></li>
          <li><Link to="/services">Servicii</Link></li>
          <li><Link to="/pets">Animale</Link></li>
          <li><Link to="/profile">Profil</Link></li>
          <li><Link to="/contact">Contactează-ne</Link></li>
        </ul>
      </div>
      <div className="logout-username">
        <p>Bun venit, {user.userName}!</p>
        <button onClick={toggleTheme} className="Navbar-button" style={{ marginRight: '10px' }}>
          {theme === "light" ? "Dark" : "Light"}
        </button>
        <button onClick={handleLogout} className="Navbar-button">Deconectare</button>
      </div>
    </div>
  );
};

export default Navbar;
