
import { useMemo, useState } from "react";
import {
  Plus, Search, Filter, CreditCard, IndianRupee, CheckCircle2,
  Clock, AlertCircle, Eye, Pencil, Trash2, X, Download,
  Printer, Receipt, CalendarDays, UserRound, RefreshCcw,
  Wallet, Building2, Smartphone, Banknote, Save
} from "lucide-react";

const initialPayments = [
  {
    id: "PAY-2026-001",
    transactionRef: "TXN-AXIS-78321",
    invoice: "INV-2026-001",
    booking: "BK-2026-101",
    guest: "Rahul Sharma",
    email: "rahul@example.com",
    amount: 5000,
    method: "UPI",
    date: "2026-11-06",
    status: "Completed",
    refundAmount: 0,
    refundRef: "",
    notes: "Advance payment",
  },
  {
    id: "PAY-2026-002",
    transactionRef: "TXN-HDFC-88211",
    invoice: "INV-2026-002",
    booking: "BK-2026-102",
    guest: "Priya Verma",
    email: "priya@example.com",
    amount: 7700,
    method: "Credit Card",
    date: "2026-11-05",
    status: "Completed",
    refundAmount: 0,
    refundRef: "",
    notes: "Full payment at checkout",
  },
  {
    id: "PAY-2026-003",
    transactionRef: "CASH-2026-103",
    invoice: "INV-2026-003",
    booking: "BK-2026-103",
    guest: "Amit Kumar",
    email: "amit@example.com",
    amount: 2500,
    method: "Cash",
    date: "2026-11-04",
    status: "Pending",
    refundAmount: 0,
    refundRef: "",
    notes: "",
  },
  {
    id: "PAY-2026-004",
    transactionRef: "TXN-SBI-99122",
    invoice: "INV-2026-004",
    booking: "BK-2026-104",
    guest: "Neha Singh",
    email: "neha@example.com",
    amount: 10000,
    method: "Bank Transfer",
    date: "2026-11-02",
    status: "Completed",
    refundAmount: 2000,
    refundRef: "REF-2026-001",
    notes: "Partial refund initiated",
  },
  {
    id: "PAY-2026-005",
    transactionRef: "TXN-UPI-55443",
    invoice: "INV-2026-005",
    booking: "BK-2026-105",
    guest: "Karan Mehta",
    email: "karan@example.com",
    amount: 3500,
    method: "UPI",
    date: "2026-11-01",
    status: "Failed",
    refundAmount: 0,
    refundRef: "",
    notes: "Transaction failed",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  guest: "",
  email: "",
  booking: "",
  invoice: "",
  amount: "",
  method: "UPI",
  transactionRef: "",
  date: new Date().toISOString().slice(0, 10),
  status: "Completed",
  notes: "",
};

function StatusBadge({ status }) {
  const styles = {
    Completed: "bg-emerald-50 text-emerald-700",
    Pending: "bg-amber-50 text-amber-700",
    Failed: "bg-red-50 text-red-700",
    Refunded: "bg-purple-50 text-purple-700",
    "Partially Refunded": "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
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

function getPaymentStatus(payment) {
  if (payment.status !== "Completed") return payment.status;

  if (payment.refundAmount >= payment.amount) return "Refunded";
  if (payment.refundAmount > 0) return "Partially Refunded";

  return "Completed";
}

export default function Payments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState("");

  const stats = useMemo(() => {
    const completed = payments.filter(
      (payment) => payment.status === "Completed"
    );

    return {
      total: payments.length,
      collected: completed.reduce(
        (sum, payment) => sum + payment.amount - payment.refundAmount,
        0
      ),
      pending: payments
        .filter((payment) => payment.status === "Pending")
        .reduce((sum, payment) => sum + payment.amount, 0),
      failed: payments.filter((payment) => payment.status === "Failed").length,
      refunded: payments.reduce(
        (sum, payment) => sum + payment.refundAmount,
        0
      ),
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return payments.filter((payment) => {
      const status = getPaymentStatus(payment);
      const query = search.toLowerCase();

      const matchesSearch =
        payment.id.toLowerCase().includes(query) ||
        payment.transactionRef.toLowerCase().includes(query) ||
        payment.guest.toLowerCase().includes(query) ||
        payment.booking.toLowerCase().includes(query) ||
        payment.invoice.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || payment.method === methodFilter;

      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "This Month" &&
          payment.date.slice(0, 7) === today.slice(0, 7)) ||
        (dateFilter === "Last 30 Days" &&
          new Date(payment.date) >= new Date(Date.now() - 30 * 86400000));

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [payments, search, statusFilter, methodFilter, dateFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setModal("form");
  };

  const openEdit = (payment) => {
    setEditingId(payment.id);
    setForm({
      guest: payment.guest,
      email: payment.email,
      booking: payment.booking,
      invoice: payment.invoice,
      amount: payment.amount,
      method: payment.method,
      transactionRef: payment.transactionRef,
      date: payment.date,
      status: payment.status,
      notes: payment.notes || "",
    });
    setSelectedPayment(null);
    setModal("form");
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const savePayment = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Enter a valid payment amount.");
      return;
    }

    if (!form.guest.trim() || !form.booking.trim() || !form.transactionRef.trim()) {
      showMessage("Guest, booking reference and transaction reference are required.");
      return;
    }

    const payment = {
      ...form,
      id: editingId || `PAY-2026-${String(Date.now()).slice(-6)}`,
      amount,
      refundAmount: editingId
        ? payments.find((item) => item.id === editingId)?.refundAmount || 0
        : 0,
      refundRef: editingId
        ? payments.find((item) => item.id === editingId)?.refundRef || ""
        : "",
    };

    if (editingId) {
      setPayments((previous) =>
        previous.map((item) => item.id === editingId ? payment : item)
      );
      showMessage("Payment record updated.");
    } else {
      setPayments((previous) => [payment, ...previous]);
      showMessage("Payment record created.");
    }

    setModal("");
  };

  const deletePayment = () => {
    if (!deleteTarget) return;

    setPayments((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Payment record deleted.");
  };

  const updateStatus = (payment, status) => {
    setPayments((previous) =>
      previous.map((item) =>
        item.id === payment.id ? { ...item, status } : item
      )
    );

    setSelectedPayment((previous) =>
      previous?.id === payment.id ? { ...previous, status } : previous
    );

    showMessage(`Payment marked as ${status}.`);
  };

  const printReceipt = (payment) => {
    const receiptHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt ${escapeHtml(payment.id)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 35px;
            max-width: 650px;
            margin: auto;
            color: #1e293b;
          }
          .center { text-align: center; }
          .muted { color: #64748b; font-size: 13px; }
          .line { border-top: 1px dashed #94a3b8; margin: 22px 0; }
          .row { display:flex; justify-content:space-between; padding:9px 0; gap:20px; }
          .amount { font-size: 25px; font-weight: bold; }
          .footer { text-align:center; margin-top:40px; font-size:12px; color:#64748b; }
        </style>
      </head>
      <body>
        <div class="center">
          <h1>STAYFLOW HOTEL</h1>
          <p class="muted">PAYMENT RECEIPT</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>Receipt Number</span><strong>${escapeHtml(payment.id)}</strong></div>
        <div class="row"><span>Transaction Reference</span><strong>${escapeHtml(payment.transactionRef)}</strong></div>
        <div class="row"><span>Payment Date</span><strong>${escapeHtml(payment.date)}</strong></div>
        <div class="line"></div>
        <div class="row"><span>Guest</span><strong>${escapeHtml(payment.guest)}</strong></div>
        <div class="row"><span>Email</span><strong>${escapeHtml(payment.email || "-")}</strong></div>
        <div class="row"><span>Booking Reference</span><strong>${escapeHtml(payment.booking)}</strong></div>
        <div class="row"><span>Invoice Reference</span><strong>${escapeHtml(payment.invoice || "-")}</strong></div>
        <div class="row"><span>Payment Method</span><strong>${escapeHtml(payment.method)}</strong></div>
        <div class="line"></div>
        <div class="row"><span>Payment Amount</span><strong class="amount">${money(payment.amount)}</strong></div>
        <div class="row"><span>Status</span><strong>${escapeHtml(getPaymentStatus(payment))}</strong></div>
        ${payment.refundAmount > 0 ? `
          <div class="row"><span>Refunded</span><strong>${money(payment.refundAmount)}</strong></div>
          <div class="row"><span>Refund Reference</span><strong>${escapeHtml(payment.refundRef)}</strong></div>
        ` : ""}
        <div class="line"></div>
        <p>${escapeHtml(payment.notes || "Thank you for your payment.")}</p>
        <div class="footer">This is a computer-generated receipt.</div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showMessage("Please allow pop-ups to print or save the receipt as PDF.");
      return;
    }

    printWindow.document.write(receiptHtml);
    printWindow.document.close();
  };

  const exportCSV = () => {
    const headers = [
      "Payment ID", "Transaction Reference", "Guest", "Booking",
      "Invoice", "Amount", "Method", "Date", "Status",
      "Refund Amount", "Refund Reference",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.transactionRef,
      payment.guest,
      payment.booking,
      payment.invoice,
      payment.amount,
      payment.method,
      payment.date,
      getPaymentStatus(payment),
      payment.refundAmount,
      payment.refundRef,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hotel-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openDetails = (payment) => {
    setSelectedPayment(payment);
    setModal("details");
  };

  const linkRefund = (payment) => {
    const query = `Create a refund request for payment ${payment.id}, transaction ${payment.transactionRef}, guest ${payment.guest}, booking ${payment.booking}, amount ${payment.amount - payment.refundAmount}.`;
    window.location.href = `/finance/refunds?payment=${encodeURIComponent(payment.id)}&amount=${payment.amount - payment.refundAmount}`;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <CreditCard size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Payments</h1>
              <p className="mt-1 text-sm text-slate-500">
                Track guest payments, transaction records and receipts.
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
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} /> Record Payment
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}><X size={17} /></button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Transactions"
            value={stats.total}
            subtitle="All payment records"
            icon={Receipt}
            color="blue"
          />
          <StatCard
            title="Net Collected"
            value={money(stats.collected)}
            subtitle="Completed payments less refunds"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Pending Payments"
            value={money(stats.pending)}
            subtitle="Awaiting confirmation"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Total Refunded"
            value={money(stats.refunded)}
            subtitle={`${stats.failed} failed transactions`}
            icon={RefreshCcw}
            color="purple"
          />
        </div>

        {/* Payment methods summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { name: "Cash", icon: Banknote },
            { name: "UPI", icon: Smartphone },
            { name: "Credit Card", icon: CreditCard },
            { name: "Bank Transfer", icon: Building2 },
          ].map(({ name, icon: Icon }) => {
            const total = payments
              .filter((payment) => payment.method === name && payment.status === "Completed")
              .reduce((sum, payment) => sum + payment.amount, 0);

            return (
              <div key={name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                <div className="rounded-lg bg-slate-100 p-3 text-slate-600">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{name}</p>
                  <p className="mt-1 font-bold text-slate-900">{money(total)}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payment, guest, booking..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="All">All Payment Statuses</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Refunded</option>
              <option>Partially Refunded</option>
            </select>

            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)} className={inputClass}>
              <option value="All">All Payment Methods</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Bank Transfer</option>
              <option>Online Gateway</option>
            </select>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={inputClass}>
              <option value="All">All Dates</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Showing {filteredPayments.length} of {payments.length} payments</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setMethodFilter("All");
                setDateFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Payment records */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Payment Records</h2>
            <p className="mt-1 text-xs text-slate-500">
              Transaction history and linked invoice information.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Payment ID</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Booking / Invoice</th>
                  <th className="px-4 py-3">Transaction Reference</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Payment Mode</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{payment.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{payment.guest}</p>
                      <p className="mt-1 text-xs text-slate-400">{payment.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{payment.booking}</p>
                      <p className="mt-1 text-xs text-slate-400">{payment.invoice || "No invoice linked"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{payment.transactionRef}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{money(payment.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{payment.method}</td>
                    <td className="px-4 py-3 text-slate-600">{payment.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={getPaymentStatus(payment)} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button title="View details" onClick={() => openDetails(payment)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                          <Eye size={16} />
                        </button>
                        <button title="Print receipt" onClick={() => printReceipt(payment)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                          <Printer size={16} />
                        </button>
                        <button title="Edit payment" onClick={() => openEdit(payment)} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600">
                          <Pencil size={16} />
                        </button>
                        <button title="Delete payment" onClick={() => setDeleteTarget(payment)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPayments.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      <Receipt size={32} className="mx-auto mb-2 text-slate-300" />
                      No payment records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Payment" : "Record New Payment"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the transaction and guest payment details.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={savePayment} className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Guest & Booking Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Guest Name" required>
                      <input required value={form.guest} onChange={(e) => updateForm("guest", e.target.value)} className={inputClass} placeholder="Enter guest name" />
                    </Field>
                    <Field label="Guest Email">
                      <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} placeholder="guest@example.com" />
                    </Field>
                    <Field label="Booking Reference" required>
                      <input required value={form.booking} onChange={(e) => updateForm("booking", e.target.value)} className={inputClass} placeholder="BK-2026-001" />
                    </Field>
                    <Field label="Invoice Reference">
                      <input value={form.invoice} onChange={(e) => updateForm("invoice", e.target.value)} className={inputClass} placeholder="INV-2026-001" />
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Transaction Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Payment Amount (₹)" required>
                      <input type="number" min="0.01" step="0.01" required value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} className={inputClass} placeholder="0.00" />
                    </Field>
                    <Field label="Payment Method" required>
                      <select value={form.method} onChange={(e) => updateForm("method", e.target.value)} className={inputClass}>
                        <option>UPI</option>
                        <option>Cash</option>
                        <option>Credit Card</option>
                        <option>Debit Card</option>
                        <option>Bank Transfer</option>
                        <option>Online Gateway</option>
                      </select>
                    </Field>
                    <Field label="Transaction Reference" required>
                      <input required value={form.transactionRef} onChange={(e) => updateForm("transactionRef", e.target.value)} className={inputClass} placeholder="Enter transaction ID" />
                    </Field>
                    <Field label="Payment Date" required>
                      <input type="date" required value={form.date} onChange={(e) => updateForm("date", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Payment Status">
                      <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputClass}>
                        <option>Completed</option>
                        <option>Pending</option>
                        <option>Failed</option>
                      </select>
                    </Field>
                  </div>
                </div>

                <Field label="Payment Notes">
                  <textarea rows={3} value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} className={inputClass} placeholder="Add transaction notes..." />
                </Field>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button type="button" onClick={() => setModal("")} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
                  <button type="submit" className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    <Save size={16} /> {editingId ? "Save Changes" : "Record Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Payment Details Modal */}
        {modal === "details" && selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Payment Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedPayment.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Payment Amount</p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">{money(selectedPayment.amount)}</h3>
                  </div>
                  <StatusBadge status={getPaymentStatus(selectedPayment)} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["Guest", selectedPayment.guest],
                    ["Email", selectedPayment.email || "-"],
                    ["Booking Reference", selectedPayment.booking],
                    ["Invoice Reference", selectedPayment.invoice || "-"],
                    ["Payment Method", selectedPayment.method],
                    ["Payment Date", selectedPayment.date],
                    ["Transaction Reference", selectedPayment.transactionRef],
                    ["Payment ID", selectedPayment.id],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="mb-3 font-semibold text-slate-800">Refund Linkage</h3>
                  {selectedPayment.refundAmount > 0 ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-slate-500">Refund Reference</span><strong>{selectedPayment.refundRef || "-"}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Refund Amount</span><strong className="text-purple-600">{money(selectedPayment.refundAmount)}</strong></div>
                      <div className="flex justify-between"><span className="text-slate-500">Remaining Amount</span><strong>{money(selectedPayment.amount - selectedPayment.refundAmount)}</strong></div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No refund is linked to this payment.</p>
                  )}
                  {selectedPayment.status === "Completed" &&
                    selectedPayment.refundAmount < selectedPayment.amount && (
                    <button
                      onClick={() => linkRefund(selectedPayment)}
                      className="mt-4 flex items-center gap-2 rounded-lg border border-purple-200 bg-purple-50 px-3 py-2 text-sm font-semibold text-purple-700 hover:bg-purple-100"
                    >
                      <RefreshCcw size={15} /> Create Refund Request
                    </button>
                  )}
                </div>

                {selectedPayment.notes && (
                  <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {selectedPayment.notes}
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button onClick={() => printReceipt(selectedPayment)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                    <Printer size={15} /> Print Receipt
                  </button>
                  <button onClick={() => openEdit(selectedPayment)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700">
                    <Pencil size={15} /> Edit
                  </button>
                  {selectedPayment.status === "Pending" && (
                    <button onClick={() => updateStatus(selectedPayment, "Completed")} className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white">
                      Mark Completed
                    </button>
                  )}
                  {selectedPayment.status === "Pending" && (
                    <button onClick={() => updateStatus(selectedPayment, "Failed")} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
                      Mark Failed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Payment?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete {deleteTarget.id}? This action cannot be undone in this demo.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
                <button onClick={deletePayment} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}
