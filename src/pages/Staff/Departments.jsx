
import { useMemo, useState } from "react";
import {
  Plus, Search, Building2, Users, UserRound, Pencil, Trash2,
  Eye, X, Download, Filter, ChevronDown, CheckCircle2,
  XCircle, MoreHorizontal, BriefcaseBusiness, Save,
} from "lucide-react";

const initialDepartments = [
  { id: "DEP-001", name: "Front Desk", head: "Amit Sharma", description: "Guest reception, check-in, check-out and guest assistance.", staffCount: 8, status: "Active" },
  { id: "DEP-002", name: "Housekeeping", head: "Priya Verma", description: "Room cleaning, linen management and hotel cleanliness.", staffCount: 12, status: "Active" },
  { id: "DEP-003", name: "Kitchen", head: "Rahul Singh", description: "Food preparation, kitchen operations and food safety.", staffCount: 9, status: "Active" },
  { id: "DEP-004", name: "Finance", head: "Neha Gupta", description: "Accounting, payments, invoices and financial reporting.", staffCount: 4, status: "Active" },
  { id: "DEP-005", name: "Security", head: "Vikram Yadav", description: "Hotel security, surveillance and guest safety.", staffCount: 6, status: "Active" },
  { id: "DEP-006", name: "Restaurant", head: "Ankit Kumar", description: "Restaurant service, orders and table management.", staffCount: 7, status: "Active" },
  { id: "DEP-007", name: "Maintenance", head: "Rohit Mehta", description: "Property repairs, equipment and maintenance.", staffCount: 5, status: "Active" },
  { id: "DEP-008", name: "Human Resources", head: "Kavita Joshi", description: "Recruitment, employee records and staff administration.", staffCount: 3, status: "Inactive" },
];

const emptyForm = {
  name: "",
  head: "",
  description: "",
  staffCount: 0,
  status: "Active",
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN").format(value || 0);

export default function Departments() {
  const [departments, setDepartments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const activeCount = departments.filter((d) => d.status === "Active").length;
  const inactiveCount = departments.filter((d) => d.status === "Inactive").length;
  const totalStaff = departments.reduce((sum, d) => sum + Number(d.staffCount || 0), 0);

  const filteredDepartments = useMemo(() => {
    return departments.filter((department) => {
      const matchesSearch = [
        department.id,
        department.name,
        department.head,
        department.description,
      ].join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || department.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [departments, search, statusFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setErrors({});
    setModal("form");
  };

  const openEdit = (department) => {
    setSelected(department);
    setForm({
      name: department.name,
      head: department.head,
      description: department.description,
      staffCount: department.staffCount,
      status: department.status,
    });
    setErrors({});
    setModal("form");
  };

  const openView = (department) => {
    setSelected(department);
    setModal("view");
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const saveDepartment = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Department name is required.";
    if (!form.head.trim()) nextErrors.head = "Department head is required.";
    if (form.staffCount === "" || Number(form.staffCount) < 0) {
      nextErrors.staffCount = "Enter a valid staff count.";
    }

    if (departments.some(
      (d) =>
        d.name.toLowerCase() === form.name.trim().toLowerCase() &&
        d.id !== selected?.id
    )) {
      nextErrors.name = "This department already exists.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    if (selected) {
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === selected.id
            ? { ...d, ...form, name: form.name.trim(), head: form.head.trim(), staffCount: Number(form.staffCount) }
            : d
        )
      );
    } else {
      const newDepartment = {
        id: `DEP-${String(Date.now()).slice(-6)}`,
        ...form,
        name: form.name.trim(),
        head: form.head.trim(),
        staffCount: Number(form.staffCount),
      };
      setDepartments((prev) => [newDepartment, ...prev]);
    }

    setModal(null);
    setSelected(null);
  };

  const deleteDepartment = (department) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${department.name}"?`
    );
    if (!confirmed) return;

    setDepartments((prev) => prev.filter((d) => d.id !== department.id));
    if (selected?.id === department.id) {
      setSelected(null);
      setModal(null);
    }
  };

  const exportCSV = () => {
    const headers = ["Department ID", "Department Name", "Department Head", "Staff Count", "Status", "Description"];
    const rows = filteredDepartments.map((d) => [
      d.id, d.name, d.head, d.staffCount, d.status, d.description,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-departments.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setErrors({});
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <BriefcaseBusiness size={15} />
              Staff & HR
              <span>/</span>
              <span className="text-indigo-600">Departments</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Departments
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Organize hotel teams, department heads and staff allocation.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Department
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Departments"
            value={departments.length}
            icon={<Building2 size={20} />}
            color="indigo"
          />
          <StatCard
            title="Active Departments"
            value={activeCount}
            icon={<CheckCircle2 size={20} />}
            color="emerald"
          />
          <StatCard
            title="Inactive Departments"
            value={inactiveCount}
            icon={<XCircle size={20} />}
            color="amber"
          />
          <StatCard
            title="Total Staff Assigned"
            value={currency(totalStaff)}
            icon={<Users size={20} />}
            color="sky"
          />
        </div>

        {/* Department list */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">All Departments</h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage department information and responsibilities.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search departments..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-indigo-400 sm:w-40"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Download size={16} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">Department Head</th>
                  <th className="px-5 py-3.5 font-semibold">Staff Count</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredDepartments.map((department) => (
                  <tr
                    key={department.id}
                    className="transition hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                          <Building2 size={19} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {department.name}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {department.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <UserRound size={15} />
                        </div>
                        <span className="text-sm font-medium text-slate-700">
                          {department.head}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1.5 text-sm font-semibold text-slate-700">
                        <Users size={14} className="text-slate-400" />
                        {department.staffCount}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={department.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <ActionButton
                          title="View department"
                          onClick={() => openView(department)}
                        >
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Edit department"
                          onClick={() => openEdit(department)}
                        >
                          <Pencil size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Delete department"
                          danger
                          onClick={() => deleteDepartment(department)}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredDepartments.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-5 py-14 text-center">
                      <Building2 className="mx-auto mb-3 text-slate-300" size={35} />
                      <p className="font-medium text-slate-700">
                        No departments found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredDepartments.length} of {departments.length} departments
            </span>
            <span>Department records</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Department" : "Create Department"}
          subtitle={
            selected
              ? "Update department details and staff allocation."
              : "Add a new department to your hotel."
          }
          onClose={closeModal}
        >
          <form onSubmit={saveDepartment} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Department Name *
              </label>
              <input
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Front Desk"
                className={inputClass}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Department Head *
              </label>
              <input
                value={form.head}
                onChange={(e) => updateField("head", e.target.value)}
                placeholder="Enter department head name"
                className={inputClass}
              />
              {errors.head && (
                <p className="mt-1 text-xs text-red-500">{errors.head}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Staff Count *
              </label>
              <input
                type="number"
                min="0"
                value={form.staffCount}
                onChange={(e) => updateField("staffCount", e.target.value)}
                className={inputClass}
              />
              {errors.staffCount && (
                <p className="mt-1 text-xs text-red-500">{errors.staffCount}</p>
              )}
              <p className="mt-1 text-xs text-slate-400">
                Demo field: this count is entered manually until staff records are connected.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe the department's responsibilities..."
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Department Status
              </label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Save size={16} />
                {selected ? "Save Changes" : "Create Department"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <Modal
          title="Department Details"
          subtitle="View department information."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600">
                <Building2 size={23} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">{selected.name}</h3>
                <p className="text-xs text-slate-500">{selected.id}</p>
              </div>
              <div className="ml-auto">
                <StatusBadge status={selected.status} />
              </div>
            </div>

            <DetailRow label="Department Head" value={selected.head} />
            <DetailRow label="Staff Count" value={`${selected.staffCount} employees`} />
            <DetailRow
              label="Description"
              value={selected.description || "No description provided."}
            />

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => openEdit(selected)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Pencil size={15} />
                Edit Department
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${styles[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-slate-400"
        }`}
      />
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
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}
