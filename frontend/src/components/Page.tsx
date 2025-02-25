import React from "react";

type Props = {
  children: React.ReactNode;
};

const Page = ({ children }: Props) => {
  return <div className="">{children}</div>;
};

export default Page;
