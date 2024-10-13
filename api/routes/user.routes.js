import { Router } from "express";
import { UpdateUser, DeleteUser } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router =Router()

router.put('/update/:userId', verifyUser, UpdateUser)
router.delete('/delete/:userId', verifyUser, DeleteUser)

export default router;