import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
  Pencil,
  Trash2,
  Eye,
  X,
  Download,
  Save,
  Filter,
  ChevronDown,
  UserRound,
  Building2,
  Check,
} from "lucide-react";

const permissionsList = [
  "Dashboard Access",
  "Guest Management",
  "Reservation Management",
  "Room Management",
  "Housekeeping Management",
  "Restaurant Management",
  "Inventory Management",
  "Finance Management",
  "Staff Management",
  "Reports Access",
  "Settings Management",
];

const initialRoles = [
  {
    id: "ROLE-001",
    title: "General Manager",
    department: "Management",
    manager: "Hotel Owner",
    description: "Oversees overall hotel operations and performance.",
    responsibilities:
      "Manage hotel operations, supervise departments, review performance and ensure guest satisfaction.",
    permissions: permissionsList,
    status: "Active",
  },
  {
    id: "ROLE-002",
    title: "Front Office Manager",
    department: "Front Desk",
    manager: "General Manager",
    description: "Manages front desk and guest reception operations.",
    responsibilities:
      "Manage reservations, check-in, check-out, guest complaints and front desk staff.",
    permissions: [
      "Dashboard Access",
      "Guest Management",
      "Reservation Management",
      "Reports Access",
    ],
    status: "Active",
  },
  {
    id: "ROLE-003",
    title: "Housekeeping Supervisor",
    department: "Housekeeping",
    manager: "General Manager",
    description: "Supervises room cleaning and housekeeping staff.",
    responsibilities:
      "Assign cleaning tasks, inspect rooms and monitor housekeeping performance.",
    permissions: [
      "Dashboard Access",
      "Room Management",
      "Housekeeping Management",
    ],
    status: "Active",
  },
  {
    id: "ROLE-004",
    title: "Accountant",
    department: "Finance",
    manager: "General Manager",
    description: "Handles hotel financial records and transactions.",
    responsibilities:
      "Manage invoices, payments, expenses, refunds and financial reports.",
    permissions: ["Dashboard Access", "Finance Management", "Reports Access"],
    status: "Active",
  },
  {
    id: "ROLE-005",
    title: "Kitchen Manager",
    department: "Kitchen",
    manager: "General Manager",
    description: "Manages kitchen operations and food preparation.",
    responsibilities:
      "Supervise kitchen employees, food quality, stock and kitchen hygiene.",
    permissions: [
      "Dashboard Access",
      "Restaurant Management",
      "Inventory Management",
    ],
    status: "Active",
  },
  {
    id: "ROLE-006",
    title: "Security Officer",
    department: "Security",
    manager: "General Manager",
    description: "Maintains hotel security and guest safety.",
    responsibilities:
      "Monitor security systems, patrol premises and report incidents.",
    permissions: ["Dashboard Access"],
    status: "Active",
  },
];

const initialDepartments = [
  "Management",
  "Front Desk",
  "Housekeeping",
  "Kitchen",
  "Finance",
  "Security",
  "Restaurant",
  "Maintenance",
  "Human Resources",
];

const emptyForm = {
  title: "",
  department: "",
  manager: "",
  description: "",
  responsibilities: "",
  permissions: [],
  status: "Active",
};

export default function RolesDesignations() {
  const [roles, setRoles] = useState(initialRoles);
  const [departments] = useState(initialDepartments);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const activeCount = roles.filter((r) => r.status === "Active").length;
  const inactiveCount = roles.filter((r) => r.status === "Inactive").length;
  const permissionCount = new Set(roles.flatMap((r) => r.permissions)).size;

  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const term = search.toLowerCase();

      const matchesSearch = [
        role.id,
        role.title,
        role.department,
        role.manager,
        role.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const matchesDepartment =
        departmentFilter === "All" || role.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || role.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [roles, search, departmentFilter, statusFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, department: departments[0] });
    setErrors({});
    setModal("form");
  };

  const openEdit = (role) => {
    setSelected(role);
    setForm({
      title: role.title,
      department: role.department,
      manager: role.manager,
      description: role.description,
      responsibilities: role.responsibilities,
      permissions: [...role.permissions],
      status: role.status,
    });
    setErrors({});
    setModal("form");
  };

  const openView = (role) => {
    setSelected(role);
    setModal("view");
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const togglePermission = (permission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const saveRole = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Designation is required.";
    if (!form.department) nextErrors.department = "Select a department.";

    const duplicate = roles.some(
      (role) =>
        role.title.toLowerCase() === form.title.trim().toLowerCase() &&
        role.department === form.department &&
        role.id !== selected?.id,
    );

    if (duplicate) {
      nextErrors.title = "This designation already exists in this department.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const updatedRole = {
      ...form,
      title: form.title.trim(),
      manager: form.manager.trim(),
      id: selected?.id || `ROLE-${String(Date.now()).slice(-6)}`,
    };

    if (selected) {
      setRoles((prev) =>
        prev.map((role) => (role.id === selected.id ? updatedRole : role)),
      );
    } else {
      setRoles((prev) => [updatedRole, ...prev]);
    }

    setModal(null);
    setSelected(null);
  };

  const deleteRole = (role) => {
    if (!window.confirm(`Delete designation "${role.title}"?`)) return;
    setRoles((prev) => prev.filter((r) => r.id !== role.id));
    setModal(null);
    setSelected(null);
  };

  const exportCSV = () => {
    const headers = [
      "Role ID",
      "Designation",
      "Department",
      "Reporting Manager",
      "Responsibilities",
      "Permissions",
      "Status",
    ];

    const rows = filteredRoles.map((r) => [
      r.id,
      r.title,
      r.department,
      r.manager,
      r.responsibilities,
      r.permissions.join("; "),
      r.status,
    ]);

    const escapeCSV = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-roles-designations.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setErrors({});
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <BriefcaseBusiness size={15} />
              Staff & HR <span>/</span>
              <span className="text-indigo-600">Roles & Designations</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Roles & Designations
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Define job positions, responsibilities and system permissions.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Designation
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Designations"
            value={roles.length}
            icon={<BriefcaseBusiness size={20} />}
            color="indigo"
          />
          <StatCard
            title="Active Designations"
            value={activeCount}
            icon={<ShieldCheck size={20} />}
            color="emerald"
          />
          <StatCard
            title="Inactive Designations"
            value={inactiveCount}
            icon={<Users size={20} />}
            color="amber"
          />
          <StatCard
            title="Permission Types"
            value={permissionCount}
            icon={<Check size={20} />}
            color="sky"
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Designation Directory
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Configure positions and access permissions for hotel employees.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search designations..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-56"
                />
              </div>

              <div className="relative">
                <Building2
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none sm:w-44"
                >
                  <option value="All">All Departments</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
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
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none sm:w-36"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Designation</th>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">
                    Reporting Manager
                  </th>
                  <th className="px-5 py-3.5 font-semibold">Permissions</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRoles.map((role) => (
                  <tr key={role.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {role.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">{role.id}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700">
                        <Building2 size={13} />
                        {role.department}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {role.manager || "Not assigned"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                        {role.permissions.length} permissions
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={role.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1.5">
                        <ActionButton
                          title="View"
                          onClick={() => openView(role)}
                        >
                          <Eye size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Edit"
                          onClick={() => openEdit(role)}
                        >
                          <Pencil size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Delete"
                          danger
                          onClick={() => deleteRole(role)}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRoles.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-14 text-center">
                      <BriefcaseBusiness
                        size={35}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-medium text-slate-700">
                        No designations found
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

          <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            Showing {filteredRoles.length} of {roles.length} designations
          </div>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Designation" : "Create Designation"}
          subtitle="Configure the job position and its permissions."
          onClose={closeModal}
        >
          <form onSubmit={saveRole} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Job Designation *
                </label>
                <input
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Front Office Manager"
                  className={inputClass}
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-red-500">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Department *
                </label>
                <select
                  value={form.department}
                  onChange={(e) => updateField("department", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select department</option>
                  {departments.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.department}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Reporting Manager
              </label>
              <input
                value={form.manager}
                onChange={(e) => updateField("manager", e.target.value)}
                placeholder="e.g. General Manager"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                rows={2}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Short description of this designation..."
                className={inputClass + " resize-none"}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Responsibilities
              </label>
              <textarea
                rows={3}
                value={form.responsibilities}
                onChange={(e) =>
                  updateField("responsibilities", e.target.value)
                }
                placeholder="Describe the responsibilities of this position..."
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Permissions */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Permissions Mapping
                </label>
                <span className="text-xs text-indigo-600">
                  {form.permissions.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2 rounded-xl border border-slate-200 p-3 sm:grid-cols-2">
                {permissionsList.map((permission) => {
                  const checked = form.permissions.includes(permission);

                  return (
                    <label
                      key={permission}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs transition ${
                        checked
                          ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                          : "border-slate-100 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => togglePermission(permission)}
                        className="h-4 w-4 accent-indigo-600"
                      />
                      <span>{permission}</span>
                    </label>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">
                These are frontend permission labels. Actual access control must
                be enforced by the backend.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Status
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
                {selected ? "Save Changes" : "Create Designation"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <Modal
          title="Designation Details"
          subtitle="Job responsibilities and access configuration."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 rounded-xl bg-indigo-50 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600">
                <BriefcaseBusiness size={23} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-slate-900">{selected.title}</h3>
                <p className="text-xs text-slate-500">{selected.id}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <DetailRow label="Department" value={selected.department} />
            <DetailRow
              label="Reporting Manager"
              value={selected.manager || "Not assigned"}
            />
            <DetailRow
              label="Description"
              value={selected.description || "No description provided."}
            />
            <DetailRow
              label="Responsibilities"
              value={selected.responsibilities || "Not specified."}
            />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Assigned Permissions ({selected.permissions.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selected.permissions.length ? (
                  selected.permissions.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700"
                    >
                      <Check size={12} />
                      {permission}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">
                    No permissions assigned.
                  </span>
                )}
              </div>
            </div>

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
                Edit Designation
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
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
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
      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
