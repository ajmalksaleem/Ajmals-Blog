import { Router } from "express";
import { UpdateUser, DeleteUser, SignOut, GetUsers, CheckDuplicate, CheckUpdateDuplicate } from "../controllers/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router =Router()

router.put('/update/:userId', verifyUser, UpdateUser) //
router.delete('/delete/:userId', verifyUser, DeleteUser) //
router.get('/getusers', verifyUser, GetUsers) //
router.post('/signout', SignOut)
router.post('/checkduplicate',  CheckDuplicate)
router.post('/checkupdateduplicate', verifyUser, CheckUpdateDuplicate)

export default router;