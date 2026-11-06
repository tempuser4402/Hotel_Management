
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  IndianRupee,
  CalendarDays,
  TrendingUp,
  BedDouble,
  Pencil,
  Trash2,
  Copy,
  History,
  Download,
  X,
  Settings2,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
} from "lucide-react";

const initialRoomTypes = [
  {
    id: "RT-001",
    name: "Standard",
    rooms: 12,
    basePrice: 2000,
    weekendPrice: 2300,
    seasonalPrice: 2600,
    status: "Active",
  },
  {
    id: "RT-002",
    name: "Deluxe",
    rooms: 10,
    basePrice: 3000,
    weekendPrice: 3500,
    seasonalPrice: 4000,
    status: "Active",
  },
  {
    id: "RT-003",
    name: "Super Deluxe",
    rooms: 6,
    basePrice: 4000,
    weekendPrice: 4500,
    seasonalPrice: 5000,
    status: "Active",
  },
  {
    id: "RT-004",
    name: "Family Suite",
    rooms: 4,
    basePrice: 5500,
    weekendPrice: 6000,
    seasonalPrice: 7000,
    status: "Active",
  },
];

const initialRules = [
  {
    id: "PR-001",
    name: "Weekend Standard Rate",
    roomType: "Standard",
    type: "Weekend",
    startDate: "2026-11-01",
    endDate: "2027-03-31",
    rate: 2300,
    adjustmentType: "Fixed",
    adjustment: 2300,
    priority: "Medium",
    status: "Active",
  },
  {
    id: "PR-002",
    name: "Winter Season Deluxe",
    roomType: "Deluxe",
    type: "Seasonal",
    startDate: "2026-11-01",
    endDate: "2027-02-28",
    rate: 4000,
    adjustmentType: "Fixed",
    adjustment: 4000,
    priority: "High",
    status: "Active",
  },
  {
    id: "PR-003",
    name: "Festival Special",
    roomType: "All Room Types",
    type: "Special",
    startDate: "2026-11-10",
    endDate: "2026-11-15",
    rate: 3200,
    adjustmentType: "Percentage",
    adjustment: 20,
    priority: "High",
    status: "Active",
  },
  {
    id: "PR-004",
    name: "High Demand Adjustment",
    roomType: "Super Deluxe",
    type: "Demand Based",
    startDate: "2026-11-20",
    endDate: "2026-11-30",
    rate: 4800,
    adjustmentType: "Percentage",
    adjustment: 20,
    priority: "Medium",
    status: "Active",
  },
];

const initialHistory = [
  {
    id: "H-001",
    roomType: "Standard",
    oldRate: 1800,
    newRate: 2000,
    reason: "Base rate revision",
    date: "2026-10-20",
    updatedBy: "Admin",
  },
  {
    id: "H-002",
    roomType: "Deluxe",
    oldRate: 2800,
    newRate: 3000,
    reason: "Seasonal price adjustment",
    date: "2026-10-18",
    updatedBy: "Admin",
  },
  {
    id: "H-003",
    roomType: "Family Suite",
    oldRate: 5000,
    newRate: 5500,
    reason: "Demand-based revision",
    date: "2026-10-15",
    updatedBy: "Manager",
  },
];

const emptyRule = {
  name: "",
  roomType: "Standard",
  type: "Date Based",
  startDate: "",
  endDate: "",
  rate: "",
  adjustmentType: "Fixed",
  adjustment: "",
  priority: "Medium",
  status: "Active",
};

const emptyBulk = {
  roomType: "All Room Types",
  adjustmentType: "Percentage",
  adjustment: "",
  reason: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Badge({ children, color = "slate" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, size = "max-w-2xl" }) {
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

function getEffectiveRate(room, rules, date) {
  const applicable = rules
    .filter((rule) => {
      if (rule.status !== "Active") return false;
      if (rule.roomType !== "All Room Types" && rule.roomType !== room.name) return false;
      if (date < rule.startDate || date > rule.endDate) return false;

      if (rule.type === "Weekend") {
        const day = new Date(`${date}T00:00:00`).getDay();
        return day === 0 || day === 6;
      }

      return true;
    })
    .sort((a, b) => {
      const priority = { High: 3, Medium: 2, Low: 1 };
      return priority[b.priority] - priority[a.priority];
    });

  if (applicable.length > 0) {
    const rule = applicable[0];

    if (rule.adjustmentType === "Percentage") {
      return Math.round(room.basePrice * (1 + Number(rule.adjustment) / 100));
    }

    return Number(rule.rate || rule.adjustment || room.basePrice);
  }

  return room.basePrice;
}

export default function RoomPricing() {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes);
  const [rules, setRules] = useState(initialRules);
  const [history, setHistory] = useState(initialHistory);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("room-types");

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [ruleForm, setRuleForm] = useState(emptyRule);
  const [bulkForm, setBulkForm] = useState(emptyBulk);
  const [rateForm, setRateForm] = useState({
    basePrice: "",
    weekendPrice: "",
    seasonalPrice: "",
    reason: "",
  });

  const [previewDate, setPreviewDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const filteredRooms = useMemo(
    () =>
      roomTypes.filter((room) => {
        const matchesSearch = `${room.name} ${room.id}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return (
          matchesSearch &&
          (statusFilter === "All" || room.status === statusFilter)
        );
      }),
    [roomTypes, search, statusFilter]
  );

  const filteredRules = useMemo(
    () =>
      rules.filter((rule) => {
        const matchesSearch = `${rule.name} ${rule.roomType} ${rule.id}`
          .toLowerCase()
          .includes(search.toLowerCase());

        return (
          matchesSearch &&
          (typeFilter === "All" || rule.type === typeFilter) &&
          (statusFilter === "All" || rule.status === statusFilter)
        );
      }),
    [rules, search, typeFilter, statusFilter]
  );

  const activeRules = rules.filter((rule) => rule.status === "Active");

  const openRuleForm = (rule = null) => {
    setSelected(rule);
    setRuleForm(rule ? { ...rule } : emptyRule);
    setModal("rule");
  };

  const saveRule = (e) => {
    e.preventDefault();

    if (!ruleForm.name.trim()) {
      alert("Please enter a pricing rule name.");
      return;
    }

    if (ruleForm.startDate > ruleForm.endDate) {
      alert("End date must be on or after the start date.");
      return;
    }

    if (Number(ruleForm.adjustment) < 0 || Number(ruleForm.rate) < 0) {
      alert("Pricing values cannot be negative.");
      return;
    }

    const payload = {
      ...ruleForm,
      rate: Number(ruleForm.rate || 0),
      adjustment: Number(ruleForm.adjustment || 0),
    };

    if (selected) {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === selected.id ? { ...payload, id: selected.id } : rule
        )
      );
    } else {
      setRules((prev) => [
        { ...payload, id: `PR-${String(Date.now()).slice(-6)}` },
        ...prev,
      ]);
    }

    setModal("");
  };

  const deleteRule = (rule) => {
    if (!window.confirm(`Delete pricing rule "${rule.name}"?`)) return;
    setRules((prev) => prev.filter((item) => item.id !== rule.id));
  };

  const toggleRule = (rule) => {
    setRules((prev) =>
      prev.map((item) =>
        item.id === rule.id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  const openRateEditor = (room) => {
    setSelected(room);
    setRateForm({
      basePrice: String(room.basePrice),
      weekendPrice: String(room.weekendPrice),
      seasonalPrice: String(room.seasonalPrice),
      reason: "",
    });
    setModal("rate");
  };

  const saveRoomRates = (e) => {
    e.preventDefault();

    const values = [
      rateForm.basePrice,
      rateForm.weekendPrice,
      rateForm.seasonalPrice,
    ];

    if (values.some((value) => value === "" || Number(value) < 0)) {
      alert("Enter valid non-negative prices for all rate fields.");
      return;
    }

    const updated = {
      ...selected,
      basePrice: Number(rateForm.basePrice),
      weekendPrice: Number(rateForm.weekendPrice),
      seasonalPrice: Number(rateForm.seasonalPrice),
    };

    setRoomTypes((prev) =>
      prev.map((room) => (room.id === selected.id ? updated : room))
    );

    setHistory((prev) => [
      {
        id: `H-${Date.now()}`,
        roomType: selected.name,
        oldRate: selected.basePrice,
        newRate: updated.basePrice,
        reason: rateForm.reason || "Room rate updated",
        date: new Date().toISOString().slice(0, 10),
        updatedBy: "Admin",
      },
      ...prev,
    ]);

    setModal("");
  };

  const applyBulkUpdate = (e) => {
    e.preventDefault();

    const amount = Number(bulkForm.adjustment);

    if (!bulkForm.adjustment || !Number.isFinite(amount) || amount === 0) {
      alert("Enter a non-zero pricing adjustment.");
      return;
    }

    if (bulkForm.adjustmentType === "Percentage" && amount <= -100) {
      alert("Percentage adjustment cannot be -100% or lower.");
      return;
    }

    const targets = roomTypes.filter(
      (room) =>
        room.status === "Active" &&
        (bulkForm.roomType === "All Room Types" ||
          room.name === bulkForm.roomType)
    );

    if (!targets.length) {
      alert("No active room types found for this update.");
      return;
    }

    if (!window.confirm(`Apply this update to ${targets.length} room type(s)?`)) {
      return;
    }

    const changes = targets.map((room) => {
      const newPrice =
        bulkForm.adjustmentType === "Percentage"
          ? Math.round(room.basePrice * (1 + amount / 100))
          : room.basePrice + amount;

      return { ...room, basePrice: newPrice };
    });

    if (changes.some((room) => room.basePrice < 0)) {
      alert("This update would create a negative room price.");
      return;
    }

    setRoomTypes((prev) =>
      prev.map((room) => changes.find((change) => change.id === room.id) || room)
    );

    setHistory((prev) => [
      ...changes.map((room) => {
        const oldRoom = targets.find((target) => target.id === room.id);
        return {
          id: `H-${room.id}-${Date.now()}`,
          roomType: room.name,
          oldRate: oldRoom.basePrice,
          newRate: room.basePrice,
          reason: bulkForm.reason || "Bulk pricing update",
          date: new Date().toISOString().slice(0, 10),
          updatedBy: "Admin",
        };
      }),
      ...prev,
    ]);

    setModal("");
    setBulkForm(emptyBulk);
  };

  const duplicateRule = (rule) => {
    setRules((prev) => [
      {
        ...rule,
        id: `PR-${String(Date.now()).slice(-6)}`,
        name: `${rule.name} Copy`,
        status: "Inactive",
      },
      ...prev,
    ]);
  };

  const deleteRoom = (room) => {
    if (!window.confirm(`Delete ${room.name}?`)) return;
    setRoomTypes((prev) => prev.filter((item) => item.id !== room.id));
  };

  const exportCSV = () => {
    const rows = [
      ["Room Type", "Base Price", "Weekend Price", "Seasonal Price", "Status"],
      ...roomTypes.map((room) => [
        room.name,
        room.basePrice,
        room.weekendPrice,
        room.seasonalPrice,
        room.status,
      ]),
      [],
      ["Pricing Rule", "Room Type", "Type", "Start Date", "End Date", "Rate", "Status"],
      ...rules.map((rule) => [
        rule.name,
        rule.roomType,
        rule.type,
        rule.startDate,
        rule.endDate,
        rule.rate,
        rule.status,
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
    link.download = "hotel-room-pricing.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Pricing</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage room rates, special pricing rules and pricing history.
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
            onClick={() => {
              setBulkForm(emptyBulk);
              setModal("bulk");
            }}
            className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-100"
          >
            <Layers size={17} /> Bulk Update
          </button>

          <button
            onClick={() => openRuleForm()}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Add Pricing Rule
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Room Types"
          value={roomTypes.length}
          subtitle="Configured room categories"
          icon={BedDouble}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Pricing Rules"
          value={activeRules.length}
          subtitle="Currently enabled rules"
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Average Base Rate"
          value={money(
            roomTypes.length
              ? roomTypes.reduce((sum, room) => sum + room.basePrice, 0) /
                  roomTypes.length
              : 0
          )}
          subtitle="Across all room types"
          icon={IndianRupee}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Pricing Changes"
          value={history.length}
          subtitle="Recorded rate updates"
          icon={History}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200">
        {[
          { id: "room-types", label: "Room Type Rates", icon: BedDouble },
          { id: "rules", label: "Date & Special Rates", icon: CalendarDays },
          { id: "history", label: "Pricing History", icon: History },
          { id: "preview", label: "Rate Preview", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium ${
                active
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon size={17} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search and filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room type or pricing rule..."
              className={`${inputClass} pl-10`}
            />
          </div>

          {activeTab === "rules" && (
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Pricing Types</option>
              <option>Date Based</option>
              <option>Weekend</option>
              <option>Seasonal</option>
              <option>Demand Based</option>
              <option>Special</option>
            </select>
          )}

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      {/* Room Type Rates */}
      {activeTab === "room-types" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">Room Type Pricing</h2>
            <p className="mt-1 text-xs text-slate-500">
              Standard, weekend and seasonal rates for each room category.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Room Type</th>
                  <th className="px-5 py-3">Room Inventory</th>
                  <th className="px-5 py-3">Base Rate</th>
                  <th className="px-5 py-3">Weekend Rate</th>
                  <th className="px-5 py-3">Seasonal Rate</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{room.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{room.id}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{room.rooms} rooms</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {money(room.basePrice)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {money(room.weekendPrice)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {money(room.seasonalPrice)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge color={room.status === "Active" ? "green" : "slate"}>
                        {room.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="Edit pricing"
                          onClick={() => openRateEditor(room)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          title="Delete room pricing"
                          onClick={() => deleteRoom(room)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                      No room types found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pricing Rules */}
      {activeTab === "rules" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
            <div>
              <h2 className="font-semibold text-slate-800">Date-Based & Special Pricing</h2>
              <p className="mt-1 text-xs text-slate-500">
                Configure date ranges, seasonal rates, weekend rules and demand adjustments.
              </p>
            </div>
            <button
              onClick={() => openRuleForm()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Add Rule
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Rule Name</th>
                  <th className="px-5 py-3">Room Type</th>
                  <th className="px-5 py-3">Pricing Type</th>
                  <th className="px-5 py-3">Validity</th>
                  <th className="px-5 py-3">Price / Adjustment</th>
                  <th className="px-5 py-3">Priority</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{rule.name}</p>
                      <p className="mt-1 text-xs text-slate-400">{rule.id}</p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{rule.roomType}</td>
                    <td className="px-5 py-4">
                      <Badge color="blue">{rule.type}</Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600">
                      {rule.startDate} to {rule.endDate}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-700">
                      {rule.adjustmentType === "Percentage"
                        ? `${rule.adjustment}%`
                        : money(rule.rate || rule.adjustment)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{rule.priority}</td>
                    <td className="px-5 py-4">
                      <Badge color={rule.status === "Active" ? "green" : "slate"}>
                        {rule.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="Edit"
                          onClick={() => openRuleForm(rule)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Duplicate"
                          onClick={() => duplicateRule(rule)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                        >
                          <Copy size={16} />
                        </button>
                        <button
                          title={rule.status === "Active" ? "Deactivate" : "Activate"}
                          onClick={() => toggleRule(rule)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-600"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => deleteRule(rule)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRules.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                      No pricing rules found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pricing History */}
      {activeTab === "history" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-800">Pricing History</h2>
            <p className="mt-1 text-xs text-slate-500">
              Audit trail of manual and bulk room rate changes.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Room Type</th>
                  <th className="px-5 py-3">Old Rate</th>
                  <th className="px-5 py-3">New Rate</th>
                  <th className="px-5 py-3">Reason</th>
                  <th className="px-5 py-3">Updated By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-5 py-4 text-slate-600">{item.date}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {item.roomType}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {money(item.oldRate)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-green-700">
                      {money(item.newRate)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.reason}</td>
                    <td className="px-5 py-4 text-slate-600">{item.updatedBy}</td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                      No pricing history available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Rate Preview */}
      {activeTab === "preview" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-semibold text-slate-800">Effective Rate Preview</h2>
              <p className="mt-1 text-xs text-slate-500">
                Preview the rate returned by the currently active pricing rules.
              </p>
            </div>
            <Field label="Select Date">
              <input
                type="date"
                className={inputClass}
                value={previewDate}
                onChange={(e) => setPreviewDate(e.target.value)}
              />
            </Field>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Room Type</th>
                  <th className="px-4 py-3">Base Rate</th>
                  <th className="px-4 py-3">Effective Rate</th>
                  <th className="px-4 py-3">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roomTypes
                  .filter((room) => room.status === "Active")
                  .map((room) => {
                    const effective = getEffectiveRate(room, rules, previewDate);
                    const difference = effective - room.basePrice;

                    return (
                      <tr key={room.id}>
                        <td className="px-4 py-4 font-medium text-slate-800">
                          {room.name}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {money(room.basePrice)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-blue-700">
                          {money(effective)}
                        </td>
                        <td className={`px-4 py-4 font-medium ${difference > 0 ? "text-green-600" : difference < 0 ? "text-red-600" : "text-slate-500"}`}>
                          {difference > 0 ? "+" : ""}
                          {money(difference)}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <p className="mt-4 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
            This is a demo rate preview. Actual booking prices must be calculated
            using the booking dates, applicable rules, taxes, discounts and
            availability in the backend.
          </p>
        </div>
      )}

      {/* Add / Edit Pricing Rule */}
      {modal === "rule" && (
        <Modal
          title={selected ? "Edit Pricing Rule" : "Create Pricing Rule"}
          onClose={() => setModal("")}
        >
          <form onSubmit={saveRule} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Rule Name *">
                <input
                  className={inputClass}
                  value={ruleForm.name}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g. Diwali Special Rate"
                  required
                />
              </Field>

              <Field label="Pricing Type">
                <select
                  className={inputClass}
                  value={ruleForm.type}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  <option>Date Based</option>
                  <option>Weekend</option>
                  <option>Seasonal</option>
                  <option>Demand Based</option>
                  <option>Special</option>
                </select>
              </Field>

              <Field label="Room Type">
                <select
                  className={inputClass}
                  value={ruleForm.roomType}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, roomType: e.target.value }))
                  }
                >
                  <option>All Room Types</option>
                  {roomTypes.map((room) => (
                    <option key={room.id}>{room.name}</option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  className={inputClass}
                  value={ruleForm.priority}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, priority: e.target.value }))
                  }
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </Field>

              <Field label="Start Date">
                <input
                  type="date"
                  className={inputClass}
                  value={ruleForm.startDate}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field label="End Date">
                <input
                  type="date"
                  className={inputClass}
                  value={ruleForm.endDate}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                  required
                />
              </Field>

              <Field label="Adjustment Type">
                <select
                  className={inputClass}
                  value={ruleForm.adjustmentType}
                  onChange={(e) =>
                    setRuleForm((prev) => ({
                      ...prev,
                      adjustmentType: e.target.value,
                    }))
                  }
                >
                  <option>Fixed</option>
                  <option>Percentage</option>
                </select>
              </Field>

              <Field label={ruleForm.adjustmentType === "Percentage" ? "Adjustment (%)" : "Adjustment Amount (₹)"}>
                <input
                  type="number"
                  min={ruleForm.adjustmentType === "Percentage" ? "-99.99" : "0"}
                  step="0.01"
                  className={inputClass}
                  value={ruleForm.adjustment}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, adjustment: e.target.value }))
                  }
                  placeholder={ruleForm.adjustmentType === "Percentage" ? "e.g. 20 or -10" : "e.g. 3000"}
                  required
                />
              </Field>

              {ruleForm.adjustmentType === "Fixed" && (
                <Field label="Fixed Room Rate (₹)">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={ruleForm.rate}
                    onChange={(e) =>
                      setRuleForm((prev) => ({ ...prev, rate: e.target.value }))
                    }
                    placeholder="e.g. 3000"
                    required
                  />
                </Field>
              )}

              <Field label="Status">
                <select
                  className={inputClass}
                  value={ruleForm.status}
                  onChange={(e) =>
                    setRuleForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selected ? "Update Rule" : "Create Rule"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Room Rates */}
      {modal === "rate" && selected && (
        <Modal title={`Update ${selected.name} Rates`} onClose={() => setModal("")} size="max-w-xl">
          <form onSubmit={saveRoomRates} className="space-y-4">
            <Field label="Base Price (₹)">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={rateForm.basePrice}
                onChange={(e) =>
                  setRateForm((prev) => ({ ...prev, basePrice: e.target.value }))
                }
                required
              />
            </Field>

            <Field label="Weekend Price (₹)">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={rateForm.weekendPrice}
                onChange={(e) =>
                  setRateForm((prev) => ({ ...prev, weekendPrice: e.target.value }))
                }
                required
              />
            </Field>

            <Field label="Seasonal Price (₹)">
              <input
                type="number"
                min="0"
                className={inputClass}
                value={rateForm.seasonalPrice}
                onChange={(e) =>
                  setRateForm((prev) => ({ ...prev, seasonalPrice: e.target.value }))
                }
                required
              />
            </Field>

            <Field label="Reason for Change">
              <input
                className={inputClass}
                value={rateForm.reason}
                onChange={(e) =>
                  setRateForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="e.g. Annual rate revision"
              />
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Rates
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Bulk Pricing Update */}
      {modal === "bulk" && (
        <Modal title="Bulk Pricing Update" onClose={() => setModal("")} size="max-w-xl">
          <form onSubmit={applyBulkUpdate} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              This operation updates the base rate of selected active room types.
              Weekend and seasonal rates remain unchanged.
            </div>

            <Field label="Apply To">
              <select
                className={inputClass}
                value={bulkForm.roomType}
                onChange={(e) =>
                  setBulkForm((prev) => ({ ...prev, roomType: e.target.value }))
                }
              >
                <option>All Room Types</option>
                {roomTypes.map((room) => (
                  <option key={room.id}>{room.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Adjustment Type">
              <select
                className={inputClass}
                value={bulkForm.adjustmentType}
                onChange={(e) =>
                  setBulkForm((prev) => ({
                    ...prev,
                    adjustmentType: e.target.value,
                  }))
                }
              >
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </Field>

            <Field label={bulkForm.adjustmentType === "Percentage" ? "Adjustment (%)" : "Amount (₹)"}>
              <input
                type="number"
                step="0.01"
                className={inputClass}
                value={bulkForm.adjustment}
                onChange={(e) =>
                  setBulkForm((prev) => ({ ...prev, adjustment: e.target.value }))
                }
                placeholder={bulkForm.adjustmentType === "Percentage" ? "e.g. 10 or -5" : "e.g. 200"}
                required
              />
            </Field>

            <Field label="Reason">
              <input
                className={inputClass}
                value={bulkForm.reason}
                onChange={(e) =>
                  setBulkForm((prev) => ({ ...prev, reason: e.target.value }))
                }
                placeholder="e.g. Peak season price revision"
              />
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Apply Update
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
