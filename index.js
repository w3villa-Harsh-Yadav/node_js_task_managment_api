require('dotenv').config();
const express = require('express');
const app = express();

const connectDb = require('./db/db');
const routes = require('./routes/routes')

const PORT = 3000 || process.env.PORT

app.use(express.json());
app.use('/api/v1',routes);

try {
    connectDb(process.env.MONGO_URI)
    app.listen(PORT,console.log(`Server is listening on the ${PORT}.`))
} catch (error) {
    console.log(error);
}

