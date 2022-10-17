// transactions.js
const mongoose =require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    trnxType: {
      type: String,
      required: true,
      enum: ['CR', 'DR']
    },
    purpose:{
      type: String,
      enum : ['deposit', 'transfer', 'reversal', 'withdrawal', 'exchange'],
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0.00
    },
    walletUsername: {
      type: String,
      ref: 'Wallets'
    },
    reference: { type: String, required: true },
    balanceBefore: {
      type: mongoose.Decimal128,
      required: true,
    },
    balanceAfter: {
      type: mongoose.Decimal128,
      required: true,
    },
    summary: { type: String, required: true },
    trnxSummary:{ type: String, required: true }
  },
  { timestamps: true }
);

const Transactions = mongoose.model('Transactions', transactionSchema);
module.exports = Transactions;