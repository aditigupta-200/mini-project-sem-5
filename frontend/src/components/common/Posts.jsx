import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId }) => {
	const [selectedSeason, setSelectedSeason] = useState("all");
	const queryClient = useQueryClient();

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				return `/api/posts/user/${username}`;
			case "likes":
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const POST_ENDPOINT = getPostEndpoint();

	const { data: posts, isLoading, isError, refetch, isRefetching } = useQuery({
		queryKey: ["posts", selectedSeason],
		queryFn: async () => {
			try {
				const res = await fetch(`${POST_ENDPOINT}?season=${selectedSeason}`);
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}

				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch, username, selectedSeason]);

	const filteredPosts = selectedSeason === "all"
		? posts
		: posts?.filter(post => post.bestSeasonToVisit === selectedSeason);

	const likePost = useMutation({
		mutationFn: async (postId) => {
			const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
			if (!res.ok) throw new Error("Error liking post");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
			toast.success("Post liked!");
		},
	});

	const ratePost = useMutation({
		mutationFn: async ({ postId, rating }) => {
			const res = await fetch(`/api/posts/${postId}/rate`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ rating }),
			});
			if (!res.ok) throw new Error("Error rating post");
			return res.json();
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["posts"]);
			toast.success("Post rated!");
		},
	});

	if (isLoading || isRefetching) {
		return (
			<div className='flex flex-col justify-center'>
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
			</div>
		);
	}

	if (isError) {
		return <div>Error loading posts</div>;
	}

	return (
    <>
      <div className="mb-4 mt-4">
        <label htmlFor="season-select" className="mr-2 text-gray-900 ml-5">
          Filter by season:
        </label>
        <select
          id="season-select"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value)}
          className="bg-gray-700 text-white rounded p-1"
        >
          <option value="all">All Seasons</option>
          <option value="spring">Spring</option>
          <option value="summer">Summer</option>
          <option value="autumn">Autumn</option>
          <option value="winter">Winter</option>
        </select>
      </div>

      {filteredPosts?.length === 0 && (
        <p className="text-center my-4">
          No posts found for the selected season. Try another season or tab 👻
        </p>
      )}

      {filteredPosts && (
        <div>
          {filteredPosts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onLike={likePost.mutate}
              onRate={ratePost.mutate}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default Posts;


