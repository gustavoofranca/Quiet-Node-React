import React, { useState } from 'react';
import { FaHome, FaSearch, FaUserCog } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { TbMessageCircleUser } from "react-icons/tb";
import './menu_comp.css';
import Perfil from '../../images/PerfilADM.png';

// Bibliotecas para criação e verificação de Usuário
import { auth } from '../../firebaseConnection';
import { signOut } from "firebase/auth";


const MenuLateral = () => {
  const [user, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  async function doLogout() {
    try {
        await signOut(auth); // Faz o logout no Firebase Auth
        setUser(false);
        setUserInfo({});
        sessionStorage.removeItem('userData'); // Remove os dados do usuário do sessionStorage
        alert('Você saiu da conta com sucesso!');
    } catch (error) {
        console.error("Erro ao fazer logout:", error);
        alert('Ocorreu um erro ao sair da conta. Tente novamente.');
    }
}

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
          <li onClick={doLogout}><CiLogout className='logout' /> Sair</li>
        </ul>
      </div>
    </div>
  );
};

export default MenuLateral;
