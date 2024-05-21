"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useCallback, useState, type ReactNode } from "react";
import { toast } from "sonner";

import type { TransactionType } from "@/lib/types";

import {
  CreateTransactionSchema,
  type CreateTransactionSchemaType,
} from "@/schema/transaction";
import { CreateTransaction } from "../_actions/transactions";
import { DateToUTCDate } from "@/lib/helpers";
import { TransactionDialog } from "@/components/TransactionDialog";

interface Props {
  trigger: ReactNode;
  type: TransactionType;
}

export const CreateTransactionDialog = ({ trigger, type }: Props) => {
  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(CreateTransactionSchema),
    defaultValues: {
      type,
      description: "",
      amount: 0,
      date: new Date(),
    },
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: async (data) => {
      toast.success("Transaction created successfully 🎉", {
        id: "create-transaction",
      });
      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      // After creating the transaction, we need to invalidate the overview query which will refetch data in the home page

      await queryClient.invalidateQueries({
        queryKey: ["overview"],
      });
      setIsOpen((prev) => !prev);
    },
  });

  const onSubmit = useCallback(
    (values: CreateTransactionSchemaType) => {
      toast.loading("Create transaction...", { id: "create-transaction" });
      mutate({ ...values, date: DateToUTCDate(values.date) });
    },
    [mutate]
  );

  return (
    <TransactionDialog
      action="create"
      form={form}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      trigger={trigger}
      type={type}
      onSubmit={onSubmit}
      isPending={isPending}
      handleCategoryChange={handleCategoryChange}
    />
  );
};
