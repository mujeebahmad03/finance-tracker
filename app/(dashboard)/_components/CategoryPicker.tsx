"use client";

import { useQuery } from "@tanstack/react-query";

import { Check, ChevronsUpDown } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import type { TransactionType } from "@/lib/types";
import type { Category } from "@prisma/client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { cn } from "@/lib/utils";

interface Props {
  type: TransactionType;
  onChange: (value: string) => void;
}

export const CategoryPicker = ({ type, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (!value) return;
    onChange(value);
  }, [onChange, value]);

  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const selectedCategory = categoriesQuery.isSuccess
    ? categoriesQuery.data?.find(
        (category: Category) => category.name === value
      )
    : null;

  const successCallback = useCallback((category: Category) => {
    setValue(category.name);
    setIsOpen(false);
  }, []);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          {selectedCategory ? (
            <CategoryRow category={selectedCategory} />
          ) : (
            "Select category"
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-0">
        <Command onSubmit={(e) => e.preventDefault()}>
          <CommandInput placeholder="Search category..." />
          <CreateCategoryDialog type={type} successCallback={successCallback} />
          <CommandList>
            <CommandEmpty>
              <p>No category found.</p>
              <p className="text-xs text-muted-foreground">
                Tip: Create a new category
              </p>
            </CommandEmpty>
            <CommandGroup>
              {categoriesQuery.isSuccess &&
                categoriesQuery.data?.map((category: Category) => (
                  <CommandItem
                    key={category.name}
                    value={category.name}
                    onSelect={() => {
                      setValue(category.name);
                      setIsOpen((prev) => !prev);
                    }}
                    className="cursor-pointer"
                  >
                    <CategoryRow category={category} />
                    <Check
                      className={cn(
                        "ml-auto w-4 h-4 opacity-0",
                        value === category.name && "opacity-100"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const CategoryRow = ({ category }: { category: Category }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer">
      <span role="img">{category.icon}</span>
      <span>{category.name}</span>
    </div>
  );
};
