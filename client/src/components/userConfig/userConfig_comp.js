// userConfig_comp.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db, auth } from '../../firebaseConnection';
import { signOut } from "firebase/auth";
import { query, where, doc, collection, updateDoc, onSnapshot } from "firebase/firestore";
import './userConfig_comp.css';
import { useTheme } from '../../context/ThemeContext';

const UserConfig = () => {
    const { currentTheme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [userImage, setUserImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userInfo, setUserInfo] = useState([]);
    const [userID, setUserID] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
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
        setImageUrl('');
        setUsername(user.username);
        setEmail(user.email);
        setPassword(user.password);
    }

    async function edituser() {
        if (!userID) {
            toast.warn("Selecione o usuário para editar.", { className: 'toast-warn' });
            return;
        }
        const userEditado = doc(db, 'users', userID);

        try {
            await updateDoc(userEditado, {
                username: username,
                userImage: imageUrl || userImage,
                email: email,
                password: password
            });

            const updatedUserData = {
                uid: userID,
                username: username,
                userImage: imageUrl || userImage,
                email: email,
                password: password
            };
            sessionStorage.setItem('userData', JSON.stringify(updatedUserData));

            toast.success('Usuário editado com sucesso!', { className: 'toast-success' });
            setUserID('');
            setUserImage('');
            setImageUrl('');
            setUsername('');
            setEmail('');
            setPassword('');
            navigate('/');
            doLogout();
        } catch (error) {
            console.log("Erro ao editar o usuário:", error);
        }
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

    async function doLogout() {
        try {
            await signOut(auth);
            sessionStorage.removeItem('userData');
            toast.success('Conta atualizada com sucesso!', { className: 'toast-success' });
            navigate('/');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
            toast.error('Ocorreu um erro ao atualizar a conta. Tente novamente.', { className: 'toast-error' });
        }
    }

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className='userConfig-main-container'>
                <ul className="user-container">
                    {userInfo.map((value) => (
                        <li key={value.id}>
                            <img className="user-image" src={value.userImage} alt={value.username} />
                            <div className='userInfo-container'>
                                <span className='userInfo user-username'>{value.username}</span>
                                <span className='userInfo user-email'>{value.email}</span>
                            </div>
                            <button className='edit-button' onClick={() => loadUserForEdit(value)}>Editar</button>
                        </li>
                    ))}
                    <li onClick={() => navigate('/home')} ><FaHome className='icons' /> Home</li>
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
                            <label className="file-userconfig-button">
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
                        <button className='addpost-form-button' onClick={edituser}>{userID ? "Atualizar" : "Usuário não selecionado, favor clique em editar "}</button>
                        <p className='userConfig-warning'>Obs: Você será redireciona à página de login ao atualizar.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserConfig;

