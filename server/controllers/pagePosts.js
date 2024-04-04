import PagePost from "../models/PagePost.js";
import User from "../models/User.js";
import Poll from "../models/Poll.js";

// 3 functions: getPagePosts, createPagePost, likePagePost
// 1. getPagePosts - Get the page's posts by their ID
// 2. createPagePost - Create a post for the page by its ID
// 3. likePagePost - Like a post for the page by its ID

/* Create/POST */
export const createPagePost = async (req, res) => {
    try {
      const { userId, pageId, description, picturePath, videoPath, pollData } = req.body;
      const user = await User.findById(userId);
      const pagePost = new PagePost({
        pageId,
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        description,
        picturePath,
        videoPath,
        pollData,
        userPicturePath: user.picturePath,
        likes: {},
        comments: [],
      });
      await pagePost.save(); //Save new post

      if (pollData) {
        const newPollData = JSON.parse(pollData);

        const newPoll = new Poll({
          question: newPollData.question,
          options: newPollData.options.map((option) => {
            return {
              option,
              votes: 0,
            };
          }),
        });

        newPoll.parentId = pagePost._id;
        await newPoll.save();
      }

      const pagePosts = await PagePost.find({ pageId: pageId });
      res.status(201).json(pagePosts);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
};

/* Read/GET */
export const getPagePosts = async (req, res) => {
    try {
        const { pageId } = req.params;
        const pagePosts = await PagePost.find({ pageId: pageId });
        res.status(200).json(pagePosts);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* Update/PATCH */
export const likePagePost = async (req, res) => {
    try {
        const { pageId } = req.params;
        const { userId } = req.body;
        const pagePost = await PagePost.findById(pageId);
        const isLiked = pagePost.likes.get(userId);

        if (isLiked) {
            pagePost.likes.delete(userId);
        } else {
            pagePost.likes.set(userId, true);
        }
        await pagePost.save();

        const updatedPagePost = await PagePost.findByIdAndUpdate(
            pageId,
          { likes: pagePost.likes },
          { new: true }
        );

        res.status(200).json(updatedPagePost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const commentPagePost = async (req, res) => {
  try {
    const { pageId } = req.params;
    const { userId, userUsername, userPicturePath, comment } = req.body;
    const pagePost = await PagePost.findById(pageId);
    const newComment = {
      userId,
      userUsername,
      userPicturePath,
      comment,
    };
    pagePost.comments.push(newComment);

    await pagePost.save();

    const updatedPagePost = await PagePost.findById(pageId);
    res.status(200).json(updatedPagePost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};