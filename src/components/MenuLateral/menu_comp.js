import React from 'react';
import { FaHome, FaSearch, FaUserCog } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { TbMessageCircleUser } from "react-icons/tb";
import './menu_comp.css';
import Perfil from '../../images/PerfilADM.png';
import { useNavigate } from 'react-router-dom';
const MenuLateral = () => {
  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem('userInfo');

    navigate('/');
  };

  return (
    <div className="container">
      <img src={Perfil} alt="Perfil" className="img-perfil" />
      <p className="username">@demon.rs3</p>

      <div className="follow-info">
        <p>434.4k<br />Seguidores</p>
        <p>1089<br />Seguindo</p>
      </div>

      <div className="lista">
        <ul>
          <li><FaHome className='icons' /> Home</li>
          <li><FaSearch className='icons' /> Explorar</li>
          <li><FaUserCog className='icons' /> Configurações</li>
          <li><TbMessageCircleUser className='mensagem' /> Mensagens</li>
          <li onClick={handleLogout}><CiLogout className='logout' /> Sair</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuLateral;
