
import { useMemo, useState } from "react";
import {
  Plus, Search, Filter, FileText, Download, Printer, Eye,
  Pencil, Trash2, X, Save, IndianRupee, CheckCircle2,
  Clock, AlertCircle, Receipt, CalendarDays, UserRound,
  BedDouble, Calculator, Send, MoreHorizontal
} from "lucide-react";

const initialInvoices = [
  {
    id: "INV-2026-001",
    date: "2026-11-06",
    dueDate: "2026-11-10",
    guest: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    booking: "BK-2026-101",
    room: "101",
    items: [
      { id: 1, description: "Deluxe Room - 2 Nights", quantity: 2, price: 4500 },
      { id: 2, description: "Breakfast", quantity: 2, price: 350 },
    ],
    discount: 500,
    taxRate: 12,
    taxInclusive: false,
    paid: 5000,
    status: "Partially Paid",
    notes: "Thank you for staying with us.",
  },
  {
    id: "INV-2026-002",
    date: "2026-11-05",
    dueDate: "2026-11-08",
    guest: "Priya Verma",
    email: "priya@example.com",
    phone: "9876501234",
    booking: "BK-2026-102",
    room: "205",
    items: [
      { id: 1, description: "Premium Room - 1 Night", quantity: 1, price: 6500 },
      { id: 2, description: "Restaurant Charges", quantity: 1, price: 1200 },
    ],
    discount: 0,
    taxRate: 12,
    taxInclusive: false,
    paid: 7700,
    status: "Paid",
    notes: "",
  },
  {
    id: "INV-2026-003",
    date: "2026-11-04",
    dueDate: "2026-11-09",
    guest: "Amit Kumar",
    email: "amit@example.com",
    phone: "9812345678",
    booking: "BK-2026-103",
    room: "302",
    items: [
      { id: 1, description: "Standard Room - 3 Nights", quantity: 3, price: 2800 },
    ],
    discount: 300,
    taxRate: 12,
    taxInclusive: false,
    paid: 0,
    status: "Unpaid",
    notes: "",
  },
  {
    id: "INV-2026-004",
    date: "2026-11-02",
    dueDate: "2026-11-05",
    guest: "Neha Singh",
    email: "neha@example.com",
    phone: "9898989898",
    booking: "BK-2026-104",
    room: "110",
    items: [
      { id: 1, description: "Suite Room - 2 Nights", quantity: 2, price: 8500 },
      { id: 2, description: "Laundry", quantity: 1, price: 600 },
    ],
    discount: 1000,
    taxRate: 12,
    taxInclusive: false,
    paid: 10000,
    status: "Partially Paid",
    notes: "",
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
  date: new Date().toISOString().slice(0, 10),
  dueDate: "",
  guest: "",
  email: "",
  phone: "",
  booking: "",
  room: "",
  items: [{ id: 1, description: "", quantity: 1, price: 0 }],
  discount: 0,
  taxRate: 12,
  taxInclusive: false,
  paid: 0,
  notes: "",
};

function calculateInvoice(invoice) {
  const subtotal = invoice.items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

  const discount = Math.min(
    Math.max(0, Number(invoice.discount || 0)),
    subtotal
  );

  const taxableAmount = Math.max(0, subtotal - discount);
  const taxRate = Number(invoice.taxRate || 0);

  const tax = invoice.taxInclusive
    ? taxableAmount - taxableAmount / (1 + taxRate / 100)
    : taxableAmount * taxRate / 100;

  const total = invoice.taxInclusive
    ? taxableAmount
    : taxableAmount + tax;

  const paid = Math.min(Math.max(0, Number(invoice.paid || 0)), total);
  const balance = Math.max(0, total - paid);

  return { subtotal, discount, taxableAmount, tax, total, paid, balance };
}

function getStatus(invoice) {
  const { total, paid, balance } = calculateInvoice(invoice);

  if (invoice.status === "Cancelled") return "Cancelled";
  if (balance <= 0) return "Paid";
  if (paid > 0) return "Partially Paid";

  if (invoice.dueDate && invoice.dueDate < new Date().toISOString().slice(0, 10)) {
    return "Overdue";
  }

  return "Unpaid";
}

function Badge({ status }) {
  const styles = {
    Paid: "bg-emerald-50 text-emerald-700",
    "Partially Paid": "bg-blue-50 text-blue-700",
    Unpaid: "bg-amber-50 text-amber-700",
    Overdue: "bg-red-50 text-red-700",
    Cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || styles.Unpaid}`}>
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

function Field({ label, children, required }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(initialInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const totals = useMemo(() => {
    return invoices.reduce(
      (result, invoice) => {
        const calc = calculateInvoice(invoice);
        if (invoice.status === "Cancelled") return result;

        result.total += calc.total;
        result.paid += calc.paid;
        result.balance += calc.balance;
        return result;
      },
      { total: 0, paid: 0, balance: 0 }
    );
  }, [invoices]);

  const filteredInvoices = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return invoices.filter((invoice) => {
      const status = getStatus(invoice);
      const searchText = search.toLowerCase();

      const matchesSearch =
        invoice.id.toLowerCase().includes(searchText) ||
        invoice.guest.toLowerCase().includes(searchText) ||
        invoice.booking.toLowerCase().includes(searchText) ||
        invoice.room.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "This Month" && invoice.date.slice(0, 7) === today.slice(0, 7)) ||
        (dateFilter === "Last 30 Days" &&
          new Date(invoice.date) >= new Date(Date.now() - 30 * 86400000));

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [invoices, search, statusFilter, dateFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
      items: [{ id: Date.now(), description: "", quantity: 1, price: 0 }],
    });
    setModal("form");
  };

  const openEdit = (invoice) => {
    setEditingId(invoice.id);
    setForm({
      ...invoice,
      items: invoice.items.map((item) => ({ ...item })),
    });
    setSelectedInvoice(null);
    setModal("form");
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateLine = (id, key, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item) =>
        item.id === id ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addLine = () => {
    setForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        { id: Date.now(), description: "", quantity: 1, price: 0 },
      ],
    }));
  };

  const removeLine = (id) => {
    setForm((previous) => ({
      ...previous,
      items:
        previous.items.length === 1
          ? previous.items
          : previous.items.filter((item) => item.id !== id),
    }));
  };

  const saveInvoice = (event) => {
    event.preventDefault();

    if (!form.items.length || form.items.some((item) => !item.description.trim())) {
      showMessage("Please enter a description for every invoice item.");
      return;
    }

    if (form.items.some((item) => Number(item.quantity) <= 0 || Number(item.price) < 0)) {
      showMessage("Please enter valid item quantities and prices.");
      return;
    }

    const calc = calculateInvoice(form);

    if (Number(form.paid) > calc.total) {
      showMessage("Paid amount cannot exceed the invoice total.");
      return;
    }

    const invoice = {
      ...form,
      id: editingId || `INV-2026-${String(Date.now()).slice(-6)}`,
      items: form.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
      })),
      discount: Number(form.discount || 0),
      taxRate: Number(form.taxRate || 0),
      paid: Number(form.paid || 0),
    };

    if (editingId) {
      setInvoices((previous) =>
        previous.map((item) => item.id === editingId ? invoice : item)
      );
      showMessage("Invoice updated successfully.");
    } else {
      setInvoices((previous) => [invoice, ...previous]);
      showMessage("Invoice created successfully.");
    }

    setModal("");
  };

  const cancelInvoice = (invoice) => {
    setInvoices((previous) =>
      previous.map((item) =>
        item.id === invoice.id
          ? { ...item, status: "Cancelled" }
          : item
      )
    );
    setSelectedInvoice(null);
    showMessage("Invoice cancelled.");
  };

  const deleteInvoice = () => {
    if (!deleteTarget) return;
    setInvoices((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
    showMessage("Invoice deleted.");
  };

  const recordPayment = (invoice) => {
    const balance = calculateInvoice(invoice).balance;
    if (balance <= 0) return;

    const amount = window.prompt(
      `Enter payment amount. Outstanding balance: ${money(balance)}`
    );

    if (amount === null) return;

    const value = Number(amount);
    if (!Number.isFinite(value) || value <= 0 || value > balance) {
      showMessage("Enter a valid payment amount not exceeding the balance.");
      return;
    }

    setInvoices((previous) =>
      previous.map((item) =>
        item.id === invoice.id
          ? { ...item, paid: Number(item.paid) + value }
          : item
      )
    );

    setSelectedInvoice(null);
    showMessage("Payment recorded in this demo.");
  };

  const exportCSV = () => {
    const headers = [
      "Invoice Number", "Date", "Due Date", "Guest",
      "Booking Reference", "Subtotal", "Discount",
      "Tax", "Total", "Paid", "Balance", "Status",
    ];

    const rows = filteredInvoices.map((invoice) => {
      const calc = calculateInvoice(invoice);
      return [
        invoice.id,
        invoice.date,
        invoice.dueDate,
        invoice.guest,
        invoice.booking,
        calc.subtotal,
        calc.discount,
        calc.tax,
        calc.total,
        calc.paid,
        calc.balance,
        getStatus(invoice),
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "hotel-invoices.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = (invoice) => {
    const calc = calculateInvoice(invoice);
    const rows = invoice.items.map((item) => `
      <tr>
        <td>${escapeHtml(item.description)}</td>
        <td>${item.quantity}</td>
        <td>${money(item.price)}</td>
        <td>${money(item.quantity * item.price)}</td>
      </tr>
    `).join("");

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${escapeHtml(invoice.id)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; color: #1e293b; }
          h1 { margin-bottom: 4px; }
          .muted { color: #64748b; font-size: 13px; }
          .row { display:flex; justify-content:space-between; gap:30px; margin:25px 0; }
          table { width:100%; border-collapse:collapse; margin-top:25px; }
          th,td { border-bottom:1px solid #e2e8f0; padding:12px; text-align:left; }
          th { background:#f8fafc; }
          .totals { width:300px; margin:25px 0 0 auto; }
          .totalrow { display:flex; justify-content:space-between; padding:7px 0; }
          .grand { border-top:2px solid #334155; font-weight:bold; font-size:18px; }
          .footer { margin-top:50px; text-align:center; color:#64748b; font-size:12px; }
        </style>
      </head>
      <body>
        <h1>HOTEL INVOICE</h1>
        <p class="muted">StayFlow Hotel Management</p>
        <div class="row">
          <div>
            <strong>Bill To</strong>
            <p>${escapeHtml(invoice.guest)}</p>
            <p>${escapeHtml(invoice.email)}</p>
            <p>${escapeHtml(invoice.phone)}</p>
          </div>
          <div>
            <strong>Invoice Details</strong>
            <p>Invoice: ${escapeHtml(invoice.id)}</p>
            <p>Date: ${escapeHtml(invoice.date)}</p>
            <p>Due: ${escapeHtml(invoice.dueDate || "-")}</p>
            <p>Booking: ${escapeHtml(invoice.booking)}</p>
            <p>Room: ${escapeHtml(invoice.room)}</p>
          </div>
        </div>
        <table>
          <thead><tr><th>Description</th><th>Qty</th><th>Rate</th><th>Amount</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        <div class="totals">
          <div class="totalrow"><span>Subtotal</span><span>${money(calc.subtotal)}</span></div>
          <div class="totalrow"><span>Discount</span><span>-${money(calc.discount)}</span></div>
          <div class="totalrow"><span>Tax (${invoice.taxRate}%)</span><span>${money(calc.tax)}</span></div>
          <div class="totalrow grand"><span>Total</span><span>${money(calc.total)}</span></div>
          <div class="totalrow"><span>Paid</span><span>${money(calc.paid)}</span></div>
          <div class="totalrow"><strong>Balance Due</strong><strong>${money(calc.balance)}</strong></div>
        </div>
        <p>${escapeHtml(invoice.notes || "")}</p>
        <div class="footer">Thank you for choosing us.</div>
        <script>window.onload = () => window.print();</script>
      </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      showMessage("Allow pop-ups to print or save the invoice as PDF.");
      return;
    }

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const downloadInvoice = (invoice) => {
    printInvoice(invoice);
  };

  const openDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setModal("details");
  };

  const invoiceStats = {
    count: invoices.filter((item) => item.status !== "Cancelled").length,
    paid: invoices.filter((item) => getStatus(item) === "Paid").length,
    unpaid: invoices.filter((item) => ["Unpaid", "Overdue"].includes(getStatus(item))).length,
    partial: invoices.filter((item) => getStatus(item) === "Partially Paid").length,
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <FileText size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
              <p className="mt-1 text-sm text-slate-500">
                Create invoices, manage balances and generate printable bills.
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
              <Plus size={17} /> Create Invoice
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
            title="Total Invoices"
            value={invoiceStats.count}
            subtitle="Active invoices"
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Paid Invoices"
            value={invoiceStats.paid}
            subtitle={money(totals.paid) + " collected"}
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Unpaid / Overdue"
            value={invoiceStats.unpaid}
            subtitle={money(totals.balance) + " outstanding"}
            icon={AlertCircle}
            color="red"
          />
          <StatCard
            title="Partially Paid"
            value={invoiceStats.partial}
            subtitle="Invoices with remaining balance"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Invoice Value</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-900">{money(totals.total)}</h3>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Amount Collected</p>
            <h3 className="mt-2 text-2xl font-bold text-emerald-600">{money(totals.paid)}</h3>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">Outstanding Balance</p>
            <h3 className="mt-2 text-2xl font-bold text-red-600">{money(totals.balance)}</h3>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search invoice, guest or booking..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="All">All Invoice Statuses</option>
              <option>Paid</option>
              <option>Partially Paid</option>
              <option>Unpaid</option>
              <option>Overdue</option>
              <option>Cancelled</option>
            </select>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={inputClass}>
              <option value="All">All Dates</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Showing {filteredInvoices.length} of {invoices.length} invoices</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setDateFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Invoice Records</h2>
            <p className="mt-1 text-xs text-slate-500">All generated guest invoices and payment balances.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Invoice</th>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Booking</th>
                  <th className="px-4 py-3">Invoice Date</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Paid</th>
                  <th className="px-4 py-3">Balance</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((invoice) => {
                  const calc = calculateInvoice(invoice);
                  const status = getStatus(invoice);

                  return (
                    <tr key={invoice.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-blue-600">{invoice.id}</p>
                        <p className="mt-1 text-xs text-slate-400">{invoice.room ? `Room ${invoice.room}` : ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{invoice.guest}</p>
                        <p className="mt-1 text-xs text-slate-400">{invoice.email}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{invoice.booking}</td>
                      <td className="px-4 py-3 text-slate-600">{invoice.date}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{money(calc.total)}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-600">{money(calc.paid)}</td>
                      <td className="px-4 py-3 font-semibold text-red-600">{money(calc.balance)}</td>
                      <td className="px-4 py-3"><Badge status={status} /></td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button title="View" onClick={() => openDetails(invoice)} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                            <Eye size={16} />
                          </button>
                          <button title="Print / PDF" onClick={() => downloadInvoice(invoice)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                            <Printer size={16} />
                          </button>
                          <button title="Edit" onClick={() => openEdit(invoice)} className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600">
                            <Pencil size={16} />
                          </button>
                          <button title="Delete" onClick={() => setDeleteTarget(invoice)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      <FileText size={32} className="mx-auto mb-2 text-slate-300" />
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Invoice Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Invoice" : "Create New Invoice"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Enter guest information and invoice charges.</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveInvoice} className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Guest & Booking Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Guest Name" required>
                      <input required value={form.guest} onChange={(e) => updateForm("guest", e.target.value)} className={inputClass} placeholder="Enter guest name" />
                    </Field>
                    <Field label="Email Address">
                      <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} className={inputClass} placeholder="guest@example.com" />
                    </Field>
                    <Field label="Phone Number">
                      <input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} className={inputClass} placeholder="Phone number" />
                    </Field>
                    <Field label="Booking Reference" required>
                      <input required value={form.booking} onChange={(e) => updateForm("booking", e.target.value)} className={inputClass} placeholder="BK-2026-001" />
                    </Field>
                    <Field label="Room Number">
                      <input value={form.room} onChange={(e) => updateForm("room", e.target.value)} className={inputClass} placeholder="Room number" />
                    </Field>
                    <Field label="Invoice Date" required>
                      <input type="date" required value={form.date} onChange={(e) => updateForm("date", e.target.value)} className={inputClass} />
                    </Field>
                    <Field label="Due Date">
                      <input type="date" value={form.dueDate} onChange={(e) => updateForm("dueDate", e.target.value)} className={inputClass} />
                    </Field>
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-800">Itemized Charges</h3>
                    <button type="button" onClick={addLine} className="flex items-center gap-1.5 rounded-lg border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                      <Plus size={15} /> Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.items.map((item, index) => (
                      <div key={item.id} className="grid grid-cols-1 items-end gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-12">
                        <div className="sm:col-span-6">
                          <Field label={`Description ${index + 1}`} required>
                            <input required value={item.description} onChange={(e) => updateLine(item.id, "description", e.target.value)} className={inputClass} placeholder="Room charges, food, laundry..." />
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Quantity">
                            <input type="number" min="1" required value={item.quantity} onChange={(e) => updateLine(item.id, "quantity", e.target.value)} className={inputClass} />
                          </Field>
                        </div>
                        <div className="sm:col-span-3">
                          <Field label="Unit Price (₹)">
                            <input type="number" min="0" step="0.01" required value={item.price} onChange={(e) => updateLine(item.id, "price", e.target.value)} className={inputClass} />
                          </Field>
                        </div>
                        <div className="flex items-center justify-between sm:col-span-1 sm:justify-end">
                          <span className="text-sm font-bold text-slate-800">{money(Number(item.quantity) * Number(item.price))}</span>
                          <button type="button" onClick={() => removeLine(item.id)} className="rounded-lg p-2 text-red-500 hover:bg-red-50">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-800">Tax & Discount</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Discount (₹)">
                        <input type="number" min="0" value={form.discount} onChange={(e) => updateForm("discount", e.target.value)} className={inputClass} />
                      </Field>
                      <Field label="Tax Rate (%)">
                        <input type="number" min="0" max="100" step="0.01" value={form.taxRate} onChange={(e) => updateForm("taxRate", e.target.value)} className={inputClass} />
                      </Field>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="checkbox" checked={form.taxInclusive} onChange={(e) => updateForm("taxInclusive", e.target.checked)} className="rounded border-slate-300" />
                      Tax is included in the item prices
                    </label>

                    <Field label="Notes / Terms">
                      <textarea rows={3} value={form.notes} onChange={(e) => updateForm("notes", e.target.value)} className={inputClass} placeholder="Payment instructions or additional notes..." />
                    </Field>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
                      <Calculator size={17} /> Invoice Summary
                    </h3>

                    {(() => {
                      const calc = calculateInvoice(form);
                      return (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span className="font-medium">{money(calc.subtotal)}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Discount</span><span className="font-medium text-red-600">-{money(calc.discount)}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Taxable Amount</span><span className="font-medium">{money(calc.taxableAmount)}</span></div>
                          <div className="flex justify-between"><span className="text-slate-500">Tax ({form.taxRate}%)</span><span className="font-medium">{money(calc.tax)}</span></div>
                          <div className="flex justify-between border-t border-slate-200 pt-3 text-base"><span className="font-semibold">Grand Total</span><span className="font-bold text-blue-700">{money(calc.total)}</span></div>
                          <Field label="Amount Already Paid (₹)">
                            <input type="number" min="0" step="0.01" value={form.paid} onChange={(e) => updateForm("paid", e.target.value)} className={inputClass} />
                          </Field>
                          <div className="flex justify-between text-sm"><span className="text-slate-500">Balance Due</span><span className="font-bold text-red-600">{money(calc.balance)}</span></div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button type="button" onClick={() => setModal("")} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700">Cancel</button>
                  <button type="submit" className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
                    <Save size={16} /> {editingId ? "Save Changes" : "Create Invoice"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Details */}
        {modal === "details" && selectedInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Invoice Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedInvoice.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button>
              </div>

              <div className="space-y-5 p-5">
                {(() => {
                  const calc = calculateInvoice(selectedInvoice);
                  return (
                    <>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{selectedInvoice.guest}</h3>
                          <p className="mt-1 text-sm text-slate-500">{selectedInvoice.email} · {selectedInvoice.phone}</p>
                          <p className="mt-1 text-sm text-slate-500">Booking: {selectedInvoice.booking} · Room: {selectedInvoice.room || "-"}</p>
                        </div>
                        <Badge status={getStatus(selectedInvoice)} />
                      </div>

                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-400">Invoice Date</p><p className="mt-1 font-semibold">{selectedInvoice.date}</p></div>
                        <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-400">Due Date</p><p className="mt-1 font-semibold">{selectedInvoice.dueDate || "-"}</p></div>
                        <div className="rounded-lg bg-slate-50 p-3"><p className="text-xs text-slate-400">Invoice Number</p><p className="mt-1 font-semibold">{selectedInvoice.id}</p></div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px] text-sm">
                          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                            <tr><th className="p-3 text-left">Description</th><th className="p-3 text-right">Qty</th><th className="p-3 text-right">Price</th><th className="p-3 text-right">Amount</th></tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedInvoice.items.map((item) => (
                              <tr key={item.id}>
                                <td className="p-3">{item.description}</td>
                                <td className="p-3 text-right">{item.quantity}</td>
                                <td className="p-3 text-right">{money(item.price)}</td>
                                <td className="p-3 text-right font-semibold">{money(item.quantity * item.price)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="ml-auto max-w-sm space-y-2 text-sm">
                        <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{money(calc.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Discount</span><span>-{money(calc.discount)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Tax ({selectedInvoice.taxRate}%)</span><span>{money(calc.tax)}</span></div>
                        <div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{money(calc.total)}</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Paid</span><span className="text-emerald-600">{money(calc.paid)}</span></div>
                        <div className="flex justify-between font-bold"><span>Balance Due</span><span className="text-red-600">{money(calc.balance)}</span></div>
                      </div>

                      {selectedInvoice.notes && (
                        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">{selectedInvoice.notes}</div>
                      )}

                      <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                        <button onClick={() => printInvoice(selectedInvoice)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><Printer size={15} /> Print / PDF</button>
                        <button onClick={() => openEdit(selectedInvoice)} className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"><Pencil size={15} /> Edit</button>
                        {calc.balance > 0 && selectedInvoice.status !== "Cancelled" && (
                          <button onClick={() => recordPayment(selectedInvoice)} className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"><IndianRupee size={15} /> Record Payment</button>
                        )}
                        {selectedInvoice.status !== "Cancelled" && (
                          <button onClick={() => cancelInvoice(selectedInvoice)} className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">Cancel Invoice</button>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600"><Trash2 size={22} /></div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Invoice?</h2>
              <p className="mt-2 text-sm text-slate-500">Are you sure you want to delete {deleteTarget.id}? This cannot be undone in this demo.</p>
              <div className="mt-5 flex justify-end gap-2">
                <button onClick={() => setDeleteTarget(null)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold">Cancel</button>
                <button onClick={deleteInvoice} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white">Delete</button>
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
