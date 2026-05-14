import jwt from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  //get token from request
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).send("unauthorized");
  }

  try {
    //verify token
    const validToken = jwt.verify(token, process.env.SECRET_KEY);

    //store loggedIn user's id in request
    req.userId = validToken.id;
  } catch (error) {
    return res.status(401).send("invalid token");
  }
  next();
};

export default jwtAuth;
