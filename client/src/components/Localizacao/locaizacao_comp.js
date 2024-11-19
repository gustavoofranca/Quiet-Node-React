import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection';
import { doc, collection, addDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import './localizacao_comp.css';
import { TiPencil } from "react-icons/ti"; // Ícone de editar
import { FaRegTrashAlt } from "react-icons/fa"; // Ícone de excluir

const LocalizacaoCom = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [owner, setOwner] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [idLocation, setIdLocation] = useState('');

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUserData && storedUserData.username) {
      setOwner(storedUserData.username);
      setProfilePic(storedUserData.userImage);
    } else {
      console.log("Erro: Dados do usuário não encontrados no sessionStorage.");
    }

    const loadLocations = () => {
      const unsubscribe = onSnapshot(collection(db, 'locations'), (snapshot) => {
        let locationList = [];
        snapshot.forEach((doc) => {
          locationList.push({
            id: doc.id,
            owner: doc.data().owner,
            profilePic: doc.data().profilePic,
            description: doc.data().description,
            location: doc.data().location
          });
        });
        setLocation(locationList);
      });
      return () => unsubscribe();
    };

    loadLocations();
  }, []);


  async function addLocation() {
    if (!owner) {
      toast.error("Usuário não encontrado. Por favor, faça login novamente.", { className: 'toast-error' });
      return;
    }

    if (!description.trim() || !location.trim()) {
      toast.warn('Por favor, preencha todos os campos corretamente.', { className: 'toast-warn' });
      return;
    }

    if (idLocation) {
      editPost();
    } else {
      await addDoc(collection(db, 'locations'), {
        owner: owner,
        profilePic: profilePic,
        description: description,
        location: location
      })
        .then(() => {
          toast.success('Localização adicionada com sucesso!', { className: 'toast-success' });
          setDescription('');
          setLocation('');

        })
        .catch((error) => {
          console.log("Erro ao adicionar a localização:", error);
        });
    }
  }


  async function editLocation() {
    if (!idLocation) {
      toast.warn("Selecione uma localização para editar.", { className: 'toast-warn' });
      return;
    }
    const postEditado = doc(db, 'locations', idLocation);
    await updateDoc(locationEditada, {
      owner: owner,
      description: description,
      location: location
    })
      .then(() => {
        toast.success('Localização editada com sucesso!', { className: 'toast-success' });
        setIdLocation('');
        setDescription('');
        setLocation('');
      })
      .catch((error) => {
        console.log("Erro ao editar a localização:", error);
      });
  }


  async function deleteLocation(id) {
    const locationExcluida = doc(db, 'locations', id);
    await deleteDoc(locationExcluida)
      .then(() => {
        toast.success('Localização excluída com sucesso!', { className: 'toast-success' });
      })
      .catch((error) => {
        console.log("Erro ao excluir o localização:", error);
      });
  }



  return (
    <div className="localizacao-container">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12123.132269055335!2d-51.4708861398451!3d-25.3971511963151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ef362590126953%3A0x35c022aca26563e8!2sLagoa%20das%20L%C3%A1grimas!5e0!3m2!1spt-BR!2sbr!4v1732030457118!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      <h2>Adicionar Localização</h2>
      <div className="input-group">
        <input
          type="text"
          placeholder="Localização"
          value={location}
          onChange={(e) => setIdLocation(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="textarea"
        ></textarea>
        <button onClick={addLocation} className="add-button">
          'Adicionar'
        </button>
      </div>

      <div className="posts-container">
        {location.map((location) => (
          <div
            key={location.id}
            className="addpost-post-container"
            style={{
              background: currentTheme.cardBackground,
              color: currentTheme.cardColor,
            }}
          >
            <div className="post-image-container">
              <iframe src={location.location}
                width="600"
                height="450"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>

              <div className="post-buttons">
                <button onClick={() => loadPostForEdit(post)}>
                  <TiPencil />
                </button>
                <button onClick={() => deletePost(post.id)}>
                  <FaRegTrashAlt />
                </button>
              </div>
            </div>
            <div className="post-info2">
              <p className="post-description">{post.description}</p>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
};

export default LocalizacaoCom;
