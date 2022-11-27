const {AppError} = require('../../common/errors/AppError');
const Campaign = require('../../models/campaignModel');
module.exports = {
    getAllCampaign: async () => {
        try{
            const all = await Campaign.find().populate("userID","name");
            return {
                statusCode: 200,
                message: "All campaign found successfully",
                all
            };
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    addCampaign: async (userID,body) => {
        try{
            await Campaign.create({
                userID,
                ...body
            })
            return {
                statusCode: 200,
                message: "Campaign added successfuly"
            }
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    joinCampaign: async (userID,{campaignID}) => {
        try{
            let campaign = await Campaign.findById(campaignID);
            if(userID.toString() !== campaign.userID.toString()){
                if(campaign.users.filter(user => user.toString() == userID.toString()).length >0){
                    throw new AppError(409,'User already joined the campaign');
                }
                    campaign.users.push(userID);
                    await campaign.save();
                    return {
                        statusCode: 200,
                        message: "User successfully joined the campaign"
                        }
                }else{  
                    throw new AppError(409,'User is the creator of the campaign')
                }
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    patchCampaign: async (userID,campaignID,body) => {
        try{
            let campaign = await Campaign.findById(campaignID);
            if(userID.toString() !== campaign.userID.toString()){
                throw new AppError(409,"Unallowed");
            }
            Object.assign(campaign,body);
            await campaign.save();
            return {
                statusCode: 200,
                message: "Campaign successfully updated"
            }            
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    getCampaignByUserID: async (userID) => {
        try{
            const campaign = await Campaign.find({userID: userID.toString()})
            return {
                statusCode: 200,
                message: "campaign successfully found",
                campaign
            }
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    getAllUserByCampaignID: async (campaignID) => {
        try{
            const campaign = await Campaign.findById(campaignID).populate("users","name avatar");
            const users = campaign.users;
            return{
                statusCode: 200,
                message: "Users succesfully found",
                users
            }
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    },
    removeUserFromCampaign: async (userID,campaignID) => {
        try{
            let campaign = await Campaign.findById(campaignID);
            let userFilter = campaign.users.filter(ID => ID.toString() !== userID);    
            console.log(campaign.users[0]);  
            campaign.users=userFilter;
            await campaign.save();      
            return{
                statusCode: 200,
                message: "User removed successfully"
            }
        }catch(error){
            throw new AppError(error.statusCode,error.message);
        }
    }
}

