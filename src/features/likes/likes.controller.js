import LikeRepository from "./likes.repository.js";

export default class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }

  //toggle like
  async toggleLike(req, res, next) {
    try {
      //getting user id
      const userId = req.userId;

      //getting postId
      const { postId } = req.params;

      const result = await this.likeRepository.toggleLike(userId, postId);

      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }
      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }

  //get users who liked the post
  async getLikesByPostId(req, res, next) {
    try {
      //getting postId from params
      const { postId } = req.params;

      const result = await this.likeRepository.getLikesByPostId(postId);

      //if failed
      if (!result.success) {
        return res.status(400).send(result.error.msg);
      }

      return res.status(200).send(result.res);
    } catch (e) {
      console.log(e);
      next(e);
    }
  }
}
