
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Eye,
  Pencil,
  Trash2,
  IndianRupee,
  CreditCard,
  Wallet,
  FileText,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  Receipt,
  Upload,
  CalendarDays,
  UserRound,
  RefreshCcw,
} from "lucide-react";

const initialPayments = [
  {
    id: "PAY-1001",
    eventId: "EVT-1001",
    customer: "Amit Sharma",
    eventType: "Wedding",
    eventDate: "2026-12-15",
    totalAmount: 250000,
    advance: 50000,
    paidAmount: 100000,
    balance: 150000,
    taxRate: 18,
    paymentStatus: "Partially Paid",
    dueDate: "2026-11-20",
    cancellationPolicy: "Advance is non-refundable after confirmation.",
    paymentTerms: "50% advance and remaining amount before event.",
    contractNumber: "CON-1001",
    contractFile: "",
    signatureStatus: "Pending",
    notes: "Wedding reception booking.",
    transactions: [
      {
        id: "TXN-1001",
        date: "2026-11-02",
        amount: 50000,
        mode: "UPI",
        reference: "UPI123456",
        type: "Advance",
        notes: "Initial advance",
      },
      {
        id: "TXN-1002",
        date: "2026-11-05",
        amount: 50000,
        mode: "Bank Transfer",
        reference: "NEFT789456",
        type: "Installment",
        notes: "Second payment",
      },
    ],
    refunds: [],
  },
  {
    id: "PAY-1002",
    eventId: "EVT-1002",
    customer: "Neha Verma",
    eventType: "Birthday",
    eventDate: "2026-11-25",
    totalAmount: 80000,
    advance: 20000,
    paidAmount: 80000,
    balance: 0,
    taxRate: 18,
    paymentStatus: "Paid",
    dueDate: "2026-11-20",
    cancellationPolicy: "Cancellation charges apply as per agreement.",
    paymentTerms: "Full payment before event.",
    contractNumber: "CON-1002",
    contractFile: "neha-birthday-agreement.pdf",
    signatureStatus: "Signed",
    notes: "Birthday party completed payment.",
    transactions: [
      {
        id: "TXN-1003",
        date: "2026-11-01",
        amount: 20000,
        mode: "Cash",
        reference: "",
        type: "Advance",
        notes: "Booking advance",
      },
      {
        id: "TXN-1004",
        date: "2026-11-04",
        amount: 60000,
        mode: "UPI",
        reference: "UPI456123",
        type: "Final Payment",
        notes: "Final settlement",
      },
    ],
    refunds: [],
  },
  {
    id: "PAY-1003",
    eventId: "EVT-1003",
    customer: "ABC Technologies",
    eventType: "Corporate",
    eventDate: "2026-12-05",
    totalAmount: 60000,
    advance: 15000,
    paidAmount: 15000,
    balance: 45000,
    taxRate: 18,
    paymentStatus: "Partially Paid",
    dueDate: "2026-11-28",
    cancellationPolicy: "Refund as per corporate agreement.",
    paymentTerms: "25% advance and balance before event.",
    contractNumber: "CON-1003",
    contractFile: "",
    signatureStatus: "Pending",
    notes: "Conference booking.",
    transactions: [
      {
        id: "TXN-1005",
        date: "2026-11-04",
        amount: 15000,
        mode: "Bank Transfer",
        reference: "NEFT123456",
        type: "Advance",
        notes: "Corporate advance",
      },
    ],
    refunds: [],
  },
];

const emptyPayment = {
  eventId: "",
  customer: "",
  eventType: "Wedding",
  eventDate: "",
  totalAmount: "",
  advance: "",
  paidAmount: 0,
  taxRate: 18,
  dueDate: "",
  paymentTerms: "50% advance and remaining amount before event.",
  cancellationPolicy: "",
  contractNumber: "",
  contractFile: "",
  signatureStatus: "Pending",
  notes: "",
};

const emptyTransaction = {
  date: new Date().toISOString().slice(0, 10),
  amount: "",
  mode: "UPI",
  reference: "",
  type: "Installment",
  notes: "",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function calculateStatus(total, paid) {
  if (paid <= 0) return "Pending";
  if (paid >= total) return "Paid";
  return "Partially Paid";
}

export default function EventPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyPayment);

  const [selected, setSelected] = useState(null);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionForm, setTransactionForm] = useState(emptyTransaction);

  const [showRefund, setShowRefund] = useState(false);
  const [refundForm, setRefundForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    amount: "",
    mode: "Bank Transfer",
    reference: "",
    reason: "",
  });

  const [showContract, setShowContract] = useState(false);
  const [contractForm, setContractForm] = useState(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((item) => {
      const q = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(q) ||
        item.eventId.toLowerCase().includes(q) ||
        item.customer.toLowerCase().includes(q) ||
        item.contractNumber.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (statusFilter === "All" || item.paymentStatus === statusFilter)
      );
    });
  }, [payments, search, statusFilter]);

  const totals = useMemo(() => {
    return payments.reduce(
      (acc, item) => {
        acc.total += Number(item.totalAmount || 0);
        acc.paid += Number(item.paidAmount || 0);
        acc.balance += Number(item.balance || 0);
        acc.refunds += (item.refunds || []).reduce(
          (sum, refund) => sum + Number(refund.amount || 0),
          0
        );
        return acc;
      },
      { total: 0, paid: 0, balance: 0, refunds: 0 }
    );
  }, [payments]);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updatePayment = (id, updates) => {
    setPayments((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...updates };
        updated.balance = Math.max(
          0,
          Number(updated.totalAmount || 0) -
            Number(updated.paidAmount || 0)
        );
        updated.paymentStatus = calculateStatus(
          updated.totalAmount,
          updated.paidAmount
        );
        return updated;
      })
    );

    setSelected((prev) =>
      prev?.id === id
        ? { ...prev, ...updates }
        : prev
    );
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyPayment);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowForm(true);
  };

  const savePayment = (e) => {
    e.preventDefault();

    if (
      !form.eventId.trim() ||
      !form.customer.trim() ||
      !form.eventDate ||
      Number(form.totalAmount) <= 0
    ) {
      alert("Enter event ID, customer, event date and a valid total amount.");
      return;
    }

    const total = Number(form.totalAmount);
    const paid = Number(form.paidAmount || 0);

    if (paid > total) {
      alert("Paid amount cannot exceed the total amount.");
      return;
    }

    const data = {
      ...form,
      totalAmount: total,
      advance: Number(form.advance || 0),
      paidAmount: paid,
      taxRate: Number(form.taxRate || 0),
      balance: total - paid,
      paymentStatus: calculateStatus(total, paid),
      transactions: editingId
        ? payments.find((p) => p.id === editingId)?.transactions || []
        : [],
      refunds: editingId
        ? payments.find((p) => p.id === editingId)?.refunds || []
        : [],
    };

    if (editingId) {
      setPayments((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...data } : item
        )
      );
    } else {
      setPayments((prev) => [
        {
          ...data,
          id: `PAY-${String(Date.now()).slice(-5)}`,
        },
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyPayment);
  };

  const deletePayment = (item) => {
    if (item.paidAmount > 0 || item.transactions.length > 0) {
      alert("This payment record has transactions. It cannot be deleted.");
      return;
    }

    if (window.confirm(`Delete payment record ${item.id}?`)) {
      setPayments((prev) => prev.filter((p) => p.id !== item.id));
      setSelected(null);
    }
  };

  const openTransaction = (item, type = "Installment") => {
    setSelected(item);
    setTransactionForm({
      ...emptyTransaction,
      type,
      amount: "",
      date: new Date().toISOString().slice(0, 10),
    });
    setShowTransaction(true);
  };

  const saveTransaction = (e) => {
    e.preventDefault();

    const amount = Number(transactionForm.amount);
    if (!amount || amount <= 0) {
      alert("Enter a valid payment amount.");
      return;
    }

    const current = payments.find((p) => p.id === selected.id);
    if (!current) return;

    if (amount > current.balance) {
      alert("Payment amount cannot exceed the outstanding balance.");
      return;
    }

    const transaction = {
      ...transactionForm,
      id: `TXN-${String(Date.now()).slice(-6)}`,
      amount,
    };

    const newPaid = Number(current.paidAmount) + amount;

    updatePayment(current.id, {
      paidAmount: newPaid,
      transactions: [...current.transactions, transaction],
    });

    setShowTransaction(false);
    setTransactionForm(emptyTransaction);
  };

  const openRefund = (item) => {
    setSelected(item);
    setRefundForm({
      date: new Date().toISOString().slice(0, 10),
      amount: "",
      mode: "Bank Transfer",
      reference: "",
      reason: "",
    });
    setShowRefund(true);
  };

  const saveRefund = (e) => {
    e.preventDefault();

    const amount = Number(refundForm.amount);
    const current = payments.find((p) => p.id === selected.id);

    if (!current || !amount || amount <= 0) {
      alert("Enter a valid refund amount.");
      return;
    }

    const totalRefunded = (current.refunds || []).reduce(
      (sum, refund) => sum + Number(refund.amount),
      0
    );

    const refundableAmount = current.paidAmount - totalRefunded;

    if (amount > refundableAmount) {
      alert(
        `Refund cannot exceed the amount received after previous refunds (${formatCurrency(refundableAmount)}).`
      );
      return;
    }

    const refund = {
      ...refundForm,
      id: `REF-${String(Date.now()).slice(-6)}`,
      amount,
    };

    updatePayment(current.id, {
      refunds: [...(current.refunds || []), refund],
    });

    setShowRefund(false);
  };

  const openContract = (item) => {
    setSelected(item);
    setContractForm({
      contractNumber: item.contractNumber || "",
      contractFile: item.contractFile || "",
      signatureStatus: item.signatureStatus || "Pending",
      paymentTerms: item.paymentTerms || "",
      cancellationPolicy: item.cancellationPolicy || "",
    });
    setShowContract(true);
  };

  const saveContract = (e) => {
    e.preventDefault();

    updatePayment(selected.id, contractForm);
    setShowContract(false);
  };

  const exportCSV = () => {
    const headers = [
      "Payment ID",
      "Event ID",
      "Customer",
      "Event Type",
      "Event Date",
      "Total Amount",
      "Advance",
      "Paid Amount",
      "Balance",
      "Payment Status",
      "Due Date",
      "Contract Number",
      "Signature Status",
    ];

    const rows = filteredPayments.map((p) => [
      p.id,
      p.eventId,
      p.customer,
      p.eventType,
      p.eventDate,
      p.totalAmount,
      p.advance,
      p.paidAmount,
      p.balance,
      p.paymentStatus,
      p.dueDate,
      p.contractNumber,
      p.signatureStatus,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-payments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Events & Banquets / Payments & Contracts</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Payments & Contracts
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage event payments, outstanding balances, refunds and agreements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} /> Add Payment Record
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Event Value"
          value={formatCurrency(totals.total)}
          icon={<IndianRupee size={20} />}
          color="blue"
        />
        <StatCard
          title="Amount Received"
          value={formatCurrency(totals.paid)}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(totals.balance)}
          icon={<Clock size={20} />}
          color="orange"
        />
        <StatCard
          title="Refunds Issued"
          value={formatCurrency(totals.refunds)}
          icon={<RefreshCcw size={20} />}
          color="purple"
        />
      </div>

      {/* Payment records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Event Payment Records</h2>
            <p className="mt-1 text-xs text-slate-500">
              Track advances, installments, final payments and pending dues.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, event or ID..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Payment Status</option>
              <option>Pending</option>
              <option>Partially Paid</option>
              <option>Paid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Payment / Event</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Event Date</th>
                <th className="px-4 py-3">Total Amount</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Balance</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{item.id}</p>
                    <p className="mt-1 text-xs text-blue-600">{item.eventId}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{item.customer}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.eventType}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.eventDate)}</td>
                  <td className="px-4 py-3 font-medium">{formatCurrency(item.totalAmount)}</td>
                  <td className="px-4 py-3 font-medium text-green-700">{formatCurrency(item.paidAmount)}</td>
                  <td className="px-4 py-3 font-medium text-orange-700">{formatCurrency(item.balance)}</td>
                  <td className="px-4 py-3 text-slate-600">{formatDate(item.dueDate)}</td>
                  <td className="px-4 py-3"><PaymentBadge status={item.paymentStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButton title="View payment details" onClick={() => setSelected(item)}>
                        <Eye size={16} />
                      </ActionButton>
                      <ActionButton title="Edit payment record" onClick={() => openEditForm(item)}>
                        <Pencil size={16} />
                      </ActionButton>
                      <ActionButton title="Add payment" onClick={() => openTransaction(item)}>
                        <Plus size={16} />
                      </ActionButton>
                      <ActionButton title="Delete record" danger onClick={() => deletePayment(item)}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                    No payment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit payment record */}
      {showForm && (
        <Modal title={editingId ? "Edit Payment Record" : "Add Payment Record"} onClose={() => setShowForm(false)} wide>
          <form onSubmit={savePayment} className="space-y-5">
            <FormSection title="Event & Customer Details">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Event ID *">
                  <input required value={form.eventId} onChange={(e) => updateForm("eventId", e.target.value)} className="form-input" placeholder="EVT-1001" />
                </Field>
                <Field label="Customer Name *">
                  <input required value={form.customer} onChange={(e) => updateForm("customer", e.target.value)} className="form-input" placeholder="Customer / company name" />
                </Field>
                <Field label="Event Type">
                  <select value={form.eventType} onChange={(e) => updateForm("eventType", e.target.value)} className="form-input">
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Engagement</option>
                    <option>Anniversary</option>
                    <option>Corporate</option>
                    <option>Conference</option>
                    <option>Reception</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Event Date *">
                  <input required type="date" value={form.eventDate} onChange={(e) => updateForm("eventDate", e.target.value)} className="form-input" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Payment & Tax Details">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Total Event Amount (₹) *">
                  <input required type="number" min="1" value={form.totalAmount} onChange={(e) => updateForm("totalAmount", e.target.value)} className="form-input" />
                </Field>
                <Field label="Advance Amount (₹)">
                  <input type="number" min="0" value={form.advance} onChange={(e) => updateForm("advance", e.target.value)} className="form-input" />
                </Field>
                <Field label="Amount Already Received (₹)">
                  <input type="number" min="0" value={form.paidAmount} onChange={(e) => updateForm("paidAmount", e.target.value)} className="form-input" />
                </Field>
                <Field label="Tax Rate (%)">
                  <input type="number" min="0" max="100" step="0.01" value={form.taxRate} onChange={(e) => updateForm("taxRate", e.target.value)} className="form-input" />
                </Field>
                <Field label="Balance Due Date">
                  <input type="date" value={form.dueDate} onChange={(e) => updateForm("dueDate", e.target.value)} className="form-input" />
                </Field>
                <Field label="Contract Number">
                  <input value={form.contractNumber} onChange={(e) => updateForm("contractNumber", e.target.value)} className="form-input" placeholder="CON-1001" />
                </Field>
              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-600">Outstanding balance</span>
                  <strong className="text-slate-900">
                    {formatCurrency(Math.max(0, Number(form.totalAmount || 0) - Number(form.paidAmount || 0)))}
                  </strong>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Tax rate is recorded for reference. Confirm the applicable GST treatment before issuing a tax invoice.
                </p>
              </div>
            </FormSection>

            <FormSection title="Payment Terms & Contract">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Payment Terms">
                  <textarea rows="3" value={form.paymentTerms} onChange={(e) => updateForm("paymentTerms", e.target.value)} className="form-input resize-none" />
                </Field>
                <Field label="Cancellation Policy">
                  <textarea rows="3" value={form.cancellationPolicy} onChange={(e) => updateForm("cancellationPolicy", e.target.value)} className="form-input resize-none" />
                </Field>
                <Field label="Signature Status">
                  <select value={form.signatureStatus} onChange={(e) => updateForm("signatureStatus", e.target.value)} className="form-input">
                    <option>Pending</option>
                    <option>Sent for Signature</option>
                    <option>Signed</option>
                    <option>Rejected</option>
                  </select>
                </Field>
                <Field label="Contract File">
                  <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => updateForm("contractFile", e.target.files?.[0]?.name || "")} className="form-input" />
                  {form.contractFile && <p className="mt-1 text-xs text-slate-500">Selected: {form.contractFile}</p>}
                </Field>
              </div>
            </FormSection>

            <Field label="Internal Notes">
              <textarea rows="3" value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} className="form-input resize-none" placeholder="Add payment or contract notes..." />
            </Field>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancel</button>
              <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
                {editingId ? "Update Record" : "Save Record"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payment Details */}
      {selected && !showTransaction && !showRefund && !showContract && !showForm && (
        <Modal title="Payment Details" onClose={() => setSelected(null)} wide>
          <div className="space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{selected.id} · {selected.eventId}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">{selected.customer}</h3>
                <p className="mt-1 text-sm text-slate-500">{selected.eventType} · {formatDate(selected.eventDate)}</p>
              </div>
              <PaymentBadge status={selected.paymentStatus} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <AmountBox label="Total Amount" amount={selected.totalAmount} />
              <AmountBox label="Received" amount={selected.paidAmount} color="green" />
              <AmountBox label="Balance" amount={selected.balance} color="orange" />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => openTransaction(selected)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                <Plus size={15} className="mr-1 inline" /> Record Payment
              </button>
              <button onClick={() => openRefund(selected)} disabled={selected.paidAmount <= 0} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 disabled:opacity-40">
                <RefreshCcw size={15} className="mr-1 inline" /> Record Refund
              </button>
              <button onClick={() => openContract(selected)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <FileText size={15} className="mr-1 inline" /> Manage Contract
              </button>
              <button onClick={() => openEditForm(selected)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <Pencil size={15} className="mr-1 inline" /> Edit
              </button>
            </div>

            <section>
              <h3 className="mb-3 font-semibold text-slate-900">Payment Transactions</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Transaction ID</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Type</th>
                      <th className="px-3 py-2">Mode</th>
                      <th className="px-3 py-2">Reference</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.transactions.map((txn) => (
                      <tr key={txn.id} className="border-t border-slate-100">
                        <td className="px-3 py-3 font-medium">{txn.id}</td>
                        <td className="px-3 py-3">{formatDate(txn.date)}</td>
                        <td className="px-3 py-3">{txn.type}</td>
                        <td className="px-3 py-3">{txn.mode}</td>
                        <td className="px-3 py-3">{txn.reference || "—"}</td>
                        <td className="px-3 py-3 text-right font-semibold text-green-700">{formatCurrency(txn.amount)}</td>
                      </tr>
                    ))}
                    {selected.transactions.length === 0 && (
                      <tr><td colSpan="6" className="p-5 text-center text-slate-500">No transactions recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-slate-900">Refund History</h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[500px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Refund ID</th>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2">Mode</th>
                      <th className="px-3 py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selected.refunds || []).map((refund) => (
                      <tr key={refund.id} className="border-t border-slate-100">
                        <td className="px-3 py-3">{refund.id}</td>
                        <td className="px-3 py-3">{formatDate(refund.date)}</td>
                        <td className="px-3 py-3">{refund.mode}</td>
                        <td className="px-3 py-3 text-right font-semibold text-red-600">{formatCurrency(refund.amount)}</td>
                      </tr>
                    ))}
                    {(!selected.refunds || selected.refunds.length === 0) && (
                      <tr><td colSpan="4" className="p-5 text-center text-slate-500">No refunds recorded.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InfoBox label="Contract Number" value={selected.contractNumber || "Not assigned"} />
              <InfoBox label="Contract File" value={selected.contractFile || "No file attached"} />
              <InfoBox label="Signature Status" value={selected.signatureStatus} />
              <InfoBox label="Balance Due Date" value={formatDate(selected.dueDate)} />
              <InfoBox label="Payment Terms" value={selected.paymentTerms || "—"} />
              <InfoBox label="Cancellation Policy" value={selected.cancellationPolicy || "—"} />
            </section>
          </div>
        </Modal>
      )}

      {/* Record payment */}
      {showTransaction && selected && (
        <Modal title="Record Event Payment" onClose={() => setShowTransaction(false)}>
          <form onSubmit={saveTransaction} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="font-semibold text-slate-800">{selected.customer}</p>
              <p className="mt-1 text-slate-600">Outstanding: {formatCurrency(selected.balance)}</p>
            </div>
            <Field label="Payment Type">
              <select value={transactionForm.type} onChange={(e) => setTransactionForm({ ...transactionForm, type: e.target.value })} className="form-input">
                <option>Advance</option>
                <option>Installment</option>
                <option>Final Payment</option>
              </select>
            </Field>
            <Field label="Payment Date *">
              <input required type="date" value={transactionForm.date} onChange={(e) => setTransactionForm({ ...transactionForm, date: e.target.value })} className="form-input" />
            </Field>
            <Field label="Amount (₹) *">
              <input required type="number" min="1" max={selected.balance} value={transactionForm.amount} onChange={(e) => setTransactionForm({ ...transactionForm, amount: e.target.value })} className="form-input" />
            </Field>
            <Field label="Payment Mode">
              <select value={transactionForm.mode} onChange={(e) => setTransactionForm({ ...transactionForm, mode: e.target.value })} className="form-input">
                <option>Cash</option>
                <option>UPI</option>
                <option>Card</option>
                <option>Bank Transfer</option>
                <option>Cheque</option>
              </select>
            </Field>
            <Field label="Transaction / Reference Number">
              <input value={transactionForm.reference} onChange={(e) => setTransactionForm({ ...transactionForm, reference: e.target.value })} className="form-input" />
            </Field>
            <Field label="Notes">
              <textarea rows="2" value={transactionForm.notes} onChange={(e) => setTransactionForm({ ...transactionForm, notes: e.target.value })} className="form-input resize-none" />
            </Field>
            <ModalActions onCancel={() => setShowTransaction(false)} submitLabel="Save Payment" />
          </form>
        </Modal>
      )}

      {/* Refund */}
      {showRefund && selected && (
        <Modal title="Record Refund" onClose={() => setShowRefund(false)}>
          <form onSubmit={saveRefund} className="space-y-4">
            <div className="rounded-lg bg-orange-50 p-3 text-sm">
              <p className="font-semibold text-slate-800">{selected.customer}</p>
              <p className="mt-1 text-slate-600">Total received: {formatCurrency(selected.paidAmount)}</p>
            </div>
            <Field label="Refund Date *">
              <input required type="date" value={refundForm.date} onChange={(e) => setRefundForm({ ...refundForm, date: e.target.value })} className="form-input" />
            </Field>
            <Field label="Refund Amount (₹) *">
              <input required type="number" min="1" value={refundForm.amount} onChange={(e) => setRefundForm({ ...refundForm, amount: e.target.value })} className="form-input" />
            </Field>
            <Field label="Refund Mode">
              <select value={refundForm.mode} onChange={(e) => setRefundForm({ ...refundForm, mode: e.target.value })} className="form-input">
                <option>Bank Transfer</option>
                <option>UPI</option>
                <option>Cash</option>
                <option>Card Reversal</option>
                <option>Cheque</option>
              </select>
            </Field>
            <Field label="Refund Reference">
              <input value={refundForm.reference} onChange={(e) => setRefundForm({ ...refundForm, reference: e.target.value })} className="form-input" />
            </Field>
            <Field label="Reason">
              <textarea rows="2" value={refundForm.reason} onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })} className="form-input resize-none" />
            </Field>
            <ModalActions onCancel={() => setShowRefund(false)} submitLabel="Save Refund" />
          </form>
        </Modal>
      )}

      {/* Contract */}
      {showContract && selected && contractForm && (
        <Modal title="Manage Contract" onClose={() => setShowContract(false)}>
          <form onSubmit={saveContract} className="space-y-4">
            <Field label="Contract Number">
              <input value={contractForm.contractNumber} onChange={(e) => setContractForm({ ...contractForm, contractNumber: e.target.value })} className="form-input" />
            </Field>
            <Field label="Upload Contract">
              <input type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setContractForm({ ...contractForm, contractFile: e.target.files?.[0]?.name || "" })} className="form-input" />
              {contractForm.contractFile && <p className="mt-1 text-xs text-slate-500">Selected: {contractForm.contractFile}</p>}
            </Field>
            <Field label="Signature Status">
              <select value={contractForm.signatureStatus} onChange={(e) => setContractForm({ ...contractForm, signatureStatus: e.target.value })} className="form-input">
                <option>Pending</option>
                <option>Sent for Signature</option>
                <option>Signed</option>
                <option>Rejected</option>
              </select>
            </Field>
            <Field label="Payment Terms">
              <textarea rows="3" value={contractForm.paymentTerms} onChange={(e) => setContractForm({ ...contractForm, paymentTerms: e.target.value })} className="form-input resize-none" />
            </Field>
            <Field label="Cancellation Policy">
              <textarea rows="3" value={contractForm.cancellationPolicy} onChange={(e) => setContractForm({ ...contractForm, cancellationPolicy: e.target.value })} className="form-input resize-none" />
            </Field>
            <ModalActions onCancel={() => setShowContract(false)} submitLabel="Save Contract Details" />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* Reusable components */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    Paid: "bg-green-50 text-green-700",
    Pending: "bg-orange-50 text-orange-700",
    "Partially Paid": "bg-blue-50 text-blue-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ActionButton({ children, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border p-2 transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function AmountBox({ label, amount, color = "slate" }) {
  const colors = {
    slate: "text-slate-900",
    green: "text-green-700",
    orange: "text-orange-700",
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-lg font-bold ${colors[color]}`}>{formatCurrency(amount)}</p>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ${wide ? "max-w-5xl" : "max-w-xl"}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
      <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
        Cancel
      </button>
      <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
        {submitLabel}
      </button>
    </div>
  );
}
