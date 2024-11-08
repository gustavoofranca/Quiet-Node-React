import React, { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaUserCog, FaPlusCircle } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { TbMessageCircleUser } from "react-icons/tb";
import './menu_comp.css';
import { useNavigate } from 'react-router-dom';

// Importações para Firebase
import { db } from '../../firebaseConnection';
import { query, where, collection, onSnapshot } from "firebase/firestore";
import { auth } from '../../firebaseConnection';
import { signOut } from "firebase/auth";

const MenuLateral = ({ setModalOpen }) => {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera os dados do usuário do sessionStorage
    const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUserData && storedUserData.uid) {
      const userQuery = query(
        collection(db, 'users'),
        where("uid", "==", storedUserData.uid)
      );

      const unsubscribe = onSnapshot(userQuery, (snapshot) => {
        snapshot.forEach((doc) => {
          setUserInfo(doc.data());
        });
      });

      return () => unsubscribe();
    }
  }, []);

  async function doLogout() {
    try {
      await signOut(auth);
      sessionStorage.removeItem('userData');
      alert('Você saiu da conta com sucesso!');
      navigate('/');
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
      <img
        src={userInfo.userImage}
        alt="Perfil"
        className="img-perfil"
      />
      <p className="username">{userInfo.username}</p>

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
