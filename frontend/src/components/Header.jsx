import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AuthContext'


const Header = () => {

  const { isLoggedIn, logout, cart, setCart } = useAppContext();

  const handleLogout = () => {

    alert("You are logging out.")
    logout();
    setCart([])
    alert("Logged out successfully")

  };

  return (
    <header className="main-header">
      <div className="container header-container">
        {/* Logo */}
        <div className="logo">
          <h1><Link to="/">WildTaste</Link></h1>
        </div>

        {/* Navigation */}
        <nav className="main-nav">
          <ul className="nav-list">
            <li className="nav-item"><Link to="/" className="active">Home</Link></li>
            <li className="nav-item"><Link to="/products">Products</Link></li>
            <li className="nav-item"><Link to="/create">Create</Link></li>
            <li className="nav-item"><a href="#" onClick={(e) => e.preventDefault()}>About</a></li>
            <li className="nav-item"><a href="#" onClick={(e) => e.preventDefault()}>Contact</a></li>
          </ul>
        </nav>

        {/* Icons & Search */}
        <div className="header-icons">

          <Link to="/cart" className="icon-link" title="cart">
            <i className="fas fa-shopping-cart"></i>
            <span className="icon-badge cart-count">{ cart.length }</span>
          </Link>

          {isLoggedIn && (
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="icon-link" title="logout">
              <i className="fas fa-right-from-bracket"></i>
            </a>
          )}

          {!isLoggedIn && (
            <Link to="/login" className="icon-link" title="sign in">
              <i className="fas fa-sign-in"></i>
            </Link>
          )}

          <button className="mobile-menu-toggle" onClick={() => console.log('Toggle mobile menu')}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;