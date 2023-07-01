const nodemailer = require('nodemailer');
const logger = require('./logger')


function generateRandomString(length) {
    try {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            randomString += characters.charAt(randomIndex);
        }

        return randomString;
    } catch (error) {
        logger.error(`Status Code: ${error.status || 500} - ${error.message} - Some error occured in generateRandomString() in sendmail.js file.`);
        return null;
    }
}

const sendMail = async(user)=>{
    try {
        let mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        });

        const randomString = generateRandomString(7);

        if(!randomString){
            return null;
        }

        let mailDetails = {
            from: process.env.MAIL_USERNAME,
            to: user.email,
            subject: 'Access Credentials',
            text: `Your one time password for updating the password is: ${randomString}`
        };

        let res = await mailTransporter.sendMail(mailDetails);

        if(!res){
            return null;
        }

        return randomString;

    } catch (error) {
        logger.error(`Status Code: ${error.status || 500} - ${error.message} - Some error occured in generateRandomString() in sendmail.js file.`);
        return null;
    }
}

module.exports = {
    sendMail,
}
