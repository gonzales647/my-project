

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../../middleware/auth");

// password regex to ensure the password contains specific criteria
const passwordAuth = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;

////  Update User Name
router.post("/name", auth, (req, res) => {
  const { id, newName } = req.body;
  if (!newName) return res.status(400).json({ msg: "Please Fill out field" });

  User.findById({ _id: id })
    .then((user) => {
      user.name = newName;
      user.save().then((user) => {
        jwt.sign(
          { id: user.id },
          config.get("jwtSecret"),
          { expiresIn: 3600 },
          (err, token) => {
            if (err) throw err;
            res.json({
              token,
              user: {
                id: user.id,
                name: user.name,
                email: user.email,
              },
            });
          }
        );
      });
    })
    .catch((err) => console.log(err));
});

// Update User Email 
router.post("/email", auth, (req, res) => {
  const { id, newEmail } = req.body;
  if (!newEmail) return res.status(400).json({ msg: "Please fill out all fields" });

  User.findOne({ email: newEmail })
    .then((user) => {
      if (user) return res.status(400).json({ msg: "ITs Taken" });

      User.findById({ _id: id }).then((user) => {
        user.email = newEmail;
        user.save().then((user) => {
          jwt.sign(
            { id: user.id },
            config.get("jwtSecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                },
              });
            }
          );
        });
      });
    })
    .catch((err) => console.log(err));
});

// UPdate User Password
router.post('/password', auth, (req, res) => {
  const { id, oldPassword, newPassword, newPassword2 } = req.body;
  const passwordAuth = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/g;
  if(!oldPassword || !newPassword || !newPassword2) return res.status(400).json({ msg: 'Please fill out all fields'})
  if(newPassword !== newPassword2) return res.status(400).json({ msg: 'Passwords Do Not Match'})
  if(!passwordAuth.test(newPassword))return res.status(400).json({ msg: 'Password must contain at least 8 characters and have at least 1 number and 1 uppercase and 1 of the following symbols ! @ # $ % '})
  User.findById({_id: id }).then((user) => {
    bcrypt.compare(oldPassword, user.password).then(isMatch=> {
      if(!isMatch) return res.status(400).json({ msg: 'Invalid password'})
      bcrypt.genSalt(14, (err, salt) => {
        bcrypt.hash(newPassword, salt, (err, hash)=> {
          if(err) throw err
          user.password = hash
          user.save().then(user => {
            jwt.sign(
              {id: user.id},
              config.get('jwtSecret'), {expiresIn: 3600},(err, token)=> { 
                if(err) throw err; res.json({
                  token, user: {
                    id: user.id, name: user.name, email: user.email
                  }
                })
              }
            )
          })
        })
      })
    })
  })
  .catch((err) => console.log(err));
})

module.exports = router;
