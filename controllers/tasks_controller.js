const taskModel = require('../models/task_model')
const logger = require('../logger')


const addTask = async (req, res) => {
    try {
        let user = req.user;

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
};

const getTask = async (req, res) => {
    try {
        let user = req.user;

    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
};

const getAllTask = async(req,res) => {
    try {
        let user = req.user;
    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
}

const editTask = async (req, res) => {
    try {
        let user = req.user;


    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
};

const deleteTask = async (req, res) => {
    try {
        let user = req.user;


    } catch (error) {
        res.status(500).json({
            status:false,
            msg:'Some internal error occured'
        });
        logger.error(`Status Code: ${error.status || 500} - ${res.statusMessage} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }
};


module.exports = {
  getTask,
  getAllTask,
  addTask,
  editTask,
  deleteTask,
};
