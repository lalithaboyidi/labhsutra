import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  IndianRupee,
  Users,
  Wallet,
  X,
  RefreshCw,
} from "lucide-react";

import {
  addCustomer,
  getLedgerData,
  recordLedgerTransaction,
  type LedgerCustomer,
  type LedgerTransaction,
} from "../../services/ledgerService";

import "./CustomerLedger.css";

type TransactionType = "credit" | "payment";

function CustomerLedger() {
  const [customers, setCustomers] = useState<LedgerCustomer[]>([]);
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [savingTransaction, setSavingTransaction] = useState(false);

  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transactionType, setTransactionType] =
    useState<TransactionType>("credit");

  const loadLedger = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getLedgerData();

      setCustomers(data.customers);
      setTransactions(data.transactions);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load customer ledger."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLedger();
  }, [loadLedger]);

  const totalOutstanding = useMemo(
    () =>
      customers.reduce(
        (total, customer) => total + customer.outstanding,
        0
      ),
    [customers]
  );

  const customersWithDues = useMemo(
    () => customers.filter((customer) => customer.outstanding > 0).length,
    [customers]
  );

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return customers;

    return customers.filter((customer) =>
      `${customer.name} ${customer.phone}`.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const selectedCustomer = customers.find(
    (customer) => customer.id === selectedCustomerId
  );

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  async function handleAddCustomer() {
    const name = customerName.trim();
    const normalizedPhone = phone.trim();

    if (!name || !/^\d{10}$/.test(normalizedPhone)) {
      setError("Enter a customer name and valid 10-digit phone number.");
      return;
    }

    try {
      setSavingCustomer(true);
      setError("");

      await addCustomer(name, normalizedPhone);

      setCustomerName("");
      setPhone("");
      setShowCustomerForm(false);

      await loadLedger(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to add customer."
      );
    } finally {
      setSavingCustomer(false);
    }
  }

  async function handleAddTransaction() {
    const numericAmount = Number(amount);

    if (
      !selectedCustomer ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Select a customer and enter a valid amount.");
      return;
    }

    if (
      transactionType === "payment" &&
      numericAmount > selectedCustomer.outstanding
    ) {
      setError("Payment cannot exceed the customer's outstanding balance.");
      return;
    }

    try {
      setSavingTransaction(true);
      setError("");

      await recordLedgerTransaction({
        customerId: selectedCustomer.id,
        type: transactionType,
        amount: numericAmount,
        note,
      });

      setAmount("");
      setNote("");
      setSelectedCustomerId("");
      setTransactionType("credit");
      setShowTransactionForm(false);

      await loadLedger(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to record transaction."
      );
    } finally {
      setSavingTransaction(false);
    }
  }

  function openTransactionForm(customerId: string) {
    setSelectedCustomerId(customerId);
    setAmount("");
    setNote("");
    setTransactionType("credit");
    setError("");
    setShowTransactionForm(true);
  }

  function closeCustomerForm() {
    setShowCustomerForm(false);
    setCustomerName("");
    setPhone("");
    setError("");
  }

  function closeTransactionForm() {
    setShowTransactionForm(false);
    setSelectedCustomerId("");
    setAmount("");
    setNote("");
    setError("");
  }

  const customerNames = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer.name])),
    [customers]
  );

  return (
    <div className="auth-ledger-page">
      <div className="auth-ledger-heading">
        <div>
          <h2>Customer Ledger</h2>
          <p>Manage customer credit, payments and outstanding balances.</p>
        </div>

        <div className="auth-ledger-heading-actions">
          <button
            className="auth-ledger-refresh-btn"
            onClick={() => void loadLedger(true)}
            disabled={loading || refreshing}
            title="Refresh ledger"
          >
            <RefreshCw size={16} />
          </button>

          <button
            className="auth-ledger-primary-btn"
            onClick={() => {
              setError("");
              setShowCustomerForm(true);
            }}
          >
            <Plus size={17} /> Add Customer
          </button>
        </div>
      </div>

      {error && (
        <div className="auth-ledger-error" role="alert">
          <span>{error}</span>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="auth-ledger-stats">
        <div className="auth-ledger-stat-card">
          <div className="auth-ledger-stat-icon">
            <Wallet size={20} />
          </div>
          <span>Total Outstanding</span>
          <h3>{formatCurrency(totalOutstanding)}</h3>
          <small>Pending customer payments</small>
        </div>

        <div className="auth-ledger-stat-card">
          <div className="auth-ledger-stat-icon">
            <Users size={20} />
          </div>
          <span>Total Customers</span>
          <h3>{customers.length}</h3>
          <small>Customers in your shop ledger</small>
        </div>

        <div className="auth-ledger-stat-card">
          <div className="auth-ledger-stat-icon">
            <IndianRupee size={20} />
          </div>
          <span>Customers with Dues</span>
          <h3>{customersWithDues}</h3>
          <small>Customers with pending balances</small>
        </div>
      </div>

      <section className="auth-ledger-section">
        <div className="auth-ledger-section-heading">
          <div>
            <h3>Customer Accounts</h3>
            <p>View and manage individual customer balances.</p>
          </div>

          <div className="auth-ledger-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
            />
          </div>
        </div>

        <div className="auth-ledger-table-wrap">
          <table className="auth-ledger-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Outstanding</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="auth-ledger-empty">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.phone}</td>
                  <td><strong>{formatCurrency(customer.outstanding)}</strong></td>
                  <td>
                    <span
                      className={`auth-ledger-status ${
                        customer.outstanding > 0 ? "pending" : "clear"
                      }`}
                    >
                      {customer.outstanding > 0 ? "Pending" : "Clear"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="auth-ledger-action-btn"
                      onClick={() => openTransactionForm(customer.id)}
                    >
                      + Record
                    </button>
                  </td>
                </tr>
              ))}

              {!loading && filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={5} className="auth-ledger-empty">
                    {search
                      ? "No matching customers found."
                      : "No customers yet. Add your first customer."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="auth-ledger-section">
        <div className="auth-ledger-section-heading">
          <div>
            <h3>Recent Transactions</h3>
            <p>Latest credit and payment entries.</p>
          </div>
        </div>

        <div className="auth-ledger-table-wrap">
          <table className="auth-ledger-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Note</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="auth-ledger-empty">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.slice(0, 10).map((transaction) => (
                <tr key={transaction.id}>
                  <td>
                    <strong>
                      {customerNames.get(transaction.customer_id) ?? "Customer"}
                    </strong>
                  </td>
                  <td>
                    <span
                      className={`auth-ledger-status ${
                        transaction.type === "credit" ? "pending" : "clear"
                      }`}
                    >
                      {transaction.type === "credit" ? "Credit" : "Payment"}
                    </span>
                  </td>
                  <td><strong>{formatCurrency(transaction.amount)}</strong></td>
                  <td>{transaction.note || "—"}</td>
                  <td>{formatDate(transaction.created_at)}</td>
                </tr>
              ))}

              {!loading && transactions.length === 0 && (
                <tr>
                  <td colSpan={5} className="auth-ledger-empty">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showCustomerForm && (
        <div className="auth-ledger-modal-backdrop">
          <div className="auth-ledger-modal">
            <div className="auth-ledger-modal-heading">
              <h3>Add Customer</h3>
              <button onClick={closeCustomerForm} aria-label="Close">
                <X size={19} />
              </button>
            </div>

            <label htmlFor="auth-customer-name">Customer Name</label>
            <input
              id="auth-customer-name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Enter customer name"
            />

            <label htmlFor="auth-customer-phone">Phone Number</label>
            <input
              id="auth-customer-phone"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))
              }
              maxLength={10}
              inputMode="numeric"
              placeholder="10-digit phone number"
            />

            <button
              className="auth-ledger-primary-btn auth-ledger-submit"
              onClick={() => void handleAddCustomer()}
              disabled={savingCustomer}
            >
              {savingCustomer ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </div>
      )}

      {showTransactionForm && (
        <div className="auth-ledger-modal-backdrop">
          <div className="auth-ledger-modal">
            <div className="auth-ledger-modal-heading">
              <h3>Record Transaction</h3>
              <button onClick={closeTransactionForm} aria-label="Close">
                <X size={19} />
              </button>
            </div>

            <label htmlFor="auth-transaction-type">Transaction Type</label>
            <select
              id="auth-transaction-type"
              value={transactionType}
              onChange={(event) =>
                setTransactionType(event.target.value as TransactionType)
              }
            >
              <option value="credit">Credit (Udhari)</option>
              <option value="payment">Payment Received</option>
            </select>

            {selectedCustomer && (
              <div className="auth-ledger-balance-info">
                <span>Current outstanding</span>
                <strong>{formatCurrency(selectedCustomer.outstanding)}</strong>
              </div>
            )}

            <label htmlFor="auth-transaction-amount">Amount (₹)</label>
            <input
              id="auth-transaction-amount"
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="Enter amount"
            />

            <label htmlFor="auth-transaction-note">Note (optional)</label>
            <input
              id="auth-transaction-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={250}
              placeholder="Add a short note"
            />

            <button
              className="auth-ledger-primary-btn auth-ledger-submit"
              onClick={() => void handleAddTransaction()}
              disabled={savingTransaction}
            >
              {savingTransaction ? "Saving..." : "Save Transaction"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerLedger;