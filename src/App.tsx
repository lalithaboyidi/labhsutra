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
import DemoSuppliersPrices from "./pages/SuppliersPrices";
import DemoPurchasePlanner from "./pages/PurchasePlanner";

import SuppliersPrices from "./pages/authenticated/SuppliersPrices";
import PurchasePlanner from "./pages/authenticated/PurchasePlanner";

import { supabase } from "./lib/supabase";
import "./App.css";

const demoNavigation = [
  { label: "Dashboard", path: "/demo", icon: LayoutDashboard },
  { label: "Customer Ledger", path: "/demo/ledger", icon: Users },
  { label: "Stock Watch", path: "/demo/stock", icon: Package },
  { label: "Suppliers & Prices", path: "/demo/suppliers", icon: Truck },
  { label: "Purchase Planner", path: "/demo/planner", icon: ClipboardList },
];

const appNavigation = [
  { label: "Suppliers & Prices", path: "/app/suppliers", icon: Truck },
  { label: "Purchase Planner", path: "/app/planner", icon: ClipboardList },
];

function Workspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const activePage =
    demoNavigation.find((item) => item.path === location.pathname)?.label ??
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
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu">
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
          {demoNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/demo"}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
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
        <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div>
              <p className="breadcrumb">Workspace / {activePage}</p>
              <h1>{activePage}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="search-button" aria-label="Search"><Search size={19} /></button>
            <button className="notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span />
            </button>
            <div className="profile-avatar">L</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
}

function ProtectedRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return;
      setSession(error ? null : data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (mounted) {
        setSession(newSession);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div style={{ padding: "40px" }}>Checking your session...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

function AuthenticatedWorkspace() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [shopName, setShopName] = useState("My Shop");
  const [fullName, setFullName] = useState("Shop Owner");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    const loadUserDetails = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (!mounted || error || !user) return;

      const registeredShopName = String(
        user.user_metadata?.shop_name ?? "My Shop"
      );

      const registeredFullName = String(
        user.user_metadata?.full_name ?? "Shop Owner"
      );

      setShopName(registeredShopName);
      setFullName(registeredFullName);
    };

    void loadUserDetails();

    return () => {
      mounted = false;
    };
  }, []);

  const initials =
    shopName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase() || "LS";

  const activePage =
    appNavigation.find((item) => item.path === location.pathname)?.label ??
    "Workspace";

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      setSigningOut(false);
      return;
    }

    navigate("/login", { replace: true });
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
          <button className="close-menu" onClick={() => setMenuOpen(false)} aria-label="Close menu">
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
          {appNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
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
          <button className="nav-item" onClick={handleLogout} disabled={signingOut}>
            <LogOut size={19} />
            <span>{signingOut ? "Signing out..." : "Logout"}</span>
          </button>
          <div className="sidebar-footer">LabhSutra © 2026</div>
        </div>
      </aside>

      {menuOpen && (
        <button className="mobile-overlay" onClick={() => setMenuOpen(false)} aria-label="Close navigation" />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={22} />
            </button>
            <div>
              <p className="breadcrumb">My Workspace / {activePage}</p>
              <h1>{activePage}</h1>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="profile-avatar">{initials}</div>
          </div>
        </header>
        <div className="page-content"><Outlet /></div>
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
        <Route path="suppliers" element={<DemoSuppliersPrices />} />
        <Route path="planner" element={<DemoPurchasePlanner />} />
      </Route>

      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<AuthenticatedWorkspace />}>
          <Route index element={<Navigate to="suppliers" replace />} />
          <Route path="suppliers" element={<SuppliersPrices />} />
          <Route path="planner" element={<PurchasePlanner />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;