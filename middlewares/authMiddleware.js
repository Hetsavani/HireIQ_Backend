const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    console.log("Token received:", token); // Debugging line to check token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded); // Debugging line to check decoded token
    req.user = decoded; // { id, role }
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { verifyToken };