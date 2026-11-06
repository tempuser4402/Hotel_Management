import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
  BedDouble,
  Phone,
  X,
  Ban,
  RefreshCw,
} from "lucide-react";

import {
  calendarRooms,
  calendarBookings,
  calendarBlocks,
} from "./calenderData.jsx";

const toDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const dateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const addDays = (date, amount) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
};

const formatDate = (date, options) =>
  date.toLocaleDateString("en-IN", options);

const startOfWeek = (date) => {
  const result = new Date(date);
  result.setDate(result.getDate() - result.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
};

const statusStyles = {
  Confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  "Checked In": "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(
    new Date(2026, 10, 6)
  );

  const [view, setView] = useState("week");
  const [roomType, setRoomType] = useState("All");
  const [search, setSearch] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    guest: "",
    phone: "",
    roomId: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const dates = useMemo(() => {
    if (view === "day") return [selectedDate];

    if (view === "week") {
      const start = startOfWeek(selectedDate);
      return Array.from({ length: 7 }, (_, i) =>
        addDays(start, i)
      );
    }

    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    );

    const start = startOfWeek(firstDay);

    return Array.from({ length: 42 }, (_, i) =>
      addDays(start, i)
    );
  }, [selectedDate, view]);

  const filteredRooms = useMemo(() => {
    return calendarRooms.filter((room) => {
      const matchesType =
        roomType === "All" || room.type === roomType;

      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());

      return matchesType && matchesSearch;
    });
  }, [roomType, search]);

  const navigate = (direction) => {
    const next = new Date(selectedDate);

    if (view === "month") {
      next.setMonth(next.getMonth() + direction);
    } else if (view === "week") {
      next.setDate(next.getDate() + direction * 7);
    } else {
      next.setDate(next.getDate() + direction);
    }

    setSelectedDate(next);
  };

  const periodLabel = () => {
    if (view === "month") {
      return formatDate(selectedDate, {
        month: "long",
        year: "numeric",
      });
    }

    if (view === "day") {
      return formatDate(selectedDate, {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    return `${formatDate(dates[0], {
      day: "numeric",
      month: "short",
    })} - ${formatDate(dates[6], {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const getRoomBooking = (roomId, date) => {
    const key = dateKey(date);

    return calendarBookings.find((booking) =>
      booking.roomId === roomId &&
      booking.status !== "Cancelled" &&
      key >= booking.checkIn &&
      key < booking.checkOut
    );
  };

  const getRoomBlock = (roomId, date) => {
    const key = dateKey(date);

    return calendarBlocks.find((block) =>
      block.roomId === roomId &&
      key >= block.startDate &&
      key < block.endDate
    );
  };

  const openQuickBooking = (room, date) => {
    setBookingForm({
      guest: "",
      phone: "",
      roomId: room.id,
      checkIn: dateKey(date),
      checkOut: dateKey(addDays(date, 1)),
      guests: 1,
    });

    setShowBookingModal(true);
  };

  const createSampleBooking = (e) => {
    e.preventDefault();

    const { roomId, checkIn, checkOut } = bookingForm;

    if (!roomId || !checkIn || !checkOut || checkOut <= checkIn) {
      alert("Please select valid room and dates.");
      return;
    }

    const overlaps = calendarBookings.some((booking) =>
      booking.roomId === roomId &&
      booking.status !== "Cancelled" &&
      booking.checkIn < checkOut &&
      booking.checkOut > checkIn
    );

    const blocked = calendarBlocks.some((block) =>
      block.roomId === roomId &&
      block.startDate < checkOut &&
      block.endDate > checkIn
    );

    if (overlaps || blocked) {
      alert("This room is not available for the selected dates.");
      return;
    }

    calendarBookings.push({
      id: `BK-${Date.now()}`,
      ...bookingForm,
      amount: 0,
      status: "Confirmed",
      paymentStatus: "Pending",
    });

    setShowBookingModal(false);
    alert("Sample booking created successfully.");
  };

  const getBookingPosition = (booking) => {
    const first = dates.findIndex(
      (date) => dateKey(date) >= booking.checkIn
    );

    const last = dates.findIndex(
      (date) => dateKey(date) >= booking.checkOut
    );

    const start = first === -1 ? 0 : first;
    const end = last === -1 ? dates.length : last;

    if (end <= start) return null;

    return {
      start: start + 1,
      span: end - start,
    };
  };

  const openNewBooking = () => {
    setBookingForm({
      guest: "",
      phone: "",
      roomId: "",
      checkIn: dateKey(selectedDate),
      checkOut: dateKey(addDays(selectedDate, 1)),
      guests: 1,
    });

    setShowBookingModal(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} />
            Hotel Operations / Calendar
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Booking Calendar
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage room availability and reservations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedDate(new Date())}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <RefreshCw size={16} />
            Today
          </button>

          <button
            onClick={openNewBooking}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            New Booking
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Rooms",
            value: calendarRooms.length,
            icon: BedDouble,
            color: "bg-blue-50 text-blue-600",
          },
          {
            label: "Reservations",
            value: calendarBookings.filter(
              (b) => b.status !== "Cancelled"
            ).length,
            icon: CalendarDays,
            color: "bg-purple-50 text-purple-600",
          },
          {
            label: "Occupied",
            value: calendarBookings.filter(
              (b) => b.status === "Checked In"
            ).length,
            icon: Users,
            color: "bg-green-50 text-green-600",
          },
          {
            label: "Blocked Rooms",
            value: calendarBlocks.length,
            icon: Ban,
            color: "bg-red-50 text-red-600",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {item.label}
                </p>

                <span className={`p-2.5 rounded-lg ${item.color}`}>
                  <Icon size={20} />
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mt-4">
                {item.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* CALENDAR TOOLBAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white border border-slate-200 rounded-lg">
              <button
                onClick={() => navigate(-1)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-l-lg"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2.5 border-x border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Today
              </button>

              <button
                onClick={() => navigate(1)}
                className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-r-lg"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <h2 className="text-base font-bold text-slate-800">
              {periodLabel()}
            </h2>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
            {["month", "week", "day"].map((item) => (
              <button
                key={item}
                onClick={() => setView(item)}
                className={`px-4 py-2 rounded-md text-sm capitalize font-medium transition ${
                  view === item
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-slate-100">

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search room..."
              className="w-36 text-sm text-slate-700 outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
            <SlidersHorizontal size={16} className="text-slate-500" />

            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="bg-transparent text-sm text-slate-700 outline-none"
            >
              <option value="All">All Room Types</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Premium">Premium</option>
              <option value="Suite">Suite</option>
            </select>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-3 text-xs text-slate-500">
            {[
              ["Reserved", "bg-blue-500"],
              ["Occupied", "bg-green-500"],
              ["Blocked", "bg-red-500"],
              ["Available", "bg-white border border-slate-300"],
            ].map(([label, color]) => (
              <span key={label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* WEEK VIEW */}
      {view === "week" && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto">
          <div className="min-w-262.5">

            <div className="grid grid-cols-[150px_repeat(7,minmax(0,1fr))] border-b border-slate-200 bg-slate-50">
              <div className="p-4 text-sm font-semibold text-slate-600">
                Rooms
              </div>

              {dates.map((date) => (
                <div
                  key={dateKey(date)}
                  className="border-l border-slate-200 p-3 text-center"
                >
                  <p className="text-xs text-slate-500">
                    {formatDate(date, { weekday: "short" })}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {formatDate(date, { day: "2-digit", month: "short" })}
                  </p>
                </div>
              ))}
            </div>

            {filteredRooms.map((room) => {
              const roomBookings = calendarBookings.filter(
                (booking) =>
                  booking.roomId === room.id &&
                  booking.status !== "Cancelled"
              );

              const visibleBookings = roomBookings
                .map((booking) => ({
                  ...booking,
                  position: getBookingPosition(booking),
                }))
                .filter((booking) => booking.position);

              return (
                <div
                  key={room.id}
                  className="grid min-h-23 grid-cols-[150px_repeat(7,minmax(0,1fr))] border-b border-slate-100 last:border-0"
                >
                  <div className="flex flex-col justify-center p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      Room {room.number}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {room.type} · Floor {room.floor}
                    </p>
                  </div>

                  <div className="relative col-span-7 grid grid-cols-7">
                    {dates.map((date) => {
                      const booking = getRoomBooking(room.id, date);
                      const block = getRoomBlock(room.id, date);

                      return (
                        <button
                          key={dateKey(date)}
                          disabled={!!booking || !!block}
                          onClick={() => openQuickBooking(room, date)}
                          title={
                            booking
                              ? booking.guest
                              : block
                                ? block.reason
                                : "Create booking"
                          }
                          className={`border-l border-slate-100 transition ${
                            booking
                              ? "bg-blue-50/30"
                              : block
                                ? "bg-red-50"
                                : "hover:bg-green-50"
                          }`}
                        />
                      );
                    })}

                    {visibleBookings.map((booking) => (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        style={{
                          gridColumn: `${booking.position.start} / span ${booking.position.span}`,
                        }}
                        className={`z-10 mx-1 my-5 min-w-0 overflow-hidden rounded-md border-l-4 px-2 py-2 text-left transition hover:shadow-sm ${
                          booking.status === "Checked In"
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-blue-500 bg-blue-50 text-blue-800"
                        }`}
                      >
                        <p className="truncate text-xs font-semibold">
                          {booking.guest}
                        </p>
                        <p className="truncate text-[10px] text-slate-500">
                          {booking.id}
                        </p>
                      </button>
                    ))}

                    {calendarBlocks
                      .filter((block) => block.roomId === room.id)
                      .map((block) => {
                        const position = getBookingPosition({
                          checkIn: block.startDate,
                          checkOut: block.endDate,
                        });

                        if (!position) return null;

                        return (
                          <div
                            key={block.id}
                            style={{
                              gridColumn: `${position.start} / span ${position.span}`,
                            }}
                            className="z-10 mx-1 my-5 flex items-center overflow-hidden rounded-md border-l-4 border-red-500 bg-red-50 px-2 text-xs text-red-700"
                          >
                            {block.reason}
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })}

            {filteredRooms.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-500">
                No rooms found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* MONTH VIEW */}
      {view === "month" && (
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <div className="grid grid-cols-7">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
              (day) => (
                <div
                  key={day}
                  className="p-3 text-center text-xs font-semibold text-slate-500"
                >
                  {day}
                </div>
              )
            )}

            {dates.map((date) => {
              const dayBookings = calendarBookings.filter(
                (booking) =>
                  dateKey(date) >= booking.checkIn &&
                  dateKey(date) < booking.checkOut &&
                  booking.status !== "Cancelled"
              );

              const currentMonth =
                date.getMonth() === selectedDate.getMonth();

              return (
                <button
                  key={dateKey(date)}
                  onClick={() => {
                    setSelectedDate(date);
                    setView("day");
                  }}
                  className={`min-h-28 border border-slate-100 p-2 text-left hover:bg-blue-50/40 ${
                    currentMonth ? "" : "opacity-30"
                  }`}
                >
                  <span className="text-sm font-medium text-slate-700">
                    {date.getDate()}
                  </span>

                  {dayBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBooking(booking);
                      }}
                      className="mt-2 truncate rounded bg-blue-50 px-1.5 py-1 text-[10px] font-medium text-blue-700"
                    >
                      {booking.guest}
                    </div>
                  ))}

                  {dayBookings.length > 3 && (
                    <p className="mt-1 text-[10px] text-slate-500">
                      +{dayBookings.length - 3} more
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* DAY VIEW */}
      {view === "day" && (
        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {filteredRooms.map((room) => {
            const booking = getRoomBooking(room.id, selectedDate);
            const block = getRoomBlock(room.id, selectedDate);

            return (
              <div
                key={room.id}
                className="flex flex-wrap items-center justify-between gap-4 p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Room {room.number}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {room.type} · Floor {room.floor}
                  </p>
                </div>

                {booking ? (
                  <button
                    onClick={() => setSelectedBooking(booking)}
                    className={`rounded-lg border px-4 py-2 text-left text-sm ${
                      statusStyles[booking.status] || statusStyles.Confirmed
                    }`}
                  >
                    {booking.guest} · {booking.status}
                  </button>
                ) : block ? (
                  <span className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    Blocked · {block.reason}
                  </span>
                ) : (
                  <button
                    onClick={() => openQuickBooking(room, selectedDate)}
                    className="rounded-lg border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-100"
                  >
                    Available · Create Booking
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* BOOKING DETAILS DRAWER */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="h-full w-full max-w-md overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Reservation Details
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedBooking.id}
                </h2>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <p className="text-xs text-slate-500">Guest Name</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">
                  {selectedBooking.guest}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Phone size={16} />
                {selectedBooking.phone}
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Users size={16} />
                {selectedBooking.guests} Guests
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BedDouble size={16} />
                Room{" "}
                {calendarRooms.find(
                  (room) => room.id === selectedBooking.roomId
                )?.number}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Check-in</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedBooking.checkIn}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Check-out</p>
                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {selectedBooking.checkOut}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Booking Status</p>
                <span className={`mt-2 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  statusStyles[selectedBooking.status] || statusStyles.Confirmed
                }`}>
                  {selectedBooking.status}
                </span>

                <p className="mt-4 text-xs text-slate-500">
                  Payment Status
                </p>
                <p className="mt-1 text-sm font-medium text-slate-800">
                  {selectedBooking.paymentStatus}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Amount</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  ₹{selectedBooking.amount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUICK BOOKING MODAL */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <form
            onSubmit={createSampleBooking}
            className="w-full max-w-lg space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Quick Booking
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter guest and reservation details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Guest Name
              </label>
              <input
                required
                value={bookingForm.guest}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    guest: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                placeholder="Enter guest name"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Phone
              </label>
              <input
                required
                value={bookingForm.phone}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    phone: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-500"
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Room
              </label>
              <select
                required
                value={bookingForm.roomId}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    roomId: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none"
              >
                <option value="">Select Room</option>
                {calendarRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.number} - {room.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">
                  Check-in
                </label>
                <input
                  required
                  type="date"
                  value={bookingForm.checkIn}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      checkIn: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-600">
                  Check-out
                </label>
                <input
                  required
                  type="date"
                  min={bookingForm.checkIn || undefined}
                  value={bookingForm.checkOut}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      checkOut: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">
                Guests
              </label>
              <input
                type="number"
                min="1"
                value={bookingForm.guests}
                onChange={(e) =>
                  setBookingForm({
                    ...bookingForm,
                    guests: Number(e.target.value),
                  })
                }
                className="w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowBookingModal(false)}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
