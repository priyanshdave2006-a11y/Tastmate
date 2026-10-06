// middleware/authMiddleware.js
// This function runs BEFORE a protected route's controller code.
// It checks whether the request has a valid JWT token.
// If yes -> it lets the request continue (calls next()).
// If no  -> it stops the request and sends back a 401 Unauthorized error.

const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  // The frontend sends the token in the request header like this:
  // Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided. Please log in." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // jwt.verify checks the token's signature using our secret key.
    // If the token was tampered with, or expired, this will throw an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // We attach the decoded user id to the request object so that
    // every controller after this knows WHICH user made the request.
    req.userId = decoded.id;

    next(); // move on to the actual route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
  }
};

module.exports = protect;
