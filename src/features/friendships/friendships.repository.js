import FriendshipModel from "./friendships.schema.js";
import UserModel from "../users/users.schema.js";

export default class FriendshipRepository {
  //send friend request
  async sendFriendRequest(senderId, receiverId) {
    try {
      //check if receiver exists
      const receiver = await UserModel.findById(receiverId);

      if (!receiver) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "cannot send send request because user doesnt exists ",
          },
        };
      }

      //check if sender is already sent a request
      const existingFriendship = await FriendshipModel.findOne({
        senderId,
        receiverId,
      });

      if (existingFriendship) {
        return {
          success: false,
          error: {
            statusCode: 400,
            msg: "friendRequest already exists",
          },
        };
      }

      const newFriendRequest = new FriendshipModel({ senderId, receiverId });
      await newFriendRequest.save();
      return {
        success: true,
        res: "friendRequest sent successfully",
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //get pending friend requests
  async getPendingRequests(userId) {
    try {
      console.log("userId from repository : ", userId);
      const requests = await FriendshipModel.find({
        receiverId: userId,
        status: "pending",
      })
        .select("-__v")
        .populate("senderId", "_id name email avatar");
      if (requests.length == 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "you have no friend requests",
          },
        };
      }
      return {
        success: true,
        res: requests,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //accept friend request
  async acceptFriendRequest(requestId) {
    try {
      //check if requested exists
      const request = await FriendshipModel.findById(requestedId);

      //if requestedId not found
      if (!request) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "friend request not found",
          },
        };
      }

      //accepting the friend request
      request.status = "accepted";

      await request.save();

      return {
        success: true,
        res: "friend requested accepted",
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //reject friend request
  async rejectFriendRequest(requestId) {
    try {
      //check if requestedId exists
      const request = await FriendshipModel.findById(requestId);

      if (!request) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "friend request not found",
          },
        };
      }

      //rejecting th friend request
      request.status = "rejected";

      await request.save();
      return {
        success: true,
        res: "Friend request rejected",
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }

  //get all the  friends of currently logged in User
  async getFriends(userId) {
    try {
      const friends = await FriendshipModel.find({
        status: "accepted",
        //getting accepted friendships where current user
        //is either sender OR receiver

        //sender  -> currentUser became friend by sending request
        //receiver -> others became friends when currentUser accepted their request
        $or: [{ senderId: userId }, { receiverId: userId }],
      })
        .select("-__v")
        .populate("senderId", "_id name email avatar")
        .populate("receiverId", "_id name email avatar");
      if (friends.length == 0) {
        return {
          success: false,
          error: {
            statusCode: 404,
            msg: "you have no friends",
          },
        };
      }
      return {
        success: true,
        res: friends,
      };
    } catch (e) {
      return {
        success: false,
        error: {
          statusCode: 400,
          msg: e.message,
        },
      };
    }
  }
}
