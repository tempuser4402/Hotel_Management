import { useMemo, useState } from "react";
import {
  Search,
  Download,
  Filter,
  CalendarDays,
  ShieldCheck,
  UserRound,
  Clock,
  Eye,
  X,
  FileText,
  Activity,
  RefreshCcw,
  ChevronDown,
} from "lucide-react";

const initialLogs = [
  {
    id: "LOG-1001",
    user: "Yash Rajoriya",
    email: "admin@hotelamarpalace.com",
    action: "Price Updated",
    module: "Revenue",
    record: "ROOM-204",
    date: "2026-11-06",
    time: "10:42 AM",
    ip: "192.168.1.10",
    device: "Chrome / Windows",
    status: "Success",
    previous: { roomPrice: 2500 },
    updated: { roomPrice: 2800 },
  },
  {
    id: "LOG-1002",
    user: "Amit Sharma",
    email: "manager@hotelamarpalace.com",
    action: "Booking Cancelled",
    module: "Reservations",
    record: "RES-2026-014",
    date: "2026-11-06",
    time: "10:15 AM",
    ip: "192.168.1.12",
    device: "Chrome / Windows",
    status: "Success",
    previous: { status: "Confirmed" },
    updated: { status: "Cancelled" },
  },
  {
    id: "LOG-1003",
    user: "Neha Verma",
    email: "accounts@hotelamarpalace.com",
    action: "Refund Approved",
    module: "Payments",
    record: "PAY-0092",
    date: "2026-11-05",
    time: "06:30 PM",
    ip: "192.168.1.15",
    device: "Edge / Windows",
    status: "Success",
    previous: { refundStatus: "Pending", amount: 1500 },
    updated: { refundStatus: "Approved", amount: 1500 },
  },
  {
    id: "LOG-1004",
    user: "Yash Rajoriya",
    email: "admin@hotelamarpalace.com",
    action: "Permission Updated",
    module: "Access Control",
    record: "ROLE-004",
    date: "2026-11-05",
    time: "04:20 PM",
    ip: "192.168.1.10",
    device: "Chrome / Windows",
    status: "Success",
    previous: { role: "Accountant", reports: "View only" },
    updated: { role: "Accountant", reports: "View and Edit" },
  },
  {
    id: "LOG-1005",
    user: "Rohit Kumar",
    email: "reception@hotelamarpalace.com",
    action: "Guest Created",
    module: "Guests",
    record: "GST-0034",
    date: "2026-11-05",
    time: "02:12 PM",
    ip: "192.168.1.20",
    device: "Chrome / Android",
    status: "Success",
    previous: null,
    updated: { guestName: "Rahul Mehta", phone: "XXXXXX4210" },
  },
  {
    id: "LOG-1006",
    user: "Amit Sharma",
    email: "manager@hotelamarpalace.com",
    action: "Work Order Created",
    module: "Maintenance",
    record: "WO-0021",
    date: "2026-11-04",
    time: "11:05 AM",
    ip: "192.168.1.12",
    device: "Chrome / Windows",
    status: "Success",
    previous: null,
    updated: { issue: "AC not cooling", priority: "High" },
  },
  {
    id: "LOG-1007",
    user: "Neha Verma",
    email: "accounts@hotelamarpalace.com",
    action: "Invoice Generated",
    module: "Payments",
    record: "INV-2026-118",
    date: "2026-11-04",
    time: "09:48 AM",
    ip: "192.168.1.15",
    device: "Edge / Windows",
    status: "Success",
    previous: null,
    updated: { invoice: "INV-2026-118", amount: 8400 },
  },
  {
    id: "LOG-1008",
    user: "Rohit Kumar",
    email: "reception@hotelamarpalace.com",
    action: "Login Failed",
    module: "Authentication",
    record: "USER-005",
    date: "2026-11-03",
    time: "08:10 AM",
    ip: "192.168.1.20",
    device: "Chrome / Android",
    status: "Failed",
    previous: null,
    updated: { reason: "Invalid credentials" },
  },
];

const modules = [...new Set(initialLogs.map((log) => log.module))];
const users = [...new Set(initialLogs.map((log) => log.user))];

export default function AuditLogs() {
  const [logs, setLogs] = useState(initialLogs);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [userFilter, setUserFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selected, setSelected] = useState(null);

  const filteredLogs = useMemo(
    () =>
      logs.filter((log) => {
        const term = search.toLowerCase();
        const matchesSearch = [
          log.id,
          log.user,
          log.email,
          log.action,
          log.module,
          log.record,
        ].some((value) => value.toLowerCase().includes(term));

        return (
          matchesSearch &&
          (moduleFilter === "All" || log.module === moduleFilter) &&
          (userFilter === "All" || log.user === userFilter) &&
          (statusFilter === "All" || log.status === statusFilter) &&
          (!fromDate || log.date >= fromDate) &&
          (!toDate || log.date <= toDate)
        );
      }),
    [logs, search, moduleFilter, userFilter, statusFilter, fromDate, toDate],
  );

  const exportCSV = () => {
    const headers = [
      "Log ID",
      "User",
      "Email",
      "Action",
      "Module",
      "Record",
      "Date",
      "Time",
      "IP",
      "Device",
      "Status",
    ];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.user,
      l.email,
      l.action,
      l.module,
      l.record,
      l.date,
      l.time,
      l.ip,
      l.device,
      l.status,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "hotel-audit-logs.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSearch("");
    setModuleFilter("All");
    setUserFilter("All");
    setStatusFilter("All");
    setFromDate("");
    setToDate("");
  };

  const successCount = logs.filter((l) => l.status === "Success").length;
  const failedCount = logs.filter((l) => l.status === "Failed").length;
  const todayCount = logs.filter((l) => l.date === "2026-11-06").length;

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <ShieldCheck size={21} />
            <span className="text-sm font-semibold">Access Control</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track user activity and changes across your hotel system.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold"
        >
          <Download size={17} /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Activities",
            value: logs.length,
            icon: Activity,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            label: "Successful Actions",
            value: successCount,
            icon: ShieldCheck,
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            label: "Failed Activities",
            value: failedCount,
            icon: RefreshCcw,
            color: "text-red-600",
            bg: "bg-red-50",
          },
          {
            label: "Today's Activities",
            value: todayCount,
            icon: Clock,
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{item.label}</p>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon size={19} className={item.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-500" />
          <h2 className="font-semibold text-slate-800">Filter Activity</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-3">
          <div className="relative xl:col-span-2">
            <Search
              size={16}
              className="absolute left-3 top-3 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user, action, record..."
              className="form-input pl-9"
            />
          </div>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="form-input"
          >
            <option value="All">All Modules</option>
            {modules.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
          <select
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
            className="form-input"
          >
            <option value="All">All Users</option>
            {users.map((u) => (
              <option key={u}>{u}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-input"
          >
            <option value="All">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Failed">Failed</option>
          </select>
          <button
            onClick={clearFilters}
            className="border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50 px-3 py-2"
          >
            Clear Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
          <label className="text-xs font-medium text-slate-500">
            From date
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="form-input mt-1"
            />
          </label>
          <label className="text-xs font-medium text-slate-500">
            To date
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="form-input mt-1"
            />
          </label>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900">Activity History</h2>
            <p className="text-xs text-slate-500 mt-1">
              {filteredLogs.length} matching record(s)
            </p>
          </div>
          <span className="text-xs text-slate-500">
            Newest activities first
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {[
                  "Log ID",
                  "User",
                  "Action",
                  "Module",
                  "Record Reference",
                  "Date & Time",
                  "Status",
                  "Details",
                ].map((h) => (
                  <th key={h} className="text-left px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-blue-600">
                    {log.id}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{log.user}</p>
                    <p className="text-xs text-slate-400">{log.email}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{log.action}</td>
                  <td className="px-4 py-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs">
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{log.record}</td>
                  <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                    {log.date}
                    <br />
                    <span className="text-xs text-slate-400">{log.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${log.status === "Success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelected(log)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-semibold"
                    >
                      <Eye size={15} /> View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-slate-500">
                    No audit records match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-900">
                  Activity Details
                </h2>
                <p className="text-xs text-slate-500 mt-1">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <X size={19} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  ["User", selected.user],
                  ["Email", selected.email],
                  ["Action", selected.action],
                  ["Module", selected.module],
                  ["Record Reference", selected.record],
                  ["Date & Time", `${selected.date} ${selected.time}`],
                  ["IP Address", selected.ip],
                  ["Device / Browser", selected.device],
                  ["Status", selected.status],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="border border-slate-200 rounded-lg p-3"
                  >
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="text-sm font-medium text-slate-800 mt-1 break-words">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50 text-red-700 px-3 py-2 text-sm font-semibold">
                    Previous Values
                  </div>
                  <pre className="p-3 text-xs text-slate-700 whitespace-pre-wrap break-words">
                    {selected.previous
                      ? JSON.stringify(selected.previous, null, 2)
                      : "No previous value (new record/action)."}
                  </pre>
                </div>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-green-50 text-green-700 px-3 py-2 text-sm font-semibold">
                    Updated Values / Details
                  </div>
                  <pre className="p-3 text-xs text-slate-700 whitespace-pre-wrap break-words">
                    {JSON.stringify(selected.updated, null, 2)}
                  </pre>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                IP and device details are illustrative sample data. In
                production, collect only necessary information under your
                privacy policy and applicable law.
              </p>
            </div>
            <div className="p-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
