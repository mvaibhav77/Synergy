import { Card, CardContent } from "../ui/card";

type Props = {
  name: string;
  similarity: number | undefined;
  avatar: string | undefined | null;
  bio: string | undefined;
};

const ProfileCards = (props: Props) => {
  return (
    <Card className="p-2 h-full">
      <CardContent>
        <div className="flex flex-col items-center justify-center gap-4">
          <img
            src="https://placehold.co/300x300"
            alt="Profile Picture"
            className="rounded-full w-24 h-24"
          />
          <h2 className="text-xl font-semibold flex gap-4">{props.name}</h2>
          <p className="text-gray-500 italic text-center">{props.bio}</p>
          {/* showing similarity metric in percentage */}
          <p className="text-gray-300 italic text-center">
            Matching:- {((props.similarity || 0) * 100).toFixed(2)}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileCards;
