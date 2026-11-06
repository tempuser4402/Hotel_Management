
import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  MapPin,
  Users,
  Clock3,
  CheckCircle2,
  PauseCircle,
  Ban,
  Building2,
  PartyPopper,
  Search,
  CalendarCheck,
} from "lucide-react";

const venues = [
  { id: "V001", name: "Banquet Hall", capacity: 300 },
  { id: "V002", name: "Conference Hall", capacity: 100 },
  { id: "V003", name: "Restaurant / Party Area", capacity: 150 },
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

const initialEvents = [
  {
    id: "EVT-1001",
    title: "Wedding Ceremony",
    customer: "Rahul Sharma",
    type: "Wedding",
    venue: "Banquet Hall",
    date: "2026-11-06",
    startTime: "10:00",
    endTime: "16:00",
    guests: 250,
    status: "Confirmed",
    amount: 250000,
  },
  {
    id: "EVT-1002",
    title: "Corporate Meeting",
    customer: "Amit Verma",
    type: "Corporate Event",
    venue: "Conference Hall",
    date: "2026-11-06",
    startTime: "11:00",
    endTime: "14:00",
    guests: 60,
    status: "Tentative",
    amount: 45000,
  },
  {
    id: "EVT-1003",
    title: "Birthday Celebration",
    customer: "Priya Gupta",
    type: "Birthday",
    venue: "Restaurant / Party Area",
    date: "2026-11-08",
    startTime: "18:00",
    endTime: "22:00",
    guests: 80,
    status: "Confirmed",
    amount: 65000,
  },
  {
    id: "EVT-1004",
    title: "Venue Maintenance",
    customer: "Hotel Management",
    type: "Other",
    venue: "Conference Hall",
    date: "2026-11-10",
    startTime: "09:00",
    endTime: "18:00",
    guests: 0,
    status: "Blocked",
    amount: 0,
  },
  {
    id: "EVT-1005",
    title: "Engagement Function",
    customer: "Neha Singh",
    type: "Engagement",
    venue: "Banquet Hall",
    date: "2026-11-14",
    startTime: "17:00",
    endTime: "22:00",
    guests: 180,
    status: "Tentative",
    amount: 180000,
  },
  {
    id: "EVT-1006",
    title: "Business Conference",
    customer: "Rajesh Mehta",
    type: "Conference",
    venue: "Conference Hall",
    date: "2026-11-18",
    startTime: "10:00",
    endTime: "17:00",
    guests: 90,
    status: "Confirmed",
    amount: 90000,
  },
];

const statusStyles = {
  Confirmed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Tentative: "bg-amber-100 text-amber-700 border-amber-200",
  Blocked: "bg-red-100 text-red-700 border-red-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

const statusColors = {
  Confirmed: "border-l-emerald-500 bg-emerald-50",
  Tentative: "border-l-amber-500 bg-amber-50",
  Blocked: "border-l-red-500 bg-red-50",
  Cancelled: "border-l-slate-400 bg-slate-50",
};

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);

const formatDisplayDate = (value) =>
  parseDate(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getWeekStart = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - (day === 0 ? 6 : day - 1));
  result.setHours(0, 0, 0, 0);
  return result;
};

const getMonthDays = (date) => {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const start = getWeekStart(firstDay);
  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return day;
  });
};

const initialForm = {
  title: "",
  customer: "",
  type: "Wedding",
  venue: "Banquet Hall",
  date: formatDate(new Date()),
  startTime: "10:00",
  endTime: "14:00",
  guests: "",
  status: "Tentative",
  amount: "",
};

export default function EventCalendar() {
  const [events, setEvents] = useState(initialEvents);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Month");
  const [venueFilter, setVenueFilter] = useState("All Venues");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [selectedDay, setSelectedDay] = useState(formatDate(new Date()));

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesVenue =
        venueFilter === "All Venues" || event.venue === venueFilter;

      const matchesType =
        typeFilter === "All Types" || event.type === typeFilter;

      const matchesStatus =
        statusFilter === "All Statuses" || event.status === statusFilter;

      const searchText =
        `${event.id} ${event.title} ${event.customer} ${event.venue}`.toLowerCase();

      return (
        matchesVenue &&
        matchesType &&
        matchesStatus &&
        searchText.includes(search.toLowerCase())
      );
    });
  }, [events, venueFilter, typeFilter, statusFilter, search]);

  const monthDays = useMemo(
    () => getMonthDays(currentDate),
    [currentDate]
  );

  const weekDays = useMemo(() => {
    const start = getWeekStart(currentDate);
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(start);
      day.setDate(start.getDate() + index);
      return day;
    });
  }, [currentDate]);

  const selectedDayEvents = filteredEvents
    .filter((event) => event.date === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const stats = [
    {
      label: "Total Events",
      value: events.filter((e) => e.status !== "Cancelled").length,
      icon: CalendarDays,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Confirmed",
      value: events.filter((e) => e.status === "Confirmed").length,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Tentative",
      value: events.filter((e) => e.status === "Tentative").length,
      icon: PauseCircle,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Blocked",
      value: events.filter((e) => e.status === "Blocked").length,
      icon: Ban,
      color: "text-red-600 bg-red-50",
    },
  ];

  const navigateDate = (direction) => {
    const next = new Date(currentDate);

    if (view === "Month") {
      next.setMonth(next.getMonth() + direction);
    } else if (view === "Week") {
      next.setDate(next.getDate() + direction * 7);
    } else {
      next.setDate(next.getDate() + direction);
    }

    setCurrentDate(next);
    setSelectedDay(formatDate(next));
  };

  const openNewBooking = (date = selectedDay) => {
    setSelectedEvent(null);
    setForm({
      ...initialForm,
      date,
    });
    setShowModal(true);
  };

  const openEditBooking = (event) => {
    setSelectedEvent(event);
    setForm({
      title: event.title,
      customer: event.customer,
      type: event.type,
      venue: event.venue,
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      guests: event.guests,
      status: event.status,
      amount: event.amount,
    });
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (form.endTime <= form.startTime) {
      alert("End time must be later than start time.");
      return;
    }

    const conflictingEvent = events.find((event) => {
      if (
        event.id === selectedEvent?.id ||
        event.date !== form.date ||
        event.venue !== form.venue ||
        ["Cancelled"].includes(event.status) ||
        ["Cancelled"].includes(form.status)
      ) {
        return false;
      }

      return (
        form.startTime < event.endTime &&
        form.endTime > event.startTime
      );
    });

    if (conflictingEvent) {
      alert(
        `This venue already has an event during this time: ${conflictingEvent.title}`
      );
      return;
    }

    if (selectedEvent) {
      setEvents((previous) =>
        previous.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                ...form,
                guests: Number(form.guests) || 0,
                amount: Number(form.amount) || 0,
              }
            : event
        )
      );
    } else {
      const newEvent = {
        ...form,
        id: `EVT-${Date.now().toString().slice(-6)}`,
        guests: Number(form.guests) || 0,
        amount: Number(form.amount) || 0,
      };

      setEvents((previous) => [...previous, newEvent]);
    }

    setCurrentDate(parseDate(form.date));
    setSelectedDay(form.date);
    setShowModal(false);
  };

  const getDateHeading = () => {
    if (view === "Month") {
      return currentDate.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    }

    if (view === "Day") {
      return currentDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    const start = getWeekStart(currentDate);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    return `${start.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    })} - ${end.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}`;
  };

  const renderEvent = (event, compact = false) => (
    <button
      key={event.id}
      type="button"
      onClick={() => openEditBooking(event)}
      className={`w-full text-left border-l-4 rounded-md px-2 py-1.5 mb-1 ${
        statusColors[event.status] || statusColors.Cancelled
      } hover:shadow-sm transition`}
      title={`${event.title} | ${event.startTime} - ${event.endTime}`}
    >
      <p className="text-xs font-semibold truncate">{event.title}</p>
      {!compact && (
        <p className="text-[11px] text-slate-600 truncate">
          {event.startTime} - {event.endTime}
        </p>
      )}
      <p className="text-[11px] text-slate-500 truncate">
        {event.venue}
      </p>
    </button>
  );

  const renderMonthView = () => (
    <div className="grid grid-cols-7 border-l border-t border-slate-200">
      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
        <div
          key={day}
          className="bg-slate-50 border-r border-b border-slate-200 p-3 text-center text-xs font-semibold text-slate-600"
        >
          {day}
        </div>
      ))}

      {monthDays.map((day) => {
        const dateString = formatDate(day);
        const dayEvents = filteredEvents.filter(
          (event) => event.date === dateString
        );
        const isCurrentMonth =
          day.getMonth() === currentDate.getMonth();
        const isToday = dateString === formatDate(new Date());
        const isSelected = dateString === selectedDay;

        return (
          <div
            key={dateString}
            onClick={() => setSelectedDay(dateString)}
            className={`min-h-[125px] border-r border-b border-slate-200 p-2 cursor-pointer transition ${
              !isCurrentMonth ? "bg-slate-50/70" : "bg-white"
            } ${isSelected ? "ring-2 ring-inset ring-blue-500" : ""}`}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${
                  isToday
                    ? "bg-blue-600 text-white"
                    : isCurrentMonth
                    ? "text-slate-700"
                    : "text-slate-400"
                }`}
              >
                {day.getDate()}
              </span>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openNewBooking(dateString);
                }}
                className="p-1 rounded hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                title="Quick booking"
              >
                <Plus size={14} />
              </button>
            </div>

            {dayEvents.slice(0, 3).map((event) => renderEvent(event, true))}

            {dayEvents.length > 3 && (
              <p className="text-[11px] text-blue-600 font-medium pl-1">
                +{dayEvents.length - 3} more
              </p>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderWeekView = () => (
    <div className="overflow-x-auto">
      <div className="min-w-[850px] grid grid-cols-7 border-l border-t border-slate-200">
        {weekDays.map((day) => {
          const dateString = formatDate(day);
          const dayEvents = filteredEvents.filter(
            (event) => event.date === dateString
          );

          return (
            <div key={dateString} className="border-r border-b border-slate-200">
              <div
                onClick={() => {
                  setSelectedDay(dateString);
                  setCurrentDate(day);
                  setView("Day");
                }}
                className={`p-3 text-center cursor-pointer ${
                  dateString === formatDate(new Date())
                    ? "bg-blue-50"
                    : "bg-slate-50"
                }`}
              >
                <p className="text-xs text-slate-500">
                  {day.toLocaleDateString("en-IN", { weekday: "short" })}
                </p>
                <p className="text-lg font-semibold text-slate-800">
                  {day.getDate()}
                </p>
              </div>

              <div className="min-h-[350px] p-2">
                {dayEvents.length === 0 ? (
                  <p className="text-[11px] text-slate-400 text-center mt-5">
                    No events
                  </p>
                ) : (
                  dayEvents
                    .sort((a, b) =>
                      a.startTime.localeCompare(b.startTime)
                    )
                    .map((event) => renderEvent(event))
                )}

                <button
                  type="button"
                  onClick={() => openNewBooking(dateString)}
                  className="w-full mt-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  + Add event
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDayView = () => {
    const hours = Array.from({ length: 15 }, (_, index) => index + 7);

    return (
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {hours.map((hour) => {
            const hourString = `${String(hour).padStart(2, "0")}:00`;
            const hourEvents = filteredEvents.filter(
              (event) =>
                event.date === formatDate(currentDate) &&
                Number(event.startTime.split(":")[0]) === hour
            );

            return (
              <div
                key={hour}
                className="grid grid-cols-[85px_1fr] border-t border-slate-200 min-h-[68px]"
              >
                <div className="p-3 text-xs text-slate-500 font-medium">
                  {hourString}
                </div>

                <div className="p-2 border-l border-slate-200">
                  {hourEvents.length ? (
                    hourEvents.map((event) => renderEvent(event))
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        openNewBooking(formatDate(currentDate));
                        setForm((previous) => ({
                          ...previous,
                          startTime: hourString,
                        }));
                      }}
                      className="w-full h-full text-left text-xs text-slate-300 hover:text-blue-600"
                    >
                      + Add booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <PartyPopper size={16} />
            Events & Banquets
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Event Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage venue availability, bookings and event schedules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openNewBooking(formatDate(currentDate))}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={17} />
          Quick Booking
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((item) => {
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

      {/* Venue availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {venues.map((venue) => {
          const venueEvents = events.filter(
            (event) =>
              event.venue === venue.name &&
              event.date === formatDate(currentDate) &&
              event.status !== "Cancelled"
          );

          return (
            <div
              key={venue.id}
              className="bg-white border border-slate-200 rounded-xl p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Building2 size={18} />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800">
                    {venue.name}
                  </h3>
                </div>

                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    venueEvents.some((event) => event.status === "Confirmed")
                      ? "bg-red-50 text-red-600"
                      : venueEvents.length
                      ? "bg-amber-50 text-amber-700"
                      : "bg-emerald-50 text-emerald-700"
                  }`}
                >
                  {venueEvents.length
                    ? `${venueEvents.length} booking(s)`
                    : "Available"}
                </span>
              </div>

              <div className="flex justify-between mt-3 text-xs text-slate-500">
                <span>Capacity: {venue.capacity} guests</span>
                <span>{formatDisplayDate(formatDate(currentDate))}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Calendar toolbar */}
        <div className="p-4 border-b border-slate-200 space-y-4">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => navigateDate(-1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <ChevronLeft size={17} />
              </button>

              <button
                type="button"
                onClick={() => navigateDate(1)}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <ChevronRight size={17} />
              </button>

              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  setCurrentDate(today);
                  setSelectedDay(formatDate(today));
                }}
                className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
              >
                Today
              </button>

              <h2 className="text-base font-bold text-slate-800 ml-1">
                {getDateHeading()}
              </h2>
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg p-1">
              {["Month", "Week", "Day"].map((item) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => setView(item)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    view === item
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event or customer..."
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            <select
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option>All Venues</option>
              {venues.map((venue) => (
                <option key={venue.id}>{venue.name}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option>All Types</option>
              {eventTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            >
              <option>All Statuses</option>
              {["Confirmed", "Tentative", "Blocked", "Cancelled"].map(
                (status) => (
                  <option key={status}>{status}</option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Calendar content */}
        <div className="p-4">
          {view === "Month" && renderMonthView()}
          {view === "Week" && renderWeekView()}
          {view === "Day" && renderDayView()}
        </div>

        {/* Legend */}
        <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap gap-4">
          {Object.entries(statusStyles).map(([status, style]) => (
            <div key={status} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-sm ${style.split(" ")[0]}`} />
              <span className="text-xs text-slate-600">{status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected day schedule */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Selected Day Schedule
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {formatDisplayDate(selectedDay)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => openNewBooking(selectedDay)}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-sm font-medium"
          >
            <Plus size={16} />
            Add Booking
          </button>
        </div>

        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <CalendarCheck size={30} className="mx-auto mb-2" />
            <p className="text-sm">No events scheduled for this date.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border border-slate-200 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <CalendarDays size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-sm text-slate-800">
                      {event.title}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {event.id} · {event.customer}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {event.startTime} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={13} />
                        {event.venue}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={13} />
                        {event.guests} guests
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:justify-end">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">
                      {formatCurrency(event.amount)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full border text-[11px] font-medium ${
                        statusStyles[event.status]
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openEditBooking(event)}
                    className="px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium hover:bg-slate-50"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick booking modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-bold text-slate-800">
                  {selectedEvent ? "Edit Event Booking" : "Quick Event Booking"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter basic event and venue details.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Event Name *
                  </label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="e.g. Wedding Ceremony"
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
                      <option key={venue.id}>{venue.name}</option>
                    ))}
                  </select>
                </div>

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
                    placeholder="Number of guests"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>

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
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Booking Status *
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({ ...form, status: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
                  >
                    {["Tentative", "Confirmed", "Blocked", "Cancelled"].map(
                      (status) => (
                        <option key={status}>{status}</option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  {selectedEvent ? "Update Booking" : "Save Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
