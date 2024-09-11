import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import EditDialog from "../EditDialog";

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
      className={`field group flex flex-row items-center justify-between p-3 w-full rounded-lg hover:bg-gray-700`}
    >
      <div className={`flex flex-row items-center gap-4`}>
        <h2 className={`field-title font-semibold ${props.titleClass}`}>
          {props.title}:
        </h2>
        <h3 className={`field-value ${props.valueClass}`}>
          {props.value ? props.value : `Enter your ${props.title}`}
        </h3>
      </div>
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
