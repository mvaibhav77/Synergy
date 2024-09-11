import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaGithub, FaLinkedin, FaPlusCircle, FaTwitter } from "react-icons/fa";

interface SocialType {
  platform: string;
  username: string;
  userId: string;
  accessToken: string; // Store OAuth tokens for API access
}

interface Props {
  socials?: SocialType[];
}

const ConnectSocials = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-5xl text-white" onClick={() => {}}>
          <FaPlusCircle />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm mb-8">
        <DialogHeader>
          <DialogTitle>Connect Socials</DialogTitle>
          <DialogDescription>
            Connect your social media accounts to your profile.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-8 items-center justify-center p-4 my-4">
          <button
            className="github"
            onClick={() => {
              window.location.href = "api/auth/github";
            }}
          >
            <FaGithub
              className={`text-5xl text-gray-300 hover:text-gray-500`}
            />
          </button>
          <button
            className="linkedin"
            onClick={() => {
              window.location.href = "api/auth/linkedin";
            }}
          >
            <FaLinkedin
              className={`text-5xl text-gray-300 hover:text-gray-500`}
            />
          </button>
          <button
            className="x"
            onClick={() => {
              window.location.href = "api/auth/x";
            }}
          >
            <FaTwitter
              className={`text-5xl text-gray-300 hover:text-gray-500`}
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectSocials;
