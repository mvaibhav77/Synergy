import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { FaComment, FaEye, FaHeart, FaShare } from "react-icons/fa";
import { IoPersonAddSharp } from "react-icons/io5";
import { MdReportOff } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { NavLink } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const Posts = () => {
  const dummyPosts = [
    {
      name: "Vaibhav",
      username: "vaibhav77",
      avatar: null,
      message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      image: null,
    },
    {
      name: "Vaibhav",
      username: "vaibhav77",
      avatar: null,
      message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      image: null,
    },
    {
      name: "Vaibhav",
      username: "vaibhav77",
      avatar: null,
      message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      image: null,
    },
    {
      name: "Vaibhav",
      username: "vaibhav77",
      avatar: null,
      message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
      image: null,
    },
  ];
  return (
    <ScrollArea className="h-[calc(100vh-214px)] flex flex-col gap-2 py-4 ">
      {/* POST */}
      {dummyPosts.map((post, index) => (
        <div className="post mb-4" key={`post-${index}`}>
          <div className="flex flex-row gap-4 mb-6 px-8">
            {/* avatar */}
            <div className="avatar">
              <Avatar>
                <AvatarImage
                  src={post.avatar || "https://github.com/shadcn.png"}
                  alt="@shadcn"
                />
                <AvatarFallback>{post.name.slice(0, 1)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex flex-col w-full">
              {/* Name username datea nd then options three dot symbol */}
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-2 items-center">
                  <span className="font-bold">{post.name}</span>
                  <NavLink to={`/raghav`} className="text-gray-500 text-sm">
                    @{post.username}
                  </NavLink>
                  <div className="text-gray-500 text-sm">-</div>
                  <div className="text-gray-500 text-sm">10 Sept</div>
                </div>
                <Popover>
                  <PopoverTrigger>
                    <button>
                      <MoreHorizontal />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 w-fit">
                    <div className="flex flex-col">
                      <button className="text-left px-4 py-3 flex flex-row gap-2 items-center hover:bg-gray-800">
                        <IoPersonAddSharp />
                        Connect @{post.username}
                      </button>
                      <button className="text-left flex flex-row px-4 py-3 gap-2 items-center hover:bg-gray-800">
                        <FaEye />
                        View @{post.username}
                      </button>
                      <button className="text-left flex flex-row px-4 py-3 gap-2 items-center hover:bg-gray-800">
                        <MdReportOff />
                        Report Post
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* post content */}
              <div className="post-content flex flex-col gap-4">
                {/* text */}
                <div className="text-gray-300">{post.message}</div>
                {/* an image */}
                {/* an image */}
                <img
                  src={post.image || "https://picsum.photos/400/600"}
                  alt="post image"
                  className="w-full h-64 object-cover rounded-md"
                />
              </div>

              {/* interaction button like like comment share buttons */}
              <div className="flex flex-row gap-4 items-center mt-4">
                <button className="flex flex-row gap-2 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FaHeart size={25} className="hover:text-red-300" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Like</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </button>
                <button className="flex flex-row gap-2 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FaComment size={25} className="hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Comment</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>{" "}
                </button>
                <button className="flex flex-row gap-2 items-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <FaShare size={25} className="hover:text-gray-600" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>{" "}
                </button>
              </div>
            </div>
          </div>
          <Separator />
        </div>
      ))}
    </ScrollArea>
  );
};

export default Posts;
