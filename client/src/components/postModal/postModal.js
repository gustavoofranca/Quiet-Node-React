import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebaseConnection';
import { updateDoc, doc } from 'firebase/firestore';
import { MdClose } from 'react-icons/md';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import './postModal.css';

const PostModal = ({ post, isOpen, closeModal }) => {
  const [comments, setComments] = useState(post?.comments || []);
  const [newComment, setNewComment] = useState('');
  const [owner, setOwner] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const modalRef = useRef(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const storedUserData = JSON.parse(sessionStorage.getItem('userData'));
    if (storedUserData && storedUserData.username) {
      setOwner(storedUserData.username);
      setProfilePic(storedUserData.userImage);
    }
  }, []);

  const addComment = async () => {
    if (newComment.trim()) {
      const newCommentObj = {
        message: newComment,
        author: owner || 'Anônimo',
        authorImage: profilePic || 'default-image-url.jpg',
      };

      try {
        const updatedComments = [...comments, newCommentObj];
        await updateDoc(doc(db, 'posts', post.id), {
          comments: updatedComments,
        });
        setComments(updatedComments);
        setNewComment('');
      } catch (error) {
        console.error("Erro ao adicionar comentário:", error);
      }
    }
  };

  const deleteComment = async (commentToDelete) => {
    try {
      const updatedComments = comments.filter((comment) => comment !== commentToDelete);
      await updateDoc(doc(db, 'posts', post.id), {
        comments: updatedComments,
      });
      setComments(updatedComments);
    } catch (error) {
      console.error("Erro ao excluir comentário:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" style={{ background: currentTheme.overlayBackground }}>
      <div className="modal-content" ref={modalRef} style={{ background: currentTheme.background, color: currentTheme.color }}>
        <button className="close-btn" onClick={closeModal}>
          <MdClose size={30} />
        </button>

        <div className="post-image-container">
          <img src={post?.image} alt="Post" className="post-image" />
        </div>

        <h3 className="modal-title">{post?.owner}</h3>
        <div className="post-description">{post?.description}</div>

        <div className="comment-section">
          <h4>Comentários</h4>
          <div className="comments-list">
            {comments.map((comment, index) => (
              <div key={index} className="comment-item">
                <img src={comment.authorImage} alt={comment.author} className="comment-author-image" />
                <div className="comment-details">
                  <div className="comment-author">{comment.author}</div>
                  <p className="comment-message">{comment.message}</p>
                </div>
                <FaRegTrashAlt 
                  className="delete-comment-icon" 
                  onClick={() => deleteComment(comment)} 
                />
              </div>
            ))}
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Adicionar um comentário..."
            className="comment-input"
          />
          <button className="add-comment-btn" onClick={addComment}>
            Adicionar Comentário
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;