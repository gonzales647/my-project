const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const config = require("config");
const auth = require("../../middleware/auth");
const Service = require("../../models/Service");

// this allows me to get the data from the submit request services form on the dashboard
//api/users/services this is the route i use for this api

router.post("/newService", auth, (req, res) => {
    const{service, description, user_id} = req.body //destructuring the req.body
    if(!user_id)
    return res.status(400).json({ msg: 'error processing your request'})
    const newService = new Service({service, description, user_id})
    newService.save()
    .then(x=> res.json(x))
    .catch(err => console.log(err));

});

router.get('/getservices/:id', (req, res) => {
    const id = req.params.id

    Service.find({ user_id: id})
        .then(x => {
            return res.json(x)
        })
})

//export api

module.exports = router;
