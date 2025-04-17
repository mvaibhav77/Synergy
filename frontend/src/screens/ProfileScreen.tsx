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
  useConfluenceConnectionsMutation,
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
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditBasicProfile from "@/components/Profile/EditBasicProfile";
import Socials from "@/components/Profile/Socials";
import ProfileTabs from "@/components/Profile/ProfileTabs";
import { Camera, Edit, FileText, Globe, Linkedin, Github, Loader2, MessageCircle, Sparkles, Twitter, Trash2, UserMinus, UserPlus, Users } from "lucide-react";

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
  const [confluenceConnections, { isLoading: confluenceLoading }] =
    useConfluenceConnectionsMutation();

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

  const handleConfluence = () => {
    console.log("Confluence button clicked");
    confluenceConnections(profileData?.username);
    // Logic for Confluence button goes
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
                <header className="h-full">
                  {/* banner */}
                  <img
                    src={
                      profileData?.banner ||
                      "https://placehold.co/1200x300/gray/white?text=Profile+Banner&font=roboto"
                    }
                    alt="Banner"
                    className="w-full h-full object-cover"
                  />
                  <Card className="p-4 h-full">
                    <CardContent>
                      <div className="relative flex flex-row justify-between gap-4">
                        {/* profile avatar */}
                        <div className="profile-avatar absolute -left-6 -top-24 p-2 bg-background rounded-full">
                          <Dialog>
                            <DialogTrigger>
                              <div className="avatar rounded-full w-32 h-32 cursor-pointer">
                                <img
                                  src={
                                    profileData.avatar ||
                                    "https://github.com/github.png"
                                  }
                                  alt="Profile Picture"
                                  className="rounded-full w-32 h-32"
                                />
                              </div>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Profile Picture</DialogTitle>
                              </DialogHeader>
                              <div className="avatar-content flex flex-col items-center gap-4">
                                {/* Display the profile picture */}
                                <img
                                  src={
                                    profileData.avatar ||
                                    "https://github.com/github.png"
                                  }
                                  alt="Profile Picture"
                                  className="rounded-full w-32 h-32"
                                />

                                {/* Buttons for changing and removing the profile picture */}
                                <div className="flex gap-4">
                                  <Button
                                    variant="default"
                                    onClick={() => handleChangePicture()}
                                  >
                                    Change
                                  </Button>
                                  <Button
                                    variant="destructive"
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
                          <div className="flex items-center gap-2">
                            <div>
                              <h2 className="text-lg md:text-xl font-bold">{profileData.name}</h2>
                              <p className="text-sm text-muted-foreground">@{profileData.username}</p>
                            </div>
                            {isCurrentUser && (
                              <EditBasicProfile
                                name={profileData.name}
                                bio={profileData.bio}
                              />
                            )}
                          </div>
                          <p className=" text-base">{profileData.bio}</p>
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

                      
                            <button className="dark:text-gray-300 text-gray-600 font-semibold  hover:text-inherit  w-fit text-base">
                              <span className="font-base">{profileData.posts?.length || 0}</span>{" "}
                              <span className="text-base">Posts</span>
                            </button>
                          </div>

                       
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
                                Message
                              </Button>

                              <Button
                                className={`mt-4 w-full bg-sbtn text-sbtn-foreground hover:text-black ${
                                  connectionStatus !== "connected"
                                    ? "hidden"
                                    : ""
                                }`}
                                onClick={handleConfluence}
                              >
                                {confluenceLoading ? <Loader2 /> : "Confluence"}
                              </Button>
                            </div>
                          )}
                        </div> 

                        {/* right section */}
                        <aside>
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
    // <Page>
    //    <div className="border-x border-border min-h-screen">
    //   <div className="relative">
    //     {/* Banner with overlay gradient */}
    //     <div className="relative h-64 overflow-hidden">
    //       <img
    //         src={profileData?.banner || "/placeholder.svg"}
    //         alt="Profile Banner"
    //         className="w-full h-full object-cover"
    //       />
    //       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90"></div>
    //     </div>

    //     {/* Profile header with avatar */}
    //     <div className="container px-4 relative">
    //       <div className="flex flex-col md:flex-row gap-6">
    //         {/* Avatar section */}
    //         <div className="relative -mt-20 z-10">
    //           <Dialog>
    //             <DialogTrigger asChild>
    //               <div className="relative group cursor-pointer">
    //                 <div className="w-36 h-36 rounded-full border-4 border-background overflow-hidden bg-muted">
    //                   <img
    //                     src={profileData?.avatar || "/placeholder.svg"}
    //                     alt={`${profileData?.name}'s profile picture`}
    //                     className="w-full h-full object-cover"
    //                   />
    //                 </div>
    //                 {isCurrentUser && (
    //                   <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
    //                     <Camera className="text-white w-8 h-8" />
    //                   </div>
    //                 )}
    //               </div>
    //             </DialogTrigger>
    //             <DialogContent>
    //               <DialogHeader>
    //                 <h2 className="text-xl font-semibold">Profile Picture</h2>
    //               </DialogHeader>
    //               <div className="flex flex-col items-center gap-6 py-4">
    //                 <div className="w-48 h-48 rounded-full overflow-hidden">
    //                   <img
    //                     src={profileData?.avatar || "/placeholder.svg"}
    //                     alt="Profile Picture"
    //                     className="w-full h-full object-cover"
    //                   />
    //                 </div>
    //                 <div className="flex gap-4">
    //                   <Button onClick={handleChangePicture} className="gap-2">
    //                     <Camera className="w-4 h-4" />
    //                     Change
    //                   </Button>
    //                   <Button variant="destructive" onClick={handleRemovePicture} className="gap-2">
    //                     <Trash2 className="w-4 h-4" />
    //                     Remove
    //                   </Button>
    //                 </div>
    //               </div>
    //             </DialogContent>
    //           </Dialog>
    //         </div>

    //         {/* Profile info section */}
    //         <div className="flex-1 pt-2 md:pt-6">
    //           <div className="flex flex-col md:flex-row justify-between gap-4">
    //             <div className="space-y-3">
    //               <div className="flex items-center gap-3">
    //                 <h1 className="text-2xl md:text-3xl font-bold">{profileData?.name}</h1>
    //                 {isCurrentUser && (
    //                   <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
    //                     <Edit className="h-4 w-4" />
    //                   </Button>
    //                 )}
    //               </div>
    //               <p className="text-muted-foreground">{profileData?.bio}</p>

    //               <div className="flex flex-wrap gap-4 pt-1">
    //                 <div className="flex items-center gap-1.5">
    //                   <Users className="w-4 h-4 text-muted-foreground" />
    //                   {/* <span className="font-medium">{profileData?.connection.length}</span> */}
    //                   <span className="text-muted-foreground">Connections</span>
    //                 </div>
    //                 <div className="flex items-center gap-1.5">
    //                   <FileText className="w-4 h-4 text-muted-foreground" />
    //                   <span className="font-medium">{profileData?.posts?.length || 0}</span>
    //                   <span className="text-muted-foreground">Posts</span>
    //                 </div>
    //               </div>
    //             </div>

    //             {/* Action buttons */}
    //             {!isCurrentUser ? (
    //               <div className="flex flex-col sm:flex-row gap-2 self-start mt-2">
    //                 <Button
    //                   variant={connectionStatus === "connected" ? "destructive" : "default"}
    //                   disabled={connectionStatus === "pending"}
    //                   className="gap-2"
    //                   onClick={handleConnect}
    //                 >
    //                   {sendingReqLoading || loadingMe ? (
    //                     <Loader2 className="h-4 w-4 animate-spin" />
    //                   ) : connectionStatus === "connected" ? (
    //                     <UserMinus className="h-4 w-4" />
    //                   ) : (
    //                     <UserPlus className="h-4 w-4" />
    //                   )}
    //                   {connectionStatus === "pending"
    //                     ? "Pending"
    //                     : connectionStatus === "connected"
    //                       ? "Disconnect"
    //                       : "Connect"}
    //                 </Button>

    //                 {connectionStatus === "connected" && (
    //                   <>
    //                     <Button variant="outline" className="gap-2" onClick={handleMessage}>
    //                       <MessageCircle className="h-4 w-4" />
    //                       Message
    //                     </Button>
    //                     <Button
    //                       variant="secondary"
    //                       className="gap-2"
    //                       onClick={handleConfluence}
    //                       disabled={confluenceLoading}
    //                     >
    //                       {confluenceLoading ? (
    //                         <Loader2 className="h-4 w-4 animate-spin" />
    //                       ) : ( 
    //                         <Sparkles className="h-4 w-4" />
    //                       )}
    //                       Confluence
    //                     </Button>
    //                   </>
    //                 )}
    //               </div>
    //             ) : (
    //               <div className="flex flex-wrap gap-2 self-start">
    //                 {/* <SocialLinks socials={profileData?.socials} /> */}
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   {/* Main content */}
    //   <div className="container px-4 py-6">
    //     {/* <ProfileTabs isCurrentUser={isCurrentUser} /> */}
    //   </div>
    // </div>
    // </Page>
  );
};

export default ProfileScreen;
// function SocialLinks({ socials }) {
//   return (
//     <div className="flex flex-wrap gap-2">
//       {socials.github && (
//         <a href={`https://${socials.github}`} target="_blank" rel="noopener noreferrer">
//           <Button variant="outline" size="icon" className="rounded-full">
//             <Github className="h-4 w-4" />
//           </Button>
//         </a>
//       )}
//       {socials.twitter && (
//         <a href={`https://${socials.twitter}`} target="_blank" rel="noopener noreferrer">
//           <Button variant="outline" size="icon" className="rounded-full">
//             <Twitter className="h-4 w-4" />
//           </Button>
//         </a>
//       )}
//       {socials.linkedin && (
//         <a href={`https://${socials.linkedin}`} target="_blank" rel="noopener noreferrer">
//           <Button variant="outline" size="icon" className="rounded-full">
//             <Linkedin className="h-4 w-4" />
//           </Button>
//         </a>
//       )}
//       {socials.website && (
//         <a href={`https://${socials.website}`} target="_blank" rel="noopener noreferrer">
//           <Button variant="outline" size="icon" className="rounded-full">
//             <Globe className="h-4 w-4" />
//           </Button>
//         </a>
//       )}
//     </div>
//   )
// }
