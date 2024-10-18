import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const CreatePost = async (req, res, next) => {
  if (req.user.id !== req.body.userId)
    return next(errorHandler(401, "You are not Authenticated"));
  if (!req.user.isAdmin)
    return next(errorHandler(403, "Only admin can create post"));
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all the fields"));
  }
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query?.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // without spread it will be like {userId : 4838} i,e with curly braces
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    res.status(200).json({ posts, totalPosts, lastMonthPosts });
  } catch (error) {
    next(error);
  }
};

export const DeletePost = async (req, res, next) => {
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(403, 'You are not allowed to delete this post'))
  }
  try {
   await Post.findByIdAndDelete(req.params.postId );
    res.status(200).json("post deleted");
  } catch (error) {
    next(error)
  }
};

export const UpdatePost = async(req,res,next)=>{
  if(!req.user.isAdmin || req.user.id !== req.params.userId){
    return next(errorHandler(403, 'You are not allowed to update this post'))
  }
  try {
    const UpdatePost = await Post.findByIdAndUpdate(req.params.postId,{
      $set:{
        title : req.body.title,
        category : req.body.category,
        image : req.body.image,
        content : req.body.content
      }
    },{new:true})
    res.status(200).json(UpdatePost);
  } catch (error) {
    next(error)
  }
}