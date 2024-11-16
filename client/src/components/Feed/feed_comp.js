import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import './feed_comp.css';

const Feed = ({ openModal }) => {
  const [post, setPost] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
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
      return () => unsubscribe();
    };

    loadPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!description.trim() || !image.trim()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    try {
      await addDoc(collection(db, 'posts'), {
        owner: '@demon.rs3',
        description: description,
        image: image
      });
      setDescription('');
      setImage('');
      openModal(false); // Fecha o modal após o post ser criado
    } catch (error) {
      console.log("Erro ao adicionar o post:", error);
    }
  };

  return (
    <div className="feed-main-container">
      <ul>
        {post.map((value) => (
          <li className="feed-post-container" key={value.id}>
            <strong className='post-owner'>{value.owner}</strong>
            <img className="post-image" src={value.image} alt={value.owner} />
            <p className='post-description'><strong>{value.owner}</strong> {value.description}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Feed;

// Teste