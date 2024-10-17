import { Router } from "express";
import {createComment, getComments,likeComments} from '../controllers/comment.controller.js'
import { verifyUser } from "../utils/verifyUser.js";

const router = Router()

router.post('/create',verifyUser, createComment)
router.get('/getcomments/:postId', getComments)
router.put('/likecomment/:commentId',verifyUser, likeComments)

export default router