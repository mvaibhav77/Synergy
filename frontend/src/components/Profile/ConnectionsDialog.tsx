import { useSendRequestMutation } from "@/slices/usersApiSlice";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UserInfo } from "@/utils/types";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";

type Props = {
  profileData: UserInfo;
  connections: UserInfo[] | null;
};

const ConnectionsDialog = (props: Props) => {
  const [open, setOpen] = useState(false);

  const [sendRequest] = useSendRequestMutation();

  const handleConnect = (userId: string) => {
    // Logic to connect with the user
    sendRequest(userId)
      .then(() => {
        setOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setOpen(false);
      });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="dark:text-gray-300 text-gray-600 font-semibold  hover:text-inherit hover:underline w-fit text-base">
        {props.connections?.length || 0}{" "}
        <span className="text-base">Connections</span>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {props.profileData.name}'s Connections
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full p-6 min-h-[300px] max-h-[700px]">
          <div className="flex flex-col gap-6">
            {props.connections && props.connections.length > 0 ? (
              props.connections?.map((connection) => (
                <Card
                  key={connection._id}
                  className="flex items-center justify-between w-full p-4 rounded-xl hover:shadow-lg transition-shadow duration-200"
                >
                  <CardContent className="flex items-center justify-between gap-6 w-full p-0">
                    <div className="flex flex-row gap-4">
                      <img
                        src={
                          connection.avatar || "https://github.com/twitter.png"
                        }
                        alt={connection.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-base">{connection.name}</p>
                        <p className="text-sm text-gray-400">{connection.email}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleConnect(connection._id)}
                      className="px-6 py-2 hover:scale-105 transition-transform duration-200"
                    >
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col items-center gap-6 py-8">
                <p className="text-xl text-gray-600 font-medium">No connections found</p>
                <img
                  src="https://github.com/not-found.png"
                  alt="No connections found"
                  className="w-[150px] opacity-80"
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionsDialog;
