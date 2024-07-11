const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
});

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
