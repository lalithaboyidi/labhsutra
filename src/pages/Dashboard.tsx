
import {
  Users,
  ClipboardList,
  Wallet,
  ShoppingCart,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Customer Outstanding",
    value: "₹42,500",
    change: "8.2%",
    description: "vs. last month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Available Cash",
    value: "₹68,000",
    change: "5.4%",
    description: "vs. last month",
    icon: Wallet,
    trend: "up",
  },
  {
    title: "Low Stock Items",
    value: "08",
    change: "3 items",
    description: "need attention",
    icon: AlertTriangle,
    trend: "down",
  },
  {
    title: "Planned Purchases",
    value: "₹24,800",
    change: "04",
    description: "items planned",
    icon: ShoppingCart,
    trend: "up",
  },
];

function Dashboard() {
  const hour = new Date().getHours();

  const greeting =
    hour >= 5 && hour < 12
      ? "Good morning"
      : hour >= 12 && hour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <>
      <section className="welcome-section">
        <div>
          <p className="date-label">YOUR BUSINESS OVERVIEW</p>
          <h2>{greeting}, Shop Owner! 👋</h2>
          <p>Here's what's happening with your store today.</p>
        </div>
        <button className="primary-button">
          <Plus size={18} />
          Quick action
        </button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.title}>
              <div className="stat-top">
                <span>{stat.title}</span>
                <div className="stat-icon">
                  <Icon size={19} />
                </div>
              </div>

              <h3>{stat.value}</h3>

              <div className="stat-bottom">
                <span
                  className={
                    stat.trend === "up"
                      ? "trend-positive"
                      : "trend-warning"
                  }
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={15} />
                  ) : (
                    <ArrowDownRight size={15} />
                  )}
                  {stat.change}
                </span>
                <span>{stat.description}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="dashboard-grid">
        <article className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest store transactions</p>
            </div>
            <button className="text-button">View all</button>
          </div>

          <div className="empty-state">
            <div className="empty-icon">
              <ClipboardList size={25} />
            </div>
            <strong>Your activity will appear here</strong>
            <p>
              Customer payments and stock updates will show up here.
            </p>
          </div>
        </article>

        <article className="panel stock-panel">
          <div className="panel-header">
            <div>
              <h3>Stock Alerts</h3>
              <p>Items that need attention</p>
            </div>
            <span className="alert-count">08 alerts</span>
          </div>

          <div className="stock-alert">
            <div className="product-dot">R</div>
            <div className="product-info">
              <strong>Rice – 25 kg</strong>
              <span>Only 2 bags left</span>
            </div>
            <span className="stock-status">Low stock</span>
          </div>

          <div className="stock-alert">
            <div className="product-dot">S</div>
            <div className="product-info">
              <strong>Sugar – 1 kg</strong>
              <span>Only 5 packs left</span>
            </div>
            <span className="stock-status">Low stock</span>
          </div>

          <div className="stock-alert">
            <div className="product-dot">O</div>
            <div className="product-info">
              <strong>Cooking Oil – 1 L</strong>
              <span>Out of stock</span>
            </div>
            <span className="stock-status out">Out</span>
          </div>

          <button className="text-button stock-link">
            View all stock alerts →
          </button>
        </article>
      </section>

      <section className="bottom-banner">
        <div className="banner-icon">
          <ShoppingCart size={23} />
        </div>
        <div>
          <h3>Plan your next purchase</h3>
          <p>
            Compare supplier prices and make the most of your available cash.
          </p>
        </div>
        <button className="banner-button">
          Open planner <ArrowUpRight size={16} />
        </button>
      </section>

      <footer className="page-footer">
        <span>
          LabhSutra — Know your money. Plan your purchases. Grow your business.
        </span>
        <span>Demo dashboard · Sample data</span>
      </footer>
    </>
  );
}

export default Dashboard;
