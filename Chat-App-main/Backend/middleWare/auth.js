const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded; // The decoded payload will be available in req.user
      console.log("decoded", decoded);

      next();
    } catch (error) {
      return res
        .status(403)
        .json({ error: error.message, msg: "Failed to authenticate token." });
    }
  } else {
    res.status(401).json({ error: "No token provided." });
  }
};

module.exports = authenticate;