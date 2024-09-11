import CreatePost from "./CreatePost";
import Page from "../Page";
// import { useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { UserInfo } from "@/utils/types";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import Sidemenu from "../SidemenuRight";
import Posts from "./Posts";

const Dashboard = () => {
  // const { userInfo } = useSelector((state: RootState) => state.auth) as {
  //   userInfo: UserInfo;
  // };
  return (
    <Page>
      <div
        className={`flex flex-col ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
      >
        <div className="grid grid-cols-3 h-100">
          {/* MAIN POST AREA */}
          <div
            className={`flex flex-col col-span-2 ${MIN_SECTION_HEIGHT} border-r-[1px] border-gray-500`}
          >
            {/* POST CREATION */}
            <CreatePost />

            {/* POSTS */}
            <Posts />
          </div>

          {/* SIDE MENU LEFT */}
          <Sidemenu />
        </div>
      </div>
    </Page>
  );
};

export default Dashboard;
