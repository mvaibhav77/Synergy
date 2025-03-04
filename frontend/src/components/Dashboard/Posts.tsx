// import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
// import { FaComment, FaEye, FaHeart, FaShare } from "react-icons/fa";
// import { IoPersonAddSharp } from "react-icons/io5";
// import { MdReportOff } from "react-icons/md";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import { Separator } from "../ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { NavLink } from "react-router-dom";
// import { MoreHorizontal } from "lucide-react";
// import { ScrollArea } from "../ui/scroll-area";

// const Posts = () => {
//   const dummyPosts = [
//     {
//       name: "Vaibhav",
//       username: "vaibhav77",
//       avatar: null,
//       message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
//       image: null,
//     },
//     {
//       name: "Vaibhav",
//       username: "vaibhav77",
//       avatar: null,
//       message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
//       image: null,
//     },
//     {
//       name: "Vaibhav",
//       username: "vaibhav77",
//       avatar: null,
//       message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
//       image: null,
//     },
//     {
//       name: "Vaibhav",
//       username: "vaibhav77",
//       avatar: null,
//       message: "Lorem ipsum dolor sit, amet consectetur adipisicing elit.",
//       image: null,
//     },
//   ];
//   return (
//     <ScrollArea className="lg:h-[calc(100vh-240px)] flex flex-col gap-2 py-4">
//       {/* POST */}
//       {dummyPosts.map((post, index) => (
//         <div className="post mb-4" key={`post-${index}`}>
//           <div className="flex flex-row gap-4 mb-6 px-8">
//             {/* avatar */}
//             <div className="avatar">
//               <Avatar>
//                 <AvatarImage
//                   src={post.avatar || "https://github.com/shadcn.png"}
//                   alt="@shadcn"
//                 />
//                 <AvatarFallback>{post.name.slice(0, 1)}</AvatarFallback>
//               </Avatar>
//             </div>

//             <div className="flex flex-col w-full">
//               {/* Name username datea nd then options three dot symbol */}
//               <div className="flex flex-row justify-between items-center">
//                 <div className="flex flex-row gap-2 items-center">
//                   <span className="">{post.name}</span>
//                   <NavLink to={`/raghav`} className="text-gray-500 text-sm">
//                     @{post.username}
//                   </NavLink>
//                   <div className="text-gray-500 text-sm">-</div>
//                   <div className="text-gray-500 text-sm">10 Sept</div>
//                 </div>
//                 {/* options */}
//                 <Popover>
//                   <PopoverTrigger>
//                     <button>
//                       <MoreHorizontal />
//                     </button>
//                   </PopoverTrigger>
//                   <PopoverContent className="p-0 w-fit">
//                     <div className="flex flex-col">
//                       <button className="text-left px-4 py-3 flex flex-row gap-2 items-center hover:bg-gray-800">
//                         <IoPersonAddSharp />
//                         Connect @{post.username}
//                       </button>
//                       <button className="text-left flex flex-row px-4 py-3 gap-2 items-center hover:bg-gray-800">
//                         <FaEye />
//                         View @{post.username}
//                       </button>
//                       <button className="text-left flex flex-row px-4 py-3 gap-2 items-center hover:bg-gray-800">
//                         <MdReportOff />
//                         Report Post
//                       </button>
//                     </div>
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* post content */}
//               <div className="post-content flex flex-col gap-4">
//                 {/* text */}
//                 <div className="">{post.message}</div>
//                 {/* an image */}
//                 {/* an image */}
//                 <img
//                   src={
//                     post.image || `https://picsum.photos/600/${1200 + index}`
//                   }
//                   alt="post image"
//                   className="w-full h-[600px] object-cover rounded-md"
//                 />
//               </div>

//               {/* interaction button like like comment share buttons */}
//               <div className="flex flex-row gap-4 items-center mt-4">
//                 <button className="flex flex-row gap-2 items-center">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <FaHeart size={25} className="hover:text-red-300" />
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Like</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 </button>
//                 <button className="flex flex-row gap-2 items-center">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <FaComment size={25} className="hover:text-gray-600" />
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Comment</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>{" "}
//                 </button>
//                 <button className="flex flex-row gap-2 items-center">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger>
//                         <FaShare size={25} className="hover:text-gray-600" />
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Share</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>{" "}
//                 </button>
//               </div>
//             </div>
//           </div>
//           <Separator />
//         </div>
//       ))}
//     </ScrollArea>
//   );
// };

// export default Posts;

"use client"

import type * as React from "react"
import { NavLink } from "react-router-dom"
import { MoreHorizontal, MessageCircle, Heart, Share2, Eye, UserPlus2, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Post {
  id: string
  name: string
  username: string
  avatar: string | null
  message: string
  image: string | null
  createdAt: Date
  likes: number
  comments: number
  shares: number
}

const dummyPosts: Post[] = [
  {
    id: "1",
    name: "Vaibhav",
    username: "vaibhav77",
    avatar: null,
    message: "Just finished a great coding session! 💻 #WebDevelopment #JavaScript",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop&q=80",
    createdAt: new Date("2023-09-10T12:00:00"),
    likes: 15,
    comments: 3,
    shares: 2,
  },
  {
    id: "2",
    name: "Priya",
    username: "priya_dev",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80",
    message: "Excited to announce my new project! Stay tuned for more details. 🚀 #NewProject #TechInnovation",
    image: null,
    createdAt: new Date("2023-09-09T15:30:00"),
    likes: 32,
    comments: 8,
    shares: 5,
  },
  {
    id: "3",
    name: "Rahul",
    username: "rahul_tech",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80",
    message: "Beautiful sunset view from my coding spot today. 🌅 #WorkLifeBalance #CodingLife",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=600&h=400&fit=crop&q=80",
    createdAt: new Date("2023-09-08T18:45:00"),
    likes: 45,
    comments: 12,
    shares: 7,
  },
  {
    id: "4",
    name: "Ananya",
    username: "ananya_designs",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    message:
      "Just launched my portfolio website! Check it out and let me know what you think. 🎨 #WebDesign #Portfolio",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop&q=80",
    createdAt: new Date("2023-09-07T10:15:00"),
    likes: 28,
    comments: 6,
    shares: 3,
  },
]

export function Posts() {
  return (
    <ScrollArea className="h-[calc(100vh-240px)] px-4 py-6">
      <div className="space-y-8">
        {dummyPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </ScrollArea>
  )
}

function PostCard({ post }: { post: Post }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={post.avatar || "/placeholder-avatar.png"} alt={post.name} />
          <AvatarFallback>{post.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">{post.name}</h1>
              <NavLink to={`/${post.username}`} className="text-sm text-muted-foreground hover:underline">
                @{post.username}
              </NavLink>
            </div>
            <p className="text-sm text-muted-foreground">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</p>
          </div>
        </div>
        <PostOptions username={post.username} />
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="mb-4 text-sm">{post.message}</p>
        {post.image && (
          <img
            src={post.image || "/placeholder.svg"}
            alt="Post image"
            className="rounded-md object-cover w-full max-h-[400px]"
          />
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex justify-between w-full">
          <PostAction icon={Heart} label="Like" count={post.likes} />
          <PostAction icon={MessageCircle} label="Comment" count={post.comments} />
          <PostAction icon={Share2} label="Share" count={post.shares} />
        </div>
      </CardFooter>
    </Card>
  )
}

function PostOptions({ username }: { username: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Post options</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="flex flex-col">
          <Button variant="ghost" className="flex items-center justify-start gap-2 px-4 py-2 h-auto">
            <UserPlus2 className="h-4 w-4" />
            <span>Connect @{username}</span>
          </Button>
          <Button variant="ghost" className="flex items-center justify-start gap-2 px-4 py-2 h-auto">
            <Eye className="h-4 w-4" />
            <span>View @{username}</span>
          </Button>
          <Separator />
          <Button variant="ghost" className="flex items-center justify-start gap-2 px-4 py-2 h-auto text-destructive">
            <AlertCircle className="h-4 w-4" />
            <span>Report Post</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function PostAction({ icon: Icon, label, count }: { icon: React.ElementType; label: string; count: number }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <Icon className="h-4 w-4" />
            <span>{count}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Posts

