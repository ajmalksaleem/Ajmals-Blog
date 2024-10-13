import {Router} from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { CreatePost } from '../controllers/post.controller.js'


const router = Router()

router.post('/create', verifyUser, CreatePost)

export default router;