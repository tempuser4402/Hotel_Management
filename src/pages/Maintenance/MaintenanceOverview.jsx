
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wrench,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  Search,
  Plus,
  ArrowRight,
  MapPin,
  CalendarDays,
  UserRound,
  Activity,
  Settings,
  Building2,
  Droplets,
  Zap,
  Wind,
} from "lucide-react";

const initialIssues = [
  {
    id: "ISS-1001",
    title: "AC not cooling properly",
    location: "Room 102",
    category: "HVAC",
    severity: "Critical",
    status: "In Progress",
    technician: "Ramesh Kumar",
    reportedBy: "Guest",
    date: "2026-11-05",
  },
  {
    id: "ISS-1002",
    title: "Bathroom tap leakage",
    location: "Room 205",
    category: "Plumbing",
    severity: "High",
    status: "Open",
    technician: "Not Assigned",
    reportedBy: "Housekeeping",
    date: "2026-11-06",
  },
  {
    id: "ISS-1003",
    title: "Corridor light not working",
    location: "Second Floor",
    category: "Electrical",
    severity: "Medium",
    status: "Open",
    technician: "Not Assigned",
    reportedBy: "Security",
    date: "2026-11-06",
  },
  {
    id: "ISS-1004",
    title: "TV remote not working",
    location: "Room 301",
    category: "Electrical",
    severity: "Low",
    status: "Resolved",
    technician: "Amit Singh",
    reportedBy: "Guest",
    date: "2026-11-04",
  },
  {
    id: "ISS-1005",
    title: "Water pump abnormal noise",
    location: "Pump Room",
    category: "Equipment",
    severity: "Critical",
    status: "Open",
    technician: "Not Assigned",
    reportedBy: "Maintenance",
    date: "2026-11-06",
  },
];

const initialOrders = [
  {
    id: "WO-1001",
    title: "Repair Room 102 AC",
    location: "Room 102",
    technician: "Ramesh Kumar",
    priority: "Critical",
    status: "In Progress",
    dueDate: "2026-11-07",
    estimatedCost: 3500,
  },
  {
    id: "WO-1002",
    title: "Repair bathroom tap",
    location: "Room 205",
    technician: "Not Assigned",
    priority: "High",
    status: "Pending",
    dueDate: "2026-11-08",
    estimatedCost: 800,
  },
  {
    id: "WO-1003",
    title: "Replace corridor lighting",
    location: "Second Floor",
    technician: "Amit Singh",
    priority: "Medium",
    status: "Completed",
    dueDate: "2026-11-05",
    estimatedCost: 1200,
  },
  {
    id: "WO-1004",
    title: "Pump inspection and repair",
    location: "Pump Room",
    technician: "Ramesh Kumar",
    priority: "Critical",
    status: "Pending",
    dueDate: "2026-11-07",
    estimatedCost: 5000,
  },
];

const initialPreventive = [
  {
    id: "PM-1001",
    equipment: "Generator",
    location: "Generator Room",
    task: "Routine servicing",
    technician: "Ramesh Kumar",
    nextDate: "2026-11-08",
    status: "Upcoming",
  },
  {
    id: "PM-1002",
    equipment: "Elevator",
    location: "Main Building",
    task: "Safety inspection",
    technician: "Amit Singh",
    nextDate: "2026-11-09",
    status: "Upcoming",
  },
  {
    id: "PM-1003",
    equipment: "Water Pump",
    location: "Pump Room",
    task: "Motor inspection",
    technician: "Ramesh Kumar",
    nextDate: "2026-11-06",
    status: "Due Today",
  },
  {
    id: "PM-1004",
    equipment: "Air Conditioning",
    location: "Room 101-110",
    task: "Filter cleaning",
    technician: "Suresh",
    nextDate: "2026-11-05",
    status: "Overdue",
  },
];

const currency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function MaintenanceOverview() {
  const navigate = useNavigate();

  const [issues] = useState(initialIssues);
  const [orders] = useState(initialOrders);
  const [preventive] = useState(initialPreventive);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const openIssues = issues.filter(
      (item) => item.status === "Open"
    ).length;

    const pendingOrders = orders.filter(
      (item) => item.status === "Pending"
    ).length;

    const inProgress = orders.filter(
      (item) => item.status === "In Progress"
    ).length;

    const completed = orders.filter(
      (item) => item.status === "Completed"
    ).length;

    const criticalIssues = issues.filter(
      (item) =>
        item.severity === "Critical" &&
        item.status !== "Resolved"
    ).length;

    const maintenanceCost = orders
      .filter((item) => item.status === "Completed")
      .reduce((sum, item) => sum + item.estimatedCost, 0);

    return {
      openIssues,
      pendingOrders,
      inProgress,
      completed,
      criticalIssues,
      maintenanceCost,
    };
  }, [issues, orders]);

  const filteredIssues = issues.filter((item) => {
    const query = search.toLowerCase();

    return (
      item.id.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">
            Maintenance / Overview
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Maintenance Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor hotel repairs, equipment maintenance and work orders.
          </p>
        </div>

        <button
          onClick={() => navigate("/maintenance/orders")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Create Work Order
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Open Issues"
          value={stats.openIssues}
          icon={<AlertTriangle size={20} />}
          color="orange"
          description="Issues awaiting resolution"
        />

        <StatCard
          title="Pending Work Orders"
          value={stats.pendingOrders}
          icon={<ClipboardList size={20} />}
          color="blue"
          description="Work not yet started"
        />

        <StatCard
          title="In-Progress Repairs"
          value={stats.inProgress}
          icon={<Wrench size={20} />}
          color="purple"
          description="Currently being repaired"
        />

        <StatCard
          title="Completed Repairs"
          value={stats.completed}
          icon={<CheckCircle2 size={20} />}
          color="green"
          description="Completed work orders"
        />

        <StatCard
          title="Critical Issues"
          value={stats.criticalIssues}
          icon={<AlertTriangle size={20} />}
          color="red"
          description="Require urgent attention"
        />

        <StatCard
          title="Maintenance Cost"
          value={currency(stats.maintenanceCost)}
          icon={<IndianRupee size={20} />}
          color="slate"
          description="Completed work order estimates"
        />
      </div>

      {/* Quick Navigation */}
      <section>
        <div className="mb-3">
          <h2 className="font-semibold text-slate-900">
            Maintenance Modules
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Access maintenance operations.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ModuleCard
            icon={<ClipboardList size={21} />}
            title="Work Orders"
            description="Create, assign and track repair work orders."
            count={`${stats.pendingOrders} pending`}
            onClick={() => navigate("/maintenance/orders")}
          />

          <ModuleCard
            icon={<AlertTriangle size={21} />}
            title="Issues & Repairs"
            description="Manage staff-reported and guest-reported issues."
            count={`${stats.openIssues} open issues`}
            onClick={() => navigate("/maintenance/issues")}
          />

          <ModuleCard
            icon={<CalendarDays size={21} />}
            title="Preventive Maintenance"
            description="Manage equipment schedules and recurring servicing."
            count={`${preventive.length} scheduled tasks`}
            onClick={() => navigate("/maintenance/preventive")}
          />
        </div>
      </section>

      {/* Critical Issues */}
      <section className="overflow-hidden rounded-xl border border-red-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-red-100 p-4">
          <div>
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-600" />
              <h2 className="font-semibold text-slate-900">
                Critical Issues
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Urgent maintenance problems requiring attention.
            </p>
          </div>

          <button
            onClick={() => navigate("/maintenance/issues")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {issues
            .filter(
              (item) =>
                item.severity === "Critical" &&
                item.status !== "Resolved"
            )
            .map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-red-50 p-2 text-red-600">
                    <AlertTriangle size={18} />
                  </div>

                  <div>
                    <p className="font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.id} · {item.location} · {item.category}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Reported: {formatDate(item.date)} · {item.reportedBy}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                    Critical
                  </span>
                </div>
              </div>
            ))}

          {stats.criticalIssues === 0 && (
            <EmptyState text="No critical issues currently." />
          )}
        </div>
      </section>

      {/* Work Orders */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Work Orders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Track assigned repair and maintenance jobs.
            </p>
          </div>

          <button
            onClick={() => navigate("/maintenance/orders")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All Work Orders
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Work Order</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Due Date</th>
                <th className="px-4 py-3">Estimated Cost</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {order.title}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      {order.id}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {order.location}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {order.technician}
                  </td>

                  <td className="px-4 py-3">
                    <PriorityBadge priority={order.priority} />
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {formatDate(order.dueDate)}
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800">
                    {currency(order.estimatedCost)}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Preventive Maintenance */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 p-4">
          <div>
            <h2 className="font-semibold text-slate-900">
              Preventive Maintenance Schedule
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Upcoming and overdue equipment servicing.
            </p>
          </div>

          <button
            onClick={() => navigate("/maintenance/preventive")}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View Schedule
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-2">
          {preventive.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 rounded-lg border border-slate-200 p-3"
            >
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <Settings size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-slate-800">
                    {item.equipment}
                  </p>
                  <PreventiveBadge status={item.status} />
                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {item.task} · {item.location}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <UserRound size={13} />
                    {item.technician}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={13} />
                    {formatDate(item.nextDate)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Issues */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">
              Recent Issues & Repairs
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Recently reported maintenance problems.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search issues..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-60"
              />
            </div>

            <button
              onClick={() => navigate("/maintenance/issues")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Manage Issues
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Issue</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Reported By</th>
                <th className="px-4 py-3">Technician</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredIssues.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">{item.id}</p>
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {item.location}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {item.category}
                  </td>

                  <td className="px-4 py-3">
                    <PriorityBadge priority={item.severity} />
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {item.reportedBy}
                  </td>

                  <td className="px-4 py-3 text-slate-600">
                    {item.technician}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))}

              {filteredIssues.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                    No matching issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Quick reminder */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
        <Activity size={20} className="mt-0.5 text-blue-600" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Maintenance reminder
          </p>
          <p className="mt-1 text-sm text-blue-800">
            Review critical issues first, assign pending work orders and
            complete scheduled equipment servicing on time.
          </p>
        </div>
      </div>
    </div>
  );
}

/* Reusable components */

function StatCard({ title, value, icon, color, description }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
    purple: "bg-purple-50 text-purple-600",
    red: "bg-red-50 text-red-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

function ModuleCard({ icon, title, description, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:shadow-sm"
    >
      <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <ArrowRight
            size={17}
            className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
          />
        </div>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
        <p className="mt-3 text-xs font-medium text-blue-600">{count}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Open: "bg-orange-50 text-orange-700",
    Pending: "bg-orange-50 text-orange-700",
    "In Progress": "bg-blue-50 text-blue-700",
    Completed: "bg-green-50 text-green-700",
    Resolved: "bg-green-50 text-green-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    Critical: "bg-red-50 text-red-700",
    High: "bg-orange-50 text-orange-700",
    Medium: "bg-yellow-50 text-yellow-700",
    Low: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[priority] || "bg-slate-100 text-slate-600"}`}>
      {priority}
    </span>
  );
}

function PreventiveBadge({ status }) {
  const styles = {
    Upcoming: "bg-blue-50 text-blue-700",
    "Due Today": "bg-orange-50 text-orange-700",
    Overdue: "bg-red-50 text-red-700",
  };

  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function EmptyState({ text }) {
  return (
    <div className="p-8 text-center text-sm text-slate-500">
      {text}
    </div>
  );
}
