import { HomeIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdRecommend } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { FaBell, FaFacebookMessenger } from "react-icons/fa";
import { UserInfo } from "@/utils/types";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type NavLink = {
  title: string;
  link: string;
  icon: JSX.Element;
};

const Sidemenu = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };

  const navList: NavLink[] = [
    {
      title: "Home",
      link: "",
      icon: <HomeIcon className="h-[25px] w-[25px]" />,
    },
    {
      title: "Profile",
      link: userInfo?.username || "profile",
      icon: <CgProfile className="h-[25px] w-[25px]" />,
    },
    {
      title: "Recommendations",
      link: "recommendations",
      icon: <MdRecommend className="h-[25px] w-[25px]" />,
    },
    {
      title: "Connections",
      link: "connections",
      icon: <CgProfile className="h-[25px] w-[25px]" />,
    },
    {
      title: "Messages",
      link: "messages",
      icon: <FaFacebookMessenger className="h-[25px] w-[25px]" />,
    },
    {
      title: "Notifications",
      link: "notifications",
      icon: <FaBell className="h-[25px] w-[25px]" />,
    },
    {
      title: "Settings",
      link: "settings",
      icon: <IoSettingsOutline className="h-[25px] w-[25px]" />,
    },
  ];
  return (
    <div
      className={`${MIN_SECTION_HEIGHT} h-full w- border-l-[1px]  border-gray-500 pt-4 px-2`}
    >
      <div className="flex flex-col gap-4">
        {navList.map((navItem, index) => (
          <NavLink
            to={navItem.link}
            key={index}
            className="py-3 w-fit px-4 text-xl rounded-3xl hover:bg-gray-800"
          >
            <div className="flex flex-row gap-4 items-center">
              {navItem.icon}
              <div className="text">{navItem.title}</div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
