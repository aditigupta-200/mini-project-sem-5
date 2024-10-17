import {
  FaRegComment,
  FaRegHeart,
  FaRegBookmark,
  FaTrash,
  FaStar,
  FaRegStar,
  FaRoute,
} from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useItinerary } from "../../context/ItineraryContext";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post, onLike, onRate }) => {
  const [rating, setRating] = useState(0);
  // const { addToItinerary } = useItinerary();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const postOwner = post.user;
  const formattedDate = formatPostDate(post.createdAt);
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;

  const handleLike = () => {
    onLike(post._id);
  };

  const handleRating = (starRating) => {
    setRating(starRating);
    onRate({ postId: post._id, rating: starRating });
  };

  const handleAddToItinerary = async () => {
    try {
      const res = await fetch("/api/itinerary/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destinationId: post._id }),
      });

      if (!res.ok) throw new Error("Failed to add to itinerary");

      addToItinerary(post);
      toast.success("Added to itinerary!");
    } catch (error) {
      toast.error("Failed to add to itinerary");
    }
  };

  return (
    <div className="flex gap-2 items-start p-4 border-b border-gray-700">
      <div className="avatar ">
        <Link
          to={`/profile/${postOwner.username}`}
          className="w-8 rounded-full overflow-hidden"
        >
          <img
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            alt={postOwner.fullName}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex gap-2 text-gray-900 items-center">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>
              @{postOwner.username}
            </Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {/* Uncomment to enable post deletion */}
          {/* {isMyPost && (
						<span className='flex justify-end flex-1'>
							<FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
						</span>
					)} */}
        </div>
        <div className="flex flex-col gap-3 overflow-hidden">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg border border-gray-700"
              alt={post.placeName || "Post image"}
            />
          )}
          {/* New section for place details */}
          <div className="bg-gray-800 p-3 rounded-lg">
            <h3 className="font-bold text-lg">{post.placeName}</h3>
            <p className="text-sm text-gray-400">Location: {post.location}</p>
            <p className="text-sm text-gray-400">
              Best Season to Visit: {post.bestSeason}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <button onClick={handleLike} className="flex items-center">
            <FaRegHeart
              className={`text-red-500 ${isLiked ? "font-bold" : ""}`}
            />{" "}
            {post.likes.length}
          </button>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleRating(star)}>
                {star <= rating ? (
                  <FaStar className="text-yellow-500" />
                ) : (
                  <FaRegStar className="text-gray-500" />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddToItinerary}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaRoute />
            <span>Add to Itinerary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;
