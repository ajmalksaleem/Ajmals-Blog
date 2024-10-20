import { Router } from "express";
import {
  createComment,
  getPostComments,
  likeComments,
  editComments,
  deleteComments,
  getAllComments,
} from "../controllers/comment.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = Router();

router.get("/getcomments/:postId", getPostComments);
router.post("/create", verifyUser, createComment); //
router.put("/likecomment/:commentId", verifyUser, likeComments); //
router.put("/editcomment/:commentId", verifyUser, editComments); //
router.delete("/deletecomment/:commentId", verifyUser, deleteComments); //
router.get("/getallcomments", verifyUser, getAllComments);

export default router;
