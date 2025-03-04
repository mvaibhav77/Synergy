import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import ProfileField from "./ProfileField";
import { Edit } from "lucide-react";

type Props = {
  name: string;
  bio: string | undefined;
};

const EditBasicProfile = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="editProfile rounded-full h-8 w-8 p-0">
        <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          <DialogHeader>Edit Basic Profile</DialogHeader>
        </DialogTitle>
        <div className="flex flex-col gap-3 mt-4">
          <ProfileField title={"Name"} value={props.name} editable={true} />
          <ProfileField title="Bio" value={props.bio} editable={true} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBasicProfile;
