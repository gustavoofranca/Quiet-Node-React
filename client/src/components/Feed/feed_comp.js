import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { collection, onSnapshot } from "firebase/firestore";

// import axios from 'axios';
import './feed_comp.css';


const Feed = () => {

  const [post, setPost] = useState([]);

  useEffect(() => {
    // Função para carregar os posts em tempo real
    const loadPosts = () => {
      const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let postList = [];
        snapshot.forEach((doc) => {
          postList.push({
            id: doc.id,
            owner: doc.data().owner,
            description: doc.data().description,
            image: doc.data().image
          });
        });
        setPost(postList);
      });
      return () => unsubscribe(); // Limpar o ouvinte ao desmontar o componente
    };

    loadPosts();
  }, []);

  
  return (
    <div className="feed-main-container">
      <ul>
        {post.map((value) => (
          <li className="feed-post-container" key={value.id}>
            <strong className='post-owner'> {value.owner}</strong>
            <img className="post-image" src={value.image} alt={value.owner} />
            <p className='post-description'><strong>{value.owner}</strong> {value.description}</p>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );


};

export default Feed;
