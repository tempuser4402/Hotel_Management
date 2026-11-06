
import { useMemo, useState } from "react";
import {
  BedDouble,
  DoorOpen,
  Hotel,
  CalendarCheck,
  Brush,
  Wrench,
  Search,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Filter,
  ChevronRight,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";

// Demo room data
const initialRooms = [
  { id: "R001", number: "101", type: "Standard", floor: 1, capacity: 2, rate: 2000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R002", number: "102", type: "Standard", floor: 1, capacity: 2, rate: 2000, status: "Available", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R003", number: "103", type: "Deluxe", floor: 1, capacity: 2, rate: 3000, status: "Reserved", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R004", number: "104", type: "Deluxe", floor: 1, capacity: 3, rate: 3200, status: "Cleaning", housekeeping: "Dirty", maintenance: "Normal" },
  { id: "R005", number: "105", type: "Suite", floor: 1, capacity: 4, rate: 5000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R006", number: "201", type: "Standard", floor: 2, capacity: 2, rate: 2000, status: "Available", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R007", number: "202", type: "Deluxe", floor: 2, capacity: 2, rate: 3000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R008", number: "203", type: "Suite", floor: 2, capacity: 4, rate: 5000, status: "Maintenance", housekeeping: "Dirty", maintenance: "Under Repair" },
  { id: "R009", number: "204", type: "Family Room", floor: 2, capacity: 5, rate: 4500, status: "Reserved", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R010", number: "205", type: "Deluxe", floor: 2, capacity: 3, rate: 3200, status: "Available", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R011", number: "301", type: "Suite", floor: 3, capacity: 4, rate: 5000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R012", number: "302", type: "Family Room", floor: 3, capacity: 5, rate: 4500, status: "Cleaning", housekeeping: "Dirty", maintenance: "Normal" },
  { id: "R013", number: "303", type: "Presidential Suite", floor: 3, capacity: 6, rate: 10000, status: "Available", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R014", number: "304", type: "Standard", floor: 3, capacity: 2, rate: 2000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal" },
  { id: "R015", number: "305", type: "Deluxe", floor: 3, capacity: 3, rate: 3200, status: "Maintenance", housekeeping: "Dirty", maintenance: "Under Repair" },
];

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const statusConfig = {
  Available: {
    color: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  Occupied: {
    color: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Reserved: {
    color: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  Cleaning: {
    color: "bg-amber-50 text-amber-700",
    dot: "bg-amber-500",
  },
  Maintenance: {
    color: "bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Available;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${config.color}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>

      {trend && (
        <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
          <ArrowUpRight size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}

export default function RoomOverview() {
  const [rooms] = useState(initialRooms);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const totalRooms = rooms.length;

  const countStatus = (status) =>
    rooms.filter((room) => room.status === status).length;

  const availableRooms = countStatus("Available");
  const occupiedRooms = countStatus("Occupied");
  const reservedRooms = countStatus("Reserved");
  const cleaningRooms = countStatus("Cleaning");
  const maintenanceRooms = countStatus("Maintenance");

  const occupancy = totalRooms
    ? Math.round((occupiedRooms / totalRooms) * 100)
    : 0;

  const roomTypes = useMemo(() => {
    const types = {};

    rooms.forEach((room) => {
      if (!types[room.type]) {
        types[room.type] = {
          name: room.type,
          total: 0,
          occupied: 0,
          available: 0,
        };
      }

      types[room.type].total += 1;

      if (room.status === "Occupied") {
        types[room.type].occupied += 1;
      }

      if (room.status === "Available") {
        types[room.type].available += 1;
      }
    });

    return Object.values(types);
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase()) ||
        room.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        selectedStatus === "All" || room.status === selectedStatus;

      const matchesType =
        selectedType === "All" || room.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [rooms, search, selectedStatus, selectedType]);

  const statusItems = [
    { label: "Available", count: availableRooms, icon: DoorOpen, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Occupied", count: occupiedRooms, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Reserved", count: reservedRooms, icon: CalendarCheck, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Cleaning", count: cleaningRooms, icon: Brush, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Maintenance", count: maintenanceRooms, icon: Wrench, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const resetFilters = () => {
    setSearch("");
    setSelectedStatus("All");
    setSelectedType("All");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={16} />
              Property Operations
              <ChevronRight size={14} />
              <span className="text-slate-800">Rooms & Rates</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Room Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor room availability, occupancy and property status.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 shadow-sm">
            <Hotel size={17} className="text-indigo-600" />
            <span className="font-medium">Property Overview</span>
          </div>
        </div>

        {/* Main Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <StatCard
            title="Total Rooms"
            value={totalRooms}
            subtitle="Registered rooms"
            icon={BedDouble}
            color="blue"
          />
          <StatCard
            title="Available"
            value={availableRooms}
            subtitle="Ready for booking"
            icon={DoorOpen}
            color="green"
          />
          <StatCard
            title="Occupied"
            value={occupiedRooms}
            subtitle="Currently occupied"
            icon={Users}
            color="violet"
          />
          <StatCard
            title="Reserved"
            value={reservedRooms}
            subtitle="Upcoming reservations"
            icon={CalendarCheck}
            color="indigo"
          />
          <StatCard
            title="Cleaning"
            value={cleaningRooms}
            subtitle="Housekeeping required"
            icon={Brush}
            color="amber"
          />
          <StatCard
            title="Maintenance"
            value={maintenanceRooms}
            subtitle="Under maintenance"
            icon={Wrench}
            color="rose"
          />
        </div>

        {/* Occupancy and Status */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">

          {/* Occupancy */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Occupancy Overview
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Current room occupancy
                </p>
              </div>
              <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600">
                <Hotel size={20} />
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center">
              <div className="relative flex h-44 w-44 items-center justify-center">
                <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
                  <circle
                    cx="100"
                    cy="100"
                    r="78"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="17"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="78"
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="17"
                    strokeLinecap="round"
                    strokeDasharray={`${(occupancy / 100) * 490} 490`}
                  />
                </svg>

                <div className="absolute text-center">
                  <h3 className="text-4xl font-bold text-slate-900">
                    {occupancy}%
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">Occupancy</p>
                </div>
              </div>

              <div className="mt-5 grid w-full grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Occupied</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {occupiedRooms}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Vacant</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {totalRooms - occupiedRooms}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Status Summary */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">
                  Room Status Summary
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Current distribution of room statuses
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {totalRooms} Total Rooms
              </span>
            </div>

            <div className="mt-6 space-y-5">
              {statusItems.map((item) => {
                const percentage = totalRooms
                  ? (item.count / totalRooms) * 100
                  : 0;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setSelectedStatus(
                        selectedStatus === item.label ? "All" : item.label
                      );
                      setSelectedType("All");
                    }}
                    className="w-full text-left"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`rounded-lg p-2 ${item.bg} ${item.color}`}>
                          <item.icon size={16} />
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">
                          {item.count}
                        </span>
                        <span className="text-xs text-slate-400">
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>

                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full transition-all ${
                          item.label === "Available"
                            ? "bg-emerald-500"
                            : item.label === "Occupied"
                            ? "bg-blue-500"
                            : item.label === "Reserved"
                            ? "bg-violet-500"
                            : item.label === "Cleaning"
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <p className="mt-5 text-xs text-slate-400">
              Click any status to filter the room list below.
            </p>
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Room Type Distribution
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Room counts grouped by accommodation category
              </p>
            </div>

            <span className="text-xs font-medium text-slate-500">
              {roomTypes.length} room categories
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {roomTypes.map((type) => {
              const percentage = totalRooms
                ? (type.total / totalRooms) * 100
                : 0;

              return (
                <button
                  key={type.name}
                  onClick={() => {
                    setSelectedType(
                      selectedType === type.name ? "All" : type.name
                    );
                    setSelectedStatus("All");
                  }}
                  className={`rounded-xl border p-4 text-left transition hover:shadow-sm ${
                    selectedType === type.name
                      ? "border-indigo-400 bg-indigo-50"
                      : "border-slate-200 bg-white hover:border-indigo-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                      <BedDouble size={18} />
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-800">
                    {type.name}
                  </h3>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {type.total}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-emerald-600">
                      {type.available} Available
                    </span>
                    <span className="text-blue-600">
                      {type.occupied} Occupied
                    </span>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Room List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-bold text-slate-900">
                Room Status Details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                View room-wise availability and housekeeping information.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-52"
                />
              </div>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
              >
                <option value="All">All Statuses</option>
                {statusItems.map((item) => (
                  <option key={item.label} value={item.label}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                onClick={resetFilters}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw size={15} />
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-5 py-3">
            <Filter size={15} className="text-slate-400" />
            <span className="text-xs text-slate-500">Room type:</span>

            <button
              onClick={() => setSelectedType("All")}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                selectedType === "All"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              All Types
            </button>

            {roomTypes.map((type) => (
              <button
                key={type.name}
                onClick={() => setSelectedType(type.name)}
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedType === type.name
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type.name}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Room</th>
                  <th className="px-5 py-4 font-semibold">Room Type</th>
                  <th className="px-5 py-4 font-semibold">Floor</th>
                  <th className="px-5 py-4 font-semibold">Capacity</th>
                  <th className="px-5 py-4 font-semibold">Base Rate</th>
                  <th className="px-5 py-4 font-semibold">Room Status</th>
                  <th className="px-5 py-4 font-semibold">Housekeeping</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                          <BedDouble size={17} />
                        </div>
                        <span className="font-bold text-slate-800">
                          {room.number}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {room.type}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      Floor {room.floor}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {room.capacity} Guests
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {money(room.rate)}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={room.status} />
                    </td>

                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold ${
                        room.housekeeping === "Clean"
                          ? "text-emerald-600"
                          : "text-amber-600"
                      }`}>
                        {room.housekeeping}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRooms.length === 0 && (
              <div className="py-12 text-center">
                <AlertCircle size={30} className="mx-auto text-slate-300" />
                <p className="mt-3 font-semibold text-slate-700">
                  No rooms found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing {filteredRooms.length} of {totalRooms} rooms
            </p>
          </div>
        </div>

        {/* Room Details Modal */}
        {selectedRoom && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Room {selectedRoom.number}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Room details and current status
                  </p>
                </div>

                <button
                  onClick={() => setSelectedRoom(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ["Room ID", selectedRoom.id],
                  ["Room Type", selectedRoom.type],
                  ["Floor", selectedRoom.floor],
                  ["Capacity", `${selectedRoom.capacity} Guests`],
                  ["Base Rate", money(selectedRoom.rate)],
                  ["Maintenance", selectedRoom.maintenance],
                  ["Housekeeping", selectedRoom.housekeeping],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Current Status</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedRoom.status} />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedRoom(null)}
                className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
