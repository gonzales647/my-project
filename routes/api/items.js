const express = require('express'); // requiring express 
const router = express.Router();
const auth = require('../../middleware/auth');

//Item Model
const Item = require('../../models/Item');
const User = require('../../models/User');
const Service = require('../../models/Service');

// this will GEt  from the api/items folder/files
//  Get all items
//this is public view it can be seen without being logged in 
router.get('/', (req, res) => {
     console.log(req.user);

    Item.find()
     .sort({ date: -1 })
     .then(items => res.json(items))
});


// this route will POST from api/items
//this will Create an item


router.post('/', auth, (req, res) => {
  const newItem = new Item({
      name: req.body.name
  });

  User.findById(id, (err, user) => {
    if (err) throw err
    user.items.push(newItem)
  })

  newItem.save().then(item => res.json(item));
});

//this route will DELETE api/items:id
// this is how to DELETe a service requested by the user

router.delete('/:id', auth,  (req, res) => {
  console.log(req.user);
  Service.findById(req.params.id)
  .then(item => item.remove().then(() => res.json({success: true})))
  .catch(err => res.status(404).json({ success: false}));
  })
  

 

// exporting this api
module.exports = router;