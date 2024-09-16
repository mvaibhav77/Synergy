import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Assuming react-router for routing
import io from "socket.io-client"; // Assuming you're using socket.io
import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSearch } from "react-icons/fa";
import NewChatDialog from "@/components/Messages/NewChatDialog";
import { useGetConversationsMutation } from "@/slices/chatApiSlice";
import { RootState, useAppDispatch } from "@/store";
import { setConversations } from "@/slices/authSlice";
import { useSelector } from "react-redux";
import { Conversation, Message, Participant, UserInfo } from "@/utils/types";
import { useGetUserByIdMutation } from "@/slices/usersApiSlice";
import ChatView from "@/components/Messages/ChatView";
import ConversationList from "@/components/Messages/ConversationList";

const socket = io("https://synergy-76cw.onrender.com/", {
  transports: ["websocket"], // Ensures WebSocket is used directly
});

export interface Convo {
  name: string;
  avatar: string;
  _id: string;
  lastMessage: string;
}

const ChatScreen = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const scrollRef = useRef<HTMLDivElement>(null);

  // State to store conversations and messages
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const currentUser = userInfo as Participant;
  const [chatUser, setChatUser] = useState<UserInfo | null>(null);
  const [connectedSince, setConnectedSince] = useState<string>("");
  const [conversationList, setConversationList] = useState<Convo[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Convo | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const [getConversations, { isLoading: conversationsLoading }] =
    useGetConversationsMutation();
  const [getUserDetails] = useGetUserByIdMutation();

  // Function to format date into a human-readable format
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Fetch conversations from backend
  useEffect(() => {
    const fetchConversations = async () => {
      let list: Conversation[] = [];

      try {
        const response = await getConversations({}).unwrap();
        dispatch(setConversations(response));
        list = response;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        return; // Prevent further execution if there was an error
      }

      // Handle async operations in parallel with Promise.all
      const updatedList: Convo[] =
        list && list.length > 0
          ? await Promise.all(
              list.map((conversation) => {
                // Find the other user (not the current user) from participants
                const otherUser = conversation.participants.find(
                  (user: Participant) => user._id !== currentUser?._id
                );

                if (conversationId && conversation._id == conversationId) {
                  setCurrentConversation({
                    name: otherUser?.name,
                    avatar: otherUser?.avatar, // Assuming the user has an avatar
                    _id: conversation._id,
                    lastMessage: conversation.lastMessage,
                  } as Convo);
                  getUserDetails(otherUser?._id)
                    .unwrap()
                    .then((res: UserInfo) => {
                      setChatUser(res);
                      // so user info has connections object which has an array of object which has the connectedDate
                      const connection = userInfo?.connections?.find(
                        (conn) =>
                          conn.userId.toString() === res?._id.toString() &&
                          conn.status === "connected"
                      );
                      const connSince: string = formatDate(
                        connection ? connection?.connectedDate : ""
                      );
                      setConnectedSince(connSince);
                    })
                    .catch((err) => {
                      console.log(err);
                      // throw toast
                    });
                }

                return {
                  name: otherUser?.name,
                  avatar: otherUser?.avatar, // Assuming the user has an avatar
                  _id: conversation._id,
                  lastMessage: conversation.lastMessage,
                } as Convo;
              })
            )
          : [];

      // If you need to update the local state with the modified list
      setConversationList(updatedList);
    };

    fetchConversations();
  }, [
    currentUser,
    getConversations,
    dispatch,
    conversationId,
    getUserDetails,
    userInfo?.connections,
  ]);

  // Join room and fetch messages when a conversationId is present
  useEffect(() => {
    if (conversationId) {
      socket.emit("joinConversation", {
        conversationId,
        userId: currentUser?._id,
      });

      const fetchMessages = async () => {
        try {
          const response = await fetch(
            `/api/chat/conversations/${conversationId}/messages`
          ); // Adjust to your API
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      };

      fetchMessages();
    }
  }, [conversationId]);

  // Handle new message from socket
  useEffect(() => {
    socket.on("newMessage", (message) => {
      console.log(message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newMessage"); // Cleanup listener on component unmount
    };
  }, []);

  // Send new message
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", {
        conversationId,
        senderId: currentUser?._id, // Use current user's ID
        content: newMessage,
      });
      setNewMessage(""); // Clear input after sending
    }
  };

  // Handle selecting a conversation
  const handleSelectConversation = (id: string) => {
    navigate(`/messages/${id}`);
  };

  // handle msg scroll
  // Automatically scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Page>
      <div
        className={`flex flex-col ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
      >
        {/* Responsive Layout */}
        <div className="grid lg:grid-cols-5 grid-cols-1">
          {/* Left Side: Chat List Sidebar */}
          <div
            className={`flex-col lg:col-span-2 ${MIN_SECTION_HEIGHT} border-r-[1px] border-gray-500 lg:flex ${
              conversationId ? "hidden" : "flex"
            }`}
          >
            <PageHeader title={"Messages"} />
            <div className="p-4">
              {/* Search bar */}
              <div className="flex items-center gap-2 mb-4">
                {/* replace this input with command search */}
                <Input placeholder="Search messages..." className="flex-grow" />
                <Button variant="outline" size="icon">
                  <FaSearch />
                </Button>
              </div>

              {/* Create new chat button */}
              <NewChatDialog />

              {/* Chat List */}
              <ConversationList
                conversationsLoading={conversationsLoading}
                conversationList={conversationList}
                handleSelectConversation={handleSelectConversation}
              />
            </div>
          </div>

          {/* Right Side: Chat Interface */}
          <div
            className={`lg:col-span-3 flex-grow ${
              conversationId ? "flex" : "hidden"
            } lg:flex`}
          >
            <ChatView
              conversationId={conversationId}
              currentConversation={currentConversation}
              chatUser={chatUser}
              connectedSince={connectedSince}
              messages={messages}
              scrollRef={scrollRef}
              currentUser={currentUser}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          </div>
        </div>

        {/* Mobile View
        <div className="lg:hidden">
          {conversationId ? (
            <ChatView
              conversationId={conversationId}
              currentConversation={currentConversation}
              chatUser={chatUser}
              connectedSince={connectedSince}
              messages={messages}
              scrollRef={scrollRef}
              currentUser={currentUser}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
            />
          ) : (
            <div className="p-4">
              <PageHeader title={"Messages"} />
              <NewChatDialog />
              <ConversationList
                conversationsLoading={conversationsLoading}
                conversationList={conversationList}
                handleSelectConversation={handleSelectConversation}
              />
            </div>
          )}
        </div> */}
      </div>
    </Page>
  );
};

export default ChatScreen;
