
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Users,
  UserRound,
  Crown,
  Wallet,
  Phone,
  Mail,
  Eye,
  Pencil,
  Trash2,
  X,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  MoreHorizontal,
  Check,
  AlertCircle,
  UserPlus,
  CalendarDays,
  MapPin,
  Merge,
  UserCheck,
  RefreshCw,
} from "lucide-react";

const initialGuests = [
  {
    id: "GST-001",
    firstName: "Rahul",
    lastName: "Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    category: "VIP",
    visits: 12,
    totalSpent: 85000,
    lastVisit: "2026-10-25",
    address: "Delhi, India",
    notes: "Prefers rooms on higher floors.",
    status: "Active",
  },
  {
    id: "GST-002",
    firstName: "Priya",
    lastName: "Verma",
    email: "priya.verma@gmail.com",
    phone: "+91 98765 12345",
    category: "Regular",
    visits: 5,
    totalSpent: 32000,
    lastVisit: "2026-10-20",
    address: "Jaipur, India",
    notes: "",
    status: "Active",
  },
  {
    id: "GST-003",
    firstName: "Amit",
    lastName: "Kumar",
    email: "amit.kumar@gmail.com",
    phone: "+91 99887 66554",
    category: "Corporate",
    visits: 18,
    totalSpent: 145000,
    lastVisit: "2026-10-18",
    address: "Gurugram, India",
    notes: "Corporate account guest.",
    status: "Active",
  },
  {
    id: "GST-004",
    firstName: "Sneha",
    lastName: "Gupta",
    email: "sneha.gupta@gmail.com",
    phone: "+91 91234 56789",
    category: "New",
    visits: 1,
    totalSpent: 4500,
    lastVisit: "2026-10-15",
    address: "Mumbai, India",
    notes: "",
    status: "Active",
  },
  {
    id: "GST-005",
    firstName: "Vikram",
    lastName: "Singh",
    email: "vikram.singh@gmail.com",
    phone: "+91 90123 45678",
    category: "VIP",
    visits: 9,
    totalSpent: 67000,
    lastVisit: "2026-10-12",
    address: "Chandigarh, India",
    notes: "Prefers vegetarian meals.",
    status: "Active",
  },
  {
    id: "GST-006",
    firstName: "Neha",
    lastName: "Malhotra",
    email: "neha.malhotra@gmail.com",
    phone: "+91 98760 12345",
    category: "Regular",
    visits: 4,
    totalSpent: 21000,
    lastVisit: "2026-10-08",
    address: "Noida, India",
    notes: "",
    status: "Active",
  },
  {
    id: "GST-007",
    firstName: "Arjun",
    lastName: "Mehta",
    email: "arjun.mehta@gmail.com",
    phone: "+91 98765 00011",
    category: "Corporate",
    visits: 15,
    totalSpent: 112000,
    lastVisit: "2026-09-29",
    address: "Bengaluru, India",
    notes: "Business traveler.",
    status: "Active",
  },
  {
    id: "GST-008",
    firstName: "Ananya",
    lastName: "Rao",
    email: "ananya.rao@gmail.com",
    phone: "+91 98765 00022",
    category: "New",
    visits: 1,
    totalSpent: 6000,
    lastVisit: "2026-09-22",
    address: "Pune, India",
    notes: "",
    status: "Active",
  },
];

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  category: "New",
  address: "",
  notes: "",
  status: "Active",
};

const categoryStyles = {
  VIP: "bg-amber-50 text-amber-700 border-amber-200",
  Regular: "bg-blue-50 text-blue-700 border-blue-200",
  Corporate: "bg-violet-50 text-violet-700 border-violet-200",
  New: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (guest) =>
  `${guest.firstName?.[0] || ""}${guest.lastName?.[0] || ""}`.toUpperCase();

const GuestDirectory = () => {
  const [guests, setGuests] = useState(initialGuests);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const [selectedGuest, setSelectedGuest] = useState(null);
  const [deleteGuest, setDeleteGuest] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showMerge, setShowMerge] = useState(false);
  const [mergePrimary, setMergePrimary] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const filteredGuests = useMemo(() => {
    let result = guests.filter((guest) => {
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();

      const matchesSearch =
        fullName.includes(search.toLowerCase()) ||
        guest.email.toLowerCase().includes(search.toLowerCase()) ||
        guest.phone.toLowerCase().includes(search.toLowerCase()) ||
        guest.id.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" || guest.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || guest.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    result.sort((a, b) => {
      let first;
      let second;

      if (sortBy === "name") {
        first = `${a.firstName} ${a.lastName}`.toLowerCase();
        second = `${b.firstName} ${b.lastName}`.toLowerCase();
      } else if (sortBy === "visits" || sortBy === "totalSpent") {
        first = Number(a[sortBy] || 0);
        second = Number(b[sortBy] || 0);
      } else {
        first = a.lastVisit || "";
        second = b.lastVisit || "";
      }

      if (first < second) return sortDirection === "asc" ? -1 : 1;
      if (first > second) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [
    guests,
    search,
    categoryFilter,
    statusFilter,
    sortBy,
    sortDirection,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredGuests.length / pageSize));

  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const stats = useMemo(() => {
    return {
      total: guests.length,
      vip: guests.filter((g) => g.category === "VIP").length,
      regular: guests.filter((g) => g.category === "Regular").length,
      corporate: guests.filter((g) => g.category === "Corporate").length,
      new: guests.filter((g) => g.category === "New").length,
      revenue: guests.reduce((sum, guest) => sum + guest.totalSpent, 0),
    };
  }, [guests]);

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const openAddForm = () => {
    setEditingGuest(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (guest) => {
    setEditingGuest(guest);
    setForm({
      firstName: guest.firstName,
      lastName: guest.lastName,
      email: guest.email,
      phone: guest.phone,
      category: guest.category,
      address: guest.address || "",
      notes: guest.notes || "",
      status: guest.status,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSaveGuest = (e) => {
    e.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.phone.trim()
    ) {
      setFormError("Please fill in all required fields.");
      return;
    }

    const duplicate = guests.find(
      (guest) =>
        guest.id !== editingGuest?.id &&
        (guest.email.toLowerCase() === form.email.trim().toLowerCase() ||
          guest.phone.replace(/\s/g, "") === form.phone.replace(/\s/g, ""))
    );

    if (duplicate) {
      setFormError(
        `A guest with this email or phone already exists (${duplicate.id}).`
      );
      return;
    }

    if (editingGuest) {
      setGuests((previous) =>
        previous.map((guest) =>
          guest.id === editingGuest.id
            ? { ...guest, ...form }
            : guest
        )
      );
      setSuccessMessage("Guest details updated successfully.");
    } else {
      const newGuest = {
        ...form,
        id: `GST-${String(Date.now()).slice(-6)}`,
        visits: 0,
        totalSpent: 0,
        lastVisit: "",
      };

      setGuests((previous) => [newGuest, ...previous]);
      setSuccessMessage("New guest added successfully.");
      setCurrentPage(1);
    }

    setShowForm(false);
    setForm(emptyForm);
    setEditingGuest(null);
    setFormError("");
  };

  const handleDelete = () => {
    if (!deleteGuest) return;

    setGuests((previous) =>
      previous.filter((guest) => guest.id !== deleteGuest.id)
    );

    setSelectedIds((previous) =>
      previous.filter((id) => id !== deleteGuest.id)
    );

    setDeleteGuest(null);
    setSuccessMessage("Guest deleted successfully.");
  };

  const toggleSelection = (id) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const toggleSelectAll = () => {
    const pageIds = paginatedGuests.map((guest) => guest.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((previous) =>
        previous.filter((id) => !pageIds.includes(id))
      );
    } else {
      setSelectedIds((previous) =>
        [...new Set([...previous, ...pageIds])]
      );
    }
  };

  const handleMerge = () => {
    const selectedGuests = guests.filter((guest) =>
      selectedIds.includes(guest.id)
    );

    if (selectedGuests.length !== 2 || !mergePrimary) return;

    const primary = selectedGuests.find(
      (guest) => guest.id === mergePrimary
    );
    const secondary = selectedGuests.find(
      (guest) => guest.id !== mergePrimary
    );

    if (!primary || !secondary) return;

    setGuests((previous) =>
      previous
        .filter((guest) => guest.id !== secondary.id)
        .map((guest) =>
          guest.id === primary.id
            ? {
                ...guest,
                visits: guest.visits + secondary.visits,
                totalSpent: guest.totalSpent + secondary.totalSpent,
                notes: [guest.notes, secondary.notes]
                  .filter(Boolean)
                  .join("\n"),
              }
            : guest
        )
    );

    setSelectedIds([]);
    setShowMerge(false);
    setMergePrimary("");
    setSuccessMessage(
      `${secondary.firstName} ${secondary.lastName} was merged into ${primary.firstName} ${primary.lastName}.`
    );
  };

  const exportCSV = () => {
    const headers = [
      "Guest ID",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Category",
      "Visits",
      "Total Spent",
      "Last Visit",
      "Address",
      "Status",
    ];

    const rows = filteredGuests.map((guest) => [
      guest.id,
      guest.firstName,
      guest.lastName,
      guest.email,
      guest.phone,
      guest.category,
      guest.visits,
      guest.totalSpent,
      guest.lastVisit,
      guest.address,
      guest.status,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-guests.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const changeSort = (field) => {
    if (sortBy === field) {
      setSortDirection((previous) =>
        previous === "asc" ? "desc" : "asc"
      );
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const showSuccess = successMessage;

  React.useEffect(() => {
    if (!showSuccess) return;

    const timeout = setTimeout(() => {
      setSuccessMessage("");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [showSuccess]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, pageSize]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-slate-700";

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-7 space-y-6">

      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />
            <span>Guests</span>
            <span>/</span>
            <span className="text-slate-800">Guest Directory</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            Guest Directory
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage guest profiles, preferences, and stay history.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Guest
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Guests"
          value={stats.total}
          subtitle="Registered guest profiles"
          icon={<Users size={20} />}
          color="blue"
        />

        <StatCard
          title="VIP Guests"
          value={stats.vip}
          subtitle="Premium guest profiles"
          icon={<Crown size={20} />}
          color="amber"
        />

        <StatCard
          title="Regular Guests"
          value={stats.regular}
          subtitle="Returning guest profiles"
          icon={<UserCheck size={20} />}
          color="emerald"
        />

        <StatCard
          title="Total Guest Revenue"
          value={formatCurrency(stats.revenue)}
          subtitle="Lifetime recorded spending"
          icon={<Wallet size={20} />}
          color="violet"
        />
      </div>

      {/* Guest Categories */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900">
              Guest Categories
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Overview of your guest segments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            {
              label: "VIP",
              count: stats.vip,
              color: "bg-amber-500",
            },
            {
              label: "Regular",
              count: stats.regular,
              color: "bg-blue-500",
            },
            {
              label: "Corporate",
              count: stats.corporate,
              color: "bg-violet-500",
            },
            {
              label: "New",
              count: stats.new,
              color: "bg-emerald-500",
            },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() =>
                setCategoryFilter(
                  categoryFilter === item.label ? "All" : item.label
                )
              }
              className={`rounded-xl border p-4 text-left transition ${
                categoryFilter === item.label
                  ? "border-blue-300 bg-blue-50"
                  : "border-slate-100 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  {item.label}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full ${item.color}`}
                />
              </div>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {item.count}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <div className="flex items-center gap-2">
            <Check size={18} />
            {successMessage}
          </div>
          <button onClick={() => setSuccessMessage("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {/* Guest Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              All Guests
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {filteredGuests.length} guest profiles found
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative min-w-0 sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
              />
            </div>

            <div className="relative">
              <Filter
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-600 outline-none focus:border-blue-400 sm:w-40"
              >
                <option value="All">All Categories</option>
                <option value="VIP">VIP</option>
                <option value="Regular">Regular</option>
                <option value="Corporate">Corporate</option>
                <option value="New">New</option>
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-8 text-sm text-slate-600 outline-none focus:border-blue-400 sm:w-32"
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
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 bg-blue-50 px-5 py-3">
            <p className="text-sm font-medium text-blue-700">
              {selectedIds.length} guest(s) selected
            </p>

            <div className="flex items-center gap-2">
              {selectedIds.length === 2 && (
                <button
                  onClick={() => {
                    setMergePrimary(selectedIds[0]);
                    setShowMerge(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                >
                  <Merge size={15} />
                  Merge Profiles
                </button>
              )}

              <button
                onClick={() => setSelectedIds([])}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-100">
                <th className="w-12 px-5 py-3.5">
                  <input
                    type="checkbox"
                    checked={
                      paginatedGuests.length > 0 &&
                      paginatedGuests.every((guest) =>
                        selectedIds.includes(guest.id)
                      )
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Guest
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Contact
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    onClick={() => changeSort("visits")}
                    className="inline-flex items-center gap-1"
                  >
                    Visits
                    <ArrowUpDown size={13} />
                  </button>
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    onClick={() => changeSort("totalSpent")}
                    className="inline-flex items-center gap-1"
                  >
                    Total Spent
                    <ArrowUpDown size={13} />
                  </button>
                </th>

                <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <button
                    onClick={() => changeSort("lastVisit")}
                    className="inline-flex items-center gap-1"
                  >
                    Last Visit
                    <ArrowUpDown size={13} />
                  </button>
                </th>

                <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {paginatedGuests.map((guest) => (
                <tr
                  key={guest.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(guest.id)}
                      onChange={() => toggleSelection(guest.id)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {getInitials(guest)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {guest.firstName} {guest.lastName}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {guest.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="space-y-1">
                      <p className="flex items-center gap-2 text-xs text-slate-600">
                        <Mail size={13} className="text-slate-400" />
                        {guest.email}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-slate-600">
                        <Phone size={13} className="text-slate-400" />
                        {guest.phone}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
                        categoryStyles[guest.category] ||
                        "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {guest.category}
                    </span>
                  </td>

                  <td className="px-4 py-4 text-sm font-medium text-slate-700">
                    {guest.visits}
                  </td>

                  <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                    {formatCurrency(guest.totalSpent)}
                  </td>

                  <td className="px-4 py-4 text-sm text-slate-500">
                    {formatDate(guest.lastVisit)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedGuest(guest)}
                        title="View guest"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => openEditForm(guest)}
                        title="Edit guest"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => setDeleteGuest(guest)}
                        title="Delete guest"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {paginatedGuests.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <Users size={22} />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-800">
                      No guests found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter criteria.
                    </p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setCategoryFilter("All");
                        setStatusFilter("All");
                      }}
                      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span>Rows per page</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>
              Showing{" "}
              {filteredGuests.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              {" "}to{" "}
              {Math.min(currentPage * pageSize, filteredGuests.length)}
              {" "}of {filteredGuests.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((previous) => Math.max(1, previous - 1))
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={17} />
            </button>

            <span className="min-w-20 text-center text-sm text-slate-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              disabled={currentPage >= totalPages}
              onClick={() =>
                setCurrentPage((previous) =>
                  Math.min(totalPages, previous + 1)
                )
              }
              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {showForm && (
        <Modal
          title={editingGuest ? "Edit Guest" : "Add New Guest"}
          subtitle={
            editingGuest
              ? "Update guest profile information."
              : "Enter the details to create a new guest profile."
          }
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSaveGuest} className="space-y-5">
            {formError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.firstName}
                  onChange={(e) => updateForm("firstName", e.target.value)}
                  placeholder="Enter first name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.lastName}
                  onChange={(e) => updateForm("lastName", e.target.value)}
                  placeholder="Enter last name"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="guest@example.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Guest Category</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className={inputClass}
                >
                  <option value="New">New</option>
                  <option value="Regular">Regular</option>
                  <option value="VIP">VIP</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Account Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Address</label>
                <input
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="City, State, Country"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Guest Notes / Preferences</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  placeholder="Add preferences, special requests, or other notes..."
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {editingGuest ? "Save Changes" : "Create Guest"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Guest Details Modal */}
      {selectedGuest && (
        <Modal
          title="Guest Details"
          subtitle="Complete guest profile and account information."
          onClose={() => setSelectedGuest(null)}
        >
          <div className="space-y-5">
            <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-5 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-bold text-blue-700">
                {getInitials(selectedGuest)}
              </div>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {selectedGuest.firstName} {selectedGuest.lastName}
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                {selectedGuest.id}
              </p>

              <span
                className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  categoryStyles[selectedGuest.category]
                }`}
              >
                {selectedGuest.category} Guest
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailItem
                icon={<Mail size={16} />}
                label="Email"
                value={selectedGuest.email}
              />
              <DetailItem
                icon={<Phone size={16} />}
                label="Phone"
                value={selectedGuest.phone}
              />
              <DetailItem
                icon={<MapPin size={16} />}
                label="Address"
                value={selectedGuest.address || "Not provided"}
              />
              <DetailItem
                icon={<CalendarDays size={16} />}
                label="Last Visit"
                value={formatDate(selectedGuest.lastVisit)}
              />
              <DetailItem
                icon={<RefreshCw size={16} />}
                label="Total Visits"
                value={selectedGuest.visits}
              />
              <DetailItem
                icon={<Wallet size={16} />}
                label="Total Spending"
                value={formatCurrency(selectedGuest.totalSpent)}
              />
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Guest Notes & Preferences
              </p>
              <p className="mt-2 whitespace-pre-line text-sm text-slate-700">
                {selectedGuest.notes || "No notes added for this guest."}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => {
                  openEditForm(selectedGuest);
                  setSelectedGuest(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Pencil size={15} />
                Edit Guest
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation */}
      {deleteGuest && (
        <Modal
          title="Delete Guest"
          subtitle="This action cannot be undone."
          onClose={() => setDeleteGuest(null)}
          maxWidth="max-w-md"
        >
          <div className="flex gap-3 rounded-xl border border-red-100 bg-red-50 p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                Are you sure you want to delete this guest?
              </p>
              <p className="mt-1 text-sm text-slate-600">
                {deleteGuest.firstName} {deleteGuest.lastName} ({deleteGuest.id})
                {" "}will be permanently removed from this demo directory.
              </p>
            </div>
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setDeleteGuest(null)}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete Guest
            </button>
          </div>
        </Modal>
      )}

      {/* Merge Profiles Modal */}
      {showMerge && (
        <Modal
          title="Merge Guest Profiles"
          subtitle="Choose which guest profile should be retained."
          onClose={() => setShowMerge(false)}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              The selected profiles' visit counts and spending totals will be
              combined. The secondary profile will be removed.
            </div>

            {guests
              .filter((guest) => selectedIds.includes(guest.id))
              .map((guest) => (
                <label
                  key={guest.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                    mergePrimary === guest.id
                      ? "border-blue-400 bg-blue-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="mergePrimary"
                    value={guest.id}
                    checked={mergePrimary === guest.id}
                    onChange={() => setMergePrimary(guest.id)}
                    className="h-4 w-4 text-blue-600"
                  />

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600">
                    {getInitials(guest)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">
                      {guest.firstName} {guest.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {guest.id} · {guest.visits} visits ·{" "}
                      {formatCurrency(guest.totalSpent)}
                    </p>
                  </div>

                  {mergePrimary === guest.id && (
                    <span className="text-xs font-semibold text-blue-600">
                      Keep
                    </span>
                  )}
                </label>
              ))}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() => setShowMerge(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                disabled={!mergePrimary}
                onClick={handleMerge}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Merge size={15} />
                Merge Profiles
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

/* Reusable Components */

const StatCard = ({ title, value, subtitle, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            colors[color]
          }`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
};

const Modal = ({
  title,
  subtitle,
  onClose,
  children,
  maxWidth = "max-w-2xl",
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-[2px]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`max-h-[90vh] w-full ${maxWidth} overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6`}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="mt-0.5 text-slate-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-medium text-slate-700">
          {value}
        </p>
      </div>
    </div>
  );
};

export default GuestDirectory;
