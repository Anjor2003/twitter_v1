import Image from "next/image";
import SidebarMenuItems from "./SidebarMenuItems";
import { FaHome, FaRegClipboard, FaRegUser } from "react-icons/fa";
import {
  MdOutlineBookmarkBorder,
  MdOutlineForwardToInbox,
} from "react-icons/md";
import { CgMoreO } from "react-icons/cg";
import {
  HiDotsHorizontal,
  HiOutlineHashtag,
  HiOutlineIdentification,
} from "react-icons/hi";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

  return (
    <div className="hidden sm:flex flex-col p-2 lg:items-start fixed h-full lg:ml-4">
      {/* Logo */}
      <div className="hoverEfecct p-0 hover:bg-blue-100 lg:px-1 lg:py-1">
        <Image
          src="https://www.iconpacks.net/icons/2/free-twitter-logo-icon-2429-thumb.png"
          alt="logo Twiiter"
          width={40}
          height={40}
        ></Image>
      </div>

      {/* Menu */}

      <div className="mt-4 mb-2.5 lg:items-start">
        <SidebarMenuItems text="Home" Icon={FaHome} active />
        <SidebarMenuItems text="Explore" Icon={HiOutlineHashtag} />
        {session && (
          <>
            <SidebarMenuItems
              text="Notifications"
              Icon={HiOutlineIdentification}
            />
            <SidebarMenuItems text="Messages" Icon={MdOutlineForwardToInbox} />
            <SidebarMenuItems text="Bookmarks" Icon={MdOutlineBookmarkBorder} />
            <SidebarMenuItems text="lists" Icon={FaRegClipboard} />
            <SidebarMenuItems text="Profile" Icon={FaRegUser} />
            <SidebarMenuItems text="More" Icon={CgMoreO} />
          </>
        )}
      </div>

      {/* Button */}

      {session ? (
        <>
          {" "}
          <button className="bg-blue-400 text-white rounded-full w-48 xl:w-56 h-14 font-bold shadow-md hover:brightness-95 text-lg hidden lg:inline">
            Tweet
          </button>
          {/* Mini profile */}
          <div className="hoverEfecct text-gray-700 flex items-center justify-center lg:justify-start mt-8 lg:mt-10">
            <Image
              onClick={signOut}
              className="rounded-full lg:mr-2"
              src={session.user.image}
              alt="user-icono"
              width={40}
              height={40}
            />
            <div className="leading-5 hidden lg:inline">
              <h4 className="font-bold">{session.user.name}</h4>
              <p className="text-gray-500">@{session.user.username}</p>
            </div>
            <HiDotsHorizontal className="lg:ml-8 hidden lg:inline" />
          </div>
        </>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-400 text-white rounded-full w-36 h-14 font-bold shadow-md hover:brightness-95 text-lg hidden lg:inline"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
