"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Edit2,
  PlusSquare,
  TrashIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import type { TransactionType } from "@/lib/types";
import type { Category } from "@prisma/client";
import { SkeletonWrapper } from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateCategoryDialog } from "@/app/(dashboard)/_components/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";

export const CategoryList = ({ type }: { type: TransactionType }) => {
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ["categories", type],
    queryFn: async () => {
      const response = await fetch(`/api/categories?type=${type}`);
      return await response.json();
    },
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg bg-red-400/10 p-2 text-red-500" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg bg-emerald-400/10 p-2 text-emerald-500" />
              )}
              <div>
                <p className="capitalize">{type}s categories</p>
                <p className="text-sm text-muted-foreground">Sort by name</p>
              </div>
            </div>

            <CreateCategoryDialog
              action="create"
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <PlusSquare className="h-4 w-4" />
                  Create category
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>

        <Separator />

        {dataAvailable ? (
          <div className="grid grid-flow-row sm:grid-flow-row gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard category={category} key={category.name} />
            ))}
          </div>
        ) : (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              No{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-emerald-500" : "text-red-500"
                )}
              >
                {type}
              </span>
              categories yet
            </p>

            <p className="text-sm text-muted-foreground">
              Create one to get started
            </p>
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
};

const CategoryCard = ({ category }: { category: Category }) => {
  return (
    <div className="flex border-separate flex-col justify-between rounded-md border shadow-md shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>

      <div className="flex justify-between gap-2">
        <DeleteCategoryDialog
          category={category}
          trigger={
            <Button
              variant={"secondary"}
              className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-red-500/20"
            >
              <TrashIcon className="h-4 w-4" />
              Remove
            </Button>
          }
        />
        <CreateCategoryDialog
          action="edit"
          category={category}
          type={category.type as TransactionType}
          trigger={
            <Button
              variant={"outline"}
              className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground hover:bg-emerald-500/20"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          }
        />
      </div>
    </div>
  );
};
