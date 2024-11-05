import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './addpost_comp.css';


const AddPost = () => {
    // Variáveis das informações dos Posts
    const [proprietario, setProprietario] = useState('');
    const [descricao, setDescricao] = useState('');
    const [image, setImage] = useState('');
    const [post, setPost] = useState([]);
    const [idPost, setIdPost] = useState('');
    const [data, setData] = useState('');

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
        <div className="posts-container">
            <label>Usuário: </label>
            <textarea type="text" placeholder="Usuário" value={proprietario} onChange={(e) => setProprietario(e.target.value)} />

            <label>Imagem (URL):</label>
            <textarea type="text" placeholder="URL da Imagem" value={image} onChange={(e) => setImage(e.target.value)} />

            <label>Descrição:</label>
            <textarea type="text" placeholder="Descrição do Post" value={descricao} onChange={(e) => setDescricao(e.target.value)} />

            <button onClick={adicionarPosts}>{idPost ? "Atualizar" : "Inserir"}</button>

            <ul>
                {post.map((value) => (
                    <li className="addpost-container" key={value.id}>
                        <span> Usuario: {value.proprietario}</span>
                        <img className="addpost-image" src={value.image} alt={value.proprietario} />
                        <span className='addpost-descricao'> Descricao: {value.descricao}</span>
                        <button onClick={() => carregarPostParaEdicao(value)}>Editar</button>
                        <button onClick={() => excluirPost(value.id)}>Excluir</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AddPost;