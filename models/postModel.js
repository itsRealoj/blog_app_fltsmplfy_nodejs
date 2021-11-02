import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    unlikes: {
      type: Array,
      default: [],
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    unlikesCount: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: String,
      required: true,
    },
    postedAt: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model('Post', postSchema)

export default Post