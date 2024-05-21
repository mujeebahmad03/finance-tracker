"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GetFormatterForCurrency } from "@/lib/helpers";
import type { Period, TimeFrame } from "@/lib/types";
import type { UserSettings } from "@prisma/client";
import { HistoryPeriodSelector } from "./HistoryPeriodSelector";
import { SkeletonWrapper } from "@/components/SkeletonWrapper";
import type { GetHistoryDataResponseType } from "@/app/api/history-data/route";
import { HistoryChart } from "./HistoryChart";

export const TransactionHistory = ({
  userSettings,
}: {
  userSettings: UserSettings;
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month");
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  const historyDataQuery = useQuery<GetHistoryDataResponseType>({
    queryKey: ["overview", "history", period, timeFrame],
    queryFn: async () => {
      const response = await fetch(
        `/api/history-data?timeFrame=${timeFrame}&year=${period.year}&month=${period.month}`
      );
      return await response.json();
    },
  });

  const dataAvailable =
    historyDataQuery.data && historyDataQuery.data.length > 0;

  return (
    <div className="container">
      <h2 className="mt-12 text-3xl font-bold">History</h2>
      <Card className="col-span-12 mt-12 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col">
            <HistoryPeriodSelector
              period={period}
              setPeriod={setPeriod}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
            />

            <div className="flex h-10 gap-2">
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-emerald-500" />
                Income
              </Badge>
              <Badge
                variant={"outline"}
                className="flex items-center gap-2 text-sm"
              >
                <div className="h-4 w-4 rounded-full bg-red-500" />
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SkeletonWrapper isLoading={historyDataQuery.isFetching}>
            {dataAvailable ? (
              <HistoryChart
                historyData={historyDataQuery.data}
                formatter={formatter}
                timeFrame={timeFrame}
              />
            ) : (
              <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
                <p>No data from the selected period</p>
                <p className="text-sm text-muted-foreground">
                  Try selecting a different period or adding new transactions
                </p>
              </Card>
            )}
          </SkeletonWrapper>
        </CardContent>
      </Card>
    </div>
  );
};
