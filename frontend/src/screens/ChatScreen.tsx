import Page from "@/components/Page";
import PageHeader from "@/components/PageHeader";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { FaPlus, FaSearch } from "react-icons/fa";

const ChatScreen = () => {
  const chats = [
    { id: 1, name: "John Doe", lastMessage: "Hey! How's it going?" },
    { id: 2, name: "Jane Smith", lastMessage: "Did you check the report?" },
    // Add more sample chat data as needed
  ];

  return (
    <Page>
      <div
        className={`flex flex-col ${MIN_SECTION_HEIGHT} border-x-[1px] border-gray-500`}
      >
        <div className="grid grid-cols-5">
          {/* Left Side: Chat List Sidebar */}
          <div
            className={`flex flex-col col-span-2 ${MIN_SECTION_HEIGHT} border-r-[1px] border-gray-500`}
          >
            <PageHeader title={"Messages"} />
            <div className="p-4">
              {/* Search bar */}
              <div className="flex items-center gap-2 mb-4">
                <Input placeholder="Search messages..." className="flex-grow" />
                <Button variant="outline" size="icon">
                  <FaSearch />
                </Button>
              </div>

              {/* Create new chat button */}
              <Button variant="default" className="w-full mb-4">
                <FaPlus className="mr-2" />
                New Chat
              </Button>

              {/* Chat List */}
              <ScrollArea className="h-[calc(100vh-300px)]">
                {chats.map((chat) => (
                  <Card
                    key={chat.id}
                    className="mb-2 cursor-pointer hover:bg-gray-200"
                  >
                    <CardContent className="p-4">
                      <div className="text-lg font-semibold">{chat.name}</div>
                      <div className="text-sm text-gray-600">
                        {chat.lastMessage}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </ScrollArea>
            </div>
          </div>

          {/* Right Side: Chat Interface */}
          <div className="col-span-3 flex flex-col">
            <div className="p-4 border-b-[1px] border-gray-800">
              {/* Header for chat interface */}
              <div className="text-xl font-semibold">Chat with John Doe</div>
              {/* Placeholder for active chat recipient */}
            </div>

            {/* Chat Messages */}
            <ScrollArea className="flex-grow p-4 max-h-[calc(100vh-210px)]">
              <div className="flex flex-col gap-4">
                {/* Sample message bubbles */}
                <div className="flex">
                  <div className="bg-gray-300 text-black rounded-lg p-3 max-w-[75%]">
                    Hello! How are you?
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[75%]">
                    I'm good, how about you?
                  </div>
                </div>

                {/* Add more sample chat messages as needed */}
              </div>
            </ScrollArea>

            {/* Chat Input */}
            <div className="p-4 border-t-[1px] border-gray-500">
              <div className="flex items-center gap-2">
                <Input placeholder="Type a message..." className="flex-grow" />
                <Button variant="default">Send</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default ChatScreen;
