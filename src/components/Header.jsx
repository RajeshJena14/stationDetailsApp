import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Rail_logo.png';
import './Header.css';


function Header() {
  return (
    <header className="header">
      <img src={logo} alt="Railway Logo" className="railway-logo" />
      <div className="header-title">
        <h1>पूर्व तट रेलवे</h1>
        <h2>EAST COAST RAILWAY</h2>
      </div>
      <Link to="/login" className="login-button">Login</Link>
    </header>
  );
}

export default Header;