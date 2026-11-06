import { useMemo, useState } from "react";
import {
  BedDouble,
  Users,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  LogIn,
  LogOut,
  Download,
  Search,
  X,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from "lucide-react";

const TOTAL_ROOMS = 32;

const forecastData = [
  { date: "2026-11-06", occupied: 21, arrivals: 5, departures: 3, adr: 2100 },
  { date: "2026-11-07", occupied: 25, arrivals: 8, departures: 4, adr: 2300 },
  { date: "2026-11-08", occupied: 27, arrivals: 6, departures: 4, adr: 2400 },
  { date: "2026-11-09", occupied: 19, arrivals: 2, departures: 10, adr: 2000 },
  { date: "2026-11-10", occupied: 22, arrivals: 7, departures: 4, adr: 2100 },
  { date: "2026-11-11", occupied: 24, arrivals: 6, departures: 4, adr: 2200 },
  { date: "2026-11-12", occupied: 26, arrivals: 8, departures: 6, adr: 2300 },
  { date: "2026-11-13", occupied: 29, arrivals: 9, departures: 6, adr: 2500 },
  { date: "2026-11-14", occupied: 30, arrivals: 7, departures: 6, adr: 2600 },
  { date: "2026-11-15", occupied: 28, arrivals: 4, departures: 6, adr: 2500 },
  { date: "2026-11-16", occupied: 23, arrivals: 3, departures: 8, adr: 2200 },
  { date: "2026-11-17", occupied: 20, arrivals: 5, departures: 8, adr: 2100 },
  { date: "2026-11-18", occupied: 25, arrivals: 9, departures: 4, adr: 2300 },
  { date: "2026-11-19", occupied: 27, arrivals: 7, departures: 5, adr: 2400 },
];

const reservationData = [
  {
    id: "RES-1021",
    guest: "Rahul Sharma",
    room: "Deluxe",
    roomNo: "204",
    date: "2026-11-06",
    type: "Arrival",
    status: "Confirmed",
  },
  {
    id: "RES-1022",
    guest: "Priya Verma",
    room: "Standard",
    roomNo: "105",
    date: "2026-11-06",
    type: "Arrival",
    status: "Expected",
  },
  {
    id: "RES-1023",
    guest: "Amit Kumar",
    room: "Family Suite",
    roomNo: "301",
    date: "2026-11-07",
    type: "Arrival",
    status: "Confirmed",
  },
  {
    id: "RES-1024",
    guest: "Neha Singh",
    room: "Standard",
    roomNo: "108",
    date: "2026-11-07",
    type: "Departure",
    status: "Confirmed",
  },
  {
    id: "RES-1025",
    guest: "Vikas Gupta",
    room: "Super Deluxe",
    roomNo: "210",
    date: "2026-11-08",
    type: "Arrival",
    status: "Expected",
  },
  {
    id: "RES-1026",
    guest: "Anjali Mehta",
    room: "Deluxe",
    roomNo: "205",
    date: "2026-11-09",
    type: "Departure",
    status: "Confirmed",
  },
  {
    id: "RES-1027",
    guest: "Rohit Jain",
    room: "Standard",
    roomNo: "102",
    date: "2026-11-10",
    type: "Arrival",
    status: "Confirmed",
  },
  {
    id: "RES-1028",
    guest: "Karan Yadav",
    room: "Family Suite",
    roomNo: "302",
    date: "2026-11-12",
    type: "Arrival",
    status: "Expected",
  },
  {
    id: "RES-1029",
    guest: "Pooja Agarwal",
    room: "Deluxe",
    roomNo: "207",
    date: "2026-11-13",
    type: "Departure",
    status: "Confirmed",
  },
  {
    id: "RES-1030",
    guest: "Manish Sharma",
    room: "Super Deluxe",
    roomNo: "212",
    date: "2026-11-14",
    type: "Arrival",
    status: "Confirmed",
  },
  {
    id: "RES-1031",
    guest: "Sakshi Rao",
    room: "Standard",
    roomNo: "110",
    date: "2026-11-16",
    type: "Departure",
    status: "Confirmed",
  },
  {
    id: "RES-1032",
    guest: "Deepak Saini",
    room: "Deluxe",
    roomNo: "206",
    date: "2026-11-18",
    type: "Arrival",
    status: "Expected",
  },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
          {trend && (
            <p className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp size={14} /> {trend}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function Badge({ children, color = "blue" }) {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    red: "bg-red-100 text-red-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[color]}`}
    >
      {children}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="sticky top-0 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export default function OccupancyForecast() {
  const [startDate, setStartDate] = useState("2026-11-06");
  const [endDate, setEndDate] = useState("2026-11-19");
  const [reservationSearch, setReservationSearch] = useState("");
  const [reservationType, setReservationType] = useState("All");
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const filteredDays = useMemo(() => {
    return forecastData.filter(
      (day) => day.date >= startDate && day.date <= endDate,
    );
  }, [startDate, endDate]);

  const summary = useMemo(() => {
    if (!filteredDays.length) {
      return {
        averageOccupied: 0,
        averageOccupancy: 0,
        averageAvailable: TOTAL_ROOMS,
        forecastRevenue: 0,
        peakOccupancy: 0,
        totalArrivals: 0,
        totalDepartures: 0,
        averageAdr: 0,
      };
    }

    const occupiedTotal = filteredDays.reduce(
      (sum, day) => sum + day.occupied,
      0,
    );

    const revenue = filteredDays.reduce(
      (sum, day) => sum + day.occupied * day.adr,
      0,
    );

    return {
      averageOccupied: occupiedTotal / filteredDays.length,
      averageOccupancy:
        (occupiedTotal / (filteredDays.length * TOTAL_ROOMS)) * 100,
      averageAvailable: TOTAL_ROOMS - occupiedTotal / filteredDays.length,
      forecastRevenue: revenue,
      peakOccupancy: Math.max(
        ...filteredDays.map((day) => (day.occupied / TOTAL_ROOMS) * 100),
      ),
      totalArrivals: filteredDays.reduce((sum, day) => sum + day.arrivals, 0),
      totalDepartures: filteredDays.reduce(
        (sum, day) => sum + day.departures,
        0,
      ),
      averageAdr: occupiedTotal ? revenue / occupiedTotal : 0,
    };
  }, [filteredDays]);

  const filteredReservations = useMemo(() => {
    return reservationData.filter((reservation) => {
      const matchesDate =
        reservation.date >= startDate && reservation.date <= endDate;

      const matchesType =
        reservationType === "All" || reservation.type === reservationType;

      const matchesSearch =
        `${reservation.guest} ${reservation.id} ${reservation.room} ${reservation.roomNo}`
          .toLowerCase()
          .includes(reservationSearch.toLowerCase());

      const matchesTab =
        activeTab === "all" ||
        (activeTab === "arrivals" && reservation.type === "Arrival") ||
        (activeTab === "departures" && reservation.type === "Departure");

      return matchesDate && matchesType && matchesSearch && matchesTab;
    });
  }, [startDate, endDate, reservationSearch, reservationType, activeTab]);

  const occupancyPercent = Math.round(summary.averageOccupancy);
  const availableRooms = Math.round(summary.averageAvailable);

  const exportCSV = () => {
    const rows = [
      [
        "Date",
        "Occupied Rooms",
        "Available Rooms",
        "Occupancy %",
        "Arrivals",
        "Departures",
        "ADR",
        "Forecast Revenue",
      ],
      ...filteredDays.map((day) => [
        day.date,
        day.occupied,
        TOTAL_ROOMS - day.occupied,
        ((day.occupied / TOTAL_ROOMS) * 100).toFixed(1),
        day.arrivals,
        day.departures,
        day.adr,
        day.occupied * day.adr,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "occupancy-forecast.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const setQuickRange = (days) => {
    const start = new Date(`${startDate}T00:00:00`);
    const end = new Date(start);
    end.setDate(end.getDate() + days - 1);
    setEndDate(end.toISOString().slice(0, 10));
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Occupancy & Forecast
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor room occupancy, future bookings and expected room revenue.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download size={17} /> Export Forecast
        </button>
      </div>

      {/* Date Range */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                From Date
              </span>
              <input
                type="date"
                className={inputClass}
                value={startDate}
                max="2027-12-31"
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (e.target.value > endDate) setEndDate(e.target.value);
                }}
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-slate-700">
                To Date
              </span>
              <input
                type="date"
                className={inputClass}
                value={endDate}
                min={startDate}
                max="2027-12-31"
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setQuickRange(7)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              7 Days
            </button>
            <button
              onClick={() => setQuickRange(14)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              14 Days
            </button>
            <button
              onClick={() => setQuickRange(30)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              30 Days
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Average Occupancy"
          value={`${occupancyPercent}%`}
          subtitle="Average room occupancy for selected dates"
          icon={BedDouble}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Available Rooms"
          value={availableRooms}
          subtitle="Average rooms available per day"
          icon={CalendarDays}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Forecast Revenue"
          value={money(summary.forecastRevenue)}
          subtitle="Estimated room revenue for selected dates"
          icon={IndianRupee}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Peak Occupancy"
          value={`${Math.round(summary.peakOccupancy)}%`}
          subtitle="Highest forecast occupancy in range"
          icon={TrendingUp}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Arrivals / departures / ADR */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
            <LogIn size={23} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Expected Arrivals</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-800">
              {summary.totalArrivals}
            </h3>
            <p className="text-xs text-slate-400">
              Room arrivals in date range
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
            <LogOut size={23} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Expected Departures</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-800">
              {summary.totalDepartures}
            </h3>
            <p className="text-xs text-slate-400">
              Room departures in date range
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
            <IndianRupee size={23} />
          </div>
          <div>
            <p className="text-sm text-slate-500">Average Daily Rate (ADR)</p>
            <h3 className="mt-1 text-2xl font-bold text-slate-800">
              {money(summary.averageAdr)}
            </h3>
            <p className="text-xs text-slate-400">
              Average revenue per occupied room
            </p>
          </div>
        </div>
      </div>

      {/* Occupancy Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-800">
              Occupancy Forecast Trend
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Daily occupied rooms compared with total room inventory.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2.5 w-2.5 rounded-sm bg-blue-600" />
            Occupied
            <span className="ml-3 h-2.5 w-2.5 rounded-sm bg-slate-200" />
            Available
          </div>
        </div>

        {filteredDays.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-500">
            No forecast data is available for this date range.
          </div>
        ) : (
          <div className="flex h-64 items-end gap-2 overflow-x-auto pb-2">
            {filteredDays.map((day) => {
              const percent = (day.occupied / TOTAL_ROOMS) * 100;

              return (
                <div
                  key={day.date}
                  className="flex h-full min-w-[45px] flex-1 flex-col items-center justify-end gap-2"
                  title={`${formatDate(day.date)}: ${day.occupied}/${TOTAL_ROOMS} rooms occupied (${Math.round(percent)}%)`}
                >
                  <span className="text-[10px] font-semibold text-slate-600">
                    {Math.round(percent)}%
                  </span>
                  <div className="flex h-44 w-full max-w-12 flex-col justify-end overflow-hidden rounded-t-md bg-slate-100">
                    <div
                      className="w-full rounded-t-md bg-blue-600 transition-all"
                      style={{ height: `${percent}%` }}
                    />
                  </div>
                  <span className="whitespace-nowrap text-[10px] text-slate-500">
                    {new Date(`${day.date}T00:00:00`).toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                      },
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-4 border-t border-slate-100 pt-4">
          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500">
            <span>Total room inventory: {TOTAL_ROOMS}</span>
            <span>Selected days: {filteredDays.length}</span>
            <span>Average occupancy: {occupancyPercent}%</span>
          </div>
        </div>
      </div>

      {/* Daily Forecast Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            Daily Occupancy Forecast
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Room availability, occupancy and estimated revenue by date.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Total Rooms</th>
                <th className="px-5 py-3">Occupied</th>
                <th className="px-5 py-3">Available</th>
                <th className="px-5 py-3">Occupancy</th>
                <th className="px-5 py-3">Arrivals</th>
                <th className="px-5 py-3">Departures</th>
                <th className="px-5 py-3">Forecast Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDays.map((day) => {
                const percent = Math.round((day.occupied / TOTAL_ROOMS) * 100);

                return (
                  <tr key={day.date} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {formatDate(day.date)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">{TOTAL_ROOMS}</td>
                    <td className="px-5 py-4 font-medium text-slate-800">
                      {day.occupied}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {TOTAL_ROOMS - day.occupied}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        color={
                          percent >= 85
                            ? "green"
                            : percent >= 65
                              ? "blue"
                              : "yellow"
                        }
                      >
                        {percent}%
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-blue-700">{day.arrivals}</td>
                    <td className="px-5 py-4 text-orange-700">
                      {day.departures}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {money(day.occupied * day.adr)}
                    </td>
                  </tr>
                );
              })}
              {filteredDays.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No forecast records found for the selected dates.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Movement */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-800">
            Expected Arrivals & Departures
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Reservation movement within the selected date range.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: "all", label: "All" },
              { id: "arrivals", label: "Arrivals" },
              { id: "departures", label: "Departures" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="relative min-w-[200px]">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                className={`${inputClass} pl-9`}
                placeholder="Search guest or booking..."
                value={reservationSearch}
                onChange={(e) => setReservationSearch(e.target.value)}
              />
            </div>

            <select
              className={inputClass}
              value={reservationType}
              onChange={(e) => setReservationType(e.target.value)}
            >
              <option value="All">All Movements</option>
              <option value="Arrival">Arrival</option>
              <option value="Departure">Departure</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Booking ID</th>
                <th className="px-5 py-3">Guest</th>
                <th className="px-5 py-3">Room</th>
                <th className="px-5 py-3">Room No.</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Movement</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.map((reservation) => (
                <tr key={reservation.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-blue-600">
                    {reservation.id}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {reservation.guest}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {reservation.room}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {reservation.roomNo}
                  </td>
                  <td className="px-5 py-4 text-slate-600">
                    {formatDate(reservation.date)}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      color={reservation.type === "Arrival" ? "blue" : "yellow"}
                    >
                      {reservation.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      color={
                        reservation.status === "Confirmed" ? "green" : "yellow"
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelectedReservation(reservation)}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReservations.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No arrivals or departures found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservation Details */}
      {selectedReservation && (
        <Modal
          title="Reservation Movement Details"
          onClose={() => setSelectedReservation(null)}
        >
          <div className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Booking ID</p>
              <p className="mt-1 font-semibold text-blue-600">
                {selectedReservation.id}
              </p>
            </div>

            {[
              ["Guest Name", selectedReservation.guest],
              ["Room Type", selectedReservation.room],
              ["Room Number", selectedReservation.roomNo],
              ["Date", formatDate(selectedReservation.date)],
              ["Movement", selectedReservation.type],
              ["Booking Status", selectedReservation.status],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3"
              >
                <span className="text-sm text-slate-500">{label}</span>
                <span className="text-right text-sm font-medium text-slate-800">
                  {value}
                </span>
              </div>
            ))}

            <button
              onClick={() => setSelectedReservation(null)}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {/* Forecast Note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <BarChart3 className="shrink-0 text-blue-600" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Forecast calculation
            </h3>
            <p className="mt-1 text-xs leading-5 text-blue-800">
              Occupancy = occupied rooms ÷ total available rooms × 100. Forecast
              room revenue = forecast occupied room nights × expected ADR.
              Actual values should be calculated from confirmed reservations,
              cancellations, room blocks and room availability in the backend.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
