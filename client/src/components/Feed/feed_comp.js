import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { useTheme } from '../../context/ThemeContext'; // Importa o hook do tema
import './feed_comp.css';

const Feed = ({ openModal }) => {
  const [post, setPost] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  const { currentTheme } = useTheme(); // Acessa o tema atual do contexto

  useEffect(() => {
    const loadPosts = () => {
      const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let postList = [];
        snapshot.forEach((doc) => {
          postList.push({
            id: doc.id,
            owner: doc.data().owner,
            profilePic: doc.data().profilePic,
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
    <div
      className="feed-main-container"
      style={{
        background: currentTheme.background, // Fundo principal
        color: currentTheme.color, // Cor do texto
      }}
    >
      <ul>
        {post.map((value) => (
          <li
            className="feed-post-container"
            key={value.id}
            style={{
              background: currentTheme.cardBackground, // Fundo do post
              color: currentTheme.cardColor, // Cor do texto do post
            }}
          >
            <img className='img-perfil' src={value.profilePic}/>
            <strong
              className='post-owner'
              style={{ color: currentTheme.highlightColor }}
            >
              {value.owner}
            </strong>
            <img
              className="post-image"
              src={value.image}
              alt={value.owner}
              style={{
                background: currentTheme.backgroundAlt, // Fundo alternativo para imagens
                borderColor: currentTheme.borderColor, // Cor da borda
              }}
            />
            <p className='post-description'>
              <strong>{value.owner}</strong> {value.description}
            </p>
            <hr
              style={{
                borderColor: currentTheme.highlightColorLight, // Cor da linha
              }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Feed;
