'use strict';
module.exports = function(sequelize, DataTypes) {
  var transactions = sequelize.define('transactions', {
    itemBought:DataTypes.STRING,
    amount: DataTypes.INTEGER
  }, {});
  return transactions;
};
