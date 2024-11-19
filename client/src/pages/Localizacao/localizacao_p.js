import React, { useState } from 'react';
import MenuLateral from '../../components/MenuLateral/menu_comp'; // Importa o menu lateral
import AddPost from '../../components/addPost/addpost_comp';
import './localizacao_p.css';

const LocalizacaoPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localizacoes, setLocalizacoes] = useState([]); // Estado para armazenar as localizações
  const [descricao, setDescricao] = useState(""); // Estado para armazenar a descrição da localização
  const [mapaHtml, setMapaHtml] = useState(""); // Estado para armazenar o código do mapa

  const handleAddLocalizacao = () => {
    const novaLocalizacao = {
      descricao,
      mapaHtml,
    };
    setLocalizacoes([...localizacoes, novaLocalizacao]);
    setDescricao(""); // Limpa o campo de descrição
    setMapaHtml(""); // Limpa o campo de mapa
  };

  return (
    <div className="localizacao-container">
      {/* Menu Lateral */}
      <MenuLateral setModalOpen={setModalOpen} />

      {/* Conteúdo Principal */}
      <div className="main-content">
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
          {localizacoes.map((localizacao, index) => (
            <div key={index} className="localizacao-item">
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

      <AddPost isOpen={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};

export default LocalizacaoPage;
