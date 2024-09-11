import React from "react";
import { Separator } from "./ui/separator";

type Props = {
  title: string;
};

const PageHeader = (props: Props) => {
  return (
    <div className="page-header mb-6">
      <div className="w-full p-4">
        <h2 className="text-2xl">{props.title}</h2>
      </div>
      <Separator />
    </div>
  );
};

export default PageHeader;
