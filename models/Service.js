const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Schema for the service api

const ServiceSchema = new Schema({
    service: {
        type: String

    },
    description: {
        type: String

    },
    user_id: {
        type: String,
        required: true
    }

})

module.exports=Service=mongoose.model("Service", ServiceSchema);