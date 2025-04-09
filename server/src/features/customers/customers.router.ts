import express from "express";
import { getCustomers, getCustomerDetail, searchCustomers } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { resolve } from "path";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
    const customers = await getCustomers();
    res.json(customers);
});

customersRouter.get("/:id", async (req, res) => {
    const id = req.params.id;
    const customer = await getCustomerDetail(id);
    if (customer != null){
        res.json(customer);
    } else{
        res.status(404).json({message: "Customer Not Found"});
    }
});

customersRouter.get("/:id/orders", async (req, res) =>{
    const id = req.params.id;
    const orders = await getOrdersForCustomer(id);
    if (orders !=null){
        res.json(orders);
    } else{
        res.status(404).json({message: "No Orders were Found for this Customer"});
    }
});

customersRouter.get("/search/:query", async (req, res) =>{
    const query = req.params.query
    const customers = await searchCustomers(query);
    res.json(customers);
});