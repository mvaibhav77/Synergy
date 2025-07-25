import React, { useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { UserInfo } from "@/utils/types";
import { Input } from "./ui/input";
import MultipleSelector, { Option } from "./ui/MultiSelect";
import { skillOptions } from "@/utils/constants";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useUpdateUserMutation } from "@/slices/usersApiSlice";
import { setCredentials } from "@/slices/authSlice";

type Props = {
  editDialogActive: boolean;
  setEditDialogActive: (active: boolean) => void;
  editField: string;
  editFieldType: string;
};

const EditDialog = ({
  editDialogActive,
  setEditDialogActive,
  editField,
  editFieldType,
}: Props) => {
  const { userInfo } = useSelector((state: RootState) => state.auth) as {
    userInfo: UserInfo;
  };
  const dispatch = useAppDispatch();

  const [editValue, setEditValue] = React.useState<string | Option[]>("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    const value: string | Option[] =
      editFieldType == "string"
        ? userInfo[editField]
        : (userInfo[editField] as Array<string>)?.map((item) => {
            return { label: item, value: item };
          });
    setEditValue(value);
  }, [editDialogActive, editField, editFieldType, userInfo]);

  const handleSaveClick = async () => {
    // Update the state with the edited value
    // setEditValue((prevValue) => {
    //   return prevValue; // Placeholder for now, replace with actual update logic
    // });
    if (editFieldType === "string") {
      const { data }: { data: UserInfo } = (await updateUser({
        [editField]: editValue,
      })) as unknown as { data: UserInfo };
      dispatch(setCredentials(data));
    } else {
      if (editField === "connection interests") {
        const { data }: { data: UserInfo } = (await updateUser({
          connectionPreferences: {
            interests: (editValue as Option[]).map((item) => item.value),
          },
        })) as unknown as { data: UserInfo };
        dispatch(setCredentials(data));
      } else {
        const { data }: { data: UserInfo } = (await updateUser({
          [editField]: (editValue as Option[]).map((item) => item.value),
        })) as unknown as { data: UserInfo };
        dispatch(setCredentials(data));
      }
    }

    setEditDialogActive(false);
  };

  const handleCancelClick = () => {
    setEditDialogActive(false);
  };

  const renderInput = () => (
    <Input
      className="w-full border rounded px-2 py-1 mb-2"
      value={editValue}
      onChange={(e) => setEditValue(e.target.value)}
    />
  );

  const renderMultiSelect = () => {
    // Assuming MultiSelect component from your UI library
    // Replace with actual implementation
    return (
      <MultipleSelector
        defaultOptions={skillOptions}
        placeholder="Type something..."
        creatable
        value={editValue}
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
        onChange={(selectedOptions) => {
          setEditValue(selectedOptions); // Update the state with the selected options
        }}
      />
    );
  };

  return (
    <Dialog
      open={editDialogActive}
      onOpenChange={(val) => setEditDialogActive(val)}
    >
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle>
            Edit {editField.charAt(0).toUpperCase() + editField.slice(1)}
          </DialogTitle>
          <DialogDescription>
            Make changes to your name here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="editValue">Enter your new {editField}</Label>
        {editFieldType === "string" ? renderInput() : renderMultiSelect()}
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose onClick={() => handleCancelClick()}>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={() => handleSaveClick()}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
