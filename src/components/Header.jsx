import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/Rail_logo.png';
import './Header.css';
import { useLocation } from 'react-router-dom';
import profileIcon from '../assets/user.png'; 


function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <img src={logo} alt="Railway Logo" className="railway-logo" />
      <div className="header-title">
        <h1>पूर्व तट रेलवे</h1>
        <h2>EAST COAST RAILWAY</h2>
      </div>
      {location.pathname === '/division' ? (
  <img 
    src={profileIcon}
    alt="User Icon"
    style={{
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      cursor: 'pointer',
      marginRight: '10px'
    }}
  />
) : (
  <Link to="/login" className="login-button">Login</Link>
)}

    </header>
  );
}

export default Header;