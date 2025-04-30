const express = require('express');
const router = express.Router();
const{mongoUrl} = require('../../config');
const Users = require('./user.model');

/* GET users listing. */
routers.get("/users", async (req, res) => {
    try{
    const users = await Users.find();
    res.json({
    status: "success",
    message: "list users",
    data: users,
    });
    }catch{
        res.status(400).send(error.message)
    }
  });

routers.get("/users/:id", async (req, res) => {
    try{
    const users = await Users.findById(req.params.id);
    
    res.json({
    status: "success",
    message: "list users",
    data: users,
    });
    }catch{
        res.status(400).send(error.message)
    }
  });
module.exports = router;
