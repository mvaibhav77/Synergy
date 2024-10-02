import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import moment from "moment"; // You can use moment.js or another library to format timestamps
import { Notification } from "@/utils/types";

type Props = {
  notification: Notification; // You should replace this with the actual notification type
  handleRead: (id: string) => void;
  readLoading: boolean;
  loadingMe: boolean;
};

const NotificationCard = (props: Props) => {
  const { notification, handleRead, readLoading, loadingMe } = props;

  return (
    <Card key={notification._id}>
      <CardContent className="flex items-center justify-between p-4 rounded-lg">
        {/* Avatar and Sender Info */}
        <div className="flex items-center">
          <img
            src="https://github.com/shadcn.png"
            alt={`${notification.sender?.name || "User"}'s avatar`}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="text-lg font-semibold">
              {notification.sender?.name || "Unknown Sender"}
            </h4>
            <p className="text-sm text-gray-600">
              {notification.message} {/* The message from the notification */}
            </p>
            <p className="text-xs text-gray-500">
              {moment(notification.createdAt).fromNow()}{" "}
              {/* Time ago formatting */}
            </p>
          </div>
        </div>

        {/* Notification Type and Read Button */}
        <div className="flex space-x-2 items-center">
          {/* Mark as Read Button */}
          <Button
            disabled={notification.isRead} // Disable button if already read
            onClick={() => handleRead(notification._id)} // Trigger read action
            className="text-xs"
          >
            {notification.isRead ? (
              "Read"
            ) : readLoading || loadingMe ? (
              <Loader className="animate-spin w-4 h-4" />
            ) : (
              "Mark as read"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
