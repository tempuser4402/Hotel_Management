
import { useMemo, useState, useEffect } from "react";
import {
  ChefHat,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flame,
  Search,
  Filter,
  Eye,
  Play,
  Check,
  Bell,
  Utensils,
  Timer,
  RefreshCw,
  X,
  ClipboardList,
  CalendarDays,
  ArrowRight,
  PackageCheck,
  CircleDot,
} from "lucide-react";

const initialOrders = [
  {
    id: "KOT-1001",
    orderNumber: "ORD-2041",
    type: "Dine-in",
    table: "Table 04",
    guest: "Rahul Sharma",
    time: "12:05 PM",
    createdAt: Date.now() - 18 * 60000,
    priority: "High",
    status: "Pending",
    instructions: "Less spicy. Serve hot.",
    items: [
      { name: "Paneer Butter Masala", quantity: 2, note: "Less spicy" },
      { name: "Butter Naan", quantity: 4, note: "" },
    ],
  },
  {
    id: "KOT-1002",
    orderNumber: "ORD-2042",
    type: "Room Service",
    table: "Room 205",
    guest: "Priya Verma",
    time: "12:12 PM",
    createdAt: Date.now() - 12 * 60000,
    priority: "Normal",
    status: "Preparing",
    instructions: "Please pack separately.",
    items: [
      { name: "Veg Biryani", quantity: 1, note: "Extra raita" },
      { name: "Cold Coffee", quantity: 2, note: "" },
    ],
  },
  {
    id: "KOT-1003",
    orderNumber: "ORD-2043",
    type: "Takeaway",
    table: "Takeaway",
    guest: "Amit Kumar",
    time: "12:18 PM",
    createdAt: Date.now() - 7 * 60000,
    priority: "Urgent",
    status: "Pending",
    instructions: "Customer waiting at reception.",
    items: [
      { name: "Margherita Pizza", quantity: 1, note: "Extra cheese" },
      { name: "French Fries", quantity: 1, note: "" },
    ],
  },
  {
    id: "KOT-1004",
    orderNumber: "ORD-2044",
    type: "Dine-in",
    table: "Table 02",
    guest: "Neha Singh",
    time: "12:25 PM",
    createdAt: Date.now() - 3 * 60000,
    priority: "Normal",
    status: "Ready",
    instructions: "Serve with green chutney.",
    items: [
      { name: "Masala Dosa", quantity: 2, note: "" },
      { name: "Filter Coffee", quantity: 2, note: "" },
    ],
  },
];

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Preparing: "bg-blue-50 text-blue-700 border-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-100 text-slate-600 border-slate-200",
};

const priorityStyles = {
  Urgent: "bg-red-50 text-red-700",
  High: "bg-orange-50 text-orange-700",
  Normal: "bg-slate-100 text-slate-600",
};

function getElapsed(createdAt) {
  const minutes = Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
  return minutes === 0 ? "Just now" : `${minutes} min`;
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantKitchen() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  const counts = useMemo(() => ({
    pending: orders.filter(o => o.status === "Pending").length,
    preparing: orders.filter(o => o.status === "Preparing").length,
    ready: orders.filter(o => o.status === "Ready").length,
    completed: orders.filter(o => o.status === "Completed").length,
  }), [orders]);

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        const matchesSearch =
          `${order.id} ${order.orderNumber} ${order.guest} ${order.table}`
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesFilter =
          filter === "All" || order.status === filter;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        const priority = { Urgent: 0, High: 1, Normal: 2 };
        if (a.status === "Completed" && b.status !== "Completed") return 1;
        if (b.status === "Completed" && a.status !== "Completed") return -1;
        return priority[a.priority] - priority[b.priority] ||
          a.createdAt - b.createdAt;
      });
  }, [orders, search, filter]);

  const updateStatus = (id, nextStatus) => {
    setOrders(previous =>
      previous.map(order =>
        order.id === id ? { ...order, status: nextStatus } : order
      )
    );

    const messages = {
      Preparing: "Order moved to preparation.",
      Ready: "Order marked ready. Ready notification generated.",
      Completed: "Order completed successfully.",
    };

    setNotification(messages[nextStatus] || "Order updated.");
    setSelectedOrder(null);
  };

  const updatePriority = (id, priority) => {
    setOrders(previous =>
      previous.map(order =>
        order.id === id ? { ...order, priority } : order
      )
    );
    setNotification(`Priority changed to ${priority}.`);
  };

  const addDemoOrder = () => {
    const newOrder = {
      id: `KOT-${1001 + orders.length}`,
      orderNumber: `ORD-${2041 + orders.length}`,
      type: "Dine-in",
      table: "Table 06",
      guest: "New Guest",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: Date.now(),
      priority: "Normal",
      status: "Pending",
      instructions: "No special instructions.",
      items: [
        { name: "Veg Sandwich", quantity: 2, note: "Extra sauce" },
        { name: "Fresh Lime Soda", quantity: 1, note: "" },
      ],
    };

    setOrders(previous => [newOrder, ...previous]);
    setNotification("New demo kitchen order received.");
  };

  const currentOrder = orders.find(o => o.id === selectedOrder?.id);

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-orange-100 p-2 text-orange-600">
                <ChefHat size={23} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Kitchen Orders
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Manage incoming orders, preparation progress and ready meals.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setFilter("All");
                setSearch("");
              }}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={16} />
              Reset filters
            </button>
            <button
              onClick={addDemoOrder}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              <Utensils size={17} />
              Add demo order
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <div className="flex items-center gap-2">
              <Bell size={17} />
              {notification}
            </div>
            <button onClick={() => setNotification("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Pending Orders"
            value={counts.pending}
            subtitle="Waiting for preparation"
            icon={ClipboardList}
            color="amber"
          />
          <StatCard
            title="Preparing"
            value={counts.preparing}
            subtitle="Currently being prepared"
            icon={Flame}
            color="blue"
          />
          <StatCard
            title="Ready to Serve"
            value={counts.ready}
            subtitle="Waiting for collection"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Completed Today"
            value={counts.completed}
            subtitle="Finished kitchen orders"
            icon={PackageCheck}
            color="slate"
          />
        </div>

        {/* Kitchen Status */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Kitchen workflow</h2>
              <p className="text-xs text-slate-500">
                Current order distribution
              </p>
            </div>
            <span className="flex items-center gap-2 text-xs text-emerald-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Kitchen active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[
              { name: "Pending", count: counts.pending, color: "bg-amber-500" },
              { name: "Preparing", count: counts.preparing, color: "bg-blue-500" },
              { name: "Ready", count: counts.ready, color: "bg-emerald-500" },
              { name: "Completed", count: counts.completed, color: "bg-slate-500" },
            ].map(item => (
              <button
                key={item.name}
                onClick={() => setFilter(item.name)}
                className="rounded-lg border border-slate-200 p-3 text-left hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{item.name}</span>
                  <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {item.count}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Orders */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Kitchen order queue</h2>
              <p className="mt-1 text-xs text-slate-500">
                Priority orders appear first.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search order, guest or table..."
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-orange-500 sm:w-64"
                />
              </div>

              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-orange-500 sm:w-40"
                >
                  {["All", "Pending", "Preparing", "Ready", "Completed"].map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
            {filteredOrders.map(order => {
              const elapsed = Math.max(
                0,
                Math.floor((now - order.createdAt) / 60000)
              );

              return (
                <div
                  key={order.id}
                  className="rounded-xl border border-slate-200 p-4 transition hover:border-orange-200 hover:shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900">{order.id}</h3>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusStyles[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {order.orderNumber} · {order.type}
                      </p>
                    </div>

                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[order.priority]}`}>
                      {order.priority} priority
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-slate-400">Guest</p>
                      <p className="mt-1 font-medium text-slate-800">{order.guest}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Table / Location</p>
                      <p className="mt-1 font-medium text-slate-800">{order.table}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Order time</p>
                      <p className="mt-1 font-medium text-slate-800">{order.time}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Elapsed time</p>
                      <p className={`mt-1 flex items-center gap-1 font-semibold ${elapsed >= 20 ? "text-red-600" : "text-slate-800"}`}>
                        <Timer size={14} />
                        {elapsed} min
                      </p>
                    </div>
                  </div>

                  <div className="my-4 border-t border-slate-100 pt-3">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Ordered items
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between gap-3 text-sm">
                          <span className="text-slate-700">
                            <span className="mr-2 inline-flex h-5 min-w-5 items-center justify-center rounded bg-slate-100 px-1 text-xs font-bold">
                              {item.quantity}
                            </span>
                            {item.name}
                            {item.note && (
                              <span className="block pl-7 text-xs text-orange-600">
                                {item.note}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-slate-400">
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.instructions && (
                    <div className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                      <span className="font-semibold">Special instructions: </span>
                      {order.instructions}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Eye size={15} />
                      Details
                    </button>

                    <div className="flex flex-wrap gap-2">
                      {order.status === "Pending" && (
                        <button
                          onClick={() => updateStatus(order.id, "Preparing")}
                          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                        >
                          <Play size={14} />
                          Start preparing
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          onClick={() => updateStatus(order.id, "Ready")}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <CheckCircle2 size={14} />
                          Mark ready
                        </button>
                      )}

                      {order.status === "Ready" && (
                        <button
                          onClick={() => updateStatus(order.id, "Completed")}
                          className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-900"
                        >
                          <Check size={14} />
                          Complete
                        </button>
                      )}

                      {order.status === "Completed" && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
                          <CheckCircle2 size={15} />
                          Finished
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs text-slate-400">Change priority</span>
                    <select
                      value={order.priority}
                      onChange={e => updatePriority(order.id, e.target.value)}
                      className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none"
                    >
                      <option>Normal</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>
                </div>
              );
            })}

            {filteredOrders.length === 0 && (
              <div className="col-span-full py-12 text-center">
                <ClipboardList className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 font-semibold text-slate-700">No orders found</p>
                <p className="mt-1 text-sm text-slate-400">
                  Try changing your search or status filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Details Modal */}
        {currentOrder && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Kitchen Order Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {currentOrder.id} · {currentOrder.orderNumber}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Guest</p>
                    <p className="mt-1 font-semibold">{currentOrder.guest}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Order type</p>
                    <p className="mt-1 font-semibold">{currentOrder.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Location</p>
                    <p className="mt-1 font-semibold">{currentOrder.table}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Order time</p>
                    <p className="mt-1 font-semibold">{currentOrder.time}</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-900">Items to prepare</h3>
                  <div className="space-y-2">
                    {currentOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-slate-50 p-3">
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          {item.note && (
                            <p className="mt-1 text-xs text-orange-600">{item.note}</p>
                          )}
                        </div>
                        <span className="rounded-lg bg-white px-3 py-1 font-bold text-slate-800">
                          × {item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-4">
                  <p className="text-xs font-semibold uppercase text-amber-700">
                    Special instructions
                  </p>
                  <p className="mt-2 text-sm text-amber-900">
                    {currentOrder.instructions || "No special instructions"}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Current status</p>
                    <span className={`mt-1 inline-block rounded-full border px-3 py-1 text-xs font-semibold ${statusStyles[currentOrder.status]}`}>
                      {currentOrder.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Priority</p>
                    <span className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[currentOrder.priority]}`}>
                      {currentOrder.priority}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  {currentOrder.status === "Pending" && (
                    <button
                      onClick={() => updateStatus(currentOrder.id, "Preparing")}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Start preparation
                    </button>
                  )}
                  {currentOrder.status === "Preparing" && (
                    <button
                      onClick={() => updateStatus(currentOrder.id, "Ready")}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Mark as ready
                    </button>
                  )}
                  {currentOrder.status === "Ready" && (
                    <button
                      onClick={() => updateStatus(currentOrder.id, "Completed")}
                      className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white"
                    >
                      Complete order
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <p className="text-xs text-slate-400">
          Demo mode: Kitchen orders are stored in local React state. Live order
          synchronization and real notifications will be connected during backend integration.
        </p>
      </div>
    </div>
  );
}
