import FriendshipRepository from "./friendships.repository.js";

export default class FriendshipController {
  constructor() {
    this.friendshipRepository = new FriendshipRepository();
  }

  //send friend request
  async sendFriendRequest(req, res, next) {
    try {
      //loggedIn user
      const senderId = req.userId;

      //user receiving request
      const { receiverId } = req.params;

      const result = await this.friendshipRepository.sendFriendRequest(
        senderId,
        receiverId,
      );

      //if failed
      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get pending friend requests
  async getPendingRequests(req, res, next) {
    try {
      const userId = req.userId;
      console.log("userId", userId);

      const result = await this.friendshipRepository.getPendingRequests(userId);

      //if failed
      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //accept friend request
  async acceptFriendRequest(req, res, next) {
    try {
      const { requestedId } = req.params;
      const result =
        await this.friendshipRepository.acceptFriendRequest(requestedId);

      //if failed

      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //reject friend request
  async rejectFriendRequest(req, res, next) {
    try {
      const { requestId } = req.params;

      const result =
        await this.friendshipRepository.rejectFriendRequest(requestId);

      //if failed

      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get friends
  async getFriends(req, res, next) {
    try {
      const userId = req.userId;
      const result = await this.friendshipRepository.getFriends(userId);

      //if failed
      if (!result.success) {
        return res.status(result.error.statusCode).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
