const mongoose = require("mongoose");


const walletSchema = mongoose.Schema({

  username: {
    type: String,
    required: true,
    trim: true,
  },

  name: {
    type: String,
    trim: true,
  },
  balance: {
    type: Number,
    required: true,
    default: 0,
  },
//   userId: {
//     required: true,
//     type: String,
//   },

});

const Wallets = mongoose.model("Wallets", walletSchema);
module.exports = Wallets;