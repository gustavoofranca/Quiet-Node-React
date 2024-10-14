import React from 'react';
import { FaHome, FaSearch } from 'react-icons/fa'; // Importa os ícones que você precisa
import './menu_comp.css'; // Importa o CSS
import Perfil from '../../images/PerfilADM.png';

const MenuLateral = () => {
  return (
      <div className="container">
          <img src= {Perfil} alt="Perfil" className="img-perfil" />
          <p className="username">@demon.rs3</p>

          <div className="follow-info">
              <p>434.4k<br />Seguidores</p>
              <p>1089<br />Seguino</p>
          </div>

          <div className="lista">
              <ul>
              <li><FaHome /> Home</li>
              <li><FaSearch /> Explorar</li>
              </ul>
          </div>
      </div>
  );
};

export default MenuLateral;