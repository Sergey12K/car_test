const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Car = sequelize.define('Car', {
  VIN: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  modelId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  brandId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Car; 