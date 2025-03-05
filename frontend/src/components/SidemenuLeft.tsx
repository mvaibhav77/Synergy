import { HomeIcon } from "@radix-ui/react-icons";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { MdRecommend } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { FaArrowLeft, FaBell, FaFacebookMessenger } from "react-icons/fa";
import { UserInfo } from "@/utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "@/slices/usersApiSlice";
import { logout } from "@/slices/authSlice";
import { rlogout } from "@/slices/recommendSlice";
import { Home, Users, MessagesSquare, Bell, Settings } from "lucide-react";
import { MdOutlineRecommend } from "react-icons/md";
type NavLink = {
  title: string;
  link: string;
  icon: JSX.Element;
};

const Sidemenu = ({
  handleSideMenu,
}: {
  handleSideMenu: (val: boolean) => void;
}) => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };
  const navigate = useNavigate();
  // const location = useLocation();
  // const { userInfo } = useSelector((state: RootState) => state.auth); // Adjust based on your state type
  const dispatch = useDispatch();
  // const navigate = useNavigate();

  const navList: NavLink[] = [
    // {
    //   title: "Home",
    //   link: "",
    //   icon: <HomeIcon className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Profile",
    //   link: userInfo?.username || "profile",
    //   icon: <CgProfile className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Recommendations",
    //   link: "recommendations",
    //   icon: <MdRecommend className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Connections",
    //   link: "connections",
    //   icon: <CgProfile className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Messages",
    //   link: "messages",
    //   icon: <FaFacebookMessenger className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Notifications",
    //   link: "notifications",
    //   icon: <FaBell className="h-[20px] w-[20px]" />,
    // },
    // {
    //   title: "Settings",
    //   link: "settings",
    //   icon: <IoSettingsOutline className="h-[20px] w-[20px]" />,
    // },
    {
      title: "Home",
      link: "",
      icon: <Home className="h-[20px] w-[20px]" />, // Lucide Home Icon
    },
    {
      title: "Profile",
      link: userInfo?.username || "profile",
      icon: <User className="h-[20px] w-[20px]" />, // Lucide User Icon
    },
    {
      title: "Recommendations",
      link: "recommendations",
      icon: <MdOutlineRecommend className="h-[20px] w-[20px]" />, // Material Design Recommend Icon
    },
    {
      title: "Connections",
      link: "connections",
      icon: <Users className="h-[20px] w-[20px]" />, // Lucide Users Icon
    },
    {
      title: "Messages",
      link: "messages",
      icon: <MessagesSquare className="h-[20px] w-[20px]" />, // Lucide Messages Icon
    },
    {
      title: "Notifications",
      link: "notifications",
      icon: <Bell className="h-[20px] w-[20px]" />, // Lucide Bell Icon
    },
    {
      title: "Settings",
      link: "settings",
      icon: <Settings className="h-[20px] w-[20px]" />, // Lucide Settings Icon
    },
  ];
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      dispatch(rlogout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <motion.div
      initial={{ x: -350 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={`${MIN_SECTION_HEIGHT} h-screen fixed lg:relative lg:h-[calc(100vh-100px)] lg:min-w-[250px] border-l-[1px] border-white-700 pt-4 pl-4 lg:px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex flex-col`}
    >
      <div className="flex-1 flex flex-col gap-4">
        <Button
          variant={"ghost"}
          className="w-fit text-2xl lg:hidden hover:scale-110 transition-transform"
          onClick={() => handleSideMenu(false)}
        >
          <FaArrowLeft />
        </Button>
        {navList.map((navItem, index) => (
          <NavLink
            to={navItem.link}
            key={index}
            className={({ isActive }) =>
              `py-3 w-full px-4 text-lg rounded-xl transition-all duration-200 hover:bg-secondary ${isActive ? "bg-secondary font-semibold" : ""
              }`
            }
            onClick={() => handleSideMenu(false)}
          >
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-row gap-4 items-center"
            >
              {navItem.icon}
              <span className="text">{navItem.title}</span>
            </motion.div>
          </NavLink>
        ))}
      </div>

      <div className="mt-auto ">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="lg" className="flex items-center gap-2 rounded-lg px-2 py-6 w-full">
              <Avatar className="h-9 w-9 rounded-lg">
                <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{userInfo.name}</span>
                <span className="truncate text-xs">{userInfo.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-9 w-9 rounded-lg">
                  <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{userInfo.name}</span>
                  <span className="truncate text-xs">{userInfo.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={`/${userInfo.username}`} className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logoutHandler}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

export default Sidemenu;
