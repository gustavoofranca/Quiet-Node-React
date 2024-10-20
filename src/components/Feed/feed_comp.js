import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './feed_comp.css'; 

const Feed = () => {
  const [images, setImages] = useState([]);
  const [displayedImages, setDisplayedImages] = useState(new Set());

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Pega imagens aleatórias da API
        const response = await axios.get('http://localhost:5000/random-images');
        const newImages = response.data.images;

        // Filtra as novas imagens para não repetir as já exibidas
        const filteredImages = newImages.filter(image => !displayedImages.has(image));

        // Atualiza o estado das imagens exibidas
        if (filteredImages.length > 0) {
          setImages(prevImages => [...prevImages, ...filteredImages]);
          const newDisplayedImages = new Set(displayedImages);
          filteredImages.forEach(image => newDisplayedImages.add(image));
          setDisplayedImages(newDisplayedImages);
        } else {
          console.log('Todas as imagens já foram exibidas.');
        }
      } catch (error) {
        console.error('Erro ao buscar imagens:', error);
      }
    };

    fetchImages();
  }, []); 

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {images.map((image, index) => (
          <div className="imagem" key={index}>
            <img src={image} alt="Random" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feed;
