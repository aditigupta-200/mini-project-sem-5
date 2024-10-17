import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import CreatePost from "../home/CreatePost";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const ProfilePage = () => {
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");

  const profileImgRef = useRef(null);

  const { username } = useParams();

  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
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

  // Fetch user posts by userId
  const { data: userPosts } = useQuery({
    queryKey: ["userPosts", user?._id],
    queryFn: async () => {
      const res = await fetch(`/api/posts/${user?._id}`); // Fetch posts by user ID
      if (!res.ok) {
        throw new Error("Error fetching posts");
      }
      return res.json();
    },
    enabled: !!user?._id, // Only fetch posts if user ID exists
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

  const isMyProfile = authUser?._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <>
      <div className="flex-[4_4_0] mt-[120px] border-r border-gray-200 dark:border-gray-800 min-h-screen dark:bg-gray-950">
        {/* HEADER */}
        {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
        {!isLoading && !isRefetching && !user && (
          <p className="text-center text-lg mt-4">User not found</p>
        )}
        <div className="flex flex-col items-center">
          {!isLoading && !isRefetching && user && (
            <>
              <div className="flex gap-10 px-4 py-2 items-center w-full">
                <Link to="/">
                  <FaArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex flex-col">
                  <p className="font-bold text-lg">{user?.fullName}</p>
                  <span className="text-sm text-slate-500">
                    {userPosts?.length} posts
                  </span>
                </div>
              </div>

              {/* PROFILE IMG CENTERED */}
              <div className="relative flex justify-center mt-6">
                <div className="avatar w-32 h-32 rounded-full relative group">
                  <img
                    src={
                      profileImg ||
                      user?.profileImg ||
                      "/avatar-placeholder.png"
                    }
                    className="w-full h-full object-cover rounded-full"
                  />
                  {isMyProfile && (
                    <div className="absolute top-2 right-2 p-1 bg-primary rounded-full group-hover:opacity-100 opacity-0 cursor-pointer">
                      <MdEdit
                        className="w-5 h-5 text-white"
                        onClick={() => profileImgRef.current.click()}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    ref={profileImgRef}
                    onChange={handleImgChange}
                  />
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex justify-end px-4 mt-4 w-full">
                {isMyProfile && <EditProfileModal authUser={authUser} />}
                {!isMyProfile && (
                  <button
                    className="btn btn-outline rounded-full btn-sm"
                    onClick={() => follow(user?._id)}
                  >
                    {isPending && "Loading..."}
                    {!isPending && amIFollowing && "Unfollow"}
                    {!isPending && !amIFollowing && "Follow"}
                  </button>
                )}
                {profileImg && (
                  <button
                    className="btn btn-primary rounded-full btn-sm text-white px-4 ml-2"
                    onClick={async () => {
                      await updateProfile({ profileImg });
                      setProfileImg(null);
                    }}
                  >
                    {isUpdatingProfile ? "Updating..." : "Update"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-4 mt-8 px-4 items-center">
                <div className="flex flex-col text-center">
                  <span className="font-bold text-lg">{user?.fullName}</span>
                  <span className="text-sm text-slate-500">
                    @{user?.username}
                  </span>
                  <span className="text-sm my-1">{user?.bio}</span>
                </div>

                <div className="flex gap-2 flex-wrap justify-center">
                  {user?.link && (
                    <div className="flex gap-1 items-center">
                      <FaLink className="w-3 h-3 text-slate-500" />
                      <a
                        href={user?.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {user?.link}
                      </a>
                    </div>
                  )}
                  <div className="flex gap-2 items-center">
                    <IoCalendarOutline className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-500">
                      {memberSinceDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.following.length}
                    </span>
                    <span className="text-slate-500 text-xs">Following</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <span className="font-bold text-xs">
                      {user?.followers.length}
                    </span>
                    <span className="text-slate-500 text-xs">Followers</span>
                  </div>
                </div>
              </div>

              {/* CreatePost component only visible on own profile */}
              {isMyProfile && (
                <div className="w-full px-4 py-6">
                  <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                    {/* Decorative Header Banner */}
                    <div className="relative h-24 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
                      {/* Decorative Travel Icons Background */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="flex justify-between items-center h-full px-6">
                          {[...Array(6)].map((_, i) => (
                            <span key={i} className="text-4xl">
                              ✈️ 🗺️ 🌎 🏔️ 🏖️ 🎒
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Banner Text */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Share Your Journey
                        </h2>
                      </div>
                    </div>

                    {/* Main Content Container */}
                    <div className="p-6">
                      {/* Inspirational Text */}
                      <div className="mb-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                          "Every journey has a story. What's yours?"
                        </p>
                      </div>

                      {/* Create Post Form Container */}
                      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-inner">
                        <div className="space-y-4">
                          {/* Post Creation Guidelines */}
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                  📸
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Share photos
                                </p>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                  📍
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Add location
                                </p>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                  🌟
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Rate experience
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Actual Create Post Component */}
                          <CreatePost />
                        </div>
                      </div>

                      {/* Footer Tips */}
                      <div className="mt-6 px-4">
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span>📸</span> Add photos
                          </span>
                          <span className="flex items-center gap-1">
                            <span>📝</span> Share details
                          </span>
                          <span className="flex items-center gap-1">
                            <span>💭</span> Tell your story
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Optional: Engagement Metrics */}
                  <div className="mt-4 flex justify-center gap-8">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Your Posts
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        24
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Places Visited
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        12
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        Total Reactions
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        156
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TABS */}
              <div className="flex justify-center gap-6 text-center my-4 border-b border-slate-800">
                <span
                  className={`pb-3 cursor-pointer ${
                    feedType === "posts" &&
                    "font-bold border-b-2 border-primary"
                  }`}
                  onClick={() => setFeedType("posts")}
                >
                  Posts
                </span>
                <span
                  className={`pb-3 cursor-pointer ${
                    feedType === "replies" &&
                    "font-bold border-b-2 border-primary"
                  }`}
                  onClick={() => setFeedType("replies")}
                >
                  Replies
                </span>
                <span
                  className={`pb-3 cursor-pointer ${
                    feedType === "likes" &&
                    "font-bold border-b-2 border-primary"
                  }`}
                  onClick={() => setFeedType("likes")}
                >
                  Likes
                </span>
              </div>

              {/* FEED */}
              <Posts posts={userPosts} />
            </>
          )}

          <Posts feedType={feedType} username={username} userId={user?._id} />
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
