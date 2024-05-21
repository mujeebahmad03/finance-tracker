"use client";

import data from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { useTheme } from "next-themes";
import { type ReactNode, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import type { TransactionType } from "@/lib/types";
import {
  CreateCategorySchema,
  type CreateCategorySchemaType,
} from "@/schema/category";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CreateCategory,
  EditCategory,
} from "@/app/(dashboard)/_actions/categories";
import type { Category } from "@prisma/client";

interface Props {
  type: TransactionType;
  successCallback?: (category: Category) => void;
  trigger?: ReactNode;
  action: "create" | "edit";
  category?: Category;
}

export const CreateCategoryDialog = ({
  action,
  category,
  type,
  successCallback,
  trigger,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues:
      action === "create"
        ? {
            name: "",
            type,
          }
        : {
            name: category?.name,
            icon: category?.icon,
            type,
          },
  });

  const queryClient = useQueryClient();

  const theme = useTheme();

  const queryId = action === "create" ? "create-category" : "edit-category";
  const actionType = action === "create" ? "Create" : "Edit";

  const { mutate, isPending } = useMutation({
    mutationFn: action === "create" ? CreateCategory : EditCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(
        `Category ${data.name} ${
          action === "create" ? "created" : "edited"
        } successfully 🎉`,
        {
          id: queryId,
        }
      );

      successCallback?.(data);

      await queryClient.invalidateQueries({ queryKey: ["categories"] });

      setIsOpen(false);
    },

    onError: () => {
      toast.error("Something went wrong", {
        id: queryId,
      });
    },
  });

  const onSubmit = useCallback(
    (values: CreateCategorySchemaType) => {
      toast.loading(`${actionType} category...`, { id: queryId });
      mutate(values);
    },
    [actionType, mutate, queryId]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="ghost"
            className="flex border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground"
            onClick={() => setIsOpen(true)}
          >
            <PlusSquare className="mr-2 h-4 w-4" />
            Create category
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mr-auto sm:mx-auto">
            {actionType}{" "}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-emerald-500" : "text-red-500"
              )}
            >
              {type}
            </span>{" "}
            category
          </DialogTitle>
          <DialogDescription className="text-start sm:text-center">
            Categories are used to group your transactions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category" {...field} />
                  </FormControl>
                  <FormDescription>Category name (required)</FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="h-[100px] w-full"
                        >
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl" role="img">
                                {field.value}
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Click to change
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="h-[48px] w-[48px]" />
                              <p className="text-xs text-muted-foreground">
                                Click to select
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full translate-y-[30%]">
                        <EmojiPicker
                          theme={theme.resolvedTheme}
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    This is how your category will appear in the app(required)
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {!isPending ? actionType : <Loader2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
