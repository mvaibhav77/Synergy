import { UserInfo } from "@/utils/types";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

type Props = {
  user: UserInfo;
  handleApprove: (id: string) => void;
  handleReject: (id: string) => void;
  approveLoading: boolean;
  rejectLoading: boolean;
  loadingMe: boolean;
};

const InvitationsCard
 = (props: Props) => {
  return (
    <Card key={props.user._id}>
      <CardContent className="flex items-center justify-between  p-4 rounded-lg">
        {/* Avatar */}
        <div className="flex items-center">
          <img
            src={props.user.avatar || "https://github.com/shadcn.png"}
            alt={`${props.user.name}'s avatar`}
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className="text-lg font-semibold">{props.user.name}</h4>
            <p className="text-sm text-gray-600">{props.user.bio}</p>
          </div>
        </div>

        {/* Approve/Reject buttons */}
        <div className="flex space-x-2">
          <Button onClick={() => props.handleApprove(props.user._id)}>
            {props?.approveLoading || props?.loadingMe ? <Loader /> : "Approve"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => props.handleReject(props.user._id)}
          >
            {props.rejectLoading || props.loadingMe ? <Loader /> : "Reject"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvitationsCard
;
