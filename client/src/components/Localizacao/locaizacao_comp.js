import React, { useState } from 'react';
import { db } from '../../firebaseConnection'; // Ajuste o caminho conforme necessário
import { collection, addDoc } from 'firebase/firestore';
import './localizacao_comp.css';

const LocalizacaoCom = () => {
  const [localizacao, setLocalizacao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddLocalizacao = async () => {
    if (!localizacao || !descricao) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'localizacoes'), {
        localizacao,
        descricao,
        timestamp: new Date(),
      });
      setLocalizacao('');
      setDescricao('');
      alert('Localização adicionada com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar localização: ', error);
      alert('Erro ao adicionar localização.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="localizacao-container">
      <h2>Adicionar Localização</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Localização"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="textarea"
        ></textarea>
        <button onClick={handleAddLocalizacao} disabled={loading} className="add-button">
          {loading ? 'Adicionando...' : 'Adicionar'}
        </button>
      </div>
    </div>
  );
};

export default LocalizacaoCom;
