import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './addpost_comp.css';

const AddPost = () => {
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [post, setPost] = useState([]);
    const [idPost, setIdPost] = useState('');

    useEffect(() => {
        // Tenta recuperar os dados do usuário do sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.username) {
            setOwner(storedUserData.username); // Defina o campo owner como o username salvo
        } else {
            console.log("Erro: Dados do usuário não encontrados no sessionStorage.");
        }

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


    async function addPost() {
        // Verifica se o owner está definido
        if (!owner) {
            alert("Erro: Usuário não encontrado. Por favor, faça login novamente.");
            return;
        }

        // Verifica se todos os campos estão preenchidos
        if (!description.trim() || !image.trim()) {
            alert('Por favor, preencha todos os campos corretamente.');
            return;
        }

        if (idPost) {
            editPost(); // Se tiver ID, chama a função de edição
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

    return (
        <div className="addpost-main-container">
            <h3>Usuário: {owner || "Desconhecido"}</h3> {/* Exibe o owner atual, sem edição */}

            <div className="addpost-form">
                <label>Imagem (URL):</label>
                <textarea type="text" placeholder="URL da Imagem" value={image} onChange={(e) => setImage(e.target.value)} />

                <label>Descrição:</label>
                <textarea type="text" placeholder="Descrição do Post" value={description} onChange={(e) => setDescription(e.target.value)} />

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
    );
}

export default AddPost;
