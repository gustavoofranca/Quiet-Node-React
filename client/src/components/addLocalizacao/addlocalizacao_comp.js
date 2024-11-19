import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdClose } from 'react-icons/md';
import { useTheme } from '../../context/ThemeContext';
import './addlocalizacao_comp.css';

const AddLocalizacao = ({ isOpen, closeModal }) => {
    const [endereco, setEndereco] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [localizacoes, setLocalizacoes] = useState([]);

    const { currentTheme } = useTheme();

    // Função para carregar localizações do Firestore
    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'localizacoes'),
            (snapshot) => {
                const localizacoesList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLocalizacoes(localizacoesList);
            },
            (error) => {
                console.error("Erro ao carregar localizações:", error);
                toast.error("Erro ao carregar localizações.", { className: 'toast-error' });
            }
        );

        // Limpar o listener ao desmontar o componente
        return () => unsubscribe();
    }, []);

    // Função para salvar uma nova localização
    async function salvarLocalizacao() {
        if (!endereco.trim() || !latitude.trim() || !longitude.trim()) {
            toast.warn('Por favor, preencha todos os campos corretamente.', { className: 'toast-warn' });
            return;
        }

        try {
            await addDoc(collection(db, 'localizacoes'), {
                endereco,
                latitude,
                longitude,
                data: new Date(),
            });
            toast.success('Localização salva com sucesso!', { className: 'toast-success' });
            setEndereco('');
            setLatitude('');
            setLongitude('');
        } catch (error) {
            console.error("Erro ao salvar localização:", error);
            toast.error('Erro ao salvar localização. Tente novamente.', { className: 'toast-error' });
        }
    }

    if (!isOpen) return null;

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
            <div
                className="modal-overlay"
                style={{ background: currentTheme.overlayBackground }}
            >
                <div
                    className="addlocalizacao-main-container"
                    style={{
                        background: currentTheme.background,
                        color: currentTheme.color,
                    }}
                >
                    <button
                        className="close-btn"
                        onClick={closeModal}
                        style={{ color: currentTheme.color }}
                    >
                        <MdClose size={30} />
                    </button>

                    <h3>Adicionar Localização</h3>

                    <div className="addlocalizacao-form">
                        <label>Endereço:</label>
                        <input
                            type="text"
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                            placeholder="Digite o endereço"
                            style={{
                                background: currentTheme.inputBackground,
                                color: currentTheme.inputColor,
                            }}
                        />

                        <label>Latitude:</label>
                        <input
                            type="text"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            placeholder="Digite a latitude"
                            style={{
                                background: currentTheme.inputBackground,
                                color: currentTheme.inputColor,
                            }}
                        />

                        <label>Longitude:</label>
                        <input
                            type="text"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            placeholder="Digite a longitude"
                            style={{
                                background: currentTheme.inputBackground,
                                color: currentTheme.inputColor,
                            }}
                        />

                        <button
                            className="salvar-btn"
                            onClick={salvarLocalizacao}
                            style={{
                                background: currentTheme.buttonBackground,
                                color: currentTheme.buttonColor,
                            }}
                        >
                            Salvar Localização
                        </button>
                    </div>

                    <h4>Lista de Localizações</h4>
                    <div className="localizacoes-container">
                        {localizacoes.map((localizacao) => (
                            <div
                                key={localizacao.id}
                                className="localizacao-item"
                                style={{
                                    background: currentTheme.cardBackground,
                                    color: currentTheme.cardColor,
                                }}
                            >
                                <p><strong>Endereço:</strong> {localizacao.endereco}</p>
                                <p><strong>Latitude:</strong> {localizacao.latitude}</p>
                                <p><strong>Longitude:</strong> {localizacao.longitude}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AddLocalizacao;
