if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const PORT = process.env.PORT;
const MONGOURI = process.env.MONGOURI;

const helmet = require('helmet');





//initialize express into a variable
const app = express();
// use security helmet. 
app.use(helmet());
app.use(helmet.hidePoweredBy({setTo:'PHP 4.2.0'}));

// bodyParser middleware
// app.use(bodyParser.json());

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//db config
const db = config.get('mongoURI');

//connect to MONGO
mongoose
.connect(process.env.DATABASE_URI || MONGOURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));

// USe routes
app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

//////////////
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/index.html`)
});

////////////

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`We are plugged into ${port}`));