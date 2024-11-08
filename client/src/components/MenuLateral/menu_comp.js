import React, { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaUserCog, FaPlusCircle } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { TbMessageCircleUser } from "react-icons/tb";
import './menu_comp.css';
import Perfil from '../../images/PerfilADM.png';

import { useNavigate } from 'react-router-dom';

// Bibliotecas para criação e verificação de Usuário
import { auth } from '../../firebaseConnection';
import { signOut } from "firebase/auth";

const MenuLateral = ({ setModalOpen }) => { // Recebe 'setModalOpen' do componente pai
  const [, setUser] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  // Inicializa o navigate
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUser(true);
      setUserInfo(JSON.parse(storedUserData));
    }
  }, []);

  async function doLogout() {
    try {
      await signOut(auth); // Faz o logout no Firebase Auth
      setUser(false);
      setUserInfo({});
      sessionStorage.removeItem('userData'); // Remove os dados do usuário do sessionStorage
      alert('Você saiu da conta com sucesso!');
      navigate('/'); // Navega para a página de login após o logout
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert('Ocorreu um erro ao sair da conta. Tente novamente.');
    }
  }

  const novoPost = () => {
    setModalOpen(true); // Chama a função para abrir o modal no componente pai
  };

  return (
    <div className="container">
      <img src={Perfil} alt="Perfil" className="img-perfil" />
      <p className="username">{userInfo.username || "@demon.rs3"}</p>

      <div className="follow-info">
        <p>434.4k<br />Seguidores</p>
        <p>1089<br />Seguindo</p>
      </div>

      <div className="lista">
        <ul>
          <li onClick={() => navigate('/home')}><FaHome className='icons' /> Home</li>
          <li onClick={() => navigate('/explore')}><FaSearch className='icons' /> Explorar</li>
          <li onClick={() => navigate('/messages')}><TbMessageCircleUser className='mensagem' /> Mensagens</li>
          <li onClick={novoPost}><FaPlusCircle className='icons' /> Novo post</li>
          <li onClick={() => navigate('/user-config')}><FaUserCog className='icons' /> Configurações</li>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <li className="logout" onClick={doLogout}>
            <CiLogout className="logout-icon" /> Sair
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MenuLateral;
