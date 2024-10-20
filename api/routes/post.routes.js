import {Router} from 'express'
import { verifyUser } from '../utils/verifyUser.js'
import { CreatePost, getPosts, DeletePost, UpdatePost } from '../controllers/post.controller.js'


const router = Router()

router.post('/create', verifyUser, CreatePost) 
router.delete('/deletepost/:postId/:userId',verifyUser, DeletePost) 
router.put('/updatepost/:postId/:userId',verifyUser, UpdatePost) 
router.get ('/getPosts', getPosts)

export default router;