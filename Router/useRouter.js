import express from 'express'
import {  forgotPassword, goldrate, loginUser, registerUser, resetPassword } from '../Controller/userController.js'
import verifyUser from '../Middleware/authMiddleware.js'


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/goldrate', verifyUser, goldrate)
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword/:id/:token', resetPassword)
export default  router