import { Button } from "@/components/ui/button";
import { CreateTransactionDialog } from "./CreateTransactionDialog";

export const CreateTransactions = () => {
  return (
    <div className="flex items-center gap-3 ml-auto">
      <CreateTransactionDialog
        trigger={
          <Button
            variant={"outline"}
            className="border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
          >
            New income 🤑
          </Button>
        }
        type="income"
      />

      <CreateTransactionDialog
        trigger={
          <Button
            variant={"outline"}
            className="border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white"
          >
            New expense 😤
          </Button>
        }
        type="expense"
      />
    </div>
  );
};
