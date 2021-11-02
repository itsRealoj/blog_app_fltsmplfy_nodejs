import asyncHandler from 'express-async-handler'
import Post from '../models/postModel.js'

const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const count = await Post.countDocuments({ ...keyword })
  const posts = await Post.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ posts, page, pages: Math.ceil(count / pageSize) })
})

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    res.json(post)
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)

  if (post) {
    await post.remove()
    res.json({ message: 'Post removed' })
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

const createPost = asyncHandler(async (req, res) => {
  const post = new Post({
    name: 'Sample post',
    postedBy: req.user._id,
    likes: [],
    unlikes: [],
    unlikesCount: 0,
    likesCount: 0,
  })

  const createdPost = await post.save()
  res.status(201).json(createdPost)
})

const updatePost = asyncHandler(async (req, res) => {
  const {
    name,
    likes,
    likesCount,
    unlikes,
    unlikesCount,
    postedBy,
  } = req.body

  const post = await Post.findById(req.params.id)

  if (post) {
    post.name = name
    post.likes = likes
    post.likesCount = likesCount
    post.unlikes = unlikes
    post.unlikesCount = unlikesCount
    post.postedBy = postedBy

    const updatedPost = await post.save()
    res.json(updatedPost)
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

const likePost = asyncHandler(async (req, res) => {
if(!req.user) {
    res.status(401)
    throw new Error('You are not logged in, log in first to proceed!')
}

  const post = await Post.findById(req.params.id)

  if (post) {
    post.likes.push(req.user._id)
    post.likesCount = post.likesCount += 1
    
    await post.save()
    res.status(201).json({ message: 'Kudos! You liked the post.' })
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

const unlikePost = asyncHandler(async (req, res) => {
    console.log('user: ', req.user._id)
    
      const post = await Post.findById(req.params.id)
    
      if (post) {
          let likesList = post.likes
          let userId = req.user._id
          let likerIndex = likesList.indexOf(userId)
          if(likerIndex > -1) {
            likesList.splice(likerIndex, 1)
          }
        post.likes = likesList
        post.likesCount = post.likesCount -= 1
        post.unlikesCount = post.unlikesCount += 1
        
        await post.save()
        res.status(201).json({ message: 'You unliked the post!' })
      } else {
        res.status(404)
        throw new Error('Post not found')
      }
    })
    
    
    const commentPost = asyncHandler(async (req, res) => {
        const { comment } = req.body
        console.log('comment: ', comment)
        const post = await Post.findById(req.params.id)
        
        if (post) {
          post.comments = [...post.comments, {comment, userId: req.user._id}]

          await post.save()
          res.status(201).json({ message: 'Kudos! You commented on this post.' })
        } else {
          res.status(404)
          throw new Error('Post not found')
        }
    })


const getTopPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({}).sort({ rating: -1 }).limit(3)

  res.json(posts)
})

export {
  getPosts,
  getPostById,
  deletePost,
  createPost,
  updatePost,
  likePost,
  unlikePost,
  getTopPosts,
  commentPost,
}