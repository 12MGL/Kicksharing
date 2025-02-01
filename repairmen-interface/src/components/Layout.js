import React from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <nav className="sidebar">
        <h2>Ремонт</h2>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/history">История ремонтов</Link></li>
          <li><Link to="/profile">Профиль</Link></li>
        </ul>
      </nav>
      <main className="content">{children}</main>
    </div>
  );
};

export default Layout;
