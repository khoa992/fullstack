const jwt = require("jsonwebtoken");

const authenticate = (req, res, next, roles = []) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyRole(roles, payload.role)) {
      return res.status(403).send("Forbidden: Insufficient permissions");
    }

    req.user = payload;
    next();
  } catch (err) {
    return res.status(403).send("Forbidden");
  }
};

const verifyRole = (roles, userRole) => {
  return roles.length === 0 || roles.includes(userRole);
};

module.exports = authenticate;
