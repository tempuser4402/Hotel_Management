
import { useMemo, useState } from "react";
import {
  CalendarDays, Users, Clock, CheckCircle2, XCircle,
  AlertCircle, Search, Download, Plus, Pencil, Eye,
  X, Save, Filter, ChevronDown, Timer, UserRound,
  CalendarCheck, TrendingUp,
} from "lucide-react";

const employees = [
  { id: "EMP-001", name: "Amit Sharma", department: "Front Desk", designation: "Front Office Executive" },
  { id: "EMP-002", name: "Priya Verma", department: "Housekeeping", designation: "Housekeeping Supervisor" },
  { id: "EMP-003", name: "Rahul Singh", department: "Kitchen", designation: "Chef" },
  { id: "EMP-004", name: "Neha Gupta", department: "Finance", designation: "Accountant" },
  { id: "EMP-005", name: "Vikram Yadav", department: "Security", designation: "Security Officer" },
  { id: "EMP-006", name: "Ankit Kumar", department: "Restaurant", designation: "Restaurant Supervisor" },
  { id: "EMP-007", name: "Rohit Mehta", department: "Maintenance", designation: "Technician" },
  { id: "EMP-008", name: "Kavita Joshi", department: "Human Resources", designation: "HR Executive" },
  { id: "EMP-009", name: "Suresh Patel", department: "Front Desk", designation: "Receptionist" },
  { id: "EMP-010", name: "Pooja Sharma", department: "Housekeeping", designation: "Room Attendant" },
];

const today = new Date().toISOString().slice(0, 10);

const initialAttendance = [
  { id: "ATT-001", employeeId: "EMP-001", date: today, checkIn: "08:55", checkOut: "18:10", status: "Present", overtime: 1.17, remarks: "" },
  { id: "ATT-002", employeeId: "EMP-002", date: today, checkIn: "09:25", checkOut: "18:00", status: "Late", overtime: 0, remarks: "Traffic delay" },
  { id: "ATT-003", employeeId: "EMP-003", date: today, checkIn: "08:45", checkOut: "17:30", status: "Present", overtime: 0.5, remarks: "" },
  { id: "ATT-004", employeeId: "EMP-004", date: today, checkIn: "", checkOut: "", status: "Absent", overtime: 0, remarks: "Not reported" },
  { id: "ATT-005", employeeId: "EMP-005", date: today, checkIn: "06:55", checkOut: "15:10", status: "Present", overtime: 0.17, remarks: "" },
  { id: "ATT-006", employeeId: "EMP-006", date: today, checkIn: "09:00", checkOut: "", status: "Present", overtime: 0, remarks: "" },
  { id: "ATT-007", employeeId: "EMP-007", date: today, checkIn: "09:35", checkOut: "18:00", status: "Late", overtime: 0, remarks: "Late arrival" },
  { id: "ATT-008", employeeId: "EMP-008", date: today, checkIn: "09:00", checkOut: "18:00", status: "Present", overtime: 0, remarks: "" },
  { id: "ATT-009", employeeId: "EMP-009", date: today, checkIn: "", checkOut: "", status: "Absent", overtime: 0, remarks: "" },
  { id: "ATT-010", employeeId: "EMP-010", date: today, checkIn: "08:50", checkOut: "17:45", status: "Present", overtime: 0, remarks: "" },
];

const emptyForm = {
  employeeId: "",
  date: today,
  checkIn: "",
  checkOut: "",
  status: "Present",
  overtime: 0,
  remarks: "",
};

const departments = [...new Set(employees.map((e) => e.department))];

const formatDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function calculateHours(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const [inHour, inMinute] = checkIn.split(":").map(Number);
  const [outHour, outMinute] = checkOut.split(":").map(Number);

  let minutes = outHour * 60 + outMinute - (inHour * 60 + inMinute);
  if (minutes < 0) minutes += 24 * 60;

  return minutes / 60;
}

function hoursLabel(hours) {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export default function Attendance() {
  const [records, setRecords] = useState(initialAttendance);
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const dailyRecords = records.filter((r) => r.date === selectedDate);

  const presentCount = dailyRecords.filter((r) => r.status === "Present").length;
  const lateCount = dailyRecords.filter((r) => r.status === "Late").length;
  const absentCount = dailyRecords.filter((r) => r.status === "Absent").length;
  const totalHours = dailyRecords.reduce(
    (sum, r) => sum + calculateHours(r.checkIn, r.checkOut),
    0
  );

  const filteredRecords = useMemo(() => {
    return dailyRecords.filter((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      if (!employee) return false;

      const matchesSearch = [
        employee.name,
        employee.id,
        employee.department,
        employee.designation,
      ].join(" ").toLowerCase().includes(search.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All" ||
        employee.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [dailyRecords, search, departmentFilter, statusFilter]);

  const monthlySummary = useMemo(() => {
    const monthRecords = records.filter((r) => r.date.slice(0, 7) === selectedDate.slice(0, 7));
    return {
      present: monthRecords.filter((r) => r.status === "Present").length,
      late: monthRecords.filter((r) => r.status === "Late").length,
      absent: monthRecords.filter((r) => r.status === "Absent").length,
    };
  }, [records, selectedDate]);

  const openCreate = () => {
    setSelected(null);
    setForm({ ...emptyForm, date: selectedDate, employeeId: employees[0].id });
    setErrors({});
    setModal("form");
  };

  const openEdit = (record) => {
    setSelected(record);
    setForm({
      employeeId: record.employeeId,
      date: record.date,
      checkIn: record.checkIn,
      checkOut: record.checkOut,
      status: record.status,
      overtime: record.overtime,
      remarks: record.remarks,
    });
    setErrors({});
    setModal("form");
  };

  const openView = (record) => {
    setSelected(record);
    setModal("view");
  };

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const saveAttendance = (event) => {
    event.preventDefault();

    const nextErrors = {};

    if (!form.employeeId) nextErrors.employeeId = "Select an employee.";
    if (!form.date) nextErrors.date = "Select an attendance date.";

    if (form.checkIn && form.checkOut && form.checkIn === form.checkOut) {
      nextErrors.checkOut = "Check-out must differ from check-in.";
    }

    const duplicate = records.some(
      (r) =>
        r.employeeId === form.employeeId &&
        r.date === form.date &&
        r.id !== selected?.id
    );

    if (duplicate) {
      nextErrors.employeeId = "Attendance already exists for this employee on this date.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const updated = {
      ...form,
      overtime: Number(form.overtime || 0),
      id: selected?.id || `ATT-${String(Date.now()).slice(-6)}`,
    };

    setRecords((prev) =>
      selected
        ? prev.map((r) => (r.id === selected.id ? updated : r))
        : [updated, ...prev]
    );

    setSelectedDate(form.date);
    setModal(null);
    setSelected(null);
  };

  const markAttendance = (employeeId, status) => {
    const existing = records.find(
      (r) => r.employeeId === employeeId && r.date === selectedDate
    );

    if (existing) {
      setRecords((prev) =>
        prev.map((r) =>
          r.id === existing.id
            ? { ...r, status, ...(status === "Absent" ? { checkIn: "", checkOut: "", overtime: 0 } : {}) }
            : r
        )
      );
    } else {
      setRecords((prev) => [
        {
          ...emptyForm,
          id: `ATT-${String(Date.now()).slice(-6)}`,
          employeeId,
          date: selectedDate,
          status,
          ...(status === "Absent" ? { checkIn: "", checkOut: "", overtime: 0 } : {}),
        },
        ...prev,
      ]);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Date", "Employee ID", "Employee Name", "Department",
      "Check In", "Check Out", "Working Hours", "Overtime",
      "Status", "Remarks",
    ];

    const rows = filteredRecords.map((record) => {
      const employee = employees.find((e) => e.id === record.employeeId);
      return [
        record.date,
        record.employeeId,
        employee?.name,
        employee?.department,
        record.checkIn,
        record.checkOut,
        hoursLabel(calculateHours(record.checkIn, record.checkOut)),
        record.overtime,
        record.status,
        record.remarks,
      ];
    });

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stayflow-attendance-${selectedDate}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
              <Users size={15} />
              Staff & HR <span>/</span>
              <span className="text-indigo-600">Attendance</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
            <p className="mt-1 text-sm text-slate-500">
              Track daily attendance, working hours, late arrivals and overtime.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Download size={17} /> Export CSV
            </button>
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={18} /> Add Attendance
            </button>
          </div>
        </div>

        {/* Date selector */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">Attendance Date</p>
            <p className="mt-1 text-xs text-slate-500">
              Select a date to view or update employee attendance.
            </p>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Present"
            value={presentCount}
            icon={<CheckCircle2 size={20} />}
            color="emerald"
          />
          <StatCard
            title="Late Arrivals"
            value={lateCount}
            icon={<Clock size={20} />}
            color="amber"
          />
          <StatCard
            title="Absent"
            value={absentCount}
            icon={<XCircle size={20} />}
            color="rose"
          />
          <StatCard
            title="Working Hours"
            value={hoursLabel(totalHours)}
            icon={<Timer size={20} />}
            color="indigo"
          />
        </div>

        {/* Monthly summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-semibold text-slate-900">Monthly Attendance Summary</h2>
              <p className="mt-1 text-xs text-slate-500">
                Records for {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
              </p>
            </div>
            <CalendarCheck size={20} className="text-indigo-500" />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MonthlyBox label="Present Records" value={monthlySummary.present} color="emerald" />
            <MonthlyBox label="Late Records" value={monthlySummary.late} color="amber" />
            <MonthlyBox label="Absent Records" value={monthlySummary.absent} color="rose" />
          </div>
        </div>

        {/* Employee attendance table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Daily Attendance Records</h2>
              <p className="mt-1 text-xs text-slate-500">
                {formatDate(selectedDate)} · {dailyRecords.length} records
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search employee..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none sm:w-52"
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
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Present">Present</option>
                <option value="Late">Late</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3.5 font-semibold">Employee</th>
                  <th className="px-5 py-3.5 font-semibold">Department</th>
                  <th className="px-5 py-3.5 font-semibold">Check In</th>
                  <th className="px-5 py-3.5 font-semibold">Check Out</th>
                  <th className="px-5 py-3.5 font-semibold">Working Hours</th>
                  <th className="px-5 py-3.5 font-semibold">Overtime</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((record) => {
                  const employee = employees.find((e) => e.id === record.employeeId);
                  const hours = calculateHours(record.checkIn, record.checkOut);

                  return (
                    <tr key={record.id} className="hover:bg-slate-50/70">
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

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {employee?.department}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {record.checkIn || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {record.checkOut || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {hours > 0 ? hoursLabel(hours) : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-700">
                        {Number(record.overtime || 0) > 0 ? hoursLabel(Number(record.overtime)) : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton title="View" onClick={() => openView(record)}>
                            <Eye size={16} />
                          </ActionButton>
                          <ActionButton title="Correct attendance" onClick={() => openEdit(record)}>
                            <Pencil size={16} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredRecords.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-14 text-center">
                      <CalendarDays size={35} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-medium text-slate-700">No attendance records found</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Add an attendance record or change your filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-4">
            <h2 className="font-semibold text-slate-900">Quick Attendance</h2>
            <p className="mt-1 text-xs text-slate-500">
              Quickly mark an employee present or absent for {formatDate(selectedDate)}.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {employees.map((employee) => {
              const record = records.find(
                (r) => r.employeeId === employee.id && r.date === selectedDate
              );

              return (
                <div
                  key={employee.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-100 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                      <UserRound size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{employee.name}</p>
                      <p className="text-xs text-slate-400">{employee.department}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => markAttendance(employee.id, "Present")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        record?.status === "Present"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                      }`}
                    >
                      Present
                    </button>
                    <button
                      onClick={() => markAttendance(employee.id, "Absent")}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                        record?.status === "Absent"
                          ? "bg-rose-600 text-white"
                          : "bg-rose-50 text-rose-700 hover:bg-rose-100"
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Correct Attendance" : "Add Attendance"}
          subtitle="Enter employee attendance information."
          onClose={closeModal}
        >
          <form onSubmit={saveAttendance} className="space-y-4">
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
                    {employee.name} — {employee.id}
                  </option>
                ))}
              </select>
              {errors.employeeId && <p className="mt-1 text-xs text-red-500">{errors.employeeId}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Attendance Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => updateField("date", e.target.value)}
                className={inputClass}
              />
              {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Check In</label>
                <input
                  type="time"
                  value={form.checkIn}
                  onChange={(e) => updateField("checkIn", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Check Out</label>
                <input
                  type="time"
                  value={form.checkOut}
                  onChange={(e) => updateField("checkOut", e.target.value)}
                  className={inputClass}
                />
                {errors.checkOut && <p className="mt-1 text-xs text-red-500">{errors.checkOut}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">Attendance Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className={inputClass}
                >
                  <option value="Present">Present</option>
                  <option value="Late">Late</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Overtime (Hours)</label>
                <input
                  type="number"
                  min="0"
                  step="0.25"
                  value={form.overtime}
                  onChange={(e) => updateField("overtime", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Remarks / Correction Reason</label>
              <textarea
                rows={3}
                value={form.remarks}
                onChange={(e) => updateField("remarks", e.target.value)}
                placeholder="Enter remarks or correction reason..."
                className={inputClass + " resize-none"}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                <Save size={16} />
                {selected ? "Save Correction" : "Save Attendance"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <Modal
          title="Attendance Details"
          subtitle="Employee attendance record."
          onClose={closeModal}
        >
          {(() => {
            const employee = employees.find((e) => e.id === selected.employeeId);
            const hours = calculateHours(selected.checkIn, selected.checkOut);

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

                <DetailRow label="Date" value={formatDate(selected.date)} />
                <DetailRow label="Designation" value={employee?.designation || "—"} />
                <DetailRow label="Check In" value={selected.checkIn || "Not recorded"} />
                <DetailRow label="Check Out" value={selected.checkOut || "Not recorded"} />
                <DetailRow label="Working Hours" value={hoursLabel(hours)} />
                <DetailRow label="Overtime" value={hoursLabel(Number(selected.overtime || 0))} />
                <DetailRow label="Remarks" value={selected.remarks || "No remarks"} />

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    onClick={closeModal}
                    className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => openEdit(selected)}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    <Pencil size={15} /> Correct Record
                  </button>
                </div>
              </div>
            );
          })()}
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

function MonthlyBox({ label, value, color }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className={`rounded-xl p-4 ${styles[color]}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Present: "bg-emerald-50 text-emerald-700",
    Late: "bg-amber-50 text-amber-700",
    Absent: "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function ActionButton({ children, title, onClick }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="rounded-lg p-2 text-slate-400 transition hover:bg-indigo-50 hover:text-indigo-600"
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

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";
