import { Separator } from "./ui/separator";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

type Props = {
  title: string;
};

const PageHeader = (props: Props) => {
  return (
    <div className="page-header">
      <div className="flex flex-row gap-4 items-center px-4">
        <nav>
          <button onClick={() => window.history.back()}>
            <MdOutlineKeyboardBackspace size={30} />
          </button>
        </nav>
        <div className="w-full py-4">
          <h2 className="text-xl lg:text-2xl">{props.title}</h2>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
