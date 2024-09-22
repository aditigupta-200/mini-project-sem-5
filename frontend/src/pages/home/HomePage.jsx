import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");
	const [selectedSeason, setSelectedSeason] = useState("all");

	const seasons = ["all", "spring", "summer", "autumn", "winter"];

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* Season Filter */}
				{/* <div className="flex justify-center p-3 border-b border-gray-700">
					<select
						value={selectedSeason}
						onChange={(e) => setSelectedSeason(e.target.value)}
						className="select select-bordered w-full max-w-xs"
					>
						{seasons.map((season) => (
							<option key={season} value={season}>
								{season.charAt(0).toUpperCase() + season.slice(1)} {season === "all" ? "Seasons" : ""}
							</option>
						))}
					</select>
				</div> */}

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} selectedSeason={selectedSeason} />
			</div>
		</>
	);
};

export default HomePage;