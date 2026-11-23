import { useEffect, useState } from "react";
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
  LogOut,
} from "lucide-react";

import {
  Routes,
  Route,
  NavLink,
  useLocation,
  Outlet,
  Navigate,
  useNavigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CustomerLedger from "./pages/CustomerLedger";
import StockWatch from "./pages/StockWatch";
import SuppliersPrices from "./pages/SuppliersPrices";
import PurchasePlanner from "./pages/PurchasePlanner";

import AuthenticatedCustomerLedger from "./pages/authenticated/CustomerLedger";
import AuthenticatedStockWatch from "./pages/authenticated/StockWatch";

import {
  getCurrentSession,
  onAuthStateChange,
  signOut,
} from "./lib/auth";

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

          <div className="sidebar-footer">
            LabhSutra © 2026
          </div>
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
              <p className="breadcrumb">
                Workspace / {activePage}
              </p>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className="search-button"
              aria-label="Search"
            >
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

function ProtectedWorkspace() {
  const [session, setSession] = useState<
    Awaited<ReturnType<typeof getCurrentSession>>
  >(null);

  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;

    const {
      data: { subscription },
    } = onAuthStateChange((nextSession) => {
      if (active) {
        setSession(nextSession);
        setLoading(false);
      }
    });

    getCurrentSession()
      .then((currentSession) => {
        if (active) {
          setSession(currentSession);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setSession(null);
          setLoading(false);
        }
      });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <main className="main-content">
          <div className="page-content">
            <p>Checking your account...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const user = session.user;

  const shopName = String(
    user.user_metadata?.shop_name ?? "My Shop"
  );

  const fullName = String(
    user.user_metadata?.full_name ?? "Shop Owner"
  );

  const initials =
    shopName
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "LS";

  const activePage =
    location.pathname === "/app/ledger"
      ? "Customer Ledger"
      : location.pathname === "/app/stock"
        ? "Stock Watch"
        : "Workspace";

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to sign out. Please try again."
      );
    }
  };

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
          <div className="shop-avatar">{initials}</div>

          <div>
            <strong>{shopName}</strong>
            <span>{fullName}</span>
          </div>
        </div>

        <p className="nav-heading">MY WORKSPACE</p>

        <nav className="navigation">
          <NavLink
            to="/app/ledger"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Users size={19} />
            <span>Customer Ledger</span>
          </NavLink>

          <NavLink
            to="/app/stock"
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
            onClick={() => setMenuOpen(false)}
          >
            <Package size={19} />
            <span>Stock Watch</span>
          </NavLink>

          <button
            className="nav-item"
            onClick={handleSignOut}
          >
            <LogOut size={19} />
            <span>Sign Out</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <strong>Your business. Your records.</strong>
            <p>Your authenticated LabhSutra workspace.</p>
          </div>

          <div className="sidebar-footer">
            LabhSutra © 2026
          </div>
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
              <p className="breadcrumb">
                My Workspace / {activePage}
              </p>
              <h1>{activePage}</h1>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="profile-avatar">
              {initials.charAt(0)}
            </div>
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

      {/* Existing demo workspace remains unchanged */}
      <Route path="/demo" element={<Workspace />}>
        <Route index element={<Dashboard />} />
        <Route path="ledger" element={<CustomerLedger />} />
        <Route path="stock" element={<StockWatch />} />
        <Route path="suppliers" element={<SuppliersPrices />} />
        <Route path="planner" element={<PurchasePlanner />} />
      </Route>

      {/* Protected authenticated workspace */}
      <Route path="/app" element={<ProtectedWorkspace />}>
        <Route
          index
          element={<Navigate to="ledger" replace />}
        />

        <Route
          path="ledger"
          element={<AuthenticatedCustomerLedger />}
        />

        <Route
          path="stock"
          element={<AuthenticatedStockWatch />}
        />
      </Route>

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;