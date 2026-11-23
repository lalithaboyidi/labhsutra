import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  Clock,
  Phone,
  Tag,
  AlertCircle,
} from "lucide-react";

import {
  getSupplierOffers,
  type SupplierOffer,
} from "../../services/supplierService";

import "./SuppliersPrices.css";

function SuppliersPrices() {
  const [offers, setOffers] = useState<SupplierOffer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("All Products");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOffers() {
      try {
        setLoading(true);
        setError("");

        const data = await getSupplierOffers();

        if (active) {
          setOffers(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Unable to load supplier offers."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadOffers();

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(
    () => [
      "All Products",
      ...new Set(offers.map((offer) => offer.product)),
    ],
    [offers]
  );

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      const matchesSearch = [
        offer.supplier,
        offer.product,
        offer.location,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesProduct =
        selectedProduct === "All Products" ||
        offer.product === selectedProduct;

      return matchesSearch && matchesProduct;
    });
  }, [offers, search, selectedProduct]);

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  return (
    <div className="auth-suppliers-page">
      <div className="auth-suppliers-heading">
        <div>
          <h2>Suppliers & Prices</h2>
          <p>Compare available sample wholesale offers.</p>
        </div>

        <span className="auth-suppliers-badge">
          DATABASE-BACKED SAMPLE DATA
        </span>
      </div>

      <div className="auth-suppliers-notice">
        <Tag size={19} />
        <div>
          <strong>Simulated supplier offers</strong>
          <p>
            These offers are stored in Supabase for demonstration.
            They are not verified live supplier quotations.
            Confirm actual prices and availability before purchasing.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="auth-suppliers-state">
          Loading supplier offers...
        </div>
      ) : error ? (
        <div className="auth-suppliers-state auth-suppliers-error">
          <AlertCircle size={20} />
          <div>
            <strong>Unable to load offers</strong>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <>
          <div className="auth-suppliers-summary">
            <div className="auth-supplier-card">
              <Package size={20} />
              <span>Available Offers</span>
              <h3>{offers.length}</h3>
            </div>

            <div className="auth-supplier-card">
              <MapPin size={20} />
              <span>Sample Suppliers</span>
              <h3>
                {new Set(offers.map((offer) => offer.supplier)).size}
              </h3>
            </div>

            <div className="auth-supplier-card">
              <Tag size={20} />
              <span>Products Covered</span>
              <h3>{products.length - 1}</h3>
            </div>
          </div>

          <section className="auth-suppliers-section">
            <div className="auth-suppliers-section-heading">
              <div>
                <h3>Compare Supplier Offers</h3>
                <p>
                  Review prices, minimum order quantities and delivery estimates.
                </p>
              </div>
            </div>

            <div className="auth-suppliers-filters">
              <div className="auth-suppliers-search">
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
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </select>
            </div>

            <div className="auth-suppliers-table-wrap">
              <table className="auth-suppliers-table">
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
                        <small>
                          <MapPin size={12} />
                          {offer.location}
                        </small>
                      </td>

                      <td>{offer.product}</td>

                      <td>
                        <strong>{formatCurrency(offer.price)}</strong>
                        {" / "}
                        {offer.unit}
                      </td>

                      <td>
                        {offer.moq} {offer.unit}
                        {offer.moq > 1 ? "s" : ""}
                      </td>

                      <td>
                        <span className="auth-supplier-delivery">
                          <Clock size={13} />
                          {offer.delivery}
                        </span>
                      </td>

                      <td>
                        {offer.phone ? (
                          <a
                            className="auth-supplier-contact"
                            href={`tel:${offer.phone}`}
                          >
                            <Phone size={13} />
                            Contact
                          </a>
                        ) : (
                          <span>Not available</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredOffers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="auth-suppliers-empty">
                        {offers.length === 0
                          ? "No sample supplier offers are available."
                          : "No matching offers found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default SuppliersPrices;