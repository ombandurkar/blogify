const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    blogId:{
        type: mongoose.Types.ObjectId,
        ref: 'blog'
    },
    //kis user ne comment daala hai and konse blog par daala hai, vo hume isse pata chal jaayega

    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'user'  //ye created by jo hai na vo users ki taraf point karega
    }
}, {timestamps: true})

const Comment = mongoose.model('comment' , commentSchema);

module.exports = Comment;