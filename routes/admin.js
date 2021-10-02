const express = require('express');
const router = express.Router();
const admin = require('../models/admin');
const bcrypt = require('bcryptjs');
const passport = require('passport');


//login page
router.get("/login", (req, res) => {
    res.render("Login");
})




//register page
router.get("/register", (req, res) => {
    res.render("register");
})

router.post('/register', (req, res) => {
    const {fname, lname, tripstart, email, password, password2} = req.body;
    let errors = [];
     
    //check filled required
    if( !fname|| !lname || !tripstart || !email || !password || !password2) {
        errors.push({msg: "please fill all the fields"});
    }

    //check password match 
    if(password !== password2) {
        errors.push({msg: "password does not match"})
    }
    
    //check password 6 character long
    if(password.length < 6){
        errors.push({msg: "passwords should have atleast 6 character"})
    }
    
    if(errors.length > 0 ){
        res.render('register',{
            errors,
            fname,
            lname,
            password,
            password2,
            tripstart
        });
    }else{
        //validation passed
        admin.findOne({ email: email })
        .then(user => {
            if(user) {
                 //user exists
                 errors.push({ msg: 'Email already exists'});
                 res.render('register',{
                    errors,
                    fname,
                    lname,
                    password,
                    password2,
                    tripstart
                });
            } else {
                const newadmin = new admin({
                    fname,
                    lname,
                    email,
                    password            
                });
               // hash password
               bcrypt.genSalt(10, (err, salt) =>
               bcrypt.hash(newadmin.password, salt, (err, hash) => {
                   if(err) throw err;
                   //set password 
                   newadmin.password = hash;
                   //save user
                   newadmin.save()
                   .then(admin => {
                       req.flash('success_msg', "you are now registered & can login")
                       res.redirect('/admin/Login');
                   })
                   .catch(err => console.log(err));
               }))
            }
           
        })
    }
});



//login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: 'admin/Login',
        failureFlash: true
    })(req, res, next);
});

//logout
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', ('you are logout'));
    res.redirect('/admin/Login')
})


//404 error
router.use((req, res) => {
    res.status(404).render('404', {title : '404'});
});


module.exports = router;