const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const {verifyToken} = require('../../middleware/verifyToken')

router.post('/sign-in', authController.signIn);

router.post('/sign-up', authController.signUp);

router.get('/sign-out', authController.signOut);

// router.post('/forget-password', authController.forgetPassword); 

router.post('/reset-password', authController.resetPassword);

router.post('/update-password', verifyToken, authController.updatePassword);
module.exports = router;