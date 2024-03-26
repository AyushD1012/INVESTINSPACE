import express from "express";
import { google, signin, signout, signup ,forgotpassword, resetpassword} from "../controllers/auth.controller.js";

const router=express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout', signout);
router.post('/forgotpassword', forgotpassword);
router.post('/resetpassword/:id/:token', resetpassword);

export default router;