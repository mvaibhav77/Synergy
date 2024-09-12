import { Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Sidemenu from "./components/SidemenuLeft";
import { useSelector } from "react-redux";
import { RootState } from "./store";

const App = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Header />
      <main className="max-w-[1300px] mx-auto">
        {userInfo ? (
          <div className="grid grid-cols-4 min-h-[calc(100vh-100px)]">
            {/* side menu */}
            <div id="sidemenu">
              <Sidemenu />
            </div>

            {/* main section */}
            <div className="col-span-3">
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
