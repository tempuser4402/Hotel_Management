
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  CalendarDays,
  Users,
  MapPin,
  Eye,
  Pencil,
  Copy,
  XCircle,
  Download,
  X,
  Clock,
  IndianRupee,
  Filter,
  Building2,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
} from "lucide-react";

const initialEvents = [
  {
    id: "EVT-1001",
    title: "Wedding Ceremony",
    customer: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    type: "Wedding",
    venue: "Banquet Hall",
    date: "2026-11-06",
    startTime: "10:00",
    endTime: "16:00",
    guests: 250,
    amount: 250000,
    paid: 100000,
    paymentStatus: "Partial",
    status: "Confirmed",
    notes: "Wedding decoration and vegetarian catering.",
  },
  {
    id: "EVT-1002",
    title: "Corporate Meeting",
    customer: "Amit Verma",
    phone: "9876543211",
    email: "amit@example.com",
    type: "Corporate Event",
    venue: "Conference Hall",
    date: "2026-11-06",
    startTime: "11:00",
    endTime: "14:00",
    guests: 60,
    amount: 45000,
    paid: 45000,
    paymentStatus: "Paid",
    status: "Tentative",
    notes: "Projector and conference seating required.",
  },
  {
    id: "EVT-1003",
    title: "Birthday Celebration",
    customer: "Priya Gupta",
    phone: "9876543212",
    email: "priya@example.com",
    type: "Birthday",
    venue: "Restaurant / Party Area",
    date: "2026-11-08",
    startTime: "18:00",
    endTime: "22:00",
    guests: 80,
    amount: 65000,
    paid: 20000,
    paymentStatus: "Partial",
    status: "Confirmed",
    notes: "Birthday cake and balloon decoration.",
  },
  {
    id: "EVT-1004",
    title: "Conference Hall Maintenance",
    customer: "Hotel Management",
    phone: "",
    email: "",
    type: "Other",
    venue: "Conference Hall",
    date: "2026-11-10",
    startTime: "09:00",
    endTime: "18:00",
    guests: 0,
    amount: 0,
    paid: 0,
    paymentStatus: "Unpaid",
    status: "Blocked",
    notes: "Maintenance and electrical inspection.",
  },
  {
    id: "EVT-1005",
    title: "Engagement Function",
    customer: "Neha Singh",
    phone: "9876543213",
    email: "neha@example.com",
    type: "Engagement",
    venue: "Banquet Hall",
    date: "2026-11-14",
    startTime: "17:00",
    endTime: "22:00",
    guests: 180,
    amount: 180000,
    paid: 50000,
    paymentStatus: "Partial",
    status: "Tentative",
    notes: "Stage decoration and catering.",
  },
  {
    id: "EVT-1006",
    title: "Business Conference",
    customer: "Rajesh Mehta",
    phone: "9876543214",
    email: "rajesh@example.com",
    type: "Conference",
    venue: "Conference Hall",
    date: "2026-11-18",
    startTime: "10:00",
    endTime: "17:00",
    guests: 90,
    amount: 90000,
    paid: 90000,
    paymentStatus: "Paid",
    status: "Confirmed",
    notes: "Audio system and projector required.",
  },
  {
    id: "EVT-1007",
    title: "Anniversary Celebration",
    customer: "Karan Malhotra",
    phone: "9876543215",
    email: "karan@example.com",
    type: "Anniversary",
    venue: "Restaurant / Party Area",
    date: "2026-11-22",
    startTime: "19:00",
    endTime: "23:00",
    guests: 45,
    amount: 40000,
    paid: 0,
    paymentStatus: "Unpaid",
    status: "Cancelled",
    notes: "Booking cancelled by customer.",
  },
];

const eventTypes = [
  "Wedding",
  "Birthday",
  "Corporate Event",
  "Conference",
  "Engagement",
  "Anniversary",
  "Other",
];

const venues = [
  "Banquet Hall",
  "Conference Hall",
  "Restaurant / Party Area",
];

const eventStatuses = [
  "Tentative",
  "Confirmed",
  "Preparation",
  "Event Day",
  "Completed",
  "Cancelled",
  "Blocked",
];

const paymentStatuses = ["Unpaid", "Partial", "Paid", "Refunded"];

const eventStatusStyles = {
  Tentative: "bg-amber-50 text-amber-700 border-amber-200",
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Preparation: "bg-blue-50 text-blue-700 border-blue-200",
  "Event Day": "bg-violet-50 text-violet-700 border-violet-200",
  Completed: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  Blocked: "bg-red-50 text-red-700 border-red-200",
};

const paymentStatusStyles = {
  Unpaid: "bg-red-50 text-red-700",
  Partial: "bg-amber-50 text-amber-700",
  Paid: "bg-emerald-50 text-emerald-700",
  Refunded: "bg-slate-100 text-slate-600",
};

const emptyForm = {
  title: "",
  customer: "",
  phone: "",
  email: "",
  type: "Wedding",
  venue: "Banquet Hall",
  date: "",
  startTime: "10:00",
  endTime: "14:00",
  guests: "",
  amount: "",
  paid: "",
  paymentStatus: "Unpaid",
  status: "Tentative",
  notes: "",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function StatusBadge({ status, styles }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600 border-slate-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function AllEvents() {
  const [events, setEvents] = useState(initialEvents);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [paymentFilter, setPaymentFilter] = useState("All Payments");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [venueFilter, setVenueFilter] = useState("All Venues");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const searchValue =
        `${event.id} ${event.title} ${event.customer} ${event.phone} ${event.venue}`.toLowerCase();

      return (
        searchValue.includes(search.toLowerCase()) &&
        (statusFilter === "All Statuses" ||
          event.status === statusFilter) &&
        (paymentFilter === "All Payments" ||
          event.paymentStatus === paymentFilter) &&
        (typeFilter === "All Types" || event.type === typeFilter) &&
        (venueFilter === "All Venues" || event.venue === venueFilter) &&
        (!dateFrom || event.date >= dateFrom) &&
        (!dateTo || event.date <= dateTo)
      );
    });
  }, [
    events,
    search,
    statusFilter,
    paymentFilter,
    typeFilter,
    venueFilter,
    dateFrom,
    dateTo,
  ]);

  const stats = useMemo(() => {
    const active = events.filter(
      (event) => !["Cancelled", "Blocked"].includes(event.status)
    );

    return {
      total: events.length,
      confirmed: events.filter((e) => e.status === "Confirmed").length,
      tentative: events.filter((e) => e.status === "Tentative").length,
      completed: events.filter((e) => e.status === "Completed").length,
      revenue: active.reduce((sum, e) => sum + Number(e.amount || 0), 0),
      received: active.reduce((sum, e) => sum + Number(e.paid || 0), 0),
    };
  }, [events]);

  const openAdd = () => {
    setSelectedEvent(null);
    setForm({
      ...emptyForm,
      date: new Date().toISOString().slice(0, 10),
    });
    setShowForm(true);
  };

  const openEdit = (event) => {
    setSelectedEvent(event);
    setForm({
      ...event,
      guests: String(event.guests ?? ""),
      amount: String(event.amount ?? ""),
      paid: String(event.paid ?? ""),
    });
    setShowDetails(false);
    setShowForm(true);
  };

  const openView = (event) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    const amount = Number(form.amount) || 0;
    const paid = Number(form.paid) || 0;

    if (paid > amount) {
      alert("Received payment cannot exceed the booking amount.");
      return;
    }

    if (form.endTime <= form.startTime) {
      alert("End time must be later than start time.");
      return;
    }

    const updatedForm = {
      ...form,
      guests: Number(form.guests) || 0,
      amount,
      paid,
      paymentStatus:
        amount === 0
          ? "Unpaid"
          : paid === 0
          ? "Unpaid"
          : paid >= amount
          ? "Paid"
          : "Partial",
    };

    if (selectedEvent) {
      setEvents((previous) =>
        previous.map((event) =>
          event.id === selectedEvent.id
            ? { ...event, ...updatedForm }
            : event
        )
      );
    } else {
      setEvents((previous) => [
        {
          ...updatedForm,
          id: `EVT-${Date.now().toString().slice(-6)}`,
        },
        ...previous,
      ]);
    }

    setShowForm(false);
    setSelectedEvent(null);
  };

  const handleCancel = (event) => {
    if (event.status === "Cancelled") return;

    const confirmed = window.confirm(
      `Are you sure you want to cancel ${event.title}?`
    );

    if (!confirmed) return;

    setEvents((previous) =>
      previous.map((item) =>
        item.id === event.id
          ? { ...item, status: "Cancelled" }
          : item
      )
    );

    setSelectedEvent((previous) =>
      previous?.id === event.id
        ? { ...previous, status: "Cancelled" }
        : previous
    );
  };

  const handleDuplicate = (event) => {
    const confirmed = window.confirm(
      `Create a duplicate of ${event.title}?`
    );

    if (!confirmed) return;

    const duplicate = {
      ...event,
      id: `EVT-${Date.now().toString().slice(-6)}`,
      title: `${event.title} (Copy)`,
      status: "Tentative",
      paymentStatus: "Unpaid",
      paid: 0,
    };

    setEvents((previous) => [duplicate, ...previous]);
  };

  const exportCSV = () => {
    const headers = [
      "Event ID",
      "Event Name",
      "Customer",
      "Phone",
      "Event Type",
      "Venue",
      "Date",
      "Start Time",
      "End Time",
      "Guests",
      "Booking Amount",
      "Paid Amount",
      "Balance",
      "Payment Status",
      "Event Status",
    ];

    const rows = filteredEvents.map((event) => [
      event.id,
      event.title,
      event.customer,
      event.phone,
      event.type,
      event.venue,
      event.date,
      event.startTime,
      event.endTime,
      event.guests,
      event.amount,
      event.paid,
      Number(event.amount) - Number(event.paid),
      event.paymentStatus,
      event.status,
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
    link.download = `Hotel-Amar-Palace-Events-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    link.click();
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All Statuses");
    setPaymentFilter("All Payments");
    setTypeFilter("All Types");
    setVenueFilter("All Venues");
    setDateFrom("");
    setDateTo("");
  };

  const balance = (event) =>
    Number(event.amount || 0) - Number(event.paid || 0);

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <CalendarDays size={16} />
            Events & Banquets
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            All Events
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage event bookings, customers, payments and schedules.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
          >
            <Download size={16} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            <Plus size={17} />
            New Event
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Events",
            value: stats.total,
            icon: CalendarDays,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Confirmed Events",
            value: stats.confirmed,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Tentative Bookings",
            value: stats.tentative,
            icon: CalendarClock,
            color: "bg-amber-50 text-amber-600",
          },
          {
            label: "Completed Events",
            value: stats.completed,
            icon: CheckCircle2,
            color: "bg-violet-50 text-violet-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`p-3 rounded-lg ${item.color}`}>
                <Icon size={21} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="text-xl font-bold text-slate-800">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <IndianRupee size={17} />
            Total Active Booking Value
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-2">
            {formatCurrency(stats.revenue)}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <CheckCircle2 size={17} />
            Payment Received
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-2">
            {formatCurrency(stats.received)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <Filter size={17} />
            Filters
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ID, customer, event..."
              className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          >
            <option>All Statuses</option>
            {eventStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          >
            <option>All Payments</option>
            {paymentStatuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          >
            <option>All Types</option>
            {eventTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          <select
            value={venueFilter}
            onChange={(e) => setVenueFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          >
            <option>All Venues</option>
            {venues.map((venue) => (
              <option key={venue}>{venue}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="From date"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />

          <input
            type="date"
            value={dateTo}
            min={dateFrom || undefined}
            onChange={(e) => setDateTo(e.target.value)}
            title="To date"
            className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Events table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-800">
              Event Bookings
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {filteredEvents.length} of {events.length} events
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3 font-semibold">Event</th>
                <th className="text-left px-4 py-3 font-semibold">Customer</th>
                <th className="text-left px-4 py-3 font-semibold">Venue</th>
                <th className="text-left px-4 py-3 font-semibold">Date & Time</th>
                <th className="text-center px-4 py-3 font-semibold">Guests</th>
                <th className="text-right px-4 py-3 font-semibold">Amount</th>
                <th className="text-left px-4 py-3 font-semibold">Payment</th>
                <th className="text-left px-4 py-3 font-semibold">Event Status</th>
                <th className="text-center px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12">
                    <CalendarDays
                      size={32}
                      className="mx-auto text-slate-300 mb-2"
                    />
                    <p className="text-sm font-medium text-slate-600">
                      No events found
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try changing your filters or create a new event.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {event.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.id} · {event.type}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">
                        {event.customer}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {event.phone || "No phone"}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <MapPin size={14} className="text-slate-400" />
                        {event.venue}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-700">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                        <Clock size={12} />
                        {event.startTime} - {event.endTime}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center gap-1 text-slate-700">
                        <Users size={14} className="text-slate-400" />
                        {event.guests}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <p className="font-semibold text-slate-800">
                        {formatCurrency(event.amount)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Due: {formatCurrency(balance(event))}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={event.paymentStatus}
                        styles={paymentStatusStyles}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={event.status}
                        styles={eventStatusStyles}
                      />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => openView(event)}
                          title="View"
                          className="p-2 rounded-lg text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEdit(event)}
                          title="Edit"
                          className="p-2 rounded-lg text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDuplicate(event)}
                          title="Duplicate"
                          className="p-2 rounded-lg text-slate-500 hover:bg-violet-50 hover:text-violet-600"
                        >
                          <Copy size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCancel(event)}
                          disabled={event.status === "Cancelled"}
                          title="Cancel"
                          className="p-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedEvent ? "Edit Event" : "Create New Event"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter event, customer and booking information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-5">
              <div>
                <h3 className="font-semibold text-sm text-slate-800 mb-3">
                  Event & Customer Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Name *
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Event name"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      required
                      value={form.customer}
                      onChange={(e) =>
                        setForm({ ...form, customer: e.target.value })
                      }
                      placeholder="Customer name"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      placeholder="Phone number"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="Email address"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Type *
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    >
                      {eventTypes.map((type) => (
                        <option key={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Venue *
                    </label>
                    <select
                      value={form.venue}
                      onChange={(e) =>
                        setForm({ ...form, venue: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    >
                      {venues.map((venue) => (
                        <option key={venue}>{venue}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-sm text-slate-800 mb-3">
                  Schedule & Guest Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expected Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.guests}
                      onChange={(e) =>
                        setForm({ ...form, guests: e.target.value })
                      }
                      placeholder="Guest count"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Start Time *
                    </label>
                    <input
                      required
                      type="time"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      End Time *
                    </label>
                    <input
                      required
                      type="time"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <h3 className="font-semibold text-sm text-slate-800 mb-3">
                  Booking & Payment
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Booking Amount (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.amount}
                      onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                      }
                      placeholder="Total booking amount"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Amount Received (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={form.paid}
                      onChange={(e) =>
                        setForm({ ...form, paid: e.target.value })
                      }
                      placeholder="Advance / received amount"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Event Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                    >
                      {eventStatuses.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Payment Status
                    </label>
                    <div className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-600">
                      {Number(form.amount) === 0
                        ? "Unpaid"
                        : Number(form.paid) === 0
                        ? "Unpaid"
                        : Number(form.paid) >= Number(form.amount)
                        ? "Paid"
                        : "Partial"}
                      <span className="text-xs text-slate-400 ml-2">
                        (Automatically calculated)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-blue-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-blue-800">
                    Balance Amount
                  </span>
                  <span className="font-bold text-blue-800">
                    {formatCurrency(
                      Math.max(
                        0,
                        Number(form.amount || 0) - Number(form.paid || 0)
                      )
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Notes / Special Requirements
                </label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) =>
                    setForm({ ...form, notes: e.target.value })
                  }
                  placeholder="Enter event requirements..."
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  {selectedEvent ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  Event Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedEvent.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {selectedEvent.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedEvent.type}
                  </p>
                </div>

                <StatusBadge
                  status={selectedEvent.status}
                  styles={eventStatusStyles}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["Customer", selectedEvent.customer],
                  ["Phone", selectedEvent.phone || "-"],
                  ["Email", selectedEvent.email || "-"],
                  ["Venue", selectedEvent.venue],
                  ["Event Date", formatDate(selectedEvent.date)],
                  [
                    "Time",
                    `${selectedEvent.startTime} - ${selectedEvent.endTime}`,
                  ],
                  ["Expected Guests", selectedEvent.guests],
                  ["Booking Amount", formatCurrency(selectedEvent.amount)],
                  ["Amount Received", formatCurrency(selectedEvent.paid)],
                  ["Balance Amount", formatCurrency(balance(selectedEvent))],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="p-3 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-semibold text-slate-800 mt-1">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs text-slate-500 mb-2">
                  Payment Status
                </p>
                <StatusBadge
                  status={selectedEvent.paymentStatus}
                  styles={paymentStatusStyles}
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">
                  Notes / Requirements
                </p>
                <p className="text-sm text-slate-700">
                  {selectedEvent.notes || "No notes added."}
                </p>
              </div>
            </div>

            <div className="p-5 border-t border-slate-200 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDuplicate(selectedEvent)}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50"
              >
                <Copy size={14} className="inline mr-1" />
                Duplicate
              </button>

              <button
                type="button"
                onClick={() => openEdit(selectedEvent)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm"
              >
                <Pencil size={14} className="inline mr-1" />
                Edit / Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
