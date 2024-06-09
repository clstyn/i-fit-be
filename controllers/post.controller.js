const db = require("../models");
const Post = db.post;

//Get all posts
exports.findAll = (req, res) => {
  const query = {};
  if (req.query.tag) {
    query.tag = { $regex: req.query.tag, $options: "i" };
  }

  if (req.query.search) {
    query.title = { $regex: req.query.search, $options: "i" };
  }

  Post.find(query)
    .select("-langkah -desc -portion")
    .populate("author", "username")
    .then((data) => {
      res.status(200).json({
        message: "Berhasil mendapatkan semua postingan resep",
        recipes: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Terjadi kesalahan",
      });
    });
};

// Find one post by ID
exports.findOne = (req, res) => {
  const id = req.params.id;

  Post.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `Post dengan id ${id} tidak ditemukan.`,
        });
      }
      res.status(200).json({
        message: "Berhasil mendapatkan postingan resep",
        recipe: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message ||
          `Terjadi kesalahan saat mendapatkan post dengan id ${id}`,
      });
    });
};

// Create a new post
exports.create = (req, res) => {
  const userId = req.user._id;
  const post = new Post({
    title: req.body.title,
    desc: req.body.desc,
    picUrl: req.body.picUrl,
    portion: req.body.portion,
    cookmin: req.body.cookmin,
    bahan: req.body.bahan,
    langkah: req.body.langkah,
    tags: req.body.tags,
    author: userId,
  });

  post
    .save()
    .then((data) => {
      res.status(201).json({
        message: "Post berhasil dibuat",
        recipe: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Terjadi kesalahan saat membuat post",
      });
    });
};

// Update a post by ID
exports.update = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: `Post dengan id ${id} tidak ditemukan.`,
      });
    }

    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk mengupdate post ini",
      });
    }

    const updated = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "Post berhasil diupdate",
      recipe: updated,
    });
  } catch (error) {
    return res.status(500).json({
      message:
        err.message || `Terjadi kesalahan saat mengupdate post dengan id ${id}`,
    });
  }
};

// Delete a post by ID
exports.delete = async (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({
        message: `Post dengan id ${id} tidak ditemukan.`,
      });
    }

    // Check if the user is the owner of the post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: "Anda tidak memiliki akses untuk menghapus post ini.",
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      message: "Post berhasil dihapus.",
    });
  } catch (error) {
    return res.status(500).json({
      message:
        error.message ||
        `Terjadi kesalahan saat menghapus post dengan id ${id}.`,
    });
  }
};

// Like or unlike a post
exports.likepost = (req, res) => {
  const id = req.params.id;
  const userId = req.user._id;

  Post.findById(id)
    .then((data) => {
      if (!data) {
        return res.status(404).json({
          message: `Post dengan id ${id} tidak ditemukan.`,
        });
      }
      if (data.like.includes(userId)) {
        // Unlike the post
        data.like = data.like.filter(
          (user) => user.toString() !== userId.toString()
        );
        return data.save().then(() => {
          res.status(200).json({
            message: "Post berhasil diunlike",
            recipe: data,
          });
        });
      } else {
        // Like the post
        data.like.push(userId);
        return data.save().then(() => {
          res.status(200).json({
            message: "Post berhasil dilike",
            recipe: data,
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || `Terjadi kesalahan saat menyukai post dengan id ${id}`,
      });
    });
};

// Get liked post
exports.getLikedPost = (req, res) => {
  const userId = req.user._id;
  Post.find({ like: userId })
    .then((data) => {
      res.status(200).json({
        message: "Berhasil mendapatkan semua postingan yang dilike",
        recipes: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Terjadi kesalahan",
      });
    });
};

// Get my post only
exports.getMyPost = (req, res) => {
  const userId = req.user._id;
  console.log("yes");
  Post.find({ author: userId })
    .then((data) => {
      res.status(200).json({
        message: "Berhasil mendapatkan semua postingan milik sendiri",
        recipes: data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message || "Terjadi kesalahan",
      });
    });
};
