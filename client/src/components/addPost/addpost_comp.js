// addpost_comp.js
import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { MdClose } from "react-icons/md";
import { TiPencil } from "react-icons/ti"; // Ícone de editar
import { FaRegTrashAlt } from "react-icons/fa"; // Ícone de excluir
import './addpost_comp.css';

const AddPost = ({ isOpen, closeModal }) => {
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [imageURL, setImageURL] = useState('');
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
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    async function addPost() {
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
            editPost(imageToSave);
        } else {
            await addDoc(collection(db, 'posts'), {
                owner: owner,
                description: description,
                image: imageToSave
            })
                .then(() => {
                    alert('Cadastro realizado com sucesso!');
                    setDescription('');
                    setImage('');
                    setImageURL('');
                    closeModal();
                })
                .catch((error) => {
                    console.log("Erro ao adicionar o post:", error);
                });
        }
    }

    async function editPost(imageToSave) {
        if (!idPost) {
            alert("Selecione um post para editar.");
            return;
        }
        const postEditado = doc(db, 'posts', idPost);
        await updateDoc(postEditado, {
            owner: owner,
            description: description,
            image: imageToSave
        })
            .then(() => {
                alert('Post editado com sucesso!');
                setIdPost('');
                setDescription('');
                setImage('');
                setImageURL('');
                closeModal();
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
        setImageURL('');
    }

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
                    {post.map((post) => (
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
