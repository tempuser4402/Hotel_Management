
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  IndianRupee,
  ClipboardList,
  Utensils,
  Armchair,
  CalendarCheck,
  ChefHat,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  Plus,
  Search,
  MoreHorizontal,
  Coffee,
  Pizza,
  Salad,
  Eye,
  X,
  RefreshCw,
} from "lucide-react";

const initialOrders = [
  { id: "ORD-1042", type: "Dine-in", table: "T-04", items: "Paneer Tikka, Butter Naan", amount: 850, status: "Preparing", payment: "Paid", time: "12:15 PM" },
  { id: "ORD-1041", type: "Room Service", table: "Room 205", items: "Veg Biryani, Fresh Lime", amount: 620, status: "Pending", payment: "Pending", time: "12:08 PM" },
  { id: "ORD-1040", type: "Takeaway", table: "Takeaway", items: "Margherita Pizza", amount: 450, status: "Ready", payment: "Paid", time: "11:55 AM" },
  { id: "ORD-1039", type: "Dine-in", table: "T-08", items: "Dal Makhani, Jeera Rice", amount: 740, status: "Served", payment: "Paid", time: "11:42 AM" },
  { id: "ORD-1038", type: "Dine-in", table: "T-02", items: "Chicken Biryani", amount: 520, status: "Preparing", payment: "Paid", time: "11:30 AM" },
];

const revenueData = [
  { day: "Mon", amount: 12500 },
  { day: "Tue", amount: 15800 },
  { day: "Wed", amount: 11200 },
  { day: "Thu", amount: 18600 },
  { day: "Fri", amount: 22400 },
  { day: "Sat", amount: 26800 },
  { day: "Sun", amount: 19800 },
];

const popularItems = [
  { name: "Paneer Butter Masala", category: "Main Course", sold: 86, revenue: 25800, percentage: 90, icon: Utensils },
  { name: "Chicken Biryani", category: "Rice & Biryani", sold: 72, revenue: 21600, percentage: 76, icon: ChefHat },
  { name: "Margherita Pizza", category: "Pizza", sold: 58, revenue: 17400, percentage: 62, icon: Pizza },
  { name: "Fresh Lime Soda", category: "Beverages", sold: 51, revenue: 7650, percentage: 54, icon: Coffee },
  { name: "Garden Fresh Salad", category: "Starters", sold: 38, revenue: 7600, percentage: 40, icon: Salad },
];

const quickLinks = [
  { label: "Create Order", description: "Add a restaurant order", path: "/restaurant/orders", icon: ShoppingBag },
  { label: "Manage Menu", description: "Food items and pricing", path: "/restaurant/menu", icon: Utensils },
  { label: "Tables & Reservations", description: "Manage tables and bookings", path: "/restaurant/tables", icon: Armchair },
  { label: "Kitchen Orders", description: "Monitor food preparation", path: "/restaurant/kitchen", icon: ChefHat },
];

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const cn = (...classes) => classes.filter(Boolean).join(" ");

function StatCard({ title, value, subtitle, icon: Icon, tone, trend, trendDown }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
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
          <Icon size={21} />
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
          {trendDown ? (
            <TrendingDown size={14} className="text-rose-500" />
          ) : (
            <TrendingUp size={14} className="text-emerald-600" />
          )}
          <span className={trendDown ? "text-rose-600" : "text-emerald-600"}>{trend}</span>
          <span className="font-normal text-slate-400">vs last week</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, action, to }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
      {action && (
        <Link to={to} className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          {action} <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  );
}

function Badge({ children, tone = "slate" }) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

export default function RestaurantOverview() {
  const [orders] = useState(initialOrders);
  const [selectedPeriod, setSelectedPeriod] = useState("This Week");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const active = orders.filter((order) =>
      ["Pending", "Preparing", "Ready"].includes(order.status)
    ).length;

    const kitchenPending = orders.filter((order) =>
      ["Pending", "Preparing"].includes(order.status)
    ).length;

    return {
      todayOrders: 48,
      sales: 38450,
      active,
      availableTables: 8,
      reservedTables: 5,
      kitchenPending,
    };
  }, [orders]);

  const filteredOrders = orders.filter((order) =>
    [order.id, order.type, order.table, order.items]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const statusTone = (status) => {
    if (status === "Served") return "green";
    if (status === "Ready") return "blue";
    if (status === "Preparing") return "amber";
    if (status === "Pending") return "rose";
    return "slate";
  };

  const maxRevenue = Math.max(...revenueData.map((item) => item.amount));

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              ASH / Restaurant & Dining
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Restaurant Overview</h1>
            <p className="mt-1 text-sm text-slate-500">
              Monitor restaurant orders, revenue, tables and kitchen activity.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={16} /> Refresh
            </button>
            <Link
              to="/restaurant/orders"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Plus size={17} /> Create Order
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Today's Orders"
            value={stats.todayOrders}
            subtitle="Orders received today"
            icon={ShoppingBag}
            tone="blue"
            trend="+12.5%"
          />
          <StatCard
            title="Total Sales"
            value={money(stats.sales)}
            subtitle="Today's restaurant revenue"
            icon={IndianRupee}
            tone="green"
            trend="+8.2%"
          />
          <StatCard
            title="Active Orders"
            value={stats.active}
            subtitle="Pending, preparing or ready"
            icon={ClipboardList}
            tone="purple"
          />
          <StatCard
            title="Available Tables"
            value={stats.availableTables}
            subtitle="Ready for new guests"
            icon={Armchair}
            tone="green"
          />
          <StatCard
            title="Reserved Tables"
            value={stats.reservedTables}
            subtitle="Upcoming table bookings"
            icon={CalendarCheck}
            tone="amber"
          />
          <StatCard
            title="Kitchen Pending"
            value={stats.kitchenPending}
            subtitle="Orders awaiting preparation"
            icon={ChefHat}
            tone="rose"
          />
        </div>

        {/* Quick links */}
        <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
              >
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600 group-hover:bg-indigo-100">
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.description}</p>
                </div>
                <ArrowUpRight size={17} className="text-slate-300 group-hover:text-indigo-600" />
              </Link>
            );
          })}
        </section>

        {/* Revenue and table status */}
        <div className="grid gap-5 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">Restaurant Revenue</h2>
                <p className="mt-1 text-xs text-slate-400">Revenue performance over time</p>
              </div>
              <select
                value={selectedPeriod}
                onChange={(event) => setSelectedPeriod(event.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none focus:border-indigo-400"
              >
                <option>This Week</option>
                <option>Last Week</option>
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>

            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs text-slate-400">Total revenue</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">₹1,47,100</p>
                <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <TrendingUp size={14} /> 14.8% increase
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                Revenue trend
              </div>
            </div>

            <div className="mt-7 flex h-56 items-end gap-3 border-b border-slate-100 pb-2 sm:gap-5">
              {revenueData.map((item) => {
                const height = (item.amount / maxRevenue) * 100;
                return (
                  <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                    <span className="text-[10px] font-medium text-slate-400 sm:text-xs">
                      {(item.amount / 1000).toFixed(1)}k
                    </span>
                    <div className="flex h-[78%] w-full items-end">
                      <div
                        title={`${item.day}: ${money(item.amount)}`}
                        className={cn(
                          "w-full rounded-t-lg transition-all hover:opacity-80",
                          item.day === "Sat" ? "bg-indigo-600" : "bg-indigo-200"
                        )}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{item.day}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Illustrative weekly revenue data. Connect actual sales records for live reporting.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Table Availability"
              subtitle="Current restaurant seating"
              action="Manage Tables"
              to="/restaurant/tables"
            />

            <div className="mt-5 space-y-5">
              {[
                { label: "Available", count: 8, total: 20, color: "bg-emerald-500" },
                { label: "Reserved", count: 5, total: 20, color: "bg-amber-400" },
                { label: "Occupied", count: 7, total: 20, color: "bg-blue-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                      <span className="text-sm font-medium text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-800">
                      {item.count} <span className="font-normal text-slate-400">/ {item.total}</span>
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", item.color)}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-xs text-emerald-700">Total Tables</p>
                <p className="mt-1 text-xl font-bold text-emerald-800">20</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3">
                <p className="text-xs text-blue-700">Occupancy</p>
                <p className="mt-1 text-xl font-bold text-blue-800">35%</p>
              </div>
            </div>

            <Link
              to="/restaurant/tables"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              <Armchair size={16} /> View Floor Tables
            </Link>
          </section>
        </div>

        {/* Popular items and order types */}
        <div className="grid gap-5 xl:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
            <SectionHeader
              title="Popular Food Items"
              subtitle="Best-selling items based on sample order data"
              action="Manage Menu"
              to="/restaurant/menu"
            />

            <div className="mt-2 space-y-4">
              {popularItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.name} className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon size={19} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{index + 1}. {item.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">{item.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-800">{item.sold} sold</p>
                          <p className="text-xs text-slate-400">{money(item.revenue)}</p>
                        </div>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-indigo-500"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader title="Order Channels" subtitle="Today's order distribution" />

            <div className="mt-5 space-y-5">
              {[
                { label: "Dine-in", count: 27, percent: 56, color: "bg-indigo-500" },
                { label: "Room Service", count: 13, percent: 27, color: "bg-emerald-500" },
                { label: "Takeaway", count: 8, percent: 17, color: "bg-amber-400" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.count} orders</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.percent}%` }} />
                  </div>
                  <p className="mt-1 text-right text-xs text-slate-400">{item.percent}%</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Average order value</p>
              <p className="mt-1 text-xl font-bold text-slate-900">₹801</p>
              <p className="mt-1 text-xs text-slate-400">Based on today's sample sales</p>
            </div>
          </section>
        </div>

        {/* Recent orders */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Recent Orders</h2>
              <p className="mt-1 text-xs text-slate-400">Latest restaurant orders and their current status</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-3 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-indigo-400 sm:w-52"
                />
              </div>
              <Link
                to="/restaurant/orders"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                View All <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Order Type</th>
                  <th className="px-5 py-3">Table / Room</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Order Status</th>
                  <th className="px-5 py-3">Time</th>
                  <th className="px-5 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-semibold text-indigo-600">{order.id}</td>
                    <td className="px-5 py-4 text-slate-600">{order.type}</td>
                    <td className="px-5 py-4 text-slate-600">{order.table}</td>
                    <td className="max-w-48 px-5 py-4 text-slate-600">{order.items}</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{money(order.amount)}</td>
                    <td className="px-5 py-4">
                      <Badge tone={order.payment === "Paid" ? "green" : "amber"}>{order.payment}</Badge>
                    </td>
                    <td className="px-5 py-4">
                      <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                    </td>
                    <td className="px-5 py-4 text-slate-500">{order.time}</td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        title="View order"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-sm text-slate-400">
                No orders match your search.
              </div>
            )}
          </div>
        </section>

        {/* Kitchen queue */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Kitchen Queue</h2>
              <p className="mt-1 text-xs text-slate-400">Orders that need kitchen attention</p>
            </div>
            <Link
              to="/restaurant/kitchen"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
            >
              Open Kitchen Display <ArrowUpRight size={15} />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {orders.filter((order) => ["Pending", "Preparing"].includes(order.status)).map((order) => (
              <div key={order.id} className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-slate-800">{order.id}</p>
                  <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                </div>
                <p className="mt-3 text-sm text-slate-700">{order.items}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{order.table}</span>
                  <span className="flex items-center gap-1"><Clock size={13} /> {order.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedOrder(null);
          }}
        >
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <h2 className="font-semibold text-slate-900">Order Details</h2>
                <p className="mt-1 text-xs text-slate-400">{selectedOrder.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={19} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Order Type", selectedOrder.type],
                  ["Table / Room", selectedOrder.table],
                  ["Order Time", selectedOrder.time],
                  ["Amount", money(selectedOrder.amount)],
                  ["Payment", selectedOrder.payment],
                  ["Status", selectedOrder.status],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-slate-100 p-3">
                <p className="text-xs font-semibold text-slate-500">Ordered Items</p>
                <p className="mt-2 text-sm text-slate-700">{selectedOrder.items}</p>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/restaurant/orders"
                  className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                >
                  Go to Orders
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
