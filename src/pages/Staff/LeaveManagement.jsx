
import { useMemo, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Eye,
  Pencil,
  Trash2,
  Download,
  Clock,
  Users,
  CalendarCheck,
  CalendarX,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const initialEmployees = [
  { id: "EMP-001", name: "Rahul Sharma", department: "Front Desk", balance: 18 },
  { id: "EMP-002", name: "Priya Verma", department: "Housekeeping", balance: 14 },
  { id: "EMP-003", name: "Amit Kumar", department: "Kitchen", balance: 20 },
  { id: "EMP-004", name: "Neha Singh", department: "Finance", balance: 16 },
  { id: "EMP-005", name: "Vikas Yadav", department: "Security", balance: 12 },
  { id: "EMP-006", name: "Anjali Gupta", department: "Front Desk", balance: 15 },
  { id: "EMP-007", name: "Rohit Meena", department: "Housekeeping", balance: 10 },
  { id: "EMP-008", name: "Sneha Patel", department: "Kitchen", balance: 22 },
];

const today = new Date().toISOString().slice(0, 10);

const initialLeaves = [
  {
    id: "LV-1001",
    employeeId: "EMP-001",
    employee: "Rahul Sharma",
    department: "Front Desk",
    type: "Casual Leave",
    startDate: "2026-11-09",
    endDate: "2026-11-10",
    days: 2,
    reason: "Family function",
    status: "Pending",
    appliedOn: "2026-11-04",
    remarks: "",
  },
  {
    id: "LV-1002",
    employeeId: "EMP-002",
    employee: "Priya Verma",
    department: "Housekeeping",
    type: "Sick Leave",
    startDate: "2026-11-05",
    endDate: "2026-11-06",
    days: 2,
    reason: "Not feeling well",
    status: "Approved",
    appliedOn: "2026-11-03",
    remarks: "Approved by HR",
  },
  {
    id: "LV-1003",
    employeeId: "EMP-003",
    employee: "Amit Kumar",
    department: "Kitchen",
    type: "Earned Leave",
    startDate: "2026-11-16",
    endDate: "2026-11-19",
    days: 4,
    reason: "Personal travel",
    status: "Pending",
    appliedOn: "2026-11-05",
    remarks: "",
  },
  {
    id: "LV-1004",
    employeeId: "EMP-004",
    employee: "Neha Singh",
    department: "Finance",
    type: "Casual Leave",
    startDate: "2026-10-20",
    endDate: "2026-10-21",
    days: 2,
    reason: "Personal work",
    status: "Rejected",
    appliedOn: "2026-10-15",
    remarks: "Month-end closing workload",
  },
  {
    id: "LV-1005",
    employeeId: "EMP-006",
    employee: "Anjali Gupta",
    department: "Front Desk",
    type: "Earned Leave",
    startDate: "2026-11-24",
    endDate: "2026-11-26",
    days: 3,
    reason: "Family vacation",
    status: "Approved",
    appliedOn: "2026-11-02",
    remarks: "Approved",
  },
];

const departments = [
  "Front Desk",
  "Housekeeping",
  "Kitchen",
  "Finance",
  "Security",
];

const leaveTypes = [
  "Casual Leave",
  "Sick Leave",
  "Earned Leave",
  "Unpaid Leave",
  "Maternity Leave",
  "Paternity Leave",
];

const currency = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getDays = (start, end) => {
  if (!start || !end) return 0;
  const a = new Date(`${start}T00:00:00`);
  const b = new Date(`${end}T00:00:00`);
  return Math.max(0, Math.round((b - a) / 86400000) + 1);
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

const emptyForm = {
  employeeId: "",
  type: "Casual Leave",
  startDate: "",
  endDate: "",
  reason: "",
};

export default function LeaveManagement() {
  const [employees] = useState(initialEmployees);
  const [leaves, setLeaves] = useState(initialLeaves);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("applications");
  const [modal, setModal] = useState(null);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [remarks, setRemarks] = useState("");
  const [calendarDate, setCalendarDate] = useState(
    new Date("2026-11-01T00:00:00")
  );
  const [error, setError] = useState("");

  const selectedEmployee = employees.find(
    (employee) => employee.id === form.employeeId
  );

  const formDays = getDays(form.startDate, form.endDate);

  const stats = useMemo(() => {
    const pending = leaves.filter((item) => item.status === "Pending");
    const approved = leaves.filter((item) => item.status === "Approved");
    const rejected = leaves.filter((item) => item.status === "Rejected");

    const onLeaveToday = approved.filter(
      (item) => item.startDate <= today && item.endDate >= today
    );

    return {
      total: leaves.length,
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      onLeave: onLeaveToday.length,
      requestedDays: pending.reduce((sum, item) => sum + item.days, 0),
    };
  }, [leaves]);

  const filteredLeaves = useMemo(() => {
    return leaves.filter((item) => {
      const searchMatch =
        item.employee.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.employeeId.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || item.status === statusFilter;

      const departmentMatch =
        departmentFilter === "All" ||
        item.department === departmentFilter;

      const typeMatch = typeFilter === "All" || item.type === typeFilter;

      return searchMatch && statusMatch && departmentMatch && typeMatch;
    });
  }, [leaves, search, statusFilter, departmentFilter, typeFilter]);

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const openCreate = () => {
    setSelectedLeave(null);
    setForm(emptyForm);
    setError("");
    setModal("form");
  };

  const openEdit = (leave) => {
    if (leave.status !== "Pending") {
      alert("Only pending leave applications can be edited.");
      return;
    }

    setSelectedLeave(leave);
    setForm({
      employeeId: leave.employeeId,
      type: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
    });
    setError("");
    setModal("form");
  };

  const openView = (leave) => {
    setSelectedLeave(leave);
    setModal("view");
  };

  const saveLeave = (event) => {
    event.preventDefault();

    if (!form.employeeId || !form.startDate || !form.endDate || !form.reason.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    if (form.endDate < form.startDate) {
      setError("End date cannot be before start date.");
      return;
    }

    const employee = employees.find(
      (item) => item.id === form.employeeId
    );

    if (!employee) {
      setError("Please select a valid employee.");
      return;
    }

    const days = getDays(form.startDate, form.endDate);

    const overlapping = leaves.some((item) => {
      if (
        item.employeeId !== form.employeeId ||
        item.status === "Rejected" ||
        item.status === "Cancelled" ||
        item.id === selectedLeave?.id
      ) {
        return false;
      }

      return (
        form.startDate <= item.endDate &&
        form.endDate >= item.startDate
      );
    });

    if (overlapping) {
      setError("This employee already has an overlapping leave application.");
      return;
    }

    const leaveData = {
      employeeId: employee.id,
      employee: employee.name,
      department: employee.department,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason.trim(),
    };

    if (selectedLeave) {
      setLeaves((current) =>
        current.map((item) =>
          item.id === selectedLeave.id
            ? { ...item, ...leaveData }
            : item
        )
      );
    } else {
      setLeaves((current) => [
        {
          ...leaveData,
          id: `LV-${Date.now().toString().slice(-6)}`,
          status: "Pending",
          appliedOn: today,
          remarks: "",
        },
        ...current,
      ]);
    }

    setModal(null);
    setSelectedLeave(null);
    setForm(emptyForm);
  };

  const updateStatus = (leave, status) => {
    if (leave.status !== "Pending") return;

    setLeaves((current) =>
      current.map((item) =>
        item.id === leave.id
          ? {
              ...item,
              status,
              remarks: remarks.trim() || (status === "Approved" ? "Approved" : "Rejected"),
            }
          : item
      )
    );

    setModal(null);
    setRemarks("");
  };

  const cancelLeave = (leave) => {
    if (leave.status !== "Pending") {
      alert("Only pending applications can be cancelled.");
      return;
    }

    if (!window.confirm(`Cancel leave application ${leave.id}?`)) return;

    setLeaves((current) =>
      current.map((item) =>
        item.id === leave.id
          ? { ...item, status: "Cancelled" }
          : item
      )
    );
  };

  const deleteLeave = (leave) => {
    if (!window.confirm(`Delete leave application ${leave.id}?`)) return;

    setLeaves((current) =>
      current.filter((item) => item.id !== leave.id)
    );
  };

  const exportCSV = () => {
    const headers = [
      "Leave ID",
      "Employee ID",
      "Employee",
      "Department",
      "Leave Type",
      "Start Date",
      "End Date",
      "Days",
      "Reason",
      "Status",
      "Applied On",
      "Remarks",
    ];

    const rows = filteredLeaves.map((item) => [
      item.id,
      item.employeeId,
      item.employee,
      item.department,
      item.type,
      item.startDate,
      item.endDate,
      item.days,
      item.reason,
      item.status,
      item.appliedOn,
      item.remarks,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "stayflow-leave-applications.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const monthYear = calendarDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0
  ).getDate();

  const calendarOffset = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1
  ).getDay();

  const calendarLeaves = leaves.filter(
    (item) =>
      item.status === "Approved" &&
      new Date(`${item.startDate}T00:00:00`).getMonth() ===
        calendarDate.getMonth() &&
      new Date(`${item.startDate}T00:00:00`).getFullYear() ===
        calendarDate.getFullYear()
  );

  const getLeavesForDay = (day) => {
    const date = `${calendarDate.getFullYear()}-${String(
      calendarDate.getMonth() + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    return calendarLeaves.filter(
      (item) => item.startDate <= date && item.endDate >= date
    );
  };

  const openDecision = (leave) => {
    setSelectedLeave(leave);
    setRemarks("");
    setModal("decision");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Leave Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage employee leave applications, balances and approvals.
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={18} />
            Apply Leave
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              label: "Total Applications",
              value: stats.total,
              icon: CalendarDays,
              color: "text-indigo-600 bg-indigo-50",
            },
            {
              label: "Pending Approval",
              value: stats.pending,
              icon: Clock,
              color: "text-amber-600 bg-amber-50",
            },
            {
              label: "Approved Leaves",
              value: stats.approved,
              icon: CalendarCheck,
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              label: "Rejected Leaves",
              value: stats.rejected,
              icon: CalendarX,
              color: "text-rose-600 bg-rose-50",
            },
            {
              label: "On Leave Today",
              value: stats.onLeave,
              icon: Users,
              color: "text-sky-600 bg-sky-50",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{card.label}</span>
                  <span className={`rounded-lg p-2 ${card.color}`}>
                    <Icon size={19} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-slate-800">
                  {card.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200">
          {[
            ["applications", "Leave Applications"],
            ["balances", "Leave Balances"],
            ["calendar", "Department Calendar"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={`border-b-2 px-4 py-3 text-sm font-medium ${
                activeTab === value
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === "applications" && (
          <>
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:flex-row">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search employee, ID..."
                  className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
              >
                {["All", "Pending", "Approved", "Rejected", "Cancelled"].map(
                  (value) => (
                    <option key={value}>{value}</option>
                  )
                )}
              </select>

              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
              >
                <option value="All">All Departments</option>
                {departments.map((department) => (
                  <option key={department}>{department}</option>
                ))}
              </select>

              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none"
              >
                <option value="All">All Leave Types</option>
                {leaveTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>

              <button
                onClick={exportCSV}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Download size={17} />
                Export
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <div>
                  <h2 className="font-semibold text-slate-800">
                    Leave Applications
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {filteredLeaves.length} applications found
                  </p>
                </div>
                <span className="text-xs text-slate-400">
                  {stats.requestedDays} pending leave days
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Application</th>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Leave Type</th>
                      <th className="px-4 py-3">Leave Period</th>
                      <th className="px-4 py-3">Days</th>
                      <th className="px-4 py-3">Applied On</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4 font-semibold text-indigo-600">
                          {leave.id}
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-800">
                            {leave.employee}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {leave.employeeId} · {leave.department}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {leave.type}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(leave.startDate)}
                          <span className="mx-1 text-slate-400">to</span>
                          {formatDate(leave.endDate)}
                        </td>
                        <td className="px-4 py-4 font-semibold text-slate-700">
                          {leave.days}
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {formatDate(leave.appliedOn)}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                              statusStyles[leave.status]
                            }`}
                          >
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => openView(leave)}
                              title="View"
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
                            >
                              <Eye size={16} />
                            </button>

                            {leave.status === "Pending" && (
                              <>
                                <button
                                  onClick={() => openEdit(leave)}
                                  title="Edit"
                                  className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                                >
                                  <Pencil size={16} />
                                </button>
                                <button
                                  onClick={() => openDecision(leave)}
                                  title="Review application"
                                  className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                                >
                                  <Check size={17} />
                                </button>
                                <button
                                  onClick={() => cancelLeave(leave)}
                                  title="Cancel"
                                  className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                >
                                  <X size={17} />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => deleteLeave(leave)}
                              title="Delete"
                              className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredLeaves.length === 0 && (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-12 text-center text-slate-500"
                        >
                          No leave applications found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "balances" && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
              <h2 className="font-semibold text-slate-800">
                Employee Leave Balances
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Available leave balance for each employee.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Annual Allowance</th>
                    <th className="px-4 py-3">Approved Days</th>
                    <th className="px-4 py-3">Available Balance</th>
                    <th className="px-4 py-3">Usage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {employees.map((employee) => {
                    const used = leaves
                      .filter(
                        (item) =>
                          item.employeeId === employee.id &&
                          item.status === "Approved" &&
                          item.type !== "Unpaid Leave"
                      )
                      .reduce((sum, item) => sum + item.days, 0);

                    const balance = Math.max(0, employee.balance - used);
                    const percentage = Math.min(
                      100,
                      Math.round((used / employee.balance) * 100)
                    );

                    return (
                      <tr key={employee.id}>
                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-800">
                            {employee.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {employee.id}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">
                          {employee.department}
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {employee.balance} days
                        </td>
                        <td className="px-4 py-4 text-slate-700">
                          {used} days
                        </td>
                        <td className="px-4 py-4 font-semibold text-emerald-700">
                          {balance} days
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full rounded-full bg-indigo-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">
                              {percentage}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "calendar" && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-800">
                  Department Leave Calendar
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Approved employee leaves by date.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() - 1,
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="min-w-32 text-center font-semibold text-slate-800">
                  {monthYear}
                </span>
                <button
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1,
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day) => (
                  <div
                    key={day}
                    className="py-3 text-center text-xs font-semibold uppercase text-slate-500"
                  >
                    {day}
                  </div>
                )
              )}

              {Array.from({ length: calendarOffset }).map((_, index) => (
                <div key={`empty-${index}`} className="min-h-24 bg-slate-50/50" />
              ))}

              {Array.from({ length: calendarDays }).map((_, index) => {
                const day = index + 1;
                const dayLeaves = getLeavesForDay(day);

                return (
                  <div
                    key={day}
                    className="min-h-24 rounded-lg border border-slate-100 p-2"
                  >
                    <span className="text-sm font-semibold text-slate-700">
                      {day}
                    </span>
                    <div className="mt-2 space-y-1">
                      {dayLeaves.slice(0, 2).map((leave) => (
                        <button
                          key={leave.id}
                          onClick={() => openView(leave)}
                          title={`${leave.employee} - ${leave.department}`}
                          className="block w-full truncate rounded bg-indigo-50 px-1.5 py-1 text-left text-[10px] font-medium text-indigo-700"
                        >
                          {leave.employee}
                        </button>
                      ))}
                      {dayLeaves.length > 2 && (
                        <p className="text-[10px] text-slate-500">
                          +{dayLeaves.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded bg-indigo-200" />
                Approved leave
              </span>
              <span>
                Showing {calendarLeaves.length} approved applications this month
              </span>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setModal(null);
          }}
        >
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-800">
                  {modal === "form"
                    ? selectedLeave
                      ? "Edit Leave Application"
                      : "New Leave Application"
                    : modal === "view"
                    ? "Leave Application Details"
                    : "Review Leave Application"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selectedLeave?.id || "Create a new employee leave request"}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {modal === "form" && (
              <form onSubmit={saveLeave} className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Employee *
                  </label>
                  <select
                    required
                    value={form.employeeId}
                    onChange={(event) =>
                      updateForm("employeeId", event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  >
                    <option value="">Select employee</option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} — {employee.id}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedEmployee && (
                  <div className="rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
                    Department: <strong>{selectedEmployee.department}</strong>
                    <span className="ml-4">
                      Annual leave allowance:{" "}
                      <strong>{selectedEmployee.balance} days</strong>
                    </span>
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Leave Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(event) => updateForm("type", event.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  >
                    {leaveTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Start Date *
                    </label>
                    <input
                      required
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        updateForm("startDate", event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      End Date *
                    </label>
                    <input
                      required
                      type="date"
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(event) =>
                        updateForm("endDate", event.target.value)
                      }
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm text-slate-600">
                    Requested leave duration
                  </p>
                  <p className="mt-1 text-xl font-bold text-indigo-700">
                    {formDays} {formDays === 1 ? "day" : "days"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Calendar days are counted, including weekends.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Reason for Leave *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.reason}
                    onChange={(event) =>
                      updateForm("reason", event.target.value)
                    }
                    placeholder="Enter the reason for leave..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                    <AlertCircle size={17} className="mt-0.5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    {selectedLeave ? "Save Changes" : "Submit Application"}
                  </button>
                </div>
              </form>
            )}

            {modal === "view" && selectedLeave && (
              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500">Application ID</p>
                    <p className="mt-1 font-semibold text-indigo-600">
                      {selectedLeave.id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      statusStyles[selectedLeave.status]
                    }`}
                  >
                    {selectedLeave.status}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    ["Employee", selectedLeave.employee],
                    ["Employee ID", selectedLeave.employeeId],
                    ["Department", selectedLeave.department],
                    ["Leave Type", selectedLeave.type],
                    ["Start Date", formatDate(selectedLeave.startDate)],
                    ["End Date", formatDate(selectedLeave.endDate)],
                    ["Duration", `${selectedLeave.days} days`],
                    ["Applied On", formatDate(selectedLeave.appliedOn)],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">{label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-700">
                    Reason for Leave
                  </p>
                  <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    {selectedLeave.reason}
                  </p>
                </div>

                {selectedLeave.remarks && (
                  <div>
                    <p className="text-sm font-medium text-slate-700">
                      Approval Remarks
                    </p>
                    <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                      {selectedLeave.remarks}
                    </p>
                  </div>
                )}

                {selectedLeave.status === "Pending" && (
                  <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                    <button
                      onClick={() => {
                        setModal(null);
                        openEdit(selectedLeave);
                      }}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => openDecision(selectedLeave)}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Review Application
                    </button>
                  </div>
                )}
              </div>
            )}

            {modal === "decision" && selectedLeave && (
              <div className="space-y-5 p-5">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="font-semibold text-slate-800">
                    {selectedLeave.employee}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedLeave.department} · {selectedLeave.type}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatDate(selectedLeave.startDate)} to{" "}
                    {formatDate(selectedLeave.endDate)} ·{" "}
                    <strong>{selectedLeave.days} days</strong>
                  </p>
                  <p className="mt-3 text-sm text-slate-600">
                    {selectedLeave.reason}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Review Remarks
                  </label>
                  <textarea
                    rows={3}
                    value={remarks}
                    onChange={(event) => setRemarks(event.target.value)}
                    placeholder="Optional approval or rejection remarks..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
                  <button
                    onClick={() => setModal(null)}
                    className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => updateStatus(selectedLeave, "Rejected")}
                    className="flex items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    <X size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => updateStatus(selectedLeave, "Approved")}
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Check size={16} />
                    Approve Leave
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
