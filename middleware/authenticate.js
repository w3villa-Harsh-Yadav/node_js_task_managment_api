const jwt = require("jsonwebtoken");
const userModel = require('../models/user_model')
const logger = require('../logger')

const authenticate = async (req,res,next) => {
    try {
        let user;
        const token = req.get("token");
        if (!token) {
            logger.error(`Status Code: ${400} - User not identified. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg: 'User not identified',
            });
        }

        user = jwt.verify(token, process.env.SECRET_KEY);
        user = await userModel.findOne({email: user.email});
        if(!user){
            logger.error(`Status Code: ${400} - User not identified. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg: 'User not identified',
            });
        }
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Status Code: ${500} - User not identified. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(500).json({
            status: false,
            msg: 'User not identified',
        });
    }
};

module.exports = {
    authenticate,
}
