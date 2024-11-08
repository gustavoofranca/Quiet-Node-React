import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from "react-icons/fc";

import { db } from '../../firebaseConnection';
import { query, where, doc, collection, addDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import './userConfig_comp.css';

const UserConfig = () => {
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [imageUrl, setImageUrl] = useState(''); // Novo estado para a URL da imagem
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [userID, setUserID] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Recupera os dados do usuário do sessionStorage
        const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
        if (storedUserData && storedUserData.uid) {
            const loadUsers = () => {
                const userQuery = query(
                    collection(db, 'users'),
                    where("uid", "==", storedUserData.uid)
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
                    setUserInfo(userList);
                });

                return unsubscribe;
            };

            const unsubscribe = loadUsers();
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
        setImageUrl(''); // Limpa o campo da URL ao carregar um usuário para edição
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
    }

    async function edituser() {
        if (!userID) {
            alert("Selecione um usuário para editar.");
            return;
        }
        const userEditado = doc(db, 'users', userID);

        await updateDoc(userEditado, {
            username: username,
            userImage: imageUrl || userImage, // Usa a URL da imagem ou, se vazia, a imagem carregada
            email: email,
            password: password
        })
            .then(() => {
                alert('Usuário editado com sucesso!');
                setUserID('');
                setUserImage('');
                setImageUrl(''); // Limpa o campo da URL após a atualização
                setUsername('');
                setEmail('');
                setPassword('');
            })
            .catch((error) => {
                console.log("Erro ao editar o usuário:", error);
            });
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setUserImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

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
                    <div>
                        <label>Imagem:</label>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Digite a URL da imagem"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
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

                        {imageUrl ? (
                            <img src={imageUrl} alt="Pré-visualização" className="userImage-preview" />
                        ) : (
                            userImage && <img src={userImage} alt="Pré-visualização" className="userImage-preview" />
                        )}
                    </div>
                    
                    <div className='userConfig-form-container'>
                        <div className="input-group">
                            <label htmlFor="username">Apelido</label>
                            <input
                                type="text"
                                placeholder="Digite um apelido"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                placeholder="Digite um email"
                                value={email}
                                readOnly
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Senha</label>
                            <div className="password-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Digite uma senha"
                                    value={password}
                                    readOnly
                                />
                                <span onClick={togglePasswordVisibility}>
                                    {showPassword ? <FaEyeSlash className="icon-eye" /> : <FaEye className="icon-eye" />}
                                </span>
                            </div>
                        </div>
                        <button className='addpost-form-button' onClick={edituser}>{userID ? "Atualizar" : "Sem usuário selecionado"}</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserConfig;
