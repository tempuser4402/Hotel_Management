
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  CalendarDays,
  UserRound,
  BedDouble,
  Eye,
  Pencil,
  Trash2,
  X,
  Check,
  RotateCcw,
  FileWarning,
  Sparkles,
  Filter,
  Camera,
} from "lucide-react";

const today = new Date().toISOString().slice(0, 10);

const inspectors = [
  "Neha Gupta",
  "Aarav Sharma",
  "Priya Singh",
  "Rahul Verma",
];

const rooms = [
  { number: "101", floor: "1", type: "Deluxe" },
  { number: "102", floor: "1", type: "Standard" },
  { number: "103", floor: "1", type: "Standard" },
  { number: "108", floor: "1", type: "Suite" },
  { number: "201", floor: "2", type: "Deluxe" },
  { number: "204", floor: "2", type: "Standard" },
  { number: "212", floor: "2", type: "Suite" },
  { number: "301", floor: "3", type: "Deluxe" },
  { number: "305", floor: "3", type: "Standard" },
  { number: "310", floor: "3", type: "Family" },
];

const defaultChecklist = [
  "Bed linen and pillows properly arranged",
  "Bathroom cleaned and sanitized",
  "Floor and carpets clean",
  "Furniture and surfaces dust-free",
  "Windows and mirrors clean",
  "Towels and toiletries replenished",
  "Lighting and electrical items working",
  "Room amenities properly arranged",
  "Waste bins emptied",
  "Overall room presentation satisfactory",
];

const initialInspections = [
  {
    id: "IN-2001",
    room: "101",
    inspector: "Neha Gupta",
    date: today,
    time: "11:00",
    status: "Pending",
    condition: "Good",
    missingItems: "",
    damage: "",
    notes: "Regular checkout inspection.",
    checklist: defaultChecklist.map((label, index) => ({
      label,
      done: index < 7,
    })),
    reclean: false,
    recleanReason: "",
    proof: "",
  },
  {
    id: "IN-2002",
    room: "305",
    inspector: "Neha Gupta",
    date: today,
    time: "12:00",
    status: "Failed",
    condition: "Needs Attention",
    missingItems: "Two bath towels",
    damage: "Carpet stain near window",
    notes: "Room requires additional cleaning.",
    checklist: defaultChecklist.map((label, index) => ({
      label,
      done: index < 5,
    })),
    reclean: true,
    recleanReason: "Bathroom and carpet need additional cleaning.",
    proof: "",
  },
  {
    id: "IN-2003",
    room: "204",
    inspector: "Aarav Sharma",
    date: today,
    time: "14:00",
    status: "Scheduled",
    condition: "Not Checked",
    missingItems: "",
    damage: "",
    notes: "",
    checklist: defaultChecklist.map((label) => ({
      label,
      done: false,
    })),
    reclean: false,
    recleanReason: "",
    proof: "",
  },
  {
    id: "IN-2004",
    room: "108",
    inspector: "Priya Singh",
    date: today,
    time: "09:30",
    status: "Passed",
    condition: "Excellent",
    missingItems: "",
    damage: "",
    notes: "Room ready for guest check-in.",
    checklist: defaultChecklist.map((label) => ({
      label,
      done: true,
    })),
    reclean: false,
    recleanReason: "",
    proof: "",
  },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "slate" }) {
  const styles = {
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", styles[tone])}>
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-rose-50 text-rose-600",
    purple: "bg-violet-50 text-violet-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={cn("rounded-xl p-3", colors[tone])}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, size = "max-w-2xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={cn("max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl", size)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const emptyForm = {
  room: "",
  inspector: inspectors[0],
  date: today,
  time: "12:00",
  notes: "",
  condition: "Not Checked",
  missingItems: "",
  damage: "",
  recleanReason: "",
};

export default function RoomInspections() {
  const [inspections, setInspections] = useState(initialInspections);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedInspection, setSelectedInspection] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState(emptyForm);
  const [checklist, setChecklist] = useState(
    defaultChecklist.map((label) => ({ label, done: false }))
  );

  const stats = useMemo(() => ({
    total: inspections.length,
    pending: inspections.filter((item) =>
      ["Pending", "Scheduled"].includes(item.status)
    ).length,
    passed: inspections.filter((item) => item.status === "Passed").length,
    failed: inspections.filter((item) => item.status === "Failed").length,
    reclean: inspections.filter((item) => item.reclean).length,
  }), [inspections]);

  const filteredInspections = useMemo(() => {
    return inspections.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query) ||
        item.inspector.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [inspections, search, statusFilter]);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setChecklist(defaultChecklist.map((label) => ({ label, done: false })));
    setShowForm(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setForm({
      room: item.room,
      inspector: item.inspector,
      date: item.date,
      time: item.time,
      notes: item.notes || "",
      condition: item.condition,
      missingItems: item.missingItems || "",
      damage: item.damage || "",
      recleanReason: item.recleanReason || "",
    });
    setChecklist(item.checklist.map((entry) => ({ ...entry })));
    setShowForm(true);
  };

  const saveInspection = (event) => {
    event.preventDefault();

    if (!rooms.some((room) => room.number === form.room)) {
      alert("Please select a valid room.");
      return;
    }

    if (editingId) {
      setInspections((previous) =>
        previous.map((item) =>
          item.id === editingId
            ? { ...item, ...form, checklist }
            : item
        )
      );
    } else {
      const newInspection = {
        ...form,
        id: `IN-${Date.now().toString().slice(-6)}`,
        status: "Scheduled",
        checklist,
        reclean: false,
        proof: "",
      };

      setInspections((previous) => [newInspection, ...previous]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const toggleChecklistItem = (inspectionId, index) => {
    setInspections((previous) =>
      previous.map((item) =>
        item.id === inspectionId
          ? {
              ...item,
              checklist: item.checklist.map((entry, entryIndex) =>
                entryIndex === index
                  ? { ...entry, done: !entry.done }
                  : entry
              ),
            }
          : item
      )
    );

    setSelectedInspection((previous) => {
      if (!previous || previous.id !== inspectionId) return previous;

      return {
        ...previous,
        checklist: previous.checklist.map((entry, entryIndex) =>
          entryIndex === index
            ? { ...entry, done: !entry.done }
            : entry
        ),
      };
    });
  };

  const updateResult = (id, result) => {
    const item = inspections.find((inspection) => inspection.id === id);
    if (!item) return;

    const incomplete = item.checklist.some((entry) => !entry.done);

    if (result === "Passed" && incomplete) {
      const confirmPass = window.confirm(
        "Some checklist items are incomplete. Do you still want to mark this inspection as passed?"
      );
      if (!confirmPass) return;
    }

    const updated = {
      ...item,
      status: result,
      reclean: result === "Failed",
      recleanReason:
        result === "Failed"
          ? item.recleanReason || "Room needs additional cleaning."
          : "",
    };

    setInspections((previous) =>
      previous.map((inspection) =>
        inspection.id === id ? updated : inspection
      )
    );

    setSelectedInspection(updated);
  };

  const requestReclean = (id) => {
    setInspections((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              reclean: true,
              status: "Failed",
              recleanReason: item.recleanReason || "Re-cleaning requested by inspector.",
            }
          : item
      )
    );

    setSelectedInspection((previous) =>
      previous && previous.id === id
        ? {
            ...previous,
            reclean: true,
            status: "Failed",
            recleanReason: previous.recleanReason || "Re-cleaning requested by inspector.",
          }
        : previous
    );
  };

  const deleteInspection = (id) => {
    if (!window.confirm("Delete this inspection record?")) return;

    setInspections((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setSelectedInspection(null);
  };

  const getStatusTone = (status) => {
    if (status === "Passed") return "green";
    if (status === "Failed") return "red";
    if (status === "Scheduled") return "blue";
    return "amber";
  };

  const completedCount = (item) =>
    item.checklist.filter((entry) => entry.done).length;

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles size={14} />
              StayFlow / Housekeeping
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Room Inspections</h1>
            <p className="mt-1 text-sm text-slate-500">
              Schedule quality checks, inspect rooms and request re-cleaning when needed.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={17} />
            Schedule Inspection
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Inspections" value={stats.total} subtitle="All records" icon={ClipboardCheck} tone="purple" />
          <StatCard title="Pending" value={stats.pending} subtitle="Scheduled or awaiting" icon={Clock} tone="amber" />
          <StatCard title="Passed" value={stats.passed} subtitle="Quality approved" icon={CheckCircle2} tone="green" />
          <StatCard title="Failed" value={stats.failed} subtitle="Needs attention" icon={XCircle} tone="red" />
          <StatCard title="Re-cleaning Requests" value={stats.reclean} subtitle="Rooms to clean again" icon={RotateCcw} tone="blue" />
        </div>

        {/* Inspection list */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Inspection Schedule</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredInspections.length} inspection(s) displayed
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
                <input
                  className={cn(inputClass, "pl-9")}
                  placeholder="Search room or inspector..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                className={cn(inputClass, "sm:w-44")}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Pending">Pending</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Inspection / Room</th>
                  <th className="px-4 py-3">Inspector</th>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Room Condition</th>
                  <th className="px-4 py-3">Checklist</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Re-cleaning</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredInspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">Room {item.room}</p>
                      <p className="text-xs text-slate-400">{item.id}</p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                          <UserRound size={14} />
                        </div>
                        <span className="text-slate-600">{item.inspector}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-700">{item.date}</p>
                      <p className="mt-1 text-xs text-slate-400">{item.time}</p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">{item.condition}</td>

                    <td className="px-4 py-4">
                      <span className="text-slate-700">
                        {completedCount(item)}/{item.checklist.length}
                      </span>
                      <div className="mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{
                            width: `${item.checklist.length ? (completedCount(item) / item.checklist.length) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge tone={getStatusTone(item.status)}>{item.status}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      {item.reclean ? (
                        <Badge tone="red">Requested</Badge>
                      ) : (
                        <Badge tone="slate">No</Badge>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="View inspection"
                          onClick={() => setSelectedInspection(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit inspection"
                          onClick={() => openEditModal(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          title="Delete inspection"
                          onClick={() => deleteInspection(item.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredInspections.length === 0 && (
              <div className="py-14 text-center">
                <ClipboardCheck className="mx-auto mb-3 text-slate-300" size={35} />
                <p className="font-medium text-slate-600">No inspections found</p>
                <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </section>

        {/* Re-cleaning queue */}
        <section className="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <RotateCcw className="text-rose-500" size={20} />
            <div>
              <h2 className="font-semibold text-slate-900">Re-cleaning Requests</h2>
              <p className="text-xs text-slate-400">Rooms that failed inspection</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {inspections.filter((item) => item.reclean).map((item) => (
              <div key={item.id} className="rounded-xl border border-rose-100 bg-rose-50/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-slate-800">Room {item.room}</p>
                  <Badge tone="red">Re-clean</Badge>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  {item.recleanReason || "Additional cleaning required."}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedInspection(item)}
                  className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  View inspection details →
                </button>
              </div>
            ))}

            {stats.reclean === 0 && (
              <p className="py-5 text-sm text-slate-400">
                No re-cleaning requests at the moment.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Create / edit inspection modal */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Inspection" : "Schedule Room Inspection"}
          subtitle="Assign an inspector and configure the quality checklist."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={saveInspection} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Room" required>
                <select
                  required
                  className={inputClass}
                  value={form.room}
                  onChange={(event) => setForm({ ...form, room: event.target.value })}
                >
                  <option value="">Select room</option>
                  {rooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number} · Floor {room.floor} · {room.type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Inspector" required>
                <select
                  required
                  className={inputClass}
                  value={form.inspector}
                  onChange={(event) => setForm({ ...form, inspector: event.target.value })}
                >
                  {inspectors.map((person) => (
                    <option key={person}>{person}</option>
                  ))}
                </select>
              </Field>

              <Field label="Inspection Date" required>
                <input
                  type="date"
                  required
                  className={inputClass}
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                />
              </Field>

              <Field label="Inspection Time" required>
                <input
                  type="time"
                  required
                  className={inputClass}
                  value={form.time}
                  onChange={(event) => setForm({ ...form, time: event.target.value })}
                />
              </Field>

              <Field label="Room Condition">
                <select
                  className={inputClass}
                  value={form.condition}
                  onChange={(event) => setForm({ ...form, condition: event.target.value })}
                >
                  <option>Not Checked</option>
                  <option>Excellent</option>
                  <option>Good</option>
                  <option>Needs Attention</option>
                  <option>Damaged</option>
                </select>
              </Field>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Cleaning Quality Checklist</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Mark each requirement after checking the room.
                  </p>
                </div>
                <Badge tone="blue">
                  {checklist.filter((item) => item.done).length}/{checklist.length}
                </Badge>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                {checklist.map((item, index) => (
                  <label
                    key={item.label}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        setChecklist((previous) =>
                          previous.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, done: !entry.done }
                              : entry
                          )
                        )
                      }
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-xs leading-5 text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Missing Items">
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Example: Missing towels, toiletries, remote..."
                value={form.missingItems}
                onChange={(event) => setForm({ ...form, missingItems: event.target.value })}
              />
            </Field>

            <Field label="Damage Report">
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Describe any damage found in the room..."
                value={form.damage}
                onChange={(event) => setForm({ ...form, damage: event.target.value })}
              />
            </Field>

            <Field label="Inspection Notes">
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Additional inspection observations..."
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </Field>

            <Field label="Re-cleaning Instructions">
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Enter the work required if the room fails inspection..."
                value={form.recleanReason}
                onChange={(event) => setForm({ ...form, recleanReason: event.target.value })}
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Save Changes" : "Schedule Inspection"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Inspection details modal */}
      {selectedInspection && (
        <Modal
          title={`Room ${selectedInspection.room} · Inspection`}
          subtitle={`${selectedInspection.id} · ${selectedInspection.date} at ${selectedInspection.time}`}
          onClose={() => setSelectedInspection(null)}
        >
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Inspector</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedInspection.inspector}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Room Condition</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  {selectedInspection.condition}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Result</p>
                <div className="mt-2">
                  <Badge tone={getStatusTone(selectedInspection.status)}>
                    {selectedInspection.status}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Quality Checklist</h3>
                <Badge tone="blue">
                  {selectedInspection.checklist.filter((item) => item.done).length}/{selectedInspection.checklist.length} completed
                </Badge>
              </div>

              <div className="space-y-2">
                {selectedInspection.checklist.map((item, index) => (
                  <label
                    key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => toggleChecklistItem(selectedInspection.id, index)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className={cn("text-sm", item.done ? "text-slate-400 line-through" : "text-slate-700")}>
                      {item.label}
                    </span>
                    {item.done && <CheckCircle2 size={16} className="ml-auto text-emerald-500" />}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <FileWarning size={16} className="text-amber-600" />
                  <h3 className="text-sm font-semibold text-slate-800">Missing Items</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {selectedInspection.missingItems || "No missing items reported."}
                </p>
              </div>

              <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-3">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-rose-600" />
                  <h3 className="text-sm font-semibold text-slate-800">Damage Report</h3>
                </div>
                <p className="text-sm text-slate-600">
                  {selectedInspection.damage || "No damage reported."}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Inspection Notes</h3>
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {selectedInspection.notes || "No additional notes."}
              </p>
            </div>

            {selectedInspection.reclean && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-center gap-2 text-rose-700">
                  <RotateCcw size={17} />
                  <p className="text-sm font-semibold">Re-cleaning Requested</p>
                </div>
                <p className="mt-2 text-sm text-rose-600">
                  {selectedInspection.recleanReason}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => requestReclean(selectedInspection.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <RotateCcw size={15} />
                Request Re-cleaning
              </button>

              <button
                type="button"
                onClick={() => updateResult(selectedInspection.id, "Failed")}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
              >
                <XCircle size={15} />
                Mark Failed
              </button>

              <button
                type="button"
                onClick={() => updateResult(selectedInspection.id, "Passed")}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <CheckCircle2 size={15} />
                Mark Passed
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
