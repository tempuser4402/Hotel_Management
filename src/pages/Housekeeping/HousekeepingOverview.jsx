import { useMemo, useState } from "react";
import {
  BedDouble,
  Timer,
  CheckCircle2,
  ClipboardCheck,
  AlertTriangle,
  Users,
  Plus,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  CalendarDays,
} from "lucide-react";

const initialTasks = [
  {
    id: "HK-1001",
    room: "101",
    type: "Checkout Cleaning",
    staff: "Priya Singh",
    priority: "High",
    due: "10:30",
    status: "In Progress",
    notes: "Extra towels required",
  },
  {
    id: "HK-1002",
    room: "204",
    type: "Stayover Cleaning",
    staff: "Rahul Verma",
    priority: "Normal",
    due: "12:00",
    status: "Pending",
    notes: "",
  },
  {
    id: "HK-1003",
    room: "305",
    type: "Deep Cleaning",
    staff: "Aarav Sharma",
    priority: "Urgent",
    due: "09:30",
    status: "Overdue",
    notes: "Carpet stain near window",
  },
  {
    id: "HK-1004",
    room: "108",
    type: "Turndown Service",
    staff: "Priya Singh",
    priority: "Low",
    due: "18:00",
    status: "Completed",
    notes: "",
  },
  {
    id: "HK-1005",
    room: "212",
    type: "Checkout Cleaning",
    staff: "Rahul Verma",
    priority: "High",
    due: "11:00",
    status: "Pending",
    notes: "",
  },
];

const initialInspections = [
  {
    id: "IN-201",
    room: "101",
    inspector: "Neha Gupta",
    time: "11:00",
    status: "Pending",
  },
  {
    id: "IN-202",
    room: "305",
    inspector: "Neha Gupta",
    time: "12:00",
    status: "Failed",
  },
  {
    id: "IN-203",
    room: "204",
    inspector: "Aarav Sharma",
    time: "14:00",
    status: "Scheduled",
  },
];

const initialStaff = [
  {
    id: "ST-01",
    name: "Aarav Sharma",
    floor: "All floors",
    completed: 4,
    total: 5,
  },
  {
    id: "ST-02",
    name: "Priya Singh",
    floor: "1st Floor",
    completed: 3,
    total: 4,
  },
  {
    id: "ST-03",
    name: "Rahul Verma",
    floor: "2nd Floor",
    completed: 2,
    total: 4,
  },
  {
    id: "ST-04",
    name: "Neha Gupta",
    floor: "Supervisor",
    completed: 3,
    total: 3,
  },
];

const staffNames = initialStaff.map((staff) => staff.name);

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-blue-50 text-blue-700",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

function StatCard({ title, value, note, icon: Icon, tone }) {
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
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{note}</p>
        </div>
        <div className={cn("rounded-xl p-3", colors[tone])}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Add a new housekeeping cleaning task
            </p>
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

function Field({ label, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function HousekeepingOverview() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    room: "",
    type: "Checkout Cleaning",
    staff: staffNames[0],
    priority: "Normal",
    due: "12:00",
    date: new Date().toISOString().slice(0, 10),
    notes: "",
  });

  const inspections = initialInspections;
  const staff = initialStaff;

  const stats = useMemo(
    () => ({
      pending: tasks.filter((t) => t.status === "Pending").length,
      progress: tasks.filter((t) => t.status === "In Progress").length,
      clean: tasks.filter((t) => t.status === "Completed").length,
      overdue: tasks.filter((t) => t.status === "Overdue").length,
    }),
    [tasks],
  );

  const pendingInspections = inspections.filter((item) =>
    ["Pending", "Scheduled"].includes(item.status),
  ).length;

  const visibleTasks = tasks.filter((task) => {
    const matchesFilter = filter === "All" || task.status === filter;
    const query = search.toLowerCase();

    const matchesSearch =
      task.room.toLowerCase().includes(query) ||
      task.id.toLowerCase().includes(query) ||
      task.staff.toLowerCase().includes(query) ||
      task.type.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const createTask = (event) => {
    event.preventDefault();

    const newTask = {
      ...form,
      id: `HK-${Date.now().toString().slice(-6)}`,
      status: "Pending",
    };

    setTasks((previous) => [newTask, ...previous]);

    setForm({
      room: "",
      type: "Checkout Cleaning",
      staff: staffNames[0],
      priority: "Normal",
      due: "12:00",
      date: new Date().toISOString().slice(0, 10),
      notes: "",
    });

    setShowModal(false);
  };

  const updateTaskStatus = (id, status) => {
    setTasks((previous) =>
      previous.map((task) => (task.id === id ? { ...task, status } : task)),
    );
  };

  const getStatusTone = (status) => {
    if (status === "Completed") return "green";
    if (status === "Overdue") return "red";
    if (status === "In Progress") return "blue";
    return "amber";
  };

  const getPriorityTone = (priority) => {
    if (priority === "Urgent" || priority === "High") return "red";
    if (priority === "Normal") return "blue";
    return "slate";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles size={14} />
              ASH / Property Operations
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Housekeeping Overview
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor room cleaning, inspections and housekeeping staff
              performance.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={17} />
            New Task
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Pending Cleaning"
            value={stats.pending}
            note="Awaiting staff action"
            icon={BedDouble}
            tone="amber"
          />
          <StatCard
            title="Cleaning In Progress"
            value={stats.progress}
            note="Currently being serviced"
            icon={Timer}
            tone="blue"
          />
          <StatCard
            title="Clean Rooms"
            value={stats.clean}
            note="Cleaning completed"
            icon={CheckCircle2}
            tone="green"
          />
          <StatCard
            title="Inspections Pending"
            value={pendingInspections}
            note="Quality checks remaining"
            icon={ClipboardCheck}
            tone="purple"
          />
          <StatCard
            title="Overdue Tasks"
            value={stats.overdue}
            note="Needs attention"
            icon={AlertTriangle}
            tone="red"
          />
        </div>

        {/* Main content */}
        <div className="grid gap-5 xl:grid-cols-3">
          {/* Task list */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Cleaning Task Queue
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Today's housekeeping activities
                </p>
              </div>

              <a
                href="/housekeeping/tasks"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Manage tasks <ArrowRight className="ml-1 inline" size={15} />
              </a>
            </div>

            <div className="p-5">
              <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    "All",
                    "Pending",
                    "In Progress",
                    "Overdue",
                    "Completed",
                  ].map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                        filter === item
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="relative w-full lg:max-w-xs">
                  <Search
                    className="absolute left-3 top-2.5 text-slate-400"
                    size={17}
                  />
                  <input
                    className={cn(inputClass, "pl-9")}
                    placeholder="Search room, staff or task..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                    <tr>
                      <th className="px-3 py-3">Room / Task</th>
                      <th className="px-3 py-3">Assigned Staff</th>
                      <th className="px-3 py-3">Priority</th>
                      <th className="px-3 py-3">Due Time</th>
                      <th className="px-3 py-3">Status</th>
                      <th className="px-3 py-3">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {visibleTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-slate-50">
                        <td className="px-3 py-3">
                          <p className="font-semibold text-slate-800">
                            Room {task.room}
                          </p>
                          <p className="text-xs text-slate-400">
                            {task.id} · {task.type}
                          </p>
                        </td>

                        <td className="px-3 py-3 text-slate-600">
                          {task.staff}
                        </td>

                        <td className="px-3 py-3">
                          <Badge tone={getPriorityTone(task.priority)}>
                            {task.priority}
                          </Badge>
                        </td>

                        <td className="px-3 py-3 text-slate-600">
                          <span className="inline-flex items-center gap-1">
                            <Clock size={13} />
                            {task.due}
                          </span>
                        </td>

                        <td className="px-3 py-3">
                          <Badge tone={getStatusTone(task.status)}>
                            {task.status}
                          </Badge>
                        </td>

                        <td className="px-3 py-3">
                          {task.status === "Pending" ||
                          task.status === "Overdue" ? (
                            <button
                              type="button"
                              onClick={() =>
                                updateTaskStatus(task.id, "In Progress")
                              }
                              className="text-xs font-semibold text-indigo-600 hover:underline"
                            >
                              Start
                            </button>
                          ) : task.status === "In Progress" ? (
                            <button
                              type="button"
                              onClick={() =>
                                updateTaskStatus(task.id, "Completed")
                              }
                              className="text-xs font-semibold text-emerald-600 hover:underline"
                            >
                              Complete
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">
                              Finished
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {visibleTasks.length === 0 && (
                  <div className="py-10 text-center text-sm text-slate-400">
                    No cleaning tasks found.
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Right column */}
          <div className="space-y-5">
            {/* Staff performance */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">
                    Staff Performance
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Daily completion progress
                  </p>
                </div>
                <Users className="text-indigo-500" size={21} />
              </div>

              <div className="space-y-5">
                {staff.map((person) => (
                  <div key={person.id}>
                    <div className="mb-2 flex justify-between gap-2 text-sm">
                      <span className="font-medium text-slate-700">
                        {person.name}
                      </span>
                      <span className="text-slate-500">
                        {person.completed}/{person.total}
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-indigo-500"
                        style={{
                          width: `${person.total ? (person.completed / person.total) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      {person.floor}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="/housekeeping/assignments"
                className="mt-5 block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View staff assignments →
              </a>
            </section>

            {/* Inspection alerts */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ClipboardCheck className="text-violet-600" size={20} />
                <h2 className="font-semibold text-slate-900">
                  Inspection Alerts
                </h2>
              </div>

              <div className="space-y-4">
                {inspections.map((inspection) => (
                  <div
                    key={inspection.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Room {inspection.room}
                      </p>
                      <p className="text-xs text-slate-400">
                        {inspection.inspector} · {inspection.time}
                      </p>
                    </div>

                    <Badge
                      tone={
                        inspection.status === "Failed"
                          ? "red"
                          : inspection.status === "Scheduled"
                            ? "blue"
                            : "amber"
                      }
                    >
                      {inspection.status}
                    </Badge>
                  </div>
                ))}
              </div>

              <a
                href="/housekeeping/inspections"
                className="mt-5 block text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                View inspections →
              </a>
            </section>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showModal && (
        <Modal title="Create Cleaning Task" onClose={() => setShowModal(false)}>
          <form onSubmit={createTask} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Room Number *">
                <input
                  required
                  className={inputClass}
                  placeholder="e.g. 101"
                  value={form.room}
                  onChange={(event) =>
                    setForm({ ...form, room: event.target.value })
                  }
                />
              </Field>

              <Field label="Cleaning Type">
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(event) =>
                    setForm({ ...form, type: event.target.value })
                  }
                >
                  <option>Checkout Cleaning</option>
                  <option>Stayover Cleaning</option>
                  <option>Deep Cleaning</option>
                  <option>Turndown Service</option>
                  <option>Spot Cleaning</option>
                  <option>Special Cleaning</option>
                </select>
              </Field>

              <Field label="Assigned Staff">
                <select
                  className={inputClass}
                  value={form.staff}
                  onChange={(event) =>
                    setForm({ ...form, staff: event.target.value })
                  }
                >
                  {staffNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Priority">
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(event) =>
                    setForm({ ...form, priority: event.target.value })
                  }
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </Field>

              <Field label="Due Time">
                <input
                  type="time"
                  required
                  className={inputClass}
                  value={form.due}
                  onChange={(event) =>
                    setForm({ ...form, due: event.target.value })
                  }
                />
              </Field>

              <Field label="Task Date">
                <input
                  type="date"
                  required
                  className={inputClass}
                  value={form.date}
                  onChange={(event) =>
                    setForm({ ...form, date: event.target.value })
                  }
                />
              </Field>
            </div>

            <Field label="Cleaning Notes">
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Special instructions or guest requests..."
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create Task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
