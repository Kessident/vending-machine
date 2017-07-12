const express = require('express');
const bodyParser = require('body-parser');
const customerRouter = require('./routes/customer-routes.js');
const vendorRouter = require('./routes/vendor-routes.js');
const morgan = require('morgan');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('port', (process.env.PORT || 3000));

app.use("/api/customer", customerRouter);
app.use("/api/vendor", vendorRouter);

if (require.main === module){
  process.env.NODE_ENV = "development";
  app.listen(app.get('port'), function () {
    console.log("server runnning on localhost: " + app.get('port'));
  });
} else {
  process.env.NODE_ENV = "test";
}

module.exports = app;
