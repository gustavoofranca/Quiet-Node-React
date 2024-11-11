import React, { useEffect, useState } from 'react';
import axios from 'axios';  // Para fazer as requisições HTTP para o backend
import './feed_comp.css';

const Feed = ({ openModal }) => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');

  // Carregar os posts do MongoDB
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/posts'); // Altere o URL conforme necessário
        setPosts(response.data);
      } catch (error) {
        console.error('Erro ao carregar os posts:', error);
      }
    };

    loadPosts();
  }, []);

  // Enviar um novo post para o MongoDB
  const handlePostSubmit = async () => {
    if (!description.trim() || !image.trim()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/posts', {
        owner: '@demon.rs3', // Você pode substituir por dados reais do usuário
        description: description,
        image: image
      });
      setDescription('');
      setImage('');
      openModal(false); // Fecha o modal após o post ser criado
      // Atualiza a lista de posts após adicionar um novo post
      const response = await axios.get('http://localhost:5000/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.log('Erro ao adicionar o post:', error);
    }
  };

  return (
    <div className="feed-main-container">
      <ul>
        {posts.map((value) => (
          <li className="feed-post-container" key={value._id}> {/* Alterei 'id' para '_id' do MongoDB */}
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
