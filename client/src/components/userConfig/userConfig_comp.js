import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { query, where, doc, collection, addDoc, getDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './userConfig_comp.css';


const UserConfig = () => {

    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [userID, setUserID] = useState('');

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

    function loadUserForEdit(user) {
        setUserID(user.id);
        setUserImage(user.image);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
    }

    async function edituser() {
        if (!userID) {
            alert("Selecione um post para editar.");
            return;
        }
        const userEditado = doc(db, 'posts', userID);
        await updateDoc(userEditado, {
            username: username,
            userImage: userImage,
            email: email,
            password: password
        })
            .then(() => {
                alert('Post editado com sucesso!');
                setUserID('');
                setUserImage('');
                setUsername('');
                setEmail('');
                setPassword('');
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