import jwt from "jsonwebtoken";

const requireAuth = (req, res, next) => {
  console.log("REqext: ", req.body);
  console.log("PATH",req.originalUrl);
  console.log("AUTH HEADER",req.headers.authorization)
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "No token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.userId };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default requireAuth;