import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		text: {
			type: String,
		},
		img: {
			type: String,
			required: true,
		},
		placeName: {
			type: String, required: true
		},   // New field
		location: {
			type: String, required: true
		},    // New field
		bestSeasonToVisit: {
			type: String, required: true
		},  // New field
		likes: [
			{
				type: Number,
				 default: 0,
			},
		],
		rating: {
        type: Number,
        default: 0, // Default rating is 0
        min: 0, // Minimum rating value
        max: 5, // Maximum rating value
    },
 // Adds createdAt and updatedAt fields
		comments: [
			{
				text: {
					type: String,
					required: true,
				},
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
					required: true,
				},
				createdAt: { type: Date, default: Date.now },
			},
		],
	},
	{ timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
