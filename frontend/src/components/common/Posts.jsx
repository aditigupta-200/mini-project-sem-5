import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

const Posts = ({ feedType, username, userId }) => {
	const [selectedSeason, setSelectedSeason] = useState("all");

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

	const {
		data: posts,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
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

	return (
		<>
			<div className="mb-4">
				<label htmlFor="season-select" className="mr-2">Filter by season:</label>
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

			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && filteredPosts?.length === 0 && (
				<p className='text-center my-4'>No posts found for the selected season. Try another season or tab 👻</p>
			)}
			{!isLoading && !isRefetching && filteredPosts && (
				<div>
					{filteredPosts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};

export default Posts;