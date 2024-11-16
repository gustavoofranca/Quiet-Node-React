import React, { useState, useEffect } from 'react';
import { db } from '../../firebaseConnection'; // Já tem a importação do Firestore
import { collection, query, getDocs } from 'firebase/firestore';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { auth } from '../../firebaseConnection';
import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore'; // Importações faltantes
import './feed_comp.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para pegar os posts do Firestore
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'posts')));
        const postsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsList);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar posts: ', error);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId, isLiked, likeCount) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return; // Verifica se o usuário está logado

    const postRef = doc(db, 'posts', postId); // Referência do post no Firestore

    try {
      if (isLiked) {
        // Remove o like
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
        });
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, likes: post.likes.filter(uid => uid !== currentUser.uid), likeCount: likeCount - 1 } : post
        ));
      } else {
        // Adiciona o like
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
        });
        setPosts(prevPosts => prevPosts.map(post => 
          post.id === postId ? { ...post, likes: [...post.likes, currentUser.uid], likeCount: likeCount + 1 } : post
        ));
      }
    } catch (error) {
      console.error('Erro ao atualizar like: ', error);
    }
  };

  return (
    <div className="feed-container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map(post => {
          const isLiked = post.likes && post.likes.includes(auth.currentUser?.uid);
          return (
            <div key={post.id} className="post">
              <div className="post-header">
                <img src={post.userImage} alt="User" className="user-image" />
                <div className="post-user-info">
                  <p className="username">{post.username}</p>
                </div>
              </div>
              <p className="post-content">{post.content}</p>

              <div className="post-actions">
                <button className="like-button" onClick={() => handleLike(post.id, isLiked, post.likeCount)}>
                  {isLiked ? (
                    <FaHeart className="liked-icon" />
                  ) : (
                    <FaRegHeart className="like-icon" />
                  )}
                </button>
                <span className="like-count">{post.likeCount} Likes</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Feed;

// Teste