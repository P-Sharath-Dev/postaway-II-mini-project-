import mongoose from "mongoose";

//Friendship document looks like
//{
//   senderId,
//   receiverId,
//   status :
//}

const friendShipSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const FriendshipModel = mongoose.model("Friendship", friendShipSchema);
export default FriendshipModel;
