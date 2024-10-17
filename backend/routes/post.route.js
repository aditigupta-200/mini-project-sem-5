import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import Post from "../models/post.model.js";
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

// Get all posts
router.get("/all", protectRoute, getAllPosts);

// Get posts from users you follow
router.get("/following", protectRoute, getFollowingPosts);

// Get liked posts for a user
router.get("/likes/:id", protectRoute, getLikedPosts);

// Get posts by a specific user
router.get("/user/:username", protectRoute, getUserPosts);

// Create a new post
router.post("/create", protectRoute, createPost);

// Like or unlike a post
router.post("/like/:id", protectRoute, likeUnlikePost);

// Comment on a post
router.post("/comment/:id", protectRoute, commentOnPost);

// Delete a post
router.delete("/:id", protectRoute, deletePost);

// Get posts for a specific season
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

// Get posts by userId
router.get('/posts/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const posts = await Post.find({ userId }); // Fetch posts where userId matches
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Rate a post
router.post('/api/posts/:postId/rate', protectRoute, async (req, res) => {
    try {
        const { rating } = req.body;
        const post = await Post.findById(req.params.postId);
        if (rating < 0 || rating > 5) {
            return res.status(400).json({ error: "Rating must be between 0 and 5" });
        }
        post.rating = rating; // You can modify how you want to handle rating (e.g., average rating)
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Like a post
router.post('/api/posts/:postId/like', protectRoute, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        post.likes += 1;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
