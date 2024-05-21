"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import type { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import { SkeletonWrapper } from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateToUTCDate, GetFormatterForCurrency } from "@/lib/helpers";
import type { TransactionType } from "@/lib/types";
import type { UserSettings } from "@prisma/client";

interface Props {
  from: Date;
  to: Date;
  userSettings: UserSettings;
}

export const CategoriesStats = ({ from, to, userSettings }: Props) => {
  const categoryStatsQuery = useQuery<GetCategoriesStatsResponseType>({
    queryKey: ["overview", "stats", "categories", from, to],
    queryFn: async () => {
      const response = await fetch(
        `/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(
          to
        )}`
      );
      return await response.json();
    },
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
      <SkeletonWrapper isLoading={categoryStatsQuery.isFetching}>
        <CategoriesCard
          type="income"
          data={categoryStatsQuery.data || []}
          formatter={formatter}
        />
      </SkeletonWrapper>

      <SkeletonWrapper isLoading={categoryStatsQuery.isFetching}>
        <CategoriesCard
          type="expense"
          data={categoryStatsQuery.data || []}
          formatter={formatter}
        />
      </SkeletonWrapper>
    </div>
  );
};

const CategoriesCard = ({
  data,
  formatter,
  type,
}: {
  data: GetCategoriesStatsResponseType;
  formatter: Intl.NumberFormat;
  type: TransactionType;
}) => {
  const filteredData = data?.filter((el) => el.type === type);
  const total = filteredData.reduce(
    (acc, el) => acc + (el._sum?.amount || 0),
    0
  );
  return (
    <Card className="h-80 w-full col-span-6">
      <CardHeader>
        <CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
          {type === "income" ? "Income" : "Expenses"} by category
        </CardTitle>
      </CardHeader>

      <div className="flex items-center justify-between gap-2">
        {filteredData.length === 0 && (
          <div className="flex h-60 w-full flex-col items-center justify-center">
            <p>No data for the selected period</p>
            <p className="text-sm text-muted-foreground">
              Try selecting a different period or try add a new{" "}
              {type === "income" ? "incomes" : "expenses"}
            </p>
          </div>
        )}
      </div>
      {filteredData.length > 0 && (
        <ScrollArea className="h-60 w-full px-4">
          <div className="flex w-full flex-col gap-4 p-4">
            {filteredData.map((item) => {
              const amount = item._sum.amount || 0;
              const percentage = (amount * 100) / (total || amount);
              return (
                <div key={item.category} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-gray-400">
                      {item.categoryIcon} {item.category}
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </span>

                    <span className="text-sm text-gray-400">
                      {formatter.format(amount)}
                    </span>
                  </div>

                  <Progress
                    value={percentage}
                    indicator={
                      type === "income" ? "bg-emerald-500" : "bg-red-500"
                    }
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
