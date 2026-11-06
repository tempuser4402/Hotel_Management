import { useMemo, useState } from "react";
import {
  BedDouble,
  DoorOpen,
  Hotel,
  LogIn,
  LogOut,
  CalendarCheck,
  IndianRupee,
  Wallet,
  Plus,
  RefreshCw,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Bell,
  Clock,
  Users,
  Eye,
  CheckCircle2,
  AlertCircle,
  Wrench,
  CreditCard,
  UserPlus,
  Search,
  ChevronRight,
  Download,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import {
  dashboardStats,
  revenueData,
  occupancyData,
  reservationData,
  roomTypeData,
  bookingSourceData,
  reservations,
  arrivals,
  transactions,
  notifications,
  rooms,
} from "./dashboardData";

const iconMap = {
  BedDouble,
  DoorOpen,
  Hotel,
  LogIn,
  LogOut,
  CalendarCheck,
  IndianRupee,
  Wallet,
};

const colors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  cyan: "bg-cyan-50 text-cyan-600",
  orange: "bg-orange-50 text-orange-600",
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  red: "bg-red-50 text-red-600",
};

const chartColors = ["#2563EB", "#16A34A", "#F59E0B", "#8B5CF6", "#EF4444"];

const statusStyles = {
  Confirmed: "bg-blue-50 text-blue-700",
  "Checked In": "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  "Checked Out": "bg-gray-100 text-gray-700",
  Cancelled: "bg-red-50 text-red-700",
  Expected: "bg-blue-50 text-blue-700",
  Arrived: "bg-green-50 text-green-700",
  Success: "bg-green-50 text-green-700",
};

function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-4">
      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
        statusStyles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}

const getDateRange = (range) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const start = new Date(today);
  start.setHours(0, 0, 0, 0);

  switch (range) {
    case "yesterday":
      start.setDate(start.getDate() - 1);
      today.setDate(today.getDate() - 1);
      break;

    case "7days":
      start.setDate(start.getDate() - 6);
      break;

    case "30days":
      start.setDate(start.getDate() - 29);
      break;

    case "month":
      start.setDate(1);
      break;

    case "today":
    default:
      break;
  }

  return { start, end: today };
};

const parseLocalDate = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const isDateInRange = (dateString, range) => {
  const date = parseLocalDate(dateString);

  if (!date) return false;

  return date >= range.start && date <= range.end;
};

const calculateDashboardStats = (dateRange) => {
  // 1. Filter reservations by check-in date
  const periodReservations = reservations.filter((item) =>
    isDateInRange(item.checkInDate, dateRange),
  );

  // 2. Calculate check-ins
  const checkIns = reservations.filter((item) =>
    isDateInRange(item.checkInDate, dateRange),
  );

  // 3. Calculate check-outs
  const checkOuts = reservations.filter((item) =>
    isDateInRange(item.checkOutDate, dateRange),
  );

  // 4. Calculate successful payments
  const successfulTransactions = transactions.filter(
    (item) =>
      item.status === "Success" &&
      isDateInRange(item.transactionDate, dateRange),
  );

  const totalRevenue = successfulTransactions.reduce(
    (total, item) => total + Number(item.amountValue || 0),
    0,
  );

  // 5. Calculate pending payments
  const pendingPayments = periodReservations.reduce((total, item) => {
    if (item.status === "Cancelled") return total;

    const balance = Math.max(
      0,
      Number(item.totalAmount || 0) - Number(item.paidAmount || 0),
    );

    return total + balance;
  }, 0);

  const pendingInvoices = periodReservations.filter(
    (item) =>
      item.status !== "Cancelled" &&
      Number(item.totalAmount || 0) > Number(item.paidAmount || 0),
  ).length;

  // 6. Calculate room inventory
  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.status === "Available",
  ).length;

  const occupiedRooms = rooms.filter(
    (room) => room.status === "Occupied",
  ).length;

  const maintenanceRooms = rooms.filter(
    (room) => room.status === "Maintenance",
  ).length;

  // Exclude maintenance rooms from occupancy denominator
  const sellableRooms = totalRooms - maintenanceRooms;

  const occupancyRate =
    sellableRooms > 0
      ? ((occupiedRooms / sellableRooms) * 100).toFixed(1)
      : "0.0";

  // Currency formatting
  const formatCurrency = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  // 7. Return all eight KPI cards
  return [
    {
      title: "Total Rooms",
      value: totalRooms,
      subtitle: "Registered hotel rooms",
      icon: "BedDouble",
      color: "blue",
    },
    {
      title: "Available Rooms",
      value: availableRooms,
      subtitle: "Ready for booking",
      icon: "DoorOpen",
      color: "green",
    },
    {
      title: "Occupied Rooms",
      value: occupiedRooms,
      subtitle: `${occupancyRate}% occupancy rate`,
      icon: "Hotel",
      color: "purple",
    },
    {
      title: "Check-ins",
      value: checkIns.length,
      subtitle: "During selected period",
      icon: "LogIn",
      color: "cyan",
    },
    {
      title: "Check-outs",
      value: checkOuts.length,
      subtitle: "During selected period",
      icon: "LogOut",
      color: "orange",
    },
    {
      title: "Total Reservations",
      value: periodReservations.filter((item) => item.status !== "Cancelled")
        .length,
      subtitle: "During selected period",
      icon: "CalendarCheck",
      color: "indigo",
    },
    {
      title: "Revenue Collected",
      value: formatCurrency(totalRevenue),
      subtitle: "Successful payments received",
      icon: "IndianRupee",
      color: "emerald",
    },
    {
      title: "Pending Payments",
      value: formatCurrency(pendingPayments),
      subtitle: `${pendingInvoices} outstanding reservations`,
      icon: "Wallet",
      color: "red",
    },
  ];
};

function DashboardHeader({ range, setRange, onRefresh }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Welcome back! Here's what's happening at your hotel.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2">
          <CalendarDays size={16} className="text-slate-500" />
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="text-sm text-slate-700 outline-none bg-transparent"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="month">This Month</option>
          </select>
        </div>

        <button
          onClick={onRefresh}
          className="p-2.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
          title="Refresh dashboard"
        >
          <RefreshCw size={17} className="text-slate-600" />
        </button>

        <button
          onClick={() => alert("Export functionality will be added later.")}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    { label: "New Reservation", icon: Plus, color: "bg-blue-600" },
    { label: "Check-in", icon: LogIn, color: "bg-green-600" },
    { label: "Check-out", icon: LogOut, color: "bg-orange-500" },
    { label: "Add Guest", icon: UserPlus, color: "bg-purple-600" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6">
      <SectionTitle
        title="Quick Actions"
        subtitle="Frequently used hotel operations"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() =>
                alert(`${item.label} page will be connected later.`)
              }
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition text-left"
            >
              <span className={`${item.color} p-2.5 rounded-lg text-white`}>
                <Icon size={19} />
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StatsCards({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {data.map((item) => {
        const Icon = iconMap[item.icon];

        return (
          <div
            key={item.title}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">{item.title}</p>

              <span className={`p-2.5 rounded-lg ${colors[item.color]}`}>
                <Icon size={20} />
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mt-4">
              {item.value}
            </h2>

            <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
          </div>
        );
      })}
    </div>
  );
}

function RevenueChart({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Revenue Overview"
        subtitle="Revenue and expenses performance"
        action={
          <button className="text-slate-400 hover:text-slate-700">
            <MoreHorizontal size={20} />
          </button>
        }
      />

      <div className="mb-4">
        <h3 className="text-2xl font-bold text-slate-900">₹4,85,000</h3>
        <p className="text-xs text-green-600 mt-1">
          <ArrowUpRight size={14} className="inline" />
          12.5% compared to last month
        </p>
      </div>

      <div className="h-65 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
            />
            <Tooltip
              formatter={(value) => `₹${value.toLocaleString("en-IN")}`}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#2563EB"
              fill="url(#revenueFill)"
              strokeWidth={3}
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#F59E0B"
              fill="none"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex gap-5 text-xs mt-3">
        <span className="flex items-center gap-2 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          Revenue
        </span>
        <span className="flex items-center gap-2 text-slate-500">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          Expenses
        </span>
      </div>
    </div>
  );
}

function OccupancyChart() {
  const total = occupancyData.reduce((sum, item) => sum + item.value, 0);
  const occupied =
    occupancyData.find((item) => item.name === "Occupied")?.value || 0;
  const percentage = Math.round((occupied / total) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Room Occupancy"
        subtitle="Current room status distribution"
      />

      <div className="relative h-55">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={occupancyData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              stroke="none"
            >
              {occupancyData.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-slate-900">
            {percentage}%
          </span>
          <span className="text-xs text-slate-500">Occupied</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-3">
        {occupancyData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: chartColors[index] }}
            />
            <span className="text-xs text-slate-500">{item.name}</span>
            <span className="ml-auto text-xs font-bold text-slate-800">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReservationChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Reservation Status"
        subtitle="Booking distribution"
      />

      <div className="h-65">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={reservationData}
              dataKey="value"
              nameKey="name"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={3}
            >
              {reservationData.map((entry, index) => (
                <Cell key={entry.name} fill={chartColors[index]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RoomTypeChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Room Type Occupancy"
        subtitle="Occupied vs available rooms"
      />

      <div className="h-65">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roomTypeData} barGap={5}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "11px" }} />
            <Bar
              dataKey="occupied"
              name="Occupied"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="available"
              name="Available"
              fill="#16A34A"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BookingSourceChart() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Booking Sources"
        subtitle="Where your reservations come from"
      />

      <div className="h-65">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bookingSourceData} layout="vertical">
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E2E8F0"
            />
            <XAxis
              type="number"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={75}
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              name="Bookings"
              fill="#6366F1"
              radius={[0, 5, 5, 0]}
              barSize={17}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentReservations({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Recent Reservations"
        subtitle="Latest hotel bookings"
        action={
          <button className="text-xs font-semibold text-blue-600 flex items-center gap-1">
            View All <ChevronRight size={15} />
          </button>
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-162.5">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500">
              <th className="py-3 font-medium">Booking ID</th>
              <th className="py-3 font-medium">Guest</th>
              <th className="py-3 font-medium">Room</th>
              <th className="py-3 font-medium">Check-in</th>
              <th className="py-3 font-medium">Amount</th>
              <th className="py-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-50 text-sm hover:bg-slate-50"
              >
                <td className="py-4 font-semibold text-blue-600">{item.id}</td>
                <td className="py-4 font-medium text-slate-800">
                  {item.guest}
                </td>
                <td className="py-4 text-slate-600">{item.room}</td>
                <td className="py-4 text-slate-600">{item.checkIn}</td>
                <td className="py-4 font-semibold text-slate-800">
                  {item.totalAmount}
                </td>
                <td className="py-4">
                  <StatusBadge status={item.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpcomingArrivals() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Upcoming Arrivals"
        subtitle="Guests expected today"
        action={
          <button className="text-blue-600 text-xs font-semibold">
            View All
          </button>
        }
      />

      <div className="space-y-4">
        {arrivals.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0"
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-sm">
              {item.guest
                .split(" ")
                .map((word) => word[0])
                .join("")}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {item.guest}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Room {item.room} · {item.guests} Guests
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs font-semibold text-slate-700">
                {item.time}
              </p>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentTransactions({ data }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Recent Transactions"
        subtitle="Latest payment activities"
        action={
          <button className="text-blue-600 text-xs font-semibold">
            View All
          </button>
        }
      />

      <div className="space-y-4">
        {data?.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b border-slate-100 pb-4 last:border-0"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
              <CreditCard size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800">
                {item.guest}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {item.method} · {item.id}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{item.amount}</p>
              <div className="mt-1">
                <StatusBadge status={item.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoomAvailability() {
  const rooms = [
    { label: "Available", count: 32, color: "bg-green-500" },
    { label: "Occupied", count: 76, color: "bg-blue-500" },
    { label: "Reserved", count: 4, color: "bg-amber-500" },
    { label: "Maintenance", count: 8, color: "bg-red-500" },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Room Availability"
        subtitle="Current room inventory"
        action={
          <button className="text-blue-600 text-xs font-semibold">
            View Rooms
          </button>
        }
      />

      <div className="flex h-3 overflow-hidden rounded-full mb-5">
        {rooms.map((room) => (
          <div
            key={room.label}
            className={room.color}
            style={{ width: `${(room.count / 120) * 100}%` }}
          />
        ))}
      </div>

      <div className="space-y-4">
        {rooms.map((room) => (
          <div key={room.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${room.color}`} />
              <span className="text-sm text-slate-600">{room.label}</span>
            </div>
            <span className="font-bold text-sm text-slate-800">
              {room.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Notifications() {
  const icons = {
    warning: AlertCircle,
    success: CheckCircle2,
    danger: Wrench,
  };

  const iconColors = {
    warning: "bg-amber-50 text-amber-600",
    success: "bg-green-50 text-green-600",
    danger: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <SectionTitle
        title="Important Notifications"
        subtitle="Updates requiring your attention"
        action={<Bell size={18} className="text-slate-400" />}
      />

      <div className="space-y-4">
        {notifications.map((item, index) => {
          const Icon = icons[item.type];

          return (
            <div key={index} className="flex gap-3">
              <div className={`p-2 rounded-lg h-fit ${iconColors[item.type]}`}>
                <Icon size={17} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-800">
                  {item.title}
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">{item.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [range, setRange] = useState("month");
  const [refreshing, setRefreshing] = useState(false);

  const dateRange = useMemo(() => getDateRange(range), [range]);

  const calculatedStats = useMemo(
    () => calculateDashboardStats(dateRange),
    [dateRange],
  );

  // Filter reservations using their check-in date
  const filteredReservations = useMemo(() => {
    return reservations.filter((item) =>
      isDateInRange(item.checkInDate, dateRange),
    );
  }, [dateRange]);

  // Filter transactions using their transaction date
  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (item) =>
        item.status === "Success" &&
        isDateInRange(item.transactionDate, dateRange),
    );
  }, [dateRange]);

  // Revenue chart currently has day labels rather than complete dates.
  // We interpret those labels as days of the current month.
  const filteredRevenueData = useMemo(() => {
    const now = new Date();

    return revenueData.filter((item) => {
      const day = Number(item.name);

      const date = new Date(now.getFullYear(), now.getMonth(), day);

      return date >= dateRange.start && date <= dateRange.end;
    });
  }, [dateRange]);

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      <DashboardHeader
        range={range}
        setRange={setRange}
        onRefresh={handleRefresh}
      />

      {refreshing && (
        <p className="text-xs text-blue-600 mb-3">Refreshing dashboard...</p>
      )}

      <QuickActions />

      <StatsCards data={calculatedStats} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2">
          <RevenueChart data={filteredRevenueData} />
        </div>

        <OccupancyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-5">
        <ReservationChart />
        <RoomTypeChart />
        <BookingSourceChart />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mb-5">
        <div className="xl:col-span-2">
          <RecentReservations data={filteredReservations} />
        </div>

        <UpcomingArrivals />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        <RecentTransactions data={filteredTransactions} />
        <RoomAvailability />
        <Notifications />
      </div>
    </div>
  );
}
