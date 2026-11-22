
import { supabase } from "../lib/supabase";

export type SupplierOffer = {
  id: string;
  supplier: string;
  location: string;
  phone: string | null;
  product: string;
  price: number;
  unit: string;
  moq: number;
  delivery: string;
};

export async function getSupplierOffers(): Promise<SupplierOffer[]> {
  const { data, error } = await supabase
    .from("supplier_offers")
    .select(`
      id,
      product_name,
      unit,
      unit_price,
      moq,
      delivery_estimate,
      supplier:suppliers (
        name,
        location,
        phone
      )
    `)
    .eq("is_demo", true)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((offer) => {
    const supplier = offer.supplier as unknown as {
      name: string;
      location: string;
      phone: string | null;
    };

    return {
      id: offer.id,
      supplier: supplier.name,
      location: supplier.location,
      phone: supplier.phone,
      product: offer.product_name,
      price: Number(offer.unit_price),
      unit: offer.unit,
      moq: offer.moq,
      delivery: offer.delivery_estimate ?? "Not specified",
    };
  });
}
