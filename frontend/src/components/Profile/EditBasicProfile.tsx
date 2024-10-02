import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import { FaPen } from "react-icons/fa";
import ProfileField from "./ProfileField";

type Props = {
  name: string;
  bio: string | undefined;
};

const EditBasicProfile = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"} className="editProfile text-lg">
          <FaPen />
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
