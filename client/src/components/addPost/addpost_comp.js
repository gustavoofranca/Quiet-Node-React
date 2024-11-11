import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';  // Para realizar requisições HTTP
import { MdClose } from "react-icons/md";
import { TiPencil } from "react-icons/ti"; // Ícone de editar
import { FaRegTrashAlt } from "react-icons/fa"; // Ícone de excluir
import './addpost_comp.css';

const AddPost = ({ isOpen, closeModal }) => {
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [posts, setPosts] = useState([]);
    const [idPost, setIdPost] = useState('');
    const modalRef = useRef(null);

    // Carregar os dados do usuário no sessionStorage
    useEffect(() => {
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.username) {
            setOwner(storedUserData.username);
        } else {
            console.log("Erro: Dados do usuário não encontrados no sessionStorage.");
        }

        // Carregar os posts do MongoDB
        const loadPosts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/posts');  // Supondo que seu backend tem esse endpoint
                setPosts(response.data);
            } catch (error) {
                console.error("Erro ao carregar posts:", error);
            }
        };

        loadPosts();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Função para adicionar ou editar o post
    const addPost = async () => {
        if (!owner) {
            alert("Erro: Usuário não encontrado. Por favor, faça login novamente.");
            return;
        }

        if (!description.trim() || (!image.trim() && !imageURL.trim())) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        const imageToSave = imageURL.trim() ? imageURL : image;

        if (idPost) {
            await editPost(imageToSave);
        } else {
            await addNewPost(imageToSave);
        }
    };

    // Função para adicionar um novo post
    const addNewPost = async (imageToSave) => {
        try {
            const response = await axios.post('http://localhost:5000/api/posts', {
                owner: owner,
                description: description,
                image: imageToSave,
            });

            alert('Post adicionado com sucesso!');
            setDescription('');
            setImage('');
            setImageURL('');
            closeModal();
            setPosts([...posts, response.data]);  // Adiciona o novo post ao estado
        } catch (error) {
            console.error("Erro ao adicionar o post:", error);
        }
    };

    const editPost = async (imageToSave) => {
        if (!idPost) {
            alert("Selecione um post para editar.");
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/posts/${idPost}`, {
                owner: owner,
                description: description,
                image: imageToSave,
            });

            alert('Post editado com sucesso!');
            setIdPost('');
            setDescription('');
            setImage('');
            setImageURL('');
            closeModal();

            // Atualiza o estado com os posts modificados
            setPosts(posts.map(post => post.id === idPost ? response.data : post));
        } catch (error) {
            console.error("Erro ao editar o post:", error);
        }
    };



    const deletePost = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`);
            alert('Post excluído com sucesso!');
            setPosts(posts.filter(post => post.id !== id)); // Atualiza o estado após a exclusão
        } catch (error) {
            console.error("Erro ao excluir o post:", error);
        }
    };



    // Função para carregar o post no formulário de edição
    const loadPostForEdit = (post) => {
        setIdPost(post.id);
        setOwner(post.owner);
        setDescription(post.description);
        setImage(post.image);
        setImageURL('');
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="addpost-main-container" ref={modalRef}>
                <button className="close-btn" onClick={closeModal}>
                    <MdClose size={30} />
                </button>

                <h3 className='username-modal'>Usuário: {owner || "Desconhecido"}</h3>

                <div className="addpost-form">
                    <label>Imagem (URL ou Arquivo):</label>
                    <input
                        type="text"
                        placeholder="URL da Imagem"
                        value={imageURL}
                        onChange={(e) => setImageURL(e.target.value)}
                    />
                    <div className="file-input-container">
                        <label className="file-input-label">
                            Selecione uma Imagem
                            <input
                                type="file"
                                className="file-input"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {image && <img src={image} alt="Preview" className="image-preview" />}
                    <label>Descrição:</label>
                    <textarea
                        placeholder="Descrição do Post"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button className="addpost-form-button" onClick={addPost}>Salvar</button>
                </div>

                <h4 className='modal-list'>Lista de Posts</h4>
                <div className="posts-container">
                    {posts.map((post) => (
                        <div key={post.id} className="addpost-post-container">
                            <div className="post-image-container">
                                <img src={post.image} alt="Post" />
                                <div className="post-buttons">
                                    <button onClick={() => loadPostForEdit(post)}>
                                        <TiPencil />
                                    </button>
                                    <button onClick={() => deletePost(post.id)}>
                                        <FaRegTrashAlt />
                                    </button>
                                </div>
                            </div>
                            <div className="post-info2">
                                <p className="post-description">{post.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AddPost;
