const jwt = require("jsonwebtoken");

verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return res.status(401).json({ error: "Autentikasi invalid" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Token tidak ditemukan. Akses ditolak." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload.user;
    req.role = payload.role;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token kadaluarsa" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ msg: "Token invalid" });
    } else {
      return res.status(500).json({ error: "Kesalahan pada server" });
    }
  }
};

const authMiddleware = {
  verifyToken,
};

module.exports = authMiddleware;
