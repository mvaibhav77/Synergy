import React, { useState } from "react";
import { Command, CommandInput, CommandItem, CommandList } from "./ui/command";

type Props = {};

export interface ICommandProps {
  value: string;
  label: string;
}

const Search = (props: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    setOpen(!!value);
  };

  const commands: ICommandProps[] = [
    { value: "home", label: "Home" },
    { value: "messages", label: "Messages" },
    { value: "settings", label: "Settings" },
    // Add more commands as needed
  ];

  const filteredCommands = Array.isArray(commands)
    ? commands.filter((command) =>
        command.label.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];

  return (
    <>
      <div className="search px-4">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            value={inputValue}
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
    </>
  );
};

export default Search;
