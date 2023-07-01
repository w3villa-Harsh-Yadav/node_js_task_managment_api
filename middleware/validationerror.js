const { validationResult } = require('express-validator');
const logger = require('../helpers/logger')

const checkValidation = async(req,res,next) => {
    try {
        const result = validationResult(req);
        if (result.errors.length != 0) {
            logger.error(`Status Code: ${400} - ${result.array()} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                errors: result.array()
            })
        }
        next();
    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        })
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

module.exports ={
    checkValidation,
}
