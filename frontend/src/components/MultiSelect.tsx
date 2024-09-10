import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // shadcn utility for conditional class names

interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionChange = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      {/* Use shadcn button component */}
      <Button
        variant="outline"
        onClick={toggleDropdown}
        className="w-full text-left"
      >
        {selected.length > 0 ? selected.join(", ") : placeholder}
      </Button>

      {isOpen && (
        <div className="absolute w-full mt-2 border bg-black rounded-lg shadow-lg max-h-60 overflow-auto">
          {/* Use shadcn Input component for search */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border-b px-4"
          />

          <div className="p-2">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleOptionChange(option.value)}
                  className={cn(
                    "p-2 cursor-pointer rounded-md bg-black",
                    selected.includes(option.value)
                      ? "bg-gray-800"
                      : "hover:bg-gray-900"
                  )}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <p className="p-2 text-gray-500">No options found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
