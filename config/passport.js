const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



//admin model
const admin = require('../models/admin');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match user
            admin.findOne({email: email})
                .then(admin => {
                    if(!admin){
                        return done(null, false, {message: 'that email is not registered'});
                    }

                    // match password
                    bcrypt.compare(password, admin.password, (err, isMatch) => {
                        if(err) throw err
                        
                        if(isMatch){
                            return done(null, admin)
                        }else{
                            return done(null, false, { message: 'password incorrect'});
                        }
                    });

                })
                .catch(err => console.log(err))
        })
    )
    passport.serializeUser((admin, done) => {
        done(null, admin.id);
      });
      
      passport.deserializeUser((id, done) => {
        admin.findById(id, (err, admin) => {
          done(err, admin);
        });
      });
}