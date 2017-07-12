const request = require('supertest');
const assert = require('assert');
const app = require('../app');
const models = require('../models');
const bulkItems = [
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

const bulkTransactions = [
  {
    itemBought:"First item",
    amount: 5
  },{
    itemBought:"Second item",
    amount: 10
  },{
    itemBought:"Third item",
    amount: 15
  },{
    itemBought:"Fourth item",
    amount: 20
  }
];


describe ("Endpoints for: ", () => {

  before("create Table", (done) => {
    models.items.sync({match:{database:/_test$/}}).then( () => {
      models.items.bulkCreate(bulkItems).then( () => {
        models.transactions.sync({match:{database:/_test$/}}).then( () => {
          models.transactions.bulkCreate(bulkTransactions).then(done());
        });
      });
    });
  });

  after("cleanup", (done) => {
    models.items.drop({match:{database:/_test$/}}).then( () => {
      models.transactions.drop({match:{database:/_test$/}}).then(done());
    });
  });

  describe ("Customers: ", () => {
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
        assert.equal(res.body.data.moneyReturned, moneyGiven - bulkItems[0].cost);
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
  describe("Vendors: ", () => {
    it( "should be able to see total amount of money in machine", (done) => {
      request(app).get("/api/vendor/money").expect(200)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
        assert.ok(res.body.data.totalMoneyReceived, 50);
      })
      .end(done);
    });

    it( "should be able to see a list of all purchases with their time of purchase", (done) => {
      request(app).get("/api/vendor/purchases").expect(200)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
        assert.equal(res.body.data[0].itemBought, "First item");
        assert.ok(res.body.data[0].createdAt);
      })
      .end(done);
    });
    it( "should be able to update the description, quantity, and costs of items in the machine", (done) => {
      let itemId = 1;
      let updatingItem = {
        description: "Item 6",
        quantity: 10,
        cost: 50
      };
      request(app).put("/api/vendor/items/" + itemId).expect(201)
      .send(updatingItem)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
        assert.equal(res.body.data.description, updatingItem.description);
        assert.equal(res.body.data.quantity, updatingItem.quantity);
        assert.equal(res.body.data.cost, updatingItem.cost);
      }).end(done);
    });
    it( "should be able to add a new item to the machine", (done) => {
      let newItem = {
        description: "A Brand New Item",
        quantity: 75,
        cost: 9001
      };
      request(app).post("/api/vendor/items/").expect(201)
      .send(newItem)
      .expect( (res) => {
        assert.equal(res.body.status, "success");
        assert.equal(res.body.data.description, newItem.description);
        assert.equal(res.body.data.quantity, newItem.quantity);
        assert.equal(res.body.data.cost, newItem.cost);
      }).end(done);
    });
  });
});
