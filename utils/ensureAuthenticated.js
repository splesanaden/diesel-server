import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const ensureAuthenticated = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({ error: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(500).json({ error: "Failed to authenticate token" });
    }

    // If token is valid, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
};

export default ensureAuthenticated;
