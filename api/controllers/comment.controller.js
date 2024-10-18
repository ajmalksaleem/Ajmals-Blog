import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, userId, postId } = req.body;
    if (content.length < 1 || content.length > 200) return;
    if (req.user.id !== userId)
      return next(
        errorHandler(403, "You are not allowed to make this comment")
      );
    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();
    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const postComments = await Comment.find({ postId: req.params.postId })
      .populate({
        path: "userId",
        select: "username profilePicture isAdmin",
        options: { strictPopulate: false },
      })
      .sort({ createdAt: -1 });
    res.status(200).json(postComments);
  } catch (error) {
    next(error);
  }
};

export const likeComments = async (req, res, next) => {
  try {
    const comment = await Comment.findOne({_id: req.params.commentId});
    if (!comment) return next(errorHandler(404, "comment not found"));
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
        comment.numberOfLikes += 1
        comment.likes.push(req.user.id);
    } else {
        comment.numberOfLikes -= 1
        comment.likes.splice(userIndex,1);
    }
    await comment.save()
    res.status(201).json(comment)
  } catch (error) {
    next(error)
  }
};

export const editComments = async(req,res,next)=>{
    try {
        const comment = await Comment.findOne({_id: req.params.commentId});
        if (!comment) return next(errorHandler(404, "comment not found"));
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
              errorHandler(403, 'You are not allowed to edit this comment')
            );
          }
          const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,{
            content : req.body.content
          },{new:true})
          res.status(200).json(editedComment)
    } catch (error) {
        next(error)
    }
};

export const deleteComments = async(req,res,next)=>{
  try {
    const comment = await Comment.findOne({_id: req.params.commentId});
        if (!comment) return next(errorHandler(404, "comment not found"));
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(
              errorHandler(403, 'You are not allowed to edit this comment')
            );
          }
          const deletedComment = await Comment.findByIdAndDelete(req.params.commentId)
          res.status(200).json(deletedComment)
  } catch (error) {
    next(error)
  }
}