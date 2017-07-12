const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/purchases",function (req,res) {
  models.transactions.findAll().then( (transactions) => {
    if (transactions){
      res.setHeader("Content-Type", "application/json");
      res.json({status:"success", data:transactions});
    } else {
      res.setHeader("Content-Type", "application/json");
      res.json({status:"fail", data:{totalMoneyReceived:null}});
    }
  });
});

router.get("/money", function(req, res){
  models.transactions.findAll().then( (transactions) => {
    if (transactions){
      let total = 0;
      for (var i = 0; i < transactions.length; i++) {
        total += transactions[i].amount;
      }
      res.setHeader("Content-Type", "application/json");
      res.status(200).json({status:"success", data:{totalMoneyReceived:total}});
    } else {
      res.setHeader("Content-Type", "application/json");
      res.json({status:"fail", data:{totalMoneyReceived:null}});
    }
  });
});

router.post("/items", function(req, res){
  models.items.create(req.body).then( (item) => {
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({status: "success", data: item});
  });
});

router.put("/items/:itemId", function(req, res){
  models.items.find({where:{id:req.params.itemId}})
  .then( (item) => {
    if (item){
      item.updateAttributes({
        description: req.body.description || item.description,
        quantity: req.body.quantity || item.quantity,
        cost: req.body.cost || item.cost
      })
      .then( (wasUpdated) => {
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({status: "success", data: wasUpdated});
      });
    } else {
      res.setHeader("Content-Type", "application/json");
      res.status(404).json({status: "fail", data: "No item found"});
    }

  });

});

module.exports = router;




// const bulkItems = [
//   {
//     description:"Item 1",
//     cost:10,
//     quantity:1
//   },{
//     description:"Item 2",
//     cost:20,
//     quantity:2
//   },{
//     description:"Item 3",
//     cost:30,
//     quantity:3
//   },{
//     description:"Item 4",
//     cost:40,
//     quantity:4
//   },{
//     description:"Item 5",
//     cost:50,
//     quantity:5
//   }
// ];
//
// const bulkTransactions = [
//   {
//     itemBought:"First item",
//     amount: 5
//   },{
//     itemBought:"Second item",
//     amount: 10
//   },{
//     itemBought:"Third item",
//     amount: 15
//   },{
//     itemBought:"Fourth item",
//     amount: 20
//   }
// ];
//
// models.items.bulkCreate(bulkItems).then( () => {
//   models.transactions.bulkCreate(bulkTransactions);
// });
