import React from 'react';
import { FaHome, FaSearch } from 'react-icons/fa'; // Importa os ícones que você precisa
import './Sidebar.css'; // Importa o CSS

const Sidebar = () => {
  return (
    <div className="container">
      <img src="./Perfil.png" alt="Perfil" />
      <p>@demon.rs3</p>

      <div className="follow-info">
        <p>434.4k<br />Seguidores</p>
        <p>1089<br />Seguindo</p>
      </div>

      <ul>
        <li><FaHome /> Home</li>
        <li><FaSearch /> Explorar</li>
      </ul>
    </div>
  );
}

export default Sidebar;