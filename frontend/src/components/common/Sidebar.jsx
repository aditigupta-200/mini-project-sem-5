import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Navbar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <div className="fixed top-0 left-0 right-0 bg-gray-800 z-10">
      <div className="flex items-center justify-between p-2">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <XSvg className="w-12 h-12 fill-white hover:bg-stone-900" />
        </Link>

        {/* Navigation Links */}
        <ul className="flex gap-4">
          <li>
            <Link
              to="/"
              className="flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 text-white"
            >
              <MdHomeFilled className="w-6 h-6" />
              <span className="text-lg">Home</span>
            </Link>
          </li>
          {/* <li>
                        <Link
                            to='/notifications'
                            className='flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 text-white'
                        >
                            <IoNotifications className='w-6 h-6' />
                            <span className='text-lg'>Notifications</span>
                        </Link>
                    </li> */}
          <li>
            <Link
              to={`/profile/${authUser?.username}`}
              className="flex gap-2 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 px-4 text-white"
            >
              <FaUser className="w-6 h-6" />
              <span className="text-lg">Profile</span>
            </Link>
          </li>
        </ul>

        {/* User Profile and Logout */}
        {authUser && (
          <div className="flex items-center gap-6">
            {" "}
            {/* Increased gap here */}
            <Link
              to="/itinerary"
              className="flex text-white font-semibold items-center gap-2 hover:bg-gray-800 p-2 rounded"
            >
              <span>ITINERARY</span>
            </Link>
            <Link
              to={`/profile/${authUser.username}`}
              className="flex gap-2 items-center transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full text-white"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={authUser?.profileImg || "/avatar-placeholder.png"}
                    alt="User Avatar"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="font-bold text-sm truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
            </Link>
            <BiLogOut
              className="w-5 h-5 cursor-pointer text-white"
              onClick={(e) => {
                e.preventDefault();
                logout();
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
