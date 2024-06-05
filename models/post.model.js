const mongoose = require("mongoose");

const subSchemaBahan = new mongoose.Schema({
  nama: {
    type: String,
  },
  satuan: {
    type: String,
  },
  kalori: {
    type: Number,
  },
});

const subSchemaLangkah = new mongoose.Schema({
  text: {
    type: String,
  },
});

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  picUrl: {
    type: String,
    required: true,
  },
  portion: {
    type: Number,
    required: true,
  },
  cookmin: {
    type: Number,
    required: true,
  },
  bahan: {
    type: [subSchemaBahan],
  },
  langkah: {
    type: [subSchemaLangkah],
  },
  like: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "User",
    default: [],
  },
  tags: {
    type: [String],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
