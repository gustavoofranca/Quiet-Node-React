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

  // Variáveis das informações dos Posts
  const [proprietario, setProprietario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [image, setImage] = useState('');
  const [post, setPost] = useState([]);
  const [idPost, setIdPost] = useState('');

  useEffect(() => {
    // Função para carregar os posts em tempo real
    const carregarPosts = () => {
      const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            proprietario: doc.data().proprietario,
            descricao: doc.data().descricao,
            image: doc.data().image
          });
        });
        setPost(listaPost);
      });
      return () => unsubscribe(); // Limpar o ouvinte ao desmontar o componente
    };

    carregarPosts();
  }, []);


  // ===== Início CRUD ==================================================
  // CREATE
  async function adicionarPosts() {
    // Verifica se todos os campos estão preenchidos
    if (!proprietario.trim() || !descricao.trim() || !image.trim()) {
      alert('Por favor, preencha todos os campos (Título, descricao, Imagem).');
      return;
    }

    if (idPost) {
      editarPost(); // Se tiver ID, chama a função de edição
    }

    else {
      await addDoc(collection(db, 'posts'), {
        proprietario: proprietario,
        descricao: descricao,
        image: image
      })
        .then(() => {
          alert('Cadastro realizado com sucesso!');
          setDescricao('');
          setProprietario('');
          setImage('');
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  // UPDATE
  async function editarPost() {
    if (!idPost) {
      alert("Selecione um post para editar.");
      return;
    }
    const postEditado = doc(db, 'posts', idPost);
    await updateDoc(postEditado, {
      proprietario: proprietario,
      descricao: descricao,
      image: image
    })
      .then(() => {
        alert('Post editado com sucesso!');
        setIdPost('');
        setProprietario('');
        setDescricao('');
        setImage('');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // DELETE
  async function excluirPost(id) {
    const postExcluido = doc(db, 'posts', id);
    await deleteDoc(postExcluido)
      .then(() => {
        alert('Post excluído com sucesso!');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Função para carregar os dados do post nos inputs para edição
  function carregarPostParaEdicao(post) {
    setIdPost(post.id);
    setProprietario(post.proprietario);
    setDescricao(post.descricao);
    setImage(post.image);

  }


  return (
    <div className="main-container">
      <ul>
        {post.map((value) => (
          <li className="post-container" key={value.id}>
            <strong className='post-proprietario'> {value.proprietario}</strong>
            <img className="post-image" src={value.image} alt={value.proprietario} />
            <p className='post-descricao'><strong>{value.proprietario}</strong> {value.descricao}</p>
            <hr></hr>
          </li>
        ))}
      </ul>
    </div>
  );


};

export default Feed;
