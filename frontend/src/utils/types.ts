export interface Connection {
  userId: string;
  status: "pending" | "connected" | "rejected";
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
  username?: string;
  connections?: Connection[];
  connectionPreferences?: ConnectionPreferences;
  socialMedia?: SocialMedia[];
  similarityScore?: number;
  lastActive?: Date;
}
