import { Router } from "express";
import {createComment, getComments,likeComments, editComments} from '../controllers/comment.controller.js'
import { verifyUser } from "../utils/verifyUser.js";

const router = Router()

router.post('/create',verifyUser, createComment)
router.get('/getcomments/:postId', getComments)
router.put('/likecomment/:commentId',verifyUser, likeComments)
router.put('/editcomment/:commentId',verifyUser, editComments)

export default router