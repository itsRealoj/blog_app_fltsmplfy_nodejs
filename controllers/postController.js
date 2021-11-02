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
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  })

  const createdPost = await post.save()
  res.status(201).json(createdPost)
})

const updatePost = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body

  const post = await Post.findById(req.params.id)

  if (post) {
    post.name = name
    post.price = price
    post.description = description
    post.image = image
    post.brand = brand
    post.category = category
    post.countInStock = countInStock

    const updatedPost = await post.save()
    res.json(updatedPost)
  } else {
    res.status(404)
    throw new Error('Post not found')
  }
})

const createPostReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const post = await Post.findById(req.params.id)

  if (post) {
    const alreadyReviewed = post.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Post already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    post.reviews.push(review)

    post.numReviews = post.reviews.length

    post.rating =
      post.reviews.reduce((acc, item) => item.rating + acc, 0) /
      post.reviews.length

    await post.save()
    res.status(201).json({ message: 'Review added' })
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
  createPostReview,
  getTopPosts,
}