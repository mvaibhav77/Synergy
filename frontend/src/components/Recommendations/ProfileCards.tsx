import { NavLink } from "react-router-dom";
import { Card, CardContent } from "../ui/card";

type Props = {
  type: string;
  name: string;
  username: string | undefined;
  similarity: number | undefined;
  avatar: string | undefined | null;
  bio: string | undefined;
};

const ProfileCards = (props: Props) => {
  return (
    <Card className="p-2 pt-4 h-full">
      <NavLink to={`/${props.username}`}>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <img
              src={props.avatar || "https://github.com/react.png"}
              alt="Profile Picture"
              className="rounded-full w-24 h-24"
            />
            <h2 className="text-xl font-semibold flex gap-4">{props.name}</h2>
            <p className="text-gray-500 italic text-center">{props.bio}</p>
            {/* showing similarity metric in percentage */}
            <p className="text-inherit opacity-60  italic text-center">
              {props.type == "recommend" && (
                <>Matching:- {((props.similarity || 0) * 100).toFixed(2)}%</>
              )}
            </p>
          </div>
        </CardContent>
      </NavLink>
    </Card>
  );
};

export default ProfileCards;
