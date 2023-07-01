require('dotenv').config();
const express = require('express');
const app = express();

const connectDb = require('./db/db');
const user_routes = require('./routes/user_routes');
const task_routes = require('./routes/task_routes');

const PORT = 3000 || process.env.PORT;

app.use(express.json());

app.use('/api/v1/user',user_routes);
app.use('/api/v1',task_routes);

app.use('*',(req,res)=>{
    res.status(404).json({
        status:false,
        msg: 'This is not a valid url'
    })
})

try {
    connectDb(process.env.MONGO_URI)
    app.listen(PORT,console.log(`Server is listening on the ${PORT}.`))
} catch (error) {
    console.log(error);
}
