const router = require('express').Router();
const auth = require('./auth');
const campaign = require('./campaign');
const question = require('./question');
const room = require('./room');
const user = require('./user');

router.use('/auth', auth);
router.use('/campaign', campaign);
router.use('/question', question);
router.use('/room', room);
router.use('/user', user);
module.exports = router;
