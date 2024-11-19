import React, { useState } from 'react';
import MenuLateral from '../../components/MenuLateral/menu_comp'; // Menu lateral
import AddPost from '../../components/addPost/addpost_comp'; // Modal de adicionar post
import LocalizacaoComp from '../../components/Localizacao/locaizacao_comp'; // Componente de localização
import './localizacao_p.css';

const LocalizacaoPage = () => {
  const [modalOpen, setModalOpen] = useState(false); // Controle do modal de adicionar post

  return (
    <div className="localizacao-page">
      <MenuLateral setModalOpen={setModalOpen} />
      <div className="main-content">
        <LocalizacaoComp />
      </div>
      <AddPost isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default LocalizacaoPage;