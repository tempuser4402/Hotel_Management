
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Eye,
  Pencil,
  Trash2,
  X,
  Download,
  ImagePlus,
  MapPin,
  UserRound,
  CalendarDays,
  FileText,
  ClipboardList,
} from "lucide-react";

const technicians = [
  "Ramesh Kumar",
  "Suresh Sharma",
  "Mohan Lal",
  "External Technician",
];

const categories = [
  "Electrical",
  "Plumbing",
  "AC & HVAC",
  "Carpentry",
  "Housekeeping",
  "Internet & Wi-Fi",
  "Civil",
  "Other",
];

const initialIssues = [
  {
    id: "ISS-1001",
    title: "Air conditioner not cooling",
    description: "Guest reported that the AC is running but room temperature is not decreasing.",
    source: "Guest",
    reportedBy: "Rahul Sharma",
    contact: "9876543210",
    category: "AC & HVAC",
    severity: "Critical",
    location: "Room 102",
    reportedDate: "2026-11-06",
    assignedTo: "Ramesh Kumar",
    status: "In Progress",
    imageName: "",
    resolution: "",
    resolvedDate: "",
    repairCost: 0,
    history: [
      { date: "2026-11-06", action: "Issue reported by guest" },
      { date: "2026-11-06", action: "Assigned to Ramesh Kumar" },
      { date: "2026-11-06", action: "Repair started" },
    ],
  },
  {
    id: "ISS-1002",
    title: "Washbasin tap leakage",
    description: "Water leaking continuously from the bathroom washbasin tap.",
    source: "Staff",
    reportedBy: "Amit - Housekeeping",
    contact: "",
    category: "Plumbing",
    severity: "Medium",
    location: "Room 204",
    reportedDate: "2026-11-05",
    assignedTo: "Suresh Sharma",
    status: "Open",
    imageName: "",
    resolution: "",
    resolvedDate: "",
    repairCost: 0,
    history: [{ date: "2026-11-05", action: "Issue reported by staff" }],
  },
  {
    id: "ISS-1003",
    title: "Lobby light not working",
    description: "LED panel near reception is not working.",
    source: "Staff",
    reportedBy: "Reception Desk",
    contact: "",
    category: "Electrical",
    severity: "High",
    location: "Reception",
    reportedDate: "2026-11-04",
    assignedTo: "Ramesh Kumar",
    status: "Resolved",
    imageName: "",
    resolution: "LED panel replaced and lighting tested.",
    resolvedDate: "2026-11-05",
    repairCost: 950,
    history: [
      { date: "2026-11-04", action: "Issue reported by staff" },
      { date: "2026-11-04", action: "Assigned to Ramesh Kumar" },
      { date: "2026-11-05", action: "LED panel replaced and issue resolved" },
    ],
  },
  {
    id: "ISS-1004",
    title: "Wi-Fi connectivity issue",
    description: "Guest unable to connect to the hotel Wi-Fi.",
    source: "Guest",
    reportedBy: "Priya Verma",
    contact: "9812345670",
    category: "Internet & Wi-Fi",
    severity: "Low",
    location: "Room 301",
    reportedDate: "2026-11-03",
    assignedTo: "External Technician",
    status: "Closed",
    imageName: "",
    resolution: "Router restarted and connection restored.",
    resolvedDate: "2026-11-03",
    repairCost: 0,
    history: [
      { date: "2026-11-03", action: "Issue reported by guest" },
      { date: "2026-11-03", action: "Router restarted; connection restored" },
      { date: "2026-11-03", action: "Issue closed" },
    ],
  },
];

const emptyForm = {
  title: "",
  description: "",
  source: "Staff",
  reportedBy: "",
  contact: "",
  category: "Electrical",
  severity: "Medium",
  location: "",
  reportedDate: new Date().toISOString().slice(0, 10),
  assignedTo: "",
  status: "Open",
  imageName: "",
  resolution: "",
  resolvedDate: "",
  repairCost: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const badgeStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-slate-100 text-slate-600",
  Open: "bg-red-100 text-red-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-slate-100 text-slate-600",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Badge({ value }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeStyles[value] || "bg-slate-100 text-slate-600"}`}>
      {value}
    </span>
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

function Modal({ title, onClose, children, size = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className={`w-full ${size} max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function MaintenanceIssues() {
  const [issues, setIssues] = useState(initialIssues);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const term = search.toLowerCase();

      const matchesSearch = [
        issue.id,
        issue.title,
        issue.location,
        issue.reportedBy,
        issue.assignedTo,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      return (
        matchesSearch &&
        (statusFilter === "All" || issue.status === statusFilter) &&
        (severityFilter === "All" || issue.severity === severityFilter) &&
        (categoryFilter === "All" || issue.category === categoryFilter)
      );
    });
  }, [issues, search, statusFilter, severityFilter, categoryFilter]);

  const stats = [
    {
      label: "Total Issues",
      value: issues.length,
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Open Issues",
      value: issues.filter((i) => i.status === "Open").length,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "In Progress",
      value: issues.filter((i) => i.status === "In Progress").length,
      icon: Wrench,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Resolved",
      value: issues.filter((i) => i.status === "Resolved" || i.status === "Closed").length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Critical Issues",
      value: issues.filter((i) => i.severity === "Critical" && !["Resolved", "Closed"].includes(i.status)).length,
      icon: AlertTriangle,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Repair Cost",
      value: money(issues.reduce((sum, i) => sum + Number(i.repairCost || 0), 0)),
      icon: FileText,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const updateField = (key, value) =>
    setForm((previous) => ({ ...previous, [key]: value }));

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (issue) => {
    setSelected(issue);
    setForm({ ...issue });
    setModal("form");
  };

  const addHistory = (issue, action) => [
    ...(issue.history || []),
    { date: new Date().toISOString().slice(0, 10), action },
  ];

  const saveIssue = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.reportedBy.trim() || !form.location.trim()) {
      alert("Please enter issue title, reported by and location.");
      return;
    }

    if (form.resolvedDate && form.resolvedDate < form.reportedDate) {
      alert("Resolution date cannot be earlier than reported date.");
      return;
    }

    if (["Resolved", "Closed"].includes(form.status) && !form.resolution.trim()) {
      alert("Please enter resolution information before resolving or closing an issue.");
      return;
    }

    if (selected) {
      const changedStatus = selected.status !== form.status;
      const updated = {
        ...form,
        repairCost: Number(form.repairCost || 0),
        history: changedStatus
          ? addHistory(selected, `Status changed from ${selected.status} to ${form.status}`)
          : selected.history,
      };

      setIssues((previous) =>
        previous.map((i) => (i.id === selected.id ? updated : i))
      );
    } else {
      const nextNumber =
        Math.max(1000, ...issues.map((i) => Number(i.id.split("-")[1]) || 1000)) + 1;

      const newIssue = {
        ...form,
        id: `ISS-${nextNumber}`,
        repairCost: Number(form.repairCost || 0),
        history: [
          {
            date: form.reportedDate,
            action: `Issue reported by ${form.source.toLowerCase()}`,
          },
        ],
      };

      setIssues((previous) => [newIssue, ...previous]);
    }

    setModal("");
  };

  const changeStatus = (issue, status) => {
    if (["Resolved", "Closed"].includes(status) && !issue.resolution.trim()) {
      setSelected(issue);
      setForm({
        ...issue,
        status,
        resolvedDate: new Date().toISOString().slice(0, 10),
      });
      setModal("resolve");
      return;
    }

    setIssues((previous) =>
      previous.map((i) =>
        i.id === issue.id
          ? {
              ...i,
              status,
              history: addHistory(issue, `Status changed to ${status}`),
            }
          : i
      )
    );
  };

  const resolveIssue = (e) => {
    e.preventDefault();

    if (!form.resolution.trim()) {
      alert("Enter resolution information.");
      return;
    }

    setIssues((previous) =>
      previous.map((i) =>
        i.id === selected.id
          ? {
              ...i,
              status: form.status,
              resolution: form.resolution,
              resolvedDate: form.resolvedDate,
              repairCost: Number(form.repairCost || 0),
              history: addHistory(selected, `Issue ${form.status.toLowerCase()}: ${form.resolution}`),
            }
          : i
      )
    );

    setModal("");
  };

  const deleteIssue = (issue) => {
    if (!window.confirm(`Delete issue ${issue.id}?`)) return;
    setIssues((previous) => previous.filter((i) => i.id !== issue.id));
  };

  const exportCSV = () => {
    const headers = [
      "Issue ID",
      "Title",
      "Source",
      "Reported By",
      "Category",
      "Severity",
      "Location",
      "Assigned Technician",
      "Status",
      "Reported Date",
      "Resolved Date",
      "Repair Cost",
      "Resolution",
    ];

    const rows = filteredIssues.map((i) => [
      i.id,
      i.title,
      i.source,
      i.reportedBy,
      i.category,
      i.severity,
      i.location,
      i.assignedTo,
      i.status,
      i.reportedDate,
      i.resolvedDate,
      i.repairCost,
      i.resolution,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "maintenance-issues.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Issues & Repairs</h1>
          <p className="mt-1 text-sm text-slate-500">
            Report, assign and track maintenance issues across the hotel.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} /> Export CSV
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Report Issue
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {stat.value}
                </h2>
              </div>
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search issue, ID, room, reporter..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            className={inputClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select
            className={inputClass}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severity</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            className={inputClass}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Filter size={14} /> Showing {filteredIssues.length} of {issues.length} issues
          </span>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setSeverityFilter("All");
              setCategoryFilter("All");
            }}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Issues Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">Reported Issues</h2>
            <p className="mt-1 text-xs text-slate-500">
              Track all staff and guest maintenance complaints.
            </p>
          </div>
          <ClipboardList className="text-slate-400" size={21} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Issue</th>
                <th className="px-5 py-3">Reported By</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Severity</th>
                <th className="px-5 py-3">Technician</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Reported Date</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-800">{issue.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{issue.id} · {issue.category}</p>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-700">{issue.reportedBy}</p>
                    <p className="mt-1 text-xs text-slate-500">{issue.source}</p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="flex items-center gap-1 text-slate-600">
                      <MapPin size={14} /> {issue.location}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <Badge value={issue.severity} />
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {issue.assignedTo || "Unassigned"}
                  </td>

                  <td className="px-5 py-4">
                    <Badge value={issue.status} />
                  </td>

                  <td className="px-5 py-4 text-slate-600">{issue.reportedDate}</td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        title="View details"
                        onClick={() => {
                          setSelected(issue);
                          setModal("details");
                        }}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        title="Edit issue"
                        onClick={() => openEdit(issue)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil size={17} />
                      </button>
                      <button
                        title="Delete issue"
                        onClick={() => deleteIssue(issue)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                    No issues found. Try changing your filters or report a new issue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Maintenance Issue" : "Report New Issue"}
          onClose={() => setModal("")}
        >
          <form onSubmit={saveIssue} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Issue Title *">
                <input
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. AC not cooling"
                  required
                />
              </Field>

              <Field label="Issue Category">
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>

              <Field label="Reported By">
                <input
                  className={inputClass}
                  value={form.reportedBy}
                  onChange={(e) => updateField("reportedBy", e.target.value)}
                  placeholder="Guest or staff name"
                  required
                />
              </Field>

              <Field label="Report Source">
                <select
                  className={inputClass}
                  value={form.source}
                  onChange={(e) => updateField("source", e.target.value)}
                >
                  <option>Staff</option>
                  <option>Guest</option>
                  <option>Inspection</option>
                  <option>Management</option>
                </select>
              </Field>

              <Field label="Contact Number">
                <input
                  className={inputClass}
                  value={form.contact}
                  onChange={(e) => updateField("contact", e.target.value)}
                  placeholder="Optional phone number"
                />
              </Field>

              <Field label="Room / Location *">
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Room 102, Lobby, Kitchen"
                  required
                />
              </Field>

              <Field label="Severity">
                <select
                  className={inputClass}
                  value={form.severity}
                  onChange={(e) => updateField("severity", e.target.value)}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </Field>

              <Field label="Reported Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.reportedDate}
                  onChange={(e) => updateField("reportedDate", e.target.value)}
                  required
                />
              </Field>

              <Field label="Assigned Technician">
                <select
                  className={inputClass}
                  value={form.assignedTo}
                  onChange={(e) => updateField("assignedTo", e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {technicians.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Issue Description">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    placeholder="Describe the issue in detail..."
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Issue Image (filename only in this demo)">
                  <div className="flex items-center gap-2">
                    <ImagePlus size={19} className="text-slate-400" />
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full text-sm text-slate-600"
                      onChange={(e) =>
                        updateField("imageName", e.target.files?.[0]?.name || "")
                      }
                    />
                  </div>
                  {form.imageName && (
                    <p className="mt-1 text-xs text-slate-500">
                      Selected: {form.imageName}
                    </p>
                  )}
                </Field>
              </div>

              <div className="md:col-span-2 border-t border-slate-100 pt-4">
                <h3 className="mb-3 font-semibold text-slate-800">
                  Resolution Information
                </h3>
              </div>

              <Field label="Resolution Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.resolvedDate}
                  onChange={(e) => updateField("resolvedDate", e.target.value)}
                />
              </Field>

              <Field label="Repair Cost (₹)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.repairCost}
                  onChange={(e) => updateField("repairCost", e.target.value)}
                  placeholder="0"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Resolution / Repair Details">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.resolution}
                    onChange={(e) => updateField("resolution", e.target.value)}
                    placeholder="Describe the repair performed and final result..."
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selected ? "Update Issue" : "Save Issue"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Issue Details and History */}
      {modal === "details" && selected && (
        <Modal title={`Issue Details — ${selected.id}`} onClose={() => setModal("")}>
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge value={selected.severity} />
              <Badge value={selected.status} />
              <span className="text-xs text-slate-500">{selected.category}</span>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">{selected.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{selected.description || "No description provided."}</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                ["Reported By", selected.reportedBy],
                ["Source", selected.source],
                ["Contact", selected.contact || "Not provided"],
                ["Location", selected.location],
                ["Technician", selected.assignedTo || "Unassigned"],
                ["Reported Date", selected.reportedDate],
                ["Resolution Date", selected.resolvedDate || "Not resolved"],
                ["Repair Cost", money(selected.repairCost)],
                ["Image", selected.imageName || "No image attached"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="mb-2 font-semibold text-slate-800">Resolution Information</h4>
              <p className="text-sm text-slate-600">
                {selected.resolution || "No resolution has been recorded yet."}
              </p>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <Clock size={17} /> Repair History
              </h4>
              <div className="space-y-3">
                {(selected.history || []).map((item, index) => (
                  <div key={`${item.date}-${index}`} className="flex gap-3">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-sm text-slate-700">{item.action}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              <button
                onClick={() => openEdit(selected)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                <Pencil size={16} /> Edit Issue
              </button>

              {selected.status !== "Resolved" && selected.status !== "Closed" && (
                <button
                  onClick={() => changeStatus(selected, "Resolved")}
                  className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                >
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Resolution Modal */}
      {modal === "resolve" && selected && (
        <Modal title="Resolve Maintenance Issue" onClose={() => setModal("")} size="max-w-xl">
          <form onSubmit={resolveIssue} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              Recording the repair details for <strong>{selected.id}</strong> — {selected.title}
            </div>

            <Field label="Final Status">
              <select
                className={inputClass}
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
              >
                <option>Resolved</option>
                <option>Closed</option>
              </select>
            </Field>

            <Field label="Resolution / Repair Details *">
              <textarea
                rows={4}
                className={inputClass}
                value={form.resolution}
                onChange={(e) => updateField("resolution", e.target.value)}
                placeholder="What repair was performed? What was the final result?"
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Resolution Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.resolvedDate}
                  onChange={(e) => updateField("resolvedDate", e.target.value)}
                />
              </Field>

              <Field label="Repair Cost (₹)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.repairCost}
                  onChange={(e) => updateField("repairCost", e.target.value)}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-green-600 px-5 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Save Resolution
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
