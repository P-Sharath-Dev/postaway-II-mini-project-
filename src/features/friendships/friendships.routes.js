import express from "express";
import jwtAuth from "../../middlewares/user/jwt.middleware.js";
import FriendshipController from "./friendships.controller.js";

const router = express.Router();

const friendshipController = new FriendshipController();

//--->send friend request
//domainName.com/api/friendships/send/:receiverId
router.post("/send/:receiverId", jwtAuth, (req, res, next) => {
  friendshipController.sendFriendRequest(req, res, next);
});

//--->get pending request
//domainName.com/api/friendships/pending
router.get("/pending", jwtAuth, (req, res, next) => {
  friendshipController.getPendingRequests(req, res, next);
});

//--->accept friend request
//domainName.com/api/friendships/accept/:requestedId
router.put("/accept/:requestedId", jwtAuth, (req, res, next) => {
  friendshipController.acceptFriendRequest(req, res, next);
});

//--->reject friend request
//domainName.com/api/friendships/reject/:requestId
router.put("/reject/:requestId", jwtAuth, (req, res, next) => {
  friendshipController.rejectFriendRequest(req, res, next);
});

//--->get all friends
//domainName.com/api/friendships/get-friends
router.get("/get-friends", jwtAuth, (req, res, next) => {
  friendshipController.getFriends(req, res, next);
});

export default router;
