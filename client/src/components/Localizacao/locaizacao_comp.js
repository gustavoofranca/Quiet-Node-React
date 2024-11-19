import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import './localizacao_comp.css';

const LocalizacaoComp = () => {
  const [localizacoes, setLocalizacoes] = useState([]); // Localizações do Firestore
  const [descricao, setDescricao] = useState(""); // Descrição do formulário
  const [mapaHtml, setMapaHtml] = useState(""); // Código HTML do mapa do Google

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
      alert("Por favor, preencha todos os campos.");
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
      alert("Não foi possível salvar a localização.");
    }
  };

  return (
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
  );
};

export default LocalizacaoComp;