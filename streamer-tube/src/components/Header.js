import React from "react";
import "./Header.css";

const Header = () => (
  <header className="header">
    <div className="logo">MyYouTube</div>
    <input type="text" className="search" placeholder="Pesquisar" />
    <div className="icons">
      <i className="bell-icon" />
      <i className="user-icon" />
    </div>
  </header>
);

export default Header;