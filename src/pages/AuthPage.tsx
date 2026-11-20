
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Store,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import "./AuthPage.css";

function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const isSignup = location.pathname === "/signup";

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    alert(
      "Authentication will be enabled after Supabase integration. You can explore our demo now."
    );

    navigate("/demo");
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <button className="auth-brand" onClick={() => navigate("/")}>
          <span className="auth-logo">L</span>
          <span>LabhSutra</span>
        </button>

        <div className="auth-message">
          <span className="auth-eyebrow">
            <Store size={15} /> SMART KIRANA MANAGEMENT
          </span>

          <h1>
            Run your shop.
            <br />
            <span>Grow with confidence.</span>
          </h1>

          <p>
            Keep your customer records, stock, suppliers and purchases
            organised in one place.
          </p>

          <div className="auth-benefit">
            <ShieldCheck size={19} />
            <span>One simple workspace for your business.</span>
          </div>
        </div>

        <div className="auth-left-footer">
          Know your money. Plan your purchases. Grow your business.
        </div>
      </div>

      <div className="auth-right">
        <button className="auth-back" onClick={() => navigate("/")}>
          ← Back to home
        </button>

        <div className="auth-form-container">
          <div className="auth-form-heading">
            <span>{isSignup ? "GET STARTED" : "WELCOME BACK"}</span>
            <h2>{isSignup ? "Create your account" : "Log in to LabhSutra"}</h2>
            <p>
              {isSignup
                ? "Set up your shop workspace to get started."
                : "Enter your details to access your shop workspace."}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <label>
                  Your Full Name
                  <div className="auth-input-wrap">
                    <User size={17} />
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>
                </label>

                <label>
                  Shop Name
                  <div className="auth-input-wrap">
                    <Store size={17} />
                    <input
                      type="text"
                      placeholder="Enter your shop name"
                      value={shopName}
                      onChange={(event) => setShopName(event.target.value)}
                      required
                    />
                  </div>
                </label>

                <label>
                  Phone Number
                  <div className="auth-input-wrap">
                    <Phone size={17} />
                    <input
                      type="tel"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                </label>
              </>
            )}

            <label>
              Email Address
              <div className="auth-input-wrap">
                <Mail size={17} />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
            </label>

            <label>
              Password
              <div className="auth-input-wrap">
                <Lock size={17} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="auth-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button type="submit" className="auth-submit">
              {isSignup ? "Create Account" : "Log In"}
              <ArrowRight size={17} />
            </button>
          </form>

          <div className="auth-switch">
            {isSignup ? "Already have an account?" : "New to LabhSutra?"}
            <button
              onClick={() => navigate(isSignup ? "/login" : "/signup")}
            >
              {isSignup ? "Log in" : "Create an account"}
            </button>
          </div>

          <div className="auth-demo-link">
            <span>Just exploring?</span>
            <button onClick={() => navigate("/demo")}>
              Explore the demo instead →
            </button>
          </div>

          <p className="auth-note">
            Authentication is currently a preview. Account creation and login
            will be enabled after secure backend integration.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
