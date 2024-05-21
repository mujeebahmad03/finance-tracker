"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  CreateCategorySchema,
  type DeleteCategorySchemaType,
  type CreateCategorySchemaType,
  DeleteCategorySchema,
} from "@/schema/category";
import prisma from "@/lib/prisma";

export async function CreateCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error("bad request");

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { name, icon, type } = parsedBody.data;
  return await prisma.category.create({
    data: {
      name,
      icon,
      type,
      userId: user.id,
    },
  });
}

export async function DeleteCategory(form: DeleteCategorySchemaType) {
  const parsedBody = DeleteCategorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error("bad request");

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { name, type } = parsedBody.data;

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name,
        type,
      },
    },
  });
}

export async function EditCategory(form: CreateCategorySchemaType) {
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) throw new Error("bad request");

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { name, icon, type } = parsedBody.data;

  const updatedCategory = await prisma.$transaction(async (prisma) => {
    const updatedCategories = await prisma.category.update({
      where: {
        name_userId_type: {
          userId: user.id,
          name,
          type,
        },
      },
      data: {
        ...(name && { name }),
        ...(icon && { icon }),
        ...(type && { type }),
      },
    });

    await prisma.transaction.updateMany({
      where: {
        userId: user.id,
        category: name,
        type,
      },
      data: {
        category: name,
        categoryIcon: icon,
      },
    });

    return updatedCategories;
  });

  return updatedCategory;
}
