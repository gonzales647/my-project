const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require("../../middleware/auth")

//USer Model
const User = require('../../models/User');

//@route get api/users
router.get('/', (req, res) => {
  User.find()
      .sort()
      .then(users => res.json(users));
});

// this is a route POST api/users from these files
// what this will do is Register the new user
// this is seen as public so you don't have to be logged in to see this page
router.post('/', (req, res) => {
  console.log(req.user)
  const { name, email, password, password2 } = req.body;

  const passwordAuth = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

  //Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }
   
  if(password !== password2) {
    return res.status(400).json({ msg: 'Passwords do not match'})
  }
  //see if password has num, letter and symbol
  if (!passwordAuth.test(password)) {
    return res.status(400).json({ msg: 'Password must be at least 8 characters and contain at least 1 number, and one of the following symbols $ @ # ! %' });
    }

 
  //Check for existing user
  User.findOne({ email })
    .then(user => {
      if (user) return res.status(400).json({ msg: 'User already exists' });

      const newUser = new User({
        name,
        email,
        password
      });

      // Create salt && hash
      bcrypt.genSalt(14, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser.save()
            .then(user => {

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
                console.log(user);

            });

        })
      })
    })
    .catch(err => console.log(err))
});

//Deleter USer Route
router.post('/delete/:id', auth, (req, res)=> {
  const id = req.params.id
  const password = req.body.confirmationPassword
  if(!password) return res.status(400).json({ msg: 'Password Left blank'})
  User.findById({_id: id}).then(user=>{
    bcrypt.compare(password, user.password).then(isMatch=> {
      if(!isMatch) return res.status(400).json({ msg: 'invalid Password'})
      User.findByIdAndRemove({_id: id}).then(user => {
        console.log(user)
        return res.status(200).json({msg: 'user deleted'})
      })
      
    })
  }).catch(err=> console.log(err))
})

//grabs routes for updates
router.use('/update', require('./update'))

//grabs the routes for services
router.use('/services', require('./services'))


module.exports = router;