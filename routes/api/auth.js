const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth')


//USer Model
const User = require('../../models/User');

// this POST api/auth for the .get
// this will Authenticate user

router.post('/', (req, res) => {
  const { email, password } = req.body;

  //Simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  //Checking to see if user already exists
  User.findOne({ email })
    .then(user => {
      if (!user) return res.status(400).json({ msg: 'You Don\'t Have an account' });

        
      //this is how you validate the password
      bcrypt.compare(password, user.password)
      .then(isMatch => {
          if(!isMatch) return res.status(400).json({ msg: 'Wrong Password Jerk' })
      
          jwt.sign(
            { id: user.id },//payload
            config.get('jwtSecret'),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          )
      
        })

     
    }).catch(err=>console.log(err))
});

// this route is how to GET api/auth/user
// this is how to GET user data

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
    .select('-password')
    .then(user => res.json('user'));
});


///this is exporting this file to make it available for use
module.exports = router;