
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Tag,
  TicketPercent,
  CalendarDays,
  Users,
  TrendingUp,
  Pencil,
  Trash2,
  Copy,
  Download,
  X,
  CheckCircle2,
  Ban,
  Clock,
  IndianRupee,
  Gift,
} from "lucide-react";

const initialPromotions = [
  {
    id: "PROMO-001",
    name: "Winter Stay Offer",
    code: "WINTER20",
    discountType: "Percentage",
    discountValue: 20,
    maxDiscount: 1500,
    minBookingAmount: 2000,
    roomTypes: ["Standard", "Deluxe"],
    minStay: 2,
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    usageLimit: 100,
    usageCount: 32,
    status: "Active",
    description: "Winter season discount for selected rooms.",
  },
  {
    id: "PROMO-002",
    name: "Weekend Getaway",
    code: "WEEKEND500",
    discountType: "Fixed",
    discountValue: 500,
    maxDiscount: 500,
    minBookingAmount: 3000,
    roomTypes: ["Deluxe", "Super Deluxe"],
    minStay: 1,
    startDate: "2026-10-01",
    endDate: "2026-12-31",
    usageLimit: 50,
    usageCount: 18,
    status: "Active",
    description: "Flat discount on weekend stays.",
  },
  {
    id: "PROMO-003",
    name: "Family Holiday",
    code: "FAMILY15",
    discountType: "Percentage",
    discountValue: 15,
    maxDiscount: 2000,
    minBookingAmount: 5000,
    roomTypes: ["Family Suite"],
    minStay: 3,
    startDate: "2026-12-01",
    endDate: "2027-01-15",
    usageLimit: 40,
    usageCount: 5,
    status: "Active",
    description: "Special savings for longer family stays.",
  },
  {
    id: "PROMO-004",
    name: "Early Bird Offer",
    code: "EARLY10",
    discountType: "Percentage",
    discountValue: 10,
    maxDiscount: 1000,
    minBookingAmount: 1500,
    roomTypes: ["All Room Types"],
    minStay: 2,
    startDate: "2026-09-01",
    endDate: "2026-10-31",
    usageLimit: 100,
    usageCount: 76,
    status: "Inactive",
    description: "Discount for bookings made in advance.",
  },
];

const roomTypeOptions = [
  "Standard",
  "Deluxe",
  "Super Deluxe",
  "Family Suite",
];

const emptyForm = {
  name: "",
  code: "",
  discountType: "Percentage",
  discountValue: "",
  maxDiscount: "",
  minBookingAmount: "",
  roomTypes: ["All Room Types"],
  minStay: 1,
  startDate: "",
  endDate: "",
  usageLimit: "",
  status: "Active",
  description: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Badge({ children, color = "slate" }) {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, size = "max-w-2xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-2xl bg-white shadow-xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function getPromotionStatus(promo) {
  if (promo.status === "Inactive") return "Inactive";
  if (promo.usageCount >= promo.usageLimit) return "Limit Reached";

  const today = new Date().toISOString().slice(0, 10);

  if (today < promo.startDate) return "Upcoming";
  if (today > promo.endDate) return "Expired";

  return "Active";
}

export default function Promotions() {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [discountFilter, setDiscountFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const activeCount = promotions.filter(
    (promo) => getPromotionStatus(promo) === "Active"
  ).length;

  const totalUsage = promotions.reduce(
    (sum, promo) => sum + promo.usageCount,
    0
  );

  const filteredPromotions = useMemo(() => {
    return promotions.filter((promo) => {
      const query = search.toLowerCase();

      const matchesSearch = `${promo.name} ${promo.code} ${promo.id}`
        .toLowerCase()
        .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        getPromotionStatus(promo) === statusFilter;

      const matchesDiscount =
        discountFilter === "All" ||
        promo.discountType === discountFilter;

      return matchesSearch && matchesStatus && matchesDiscount;
    });
  }, [promotions, search, statusFilter, discountFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (promo) => {
    setSelected(promo);
    setForm({
      ...promo,
      roomTypes: [...promo.roomTypes],
    });
    setModal("form");
  };

  const savePromotion = (e) => {
    e.preventDefault();

    const code = form.code.trim().toUpperCase().replace(/\s+/g, "");

    if (!code || !form.name.trim()) {
      alert("Please enter a promotion name and promo code.");
      return;
    }

    if (
      promotions.some(
        (promo) =>
          promo.code.toUpperCase() === code &&
          promo.id !== selected?.id
      )
    ) {
      alert("This promo code already exists. Please use another code.");
      return;
    }

    if (form.startDate > form.endDate) {
      alert("End date must be on or after the start date.");
      return;
    }

    const discountValue = Number(form.discountValue);
    const maxDiscount = Number(form.maxDiscount || 0);
    const minBookingAmount = Number(form.minBookingAmount || 0);
    const usageLimit = Number(form.usageLimit);

    if (
      !Number.isFinite(discountValue) ||
      discountValue <= 0 ||
      (form.discountType === "Percentage" && discountValue > 100)
    ) {
      alert("Enter a valid discount value. Percentage cannot exceed 100%.");
      return;
    }

    if (
      !Number.isFinite(usageLimit) ||
      usageLimit < 1 ||
      !Number.isInteger(usageLimit)
    ) {
      alert("Usage limit must be a whole number of at least 1.");
      return;
    }

    if (
      !Number.isInteger(Number(form.minStay)) ||
      Number(form.minStay) < 1 ||
      maxDiscount < 0 ||
      minBookingAmount < 0
    ) {
      alert("Check minimum stay and discount limit values.");
      return;
    }

    if (!form.roomTypes.length) {
      alert("Select at least one eligible room type.");
      return;
    }

    if (
      form.discountType === "Fixed" &&
      discountValue > minBookingAmount &&
      minBookingAmount > 0
    ) {
      alert("Fixed discount cannot exceed the minimum booking amount.");
      return;
    }

    const payload = {
      ...form,
      code,
      name: form.name.trim(),
      discountValue,
      maxDiscount:
        form.discountType === "Fixed" ? discountValue : maxDiscount,
      minBookingAmount,
      minStay: Number(form.minStay),
      usageLimit,
    };

    if (selected) {
      setPromotions((prev) =>
        prev.map((promo) =>
          promo.id === selected.id
            ? { ...payload, id: selected.id, usageCount: selected.usageCount }
            : promo
        )
      );
    } else {
      setPromotions((prev) => [
        {
          ...payload,
          id: `PROMO-${String(Date.now()).slice(-6)}`,
          usageCount: 0,
        },
        ...prev,
      ]);
    }

    setModal("");
  };

  const deletePromotion = (promo) => {
    if (!window.confirm(`Delete promotion ${promo.code}?`)) return;

    setPromotions((prev) =>
      prev.filter((item) => item.id !== promo.id)
    );
  };

  const toggleStatus = (promo) => {
    setPromotions((prev) =>
      prev.map((item) =>
        item.id === promo.id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const duplicatePromotion = (promo) => {
    setPromotions((prev) => [
      {
        ...promo,
        id: `PROMO-${String(Date.now()).slice(-6)}`,
        name: `${promo.name} Copy`,
        code: `${promo.code}COPY`,
        status: "Inactive",
        usageCount: 0,
      },
      ...prev,
    ]);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Promo code ${code} copied.`);
    } catch {
      alert(`Promo code: ${code}`);
    }
  };

  const toggleRoomType = (roomType) => {
    setForm((prev) => {
      if (roomType === "All Room Types") {
        return {
          ...prev,
          roomTypes: ["All Room Types"],
        };
      }

      const selectedTypes = prev.roomTypes.filter(
        (type) => type !== "All Room Types"
      );

      const updated = selectedTypes.includes(roomType)
        ? selectedTypes.filter((type) => type !== roomType)
        : [...selectedTypes, roomType];

      return {
        ...prev,
        roomTypes: updated.length ? updated : [],
      };
    });
  };

  const exportCSV = () => {
    const rows = [
      [
        "Promotion ID",
        "Name",
        "Promo Code",
        "Discount Type",
        "Discount Value",
        "Max Discount",
        "Minimum Booking",
        "Eligible Room Types",
        "Minimum Stay",
        "Start Date",
        "End Date",
        "Usage Limit",
        "Usage Count",
        "Status",
      ],
      ...filteredPromotions.map((promo) => [
        promo.id,
        promo.name,
        promo.code,
        promo.discountType,
        promo.discountValue,
        promo.maxDiscount,
        promo.minBookingAmount,
        promo.roomTypes.join("; "),
        promo.minStay,
        promo.startDate,
        promo.endDate,
        promo.usageLimit,
        promo.usageCount,
        getPromotionStatus(promo),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "hotel-promotions.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    if (status === "Active") return "green";
    if (status === "Upcoming") return "blue";
    if (status === "Limit Reached") return "yellow";
    if (status === "Expired") return "red";
    return "slate";
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Promotions & Offers
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create discount campaigns and manage promotional booking codes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} /> Export
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Create Promotion
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Promotions"
          value={promotions.length}
          subtitle="All created campaigns"
          icon={Tag}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Promotions"
          value={activeCount}
          subtitle="Currently available campaigns"
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Total Redemptions"
          value={totalUsage}
          subtitle="Recorded promotional uses"
          icon={TicketPercent}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Upcoming / Expired"
          value={promotions.filter((promo) =>
            ["Upcoming", "Expired"].includes(getPromotionStatus(promo))
          ).length}
          subtitle="Campaigns outside active dates"
          icon={CalendarDays}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className={`${inputClass} pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search promotion name or code..."
            />
          </div>

          <select
            className={inputClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Upcoming</option>
            <option>Expired</option>
            <option>Limit Reached</option>
          </select>

          <select
            className={inputClass}
            value={discountFilter}
            onChange={(e) => setDiscountFilter(e.target.value)}
          >
            <option value="All">All Discount Types</option>
            <option>Percentage</option>
            <option>Fixed</option>
          </select>
        </div>
      </div>

      {/* Promotions Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-800">Promotion Campaigns</h2>
          <p className="mt-1 text-xs text-slate-500">
            Review discount details, validity, usage and campaign status.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Promotion</th>
                <th className="px-5 py-3">Promo Code</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Eligible Rooms</th>
                <th className="px-5 py-3">Validity</th>
                <th className="px-5 py-3">Usage</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPromotions.map((promo) => {
                const status = getPromotionStatus(promo);
                const usagePercent = Math.min(
                  (promo.usageCount / promo.usageLimit) * 100,
                  100
                );

                return (
                  <tr key={promo.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {promo.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {promo.id}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-dashed border-blue-300 bg-blue-50 px-2.5 py-1 font-mono text-xs font-bold text-blue-700">
                          {promo.code}
                        </span>
                        <button
                          title="Copy code"
                          onClick={() => copyCode(promo.code)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Copy size={15} />
                        </button>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {promo.discountType === "Percentage"
                          ? `${promo.discountValue}% OFF`
                          : `${money(promo.discountValue)} OFF`}
                      </p>
                      {promo.discountType === "Percentage" && (
                        <p className="mt-1 text-xs text-slate-400">
                          Max {money(promo.maxDiscount)}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <div className="max-w-[160px]">
                        {promo.roomTypes.join(", ")}
                      </div>
                      <p className="mt-1 text-xs text-slate-400">
                        Min. {promo.minStay} night(s)
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs text-slate-600">
                      <p>{formatDate(promo.startDate)}</p>
                      <p className="mt-1 text-slate-400">
                        to {formatDate(promo.endDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {promo.usageCount} / {promo.usageLimit}
                      </p>
                      <div className="mt-2 h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <Badge color={getStatusColor(status)}>{status}</Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="Edit promotion"
                          onClick={() => openEdit(promo)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Duplicate promotion"
                          onClick={() => duplicatePromotion(promo)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          title={promo.status === "Active" ? "Deactivate" : "Activate"}
                          onClick={() => toggleStatus(promo)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-600"
                        >
                          {promo.status === "Active" ? (
                            <Ban size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </button>
                        <button
                          title="Delete promotion"
                          onClick={() => deletePromotion(promo)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredPromotions.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                    No promotions found. Try changing your filters.
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
          title={selected ? "Edit Promotion" : "Create New Promotion"}
          onClose={() => setModal("")}
        >
          <form onSubmit={savePromotion} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Promotion Name *">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Winter Stay Offer"
                  required
                />
              </Field>

              <Field label="Promo Code *" hint="Spaces will be removed automatically.">
                <input
                  className={inputClass}
                  value={form.code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="e.g. WINTER20"
                  required
                />
              </Field>

              <Field label="Discount Type">
                <select
                  className={inputClass}
                  value={form.discountType}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountType: e.target.value,
                    }))
                  }
                >
                  <option>Percentage</option>
                  <option>Fixed</option>
                </select>
              </Field>

              <Field label={form.discountType === "Percentage" ? "Discount Percentage (%)" : "Fixed Discount (₹)"}>
                <input
                  type="number"
                  min="0.01"
                  max={form.discountType === "Percentage" ? "100" : undefined}
                  step="0.01"
                  className={inputClass}
                  value={form.discountValue}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      discountValue: e.target.value,
                    }))
                  }
                  required
                />
              </Field>

              {form.discountType === "Percentage" && (
                <Field label="Maximum Discount (₹)">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form.maxDiscount}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        maxDiscount: e.target.value,
                      }))
                    }
                    placeholder="e.g. 1500"
                  />
                </Field>
              )}

              <Field label="Minimum Booking Amount (₹)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.minBookingAmount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      minBookingAmount: e.target.value,
                    }))
                  }
                  placeholder="e.g. 2000"
                />
              </Field>

              <Field label="Minimum Stay (Nights)">
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  value={form.minStay}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, minStay: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field label="Usage Limit">
                <input
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass}
                  value={form.usageLimit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      usageLimit: e.target.value,
                    }))
                  }
                  placeholder="Maximum number of redemptions"
                  required
                />
              </Field>

              <Field label="Start Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field label="End Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  min={form.startDate || undefined}
                  required
                />
              </Field>

              <Field label="Promotion Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">
                Eligible Room Types *
              </p>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {["All Room Types", ...roomTypeOptions].map((roomType) => (
                  <label
                    key={roomType}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.roomTypes.includes(roomType)}
                      onChange={() => toggleRoomType(roomType)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {roomType}
                  </label>
                ))}
              </div>
            </div>

            <Field label="Description">
              <textarea
                rows="3"
                className={inputClass}
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe the offer and its conditions..."
              />
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selected ? "Update Promotion" : "Create Promotion"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Help Note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <Gift className="shrink-0 text-blue-600" size={21} />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Promotion application rules
            </h3>
            <p className="mt-1 text-xs leading-5 text-blue-800">
              A promotion should be applied only when its code is valid, the
              booking date is within its validity period, the selected room type
              is eligible, minimum stay and booking amount conditions are met,
              and the usage limit has not been reached. The backend must validate
              these conditions again before confirming a booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
