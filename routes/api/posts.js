const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')

const User = require('../../models/Users')
const Posts = require('../../models/Posts')
const Profile = require('../../models/Profile')

// @route    POST   api/posts
// @desc     create a new post in database
// @access   private
router.post('/', 
  [
    auth, 
    check('text','text is required').not().isEmpty()
  ],
  async(req, res) => {
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    res.status(400).json({ errors: errors.array()})
  }

  try {
    const user = await User.findById(req.user.id).select('-password')

    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id 
    })

    const post = await newPost.save()
    res.json(post)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }

})


// @route    GET   api/posts
// @desc     get all posts
// @access   private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date:-1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    GET   api/posts/:id
// @desc     get post by post's id
// @access   private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(404).json({ msg:'post not found' })
    }

    res.json(post)
  } catch (err) {
    console.error(err.message)
    if(err.kind === 'objectId'){
      return res.status(404).json({ msg:'post not found' })
    }
    res.status(500).json({ msg:'server error' })
  }
})


// @route    DELETE   api/posts/:id
// @desc     delete post by post's id
// @access   private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if(!post){
      return res.status(404).json({ msg:'post not found' })
    }

    // if the user doesn't owns the post
    // req.user.id is a string, post.user is an objectID, we need to convert it to string
    if(post.user.toString() !== req.user.id){ 
      return res.status(401).json({ msg:'user not authorized' })
    }

    await post.remove() // delete the selected post
    res.json({ msg:'post deleted' })
  } catch (err) {
    console.error(err.message)
    if(err.kind === 'objectId'){
      return res.status(404).json({ msg:'post not found' })
    }
    res.status(500).json({ msg:'server error' })
  }
})


// @route    PUT   api/posts/like/:id
// @desc     like post by post's id
// @access   private
router.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post is already liked by this user
    if(post.likes.filter(item => item.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({ msg:'You have already liked this' })
    }

    // if it's not liked, put new userId into post.like array
    post.likes.unshift({ user: req.user.id })
    await post.save()

    // for later use in frontend
    res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})


// @route    PUT   api/posts/unlike/:id
// @desc     unlike post by post's id
// @access   private
router.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    // check if the post is already liked by this user
    if(post.likes.filter(item => item.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({ msg:'You have not liked this' })
    }

    // if it's liked, remove current user from post.likes ARRAY
    // first, find the INDEX to remove 
    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)
    await post.save()

    // for later use in frontend
    res.json(post.likes)

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ msg:'server error' })
  }
})

module.exports = router