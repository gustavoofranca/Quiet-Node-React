import React from 'react';
import './home_p.css'; // Importa o CSS
import MenuLateral from '../../components/MenuLateral/menu_comp';

const Home = () => {
  return (
    <div className="home-container">
      <MenuLateral />
      <div className="main-content">
        {/* Adicione mais conteúdo aqui, como postagens ou um feed de atividades */}
      </div>
    </div>
  );
};


export default Home;