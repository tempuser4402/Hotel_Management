import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  ShoppingBag,
  IndianRupee,
  Clock,
  ChefHat,
  CheckCircle2,
  X,
  Trash2,
  Eye,
  Printer,
  Pencil,
  Minus,
  Utensils,
  BedDouble,
  Armchair,
  ChevronDown,
  Receipt,
  RefreshCw,
} from "lucide-react";

const menuItems = [
  { id: "M001", name: "Paneer Butter Masala", category: "Main Course", price: 280, veg: true, prep: 20 },
  { id: "M002", name: "Dal Makhani", category: "Main Course", price: 220, veg: true, prep: 18 },
  { id: "M003", name: "Veg Biryani", category: "Rice & Biryani", price: 240, veg: true, prep: 20 },
  { id: "M004", name: "Chicken Biryani", category: "Rice & Biryani", price: 320, veg: false, prep: 25 },
  { id: "M005", name: "Butter Naan", category: "Bread", price: 55, veg: true, prep: 8 },
  { id: "M006", name: "Tandoori Roti", category: "Bread", price: 35, veg: true, prep: 7 },
  { id: "M007", name: "Masala Dosa", category: "Breakfast", price: 160, veg: true, prep: 15 },
  { id: "M008", name: "Cold Coffee", category: "Beverages", price: 130, veg: true, prep: 5 },
  { id: "M009", name: "Fresh Lime Soda", category: "Beverages", price: 90, veg: true, prep: 5 },
  { id: "M010", name: "Gulab Jamun", category: "Desserts", price: 100, veg: true, prep: 5 },
];

const initialOrders = [
  {
    id: "ORD-1001",
    guest: "Rahul Sharma",
    type: "Dine-in",
    reference: "Table 04",
    items: [
      { id: "M001", name: "Paneer Butter Masala", price: 280, quantity: 1 },
      { id: "M005", name: "Butter Naan", price: 55, quantity: 3 },
    ],
    discount: 20,
    taxRate: 5,
    payment: "Paid",
    status: "Completed",
    date: "2026-11-06T09:30:00",
    notes: "",
  },
  {
    id: "ORD-1002",
    guest: "Priya Verma",
    type: "Room Service",
    reference: "Room 203",
    items: [
      { id: "M004", name: "Chicken Biryani", price: 320, quantity: 1 },
      { id: "M008", name: "Cold Coffee", price: 130, quantity: 2 },
    ],
    discount: 0,
    taxRate: 5,
    payment: "Pending",
    status: "Preparing",
    date: "2026-11-06T10:15:00",
    notes: "Less spicy",
  },
  {
    id: "ORD-1003",
    guest: "Amit Kumar",
    type: "Takeaway",
    reference: "Takeaway",
    items: [
      { id: "M003", name: "Veg Biryani", price: 240, quantity: 2 },
      { id: "M010", name: "Gulab Jamun", price: 100, quantity: 1 },
    ],
    discount: 0,
    taxRate: 5,
    payment: "Paid",
    status: "Ready",
    date: "2026-11-06T10:40:00",
    notes: "",
  },
  {
    id: "ORD-1004",
    guest: "Neha Singh",
    type: "Dine-in",
    reference: "Table 02",
    items: [{ id: "M007", name: "Masala Dosa", price: 160, quantity: 2 }],
    discount: 0,
    taxRate: 5,
    payment: "Pending",
    status: "Pending",
    date: "2026-11-06T11:05:00",
    notes: "Extra chutney",
  },
];

const emptyForm = {
  guest: "",
  type: "Dine-in",
  reference: "Table 01",
  items: [],
  discount: 0,
  taxRate: 5,
  payment: "Pending",
  status: "Pending",
  notes: "",
};

const currency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const getTotals = (order) => {
  const subtotal = (order.items || []).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const discount = Math.min(Number(order.discount || 0), subtotal);
  const taxable = Math.max(0, subtotal - discount);
  const tax = taxable * (Number(order.taxRate ?? 5) / 100);

  return {
    subtotal,
    discount,
    tax,
    total: taxable + tax,
  };
};

const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Preparing: "bg-blue-50 text-blue-700 border-blue-200",
  Ready: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-slate-100 text-slate-700 border-slate-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

const paymentStyles = {
  Paid: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Refunded: "bg-slate-100 text-slate-600",
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-900">{value}</h3>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const searchMatch = [
        order.id,
        order.guest,
        order.reference,
        order.type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "All" || order.status === statusFilter;

      const typeMatch = typeFilter === "All" || order.type === typeFilter;

      return searchMatch && statusMatch && typeMatch;
    });
  }, [orders, search, statusFilter, typeFilter]);

  const todayOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
  const readyOrders = orders.filter((o) => o.status === "Ready").length;
  const todayRevenue = orders
    .filter((o) => o.payment === "Paid")
    .reduce((sum, o) => sum + getTotals(o).total, 0);

  const formTotals = getTotals(form);

  const openNewOrder = () => {
    setEditingId(null);
    setForm({ ...emptyForm, items: [] });
    setSelectedMenuItem("");
    setShowModal(true);
  };

  const openEditOrder = (order) => {
    setEditingId(order.id);
    setForm({
      ...order,
      items: order.items.map((item) => ({ ...item })),
    });
    setSelectedMenuItem("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addMenuItem = () => {
    if (!selectedMenuItem) return;

    const menuItem = menuItems.find((item) => item.id === selectedMenuItem);
    if (!menuItem) return;

    setForm((prev) => {
      const existing = prev.items.find((item) => item.id === menuItem.id);

      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: menuItem.id,
            name: menuItem.name,
            price: menuItem.price,
            quantity: 1,
          },
        ],
      };
    });

    setSelectedMenuItem("");
  };

  const changeQuantity = (itemId, amount) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items
        .map((item) =>
          item.id === itemId
            ? { ...item, quantity: Math.max(0, item.quantity + amount) }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));
  };

  const saveOrder = (event) => {
    event.preventDefault();

    if (!form.guest.trim()) {
      alert("Please enter the guest name.");
      return;
    }

    if (!form.items.length) {
      alert("Please add at least one food item.");
      return;
    }

    const orderData = {
      ...form,
      guest: form.guest.trim(),
      reference:
        form.type === "Takeaway" ? "Takeaway" : form.reference,
      date: editingId
        ? orders.find((o) => o.id === editingId)?.date
        : new Date().toISOString(),
    };

    if (editingId) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingId ? { ...order, ...orderData } : order
        )
      );
    } else {
      const newOrder = {
        ...orderData,
        id: `ORD-${Date.now().toString().slice(-6)}`,
      };
      setOrders((prev) => [newOrder, ...prev]);
    }

    closeModal();
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const updatePaymentStatus = (orderId, payment) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, payment } : order
      )
    );
  };

  const printBill = (order) => {
    setSelectedOrder(order);
    setTimeout(() => window.print(), 100);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="min-h-screen w-full bg-slate-50 p-3 md:p-5">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #restaurant-print-bill,
          #restaurant-print-bill * {
            visibility: visible !important;
          }
          #restaurant-print-bill {
            display: block !important;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 24px;
            background: white;
            color: black;
          }
          @page {
            size: A4;
            margin: 12mm;
          }
        }
      `}</style>

      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Utensils size={16} />
              <span>Restaurant & Dining</span>
              <span>/</span>
              <span className="text-slate-800">Orders</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Restaurant Orders
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Create, manage and track restaurant orders and payments.
            </p>
          </div>

          <button
            onClick={openNewOrder}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create New Order
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={todayOrders}
            subtitle="Orders in this demo"
            icon={ShoppingBag}
            color="blue"
          />
          <StatCard
            title="Pending Orders"
            value={pendingOrders}
            subtitle="Waiting for kitchen"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Preparing / Ready"
            value={`${preparingOrders} / ${readyOrders}`}
            subtitle="Kitchen order progress"
            icon={ChefHat}
            color="purple"
          />
          <StatCard
            title="Paid Revenue"
            value={currency(todayRevenue)}
            subtitle="From paid orders"
            icon={IndianRupee}
            color="green"
          />
        </div>

        {/* Order status summary */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {["Pending", "Preparing", "Ready", "Completed", "Cancelled"].map(
            (status) => {
              const count = orders.filter((o) => o.status === status).length;
              return (
                <button
                  key={status}
                  onClick={() =>
                    setStatusFilter(statusFilter === status ? "All" : status)
                  }
                  className={`rounded-xl border bg-white p-3 text-left transition hover:border-blue-300 ${
                    statusFilter === status
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-slate-200"
                  }`}
                >
                  <p className="text-xs text-slate-500">{status}</p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {count}
                  </p>
                </button>
              );
            }
          )}
        </div>

        {/* Orders list */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">All Orders</h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage order details, payment and kitchen status.
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
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                />
              </div>

              <div className="relative">
                <Filter
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-40"
                >
                  <option value="All">All Types</option>
                  <option value="Dine-in">Dine-in</option>
                  <option value="Takeaway">Takeaway</option>
                  <option value="Room Service">Room Service</option>
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Statuses</option>
                {Object.keys(statusStyles).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Order ID</th>
                  <th className="px-4 py-3 font-semibold">Guest</th>
                  <th className="px-4 py-3 font-semibold">Order Type</th>
                  <th className="px-4 py-3 font-semibold">Items</th>
                  <th className="px-4 py-3 font-semibold">Amount</th>
                  <th className="px-4 py-3 font-semibold">Payment</th>
                  <th className="px-4 py-3 font-semibold">Order Status</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {order.id}
                      <p className="mt-1 text-xs font-normal text-slate-400">
                        {order.reference}
                      </p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {order.guest}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-slate-600">
                        {order.type === "Dine-in" ? (
                          <Armchair size={15} />
                        ) : order.type === "Room Service" ? (
                          <BedDouble size={15} />
                        ) : (
                          <ShoppingBag size={15} />
                        )}
                        {order.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {currency(getTotals(order).total)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.payment}
                        onChange={(e) =>
                          updatePaymentStatus(order.id, e.target.value)
                        }
                        className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${paymentStyles[order.payment]}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value)
                        }
                        className={`rounded-full border px-2.5 py-1 text-xs font-semibold outline-none ${statusStyles[order.status]}`}
                      >
                        {Object.keys(statusStyles).map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View order"
                          onClick={() => setViewOrder(order)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit order"
                          onClick={() => openEditOrder(order)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title="Print bill"
                          onClick={() => printBill(order)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <Printer size={16} />
                        </button>
                        <button
                          title="Delete order"
                          onClick={() => {
                            if (window.confirm(`Delete ${order.id}?`)) {
                              setOrders((prev) =>
                                prev.filter((o) => o.id !== order.id)
                              );
                            }
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-4 py-12 text-center text-slate-500"
                    >
                      <ShoppingBag
                        size={30}
                        className="mx-auto mb-2 text-slate-300"
                      />
                      No orders found. Try changing your search or filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
                setTypeFilter("All");
              }}
              className="inline-flex items-center gap-1 self-start font-medium text-blue-600 hover:text-blue-700 sm:self-auto"
            >
              <RefreshCw size={13} />
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Create / Edit Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Order" : "Create New Order"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter guest details and add food items to the order.
                </p>
              </div>
              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveOrder} className="overflow-y-auto">
              <div className="space-y-5 p-5">
                {/* Guest and order details */}
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Order Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Guest Name *
                      </label>
                      <input
                        required
                        value={form.guest}
                        onChange={(e) => updateForm("guest", e.target.value)}
                        placeholder="Enter guest name"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Order Type *
                      </label>
                      <select
                        value={form.type}
                        onChange={(e) => {
                          const type = e.target.value;
                          updateForm("type", type);
                          updateForm(
                            "reference",
                            type === "Dine-in"
                              ? "Table 01"
                              : type === "Room Service"
                              ? "Room 101"
                              : "Takeaway"
                          );
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      >
                        <option>Dine-in</option>
                        <option>Takeaway</option>
                        <option>Room Service</option>
                      </select>
                    </div>

                    {form.type !== "Takeaway" && (
                      <div>
                        <label className="mb-1.5 block text-xs font-medium text-slate-600">
                          {form.type === "Dine-in" ? "Table Number" : "Room Number"}
                        </label>
                        <select
                          value={form.reference}
                          onChange={(e) =>
                            updateForm("reference", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        >
                          {(
                            form.type === "Dine-in"
                              ? ["Table 01", "Table 02", "Table 03", "Table 04", "Table 05", "Table 06"]
                              : ["Room 101", "Room 102", "Room 103", "Room 201", "Room 202", "Room 203"]
                          ).map((ref) => (
                            <option key={ref}>{ref}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Payment Status
                      </label>
                      <select
                        value={form.payment}
                        onChange={(e) => updateForm("payment", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      >
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Refunded</option>
                      </select>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Order Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) => updateForm("status", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      >
                        {Object.keys(statusStyles).map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Add food items */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Food Items
                    </h3>
                    <span className="text-xs text-slate-400">
                      {form.items.length} different items
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedMenuItem}
                      onChange={(e) => setSelectedMenuItem(e.target.value)}
                      className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="">Select food item to add</option>
                      {menuItems.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} — {currency(item.price)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={addMenuItem}
                      disabled={!selectedMenuItem}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <div className="grid grid-cols-12 bg-slate-50 px-3 py-2.5 text-xs font-semibold text-slate-500">
                      <span className="col-span-5">Item</span>
                      <span className="col-span-2 text-right">Price</span>
                      <span className="col-span-3 text-center">Quantity</span>
                      <span className="col-span-2 text-right">Total</span>
                    </div>

                    {form.items.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-400">
                        No food items added yet.
                      </div>
                    ) : (
                      form.items.map((item) => (
                        <div
                          key={item.id}
                          className="grid grid-cols-12 items-center border-t border-slate-100 px-3 py-3"
                        >
                          <div className="col-span-5 min-w-0">
                            <p className="truncate text-sm font-medium text-slate-800">
                              {item.name}
                            </p>
                          </div>
                          <div className="col-span-2 text-right text-xs text-slate-600">
                            {currency(item.price)}
                          </div>
                          <div className="col-span-3 flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, -1)}
                              className="rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-100"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-4 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => changeQuantity(item.id, 1)}
                              className="rounded-md border border-slate-200 p-1 text-slate-600 hover:bg-slate-100"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <div className="col-span-2 text-right text-sm font-semibold text-slate-800">
                            {currency(item.price * item.quantity)}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Discount and totals */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-slate-800">
                      Additional Details
                    </h3>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-slate-600">
                        Special Instructions
                      </label>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(e) => updateForm("notes", e.target.value)}
                        placeholder="Add food preferences or special instructions..."
                        className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <h3 className="mb-3 text-sm font-semibold text-slate-800">
                      Bill Summary
                    </h3>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">Subtotal</span>
                        <span className="text-sm font-medium text-slate-800">
                          {currency(formTotals.subtotal)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm text-slate-500">
                          Discount (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={formTotals.subtotal}
                          value={form.discount}
                          onChange={(e) =>
                            updateForm(
                              "discount",
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-28 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm text-slate-500">
                          Tax (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={form.taxRate}
                          onChange={(e) =>
                            updateForm(
                              "taxRate",
                              Math.max(0, Number(e.target.value))
                            )
                          }
                          className="w-28 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-right text-sm outline-none focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-500">Tax amount</span>
                        <span className="text-sm font-medium text-slate-800">
                          {currency(formTotals.tax)}
                        </span>
                      </div>

                      <div className="border-t border-slate-200 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">
                            Grand Total
                          </span>
                          <span className="text-xl font-bold text-blue-600">
                            {currency(formTotals.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <CheckCircle2 size={16} />
                  {editingId ? "Update Order" : "Create Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Order Details</h2>
                <p className="mt-1 text-xs text-blue-600">{viewOrder.id}</p>
              </div>
              <button
                onClick={() => setViewOrder(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-400">Guest</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {viewOrder.guest}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Order Type</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {viewOrder.type}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Table / Room</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {viewOrder.reference}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {formatDate(viewOrder.date)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200">
                <div className="border-b border-slate-100 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500">
                  ORDER ITEMS
                </div>
                {viewOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between gap-3 border-b border-slate-100 px-3 py-3 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.quantity} × {currency(item.price)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      {currency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 rounded-xl bg-slate-50 p-4">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span>{currency(getTotals(viewOrder).subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Discount</span>
                  <span>- {currency(getTotals(viewOrder).discount)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Tax</span>
                  <span>{currency(getTotals(viewOrder).tax)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900">
                  <span>Total</span>
                  <span>{currency(getTotals(viewOrder).total)}</span>
                </div>
              </div>

              {viewOrder.notes && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Instructions:</strong> {viewOrder.notes}
                </div>
              )}

              <div className="flex flex-wrap gap-2 text-xs">
                <span
                  className={`rounded-full px-3 py-1.5 font-semibold ${paymentStyles[viewOrder.payment]}`}
                >
                  Payment: {viewOrder.payment}
                </span>
                <span
                  className={`rounded-full border px-3 py-1.5 font-semibold ${statusStyles[viewOrder.status]}`}
                >
                  {viewOrder.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={() => printBill(viewOrder)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Printer size={16} />
                Print Bill
              </button>
              <button
                onClick={() => setViewOrder(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Print-only bill */}
      {selectedOrder && (
        <div id="restaurant-print-bill" className="hidden">
          <div className="mx-auto max-w-2xl">
            <div className="border-b-2 border-black pb-4 text-center">
              <h1 className="text-2xl font-bold">STAYFLOW HOTEL</h1>
              <p className="mt-1 text-sm">Restaurant Tax Invoice</p>
              <p className="mt-1 text-xs">Thank you for dining with us!</p>
            </div>

            <div className="mt-5 flex justify-between text-sm">
              <div>
                <p><strong>Order:</strong> {selectedOrder.id}</p>
                <p><strong>Guest:</strong> {selectedOrder.guest}</p>
                <p><strong>Type:</strong> {selectedOrder.type}</p>
                <p><strong>Table / Room:</strong> {selectedOrder.reference}</p>
              </div>
              <div className="text-right">
                <p><strong>Date:</strong> {formatDate(selectedOrder.date)}</p>
                <p><strong>Payment:</strong> {selectedOrder.payment}</p>
              </div>
            </div>

            <table className="mt-6 w-full border-collapse text-sm">
              <thead>
                <tr className="border-y border-black">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-300">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{currency(item.price)}</td>
                    <td className="py-2 text-right">
                      {currency(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ml-auto mt-5 w-64 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{currency(getTotals(selectedOrder).subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>- {currency(getTotals(selectedOrder).discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax ({selectedOrder.taxRate}%)</span>
                <span>{currency(getTotals(selectedOrder).tax)}</span>
              </div>
              <div className="flex justify-between border-t border-black pt-2 text-base font-bold">
                <span>Grand Total</span>
                <span>{currency(getTotals(selectedOrder).total)}</span>
              </div>
            </div>

            {selectedOrder.notes && (
              <p className="mt-5 text-sm">
                <strong>Special instructions:</strong> {selectedOrder.notes}
              </p>
            )}

            <div className="mt-12 border-t border-slate-300 pt-4 text-center text-xs">
              <p>Generated by StayFlow Hotel Management System</p>
              <p className="mt-1">Please visit us again.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}