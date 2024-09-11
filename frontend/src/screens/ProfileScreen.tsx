import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ConnectSocials from "@/components/Profile/ConnectSocials";
import ProfileField from "@/components/Profile/ProfileField";
import ProfileListField from "@/components/Profile/ProfileListField";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RootState } from "@/store";
import { UserInfo } from "@/utils/types";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import { useSelector } from "react-redux";
// Import necessary actions from your store (replace with actual actions)
// import { updateUserInfo } from "@/store/authSlice";

const ProfileScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };

  // const profileFields = [
  //   {
  //     title: "Name",
  //     type: "string",
  //   },
  //   {
  //     title: "Email",
  //     type: "email",
  //   },
  //   {
  //     title: "Username",
  //     type: "string",
  //   },
  //   {
  //     title: "Location",
  //     type: "string",
  //   },
  //   {
  //     title: "Skills",
  //     type: "list",
  //   },
  //   {
  //     title: "Interests",
  //     type: "list",
  //   },
  // ];

  return (
    <Page>
      <PageHeader title="Profile" />
      {/* profile cards */}
      <ScrollArea className="h-[calc(100vh-160px)]">
        <div className="grid grid-cols-1 !items-stretch md:grid-cols-5 gap-4 px-4">
          <aside className=" md:col-span-2 h-full">
            {/* Avatar, bio, connections number */}
            <Card className="p-4 h-full">
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <img
                    src="https://placehold.co/300x300"
                    alt="Profile Picture"
                    className="rounded-full w-40 h-40"
                  />
                  <h2 className="text-xl font-semibold flex gap-4">
                    {userInfo.name}
                  </h2>
                  <p className="text-gray-500 italic">{userInfo.bio}</p>
                  <div className="text-gray-500">
                    <span className="font-bold">Connections:</span>{" "}
                    {userInfo?.connections?.length || 0}
                  </div>
                  <div className="socialApps">
                    <h3 className="mb-2 p-2">Connected Social Apps</h3>
                    <div className="flex gap-4">
                      {userInfo.socialMedia?.map((platform) => (
                        <button key={platform.platform}>
                          {platform.platform === "github" && (
                            <FaGithub className="text-5xl text-white" />
                          )}
                          {platform.platform === "linkedin" && (
                            <FaLinkedin className="text-5xl text-white" />
                          )}
                          {platform.platform === "twitter" && (
                            <FaTwitter className="text-5xl text-white" />
                          )}
                        </button>
                      ))}
                      {userInfo.socialMedia &&
                        userInfo.socialMedia?.length < 3 && (
                          // add button
                          <ConnectSocials socials={userInfo.socialMedia} />
                        )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <main className="md:col-span-3 main-profile-section">
            <Card className="py-4 ">
              <CardContent>
                {/* name */}
                <ProfileField
                  title={"Name"}
                  value={userInfo.name}
                  editable={true}
                  valueClass="text-4xl font-bold"
                  titleClass="hidden"
                />
                <div className="other_fields">
                  <ProfileField
                    title="Email"
                    value={userInfo.email}
                    editable={true}
                  />
                  <ProfileField
                    title="Username"
                    value={userInfo.username}
                    editable={true}
                  />
                  <ProfileField
                    title="Profession"
                    value={userInfo.profession}
                    editable={true}
                  />
                  <ProfileField
                    title="Bio"
                    value={userInfo.bio}
                    editable={true}
                  />
                  <ProfileField
                    title="Location"
                    value={userInfo.location}
                    editable={true}
                  />
                  {userInfo?.skills && (
                    <div>
                      <ProfileListField
                        title="Skills"
                        value={userInfo.skills}
                        editable={true}
                      />
                    </div>
                  )}
                  {userInfo?.interests && (
                    <div>
                      <ProfileListField
                        title="Interests"
                        value={userInfo.interests}
                        editable={true}
                      />
                    </div>
                  )}
                  {/* ... other details with edit buttons */}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>

        <div className="flex flex-col gap-4 p-4">
          {/* edit card for connection preferences, these iclude one lists:- interests and a proximity number for location based matching*/}
          <Card className="py-4 h-fit">
            <CardContent>
              <h2 className="text-2xl mb-2 font-semibold">
                Connection Preferences
              </h2>
              <div className="flex flex-col gap-4">
                <ProfileListField
                  title="Connection Interests"
                  value={userInfo.connectionPreferences?.interests}
                  editable={true}
                />
                <ProfileField
                  title="Search Proximity"
                  value={userInfo.connectionPreferences?.proximity}
                  editable={true}
                />
              </div>
            </CardContent>
          </Card>

          {/* THIS WILL BE STATIC FOR NOW */}
          {/* add card for Add education lists (make this show peiece)*/}
          <Card>
            <CardContent>
              <div className="addButton text-center font-bold pt-6">
                MORE OPTIONS COMING SOON
              </div>
            </CardContent>
          </Card>

          {/* add card for Add work experience lists (make this show peiece)*/}

          {/* add card for Projects lists */}
        </div>
      </ScrollArea>

      {/* resume cards && connection preferences */}
    </Page>
  );
};

export default ProfileScreen;
