import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoCloseSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { FaHeart, FaStar } from "react-icons/fa";

const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const [placeName, setPlaceName] = useState("");
	const [location, setLocation] = useState("");
	const [bestSeasonToVisit, setBestSeasonToVisit] = useState("");
	const [likes, setLikes] = useState(0);
	const [rating, setRating] = useState(0);
	const imgRef = useRef(null);

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const {
		mutate: createPost,
		isPending,
		isError,
		error,
	} = useMutation({
		mutationFn: async ({ text, img, placeName, location, bestSeasonToVisit, likes, rating }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img, placeName, location, bestSeasonToVisit, likes, rating }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},

		onSuccess: () => {
			setText("");
			setImg(null);
			setPlaceName("");
			setLocation("");
			setBestSeasonToVisit("");
			setLikes(0);
			setRating(0);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!placeName || !location || !bestSeasonToVisit) {
			toast.error("Please fill in all required fields");
			return;
		}
		createPost({ text, img, placeName, location, bestSeasonToVisit, likes, rating });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleLike = () => {
		setLikes((prevLikes) => prevLikes + 1);
	};

	const handleRating = (value) => {
		setRating(value);
	};

	return (
	// 	<div className="space-y-4">
    //   {/* User Input Area */}
    //   <div className="flex gap-4">
    //     {/* User Avatar */}
    //     <div className="flex-shrink-0">
    //       <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-sky-400 flex items-center justify-center text-white font-semibold shadow-md">
    //         YT
    //       </div>
    //     </div>

    //     {/* Text Input Area */}
    //     <div className="flex-1 space-y-4">
    //       <textarea
    //         placeholder="Share your amazing travel experience..."
    //         className="w-full min-h-[120px] p-4 rounded-xl border border-sky-100 bg-sky-50/30 dark:bg-slate-800/50 dark:border-slate-700 placeholder-blue-400/70 dark:placeholder-blue-300/50 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none text-gray-700 dark:text-gray-200"
    //       />
          
    //       {/* Location Input */}
    //       <div className="flex items-center gap-2 px-4 py-2 bg-sky-50 dark:bg-slate-800/50 rounded-lg">
    //         <MapPin className="w-5 h-5 text-blue-500" />
    //         <input
    //           type="text"
    //           placeholder="Add location"
    //           className="flex-1 bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-200 placeholder-blue-400/70 dark:placeholder-blue-300/50"
    //         />
    //       </div>

    //       {/* Rating Input */}
    //       <div className="flex items-center gap-2">
    //         <div className="flex items-center gap-1">
    //           {[1, 2, 3, 4, 5].map((rating) => (
    //             <button
    //               key={rating}
    //               className="p-1 hover:transform hover:scale-110 transition-transform"
    //             >
    //               <Star
    //                 className="w-6 h-6 text-amber-400 hover:text-amber-500 transition-colors cursor-pointer"
    //                 fill="currentColor"
    //               />
    //             </button>
    //           ))}
    //         </div>
    //         <span className="text-sm text-blue-500 dark:text-blue-400">Rate your experience</span>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Action Buttons */}
    //   <div className="flex items-center justify-between pt-4 border-t border-sky-100 dark:border-slate-700">
    //     <div className="flex items-center gap-3">
    //       <button className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors group">
    //         <Image className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
    //       </button>
    //       <button className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors group">
    //         <Camera className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
    //       </button>
    //       <button className="p-2 rounded-lg hover:bg-sky-100 dark:hover:bg-slate-800 transition-colors group">
    //         <Smile className="w-6 h-6 text-blue-500 group-hover:text-blue-600 transition-colors" />
    //       </button>
    //     </div>

    //     <button className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 font-medium">
    //       <Send className="w-4 h-4" />
    //       <span>Share Post</span>
    //     </button>
    //   </div>
    // </div>





		
		<div className='flex p-4 items-start gap-4 border-b border-gray-700'>
			<div className='avatar'>
				<div className='w-8 rounded-full'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} alt="User avatar" />
				</div>
			</div>
			<form className='flex flex-col gap-2 w-full' onSubmit={handleSubmit}>
				<textarea
					className='textarea w-full p-0 text-lg resize-none border-none focus:outline-none border-gray-800'
					placeholder='What is happening?!'
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				<input
					type="text"
					placeholder="Name of the place *"
					value={placeName}
					onChange={(e) => setPlaceName(e.target.value)}
					className='input input-bordered w-full'
					required
				/>
				<input
					type="text"
					placeholder="Location *"
					value={location}
					onChange={(e) => setLocation(e.target.value)}
					className='input input-bordered w-full'
					required
				/>
				<select
					value={bestSeasonToVisit}
					onChange={(e) => setBestSeasonToVisit(e.target.value)}
					className='select select-bordered w-full'
					required
				>
					<option value="">Select best season to visit *</option>
					<option value="spring">Spring</option>
					<option value="summer">Summer</option>
					<option value="autumn">Autumn</option>
					<option value="winter">Winter</option>
				</select>
				{img && (
					<div className='relative w-72 mx-auto'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='w-full mx-auto h-72 object-contain rounded' alt="Selected image" />
					</div>
				)}

				{/* Like and Rating Section */}
				<div className='flex items-center gap-4 mt-2'>
					<div className='flex items-center'>
						<FaHeart
						 className='w-6 h-6 cursor-pointer'
							onClick={handleLike}
						/>
						<span className='ml-1'>{likes}</span>
					</div>
					<div className='flex items-center'>
						{[1, 2, 3, 4, 5].map((star) => (
							<FaStar
								key={star}
								className={`w-6 h-6 cursor-pointer ${rating >= star ? "text-yellow-500" : "text-gray-300"}`}
								onClick={() => handleRating(star)}
							/>
						))}
						<span className='ml-1'>{rating}</span>
					</div>
				</div>

				<div className='flex justify-between border-t py-2 border-t-gray-700'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='fill-primary w-6 h-6 cursor-pointer'
							onClick={() => imgRef.current.click()}
						/>
						<BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' />
					</div>
					<input type='file' accept='image/*' hidden ref={imgRef} onChange={handleImgChange} />
					<button className='btn btn-primary rounded-full btn-sm text-white px-4'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};

export default CreatePost;
