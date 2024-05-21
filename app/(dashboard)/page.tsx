import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { CreateTransactionDialog } from "./_components/CreateTransactionDialog";
import { Overview } from "./_components/Overview";
import { TransactionHistory } from "./_components/TransactionHistory";
import { CreateTransactions } from "./_components/CreateTransactions";

const DashboardPage = async () => {
  const user = await currentUser();

  if (!user) redirect("/sign-in");

  const userSettings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
  });

  if (!userSettings) redirect("/wizard");
  return (
    <div className="h-full bg-background">
      <div className="border-b bg-card">
        <div className="container flex items-center justify-between gap-6 py-8 flex-wrap">
          <p className="md:text-3xl text-2xl font-bold">
            Hello, {user.firstName}! 👋🏻
          </p>

          <CreateTransactions />
        </div>
      </div>

      <Overview userSettings={userSettings} />
      <TransactionHistory userSettings={userSettings} />
    </div>
  );
};

export default DashboardPage;
