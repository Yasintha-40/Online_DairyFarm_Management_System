import jwt from "jsonwebtoken";

// Middleware for token-based authentication
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: "Not authorized, please login again" });
    }

    const token = authHeader.split(' ')[1]; // Extract Bearer token
    // Use a fallback secret if environment variable is not set
    const secret = process.env.JWT_SECRET || 'dairyfarmsecretkey123';
    const decoded = jwt.verify(token, secret);

    req.userId = decoded.id; // Set req.userId instead of req.user.id
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// Middleware for cookie-based authentication (if needed)
const cookieAuth = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Log in again' });
  }

  try {
    // Use a fallback secret if environment variable is not set
    const secret = process.env.JWT_SECRET || 'dairyfarmsecretkey123';
    const tokenDecode = jwt.verify(token, secret);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.status(401).json({ success: false, message: 'Log in again' });
    }

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export { authMiddleware, cookieAuth };
