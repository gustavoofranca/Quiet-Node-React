import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './addpost_comp.css';


const AddPost = () => {
    // Variáveis das informações dos Posts
    const [owner, setOwner] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [post, setPost] = useState([]);
    const [idPost, setIdPost] = useState('');

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


    // ===== Início CRUD ==================================================
    // CREATE
    async function addPost() {
        // Verifica se todos os campos estão preenchidos
        if (!owner.trim() || !description.trim() || !image.trim()) {
            alert('Por favor, preencha todos os campos (Título, description, Imagem).');
            return;
        }

        if (idPost) {
            editPost(); // Se tiver ID, chama a função de edição
        }

        else {
            await addDoc(collection(db, 'posts'), {
                owner: owner,
                description: description,
                image: image
            })
                .then(() => {
                    alert('Cadastro realizado com sucesso!');
                    setDescription('');
                    setOwner('');
                    setImage('');
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }

    // UPDATE
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
                setOwner('');
                setDescription('');
                setImage('');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    // DELETE
    async function deletePost(id) {
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
    function loadPostForEdit(post) {
        setIdPost(post.id);
        setOwner(post.owner);
        setDescription(post.description);
        setImage(post.image);
    }


    return (
        <div className="posts-container">
            <label>Usuário: </label>
            <textarea type="text" placeholder="Usuário" value={owner} onChange={(e) => setOwner(e.target.value)} />

            <label>Imagem (URL):</label>
            <textarea type="text" placeholder="URL da Imagem" value={image} onChange={(e) => setImage(e.target.value)} />

            <label>Descrição:</label>
            <textarea type="text" placeholder="Descrição do Post" value={description} onChange={(e) => setDescription(e.target.value)} />

            <button onClick={addPost}>{idPost ? "Atualizar" : "Inserir"}</button>

            <ul>
                {post.map((value) => (
                    <li className="addpost-container" key={value.id}>
                        <span> Usuario: {value.owner}</span>
                        <img className="addpost-image" src={value.image} alt={value.owner} />
                        <span className='addpost-description'> description: {value.description}</span>
                        <button onClick={() => loadPostForEdit(value)}>Editar</button>
                        <button onClick={() => deletePost(value.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AddPost;