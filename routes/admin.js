const express = require("express");
const adminRouter = express.Router();
const admin = require("../middlewares/admin");
const { Product } = require("../models/product");
const Order = require("../models/order");
const Tasks = require("../models/task");
const { PromiseProvider } = require("mongoose");

// Add product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
  try {
    const { name, description, images, quantity, price, category } = req.body;
    let product = new Product({
      name,
      description,
      images,
      quantity,
      price,
      category,
    });
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all your products
adminRouter.get("/admin/get-products", admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete the product
adminRouter.post("/admin/delete-product", admin, async (req, res) => {
  try {
    const { id } = req.body;
    let product = await Product.findByIdAndDelete(id);
    res.json(product);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/get-orders", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    res.json(orders);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.json(order);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//approved task
adminRouter.post("/admin/change-task-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let task = await Tasks.findById(id);
    task.status = status;
    task = await task.save();
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

adminRouter.get("/admin/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find({});
    let totalEarnings = 0;

    for (let i = 0; i < orders.length; i++) {
      for (let x = 0; x < orders[i].products.length; x++) {
        totalEarnings += orders[i].products[x].quantity * orders[i].products[x].product.price;
      }
    }
    // CATEGORY WISE ORDER FETCHING
    let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
    let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
    let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
    let booksEarnings = await fetchCategoryWiseProduct("Books");
    let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

    let earnings = {
      totalEarnings,
      mobileEarnings,
      essentialEarnings,
      applianceEarnings,
      booksEarnings,
      fashionEarnings,
    };

    res.json(earnings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

async function fetchCategoryWiseProduct(category) {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "products.product.category": category,
  });

  for (let i = 0; i < categoryOrders.length; i++) {
    for (let j = 0; j < categoryOrders[i].products.length; j++) {
      earnings +=
        categoryOrders[i].products[j].quantity *
        categoryOrders[i].products[j].product.price;
    }
  }
  return earnings;
}


// Get all backlog tasks

adminRouter.get("/admin/get-backlog", admin, async (req, res) => {
  try {
    const tasks = await Tasks.find({status: 'backlog'});
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Get all ToDo tasks

adminRouter.get("/admin/get-todo", admin, async (req, res) => {
  try {
    const tasks = await Tasks.find({status: 'ToDo'});
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Get all inprogress tasks

adminRouter.get("/admin/get-inprogress", admin, async (req, res) => {
  try {
    const tasks = await Tasks.find({status: 'inprogress'});
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Get all done tasks

adminRouter.get("/admin/get-done", admin, async (req, res) => {
  try {
    const tasks = await Tasks.find({status: 'done'});
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
// Get all approved tasks

adminRouter.get("/admin/get-approved", admin, async (req, res) => {
  try {
    const tasks = await Tasks.find({status: 'approved'});
    res.json(tasks);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add Task
adminRouter.post("/admin/add-task", admin, async (req, res) => {
  try {
    const { title, priority, description, images, points, category, assignmentUser,status,createdBy, label, startDate, endDate, } = req.body;
    let task = new Tasks({
      title,
      priority,
      description,
      images,
      points,
      category,
      assignmentUser,
      status,
      createdBy,
      label,
      startDate,
      endDate,
    
    });
    task= await task.save();
    res.json(task);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = adminRouter;