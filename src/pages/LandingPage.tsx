
import {
  ArrowRight,
  Wallet,
  Package,
  Truck,
  ChartNoAxesCombined,
  CheckCircle2,
  Store,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Wallet,
      title: "Customer Ledger",
      description:
        "Track customer udhari, payments and outstanding balances in one place.",
    },
    {
      icon: Package,
      title: "Stock Watch",
      description:
        "Monitor inventory, identify low-stock products and avoid stockouts.",
    },
    {
      icon: Truck,
      title: "Supplier Comparison",
      description:
        "Compare supplier prices and make smarter purchasing decisions.",
    },
    {
      icon: ChartNoAxesCombined,
      title: "Purchase Planner",
      description:
        "Plan purchases, respect minimum quantities and manage your budget.",
    },
  ];

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="landing-logo">L</div>
          <span>LabhSutra</span>
        </div>

        <div className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
        </div>

        <div className="landing-nav-actions">
          <button
            className="landing-login"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
          <button
            className="landing-signup"
            onClick={() => navigate("/signup")}
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </nav>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-content">
            <span className="landing-eyebrow">
              <Store size={15} /> BUILT FOR KIRANA BUSINESS OWNERS
            </span>

            <h1>
              Your shop.
              <br />
              Your money.
              <br />
              <span>Smarter decisions.</span>
            </h1>

            <p>
              Manage customer credit, track stock, compare suppliers
              and plan purchases — all from one simple platform.
            </p>

            <div className="landing-hero-actions">
              <button
                className="landing-primary"
                onClick={() => navigate("/demo")}
              >
                Explore Live Demo <ArrowRight size={18} />
              </button>

              <button
                className="landing-secondary"
                onClick={() => navigate("/signup")}
              >
                Create Free Account
              </button>
            </div>

            <div className="landing-trust">
              <CheckCircle2 size={16} />
              Simple to use · Designed for small businesses
            </div>
          </div>

          <div className="landing-preview">
            <div className="preview-top">
              <div>
                <span>SHOP OVERVIEW</span>
                <h3>Krishna Stores</h3>
              </div>
              <span className="preview-live">DEMO</span>
            </div>

            <div className="preview-balance">
              <span>Available Cash</span>
              <strong>₹68,000</strong>
              <small>Sample shop data</small>
            </div>

            <div className="preview-stats">
              <div>
                <span>Customer Dues</span>
                <strong>₹42,500</strong>
              </div>
              <div>
                <span>Low Stock Items</span>
                <strong>08</strong>
              </div>
            </div>

            <div className="preview-activity">
              <span>BUSINESS SNAPSHOT</span>
              <div><span>Rice 25kg</span><strong>Low Stock</strong></div>
              <div><span>Planned Purchases</span><strong>₹24,800</strong></div>
              <div><span>Customer Records</span><strong>04</strong></div>
            </div>
          </div>
        </section>

        <section className="landing-features" id="features">
          <div className="landing-section-heading">
            <span>ONE PLATFORM, FOUR ESSENTIAL TOOLS</span>
            <h2>Everything your shop needs to stay organised.</h2>
            <p>
              Spend less time managing records and more time growing
              your business.
            </p>
          </div>

          <div className="landing-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article className="landing-feature-card" key={feature.title}>
                  <div className="feature-icon">
                    <Icon size={22} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="landing-how" id="how-it-works">
          <div>
            <span>GET STARTED</span>
            <h2>Better shop management starts here.</h2>
            <p>
              Explore the sample experience first, or create an account
              to manage your own shop.
            </p>
          </div>

          <button
            className="landing-primary"
            onClick={() => navigate("/demo")}
          >
            Try LabhSutra <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-brand">
          <div className="landing-logo">L</div>
          <span>LabhSutra</span>
        </div>
        <p>Know your money. Plan your purchases. Grow your business.</p>
        <small>© 2026 LabhSutra. All rights reserved.</small>
      </footer>
    </div>
  );
}

export default LandingPage;
