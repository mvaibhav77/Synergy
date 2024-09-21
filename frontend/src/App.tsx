import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidemenu from "@/components/SidemenuLeft";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useState } from "react";

const App = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);

  const handleSideMenu = (value: boolean) => {
    setSideMenuOpen(value);
  };

  return (
    <>
      <Header handleSideMenu={handleSideMenu} />
      <main className="max-w-[1300px] mx-auto bg-background">
        {userInfo ? (
          <div className="grid lg:grid-cols-4 min-h-[calc(100vh-100px)]">
            {/* side menu */}
            <div
              id="sidemenu"
              className={`lg:block ${
                sideMenuOpen ? "block" : "hidden"
              } fixed lg:static z-50 top-0 left-0 lg:w-64 w-auto h-full lg:h-auto bg-black lg:bg-transparent shadow-lg lg:shadow-none`}
            >
              <Sidemenu handleSideMenu={handleSideMenu} />
            </div>

            {/* main section */}
            <div className="lg:col-span-3">
              <Outlet />
            </div>
          </div>
        ) : (
          <div className="-mt-20">
            <Outlet />
          </div>
        )}
      </main>
    </>
  );
};

export default App;
