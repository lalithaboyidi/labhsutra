
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  Wallet,
  IndianRupee,
  Package,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import "./PurchasePlanner.css";

type Offer = {
  id: number;
  product: string;
  supplier: string;
  price: number;
  unit: string;
  moq: number;
};

type PlanItem = {
  id: number;
  offerId: number;
  quantity: number;
};

const demoOffers: Offer[] = [
  { id: 1, product: "Rice 25kg", supplier: "Sri Lakshmi Traders", price: 1180, unit: "bag", moq: 5 },
  { id: 2, product: "Rice 25kg", supplier: "Venkateswara Wholesale", price: 1220, unit: "bag", moq: 2 },
  { id: 3, product: "Rice 25kg", supplier: "Annapurna Distributors", price: 1150, unit: "bag", moq: 10 },
  { id: 4, product: "Sugar 1kg", supplier: "Sri Sai Agencies", price: 42, unit: "pack", moq: 50 },
  { id: 5, product: "Sugar 1kg", supplier: "Balaji Wholesale", price: 44, unit: "pack", moq: 25 },
  { id: 6, product: "Sunflower Oil 1L", supplier: "Fresh Oil Suppliers", price: 132, unit: "bottle", moq: 24 },
  { id: 7, product: "Sunflower Oil 1L", supplier: "Coastal Distributors", price: 128, unit: "bottle", moq: 48 },
];

const AVAILABLE_CASH = 68000;

function PurchasePlanner() {
  const [items, setItems] = useState<PlanItem[]>([]);
  const [selectedOffer, setSelectedOffer] = useState("1");
  const [quantity, setQuantity] = useState("5");

  const total = useMemo(() => {
    return items.reduce((sum, item) => {
      const offer = demoOffers.find((entry) => entry.id === item.offerId);
      return sum + (offer ? offer.price * item.quantity : 0);
    }, 0);
  }, [items]);

  const addItem = () => {
    const offer = demoOffers.find((entry) => entry.id === Number(selectedOffer));
    const qty = Number(quantity);

    if (!offer || !Number.isInteger(qty) || qty < offer.moq) {
      alert(`Minimum order quantity is ${offer?.moq ?? 1}.`);
      return;
    }

    setItems((current) => [
      ...current,
      { id: Date.now(), offerId: offer.id, quantity: qty },
    ]);
  };

  const removeItem = (id: number) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const remaining = AVAILABLE_CASH - total;
  const withinBudget = remaining >= 0;

  return (
    <div className="planner-page">
      <div className="planner-heading">
        <div>
          <span className="planner-eyebrow">SMART PURCHASE MANAGEMENT</span>
          <h1>Purchase Planner</h1>
          <p>Plan your stock purchases and keep spending under control.</p>
        </div>
        <span className="planner-demo-label">DEMO DATA</span>
      </div>

      <div className="planner-summary">
        <div className="planner-stat">
          <span><Wallet size={18} /> Available Cash</span>
          <h2>₹{AVAILABLE_CASH.toLocaleString("en-IN")}</h2>
          <small>Sample cash balance</small>
        </div>

        <div className="planner-stat">
          <span><ShoppingCart size={18} /> Planned Purchases</span>
          <h2>₹{total.toLocaleString("en-IN")}</h2>
          <small>{items.length} purchase items</small>
        </div>

        <div className="planner-stat">
          <span><IndianRupee size={18} /> Remaining Budget</span>
          <h2 className={withinBudget ? "planner-positive" : "planner-negative"}>
            ₹{remaining.toLocaleString("en-IN")}
          </h2>
          <small>After planned purchases</small>
        </div>
      </div>

      <section className="planner-card">
        <div className="planner-section-heading">
          <div>
            <h2><Plus size={19} /> Add Purchase</h2>
            <p>Select a supplier offer and enter your required quantity.</p>
          </div>
        </div>

        <div className="planner-add-form">
          <label>
            Product & Supplier
            <select
              value={selectedOffer}
              onChange={(event) => {
                const offer = demoOffers.find(
                  (entry) => entry.id === Number(event.target.value)
                );
                setSelectedOffer(event.target.value);
                setQuantity(String(offer?.moq ?? 1));
              }}
            >
              {demoOffers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.product} — {offer.supplier} (₹{offer.price}/{offer.unit})
                </option>
              ))}
            </select>
          </label>

          <label>
            Quantity
            <input
              type="number"
              min="1"
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>

          <button className="planner-add-button" onClick={addItem}>
            <Plus size={17} /> Add to Plan
          </button>
        </div>

        <p className="planner-hint">
          <Package size={15} /> Minimum order quantity (MOQ) is different for each supplier.
        </p>
      </section>

      <section className="planner-card">
        <div className="planner-section-heading">
          <div>
            <h2><ShoppingCart size={19} /> Your Purchase List</h2>
            <p>Review your selected products before purchasing.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="planner-empty">
            <ShoppingCart size={32} />
            <h3>No purchases planned yet</h3>
            <p>Add products above to start planning your purchases.</p>
          </div>
        ) : (
          <div className="planner-table-wrap">
            <table className="planner-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const offer = demoOffers.find(
                    (entry) => entry.id === item.offerId
                  )!;

                  return (
                    <tr key={item.id}>
                      <td>{offer.product}</td>
                      <td>{offer.supplier}</td>
                      <td>{item.quantity} {offer.unit}</td>
                      <td>₹{offer.price.toLocaleString("en-IN")}</td>
                      <td className="planner-item-total">
                        ₹{(offer.price * item.quantity).toLocaleString("en-IN")}
                      </td>
                      <td>
                        <button
                          className="planner-remove"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove purchase"
                        >
                          <Trash2 size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="planner-total-row">
          <span>Grand Total</span>
          <strong>₹{total.toLocaleString("en-IN")}</strong>
        </div>
      </section>

      <section className={`planner-budget ${withinBudget ? "budget-ok" : "budget-warning"}`}>
        {withinBudget ? <CheckCircle size={22} /> : <AlertCircle size={22} />}
        <div>
          <h3>{withinBudget ? "Purchase plan is within budget" : "Budget exceeded"}</h3>
          <p>
            {withinBudget
              ? `You will have ₹${remaining.toLocaleString("en-IN")} remaining after these purchases.`
              : `You need ₹${Math.abs(remaining).toLocaleString("en-IN")} more to cover this purchase plan.`}
          </p>
        </div>
      </section>

      <p className="planner-disclaimer">
        Demo only: supplier offers and available cash are sample values.
        Verify prices, availability and supplier details before purchasing.
      </p>
    </div>
  );
}

export default PurchasePlanner;
