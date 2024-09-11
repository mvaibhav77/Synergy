import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { MIN_SECTION_HEIGHT } from "@/utils/constants";

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
    <div
      className={`${MIN_SECTION_HEIGHT} h-full w- border-l-[1px]  border-gray-500 pt-4 px-2`}
    >
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
      </div>
    </div>
  );
};

export default Sidemenu;
