import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res
        .sendStatus(401)
        .json({ key: "invalid-access-token", message: "token not defined" });
    }

    try {
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
          return res
            .sendStatus(403)
            .json({ key: "invalid-access-token", message: err.message });
        }
        req.user = user;
        next();
      });
    } catch (err) {
      res.status(401).json({
        key: "invalid-access-token",
        message: err.message,
      });
    }
  } else {
    res.status(401).json({
      key: "invalid-access-token",
      message: "Authorization header is missing",
    });
  }
};
