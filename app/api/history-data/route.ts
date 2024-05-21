import prisma from "@/lib/prisma";
import type { Period, TimeFrame } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { getDaysInMonth } from "date-fns";
import { redirect } from "next/navigation";
import { z } from "zod";

const getHistoryDataSchema = z.object({
  timeFrame: z.enum(["month", "year"]),
  month: z.coerce.number().min(0).max(11).default(0),
  year: z.coerce.number().min(2000).default(2024),
});

export const GET = async (req: Request) => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const { searchParams } = new URL(req.url);

  const timeFrame = searchParams.get("timeFrame");
  const month = searchParams.get("month");
  const year = searchParams.get("year");

  const queryParams = getHistoryDataSchema.safeParse({
    timeFrame,
    month,
    year,
  });

  if (!queryParams.success) {
    return Response.json(queryParams.error.message, { status: 400 });
  }

  const data = await getHistoryData(user.id, queryParams.data.timeFrame, {
    month: queryParams.data.month,
    year: queryParams.data.year,
  });

  return Response.json(data);
};

export type GetHistoryDataResponseType = Awaited<
  ReturnType<typeof getHistoryData>
>;

const getHistoryData = async (
  userId: string,
  timeFrame: TimeFrame,
  period: Period
) => {
  switch (timeFrame) {
    case "year":
      return await getYearHistoryData(userId, period.year);
    case "month":
      return await getMonthHistoryData(userId, period.year, period.month);
  }
};

export type HistoryData = {
  expense: number;
  income: number;
  year: number;
  month: number;
  day?: number;
};

const getYearHistoryData = async (userId: string, year: number) => {
  const result = await prisma.yearHistory.groupBy({
    by: ["month"],
    where: { userId, year },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [{ month: "asc" }],
  });

  if (!result || result.length === 0) return [];

  const history: HistoryData[] = Array.from({ length: 12 }, (_, i) => {
    const monthData = result.find((row) => row.month === i) || {
      _sum: { expense: 0, income: 0 },
    };
    return {
      year,
      month: i,
      expense: monthData._sum.expense || 0,
      income: monthData._sum.income || 0,
    };
  });

  return history;
};

const getMonthHistoryData = async (
  userId: string,
  year: number,
  month: number
) => {
  const result = await prisma.monthHistory.groupBy({
    by: ["day"],
    where: { userId, year, month },
    _sum: {
      expense: true,
      income: true,
    },
    orderBy: [{ day: "asc" }],
  });

  if (!result || result.length === 0) return [];

  const daysInMonth = getDaysInMonth(new Date(year, month));
  const history: HistoryData[] = Array.from({ length: daysInMonth }, (_, i) => {
    const dayData = result.find((row) => row.day === i + 1) || {
      _sum: { expense: 0, income: 0 },
    };
    return {
      year,
      month,
      day: i + 1,
      expense: dayData._sum.expense || 0,
      income: dayData._sum.income || 0,
    };
  });

  return history;
};
