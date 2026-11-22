
import { supabase } from "../lib/supabase";

export type LedgerCustomer = {
  id: string;
  name: string;
  phone: string;
  outstanding: number;
};

export type LedgerTransaction = {
  id: string;
  customer_id: string;
  type: "credit" | "payment";
  amount: number;
  note: string | null;
  created_at: string;
};

async function getShopId(): Promise<string> {
  const { data, error } = await supabase
    .from("shops")
    .select("id")
    .single();

  if (error) throw error;

  return data.id;
}

export async function getLedgerData() {
  const { data: customerRows, error: customerError } = await supabase
    .from("customers")
    .select("id, name, phone, created_at")
    .order("created_at", { ascending: false });

  if (customerError) throw customerError;

  const { data: transactionRows, error: transactionError } = await supabase
    .from("ledger_transactions")
    .select("id, customer_id, type, amount, note, created_at")
    .order("created_at", { ascending: false });

  if (transactionError) throw transactionError;

  const balances = new Map<string, number>();

  for (const transaction of transactionRows ?? []) {
    const amount = Number(transaction.amount);
    const change =
      transaction.type === "credit" ? amount : -amount;

    balances.set(
      transaction.customer_id,
      (balances.get(transaction.customer_id) ?? 0) + change
    );
  }

  const customers: LedgerCustomer[] = (customerRows ?? []).map(
    (customer) => ({
      id: customer.id,
      name: customer.name,
      phone: customer.phone,
      outstanding: balances.get(customer.id) ?? 0,
    })
  );

  const transactions: LedgerTransaction[] = (
    transactionRows ?? []
  ).map((transaction) => ({
    ...transaction,
    amount: Number(transaction.amount),
  }));

  return { customers, transactions };
}

export async function addCustomer(name: string, phone: string) {
  const shopId = await getShopId();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      shop_id: shopId,
      name: name.trim(),
      phone: phone.trim(),
    })
    .select("id, name, phone")
    .single();

  if (error) throw error;

  return data;
}

export async function recordLedgerTransaction(data: {
  customerId: string;
  type: "credit" | "payment";
  amount: number;
  note?: string;
}) {
  const { data: transactionId, error } = await supabase.rpc(
    "record_ledger_transaction",
    {
      p_customer_id: data.customerId,
      p_type: data.type,
      p_amount: data.amount,
      p_note: data.note?.trim() || null,
    }
  );

  if (error) throw error;

  return transactionId;
}
