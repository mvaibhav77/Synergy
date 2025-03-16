// export default Posts


"use client"

import React from "react"
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
import { useGetAllPostsQuery } from "@/slices/postsApiSlice"
// import { useGetAllPostsQuery } from "@/slices/postApiSlice" // Import the hook

interface Post {
  _id: string
  user: {
    name: string
    username: string
    avatar: string | null
  }
  text: string
  img: string | null
  createdAt: string
  likes: string[] // Array of user IDs who liked the post
  comments: {
    user: string
    text: string
  }[]
}

export function Posts() {
  const { data: posts, isLoading, isError } = useGetAllPostsQuery()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching posts. Please try again later.</div>
  }

  return (
    <ScrollArea className="h-[calc(100vh-240px)] px-4 py-6">
      <div className="space-y-8">
        {posts?.map((post) => (
          <PostCard key={post._id} post={mapPostData(post)} />
        ))}
      </div>
    </ScrollArea>
  )
}

function mapPostData(post: Post) {
  return {
    id: post._id,
    name: post.user?.name || "Anonymous",
    username: post.user?.username || "anonymous",
    avatar: post.user?.avatar || null,
    message: post.text || "",
    image: post.img || null,
    createdAt: new Date(post.createdAt),
    likes: post.likes?.length || 0,
    comments: post.comments?.length || 0,
    shares: 0, // Assuming shares are not tracked in your backend
  }
}

function PostCard({ post }: { post: ReturnType<typeof mapPostData> }) {
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