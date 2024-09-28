import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { Conversation, UserInfo } from "@/utils/types";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import Loader from "@/components/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditBasicProfile from "@/components/Profile/EditBasicProfile";
import Socials from "@/components/Profile/Socials";
import ProfileTabs from "@/components/Profile/ProfileTabs";

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

  const { data, isLoading, error } = useGetUserQuery(username);
  const [profileData, setProfileData] = useState<UserInfo | null>(null);
  const isCurrentUser = userInfo?.username === username;
  const [connections, setConnections] = useState<UserInfo[] | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [noSuchProfile, setNoSuchProfile] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ppOpen, setPpOpen] = useState<boolean>(false);
  const [sendRequest, { isLoading: sendingReqLoading }] =
    useSendRequestMutation();
  const [getMe, { isLoading: loadingMe }] = useGetCurrentUserMutation();
  const [getConversations] = useGetConversationsMutation();
  const [createConversation] = useCreateConversationMutation();
  const [disconnectUser] = useDisconnectUserMutation();
  const [getUser] = useGetUserByIdMutation();

  useEffect(() => {
    if (error) {
      // Handle cases where the profile doesn't exist
      setNoSuchProfile(true);
    } else if (data && !isCurrentUser) {
      setProfileData(data);
      const fetchConnections = async () => {
        const fetchedConnections: UserInfo[] = [];
        for (const connection of data.connections || []) {
          if (connection.status === "connected") {
            try {
              const connectionData = await getUser(connection.userId).unwrap();
              if (connectionData) {
                fetchedConnections.push(connectionData);
              }
            } catch (fetchError) {
              console.error(
                `Error fetching user ${connection.userId}:`,
                fetchError
              );
            }
          }
        }
        setConnections(fetchedConnections);
      };
      fetchConnections();
    } else {
      setProfileData(userInfo);
    }
  }, [data, error, getUser, isCurrentUser, userInfo]);

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

  const handleRemovePicture = () => {
    console.log("Remove Avatar clicked");
    // Logic for removing the avatar goes here
    setPpOpen(false);
  };

  const handleChangePicture = () => {
    console.log("Change Avatar clicked");
    // Logic for changing the avatar goes here (e.g., file input, API call)
    setPpOpen(false);
  };

  if (noSuchProfile)
    return (
      <Page>
        <div
          className={`border-x-[1px] ${MIN_SECTION_HEIGHT} border-gray-500 `}
        >
          <PageHeader title={`${username} Profile`} />
          <div className="flex items-center justify-center h-[500px] ">
            <h2 className="text-2xl">No such profile found</h2>
          </div>
        </div>
      </Page>
    );

  return (
    <Page>
      <div className={`border-x-[1px] ${MIN_SECTION_HEIGHT} border-gray-500`}>
        {!profileData || isLoading ? (
          <Loader />
        ) : (
          <>
            <PageHeader
              title={
                isCurrentUser ? "My Profile" : `${profileData.name}'s Profile`
              }
            />
            <ScrollArea className="h-[calc(100vh-160px)] mt-4">
              <div className="flex flex-col justify-center !items-stretch gap-4 px-4">
                {/* profile header */}
                <header className=" h-full">
                  {/* banner */}
                  <img
                    src={
                      profileData?.banner ||
                      "https://placehold.co/1200x300/gray/white?text=Profile+Banner&font=roboto"
                    }
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <Card className="p-4 h-full ">
                    <CardContent>
                      <div className="relative flex flex-row justify-between gap-4">
                        {/* profile avatar */}
                        <div className="profile-avatar absolute left-2 -top-36 p-2 bg-background rounded-full">
                          <Dialog>
                            <DialogTrigger>
                              <div className="avatar rounded-full w-48 h-48 cursor-pointer">
                                <img
                                  src={
                                    profileData.avatar ||
                                    "https://github.com/github.png"
                                  }
                                  alt="Profile Picture"
                                  className="rounded-full w-48 h-48"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <h2 className="text-lg font-semibold">
                                  Profile Picture
                                </h2>
                              </DialogHeader>
                              <div className="avatar-content flex flex-col items-center gap-4">
                                {/* Display the profile picture */}
                                <img
                                  src={
                                    profileData.avatar ||
                                    "https://github.com/github.png"
                                  }
                                  alt="Profile Picture"
                                  className="rounded-full w-40 h-40"
                                />

                                {/* Buttons for changing and removing the profile picture */}
                                <div className="flex gap-4">
                                  <Button
                                    className="bg-blue-500 text-white hover:bg-blue-600"
                                    onClick={() => handleChangePicture()}
                                  >
                                    Change
                                  </Button>
                                  <Button
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => handleRemovePicture()}
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <div className="basic-profile flex flex-col gap-2 mt-20">
                          <h2 className="text-3xl font-semibold flex gap-4">
                            {profileData.name}
                          </h2>
                          <p className="text-gray-500 italic">
                            {profileData.bio}
                          </p>
                          <div className="stats flex flex-row gap-6">
                            {/* connections */}
                            <ConnectionsDialog
                              profileData={profileData}
                              connections={
                                isCurrentUser
                                  ? currentUserConnections
                                  : connections
                              }
                            />

                            {/* Posts */}
                            <button className="text-gray-500 font-bold hover:text-inherit hover:underline w-fit text-inherit">
                              {profileData.posts?.length || 0}{" "}
                              <span className="text-primary">Posts</span>
                            </button>
                          </div>

                          {/* Connect Button for non-current user's profile */}
                          {!isCurrentUser && (
                            <div className="flex flex-row gap-2 items-center">
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
                                className={`mt-4 w-full bg-pbtn text-pbtn-foreground hover:text-black ${
                                  connectionStatus !== "connected"
                                    ? "hidden"
                                    : ""
                                }`}
                                onClick={handleMessage}
                              >
                                {/* <FaEnvelope className="mr-2" /> */}
                                Message
                              </Button>

                              <Button
                                className={`mt-4 w-full bg-sbtn text-sbtn-foreground hover:text-black ${
                                  connectionStatus !== "connected"
                                    ? "hidden"
                                    : ""
                                }`}
                              >
                                Confluence
                              </Button>
                            </div>
                          )}
                        </div>

                        {/* right section */}
                        <aside>
                          {/* edit button for current user */}
                          {isCurrentUser && (
                            <div className="edit-button flex flex-row items-center justify-end w-full">
                              <EditBasicProfile
                                name={profileData.name}
                                bio={profileData.bio}
                              />
                            </div>
                          )}

                          {/* Social Media Section */}
                          {isCurrentUser && <Socials userInfo={profileData} />}
                        </aside>
                      </div>
                    </CardContent>
                  </Card>
                </header>

                <main className="main-profile-section">
                  <ProfileTabs
                    profileData={profileData}
                    isCurrentUser={isCurrentUser}
                  />
                </main>
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </Page>
  );
};

export default ProfileScreen;
