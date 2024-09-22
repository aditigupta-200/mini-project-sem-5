import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
	commentOnPost,
	createPost,
	deletePost,
	getAllPosts,
	getFollowingPosts,
	getLikedPosts,
	getUserPosts,
	likeUnlikePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.get("/all", protectRoute, getAllPosts);
router.get("/following", protectRoute, getFollowingPosts);
router.get("/likes/:id", protectRoute, getLikedPosts);
router.get("/user/:username", protectRoute, getUserPosts);
router.post("/create", protectRoute, createPost);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentOnPost);
router.delete("/:id", protectRoute, deletePost);
router.get("/season/:season", protectRoute, async (req, res) => {
    const { season } = req.params;
    try {
        const posts = await Post.find({ bestSeasonToVisit: season })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            });

        if (!posts.length) {
            return res.status(404).json({ message: `No posts found for the ${season} season` });
        }

        res.status(200).json(posts);
    } catch (error) {
        console.log("Error fetching posts by season:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
