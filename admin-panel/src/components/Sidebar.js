import React from "react";
import { Link } from "react-router-dom";
import "../styles/Sidebar.css";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Админ Панель</h2>
      <nav>
        <ul>
          <li><Link to="/">Главная</Link></li>
          <li><Link to="/stats">Статистика</Link></li>
          <li><Link to="/scooters">Список самокатов</Link></li>
          <li><Link to="/parts">Склад запчастей</Link></li>
          <li><Link to="/repairmen">Ремонтники</Link></li>
          <li><Link to="/logs">Логи</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
