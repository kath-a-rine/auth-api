'use strict';

const userModel = require('./users.js');
const { Sequelize, DataTypes } = require('sequelize');
const clothesModel = require('./clothes.js'); // copied
const foodModel = require('./food.js');//copied
const Collection = require('./data-collection.js');//copied

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory;';

const sequelize = new Sequelize(DATABASE_URL);
const food = foodModel(sequelize, DataTypes);//copied
const clothes = clothesModel(sequelize, DataTypes);//copied

module.exports = {
  db: sequelize,
  users: userModel(sequelize, DataTypes),
  food: new Collection(food),//copied
  clothes: new Collection(clothes),//copied
};
