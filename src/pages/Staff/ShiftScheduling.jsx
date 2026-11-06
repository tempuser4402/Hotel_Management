
import { useMemo, useState } from "react";
import {
  Plus, Search, CalendarDays, Clock, Users, Sun, Moon,
  Sunrise, Pencil, Trash2, Eye, X, Save, Download,
  CheckCircle2, AlertCircle, ArrowRightLeft, ChevronLeft,
  ChevronRight, UserRound, CalendarCheck, Filter,
} from "lucide-react";

const employees = [
  { id: "EMP-001", name: "Amit Sharma", department: "Front Desk" },
  { id: "EMP-002", name: "Priya Verma", department: "Housekeeping" },
  { id: "EMP-003", name: "Rahul Singh", department: "Kitchen" },
  { id: "EMP-004", name: "Neha Gupta", department: "Finance" },
  { id: "EMP-005", name: "Vikram Yadav", department: "Security" },
  { id: "EMP-006", name: "Ankit Kumar", department: "Restaurant" },
  { id: "EMP-007", name: "Rohit Mehta", department: "Maintenance" },
  { id: "EMP-008", name: "Kavita Joshi", department: "Human Resources" },
  { id: "EMP-009", name: "Suresh Patel", department: "Front Desk" },
  { id: "EMP-010", name: "Pooja Sharma", department: "Housekeeping" },
];

const shiftTypes = {
  Morning: { start: "06:00", end: "14:00" },
  Evening: { start: "14:00", end: "22:00" },
  Night: { start: "22:00", end: "06:00" },
};

const departments = [...new Set(employees.map((e) => e.department))];

const dateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const today = dateKey(new Date());

function addDays(dateString, amount) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

function getWeekStart(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  return dateKey(date);
}

function formatDate(dateString, options = {}) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString("en-IN", options);
}

const initialShifts = [
  { id: "SH-001", employeeId: "EMP-001", date: today, type: "Morning", start: "06:00", end: "14:00", department: "Front Desk", status: "Published", notes: "" },
  { id: "SH-002", employeeId: "EMP-009", date: today, type: "Evening", start: "14:00", end: "22:00", department: "Front Desk", status: "Published", notes: "" },
  { id: "SH-003", employeeId: "EMP-002", date: today, type: "Morning", start: "06:00", end: "14:00", department: "Housekeeping", status: "Published", notes: "" },
  { id: "SH-004", employeeId: "EMP-010", date: today, type: "Evening", start: "14:00", end: "22:00", department: "Housekeeping", status: "Published", notes: "" },
  { id: "SH-005", employeeId: "EMP-003", date: today, type: "Morning", start: "06:00", end: "14:00", department: "Kitchen", status: "Published", notes: "" },
  { id: "SH-006", employeeId: "EMP-006", date: today, type: "Evening", start: "14:00", end: "22:00", department: "Restaurant", status: "Published", notes: "" },
  { id: "SH-007", employeeId: "EMP-005", date: today, type: "Night", start: "22:00", end: "06:00", department: "Security", status: "Published", notes: "" },
  { id: "SH-008", employeeId: "EMP-007", date: today, type: "Morning", start: "06:00", end: "14:00", department: "Maintenance", status: "Draft", notes: "Equipment inspection" },
  { id: "SH-009", employeeId: "EMP-004", date: today, type: "Morning", start: "09:00", end: "17:00", department: "Finance", status: "Published", notes: "" },
  { id: "SH-010", employeeId: "EMP-008", date: today, type: "Evening", start: "14:00", end: "22:00", department: "Human Resources", status: "Published", notes: "" },
];

const initialSwapRequests = [
  {
    id: "SW-001",
    fromEmployee: "EMP-001",
    toEmployee: "EMP-009",
    date: today,
    reason: "Personal commitment",
    status: "Pending",
  },
  {
    id: "SW-002",
    fromEmployee: "EMP-003",
    toEmployee: "EMP-006",
    date: addDays(today, 1),
    reason: "Family event",
    status: "Approved",
  },
];

const emptyShift = {
  employeeId: "",
  date: today,
  type: "Morning",
  start: "06:00",
  end: "14:00",
  department: "",
  status: "Published",
  notes: "",
};

export default function ShiftScheduling() {
  const [shifts, setShifts] = useState(initialShifts);
  const [swapRequests, setSwapRequests] = useState(initialSwapRequests);
  const [selectedDate, setSelectedDate] = useState(today);
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [shiftFilter, setShiftFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyShift);
  const [swapForm, setSwapForm] = useState({
    fromEmployee: "",
    toEmployee: "",
    date: today,
    reason: "",
  });
  const [errors, setErrors] = useState({});

  const weekStart = getWeekStart(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekEnd = weekDays[6];

  const weekShifts = shifts.filter(
    (shift) => shift.date >= weekStart && shift.date <= weekEnd
  );

  const dailyShifts = shifts.filter((shift) => shift.date === selectedDate);

  const filteredShifts = useMemo(() => {
    return dailyShifts.filter((shift) => {
      const employee = employees.find((e) => e.id === shift.employeeId);
      if (!employee) return false;

      const matchesSearch = [
        employee.name,
        employee.id,
        shift.department,
        shift.type,
      ].join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" || shift.department === departmentFilter;

      const matchesShift =
        shiftFilter === "All" || shift.type === shiftFilter;

      return matchesSearch && matchesDepartment && matchesShift;
    });
  }, [dailyShifts, search, departmentFilter, shiftFilter]);

  const pendingSwaps = swapRequests.filter((r) => r.status === "Pending").length;
  const morningCount = dailyShifts.filter((s) => s.type === "Morning").length;
  const eveningCount = dailyShifts.filter((s) => s.type === "Evening").length;
  const nightCount = dailyShifts.filter((s) => s.type === "Night").length;

  const openCreate = (date = selectedDate) => {
    setSelected(null);
    setForm({ ...emptyShift, date });
    setErrors({});
    setModal("form");
  };

  const openEdit = (shift) => {
    setSelected(shift);
    setForm({
      employeeId: shift.employeeId,
      date: shift.date,
      type: shift.type,
      start: shift.start,
      end: shift.end,
      department: shift.department,
      status: shift.status,
      notes: shift.notes,
    });
    setErrors({});
    setModal("form");
  };

  const openView = (shift) => {
    setSelected(shift);
    setModal("view");
  };

  const updateField = (field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "employeeId") {
        const employee = employees.find((e) => e.id === value);
        if (employee) next.department = employee.department;
      }

      if (field === "type" && shiftTypes[value]) {
        next.start = shiftTypes[value].start;
        next.end = shiftTypes[value].end;
      }

      return next;
    });

    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const saveShift = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.employeeId) nextErrors.employeeId = "Select an employee.";
    if (!form.date) nextErrors.date = "Select a date.";
    if (!form.start || !form.end) nextErrors.start = "Shift timings are required.";

    const duplicate = shifts.some(
      (shift) =>
        shift.employeeId === form.employeeId &&
        shift.date === form.date &&
        shift.id !== selected?.id
    );

    if (duplicate) {
      nextErrors.employeeId = "This employee already has a shift on this date.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const updatedShift = {
      ...form,
      id: selected?.id || `SH-${String(Date.now()).slice(-6)}`,
    };

    setShifts((prev) =>
      selected
        ? prev.map((s) => s.id === selected.id ? updatedShift : s)
        : [updatedShift, ...prev]
    );

    setSelectedDate(form.date);
    setModal(null);
    setSelected(null);
  };

  const deleteShift = (shift) => {
    if (!window.confirm("Delete this shift assignment?")) return;
    setShifts((prev) => prev.filter((s) => s.id !== shift.id));
    setModal(null);
    setSelected(null);
  };

  const publishWeek = () => {
    if (!window.confirm("Publish all draft shifts for this week?")) return;
    setShifts((prev) =>
      prev.map((s) =>
        s.date >= weekStart && s.date <= weekEnd && s.status === "Draft"
          ? { ...s, status: "Published" }
          : s
      )
    );
  };

  const openSwapModal = () => {
    setSwapForm({
      fromEmployee: "",
      toEmployee: "",
      date: selectedDate,
      reason: "",
    });
    setErrors({});
    setModal("swap");
  };

  const submitSwap = (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!swapForm.fromEmployee) nextErrors.fromEmployee = "Select the requesting employee.";
    if (!swapForm.toEmployee) nextErrors.toEmployee = "Select the replacement employee.";
    if (swapForm.fromEmployee === swapForm.toEmployee) {
      nextErrors.toEmployee = "Choose a different employee.";
    }
    if (!swapForm.date) nextErrors.date = "Select a shift date.";

    const sourceShift = shifts.find(
      (s) => s.employeeId === swapForm.fromEmployee && s.date === swapForm.date
    );

    if (!sourceShift) {
      nextErrors.fromEmployee = "The selected employee has no shift on this date.";
    }

    const targetHasShift = shifts.some(
      (s) => s.employeeId === swapForm.toEmployee && s.date === swapForm.date
    );

    if (targetHasShift) {
      nextErrors.toEmployee = "The replacement employee already has a shift on this date.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setSwapRequests((prev) => [
      {
        id: `SW-${String(Date.now()).slice(-6)}`,
        ...swapForm,
        status: "Pending",
      },
      ...prev,
    ]);

    setModal(null);
  };

  const updateSwapStatus = (request, status) => {
    if (status === "Approved") {
      const sourceShift = shifts.find(
        (s) =>
          s.employeeId === request.fromEmployee &&
          s.date === request.date
      );

      if (!sourceShift) {
        window.alert("The original shift could not be found.");
        return;
      }

      const targetAlreadyScheduled = shifts.some(
        (s) =>
          s.employeeId === request.toEmployee &&
          s.date === request.date
      );

      if (targetAlreadyScheduled) {
        window.alert("The replacement employee already has a shift on this date.");
        return;
      }

      const targetEmployee = employees.find((e) => e.id === request.toEmployee);

      setShifts((prev) =>
        prev.map((s) =>
          s.id === sourceShift.id
            ? {
                ...s,
                employeeId: request.toEmployee,
                department: targetEmployee?.department || s.department,
              }
            : s
        )
      );
    }

    setSwapRequests((prev) =>
      prev.map((r) => r.id === request.id ? { ...r, status } : r)
    );
  };

  const exportCSV = () => {
    const headers = [
      "Shift ID", "Date", "Employee ID", "Employee Name",
      "Department", "Shift Type", "Start", "End", "Status", "Notes",
    ];

    const rows = filteredShifts.map((shift) => {
      const employee = employees.find((e) => e.id === shift.employeeId);
      return [
        shift.id, shift.date, shift.employeeId, employee?.name,
        shift.department, shift.type, shift.start, shift.end,
        shift.status, shift.notes,
      ];
    });

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stayflow-shifts-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const changeWeek = (direction) => {
    setSelectedDate(addDays(selectedDate, direction * 7));
  };

  const closeModal = () => {
    setModal(null);
    setSelected(null);
    setErrors({});
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays size={15} />
              Staff & HR <span>/</span>
              <span className="text-indigo-600">Shift Scheduling</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Shift Scheduling</h1>
            <p className="mt-1 text-sm text-slate-500">
              Plan employee shifts, publish weekly schedules and manage shift swaps.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={openSwapModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <ArrowRightLeft size={17} /> Request Swap
            </button>
            <button
              onClick={() => openCreate()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} /> Assign Shift
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Today's Assignments"
            value={dailyShifts.length}
            icon={<Users size={20} />}
            color="indigo"
          />
          <StatCard
            title="Morning Shifts"
            value={morningCount}
            icon={<Sunrise size={20} />}
            color="amber"
          />
          <StatCard
            title="Evening / Night"
            value={eveningCount + nightCount}
            icon={<Moon size={20} />}
            color="sky"
          />
          <StatCard
            title="Pending Swap Requests"
            value={pendingSwaps}
            icon={<ArrowRightLeft size={20} />}
            color="rose"
          />
        </div>

        {/* Weekly schedule */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Weekly Schedule</h2>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(weekStart, { day: "2-digit", month: "short" })} –{" "}
                {formatDate(weekEnd, { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => changeWeek(-1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                title="Previous week"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSelectedDate(today)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Today
              </button>
              <button
                onClick={() => changeWeek(1)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
                title="Next week"
              >
                <ChevronRight size={18} />
              </button>
              <button
                onClick={publishWeek}
                className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                Publish Drafts
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {weekDays.map((day) => {
              const dayShifts = shifts.filter((s) => s.date === day);
              const isSelected = day === selectedDate;
              const isToday = day === today;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`min-h-[145px] rounded-xl border p-3 text-left transition ${
                    isSelected
                      ? "border-indigo-400 bg-indigo-50 ring-2 ring-indigo-100"
                      : "border-slate-100 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">
                      {formatDate(day, { weekday: "short" })}
                    </span>
                    {isToday && (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {formatDate(day, { day: "2-digit" })}
                  </p>

                  <div className="mt-3 space-y-1.5">
                    <DayCount label="Morning" count={dayShifts.filter((s) => s.type === "Morning").length} color="amber" />
                    <DayCount label="Evening" count={dayShifts.filter((s) => s.type === "Evening").length} color="sky" />
                    <DayCount label="Night" count={dayShifts.filter((s) => s.type === "Night").length} color="indigo" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>{weekShifts.length} shift assignments this week</span>
            <span>
              {weekShifts.filter((s) => s.status === "Draft").length} draft assignments
            </span>
          </div>
        </div>

        {/* Selected day shifts */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Shift Assignments</h2>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(selectedDate, { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none sm:w-48"
                />
              </div>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>

              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="All">All Shifts</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>

              <button
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Employee</th>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">Shift</th>
                  <th className="px-5 py-3.5 font-semibold">Timing</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShifts.map((shift) => {
                  const employee = employees.find((e) => e.id === shift.employeeId);

                  return (
                    <tr key={shift.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <UserRound size={17} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800">{employee?.name}</p>
                            <p className="text-xs text-slate-400">{employee?.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{shift.department}</td>
                      <td className="px-5 py-4"><ShiftBadge type={shift.type} /></td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {shift.start} – {shift.end}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={shift.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton title="View" onClick={() => openView(shift)}>
                            <Eye size={16} />
                          </ActionButton>
                          <ActionButton title="Edit" onClick={() => openEdit(shift)}>
                            <Pencil size={16} />
                          </ActionButton>
                          <ActionButton title="Delete" danger onClick={() => deleteShift(shift)}>
                            <Trash2 size={16} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredShifts.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-5 py-14 text-center">
                      <CalendarDays size={35} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-medium text-slate-700">No shifts found</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Assign a shift or change your filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Swap requests */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">Shift Swap Requests</h2>
              <p className="mt-1 text-xs text-slate-500">
                Review and approve employee shift exchange requests.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {pendingSwaps} Pending
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {swapRequests.map((request) => {
              const from = employees.find((e) => e.id === request.fromEmployee);
              const to = employees.find((e) => e.id === request.toEmployee);

              return (
                <div key={request.id} className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{from?.name || request.fromEmployee}</p>
                      <p className="text-xs text-slate-400">Current employee</p>
                    </div>
                    <ArrowRightLeft size={17} className="text-indigo-500" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{to?.name || request.toEmployee}</p>
                      <p className="text-xs text-slate-400">Replacement employee</p>
                    </div>
                    <div className="ml-0 lg:ml-3">
                      <p className="text-xs font-medium text-slate-600">{formatDate(request.date)}</p>
                      <p className="text-xs text-slate-400">{request.reason || "No reason provided"}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={request.status} />
                    {request.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateSwapStatus(request, "Approved")}
                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateSwapStatus(request, "Rejected")}
                          className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}

            {swapRequests.length === 0 && (
              <p className="p-8 text-center text-sm text-slate-400">
                No shift swap requests available.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Shift Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Shift Assignment" : "Assign New Shift"}
          subtitle="Configure the employee's working schedule."
          onClose={closeModal}
        >
          <form onSubmit={saveShift} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Employee *</label>
              <select
                value={form.employeeId}
                onChange={(e) => updateField("employeeId", e.target.value)}
                className={inputClass}
              >
                <option value="">Select employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name} — {employee.department}
                  </option>
                ))}
              </select>
              {errors.employeeId && <ErrorText>{errors.employeeId}</ErrorText>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Shift Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className={inputClass}
              />
              {errors.date && <ErrorText>{errors.date}</ErrorText>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Shift Type</label>
              <select
                value={form.type}
                onChange={(e) => updateField("type", e.target.value)}
                className={inputClass}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Start Time</label>
                <input
                  type="time"
                  value={form.start}
                  onChange={(e) => updateField("start", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">End Time</label>
                <input
                  type="time"
                  value={form.end}
                  onChange={(e) => updateField("end", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            {errors.start && <ErrorText>{errors.start}</ErrorText>}

            <div>
              <label className="text-sm font-medium text-slate-700">Department</label>
              <input
                value={form.department}
                readOnly
                className={inputClass + " bg-slate-50"}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Schedule Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className={inputClass}
              >
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea
                rows={2}
                value={form.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Optional shift notes..."
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                <Save size={16} />
                {selected ? "Save Changes" : "Assign Shift"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Shift Details */}
      {modal === "view" && selected && (
        <Modal title="Shift Details" subtitle="Employee shift assignment information." onClose={closeModal}>
          {(() => {
            const employee = employees.find((e) => e.id === selected.employeeId);

            return (
              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-indigo-600">
                    <UserRound size={20} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{employee?.name}</h3>
                    <p className="text-xs text-slate-500">{employee?.id} · {employee?.department}</p>
                  </div>
                  <StatusBadge status={selected.status} />
                </div>

                <DetailRow label="Shift Date" value={formatDate(selected.date, { dateStyle: "long" })} />
                <DetailRow label="Shift Type" value={selected.type} />
                <DetailRow label="Start Time" value={selected.start} />
                <DetailRow label="End Time" value={selected.end} />
                <DetailRow label="Department" value={selected.department} />
                <DetailRow label="Notes" value={selected.notes || "No notes"} />

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
                    Close
                  </button>
                  <button onClick={() => openEdit(selected)} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                    <Pencil size={15} /> Edit Shift
                  </button>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Swap Request Modal */}
      {modal === "swap" && (
        <Modal title="Request Shift Swap" subtitle="Submit an employee shift exchange request for approval." onClose={closeModal}>
          <form onSubmit={submitSwap} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Current Employee *</label>
              <select
                value={swapForm.fromEmployee}
                onChange={(e) => {
                  setSwapForm((p) => ({ ...p, fromEmployee: e.target.value }));
                  setErrors((p) => ({ ...p, fromEmployee: "" }));
                }}
                className={inputClass}
              >
                <option value="">Select employee</option>
                {employees.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              {errors.fromEmployee && <ErrorText>{errors.fromEmployee}</ErrorText>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Replacement Employee *</label>
              <select
                value={swapForm.toEmployee}
                onChange={(e) => {
                  setSwapForm((p) => ({ ...p, toEmployee: e.target.value }));
                  setErrors((p) => ({ ...p, toEmployee: "" }));
                }}
                className={inputClass}
              >
                <option value="">Select replacement</option>
                {employees.filter((e) => e.id !== swapForm.fromEmployee).map((e) => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
              {errors.toEmployee && <ErrorText>{errors.toEmployee}</ErrorText>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Shift Date *</label>
              <input
                type="date"
                value={swapForm.date}
                onChange={(e) => setSwapForm((p) => ({ ...p, date: e.target.value }))}
                className={inputClass}
              />
              {errors.date && <ErrorText>{errors.date}</ErrorText>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Reason</label>
              <textarea
                rows={3}
                value={swapForm.reason}
                onChange={(e) => setSwapForm((p) => ({ ...p, reason: e.target.value }))}
                placeholder="Explain why the shift needs to be swapped..."
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button type="button" onClick={closeModal} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
                Cancel
              </button>
              <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
                <ArrowRightLeft size={16} /> Submit Request
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    sky: "bg-sky-50 text-sky-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div className={`rounded-xl p-2.5 ${styles[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function DayCount({ label, count, color }) {
  const styles = {
    amber: "bg-amber-50 text-amber-700",
    sky: "bg-sky-50 text-sky-700",
    indigo: "bg-indigo-50 text-indigo-700",
  };

  return (
    <div className={`flex items-center justify-between rounded-lg px-2 py-1 text-[11px] font-semibold ${styles[color]}`}>
      <span>{label}</span>
      <span>{count}</span>
    </div>
  );
}

function ShiftBadge({ type }) {
  const styles = {
    Morning: "bg-amber-50 text-amber-700",
    Evening: "bg-sky-50 text-sky-700",
    Night: "bg-indigo-50 text-indigo-700",
  };
  const Icon = type === "Morning" ? Sunrise : type === "Evening" ? Sun : Moon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles[type]}`}>
      <Icon size={13} />
      {type}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Published: "bg-emerald-50 text-emerald-700",
    Draft: "bg-slate-100 text-slate-600",
    Pending: "bg-amber-50 text-amber-700",
    Approved: "bg-emerald-50 text-emerald-700",
    Rejected: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ActionButton({ children, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg p-2 transition ${
        danger
          ? "text-slate-400 hover:bg-rose-50 hover:text-rose-600"
          : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      {children}
    </button>
  );
}

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm font-medium text-slate-800">{value}</p>
    </div>
  );
}

function ErrorText({ children }) {
  return <p className="mt-1 text-xs text-rose-500">{children}</p>;
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
