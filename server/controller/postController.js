import config from '../config.js';

const { db } = config;

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';

// ======= INÍCIO CRUD ===================================================================

export const createPost = async (req, res, next) => {
    try {
        const data = req.body;
        await addDoc(collection(db, 'posts'), data);
        res.status(200).send('Post criado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getPosts = async (req, res, next) => {
    try {
        const posts = await getDocs(collection(db, 'posts'));
        res.status(200).send(posts);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Coletar dados de um usuário específico
export const getPost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const post = await getDoc(doc(db, 'posts', id));
        if (post.exists()) {
            res.status(200).send(user.data());
        } else {
            res.status(404).send('Post não encontrado!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updatePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const post = doc(db, 'posts', id);
        await updateDoc(post, data);
        res.status(200).send('Post atualizado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const deletePost = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, 'posts', id));
        res.status(200).send('Post deletado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// ======= FIM CRUD =================================================================



