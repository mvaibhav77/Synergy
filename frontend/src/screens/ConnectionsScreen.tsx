import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import ProfileCards from "@/components/Recommendations/ProfileCards";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState, useAppDispatch } from "@/store";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { UserInfo } from "@/utils/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useApproveRequestMutation,
  useGetCurrentUserMutation,
  useGetUserByIdMutation,
  useRejectRequestMutation,
} from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";
import InvitationsCard from "@/components/Connections/InvitationCard";

// const dummyInvitations = [
//   {
//     _id: "1",
//     name: "John Doe",
//     bio: "Software Engineer at TechCorp",
//     avatar: "/path/to/avatar1.jpg",
//   },
//   {
//     _id: "2",
//     name: "Jane Smith",
//     bio: "Product Manager at InnovateX",
//     avatar: "/path/to/avatar2.jpg",
//   },
// ];

const ConnectionsScreen = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [connections, setConnections] = useState<UserInfo[]>([]);
  const [requests, setRequests] = useState<UserInfo[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(true);
  const dispatch = useAppDispatch();

  const [getUser] = useGetUserByIdMutation();
  const [getMe, { isLoading: loadingMe }] = useGetCurrentUserMutation();

  const [approve, { isLoading: approveLoading }] = useApproveRequestMutation();
  const [reject, { isLoading: rejectLoading }] = useRejectRequestMutation();

  useEffect(() => {
    if (!userInfo) return;

    const fetchConnections = async () => {
      const fetchedConnections: UserInfo[] = [];
      const fetchedRequests: UserInfo[] = [];
      // Loop through the connections and fetch details using useGetUserQuery for each connection's userId
      for (const connection of userInfo.connections || []) {
        if (connection.status === "pending") {
          try {
            const data = await getUser(connection.userId).unwrap();
            console.log(data);
            if (data) {
              fetchedRequests.push(data);
            }
          } catch (error) {
            console.error(`Error fetching user ${connection.userId}:`, error);
          }
          continue;
        }

        if (connection.status !== "connected") continue;
        try {
          const data = await getUser(connection.userId).unwrap();
          console.log(data);
          if (data) {
            fetchedConnections.push(data);
          }
        } catch (error) {
          console.error(`Error fetching user ${connection.userId}:`, error);
        }
      }
      setConnections(fetchedConnections);
      setRequests(fetchedRequests);
      setLoadingConnections(false);
    };

    fetchConnections();
  }, [getUser, userInfo]);

  const handleApprove = async (id: string) => {
    console.log(`Approved user with ID: ${id}`);
    await approve(id);
    const res = await getMe({}).unwrap();
    dispatch(setCredentials({ ...res }));
    // Logic to approve the connection
  };

  const handleReject = async (id: string) => {
    console.log(`Rejected user with ID: ${id}`);
    await reject(id);
    const res = await getMe({}).unwrap();
    dispatch(setCredentials({ ...res }));
    // Logic to reject the connection
  };

  return (
    <Page>
      <div className={`border-x-[1px] ${MIN_SECTION_HEIGHT} border-gray-500`}>
        <PageHeader title="My Connections" />
        <Tabs defaultValue="Connections" className="w-full">
          <div className="tabs p-4 ">
            <TabsList>
              <TabsTrigger className="text-lg" value="Invitations">
                Invitations
              </TabsTrigger>
              <TabsTrigger className="text-lg" value="Connections">
                Connections
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />

          {/* Invitations Tab */}
          <TabsContent value="Invitations" className="py-4 px-6">
            {requests.length === 0 ? (
              <div>No invitations at the moment.</div>
            ) : (
              <div className="space-y-4">
                {requests.map((invitation) => (
                  // <Card key={invitation._id}>
                  //   <CardContent className="flex items-center justify-between  p-4 rounded-lg">
                  //     {/* Avatar */}
                  //     <div className="flex items-center">
                  //       <img
                  //         src={
                  //           invitation.avatar || "https://github.com/shadcn.png"
                  //         }
                  //         alt={`${invitation.name}'s avatar`}
                  //         className="w-12 h-12 rounded-full object-cover mr-4"
                  //       />
                  //       <div>
                  //         <h4 className="text-lg font-semibold">
                  //           {invitation.name}
                  //         </h4>
                  //         <p className="text-sm text-gray-600">
                  //           {invitation.bio}
                  //         </p>
                  //       </div>
                  //     </div>

                  //     {/* Approve/Reject buttons */}
                  //     <div className="flex space-x-2">
                  //       <Button onClick={() => handleApprove(invitation._id)}>
                  //         {approveLoading || loadingMe ? <Loader /> : "Approve"}
                  //       </Button>
                  //       <Button
                  //         variant="destructive"
                  //         onClick={() => handleReject(invitation._id)}
                  //       >
                  //         {rejectLoading || loadingMe ? <Loader /> : "Reject"}
                  //       </Button>
                  //     </div>
                  //   </CardContent>
                  // </Card>
                  <InvitationsCard
                    key={invitation._id}
                    user={invitation}
                    handleApprove={handleApprove}
                    handleReject={handleReject}
                    rejectLoading={rejectLoading}
                    loadingMe={loadingMe}
                    approveLoading={approveLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Connections Tab */}
          <TabsContent value="Connections" className="py-4 px-6">
            {loadingConnections ? (
              <div>Loading connections...</div>
            ) : connections.length === 0 ? (
              <div>No connections found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {connections.map((user) => (
                  <ProfileCards
                    key={user._id}
                    name={user.name}
                    username={user.username}
                    similarity={user.similarityScore || 0} // Assuming you have similarityScore in the data
                    bio={user.bio}
                    avatar={user.avatar}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
};

export default ConnectionsScreen;
