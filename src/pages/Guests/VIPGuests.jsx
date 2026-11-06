
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Crown,
  Star,
  Users,
  IndianRupee,
  CalendarDays,
  BedDouble,
  Gift,
  ShieldCheck,
  Bell,
  AlertCircle,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ChevronRight,
  X,
  Edit3,
  Eye,
  Award,
  Sparkles,
  ArrowUpRight,
  History,
  UserRound,
  Wallet,
  Filter,
  MoreHorizontal,
} from "lucide-react";

// ---------------------------------------------
// SAMPLE VIP GUEST DATA
// ---------------------------------------------

const initialVIPGuests = [
  {
    id: "VIP-001",
    guestId: "GST-001",
    name: "Rahul Sharma",
    initials: "RS",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    category: "Platinum",
    status: "Active",
    since: "2025-04-12",
    lifetimeSpending: 185000,
    totalVisits: 18,
    priorityLevel: "Highest",
    preferences: {
      room: "Premium Suite",
      floor: "Upper Floor",
      bed: "King Bed",
      food: "Vegetarian",
      smoking: "Non-Smoking",
      language: "Hindi",
      temperature: "22°C",
      newspaper: "Times of India",
    },
    benefits: [
      "Complimentary room upgrade",
      "Priority check-in and checkout",
      "Complimentary breakfast",
      "Late checkout until 2 PM",
      "Welcome amenities",
    ],
    alerts: [
      {
        id: 1,
        title: "Vegetarian welcome amenities",
        detail: "Arrange vegetarian welcome snacks before arrival.",
        type: "Preference",
        active: true,
      },
      {
        id: 2,
        title: "Room upgrade required",
        detail: "Offer an available suite upgrade.",
        type: "Priority",
        active: true,
      },
    ],
    visits: [
      {
        id: "RES-1025",
        room: "204",
        date: "2026-11-02",
        checkout: "2026-11-05",
        amount: 12500,
        status: "Checked In",
      },
      {
        id: "RES-0892",
        room: "305",
        date: "2026-09-05",
        checkout: "2026-09-08",
        amount: 18000,
        status: "Completed",
      },
      {
        id: "RES-0712",
        room: "301",
        date: "2026-07-12",
        checkout: "2026-07-15",
        amount: 22000,
        status: "Completed",
      },
    ],
  },
  {
    id: "VIP-002",
    guestId: "GST-002",
    name: "Priya Verma",
    initials: "PV",
    email: "priya.verma@gmail.com",
    phone: "+91 91234 56780",
    category: "Gold",
    status: "Active",
    since: "2026-01-18",
    lifetimeSpending: 92000,
    totalVisits: 9,
    priorityLevel: "High",
    preferences: {
      room: "Deluxe Room",
      floor: "Lower Floor",
      bed: "Queen Bed",
      food: "Vegetarian",
      smoking: "Non-Smoking",
      language: "English",
      temperature: "23°C",
      newspaper: "No preference",
    },
    benefits: [
      "Priority check-in",
      "Complimentary breakfast",
      "Late checkout until 1 PM",
      "Welcome amenities",
    ],
    alerts: [
      {
        id: 1,
        title: "Vegetarian food preference",
        detail: "Ensure vegetarian meal arrangements.",
        type: "Preference",
        active: true,
      },
    ],
    visits: [
      {
        id: "RES-1020",
        room: "108",
        date: "2026-11-04",
        checkout: "2026-11-06",
        amount: 5500,
        status: "Reserved",
      },
      {
        id: "RES-0650",
        room: "201",
        date: "2026-06-15",
        checkout: "2026-06-17",
        amount: 8500,
        status: "Completed",
      },
    ],
  },
  {
    id: "VIP-003",
    guestId: "GST-003",
    name: "Amit Singh",
    initials: "AS",
    email: "amit.singh@gmail.com",
    phone: "+91 99887 76655",
    category: "Silver",
    status: "Active",
    since: "2025-11-10",
    lifetimeSpending: 48500,
    totalVisits: 6,
    priorityLevel: "Standard",
    preferences: {
      room: "Premium Room",
      floor: "Upper Floor",
      bed: "King Bed",
      food: "No preference",
      smoking: "Non-Smoking",
      language: "Hindi",
      temperature: "24°C",
      newspaper: "No preference",
    },
    benefits: [
      "Priority reservation assistance",
      "Welcome amenities",
      "Late checkout subject to availability",
    ],
    alerts: [
      {
        id: 1,
        title: "Upper floor preferred",
        detail: "Assign an upper-floor room whenever possible.",
        type: "Preference",
        active: true,
      },
    ],
    visits: [
      {
        id: "RES-1005",
        room: "302",
        date: "2026-10-20",
        checkout: "2026-10-22",
        amount: 9500,
        status: "Completed",
      },
      {
        id: "RES-0821",
        room: "205",
        date: "2026-08-21",
        checkout: "2026-08-23",
        amount: 7000,
        status: "Completed",
      },
    ],
  },
];

const tierStyles = {
  Platinum: {
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    icon: "text-violet-600",
    background: "bg-violet-50",
  },
  Gold: {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    icon: "text-amber-600",
    background: "bg-amber-50",
  },
  Silver: {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    icon: "text-slate-500",
    background: "bg-slate-100",
  },
};

const tierBenefits = {
  Platinum: [
    "Complimentary room upgrade, subject to availability",
    "Priority check-in and checkout",
    "Complimentary breakfast",
    "Late checkout until 2 PM",
    "Welcome amenities",
  ],
  Gold: [
    "Priority check-in",
    "Complimentary breakfast",
    "Late checkout until 1 PM",
    "Welcome amenities",
  ],
  Silver: [
    "Priority reservation assistance",
    "Welcome amenities",
    "Late checkout subject to availability",
  ],
};

const formatDate = (date) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function TierBadge({ tier }) {
  const style = tierStyles[tier] || tierStyles.Silver;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${style.badge}`}
    >
      <Crown size={13} />
      {tier}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Highest: "bg-violet-50 text-violet-700",
    High: "bg-blue-50 text-blue-700",
    Standard: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        styles[priority] || styles.Standard
      }`}
    >
      {priority}
    </span>
  );
}

function StatCard({ label, value, icon: Icon, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <Icon size={18} className="text-blue-600" />
        </div>
      </div>
      <p className="text-xl font-bold text-slate-900 mt-3">{value}</p>
      {description && (
        <p className="text-xs text-slate-400 mt-1">{description}</p>
      )}
    </div>
  );
}

function SectionCard({ title, description, action, children }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function EmptyState({ text }) {
  return (
    <div className="py-10 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
        <Users size={21} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
      />
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------

export default function VIPGuests() {
  const [vipGuests, setVipGuests] = useState(initialVIPGuests);
  const [selectedId, setSelectedId] = useState("VIP-001");
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
    guestId: "",
    category: "Silver",
  });

  const selectedGuest = vipGuests.find((guest) => guest.id === selectedId);

  const filteredGuests = useMemo(() => {
    return vipGuests.filter((guest) => {
      const matchesSearch = `${guest.name} ${guest.phone} ${guest.email} ${guest.id}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesTier =
        tierFilter === "All" || guest.category === tierFilter;

      return matchesSearch && matchesTier;
    });
  }, [vipGuests, search, tierFilter]);

  const stats = useMemo(() => {
    return {
      total: vipGuests.length,
      platinum: vipGuests.filter((g) => g.category === "Platinum").length,
      gold: vipGuests.filter((g) => g.category === "Gold").length,
      spending: vipGuests.reduce((sum, g) => sum + g.lifetimeSpending, 0),
      visits: vipGuests.reduce((sum, g) => sum + g.totalVisits, 0),
      alerts: vipGuests.reduce(
        (sum, g) => sum + g.alerts.filter((a) => a.active).length,
        0
      ),
    };
  }, [vipGuests]);

  const updateGuest = (field, value) => {
    setVipGuests((prev) =>
      prev.map((guest) =>
        guest.id === selectedId ? { ...guest, [field]: value } : guest
      )
    );
  };

  const handleAddGuest = (e) => {
    e.preventDefault();

    const guest = {
      id: `VIP-${String(vipGuests.length + 1).padStart(3, "0")}`,
      guestId: newGuest.guestId || "Not linked",
      name: newGuest.name.trim(),
      initials: newGuest.name
        .trim()
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      email: newGuest.email,
      phone: newGuest.phone,
      category: newGuest.category,
      status: "Active",
      since: new Date().toISOString().slice(0, 10),
      lifetimeSpending: 0,
      totalVisits: 0,
      priorityLevel:
        newGuest.category === "Platinum"
          ? "Highest"
          : newGuest.category === "Gold"
          ? "High"
          : "Standard",
      preferences: {
        room: "No preference",
        floor: "No preference",
        bed: "No preference",
        food: "No preference",
        smoking: "Non-Smoking",
        language: "Hindi",
        temperature: "24°C",
        newspaper: "No preference",
      },
      benefits: tierBenefits[newGuest.category],
      alerts: [],
      visits: [],
    };

    setVipGuests((prev) => [...prev, guest]);
    setSelectedId(guest.id);
    setActiveTab("overview");
    setNewGuest({
      name: "",
      email: "",
      phone: "",
      guestId: "",
      category: "Silver",
    });
    setShowAddModal(false);
  };

  const handleAddAlert = (e) => {
    e.preventDefault();

    if (!alertText.trim()) return;

    updateGuest("alerts", [
      ...selectedGuest.alerts,
      {
        id: Date.now(),
        title: alertText.trim(),
        detail: "Please review this alert before guest arrival.",
        type: "Custom",
        active: true,
      },
    ]);

    setAlertText("");
    setShowAlertModal(false);
  };

  const toggleAlert = (alertId) => {
    updateGuest(
      "alerts",
      selectedGuest.alerts.map((alert) =>
        alert.id === alertId
          ? { ...alert, active: !alert.active }
          : alert
      )
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: UserRound },
    { id: "benefits", label: "VIP Benefits", icon: Gift },
    { id: "preferences", label: "Preferences", icon: Sparkles },
    { id: "visits", label: "Visit History", icon: History },
    { id: "alerts", label: "Special Alerts", icon: Bell },
  ];

  if (!selectedGuest && vipGuests.length > 0) return null;

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">

      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Guests</span>
            <ChevronRight size={13} />
            <span className="text-slate-800">VIP Guests</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            VIP Guests
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage premium guests, exclusive benefits, preferences and priority services.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm"
        >
          <Plus size={17} />
          Add VIP Guest
        </button>
      </div>

      {/* VIP STATISTICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total VIP Guests"
          value={stats.total}
          icon={Users}
          description="Registered VIP members"
        />
        <StatCard
          label="Platinum Members"
          value={stats.platinum}
          icon={Crown}
          description="Highest membership tier"
        />
        <StatCard
          label="Gold Members"
          value={stats.gold}
          icon={Award}
          description="Gold membership tier"
        />
        <StatCard
          label="Lifetime Revenue"
          value={money(stats.spending)}
          icon={IndianRupee}
          description="Combined VIP spending"
        />
      </div>

      {/* QUICK SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
            <BedDouble className="text-blue-600" size={21} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Total VIP Visits</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {stats.visits}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-amber-50 flex items-center justify-center">
            <Bell className="text-amber-600" size={21} />
          </div>
          <div>
            <p className="text-xs text-slate-500">Active Special Alerts</p>
            <p className="text-xl font-bold text-slate-900 mt-1">
              {stats.alerts}
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 xl:grid-cols-[310px_minmax(0,1fr)] gap-4">

        {/* VIP DIRECTORY */}
        <aside className="bg-white border border-slate-200 rounded-xl overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">VIP Directory</h2>
              <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                {vipGuests.length} Members
              </span>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search VIP guest..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50"
              />
            </div>

            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              <option value="Platinum">Platinum</option>
              <option value="Gold">Gold</option>
              <option value="Silver">Silver</option>
            </select>
          </div>

          <div className="max-h-[680px] overflow-y-auto p-2">
            {filteredGuests.length === 0 ? (
              <EmptyState text="No VIP guests found." />
            ) : (
              filteredGuests.map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => {
                    setSelectedId(guest.id);
                    setActiveTab("overview");
                  }}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition mb-1 border ${
                    selectedId === guest.id
                      ? "bg-blue-50 border-blue-200"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                    {guest.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {guest.name}
                    </p>
                    <div className="mt-1">
                      <TierBadge tier={guest.category} />
                    </div>
                  </div>

                  {selectedId === guest.id && (
                    <ChevronRight size={16} className="text-blue-600 shrink-0" />
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* SELECTED VIP PROFILE */}
        <main className="min-w-0 space-y-4">

          {selectedGuest ? (
            <>
              {/* VIP PROFILE HEADER */}
              <section className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Crown size={25} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-slate-900">
                          {selectedGuest.name}
                        </h2>
                        <TierBadge tier={selectedGuest.category} />
                      </div>

                      <p className="text-xs text-slate-500 mt-1">
                        {selectedGuest.id} · Guest ID: {selectedGuest.guestId}
                      </p>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <Mail size={13} />
                          {selectedGuest.email || "No email"}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Phone size={13} />
                          {selectedGuest.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <PriorityBadge priority={selectedGuest.priorityLevel} />

                    <button
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Edit3 size={15} />
                      Edit VIP
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500">VIP Since</p>
                    <p className="text-sm font-semibold mt-1 text-slate-800">
                      {formatDate(selectedGuest.since)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Lifetime Spending</p>
                    <p className="text-sm font-semibold mt-1 text-slate-800">
                      {money(selectedGuest.lifetimeSpending)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total Visits</p>
                    <p className="text-sm font-semibold mt-1 text-slate-800">
                      {selectedGuest.totalVisits}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Active Alerts</p>
                    <p className="text-sm font-semibold mt-1 text-blue-600">
                      {selectedGuest.alerts.filter((a) => a.active).length}
                    </p>
                  </div>
                </div>
              </section>

              {/* PROFILE TABS */}
              <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="border-b border-slate-200 overflow-x-auto">
                  <div className="flex min-w-max px-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;

                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-3 md:px-4 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                            activeTab === tab.id
                              ? "border-blue-600 text-blue-600 bg-blue-50/40"
                              : "border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-[#F5F7FA]">

                  {/* OVERVIEW */}
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        <StatCard
                          label="Lifetime Spending"
                          value={money(selectedGuest.lifetimeSpending)}
                          icon={Wallet}
                        />
                        <StatCard
                          label="Total Visits"
                          value={selectedGuest.totalVisits}
                          icon={BedDouble}
                        />
                        <StatCard
                          label="Priority Level"
                          value={selectedGuest.priorityLevel}
                          icon={ShieldCheck}
                        />
                      </div>

                      <SectionCard
                        title="VIP Guest Information"
                        description="Membership and contact details."
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Full Name</p>
                            <p className="text-sm font-medium text-slate-800">{selectedGuest.name}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Guest ID</p>
                            <p className="text-sm font-medium text-slate-800">{selectedGuest.guestId}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">VIP Category</p>
                            <TierBadge tier={selectedGuest.category} />
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                            <p className="text-sm font-medium text-slate-800">{selectedGuest.phone}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Email Address</p>
                            <p className="text-sm font-medium text-slate-800 break-all">{selectedGuest.email || "Not provided"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 mb-1">Membership Status</p>
                            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                              {selectedGuest.status}
                            </span>
                          </div>
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="Priority Handling"
                        description="Service priority assigned to this VIP guest."
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-blue-50 border border-blue-100">
                          <div className="flex items-center gap-3">
                            <ShieldCheck size={24} className="text-blue-600" />
                            <div>
                              <p className="text-sm font-semibold text-blue-900">
                                {selectedGuest.priorityLevel} Priority
                              </p>
                              <p className="text-xs text-blue-700 mt-1">
                                Provide priority reservation assistance and personalized service.
                              </p>
                            </div>
                          </div>
                          <PriorityBadge priority={selectedGuest.priorityLevel} />
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* BENEFITS */}
                  {activeTab === "benefits" && (
                    <div className="space-y-4">
                      <SectionCard
                        title="Membership Benefits"
                        description={`Exclusive benefits available to ${selectedGuest.category} members.`}
                      >
                        <div className="space-y-3">
                          {selectedGuest.benefits.map((benefit, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white"
                            >
                              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Gift size={17} className="text-blue-600" />
                              </div>
                              <p className="text-sm font-medium text-slate-700 flex-1">
                                {benefit}
                              </p>
                              <CheckCircle2 size={17} className="text-emerald-500" />
                            </div>
                          ))}
                        </div>
                      </SectionCard>

                      <SectionCard
                        title="Available Membership Tiers"
                        description="Hotel Amar Palace VIP membership categories."
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {Object.entries(tierBenefits).map(([tier, benefits]) => (
                            <div
                              key={tier}
                              className={`p-4 rounded-xl border ${
                                selectedGuest.category === tier
                                  ? "border-blue-300 bg-blue-50/50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <TierBadge tier={tier} />
                              <p className="text-xs text-slate-500 mt-3">
                                {benefits.length} membership benefits
                              </p>
                              <ul className="mt-3 space-y-2">
                                {benefits.map((benefit, index) => (
                                  <li
                                    key={index}
                                    className="text-xs text-slate-600 flex gap-2"
                                  >
                                    <CheckCircle2
                                      size={14}
                                      className="text-emerald-500 shrink-0 mt-0.5"
                                    />
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </SectionCard>
                    </div>
                  )}

                  {/* PREFERENCES */}
                  {activeTab === "preferences" && (
                    <SectionCard
                      title="Special Guest Preferences"
                      description="Personalized arrangements for a better guest experience."
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          ["Preferred Room", selectedGuest.preferences.room, BedDouble],
                          ["Preferred Floor", selectedGuest.preferences.floor, MapPin],
                          ["Bed Type", selectedGuest.preferences.bed, BedDouble],
                          ["Food Preference", selectedGuest.preferences.food, Gift],
                          ["Smoking Preference", selectedGuest.preferences.smoking, ShieldCheck],
                          ["Preferred Language", selectedGuest.preferences.language, UserRound],
                          ["Room Temperature", selectedGuest.preferences.temperature, Sparkles],
                          ["Newspaper", selectedGuest.preferences.newspaper, FileText],
                        ].map(([label, value, Icon]) => (
                          <div
                            key={label}
                            className="p-4 border border-slate-100 rounded-xl bg-white"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                              <Icon size={17} className="text-blue-600" />
                            </div>
                            <p className="text-xs text-slate-500">{label}</p>
                            <p className="text-sm font-semibold text-slate-800 mt-1">
                              {value || "Not provided"}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 mt-4">
                        Confirm preferences with the guest before each stay.
                      </p>
                    </SectionCard>
                  )}

                  {/* VISIT HISTORY */}
                  {activeTab === "visits" && (
                    <SectionCard
                      title="VIP Visit History"
                      description={`${selectedGuest.visits.length} recorded reservations.`}
                    >
                      {selectedGuest.visits.length === 0 ? (
                        <EmptyState text="No visit history available." />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[650px] text-left">
                            <thead>
                              <tr className="text-xs text-slate-500 border-b border-slate-100">
                                <th className="pb-3 font-medium">Reservation</th>
                                <th className="pb-3 font-medium">Room</th>
                                <th className="pb-3 font-medium">Check-in</th>
                                <th className="pb-3 font-medium">Check-out</th>
                                <th className="pb-3 font-medium">Amount</th>
                                <th className="pb-3 font-medium">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedGuest.visits.map((visit) => (
                                <tr
                                  key={visit.id}
                                  className="border-b border-slate-50 text-sm"
                                >
                                  <td className="py-3 font-medium text-blue-600">
                                    {visit.id}
                                  </td>
                                  <td className="py-3">{visit.room}</td>
                                  <td className="py-3">{formatDate(visit.date)}</td>
                                  <td className="py-3">{formatDate(visit.checkout)}</td>
                                  <td className="py-3 font-medium">{money(visit.amount)}</td>
                                  <td className="py-3">
                                    <span
                                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                                        visit.status === "Completed"
                                          ? "bg-emerald-50 text-emerald-700"
                                          : visit.status === "Checked In"
                                          ? "bg-blue-50 text-blue-700"
                                          : "bg-amber-50 text-amber-700"
                                      }`}
                                    >
                                      {visit.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </SectionCard>
                  )}

                  {/* SPECIAL ALERTS */}
                  {activeTab === "alerts" && (
                    <SectionCard
                      title="Special Alerts & Instructions"
                      description="Alerts to display during reservation and check-in."
                      action={
                        <button
                          onClick={() => setShowAlertModal(true)}
                          className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                        >
                          <Plus size={15} />
                          Add Alert
                        </button>
                      }
                    >
                      {selectedGuest.alerts.length === 0 ? (
                        <EmptyState text="No special alerts recorded." />
                      ) : (
                        <div className="space-y-3">
                          {selectedGuest.alerts.map((alert) => (
                            <div
                              key={alert.id}
                              className={`p-4 rounded-xl border ${
                                alert.active
                                  ? "border-amber-200 bg-amber-50/50"
                                  : "border-slate-200 bg-white"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                                <div className="flex gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                                    <AlertCircle size={18} className="text-amber-600" />
                                  </div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-semibold text-slate-800">
                                        {alert.title}
                                      </p>
                                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                        {alert.type}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-600 mt-1">
                                      {alert.detail}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  onClick={() => toggleAlert(alert.id)}
                                  className={`text-xs font-medium px-3 py-2 rounded-lg border transition ${
                                    alert.active
                                      ? "border-amber-200 text-amber-700 hover:bg-amber-100"
                                      : "border-blue-200 text-blue-600 hover:bg-blue-50"
                                  }`}
                                >
                                  {alert.active ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </SectionCard>
                  )}
                </div>
              </section>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl">
              <EmptyState text="Select a VIP guest to view their profile." />
            </div>
          )}
        </main>
      </div>

      {/* ADD VIP GUEST MODAL */}
      {showAddModal && (
        <Modal
          title="Add VIP Guest"
          onClose={() => setShowAddModal(false)}
        >
          <form onSubmit={handleAddGuest} className="space-y-4">
            <FieldInput
              label="Full Name"
              required
              value={newGuest.name}
              onChange={(value) => setNewGuest({ ...newGuest, name: value })}
            />

            <FieldInput
              label="Email Address"
              type="email"
              value={newGuest.email}
              onChange={(value) => setNewGuest({ ...newGuest, email: value })}
            />

            <FieldInput
              label="Phone Number"
              required
              value={newGuest.phone}
              onChange={(value) => setNewGuest({ ...newGuest, phone: value })}
            />

            <FieldInput
              label="Linked Guest ID (optional)"
              value={newGuest.guestId}
              onChange={(value) => setNewGuest({ ...newGuest, guestId: value })}
            />

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                VIP Category
              </label>
              <select
                value={newGuest.category}
                onChange={(e) =>
                  setNewGuest({ ...newGuest, category: e.target.value })
                }
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Create VIP Profile
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT VIP MODAL */}
      {showEditModal && selectedGuest && (
        <Modal
          title="Edit VIP Profile"
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-4">
            <FieldInput
              label="Full Name"
              value={selectedGuest.name}
              onChange={(value) => {
                updateGuest("name", value);
                updateGuest(
                  "initials",
                  value
                    .split(" ")
                    .map((word) => word[0] || "")
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()
                );
              }}
            />

            <FieldInput
              label="Email Address"
              type="email"
              value={selectedGuest.email}
              onChange={(value) => updateGuest("email", value)}
            />

            <FieldInput
              label="Phone Number"
              value={selectedGuest.phone}
              onChange={(value) => updateGuest("phone", value)}
            />

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                VIP Category
              </label>
              <select
                value={selectedGuest.category}
                onChange={(e) => {
                  const category = e.target.value;
                  updateGuest("category", category);
                  updateGuest("benefits", tierBenefits[category]);
                  updateGuest(
                    "priorityLevel",
                    category === "Platinum"
                      ? "Highest"
                      : category === "Gold"
                      ? "High"
                      : "Standard"
                  );
                }}
                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
              >
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="Platinum">Platinum</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ADD ALERT MODAL */}
      {showAlertModal && (
        <Modal
          title="Add Special Alert"
          onClose={() => setShowAlertModal(false)}
        >
          <form onSubmit={handleAddAlert} className="space-y-4">
            <FieldInput
              label="Alert / Instruction"
              required
              value={alertText}
              onChange={setAlertText}
            />

            <p className="text-xs text-slate-500">
              This instruction will be visible to staff when viewing this VIP profile.
            </p>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Save Alert
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
