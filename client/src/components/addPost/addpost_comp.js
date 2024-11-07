import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { MdClose } from "react-icons/md"; // Importando o ícone de "X"
import './addpost_comp.css';

const AddPost = ({ isOpen, closeModal }) => {
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [post, setPost] = useState([]);
    const [idPost, setIdPost] = useState('');
    const modalRef = useRef(null);

    useEffect(() => {
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.username) {
            setOwner(storedUserData.username);
        } else {
            console.log("Erro: Dados do usuário não encontrados no sessionStorage.");
        }

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);  // Converte a imagem para base64
            reader.readAsDataURL(file);  // Lê o arquivo da imagem
        }
    };

    async function addPost() {
        if (!owner) {
            alert("Erro: Usuário não encontrado. Por favor, faça login novamente.");
            return;
        }

        if (!description.trim() || !image.trim()) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        if (idPost) {
            editPost();
        } else {
            await addDoc(collection(db, 'posts'), {
                owner: owner,
                description: description,
                image: image
            })
                .then(() => {
                    alert('Cadastro realizado com sucesso!');
                    setDescription('');
                    setImage('');
                    closeModal(); // Fecha o modal após o post ser adicionado
                })
                .catch((error) => {
                    console.log("Erro ao adicionar o post:", error);
                });
        }
    }

    async function editPost() {
        if (!idPost) {
            alert("Selecione um post para editar.");
            return;
        }
        const postEditado = doc(db, 'posts', idPost);
        await updateDoc(postEditado, {
            owner: owner,
            description: description,
            image: image
        })
            .then(() => {
                alert('Post editado com sucesso!');
                setIdPost('');
                setDescription('');
                setImage('');
                closeModal(); // Fecha o modal após a edição
            })
            .catch((error) => {
                console.log("Erro ao editar o post:", error);
            });
    }

    async function deletePost(id) {
        const postExcluido = doc(db, 'posts', id);
        await deleteDoc(postExcluido)
            .then(() => {
                alert('Post excluído com sucesso!');
            })
            .catch((error) => {
                console.log("Erro ao excluir o post:", error);
            });
    }

    function loadPostForEdit(post) {
        setIdPost(post.id);
        setOwner(post.owner);
        setDescription(post.description);
        setImage(post.image);
    }

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();  // Fecha o modal se o clique for fora
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);  // Detecta o clique fora do modal
        return () => document.removeEventListener('mousedown', handleOutsideClick);  // Limpa o evento ao desmontar
    }, []);

    if (!isOpen) return null; // Não renderiza nada se o modal não estiver aberto

    return (
        <div className="modal-overlay">
            <div className="addpost-main-container" ref={modalRef}>
                {/* Botão de Fechar no canto superior direito */}
                <button className="close-btn" onClick={closeModal}>
                    <MdClose size={30} />
                </button>

                <h3>Usuário: {owner || "Desconhecido"}</h3>

                <div className="addpost-form">
                    <label>Imagem:</label>
                    {/* Botão estilizado para escolher arquivo */}
                    <div className="file-input-container">
                        <label className="file-input-label">
                            Escolher Imagem
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="file-input"
                            />
                        </label>
                    </div>
                    {image && <img src={image} alt="Imagem do Post" className="image-preview" />} {/* Exibe a imagem pré-visualizada */}

                    <label>Descrição:</label>
                    <textarea
                        placeholder="Descrição do Post"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <button onClick={addPost}>{idPost ? "Atualizar" : "Inserir"}</button>
                </div>

                <ul className="posts-container">
                    {post.map((value) => (
                        <li className="addpost-post-container" key={value.id}>
                            <div className='post-info1'>
                                <span>Usuário: {value.owner}</span>
                                <img className="post-image" src={value.image} alt={value.owner} />
                            </div>
                            <div className='post-info2'>
                                <span className='post-description'>Descrição: {value.description}</span>
                                <div className='post-buttons'>
                                    <button onClick={() => loadPostForEdit(value)}>Editar</button>
                                    <button onClick={() => deletePost(value.id)}>Excluir</button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AddPost;
