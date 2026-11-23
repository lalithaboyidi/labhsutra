
import { supabase } from "../lib/supabase";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string | null;
  quantity: number;
  reorder_level: number;
  unit_price: number;
  created_at: string;
};

export async function getInventoryProducts() {
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, category, quantity, reorder_level, unit_price, created_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((product) => ({
    ...product,
    unit_price: Number(product.unit_price),
  })) as InventoryProduct[];
}

export async function createInventoryProduct(product: {
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  unitPrice: number;
}) {
  const { data, error } = await supabase.rpc("create_product", {
    p_name: product.name.trim(),
    p_category: product.category.trim() || null,
    p_quantity: product.quantity,
    p_reorder_level: product.reorderLevel,
    p_unit_price: product.unitPrice,
  });

  if (error) throw error;

  return data;
}

export async function recordInventoryMovement(movement: {
  productId: string;
  movementType: "stock_in" | "stock_out" | "adjustment";
  quantityDelta: number;
  note?: string;
}) {
  const { data, error } = await supabase.rpc(
    "record_inventory_movement",
    {
      p_product_id: movement.productId,
      p_movement_type: movement.movementType,
      p_quantity_delta: movement.quantityDelta,
      p_note: movement.note?.trim() || null,
    }
  );

  if (error) throw error;

  return data;
}
