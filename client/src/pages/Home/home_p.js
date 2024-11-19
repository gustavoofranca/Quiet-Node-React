import React, { useState } from 'react';
import MenuLateral from '../../components/MenuLateral/menu_comp';
import Feed from '../../components/Feed/feed_comp';
import AddPost from '../../components/addPost/addpost_comp';
import './home_p.css';
import { useTheme } from '../../context/ThemeContext'; // Importando o hook useTheme

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { currentTheme } = useTheme(); // Obtendo o tema atual

  return (
    <div className={`home-container ${currentTheme}`}> {/* Aplicando o tema no container */}
      <MenuLateral setModalOpen={setModalOpen} />
      <div className="main-content">
        <Feed openModal={modalOpen} />
      </div>
      <AddPost isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
