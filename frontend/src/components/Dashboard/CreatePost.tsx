import { FaImage, FaSmile, FaPaperclip, FaLocationArrow } from "react-icons/fa";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useSelector } from "react-redux";
import { UserInfo } from "@/utils/types";
import { RootState } from "@/store";

const CreatePost = () => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };
  return (
    <div className="flex flex-row gap-2 p-4 px-4  border-b-[1px] border-gray-500">
      <div className="avatar">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{userInfo.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="post-contents w-full">
        <div className="flex items-center gap-4">
          <Textarea className="text-xl" placeholder="Say something..." />
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex justify-end mt-2">
            <Button variant="ghost">
              <FaImage className="text-xl" />
            </Button>
            <Button variant="ghost">
              <FaSmile className="text-xl" />
            </Button>
            <Button variant="ghost">
              <FaLocationArrow className="text-xl" />
            </Button>
            <Button variant="ghost">
              <FaPaperclip className="text-xl" />
            </Button>
          </div>
          <Button size={"lg"} className="mt-4 text-lg">
            Post
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
