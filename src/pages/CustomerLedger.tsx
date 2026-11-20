import "./CustomerLedger.css";
import { useMemo, useState } from "react";
import { Search, Plus, IndianRupee, Users, Wallet, X } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  phone: string;
  outstanding: number;
};

type Transaction = {
  id: number;
  customerId: number;
  customerName: string;
  type: "Credit" | "Payment";
  amount: number;
  date: string;
};

function CustomerLedger() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "Ramesh Kumar", phone: "9876543210", outstanding: 4500 },
    { id: 2, name: "Sita Devi", phone: "9876543211", outstanding: 2800 },
    { id: 3, name: "Ravi Teja", phone: "9876543212", outstanding: 1200 },
    { id: 4, name: "Lakshmi", phone: "9876543213", outstanding: 0 },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, customerId: 1, customerName: "Ramesh Kumar", type: "Credit", amount: 4500, date: "Today" },
    { id: 2, customerId: 2, customerName: "Sita Devi", type: "Credit", amount: 2800, date: "Today" },
    { id: 3, customerId: 3, customerName: "Ravi Teja", type: "Credit", amount: 1200, date: "Yesterday" },
  ]);

  const [search, setSearch] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"Credit" | "Payment">("Credit");

  const totalOutstanding = useMemo(
    () => customers.reduce((total, customer) => total + customer.outstanding, 0),
    [customers]
  );

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name} ${customer.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const formatCurrency = (value: number) =>
    `₹${value.toLocaleString("en-IN")}`;

  function addCustomer() {
    if (!customerName.trim() || !/^\d{10}$/.test(phone.trim())) {
      alert("Enter a customer name and valid 10-digit phone number.");
      return;
    }

    setCustomers((previous) => [
      ...previous,
      {
        id: Date.now(),
        name: customerName.trim(),
        phone: phone.trim(),
        outstanding: 0,
      },
    ]);

    setCustomerName("");
    setPhone("");
    setShowCustomerForm(false);
  }

  function addTransaction() {
    const numericAmount = Number(amount);
    const customer = customers.find((item) => item.id === selectedCustomer);

    if (!customer || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      alert("Select a customer and enter a valid amount.");
      return;
    }

    if (transactionType === "Payment" && numericAmount > customer.outstanding) {
      alert("Payment cannot exceed the customer's outstanding balance.");
      return;
    }

    setCustomers((previous) =>
      previous.map((item) =>
        item.id === selectedCustomer
          ? {
              ...item,
              outstanding:
                item.outstanding +
                (transactionType === "Credit" ? numericAmount : -numericAmount),
            }
          : item
      )
    );

    setTransactions((previous) => [
      {
        id: Date.now(),
        customerId: customer.id,
        customerName: customer.name,
        type: transactionType,
        amount: numericAmount,
        date: new Date().toLocaleDateString("en-IN"),
      },
      ...previous,
    ]);

    setAmount("");
    setShowTransactionForm(false);
    setSelectedCustomer(null);
  }

  return (
    <div className="ledger-page">
      <div className="ledger-heading">
        <div>
          <h2>Customer Ledger</h2>
          <p>Manage customer credit, payments and outstanding balances.</p>
        </div>
        <button className="ledger-primary-btn" onClick={() => setShowCustomerForm(true)}>
          <Plus size={17} /> Add Customer
        </button>
      </div>

      <div className="ledger-stats">
        <div className="ledger-stat-card">
          <div className="ledger-stat-icon"><Wallet size={20} /></div>
          <span>Total Outstanding</span>
          <h3>{formatCurrency(totalOutstanding)}</h3>
          <small>Pending customer payments</small>
        </div>

        <div className="ledger-stat-card">
          <div className="ledger-stat-icon"><Users size={20} /></div>
          <span>Total Customers</span>
          <h3>{customers.length}</h3>
          <small>Customers in your ledger</small>
        </div>

        <div className="ledger-stat-card">
          <div className="ledger-stat-icon"><IndianRupee size={20} /></div>
          <span>Customers with Dues</span>
          <h3>{customers.filter((customer) => customer.outstanding > 0).length}</h3>
          <small>Customers with pending balances</small>
        </div>
      </div>

      <div className="ledger-section">
        <div className="ledger-section-heading">
          <div>
            <h3>Customer Accounts</h3>
            <p>View and manage individual customer balances.</p>
          </div>
          <div className="ledger-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search customers..."
            />
          </div>
        </div>

        <div className="ledger-table-wrap">
          <table className="ledger-table">
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
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td><strong>{customer.name}</strong></td>
                  <td>{customer.phone}</td>
                  <td><strong>{formatCurrency(customer.outstanding)}</strong></td>
                  <td>
                    <span className={`ledger-status ${customer.outstanding > 0 ? "pending" : "clear"}`}>
                      {customer.outstanding > 0 ? "Pending" : "Clear"}
                    </span>
                  </td>
                  <td>
                    <button
                      className="ledger-action-btn"
                      onClick={() => {
                        setSelectedCustomer(customer.id);
                        setShowTransactionForm(true);
                      }}
                    >
                      + Record
                    </button>
                  </td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr><td colSpan={5} className="ledger-empty">No customers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="ledger-section">
        <div className="ledger-section-heading">
          <div>
            <h3>Recent Transactions</h3>
            <p>Latest credit and payment entries.</p>
          </div>
        </div>

        <div className="ledger-table-wrap">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Transaction</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td><strong>{transaction.customerName}</strong></td>
                  <td>
                    <span className={`ledger-status ${transaction.type === "Credit" ? "pending" : "clear"}`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td><strong>{formatCurrency(transaction.amount)}</strong></td>
                  <td>{transaction.date}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr><td colSpan={4} className="ledger-empty">No transactions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCustomerForm && (
        <div className="ledger-modal-backdrop">
          <div className="ledger-modal">
            <div className="ledger-modal-heading">
              <h3>Add Customer</h3>
              <button onClick={() => setShowCustomerForm(false)}><X size={19} /></button>
            </div>
            <label>Customer Name</label>
            <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Enter customer name" />
            <label>Phone Number</label>
            <input value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={10} inputMode="numeric" placeholder="10-digit phone number" />
            <button className="ledger-primary-btn ledger-submit" onClick={addCustomer}>Save Customer</button>
          </div>
        </div>
      )}

      {showTransactionForm && (
        <div className="ledger-modal-backdrop">
          <div className="ledger-modal">
            <div className="ledger-modal-heading">
              <h3>Record Transaction</h3>
              <button onClick={() => setShowTransactionForm(false)}><X size={19} /></button>
            </div>
            <label>Transaction Type</label>
            <select value={transactionType} onChange={(event) => setTransactionType(event.target.value as "Credit" | "Payment")}>
              <option value="Credit">Credit (Udhari)</option>
              <option value="Payment">Payment Received</option>
            </select>
            <label>Amount (₹)</label>
            <input type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Enter amount" />
            <button className="ledger-primary-btn ledger-submit" onClick={addTransaction}>Save Transaction</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerLedger;
