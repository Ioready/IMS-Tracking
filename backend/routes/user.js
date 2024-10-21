import express from 'express'
import { SignIn, getUserById, signUp } from '../controllers/userController.js'
import userAuth from '../middleware/userAuth.js'

const router = express.Router()


router.post('/get-user-by-id', userAuth, getUserById)
router.post('/signUp', signUp)
router.post('/signIn', SignIn)


export default router