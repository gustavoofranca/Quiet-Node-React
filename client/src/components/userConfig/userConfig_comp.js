import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { query, where, doc, collection, addDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './userConfig_comp.css';


const UserConfig = () => {

    const [username, setUsername] = useState('');
    const [userInfo, setUserInfo] = useState([]);


    useEffect(() => {
        // Tenta recuperar os dados do usuário do sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.username) {

            // Função para carregar os dados do usuário com base no username
            const loadUsers = () => {
                const userQuery = query(
                    collection(db, 'users'),
                    where("username", "==", storedUserData.username) // Usa o username diretamente
                );

                const unsubscribe = onSnapshot(userQuery, (snapshot) => {
                    let userList = [];
                    snapshot.forEach((doc) => {
                        userList.push({
                            id: doc.id,
                            username: doc.data().username,
                            email: doc.data().email,
                            password: doc.data().password
                        });
                    });
                    setUserInfo(userList); // Define o estado com o usuário filtrado
                });

                return unsubscribe; // Limpar o ouvinte ao desmontar o componente
            };

            // Chama a função para carregar os dados do usuário
            const unsubscribe = loadUsers();

            // Limpar o ouvinte ao desmontar o componente
            return () => {
                if (unsubscribe) unsubscribe();
            };
        } else {
            console.log("Erro: Dados do usuário não encontrados no sessionStorage.");
        }
    }, []);

    async function edituser() {
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



    return (
        <>
            <div className='userConfig-main-container'>

                <ul className="user-container">
                    {userInfo.map((value) => (
                        <li key={value.id}>
                            <div>
                                <span>Usuário: {value.username}</span>
                                <span>Email: {value.email}</span>
                                <span>Senha: {value.password}</span>
                            </div>

                        </li>
                    ))}
                </ul>
            </div >
        </>
    );









}

export default UserConfig;