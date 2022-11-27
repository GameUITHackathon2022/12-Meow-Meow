const authService = require('./auth.service');

module.exports = {
    signUp: async (req,res,next) => {
        try {
            const DTO = await authService.signUp(req.body);
            res.status(200).json(DTO); 
        }catch(error){
            next(error);
        }
    },
    signIn: async (req,res,next) => {
        try{
            const DTO = await authService.signIn(req.body);
            res.cookie('token', DTO.token, {
                sameSite: 'none',
                secure: process.env.NODE_ENV === "development" ? false: true,
                httpOnly: true,
                maxAge: 3600000 * 24,
            });
            delete DTO.token;
            res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },    
    signOut: async (req, res, next) => {
        try{
            res.cookie('token', 'clear', {
                sameSite: 'none',
                secure: process.env.NODE_ENV === "development" ? false: true,
                httpOnly: true,
                maxAge: 0,
            });
            res.status(200).json({
                statusCode: 200,
                message: "Signed out successfully"
            });
        } catch(error){
            next(error);
        }
    },
    resetPassword: async (req, res ,next) => {
        try{
        const DTO = await authService.resetPassword(req.body);
        res.status(200).json(DTO);
        }catch(error){
            next(error);
        }
    },
    updatePassword: async (req,res,next) => {
        try {
            const DTO = await authService.updatePassword(req.user, req.body);
            res.cookie('token', DTO.token, {
                sameSite: 'none',
                secure: process.env.NODE_ENV === "development" ? false: true,
                httpOnly: true,
                maxAge: 3600000 * 24,
            });
            delete DTO.token;
            res.status(200).json(DTO);
        } catch (error) {
            next(error);
        }
    }
}