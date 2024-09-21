import Empty from "@/assets/empty.svg";

type Props = {
  title: string;
};

const EmptyState = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-[50vh]">
      <img src={Empty} alt={props.title} className="w-1/2" />
      <p>{props.title}</p>
    </div>
  );
};

export default EmptyState;
