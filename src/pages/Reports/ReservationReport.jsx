
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  BedDouble,
  Users,
  TrendingUp,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";

const initialReservations = [
  { id: "RES-1001", guest: "Aarav Sharma", room: "Deluxe", source: "Website", checkIn: "2026-11-02", checkOut: "2026-11-05", bookedOn: "2026-10-20", amount: 10500, status: "Confirmed" },
  { id: "RES-1002", guest: "Priya Verma", room: "Suite", source: "Booking.com", checkIn: "2026-11-03", checkOut: "2026-11-07", bookedOn: "2026-10-25", amount: 24000, status: "Confirmed" },
  { id: "RES-1003", guest: "Rahul Mehta", room: "Standard", source: "Walk-in", checkIn: "2026-11-04", checkOut: "2026-11-06", bookedOn: "2026-11-04", amount: 5000, status: "Checked In" },
  { id: "RES-1004", guest: "Neha Singh", room: "Deluxe", source: "MakeMyTrip", checkIn: "2026-11-05", checkOut: "2026-11-08", bookedOn: "2026-10-18", amount: 12600, status: "Confirmed" },
  { id: "RES-1005", guest: "Karan Patel", room: "Standard", source: "Website", checkIn: "2026-11-06", checkOut: "2026-11-08", bookedOn: "2026-10-29", amount: 5000, status: "Cancelled" },
  { id: "RES-1006", guest: "Ananya Gupta", room: "Suite", source: "Booking.com", checkIn: "2026-11-07", checkOut: "2026-11-11", bookedOn: "2026-10-21", amount: 24000, status: "Confirmed" },
  { id: "RES-1007", guest: "Vikram Rao", room: "Deluxe", source: "Walk-in", checkIn: "2026-11-08", checkOut: "2026-11-10", bookedOn: "2026-11-08", amount: 7000, status: "Checked Out" },
  { id: "RES-1008", guest: "Isha Kapoor", room: "Standard", source: "Website", checkIn: "2026-11-09", checkOut: "2026-11-12", bookedOn: "2026-10-30", amount: 7500, status: "Confirmed" },
  { id: "RES-1009", guest: "Rohan Das", room: "Deluxe", source: "MakeMyTrip", checkIn: "2026-11-10", checkOut: "2026-11-13", bookedOn: "2026-10-22", amount: 12600, status: "Cancelled" },
  { id: "RES-1010", guest: "Meera Joshi", room: "Suite", source: "Website", checkIn: "2026-11-11", checkOut: "2026-11-15", bookedOn: "2026-10-26", amount: 24000, status: "Confirmed" },
  { id: "RES-1011", guest: "Arjun Nair", room: "Standard", source: "Booking.com", checkIn: "2026-11-12", checkOut: "2026-11-14", bookedOn: "2026-11-01", amount: 5000, status: "Confirmed" },
  { id: "RES-1012", guest: "Simran Kaur", room: "Deluxe", source: "Website", checkIn: "2026-11-14", checkOut: "2026-11-18", bookedOn: "2026-11-02", amount: 14000, status: "Confirmed" },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const dateLabel = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const nightsBetween = (start, end) =>
  Math.max(
    0,
    Math.round(
      (new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) /
        86400000
    )
  );

const daysBetween = (start, end) =>
  Math.max(
    0,
    Math.round(
      (new Date(`${start}T00:00:00`) - new Date(`${end}T00:00:00`)) /
        86400000
    )
  );

const exportCSV = (rows) => {
  const headers = [
    "Reservation ID",
    "Guest",
    "Room Type",
    "Source",
    "Check In",
    "Check Out",
    "Booked On",
    "Lead Time (Days)",
    "Length of Stay",
    "Amount",
    "Status",
  ];

  const data = rows.map((r) => [
    r.id,
    r.guest,
    r.room,
    r.source,
    r.checkIn,
    r.checkOut,
    r.bookedOn,
    daysBetween(r.checkIn, r.bookedOn),
    nightsBetween(r.checkIn, r.checkOut),
    r.amount,
    r.status,
  ]);

  const csv = [headers, ...data]
    .map((row) =>
      row
        .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "reservation-report.csv";
  link.click();
  URL.revokeObjectURL(url);
};

function MetricCard({ title, value, subtitle, icon: Icon, trend, positive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {trend}
          <span className="font-normal text-slate-400">vs previous period</span>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Confirmed: "bg-emerald-50 text-emerald-700",
    "Checked In": "bg-blue-50 text-blue-700",
    "Checked Out": "bg-slate-100 text-slate-700",
    Cancelled: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default function ReservationReports() {
  const [reservations] = useState(initialReservations);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("All");
  const [period, setPeriod] = useState("all");
  const [customStart, setCustomStart] = useState("2026-11-01");
  const [customEnd, setCustomEnd] = useState("2026-11-30");

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const query = search.toLowerCase();

      const matchesSearch =
        r.id.toLowerCase().includes(query) ||
        r.guest.toLowerCase().includes(query);

      const matchesSource =
        sourceFilter === "All" || r.source === sourceFilter;

      const matchesStatus =
        statusFilter === "All" || r.status === statusFilter;

      const matchesRoom = roomFilter === "All" || r.room === roomFilter;

      let matchesPeriod = true;

      if (period === "custom") {
        matchesPeriod =
          r.checkIn >= customStart && r.checkIn <= customEnd;
      } else if (period === "november") {
        matchesPeriod = r.checkIn.startsWith("2026-11");
      } else if (period === "october") {
        matchesPeriod = r.checkIn.startsWith("2026-10");
      }

      return (
        matchesSearch &&
        matchesSource &&
        matchesStatus &&
        matchesRoom &&
        matchesPeriod
      );
    });
  }, [
    reservations,
    search,
    sourceFilter,
    statusFilter,
    roomFilter,
    period,
    customStart,
    customEnd,
  ]);

  const stats = useMemo(() => {
    const total = filteredReservations.length;
    const confirmed = filteredReservations.filter(
      (r) => r.status === "Confirmed"
    ).length;
    const cancelled = filteredReservations.filter(
      (r) => r.status === "Cancelled"
    ).length;
    const active = filteredReservations.filter(
      (r) => r.status === "Checked In"
    ).length;

    const nights = filteredReservations.reduce(
      (sum, r) => sum + nightsBetween(r.checkIn, r.checkOut),
      0
    );

    const totalRevenue = filteredReservations
      .filter((r) => r.status !== "Cancelled")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      total,
      confirmed,
      cancelled,
      active,
      cancellationRate: total
        ? ((cancelled / total) * 100).toFixed(1)
        : "0.0",
      averageStay: total ? (nights / total).toFixed(1) : "0.0",
      totalRevenue,
    };
  }, [filteredReservations]);

  const sourceData = useMemo(() => {
    const sources = ["Website", "Booking.com", "MakeMyTrip", "Walk-in"];
    const total = filteredReservations.length;

    return sources.map((source) => {
      const count = filteredReservations.filter(
        (r) => r.source === source
      ).length;

      return {
        source,
        count,
        percentage: total ? (count / total) * 100 : 0,
      };
    });
  }, [filteredReservations]);

  const roomData = useMemo(() => {
    const rooms = ["Standard", "Deluxe", "Suite"];

    return rooms.map((room) => {
      const records = filteredReservations.filter((r) => r.room === room);
      return {
        room,
        count: records.length,
        revenue: records
          .filter((r) => r.status !== "Cancelled")
          .reduce((sum, r) => sum + r.amount, 0),
      };
    });
  }, [filteredReservations]);

  const leadTimeData = useMemo(() => {
    const buckets = [
      { label: "Same day", min: 0, max: 0 },
      { label: "1–3 days", min: 1, max: 3 },
      { label: "4–7 days", min: 4, max: 7 },
      { label: "8–14 days", min: 8, max: 14 },
      { label: "15+ days", min: 15, max: Infinity },
    ];

    return buckets.map((bucket) => ({
      ...bucket,
      count: filteredReservations.filter((r) => {
        const lead = daysBetween(r.checkIn, r.bookedOn);
        return lead >= bucket.min && lead <= bucket.max;
      }).length,
    }));
  }, [filteredReservations]);

  const maxSource = Math.max(...sourceData.map((item) => item.count), 1);
  const maxLead = Math.max(...leadTimeData.map((item) => item.count), 1);
  const maxRoom = Math.max(...roomData.map((item) => item.count), 1);

  const resetFilters = () => {
    setSearch("");
    setSourceFilter("All");
    setStatusFilter("All");
    setRoomFilter("All");
    setPeriod("all");
    setCustomStart("2026-11-01");
    setCustomEnd("2026-11-30");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Reports & Analytics</span>
              <span>/</span>
              <span className="font-medium text-indigo-600">Reservation Reports</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Reservation Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Analyze booking activity, reservation sources, lead time and length of stay.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer size={17} /> Print
            </button>
            <button
              onClick={() => exportCSV(filteredReservations)}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Download size={17} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Filter size={18} className="text-indigo-600" />
              Report Filters
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            >
              <RefreshCw size={14} /> Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-slate-400" size={17} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest or booking ID"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="all">All dates</option>
              <option value="november">November 2026</option>
              <option value="october">October 2026</option>
              <option value="custom">Custom date range</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All booking sources</option>
              <option value="Website">Website</option>
              <option value="Booking.com">Booking.com</option>
              <option value="MakeMyTrip">MakeMyTrip</option>
              <option value="Walk-in">Walk-in</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Checked Out">Checked Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All room types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          {period === "custom" && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Start date
                <input
                  type="date"
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                End date
                <input
                  type="date"
                  min={customStart}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700"
                />
              </label>
            </div>
          )}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Reservations"
            value={stats.total}
            subtitle="Reservations matching filters"
            icon={CalendarDays}
            trend="+12.5%"
            positive
          />
          <MetricCard
            title="Confirmed Bookings"
            value={stats.confirmed}
            subtitle="Currently confirmed"
            icon={CheckCircle2}
            trend="+8.2%"
            positive
          />
          <MetricCard
            title="Cancelled Bookings"
            value={stats.cancelled}
            subtitle={`${stats.cancellationRate}% cancellation rate`}
            icon={XCircle}
            trend="-2.4%"
            positive
          />
          <MetricCard
            title="Average Length of Stay"
            value={`${stats.averageStay} nights`}
            subtitle="Across matching reservations"
            icon={BedDouble}
            trend="+0.6 nights"
            positive
          />
        </div>

        {/* Secondary summary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Checked-in reservations</p>
              <Users size={19} className="text-blue-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.active}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Booking revenue</p>
              <TrendingUp size={19} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(stats.totalRevenue)}</p>
            <p className="mt-1 text-xs text-slate-400">Excludes cancelled reservations</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Average booking lead time</p>
              <Clock size={19} className="text-amber-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {filteredReservations.length
                ? (
                    filteredReservations.reduce(
                      (sum, r) => sum + daysBetween(r.checkIn, r.bookedOn),
                      0
                    ) / filteredReservations.length
                  ).toFixed(1)
                : "0.0"}{" "}
              days
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Booking sources */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Booking Sources</h2>
              <p className="mt-1 text-sm text-slate-500">
                Where your reservations are coming from
              </p>
            </div>

            <div className="space-y-5">
              {sourceData.map((item) => (
                <div key={item.source}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{item.source}</span>
                    <span className="text-slate-500">
                      {item.count} bookings ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500 transition-all"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lead time */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Booking Lead Time</h2>
              <p className="mt-1 text-sm text-slate-500">
                How far in advance guests make reservations
              </p>
            </div>

            <div className="space-y-4">
              {leadTimeData.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-xs font-medium text-slate-600">
                    {item.label}
                  </span>
                  <div className="h-8 flex-1 overflow-hidden rounded-lg bg-slate-100">
                    <div
                      className="flex h-full items-center rounded-lg bg-blue-500 px-2 text-xs font-semibold text-white transition-all"
                      style={{
                        width: `${item.count ? Math.max((item.count / maxLead) * 100, 8) : 0}%`,
                      }}
                    >
                      {item.count > 0 ? item.count : ""}
                    </div>
                  </div>
                  <span className="w-7 text-right text-sm font-semibold text-slate-700">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room type performance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Room Type Performance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Reservation volume and booking revenue by room category
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {roomData.map((item) => (
              <div key={item.room} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{item.room}</span>
                  <BedDouble size={18} className="text-indigo-500" />
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-900">{item.count}</p>
                <p className="text-xs text-slate-500">Reservations</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${(item.count / maxRoom) * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-sm font-semibold text-emerald-700">
                  {money(item.revenue)}
                </p>
                <p className="text-xs text-slate-400">Non-cancelled booking value</p>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Reservation Details</h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredReservations.length} of {reservations.length} reservations
              </p>
            </div>
            <button
              onClick={() => exportCSV(filteredReservations)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} /> Download report
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Reservation</th>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Room Type</th>
                  <th className="px-5 py-4 font-semibold">Source</th>
                  <th className="px-5 py-4 font-semibold">Check In / Out</th>
                  <th className="px-5 py-4 font-semibold">Lead Time</th>
                  <th className="px-5 py-4 font-semibold">Nights</th>
                  <th className="px-5 py-4 font-semibold">Amount</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredReservations.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-indigo-600">{r.id}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">{r.guest}</td>
                    <td className="px-5 py-4 text-slate-600">{r.room}</td>
                    <td className="px-5 py-4 text-slate-600">{r.source}</td>
                    <td className="px-5 py-4 text-slate-600">
                      <div>{dateLabel(r.checkIn)}</div>
                      <div className="text-xs text-slate-400">{dateLabel(r.checkOut)}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {daysBetween(r.checkIn, r.bookedOn)} days
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {nightsBetween(r.checkIn, r.checkOut)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {money(r.amount)}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}

                {filteredReservations.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-5 py-12 text-center">
                      <div className="mx-auto flex max-w-sm flex-col items-center">
                        <Search size={30} className="text-slate-300" />
                        <p className="mt-3 font-semibold text-slate-700">
                          No reservations found
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Try changing your search or filters.
                        </p>
                        <button
                          onClick={resetFilters}
                          className="mt-4 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Demo data:</strong> These figures are generated from sample reservations in this frontend page. Connect the reservation API and reporting endpoints later to show live hotel data.
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select { display: none !important; }
          .min-h-screen { min-height: auto !important; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
