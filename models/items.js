'use strict';
module.exports = function(sequelize, DataTypes) {
  var items = sequelize.define('items', {
    description: DataTypes.STRING,
    cost: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return items;
};
