const express = require("express");
const userRouter = express.Router();
const auth = require("../middlewares/auth");
const Order = require("../models/order");
const Wallets = require("../models/wallet");
const Tasks = require("../models/task");
const Transactions = require('../models/transaction');
const { Product } = require("../models/product");
const User = require("../models/user");

userRouter.post("/api/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    if (user.cart.length == 0) {
      user.cart.push({ product, quantity: 1 });
    } else {
        // check if product in cart if so increase quantity
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }

      if (isProductFound) {
        // find is basically loop through the array and find the product
        let producttt = user.cart.find((productt) =>
          productt.product._id.equals(product._id)
        );
        producttt.quantity += 1;
      } else {
        user.cart.push({ product, quantity: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.delete("/api/remove-from-cart/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);

    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quantity == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quantity -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// save user address
userRouter.post("/api/save-user-address", auth, async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findById(req.user);
    user.address = address;
    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// order product
userRouter.post("/api/order", auth, async (req, res) => {
  try {
    const { cart, totalPrice, address } = req.body;
    let products = [];

    for (let i = 0; i < cart.length; i++) {
      let product = await Product.findById(cart[i].product._id);
      if (product.quantity >= cart[i].quantity) {
        product.quantity -= cart[i].quantity;
        products.push({ product, quantity: cart[i].quantity });
        await product.save();
      } else {
        return res
          .status(400)
          .json({ msg: `${product.name} is out of stock!` });
      }
    }

    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();

    let order = new Order({
      products,
      totalPrice,
      address,
      userId: req.user,
      orderedAt: new Date().getTime(),
    });
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user's orders
userRouter.get("/api/orders/me", auth, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// get user's wallet
userRouter.get("/api/wallets/me", auth, async (req, res) => {
  try {

    let user = await User.findById(req.user);

    const wallet = await Wallets.find({ username: user.email });
    res.json(wallet);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user's TASK (u Add points) transaction
userRouter.get("/api/transaction/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);

    const transaction = await Transactions.find({ trnxSummary: user.email, purpose: 'transfer' });
    res.json(transaction);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user's exchange transaction
userRouter.get("/api/transaction/exchange/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);

    const transaction = await Transactions.find({ trnxSummary: user.email, purpose: 'exchange' });
    res.json(transaction);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



// get user's task (backlog)
userRouter.get("/api/tasks/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    const task = await Tasks.find({ assignmentUser: user.email, status: 'backlog'});
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user's task (inprogress)
userRouter.get("/api/tasks/inprogress/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    const task = await Tasks.find({ assignmentUser: user.email, status: 'inprogress'});
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// get user's task (done)
userRouter.get("/api/tasks/done/me", auth, async (req, res) => {
  try {
    let user = await User.findById(req.user);
    const task = await Tasks.find({ assignmentUser: user.email, status: 'done'});
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



module.exports = userRouter;