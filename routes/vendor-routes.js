const express = require("express");
const router = express.Router();
const Items = require("../models").item;

router.get("/purchases",function (req,res) {

});

router.get("/money", function(req, res){

});

router.post("/items", function(req, res){

});

router.put("/items/:itemId", function(req, res){

});

module.exports = router;
