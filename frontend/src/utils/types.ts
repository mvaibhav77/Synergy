export interface Connection {
  userId: string;
  status: "pending" | "connected" | "rejected";
  connectedDate: string;
}

export interface SocialMedia {
  platform: "github" | "linkedin" | "twitter";
  username: string;
  userId: string;
  accessToken: string;
}

export interface ConnectionPreferences {
  interests: string[];
  proximity: number;
}

export interface Post {
  title: string;
}

export interface UserInfo {
  _id: string;
  name: string;
  email: string;
  password?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  profession?: string;
  interests?: string[];
  avatar?: string;
  banner?: string;
  username?: string;
  posts?: Post[];
  connections?: Connection[];
  connectionPreferences?: ConnectionPreferences;
  socialMedia?: SocialMedia[];
  similarityScore?: number;
  lastActive?: Date;
}

export interface Notification {
  _id: string;
  user: string;
  sender: UserInfo | null;
  type: "connection_request" | "request_approved" | "request_rejected";
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Conversation {
  _id: string;
  participants: Participant[];
  lastMessage?: string;
  updatedAt: string;
}

export interface Participant {
  _id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Message {
  _id: string;
  conversation: string;
  sender: Participant | string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
