const campaignService = require('./campaign.service');

module.exports = {
    getAllCampaign: async (req,res,next) => {
        try{
            const DTO = await campaignService.getAllCampaign();
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    addCampaign: async (req,res,next) => {
        try{
            const DTO = await campaignService.addCampaign(req.user.id,req.body);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    joinCampaign: async (req,res,next) => {
        try{
            const DTO = await campaignService.joinCampaign(req.user.id,req.body);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    patchCampaign: async (req,res,next) => {
        try{    
            const DTO = await campaignService.patchCampaign(req.user.id,req.params.campaignID,req.body);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    getCampaignByUserID: async (req,res,next) => {
        try{
            const DTO = await campaignService.getCampaignByUserID(req.params.userID);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    getAllUserByCampaignID: async (req,res,next) => {
        try{
            const DTO = await campaignService.getAllUserByCampaignID(req.params.campaignID);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    removeUserFromCampaign: async (req,res,next) =>{
        try{
            const DTO = await campaignService.removeUserFromCampaign(req.user.id,req.params.campaignID);
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    }
    
}