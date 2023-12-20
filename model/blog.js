const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    body:{
        type: String,
        require: true
    },
    coverImageURL:{
        type: String
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'user'  //ye created by jo hai na vo users ki taraf point karega
    }
} , {timestamps: true});

const Blog = mongoose.model('blog' , blogSchema);

module.exports = Blog;