
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  IndianRupee,
  Percent,
  BedDouble,
  CheckCircle2,
  Clock,
  Power,
  Utensils,
  Building2,
  Copy,
  Filter,
  Tag,
  Save,
  MoreHorizontal,
} from "lucide-react";

const roomTypes = [
  "Standard",
  "Deluxe",
  "Suite",
  "Family Room",
  "Presidential Suite",
];

const planTypes = [
  "Standard",
  "Non-refundable",
  "Weekend",
  "Seasonal",
  "Corporate",
  "Meal-inclusive",
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

const initialPlans = [
  {
    id: "RP-001",
    name: "Standard Flexible Rate",
    code: "STD-FLEX",
    type: "Standard",
    description: "Regular flexible room pricing with free cancellation.",
    roomTypes: ["Standard", "Deluxe", "Suite"],
    priceType: "Fixed",
    baseRate: 2500,
    adjustment: 0,
    startDate: "",
    endDate: "",
    days: [...weekdays],
    mealPlan: "Room Only",
    minStay: 1,
    maxStay: 30,
    cancellation: "Free cancellation up to 24 hours before check-in.",
    status: "Active",
  },
  {
    id: "RP-002",
    name: "Non-refundable Saver",
    code: "NON-REF",
    type: "Non-refundable",
    description: "Discounted pricing for bookings that cannot be refunded.",
    roomTypes: ["Standard", "Deluxe"],
    priceType: "Percentage",
    baseRate: 2500,
    adjustment: -10,
    startDate: "",
    endDate: "",
    days: [...weekdays],
    mealPlan: "Room Only",
    minStay: 1,
    maxStay: 15,
    cancellation: "Non-refundable. No cancellation or modification.",
    status: "Active",
  },
  {
    id: "RP-003",
    name: "Weekend Special",
    code: "WKND-15",
    type: "Weekend",
    description: "Special weekend pricing for leisure guests.",
    roomTypes: ["Deluxe", "Suite", "Family Room"],
    priceType: "Percentage",
    baseRate: 3000,
    adjustment: 15,
    startDate: "",
    endDate: "",
    days: ["Friday", "Saturday", "Sunday"],
    mealPlan: "Breakfast Included",
    minStay: 2,
    maxStay: 5,
    cancellation: "Free cancellation up to 48 hours before check-in.",
    status: "Active",
  },
  {
    id: "RP-004",
    name: "Winter Season Offer",
    code: "WINTER-25",
    type: "Seasonal",
    description: "Special rates for the winter travel season.",
    roomTypes: ["Standard", "Deluxe", "Suite", "Family Room"],
    priceType: "Percentage",
    baseRate: 3000,
    adjustment: -15,
    startDate: "2026-11-01",
    endDate: "2027-01-31",
    days: [...weekdays],
    mealPlan: "Breakfast Included",
    minStay: 2,
    maxStay: 14,
    cancellation: "Free cancellation up to 48 hours before check-in.",
    status: "Active",
  },
  {
    id: "RP-005",
    name: "Corporate Partner Rate",
    code: "CORP-20",
    type: "Corporate",
    description: "Negotiated pricing for approved corporate partners.",
    roomTypes: ["Standard", "Deluxe", "Suite"],
    priceType: "Percentage",
    baseRate: 3500,
    adjustment: -20,
    startDate: "",
    endDate: "",
    days: [...weekdays],
    mealPlan: "Breakfast Included",
    minStay: 1,
    maxStay: 30,
    cancellation: "Cancellation as per corporate agreement.",
    status: "Active",
  },
  {
    id: "RP-006",
    name: "Premium Breakfast Package",
    code: "MEAL-BF",
    type: "Meal-inclusive",
    description: "Room accommodation with complimentary breakfast.",
    roomTypes: ["Deluxe", "Suite", "Presidential Suite"],
    priceType: "Fixed",
    baseRate: 4500,
    adjustment: 500,
    startDate: "",
    endDate: "",
    days: [...weekdays],
    mealPlan: "Breakfast Included",
    minStay: 1,
    maxStay: 30,
    cancellation: "Free cancellation up to 24 hours before check-in.",
    status: "Active",
  },
];

const emptyForm = {
  name: "",
  code: "",
  type: "Standard",
  description: "",
  roomTypes: ["Standard"],
  priceType: "Fixed",
  baseRate: "",
  adjustment: "0",
  startDate: "",
  endDate: "",
  days: [...weekdays],
  mealPlan: "Room Only",
  minStay: "1",
  maxStay: "30",
  cancellation: "",
  status: "Active",
};

const typeStyles = {
  Standard: "bg-blue-50 text-blue-700",
  "Non-refundable": "bg-rose-50 text-rose-700",
  Weekend: "bg-violet-50 text-violet-700",
  Seasonal: "bg-amber-50 text-amber-700",
  Corporate: "bg-indigo-50 text-indigo-700",
  "Meal-inclusive": "bg-emerald-50 text-emerald-700",
};

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const calculateRate = (plan) => {
  const base = Number(plan.baseRate) || 0;
  const adjustment = Number(plan.adjustment) || 0;

  if (plan.priceType === "Percentage") {
    return Math.max(0, base + (base * adjustment) / 100);
  }

  return Math.max(0, base + adjustment);
};

export default function RatePlans() {
  const [plans, setPlans] = useState(initialPlans);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const stats = useMemo(() => {
    return {
      total: plans.length,
      active: plans.filter((plan) => plan.status === "Active").length,
      inactive: plans.filter((plan) => plan.status === "Inactive").length,
      seasonal: plans.filter((plan) => plan.type === "Seasonal").length,
      meal: plans.filter((plan) => plan.type === "Meal-inclusive").length,
    };
  }, [plans]);

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const query = search.toLowerCase();

      const matchesSearch =
        plan.name.toLowerCase().includes(query) ||
        plan.code.toLowerCase().includes(query) ||
        plan.type.toLowerCase().includes(query) ||
        plan.roomTypes.some((type) => type.toLowerCase().includes(query));

      const matchesType =
        typeFilter === "All" || plan.type === typeFilter;

      const matchesStatus =
        statusFilter === "All" || plan.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [plans, search, typeFilter, statusFilter]);

  const openCreateModal = () => {
    setEditingPlan(null);
    setForm({ ...emptyForm, roomTypes: ["Standard"], days: [...weekdays] });
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setForm({
      ...plan,
      roomTypes: [...plan.roomTypes],
      days: [...plan.days],
      baseRate: String(plan.baseRate),
      adjustment: String(plan.adjustment),
      minStay: String(plan.minStay),
      maxStay: String(plan.maxStay),
    });
    setShowModal(true);
  };

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

  const savePlan = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.code.trim()) {
      notify("Plan name and code are required.");
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

    const duplicateCode = plans.some(
      (plan) =>
        plan.code.toLowerCase() === form.code.trim().toLowerCase() &&
        plan.id !== editingPlan?.id
    );

    if (duplicateCode) {
      notify("This rate plan code already exists.");
      return;
    }

    const baseRate = Number(form.baseRate);
    const adjustment = Number(form.adjustment);
    const minStay = Number(form.minStay);
    const maxStay = Number(form.maxStay);

    if (!Number.isFinite(baseRate) || baseRate <= 0) {
      notify("Enter a valid base rate greater than zero.");
      return;
    }

    if (!Number.isFinite(adjustment)) {
      notify("Enter a valid price adjustment.");
      return;
    }

    if (
      form.priceType === "Percentage" &&
      adjustment < -100
    ) {
      notify("Percentage discount cannot exceed 100%.");
      return;
    }

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      notify("End date cannot be earlier than start date.");
      return;
    }

    if (!Number.isInteger(minStay) || minStay < 1) {
      notify("Minimum stay must be at least one night.");
      return;
    }

    if (!Number.isInteger(maxStay) || maxStay < minStay) {
      notify("Maximum stay must be greater than or equal to minimum stay.");
      return;
    }

    const planData = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      description: form.description.trim(),
      baseRate,
      adjustment,
      minStay,
      maxStay,
    };

    if (editingPlan) {
      setPlans((prev) =>
        prev.map((plan) =>
          plan.id === editingPlan.id ? { ...planData, id: plan.id } : plan
        )
      );
      notify("Rate plan updated successfully.");
    } else {
      setPlans((prev) => [
        { ...planData, id: `RP-${Date.now()}` },
        ...prev,
      ]);
      notify("Rate plan created successfully.");
    }

    setShowModal(false);
  };

  const toggleStatus = (plan) => {
    const nextStatus = plan.status === "Active" ? "Inactive" : "Active";

    setPlans((prev) =>
      prev.map((item) =>
        item.id === plan.id ? { ...item, status: nextStatus } : item
      )
    );

    notify(`Rate plan ${nextStatus.toLowerCase()}.`);
  };

  const deletePlan = (plan) => {
    if (!window.confirm(`Delete "${plan.name}"? This action cannot be undone.`)) {
      return;
    }

    setPlans((prev) => prev.filter((item) => item.id !== plan.id));
    notify("Rate plan deleted.");
  };

  const duplicatePlan = (plan) => {
    const copy = {
      ...plan,
      id: `RP-${Date.now()}`,
      name: `${plan.name} Copy`,
      code: `${plan.code}-COPY`,
      status: "Inactive",
    };

    setPlans((prev) => [copy, ...prev]);
    notify("Rate plan duplicated as inactive.");
  };

  const getDateLabel = (plan) => {
    if (!plan.startDate && !plan.endDate) return "No date restriction";
    if (plan.startDate && plan.endDate) {
      return `${plan.startDate} to ${plan.endDate}`;
    }
    if (plan.startDate) return `From ${plan.startDate}`;
    return `Until ${plan.endDate}`;
  };

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
              <span className="font-medium text-slate-700">Rate Plans</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Rate Plans
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create and manage pricing strategies for your room categories.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Rate Plan
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard title="Total Plans" value={stats.total} icon={Tag} color="blue" />
          <StatCard title="Active Plans" value={stats.active} icon={CheckCircle2} color="emerald" />
          <StatCard title="Inactive Plans" value={stats.inactive} icon={Power} color="slate" />
          <StatCard title="Seasonal Plans" value={stats.seasonal} icon={CalendarDays} color="amber" />
          <StatCard title="Meal Packages" value={stats.meal} icon={Utensils} color="violet" />
        </div>

        {/* Filters */}
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
                placeholder="Search by plan name, code or room type..."
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
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  PLAN TYPE
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                >
                  <option value="All">All Plan Types</option>
                  {planTypes.map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  STATUS
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Rate plans table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-2 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">All Rate Plans</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {filteredPlans.length} plans found
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Rate Plan</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Room Types</th>
                  <th className="px-5 py-3 font-semibold">Pricing</th>
                  <th className="px-5 py-3 font-semibold">Validity</th>
                  <th className="px-5 py-3 font-semibold">Meal Plan</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">{plan.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{plan.code}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${typeStyles[plan.type] || "bg-slate-100 text-slate-600"}`}>
                        {plan.type}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="max-w-[190px]">
                        <p className="text-sm text-slate-700">
                          {plan.roomTypes.slice(0, 2).join(", ")}
                          {plan.roomTypes.length > 2 && ` +${plan.roomTypes.length - 2}`}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {plan.roomTypes.length} room types
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {formatCurrency(calculateRate(plan))}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {plan.priceType === "Percentage"
                          ? `${plan.adjustment > 0 ? "+" : ""}${plan.adjustment}%`
                          : `${plan.adjustment >= 0 ? "+" : ""}${formatCurrency(plan.adjustment)}`}{" "}
                        adjustment
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {getDateLabel(plan)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                        <Utensils size={14} className="text-slate-400" />
                        {plan.mealPlan}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        plan.status === "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${
                          plan.status === "Active" ? "bg-emerald-500" : "bg-slate-400"
                        }`} />
                        {plan.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Duplicate"
                          onClick={() => duplicatePlan(plan)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          title="Edit"
                          onClick={() => openEditModal(plan)}
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title={plan.status === "Active" ? "Deactivate" : "Activate"}
                          onClick={() => toggleStatus(plan)}
                          className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                        >
                          <Power size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deletePlan(plan)}
                          className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPlans.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-14 text-center">
                      <Tag size={32} className="mx-auto text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">
                        No rate plans found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try adjusting your filters or create a new rate plan.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rate plan form modal */}
        {showModal && (
          <Modal
            title={editingPlan ? "Edit Rate Plan" : "Create Rate Plan"}
            onClose={() => setShowModal(false)}
          >
            <form onSubmit={savePlan} className="space-y-5">

              {/* Basic information */}
              <Section title="Basic Information" icon={Tag}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Plan Name" required>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className="form-input"
                      placeholder="e.g. Summer Special"
                    />
                  </Field>

                  <Field label="Plan Code" required>
                    <input
                      required
                      value={form.code}
                      onChange={(e) => updateForm("code", e.target.value)}
                      className="form-input"
                      placeholder="e.g. SUMMER-20"
                    />
                  </Field>

                  <Field label="Plan Type" required>
                    <select
                      value={form.type}
                      onChange={(e) => updateForm("type", e.target.value)}
                      className="form-input"
                    >
                      {planTypes.map((type) => (
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

                <Field label="Description">
                  <textarea
                    rows="2"
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    className="form-input resize-y"
                    placeholder="Describe this rate plan..."
                  />
                </Field>
              </Section>

              {/* Room mapping */}
              <Section title="Room Type Mapping" icon={BedDouble}>
                <p className="text-xs text-slate-500">
                  Select the room categories where this rate plan can be applied.
                </p>

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

              {/* Pricing */}
              <Section title="Pricing Rules" icon={IndianRupee}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Base Rate (₹)" required>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.baseRate}
                      onChange={(e) => updateForm("baseRate", e.target.value)}
                      className="form-input"
                      placeholder="2500"
                    />
                  </Field>

                  <Field label="Adjustment Type">
                    <select
                      value={form.priceType}
                      onChange={(e) => updateForm("priceType", e.target.value)}
                      className="form-input"
                    >
                      <option value="Fixed">Fixed Amount (₹)</option>
                      <option value="Percentage">Percentage (%)</option>
                    </select>
                  </Field>

                  <Field label={form.priceType === "Percentage" ? "Adjustment (%)" : "Adjustment Amount (₹)"}>
                    <input
                      type="number"
                      step="0.01"
                      value={form.adjustment}
                      onChange={(e) => updateForm("adjustment", e.target.value)}
                      className="form-input"
                      placeholder="0"
                    />
                  </Field>

                  <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                    <p className="text-xs font-medium text-blue-700">
                      Calculated Rate
                    </p>
                    <p className="mt-1 text-xl font-bold text-blue-900">
                      {formatCurrency(calculateRate(form))}
                    </p>
                    <p className="text-[11px] text-blue-600">
                      Before taxes and additional charges
                    </p>
                  </div>
                </div>
              </Section>

              {/* Validity */}
              <Section title="Validity & Restrictions" icon={CalendarDays}>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Valid From">
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)}
                      className="form-input"
                    />
                  </Field>

                  <Field label="Valid Until">
                    <input
                      type="date"
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(e) => updateForm("endDate", e.target.value)}
                      className="form-input"
                    />
                  </Field>

                  <Field label="Minimum Stay (Nights)">
                    <input
                      type="number"
                      min="1"
                      value={form.minStay}
                      onChange={(e) => updateForm("minStay", e.target.value)}
                      className="form-input"
                    />
                  </Field>

                  <Field label="Maximum Stay (Nights)">
                    <input
                      type="number"
                      min="1"
                      value={form.maxStay}
                      onChange={(e) => updateForm("maxStay", e.target.value)}
                      className="form-input"
                    />
                  </Field>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-slate-700">
                    Applicable Days
                  </p>
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

              {/* Meal and cancellation */}
              <Section title="Inclusions & Cancellation" icon={Utensils}>
                <Field label="Meal Plan">
                  <select
                    value={form.mealPlan}
                    onChange={(e) => updateForm("mealPlan", e.target.value)}
                    className="form-input"
                  >
                    <option>Room Only</option>
                    <option>Breakfast Included</option>
                    <option>Half Board</option>
                    <option>Full Board</option>
                    <option>All Inclusive</option>
                  </select>
                </Field>

                <Field label="Cancellation Policy">
                  <textarea
                    rows="2"
                    value={form.cancellation}
                    onChange={(e) => updateForm("cancellation", e.target.value)}
                    className="form-input resize-y"
                    placeholder="Enter cancellation and modification policy..."
                  />
                </Field>
              </Section>

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
                    {editingPlan ? "Save Changes" : "Create Rate Plan"}
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
    amber: "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
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
