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
    await newComment.save()
    res.status(200).json(newComment)
  } catch (error) {
    next(error)
  }
};
