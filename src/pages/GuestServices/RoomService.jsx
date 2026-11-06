import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Utensils,
  Clock,
  CheckCircle2,
  ChefHat,
  Truck,
  CreditCard,
  IndianRupee,
  X,
  Minus,
  Trash2,
  Filter,
  Eye,
  RefreshCw,
  ClipboardList,
  BedDouble,
  CircleDollarSign,
  AlertCircle,
  ShoppingBag,
} from "lucide-react";

const initialMenu = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    category: "Main Course",
    price: 280,
    available: true,
  },
  {
    id: 2,
    name: "Chicken Biryani",
    category: "Main Course",
    price: 350,
    available: true,
  },
  {
    id: 3,
    name: "Veg Fried Rice",
    category: "Main Course",
    price: 220,
    available: true,
  },
  {
    id: 4,
    name: "Butter Naan",
    category: "Breads",
    price: 50,
    available: true,
  },
  {
    id: 5,
    name: "Masala Dosa",
    category: "Breakfast",
    price: 160,
    available: true,
  },
  {
    id: 6,
    name: "French Fries",
    category: "Starters",
    price: 140,
    available: true,
  },
  {
    id: 7,
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 90,
    available: true,
  },
  {
    id: 8,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 150,
    available: true,
  },
  {
    id: 9,
    name: "Mineral Water",
    category: "Beverages",
    price: 40,
    available: true,
  },
];

const initialOrders = [
  {
    id: "RS-1001",
    room: "101",
    guest: "Rahul Sharma",
    items: [
      { name: "Paneer Butter Masala", quantity: 1, price: 280 },
      { name: "Butter Naan", quantity: 2, price: 50 },
    ],
    instructions: "Less spicy, please.",
    total: 380,
    paymentStatus: "Paid",
    kitchenStatus: "Preparing",
    deliveryStatus: "Pending",
    createdAt: "10:15 AM",
  },
  {
    id: "RS-1002",
    room: "204",
    guest: "Priya Verma",
    items: [
      { name: "Chicken Biryani", quantity: 1, price: 350 },
      { name: "Fresh Lime Soda", quantity: 1, price: 90 },
    ],
    instructions: "No onions.",
    total: 440,
    paymentStatus: "Pending",
    kitchenStatus: "Ready",
    deliveryStatus: "On the way",
    createdAt: "10:30 AM",
  },
  {
    id: "RS-1003",
    room: "305",
    guest: "Amit Patel",
    items: [
      { name: "Masala Dosa", quantity: 2, price: 160 },
      { name: "Mineral Water", quantity: 2, price: 40 },
    ],
    instructions: "",
    total: 400,
    paymentStatus: "Paid",
    kitchenStatus: "Completed",
    deliveryStatus: "Delivered",
    createdAt: "09:45 AM",
  },
  {
    id: "RS-1004",
    room: "112",
    guest: "Neha Gupta",
    items: [
      { name: "French Fries", quantity: 1, price: 140 },
      { name: "Chocolate Brownie", quantity: 1, price: 150 },
    ],
    instructions: "Pack brownie separately.",
    total: 290,
    paymentStatus: "Pending",
    kitchenStatus: "Pending",
    deliveryStatus: "Pending",
    createdAt: "11:00 AM",
  },
];

const rooms = [
  { number: "101", guest: "Rahul Sharma" },
  { number: "102", guest: "Sanjay Kumar" },
  { number: "112", guest: "Neha Gupta" },
  { number: "204", guest: "Priya Verma" },
  { number: "305", guest: "Amit Patel" },
  { number: "401", guest: "Rohan Mehta" },
];

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700",
  Preparing: "bg-blue-50 text-blue-700",
  Ready: "bg-violet-50 text-violet-700",
  Completed: "bg-emerald-50 text-emerald-700",
  "On the way": "bg-blue-50 text-blue-700",
  Delivered: "bg-emerald-50 text-emerald-700",
  Paid: "bg-emerald-50 text-emerald-700",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    violet: "bg-violet-50 text-violet-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
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

export default function RoomService() {
  const [orders, setOrders] = useState(initialOrders);
  const [menu] = useState(initialMenu);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Orders");
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showDetails, setShowDetails] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState("101");
  const [instructions, setInstructions] = useState("");
  const [cart, setCart] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("Room Charge");
  const [toast, setToast] = useState("");

  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  const filteredMenu = menu.filter(
    (item) =>
      item.available &&
      (selectedCategory === "All" || item.category === selectedCategory),
  );

  const cartItems = menu
    .filter((item) => cart[item.id]?.quantity > 0)
    .map((item) => ({
      ...item,
      quantity: cart[item.id].quantity,
    }));

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.room.toLowerCase().includes(search.toLowerCase()) ||
        order.guest.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" ||
        order.kitchenStatus === statusFilter ||
        order.deliveryStatus === statusFilter ||
        order.paymentStatus === statusFilter;

      return searchMatch && statusMatch;
    });
  }, [orders, search, statusFilter]);

  const pendingOrders = orders.filter(
    (order) => order.deliveryStatus !== "Delivered",
  ).length;

  const completedOrders = orders.filter(
    (order) => order.deliveryStatus === "Delivered",
  ).length;

  const totalRevenue = orders
    .filter((order) => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total, 0);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const updateQuantity = (itemId, change) => {
    setCart((previous) => {
      const current = previous[itemId]?.quantity || 0;
      const next = current + change;

      if (next <= 0) {
        const updated = { ...previous };
        delete updated[itemId];
        return updated;
      }

      return {
        ...previous,
        [itemId]: { quantity: next },
      };
    });
  };

  const placeOrder = () => {
    if (!selectedRoom || cartItems.length === 0) {
      showToast("Select a room and add at least one menu item.");
      return;
    }

    const room = rooms.find((item) => item.number === selectedRoom);
    const newOrder = {
      id: `RS-${1001 + orders.length}`,
      room: selectedRoom,
      guest: room?.guest || "Guest",
      items: cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      instructions,
      total: cartTotal,
      paymentStatus: paymentMethod === "Pay Now" ? "Paid" : "Pending",
      kitchenStatus: "Pending",
      deliveryStatus: "Pending",
      createdAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setOrders((previous) => [newOrder, ...previous]);
    setCart({});
    setInstructions("");
    setShowOrderModal(false);
    setActiveTab("Orders");
    showToast("Room service order placed successfully.");
  };

  const updateOrderStatus = (orderId, field, value) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order,
      ),
    );
    showToast("Order status updated.");
  };

  const nextKitchenStatus = (status) => {
    const statuses = ["Pending", "Preparing", "Ready", "Completed"];
    return statuses[
      Math.min(statuses.indexOf(status) + 1, statuses.length - 1)
    ];
  };

  const nextDeliveryStatus = (status) => {
    const statuses = ["Pending", "On the way", "Delivered"];
    return statuses[
      Math.min(statuses.indexOf(status) + 1, statuses.length - 1)
    ];
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Utensils size={16} />
              Guest Services
              <span>/</span>
              <span className="text-slate-800">Room Service</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Room Service
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage room-wise food orders, kitchen preparation and deliveries.
            </p>
          </div>

          <button
            onClick={() => setShowOrderModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus size={18} />
            Create New Order
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={orders.length}
            subtitle="All room service orders"
            icon={ClipboardList}
            color="blue"
          />
          <StatCard
            title="Active Orders"
            value={pendingOrders}
            subtitle="Not yet delivered"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Delivered Orders"
            value={completedOrders}
            subtitle="Successfully delivered"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Collected Revenue"
            value={money(totalRevenue)}
            subtitle="Paid room service orders"
            icon={IndianRupee}
            color="violet"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto border-b border-slate-200">
          {["Orders", "Menu", "Order History"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold transition ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders and Order History */}
        {activeTab !== "Menu" && (
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search order ID, room or guest..."
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter size={17} className="text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="On the way">On the way</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {activeTab === "Orders"
                      ? "Current Orders"
                      : "Order History"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {filteredOrders.length} orders found
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("All");
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
                >
                  <RefreshCw size={15} />
                  Reset filters
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4 font-semibold">Order</th>
                      <th className="px-5 py-4 font-semibold">Room / Guest</th>
                      <th className="px-5 py-4 font-semibold">Items</th>
                      <th className="px-5 py-4 font-semibold">Total</th>
                      <th className="px-5 py-4 font-semibold">Payment</th>
                      <th className="px-5 py-4 font-semibold">Kitchen</th>
                      <th className="px-5 py-4 font-semibold">Delivery</th>
                      <th className="px-5 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders
                      .filter(
                        (order) =>
                          activeTab !== "Order History" ||
                          order.deliveryStatus === "Delivered",
                      )
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/70">
                          <td className="px-5 py-4">
                            <p className="font-bold text-slate-800">
                              {order.id}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {order.createdAt}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                                <BedDouble size={17} />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-800">
                                  Room {order.room}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {order.guest}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="max-w-[180px] px-5 py-4">
                            <p className="font-medium text-slate-700">
                              {order.items.length} items
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-400">
                              {order.items
                                .map(
                                  (item) => `${item.name} × ${item.quantity}`,
                                )
                                .join(", ")}
                            </p>
                          </td>

                          <td className="px-5 py-4 font-bold text-slate-800">
                            {money(order.total)}
                          </td>

                          <td className="px-5 py-4">
                            <button
                              onClick={() =>
                                updateOrderStatus(
                                  order.id,
                                  "paymentStatus",
                                  order.paymentStatus === "Paid"
                                    ? "Pending"
                                    : "Paid",
                                )
                              }
                              title="Click to toggle payment status"
                            >
                              <StatusBadge status={order.paymentStatus} />
                            </button>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <StatusBadge status={order.kitchenStatus} />
                              {order.kitchenStatus !== "Completed" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(
                                      order.id,
                                      "kitchenStatus",
                                      nextKitchenStatus(order.kitchenStatus),
                                    )
                                  }
                                  className="text-xs font-medium text-indigo-600 hover:underline"
                                >
                                  Update status
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex flex-col items-start gap-1">
                              <StatusBadge status={order.deliveryStatus} />
                              {order.deliveryStatus !== "Delivered" && (
                                <button
                                  onClick={() =>
                                    updateOrderStatus(
                                      order.id,
                                      "deliveryStatus",
                                      nextDeliveryStatus(order.deliveryStatus),
                                    )
                                  }
                                  className="text-xs font-medium text-indigo-600 hover:underline"
                                >
                                  Update status
                                </button>
                              )}
                            </div>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              onClick={() => setShowDetails(order)}
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                              title="View order details"
                            >
                              <Eye size={17} />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>

                {filteredOrders.filter(
                  (order) =>
                    activeTab !== "Order History" ||
                    order.deliveryStatus === "Delivered",
                ).length === 0 && (
                  <div className="py-14 text-center">
                    <ShoppingBag size={32} className="mx-auto text-slate-300" />
                    <p className="mt-3 font-semibold text-slate-700">
                      No orders found
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        {activeTab === "Menu" && (
          <div className="space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Room Service Menu
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Available food and beverage items with pricing.
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                {menu.filter((item) => item.available).length} items available
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div>
                    <span className="text-xs font-medium text-indigo-600">
                      {item.category}
                    </span>
                    <h3 className="mt-1 font-bold text-slate-800">
                      {item.name}
                    </h3>
                    <p className="mt-2 font-semibold text-slate-700">
                      {money(item.price)}
                    </p>
                  </div>

                  <div className="rounded-xl bg-orange-50 p-3 text-orange-600">
                    <Utensils size={22} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Create Order Modal */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create Room Service Order
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Select a room and add food items.
                  </p>
                </div>

                <button
                  onClick={() => setShowOrderModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid flex-1 overflow-y-auto md:grid-cols-[1fr_320px]">
                {/* Menu Selection */}
                <div className="space-y-5 p-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Select Room
                    </label>

                    <select
                      value={selectedRoom}
                      onChange={(e) => setSelectedRoom(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                    >
                      {rooms.map((room) => (
                        <option key={room.number} value={room.number}>
                          Room {room.number} — {room.guest}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Select Items</h3>
                      <span className="text-xs text-slate-400">
                        {cartItems.length} selected
                      </span>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                            selectedCategory === category
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {filteredMenu.map((item) => {
                        const quantity = cart[item.id]?.quantity || 0;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-slate-100 p-3"
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {item.name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                {money(item.price)}
                              </p>
                            </div>

                            {quantity === 0 ? (
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50"
                              >
                                Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateQuantity(item.id, -1)}
                                  className="rounded-md bg-slate-100 p-1.5 text-slate-600"
                                >
                                  <Minus size={14} />
                                </button>

                                <span className="w-4 text-center text-sm font-bold">
                                  {quantity}
                                </span>

                                <button
                                  onClick={() => updateQuantity(item.id, 1)}
                                  className="rounded-md bg-indigo-50 p-1.5 text-indigo-600"
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Cart Summary */}
                <div className="flex flex-col border-t border-slate-100 bg-slate-50 p-5 md:border-l md:border-t-0">
                  <h3 className="font-bold text-slate-800">Order Summary</h3>

                  <div className="mt-4 flex-1 space-y-3">
                    {cartItems.length === 0 ? (
                      <p className="py-8 text-center text-sm text-slate-400">
                        Your order is empty.
                      </p>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-2"
                        >
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {item.quantity} × {money(item.price)}
                            </p>
                          </div>

                          <p className="text-sm font-semibold text-slate-800">
                            {money(item.quantity * item.price)}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="space-y-3 border-t border-slate-200 pt-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        Special Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        placeholder="E.g. less spicy, no onions..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-indigo-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-slate-600">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none"
                      >
                        <option value="Room Charge">Charge to Room</option>
                        <option value="Pay Now">Paid Now</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-semibold text-slate-600">
                        Order Total
                      </span>
                      <span className="text-xl font-bold text-slate-900">
                        {money(cartTotal)}
                      </span>
                    </div>

                    <button
                      onClick={placeOrder}
                      disabled={cartItems.length === 0}
                      className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Place Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
            <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Order Details
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {showDetails.id} · Room {showDetails.room}
                  </p>
                </div>

                <button
                  onClick={() => setShowDetails(null)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-800">
                  {showDetails.guest}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Ordered at {showDetails.createdAt}
                </p>
              </div>

              <div className="mt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-800">
                  Ordered Items
                </h3>

                {showDetails.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-slate-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {money(item.price * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="flex justify-between border-t border-slate-200 pt-3">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-bold text-slate-900">
                    {money(showDetails.total)}
                  </span>
                </div>
              </div>

              {showDetails.instructions && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs font-bold text-amber-800">
                    Special Instructions
                  </p>
                  <p className="mt-1 text-sm text-amber-700">
                    {showDetails.instructions}
                  </p>
                </div>
              )}

              <div className="mt-5 grid grid-cols-3 gap-2">
                <div>
                  <p className="mb-2 text-xs text-slate-500">Payment</p>
                  <StatusBadge status={showDetails.paymentStatus} />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Kitchen</p>
                  <StatusBadge status={showDetails.kitchenStatus} />
                </div>
                <div>
                  <p className="mb-2 text-xs text-slate-500">Delivery</p>
                  <StatusBadge status={showDetails.deliveryStatus} />
                </div>
              </div>

              <button
                onClick={() => setShowDetails(null)}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
            <CheckCircle2 size={18} className="text-emerald-400" />
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
