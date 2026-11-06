
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Ban,
  Clock,
  BedDouble,
  CheckCircle2,
  Power,
  AlertTriangle,
  Filter,
  Save,
  Building2,
  ShieldAlert,
  CalendarX,
  CalendarCheck,
  MoreHorizontal,
} from "lucide-react";

const roomTypes = [
  "Standard",
  "Deluxe",
  "Suite",
  "Family Room",
  "Presidential Suite",
];

const restrictionTypes = [
  "Minimum Stay",
  "Maximum Stay",
  "Closed to Arrival",
  "Closed to Departure",
  "Stop Sell",
  "Advance Booking",
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialRestrictions = [
  {
    id: "REST-001",
    name: "Weekend Minimum Stay",
    type: "Minimum Stay",
    roomTypes: ["Standard", "Deluxe", "Suite"],
    startDate: "2026-11-06",
    endDate: "2026-12-31",
    days: ["Friday", "Saturday"],
    minStay: 2,
    maxStay: "",
    advanceDays: "",
    reason: "Require a minimum two-night stay on weekends.",
    status: "Active",
  },
  {
    id: "REST-002",
    name: "Holiday Stop Sell",
    type: "Stop Sell",
    roomTypes: ["Standard", "Deluxe"],
    startDate: "2026-12-24",
    endDate: "2026-12-26",
    days: [...weekdays],
    minStay: "",
    maxStay: "",
    advanceDays: "",
    reason: "Rooms unavailable for sale during the holiday period.",
    status: "Active",
  },
  {
    id: "REST-003",
    name: "Suite Maximum Stay",
    type: "Maximum Stay",
    roomTypes: ["Suite", "Presidential Suite"],
    startDate: "2026-11-01",
    endDate: "2027-03-31",
    days: [...weekdays],
    minStay: "",
    maxStay: 14,
    advanceDays: "",
    reason: "Limit long-stay bookings for premium rooms.",
    status: "Active",
  },
  {
    id: "REST-004",
    name: "Sunday Closed to Arrival",
    type: "Closed to Arrival",
    roomTypes: ["Family Room"],
    startDate: "2026-11-01",
    endDate: "2026-12-31",
    days: ["Sunday"],
    minStay: "",
    maxStay: "",
    advanceDays: "",
    reason: "No check-ins accepted on Sundays.",
    status: "Active",
  },
  {
    id: "REST-005",
    name: "Advance Booking Limit",
    type: "Advance Booking",
    roomTypes: ["Standard", "Deluxe", "Family Room"],
    startDate: "2026-11-01",
    endDate: "2027-01-31",
    days: [...weekdays],
    minStay: "",
    maxStay: "",
    advanceDays: 90,
    reason: "Bookings can only be made up to 90 days in advance.",
    status: "Active",
  },
  {
    id: "REST-006",
    name: "Maintenance Stop Sell",
    type: "Stop Sell",
    roomTypes: ["Presidential Suite"],
    startDate: "2026-11-15",
    endDate: "2026-11-17",
    days: [...weekdays],
    minStay: "",
    maxStay: "",
    advanceDays: "",
    reason: "Planned maintenance closure.",
    status: "Inactive",
  },
];

const emptyForm = {
  name: "",
  type: "Minimum Stay",
  roomTypes: ["Standard"],
  startDate: "",
  endDate: "",
  days: [...weekdays],
  minStay: "2",
  maxStay: "",
  advanceDays: "",
  reason: "",
  status: "Active",
};

const typeStyles = {
  "Minimum Stay": "bg-blue-50 text-blue-700",
  "Maximum Stay": "bg-violet-50 text-violet-700",
  "Closed to Arrival": "bg-amber-50 text-amber-700",
  "Closed to Departure": "bg-orange-50 text-orange-700",
  "Stop Sell": "bg-rose-50 text-rose-700",
  "Advance Booking": "bg-indigo-50 text-indigo-700",
};

const typeIcons = {
  "Minimum Stay": Clock,
  "Maximum Stay": Clock,
  "Closed to Arrival": CalendarX,
  "Closed to Departure": CalendarCheck,
  "Stop Sell": Ban,
  "Advance Booking": CalendarDays,
};

const formatDate = (date) => {
  if (!date) return "Not specified";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getRuleSummary = (rule) => {
  switch (rule.type) {
    case "Minimum Stay":
      return `Minimum ${rule.minStay} night(s)`;
    case "Maximum Stay":
      return `Maximum ${rule.maxStay} night(s)`;
    case "Closed to Arrival":
      return "Check-in not allowed";
    case "Closed to Departure":
      return "Check-out not allowed";
    case "Stop Sell":
      return "Bookings not allowed";
    case "Advance Booking":
      return `Maximum ${rule.advanceDays} days in advance`;
    default:
      return "Custom restriction";
  }
};

export default function RoomRestrictions() {
  const [restrictions, setRestrictions] = useState(initialRestrictions);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const stats = useMemo(() => ({
    total: restrictions.length,
    active: restrictions.filter((r) => r.status === "Active").length,
    inactive: restrictions.filter((r) => r.status === "Inactive").length,
    stopSell: restrictions.filter(
      (r) => r.type === "Stop Sell" && r.status === "Active"
    ).length,
    stayRules: restrictions.filter(
      (r) =>
        ["Minimum Stay", "Maximum Stay"].includes(r.type) &&
        r.status === "Active"
    ).length,
  }), [restrictions]);

  const filteredRestrictions = useMemo(() => {
    return restrictions.filter((rule) => {
      const query = search.toLowerCase();

      const matchesSearch =
        rule.name.toLowerCase().includes(query) ||
        rule.type.toLowerCase().includes(query) ||
        rule.roomTypes.some((type) => type.toLowerCase().includes(query)) ||
        rule.reason.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || rule.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || rule.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [restrictions, search, typeFilter, statusFilter]);

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleRoomType = (type) => {
    setForm((prev) => ({
      ...prev,
      roomTypes: prev.roomTypes.includes(type)
        ? prev.roomTypes.filter((item) => item !== type)
        : [...prev.roomTypes, type],
    }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((item) => item !== day)
        : [...prev.days, day],
    }));
  };

  const openCreateModal = () => {
    setEditingRule(null);
    setForm({ ...emptyForm, roomTypes: ["Standard"], days: [...weekdays] });
    setShowModal(true);
  };

  const openEditModal = (rule) => {
    setEditingRule(rule);
    setForm({
      ...rule,
      roomTypes: [...rule.roomTypes],
      days: [...rule.days],
      minStay: String(rule.minStay ?? ""),
      maxStay: String(rule.maxStay ?? ""),
      advanceDays: String(rule.advanceDays ?? ""),
    });
    setShowModal(true);
  };

  const saveRestriction = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      notify("Please enter a restriction name.");
      return;
    }

    if (!form.startDate || !form.endDate) {
      notify("Please select both start and end dates.");
      return;
    }

    if (form.endDate < form.startDate) {
      notify("End date cannot be earlier than start date.");
      return;
    }

    if (form.roomTypes.length === 0) {
      notify("Select at least one room type.");
      return;
    }

    if (form.days.length === 0) {
      notify("Select at least one applicable day.");
      return;
    }

    let minStay = "";
    let maxStay = "";
    let advanceDays = "";

    if (form.type === "Minimum Stay") {
      minStay = Number(form.minStay);

      if (!Number.isInteger(minStay) || minStay < 1) {
        notify("Minimum stay must be at least one night.");
        return;
      }
    }

    if (form.type === "Maximum Stay") {
      maxStay = Number(form.maxStay);

      if (!Number.isInteger(maxStay) || maxStay < 1) {
        notify("Maximum stay must be at least one night.");
        return;
      }
    }

    if (form.type === "Advance Booking") {
      advanceDays = Number(form.advanceDays);

      if (!Number.isInteger(advanceDays) || advanceDays < 1) {
        notify("Advance booking limit must be at least one day.");
        return;
      }
    }

    if (
      form.type === "Minimum Stay" &&
      form.maxStay !== "" &&
      Number(form.maxStay) < minStay
    ) {
      notify("Maximum stay cannot be lower than minimum stay.");
      return;
    }

    const ruleData = {
      ...form,
      name: form.name.trim(),
      reason: form.reason.trim(),
      minStay,
      maxStay,
      advanceDays,
    };

    if (editingRule) {
      setRestrictions((prev) =>
        prev.map((rule) =>
          rule.id === editingRule.id
            ? { ...ruleData, id: rule.id }
            : rule
        )
      );
      notify("Restriction updated successfully.");
    } else {
      setRestrictions((prev) => [
        { ...ruleData, id: `REST-${Date.now()}` },
        ...prev,
      ]);
      notify("Restriction created successfully.");
    }

    setShowModal(false);
  };

  const toggleStatus = (rule) => {
    const nextStatus = rule.status === "Active" ? "Inactive" : "Active";

    setRestrictions((prev) =>
      prev.map((item) =>
        item.id === rule.id ? { ...item, status: nextStatus } : item
      )
    );

    notify(`Restriction ${nextStatus.toLowerCase()}.`);
  };

  const deleteRestriction = (rule) => {
    if (!window.confirm(`Delete "${rule.name}"?`)) return;

    setRestrictions((prev) =>
      prev.filter((item) => item.id !== rule.id)
    );

    notify("Restriction deleted.");
  };

  const selectAllRoomTypes = () => {
    updateForm(
      "roomTypes",
      form.roomTypes.length === roomTypes.length ? [] : [...roomTypes]
    );
  };

  const selectAllDays = () => {
    updateForm(
      "days",
      form.days.length === weekdays.length ? [] : [...weekdays]
    );
  };

  const activeTypeOptions = restrictionTypes.map((type) => ({
    type,
    count: restrictions.filter(
      (rule) => rule.type === type && rule.status === "Active"
    ).length,
  }));

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={15} />
              Property Operations
              <span>/</span>
              <span className="font-medium text-slate-700">Restrictions</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Room Restrictions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Control booking conditions, arrival rules, stay limits and room sales.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Restriction
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard title="Total Rules" value={stats.total} icon={ShieldAlert} color="blue" />
          <StatCard title="Active Rules" value={stats.active} icon={CheckCircle2} color="emerald" />
          <StatCard title="Inactive Rules" value={stats.inactive} icon={Power} color="slate" />
          <StatCard title="Active Stop Sell" value={stats.stopSell} icon={Ban} color="rose" />
          <StatCard title="Stay Restrictions" value={stats.stayRules} icon={Clock} color="amber" />
        </div>

        {/* Restriction type overview */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Restriction Categories</h2>
            <p className="mt-1 text-xs text-slate-500">
              Active rules grouped by restriction type.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {activeTypeOptions.map(({ type, count }) => {
              const Icon = typeIcons[type];

              return (
                <button
                  key={type}
                  onClick={() =>
                    setTypeFilter(typeFilter === type ? "All" : type)
                  }
                  className={`rounded-xl border p-3 text-left transition ${
                    typeFilter === type
                      ? "border-blue-400 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${typeStyles[type]}`}>
                    <Icon size={17} />
                  </div>
                  <p className="mt-3 text-xl font-bold text-slate-900">{count}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">{type}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search and filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search restrictions, room types or descriptions..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium ${
                showFilters
                  ? "border-blue-200 bg-blue-50 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={16} />
              Filters
            </button>

            <button
              onClick={() => {
                setSearch("");
                setTypeFilter("All");
                setStatusFilter("All");
              }}
              className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
              <Field label="Restriction Type">
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="All">All Restriction Types</option>
                  {restrictionTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="form-input"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </Field>
            </div>
          )}
        </div>

        {/* Restrictions table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">All Restrictions</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {filteredRestrictions.length} restrictions found
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Restriction</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Room Types</th>
                  <th className="px-5 py-3 font-semibold">Rule</th>
                  <th className="px-5 py-3 font-semibold">Date Range</th>
                  <th className="px-5 py-3 font-semibold">Applicable Days</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRestrictions.map((rule) => {
                  const Icon = typeIcons[rule.type];

                  return (
                    <tr key={rule.id} className="transition hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-900">{rule.name}</p>
                        <p className="mt-1 text-xs text-slate-400">{rule.id}</p>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[rule.type]}`}>
                          <Icon size={12} />
                          {rule.type}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[170px] text-sm text-slate-700">
                          {rule.roomTypes.slice(0, 2).join(", ")}
                          {rule.roomTypes.length > 2 && ` +${rule.roomTypes.length - 2}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {rule.roomTypes.length} room types
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {getRuleSummary(rule)}
                        </p>
                        <p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">
                          {rule.reason || "No description"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <CalendarDays size={14} className="text-slate-400" />
                          <span>
                            {formatDate(rule.startDate)}
                            <span className="mx-1 text-slate-400">–</span>
                            {formatDate(rule.endDate)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {rule.days.length === 7
                            ? "Every day"
                            : rule.days.map((day) => day.slice(0, 3)).join(", ")}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          rule.status === "Active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            rule.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                          }`} />
                          {rule.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="Edit"
                            onClick={() => openEditModal(rule)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            title={rule.status === "Active" ? "Deactivate" : "Activate"}
                            onClick={() => toggleStatus(rule)}
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                          >
                            <Power size={16} />
                          </button>

                          <button
                            title="Delete"
                            onClick={() => deleteRestriction(rule)}
                            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRestrictions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-14 text-center">
                      <ShieldAlert size={32} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">
                        No restrictions found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Change your filters or create a new restriction.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / edit modal */}
        {showModal && (
          <Modal
            title={editingRule ? "Edit Restriction" : "Add Restriction"}
            onClose={() => setShowModal(false)}
          >
            <form onSubmit={saveRestriction} className="space-y-5">

              <Section title="Restriction Details" icon={ShieldAlert}>
                <Field label="Restriction Name" required>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    className="form-input"
                    placeholder="e.g. Christmas Stop Sell"
                  />
                </Field>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Restriction Type" required>
                    <select
                      value={form.type}
                      onChange={(e) => {
                        const type = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          type,
                          minStay: type === "Minimum Stay" ? "2" : "",
                          maxStay: type === "Maximum Stay" ? "14" : "",
                          advanceDays: type === "Advance Booking" ? "90" : "",
                        }));
                      }}
                      className="form-input"
                    >
                      {restrictionTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(e) => updateForm("status", e.target.value)}
                      className="form-input"
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>
                </div>

                <Field label="Reason / Description">
                  <textarea
                    rows="2"
                    value={form.reason}
                    onChange={(e) => updateForm("reason", e.target.value)}
                    className="form-input resize-y"
                    placeholder="Explain why this restriction is being applied..."
                  />
                </Field>
              </Section>

              <Section title="Room Type Assignment" icon={BedDouble}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Select the room categories affected by this rule.
                  </p>
                  <button
                    type="button"
                    onClick={selectAllRoomTypes}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    {form.roomTypes.length === roomTypes.length ? "Clear All" : "Select All"}
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {roomTypes.map((type) => (
                    <label
                      key={type}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition ${
                        form.roomTypes.includes(type)
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.roomTypes.includes(type)}
                        onChange={() => toggleRoomType(type)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </Section>

              <Section title="Date Range" icon={CalendarDays}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Start Date" required>
                    <input
                      type="date"
                      required
                      value={form.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)}
                      className="form-input"
                    />
                  </Field>

                  <Field label="End Date" required>
                    <input
                      type="date"
                      required
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(e) => updateForm("endDate", e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-700">
                      Applicable Days
                    </p>
                    <button
                      type="button"
                      onClick={selectAllDays}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      {form.days.length === weekdays.length ? "Clear All" : "Select All"}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {weekdays.map((day) => (
                      <label
                        key={day}
                        className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition ${
                          form.days.includes(day)
                            ? "border-blue-300 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.days.includes(day)}
                          onChange={() => toggleDay(day)}
                          className="accent-blue-600"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>
              </Section>

              {/* Type-specific fields */}
              {(form.type === "Minimum Stay" ||
                form.type === "Maximum Stay" ||
                form.type === "Advance Booking") && (
                <Section title="Restriction Rule" icon={Clock}>
                  {form.type === "Minimum Stay" && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field label="Minimum Stay (Nights)" required>
                        <input
                          type="number"
                          min="1"
                          required
                          value={form.minStay}
                          onChange={(e) => updateForm("minStay", e.target.value)}
                          className="form-input"
                          placeholder="2"
                        />
                      </Field>

                      <Field label="Optional Maximum Stay (Nights)">
                        <input
                          type="number"
                          min="1"
                          value={form.maxStay}
                          onChange={(e) => updateForm("maxStay", e.target.value)}
                          className="form-input"
                          placeholder="No maximum"
                        />
                      </Field>
                    </div>
                  )}

                  {form.type === "Maximum Stay" && (
                    <Field label="Maximum Stay (Nights)" required>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.maxStay}
                        onChange={(e) => updateForm("maxStay", e.target.value)}
                        className="form-input"
                        placeholder="14"
                      />
                    </Field>
                  )}

                  {form.type === "Advance Booking" && (
                    <Field label="Maximum Advance Booking (Days)" required>
                      <input
                        type="number"
                        min="1"
                        required
                        value={form.advanceDays}
                        onChange={(e) => updateForm("advanceDays", e.target.value)}
                        className="form-input"
                        placeholder="90"
                      />
                    </Field>
                  )}
                </Section>
              )}

              {(form.type === "Stop Sell" ||
                form.type === "Closed to Arrival" ||
                form.type === "Closed to Departure") && (
                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800">
                      Booking restriction
                    </p>
                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      {form.type === "Stop Sell"
                        ? "New bookings will be blocked for the selected room types and applicable dates."
                        : form.type === "Closed to Arrival"
                        ? "Guests will not be allowed to check in on the selected dates."
                        : "Guests will not be allowed to check out on the selected dates."}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Save size={16} />
                    {editingRule ? "Save Changes" : "Create Restriction"}
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        )}

        {toast && (
          <div className="fixed bottom-5 right-5 z-[100] rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
            {toast}
          </div>
        )}

        <style>{`
          .form-input {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 9px;
            padding: 10px 12px;
            font-size: 14px;
            outline: none;
            background: white;
            color: #0f172a;
          }
          .form-input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Icon size={16} />
        </div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}
