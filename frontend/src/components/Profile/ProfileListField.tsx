import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditDialog from "../EditDialog";
import { Badge } from "../ui/badge";

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
      className={`field group flex flex-col gap-4 justify-between p-3 w-full rounded-lg hover:bg-secondary`}
    >
      <div className={`flex flex-row items-center justify-between gap-4`}>
        <h2 className={`field-title font-semibold ${props.titleClass}`}>
          {props.title}:
        </h2>
        <div className="editButton">
          {props.editable && (
            <button
              className="group-hover:block hidden text-white"
              onClick={handleEditClick}
            >
              <FaEdit className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      <div className="field-value flex flex-row flex-wrap gap-2">
        {props.value?.map((item, index) => (
          <Badge
            variant={"default"}
            key={index}
            className="inline-block mr-2 bg-sbtn text-sbtn-foreground"
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
