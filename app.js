const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
dotenv.config();


mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in routes

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const propertyRoutes = require('./routes/ownerPropertyRoute');

const feedbackRoutes = require('./routes/feedback')
const feedbackTenantRoutes = require('./routes/feedBacktoTenant')
const maintenanceRoutes = require('./routes/maintenance')
const rentbyCashRoutes = require('./routes/rentbyCash')
const uploadRoutes = require('./routes/uploadfile');
const rentbyCash = require('./models/rentbyCash');
const updateCreditData = require('./routes/updateCreditScore');




// // apiDocs
app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// middleware -
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// midd
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', propertyRoutes)
app.use('/api', feedbackRoutes)
app.use('/api', maintenanceRoutes)
app.use('/api', feedbackTenantRoutes)
app.use('/api',uploadRoutes)
app.use('/api',rentbyCashRoutes)
app.use('/api',updateCreditData)


const port = process.env.PORT || 8090;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
})
