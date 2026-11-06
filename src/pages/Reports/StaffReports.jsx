
import { useMemo, useState } from "react";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  Download,
  Printer,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  BriefcaseBusiness,
  Coffee,
  CheckCircle2,
  AlertCircle,
  Building2,
  Timer,
} from "lucide-react";

const staff = [
  { id: "EMP-001", name: "Rahul Sharma", department: "Front Desk", designation: "Front Office Manager", present: 25, absent: 1, leave: 1, late: 2, overtime: 12, shifts: 26, performance: 96, salary: 42000 },
  { id: "EMP-002", name: "Priya Verma", department: "Housekeeping", designation: "Supervisor", present: 24, absent: 0, leave: 3, late: 1, overtime: 8, shifts: 24, performance: 94, salary: 32000 },
  { id: "EMP-003", name: "Amit Kumar", department: "Kitchen", designation: "Head Chef", present: 25, absent: 0, leave: 2, late: 0, overtime: 18, shifts: 25, performance: 98, salary: 48000 },
  { id: "EMP-004", name: "Neha Singh", department: "Finance", designation: "Accountant", present: 23, absent: 1, leave: 3, late: 3, overtime: 5, shifts: 24, performance: 91, salary: 36000 },
  { id: "EMP-005", name: "Vikas Yadav", department: "Security", designation: "Security Officer", present: 26, absent: 0, leave: 1, late: 1, overtime: 22, shifts: 26, performance: 93, salary: 28000 },
  { id: "EMP-006", name: "Anjali Gupta", department: "Front Desk", designation: "Receptionist", present: 24, absent: 1, leave: 2, late: 2, overtime: 6, shifts: 25, performance: 95, salary: 26000 },
  { id: "EMP-007", name: "Suresh Patel", department: "Housekeeping", designation: "Room Attendant", present: 22, absent: 2, leave: 3, late: 4, overtime: 10, shifts: 24, performance: 86, salary: 22000 },
  { id: "EMP-008", name: "Kavita Rao", department: "Kitchen", designation: "Sous Chef", present: 25, absent: 0, leave: 2, late: 1, overtime: 14, shifts: 25, performance: 96, salary: 34000 },
  { id: "EMP-009", name: "Mohit Jain", department: "Maintenance", designation: "Technician", present: 23, absent: 1, leave: 3, late: 2, overtime: 16, shifts: 24, performance: 89, salary: 30000 },
  { id: "EMP-010", name: "Pooja Mehta", department: "Front Desk", designation: "Guest Relations", present: 25, absent: 0, leave: 2, late: 0, overtime: 7, shifts: 25, performance: 97, salary: 29000 },
  { id: "EMP-011", name: "Deepak Singh", department: "Security", designation: "Security Supervisor", present: 24, absent: 1, leave: 2, late: 2, overtime: 20, shifts: 25, performance: 90, salary: 35000 },
  { id: "EMP-012", name: "Ritu Sharma", department: "Finance", designation: "Finance Executive", present: 25, absent: 0, leave: 2, late: 1, overtime: 4, shifts: 25, performance: 95, salary: 30000 },
];

const departments = [
  "Front Desk",
  "Housekeeping",
  "Kitchen",
  "Finance",
  "Security",
  "Maintenance",
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function MetricCard({ title, value, subtitle, icon: Icon, trend, positive }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-2 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          <Icon size={21} />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-600" : "text-rose-600"}`}>
          {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
          {trend}
          <span className="font-normal text-slate-400">vs previous period</span>
        </div>
      )}
    </div>
  );
}

function ProgressBar({ value, color = "bg-indigo-500" }) {
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Present: "bg-emerald-50 text-emerald-700",
    Absent: "bg-rose-50 text-rose-700",
    Leave: "bg-amber-50 text-amber-700",
    "On Track": "bg-emerald-50 text-emerald-700",
    "Needs Attention": "bg-rose-50 text-rose-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

export default function StaffReports() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [performanceFilter, setPerformanceFilter] = useState("All");
  const [period, setPeriod] = useState("month");
  const [reportTab, setReportTab] = useState("attendance");

  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase();

    return staff.filter((person) => {
      const matchesSearch =
        person.name.toLowerCase().includes(query) ||
        person.id.toLowerCase().includes(query) ||
        person.designation.toLowerCase().includes(query);

      const matchesDepartment =
        department === "All" || person.department === department;

      const matchesPerformance =
        performanceFilter === "All" ||
        (performanceFilter === "High" && person.performance >= 95) ||
        (performanceFilter === "Average" && person.performance >= 85 && person.performance < 95) ||
        (performanceFilter === "Low" && person.performance < 85);

      return matchesSearch && matchesDepartment && matchesPerformance;
    });
  }, [search, department, performanceFilter]);

  const stats = useMemo(() => {
    const total = filteredStaff.length;
    const present = filteredStaff.reduce((sum, p) => sum + p.present, 0);
    const absent = filteredStaff.reduce((sum, p) => sum + p.absent, 0);
    const leave = filteredStaff.reduce((sum, p) => sum + p.leave, 0);
    const overtime = filteredStaff.reduce((sum, p) => sum + p.overtime, 0);
    const shifts = filteredStaff.reduce((sum, p) => sum + p.shifts, 0);
    const salary = filteredStaff.reduce((sum, p) => sum + p.salary, 0);
    const performance = total
      ? filteredStaff.reduce((sum, p) => sum + p.performance, 0) / total
      : 0;
    const late = filteredStaff.reduce((sum, p) => sum + p.late, 0);

    return {
      total,
      present,
      absent,
      leave,
      overtime,
      shifts,
      salary,
      performance,
      late,
    };
  }, [filteredStaff]);

  const attendanceRate =
    stats.present + stats.absent + stats.leave > 0
      ? (stats.present / (stats.present + stats.absent + stats.leave)) * 100
      : 0;

  const departmentData = useMemo(() => {
    return departments
      .map((name) => {
        const people = filteredStaff.filter((p) => p.department === name);
        const headcount = people.length;
        const present = people.reduce((sum, p) => sum + p.present, 0);
        const overtime = people.reduce((sum, p) => sum + p.overtime, 0);
        const payroll = people.reduce((sum, p) => sum + p.salary, 0);
        const performance = headcount
          ? people.reduce((sum, p) => sum + p.performance, 0) / headcount
          : 0;

        return {
          name,
          headcount,
          present,
          overtime,
          payroll,
          performance,
        };
      })
      .filter((item) => item.headcount > 0);
  }, [filteredStaff]);

  const maxDepartment = Math.max(...departmentData.map((d) => d.headcount), 1);

  const resetFilters = () => {
    setSearch("");
    setDepartment("All");
    setPerformanceFilter("All");
    setPeriod("month");
  };

  const exportCSV = () => {
    const headers = [
      "Employee ID",
      "Employee Name",
      "Department",
      "Designation",
      "Present Days",
      "Absent Days",
      "Leave Days",
      "Late Marks",
      "Overtime Hours",
      "Assigned Shifts",
      "Performance",
      "Monthly Salary",
    ];

    const rows = filteredStaff.map((p) => [
      p.id,
      p.name,
      p.department,
      p.designation,
      p.present,
      p.absent,
      p.leave,
      p.late,
      p.overtime,
      p.shifts,
      p.performance,
      p.salary,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "staff-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const periodLabel = {
    week: "This week",
    month: "This month",
    quarter: "This quarter",
    year: "This year",
  }[period];

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span>Reports & Analytics</span>
              <span>/</span>
              <span className="font-medium text-indigo-600">Staff Reports</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">
              Staff Reports
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor attendance, leave, performance, shifts and payroll.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Printer size={17} /> Print
            </button>
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Download size={17} /> Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Filter size={18} className="text-indigo-600" />
              Report Filters
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm font-medium text-indigo-600"
            >
              <RefreshCw size={14} /> Reset
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search size={17} className="absolute left-3 top-3 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or ID"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400"
              />
            </div>

            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="week">This week</option>
              <option value="month">This month</option>
              <option value="quarter">This quarter</option>
              <option value="year">This year</option>
            </select>

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All departments</option>
              {departments.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <select
              value={performanceFilter}
              onChange={(e) => setPerformanceFilter(e.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
            >
              <option value="All">All performance levels</option>
              <option value="High">High performers (95%+)</option>
              <option value="Average">Average (85–94%)</option>
              <option value="Low">Needs improvement (below 85%)</option>
            </select>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            Selected period: {periodLabel}. Period selection is a report label in this demo; connect date-filtered attendance and payroll data for live period calculations.
          </p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total Employees"
            value={stats.total}
            subtitle="Employees matching filters"
            icon={Users}
            trend="+4.5%"
            positive
          />
          <MetricCard
            title="Attendance Rate"
            value={`${attendanceRate.toFixed(1)}%`}
            subtitle="Present days ÷ recorded days"
            icon={UserCheck}
            trend="+2.8%"
            positive
          />
          <MetricCard
            title="Absent Days"
            value={stats.absent}
            subtitle="Recorded absences in sample data"
            icon={UserX}
            trend="-1.2%"
            positive
          />
          <MetricCard
            title="Overtime Hours"
            value={`${stats.overtime} hrs`}
            subtitle="Combined overtime hours"
            icon={Clock}
            trend="+5.6%"
            positive={false}
          />
        </div>

        {/* Secondary metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Leave Days</span>
              <Coffee size={19} className="text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.leave}</p>
            <p className="mt-1 text-xs text-slate-400">Recorded leave days</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Late Arrivals</span>
              <Timer size={19} className="text-rose-500" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.late}</p>
            <p className="mt-1 text-xs text-slate-400">Late attendance marks</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Average Performance</span>
              <TrendingUp size={19} className="text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.performance.toFixed(1)}%</p>
            <p className="mt-1 text-xs text-slate-400">Average employee score</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Monthly Payroll</span>
              <Wallet size={19} className="text-indigo-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{money(stats.salary)}</p>
            <p className="mt-1 text-xs text-slate-400">Combined sample base salaries</p>
          </div>
        </div>

        {/* Report tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: "attendance", label: "Attendance", icon: UserCheck },
            { id: "leave", label: "Leave", icon: CalendarDays },
            { id: "shifts", label: "Shift Coverage", icon: Clock },
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "payroll", label: "Payroll", icon: Wallet },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setReportTab(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  reportTab === tab.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Attendance report */}
        {reportTab === "attendance" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Attendance Summary</h2>
              <p className="mt-1 text-sm text-slate-500">
                Present, absent and leave days by employee
              </p>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-sm text-emerald-700">Present days</p>
                <p className="mt-1 text-2xl font-bold text-emerald-800">{stats.present}</p>
              </div>
              <div className="rounded-xl bg-rose-50 p-4">
                <p className="text-sm text-rose-700">Absent days</p>
                <p className="mt-1 text-2xl font-bold text-rose-800">{stats.absent}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-sm text-amber-700">Leave days</p>
                <p className="mt-1 text-2xl font-bold text-amber-800">{stats.leave}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Present</th>
                    <th className="px-4 py-3">Absent</th>
                    <th className="px-4 py-3">Leave</th>
                    <th className="px-4 py-3">Late</th>
                    <th className="px-4 py-3">Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((p) => {
                    const total = p.present + p.absent + p.leave;
                    const rate = total ? (p.present / total) * 100 : 0;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-slate-800">{p.name}</p>
                          <p className="mt-1 text-xs text-slate-400">{p.id}</p>
                        </td>
                        <td className="px-4 py-4 text-slate-600">{p.department}</td>
                        <td className="px-4 py-4 font-semibold text-emerald-700">{p.present}</td>
                        <td className="px-4 py-4 font-semibold text-rose-600">{p.absent}</td>
                        <td className="px-4 py-4 text-amber-700">{p.leave}</td>
                        <td className="px-4 py-4 text-slate-600">{p.late}</td>
                        <td className="w-44 px-4 py-4">
                          <div className="mb-1 text-xs font-semibold text-slate-700">{rate.toFixed(1)}%</div>
                          <ProgressBar value={rate} color="bg-emerald-500" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave report */}
        {reportTab === "leave" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Leave Summary</h2>
            <p className="mt-1 text-sm text-slate-500">Recorded leave days by employee and department</p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredStaff.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{p.department}</p>
                    </div>
                    <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
                      {p.leave} days
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="mb-2 flex justify-between text-xs text-slate-500">
                      <span>Leave share of recorded days</span>
                      <span>{((p.leave / (p.present + p.absent + p.leave)) * 100).toFixed(1)}%</span>
                    </div>
                    <ProgressBar
                      value={(p.leave / (p.present + p.absent + p.leave)) * 100}
                      color="bg-amber-400"
                    />
                  </div>
                </div>
              ))}
              {filteredStaff.length === 0 && <p className="text-sm text-slate-500">No employee records found.</p>}
            </div>
          </div>
        )}

        {/* Shift report */}
        {reportTab === "shifts" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Shift Coverage Report</h2>
            <p className="mt-1 text-sm text-slate-500">Assigned shifts and overtime hours by employee</p>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredStaff.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.department} · {p.designation}</p>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-700">
                      {p.shifts} shifts
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Assigned shifts</p>
                      <p className="mt-1 font-bold text-slate-800">{p.shifts}</p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-500">Overtime</p>
                      <p className="mt-1 font-bold text-slate-800">{p.overtime} hrs</p>
                    </div>
                  </div>
                </div>
              ))}
              {filteredStaff.length === 0 && <p className="text-sm text-slate-500">No employee records found.</p>}
            </div>
          </div>
        )}

        {/* Performance report */}
        {reportTab === "performance" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-bold text-slate-900">Employee Performance Report</h2>
            <p className="mt-1 text-sm text-slate-500">Sample performance scores by employee</p>

            <div className="mt-5 space-y-5">
              {filteredStaff
                .slice()
                .sort((a, b) => b.performance - a.performance)
                .map((p, index) => (
                  <div key={p.id}>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="mr-2 text-xs font-bold text-slate-400">#{index + 1}</span>
                        <span className="font-semibold text-slate-800">{p.name}</span>
                        <span className="ml-2 text-xs text-slate-500">{p.department}</span>
                      </div>
                      <span className={`text-sm font-bold ${p.performance >= 95 ? "text-emerald-600" : p.performance >= 85 ? "text-amber-600" : "text-rose-600"}`}>
                        {p.performance}%
                      </span>
                    </div>
                    <ProgressBar
                      value={p.performance}
                      color={p.performance >= 95 ? "bg-emerald-500" : p.performance >= 85 ? "bg-amber-400" : "bg-rose-500"}
                    />
                  </div>
                ))}
              {filteredStaff.length === 0 && <p className="text-sm text-slate-500">No employee records found.</p>}
            </div>
          </div>
        )}

        {/* Payroll report */}
        {reportTab === "payroll" && (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-bold text-slate-900">Payroll Summary</h2>
              <p className="mt-1 text-sm text-slate-500">
                Base monthly salary by employee and department
              </p>
            </div>

            <div className="mb-5 rounded-xl bg-indigo-50 p-4">
              <p className="text-sm text-indigo-700">Total base monthly payroll</p>
              <p className="mt-1 text-2xl font-bold text-indigo-900">{money(stats.salary)}</p>
              <p className="mt-1 text-xs text-indigo-600">Excludes allowances, deductions, bonuses and overtime payments.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Base Salary</th>
                    <th className="px-4 py-3">Overtime</th>
                    <th className="px-4 py-3">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStaff.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.id}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-600">{p.department}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800">{money(p.salary)}</td>
                      <td className="px-4 py-4 text-slate-600">{p.overtime} hrs</td>
                      <td className="px-4 py-4 text-slate-600">{p.performance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Department summary */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <Building2 size={20} className="text-indigo-600" />
            <div>
              <h2 className="font-bold text-slate-900">Department-wise Summary</h2>
              <p className="mt-1 text-sm text-slate-500">
                Headcount, attendance, overtime and base payroll
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Employees</th>
                  <th className="px-4 py-3">Present Days</th>
                  <th className="px-4 py-3">Overtime</th>
                  <th className="px-4 py-3">Performance</th>
                  <th className="px-4 py-3">Base Payroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departmentData.map((item) => (
                  <tr key={item.name} className="hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-800">{item.name}</td>
                    <td className="px-4 py-4 text-slate-600">{item.headcount}</td>
                    <td className="px-4 py-4 text-slate-600">{item.present}</td>
                    <td className="px-4 py-4 text-slate-600">{item.overtime} hrs</td>
                    <td className="px-4 py-4">
                      <div className="mb-1 text-xs font-semibold text-slate-700">{item.performance.toFixed(1)}%</div>
                      <ProgressBar value={item.performance} color="bg-emerald-500" />
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800">{money(item.payroll)}</td>
                  </tr>
                ))}
                {departmentData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                      No department data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle size={19} />
              <h3 className="font-bold">Attendance Follow-up</h3>
            </div>
            <p className="mt-2 text-sm text-amber-800">
              {filteredStaff.filter((p) => p.late >= 3).length} employee(s) have three or more late marks in this sample.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={19} />
              <h3 className="font-bold">High Performers</h3>
            </div>
            <p className="mt-2 text-sm text-emerald-800">
              {filteredStaff.filter((p) => p.performance >= 95).length} employee(s) have performance scores of 95% or higher.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Demo data:</strong> Employee attendance, leave, shift assignments, performance scores and salaries are illustrative. The period selector currently changes the report label only; it does not recalculate records by date. Connect Staff, Attendance, Leave, Shift Scheduling and Payroll APIs for live reporting.
        </div>
      </div>

      <style>{`
        @media print {
          body { background: white !important; }
          button, input, select { display: none !important; }
          * { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}
