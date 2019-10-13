const Sequelize = require('sequelize');
const db = require('../conn.js');


const user = db.define('user', {
  id: {
    type: Sequelize.STRING,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  os: {
    type: Sequelize.STRING,
  },
  createdAt: {
    type: Sequelize.DATE,
  },
}, {
  timestamps: false,
});

module.exports = user;
