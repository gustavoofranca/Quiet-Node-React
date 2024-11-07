import React, { useState } from 'react';
import MenuLateral from '../../components/MenuLateral/menu_comp';
import Feed from '../../components/Feed/feed_comp';
import AddPost from '../../components/addPost/addpost_comp';
import './home_p.css';

const Home = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="home-container">
      <MenuLateral setModalOpen={setModalOpen} />
      <div className="main-content">
        <Feed openModal={modalOpen} />
      </div>
      <AddPost isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default Home;
