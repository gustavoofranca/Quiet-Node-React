import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";

import { db } from '../../firebaseConnection';
import { query, where, doc, collection, addDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import './userConfig_comp.css';


const UserConfig = () => {

    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [userID, setUserID] = useState('');
    const [showPassword, setShowPassword] = useState(false); // Novo estado para controle de visibilidade da senha

    useEffect(() => {
        // Tenta recuperar os dados do usuário do sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.uid) {

            // Função para carregar os dados do usuário com base no username
            const loadUsers = () => {
                const userQuery = query(
                    collection(db, 'users'),
                    where("uid", "==", storedUserData.uid) // Usa o username diretamente
                );

                const unsubscribe = onSnapshot(userQuery, (snapshot) => {
                    let userList = [];
                    snapshot.forEach((doc) => {
                        userList.push({
                            id: doc.id,
                            username: doc.data().username,
                            email: doc.data().email,
                            password: doc.data().password,
                            userImage: doc.data().userImage
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
        setUserImage(user.userImage);
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
    }


    // =================================================================
    async function edituser() {
        if (!userID) {
            alert("Selecione um usuário para editar.");
            return;
        }
        const userEditado = doc(db, 'users', userID);
        await updateDoc(userEditado, {
            username: username,
            userImage: userImage,
            email: email,
            password: password
        })
            .then(() => {
                alert('Usuário editado com sucesso!');
                setUserID('');
                setUserImage('');
                setUsername('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log("Erro ao editar o usuário:", error);
            });
    }

    // =================================================================
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUserImage(reader.result);  // Converte a imagem para base64
            reader.readAsDataURL(file);  // Lê o arquivo da imagem
        }
    };

    // =================================================================
    // Função para alternar visibilidade da senha
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <>
            <div className='userConfig-main-container'>

                <ul className="user-container">
                    {userInfo.map((value) => (
                        <li key={value.id}>
                            <img className="user-image" src={value.userImage} alt={value.username} />
                            <div className='userInfo-container'>
                                <span className='userInfo user-username'>{value.username}</span>
                                <span className='userInfo user-email'>{value.email}</span>
                                <div className='post-buttons'>
                                    <button className='addpost-form-button' onClick={() => loadUserForEdit(value)}>Editar</button>
                                </div>
                            </div>

                        </li>
                    ))}
                </ul>

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
                    {userImage && <img src={userImage} alt="Imagem do Post" className="userImage-preview" />} {/* Exibe a imagem pré-visualizada */}

                    <div className="input-group">
                        <label htmlFor="username">Apelido</label>
                        <input type="text" placeholder="Digite um apelido" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <button className='addpost-form-button' onClick={edituser}>{userID ? "Atualizar" : "Sem usuário selecionado"}</button>
                </div >
            </div>
        </>
    );









}

export default UserConfig;