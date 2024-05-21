import { useQuery } from "@tanstack/react-query";

import type { GetHistoryPeriodResponseType } from "@/app/api/history-periods/route";
import { SkeletonWrapper } from "@/components/SkeletonWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Period, TimeFrame } from "@/lib/types";

interface Props {
  period: Period;
  setPeriod: (value: Period) => void;
  timeFrame: TimeFrame;
  setTimeFrame: (value: TimeFrame) => void;
}

export const HistoryPeriodSelector = ({
  period,
  setPeriod,
  timeFrame,
  setTimeFrame,
}: Props) => {
  const historyPeriod = useQuery<GetHistoryPeriodResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: async () => {
      const response = await fetch("/api/history-periods");
      return await response.json();
    },
  });
  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
        <Tabs
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value as TimeFrame)}
        >
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>

      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
          <YearSelector
            period={period}
            setPeriod={setPeriod}
            years={historyPeriod.data || []}
          />
        </SkeletonWrapper>

        {timeFrame === "month" && (
          <SkeletonWrapper
            isLoading={historyPeriod.isFetching}
            fullWidth={false}
          >
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  );
};

const YearSelector = ({
  period,
  setPeriod,
  years,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
  years: GetHistoryPeriodResponseType;
}) => {
  return (
    <Select
      value={period.year.toString()}
      onValueChange={(value) =>
        setPeriod({ month: period.month, year: Number.parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const MonthSelector = ({
  period,
  setPeriod,
}: {
  period: Period;
  setPeriod: (period: Period) => void;
}) => {
  return (
    <Select
      value={period.month.toString()}
      onValueChange={(value) =>
        setPeriod({ year: period.year, month: Number.parseInt(value) })
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
          const monthStr = new Date(period.year, month, 1).toLocaleDateString(
            "default",
            { month: "long" }
          );
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthStr}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
