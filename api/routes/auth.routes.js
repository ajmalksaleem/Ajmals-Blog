import { Router } from "express";
import { signup , signin} from "../controllers/auth.controller.js";

const router = Router()

router.post('/sign-up', signup)
router.post('/sign-in', signin)

export default router