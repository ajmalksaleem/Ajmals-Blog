import { Router } from "express";
import { UpdateUser, DeleteUser, SignOut } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router =Router()

router.put('/update/:userId', verifyUser, UpdateUser)
router.delete('/delete/:userId', verifyUser, DeleteUser)
router.post('/signout', SignOut)

export default router;