import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConnection';
import { collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useTheme } from '../../context/ThemeContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { PiChatCircleBold } from 'react-icons/pi';
import './feed_comp.css';
import PostModal from '../postModal/postModal';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const loadPosts = () => {
      const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
        let postList = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          postList.push({
            id: doc.id,
            owner: data.owner,
            profilePic: data.profilePic,
            description: data.description,
            image: data.image,
            likes: Array.isArray(data.likes) ? data.likes : [],
            comments: Array.isArray(data.comments) ? data.comments : [],
          });
        });
        setPosts(postList);
      });
      return () => unsubscribe();
    };

    loadPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!description.trim() || !image.trim()) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    try {
      await addDoc(collection(db, 'posts'), {
        owner: '@demon.rs3',
        profilePic: 'https://example.com/profile.jpg',
        description: description,
        image: image,
        likes: [],
        comments: [],
      });
      setDescription('');
      setImage('');
    } catch (error) {
      console.log('Erro ao adicionar o post:', error);
    }
  };

  const handleLike = async (postId, userId) => {
    const postRef = doc(db, 'posts', postId);
    const post = posts.find((p) => p.id === postId);

    if (Array.isArray(post.likes)) {
      if (post.likes.includes(userId)) {
        await updateDoc(postRef, {
          likes: arrayRemove(userId),
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
        });
      }
    } else {
      console.error("Likes não é um array:", post.likes);
    }
  };

  const openModal = (postId) => {
    const post = posts.find((p) => p.id === postId);
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };

  return (
    <div
      className="feed-main-container"
      style={{
        background: currentTheme.background,
        color: currentTheme.color,
      }}
    >
      <ul>
        {posts.map((value) => (
          <li
            className="feed-post-container"
            key={value.id}
            style={{
              background: currentTheme.cardBackground,
              color: currentTheme.cardColor,
            }}
          >
            <div className="post-user-info">
              <img className="post-img-perfil" src={value.profilePic} alt="Perfil" />
              <strong
                className="post-owner"
                style={{ color: currentTheme.highlightColor }}
              >
                {value.owner}
              </strong>
            </div>
            <div 
              className="post-image-container"
              style={{
                backgroundColor: currentTheme.name === 'light' ? '#ccc' : 'var(--background-alt)',
              }}
            >
              <img
                className="post-image"
                src={value.image}
                alt={value.owner}
                onClick={() => openModal(value.id)}
              />
            </div>
            <p className="post-description">
              <strong>{value.owner}</strong> {value.description}
            </p>
            <div className="post-actions">
              {value.likes.includes('currentUserId') ? (
                <FaHeart
                  onClick={() => handleLike(value.id, 'currentUserId')}
                  className="like-icon liked"
                />
              ) : (
                <FaRegHeart
                  onClick={() => handleLike(value.id, 'currentUserId')}
                  className="like-icon"
                />
              )}
              <span>{value.likes.length}</span>
              <PiChatCircleBold
                onClick={() => openModal(value.id)}
                className="comment-icon"
              />
              <span>{value.comments.length}</span>
            </div>
            <hr
              style={{
                borderColor: currentTheme.highlightColorLight,
              }}
            />
          </li>
        ))}
      </ul>

      {isModalOpen && selectedPost && (
        <PostModal
          post={selectedPost}
          isOpen={isModalOpen}
          closeModal={closeModal}
          currentUserName={"@demon.rs3"}
          currentUserImageUrl={"https://example.com/profile.jpg"}
        />
      )}
    </div>
  );
};

export default Feed;