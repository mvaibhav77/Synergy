import { Convo } from "@/screens/ChatScreen";
import { Message, Participant, UserInfo } from "@/utils/types";
import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

type Props = {
  conversationId: string | undefined;
  currentConversation: Convo | null;
  chatUser: UserInfo | Participant | null;
  connectedSince: string;
  messages: Message[];
  currentUser: UserInfo;
  newMessage: string;
  setNewMessage: (value: string) => void;
  handleSendMessage: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
};

const ChatView = (props: Props) => {
  return (
    <div className="col-span-3 flex flex-col">
      {props.conversationId && props.currentConversation && (
        <div className="p-4 border-b-[1px] border-gray-800">
          {/* Header for chat interface */}
          <div className="text-xl font-semibold">
            Chat with {props.currentConversation.name}
          </div>
        </div>
      )}

      {props.conversationId ? (
        <>
          {/* Chat Messages */}
          <ScrollArea className="flex-grow p-4 max-h-[calc(100vh-210px)]">
            {/* info about the other person  */}
            {props.chatUser && (
              <div className="flex flex-col gap-2 items-center mb-4">
                {/* Avatar */}
                <img
                  src={props.chatUser.avatar || "https://github.com/github.png"} // Fallback image
                  alt={`${props.chatUser.name}'s avatar`}
                  className="w-20 h-20 rounded-full"
                />
                {/* Name */}
                <div className="text-xl font-semibold">
                  {props.chatUser.name}
                </div>
                {/* Connected Since */}
                <div className="text-sm text-gray-500">
                  Connected Since {props.connectedSince}
                </div>
                <Separator className="my-4" />
              </div>
            )}

            {/* Messages */}
            <div className="flex flex-col gap-4">
              {props.messages.map((message, index) => (
                <div
                  key={message._id}
                  ref={
                    index === props.messages.length - 1 ? props.scrollRef : null
                  } // Attach ref to the last message
                  className={`flex ${
                    message.sender === props.currentUser?._id ||
                    (message.sender as Participant)?._id ===
                      props.currentUser?._id
                      ? "justify-end"
                      : ""
                  }`}
                >
                  <div
                    className={`${
                      message.sender === props.currentUser?._id ||
                      (message.sender as Participant)?._id ===
                        props.currentUser?._id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-black"
                    } rounded-lg p-3 max-w-[75%]`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t-[1px] border-gray-500">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Type a message..."
                className="flex-grow"
                value={props.newMessage}
                onChange={(e) => props.setNewMessage(e.target.value)}
              />
              <Button variant="outline" className="rounded-full border-white">
                AI
              </Button>
              <Button variant="default" onClick={props.handleSendMessage}>
                Send
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-grow items-center justify-center text-xl font-semibold">
          Select a chat to start collaborating.
        </div>
      )}
    </div>
  );
};

export default ChatView;
