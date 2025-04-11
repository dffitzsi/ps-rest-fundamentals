import express from "express";
import { getCustomers, getCustomerDetail, searchCustomers, upsertCustomer, deleteCustomer } from "./customers.service";
import { getOrdersForCustomer } from "../orders/orders.service";
import { validate } from "../../middleware/validation.middleware";
import { customerPOSTRequestSchema, idUUIDRequestSchema } from "../types";

export const customersRouter = express.Router();

customersRouter.get("/", async (req, res) => {
    const customers = await getCustomers();
    res.json(customers);
});

customersRouter.get("/:id", validate(idUUIDRequestSchema), async (req, res) => {
    const data = idUUIDRequestSchema.parse(req);
    const customer = await getCustomerDetail(data.params.id);
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

customersRouter.post("/",validate(customerPOSTRequestSchema), async (req, res) =>{
    const data = customerPOSTRequestSchema.parse(req);
    const customer = await upsertCustomer(data.body)
    if (customer != null){
        res.status(201).json(customer);
    } else {
        res.status(500).json({message: "Customer creation failed"});
    }
});
customersRouter.delete("/:id", validate(idUUIDRequestSchema), async (req, res) =>{
    const data = idUUIDRequestSchema.parse(req);
    const customer = await deleteCustomer(data.params.id);
    if (customer != null){
        res.status(201).json(customer);
    } else {
        res.status(500).json({message: "Customer deletion failed"});
    }
})