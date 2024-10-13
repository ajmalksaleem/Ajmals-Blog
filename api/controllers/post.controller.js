import Post from "../models/post.model.js"
import { errorHandler } from "../utils/error.js"

export const CreatePost = async(req,res,next)=>{
    if(req.user.id !== req.body.userId) return next(errorHandler(401,'You are not Authenticated'))
if(!req.user.isAdmin) return next(errorHandler(403,'Only admin can create post'))
    if(!req.body.title || !req.body.content){
        return next(errorHandler(400,'Please provide all the fields'))
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '')
    const newPost = new Post({
        ...req.body, slug, userId: req.user.id
    })
    try {
        const savePost = await newPost.save();
        res.status(201).json(savePost)
    } catch (error) {
        next(error)
    }
}