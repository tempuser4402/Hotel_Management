
import { useMemo, useState } from "react";
import {
  Wallet, Plus, Search, Download, Printer, ArrowDownLeft,
  ArrowUpRight, Landmark, CalendarDays, RefreshCw,
  Eye, Pencil, Trash2, X, Save, CheckCircle2,
  Clock, AlertTriangle, Filter, FileText
} from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

const initialTransactions = [
  {
    id: "CB-001",
    date: today,
    type: "Cash In",
    category: "Room Payment",
    description: "Cash received from room booking",
    reference: "BK-1024",
    party: "Rahul Sharma",
    amount: 5000,
    method: "Cash",
    notes: "",
  },
  {
    id: "CB-002",
    date: today,
    type: "Cash Out",
    category: "Office Supplies",
    description: "Purchased office stationery",
    reference: "EXP-201",
    party: "ABC Stationery",
    amount: 850,
    method: "Cash",
    notes: "",
  },
  {
    id: "CB-003",
    date: today,
    type: "Deposit",
    category: "Bank Deposit",
    description: "Daily cash deposited into bank",
    reference: "DEP-001",
    party: "Hotel Bank Account",
    amount: 2000,
    method: "Cash",
    notes: "",
  },
  {
    id: "CB-004",
    date: today,
    type: "Withdrawal",
    category: "Petty Cash",
    description: "Cash withdrawn for petty expenses",
    reference: "WD-001",
    party: "Hotel Cash Counter",
    amount: 1000,
    method: "Bank",
    notes: "",
  },
];

const transactionTypes = ["Cash In", "Cash Out", "Deposit", "Withdrawal"];

const categories = [
  "Room Payment",
  "Restaurant Payment",
  "Other Guest Payment",
  "Expense",
  "Office Supplies",
  "Salary",
  "Maintenance",
  "Bank Deposit",
  "Petty Cash",
  "Other",
];

const methods = ["Cash", "Bank", "UPI", "Card", "Other"];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  date: today,
  type: "Cash In",
  category: "Room Payment",
  description: "",
  reference: "",
  party: "",
  amount: "",
  method: "Cash",
  notes: "",
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function TypeBadge({ type }) {
  const style = {
    "Cash In": "bg-emerald-50 text-emerald-700",
    "Cash Out": "bg-red-50 text-red-700",
    Deposit: "bg-blue-50 text-blue-700",
    Withdrawal: "bg-purple-50 text-purple-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${style[type] || "bg-slate-100 text-slate-600"}`}>
      {type}
    </span>
  );
}

export default function CashBook() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [openingBalance, setOpeningBalance] = useState(10000);
  const [openingInput, setOpeningInput] = useState("10000");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(today);

  const [modal, setModal] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [reconcileDate, setReconcileDate] = useState(today);
  const [countedCash, setCountedCash] = useState("");
  const [reconciliations, setReconciliations] = useState([]);
  const [notification, setNotification] = useState("");

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  // Cash balance changes only for Cash In, Cash Out, Deposit and Withdrawal.
  const signedAmount = (transaction) => {
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "Cash In" || transaction.type === "Withdrawal") {
      return amount;
    }

    return -amount;
  };

  const sortedTransactions = useMemo(
    () =>
      [...transactions].sort((a, b) =>
        b.date.localeCompare(a.date) || b.id.localeCompare(a.id)
      ),
    [transactions]
  );

  const currentBalance = useMemo(
    () =>
      openingBalance +
      transactions.reduce((total, transaction) => total + signedAmount(transaction), 0),
    [transactions, openingBalance]
  );

  const totals = useMemo(() => {
    const cashIn = transactions
      .filter((item) => item.type === "Cash In")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const cashOut = transactions
      .filter((item) => item.type === "Cash Out")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const deposits = transactions
      .filter((item) => item.type === "Deposit")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const withdrawals = transactions
      .filter((item) => item.type === "Withdrawal")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return { cashIn, cashOut, deposits, withdrawals };
  }, [transactions]);

  const dailySummary = useMemo(() => {
    const daily = transactions.filter((item) => item.date === reconcileDate);

    const opening =
      openingBalance +
      transactions
        .filter((item) => item.date < reconcileDate)
        .reduce((sum, item) => sum + signedAmount(item), 0);

    const received = daily
      .filter((item) => item.type === "Cash In" || item.type === "Withdrawal")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    const paid = daily
      .filter((item) => item.type === "Cash Out" || item.type === "Deposit")
      .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
      opening,
      received,
      paid,
      closing: opening + received - paid,
      count: daily.length,
    };
  }, [transactions, openingBalance, reconcileDate]);

  const filteredTransactions = sortedTransactions.filter((transaction) => {
    const query = search.toLowerCase();

    const matchesSearch =
      transaction.id.toLowerCase().includes(query) ||
      transaction.description.toLowerCase().includes(query) ||
      transaction.reference.toLowerCase().includes(query) ||
      transaction.party.toLowerCase().includes(query) ||
      transaction.category.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "All" || transaction.type === typeFilter;

    const matchesDate =
      !dateFilter || transaction.date === dateFilter;

    return matchesSearch && matchesType && matchesDate;
  });

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, date: today });
    setModal("form");
  };

  const openEdit = (transaction) => {
    setEditingId(transaction.id);
    setForm({
      date: transaction.date,
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      reference: transaction.reference,
      party: transaction.party,
      amount: transaction.amount,
      method: transaction.method,
      notes: transaction.notes || "",
    });
    setModal("form");
  };

  const saveTransaction = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Enter an amount greater than zero.");
      return;
    }

    if (!form.description.trim()) {
      showMessage("Transaction description is required.");
      return;
    }

    const transaction = {
      ...form,
      id: editingId || `CB-${String(Date.now()).slice(-6)}`,
      amount,
      description: form.description.trim(),
      reference: form.reference.trim(),
      party: form.party.trim(),
    };

    if (editingId) {
      setTransactions((previous) =>
        previous.map((item) => item.id === editingId ? transaction : item)
      );
      showMessage("Transaction updated successfully.");
    } else {
      setTransactions((previous) => [transaction, ...previous]);
      showMessage("Transaction added successfully.");
    }

    setModal("");
  };

  const deleteTransaction = () => {
    if (!deleteTarget) return;

    setTransactions((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Transaction deleted.");
  };

  const saveOpeningBalance = (event) => {
    event.preventDefault();

    const amount = Number(openingInput);

    if (!Number.isFinite(amount) || amount < 0) {
      showMessage("Enter a valid opening balance.");
      return;
    }

    setOpeningBalance(amount);
    showMessage("Opening balance updated.");
  };

  const reconcile = (event) => {
    event.preventDefault();

    const physicalCash = Number(countedCash);

    if (!Number.isFinite(physicalCash) || physicalCash < 0) {
      showMessage("Enter a valid counted cash amount.");
      return;
    }

    const variance = physicalCash - dailySummary.closing;

    const record = {
      date: reconcileDate,
      opening: dailySummary.opening,
      received: dailySummary.received,
      paid: dailySummary.paid,
      expected: dailySummary.closing,
      counted: physicalCash,
      variance,
      status: Math.abs(variance) < 0.01 ? "Matched" : "Variance",
    };

    setReconciliations((previous) => [
      record,
      ...previous.filter((item) => item.date !== reconcileDate),
    ]);

    showMessage(
      Math.abs(variance) < 0.01
        ? "Cash reconciliation completed. Balance matched."
        : "Reconciliation saved with a cash variance."
    );
  };

  const exportCSV = () => {
    const headers = [
      "Transaction ID", "Date", "Type", "Category",
      "Description", "Reference", "Party", "Amount", "Method",
    ];

    const rows = filteredTransactions.map((item) => [
      item.id,
      item.date,
      item.type,
      item.category,
      item.description,
      item.reference,
      item.party,
      item.amount,
      item.method,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) =>
          `"${String(value ?? "").replace(/"/g, '""')}"`
        ).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-cash-book.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const rows = filteredTransactions.map((item) => `
      <tr>
        <td>${item.date}</td>
        <td>${item.id}</td>
        <td>${item.type}</td>
        <td>${item.category}</td>
        <td>${item.description.replace(/[&<>"']/g, "")}</td>
        <td>${money(item.amount)}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showMessage("Please allow pop-ups to print this report.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>StayFlow Cash Book</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>StayFlow - Cash Book Report</h1>
          <p>Generated: ${new Date().toLocaleDateString("en-IN")}</p>
          <h3>Current Cash Balance: ${money(currentBalance)}</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th><th>ID</th><th>Type</th>
                <th>Category</th><th>Description</th><th>Amount</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Wallet size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Cash Book</h1>
              <p className="mt-1 text-sm text-slate-500">
                Track daily cash flow, deposits, withdrawals and reconciliation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={printReport}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer size={16} /> Print
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} /> Add Transaction
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}><X size={17} /></button>
          </div>
        )}

        {/* Balance */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-5 text-white shadow-sm md:p-7">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-blue-100">Current Cash in Hand</p>
              <h2 className="mt-2 text-3xl font-bold md:text-4xl">
                {money(currentBalance)}
              </h2>
              <p className="mt-2 text-xs text-blue-100">
                Opening balance plus all recorded cash movements
              </p>
            </div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
              <Wallet size={30} />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Cash Received"
            value={money(totals.cashIn)}
            subtitle="Guest and other cash receipts"
            icon={ArrowDownLeft}
            color="green"
          />
          <StatCard
            title="Cash Paid"
            value={money(totals.cashOut)}
            subtitle="Cash expenses and payments"
            icon={ArrowUpRight}
            color="red"
          />
          <StatCard
            title="Bank Deposits"
            value={money(totals.deposits)}
            subtitle="Cash transferred to bank"
            icon={Landmark}
            color="blue"
          />
          <StatCard
            title="Cash Withdrawals"
            value={money(totals.withdrawals)}
            subtitle="Cash received from bank"
            icon={RefreshCw}
            color="purple"
          />
        </div>

        {/* Opening balance */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Wallet size={18} className="text-blue-600" />
            <h2 className="font-semibold text-slate-900">Opening Cash Balance</h2>
          </div>
          <form onSubmit={saveOpeningBalance} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="w-full sm:max-w-xs">
              <Field label="Opening Balance (₹)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={openingInput}
                  onChange={(e) => setOpeningInput(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Update Opening Balance
            </button>
            <p className="text-xs text-slate-400">
              Current configured opening balance: {money(openingBalance)}
            </p>
          </form>
        </div>

        {/* Daily reconciliation */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-blue-600" />
              <div>
                <h2 className="font-semibold text-slate-900">Daily Cash Reconciliation</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Compare expected cash with the physically counted amount.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-auto">
              <input
                type="date"
                value={reconcileDate}
                onChange={(e) => {
                  setReconcileDate(e.target.value);
                  setCountedCash("");
                }}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Opening Balance", dailySummary.opening],
              ["Cash Received", dailySummary.received],
              ["Cash Paid / Deposited", dailySummary.paid],
              ["Expected Closing", dailySummary.closing],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="mt-1 text-lg font-bold text-slate-900">{money(value)}</p>
              </div>
            ))}
          </div>

          <form onSubmit={reconcile} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 md:items-end">
            <Field label="Physically Counted Cash (₹)" required>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={countedCash}
                onChange={(e) => setCountedCash(e.target.value)}
                className={inputClass}
                placeholder="Enter actual cash counted"
              />
            </Field>

            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Variance</p>
              <p className={`mt-1 text-lg font-bold ${
                countedCash === "" ? "text-slate-500" :
                Number(countedCash) - dailySummary.closing === 0
                  ? "text-emerald-700" : "text-red-600"
              }`}>
                {countedCash === ""
                  ? "—"
                  : money(Number(countedCash) - dailySummary.closing)}
              </p>
            </div>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Save Reconciliation
            </button>
          </form>

          {reconciliations.find((item) => item.date === reconcileDate) && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">
                  Reconciliation saved for {reconcileDate}
                </span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                reconciliations.find((item) => item.date === reconcileDate)?.status === "Matched"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-amber-50 text-amber-700"
              }`}>
                {reconciliations.find((item) => item.date === reconcileDate)?.status}
              </span>
            </div>
          )}
        </div>

        {/* Transaction history */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Cash Transaction History</h2>
              <p className="mt-1 text-xs text-slate-500">
                Complete record of cash receipts, payments, deposits and withdrawals.
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {filteredTransactions.length} transactions
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 p-4 md:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transactions..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All transaction types</option>
              {transactionTypes.map((type) => <option key={type}>{type}</option>)}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex justify-between px-4 py-2">
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setDateFilter("");
              }}
              className="text-xs font-semibold text-blue-600"
            >
              Clear filters
            </button>
            <span className="text-xs text-slate-400">
              Showing {filteredTransactions.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date / ID</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Reference / Party</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800">{item.date}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{item.description}</p>
                      {item.notes && (
                        <p className="mt-1 text-xs text-slate-400">{item.notes}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3"><TypeBadge type={item.type} /></td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">{item.reference || "—"}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.party || "—"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.method}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${
                        item.type === "Cash In" || item.type === "Withdrawal"
                          ? "text-emerald-700"
                          : "text-red-600"
                      }`}>
                        {item.type === "Cash In" || item.type === "Withdrawal" ? "+" : "-"}
                        {money(item.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedTransaction(item);
                            setModal("details");
                          }}
                          title="View"
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(item)}
                          title="Edit"
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Delete"
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                      <Wallet size={32} className="mx-auto mb-2 text-slate-300" />
                      No cash transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Reconciliation history */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Reconciliation History</h2>
            <p className="mt-1 text-xs text-slate-500">
              Previously saved daily cash counts.
            </p>
          </div>

          {reconciliations.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              <CalendarDays size={28} className="mx-auto mb-2 text-slate-300" />
              No reconciliation records yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Opening</th>
                    <th className="px-4 py-3">Received</th>
                    <th className="px-4 py-3">Paid</th>
                    <th className="px-4 py-3">Expected</th>
                    <th className="px-4 py-3">Counted</th>
                    <th className="px-4 py-3">Variance</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reconciliations.map((item) => (
                    <tr key={item.date}>
                      <td className="px-4 py-3 font-medium">{item.date}</td>
                      <td className="px-4 py-3">{money(item.opening)}</td>
                      <td className="px-4 py-3 text-emerald-700">{money(item.received)}</td>
                      <td className="px-4 py-3 text-red-600">{money(item.paid)}</td>
                      <td className="px-4 py-3 font-semibold">{money(item.expected)}</td>
                      <td className="px-4 py-3">{money(item.counted)}</td>
                      <td className={`px-4 py-3 font-semibold ${
                        item.variance === 0 ? "text-emerald-700" : "text-red-600"
                      }`}>
                        {money(item.variance)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "Matched"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add/Edit transaction modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Cash Transaction" : "Add Cash Transaction"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Record cash received, paid, deposited or withdrawn.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveTransaction} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Transaction Date" required>
                    <input
                      type="date"
                      required
                      value={form.date}
                      onChange={(e) => updateForm("date", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Transaction Type" required>
                    <select
                      value={form.type}
                      onChange={(e) => updateForm("type", e.target.value)}
                      className={inputClass}
                    >
                      {transactionTypes.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </Field>

                  <Field label="Category" required>
                    <select
                      value={form.category}
                      onChange={(e) => updateForm("category", e.target.value)}
                      className={inputClass}
                    >
                      {categories.map((category) => <option key={category}>{category}</option>)}
                    </select>
                  </Field>

                  <Field label="Amount (₹)" required>
                    <input
                      type="number"
                      required
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => updateForm("amount", e.target.value)}
                      className={inputClass}
                      placeholder="Enter amount"
                    />
                  </Field>

                  <Field label="Description" required>
                    <input
                      required
                      value={form.description}
                      onChange={(e) => updateForm("description", e.target.value)}
                      className={inputClass}
                      placeholder="Transaction description"
                    />
                  </Field>

                  <Field label="Payment Method" required>
                    <select
                      value={form.method}
                      onChange={(e) => updateForm("method", e.target.value)}
                      className={inputClass}
                    >
                      {methods.map((method) => <option key={method}>{method}</option>)}
                    </select>
                  </Field>

                  <Field label="Reference Number">
                    <input
                      value={form.reference}
                      onChange={(e) => updateForm("reference", e.target.value)}
                      className={inputClass}
                      placeholder="Booking / expense / deposit ID"
                    />
                  </Field>

                  <Field label="Party / Account">
                    <input
                      value={form.party}
                      onChange={(e) => updateForm("party", e.target.value)}
                      className={inputClass}
                      placeholder="Guest, vendor or bank account"
                    />
                  </Field>
                </div>

                <Field label="Additional Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    className={inputClass}
                    placeholder="Optional transaction notes..."
                  />
                </Field>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    {editingId ? "Save Changes" : "Add Transaction"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Transaction details */}
        {modal === "details" && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Transaction Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedTransaction.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Transaction Amount</p>
                  <h3 className="mt-1 text-3xl font-bold text-slate-900">
                    {money(selectedTransaction.amount)}
                  </h3>
                  <div className="mt-2"><TypeBadge type={selectedTransaction.type} /></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Date", selectedTransaction.date],
                    ["Category", selectedTransaction.category],
                    ["Description", selectedTransaction.description],
                    ["Reference", selectedTransaction.reference || "—"],
                    ["Party", selectedTransaction.party || "—"],
                    ["Method", selectedTransaction.method],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedTransaction.notes && (
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-xs text-slate-400">Notes</p>
                    <p className="mt-1 text-sm text-slate-700">{selectedTransaction.notes}</p>
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => openEdit(selectedTransaction)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Pencil size={15} /> Edit
                  </button>
                  <button
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Transaction?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Delete transaction {deleteTarget.id}? The cash balance will be recalculated.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTransaction}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
