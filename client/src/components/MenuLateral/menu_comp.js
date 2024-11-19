import React, { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaUserCog, FaPlusCircle } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { TbMessageCircleUser } from "react-icons/tb";
import './menu_comp.css';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import { db } from '../../firebaseConnection';
import { query, where, collection, onSnapshot } from "firebase/firestore";
import { auth } from '../../firebaseConnection';
import { signOut } from "firebase/auth";

const MenuLateral = ({ setModalOpen }) => {
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
  const { currentTheme, toggleTheme } = useTheme();

  useEffect(() => {
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
      toast.success('Você saiu da conta com sucesso!', {className : 'toast-success'});
      navigate('/');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error('Ocorreu um erro ao sair da conta. Tente novamente.', {className : 'toast-error'});	
    }
  }

  const novoPost = () => {
    setModalOpen(true);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className={`container ${currentTheme}`}>
        <img src={userInfo.userImage} alt="Perfil" className="img-perfil" />
        <p className="username">{userInfo.username}</p>

        <div className="follow-info">
          <p>434.4k<br />Seguidores</p>
          <p>1089<br />Seguindo</p>
        </div>

        <div className="lista">
          <ul>
            <li onClick={() => navigate('/home')}><FaHome className='icons' /> Home</li>
            <li onClick={() => navigate('/localizacao')}><FaSearch className='icons' /> Localização</li>
            <li onClick={() => navigate('/messages')}><TbMessageCircleUser className='mensagem' /> Mensagens</li>
            <li onClick={novoPost}><FaPlusCircle className='icons' /> Novo post</li>
            <li onClick={() => navigate('/user-config')}><FaUserCog className='icons' /> Configurações</li>
          </ul>
        </div>

        <div className="theme-toggle">
          <label className="switch">
            <input type="checkbox" checked={currentTheme === 'dark'} onChange={toggleTheme} />
            <span className="slider round"></span>
          </label>
          <span className="theme-text">
            {currentTheme === 'dark' ? 'Tema Escuro' : ' Tema Claro'}
          </span>
        </div>

        <div className="logout-container">
          <ul>
            <li className="logout" onClick={doLogout}>
              <CiLogout className="logout-icon" /> Sair
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default MenuLateral;
