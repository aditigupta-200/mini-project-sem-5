// import { useState } from "react";

// import Posts from "../../components/common/Posts";
// import CreatePost from "./CreatePost";

// const HomePage = () => {
// 	const [feedType, setFeedType] = useState("forYou");
// 	const [selectedSeason, setSelectedSeason] = useState("all");

// 	const seasons = ["all", "spring", "summer", "autumn", "winter"];

// 	return (
// 		<>
// 			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
// 				{/* Header */}
// 				<div className='flex w-full border-b border-gray-700'>
// 					<div
// 						className={
// 							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
// 						}
// 						onClick={() => setFeedType("forYou")}
// 					>
// 						For you
// 						{feedType === "forYou" && (
// 							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
// 						)}
// 					</div>
// 					<div
// 						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
// 						onClick={() => setFeedType("following")}
// 					>
// 						Following
// 						{feedType === "following" && (
// 							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
// 						)}
// 					</div>
// 				</div>

// 				{/* Season Filter */}
// 				{/* <div className="flex justify-center p-3 border-b border-gray-700">
// 					<select
// 						value={selectedSeason}
// 						onChange={(e) => setSelectedSeason(e.target.value)}
// 						className="select select-bordered w-full max-w-xs"
// 					>
// 						{seasons.map((season) => (
// 							<option key={season} value={season}>
// 								{season.charAt(0).toUpperCase() + season.slice(1)} {season === "all" ? "Seasons" : ""}
// 							</option>
// 						))}
// 					</select>
// 				</div> */}

// 				{/*  CREATE POST INPUT */}
// 				<CreatePost />

// 				{/* POSTS */}
// 				<Posts feedType={feedType} selectedSeason={selectedSeason} />
// 			</div>
// 		</>
// 	);
// };

// export default HomePage;

//old

//new changed ui a bit
import { useState } from "react";
import Posts from "../../components/common/Posts";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");
  const [selectedSeason, setSelectedSeason] = useState("all");

  return (
    <div className="flex-[4_4_0] mt-[120px] mr-auto border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-950">
      {/* Header */}
      <div className="flex w-full border-b border-gray-200 dark:border-gray-800">
        {/* <div
          className={
            "flex justify-center flex-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition duration-300 cursor-pointer relative"
          }
          onClick={() => setFeedType("forYou")}
        >
          <span className="text-gray-900 dark:text-gray-100">For you</span>
          {feedType === "forYou" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-gray-900 dark:bg-gray-100"></div>
          )}
        </div>
        <div
          className="flex justify-center flex-1 p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition duration-300 cursor-pointer relative"
          onClick={() => setFeedType("following")}
        >
          <span className="text-gray-900 dark:text-gray-100">Following</span>
          {feedType === "following" && (
            <div className="absolute bottom-0 w-10 h-1 rounded-full bg-gray-900 dark:bg-gray-100"></div>
          )}
        </div> */}
      </div>

      {/* POSTS */}
      <Posts feedType={feedType} selectedSeason={selectedSeason} />
    </div>
  );
};

export default HomePage;

//itenery
// import { useState } from "react";
// import Posts from "../../components/common/Posts";
// import ItinerarySidebar from "../../components/itinerary/ItinerarySidebar";
// import { useItinerary } from "../../context/ItineraryContext.jsx";

// const HomePage = () => {
//   const [feedType, setFeedType] = useState("forYou");
//   const [selectedSeason, setSelectedSeason] = useState("all");
//   const [isItineraryOpen, setIsItineraryOpen] = useState(false);
//   const { itineraryItems } = useItinerary();

//   return (
//     <div className="flex flex-row">
//       <div className='flex-[4_4_0] mr-auto border-r border-gray-200 dark:border-gray-800 min-h-screen bg-white dark:bg-gray-950'>
//         {/* Existing Header Code */}
//         <div className="flex w-full justify-end p-4">
//           <button
//             onClick={() => setIsItineraryOpen(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <span>Itinerary</span>
//             {itineraryItems.length > 0 && (
//               <span className="bg-red-500 rounded-full px-2 py-1 text-xs">
//                 {itineraryItems.length}
//               </span>
//             )}
//           </button>
//         </div>
//         <Posts feedType={feedType} selectedSeason={selectedSeason} />
//       </div>

//       {isItineraryOpen && (
//         <ItinerarySidebar
//           onClose={() => setIsItineraryOpen(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default HomePage;
