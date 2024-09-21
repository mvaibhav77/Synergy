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

export const MIN_SECTION_HEIGHT = "min-h-[calc(100vh-70px)]";
export const CONTENT_HEIGHT = "h-[calc(100vh-150px)]";
