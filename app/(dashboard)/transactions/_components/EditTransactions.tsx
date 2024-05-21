import type { TransactionType } from "@/lib/types";
import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from "@/schema/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Transaction } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { EditTransaction } from "../_actions/editTransaction";
import { toast } from "sonner";
import { DateToUTCDate } from "@/lib/helpers";
import { TransactionDialog } from "@/components/TransactionDialog";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  transaction: Transaction;
  type: TransactionType;
}

export const EditTransactions = ({
  isOpen,
  setIsOpen,
  transaction,
  type,
}: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      description: transaction.description || "",
      amount: transaction.amount || 0,
      category: transaction.category || undefined,
      date: new Date(transaction.date),
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (data: { id: string; form: CreateTransactionSchemaType }) =>
      EditTransaction(data.id, data.form),
    onSuccess: async (data) => {
      toast.success("Transaction edited successfully 🎉", {
        id: "edit-transaction",
      });
      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ["transactions"],
      });
      setIsOpen(false);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Editing transaction...", { id: "edit-transaction" });
      mutate({
        id: transaction.id,
        form: { ...values, date: DateToUTCDate(values.date) },
      });
    },
    [mutate, transaction.id]
  );

  return (
    <TransactionDialog
      action="edit"
      form={form}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      type={type}
      onSubmit={onSubmit}
      isPending={isPending}
      handleCategoryChange={handleCategoryChange}
    />
  );
};
