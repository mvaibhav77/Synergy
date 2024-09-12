import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { UserInfo } from "@/utils/types";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileField from "@/components/Profile/ProfileField";
import ProfileListField from "@/components/Profile/ProfileListField";
import ConnectSocials from "@/components/Profile/ConnectSocials";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  useGetCurrentUserMutation,
  useGetUserQuery,
} from "@/slices/usersApiSlice";
import { Button } from "@/components/ui/button"; // Import Button for Connect
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { useSendRequestMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";

const ProfileScreen = () => {
  const { username } = useParams<{ username: string }>();
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, error, isLoading } = useGetUserQuery(username);

  if (error) {
    navigate("/");
  }

  const [profileData, setProfileData] = useState<UserInfo | null>(null);
  const isCurrentUser = userInfo?.username === username;
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null); // State to manage connection status

  const [sendRequest, { isLoading: sendingReqLoading }] =
    useSendRequestMutation();
  const [getMe, { isLoading: loadingMe }] = useGetCurrentUserMutation();

  useEffect(() => {
    // Fetch profile data based on username
    if (!isCurrentUser) {
      setProfileData(data);
    } else {
      setProfileData(userInfo);
    }
  }, [data, isCurrentUser, userInfo]);

  const handleConnect = async () => {
    // Add connection logic here (e.g., API call to send connection request)
    console.log("Connect button clicked");
    await sendRequest(profileData?._id);
    const res = await getMe({}).unwrap();
    dispatch(setCredentials({ ...res }));
  };

  useEffect(() => {
    if (profileData && !isCurrentUser) {
      // Check the connection status between the logged-in user and the profile being viewed
      const connection = userInfo.connections?.find(
        (conn) => conn.userId === profileData._id // Assuming profileData._id contains the userId
      );
      console.log(userInfo.connections);
      if (connection) {
        console.log(connection.status);
        setConnectionStatus(connection.status); // Set the status (pending, connected, rejected)
      } else {
        setConnectionStatus(null); // No connection exists
      }
    }
  }, [isCurrentUser, profileData, userInfo, sendingReqLoading]);

  return (
    <Page>
      <div
        className={`border-x-[1px] ${MIN_SECTION_HEIGHT} border-gray-500 px-2`}
      >
        {!profileData || isLoading ? (
          <>Loading.....</>
        ) : (
          <>
            <PageHeader
              title={
                isCurrentUser ? "My Profile" : `${profileData.name}'s Profile`
              }
            />
            <ScrollArea className="h-[calc(100vh-160px)] mt-4">
              <div className="grid grid-cols-1 !items-stretch md:grid-cols-5 gap-4 px-4">
                <aside className="md:col-span-2 h-full">
                  <Card className="p-4 h-full">
                    <CardContent>
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={
                            profileData.avatar || "https://placehold.co/300x300"
                          }
                          alt="Profile Picture"
                          className="rounded-full w-40 h-40"
                        />
                        <h2 className="text-xl font-semibold flex gap-4">
                          {profileData.name}
                        </h2>
                        <p className="text-gray-500 italic">
                          {profileData.bio}
                        </p>
                        <div className="text-gray-500">
                          <span className="font-bold">Connections:</span>{" "}
                          {profileData?.connections?.length || 0}
                        </div>

                        {/* Social Media Section */}
                        {isCurrentUser && (
                          <div className="socialApps">
                            <h3 className="mb-2 p-2">Connected Social Apps</h3>
                            <div className="flex gap-4">
                              {profileData.socialMedia?.map((platform) => (
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
                              {profileData.socialMedia &&
                                profileData.socialMedia?.length < 3 && (
                                  <ConnectSocials
                                    socials={profileData.socialMedia}
                                  />
                                )}
                            </div>
                          </div>
                        )}

                        {/* Connect Button for non-current user's profile */}
                        {!isCurrentUser && (
                          <Button
                            variant="default"
                            className="mt-4 w-full"
                            onClick={handleConnect}
                          >
                            {sendingReqLoading || loadingMe
                              ? "Sending..."
                              : connectionStatus === "pending"
                              ? "Pending"
                              : connectionStatus === "connected"
                              ? "Connected"
                              : "Connect"}
                          </Button>
                        )}

                        {/* Make a message button is not current user which will redirect to the conversation between the current user and the user whone profile is opened */}
                        
                      </div>
                    </CardContent>
                  </Card>
                </aside>

                <main className="md:col-span-3 main-profile-section">
                  <Card className="py-4">
                    <CardContent>
                      <ProfileField
                        title={"Name"}
                        value={profileData.name}
                        editable={isCurrentUser}
                        valueClass="text-4xl font-bold"
                        titleClass="hidden"
                      />
                      <div className="other_fields">
                        <ProfileField
                          title="Email"
                          value={profileData.email}
                          editable={isCurrentUser}
                        />
                        <ProfileField
                          title="Username"
                          value={profileData.username}
                          editable={false}
                        />
                        <ProfileField
                          title="Profession"
                          value={profileData.profession}
                          editable={isCurrentUser}
                        />
                        <ProfileField
                          title="Bio"
                          value={profileData.bio}
                          editable={isCurrentUser}
                        />
                        <ProfileField
                          title="Location"
                          value={profileData.location}
                          editable={isCurrentUser}
                        />
                        {profileData?.skills && (
                          <ProfileListField
                            title="Skills"
                            value={profileData.skills}
                            editable={isCurrentUser}
                          />
                        )}
                        {profileData?.interests && (
                          <ProfileListField
                            title="Interests"
                            value={profileData.interests}
                            editable={isCurrentUser}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </main>
              </div>

              <div className="flex flex-col p-4">
                {/* Connection Preferences */}
                <Card className="py-4 h-fit">
                  <CardContent>
                    <h2 className="text-2xl mb-2 font-semibold">
                      Connection Preferences
                    </h2>
                    <div className="flex flex-col gap-4">
                      <ProfileListField
                        title="Connection Interests"
                        value={profileData.connectionPreferences?.interests}
                        editable={isCurrentUser}
                      />
                      <ProfileField
                        title="Search Proximity"
                        value={profileData.connectionPreferences?.proximity}
                        editable={isCurrentUser}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Static placeholder for more options */}
                <Card>
                  <CardContent>
                    <div className="addButton text-center font-bold pt-6">
                      MORE OPTIONS COMING SOON
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </Page>
  );
};

export default ProfileScreen;
