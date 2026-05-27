import jwt from "jsonwebtoken";
import UserModel from "../../features/users/users.schema.js";

const jwtAuth = async (req, res, next) => {
  //get token from request
  const token = req.headers.authorization;
  if (!token) {
    return res.status(400).send("unauthorized");
  }

  try {
    //verify token
    const validToken = jwt.verify(token, process.env.SECRET_KEY);

    //check user exists
    const user = await UserModel.findById(validToken.id);

    //checking if user exists
    if (!user) {
      return res.status(404).send("user not found");
    }

    //check token exists in db
    if (!user.tokens.includes(token)) {
      //user model has tokens array
      return res.status(401).send("please login in");
    }

    //store loggedIn user's id in request
    req.userId = validToken.id;
  } catch (error) {
    return res.status(401).send("invalid token");
  }
  next();
};

export default jwtAuth;

//verify the token by checking the tokens array in db. if it is not there then show that your are logged out
