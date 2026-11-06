
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Eye,
  Pencil,
  Trash2,
  CalendarDays,
  Users,
  ClipboardCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
  Music,
  Sparkles,
  UserRound,
  IndianRupee,
  Download,
  ChevronDown,
  MapPin,
  ListChecks,
  ClipboardList,
} from "lucide-react";

const initialEvents = [
  {
    id: "EVT-1001",
    customer: "Amit Sharma",
    eventName: "Wedding Reception",
    eventType: "Wedding",
    venue: "Banquet Hall",
    date: "2026-12-15",
    startTime: "18:00",
    endTime: "23:00",
    guestCount: 250,
    finalGuestCount: 250,
    totalAmount: 250000,
    receivedAmount: 100000,
    extraCharges: 5000,
    damageCharges: 0,
    status: "Preparation",
    manager: "Rahul Sharma",
    notes: "Royal theme decoration and vegetarian dinner.",
    checklist: [
      { id: 1, title: "Venue cleaning and inspection", department: "Housekeeping", completed: true },
      { id: 2, title: "Stage and decoration setup", department: "Decoration", completed: true },
      { id: 3, title: "Guest seating arrangement", department: "Operations", completed: false },
      { id: 4, title: "Food menu and catering preparation", department: "Restaurant", completed: false },
      { id: 5, title: "Sound and lighting check", department: "Technical", completed: false },
      { id: 6, title: "Final venue inspection", department: "Management", completed: false },
    ],
    assignments: [
      { id: 1, name: "Rahul Sharma", department: "Event Manager", task: "Overall event coordination" },
      { id: 2, name: "Amit Kumar", department: "Restaurant", task: "Catering and food arrangements" },
      { id: 3, name: "Suresh", department: "Housekeeping", task: "Venue cleaning" },
    ],
    timeline: [
      { id: 1, time: "10:00", title: "Venue preparation", status: "Completed" },
      { id: 2, time: "14:00", title: "Decoration setup", status: "Completed" },
      { id: 3, time: "16:00", title: "Food preparation", status: "Pending" },
      { id: 4, time: "18:00", title: "Guest arrival", status: "Pending" },
      { id: 5, time: "23:00", title: "Event closing", status: "Pending" },
    ],
    inspection: {
      venue: "Passed",
      sound: "Pending",
      lighting: "Pending",
      catering: "Pending",
      safety: "Pending",
    },
  },
  {
    id: "EVT-1002",
    customer: "Neha Verma",
    eventName: "Birthday Celebration",
    eventType: "Birthday",
    venue: "Restaurant / Party Area",
    date: "2026-11-25",
    startTime: "17:00",
    endTime: "21:00",
    guestCount: 80,
    finalGuestCount: 80,
    totalAmount: 80000,
    receivedAmount: 80000,
    extraCharges: 0,
    damageCharges: 0,
    status: "Confirmed",
    manager: "Rohit Singh",
    notes: "Birthday decoration and vegetarian buffet.",
    checklist: [
      { id: 1, title: "Venue cleaning", department: "Housekeeping", completed: false },
      { id: 2, title: "Birthday decoration", department: "Decoration", completed: false },
      { id: 3, title: "Food preparation", department: "Restaurant", completed: false },
    ],
    assignments: [
      { id: 1, name: "Rohit Singh", department: "Event Manager", task: "Overall coordination" },
    ],
    timeline: [
      { id: 1, time: "15:00", title: "Decoration setup", status: "Pending" },
      { id: 2, time: "17:00", title: "Guest arrival", status: "Pending" },
      { id: 3, time: "21:00", title: "Event closing", status: "Pending" },
    ],
    inspection: {
      venue: "Pending",
      sound: "Pending",
      lighting: "Pending",
      catering: "Pending",
      safety: "Pending",
    },
  },
  {
    id: "EVT-1003",
    customer: "ABC Technologies",
    eventName: "Corporate Conference",
    eventType: "Corporate",
    venue: "Conference Hall",
    date: "2026-12-05",
    startTime: "09:00",
    endTime: "17:00",
    guestCount: 60,
    finalGuestCount: 60,
    totalAmount: 60000,
    receivedAmount: 15000,
    extraCharges: 0,
    damageCharges: 0,
    status: "Confirmed",
    manager: "Vikas Gupta",
    notes: "Projector, conference seating and lunch.",
    checklist: [
      { id: 1, title: "Conference seating arrangement", department: "Operations", completed: false },
      { id: 2, title: "Projector and microphone check", department: "Technical", completed: false },
      { id: 3, title: "Lunch preparation", department: "Restaurant", completed: false },
    ],
    assignments: [
      { id: 1, name: "Vikas Gupta", department: "Event Manager", task: "Conference coordination" },
    ],
    timeline: [
      { id: 1, time: "08:00", title: "Hall setup", status: "Pending" },
      { id: 2, time: "09:00", title: "Conference starts", status: "Pending" },
      { id: 3, time: "13:00", title: "Lunch", status: "Pending" },
      { id: 4, time: "17:00", title: "Conference ends", status: "Pending" },
    ],
    inspection: {
      venue: "Pending",
      sound: "Pending",
      lighting: "Pending",
      catering: "Pending",
      safety: "Pending",
    },
  },
];

const emptyEvent = {
  id: "",
  customer: "",
  eventName: "",
  eventType: "Wedding",
  venue: "",
  date: "",
  startTime: "",
  endTime: "",
  guestCount: "",
  finalGuestCount: "",
  totalAmount: "",
  receivedAmount: "",
  extraCharges: 0,
  damageCharges: 0,
  status: "Preparation",
  manager: "",
  notes: "",
};

const checklistTemplates = [
  { title: "Venue cleaning and inspection", department: "Housekeeping" },
  { title: "Decoration and stage setup", department: "Decoration" },
  { title: "Guest seating arrangement", department: "Operations" },
  { title: "Food and catering preparation", department: "Restaurant" },
  { title: "Sound and lighting check", department: "Technical" },
  { title: "Final venue inspection", department: "Management" },
  { title: "Emergency and safety check", department: "Management" },
];

const statusOptions = [
  "Confirmed",
  "Preparation",
  "Ready",
  "In Progress",
  "Completed",
  "Cancelled",
];

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function EventManagement() {
  const [events, setEvents] = useState(initialEvents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEvent);

  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistTitle, setChecklistTitle] = useState("");
  const [checklistDepartment, setChecklistDepartment] = useState("Operations");

  const [showAssignment, setShowAssignment] = useState(false);
  const [assignmentForm, setAssignmentForm] = useState({
    name: "",
    department: "Operations",
    task: "",
  });

  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineForm, setTimelineForm] = useState({
    time: "",
    title: "",
  });

  const [showFinalBilling, setShowFinalBilling] = useState(false);
  const [billingForm, setBillingForm] = useState({
    finalGuestCount: "",
    extraCharges: "",
    damageCharges: "",
    receivedAmount: "",
    notes: "",
  });

  const filteredEvents = useMemo(() => {
    const query = search.toLowerCase();

    return events.filter((event) => {
      const matchesSearch =
        event.id.toLowerCase().includes(query) ||
        event.customer.toLowerCase().includes(query) ||
        event.eventName.toLowerCase().includes(query) ||
        event.venue.toLowerCase().includes(query);

      return (
        matchesSearch &&
        (statusFilter === "All" || event.status === statusFilter)
      );
    });
  }, [events, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: events.length,
      preparation: events.filter((e) => e.status === "Preparation").length,
      inProgress: events.filter((e) => e.status === "In Progress").length,
      completed: events.filter((e) => e.status === "Completed").length,
      pendingTasks: events.reduce(
        (sum, event) =>
          sum + event.checklist.filter((task) => !task.completed).length,
        0
      ),
    };
  }, [events]);

  const updateEvent = (id, updates) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id ? { ...event, ...updates } : event
      )
    );

    setSelected((prev) =>
      prev?.id === id ? { ...prev, ...updates } : prev
    );
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyEvent);
    setShowForm(true);
  };

  const openEditForm = (event) => {
    setEditingId(event.id);
    setForm({ ...event });
    setShowForm(true);
  };

  const saveEvent = (e) => {
    e.preventDefault();

    if (
      !form.id.trim() ||
      !form.customer.trim() ||
      !form.eventName.trim() ||
      !form.venue.trim() ||
      !form.date
    ) {
      alert("Please fill all required event details.");
      return;
    }

    if (
      form.startTime &&
      form.endTime &&
      form.endTime <= form.startTime
    ) {
      alert("Event end time must be later than start time.");
      return;
    }

    const data = {
      ...form,
      guestCount: Number(form.guestCount || 0),
      finalGuestCount: Number(form.finalGuestCount || form.guestCount || 0),
      totalAmount: Number(form.totalAmount || 0),
      receivedAmount: Number(form.receivedAmount || 0),
      extraCharges: Number(form.extraCharges || 0),
      damageCharges: Number(form.damageCharges || 0),
    };

    if (editingId) {
      updateEvent(editingId, data);
    } else {
      if (events.some((event) => event.id === data.id)) {
        alert("This Event ID already exists.");
        return;
      }

      setEvents((prev) => [
        {
          ...data,
          checklist: checklistTemplates.map((task, index) => ({
            ...task,
            id: index + 1,
            completed: false,
          })),
          assignments: [],
          timeline: [],
          inspection: {
            venue: "Pending",
            sound: "Pending",
            lighting: "Pending",
            catering: "Pending",
            safety: "Pending",
          },
        },
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
  };

  const deleteEvent = (event) => {
    if (window.confirm(`Delete management record for ${event.id}?`)) {
      setEvents((prev) => prev.filter((item) => item.id !== event.id));
      setSelected(null);
    }
  };

  const toggleChecklist = (taskId) => {
    const updatedChecklist = selected.checklist.map((task) =>
      task.id === taskId
        ? { ...task, completed: !task.completed }
        : task
    );

    updateEvent(selected.id, { checklist: updatedChecklist });
  };

  const addChecklistTask = (e) => {
    e.preventDefault();

    if (!checklistTitle.trim()) return;

    const newTask = {
      id: Date.now(),
      title: checklistTitle.trim(),
      department: checklistDepartment,
      completed: false,
    };

    updateEvent(selected.id, {
      checklist: [...selected.checklist, newTask],
    });

    setChecklistTitle("");
    setShowChecklist(false);
  };

  const removeChecklistTask = (taskId) => {
    updateEvent(selected.id, {
      checklist: selected.checklist.filter((task) => task.id !== taskId),
    });
  };

  const addAssignment = (e) => {
    e.preventDefault();

    if (!assignmentForm.name.trim() || !assignmentForm.task.trim()) {
      alert("Enter staff name and assigned task.");
      return;
    }

    updateEvent(selected.id, {
      assignments: [
        ...selected.assignments,
        { ...assignmentForm, id: Date.now() },
      ],
    });

    setAssignmentForm({
      name: "",
      department: "Operations",
      task: "",
    });
    setShowAssignment(false);
  };

  const removeAssignment = (assignmentId) => {
    updateEvent(selected.id, {
      assignments: selected.assignments.filter(
        (item) => item.id !== assignmentId
      ),
    });
  };

  const addTimelineItem = (e) => {
    e.preventDefault();

    if (!timelineForm.time || !timelineForm.title.trim()) {
      alert("Enter time and timeline activity.");
      return;
    }

    updateEvent(selected.id, {
      timeline: [
        ...selected.timeline,
        { ...timelineForm, id: Date.now(), status: "Pending" },
      ].sort((a, b) => a.time.localeCompare(b.time)),
    });

    setTimelineForm({ time: "", title: "" });
    setShowTimeline(false);
  };

  const updateTimelineStatus = (timelineId, status) => {
    updateEvent(selected.id, {
      timeline: selected.timeline.map((item) =>
        item.id === timelineId ? { ...item, status } : item
      ),
    });
  };

  const updateInspection = (key, value) => {
    updateEvent(selected.id, {
      inspection: {
        ...selected.inspection,
        [key]: value,
      },
    });
  };

  const openBilling = (event) => {
    setSelected(event);
    setBillingForm({
      finalGuestCount: event.finalGuestCount || event.guestCount,
      extraCharges: event.extraCharges || 0,
      damageCharges: event.damageCharges || 0,
      receivedAmount: event.receivedAmount || 0,
      notes: "",
    });
    setShowFinalBilling(true);
  };

  const saveBilling = (e) => {
    e.preventDefault();

    const updated = {
      finalGuestCount: Number(billingForm.finalGuestCount || 0),
      extraCharges: Number(billingForm.extraCharges || 0),
      damageCharges: Number(billingForm.damageCharges || 0),
      receivedAmount: Number(billingForm.receivedAmount || 0),
      billingNotes: billingForm.notes,
    };

    if (
      updated.receivedAmount >
      Number(selected.totalAmount) +
        updated.extraCharges +
        updated.damageCharges
    ) {
      alert("Received amount cannot exceed the final bill amount.");
      return;
    }

    updateEvent(selected.id, updated);
    setShowFinalBilling(false);
  };

  const completeEvent = (event) => {
    const pendingTasks = event.checklist.filter(
      (task) => !task.completed
    ).length;

    const pendingInspections = Object.values(event.inspection).filter(
      (value) => value !== "Passed"
    ).length;

    if (pendingTasks > 0 || pendingInspections > 0) {
      alert(
        `Cannot complete this event yet.\nPending checklist tasks: ${pendingTasks}\nInspections not passed: ${pendingInspections}`
      );
      return;
    }

    if (
      !window.confirm(
        "Mark this event as completed? Ensure final billing and payment reconciliation are done."
      )
    ) {
      return;
    }

    updateEvent(event.id, { status: "Completed" });
  };

  const exportCSV = () => {
    const headers = [
      "Event ID",
      "Customer",
      "Event Name",
      "Event Type",
      "Venue",
      "Date",
      "Start Time",
      "End Time",
      "Guests",
      "Status",
      "Manager",
      "Total Amount",
      "Received Amount",
      "Extra Charges",
      "Damage Charges",
    ];

    const rows = filteredEvents.map((event) => [
      event.id,
      event.customer,
      event.eventName,
      event.eventType,
      event.venue,
      event.date,
      event.startTime,
      event.endTime,
      event.guestCount,
      event.status,
      event.manager,
      event.totalAmount,
      event.receivedAmount,
      event.extraCharges,
      event.damageCharges,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-management.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const checklistProgress = (event) => {
    if (!event.checklist.length) return 0;

    return Math.round(
      (event.checklist.filter((task) => task.completed).length /
        event.checklist.length) *
        100
    );
  };

  const finalBill = (event) =>
    Number(event.totalAmount || 0) +
    Number(event.extraCharges || 0) +
    Number(event.damageCharges || 0);

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Events & Banquets / Event Management
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Event Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Coordinate preparation, staff, inspections and event-day operations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={17} /> Add Event
          </button>
        </div>
      </div>

      {/* Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Total Events" value={stats.total} icon={<CalendarDays size={20} />} color="blue" />
        <StatCard title="In Preparation" value={stats.preparation} icon={<ClipboardList size={20} />} color="orange" />
        <StatCard title="In Progress" value={stats.inProgress} icon={<Clock size={20} />} color="purple" />
        <StatCard title="Completed" value={stats.completed} icon={<CheckCircle2 size={20} />} color="green" />
        <StatCard title="Pending Tasks" value={stats.pendingTasks} icon={<AlertCircle size={20} />} color="red" />
      </div>

      {/* Events table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Event Operations</h2>
            <p className="mt-1 text-xs text-slate-500">
              Track each event from preparation to completion.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search event or customer..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-64"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Venue & Date</th>
                <th className="px-4 py-3">Guests</th>
                <th className="px-4 py-3">Manager</th>
                <th className="px-4 py-3">Preparation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{event.eventName}</p>
                    <p className="mt-1 text-xs text-blue-600">{event.id}</p>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">{event.customer}</td>
                  <td className="px-4 py-3">
                    <p className="text-slate-700">{event.venue}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(event.date)}</p>
                  </td>
                  <td className="px-4 py-3">{event.guestCount}</td>
                  <td className="px-4 py-3">{event.manager || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${checklistProgress(event)}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-600">{checklistProgress(event)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><EventBadge status={event.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButton title="View event" onClick={() => setSelected(event)}>
                        <Eye size={16} />
                      </ActionButton>
                      <ActionButton title="Edit event" onClick={() => openEditForm(event)}>
                        <Pencil size={16} />
                      </ActionButton>
                      <ActionButton title="Final billing" onClick={() => openBilling(event)}>
                        <IndianRupee size={16} />
                      </ActionButton>
                      <ActionButton title="Delete event" danger onClick={() => deleteEvent(event)}>
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit event */}
      {showForm && (
        <Modal title={editingId ? "Edit Event" : "Add Event"} onClose={() => setShowForm(false)} wide>
          <form onSubmit={saveEvent} className="space-y-5">
            <FormSection title="Event Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Event ID *">
                  <input required disabled={!!editingId} value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} className="form-input disabled:bg-slate-100" placeholder="EVT-1004" />
                </Field>
                <Field label="Customer Name *">
                  <input required value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} className="form-input" />
                </Field>
                <Field label="Event Name *">
                  <input required value={form.eventName} onChange={(e) => setForm({ ...form, eventName: e.target.value })} className="form-input" placeholder="Wedding Reception" />
                </Field>
                <Field label="Event Type">
                  <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="form-input">
                    <option>Wedding</option>
                    <option>Birthday</option>
                    <option>Engagement</option>
                    <option>Anniversary</option>
                    <option>Corporate</option>
                    <option>Conference</option>
                    <option>Reception</option>
                    <option>Other</option>
                  </select>
                </Field>
                <Field label="Venue *">
                  <select required value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} className="form-input">
                    <option value="">Select venue</option>
                    <option>Banquet Hall</option>
                    <option>Conference Hall</option>
                    <option>Restaurant / Party Area</option>
                  </select>
                </Field>
                <Field label="Event Date *">
                  <input required type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="form-input" />
                </Field>
                <Field label="Start Time">
                  <input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="form-input" />
                </Field>
                <Field label="End Time">
                  <input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="form-input" />
                </Field>
              </div>
            </FormSection>

            <FormSection title="Guest, Billing & Assignment">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Expected Guest Count">
                  <input type="number" min="0" value={form.guestCount} onChange={(e) => setForm({ ...form, guestCount: e.target.value })} className="form-input" />
                </Field>
                <Field label="Final Guest Count">
                  <input type="number" min="0" value={form.finalGuestCount} onChange={(e) => setForm({ ...form, finalGuestCount: e.target.value })} className="form-input" />
                </Field>
                <Field label="Event Amount (₹)">
                  <input type="number" min="0" value={form.totalAmount} onChange={(e) => setForm({ ...form, totalAmount: e.target.value })} className="form-input" />
                </Field>
                <Field label="Received Amount (₹)">
                  <input type="number" min="0" value={form.receivedAmount} onChange={(e) => setForm({ ...form, receivedAmount: e.target.value })} className="form-input" />
                </Field>
                <Field label="Event Manager">
                  <input value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} className="form-input" placeholder="Manager name" />
                </Field>
                <Field label="Event Status">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="form-input">
                    {statusOptions.map((status) => <option key={status}>{status}</option>)}
                  </select>
                </Field>
              </div>
            </FormSection>

            <Field label="Event Notes">
              <textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="form-input resize-none" placeholder="Event requirements, decoration, catering..." />
            </Field>

            <ModalActions onCancel={() => setShowForm(false)} submitLabel={editingId ? "Update Event" : "Create Event"} />
          </form>
        </Modal>
      )}

      {/* Event detail and operations */}
      {selected && !showForm && !showChecklist && !showAssignment && !showTimeline && !showFinalBilling && (
        <Modal title="Event Operations Details" onClose={() => setSelected(null)} wide>
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-blue-600">{selected.id}</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">{selected.eventName}</h2>
                <p className="mt-1 text-sm text-slate-500">{selected.customer} · {selected.eventType}</p>
              </div>
              <EventBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <InfoBox label="Venue" value={selected.venue} />
              <InfoBox label="Event Date" value={formatDate(selected.date)} />
              <InfoBox label="Time" value={`${selected.startTime || "—"} - ${selected.endTime || "—"}`} />
              <InfoBox label="Guest Count" value={`${selected.finalGuestCount || selected.guestCount} / ${selected.guestCount} expected`} />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setShowChecklist(true)} className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                <ListChecks size={15} className="mr-1 inline" /> Checklist
              </button>
              <button onClick={() => setShowAssignment(true)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <Users size={15} className="mr-1 inline" /> Staff Assignments
              </button>
              <button onClick={() => setShowTimeline(true)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <Clock size={15} className="mr-1 inline" /> Event Timeline
              </button>
              <button onClick={() => openBilling(selected)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700">
                <IndianRupee size={15} className="mr-1 inline" /> Final Billing
              </button>
            </div>

            {/* Preparation checklist */}
            <section>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-slate-900">Preparation Checklist</h3>
                  <p className="mt-1 text-xs text-slate-500">Mark tasks complete as departments finish their work.</p>
                </div>
                <button onClick={() => setShowChecklist(true)} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Manage <ChevronDown size={14} className="inline" />
                </button>
              </div>
              <ProgressBar value={checklistProgress(selected)} />
              <p className="mt-2 text-xs text-slate-500">
                {selected.checklist.filter((task) => task.completed).length} of {selected.checklist.length} tasks completed
              </p>
              <div className="mt-3 space-y-2">
                {selected.checklist.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <input type="checkbox" checked={task.completed} onChange={() => toggleChecklist(task.id)} className="h-4 w-4 accent-blue-600" />
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p>
                      <p className="mt-1 text-xs text-slate-500">{task.department}</p>
                    </div>
                    <TaskBadge completed={task.completed} />
                  </div>
                ))}
              </div>
            </section>

            {/* Staff assignments */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Staff Assignments</h3>
                <button onClick={() => setShowAssignment(true)} className="text-sm font-medium text-blue-600">+ Assign Staff</button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {selected.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-start gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="rounded-full bg-blue-50 p-2 text-blue-600"><UserRound size={17} /></div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800">{assignment.name}</p>
                      <p className="text-xs text-blue-600">{assignment.department}</p>
                      <p className="mt-1 text-sm text-slate-600">{assignment.task}</p>
                    </div>
                    <button onClick={() => removeAssignment(assignment.id)} className="text-slate-400 hover:text-red-600"><X size={16} /></button>
                  </div>
                ))}
                {selected.assignments.length === 0 && <EmptyMessage text="No staff assigned yet." />}
              </div>
            </section>

            {/* Event timeline */}
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Event Day Timeline</h3>
                <button onClick={() => setShowTimeline(true)} className="text-sm font-medium text-blue-600">+ Add Activity</button>
              </div>
              <div className="space-y-3">
                {selected.timeline.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{item.time}</div>
                    <p className="min-w-0 flex-1 text-sm font-medium text-slate-800">{item.title}</p>
                    <select value={item.status} onChange={(e) => updateTimelineStatus(item.id, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                ))}
                {selected.timeline.length === 0 && <EmptyMessage text="No timeline activities added." />}
              </div>
            </section>

            {/* Inspection */}
            <section>
              <h3 className="mb-3 font-semibold text-slate-900">Venue & Event Inspection</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["venue", "Venue Inspection"],
                  ["sound", "Sound System"],
                  ["lighting", "Lighting"],
                  ["catering", "Catering"],
                  ["safety", "Safety Check"],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                    <select value={selected.inspection[key]} onChange={(e) => updateInspection(key, e.target.value)} className="rounded-lg border border-slate-300 px-2 py-1.5 text-xs">
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Passed</option>
                      <option>Failed</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>

            {/* Final billing */}
            <section className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold text-slate-900">Final Billing Overview</h3>
                <button onClick={() => openBilling(selected)} className="text-sm font-medium text-blue-600">Update Billing</button>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InfoBox label="Base Event Amount" value={formatCurrency(selected.totalAmount)} />
                <InfoBox label="Extra Charges" value={formatCurrency(selected.extraCharges)} />
                <InfoBox label="Damage Charges" value={formatCurrency(selected.damageCharges)} />
                <InfoBox label="Final Bill" value={formatCurrency(finalBill(selected))} />
              </div>
              <div className="mt-3 flex justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-600">Recorded received amount</span>
                <strong className="text-green-700">{formatCurrency(selected.receivedAmount)}</strong>
              </div>
            </section>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
              <button onClick={() => openEditForm(selected)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Edit Event</button>
              {selected.status !== "Completed" && selected.status !== "Cancelled" && (
                <>
                  <button onClick={() => updateEvent(selected.id, { status: "In Progress" })} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-700">Start Event</button>
                  <button onClick={() => completeEvent(selected)} className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">Complete Event</button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Checklist manager */}
      {showChecklist && selected && (
        <Modal title="Preparation Checklist" onClose={() => setShowChecklist(false)} wide>
          <div className="space-y-4">
            <ProgressBar value={checklistProgress(selected)} />
            <div className="space-y-2">
              {selected.checklist.map((task) => (
                <div key={task.id} className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleChecklist(task.id)} className="h-4 w-4 accent-blue-600" />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p>
                    <p className="text-xs text-slate-500">{task.department}</p>
                  </div>
                  <TaskBadge completed={task.completed} />
                  <button onClick={() => removeChecklistTask(task.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
            <form onSubmit={addChecklistTask} className="grid grid-cols-1 gap-3 border-t border-slate-200 pt-4 md:grid-cols-3">
              <input required value={checklistTitle} onChange={(e) => setChecklistTitle(e.target.value)} className="form-input md:col-span-1" placeholder="New checklist task" />
              <select value={checklistDepartment} onChange={(e) => setChecklistDepartment(e.target.value)} className="form-input">
                <option>Operations</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Decoration</option>
                <option>Technical</option>
                <option>Management</option>
              </select>
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"><Plus size={15} className="mr-1 inline" /> Add Task</button>
            </form>
          </div>
        </Modal>
      )}

      {/* Staff assignment form */}
      {showAssignment && selected && (
        <Modal title="Assign Staff" onClose={() => setShowAssignment(false)}>
          <form onSubmit={addAssignment} className="space-y-4">
            <Field label="Staff Name *">
              <input required value={assignmentForm.name} onChange={(e) => setAssignmentForm({ ...assignmentForm, name: e.target.value })} className="form-input" placeholder="Enter staff name" />
            </Field>
            <Field label="Department">
              <select value={assignmentForm.department} onChange={(e) => setAssignmentForm({ ...assignmentForm, department: e.target.value })} className="form-input">
                <option>Operations</option>
                <option>Housekeeping</option>
                <option>Restaurant</option>
                <option>Decoration</option>
                <option>Technical</option>
                <option>Security</option>
                <option>Management</option>
              </select>
            </Field>
            <Field label="Assigned Responsibility *">
              <textarea required rows="3" value={assignmentForm.task} onChange={(e) => setAssignmentForm({ ...assignmentForm, task: e.target.value })} className="form-input resize-none" placeholder="Describe assigned work..." />
            </Field>
            <ModalActions onCancel={() => setShowAssignment(false)} submitLabel="Assign Staff" />
          </form>
        </Modal>
      )}

      {/* Timeline form */}
      {showTimeline && selected && (
        <Modal title="Add Timeline Activity" onClose={() => setShowTimeline(false)}>
          <form onSubmit={addTimelineItem} className="space-y-4">
            <Field label="Activity Time *">
              <input required type="time" value={timelineForm.time} onChange={(e) => setTimelineForm({ ...timelineForm, time: e.target.value })} className="form-input" />
            </Field>
            <Field label="Activity *">
              <input required value={timelineForm.title} onChange={(e) => setTimelineForm({ ...timelineForm, title: e.target.value })} className="form-input" placeholder="Guest arrival / food service..." />
            </Field>
            <ModalActions onCancel={() => setShowTimeline(false)} submitLabel="Add Activity" />
          </form>
        </Modal>
      )}

      {/* Final billing */}
      {showFinalBilling && selected && (
        <Modal title="Final Event Billing" onClose={() => setShowFinalBilling(false)}>
          <form onSubmit={saveBilling} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3 text-sm">
              <p className="font-semibold text-slate-800">{selected.eventName}</p>
              <p className="mt-1 text-slate-600">Base amount: {formatCurrency(selected.totalAmount)}</p>
            </div>
            <Field label="Final Guest Count">
              <input type="number" min="0" value={billingForm.finalGuestCount} onChange={(e) => setBillingForm({ ...billingForm, finalGuestCount: e.target.value })} className="form-input" />
            </Field>
            <Field label="Extra Charges (₹)">
              <input type="number" min="0" value={billingForm.extraCharges} onChange={(e) => setBillingForm({ ...billingForm, extraCharges: e.target.value })} className="form-input" />
            </Field>
            <Field label="Damage Charges (₹)">
              <input type="number" min="0" value={billingForm.damageCharges} onChange={(e) => setBillingForm({ ...billingForm, damageCharges: e.target.value })} className="form-input" />
            </Field>
            <Field label="Total Amount Received (₹)">
              <input type="number" min="0" value={billingForm.receivedAmount} onChange={(e) => setBillingForm({ ...billingForm, receivedAmount: e.target.value })} className="form-input" />
            </Field>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="flex justify-between"><span>Base amount</span><strong>{formatCurrency(selected.totalAmount)}</strong></div>
              <div className="mt-2 flex justify-between"><span>Extra charges</span><strong>{formatCurrency(billingForm.extraCharges)}</strong></div>
              <div className="mt-2 flex justify-between"><span>Damage charges</span><strong>{formatCurrency(billingForm.damageCharges)}</strong></div>
              <div className="mt-3 flex justify-between border-t border-slate-200 pt-3 text-base"><span>Final bill</span><strong>{formatCurrency(Number(selected.totalAmount) + Number(billingForm.extraCharges || 0) + Number(billingForm.damageCharges || 0))}</strong></div>
              <div className="mt-2 flex justify-between"><span>Outstanding</span><strong className="text-orange-700">{formatCurrency(Math.max(0, Number(selected.totalAmount) + Number(billingForm.extraCharges || 0) + Number(billingForm.damageCharges || 0) - Number(billingForm.receivedAmount || 0)))}</strong></div>
            </div>
            <Field label="Billing Notes">
              <textarea rows="2" value={billingForm.notes} onChange={(e) => setBillingForm({ ...billingForm, notes: e.target.value })} className="form-input resize-none" />
            </Field>
            <ModalActions onCancel={() => setShowFinalBilling(false)} submitLabel="Save Final Billing" />
          </form>
        </Modal>
      )}
    </div>
  );
}

/* Reusable components */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function EventBadge({ status }) {
  const styles = {
    Confirmed: "bg-blue-50 text-blue-700",
    Preparation: "bg-orange-50 text-orange-700",
    Ready: "bg-purple-50 text-purple-700",
    "In Progress": "bg-indigo-50 text-indigo-700",
    Completed: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function TaskBadge({ completed }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${completed ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
      {completed ? "Completed" : "Pending"}
    </span>
  );
}

function ActionButton({ children, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border p-2 transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function FormSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900">{title}</h3>
      {children}
    </section>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}

function EmptyMessage({ text }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ${wide ? "max-w-5xl" : "max-w-xl"}`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

function ModalActions({ onCancel, submitLabel }) {
  return (
    <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
      <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
        Cancel
      </button>
      <button type="submit" className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700">
        {submitLabel}
      </button>
    </div>
  );
}
