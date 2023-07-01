const taskModel = require('../models/task_model')
const logger = require('../helpers/logger')


const addTask = async (req, res) => {
    try {
        let user = req.user;
        const { taskname, description } = req.body;
        const Task = {
            taskname:taskname,
            description:description,
            user_id: user._id
        }

        const task = await taskModel.create(Task);

        if(!task){
            logger.error(`Status Code: ${400} - Some error occured while creating the task - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                staus:false,
                msg:'Some error occured while creating the task'
            })
        }

        logger.info(`Status Code: ${201} - Task created successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);

        return res.json({
            status:true,
            msg:'Task created succesfully',
            task:task
        })

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

        let { id } = req.params;

        let task = await taskModel.findOne({_id:id})

        if(!task){
            logger.error(`Status Code: ${400} - No task found with this id - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'No task found with this id'
            })
        }

        return res.json({
            status:true,
            task:task,
        })


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
        let tasks = await taskModel.find({user_id:user._id});

        if(tasks.length == 0){
            logger.error(`Status Code - ${404} - No Tasks found associated with this user - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(404).json({
                status:false,
                msg: 'No Tasks found associated with this user'
            })
        }
        return res.json({
            status:true,
            tasks:tasks
        })

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
        const { taskname, description } = req.body;
        const { id } = req.params;

        const Task = {
            taskname:taskname,
            description:description
        }

        let updated_task = await taskModel.findOneAndUpdate({_id:id}, Task, {new: true});

        if(!updated_task){
            logger.error(`Status Code: ${400} - Task could not be updated - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status: false,
                msg:'Task could not be updated'
            })
        }

        return res.json({
            status:true,
            task:updated_task
        })

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
        let { id } = req.params;
        let task = await taskModel.findOneAndDelete({_id:id})

        if(!task){
            logger.error(`Status Code: ${400} - Task could not be deleted - ${req.originalUrl} - ${req.method} - ${req.ip}`);
            return res.status(400).json({
                status:false,
                msg:'Task could not be deleted'
            })
        }
        logger.info(`Status Code: ${200} - Task deleted successfully - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return res.json({
            status:true,
            msg:'User deleted succesfully'
        })

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
