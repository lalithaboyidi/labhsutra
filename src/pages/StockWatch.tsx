
import { useMemo, useState } from "react";
import { Search, Plus, Package, AlertTriangle, X, Boxes } from "lucide-react";
import "./StockWatch.css";

type Product = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  reorderLevel: number;
  price: number;
};

function StockWatch() {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Rice 25kg", category: "Grains", quantity: 8, reorderLevel: 10, price: 1250 },
    { id: 2, name: "Sugar 1kg", category: "Essentials", quantity: 35, reorderLevel: 15, price: 48 },
    { id: 3, name: "Sunflower Oil 1L", category: "Oil", quantity: 4, reorderLevel: 10, price: 145 },
    { id: 4, name: "Toor Dal 1kg", category: "Pulses", quantity: 0, reorderLevel: 8, price: 160 },
    { id: 5, name: "Wheat Flour 5kg", category: "Grains", quantity: 18, reorderLevel: 8, price: 240 },
  ]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [price, setPrice] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [newQuantity, setNewQuantity] = useState("");

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  const lowStock = products.filter(
    (product) => product.quantity > 0 && product.quantity <= product.reorderLevel
  );

  const outOfStock = products.filter((product) => product.quantity === 0);

  const inventoryValue = useMemo(
    () => products.reduce((total, product) => total + product.quantity * product.price, 0),
    [products]
  );

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.category}`.toLowerCase().includes(search.toLowerCase())
  );

  function addProduct() {
    const qty = Number(quantity);
    const reorder = Number(reorderLevel);
    const cost = Number(price);

    if (!productName.trim() || !category.trim() ||
        quantity === "" || reorderLevel === "" || price === "" ||
        !Number.isInteger(qty) || qty < 0 ||
        !Number.isInteger(reorder) || reorder < 0 ||
        !Number.isFinite(cost) || cost <= 0) {
      alert("Enter valid product details, quantities and price.");
      return;
    }

    setProducts((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: productName.trim(),
        category: category.trim(),
        quantity: qty,
        reorderLevel: reorder,
        price: cost,
      },
    ]);

    setProductName("");
    setCategory("");
    setQuantity("");
    setReorderLevel("");
    setPrice("");
    setShowForm(false);
  }

  function updateQuantity(id: number) {
    const qty = Number(newQuantity);

    if (newQuantity === "" || !Number.isInteger(qty) || qty < 0) {
      alert("Enter a valid non-negative whole number.");
      return;
    }

    setProducts((previous) =>
      previous.map((product) =>
        product.id === id ? { ...product, quantity: qty } : product
      )
    );

    setEditingId(null);
    setNewQuantity("");
  }

  function getStatus(product: Product) {
    if (product.quantity === 0) return "Out of Stock";
    if (product.quantity <= product.reorderLevel) return "Low Stock";
    return "In Stock";
  }

  return (
    <div className="stock-page">
      <div className="stock-heading">
        <div>
          <h2>Stock Watch</h2>
          <p>Monitor inventory levels and keep your store stocked.</p>
        </div>
        <button className="stock-primary-btn" onClick={() => setShowForm(true)}>
          <Plus size={17} /> Add Product
        </button>
      </div>

      <div className="stock-stats">
        <div className="stock-stat-card">
          <div className="stock-icon"><Package size={20} /></div>
          <span>Total Products</span>
          <h3>{products.length}</h3>
          <small>Products in inventory</small>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon warning"><AlertTriangle size={20} /></div>
          <span>Low Stock</span>
          <h3>{lowStock.length}</h3>
          <small>Products need restocking</small>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon danger"><Boxes size={20} /></div>
          <span>Out of Stock</span>
          <h3>{outOfStock.length}</h3>
          <small>Products unavailable</small>
        </div>

        <div className="stock-stat-card">
          <div className="stock-icon"><Package size={20} /></div>
          <span>Inventory Value</span>
          <h3>{formatCurrency(inventoryValue)}</h3>
          <small>Based on current stock and unit prices</small>
        </div>
      </div>

      {(lowStock.length > 0 || outOfStock.length > 0) && (
        <div className="stock-alert">
          <AlertTriangle size={20} />
          <div>
            <strong>Restocking attention needed</strong>
            <p>
              {lowStock.length} low-stock and {outOfStock.length} out-of-stock products need attention.
            </p>
          </div>
        </div>
      )}

      <div className="stock-section">
        <div className="stock-section-heading">
          <div>
            <h3>Inventory</h3>
            <p>Track product quantities and stock status.</p>
          </div>
          <div className="stock-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>

        <div className="stock-table-wrap">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th>Unit Price</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const status = getStatus(product);

                return (
                  <tr key={product.id}>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.category}</td>
                    <td>
                      {editingId === product.id ? (
                        <input
                          className="stock-quantity-input"
                          type="number"
                          min="0"
                          step="1"
                          value={newQuantity}
                          onChange={(event) => setNewQuantity(event.target.value)}
                        />
                      ) : (
                        <strong>{product.quantity}</strong>
                      )}
                    </td>
                    <td>{product.reorderLevel}</td>
                    <td>{formatCurrency(product.price)}</td>
                    <td>
                      <span className={`stock-status ${
                        status === "In Stock" ? "available" :
                        status === "Low Stock" ? "low" : "empty"
                      }`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      {editingId === product.id ? (
                        <div className="stock-actions">
                          <button className="stock-save-btn" onClick={() => updateQuantity(product.id)}>
                            Save
                          </button>
                          <button className="stock-cancel-btn" onClick={() => setEditingId(null)}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          className="stock-action-btn"
                          onClick={() => {
                            setEditingId(product.id);
                            setNewQuantity(String(product.quantity));
                          }}
                        >
                          Update
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={7} className="stock-empty">No products found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="stock-modal-backdrop">
          <div className="stock-modal">
            <div className="stock-modal-heading">
              <h3>Add Product</h3>
              <button onClick={() => setShowForm(false)}><X size={19} /></button>
            </div>

            <label>Product Name</label>
            <input value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="e.g. Rice 25kg" />

            <label>Category</label>
            <input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Grains" />

            <label>Current Quantity</label>
            <input type="number" min="0" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Enter quantity" />

            <label>Reorder Level</label>
            <input type="number" min="0" step="1" value={reorderLevel} onChange={(event) => setReorderLevel(event.target.value)} placeholder="Enter minimum stock level" />

            <label>Unit Price (₹)</label>
            <input type="number" min="0.01" step="0.01" value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Enter unit price" />

            <button className="stock-primary-btn stock-submit" onClick={addProduct}>Save Product</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StockWatch;
