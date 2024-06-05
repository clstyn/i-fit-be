const dbConfig = require("../config/db");

module.exports = {
  //db
  mongoose: require("mongoose"),
  url: dbConfig.uri,
  connectDB: dbConfig.connectDB,

  // models
  user: require("./user.model"),
  post: require("./post.model"),
};
