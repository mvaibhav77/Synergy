import { useState } from "react";
import { FaUser } from "react-icons/fa";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import { navigationSearchOptions } from "@/utils/constants";
import { useGetAllUsersMutation } from "@/slices/usersApiSlice";
import { UserInfo } from "@/utils/types";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

export interface ICommandProps {
  value: string;
  label: string;
}

const CommandSearch = () => {
  const commands: ICommandProps[] = navigationSearchOptions;
  const [userCommands, setUserCommands] = useState<ICommandProps[]>([]); // State for user results
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [getAllUsers, { isLoading, isError }] = useGetAllUsersMutation(); // Mutation hook
  const navigate = useNavigate();

  // Handle input value changes
  const handleValueChange = async (value: string) => {
    setInputValue(value);
    setOpen(!!value);

    if (value) {
      try {
        const result = await getAllUsers(value).unwrap();
        const mappedUserCommands = result.map((user: UserInfo) => ({
          value: user.username,
          label: user.name,
        }));

        setUserCommands(mappedUserCommands);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setUserCommands([]); // Optionally clear on error
      }
    } else {
      setUserCommands([]); // Clear user commands if input is empty
    }
  };

  // Filter normal commands based on the input value
  const filteredCommands = commands.filter((command) =>
    command.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleUserClick = (
    e: React.MouseEvent<HTMLDivElement>,
    username: string
  ) => {
    setOpen(false);
    navigate(`/${username}`);

    e.preventDefault();
  };

  const handleNavigationClick = (
    e: React.MouseEvent<HTMLDivElement>,
    route: string
  ) => {
    console.log("SSAS");
    setOpen(false);
    navigate(`/${route}`);
  };

  return (
    <div className="relative w-[400px]">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Type a command or search..."
          onValueChange={handleValueChange}
          value={inputValue}
        />
        <CommandList className="absolute top-full left-0 z-50 w-full bg-background h-fit">
          <ScrollArea className={`${open ? "h-[300px]" : "hidden"}`}>
            {open && (
              <>
                {/* Show loading state */}
                {isLoading && <CommandEmpty>Loading...</CommandEmpty>}

                {/* Show error state */}
                {isError && <CommandEmpty>Error fetching users</CommandEmpty>}

                {/* Show results only when not loading and no error */}
                {!isLoading && !isError && (
                  <>
                    {/* Custom Div for User Commands */}
                    {userCommands.length > 0 && (
                      <div className="overflow-hidden p-1 text-foreground">
                        {/* Users Header */}
                        <h3 className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          Users
                        </h3>

                        {/* User Commands */}
                        <div>
                          {userCommands.slice(0, 5).map((command) => (
                            <div
                              onClick={(e) => handleUserClick(e, command.value)}
                              key={command.value}
                              className="relative flex gap-4 cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none hover:bg-accent hover:text-accent-foreground data-[disabled=true]:opacity-50"
                            >
                              <FaUser />
                              <span>{command.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Separator between Navigation and Users */}
                    {filteredCommands.length > 0 && userCommands.length > 0 && (
                      <CommandSeparator />
                    )}

                    {/* Navigation Commands */}
                    {filteredCommands.length > 0 && (
                      <CommandGroup heading="Navigation">
                        {filteredCommands.map((command) => (
                          <div
                            onClick={(e) =>
                              handleNavigationClick(e, command.value)
                            }
                            key={command.value}
                            className="w-full cursor-pointer"
                          >
                            <CommandItem
                              onClick={(e) =>
                                handleNavigationClick(e, command.value)
                              }
                              value={command.value}
                            >
                              {command.label}
                            </CommandItem>
                          </div>
                        ))}
                      </CommandGroup>
                    )}

                    {/* Show 'No results found' if both commands and users are empty */}
                    {filteredCommands.length === 0 &&
                      userCommands.length === 0 && (
                        <CommandEmpty>No results found</CommandEmpty>
                      )}
                  </>
                )}
              </>
            )}
          </ScrollArea>
        </CommandList>
      </Command>
    </div>
  );
};

export default CommandSearch;
