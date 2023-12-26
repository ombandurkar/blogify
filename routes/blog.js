const express = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../model/blog');
const Comment = require('../model/comments');
const { route } = require('./user');

const { createClient } = require('@supabase/supabase-js');
const { decode } = require('base64-arraybuffer')

const supabaseUrl = 'https://pvpskqebeutlbcvooobv.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy');
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy'); //find all the comments jaha blog id ye waala id hoga
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    });
})

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

router.post('/', upload.single('coverImage'), async (req, res) => {

    const { title, body } = req.body;

    // supabase function to store image
    // file gets upladoed on supabase=> URL to image -> coverimageURL

    const imageAsBase64 = fs.readFileSync(`./public/uploads/${req.file.filename}`, 'base64');

    const { data, error } = await supabase
        .storage
        .from('uploads')
        .upload(`public/${req.file.filename}`, decode(imageAsBase64), {
            contentType: 'image/png'
        })

    const publicURLToImage = supabase
        .storage
        .from('uploads')
        .getPublicUrl(`public/${req.file.filename}`);

    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        // coverImageURL: `/uploads/${req.file.filename}`
        coverImageURL: publicURLToImage.data.publicUrl
    })

    return res.redirect(`/blog/${blog._id}`);
})

module.exports = router;