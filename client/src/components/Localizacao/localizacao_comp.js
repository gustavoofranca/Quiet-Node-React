import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'; // Para a integração com a API de clima
import './localizacao_comp.css';

const LocalizacaoComp = () => {
  const [localizacoes, setLocalizacoes] = useState([]); // Localizações do Firestore
  const [descricao, setDescricao] = useState(""); // Descrição do formulário
  const [mapaHtml, setMapaHtml] = useState(""); // Código HTML do mapa do Google
  const [clima, setClima] = useState(null); // Dados de clima
  const [cidade, setCidade] = useState(""); // Cidade para buscar o clima

  const API_KEY = '1dcc6c85fbdbc42ae3656c32e389e83f'; // Substitua pela sua chave da API OpenWeatherMap

  useEffect(() => {
    const loadLocations = () => {
      const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
        const fetchedLocations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLocalizacoes(fetchedLocations);
      });
      return () => unsubscribe();
    };

    loadLocations();
  }, []);

  const handleAddLocalizacao = async () => {
    if (!descricao.trim() || !mapaHtml.trim()) {
      toast.warn("Por favor, preencha todos os campos.", { className: 'toast-warn' });
      return;
    }

    const novaLocalizacao = {
      descricao,
      mapaHtml,
    };

    try {
      await addDoc(collection(db, 'locations'), novaLocalizacao);
      setDescricao(""); // Limpa o campo de descrição
      setMapaHtml(""); // Limpa o campo do mapa
      alert("Localização adicionada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar localização:", error);
      toast.error("Não foi possível salvar a localização.", { className: 'toast-error' });
    }
  };

  const buscarClima = async () => {
    if (!cidade.trim()) {
      toast.warn("Por favor, insira o nome de uma cidade.", { className: 'toast-warn' });
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&units=metric&lang=pt_br`
      );
      setClima(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados do clima:", error);
      toast.error("Não foi possível buscar os dados do clima.", { className: 'toast-error' });
    }
  };

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
      <div className="localizacao-comp">
        <div className="header">
          <h1>Adicionar Localização</h1>
        </div>

        <div className="location-form">
          <label htmlFor="location-description">Descrição da Localização</label>
          <textarea
            id="location-description"
            placeholder="Digite a descrição da localização"
            rows="5"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />

          <label htmlFor="location-map">Link do Mapa (Google Maps)</label>
          <textarea
            id="location-map"
            placeholder="Cole o código do mapa do Google"
            rows="3"
            value={mapaHtml}
            onChange={(e) => setMapaHtml(e.target.value)}
          />

          <button onClick={handleAddLocalizacao}>
            Adicionar Localização
          </button>
        </div>

        <div className="weather-form">
          <h2>Clima e Tempo</h2>
          <input
            type="text"
            placeholder="Digite o nome da cidade"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="weather-input"
          />
          <button onClick={buscarClima} className="weather-button">
            Buscar Clima
          </button>

          {clima && (
            <div className="weather-info">
              <h3>Clima em {clima.name}</h3>
              <p><strong>Temperatura:</strong> {clima.main.temp}°C</p>
              <p><strong>Descrição:</strong> {clima.weather[0].description}</p>
              <p><strong>Umidade:</strong> {clima.main.humidity}%</p>
              <p><strong>Velocidade do Vento:</strong> {clima.wind.speed} km/h</p>
            </div>
          )}
        </div>

        <div className="feed-container">
          {/* Renderizar as localizações adicionadas */}
          {localizacoes.map((localizacao) => (
            <div key={localizacao.id} className="localizacao-item">
              <h3>{localizacao.descricao}</h3>
              <div className="map-container">
                {/* Exibe o mapa dinamicamente */}
                <div
                  dangerouslySetInnerHTML={{ __html: localizacao.mapaHtml }}
                  className="map-frame"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LocalizacaoComp;