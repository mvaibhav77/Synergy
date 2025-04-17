import { useState } from "react";
import EditDialog from "../EditDialog";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  title: string;
  value: number | string | string[] | undefined;
  titleClass?: string;
  valueClass?: string;
  editable: boolean;
};

const ProfileField = (props: Props) => {
  const [editDialogActive, setEditDialogActive] = useState<boolean>(false);
  const [editField, setEditField] = useState<string>(""); // Store temporary edits

  const handleEditClick = () => {
    setEditField(props.title.toLowerCase());
    setEditDialogActive(true);
  };

  return (
    <div
      className={`field group flex flex-row items-center justify-between p-1 w-full rounded-lg hover:bg-secondary`}
    >
      <div className={`flex flex-row items-center gap-4`}>
        <span className={`text-sm text-muted-foreground ${props.titleClass}`}>
          {props.title}
        </span>
        <p className={`text-sm font-medium ${props.valueClass}`}>
          {props.value ? props.value : `Enter your ${props.title.toLowerCase()}`}
        </p>
      </div>
      <div className="editButton">
        {props.editable && (
          <Button 
            variant={"ghost"} 
            onClick={handleEditClick} 
            className="rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </div>
      <EditDialog
        editDialogActive={editDialogActive}
        setEditDialogActive={setEditDialogActive}
        editField={editField}
        editFieldType={"string"}
      />
    </div>
  );
};

export default ProfileField;
