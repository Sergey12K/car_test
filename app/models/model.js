const { DataTypes } = require('sequelize');
const sequelize = require('../db'); // Импортируйте объект sequelize из файла с настройками подключения

const Model = sequelize.define('Model', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Model;