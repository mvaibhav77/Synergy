import { ICommandProps } from "@/components/Search";
import { Option } from "@/components/ui/MultiSelect";

export const RECOMMEND_EXAMPLE = [
  {
    id: 1,
    avatar: null,
    name: "Avinash",
    similarity: 0.29235423423423,
    bio: "hey this is avinash",
  },

  {
    id: 2,
    avatar: null,
    name: "John Doe",
    similarity: 0.123456789,
    bio: "Software Engineer",
  },
  {
    id: 3,
    avatar: null,
    name: "Jane Doe",
    similarity: 0.987654321,
    bio: "Data Scientist",
  },
  {
    id: 4,
    avatar: null,
    name: "Bob Smith",
    similarity: 0.555555555,
    bio: "Full Stack Developer",
  },
];

export const skillOptions: Option[] = [
  { label: "Mern", value: "Mern" },
  { label: "React.js", value: "React.js" },
  { label: "Node.js", value: "Node.js" },
  { label: "Tailwind", value: "Tailwind" },
  { label: "Shadcn", value: "Shadcn" },
  { label: "Full Stack Development", value: "Full Stack Development" },
];
export const navigationSearchOptions: ICommandProps[] = [
  {
    value: "home",
    label: "Home",
  },
  {
    value: "messages",
    label: "Messages",
  },
  {
    value: "recommendations",
    label: "Recommendations",
  },
  {
    value: "notifications",
    label: "Notifications",
  },
  {
    value: "profile",
    label: "Profile",
  },
  {
    value: "settings",
    label: "Settings",
  },
];

export const MIN_SECTION_HEIGHT = "min-h-[calc(100vh-70px)]";
export const CONTENT_HEIGHT = "h-[calc(100vh-150px)]";

export const AI_DUMMY_CHAT_SIMULATION = [
  {
    content:
      "Hi there! I'm Vaibhav Shukla. I'm a big fan of projects and startups and I love working with React.js, Node.js, Redux, and building full-stack solutions. I noticed you're also interested in the startup world, and I think we could learn a lot from each other! I'd love to hear more about what you're working on and what drives you. Feel free to share a bit about yourself – I'm excited to connect and explore how we can support each other!",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T07:58:40.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8c9",
      name: "Vaibhav Shukla",
      email: "shukla.vaibhav1077@gmail.com",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5603AQHBgUzq…eta&t=LZaTPkyHaMxe1mZfJ8Y3tH_BOS_xLqmtT_Oruj2-kCk",
    },
    updatedAt: "2024-09-20T07:58:40.643Z",
    _id: "66ed2b30a9be6915db58d5e4",
  },
  {
    content:
      "Hey Vaibhav! Thanks for reaching out. I'm Alex, and I'm currently working on a SaaS platform aimed at helping small businesses manage their operations more efficiently. I use a lot of React.js too, and I'm always excited to learn more about optimizing full-stack performance. How about you? Any recent projects you're excited about?",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T08:00:15.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8ca",
      name: "Alex Johnson",
      email: "alex.johnson@saasstartup.com",
      avatar: "https://example.com/images/alex-avatar.png",
    },
    updatedAt: "2024-09-20T08:00:15.643Z",
    _id: "66ed2b30a9be6915db58d5e5",
  },
  {
    content:
      "That sounds amazing, Alex! Small businesses definitely need tools like that. Recently, I’ve been diving into optimizing real-time collaboration features for a productivity tool I’m building. React has been super helpful, but I’ve been experimenting with WebSockets and other real-time data strategies. How are you tackling scalability with your SaaS platform?",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T08:03:45.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8c9",
      name: "Vaibhav Shukla",
      email: "shukla.vaibhav1077@gmail.com",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5603AQHBgUzq…eta&t=LZaTPkyHaMxe1mZfJ8Y3tH_BOS_xLqmtT_Oruj2-kCk",
    },
    updatedAt: "2024-09-20T08:03:45.643Z",
    _id: "66ed2b30a9be6915db58d5e6",
  },
  {
    content:
      "That's a great question! We're using AWS for infrastructure, which has been super helpful with scaling our platform. Auto-scaling is something we're still optimizing, though. I haven't worked much with WebSockets, but they sound perfect for real-time features. Would love to hear more about your experiences with them – any tips for integrating them with React?",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T08:06:10.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8ca",
      name: "Alex Johnson",
      email: "alex.johnson@saasstartup.com",
      avatar: "https://example.com/images/alex-avatar.png",
    },
    updatedAt: "2024-09-20T08:06:10.643Z",
    _id: "66ed2b30a9be6915db58d5e7",
  },
  {
    content:
      "WebSockets are great but can be tricky with state management in React. I’ve been using Redux to manage the data flow, and it works well when you need to update the UI in real time without reloading the whole page. I can share some code snippets if you're interested!",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T08:08:30.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8c9",
      name: "Vaibhav Shukla",
      email: "shukla.vaibhav1077@gmail.com",
      avatar:
        "https://media.licdn.com/dms/image/v2/D5603AQHBgUzq…eta&t=LZaTPkyHaMxe1mZfJ8Y3tH_BOS_xLqmtT_Oruj2-kCk",
    },
    updatedAt: "2024-09-20T08:08:30.643Z",
    _id: "66ed2b30a9be6915db58d5e8",
  },
  {
    content:
      "That would be awesome, Vaibhav! I'm always looking for ways to make the UI more responsive. Redux can get a bit heavy sometimes, but it sounds like a solid choice for this use case. Let’s connect and maybe we can collaborate on some features!",
    conversation: "66ed2b30a9be6915db58d5e2",
    createdAt: "2024-09-20T08:10:00.643Z",
    sender: {
      _id: "66dedf15f4d964c6373ee8ca",
      name: "Alex Johnson",
      email: "alex.johnson@saasstartup.com",
      avatar: "https://example.com/images/alex-avatar.png",
    },
    updatedAt: "2024-09-20T08:10:00.643Z",
    _id: "66ed2b30a9be6915db58d5e9",
  },
];

export function updateSenderId(senderId: string) {
  return AI_DUMMY_CHAT_SIMULATION.map((chat, index) => ({
    ...chat,
    sender: {
      ...chat.sender,
      _id: index % 2 === 0 ? senderId : chat.sender?._id,
    },
  }));
}
