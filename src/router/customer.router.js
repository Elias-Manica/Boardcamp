import express from "express";

import {
  getCustomer,
  postCustomers,
  getCustomerByID,
  updateCustomers,
} from "../controllers/customer.controller.js";

const router = express.Router();

router.get("/customers", getCustomer);

router.get("/customers/:id", getCustomerByID);

router.post("/customers", postCustomers);

router.put("/customers/:id", updateCustomers);

export default router;
