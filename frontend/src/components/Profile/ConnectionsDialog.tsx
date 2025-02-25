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
      <DialogTrigger className="text-gray-500 font-bold  hover:text-inherit hover:underline w-fit text-inherit">
        {props.connections?.length || 0}{" "}
        <span className="text-primary">Connections</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.profileData.name}'s Connections</DialogTitle>
        </DialogHeader>
        <ScrollArea className="w-full p-4 min-h-[200px] max-h-[700px]">
          <div className="flex flex-col gap-4">
            {props.connections && props.connections.length > 0 ? (
              props.connections?.map((connection) => (
                <Card
                  key={connection._id}
                  className="flex items-center justify-between w-full p-4  rounded-lg"
                >
                  <CardContent className="flex items-center justify-between gap-4 w-full p-0">
                    <div className="flex flex-row gap-2">
                      <img
                        src={
                          connection.avatar || "https://github.com/twitter.png"
                        }
                        alt={connection.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <p className="font-bold">{connection.name}</p>
                        <p className="text-sm">{connection.email}</p>
                      </div>
                    </div>

                    <Button onClick={() => handleConnect(connection._id)}>
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-center">No connections found</p>
                <img
                  src="https://github.com/not-found.png"
                  alt="No connections found"
                  className="w-[100px] mx-auto"
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
