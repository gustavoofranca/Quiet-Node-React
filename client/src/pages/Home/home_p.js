import React from 'react';
import './home_p.css'; // Importa o CSS
import MenuLateral from '../../components/MenuLateral/menu_comp';
import Feed from "../../components/Feed/feed_comp"

const Home = () => {
  return (
    <div className="home-container">
      <MenuLateral />
      <div className="main-content">
          <Feed />
      </div>
    </div>
  );
};


export default Home;