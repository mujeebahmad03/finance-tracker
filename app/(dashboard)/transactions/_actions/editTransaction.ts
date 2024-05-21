"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from "@/schema/transaction";

export async function EditTransaction(
  id: string,
  form: CreateTransactionSchemaType
) {
  const parsedBody = CreateTransactionSchema.safeParse(form);

  if (!parsedBody.success) throw new Error(parsedBody.error.message);

  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { amount, category, date, description, type } = parsedBody.data;

  // Fetch the existing transaction
  const existingTransaction = await prisma.transaction.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

  if (!existingTransaction) throw new Error("Transaction not found");

  const categoryRow = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name: category,
    },
  });

  if (!categoryRow) throw new Error("Category not found");

  const oldAmount = existingTransaction.amount;
  const oldType = existingTransaction.type;
  const oldDate = existingTransaction.date;

  await prisma.$transaction([
    // Update the transaction
    prisma.transaction.update({
      where: {
        id,
        userId: user.id,
      },
      data: {
        amount,
        date,
        description: description || "",
        type,
        category: categoryRow.name,
        categoryIcon: categoryRow.icon,
      },
    }),
    // Adjust the old month aggregate
    prisma.monthHistory.update({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: oldDate.getUTCDate(),
          month: oldDate.getUTCMonth(),
          year: oldDate.getUTCFullYear(),
        },
      },
      data: {
        expense: { decrement: oldType === "expense" ? oldAmount : 0 },
        income: { decrement: oldType === "income" ? oldAmount : 0 },
      },
    }),
    // Adjust the new month aggregate
    prisma.monthHistory.upsert({
      where: {
        day_month_year_userId: {
          userId: user.id,
          day: date.getUTCDate(),
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        day: date.getUTCDate(),
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: { increment: type === "expense" ? amount : 0 },
        income: { increment: type === "income" ? amount : 0 },
      },
    }),
    // Adjust the old year aggregate
    prisma.yearHistory.update({
      where: {
        month_year_userId: {
          userId: user.id,
          month: oldDate.getUTCMonth(),
          year: oldDate.getUTCFullYear(),
        },
      },
      data: {
        expense: { decrement: oldType === "expense" ? oldAmount : 0 },
        income: { decrement: oldType === "income" ? oldAmount : 0 },
      },
    }),
    // Adjust the new year aggregate
    prisma.yearHistory.upsert({
      where: {
        month_year_userId: {
          userId: user.id,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        },
      },
      create: {
        userId: user.id,
        month: date.getUTCMonth(),
        year: date.getUTCFullYear(),
        expense: type === "expense" ? amount : 0,
        income: type === "income" ? amount : 0,
      },
      update: {
        expense: { increment: type === "expense" ? amount : 0 },
        income: { increment: type === "income" ? amount : 0 },
      },
    }),
  ]);
}
