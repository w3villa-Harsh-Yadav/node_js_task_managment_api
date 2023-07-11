const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = require('../models/user_model')
const { sendMail } = require("../helpers/sendmail");
const logger = require('../helpers/logger')

const registerUser = async(req,res) => {
    try {
        const { name, email, password, phonenumber } = req.body;

        if(!name || !email || !password || !phonenumber){
            logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }

        let user = await userModel.find({email:email});

        if(user.length != 0){
            logger.error(`Status Code: ${409} - User already exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(409).json({
                status:false,
                msg:'User already exist'
            })
        }

        let hash_password = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const token = jwt.sign({name:name,email:email},process.env.SECRET_KEY);

        user = await userModel.create({
            name:name,
            email:email,
            password:hash_password,
            phonenumber:phonenumber
        })

        logger.info(`Status Code: ${201} - User created successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.status(201).json({
            status:true,
            msg:'User created successfully',
            user: user,
            token:token
        })

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const loginUser = async(req,res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Please provide all the details'
            });
        }

        let user = await userModel.find({email:email});

        if(user.length == 0){
            logger.error(`Status Code: ${409} - User does not exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(409).json({
                status:false,
                msg:'User does not exist'
            })
        }

        let verified = await bcrypt.compare(password, user[0].password);

        if(!verified){
            logger.error(`Status Code: ${403} - Invalid credentials - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(403).json({
                status:false,
                msg: 'Invalid credentials.'
            })
        }

        const token = jwt.sign({name:user[0].name,email:user[0].email},process.env.SECRET_KEY);

        logger.info(`Status Code: ${200} - Logged In successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg:'Logged In successfully',
            user: user,
            token: token
        })
    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const forgotpassword = async(req,res) =>{

    try {
        const { email } = req.body;

        if(!email){
            logger.error(`Status Code: ${400} - Please provide Email. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Please provide email'
            });
        }

        let user = await userModel.findOne({email:email});

        if(!user){
            logger.error(`Status Code: ${409} - User does not exist - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(409).json({
                status:false,
                msg:'User does not exist'
            })
        }

        let randomString = await sendMail(user);
        const token = jwt.sign({name:user.name,email:user.email},process.env.SECRET_KEY,
            { expiresIn: 10 * 60 });

        if(!randomString){
            logger.error(`Status Code: ${500} - Mail could not be sent - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(500).json({
                status:false,
                msg:'Mail could not be sent.'
            })
        }

        let hash_password = await bcrypt.hash(randomString, parseInt(process.env.SALT_ROUNDS));
        user.otp = hash_password;
        await user.save();

        logger.info(`Status Code: ${200} - Mail sent to your mail address - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg: 'Mail sent to your mail address',
            otp:randomString,
            token:token
        })

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

}

const updatepassword = async(req,res) => {
    try {
        const { updated_password, otp } = req.body;
        const { token } = req.params;

        // if( !updated_password || !otp ){
        //     logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        //     return res.status(400).json({
        //         status:false,
        //         msg:'Please provide all details'
        //     });
        // }

        let user = jwt.verify(token, process.env.SECRET_KEY);

        user = await userModel.findOne({email: user.email});

        if(!user){
            logger.error(`Status Code: ${404} - User not found - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(404).json({
                status:false,
                msg:'User not found'
            })
        }
        const verified = await bcrypt.compare(otp,user.otp);

        if(!verified){
            logger.error(`Status Code: ${403} - Otp not verified - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(403).json({
                status:false,
                msg:'Otp not verified'
            })
        }

        let hash_password = await bcrypt.hash(updated_password, parseInt(process.env.SALT_ROUNDS));
        user.password = hash_password;
        user.otp = "";
        await user.save();

        logger.info(`Status Code: ${200} - Password updated succesfullly - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg:'Password updated succesfullly'
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const getUser = async(req,res) => {
    try {

        let user = req.user;
        logger.info(`Status Code: ${200} - Found User - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.json({
            status:true,
            user:user
        })

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

}

const updateUser = async(req,res) => {
    try {
        let { email, name, phonenumber } = req.body;

        // if(!email || !name || !phonenumber){
        //     logger.error(`Status Code: ${400} - Please provide all the details. - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        //     return res.status(400).json({
        //         status:false,
        //         msg:'Please provide all the details'
        //     });
        // }


        const temp_user = {
            email:email,
            name:name,
            phonenumber:phonenumber
        }
        let user = req.user;

        user = await userModel.findOneAndUpdate({email: user.email}, temp_user ,{new: true})

        if(!user){
            logger.error(`Status Code: ${400} - Could not update user - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg: 'Some error occured while updating user',
            });
        }

        const token = jwt.sign({name:user.name,email:user.email},process.env.SECRET_KEY);
        logger.info(`Status Code: ${200} - User updated successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.json({
            status:true,
            msg: 'User updated succesfully',
            user:user,
            token:token,
        })

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

}

const deleteUser = async(req,res) => {
    try {
        let user = req.user;
        let deleted_user = await userModel.findOneAndDelete({ email:user.email });

        if(!deleted_user){
            logger.error(`Status Code: ${400} - User could not be deleted - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg: 'User could not be deleted',
            });
        }

        logger.info(`Status Code: ${200} - User deleted successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg:'User deleted succesfully',
            user: deleted_user
        })

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}


module.exports = {
    registerUser,
    loginUser,
    forgotpassword,
    updatepassword,
    getUser,
    updateUser,
    deleteUser,
}
