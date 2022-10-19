const express = require("express");
const transactionRouter = express.Router();
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

// controllers/transactions.js
const Transactions = require('../models/transaction');
// const db = require("../models");
// const Transactions = db.transactions;

const mongoose = require('mongoose');
const { v4 } = require('uuid');
const { creditAccount, debitAccount } = require( '../utils/transaction');


transactionRouter.post("/api/transaction/transfer", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { toUsername, fromUsername, amount, summary} = req.body;
        const reference = v4();
        if (!toUsername && !fromUsername && !amount && !summary) {
            return res.status(400).json({
                status: false,
                message: 'Please provide the following details: toUsername, fromUsername, amount, summary'
            })
        }

      const transferResult = await Promise.all([
        debitAccount(
          {amount, username:fromUsername, purpose:"transfer", reference, summary,
          trnxSummary: `TRFR TO: ${toUsername}`, session}),
        creditAccount(
          {amount, username:toUsername, purpose:"transfer", reference, summary,
          trnxSummary:`TRFR FROM: ${fromUsername}`, session})

          //. TRNX REF:${reference}
      ]);

      const failedTxns = transferResult.filter((result) => result.status !== true);
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message);
        await session.abortTransaction();
        return res.status(400).json({
            status: false,
            message: errors
        })
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        status: true,
        message: 'Transfer successful'
    })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            status: false,
            message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
        })
    }
});

// add Task points

transactionRouter.post("/api/transaction/addTask", admin, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { toUsername, amount, summary} = req.body;
        const reference = v4();
        if (!toUsername && !amount && !summary) {
            return res.status(400).json({
                status: false,
                message: 'Please provide the following details: toUsername, fromUsername, amount, summary'
            })
        }

      const transferResult = await Promise.all([
        // debitAccount(
        //   {amount, username:fromUsername, purpose:"transfer", reference, summary,
        //   trnxSummary: `TRFR TO: ${toUsername}`, session}),
        creditAccount(
          {amount, username:toUsername, purpose:"transfer", reference, summary,
          trnxSummary:`TRFR FROM: ${toUsername}`, session})

          //. TRNX REF:${reference}
      ]);

      const failedTxns = transferResult.filter((result) => result.status !== true);
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message);
        await session.abortTransaction();
        return res.status(400).json({
            status: false,
            message: errors
        })
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        status: true,
        message: 'Transfer successful'
    })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            status: false,
            message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
        })
    }
});

// buy products debit

transactionRouter.post("/api/transaction/buyProduct", auth, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { fromUsername, amount, summary} = req.body;
        const reference = v4();
        if (!fromUsername && !amount && !summary) {
            return res.status(400).json({
                status: false,
                message: 'Please provide the following details: toUsername, fromUsername, amount, summary'
            })
        }

      const transferResult = await Promise.all([
        debitAccount(
          {amount, username:fromUsername, purpose:"exchange", reference, summary,
          trnxSummary: fromUsername, session}),
          //. TRNX REF:${reference}
      ]);

      const failedTxns = transferResult.filter((result) => result.status !== true);
      if (failedTxns.length) {
        const errors = failedTxns.map(a => a.message);
        await session.abortTransaction();
        return res.status(400).json({
            status: false,
            message: errors
        })
      }

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        status: true,
        message: 'Exchange product successful'
    })
    } catch (err) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).json({
            status: false,
            message: `Unable to find perform transfer. Please try again. \n Error: ${err}`
        })
    }
});

module.exports = transactionRouter;