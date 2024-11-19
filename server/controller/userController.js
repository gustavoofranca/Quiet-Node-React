import { firebaseapp } from "../firebase";

import {
    getFirestore, collection, doc, addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';

const db = getFirestore(firebaseapp);


// ======= INÍCIO CRUD ===================================================================

export const createUser = async (req, res, next) => {
    try {
        const data = req.body;
        await addDoc(collection(db, 'users'), data);
        res.status(200).send('Usuário criado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const users = await getDocs(collection(db, 'users'));
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// Coletar dados de um usuário específico
export const getUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const user = await getDoc(doc(db, 'users', id));
        if (user.exists()) {
            res.status(200).send(user.data());
        } else {
            res.status(404).send('Usuário não encontrado!');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const user = doc(db, 'users', id);
        await updateDoc(user, data);
        res.status(200).send('Usuário atualizado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await deleteDoc(doc(db, 'users', id));
        res.status(200).send('Usuário deletado com sucesso!');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// ======= FIM CRUD =================================================================



