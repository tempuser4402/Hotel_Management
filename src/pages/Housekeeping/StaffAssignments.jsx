
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  BedDouble,
  CalendarDays,
  UserRound,
  Pencil,
  Trash2,
  Eye,
  X,
  Check,
  Filter,
  Building2,
  Phone,
  Briefcase,
  MoreVertical,
  RotateCcw,
} from "lucide-react";

const staffMembers = [
  { id: "HK-001", name: "Neha Gupta", role: "Housekeeping Supervisor", phone: "9876543210", shift: "Morning", start: "07:00", end: "15:00", floor: "All Floors", status: "Active" },
  { id: "HK-002", name: "Priya Singh", role: "Room Attendant", phone: "9876543211", shift: "Morning", start: "07:00", end: "15:00", floor: "1", status: "Active" },
  { id: "HK-003", name: "Aarav Sharma", role: "Room Attendant", phone: "9876543212", shift: "Morning", start: "07:00", end: "15:00", floor: "2", status: "Active" },
  { id: "HK-004", name: "Rahul Verma", role: "Room Attendant", phone: "9876543213", shift: "Evening", start: "15:00", end: "23:00", floor: "3", status: "Active" },
  { id: "HK-005", name: "Ananya Patel", role: "Public Area Attendant", phone: "9876543214", shift: "Morning", start: "08:00", end: "16:00", floor: "Public Areas", status: "Active" },
  { id: "HK-006", name: "Vikram Kumar", role: "Room Attendant", phone: "9876543215", shift: "Night", start: "23:00", end: "07:00", floor: "1", status: "Active" },
];

const roomOptions = [
  { number: "101", floor: "1", type: "Deluxe" },
  { number: "102", floor: "1", type: "Standard" },
  { number: "103", floor: "1", type: "Standard" },
  { number: "104", floor: "1", type: "Suite" },
  { number: "105", floor: "1", type: "Deluxe" },
  { number: "201", floor: "2", type: "Deluxe" },
  { number: "202", floor: "2", type: "Standard" },
  { number: "203", floor: "2", type: "Suite" },
  { number: "204", floor: "2", type: "Standard" },
  { number: "205", floor: "2", type: "Family" },
  { number: "301", floor: "3", type: "Deluxe" },
  { number: "302", floor: "3", type: "Standard" },
  { number: "303", floor: "3", type: "Suite" },
  { number: "304", floor: "3", type: "Family" },
  { number: "305", floor: "3", type: "Standard" },
];

const today = new Date().toISOString().slice(0, 10);

const initialAssignments = [
  { id: "AS-1001", staffId: "HK-002", staff: "Priya Singh", room: "101", floor: "1", task: "Checkout Cleaning", priority: "High", dueTime: "10:00", shift: "Morning", date: today, status: "Completed", notes: "Guest checkout completed." },
  { id: "AS-1002", staffId: "HK-002", staff: "Priya Singh", room: "102", floor: "1", task: "Stayover Cleaning", priority: "Normal", dueTime: "12:00", shift: "Morning", date: today, status: "In Progress", notes: "" },
  { id: "AS-1003", staffId: "HK-003", staff: "Aarav Sharma", room: "201", floor: "2", task: "Checkout Cleaning", priority: "High", dueTime: "11:00", shift: "Morning", date: today, status: "Pending", notes: "" },
  { id: "AS-1004", staffId: "HK-003", staff: "Aarav Sharma", room: "202", floor: "2", task: "Deep Cleaning", priority: "Urgent", dueTime: "13:00", shift: "Morning", date: today, status: "Pending", notes: "Extra bathroom cleaning required." },
  { id: "AS-1005", staffId: "HK-004", staff: "Rahul Verma", room: "301", floor: "3", task: "Stayover Cleaning", priority: "Normal", dueTime: "17:00", shift: "Evening", date: today, status: "In Progress", notes: "" },
  { id: "AS-1006", staffId: "HK-004", staff: "Rahul Verma", room: "302", floor: "3", task: "Room Preparation", priority: "High", dueTime: "19:00", shift: "Evening", date: today, status: "Pending", notes: "" },
  { id: "AS-1007", staffId: "HK-006", staff: "Vikram Kumar", room: "103", floor: "1", task: "Deep Cleaning", priority: "Normal", dueTime: "02:00", shift: "Night", date: today, status: "Pending", notes: "" },
];

const taskTypes = [
  "Checkout Cleaning",
  "Stayover Cleaning",
  "Deep Cleaning",
  "Room Preparation",
  "Bathroom Cleaning",
  "Special Cleaning",
  "Public Area Cleaning",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600",
    red: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={cn("rounded-xl p-3", tones[tone])}>
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

function Modal({ title, subtitle, onClose, children, width = "max-w-2xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={cn("max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl", width)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const emptyForm = {
  staffId: "",
  room: "",
  task: "Checkout Cleaning",
  priority: "Normal",
  dueTime: "12:00",
  shift: "Morning",
  date: today,
  status: "Pending",
  notes: "",
};

export default function StaffAssignments() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [staff, setStaff] = useState(staffMembers);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [staffFilter, setStaffFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(today);
  const [activeTab, setActiveTab] = useState("assignments");
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    role: "Room Attendant",
    phone: "",
    shift: "Morning",
    start: "07:00",
    end: "15:00",
    floor: "1",
  });

  const getStaff = (id) => staff.find((person) => person.id === id);

  const filteredAssignments = useMemo(() => {
    return assignments.filter((item) => {
      const query = search.toLowerCase();
      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.staff.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query) ||
        item.task.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesStaff = staffFilter === "All" || item.staffId === staffFilter;
      const matchesDate = !dateFilter || item.date === dateFilter;

      return matchesSearch && matchesStatus && matchesStaff && matchesDate;
    });
  }, [assignments, search, statusFilter, staffFilter, dateFilter]);

  const stats = useMemo(() => ({
    total: assignments.filter((item) => item.date === today).length,
    pending: assignments.filter((item) => item.date === today && item.status === "Pending").length,
    progress: assignments.filter((item) => item.date === today && item.status === "In Progress").length,
    completed: assignments.filter((item) => item.date === today && item.status === "Completed").length,
    activeStaff: staff.filter((person) => person.status === "Active").length,
  }), [assignments, staff]);

  const staffWorkload = useMemo(() => {
    return staff.map((person) => {
      const tasks = assignments.filter((item) => item.staffId === person.id && item.date === today);
      const completed = tasks.filter((item) => item.status === "Completed").length;
      const inProgress = tasks.filter((item) => item.status === "In Progress").length;
      const pending = tasks.filter((item) => item.status === "Pending").length;

      return {
        ...person,
        total: tasks.length,
        completed,
        inProgress,
        pending,
        percentage: tasks.length ? Math.round((completed / tasks.length) * 100) : 0,
      };
    });
  }, [staff, assignments]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      staffId: item.staffId,
      room: item.room,
      task: item.task,
      priority: item.priority,
      dueTime: item.dueTime,
      shift: item.shift,
      date: item.date,
      status: item.status,
      notes: item.notes || "",
    });
    setShowForm(true);
  };

  const handleStaffChange = (staffId) => {
    const person = getStaff(staffId);
    setForm((previous) => ({
      ...previous,
      staffId,
      shift: person?.shift || previous.shift,
    }));
  };

  const saveAssignment = (event) => {
    event.preventDefault();

    const person = getStaff(form.staffId);
    if (!person) {
      window.alert("Please select a staff member.");
      return;
    }

    if (form.room && !roomOptions.some((room) => room.number === form.room)) {
      window.alert("Please select a valid room.");
      return;
    }

    const room = roomOptions.find((item) => item.number === form.room);

    const assignment = {
      ...form,
      staff: person.name,
      staffId: person.id,
      floor: room?.floor || person.floor,
    };

    if (editingId) {
      setAssignments((previous) =>
        previous.map((item) => item.id === editingId ? { ...item, ...assignment } : item)
      );
    } else {
      setAssignments((previous) => [
        {
          ...assignment,
          id: `AS-${Date.now().toString().slice(-6)}`,
        },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const changeStatus = (id, status) => {
    setAssignments((previous) =>
      previous.map((item) => item.id === id ? { ...item, status } : item)
    );

    setSelectedAssignment((previous) =>
      previous && previous.id === id ? { ...previous, status } : previous
    );
  };

  const deleteAssignment = (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    setAssignments((previous) => previous.filter((item) => item.id !== id));
    setSelectedAssignment(null);
  };

  const addStaff = (event) => {
    event.preventDefault();

    const newStaff = {
      ...staffForm,
      id: `HK-${String(Date.now()).slice(-4)}`,
      status: "Active",
    };

    setStaff((previous) => [...previous, newStaff]);
    setStaffForm({
      name: "",
      role: "Room Attendant",
      phone: "",
      shift: "Morning",
      start: "07:00",
      end: "15:00",
      floor: "1",
    });
    setShowStaffForm(false);
  };

  const toggleStaffStatus = (id) => {
    setStaff((previous) =>
      previous.map((person) =>
        person.id === id
          ? { ...person, status: person.status === "Active" ? "Inactive" : "Active" }
          : person
      )
    );
  };

  const statusTone = (status) => {
    if (status === "Completed") return "green";
    if (status === "In Progress") return "blue";
    if (status === "Pending") return "amber";
    return "slate";
  };

  const priorityTone = (priority) => {
    if (priority === "Urgent") return "red";
    if (priority === "High") return "amber";
    return "slate";
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              StayFlow / Housekeeping
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Staff Assignments</h1>
            <p className="mt-1 text-sm text-slate-500">
              Allocate daily housekeeping work and monitor staff workload and completion.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setShowStaffForm(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Users size={17} />
              Add Staff
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus size={17} />
              New Assignment
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard title="Today's Assignments" value={stats.total} subtitle="Total allocated tasks" icon={ClipboardList} tone="purple" />
          <StatCard title="Pending Tasks" value={stats.pending} subtitle="Waiting to start" icon={Clock} tone="amber" />
          <StatCard title="In Progress" value={stats.progress} subtitle="Currently being handled" icon={RotateCcw} tone="blue" />
          <StatCard title="Completed" value={stats.completed} subtitle="Finished today" icon={CheckCircle2} tone="green" />
          <StatCard title="Active Staff" value={stats.activeStaff} subtitle="Available team members" icon={Users} tone="blue" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
          {[
            { id: "assignments", label: "Daily Assignments", icon: ClipboardList },
            { id: "staff", label: "Staff Directory", icon: Users },
            { id: "workload", label: "Workload Overview", icon: Briefcase },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold",
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                )}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Assignments tab */}
        {activeTab === "assignments" && (
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Daily Work Allocation</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {filteredAssignments.length} assignment(s) displayed
                </p>
              </div>

              <div className="grid gap-2 sm:grid-cols-2 xl:flex">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    className={cn(inputClass, "pl-9 xl:w-56")}
                    placeholder="Search staff, room, task..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                <input
                  type="date"
                  className={cn(inputClass, "xl:w-40")}
                  value={dateFilter}
                  onChange={(event) => setDateFilter(event.target.value)}
                />

                <select
                  className={cn(inputClass, "xl:w-40")}
                  value={staffFilter}
                  onChange={(event) => setStaffFilter(event.target.value)}
                >
                  <option value="All">All Staff</option>
                  {staff.map((person) => (
                    <option key={person.id} value={person.id}>{person.name}</option>
                  ))}
                </select>

                <select
                  className={cn(inputClass, "xl:w-40")}
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Assignment</th>
                    <th className="px-4 py-3">Staff Member</th>
                    <th className="px-4 py-3">Room / Floor</th>
                    <th className="px-4 py-3">Task Type</th>
                    <th className="px-4 py-3">Shift / Due</th>
                    <th className="px-4 py-3">Priority</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAssignments.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">{item.id}</p>
                        <p className="text-xs text-slate-400">{item.date}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-indigo-50 p-2 text-indigo-600">
                            <UserRound size={15} />
                          </div>
                          <div>
                            <p className="font-medium text-slate-700">{item.staff}</p>
                            <p className="text-xs text-slate-400">{item.staffId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="font-medium text-slate-700">Room {item.room || "—"}</p>
                        <p className="text-xs text-slate-400">Floor {item.floor}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{item.task}</td>
                      <td className="px-4 py-4">
                        <p className="text-slate-700">{item.shift}</p>
                        <p className="text-xs text-slate-400">Due {item.dueTime}</p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={priorityTone(item.priority)}>{item.priority}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="View assignment"
                            onClick={() => setSelectedAssignment(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            title="Edit assignment"
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            title="Delete assignment"
                            onClick={() => deleteAssignment(item.id)}
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

              {filteredAssignments.length === 0 && (
                <div className="py-14 text-center">
                  <ClipboardList size={34} className="mx-auto mb-3 text-slate-300" />
                  <p className="font-medium text-slate-600">No assignments found</p>
                  <p className="mt-1 text-sm text-slate-400">Try changing your filters or create a new assignment.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Staff directory */}
        {activeTab === "staff" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Housekeeping Staff</h2>
                <p className="mt-1 text-xs text-slate-400">Staff profiles, roles, shifts and floor allocations.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowStaffForm(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Plus size={16} /> Add Staff Member
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {staff.map((person) => {
                const workload = staffWorkload.find((item) => item.id === person.id);
                return (
                  <div key={person.id} className="rounded-2xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600">
                          {person.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{person.name}</p>
                          <p className="text-xs text-slate-400">{person.id}</p>
                        </div>
                      </div>
                      <Badge tone={person.status === "Active" ? "green" : "slate"}>{person.status}</Badge>
                    </div>

                    <p className="mt-4 text-sm font-medium text-slate-700">{person.role}</p>
                    <div className="mt-3 space-y-2 text-xs text-slate-500">
                      <p className="flex items-center gap-2"><Phone size={14} /> {person.phone}</p>
                      <p className="flex items-center gap-2"><Clock size={14} /> {person.shift}: {person.start} – {person.end}</p>
                      <p className="flex items-center gap-2"><Building2 size={14} /> Floor {person.floor}</p>
                    </div>

                    <div className="mt-4 rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-600">Today's completion</span>
                        <span className="font-bold text-slate-800">{workload?.percentage || 0}%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${workload?.percentage || 0}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {workload?.completed || 0} of {workload?.total || 0} tasks completed
                      </p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedStaff(person)}
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      >
                        View Profile
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleStaffStatus(person.id)}
                        className={cn(
                          "rounded-lg px-3 py-2 text-xs font-semibold",
                          person.status === "Active"
                            ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        )}
                      >
                        {person.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Workload overview */}
        {activeTab === "workload" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-semibold text-slate-900">Staff Workload Overview</h2>
              <p className="mt-1 text-xs text-slate-400">Daily task distribution and completion by staff member.</p>
            </div>

            <div className="space-y-4">
              {staffWorkload.map((person) => (
                <div key={person.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-indigo-50 p-2.5 text-indigo-600">
                        <UserRound size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{person.name}</p>
                        <p className="text-xs text-slate-400">{person.role} · {person.shift} Shift</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge tone="green">{person.completed} Completed</Badge>
                      <Badge tone="blue">{person.inProgress} In Progress</Badge>
                      <Badge tone="amber">{person.pending} Pending</Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-slate-500">Completion progress</span>
                      <span className="font-semibold text-slate-700">{person.percentage}%</span>
                    </div>
                    <div className="flex h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="bg-emerald-500" style={{ width: `${person.total ? person.completed / person.total * 100 : 0}%` }} />
                      <div className="bg-blue-500" style={{ width: `${person.total ? person.inProgress / person.total * 100 : 0}%` }} />
                      <div className="bg-amber-400" style={{ width: `${person.total ? person.pending / person.total * 100 : 0}%` }} />
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-slate-400">
                    <span>Floor assignment: {person.floor}</span>
                    <span>Shift: {person.start} – {person.end}</span>
                    <span>Total tasks: {person.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Create / edit assignment modal */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Assignment" : "Create New Assignment"}
          subtitle="Allocate a housekeeping task to a staff member."
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={saveAssignment} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Staff Member" required>
                <select
                  required
                  className={inputClass}
                  value={form.staffId}
                  onChange={(event) => handleStaffChange(event.target.value)}
                >
                  <option value="">Select staff member</option>
                  {staff.filter((person) => person.status === "Active").map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.name} · {person.role}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Room" required>
                <select
                  required
                  className={inputClass}
                  value={form.room}
                  onChange={(event) => setForm({ ...form, room: event.target.value })}
                >
                  <option value="">Select room</option>
                  {roomOptions.map((room) => (
                    <option key={room.number} value={room.number}>
                      Room {room.number} · Floor {room.floor} · {room.type}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Cleaning Task" required>
                <select
                  required
                  className={inputClass}
                  value={form.task}
                  onChange={(event) => setForm({ ...form, task: event.target.value })}
                >
                  {taskTypes.map((task) => <option key={task}>{task}</option>)}
                </select>
              </Field>

              <Field label="Priority" required>
                <select
                  className={inputClass}
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </Field>

              <Field label="Assignment Date" required>
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
                  value={form.dueTime}
                  onChange={(event) => setForm({ ...form, dueTime: event.target.value })}
                />
              </Field>

              <Field label="Shift" required>
                <select
                  className={inputClass}
                  value={form.shift}
                  onChange={(event) => setForm({ ...form, shift: event.target.value })}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </Field>

              <Field label="Task Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </Field>
            </div>

            {form.staffId && (
              <div className="rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">
                <p className="font-semibold">{getStaff(form.staffId)?.name}</p>
                <p className="mt-1 text-xs">
                  Assigned floor: {getStaff(form.staffId)?.floor} · Shift: {getStaff(form.staffId)?.start} – {getStaff(form.staffId)?.end}
                </p>
              </div>
            )}

            <Field label="Assignment Notes">
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Add instructions or special cleaning requirements..."
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
                {editingId ? "Save Changes" : "Create Assignment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Add staff modal */}
      {showStaffForm && (
        <Modal
          title="Add Housekeeping Staff"
          subtitle="Create a staff profile for daily work allocation."
          onClose={() => setShowStaffForm(false)}
        >
          <form onSubmit={addStaff} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" required>
                <input
                  required
                  className={inputClass}
                  placeholder="Enter staff name"
                  value={staffForm.name}
                  onChange={(event) => setStaffForm({ ...staffForm, name: event.target.value })}
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  required
                  type="tel"
                  className={inputClass}
                  placeholder="Enter phone number"
                  value={staffForm.phone}
                  onChange={(event) => setStaffForm({ ...staffForm, phone: event.target.value })}
                />
              </Field>
              <Field label="Role" required>
                <select
                  className={inputClass}
                  value={staffForm.role}
                  onChange={(event) => setStaffForm({ ...staffForm, role: event.target.value })}
                >
                  <option>Room Attendant</option>
                  <option>Housekeeping Supervisor</option>
                  <option>Public Area Attendant</option>
                  <option>Laundry Attendant</option>
                  <option>Housekeeping Manager</option>
                </select>
              </Field>
              <Field label="Assigned Floor">
                <select
                  className={inputClass}
                  value={staffForm.floor}
                  onChange={(event) => setStaffForm({ ...staffForm, floor: event.target.value })}
                >
                  <option value="1">Floor 1</option>
                  <option value="2">Floor 2</option>
                  <option value="3">Floor 3</option>
                  <option value="All Floors">All Floors</option>
                  <option value="Public Areas">Public Areas</option>
                </select>
              </Field>
              <Field label="Shift">
                <select
                  className={inputClass}
                  value={staffForm.shift}
                  onChange={(event) => {
                    const shift = event.target.value;
                    const times = {
                      Morning: ["07:00", "15:00"],
                      Evening: ["15:00", "23:00"],
                      Night: ["23:00", "07:00"],
                    };
                    setStaffForm({
                      ...staffForm,
                      shift,
                      start: times[shift][0],
                      end: times[shift][1],
                    });
                  }}
                >
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </Field>
              <Field label="Shift Start">
                <input
                  type="time"
                  className={inputClass}
                  value={staffForm.start}
                  onChange={(event) => setStaffForm({ ...staffForm, start: event.target.value })}
                />
              </Field>
              <Field label="Shift End">
                <input
                  type="time"
                  className={inputClass}
                  value={staffForm.end}
                  onChange={(event) => setStaffForm({ ...staffForm, end: event.target.value })}
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowStaffForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Add Staff Member
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Assignment details modal */}
      {selectedAssignment && (
        <Modal
          title={`Assignment ${selectedAssignment.id}`}
          subtitle={`Room ${selectedAssignment.room} · ${selectedAssignment.date}`}
          onClose={() => setSelectedAssignment(null)}
        >
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Staff Member", selectedAssignment.staff],
                ["Staff ID", selectedAssignment.staffId],
                ["Room", selectedAssignment.room],
                ["Floor", selectedAssignment.floor],
                ["Task", selectedAssignment.task],
                ["Priority", selectedAssignment.priority],
                ["Shift", selectedAssignment.shift],
                ["Due Time", selectedAssignment.dueTime],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{value || "—"}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">Assignment Status</p>
              <div className="flex flex-wrap gap-2">
                {["Pending", "In Progress", "Completed"].map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => changeStatus(selectedAssignment.id, status)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-semibold",
                      selectedAssignment.status === status
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold text-slate-500">Notes</p>
              <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                {selectedAssignment.notes || "No notes added."}
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => {
                  openEdit(selectedAssignment);
                  setSelectedAssignment(null);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Pencil size={15} /> Edit
              </button>
              {selectedAssignment.status !== "Completed" && (
                <button
                  type="button"
                  onClick={() => changeStatus(selectedAssignment.id, selectedAssignment.status === "Pending" ? "In Progress" : "Completed")}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  <Check size={15} />
                  {selectedAssignment.status === "Pending" ? "Start Task" : "Complete Task"}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Staff profile modal */}
      {selectedStaff && (
        <Modal
          title={selectedStaff.name}
          subtitle={`${selectedStaff.id} · ${selectedStaff.role}`}
          onClose={() => setSelectedStaff(null)}
        >
          {(() => {
            const workload = staffWorkload.find((item) => item.id === selectedStaff.id);
            const personAssignments = assignments.filter((item) => item.staffId === selectedStaff.id);
            return (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{selectedStaff.phone}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Shift</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {selectedStaff.shift} · {selectedStaff.start}–{selectedStaff.end}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Floor Assignment</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{selectedStaff.floor}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">Today's Workload</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{workload?.total || 0} tasks</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">Assigned Tasks</h3>
                  <div className="space-y-2">
                    {personAssignments.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 p-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-700">Room {item.room} · {item.task}</p>
                          <p className="mt-1 text-xs text-slate-400">{item.date} · Due {item.dueTime}</p>
                        </div>
                        <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                      </div>
                    ))}
                    {personAssignments.length === 0 && (
                      <p className="py-5 text-center text-sm text-slate-400">No assignments found.</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
}
