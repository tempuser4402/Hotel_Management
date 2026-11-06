
import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  Users,
  CheckCircle2,
  X,
  Lock,
  Clock,
  AlertCircle,
  Building2,
  RefreshCw,
  Filter,
  Eye,
  Ban,
  CalendarCheck,
  DoorOpen,
} from "lucide-react";

const initialRooms = [
  { id: "R001", number: "101", type: "Standard", floor: 1, capacity: 2 },
  { id: "R002", number: "102", type: "Deluxe", floor: 1, capacity: 2 },
  { id: "R003", number: "103", type: "Suite", floor: 1, capacity: 4 },
  { id: "R004", number: "104", type: "Standard", floor: 1, capacity: 2 },
  { id: "R005", number: "201", type: "Family Room", floor: 2, capacity: 5 },
  { id: "R006", number: "202", type: "Deluxe", floor: 2, capacity: 2 },
  { id: "R007", number: "203", type: "Presidential Suite", floor: 2, capacity: 6 },
  { id: "R008", number: "204", type: "Standard", floor: 2, capacity: 2 },
  { id: "R009", number: "301", type: "Suite", floor: 3, capacity: 4 },
  { id: "R010", number: "302", type: "Deluxe", floor: 3, capacity: 2 },
  { id: "R011", number: "303", type: "Family Room", floor: 3, capacity: 5 },
  { id: "R012", number: "304", type: "Standard", floor: 3, capacity: 2 },
];

const getDateString = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (dateString, amount) => {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return getDateString(date);
};

const today = getDateString(new Date());

const initialBookings = [
  {
    id: "BK-1001",
    roomId: "R001",
    guest: "Rahul Sharma",
    checkIn: addDays(today, -1),
    checkOut: addDays(today, 2),
    status: "Checked In",
  },
  {
    id: "BK-1002",
    roomId: "R003",
    guest: "Priya Mehta",
    checkIn: addDays(today, 1),
    checkOut: addDays(today, 4),
    status: "Confirmed",
  },
  {
    id: "BK-1003",
    roomId: "R005",
    guest: "Amit Verma",
    checkIn: addDays(today, 2),
    checkOut: addDays(today, 5),
    status: "Confirmed",
  },
  {
    id: "BK-1004",
    roomId: "R007",
    guest: "Neha Kapoor",
    checkIn: addDays(today, -2),
    checkOut: addDays(today, 1),
    status: "Checked In",
  },
  {
    id: "BK-1005",
    roomId: "R009",
    guest: "Vikram Singh",
    checkIn: addDays(today, 4),
    checkOut: addDays(today, 7),
    status: "Confirmed",
  },
  {
    id: "BK-1006",
    roomId: "R010",
    guest: "Anjali Gupta",
    checkIn: addDays(today, 1),
    checkOut: addDays(today, 3),
    status: "Confirmed",
  },
];

const initialBlocks = [
  {
    id: "BL-001",
    roomId: "R006",
    startDate: addDays(today, 1),
    endDate: addDays(today, 4),
    reason: "AC maintenance",
    status: "Blocked",
  },
  {
    id: "BL-002",
    roomId: "R004",
    startDate: addDays(today, 5),
    endDate: addDays(today, 7),
    reason: "Deep cleaning",
    status: "Blocked",
  },
];

const roomTypes = [
  "Standard",
  "Deluxe",
  "Suite",
  "Family Room",
  "Presidential Suite",
];

const bookingColors = {
  "Checked In": "bg-blue-500 text-white",
  Confirmed: "bg-violet-500 text-white",
  Pending: "bg-amber-400 text-slate-900",
};

const statusColors = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Booked: "bg-violet-50 text-violet-700 border-violet-200",
  Occupied: "bg-blue-50 text-blue-700 border-blue-200",
  Blocked: "bg-rose-50 text-rose-700 border-rose-200",
  Conflict: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function RoomAvailability() {
  const [rooms] = useState(initialRooms);
  const [bookings, setBookings] = useState(initialBookings);
  const [blocks, setBlocks] = useState(initialBlocks);

  const [selectedDate, setSelectedDate] = useState(today);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(addDays(today, 6));

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState("calendar");

  const [modal, setModal] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [blockForm, setBlockForm] = useState({
    startDate: today,
    endDate: addDays(today, 1),
    reason: "",
  });
  const [toast, setToast] = useState("");

  const dateList = useMemo(() => {
    const dates = [];
    const start = new Date(`${startDate}T12:00:00`);
    const end = new Date(`${endDate}T12:00:00`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      end < start
    ) {
      return [];
    }

    const totalDays = Math.min(
      Math.floor((end - start) / 86400000) + 1,
      31
    );

    for (let i = 0; i < totalDays; i++) {
      dates.push(addDays(startDate, i));
    }

    return dates;
  }, [startDate, endDate]);

  const getRoomBooking = (roomId, date) =>
    bookings.find(
      (booking) =>
        booking.roomId === roomId &&
        booking.status !== "Cancelled" &&
        booking.status !== "Checked Out" &&
        date >= booking.checkIn &&
        date < booking.checkOut
    );

  const getRoomBlock = (roomId, date) =>
    blocks.find(
      (block) =>
        block.roomId === roomId &&
        block.status === "Blocked" &&
        date >= block.startDate &&
        date < block.endDate
    );

  const getRoomStatus = (room, date) => {
    const roomBookings = bookings.filter(
      (booking) =>
        booking.roomId === room.id &&
        booking.status !== "Cancelled" &&
        booking.status !== "Checked Out" &&
        date >= booking.checkIn &&
        date < booking.checkOut
    );

    const roomBlocks = blocks.filter(
      (block) =>
        block.roomId === room.id &&
        block.status === "Blocked" &&
        date >= block.startDate &&
        date < block.endDate
    );

    if (roomBookings.length > 1 || (roomBookings.length && roomBlocks.length)) {
      return {
        status: "Conflict",
        booking: roomBookings[0],
        block: roomBlocks[0],
      };
    }

    if (roomBlocks.length) {
      return { status: "Blocked", block: roomBlocks[0] };
    }

    if (roomBookings.length) {
      return {
        status:
          roomBookings[0].status === "Checked In" ? "Occupied" : "Booked",
        booking: roomBookings[0],
      };
    }

    return { status: "Available" };
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.id.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        typeFilter === "All" || room.type === typeFilter;

      const currentStatus = getRoomStatus(room, selectedDate).status;
      const matchesStatus =
        statusFilter === "All" || currentStatus === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, bookings, blocks, search, typeFilter, statusFilter, selectedDate]);

  const selectedDateStats = useMemo(() => {
    const statuses = rooms.map((room) =>
      getRoomStatus(room, selectedDate).status
    );

    return {
      total: rooms.length,
      available: statuses.filter((s) => s === "Available").length,
      booked: statuses.filter((s) => s === "Booked").length,
      occupied: statuses.filter((s) => s === "Occupied").length,
      blocked: statuses.filter((s) => s === "Blocked").length,
      conflicts: statuses.filter((s) => s === "Conflict").length,
    };
  }, [rooms, bookings, blocks, selectedDate]);

  const typeAvailability = useMemo(() => {
    return roomTypes.map((type) => {
      const typeRooms = rooms.filter((room) => room.type === type);
      const available = typeRooms.filter(
        (room) => getRoomStatus(room, selectedDate).status === "Available"
      ).length;

      return {
        type,
        total: typeRooms.length,
        available,
        occupied: typeRooms.filter(
          (room) => getRoomStatus(room, selectedDate).status === "Occupied"
        ).length,
        booked: typeRooms.filter(
          (room) => getRoomStatus(room, selectedDate).status === "Booked"
        ).length,
        blocked: typeRooms.filter(
          (room) => getRoomStatus(room, selectedDate).status === "Blocked"
        ).length,
      };
    });
  }, [rooms, bookings, blocks, selectedDate]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const openBlockModal = (room) => {
    setSelectedRoom(room);
    setBlockForm({
      startDate: selectedDate,
      endDate: addDays(selectedDate, 1),
      reason: "",
    });
    setModal("block");
  };

  const saveBlock = (e) => {
    e.preventDefault();

    if (blockForm.endDate <= blockForm.startDate) {
      notify("End date must be after start date.");
      return;
    }

    const dates = [];
    const totalDays = Math.floor(
      (new Date(`${blockForm.endDate}T12:00:00`) -
        new Date(`${blockForm.startDate}T12:00:00`)) /
        86400000
    );

    if (totalDays > 365) {
      notify("A room cannot be blocked for more than 365 days.");
      return;
    }

    for (let i = 0; i < totalDays; i++) {
      dates.push(addDays(blockForm.startDate, i));
    }

    const conflict = dates.some((date) => {
      return (
        getRoomBooking(selectedRoom.id, date) ||
        getRoomBlock(selectedRoom.id, date)
      );
    });

    if (conflict) {
      notify("This room already has a booking or block in the selected dates.");
      return;
    }

    setBlocks((prev) => [
      ...prev,
      {
        id: `BL-${Date.now()}`,
        roomId: selectedRoom.id,
        startDate: blockForm.startDate,
        endDate: blockForm.endDate,
        reason: blockForm.reason.trim(),
        status: "Blocked",
      },
    ]);

    setModal(null);
    notify(`Room ${selectedRoom.number} blocked successfully.`);
  };

  const removeBlock = (blockId) => {
    if (!window.confirm("Are you sure you want to remove this room block?")) {
      return;
    }

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId ? { ...block, status: "Released" } : block
      )
    );

    setModal(null);
    notify("Room block removed successfully.");
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setModal("roomDetails");
  };

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setModal("bookingDetails");
  };

  const changeWeek = (direction) => {
    setStartDate((prev) => addDays(prev, direction * 7));
    setEndDate((prev) => addDays(prev, direction * 7));
  };

  const resetDates = () => {
    setStartDate(today);
    setEndDate(addDays(today, 6));
    setSelectedDate(today);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const formatDate = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const formatShortDate = (date) =>
    new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "2-digit",
    });

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={15} />
              Property Operations
              <span>/</span>
              <span className="text-slate-700">Room Availability</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Room Availability
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Check room availability, bookings, blocked dates and conflicts.
            </p>
          </div>

          <button
            onClick={() => openBlockModal(rooms[0])}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Lock size={17} />
            Block a Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {[
            {
              label: "Total Rooms",
              value: selectedDateStats.total,
              icon: BedDouble,
              color: "blue",
            },
            {
              label: "Available",
              value: selectedDateStats.available,
              icon: DoorOpen,
              color: "emerald",
            },
            {
              label: "Booked",
              value: selectedDateStats.booked,
              icon: CalendarCheck,
              color: "violet",
            },
            {
              label: "Occupied",
              value: selectedDateStats.occupied,
              icon: Users,
              color: "blue",
            },
            {
              label: "Blocked",
              value: selectedDateStats.blocked,
              icon: Lock,
              color: "rose",
            },
            {
              label: "Conflicts",
              value: selectedDateStats.conflicts,
              icon: AlertCircle,
              color: "amber",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            const colors = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              violet: "bg-violet-50 text-violet-600",
              rose: "bg-rose-50 text-rose-600",
              amber: "bg-amber-50 text-amber-600",
            };

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-2.5 ${colors[stat.color]}`}>
                    <Icon size={19} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Date Range and View Controls */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSelectedDate(e.target.value);
                  }}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-500">
                  End Date
                </label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => changeWeek(-1)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
                title="Previous week"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={resetDates}
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Today
              </button>

              <button
                onClick={() => changeWeek(1)}
                className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50"
                title="Next week"
              >
                <ChevronRight size={18} />
              </button>

              <div className="ml-1 flex rounded-xl bg-slate-100 p-1">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    viewMode === "calendar"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500"
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Legend:</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Available
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-500" />
              Booked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
              Occupied
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              Blocked
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              Conflict
            </span>
          </div>
        </div>

        {/* Room Type Availability */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">
                Room Type Availability
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Availability summary for {formatDate(selectedDate)}
              </p>
            </div>
            <CalendarDays size={20} className="text-slate-400" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {typeAvailability.map((item) => (
              <button
                key={item.type}
                onClick={() =>
                  setTypeFilter(typeFilter === item.type ? "All" : item.type)
                }
                className={`rounded-xl border p-3 text-left transition ${
                  typeFilter === item.type
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-sm font-semibold text-slate-800">
                  {item.type}
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-600">
                  {item.available}
                  <span className="ml-1 text-xs font-medium text-slate-400">
                    available
                  </span>
                </p>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{item.total} Total</span>
                  <span>{item.booked + item.occupied} Reserved/Occupied</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{
                      width: `${
                        item.total
                          ? (item.available / item.total) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Calendar / List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Availability Calendar
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Select any date to inspect room availability.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room..."
                  className={`${inputClass} pl-9 sm:w-48`}
                />
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={`${selectClass} sm:w-40`}
              >
                <option value="All">All Room Types</option>
                {roomTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${selectClass} sm:w-40`}
              >
                <option value="All">All Statuses</option>
                {["Available", "Booked", "Occupied", "Blocked", "Conflict"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  )
                )}
              </select>
            </div>
          </div>

          {dateList.length === 0 ? (
            <div className="p-12 text-center">
              <AlertCircle className="mx-auto text-amber-500" size={30} />
              <p className="mt-3 font-semibold text-slate-800">
                Invalid date range
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Select a valid start date and end date.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {viewMode === "calendar" ? (
                <table className="w-full min-w-[900px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="sticky left-0 z-10 min-w-[190px] border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Room
                      </th>

                      {dateList.map((date) => (
                        <th
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`min-w-[105px] cursor-pointer border-b border-r border-slate-200 px-2 py-3 text-center transition ${
                            selectedDate === date
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-500 hover:bg-slate-100"
                          }`}
                        >
                          <p className="text-xs font-semibold">
                            {formatShortDate(date)}
                          </p>
                          {date === today && (
                            <span className="mt-1 inline-block text-[9px] font-bold uppercase text-blue-600">
                              Today
                            </span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRooms.map((room) => (
                      <tr key={room.id} className="hover:bg-slate-50/70">
                        <td className="sticky left-0 z-10 border-r border-slate-200 bg-white px-4 py-3">
                          <button
                            onClick={() => openRoomDetails(room)}
                            className="text-left"
                          >
                            <p className="text-sm font-semibold text-slate-800 hover:text-blue-600">
                              Room {room.number}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-400">
                              {room.type} · Floor {room.floor}
                            </p>
                          </button>
                        </td>

                        {dateList.map((date) => {
                          const result = getRoomStatus(room, date);
                          const booking = result.booking;
                          const block = result.block;

                          const cellColors = {
                            Available: "bg-emerald-50 text-emerald-700",
                            Booked: "bg-violet-100 text-violet-700",
                            Occupied: "bg-blue-100 text-blue-700",
                            Blocked: "bg-rose-100 text-rose-700",
                            Conflict: "bg-amber-100 text-amber-800",
                          };

                          return (
                            <td
                              key={date}
                              onClick={() => {
                                setSelectedDate(date);
                                if (booking) {
                                  openBookingDetails(booking);
                                } else if (block) {
                                  setSelectedRoom(room);
                                  setModal("blockDetails");
                                } else {
                                  openBlockModal(room);
                                }
                              }}
                              title={
                                booking
                                  ? `${booking.guest} · ${booking.id}`
                                  : block
                                  ? block.reason
                                  : "Available · Click to block"
                              }
                              className={`cursor-pointer border-r border-slate-100 p-2 text-center transition hover:ring-2 hover:ring-inset hover:ring-blue-300 ${
                                selectedDate === date ? "bg-blue-50/30" : ""
                              }`}
                            >
                              <div
                                className={`mx-auto flex min-h-[38px] max-w-[95px] flex-col items-center justify-center rounded-lg px-1.5 py-1 text-[10px] font-semibold ${cellColors[result.status]}`}
                              >
                                {result.status === "Available" ? (
                                  <CheckCircle2 size={14} />
                                ) : result.status === "Blocked" ? (
                                  <Lock size={13} />
                                ) : result.status === "Conflict" ? (
                                  <AlertCircle size={13} />
                                ) : (
                                  <span>
                                    {result.status === "Occupied"
                                      ? "Occupied"
                                      : "Booked"}
                                  </span>
                                )}
                                {result.status === "Available" && (
                                  <span>Available</span>
                                )}
                                {result.status === "Conflict" && (
                                  <span>Conflict</span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}

                    {filteredRooms.length === 0 && (
                      <tr>
                        <td
                          colSpan={dateList.length + 1}
                          className="p-12 text-center text-sm text-slate-400"
                        >
                          No rooms match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="divide-y divide-slate-100">
                  {filteredRooms.map((room) => {
                    const result = getRoomStatus(room, selectedDate);

                    return (
                      <div
                        key={room.id}
                        className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            Room {room.number}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {room.type} · Floor {room.floor} · {room.capacity} guests
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${statusColors[result.status]}`}
                          >
                            {result.status}
                          </span>

                          {result.booking && (
                            <button
                              onClick={() =>
                                openBookingDetails(result.booking)
                              }
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye size={17} />
                            </button>
                          )}

                          {result.status === "Available" && (
                            <button
                              onClick={() => openBlockModal(room)}
                              className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                              title="Block room"
                            >
                              <Lock size={17} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:flex-row">
            <span>
              {filteredRooms.length} rooms · {dateList.length} dates
            </span>
            <span>
              Select a calendar cell to inspect bookings or manage blocks.
            </span>
          </div>
        </div>

        {/* Booking List */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4">
            <h2 className="font-semibold text-slate-900">
              Upcoming Reservations
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Reservations overlapping the selected date range.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Booking ID</th>
                  <th className="px-5 py-3 font-semibold">Guest</th>
                  <th className="px-5 py-3 font-semibold">Room</th>
                  <th className="px-5 py-3 font-semibold">Check In</th>
                  <th className="px-5 py-3 font-semibold">Check Out</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {bookings
                  .filter(
                    (booking) =>
                      booking.status !== "Cancelled" &&
                      booking.status !== "Checked Out" &&
                      booking.checkIn <= endDate &&
                      booking.checkOut > startDate
                  )
                  .map((booking) => {
                    const room = rooms.find(
                      (item) => item.id === booking.roomId
                    );

                    return (
                      <tr key={booking.id}>
                        <td className="px-5 py-3 text-sm font-semibold text-blue-600">
                          {booking.id}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-700">
                          {booking.guest}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {room ? room.number : "Unknown"}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {formatDate(booking.checkIn)}
                        </td>
                        <td className="px-5 py-3 text-sm text-slate-600">
                          {formatDate(booking.checkOut)}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              bookingColors[booking.status] ||
                              "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <button
                            onClick={() => openBookingDetails(booking)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Block Room Modal */}
      {modal === "block" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-900">Block Room</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Room {selectedRoom.number} · {selectedRoom.type}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveBlock} className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Block Start Date *
                </label>
                <input
                  required
                  type="date"
                  value={blockForm.startDate}
                  onChange={(e) =>
                    setBlockForm((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Block End Date (Exclusive) *
                </label>
                <input
                  required
                  type="date"
                  min={blockForm.startDate}
                  value={blockForm.endDate}
                  onChange={(e) =>
                    setBlockForm((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
                <p className="mt-1 text-xs text-slate-400">
                  The room becomes available again on the end date.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Reason *
                </label>
                <textarea
                  required
                  rows="3"
                  value={blockForm.reason}
                  onChange={(e) =>
                    setBlockForm((prev) => ({
                      ...prev,
                      reason: e.target.value,
                    }))
                  }
                  placeholder="Maintenance, renovation, deep cleaning..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  <Lock size={16} />
                  Block Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {modal === "roomDetails" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Room {selectedRoom.number}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedRoom.id} · {selectedRoom.type}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {[
                ["Room Number", selectedRoom.number],
                ["Room Type", selectedRoom.type],
                ["Floor", selectedRoom.floor],
                ["Capacity", `${selectedRoom.capacity} Guests`],
                ["Status", getRoomStatus(selectedRoom, selectedDate).status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between rounded-xl bg-slate-50 p-3 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800">{value}</span>
                </div>
              ))}

              <button
                onClick={() => openBlockModal(selectedRoom)}
                className="w-full rounded-xl bg-rose-50 py-2.5 text-sm font-semibold text-rose-700 hover:bg-rose-100"
              >
                Block This Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {modal === "bookingDetails" && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-semibold text-blue-600">
                  {selectedBooking.id}
                </p>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Reservation Details
                </h2>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {[
                ["Guest", selectedBooking.guest],
                [
                  "Room",
                  rooms.find((r) => r.id === selectedBooking.roomId)?.number ||
                    "Unknown",
                ],
                ["Check In", formatDate(selectedBooking.checkIn)],
                ["Check Out", formatDate(selectedBooking.checkOut)],
                ["Booking Status", selectedBooking.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="text-right font-semibold text-slate-800">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Block Details Modal */}
      {modal === "blockDetails" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Room Block Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Room {selectedRoom.number}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {blocks
                .filter(
                  (block) =>
                    block.roomId === selectedRoom.id &&
                    block.status === "Blocked" &&
                    selectedDate >= block.startDate &&
                    selectedDate < block.endDate
                )
                .map((block) => (
                  <div
                    key={block.id}
                    className="rounded-xl border border-rose-100 bg-rose-50 p-4"
                  >
                    <p className="font-semibold text-rose-800">
                      {block.reason}
                    </p>
                    <p className="mt-2 text-xs text-rose-700">
                      {formatDate(block.startDate)} –{" "}
                      {formatDate(addDays(block.endDate, -1))}
                    </p>
                    <button
                      onClick={() => removeBlock(block.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                    >
                      <Ban size={14} />
                      Release Room Block
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
