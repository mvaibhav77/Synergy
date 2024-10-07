import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { ModeToggle } from "@/components/ToggleTheme";
import { Link } from "react-router-dom"; // For navigation
import { FaBell, FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Icons
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice"; // Your API slice for logout
import { logout } from "../slices/authSlice"; // Your auth slice
import { rlogout } from "../slices/recommendSlice";
import { RootState } from "@/store";
import { MdOutlineMenu } from "react-icons/md";
import { useEffect, useState } from "react";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Search from "./Search";

type Props = {
  handleSideMenu: (value: boolean) => void;
};

const Header = (props: Props) => {
  const { userInfo } = useSelector((state: RootState) => state.auth); // Adjust based on your state type
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [hideHeader, setHideHeader] = useState<boolean>(false);
  const [notifications] = useState([
    {
      title: "New Notification",
      from: "System",
      description: "This is a new notification",
      date: "2022-01-01",
    },
    {
      title: "New Notification",
      from: "System",
      description: "This is a new notification",
      date: "2022-01-01",
    },
    {
      title: "New Notification",
      from: "System",
      description: "This is a new notification",
      date: "2022-01-01",
    },
  ]);

  useEffect(() => {
    if (
      window.location.pathname === "/login" ||
      window.location.pathname === "/register"
    ) {
      setHideHeader(true);
    } else {
      setHideHeader(false);
    }
  }, [window.location.pathname]);

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
    <header
      className={`w-full mx-auto bg-background p-4 py-2 border-b-[1px] border-x-[1px] z-20 lg:px-12  ${
        userInfo ? "border-white-700" : "border-transparent"
      } ${hideHeader ? "hidden" : ""}`}
    >
      <div className=" mx-auto flex justify-between items-center">
        {/* hamburger for side menu */}
        {userInfo && (
          <Button
            variant="outline"
            onClick={() => props.handleSideMenu(true)}
            className="lg:hidden text-3xl"
          >
            <MdOutlineMenu />
          </Button>
        )}

        {/* Brand */}
        <Link to="/" className="flex items-center lg:text-2xl text-xl font-bold">
          <img src="../../logo-synergy.png" alt="Logo" className="h-8 w-8 mr-2" />
          Synergy
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            {/* Search */}
            {userInfo && <Search />}

            {/* Notifications */}
            {userInfo && (
              <NavigationMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={"ghost"}
                      className="flex rounded-xl items-center space-x-2 text-lg"
                    >
                      <FaBell />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[400px]">
                    <DropdownMenuLabel className="p-4">
                      <h3 className="text-lg font-bold">Notifications</h3>
                    </DropdownMenuLabel>
                    {notifications.map((item, index) => (
                      <DropdownMenuItem key={index} asChild>
                        <Button
                          variant={"outline"}
                          className="w-full h-full flex flex-col items-start p-4 border-b-[1px] border-white-700"
                        >
                          <h4 className="text-lg font-bold">{item.title}</h4>
                          <p className="text-sm">{item.description}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </Button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>
            )}

            {/* theme toggler */}
            <ModeToggle />

            {userInfo ? (
              <>
                {/* User Dropdown */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex rounded-xl py-4 items-center space-x-2 h-12"
                      >
                        {/* Avatar */}
                        <img
                          src={
                            userInfo.avatar || "https://github.com/guthub.png"
                          }
                          alt="avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        {/* Name and Email */}
                        <div className="flex flex-col items-start py-4">
                          <span className="text-lg">{userInfo.name}</span>
                          <span className="text-xs text-gray-500">
                            {userInfo.email}
                          </span>
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-full">
                      <DropdownMenuItem asChild>
                        <Link to={`/${userInfo.username}`}>Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logoutHandler}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem className="lg:block hidden">
                  <NavigationMenuLink asChild>
                    <Link to="/login" className="flex items-center">
                      <FaSignInAlt className="mr-1" /> Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className="lg:block hidden">
                  <NavigationMenuLink asChild>
                    <Link to="/register" className="flex items-center">
                      <FaSignOutAlt className="mr-1" /> Sign Up
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </header>
  );
};

export default Header;
