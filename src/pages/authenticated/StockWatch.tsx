import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  IndianRupee,
  TrendingDown,
  Plus,
  Search,
  Pencil,
  X,
} from "lucide-react";
import {
  createInventoryProduct,
  getInventoryProducts,
  recordInventoryMovement,
  type InventoryProduct,
} from "../../services/inventoryService";
import "./StockWatch.css";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

function getStockStatus(product: InventoryProduct) {
  if (product.quantity === 0) return "empty";
  if (product.quantity <= product.reorder_level) return "low";
  return "available";
}

export default function StockWatch() {
  const [products, setProducts] = useState<InventoryProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    quantity: "",
    reorderLevel: "",
    unitPrice: "",
  });

  async function loadProducts() {
    try {
      setError("");
      const data = await getInventoryProducts();
      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load inventory.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProducts();
  }, []);

  const lowStock = products.filter(
    (product) => product.quantity > 0 &&
      product.quantity <= product.reorder_level,
  ).length;

  const outOfStock = products.filter(
    (product) => product.quantity === 0,
  ).length;

  const inventoryValue = products.reduce(
    (total, product) =>
      total + product.quantity * product.unit_price,
    0,
  );

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return products;

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        (product.category ?? "").toLowerCase().includes(term),
    );
  }, [products, search]);

  function updateForm(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function resetForm() {
    setForm({
      name: "",
      category: "",
      quantity: "",
      reorderLevel: "",
      unitPrice: "",
    });
  }

  async function handleAddProduct(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const quantity = Number(form.quantity);
    const reorderLevel = Number(form.reorderLevel);
    const unitPrice = Number(form.unitPrice);

    if (
      !form.name.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      !Number.isInteger(reorderLevel) ||
      reorderLevel < 0 ||
      !Number.isFinite(unitPrice) ||
      unitPrice <= 0
    ) {
      setError("Enter valid product details and non-negative quantities.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      await createInventoryProduct({
        name: form.name,
        category: form.category,
        quantity,
        reorderLevel,
        unitPrice,
      });

      await loadProducts();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleQuantityUpdate(product: InventoryProduct) {
    const quantity = Number(newQuantity);

    if (!Number.isInteger(quantity) || quantity < 0) {
      setError("Quantity must be a non-negative whole number.");
      return;
    }

    const difference = quantity - product.quantity;

    if (difference === 0) {
      setEditingId(null);
      return;
    }

    try {
      setSaving(true);
      setError("");

      await recordInventoryMovement({
        productId: product.id,
        movementType: difference > 0 ? "stock_in" : "stock_out",
        quantityDelta: Math.abs(difference),
        note: "Quantity updated from Stock Watch",
      });

      await loadProducts();
      setEditingId(null);
      setNewQuantity("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update stock.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="stock-page">
      <div className="stock-heading">
        <div>
          <h1>Stock Watch</h1>
          <p>Monitor your inventory and keep track of stock levels.</p>
        </div>

        <button
          className="stock-primary-btn"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="stock-alert">
          <AlertTriangle size={18} />
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="stock-stats">
        <div className="stock-stat-card">
          <div className="stock-icon">
            <Package size={22} />
          </div>
          <div>
            <p>Total Products</p>
            <h2>{products.length}</h2>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon warning">
            <AlertTriangle size={22} />
          </div>
          <div>
            <p>Low Stock</p>
            <h2>{lowStock}</h2>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon danger">
            <TrendingDown size={22} />
          </div>
          <div>
            <p>Out of Stock</p>
            <h2>{outOfStock}</h2>
          </div>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon">
            <IndianRupee size={22} />
          </div>
          <div>
            <p>Inventory Value</p>
            <h2>{currency.format(inventoryValue)}</h2>
          </div>
        </div>
      </div>

      <section className="stock-section">
        <div className="stock-section-heading">
          <div>
            <h2>Inventory</h2>
            <p>Products stored in your shop</p>
          </div>

          <div className="stock-search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="stock-empty">Loading inventory...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="stock-empty">
            {products.length === 0
              ? "No products found. Add your first product."
              : "No products match your search."}
          </div>
        ) : (
          <div className="stock-table-wrap">
            <table className="stock-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Reorder Level</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map((product) => {
                  const status = getStockStatus(product);
                  const isEditing = editingId === product.id;

                  return (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category || "—"}</td>
                      <td>
                        {isEditing ? (
                          <input
                            className="stock-quantity-input"
                            type="number"
                            min="0"
                            step="1"
                            value={newQuantity}
                            onChange={(event) =>
                              setNewQuantity(event.target.value)
                            }
                          />
                        ) : (
                          product.quantity
                        )}
                      </td>
                      <td>{product.reorder_level}</td>
                      <td>{currency.format(product.unit_price)}</td>
                      <td>
                        {currency.format(
                          product.quantity * product.unit_price,
                        )}
                      </td>
                      <td>
                        <span className={`stock-status ${status}`}>
                          {status === "empty"
                            ? "Out of Stock"
                            : status === "low"
                              ? "Low Stock"
                              : "Available"}
                        </span>
                      </td>
                      <td>
                        {isEditing ? (
                          <div className="stock-actions">
                            <button
                              className="stock-save-btn"
                              disabled={saving}
                              onClick={() =>
                                void handleQuantityUpdate(product)
                              }
                            >
                              Save
                            </button>
                            <button
                              className="stock-cancel-btn"
                              onClick={() => {
                                setEditingId(null);
                                setNewQuantity("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            className="stock-action-btn"
                            onClick={() => {
                              setError("");
                              setEditingId(product.id);
                              setNewQuantity(String(product.quantity));
                            }}
                            aria-label={`Edit ${product.name} quantity`}
                          >
                            <Pencil size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showModal && (
        <div className="stock-modal-backdrop">
          <div className="stock-modal">
            <div className="stock-modal-heading">
              <h2>Add New Product</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <label>
                Product Name
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    updateForm("name", event.target.value)
                  }
                  placeholder="Enter product name"
                  required
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateForm("category", event.target.value)
                  }
                  placeholder="e.g. Grains, Essentials"
                />
              </label>

              <label>
                Quantity
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.quantity}
                  onChange={(event) =>
                    updateForm("quantity", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Reorder Level
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.reorderLevel}
                  onChange={(event) =>
                    updateForm("reorderLevel", event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Unit Price (₹)
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.unitPrice}
                  onChange={(event) =>
                    updateForm("unitPrice", event.target.value)
                  }
                  required
                />
              </label>

              <div className="stock-actions">
                <button
                  type="button"
                  className="stock-cancel-btn"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="stock-submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}