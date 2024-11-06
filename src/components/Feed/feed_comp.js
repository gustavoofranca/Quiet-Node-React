import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

// import axios from 'axios';
import './feed_comp.css';


const Feed = () => {

  /*
    const [images, setImages] = useState([]);
    const [displayedImages, setDisplayedImages] = useState(new Set());
  
    useEffect(() => {
      const fetchImages = async () => {
        try {
          // Pega imagens aleatórias da API
          const response = await axios.get('http://localhost:5000/random-images');
          const newImages = response.data.images;
  
          // Filtra as novas imagens para não repetir as já exibidas
          const filteredImages = newImages.filter(image => !displayedImages.has(image));
  
          // Atualiza o estado das imagens exibidas
          if (filteredImages.length > 0) {
            setImages(prevImages => [...prevImages, ...filteredImages]);
            const newDisplayedImages = new Set(displayedImages);
            filteredImages.forEach(image => newDisplayedImages.add(image));
            setDisplayedImages(newDisplayedImages);
          } else {
            console.log('Todas as imagens já foram exibidas.');
          }
        } catch (error) {
          console.error('Erro ao buscar imagens:', error);
        }
      };
  
      fetchImages();
    }, []); 
  
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {images.map((image, index) => (
            <div className="imagem" key={index}>
              <img src={image} alt="Random" />
            </div>
          ))}
        </div>
      </div>
    );
  */

  const navigate = useNavigate();



  
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
    <div className="main-container">
      <ul>
        {post.map((value) => (
          <li className="post-container" key={value.id}>
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
