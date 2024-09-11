import { HomeIcon } from "@radix-ui/react-icons";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { Separator } from "./ui/separator";

type NavLink = {
  title: string;
  link: string;
  icon: JSX.Element;
};

const navList: NavLink[] = [
  { title: "Home", link: "", icon: <HomeIcon className="h-[25px] w-[25px]" /> },
  {
    title: "Profile",
    link: "profile",
    icon: <HomeIcon className="h-[25px] w-[25px]" />,
  },
  {
    title: "Recommendations",
    link: "recommendations",
    icon: <HomeIcon className="h-[25px] w-[25px]" />,
  },
  {
    title: "Settings",
    link: "settings",
    icon: <HomeIcon className="h-[25px] w-[25px]" />,
  },
];

interface ICommandProps {
  value: string;
  label: string;
}

const Sidemenu = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const commands: ICommandProps[] = [];

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];
  console.log("filteredCommands", filteredCommands);
  return (
    <div className="h-full w-full border-r-[1px] border-gray-700 pt-4">
      <div className="flex flex-col gap-4">
        {/* search bar */}
        <div className="search px-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search..."
              onValueChange={handleValueChange}
            />
            {
              <CommandList>
                {open &&
                  filteredCommands.length > 0 &&
                  filteredCommands.map((command) => (
                    <CommandItem key={command.value} value={command.value}>
                      {command.label}
                    </CommandItem>
                  ))}
              </CommandList>
            }
          </Command>
        </div>

        {navList.map((navItem, index) => (
          <NavLink
            to={navItem.link}
            key={index}
            className="py-3 w-fit px-4 text-xl rounded-3xl hover:bg-gray-800"
          >
            <div className="flex flex-row gap-4 items-center">
              {navItem.icon}
              <div className="text">{navItem.title}</div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidemenu;
