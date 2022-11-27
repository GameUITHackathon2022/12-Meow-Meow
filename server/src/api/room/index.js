const router = require('express').Router();
const roomController = require('./room.controller');
const { verifyToken } = require('../../middleware/verifyToken');

router.get('/get/:roomID', roomController.getRoom);
router.post('/add', verifyToken, roomController.addRoom);
router.delete('/delete/:roomID', roomController.deleteRoom);
router.put('/join/:roomID/:socketID', roomController.joinRoom);
router.put('/leave/:roomID/:socketID', roomController.outRoom);
router.get('/get', roomController.getAllAvailableRooms);

module.exports = router;
