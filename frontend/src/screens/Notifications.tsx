import NotificationCard from "@/components/Notifications/NotificationCard";
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Notification } from "@/utils/types";

const dummyNotifications: Notification[] = [
  {
    _id: "64e1f6a1d45b45219b8a61d1",
    user: "64e1e7f8c2a455218b9b7c92", // Recipient's user ID
    sender: {
      _id: "64e1d1a9f12e45619a8a9f76",
      name: "John Doe",
      avatar: "https://example.com/avatar1.jpg",
      bio: "Software Engineer at TechCorp",
      username: "johndoe",
    },
    type: "connection_request",
    message: "John Doe has sent you a connection request.",
    isRead: false,
    createdAt: "2024-09-10T12:30:00.000Z",
    updatedAt: "2024-09-10T12:30:00.000Z",
  },
  {
    _id: "64e1f6a1d45b45219b8a61d2",
    user: "64e1e7f8c2a455218b9b7c92",
    sender: {
      _id: "64e1f6a1d45b45219b8a9f83",
      name: "Jane Smith",
      avatar: "https://example.com/avatar2.jpg",
      bio: "Marketing Manager at BizCorp",
      username: "janesmith",
    },
    type: "request_approved",
    message: "Jane Smith has accepted your connection request.",
    isRead: true,
    createdAt: "2024-09-09T09:45:00.000Z",
    updatedAt: "2024-09-09T10:00:00.000Z",
  },
  {
    _id: "64e1f6a1d45b45219b8a61d3",
    user: "64e1e7f8c2a455218b9b7c92",
    sender: {
      _id: "64e1f6a1d45b45219b8b6d22",
      name: "Alice Johnson",
      avatar: "https://example.com/avatar3.jpg",
      bio: "Product Designer at DesignHub",
      username: "alicejohnson",
    },
    type: "request_rejected",
    message: "Alice Johnson has rejected your connection request.",
    isRead: false,
    createdAt: "2024-09-08T14:10:00.000Z",
    updatedAt: "2024-09-08T14:15:00.000Z",
  },
];

const Notifications = () => {
  const handleRead = () => {};
  const readLoading = false;
  const loadingMe = false;

  return (
    <Page>
      <div
        className={`recommendations ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
      >
        <PageHeader title="Notifications" />
        <div className="flex-flex-col p-2">
          {dummyNotifications.length === 0 ? (
            <div>No invitations at the moment.</div>
          ) : (
            <div className="space-y-4">
              {dummyNotifications.map((notification) => (
                <NotificationCard
                  key={notification._id}
                  notification={notification}
                  handleRead={handleRead}
                  readLoading={readLoading}
                  loadingMe={loadingMe}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Page>
  );
};

export default Notifications;
