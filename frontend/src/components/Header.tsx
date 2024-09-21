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
import { FaSignInAlt, FaSignOutAlt } from "react-icons/fa"; // Icons
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/usersApiSlice"; // Your API slice for logout
import { logout } from "../slices/authSlice"; // Your auth slice
import { rlogout } from "../slices/recommendSlice";
import { RootState } from "@/store";
import { MdOutlineMenu } from "react-icons/md";

type Props = {
  handleSideMenu: (value: boolean) => void;
};

const Header = (props: Props) => {
  const { userInfo } = useSelector((state: RootState) => state.auth); // Adjust based on your state type
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      className={`max-w-[1300px] mx-auto bg-background p-4 border-b-[1px] border-x-[1px]  ${
        userInfo ? "border-gray-500" : "border-transparent"
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
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
        <Link to="/" className=" text-xl font-bold">
          Synergy
        </Link>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            <ModeToggle />
            {userInfo ? (
              <>
                {/* User Dropdown */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">{userInfo.name}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
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
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/login" className="flex items-center">
                      <FaSignInAlt className="mr-1" /> Sign In
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
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
