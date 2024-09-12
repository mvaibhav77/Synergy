import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";
import { Link } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

export interface ICommandProps {
  value: string;
  label: string;
}

const Sidemenu = () => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const commands: ICommandProps[] = [
    { value: "home", label: "Home" },
    { value: "messages", label: "Messages" },
    { value: "settings", label: "Settings" },
    // Add more commands as needed
  ];

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
    <div
      className={`${MIN_SECTION_HEIGHT} h-full w-full border-l-[1px] border-gray-500 pt-4 px-2`}
    >
      <div className="flex flex-col gap-12 h-full items-center">
        {/* Search bar */}
        <div className="search px-4">
          <Command className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search..."
              onValueChange={handleValueChange}
            />
            {open && filteredCommands.length > 0 && (
              <CommandList>
                {filteredCommands.map((command) => (
                  <CommandItem key={command.value} value={command.value}>
                    {command.label}
                  </CommandItem>
                ))}
              </CommandList>
            )}
          </Command>
        </div>

        {/* skeleton */}
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>

        {/* Footer with navigation links */}
        <div className="flex flex-col items-center mt-8 w-full">
          <nav className="px-4">
            <ul className="flex flex-row flex-wrap gap-4">
              <li>
                <Link to="/" className="text-gray-400 hoverunderline0">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/messages" className="text-gray-400 hover:underline">
                  Messages
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-400 hover:underline">
                  Settings
                </Link>
              </li>
              {/* Add more navigation links as needed */}
            </ul>
          </nav>

          {/* Company Info */}
          <div className="flex flex-row gap-2 mt-4 px-4 text-gray-500 ">
            <p>Synergy</p>
            <p>&copy; 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidemenu;
