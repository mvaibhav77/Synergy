import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Sidemenu from "@/components/SidemenuLeft";
import SidemenuRight from "@/components/SidemenuRight";

import { useSelector } from "react-redux";
import { RootState } from "./store";
import { useState } from "react";

const App = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [sideMenuOpen, setSideMenuOpen] = useState<boolean>(false);
  const location = useLocation();
  const isMessagesRoute = location.pathname.startsWith('/messages');

  const handleSideMenu = (value: boolean) => {
    setSideMenuOpen(value);
  };

  return (
    <>
      <Header handleSideMenu={handleSideMenu} />
      <main className="w-full mx-auto bg-background">
        {userInfo ? (
          <div className="grid lg:grid-cols-11 min-h-[calc(100vh-100px)]">
            {/* side menu */}
            <div
              id="sidemenu"
              className={`lg:block ${sideMenuOpen ? "block" : "hidden"
                } fixed lg:static z-50 top-0 left-0 lg:w-64 w-auto h-full lg:h-auto bg-black lg:bg-transparent shadow-lg lg:shadow-none lg:col-span-2`}
            >
              <Sidemenu handleSideMenu={handleSideMenu} />
            </div>

            {/* main section */}
            <div className={`${isMessagesRoute ? 'lg:col-span-9 mr-12' : 'lg:col-span-6'}`}>
              <Outlet />
            </div>

            {/* SIDE MENU RIGHT */}
            {!isMessagesRoute && (
              <div className="lg:col-span-3">
                <SidemenuRight />
              </div>
            )}
          </div>
        ) : (
          <Outlet />
        )}
      </main>
    </>
  );
};

export default App;
