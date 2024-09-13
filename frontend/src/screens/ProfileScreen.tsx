import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { Conversation, UserInfo } from "@/utils/types";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProfileField from "@/components/Profile/ProfileField";
import ProfileListField from "@/components/Profile/ProfileListField";
import ConnectSocials from "@/components/Profile/ConnectSocials";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import {
  useDisconnectUserMutation,
  useGetCurrentUserMutation,
  useGetUserByIdMutation,
  useGetUserQuery,
  useSendRequestMutation,
} from "@/slices/usersApiSlice";
import { Button } from "@/components/ui/button"; // Import Button for Connect
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { setCredentials } from "@/slices/authSlice";
import {
  useCreateConversationMutation,
  useGetConversationsMutation,
} from "@/slices/chatApiSlice";
import ConnectionsDialog from "@/components/Profile/ConnectionsDialog";

const ProfileScreen = () => {
  const { username } = useParams<{ username: string }>();
  const { userInfo, connections: currentUserConnections } = useSelector(
    (state: RootState) => state.auth
  ) as {
    userInfo: UserInfo;
    connections: UserInfo[] | null;
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetUserQuery(username);
  const [profileData, setProfileData] = useState<UserInfo | null>(null);
  const isCurrentUser = userInfo?.username === username;
  const [connections, setConnections] = useState<UserInfo[] | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  const [sendRequest, { isLoading: sendingReqLoading }] =
    useSendRequestMutation();
  const [getMe, { isLoading: loadingMe }] = useGetCurrentUserMutation();
  const [getConversations] = useGetConversationsMutation();
  const [createConversation] = useCreateConversationMutation();
  const [disconnectUser] = useDisconnectUserMutation();
  const [getUser] = useGetUserByIdMutation();

  useEffect(() => {
    if (!isCurrentUser) {
      setProfileData(data);
      const fetchConnections = async () => {
        const fetchedConnections: UserInfo[] = [];
        for (const connection of data.connections || []) {
          if (connection.status === "connected") {
            try {
              const data = await getUser(connection.userId).unwrap();
              if (data) {
                fetchedConnections.push(data);
              }
            } catch (error) {
              console.error(`Error fetching user ${connection.userId}:`, error);
            }
            continue;
          }
        }
        setConnections(fetchedConnections);
      };
      fetchConnections();
    } else {
      setProfileData(userInfo);
    }
  }, [data, getUser, isCurrentUser, userInfo]);

  const handleConnect = async () => {
    console.log("Connect button clicked");
    if (connectionStatus === "connected") {
      await disconnectUser(profileData?._id);
    } else {
      await sendRequest(profileData?._id);
    }
    const res = await getMe({}).unwrap();
    dispatch(setCredentials({ ...res }));
  };

  const handleMessage = async () => {
    try {
      const data = {
        senderId: userInfo?._id,
        receiverId: profileData?._id,
      };
      // Create a new conversation or find an existing one
      const result = await createConversation(data);

      let conversation = await result.data;

      console.log(conversation);

      if (!conversation) {
        // Fetch all conversations for the current user
        const conversations = await getConversations({}).unwrap();

        // Find the conversation where either participant matches the profile user
        conversation = await conversations.find((conv: Conversation) =>
          conv.participants.some(
            (participant) => participant._id === profileData?._id
          )
        );

        if (conversation) {
          console.log(conversation);
          navigate(`/messages/${conversation._id}`);
        } else {
          navigate("/messages");
        }
      } else {
        navigate(`/messages`);
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  useEffect(() => {
    if (profileData && !isCurrentUser) {
      const connection = userInfo.connections?.find(
        (conn) => conn.userId === profileData._id
      );
      if (connection) {
        setConnectionStatus(connection.status);
      } else {
        setConnectionStatus(null);
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
                            profileData.avatar ||
                            "https://github.com/github.png"
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
                        <ConnectionsDialog
                          profileData={profileData}
                          connections={
                            isCurrentUser ? currentUserConnections : connections
                          }
                        />

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
                          <>
                            <Button
                              variant={
                                connectionStatus === "connected"
                                  ? "destructive"
                                  : "default"
                              }
                              disabled={connectionStatus === "pending"}
                              className="mt-4 w-full"
                              onClick={handleConnect}
                            >
                              {sendingReqLoading || loadingMe
                                ? "Sending..."
                                : connectionStatus === "pending"
                                ? "Pending"
                                : connectionStatus === "connected"
                                ? "Disconnect"
                                : "Connect"}
                            </Button>

                            <Button
                              variant="default"
                              className="mt-2 w-full"
                              onClick={handleMessage}
                            >
                              {/* <FaEnvelope className="mr-2" /> */}
                              Message
                            </Button>

                            <Button variant="default" className="mt-2 w-full">
                              Confluence
                            </Button>
                          </>
                        )}
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
                      {/* <ProfileListField
                        title="Connection Skills"
                        value={profileData.connectionPreferences?.skills}
                        editable={isCurrentUser}
                      /> */}
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
