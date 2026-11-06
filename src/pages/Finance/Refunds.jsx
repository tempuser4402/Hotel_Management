
import { useMemo, useState } from "react";
import {
  Plus, Search, Filter, RefreshCcw, IndianRupee, Clock,
  CheckCircle2, XCircle, AlertCircle, Eye, X, Download,
  Printer, Wallet, CreditCard, Banknote, Save, History,
  ArrowRight, Receipt, UserRound
} from "lucide-react";

// Demo payment records. Replace with shared/backend payment data later.
const paymentRecords = [
  {
    id: "PAY-2026-001",
    transactionRef: "TXN-AXIS-78321",
    booking: "BK-2026-101",
    guest: "Rahul Sharma",
    amount: 5000,
    refunded: 0,
    method: "UPI",
  },
  {
    id: "PAY-2026-002",
    transactionRef: "TXN-HDFC-88211",
    booking: "BK-2026-102",
    guest: "Priya Verma",
    amount: 7700,
    refunded: 0,
    method: "Credit Card",
  },
  {
    id: "PAY-2026-004",
    transactionRef: "TXN-SBI-99122",
    booking: "BK-2026-104",
    guest: "Neha Singh",
    amount: 10000,
    refunded: 2000,
    method: "Bank Transfer",
  },
];

const initialRefunds = [
  {
    id: "REF-2026-001",
    paymentId: "PAY-2026-004",
    originalTransaction: "TXN-SBI-99122",
    booking: "BK-2026-104",
    guest: "Neha Singh",
    originalAmount: 10000,
    amount: 2000,
    reason: "Partial cancellation of booking",
    refundMethod: "Original Payment Method",
    requestedDate: "2026-11-02",
    status: "Completed",
    transactionId: "RFD-SBI-88321",
    approvedBy: "Admin",
    processedDate: "2026-11-03",
    notes: "Partial refund completed.",
    history: [
      { action: "Refund requested", date: "2026-11-02", by: "Front Desk" },
      { action: "Refund approved", date: "2026-11-02", by: "Admin" },
      { action: "Refund completed", date: "2026-11-03", by: "Admin" },
    ],
  },
  {
    id: "REF-2026-002",
    paymentId: "PAY-2026-001",
    originalTransaction: "TXN-AXIS-78321",
    booking: "BK-2026-101",
    guest: "Rahul Sharma",
    originalAmount: 5000,
    amount: 1000,
    reason: "Guest requested a partial refund",
    refundMethod: "UPI",
    requestedDate: "2026-11-05",
    status: "Requested",
    transactionId: "",
    approvedBy: "",
    processedDate: "",
    notes: "Awaiting approval.",
    history: [
      { action: "Refund requested", date: "2026-11-05", by: "Front Desk" },
    ],
  },
  {
    id: "REF-2026-003",
    paymentId: "PAY-2026-002",
    originalTransaction: "TXN-HDFC-88211",
    booking: "BK-2026-102",
    guest: "Priya Verma",
    originalAmount: 7700,
    amount: 500,
    reason: "Service adjustment",
    refundMethod: "Original Payment Method",
    requestedDate: "2026-11-04",
    status: "Approved",
    transactionId: "",
    approvedBy: "Admin",
    processedDate: "",
    notes: "Approved, waiting for processing.",
    history: [
      { action: "Refund requested", date: "2026-11-04", by: "Front Desk" },
      { action: "Refund approved", date: "2026-11-05", by: "Admin" },
    ],
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

const today = () => new Date().toISOString().slice(0, 10);

const emptyForm = {
  paymentId: "",
  amount: "",
  reason: "",
  refundMethod: "Original Payment Method",
  requestedDate: today(),
  notes: "",
};

function getStatusStyle(status) {
  const styles = {
    Requested: "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    Rejected: "bg-red-50 text-red-700",
    Processing: "bg-purple-50 text-purple-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Failed: "bg-rose-50 text-rose-700",
  };

  return styles[status] || "bg-slate-100 text-slate-600";
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusStyle(status)}`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
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

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

export default function Refunds() {
  const [refunds, setRefunds] = useState(initialRefunds);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [form, setForm] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("payment") || "";
    const amount = params.get("amount") || "";

    return {
      ...emptyForm,
      paymentId,
      amount,
    };
  });

  const [notification, setNotification] = useState("");
  const [actionTarget, setActionTarget] = useState(null);
  const [actionType, setActionType] = useState("");

  const paymentBalance = (paymentId) => {
    const payment = paymentRecords.find((item) => item.id === paymentId);

    if (!payment) return 0;

    const linkedRefunds = refunds
      .filter(
        (refund) =>
          refund.paymentId === paymentId &&
          refund.status !== "Rejected" &&
          refund.status !== "Failed"
      )
      .reduce((sum, refund) => sum + Number(refund.amount || 0), 0);

    return Math.max(0, payment.amount - linkedRefunds);
  };

  const selectedPayment = paymentRecords.find(
    (payment) => payment.id === form.paymentId
  );

  const stats = useMemo(() => {
    const completed = refunds.filter((item) => item.status === "Completed");
    const pending = refunds.filter(
      (item) => ["Requested", "Approved", "Processing"].includes(item.status)
    );

    return {
      total: refunds.length,
      requested: refunds.filter((item) => item.status === "Requested").length,
      pendingAmount: pending.reduce((sum, item) => sum + item.amount, 0),
      completedAmount: completed.reduce((sum, item) => sum + item.amount, 0),
      rejected: refunds.filter((item) => item.status === "Rejected").length,
    };
  }, [refunds]);

  const filteredRefunds = useMemo(() => {
    const query = search.toLowerCase();

    return refunds.filter((refund) => {
      const matchesSearch =
        refund.id.toLowerCase().includes(query) ||
        refund.paymentId.toLowerCase().includes(query) ||
        refund.guest.toLowerCase().includes(query) ||
        refund.booking.toLowerCase().includes(query) ||
        refund.originalTransaction.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || refund.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || refund.refundMethod === methodFilter;

      return matchesSearch && matchesStatus && matchesMethod;
    });
  }, [refunds, search, statusFilter, methodFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const openCreate = () => {
    const params = new URLSearchParams(window.location.search);

    setForm({
      ...emptyForm,
      paymentId: params.get("payment") || "",
      amount: params.get("amount") || "",
    });

    setModal("form");
  };

  const saveRefund = (event) => {
    event.preventDefault();

    const payment = paymentRecords.find(
      (item) => item.id === form.paymentId
    );

    if (!payment) {
      showMessage("Select a valid original payment.");
      return;
    }

    const amount = Number(form.amount);
    const available = paymentBalance(form.paymentId);

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Enter a valid refund amount.");
      return;
    }

    if (amount > available) {
      showMessage(`Refund exceeds the available balance of ${money(available)}.`);
      return;
    }

    if (!form.reason.trim()) {
      showMessage("Please enter a refund reason.");
      return;
    }

    const newRefund = {
      id: `REF-2026-${String(Date.now()).slice(-6)}`,
      paymentId: payment.id,
      originalTransaction: payment.transactionRef,
      booking: payment.booking,
      guest: payment.guest,
      originalAmount: payment.amount,
      amount,
      reason: form.reason,
      refundMethod: form.refundMethod,
      requestedDate: form.requestedDate,
      status: "Requested",
      transactionId: "",
      approvedBy: "",
      processedDate: "",
      notes: form.notes,
      history: [
        {
          action: "Refund requested",
          date: form.requestedDate,
          by: "Current User",
        },
      ],
    };

    setRefunds((previous) => [newRefund, ...previous]);
    setModal("");
    showMessage("Refund request created successfully.");
  };

  const addHistory = (refund, action, by = "Admin") => [
    ...(refund.history || []),
    { action, date: today(), by },
  ];

  const confirmAction = () => {
    if (!actionTarget || !actionType) return;

    const target = actionTarget;

    setRefunds((previous) =>
      previous.map((refund) => {
        if (refund.id !== target.id) return refund;

        if (actionType === "approve") {
          return {
            ...refund,
            status: "Approved",
            approvedBy: "Admin",
            history: addHistory(refund, "Refund approved"),
          };
        }

        if (actionType === "reject") {
          return {
            ...refund,
            status: "Rejected",
            history: addHistory(refund, "Refund rejected"),
          };
        }

        if (actionType === "process") {
          return {
            ...refund,
            status: "Processing",
            history: addHistory(refund, "Refund processing started"),
          };
        }

        if (actionType === "complete") {
          return {
            ...refund,
            status: "Completed",
            transactionId: `RFD-${String(Date.now()).slice(-8)}`,
            processedDate: today(),
            history: addHistory(refund, "Refund completed"),
          };
        }

        if (actionType === "fail") {
          return {
            ...refund,
            status: "Failed",
            history: addHistory(refund, "Refund processing failed"),
          };
        }

        return refund;
      })
    );

    const messages = {
      approve: "Refund request approved.",
      reject: "Refund request rejected.",
      process: "Refund processing started.",
      complete: "Refund marked as completed.",
      fail: "Refund marked as failed.",
    };

    showMessage(messages[actionType]);
    setActionTarget(null);
    setActionType("");
    setModal("");
    setSelectedRefund(null);
  };

  const openDetails = (refund) => {
    setSelectedRefund(refund);
    setModal("details");
  };

  const exportCSV = () => {
    const headers = [
      "Refund ID",
      "Payment ID",
      "Original Transaction",
      "Guest",
      "Booking",
      "Original Amount",
      "Refund Amount",
      "Reason",
      "Refund Method",
      "Requested Date",
      "Status",
      "Refund Transaction ID",
    ];

    const rows = filteredRefunds.map((refund) => [
      refund.id,
      refund.paymentId,
      refund.originalTransaction,
      refund.guest,
      refund.booking,
      refund.originalAmount,
      refund.amount,
      refund.reason,
      refund.refundMethod,
      refund.requestedDate,
      refund.status,
      refund.transactionId,
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
    link.download = "hotel-refunds.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const printRefund = (refund) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Refund ${escapeHtml(refund.id)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; max-width: 650px; margin: auto; color: #1e293b; }
          .center { text-align: center; }
          .muted { color: #64748b; font-size: 13px; }
          .line { border-top: 1px dashed #94a3b8; margin: 22px 0; }
          .row { display:flex; justify-content:space-between; gap:20px; padding:9px 0; }
          .amount { font-size:25px; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="center">
          <h1>STAYFLOW HOTEL</h1>
          <p class="muted">REFUND CONFIRMATION</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>Refund ID</span><strong>${escapeHtml(refund.id)}</strong></div>
        <div class="row"><span>Original Payment</span><strong>${escapeHtml(refund.paymentId)}</strong></div>
        <div class="row"><span>Original Transaction</span><strong>${escapeHtml(refund.originalTransaction)}</strong></div>
        <div class="row"><span>Guest</span><strong>${escapeHtml(refund.guest)}</strong></div>
        <div class="row"><span>Booking</span><strong>${escapeHtml(refund.booking)}</strong></div>
        <div class="row"><span>Requested Date</span><strong>${escapeHtml(refund.requestedDate)}</strong></div>
        <div class="row"><span>Refund Method</span><strong>${escapeHtml(refund.refundMethod)}</strong></div>
        <div class="line"></div>
        <div class="row"><span>Refund Amount</span><strong class="amount">${money(refund.amount)}</strong></div>
        <div class="row"><span>Status</span><strong>${escapeHtml(refund.status)}</strong></div>
        <div class="row"><span>Refund Transaction ID</span><strong>${escapeHtml(refund.transactionId || "-")}</strong></div>
        <div class="row"><span>Reason</span><strong>${escapeHtml(refund.reason)}</strong></div>
        <div class="line"></div>
        <p class="muted">This document is a computer-generated refund record.</p>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showMessage("Please allow pop-ups to print or save this record as PDF.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const actionLabels = {
    approve: "Approve Refund",
    reject: "Reject Refund",
    process: "Start Processing",
    complete: "Mark as Completed",
    fail: "Mark as Failed",
  };

  const actionDescriptions = {
    approve: "Approve this refund request so it can be processed.",
    reject: "Reject this refund request. Its amount will become refundable again.",
    process: "Move this approved refund into processing.",
    complete: "Confirm that the refund has been successfully sent to the guest.",
    fail: "Mark this refund transaction as failed. The amount will become refundable again.",
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <RefreshCcw size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Refunds</h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage refund requests, approvals and refund transactions.
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
              <Plus size={17} /> New Refund Request
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Refund Requests"
            value={stats.total}
            subtitle="All recorded requests"
            icon={Receipt}
            color="blue"
          />
          <StatCard
            title="Awaiting Approval"
            value={stats.requested}
            subtitle="Requests requiring review"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Pending Refund Value"
            value={money(stats.pendingAmount)}
            subtitle="Requested, approved and processing"
            icon={Wallet}
            color="purple"
          />
          <StatCard
            title="Completed Refunds"
            value={money(stats.completedAmount)}
            subtitle={`${refunds.filter((r) => r.status === "Completed").length} completed transactions`}
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search refund, payment, guest..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Refund Statuses</option>
              <option>Requested</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Processing</option>
              <option>Completed</option>
              <option>Failed</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Refund Methods</option>
              <option>Original Payment Method</option>
              <option>UPI</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
              <option>Credit Card</option>
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Showing {filteredRefunds.length} of {refunds.length} refunds</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setMethodFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Refund table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Refund Requests</h2>
            <p className="mt-1 text-xs text-slate-500">
              Original payment details, refund amounts and approval status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Refund ID</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Original Payment</th>
                  <th className="px-4 py-3">Refund Amount</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Requested</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRefunds.map((refund) => (
                  <tr key={refund.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-purple-600">{refund.id}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{refund.guest}</p>
                      <p className="mt-1 text-xs text-slate-400">{refund.booking}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">{refund.paymentId}</p>
                      <p className="mt-1 text-xs text-slate-400">{refund.originalTransaction}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">{money(refund.amount)}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        Original: {money(refund.originalAmount)}
                      </p>
                    </td>
                    <td className="max-w-[180px] px-4 py-3 text-slate-600">
                      <span className="line-clamp-2">{refund.reason}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{refund.refundMethod}</td>
                    <td className="px-4 py-3 text-slate-600">{refund.requestedDate}</td>
                    <td className="px-4 py-3"><StatusBadge status={refund.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details"
                          onClick={() => openDetails(refund)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Print refund record"
                          onClick={() => printRefund(refund)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRefunds.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      <RefreshCcw size={32} className="mx-auto mb-2 text-slate-300" />
                      No refund requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Refund Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">New Refund Request</h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Select the original payment and enter refund details.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveRefund} className="space-y-5 p-5">
                <Field label="Original Payment" required>
                  <select
                    required
                    value={form.paymentId}
                    onChange={(e) => {
                      const paymentId = e.target.value;
                      updateForm("paymentId", paymentId);
                      updateForm("amount", "");
                    }}
                    className={inputClass}
                  >
                    <option value="">Select original payment</option>
                    {paymentRecords.map((payment) => {
                      const balance = paymentBalance(payment.id);

                      return (
                        <option
                          key={payment.id}
                          value={payment.id}
                          disabled={balance <= 0}
                        >
                          {payment.id} — {payment.guest} — Available: {money(balance)}
                        </option>
                      );
                    })}
                  </select>
                </Field>

                {selectedPayment && (
                  <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                    <h3 className="mb-3 font-semibold text-blue-900">Original Payment Details</h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-blue-600/70">Guest</p>
                        <p className="mt-1 font-semibold text-blue-950">{selectedPayment.guest}</p>
                      </div>
                      <div>
                        <p className="text-blue-600/70">Booking</p>
                        <p className="mt-1 font-semibold text-blue-950">{selectedPayment.booking}</p>
                      </div>
                      <div>
                        <p className="text-blue-600/70">Original Amount</p>
                        <p className="mt-1 font-semibold text-blue-950">{money(selectedPayment.amount)}</p>
                      </div>
                      <div>
                        <p className="text-blue-600/70">Refundable Balance</p>
                        <p className="mt-1 font-bold text-emerald-700">{money(paymentBalance(selectedPayment.id))}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-blue-600/70">Original Transaction</p>
                        <p className="mt-1 font-semibold text-blue-950">{selectedPayment.transactionRef}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Refund Amount (₹)" required>
                    <input
                      type="number"
                      required
                      min="0.01"
                      max={selectedPayment ? paymentBalance(selectedPayment.id) : undefined}
                      step="0.01"
                      value={form.amount}
                      onChange={(e) => updateForm("amount", e.target.value)}
                      className={inputClass}
                      placeholder="Enter refund amount"
                    />
                  </Field>

                  <Field label="Requested Date" required>
                    <input
                      type="date"
                      required
                      value={form.requestedDate}
                      onChange={(e) => updateForm("requestedDate", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Refund Method" required>
                    <select
                      value={form.refundMethod}
                      onChange={(e) => updateForm("refundMethod", e.target.value)}
                      className={inputClass}
                    >
                      <option>Original Payment Method</option>
                      <option>UPI</option>
                      <option>Cash</option>
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                    </select>
                  </Field>

                  <Field label="Reason" required>
                    <input
                      required
                      value={form.reason}
                      onChange={(e) => updateForm("reason", e.target.value)}
                      className={inputClass}
                      placeholder="Reason for refund"
                    />
                  </Field>
                </div>

                <Field label="Additional Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    className={inputClass}
                    placeholder="Add any additional information..."
                  />
                </Field>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <AlertCircle size={16} className="mr-2 inline" />
                  New refund requests are created with Requested status. Approval is required before processing.
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
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
                    <Save size={16} /> Submit Refund Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Refund Details Modal */}
        {modal === "details" && selectedRefund && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Refund Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedRefund.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Refund Amount</p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">{money(selectedRefund.amount)}</h3>
                  </div>
                  <StatusBadge status={selectedRefund.status} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["Guest", selectedRefund.guest],
                    ["Booking Reference", selectedRefund.booking],
                    ["Original Payment ID", selectedRefund.paymentId],
                    ["Original Transaction", selectedRefund.originalTransaction],
                    ["Original Payment Amount", money(selectedRefund.originalAmount)],
                    ["Refund Method", selectedRefund.refundMethod],
                    ["Requested Date", selectedRefund.requestedDate],
                    ["Approved By", selectedRefund.approvedBy || "Not approved"],
                    ["Refund Transaction ID", selectedRefund.transactionId || "Not generated"],
                    ["Processed Date", selectedRefund.processedDate || "Not processed"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-800">Refund Reason</h3>
                  <p className="mt-2 text-sm text-slate-600">{selectedRefund.reason}</p>
                  {selectedRefund.notes && (
                    <p className="mt-3 border-t border-slate-100 pt-3 text-sm text-slate-500">
                      {selectedRefund.notes}
                    </p>
                  )}
                </div>

                {/* History */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-4 flex items-center gap-2">
                    <History size={18} className="text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Refund History</h3>
                  </div>

                  <div className="space-y-4">
                    {(selectedRefund.history || []).map((entry, index) => (
                      <div key={`${entry.action}-${index}`} className="flex gap-3">
                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{entry.action}</p>
                          <p className="mt-1 text-xs text-slate-400">{entry.date} · {entry.by}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Workflow Actions */}
                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => printRefund(selectedRefund)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Printer size={15} /> Print Record
                  </button>

                  {selectedRefund.status === "Requested" && (
                    <>
                      <button
                        onClick={() => {
                          setActionTarget(selectedRefund);
                          setActionType("reject");
                          setModal("confirm");
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => {
                          setActionTarget(selectedRefund);
                          setActionType("approve");
                          setModal("confirm");
                        }}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Approve Refund
                      </button>
                    </>
                  )}

                  {selectedRefund.status === "Approved" && (
                    <button
                      onClick={() => {
                        setActionTarget(selectedRefund);
                        setActionType("process");
                        setModal("confirm");
                      }}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Start Processing
                    </button>
                  )}

                  {selectedRefund.status === "Processing" && (
                    <>
                      <button
                        onClick={() => {
                          setActionTarget(selectedRefund);
                          setActionType("fail");
                          setModal("confirm");
                        }}
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Mark Failed
                      </button>
                      <button
                        onClick={() => {
                          setActionTarget(selectedRefund);
                          setActionType("complete");
                          setModal("confirm");
                        }}
                        className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation */}
        {modal === "confirm" && actionTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <AlertCircle size={22} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                {actionLabels[actionType]}?
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {actionDescriptions[actionType]}
              </p>

              <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Refund ID</span>
                  <strong>{actionTarget.id}</strong>
                </div>
                <div className="mt-2 flex justify-between">
                  <span className="text-slate-500">Amount</span>
                  <strong>{money(actionTarget.amount)}</strong>
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setModal("details");
                    setActionTarget(null);
                    setActionType("");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                    actionType === "reject" || actionType === "fail"
                      ? "bg-red-600"
                      : "bg-blue-600"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
