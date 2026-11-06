import { useMemo, useState } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  X,
  Wrench,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  CalendarDays,
  MapPin,
  UserRound,
  Package,
  FileText,
  Filter,
} from "lucide-react";

const initialOrders = [
  {
    id: "WO-2026-001",
    title: "Bathroom plumbing leakage",
    category: "Plumbing",
    description: "Water leakage reported below the washbasin in the bathroom.",
    location: "Room 102",
    technician: "Ramesh Kumar",
    priority: "Critical",
    status: "In Progress",
    startDate: "2026-11-05",
    dueDate: "2026-11-06",
    spareParts: "Washbasin pipe, 1, 450\nPVC connector, 2, 120",
    estimatedCost: 690,
    actualCost: 0,
    completionReport: "",
    createdAt: "2026-11-05",
  },
  {
    id: "WO-2026-002",
    title: "Air conditioner servicing",
    category: "HVAC",
    description: "Routine AC servicing and filter cleaning.",
    location: "Room 204",
    technician: "Suresh Sharma",
    priority: "Medium",
    status: "Pending",
    startDate: "2026-11-07",
    dueDate: "2026-11-08",
    spareParts: "AC filter, 1, 800",
    estimatedCost: 1200,
    actualCost: 0,
    completionReport: "",
    createdAt: "2026-11-06",
  },
  {
    id: "WO-2026-003",
    title: "Lobby light replacement",
    category: "Electrical",
    description: "Replace two non-working LED lights in the lobby.",
    location: "Main Lobby",
    technician: "Amit Verma",
    priority: "High",
    status: "Completed",
    startDate: "2026-11-04",
    dueDate: "2026-11-05",
    spareParts: "LED bulb, 2, 350",
    estimatedCost: 700,
    actualCost: 750,
    completionReport: "Both LED lights replaced and tested successfully.",
    createdAt: "2026-11-04",
  },
  {
    id: "WO-2026-004",
    title: "Water pump inspection",
    category: "Equipment",
    description: "Inspect unusual noise from the main water pump.",
    location: "Pump Room",
    technician: "Ramesh Kumar",
    priority: "High",
    status: "On Hold",
    startDate: "2026-11-06",
    dueDate: "2026-11-09",
    spareParts: "Pump bearing, 1, 1500",
    estimatedCost: 2200,
    actualCost: 0,
    completionReport: "",
    createdAt: "2026-11-06",
  },
];

const emptyForm = {
  title: "",
  category: "Plumbing",
  description: "",
  location: "",
  technician: "",
  priority: "Medium",
  status: "Pending",
  startDate: "",
  dueDate: "",
  spareParts: "",
  estimatedCost: "",
  actualCost: "",
  completionReport: "",
};

const categories = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Civil",
  "Equipment",
  "Housekeeping",
  "Other",
];

const technicians = [
  "Ramesh Kumar",
  "Suresh Sharma",
  "Amit Verma",
  "Vikram Singh",
  "Unassigned",
];

const statusOptions = [
  "Pending",
  "In Progress",
  "On Hold",
  "Completed",
  "Cancelled",
];

const priorityOptions = ["Low", "Medium", "High", "Critical"];

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    "In Progress": "bg-blue-50 text-blue-700 border-blue-200",
    "On Hold": "bg-orange-50 text-orange-700 border-orange-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[status] || styles.Pending
      }`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Critical: "bg-red-50 text-red-700 border-red-200",
    High: "bg-orange-50 text-orange-700 border-orange-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        styles[priority] || styles.Medium
      }`}
    >
      {priority}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, size = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div
        className={`flex max-h-[92vh] w-full ${size} flex-col overflow-hidden rounded-xl bg-white shadow-xl`}
      >
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

export default function MaintenanceOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const stats = useMemo(() => {
    const active = orders.filter(
      (order) => !["Completed", "Cancelled"].includes(order.status)
    );

    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      inProgress: orders.filter((order) => order.status === "In Progress")
        .length,
      critical: active.filter((order) => order.priority === "Critical").length,
      completed: orders.filter((order) => order.status === "Completed").length,
      estimatedCost: orders.reduce(
        (sum, order) => sum + Number(order.estimatedCost || 0),
        0
      ),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.toLowerCase().trim();

    return orders.filter((order) => {
      const matchesSearch =
        !query ||
        [
          order.id,
          order.title,
          order.location,
          order.technician,
          order.category,
        ].some((value) => String(value || "").toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || order.priority === priorityFilter;
      const matchesCategory =
        categoryFilter === "All" || order.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });
  }, [orders, search, statusFilter, priorityFilter, categoryFilter]);

  const openCreateForm = () => {
    setEditingOrder(null);
    setForm({
      ...emptyForm,
      startDate: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const openEditForm = (order) => {
    setEditingOrder(order);
    setForm({
      ...order,
      estimatedCost: String(order.estimatedCost ?? ""),
      actualCost: String(order.actualCost ?? ""),
    });
    setShowForm(true);
    setViewOrder(null);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      form.dueDate &&
      form.startDate &&
      form.dueDate < form.startDate
    ) {
      alert("Due date cannot be earlier than the start date.");
      return;
    }

    if (editingOrder) {
      setOrders((previous) =>
        previous.map((order) =>
          order.id === editingOrder.id
            ? {
                ...order,
                ...form,
                estimatedCost: Number(form.estimatedCost || 0),
                actualCost: Number(form.actualCost || 0),
              }
            : order
        )
      );
    } else {
      const nextNumber =
        Math.max(
          0,
          ...orders.map((order) => {
            const match = order.id.match(/WO-\d{4}-(\d+)/);
            return match ? Number(match[1]) : 0;
          })
        ) + 1;

      const newOrder = {
        ...form,
        id: `WO-${new Date().getFullYear()}-${String(nextNumber).padStart(
          3,
          "0"
        )}`,
        estimatedCost: Number(form.estimatedCost || 0),
        actualCost: Number(form.actualCost || 0),
        createdAt: new Date().toISOString().slice(0, 10),
      };

      setOrders((previous) => [newOrder, ...previous]);
    }

    setShowForm(false);
    setEditingOrder(null);
    setForm(emptyForm);
  };

  const updateStatus = (order, status) => {
    const updated = {
      ...order,
      status,
    };

    setOrders((previous) =>
      previous.map((item) => (item.id === order.id ? updated : item))
    );

    if (viewOrder?.id === order.id) {
      setViewOrder(updated);
    }
  };

  const deleteOrder = (order) => {
    const confirmed = window.confirm(
      `Delete work order ${order.id}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setOrders((previous) =>
      previous.filter((item) => item.id !== order.id)
    );
  };

  const exportCSV = () => {
    const headers = [
      "Work Order ID",
      "Title",
      "Category",
      "Location",
      "Technician",
      "Priority",
      "Status",
      "Start Date",
      "Due Date",
      "Spare Parts",
      "Estimated Cost",
      "Actual Cost",
      "Completion Report",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.title,
      order.category,
      order.location,
      order.technician,
      order.priority,
      order.status,
      order.startDate,
      order.dueDate,
      order.spareParts,
      order.estimatedCost,
      order.actualCost,
      order.completionReport,
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
    link.download = "maintenance-work-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Wrench size={16} />
            <span>Maintenance</span>
            <span>/</span>
            <span className="text-slate-700">Work Orders</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Maintenance Work Orders
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, assign and track hotel maintenance jobs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} />
            Export CSV
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Work Order
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard
          title="Total Work Orders"
          value={stats.total}
          icon={ClipboardList}
          color="bg-blue-50 text-blue-600"
          subtitle="All recorded work orders"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-amber-50 text-amber-600"
          subtitle="Waiting to start"
        />
        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={Wrench}
          color="bg-indigo-50 text-indigo-600"
          subtitle="Currently being repaired"
        />
        <StatCard
          title="Critical Issues"
          value={stats.critical}
          icon={AlertTriangle}
          color="bg-red-50 text-red-600"
          subtitle="Active critical work orders"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          color="bg-emerald-50 text-emerald-600"
          subtitle="Successfully completed"
        />
        <StatCard
          title="Estimated Cost"
          value={formatCurrency(stats.estimatedCost)}
          icon={IndianRupee}
          color="bg-purple-50 text-purple-600"
          subtitle="Combined estimated amount"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter size={16} />
          Search & Filters
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, title, room, technician..."
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Priorities</option>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Orders Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold text-slate-900">All Work Orders</h2>
            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredOrders.length} of {orders.length} work orders
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Work Order</th>
                <th className="px-5 py-3 font-semibold">Location</th>
                <th className="px-5 py-3 font-semibold">Technician</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Start / Due Date</th>
                <th className="px-5 py-3 font-semibold">Est. Cost</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/70">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-blue-600">{order.id}</p>
                    <p className="mt-1 font-medium text-slate-800">
                      {order.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.category}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <MapPin size={14} className="text-slate-400" />
                      {order.location}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <UserRound size={14} className="text-slate-400" />
                      {order.technician || "Unassigned"}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={order.priority} />
                  </td>

                  <td className="px-5 py-4 text-xs text-slate-600">
                    <p>Start: {formatDate(order.startDate)}</p>
                    <p className="mt-1">Due: {formatDate(order.dueDate)}</p>
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-800">
                    {formatCurrency(order.estimatedCost)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        title="View details"
                        onClick={() => setViewOrder(order)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        type="button"
                        title="Edit work order"
                        onClick={() => openEditForm(order)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        type="button"
                        title="Delete work order"
                        onClick={() => deleteOrder(order)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center">
                    <ClipboardList
                      size={30}
                      className="mx-auto mb-2 text-slate-300"
                    />
                    <p className="font-medium text-slate-700">
                      No work orders found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your filters or create a new work order.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <Modal
          title={editingOrder ? "Edit Work Order" : "Create Work Order"}
          subtitle={
            editingOrder
              ? `Update ${editingOrder.id}`
              : "Enter the maintenance job details below."
          }
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Work Order Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Work Order Title" required>
                  <input
                    required
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    placeholder="e.g. Bathroom leakage repair"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Category" required>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Location / Room" required>
                  <input
                    required
                    name="location"
                    value={form.location}
                    onChange={handleFormChange}
                    placeholder="e.g. Room 101, Lobby, Kitchen"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Assigned Technician">
                  <select
                    name="technician"
                    value={form.technician}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Select technician</option>
                    {technicians.map((technician) => (
                      <option key={technician} value={technician}>
                        {technician}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Priority" required>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Work Order Status">
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="mt-4">
                <FormField label="Issue Description" required>
                  <textarea
                    required
                    rows={3}
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Describe the issue and work required..."
                    className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <CalendarDays size={16} />
                Schedule
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Start Date" required>
                  <input
                    required
                    type="date"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Due Date" required>
                  <input
                    required
                    type="date"
                    min={form.startDate || undefined}
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleFormChange}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Package size={16} />
                Spare Parts & Cost
              </h3>

              <FormField label="Spare Parts Required">
                <textarea
                  rows={3}
                  name="spareParts"
                  value={form.spareParts}
                  onChange={handleFormChange}
                  placeholder={"Enter one item per line:\nWashbasin pipe, 1, 450\nPVC connector, 2, 120"}
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Suggested format: Part name, quantity, unit cost.
                </p>
              </FormField>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Estimated Cost (₹)">
                  <input
                    type="number"
                    min="0"
                    name="estimatedCost"
                    value={form.estimatedCost}
                    onChange={handleFormChange}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>

                <FormField label="Actual Cost (₹)">
                  <input
                    type="number"
                    min="0"
                    name="actualCost"
                    value={form.actualCost}
                    onChange={handleFormChange}
                    placeholder="Enter after work is done"
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </FormField>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <FileText size={16} />
                Completion Report
              </h3>
              <FormField label="Work Done / Completion Notes">
                <textarea
                  rows={3}
                  name="completionReport"
                  value={form.completionReport}
                  onChange={handleFormChange}
                  placeholder="Add repair details, replaced parts, testing results, etc."
                  className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </FormField>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingOrder ? "Save Changes" : "Create Work Order"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Details Modal */}
      {viewOrder && (
        <Modal
          title="Work Order Details"
          subtitle={viewOrder.id}
          onClose={() => setViewOrder(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={viewOrder.status} />
              <PriorityBadge priority={viewOrder.priority} />
              <span className="text-xs text-slate-500">
                Created {formatDate(viewOrder.createdAt)}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                {viewOrder.title}
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {viewOrder.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Category", viewOrder.category],
                ["Location", viewOrder.location],
                ["Technician", viewOrder.technician || "Unassigned"],
                ["Start Date", formatDate(viewOrder.startDate)],
                ["Due Date", formatDate(viewOrder.dueDate)],
                ["Estimated Cost", formatCurrency(viewOrder.estimatedCost)],
                ["Actual Cost", formatCurrency(viewOrder.actualCost)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {value || "—"}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                Spare Parts Required
              </h4>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {viewOrder.spareParts || "No spare parts recorded."}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                Completion Report
              </h4>
              <div className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                {viewOrder.completionReport || "No completion report added yet."}
              </div>
            </div>

            <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {viewOrder.status !== "Completed" &&
                  viewOrder.status !== "Cancelled" && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateStatus(viewOrder, "In Progress")}
                        className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Mark In Progress
                      </button>
                      <button
                        type="button"
                        onClick={() => updateStatus(viewOrder, "Completed")}
                        className="rounded-lg border border-emerald-200 px-3 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
                      >
                        Mark Completed
                      </button>
                    </>
                  )}
              </div>
              <button
                type="button"
                onClick={() => openEditForm(viewOrder)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Pencil size={15} />
                Edit Work Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}