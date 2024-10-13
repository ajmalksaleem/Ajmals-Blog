import {Router} from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { CreatePost, getPosts } from '../controllers/post.controller.js'


const router = Router()

router.post('/create', verifyUser, CreatePost)
router.get ('/getPosts', getPosts)

export default router;