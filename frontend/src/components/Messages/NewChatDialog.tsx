import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FaArrowRight, FaPlus, FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { ICommandProps } from "../SidemenuRight";
import { useState } from "react";
import {
  useCreateConversationMutation,
  useGetConversationsMutation,
} from "@/slices/chatApiSlice";
import { useNavigate } from "react-router-dom";
import { Conversation } from "@/utils/types";

const NewChatDialog = () => {
  const { connections, userInfo: currentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const [createConversation, { isLoading: creatingConvo }] =
    useCreateConversationMutation();

  const commands: ICommandProps[] = [];

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  const [getConversion] = useGetConversationsMutation();

  const createNewConversation = async (connectionId: string) => {
    const data = {
      senderId: currentUser?._id,
      receiverId: connectionId,
    };

    try {
      const result = await createConversation(data);

      let conversation: Conversation = await result.data;

      // If no conversation was created or found, navigate to the messages page
      if (!conversation) {
        // Fetch all conversations for the current user
        const conversations = await getConversion({}).unwrap();

        // Find the conversation where either participant matches the connectionId
        conversation = conversations.find((conv: Conversation) =>
          conv.participants.some(
            (participant) => participant._id === connectionId
          )
        );

        if (conversation) {
          console.log("go to conversation");
          // Close the dialog
          setOpen(false);
          navigate(`/messages/${conversation._id}`);
        } else {
          // Close the dialog
          setOpen(false);

          // If conversation is not found, navigate to messages page or show an error
          navigate("/messages");
        }
        return;
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="w-full">
        <Button variant="default" className="w-full mb-4 mx-auto">
          <FaPlus className="mr-2" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New chat</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col py-2">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search..."
              onValueChange={handleValueChange}
            />
            {open && filteredCommands.length > 0 && (
              <CommandList>
                {filteredCommands.map((command) => (
                  <CommandItem key={command.value} value={command.value}>
                    {command.label}
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </Command>

          <div className="flex flex-col gap-2 mt-4">
            {Array.isArray(connections) &&
              connections.map((connection) => (
                <Button
                  key={connection._id}
                  variant="default"
                  className="w-full"
                  onClick={() => createNewConversation(connection._id)}
                >
                  <div className="w-full flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center">
                      <div className="text-center p-1 bg-gray-300 rounded-full">
                        <FaUser />
                      </div>
                      <div className="text">
                        {creatingConvo ? "Wait..." : connection.name}
                      </div>
                    </div>

                    <FaArrowRight />
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewChatDialog;
