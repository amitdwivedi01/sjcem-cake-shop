const express = require('express')
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const { urlencoded } = require('express');
const passport = require('passport');
const { ensureAuthenticated } = require ('./config/auth');

const order = require('./models/order');


//passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/key').MongoURI;
const { connect } = require('http2');

//mongoose connection
mongoose.connect(db).then(() => {
    console.log('MongoDB connected!!');
}).catch(err => {
    console.log('Failed to connect to MongoDB', err);
});


//Ejs initialization
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Serving Static files
app.use(express.static(path.join(__dirname, '/public'));

//body parser
app.use(express.urlencoded({extended: false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// global  variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');


    next();    
});



//routes
app.use('/admin', require('./routes/admin'));

app.get("/" , (req, res) => {
    res.render("index");
})

//dashboard page
app.get('/dashboard', ensureAuthenticated, (req,res) =>  
    res.render('dashboard', {
        fname: req.admin
    })
);

app.post('/order', (req, res) => {
    const {name, address, phone, order_date, order_time, kg, cake_flavour} = req.body
    const neworder = new order({
        name,
        address,
        phone,
        order_date,
        order_time,
        kg,
        cake_flavour
    }) 
    //save order
    neworder.save();
  
    console.log(neworder);
})




app.listen(process.env.PORT || 4000, () => {
    console.log(`server started at 8080`)
})