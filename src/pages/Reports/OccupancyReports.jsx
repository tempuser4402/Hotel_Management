
import { useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  CheckCircle2,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Filter,
  RefreshCw,
  Users,
  Wrench,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const roomTypes = [
  { name: "Standard", total: 30, occupied: 21, reserved: 5, available: 3, maintenance: 1 },
  { name: "Deluxe", total: 25, occupied: 19, reserved: 3, available: 2, maintenance: 1 },
  { name: "Suite", total: 15, occupied: 11, reserved: 2, available: 2, maintenance: 0 },
  { name: "Family", total: 10, occupied: 7, reserved: 1, available: 1, maintenance: 1 },
];

const dailyOccupancy = [
  { date: "01 Nov", occupied: 42, available: 25, reserved: 8, maintenance: 5 },
  { date: "02 Nov", occupied: 45, available: 22, reserved: 9, maintenance: 4 },
  { date: "03 Nov", occupied: 48, available: 20, reserved: 8, maintenance: 4 },
  { date: "04 Nov", occupied: 51, available: 18, reserved: 7, maintenance: 4 },
  { date: "05 Nov", occupied: 55, available: 15, reserved: 7, maintenance: 3 },
  { date: "06 Nov", occupied: 57, available: 14, reserved: 6, maintenance: 3 },
  { date: "07 Nov", occupied: 58, available: 13, reserved: 6, maintenance: 3 },
];

const monthlyOccupancy = [
  { date: "May", rate: 62, rooms: 50 },
  { date: "Jun", rate: 68, rooms: 54 },
  { date: "Jul", rate: 64, rooms: 51 },
  { date: "Aug", rate: 72, rooms: 58 },
  { date: "Sep", rate: 75, rooms: 60 },
  { date: "Oct", rate: 78, rooms: 62 },
  { date: "Nov", rate: 82, rooms: 66 },
];

const forecasts = [
  { date: "08 Nov", occupancy: 84, status: "High" },
  { date: "09 Nov", occupancy: 88, status: "High" },
  { date: "10 Nov", occupancy: 76, status: "Normal" },
  { date: "11 Nov", occupancy: 72, status: "Normal" },
  { date: "12 Nov", occupancy: 91, status: "High" },
  { date: "13 Nov", occupancy: 95, status: "High" },
  { date: "14 Nov", occupancy: 86, status: "High" },
];

const roomRecords = [
  { room: "101", type: "Standard", floor: "1", status: "Occupied", guest: "Aarav Sharma", checkOut: "08 Nov" },
  { room: "102", type: "Standard", floor: "1", status: "Available", guest: "—", checkOut: "—" },
  { room: "103", type: "Deluxe", floor: "1", status: "Occupied", guest: "Priya Verma", checkOut: "09 Nov" },
  { room: "201", type: "Suite", floor: "2", status: "Reserved", guest: "Neha Singh", checkOut: "11 Nov" },
  { room: "202", type: "Deluxe", floor: "2", status: "Occupied", guest: "Rahul Mehta", checkOut: "07 Nov" },
  { room: "203", type: "Family", floor: "2", status: "Maintenance", guest: "—", checkOut: "—" },
  { room: "301", type: "Suite", floor: "3", status: "Occupied", guest: "Ananya Gupta", checkOut: "10 Nov" },
  { room: "302", type: "Standard", floor: "3", status: "Reserved", guest: "Vikram Rao", checkOut: "12 Nov" },
  { room: "303", type: "Deluxe", floor: "3", status: "Available", guest: "—", checkOut: "—" },
  { room: "401", type: "Family", floor: "4", status: "Occupied", guest: "Isha Kapoor", checkOut: "13 Nov" },
];

const moneyPercent = (value) => `${Number(value).toFixed(1)}%`;

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

function RoomStatusBadge({ status }) {
  const styles = {
    Occupied: "bg-blue-50 text-blue-700",
    Available: "bg-emerald-50 text-emerald-700",
    Reserved: "bg-amber-50 text-amber-700",
    Maintenance: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function OccupancyBars({ rows, mode }) {
  const max = 100;

  return (
    <div className="flex h-64 items-end gap-3 border-b border-slate-200 pb-2">
      {rows.map((item) => {
        const value = mode === "daily"
          ? (item.occupied / 80) * 100
          : item.rate;

        return (
          <div key={item.date} className="flex h-full min-w-0 flex-1 flex-col justify-end">
            <div className="mb-2 text-center text-xs font-semibold text-slate-600">
              {moneyPercent(value)}
            </div>
            <div className="flex flex-1 items-end">
              <div
                className="w-full rounded-t-lg bg-indigo-500 transition-all"
                style={{ height: `${Math.min((value / max) * 100, 100)}%` }}
                title={`${item.date}: ${moneyPercent(value)}`}
              />
            </div>
            <span className="mt-2 truncate text-center text-xs text-slate-500">
              {item.date}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OccupancyReports() {
  const [view, setView] = useState("daily");
  const [period, setPeriod] = useState("november");
  const [roomFilter, setRoomFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [floorFilter, setFloorFilter] = useState("All");
  const [startDate, setStartDate] = useState("2026-11-01");
  const [endDate, setEndDate] = useState("2026-11-30");

  const totalRooms = roomTypes.reduce((sum, r) => sum + r.total, 0);
  const occupiedRooms = roomTypes.reduce((sum, r) => sum + r.occupied, 0);
  const reservedRooms = roomTypes.reduce((sum, r) => sum + r.reserved, 0);
  const availableRooms = roomTypes.reduce((sum, r) => sum + r.available, 0);
  const maintenanceRooms = roomTypes.reduce((sum, r) => sum + r.maintenance, 0);

  const occupancyRate = totalRooms
    ? (occupiedRooms / totalRooms) * 100
    : 0;

  const filteredRooms = useMemo(() => {
    const query = search.toLowerCase();

    return roomRecords.filter((room) => {
      const matchesSearch =
        room.room.toLowerCase().includes(query) ||
        room.guest.toLowerCase().includes(query);

      const matchesType =
        roomFilter === "All" || room.type === roomFilter;

      const matchesStatus =
        statusFilter === "All" || room.status === statusFilter;

      const matchesFloor =
        floorFilter === "All" || room.floor === floorFilter;

      return matchesSearch && matchesType && matchesStatus && matchesFloor;
    });
  }, [search, roomFilter, statusFilter, floorFilter]);

  const filteredRoomTypes = useMemo(() => {
    return roomFilter === "All"
      ? roomTypes
      : roomTypes.filter((r) => r.name === roomFilter);
  }, [roomFilter]);

  const chartRows = view === "daily" ? dailyOccupancy : monthlyOccupancy;

  const clearFilters = () => {
    setPeriod("november");
    setRoomFilter("All");
    setStatusFilter("All");
    setFloorFilter("All");
    setSearch("");
    setStartDate("2026-11-01");
    setEndDate("2026-11-30");
  };

  const exportCSV = () => {
    const headers = [
      "Room Number",
      "Room Type",
      "Floor",
      "Status",
      "Guest",
      "Expected Check Out",
    ];

    const rows = filteredRooms.map((r) => [
      r.room,
      r.type,
      r.floor,
      r.status,
      r.guest,
      r.checkOut,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "occupancy-report.csv";
    link.click();
    URL.revokeObjectURL(url);
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
              <span className="font-medium text-indigo-600">Occupancy Reports</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Occupancy Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor room occupancy, room availability, room-type performance and upcoming demand.
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
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
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
              onClick={clearFilters}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600"
            >
              <RefreshCw size={14} /> Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="november">November 2026</option>
              <option value="october">October 2026</option>
              <option value="all">All dates</option>
              <option value="custom">Custom date range</option>
            </select>

            <select
              value={roomFilter}
              onChange={(e) => setRoomFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All room types</option>
              {roomTypes.map((r) => (
                <option key={r.name} value={r.name}>{r.name}</option>
              ))}
            </select>

            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All room statuses</option>
              <option value="Occupied">Occupied</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          {period === "custom" && (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="text-xs font-medium text-slate-500">
                Start date
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
              <label className="text-xs font-medium text-slate-500">
                End date
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
                />
              </label>
            </div>
          )}
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Occupancy Rate"
            value={moneyPercent(occupancyRate)}
            subtitle="Occupied rooms ÷ total rooms"
            icon={TrendingUp}
            trend="+6.4%"
            positive
          />
          <MetricCard
            title="Occupied Rooms"
            value={occupiedRooms}
            subtitle={`Out of ${totalRooms} total rooms`}
            icon={BedDouble}
            trend="+8 rooms"
            positive
          />
          <MetricCard
            title="Available Rooms"
            value={availableRooms}
            subtitle="Ready for new reservations"
            icon={CheckCircle2}
            trend="-3 rooms"
            positive={false}
          />
          <MetricCard
            title="Reserved Rooms"
            value={reservedRooms}
            subtitle="Upcoming guest arrivals"
            icon={CalendarDays}
            trend="+5 rooms"
            positive
          />
        </div>

        {/* Status overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Rooms under maintenance</p>
              <Wrench size={20} className="text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{maintenanceRooms}</p>
            <p className="mt-1 text-xs text-slate-400">Temporarily unavailable</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Total room inventory</p>
              <Building2 size={20} className="text-indigo-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalRooms}</p>
            <p className="mt-1 text-xs text-slate-400">Across all room categories</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Rooms in use or reserved</p>
              <Users size={20} className="text-emerald-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{occupiedRooms + reservedRooms}</p>
            <p className="mt-1 text-xs text-slate-400">Occupied plus reserved rooms</p>
          </div>
        </div>

        {/* Occupancy chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Occupancy Trends</h2>
              <p className="mt-1 text-sm text-slate-500">
                Review historical daily or monthly occupancy
              </p>
            </div>
            <div className="flex rounded-xl bg-slate-100 p-1">
              <button
                onClick={() => setView("daily")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "daily" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Daily
              </button>
              <button
                onClick={() => setView("monthly")}
                className={`rounded-lg px-4 py-2 text-sm font-semibold ${view === "monthly" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500"}`}
              >
                Monthly
              </button>
            </div>
          </div>

          <OccupancyBars rows={chartRows} mode={view} />
          <p className="mt-4 text-xs text-slate-400">
            Daily chart values are based on an 80-room sample inventory. Monthly values are illustrative percentages.
          </p>
        </div>

        {/* Room type occupancy */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h2 className="font-bold text-slate-900">Room Type Occupancy</h2>
            <p className="mt-1 text-sm text-slate-500">
              Occupied, reserved, available and maintenance rooms by category
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Room Type</th>
                  <th className="px-4 py-3 font-semibold">Total</th>
                  <th className="px-4 py-3 font-semibold">Occupied</th>
                  <th className="px-4 py-3 font-semibold">Reserved</th>
                  <th className="px-4 py-3 font-semibold">Available</th>
                  <th className="px-4 py-3 font-semibold">Maintenance</th>
                  <th className="px-4 py-3 font-semibold">Occupancy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRoomTypes.map((room) => (
                  <tr key={room.name} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-800">{room.name}</td>
                    <td className="px-4 py-4 text-slate-600">{room.total}</td>
                    <td className="px-4 py-4 font-semibold text-blue-700">{room.occupied}</td>
                    <td className="px-4 py-4 text-amber-700">{room.reserved}</td>
                    <td className="px-4 py-4 text-emerald-700">{room.available}</td>
                    <td className="px-4 py-4 text-rose-700">{room.maintenance}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {moneyPercent((room.occupied / room.total) * 100)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forecast */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles size={20} className="text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-900">Upcoming Occupancy Forecast</h2>
              <p className="mt-1 text-sm text-slate-500">
                Sample projected occupancy for the next seven days
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {forecasts.map((item) => (
              <div key={item.date} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-medium text-slate-500">{item.date}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{item.occupancy}%</p>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${item.occupancy >= 85 ? "bg-amber-500" : "bg-indigo-500"}`}
                    style={{ width: `${item.occupancy}%` }}
                  />
                </div>
                <p className={`mt-2 text-xs font-semibold ${item.status === "High" ? "text-amber-600" : "text-emerald-600"}`}>
                  {item.status} demand
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Room-level report */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">Room-wise Occupancy</h2>
              <p className="mt-1 text-sm text-slate-500">
                {filteredRooms.length} room records matching filters
              </p>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room or guest"
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Room</th>
                  <th className="px-5 py-4 font-semibold">Room Type</th>
                  <th className="px-5 py-4 font-semibold">Floor</th>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Expected Check-out</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => (
                  <tr key={room.room} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-indigo-600">{room.room}</td>
                    <td className="px-5 py-4 text-slate-600">{room.type}</td>
                    <td className="px-5 py-4 text-slate-600">{room.floor}</td>
                    <td className="px-5 py-4 text-slate-700">{room.guest}</td>
                    <td className="px-5 py-4 text-slate-600">{room.checkOut}</td>
                    <td className="px-5 py-4"><RoomStatusBadge status={room.status} /></td>
                  </tr>
                ))}

                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-12 text-center text-slate-500">
                      No rooms match your filters.
                      <button onClick={clearFilters} className="ml-2 font-semibold text-indigo-600">
                        Reset filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Demo data:</strong> Occupancy figures, room records and forecasts are sample frontend values. The date selector is a UI filter placeholder and does not recalculate the historical occupancy chart. Live occupancy and forecasting will require room, reservation and availability data from the backend.
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select { display: none !important; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
