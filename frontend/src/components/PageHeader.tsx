import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { MdOutlineKeyboardBackspace } from "react-icons/md";

type Props = {
  title: string;
};

const PageHeader = (props: Props) => {
  return (
    <div className="page-header">
      <div className="flex flex-row gap-4 items-center px-4">
        <nav className="flex items-center justify-center">
          <Button variant={"outline"} onClick={() => window.history.back()} className="rounded-full h-8 w-8 p-0">
            <MdOutlineKeyboardBackspace size={20} />
          </Button>
        </nav>
        <div className="w-full py-4">
          <h2 className="text-xl lg:text-2xl font-semibold">{props.title}</h2>
        </div>
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
