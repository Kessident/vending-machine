const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const models = require('../models');
const bulkCreateData = [
  {
    description:"Item 1",
    cost:10,
    quantity:1
  },{
    description:"Item 2",
    cost:20,
    quantity:2
  },{
    description:"Item 3",
    cost:30,
    quantity:3
  },{
    description:"Item 4",
    cost:40,
    quantity:4
  },{
    description:"Item 5",
    cost:50,
    quantity:5
  }
];


describe ("Endpoints for: ", () => {

  before("create Table", (done) => {
    models.items.sync().then( () => {
      models.items.bulkCreate(bulkCreateData).then(done());
    });
  });

  after("cleanup", (done) => {
    models.items.drop().then( () => {
      done();
    });
  });

  describe ("Customers", () => {
    it("Should be able to get a list of items", (done) => {
      request(app).get("/api/customer/items")
        .expect(200)
        .expect("Content-Type", "application/json; charset=utf-8")
        .expect( (res) => {
          assert.equal(res.body.status, "success");
          assert.equal(res.body.data[0].description, "Item 1");
          assert.equal(res.body.data[0].cost, 10);
          assert.equal(res.body.data[0].quantity, 1);
        })
        .end(done);
    });

    it("Should be able to buy an item", (done) => {
      let itemId = 1;
      let moneyGiven = 50;
      request(app).post("/api/customer/items/" + itemId + "/purchases")
      .send({
        itemWanted:"Item1",
        moneyGiven:moneyGiven
      })
      .expect(200)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
      })
      .end(done);
    });

    it("Should be able to buy an item with money left over", (done) => {
      let itemId = 1;
      let moneyGiven = 50;
      request(app).post("/api/customer/items/" + itemId + "/purchases")
      .send({
        itemWanted:"Item1",
        moneyGiven:moneyGiven
      })
      .expect(200)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
        assert.equal(res.body.data.moneyReturned, moneyGiven - bulkCreateData[0].cost);
      })
      .end(done);
    });

    it("Should not be able to buy an item with no money", (done) => {
      let itemId = 1;
      let moneyGiven = 1;
      request(app).post("/api/customer/items/" + itemId + "/purchases")
      .send({
        itemWanted:"Item1",
        moneyGiven:1
      })
      .expect(402)
      .expect( (res) => {
        assert.equal(res.body.status, "fail");
      })
      .end(done);
    });

    it("Should not be able to buy an item that does not exist", (done) => {
    let itemId = 404;
    let moneyGiven = 5000;
    request(app).post("/api/customer/items/" + itemId + "/purchases")
    .send({
      itemWanted:"Item1",
      moneyGiven:1
    })
    .expect(404)
    .expect( (res) => {
      assert.equal(res.body.status, "fail");
      assert.equal(res.body.data, "No item found");
    })
    .end(done);
  });
});

  describe("Vendors", () => {
    //A vendor should be able to see total amount of money in machine
    //A vendor should be able to see a list of all purchases with their time of purchase
    //A vendor should be able to update the description, quantity, and costs of items in the machine
    //A vendor should be able to add a new item to the machine
  });
});
