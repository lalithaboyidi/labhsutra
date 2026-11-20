
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  ClipboardList,
  Search,
  Bell,
  Menu,
  X,
} from "lucide-react";
import {
  Routes,
  Route,
  NavLink,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CustomerLedger from "./pages/CustomerLedger";
import StockWatch from "./pages/StockWatch";
import SuppliersPrices from "./pages/SuppliersPrices";
import PurchasePlanner from "./pages/PurchasePlanner";

import "./App.css";

const navigation = [
  { label: "Dashboard", path: "/demo", icon: LayoutDashboard },
  { label: "Customer Ledger", path: "/demo/ledger", icon: Users },
  { label: "Stock Watch", path: "/demo/stock", icon: Package },
  { label: "Suppliers & Prices", path: "/demo/suppliers", icon: Truck },
  { label: "Purchase Planner", path: "/demo/planner", icon: ClipboardList },
];

function Workspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const activePage =
    navigation.find((item) => item.path === location.pathname)?.label ??
    "Dashboard";

  return (
    <div className="app-container">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-logo">L</div>
          <div>
            <h2>LabhSutra</h2>
            <span>SMART KIRANA MANAGEMENT</span>
          </div>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="shop-profile">
          <div className="shop-avatar">KS</div>
          <div>
            <strong>Krishna Stores</strong>
            <span>Shop Owner · Demo</span>
          </div>
        </div>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/demo"}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <strong>Grow your business</strong>
            <p>Make smarter decisions with LabhSutra.</p>
          </div>
          <div className="sidebar-footer">LabhSutra © 2026</div>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="breadcrumb">Workspace / {activePage}</p>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button className="search-button" aria-label="Search">
              <Search size={19} />
            </button>
            <button
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={19} />
              <span />
            </button>
            <div className="profile-avatar">L</div>
          </div>
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />

      <Route path="/demo" element={<Workspace />}>
        <Route index element={<Dashboard />} />
        <Route path="ledger" element={<CustomerLedger />} />
        <Route path="stock" element={<StockWatch />} />
        <Route path="suppliers" element={<SuppliersPrices />} />
        <Route path="planner" element={<PurchasePlanner />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
