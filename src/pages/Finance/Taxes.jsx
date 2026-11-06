
import { useMemo, useState } from "react";
import {
  Plus, Search, Filter, Receipt, Percent, IndianRupee,
  Settings2, CalendarDays, CheckCircle2, Clock,
  Pencil, Trash2, Eye, X, Save, Download, FileText,
  ToggleLeft, ToggleRight, Info, BarChart3
} from "lucide-react";

const initialTaxes = [
  {
    id: "TAX-001",
    name: "GST - Accommodation",
    code: "GST-ROOM",
    type: "GST",
    rate: 12,
    calculation: "Percentage",
    appliesTo: "Room Charges",
    mode: "Exclusive",
    effectiveFrom: "2026-01-01",
    effectiveTo: "",
    status: "Active",
    description: "Sample accommodation tax configuration.",
  },
  {
    id: "TAX-002",
    name: "GST - Restaurant",
    code: "GST-FOOD",
    type: "GST",
    rate: 5,
    calculation: "Percentage",
    appliesTo: "Restaurant",
    mode: "Exclusive",
    effectiveFrom: "2026-01-01",
    effectiveTo: "",
    status: "Active",
    description: "Sample restaurant tax configuration.",
  },
  {
    id: "TAX-003",
    name: "Service Charge",
    code: "SERVICE",
    type: "Service Charge",
    rate: 5,
    calculation: "Percentage",
    appliesTo: "All Services",
    mode: "Exclusive",
    effectiveFrom: "2026-01-01",
    effectiveTo: "",
    status: "Active",
    description: "Optional service charge configuration.",
  },
  {
    id: "TAX-004",
    name: "Laundry Service Fee",
    code: "LAUNDRY",
    type: "Additional Fee",
    rate: 150,
    calculation: "Fixed Amount",
    appliesTo: "Laundry",
    mode: "Exclusive",
    effectiveFrom: "2026-01-01",
    effectiveTo: "",
    status: "Inactive",
    description: "Sample fixed laundry fee.",
  },
];

const types = ["GST", "Service Charge", "Additional Fee", "Other Tax"];
const appliesOptions = [
  "Room Charges",
  "Restaurant",
  "Food & Beverage",
  "Laundry",
  "Spa & Wellness",
  "All Services",
  "Other",
];
const modes = ["Exclusive", "Inclusive"];
const statuses = ["Active", "Inactive"];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const emptyForm = {
  name: "",
  code: "",
  type: "GST",
  rate: "",
  calculation: "Percentage",
  appliesTo: "Room Charges",
  mode: "Exclusive",
  effectiveFrom: new Date().toISOString().slice(0, 10),
  effectiveTo: "",
  status: "Active",
  description: "",
};

function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
      status === "Active"
        ? "bg-emerald-50 text-emerald-700"
        : "bg-slate-100 text-slate-600"
    }`}>
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600",
    amber: "bg-amber-50 text-amber-600",
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

export default function Taxes() {
  const [taxes, setTaxes] = useState(initialTaxes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedTax, setSelectedTax] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState("");

  const [testAmount, setTestAmount] = useState("1000");
  const [testTaxId, setTestTaxId] = useState("TAX-001");

  const stats = useMemo(() => ({
    total: taxes.length,
    active: taxes.filter((tax) => tax.status === "Active").length,
    gst: taxes.filter((tax) => tax.type === "GST" && tax.status === "Active").length,
    inactive: taxes.filter((tax) => tax.status === "Inactive").length,
  }), [taxes]);

  const filteredTaxes = useMemo(() => {
    const query = search.toLowerCase();

    return taxes.filter((tax) => {
      const matchesSearch =
        tax.name.toLowerCase().includes(query) ||
        tax.code.toLowerCase().includes(query) ||
        tax.appliesTo.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || tax.status === statusFilter;

      const matchesType =
        typeFilter === "All" || tax.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [taxes, search, statusFilter, typeFilter]);

  const testTax = taxes.find((tax) => tax.id === testTaxId);
  const baseAmount = Math.max(0, Number(testAmount) || 0);

  const testCalculation = useMemo(() => {
    if (!testTax) {
      return { taxAmount: 0, total: baseAmount, base: baseAmount };
    }

    const rate = Number(testTax.rate) || 0;

    if (testTax.calculation === "Fixed Amount") {
      return {
        base: baseAmount,
        taxAmount: rate,
        total: baseAmount + rate,
      };
    }

    if (testTax.mode === "Inclusive") {
      const base = baseAmount / (1 + rate / 100);
      const taxAmount = baseAmount - base;

      return {
        base,
        taxAmount,
        total: baseAmount,
      };
    }

    const taxAmount = baseAmount * rate / 100;

    return {
      base: baseAmount,
      taxAmount,
      total: baseAmount + taxAmount,
    };
  }, [testTax, baseAmount]);

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
      effectiveFrom: new Date().toISOString().slice(0, 10),
    });
    setModal("form");
  };

  const openEdit = (tax) => {
    setEditingId(tax.id);
    setForm({
      name: tax.name,
      code: tax.code,
      type: tax.type,
      rate: tax.rate,
      calculation: tax.calculation,
      appliesTo: tax.appliesTo,
      mode: tax.mode,
      effectiveFrom: tax.effectiveFrom,
      effectiveTo: tax.effectiveTo || "",
      status: tax.status,
      description: tax.description || "",
    });
    setSelectedTax(null);
    setModal("form");
  };

  const saveTax = (event) => {
    event.preventDefault();

    const rate = Number(form.rate);

    if (!form.name.trim() || !form.code.trim()) {
      showMessage("Tax name and code are required.");
      return;
    }

    if (!Number.isFinite(rate) || rate < 0) {
      showMessage("Enter a valid tax rate or fee.");
      return;
    }

    if (
      form.effectiveTo &&
      form.effectiveTo < form.effectiveFrom
    ) {
      showMessage("Effective end date cannot be before start date.");
      return;
    }

    const duplicateCode = taxes.some(
      (tax) =>
        tax.code.toLowerCase() === form.code.trim().toLowerCase() &&
        tax.id !== editingId
    );

    if (duplicateCode) {
      showMessage("This tax code already exists.");
      return;
    }

    const record = {
      ...form,
      id: editingId || `TAX-${String(Date.now()).slice(-6)}`,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      rate,
    };

    if (editingId) {
      setTaxes((previous) =>
        previous.map((tax) => tax.id === editingId ? record : tax)
      );
      showMessage("Tax configuration updated.");
    } else {
      setTaxes((previous) => [record, ...previous]);
      showMessage("Tax configuration created.");
    }

    setModal("");
  };

  const deleteTax = () => {
    if (!deleteTarget) return;

    setTaxes((previous) =>
      previous.filter((tax) => tax.id !== deleteTarget.id)
    );

    if (testTaxId === deleteTarget.id) {
      setTestTaxId("");
    }

    setDeleteTarget(null);
    showMessage("Tax configuration deleted.");
  };

  const toggleStatus = (tax) => {
    const nextStatus = tax.status === "Active" ? "Inactive" : "Active";

    setTaxes((previous) =>
      previous.map((item) =>
        item.id === tax.id ? { ...item, status: nextStatus } : item
      )
    );

    setSelectedTax((previous) =>
      previous?.id === tax.id
        ? { ...previous, status: nextStatus }
        : previous
    );

    showMessage(`${tax.name} is now ${nextStatus.toLowerCase()}.`);
  };

  const exportCSV = () => {
    const headers = [
      "Tax ID", "Name", "Code", "Type", "Rate",
      "Calculation", "Applies To", "Mode",
      "Effective From", "Effective To", "Status",
    ];

    const rows = filteredTaxes.map((tax) => [
      tax.id,
      tax.name,
      tax.code,
      tax.type,
      tax.rate,
      tax.calculation,
      tax.appliesTo,
      tax.mode,
      tax.effectiveFrom,
      tax.effectiveTo,
      tax.status,
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
    link.download = "stayflow-tax-configurations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const rows = filteredTaxes.map((tax) => `
      <tr>
        <td>${escapeHtml(tax.name)}</td>
        <td>${escapeHtml(tax.code)}</td>
        <td>${escapeHtml(tax.type)}</td>
        <td>${escapeHtml(tax.rate)}${tax.calculation === "Percentage" ? "%" : " INR"}</td>
        <td>${escapeHtml(tax.appliesTo)}</td>
        <td>${escapeHtml(tax.mode)}</td>
        <td>${escapeHtml(tax.status)}</td>
      </tr>
    `).join("");

    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      showMessage("Please allow pop-ups to print the report.");
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Tax Configuration Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #1e293b; }
            h1 { margin-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 24px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background: #f1f5f9; }
          </style>
        </head>
        <body>
          <h1>StayFlow - Tax Configuration Report</h1>
          <p>Generated on ${new Date().toLocaleDateString("en-IN")}</p>
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Code</th><th>Type</th><th>Rate</th>
                <th>Applies To</th><th>Mode</th><th>Status</th>
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

  const rateLabel = (tax) =>
    tax.calculation === "Percentage"
      ? `${tax.rate}%`
      : money(tax.rate);

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Receipt size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Taxes & Charges</h1>
              <p className="mt-1 text-sm text-slate-500">
                Configure GST, service charges and additional hotel fees.
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
              <FileText size={16} /> Print Report
            </button>
            <button
              onClick={openCreate}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} /> Add Tax / Charge
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}><X size={17} /></button>
          </div>
        )}

        {/* Important tax warning */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <Info size={21} className="mt-0.5 shrink-0 text-amber-600" />
          <div>
            <h3 className="font-semibold text-amber-900">Tax configuration notice</h3>
            <p className="mt-1 text-sm leading-6 text-amber-800">
              The included tax rates are sample values for frontend demonstration only.
              GST applicability and rates depend on the actual service, classification
              and applicable regulations. Verify every configuration with a qualified
              tax professional before using it for real invoices or financial reporting.
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Configurations"
            value={stats.total}
            subtitle="All tax and charge rules"
            icon={Settings2}
            color="blue"
          />
          <StatCard
            title="Active Configurations"
            value={stats.active}
            subtitle="Currently enabled rules"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Active GST Rules"
            value={stats.gst}
            subtitle="GST configuration records"
            icon={Percent}
            color="purple"
          />
          <StatCard
            title="Inactive Rules"
            value={stats.inactive}
            subtitle="Disabled configurations"
            icon={Clock}
            color="amber"
          />
        </div>

        {/* Tax Calculator */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center gap-2">
            <IndianRupee size={20} className="text-blue-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Tax Calculator Preview</h2>
              <p className="mt-1 text-xs text-slate-500">
                Test how a configured rule calculates tax on a sample amount.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Base / Inclusive Amount">
              <input
                type="number"
                min="0"
                step="0.01"
                value={testAmount}
                onChange={(e) => setTestAmount(e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Tax Configuration">
              <select
                value={testTaxId}
                onChange={(e) => setTestTaxId(e.target.value)}
                className={inputClass}
              >
                <option value="">Select a rule</option>
                {taxes.map((tax) => (
                  <option key={tax.id} value={tax.id}>
                    {tax.name} ({rateLabel(tax)})
                  </option>
                ))}
              </select>
            </Field>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Calculated Total</p>
              <h3 className="mt-1 text-2xl font-bold text-slate-900">
                {money(testCalculation.total)}
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                Tax amount: {money(testCalculation.taxAmount)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-400">Taxable Base</p>
              <p className="mt-1 font-semibold text-slate-800">
                {money(testCalculation.base)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tax / Fee</p>
              <p className="mt-1 font-semibold text-slate-800">
                {money(testCalculation.taxAmount)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Final Amount</p>
              <p className="mt-1 font-semibold text-emerald-700">
                {money(testCalculation.total)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Calculator preview only. It does not update existing invoices or payments.
          </p>
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
                placeholder="Search tax name or code..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Types</option>
              {types.map((type) => <option key={type}>{type}</option>)}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              {statuses.map((status) => <option key={status}>{status}</option>)}
            </select>
          </div>

          <div className="mt-3 flex justify-between text-xs text-slate-500">
            <span>{filteredTaxes.length} of {taxes.length} configurations</span>
            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="font-semibold text-blue-600"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Configuration table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <h2 className="font-semibold text-slate-900">Tax & Charge Configurations</h2>
            <p className="mt-1 text-xs text-slate-500">
              Manage applicable rates, effective dates and activation status.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Configuration</th>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Rate / Fee</th>
                  <th className="px-4 py-3">Applies To</th>
                  <th className="px-4 py-3">Calculation Mode</th>
                  <th className="px-4 py-3">Effective From</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTaxes.map((tax) => (
                  <tr key={tax.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{tax.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{tax.id}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-blue-600">{tax.code}</td>
                    <td className="px-4 py-3 text-slate-600">{tax.type}</td>
                    <td className="px-4 py-3 font-bold text-slate-900">{rateLabel(tax)}</td>
                    <td className="px-4 py-3 text-slate-600">{tax.appliesTo}</td>
                    <td className="px-4 py-3 text-slate-600">{tax.mode}</td>
                    <td className="px-4 py-3 text-slate-600">{tax.effectiveFrom}</td>
                    <td className="px-4 py-3"><StatusBadge status={tax.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details"
                          onClick={() => {
                            setSelectedTax(tax);
                            setModal("details");
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit configuration"
                          onClick={() => openEdit(tax)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Delete configuration"
                          onClick={() => setDeleteTarget(tax)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTaxes.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                      <Receipt size={32} className="mx-auto mb-2 text-slate-300" />
                      No tax configurations found.
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
                    {editingId ? "Edit Tax Configuration" : "Add Tax / Charge"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Configure the rate, calculation method and applicable service.
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveTax} className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Tax / Charge Name" required>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. GST - Accommodation"
                    />
                  </Field>

                  <Field label="Unique Code" required>
                    <input
                      required
                      value={form.code}
                      onChange={(e) => updateForm("code", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. GST-ROOM"
                    />
                  </Field>

                  <Field label="Configuration Type" required>
                    <select
                      value={form.type}
                      onChange={(e) => updateForm("type", e.target.value)}
                      className={inputClass}
                    >
                      {types.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </Field>

                  <Field label="Calculation Method" required>
                    <select
                      value={form.calculation}
                      onChange={(e) => updateForm("calculation", e.target.value)}
                      className={inputClass}
                    >
                      <option>Percentage</option>
                      <option>Fixed Amount</option>
                    </select>
                  </Field>

                  <Field
                    label={form.calculation === "Percentage" ? "Rate (%)" : "Fixed Amount (₹)"}
                    required
                  >
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.rate}
                      onChange={(e) => updateForm("rate", e.target.value)}
                      className={inputClass}
                      placeholder="Enter rate or amount"
                    />
                  </Field>

                  <Field label="Applies To" required>
                    <select
                      value={form.appliesTo}
                      onChange={(e) => updateForm("appliesTo", e.target.value)}
                      className={inputClass}
                    >
                      {appliesOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </Field>

                  <Field label="Tax Inclusion / Exclusion" required>
                    <select
                      value={form.mode}
                      onChange={(e) => updateForm("mode", e.target.value)}
                      className={inputClass}
                    >
                      {modes.map((mode) => <option key={mode}>{mode}</option>)}
                    </select>
                  </Field>

                  <Field label="Status" required>
                    <select
                      value={form.status}
                      onChange={(e) => updateForm("status", e.target.value)}
                      className={inputClass}
                    >
                      {statuses.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </Field>

                  <Field label="Effective From" required>
                    <input
                      type="date"
                      required
                      value={form.effectiveFrom}
                      onChange={(e) => updateForm("effectiveFrom", e.target.value)}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Effective Until">
                    <input
                      type="date"
                      min={form.effectiveFrom}
                      value={form.effectiveTo}
                      onChange={(e) => updateForm("effectiveTo", e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>

                <Field label="Description / Notes">
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    className={inputClass}
                    placeholder="Describe when this tax or charge applies..."
                  />
                </Field>

                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  Confirm the tax classification and applicable rate before activating this rule.
                </div>

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
                    {editingId ? "Save Changes" : "Create Configuration"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {modal === "details" && selectedTax && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Configuration Details</h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedTax.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-sm text-slate-500">{selectedTax.name}</p>
                    <h3 className="mt-1 text-3xl font-bold text-slate-900">
                      {rateLabel(selectedTax)}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedTax.calculation} · {selectedTax.mode}
                    </p>
                  </div>
                  <StatusBadge status={selectedTax.status} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["Code", selectedTax.code],
                    ["Type", selectedTax.type],
                    ["Applies To", selectedTax.appliesTo],
                    ["Calculation", selectedTax.calculation],
                    ["Mode", selectedTax.mode],
                    ["Effective From", selectedTax.effectiveFrom],
                    ["Effective Until", selectedTax.effectiveTo || "No end date"],
                    ["Status", selectedTax.status],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-slate-200 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedTax.description && (
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-xs text-slate-400">Description</p>
                    <p className="mt-1 text-sm text-slate-700">{selectedTax.description}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => toggleStatus(selectedTax)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                  >
                    {selectedTax.status === "Active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => openEdit(selectedTax)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    <Pencil size={15} /> Edit Configuration
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
              <h2 className="mt-4 text-lg font-bold text-slate-900">Delete Configuration?</h2>
              <p className="mt-2 text-sm text-slate-500">
                Delete {deleteTarget.name}? This cannot be undone in this frontend demo.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteTax}
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
