
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  ClipboardList,
  Clock,
  CheckCircle2,
  Timer,
  AlertTriangle,
  BedDouble,
  UserRound,
  CalendarDays,
  X,
  Eye,
  Pencil,
  Trash2,
  Play,
  Check,
  ListChecks,
  Filter,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";

const initialTasks = [
  {
    id: "HK-1001",
    room: "101",
    floor: "1",
    type: "Checkout Cleaning",
    staff: "Priya Singh",
    priority: "High",
    date: "2026-11-06",
    due: "10:30",
    status: "In Progress",
    notes: "Extra towels required by guest.",
    checklist: [
      { label: "Change bed linen", done: true },
      { label: "Clean bathroom", done: true },
      { label: "Dust furniture", done: false },
      { label: "Vacuum floor", done: false },
      { label: "Replace amenities", done: false },
    ],
  },
  {
    id: "HK-1002",
    room: "204",
    floor: "2",
    type: "Stayover Cleaning",
    staff: "Rahul Verma",
    priority: "Normal",
    date: "2026-11-06",
    due: "12:00",
    status: "Pending",
    notes: "",
    checklist: [
      { label: "Make bed", done: false },
      { label: "Clean bathroom", done: false },
      { label: "Empty waste bins", done: false },
      { label: "Replace towels", done: false },
      { label: "Restock amenities", done: false },
    ],
  },
  {
    id: "HK-1003",
    room: "305",
    floor: "3",
    type: "Deep Cleaning",
    staff: "Aarav Sharma",
    priority: "Urgent",
    date: "2026-11-06",
    due: "09:30",
    status: "Overdue",
    notes: "Carpet stain near window.",
    checklist: [
      { label: "Deep clean bathroom", done: false },
      { label: "Clean carpet", done: false },
      { label: "Clean windows", done: false },
      { label: "Disinfect surfaces", done: false },
      { label: "Final room check", done: false },
    ],
  },
  {
    id: "HK-1004",
    room: "108",
    floor: "1",
    type: "Turndown Service",
    staff: "Priya Singh",
    priority: "Low",
    date: "2026-11-06",
    due: "18:00",
    status: "Completed",
    notes: "",
    checklist: [
      { label: "Prepare bed", done: true },
      { label: "Refresh bathroom", done: true },
      { label: "Arrange amenities", done: true },
    ],
  },
  {
    id: "HK-1005",
    room: "212",
    floor: "2",
    type: "Checkout Cleaning",
    staff: "Rahul Verma",
    priority: "High",
    date: "2026-11-06",
    due: "11:00",
    status: "Pending",
    notes: "Check minibar and inventory.",
    checklist: [
      { label: "Change bed linen", done: false },
      { label: "Clean bathroom", done: false },
      { label: "Clean furniture", done: false },
      { label: "Check minibar", done: false },
      { label: "Final room check", done: false },
    ],
  },
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

const staffMembers = [
  "Aarav Sharma",
  "Priya Singh",
  "Rahul Verma",
  "Neha Gupta",
];

const checklistTemplates = {
  "Checkout Cleaning": [
    "Change bed linen",
    "Clean bathroom",
    "Dust furniture",
    "Vacuum floor",
    "Replace amenities",
    "Empty waste bins",
    "Final room check",
  ],
  "Stayover Cleaning": [
    "Make bed",
    "Clean bathroom",
    "Empty waste bins",
    "Replace towels",
    "Restock amenities",
  ],
  "Deep Cleaning": [
    "Deep clean bathroom",
    "Clean carpet",
    "Clean windows",
    "Disinfect surfaces",
    "Clean furniture",
    "Final room check",
  ],
  "Turndown Service": [
    "Prepare bed",
    "Refresh bathroom",
    "Arrange amenities",
    "Close curtains",
  ],
  "Spot Cleaning": [
    "Identify affected area",
    "Clean affected area",
    "Disinfect surfaces",
    "Final check",
  ],
  "Special Cleaning": [
    "Review special instructions",
    "Complete requested cleaning",
    "Restock supplies",
    "Final room check",
  ],
};

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

function Modal({ title, subtitle, onClose, children, size = "max-w-xl" }) {
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

function StatCard({ title, value, icon: Icon, tone, subtitle }) {
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

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  room: "",
  type: "Checkout Cleaning",
  staff: staffMembers[0],
  priority: "Normal",
  date: today,
  due: "12:00",
  notes: "",
};

export default function CleaningTasks() {
  const [tasks, setTasks] = useState(initialTasks);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [form, setForm] = useState(emptyForm);
  const [checklistDraft, setChecklistDraft] = useState([]);

  const stats = useMemo(() => ({
    total: tasks.length,
    pending: tasks.filter((task) => task.status === "Pending").length,
    progress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
    overdue: tasks.filter((task) => task.status === "Overdue").length,
  }), [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const query = search.toLowerCase();

      const matchesSearch =
        task.id.toLowerCase().includes(query) ||
        task.room.toLowerCase().includes(query) ||
        task.staff.toLowerCase().includes(query) ||
        task.type.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  const openCreateModal = () => {
    setEditingTask(null);
    setForm(emptyForm);
    setChecklistDraft(
      checklistTemplates["Checkout Cleaning"].map((label) => ({
        label,
        done: false,
      }))
    );
    setShowForm(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task.id);
    setForm({
      room: task.room,
      type: task.type,
      staff: task.staff,
      priority: task.priority,
      date: task.date,
      due: task.due,
      notes: task.notes || "",
    });
    setChecklistDraft(task.checklist.map((item) => ({ ...item })));
    setShowForm(true);
  };

  const updateType = (type) => {
    setForm((previous) => ({ ...previous, type }));
    setChecklistDraft(
      checklistTemplates[type].map((label) => ({
        label,
        done: false,
      }))
    );
  };

  const saveTask = (event) => {
    event.preventDefault();

    const roomExists = rooms.some((room) => room.number === form.room);

    if (!roomExists) {
      alert("Please select a valid room from the room list.");
      return;
    }

    if (editingTask) {
      setTasks((previous) =>
        previous.map((task) =>
          task.id === editingTask
            ? { ...task, ...form, checklist: checklistDraft }
            : task
        )
      );
    } else {
      const newTask = {
        ...form,
        id: `HK-${Date.now().toString().slice(-6)}`,
        status: "Pending",
        checklist: checklistDraft,
      };

      setTasks((previous) => [newTask, ...previous]);
    }

    setShowForm(false);
    setEditingTask(null);
    setForm(emptyForm);
  };

  const startTask = (id) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, status: "In Progress" }
          : task
      )
    );
  };

  const completeTask = (id) => {
    const task = tasks.find((item) => item.id === id);

    if (task && task.checklist.some((item) => !item.done)) {
      const confirmComplete = window.confirm(
        "Some checklist items are still incomplete. Complete this task anyway?"
      );
      if (!confirmComplete) return;
    }

    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? {
              ...task,
              status: "Completed",
              checklist: task.checklist.map((item) => ({ ...item, done: true })),
            }
          : task
      )
    );

    setSelectedTask(null);
  };

  const toggleChecklist = (taskId, index) => {
    setTasks((previous) =>
      previous.map((task) => {
        if (task.id !== taskId) return task;

        return {
          ...task,
          checklist: task.checklist.map((item, itemIndex) =>
            itemIndex === index ? { ...item, done: !item.done } : item
          ),
        };
      })
    );

    setSelectedTask((previous) => {
      if (!previous || previous.id !== taskId) return previous;

      return {
        ...previous,
        checklist: previous.checklist.map((item, itemIndex) =>
          itemIndex === index ? { ...item, done: !item.done } : item
        ),
      };
    });
  };

  const deleteTask = (id) => {
    if (!window.confirm("Are you sure you want to delete this cleaning task?")) return;

    setTasks((previous) => previous.filter((task) => task.id !== id));
    setSelectedTask(null);
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

  const progressOf = (task) => {
    if (!task.checklist.length) return 0;
    const completed = task.checklist.filter((item) => item.done).length;
    return Math.round((completed / task.checklist.length) * 100);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              <Sparkles size={14} />
              ASH / Housekeeping
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Cleaning Tasks</h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, assign and track room cleaning tasks and checklists.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={17} />
            New Cleaning Task
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Total Tasks" value={stats.total} subtitle="All cleaning tasks" icon={ClipboardList} tone="purple" />
          <StatCard title="Pending" value={stats.pending} subtitle="Awaiting start" icon={Clock} tone="amber" />
          <StatCard title="In Progress" value={stats.progress} subtitle="Being cleaned" icon={Timer} tone="blue" />
          <StatCard title="Completed" value={stats.completed} subtitle="Finished tasks" icon={CheckCircle2} tone="green" />
          <StatCard title="Overdue" value={stats.overdue} subtitle="Past due tasks" icon={AlertTriangle} tone="red" />
        </div>

        {/* Filters */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {["All", "Pending", "In Progress", "Overdue", "Completed"].map((status) => (
                <button
                  type="button"
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={cn(
                    "rounded-lg px-3 py-2 text-xs font-semibold transition",
                    statusFilter === status
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative min-w-0 sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={17} />
                <input
                  className={cn(inputClass, "pl-9")}
                  placeholder="Search room, task, staff..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                className={cn(inputClass, "sm:w-40")}
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
              >
                <option value="All">All priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </section>

        {/* Task table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Cleaning Task List</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredTasks.length} task(s) displayed
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter size={15} />
              Filtered results
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Task / Room</th>
                  <th className="px-4 py-3">Cleaning Type</th>
                  <th className="px-4 py-3">Assigned Staff</th>
                  <th className="px-4 py-3">Due Date & Time</th>
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Checklist</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-800">Room {task.room}</p>
                      <p className="text-xs text-slate-400">{task.id} · Floor {task.floor}</p>
                    </td>

                    <td className="px-4 py-4 text-slate-600">{task.type}</td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                          <UserRound size={14} />
                        </div>
                        <span className="text-slate-600">{task.staff}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-700">{task.date}</p>
                      <p className="mt-1 text-xs text-slate-400">{task.due}</p>
                    </td>

                    <td className="px-4 py-4">
                      <Badge tone={getPriorityTone(task.priority)}>{task.priority}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      <div className="w-28">
                        <div className="mb-1 flex justify-between text-xs text-slate-500">
                          <span>{task.checklist.filter((item) => item.done).length}/{task.checklist.length}</span>
                          <span>{progressOf(task)}%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-indigo-500"
                            style={{ width: `${progressOf(task)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <Badge tone={getStatusTone(task.status)}>{task.status}</Badge>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="View task"
                          onClick={() => setSelectedTask(task)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          type="button"
                          title="Edit task"
                          onClick={() => openEditModal(task)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>

                        {task.status === "Pending" || task.status === "Overdue" ? (
                          <button
                            type="button"
                            title="Start task"
                            onClick={() => startTask(task.id)}
                            className="rounded-lg p-2 text-indigo-600 hover:bg-indigo-50"
                          >
                            <Play size={16} />
                          </button>
                        ) : task.status === "In Progress" ? (
                          <button
                            type="button"
                            title="Complete task"
                            onClick={() => completeTask(task.id)}
                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check size={17} />
                          </button>
                        ) : null}

                        <button
                          type="button"
                          title="Delete task"
                          onClick={() => deleteTask(task.id)}
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

            {filteredTasks.length === 0 && (
              <div className="py-14 text-center">
                <ClipboardList className="mx-auto mb-3 text-slate-300" size={35} />
                <p className="font-medium text-slate-600">No tasks found</p>
                <p className="mt-1 text-sm text-slate-400">Try changing your search or filters.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Create / Edit task modal */}
      {showForm && (
        <Modal
          title={editingTask ? "Edit Cleaning Task" : "Create Cleaning Task"}
          subtitle="Assign a room, staff member and cleaning checklist."
          onClose={() => setShowForm(false)}
          size="max-w-2xl"
        >
          <form onSubmit={saveTask} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Select Room" required>
                <select
                  required
                  className={inputClass}
                  value={form.room}
                  onChange={(event) => setForm({ ...form, room: event.target.value })}
                >
                  <option value="">Choose a room</option>
                  {rooms.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number} · Floor {room.floor} · {room.type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Cleaning Type" required>
                <select
                  className={inputClass}
                  value={form.type}
                  onChange={(event) => updateType(event.target.value)}
                >
                  {Object.keys(checklistTemplates).map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Assigned Staff" required>
                <select
                  className={inputClass}
                  value={form.staff}
                  onChange={(event) => setForm({ ...form, staff: event.target.value })}
                >
                  {staffMembers.map((person) => (
                    <option key={person}>{person}</option>
                  ))}
                </select>
              </Field>

              <Field label="Priority" required>
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </Field>

              <Field label="Due Date" required>
                <input
                  type="date"
                  required
                  className={inputClass}
                  value={form.date}
                  onChange={(event) => setForm({ ...form, date: event.target.value })}
                />
              </Field>

              <Field label="Due Time" required>
                <input
                  type="time"
                  required
                  className={inputClass}
                  value={form.due}
                  onChange={(event) => setForm({ ...form, due: event.target.value })}
                />
              </Field>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">Task Checklist</h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Checklist is automatically selected based on cleaning type.
                  </p>
                </div>
                <Badge tone="blue">{checklistDraft.length} items</Badge>
              </div>

              <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
                {checklistDraft.map((item, index) => (
                  <label key={`${item.label}-${index}`} className="flex items-center gap-3 rounded-lg bg-white p-2.5">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() =>
                        setChecklistDraft((previous) =>
                          previous.map((entry, itemIndex) =>
                            itemIndex === index
                              ? { ...entry, done: !entry.done }
                              : entry
                          )
                        )
                      }
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                    />
                    <span className="text-sm text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Field label="Cleaning Notes / Special Instructions">
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Add guest requests, room condition notes or special instructions..."
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
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
                {editingTask ? "Save Changes" : "Create Task"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Task details modal */}
      {selectedTask && (
        <Modal
          title={`Room ${selectedTask.room} · Cleaning Details`}
          subtitle={`${selectedTask.id} · ${selectedTask.type}`}
          onClose={() => setSelectedTask(null)}
          size="max-w-xl"
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Status</p>
                <div className="mt-2">
                  <Badge tone={getStatusTone(selectedTask.status)}>{selectedTask.status}</Badge>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Priority</p>
                <div className="mt-2">
                  <Badge tone={getPriorityTone(selectedTask.priority)}>{selectedTask.priority}</Badge>
                </div>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Due Date</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selectedTask.date}</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Due Time</p>
                <p className="mt-2 text-sm font-semibold text-slate-800">{selectedTask.due}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2">
                <UserRound size={16} className="text-indigo-500" />
                {selectedTask.staff}
              </span>
              <span className="inline-flex items-center gap-2">
                <BedDouble size={16} className="text-indigo-500" />
                Floor {selectedTask.floor}
              </span>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Cleaning Checklist</h3>
                <Badge tone="blue">
                  {selectedTask.checklist.filter((item) => item.done).length}/{selectedTask.checklist.length} completed
                </Badge>
              </div>

              <div className="space-y-2">
                {selectedTask.checklist.map((item, index) => (
                  <label
                    key={`${item.label}-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      disabled={selectedTask.status === "Completed"}
                      onChange={() => toggleChecklist(selectedTask.id, index)}
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

            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Cleaning Notes</h3>
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {selectedTask.notes || "No additional notes."}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              {selectedTask.status === "Pending" || selectedTask.status === "Overdue" ? (
                <button
                  type="button"
                  onClick={() => {
                    startTask(selectedTask.id);
                    setSelectedTask(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  <Play size={15} /> Start Cleaning
                </button>
              ) : selectedTask.status === "In Progress" ? (
                <button
                  type="button"
                  onClick={() => completeTask(selectedTask.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Check size={15} /> Complete Task
                </button>
              ) : (
                <Badge tone="green">Task completed</Badge>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
