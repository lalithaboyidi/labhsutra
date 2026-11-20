
import { useState } from "react";
import { Search, Package, MapPin, Clock, Phone, Tag } from "lucide-react";
import "./SuppliersPrices.css";

type Offer = {
  id: number;
  supplier: string;
  location: string;
  phone: string;
  product: string;
  price: number;
  unit: string;
  moq: number;
  delivery: string;
};

const demoOffers: Offer[] = [
  { id: 1, supplier: "Sri Lakshmi Traders", location: "Rajahmundry", phone: "9876500001", product: "Rice 25kg", price: 1180, unit: "bag", moq: 5, delivery: "1–2 days" },
  { id: 2, supplier: "Venkateswara Wholesale", location: "Kakinada", phone: "9876500002", product: "Rice 25kg", price: 1220, unit: "bag", moq: 2, delivery: "2 days" },
  { id: 3, supplier: "Annapurna Distributors", location: "Vijayawada", phone: "9876500003", product: "Rice 25kg", price: 1150, unit: "bag", moq: 10, delivery: "3–4 days" },
  { id: 4, supplier: "Sri Sai Agencies", location: "Rajahmundry", phone: "9876500004", product: "Sugar 1kg", price: 42, unit: "pack", moq: 50, delivery: "1 day" },
  { id: 5, supplier: "Balaji Wholesale", location: "Kakinada", phone: "9876500005", product: "Sugar 1kg", price: 44, unit: "pack", moq: 25, delivery: "2 days" },
  { id: 6, supplier: "Fresh Oil Suppliers", location: "Rajahmundry", phone: "9876500006", product: "Sunflower Oil 1L", price: 132, unit: "bottle", moq: 24, delivery: "1–2 days" },
  { id: 7, supplier: "Coastal Distributors", location: "Vijayawada", phone: "9876500007", product: "Sunflower Oil 1L", price: 128, unit: "bottle", moq: 48, delivery: "3 days" },
];

function SuppliersPrices() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All Products");

  const products = ["All Products", ...new Set(demoOffers.map((offer) => offer.product))];

  const filteredOffers = demoOffers.filter((offer) => {
    const matchesSearch = `${offer.supplier} ${offer.product} ${offer.location}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesProduct =
      selectedProduct === "All Products" || offer.product === selectedProduct;

    return matchesSearch && matchesProduct;
  });

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="suppliers-page">
      <div className="suppliers-heading">
        <div>
          <h2>Suppliers & Prices</h2>
          <p>Compare wholesale offers and find suitable suppliers.</p>
        </div>
        <span className="demo-label">DEMO DATA</span>
      </div>

      <div className="suppliers-notice">
        <Tag size={18} />
        <div>
          <strong>Sample supplier offers</strong>
          <p>These prices and supplier details are simulated for the LabhSutra MVP. Verify actual prices before purchasing.</p>
        </div>
      </div>

      <div className="suppliers-summary">
        <div className="supplier-summary-card">
          <Package size={20} />
          <span>Available Offers</span>
          <h3>{demoOffers.length}</h3>
        </div>
        <div className="supplier-summary-card">
          <MapPin size={20} />
          <span>Sample Suppliers</span>
          <h3>{new Set(demoOffers.map((offer) => offer.supplier)).size}</h3>
        </div>
        <div className="supplier-summary-card">
          <Tag size={20} />
          <span>Products Covered</span>
          <h3>{new Set(demoOffers.map((offer) => offer.product)).size}</h3>
        </div>
      </div>

      <div className="suppliers-section">
        <div className="suppliers-section-heading">
          <div>
            <h3>Compare Supplier Offers</h3>
            <p>Compare prices, order quantities and delivery estimates.</p>
          </div>
        </div>

        <div className="suppliers-filters">
          <div className="suppliers-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search supplier, product or location..."
            />
          </div>

          <select
            value={selectedProduct}
            onChange={(event) => setSelectedProduct(event.target.value)}
          >
            {products.map((product) => (
              <option key={product} value={product}>{product}</option>
            ))}
          </select>
        </div>

        <div className="suppliers-table-wrap">
          <table className="suppliers-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Product</th>
                <th>Price / Unit</th>
                <th>Minimum Order</th>
                <th>Delivery</th>
                <th>Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffers.map((offer) => (
                <tr key={offer.id}>
                  <td>
                    <strong>{offer.supplier}</strong>
                    <small><MapPin size={12} /> {offer.location}</small>
                  </td>
                  <td>{offer.product}</td>
                  <td><strong>{formatCurrency(offer.price)}</strong> / {offer.unit}</td>
                  <td>{offer.moq} {offer.unit}{offer.moq > 1 ? "s" : ""}</td>
                  <td><span className="supplier-delivery"><Clock size={13} /> {offer.delivery}</span></td>
                  <td>
                    <a className="supplier-contact" href={`tel:${offer.phone}`}>
                      <Phone size={13} /> Contact
                    </a>
                  </td>
                </tr>
              ))}

              {filteredOffers.length === 0 && (
                <tr><td colSpan={6} className="suppliers-empty">No matching offers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SuppliersPrices;
