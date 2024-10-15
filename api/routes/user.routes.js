import { Router } from "express";
import { UpdateUser, DeleteUser, SignOut, GetUsers } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router =Router()

router.put('/update/:userId', verifyUser, UpdateUser)
router.delete('/delete/:userId', verifyUser, DeleteUser)
router.post('/signout', SignOut)
router.get('/getusers', verifyUser, GetUsers)

export default router;