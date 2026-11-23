import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  ClipboardList,
  Package,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import {
  getSupplierOffers,
  type SupplierOffer,
} from "../../services/supplierService";

import {
  createPurchasePlan,
  getPurchasePlans,
  type SavedPurchasePlan,
} from "../../services/purchasePlannerService";

import "./PurchasePlanner.css";

type PlannerItem = {
  offerId: string;
  quantity: number;
};

function PurchasePlanner() {
  const [offers, setOffers] = useState<SupplierOffer[]>([]);
  const [plans, setPlans] = useState<SavedPurchasePlan[]>([]);
  const [items, setItems] = useState<PlannerItem[]>([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [supplierOffers, savedPlans] = await Promise.all([
        getSupplierOffers(),
        getPurchasePlans(),
      ]);

      setOffers(supplierOffers);
      setPlans(savedPlans);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load purchase planner data."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const selectedOfferData = offers.find(
    (offer) => offer.id === selectedOffer
  );

  const total = useMemo(
    () =>
      items.reduce((sum, item) => {
        const offer = offers.find((entry) => entry.id === item.offerId);
        return sum + (offer ? offer.price * item.quantity : 0);
      }, 0),
    [items, offers]
  );

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  function addItem() {
    setError("");
    setSuccess("");

    if (!selectedOfferData) {
      setError("Please select a supplier offer.");
      return;
    }

    const parsedQuantity = Number(quantity);

    if (
      !Number.isInteger(parsedQuantity) ||
      parsedQuantity < selectedOfferData.moq
    ) {
      setError(
        `Minimum order quantity is ${selectedOfferData.moq} ${selectedOfferData.unit}(s).`
      );
      return;
    }

    setItems((current) => {
      const existing = current.find(
        (item) => item.offerId === selectedOffer
      );

      if (existing) {
        return current.map((item) =>
          item.offerId === selectedOffer
            ? { ...item, quantity: item.quantity + parsedQuantity }
            : item
        );
      }

      return [
        ...current,
        {
          offerId: selectedOffer,
          quantity: parsedQuantity,
        },
      ];
    });

    setQuantity("1");
    setSuccess("Item added to your purchase plan.");
  }

  function removeItem(offerId: string) {
    setItems((current) =>
      current.filter((item) => item.offerId !== offerId)
    );
    setSuccess("");
  }

  async function savePlan() {
    setError("");
    setSuccess("");

    if (items.length === 0) {
      setError("Add at least one item before saving your plan.");
      return;
    }

    try {
      setSaving(true);

      const planId = await createPurchasePlan(
        items.map((item) => ({
          supplier_offer_id: item.offerId,
          quantity: item.quantity,
        }))
      );

      const updatedPlans = await getPurchasePlans();
      setPlans(updatedPlans);
      setItems([]);
      setSuccess(`Purchase plan saved successfully. Reference: ${planId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save purchase plan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="auth-planner-state">
        Loading purchase planner...
      </div>
    );
  }

  return (
    <div className="auth-planner-page">
      <div className="auth-planner-heading">
        <div>
          <h2>Purchase Planner</h2>
          <p>Plan purchases using available sample supplier offers.</p>
        </div>

        <button
          className="auth-planner-refresh"
          onClick={loadData}
          disabled={saving}
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="auth-planner-notice">
        <AlertCircle size={19} />
        <p>
          Supplier prices are simulated sample data. The planner saves
          your selections to your authenticated shop's database.
          No actual purchase or payment is made.
        </p>
      </div>

      {error && (
        <div className="auth-planner-message auth-planner-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {success && (
        <div className="auth-planner-message auth-planner-success">
          {success}
        </div>
      )}

      <section className="auth-planner-section">
        <div className="auth-planner-section-heading">
          <div>
            <h3>Add Products to Plan</h3>
            <p>Select an offer and enter the required quantity.</p>
          </div>
        </div>

        <div className="auth-planner-form">
          <div className="auth-planner-field">
            <label htmlFor="planner-offer">Supplier Offer</label>
            <select
              id="planner-offer"
              value={selectedOffer}
              onChange={(event) => setSelectedOffer(event.target.value)}
            >
              <option value="">Select a supplier offer</option>
              {offers.map((offer) => (
                <option key={offer.id} value={offer.id}>
                  {offer.product} — {offer.supplier} (
                  {formatCurrency(offer.price)}/{offer.unit})
                </option>
              ))}
            </select>
          </div>

          <div className="auth-planner-field">
            <label htmlFor="planner-quantity">Quantity</label>
            <input
              id="planner-quantity"
              type="number"
              min={selectedOfferData?.moq ?? 1}
              step="1"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
            {selectedOfferData && (
              <small>
                Minimum: {selectedOfferData.moq}{" "}
                {selectedOfferData.unit}(s)
              </small>
            )}
          </div>

          <button
            className="auth-planner-add"
            onClick={addItem}
            disabled={offers.length === 0}
          >
            <Plus size={17} />
            Add Item
          </button>
        </div>
      </section>

      <section className="auth-planner-section">
        <div className="auth-planner-section-heading">
          <div>
            <h3>Current Purchase Plan</h3>
            <p>{items.length} item(s) selected</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="auth-planner-empty">
            <Package size={30} />
            <strong>No items added yet</strong>
            <p>Select supplier offers above to start planning.</p>
          </div>
        ) : (
          <>
            <div className="auth-planner-table-wrap">
              <table className="auth-planner-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>Unit Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const offer = offers.find(
                      (entry) => entry.id === item.offerId
                    );

                    if (!offer) return null;

                    return (
                      <tr key={item.offerId}>
                        <td>{offer.product}</td>
                        <td>{offer.supplier}</td>
                        <td>{formatCurrency(offer.price)}</td>
                        <td>
                          {item.quantity} {offer.unit}(s)
                        </td>
                        <td>
                          <strong>
                            {formatCurrency(offer.price * item.quantity)}
                          </strong>
                        </td>
                        <td>
                          <button
                            className="auth-planner-remove"
                            onClick={() => removeItem(item.offerId)}
                            aria-label={`Remove ${offer.product}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="auth-planner-total">
              <span>Estimated Plan Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>

            <div className="auth-planner-actions">
              <button
                className="auth-planner-save"
                onClick={savePlan}
                disabled={saving}
              >
                <ClipboardList size={17} />
                {saving ? "Saving..." : "Save Purchase Plan"}
              </button>
            </div>
          </>
        )}
      </section>

      <section className="auth-planner-section">
        <div className="auth-planner-section-heading">
          <div>
            <h3>Saved Purchase Plans</h3>
            <p>Your previously saved plans.</p>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="auth-planner-empty">
            <ClipboardList size={30} />
            <strong>No saved plans yet</strong>
            <p>Your saved purchase plans will appear here.</p>
          </div>
        ) : (
          <div className="auth-planner-saved-list">
            {plans.map((plan) => (
              <div className="auth-planner-saved-card" key={plan.id}>
                <div>
                  <strong>
                    Purchase Plan ·{" "}
                    {new Date(plan.created_at).toLocaleDateString("en-IN")}
                  </strong>
                  <small>
                    {plan.purchase_plan_items.length} item(s) ·{" "}
                    {plan.status}
                  </small>
                </div>

                <strong>{formatCurrency(plan.total)}</strong>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default PurchasePlanner;