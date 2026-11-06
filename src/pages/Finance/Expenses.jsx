
import { useMemo, useState } from "react";
import {
  Plus, Search, Filter, Wallet, IndianRupee, TrendingDown,
  Clock, CheckCircle2, XCircle, Eye, Pencil, Trash2,
  X, Download, Paperclip, Receipt, Building2, CalendarDays,
  Save, FileText, BarChart3, CreditCard, Banknote
} from "lucide-react";

const initialExpenses = [
  {
    id: "EXP-2026-001",
    title: "Electricity Bill",
    category: "Utilities",
    amount: 12500,
    date: "2026-11-05",
    vendor: "Haryana Electricity Board",
    paymentMethod: "Bank Transfer",
    department: "Administration",
    status: "Paid",
    receiptName: "electricity-november.pdf",
    notes: "Monthly electricity bill.",
  },
  {
    id: "EXP-2026-002",
    title: "Housekeeping Supplies",
    category: "Supplies",
    amount: 4800,
    date: "2026-11-04",
    vendor: "CleanPro Suppliers",
    paymentMethod: "UPI",
    department: "Housekeeping",
    status: "Approved",
    receiptName: "cleaning-supplies.jpg",
    notes: "Cleaning liquids and toiletries.",
  },
  {
    id: "EXP-2026-003",
    title: "Staff Meals",
    category: "Food & Beverage",
    amount: 6500,
    date: "2026-11-03",
    vendor: "Fresh Foods",
    paymentMethod: "Cash",
    department: "Kitchen",
    status: "Pending",
    receiptName: "",
    notes: "Staff meal supplies.",
  },
  {
    id: "EXP-2026-004",
    title: "AC Maintenance",
    category: "Maintenance",
    amount: 8500,
    date: "2026-11-02",
    vendor: "CoolTech Services",
    paymentMethod: "Bank Transfer",
    department: "Maintenance",
    status: "Paid",
    receiptName: "ac-service-invoice.pdf",
    notes: "Routine AC servicing.",
  },
  {
    id: "EXP-2026-005",
    title: "Marketing Campaign",
    category: "Marketing",
    amount: 15000,
    date: "2026-11-01",
    vendor: "Digital Growth Agency",
    paymentMethod: "Credit Card",
    department: "Marketing",
    status: "Rejected",
    receiptName: "",
    notes: "Campaign budget requires revision.",
  },
];

const categories = [
  "Utilities",
  "Supplies",
  "Maintenance",
  "Food & Beverage",
  "Salaries",
  "Marketing",
  "Housekeeping",
  "Transportation",
  "Rent",
  "Insurance",
  "Administration",
  "Other",
];

const departments = [
  "Administration",
  "Front Office",
  "Housekeeping",
  "Kitchen",
  "Restaurant",
  "Maintenance",
  "Marketing",
  "Security",
  "Management",
];

const paymentMethods = [
  "Cash",
  "UPI",
  "Credit Card",
  "Debit Card",
  "Bank Transfer",
  "Cheque",
];

const statuses = ["Pending", "Approved", "Rejected", "Paid"];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  title: "",
  category: "Utilities",
  amount: "",
  date: new Date().toISOString().slice(0, 10),
  vendor: "",
  paymentMethod: "Bank Transfer",
  department: "Administration",
  status: "Pending",
  receiptName: "",
  notes: "",
};

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    Rejected: "bg-red-50 text-red-700",
    Paid: "bg-emerald-50 text-emerald-700",
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

export default function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [receiptFile, setReceiptFile] = useState(null);
  const [notification, setNotification] = useState("");

  const [reportCategory, setReportCategory] = useState("All");
  const [reportDepartment, setReportDepartment] = useState("All");

  const stats = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthExpenses = expenses.filter(
      (expense) => expense.date.slice(0, 7) === currentMonth
    );

    return {
      total: expenses.reduce((sum, item) => sum + item.amount, 0),
      month: monthExpenses.reduce((sum, item) => sum + item.amount, 0),
      pending: expenses
        .filter((item) => item.status === "Pending")
        .reduce((sum, item) => sum + item.amount, 0),
      paid: expenses
        .filter((item) => item.status === "Paid")
        .reduce((sum, item) => sum + item.amount, 0),
      count: expenses.length,
    };
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    const now = new Date();
    const query = search.toLowerCase();

    return expenses.filter((expense) => {
      const matchesSearch =
        expense.id.toLowerCase().includes(query) ||
        expense.title.toLowerCase().includes(query) ||
        expense.vendor.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || expense.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || expense.category === categoryFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        expense.department === departmentFilter;

      const expenseDate = new Date(`${expense.date}T00:00:00`);

      const matchesDate =
        dateFilter === "All" ||
        (dateFilter === "This Month" &&
          expense.date.slice(0, 7) === now.toISOString().slice(0, 7)) ||
        (dateFilter === "Last 30 Days" &&
          expenseDate >= new Date(now.getTime() - 30 * 86400000));

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesDepartment &&
        matchesDate
      );
    });
  }, [
    expenses,
    search,
    statusFilter,
    categoryFilter,
    departmentFilter,
    dateFilter,
  ]);

  const reportExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      return (
        (reportCategory === "All" || expense.category === reportCategory) &&
        (reportDepartment === "All" ||
          expense.department === reportDepartment)
      );
    });
  }, [expenses, reportCategory, reportDepartment]);

  const reportTotal = reportExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const categoryReport = useMemo(() => {
    const grouped = {};

    reportExpenses.forEach((expense) => {
      grouped[expense.category] =
        (grouped[expense.category] || 0) + expense.amount;
    });

    return Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [reportExpenses]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const updateForm = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setReceiptFile(null);
    setModal("form");
  };

  const openEdit = (expense) => {
    setEditingId(expense.id);
    setForm({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      date: expense.date,
      vendor: expense.vendor,
      paymentMethod: expense.paymentMethod,
      department: expense.department,
      status: expense.status,
      receiptName: expense.receiptName || "",
      notes: expense.notes || "",
    });
    setReceiptFile(null);
    setSelectedExpense(null);
    setModal("form");
  };

  const saveExpense = (event) => {
    event.preventDefault();

    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Enter a valid expense amount.");
      return;
    }

    if (!form.title.trim() || !form.vendor.trim()) {
      showMessage("Expense title and vendor are required.");
      return;
    }

    const existing = expenses.find((item) => item.id === editingId);

    const expense = {
      ...form,
      id: editingId || `EXP-2026-${String(Date.now()).slice(-6)}`,
      amount,
      receiptName: receiptFile
        ? receiptFile.name
        : form.receiptName,
      receiptFile: receiptFile || existing?.receiptFile || null,
    };

    if (editingId) {
      setExpenses((previous) =>
        previous.map((item) =>
          item.id === editingId ? expense : item
        )
      );
      showMessage("Expense updated successfully.");
    } else {
      setExpenses((previous) => [expense, ...previous]);
      showMessage("Expense created successfully.");
    }

    setModal("");
    setReceiptFile(null);
  };

  const deleteExpense = () => {
    if (!deleteTarget) return;

    setExpenses((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Expense deleted.");
  };

  const updateStatus = (expense, status) => {
    setExpenses((previous) =>
      previous.map((item) =>
        item.id === expense.id ? { ...item, status } : item
      )
    );

    setSelectedExpense((previous) =>
      previous?.id === expense.id
        ? { ...previous, status }
        : previous
    );

    showMessage(`Expense marked as ${status}.`);
  };

  const exportCSV = (items = filteredExpenses, filename = "hotel-expenses.csv") => {
    const headers = [
      "Expense ID",
      "Title",
      "Category",
      "Amount",
      "Date",
      "Vendor",
      "Payment Method",
      "Department",
      "Status",
      "Receipt",
      "Notes",
    ];

    const rows = items.map((expense) => [
      expense.id,
      expense.title,
      expense.category,
      expense.amount,
      expense.date,
      expense.vendor,
      expense.paymentMethod,
      expense.department,
      expense.status,
      expense.receiptName,
      expense.notes,
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
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printExpense = (expense) => {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Expense ${escapeHtml(expense.id)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 35px; max-width: 650px; margin: auto; color: #1e293b; }
          h1 { text-align: center; }
          .muted { color: #64748b; font-size: 13px; text-align: center; }
          .line { border-top: 1px dashed #94a3b8; margin: 22px 0; }
          .row { display:flex; justify-content:space-between; gap:20px; padding:9px 0; }
          .amount { font-size:25px; font-weight:bold; }
        </style>
      </head>
      <body>
        <h1>STAYFLOW HOTEL</h1>
        <p class="muted">EXPENSE RECORD</p>
        <div class="line"></div>
        <div class="row"><span>Expense ID</span><strong>${escapeHtml(expense.id)}</strong></div>
        <div class="row"><span>Expense Title</span><strong>${escapeHtml(expense.title)}</strong></div>
        <div class="row"><span>Category</span><strong>${escapeHtml(expense.category)}</strong></div>
        <div class="row"><span>Vendor</span><strong>${escapeHtml(expense.vendor)}</strong></div>
        <div class="row"><span>Department</span><strong>${escapeHtml(expense.department)}</strong></div>
        <div class="row"><span>Date</span><strong>${escapeHtml(expense.date)}</strong></div>
        <div class="row"><span>Payment Method</span><strong>${escapeHtml(expense.paymentMethod)}</strong></div>
        <div class="line"></div>
        <div class="row"><span>Expense Amount</span><strong class="amount">${money(expense.amount)}</strong></div>
        <div class="row"><span>Status</span><strong>${escapeHtml(expense.status)}</strong></div>
        <div class="row"><span>Receipt</span><strong>${escapeHtml(expense.receiptName || "Not attached")}</strong></div>
        <div class="line"></div>
        <p>${escapeHtml(expense.notes || "No additional notes.")}</p>
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
    printWindow.onload = () => printWindow.print();
  };

  const downloadReceipt = (expense) => {
    if (!expense.receiptFile) {
      showMessage("The original receipt file is not available in this session.");
      return;
    }

    const url = URL.createObjectURL(expense.receiptFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = expense.receiptName || "expense-receipt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <Wallet size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Expenses</h1>
              <p className="mt-1 text-sm text-slate-500">
                Track hotel expenses, vendors, approvals and departmental spending.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => exportCSV()}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Export CSV
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} /> Add Expense
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}><X size={17} /></button>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Expenses"
            value={money(stats.total)}
            subtitle={`${stats.count} recorded expenses`}
            icon={TrendingDown}
            color="blue"
          />
          <StatCard
            title="This Month"
            value={money(stats.month)}
            subtitle="Expenses recorded this month"
            icon={CalendarDays}
            color="purple"
          />
          <StatCard
            title="Pending Approval"
            value={money(stats.pending)}
            subtitle="Awaiting approval"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Total Paid"
            value={money(stats.paid)}
            subtitle="Expenses marked as paid"
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Departmental and category reports */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="font-semibold text-slate-900">Expense Breakdown</h2>
                <p className="mt-1 text-xs text-slate-500">Spending by category</p>
              </div>
              <BarChart3 size={20} className="text-slate-400" />
            </div>

            {categoryReport.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">No expense data available.</p>
            ) : (
              <div className="space-y-4">
                {categoryReport.slice(0, 6).map((item) => {
                  const percentage = reportTotal
                    ? (item.amount / reportTotal) * 100
                    : 0;

                  return (
                    <div key={item.name}>
                      <div className="mb-1.5 flex justify-between gap-3 text-sm">
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <span className="font-semibold text-slate-900">{money(item.amount)}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <p className="mt-1 text-right text-xs text-slate-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-4">
              <h2 className="font-semibold text-slate-900">Expense Report</h2>
              <p className="mt-1 text-xs text-slate-500">
                Filter spending by category and department.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <select
                value={reportCategory}
                onChange={(e) => setReportCategory(e.target.value)}
                className={inputClass}
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <select
                value={reportDepartment}
                onChange={(e) => setReportDepartment(e.target.value)}
                className={inputClass}
              >
                <option value="All">All Departments</option>
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Filtered Expense Total</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {money(reportTotal)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {reportExpenses.length} matching expense records
              </p>
            </div>

            <button
              onClick={() => exportCSV(reportExpenses, "expense-report.csv")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Download Filtered Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search expense or vendor..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={inputClass}>
              <option value="All">All Statuses</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>

            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className={inputClass}>
              <option value="All">All Categories</option>
              {categories.map((category) => <option key={category}>{category}</option>)}
            </select>

            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className={inputClass}>
              <option value="All">All Departments</option>
              {departments.map((department) => <option key={department}>{department}</option>)}
            </select>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className={inputClass}>
              <option value="All">All Dates</option>
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>Showing {filteredExpenses.length} of {expenses.length} expenses</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setCategoryFilter("All");
                setDepartmentFilter("All");
                setDateFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Expense table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Expense Records</h2>
            <p className="mt-1 text-xs text-slate-500">
              Review and manage hotel expenditure.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Expense ID</th>
                  <th className="px-4 py-3">Expense</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Vendor</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-blue-600">{expense.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{expense.title}</p>
                      <p className="mt-1 text-xs text-slate-400">{expense.paymentMethod}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{expense.category}</td>
                    <td className="px-4 py-3 text-slate-600">{expense.vendor}</td>
                    <td className="px-4 py-3 text-slate-600">{expense.department}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{money(expense.amount)}</td>
                    <td className="px-4 py-3 text-slate-600">{expense.date}</td>
                    <td className="px-4 py-3"><StatusBadge status={expense.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details"
                          onClick={() => {
                            setSelectedExpense(expense);
                            setModal("details");
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit expense"
                          onClick={() => openEdit(expense)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete expense"
                          onClick={() => setDeleteTarget(expense)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredExpenses.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      <Wallet size={32} className="mx-auto mb-2 text-slate-300" />
                      No expense records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create/Edit Expense Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editingId ? "Edit Expense" : "Add New Expense"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter expense, vendor and payment information.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveExpense} className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Expense Information</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Expense Title" required>
                      <input required value={form.title} onChange={(e) => updateForm("title", e.target.value)} className={inputClass} placeholder="e.g. Electricity Bill" />
                    </Field>

                    <Field label="Category" required>
                      <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} className={inputClass}>
                        {categories.map((category) => <option key={category}>{category}</option>)}
                      </select>
                    </Field>

                    <Field label="Amount (₹)" required>
                      <input type="number" required min="0.01" step="0.01" value={form.amount} onChange={(e) => updateForm("amount", e.target.value)} className={inputClass} placeholder="Enter amount" />
                    </Field>

                    <Field label="Expense Date" required>
                      <input type="date" required value={form.date} onChange={(e) => updateForm("date", e.target.value)} className={inputClass} />
                    </Field>

                    <Field label="Vendor / Payee" required>
                      <input required value={form.vendor} onChange={(e) => updateForm("vendor", e.target.value)} className={inputClass} placeholder="Vendor or supplier name" />
                    </Field>

                    <Field label="Department" required>
                      <select value={form.department} onChange={(e) => updateForm("department", e.target.value)} className={inputClass}>
                        {departments.map((department) => <option key={department}>{department}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Payment & Approval</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Payment Method" required>
                      <select value={form.paymentMethod} onChange={(e) => updateForm("paymentMethod", e.target.value)} className={inputClass}>
                        {paymentMethods.map((method) => <option key={method}>{method}</option>)}
                      </select>
                    </Field>

                    <Field label="Approval Status" required>
                      <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} className={inputClass}>
                        {statuses.map((status) => <option key={status}>{status}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>

                <Field label="Receipt Attachment">
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700"
                    />
                    {(receiptFile || form.receiptName) && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                        <Paperclip size={16} />
                        {receiptFile?.name || form.receiptName}
                        <button
                          type="button"
                          onClick={() => {
                            setReceiptFile(null);
                            updateForm("receiptName", "");
                          }}
                          className="ml-auto text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    <p className="mt-2 text-xs text-slate-400">
                      PDF, JPG, PNG or WEBP. File is held in this browser session only.
                    </p>
                  </div>
                </Field>

                <Field label="Additional Notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) => updateForm("notes", e.target.value)}
                    className={inputClass}
                    placeholder="Add expense description or notes..."
                  />
                </Field>

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
                    <Save size={16} /> {editingId ? "Save Changes" : "Add Expense"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Expense Details Modal */}
        {modal === "details" && selectedExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Expense Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedExpense.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-500">Expense Amount</p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">
                      {money(selectedExpense.amount)}
                    </h3>
                  </div>
                  <StatusBadge status={selectedExpense.status} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["Title", selectedExpense.title],
                    ["Category", selectedExpense.category],
                    ["Vendor", selectedExpense.vendor],
                    ["Department", selectedExpense.department],
                    ["Date", selectedExpense.date],
                    ["Payment Method", selectedExpense.paymentMethod],
                    ["Expense ID", selectedExpense.id],
                    ["Receipt", selectedExpense.receiptName || "No receipt attached"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedExpense.notes && (
                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="font-semibold text-slate-800">Notes</h3>
                    <p className="mt-2 text-sm text-slate-600">{selectedExpense.notes}</p>
                  </div>
                )}

                {selectedExpense.receiptName && (
                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <FileText size={20} className="shrink-0 text-blue-600" />
                      <span className="truncate text-sm font-medium text-slate-700">
                        {selectedExpense.receiptName}
                      </span>
                    </div>
                    <button
                      onClick={() => downloadReceipt(selectedExpense)}
                      className="text-sm font-semibold text-blue-600"
                    >
                      Download
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => printExpense(selectedExpense)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Receipt size={15} /> Print Record
                  </button>

                  <button
                    onClick={() => openEdit(selectedExpense)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Pencil size={15} /> Edit
                  </button>

                  {selectedExpense.status === "Pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(selectedExpense, "Rejected")}
                        className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => updateStatus(selectedExpense, "Approved")}
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
                      >
                        Approve
                      </button>
                    </>
                  )}

                  {selectedExpense.status === "Approved" && (
                    <button
                      onClick={() => updateStatus(selectedExpense, "Paid")}
                      className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                    >
                      Mark as Paid
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
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Expense?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete {deleteTarget.id}? This cannot be undone in this demo.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteExpense}
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
