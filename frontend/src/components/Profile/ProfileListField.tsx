import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditDialog from "../EditDialog";
import { Badge } from "../ui/badge";
import { Edit } from "lucide-react";

type Props = {
  title: string;
  value: string[] | undefined;
  titleClass?: string;
  valueClass?: string;
  editable: boolean;
};

const ProfileListField = (props: Props) => {
  const [editDialogActive, setEditDialogActive] = useState<boolean>(false);
  const [editField, setEditField] = useState<string>(""); // Store temporary edits
  const handleEditClick = () => {
    setEditField(props.title.toLowerCase());
    setEditDialogActive(true);
  };

  return (
    <div
      className={`field group flex flex-col gap-3 justify-between p-3 w-full rounded-lg hover:bg-secondary`}
    >
      <div className={`flex flex-row items-center justify-between`}>
        <span className={`text-base text-muted-foreground ${props.titleClass}`}>
          {props.title}
        </span>
        <div className="editButton">
          {props.editable && (
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleEditClick}
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="field-value flex flex-row flex-wrap gap-1.5">
        {props.value?.map((item, index) => (
          <Badge
            variant={"default"}
            key={index}
            className="text-xs py-1 px-2"
          >
            {item}
          </Badge>
        ))}
      </div>
      <EditDialog
        editDialogActive={editDialogActive}
        setEditDialogActive={setEditDialogActive}
        editField={editField}
        editFieldType={"list"}
      />
    </div>
  );
};

export default ProfileListField;
