const express = require('express');
const { verifyToken } = require('../../middleware/verifyToken');
const router = express.Router();
const campaignController = require('./campaign.controller');


router.get('/',campaignController.getAllCampaign);
router.patch('/:campaignID',verifyToken,campaignController.patchCampaign);
router.delete('/:campaignID',verifyToken,campaignController.removeUserFromCampaign);
router.get('/user/:campaignID',campaignController.getAllUserByCampaignID);
router.post('/',verifyToken,campaignController.addCampaign);
router.get('/:userID',campaignController.getCampaignByUserID);
router.post('/join',verifyToken,campaignController.joinCampaign);

module.exports = router;
