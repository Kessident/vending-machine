const express = require("express");
const router = express.Router();
const models = require("../models");

router.get("/items",function (req,res) {
  models.items.findAll().then(function (items) {
    let serverResponse;
    if (items) {
      serverResponse = {
        status: "success",
        data: items
      };
    } else {
      serverResponse = {
        status: "fail",
        data: items
      };
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).send(serverResponse);
  });
});

router.post("/items/:itemId/purchases", function(req, res){
  models.items.findOne({
    where:{
      id:req.params.itemId
    }
  }).then( (item) => {
    console.log(item);
    let serverResponse;
    /* Item Found */
    if (item){
      /* doesn't have enough money*/
      if (req.body.moneyGiven < item.cost){
        res.status(402);
        serverResponse = {
          status:"fail",
          data:{
            moneyGiven: req.body.moneyGiven,
            moneyRequired: item.cost
          }
        };
      } /* Has enough money*/ else {
        res.status(200);
        serverResponse = {
          status:"success",
          data:{
            moneyGiven: req.body.moneyGiven,
            moneyRequired: item.cost,
            moneyReturned: req.body.moneyGiven - item.cost
          }
        };
      }
    } /* Item not found*/ else {
      res.status(404);
      serverResponse = {
        status: "fail",
        data: "No item found"
      };
    }

    res.setHeader("Content-Type", "application/json");

    if (serverResponse.status === "success"){
      models.items.update({quantity: item.quantity-1}, {where: {description:item.description}})
      .then(() => {
        res.json(serverResponse);
      });
    } else {
      res.json(serverResponse);
    }
  });
});

module.exports = router;
