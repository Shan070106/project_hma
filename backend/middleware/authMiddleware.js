import jwt from "jsonwebtoken";

export const requireAuth = (req, _res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) return next({ status: 401, message: "No token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    next({ status: 401, message: "Invalid token" });
  }
};
