const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
