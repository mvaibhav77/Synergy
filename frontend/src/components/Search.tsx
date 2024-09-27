import { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";
import { navigationSearchOptions } from "@/utils/constants";

export interface ICommandProps {
  value: string;
  label: string;
}

const CommandSearch = () => {
  const [commands, setCommands] = useState<ICommandProps[]>(
    navigationSearchOptions
  );
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value); // Set open to true only if there is input
  };

  // Filter commands based on the input value
  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <div className="relative">
      {" "}
      {/* Add relative positioning to parent container */}
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Type a command or search..."
          onValueChange={handleValueChange}
        />
        <CommandList className="absolute top-full left-0 z-50 w-full">
          {" "}
          {/* Add absolute positioning with high z-index */}
          {open &&
            filteredCommands.length > 0 &&
            filteredCommands.map((command) => (
              <CommandItem
                className="bg-background border-2 border-white-600 border-t-0"
                key={command.value}
                value={command.value}
              >
                {command.label}
              </CommandItem>
            ))}
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandSearch;
