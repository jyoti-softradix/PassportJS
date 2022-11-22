//const validator = require("express-validator");
module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      autoNull: false,
      primaryKey: true,
    },
    first_name: {
      type: Sequelize.STRING,
      autoNull: false,
    },
    last_name: {
      type: Sequelize.STRING,
      autoNull: false,
    },
    email: {
      type: Sequelize.STRING,
    },
    otp: {
      type: Sequelize.STRING,
      autoNull: true,
    },
    username: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
  });
  return user;
};
