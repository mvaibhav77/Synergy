import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent } from "../ui/card";
import { FaUser } from "react-icons/fa";
import Loader from "../Loader";
import { Convo } from "@/screens/ChatScreen";

type Props = {
  conversationsLoading: boolean;
  conversationList: Convo[];
  handleSelectConversation: (id: string) => void;
};

const ConversationList = (props: Props) => {
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      {props.conversationsLoading ? (
        <Loader />
      ) : Array.isArray(props.conversationList) &&
        props.conversationList.length > 0 ? (
        props.conversationList.map((conversation) => (
          <Card
            key={conversation._id}
            className="mb-2 cursor-pointer group hover:bg-white hover:text-gray-900"
            onClick={() => props.handleSelectConversation(conversation._id)}
          >
            <CardContent className="flex flex-col gap-2 py-4">
              <div className="text-lg flex flex-row justify-between font-semibold group-hover:text-black">
                <div className="flex flex-row items-center gap-2">
                  <FaUser />
                  {conversation.name}
                </div>
                <div className="text-sm text-gray-400">1h</div>
              </div>
              <div className="text-sm pr-6 w-[300px] text-ellipsis overflow-hidden whitespace-nowrap ">
                {conversation.lastMessage}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div>No conversations found</div>
      )}
    </ScrollArea>
  );
};

export default ConversationList;
