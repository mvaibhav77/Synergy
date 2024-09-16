import { Convo } from "@/screens/ChatScreen";
import { Message, Participant, UserInfo } from "@/utils/types";
import React, { useState, useEffect, useRef } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import axios from "axios";
import { Textarea } from "../ui/textarea";
import { MdEmojiEmotions, MdOutlineKeyboardBackspace } from "react-icons/md";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react"; // Import the emoji picker

type Props = {
  conversationId: string | undefined;
  currentConversation: Convo | null;
  chatUser: UserInfo | Participant | null;
  connectedSince: string;
  messages: Message[];
  currentUser: UserInfo;
  newMessage: string;
  setNewMessage: (value: string | ((prev: string) => string)) => void;
  handleSendMessage: () => void;
  scrollRef: React.RefObject<HTMLDivElement>;
};

const ChatView = (props: Props) => {
  const [isTyping, setIsTyping] = useState(false); // State for typewriter effect
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle emoji picker
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateMessage = async () => {
    setIsTyping(true); // Start typewriter effect

    try {
      const previousMessages = props.messages.map((message) => message.content);
      const response = await axios.post("/api/chat/generateReply", {
        previousMessages,
      });

      const aiMessage = response.data.message;
      typeWriterEffect(aiMessage); // Show AI-generated message with typewriter effect
    } catch (error) {
      console.error("Failed to generate AI message", error);
    } finally {
      setIsTyping(false);
    }
  };

  // Function to simulate the typewriter effect
  const typeWriterEffect = (message: string) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < message.length) {
        props.setNewMessage((prev: string) => prev + message[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50); // Speed of the typing effect
  };

  // Auto resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto"; // Reset height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 3 * 24)}px`; // Limit height to 3 lines (24px per line)
    }
  }, [props.newMessage]);

  // Handle emoji click
  const handleEmojiClick = (emoji: EmojiClickData) => {
    props.setNewMessage((prev: string) => prev + emoji.emoji);
    setShowEmojiPicker(false); // Hide picker after selection
  };

  return (
    <div className="col-span-3 flex flex-col">
      {props.conversationId && props.currentConversation && (
        <div className="p-4 border-b-[1px] border-gray-800">
          {/* Header for chat interface */}
          <div className="flex gap-4 text-xl font-semibold">
            <button onClick={() => window.history.back()}>
              <MdOutlineKeyboardBackspace size={25} className="lg:hidden" />
            </button>{" "}
            Chat with {props.currentConversation.name}
          </div>
        </div>
      )}

      {props.conversationId ? (
        <>
          {/* Chat Messages */}
          <ScrollArea className="flex-grow p-4 min-h-[calc(100vh-250px)] max-h-[calc(100vh-235px)]">
            {/* Info about the other person */}
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
            <div className="relative flex items-center gap-2">
              <Textarea
                ref={textareaRef}
                placeholder={
                  isTyping ? "AI is thinking..." : "Type a message..."
                }
                className="flex-grow p-2 resize-none bg-black border rounded-md focus:outline-none min-h-[20px] max-h-[120px] text-base"
                value={props.newMessage}
                onChange={(e) => props.setNewMessage(e.target.value)}
                disabled={isTyping}
              />

              <Button
                variant="outline"
                className="rounded-full border-white p-2 text-lg"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                {/* Emoji Button */}
                <MdEmojiEmotions />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 z-10">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <Button
                variant="outline"
                className="rounded-full border-white"
                onClick={handleGenerateMessage}
                disabled={isTyping} // Disable AI button while message is being generated
              >
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
