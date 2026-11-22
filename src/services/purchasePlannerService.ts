
import { supabase } from "../lib/supabase";

export type PurchasePlanItemInput = {
  supplier_offer_id: string;
  quantity: number;
};

export type SavedPurchasePlanItem = {
  id: string;
  product_name_snapshot: string;
  supplier_name_snapshot: string;
  unit_snapshot: string;
  unit_price_snapshot: number;
  quantity: number;
  line_total: number;
};

export type SavedPurchasePlan = {
  id: string;
  status: string;
  total: number;
  created_at: string;
  purchase_plan_items: SavedPurchasePlanItem[];
};

export async function createPurchasePlan(
  items: PurchasePlanItemInput[],
  status: "draft" | "planned" = "planned"
): Promise<string> {
  const { data, error } = await supabase.rpc("create_purchase_plan", {
    p_items: items,
    p_status: status,
  });

  if (error) throw error;

  return data;
}

export async function getPurchasePlans(): Promise<SavedPurchasePlan[]> {
  const { data, error } = await supabase
    .from("purchase_plans")
    .select(`
      id,
      status,
      total,
      created_at,
      purchase_plan_items (
        id,
        product_name_snapshot,
        supplier_name_snapshot,
        unit_snapshot,
        unit_price_snapshot,
        quantity,
        line_total
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((plan) => ({
    ...plan,
    total: Number(plan.total),
    purchase_plan_items: (plan.purchase_plan_items ?? []).map((item) => ({
      ...item,
      unit_price_snapshot: Number(item.unit_price_snapshot),
      line_total: Number(item.line_total),
    })),
  })) as SavedPurchasePlan[];
}
