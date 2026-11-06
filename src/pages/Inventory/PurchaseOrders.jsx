
import { useMemo, useState } from "react";
import {
  ShoppingCart,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  Truck,
  CalendarDays,
  Package,
  IndianRupee,
  CheckCircle2,
  Clock,
  ClipboardList,
  Save,
  Download,
  Check,
  AlertCircle,
  Boxes,
} from "lucide-react";

const suppliers = [
  { id: "SUP-001", name: "Sharma Food Suppliers", contact: "Rajesh Sharma" },
  { id: "SUP-002", name: "Fresh Mart Distributors", contact: "Amit Verma" },
  { id: "SUP-003", name: "CleanPro India", contact: "Priya Mehta" },
  { id: "SUP-004", name: "Hotel Linen House", contact: "Suresh Kumar" },
  { id: "SUP-005", name: "Guest Essentials Co.", contact: "Neha Gupta" },
];

const inventoryItems = [
  { id: "ITEM-001", name: "Basmati Rice", sku: "FOOD-001", unit: "kg", price: 95, tax: 5 },
  { id: "ITEM-002", name: "Cooking Oil", sku: "FOOD-002", unit: "litre", price: 145, tax: 5 },
  { id: "ITEM-003", name: "All Purpose Flour", sku: "FOOD-003", unit: "kg", price: 48, tax: 5 },
  { id: "ITEM-004", name: "Floor Cleaner", sku: "CLN-001", unit: "litre", price: 120, tax: 18 },
  { id: "ITEM-005", name: "Bath Towels", sku: "LIN-001", unit: "piece", price: 280, tax: 12 },
  { id: "ITEM-006", name: "Shampoo Bottles", sku: "GST-001", unit: "piece", price: 18, tax: 18 },
  { id: "ITEM-007", name: "Hand Wash", sku: "CLN-002", unit: "litre", price: 95, tax: 18 },
  { id: "ITEM-008", name: "Tea Leaves", sku: "FOOD-004", unit: "kg", price: 420, tax: 5 },
];

const initialOrders = [
  {
    id: "PO-2026-001",
    supplierId: "SUP-001",
    supplier: "Sharma Food Suppliers",
    orderDate: "2026-11-01",
    expectedDate: "2026-11-08",
    status: "Received",
    approval: "Approved",
    notes: "Monthly kitchen stock replenishment.",
    taxRate: 5,
    items: [
      { itemId: "ITEM-001", name: "Basmati Rice", sku: "FOOD-001", unit: "kg", quantity: 100, received: 100, price: 95, tax: 5 },
      { itemId: "ITEM-003", name: "All Purpose Flour", sku: "FOOD-003", unit: "kg", quantity: 50, received: 50, price: 48, tax: 5 },
    ],
    createdBy: "Admin",
  },
  {
    id: "PO-2026-002",
    supplierId: "SUP-002",
    supplier: "Fresh Mart Distributors",
    orderDate: "2026-11-03",
    expectedDate: "2026-11-10",
    status: "Ordered",
    approval: "Approved",
    notes: "Kitchen supplies.",
    taxRate: 5,
    items: [
      { itemId: "ITEM-002", name: "Cooking Oil", sku: "FOOD-002", unit: "litre", quantity: 80, received: 0, price: 145, tax: 5 },
      { itemId: "ITEM-008", name: "Tea Leaves", sku: "FOOD-004", unit: "kg", quantity: 10, received: 0, price: 420, tax: 5 },
    ],
    createdBy: "Admin",
  },
  {
    id: "PO-2026-003",
    supplierId: "SUP-003",
    supplier: "CleanPro India",
    orderDate: "2026-11-04",
    expectedDate: "2026-11-07",
    status: "Partially Received",
    approval: "Approved",
    notes: "Cleaning supplies.",
    taxRate: 18,
    items: [
      { itemId: "ITEM-004", name: "Floor Cleaner", sku: "CLN-001", unit: "litre", quantity: 30, received: 15, price: 120, tax: 18 },
      { itemId: "ITEM-007", name: "Hand Wash", sku: "CLN-002", unit: "litre", quantity: 20, received: 20, price: 95, tax: 18 },
    ],
    createdBy: "Admin",
  },
  {
    id: "PO-2026-004",
    supplierId: "SUP-004",
    supplier: "Hotel Linen House",
    orderDate: "2026-11-05",
    expectedDate: "2026-11-15",
    status: "Pending Approval",
    approval: "Pending",
    notes: "Replacement linen stock.",
    taxRate: 12,
    items: [
      { itemId: "ITEM-005", name: "Bath Towels", sku: "LIN-001", unit: "piece", quantity: 40, received: 0, price: 280, tax: 12 },
    ],
    createdBy: "Admin",
  },
];

const emptyItem = {
  itemId: "",
  name: "",
  sku: "",
  unit: "",
  quantity: 1,
  received: 0,
  price: 0,
  tax: 0,
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0);

const getSubtotal = (items) =>
  items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );

const getTax = (items) =>
  items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity || 0) *
        Number(item.price || 0) *
        Number(item.tax || 0)) /
        100,
    0
  );

const getTotal = (items) => getSubtotal(items) + getTax(items);

function StatusBadge({ status }) {
  const styles = {
    Draft: "bg-slate-100 text-slate-700",
    "Pending Approval": "bg-amber-50 text-amber-700",
    Approved: "bg-blue-50 text-blue-700",
    Ordered: "bg-indigo-50 text-indigo-700",
    "Partially Received": "bg-orange-50 text-orange-700",
    Received: "bg-emerald-50 text-emerald-700",
    Cancelled: "bg-red-50 text-red-700",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-600"}`}>
      {status}
    </span>
  );
}

function Field({ label, children, required = false }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
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
        <div className={`rounded-xl p-3 ${styles[color]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [supplierFilter, setSupplierFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [modal, setModal] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    supplierId: "",
    orderDate: "2026-11-06",
    expectedDate: "",
    status: "Draft",
    notes: "",
    items: [{ ...emptyItem }],
  });

  const [receiveItems, setReceiveItems] = useState([]);
  const [receiveNote, setReceiveNote] = useState("");

  const pendingCount = orders.filter(
    (order) => order.status === "Pending Approval"
  ).length;

  const activeCount = orders.filter((order) =>
    ["Approved", "Ordered", "Partially Received"].includes(order.status)
  ).length;

  const receivedCount = orders.filter(
    (order) => order.status === "Received"
  ).length;

  const totalValue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + getTotal(order.items), 0);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        order.supplier.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;

      const matchesSupplier =
        supplierFilter === "All" || order.supplierId === supplierFilter;

      const matchesDate = !dateFilter || order.orderDate === dateFilter;

      return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
    });
  }, [orders, search, statusFilter, supplierFilter, dateFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const createOrderId = () => {
    const next = orders.length + 1;
    return `PO-2026-${String(next).padStart(3, "0")}`;
  };

  const openCreate = () => {
    setSelectedOrder(null);
    setForm({
      supplierId: "",
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDate: "",
      status: "Draft",
      notes: "",
      items: [{ ...emptyItem }],
    });
    setModal("form");
  };

  const openEdit = (order) => {
    setSelectedOrder(order);
    setForm({
      supplierId: order.supplierId,
      orderDate: order.orderDate,
      expectedDate: order.expectedDate,
      status: order.status,
      notes: order.notes || "",
      items: order.items.map((item) => ({ ...item })),
    });
    setModal("form");
  };

  const updateItem = (index, key, value) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const selectInventoryItem = (index, itemId) => {
    const selected = inventoryItems.find((item) => item.id === itemId);

    if (!selected) {
      updateItem(index, "itemId", "");
      return;
    }

    setForm((previous) => ({
      ...previous,
      items: previous.items.map((item, i) =>
        i === index
          ? {
              ...item,
              itemId: selected.id,
              name: selected.name,
              sku: selected.sku,
              unit: selected.unit,
              price: selected.price,
              tax: selected.tax,
            }
          : item
      ),
    }));
  };

  const addItemRow = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItem }],
    }));
  };

  const removeItemRow = (index) => {
    setForm((previous) => ({
      ...previous,
      items:
        previous.items.length === 1
          ? previous.items
          : previous.items.filter((_, i) => i !== index),
    }));
  };

  const saveOrder = (event) => {
    event.preventDefault();

    const supplier = suppliers.find((entry) => entry.id === form.supplierId);

    if (!supplier) {
      showMessage("Please select a supplier.");
      return;
    }

    if (!form.expectedDate) {
      showMessage("Please select an expected delivery date.");
      return;
    }

    if (form.expectedDate < form.orderDate) {
      showMessage("Expected delivery date cannot be before the order date.");
      return;
    }

    if (
      form.items.some(
        (item) =>
          !item.itemId ||
          Number(item.quantity) <= 0 ||
          Number(item.price) < 0 ||
          Number(item.tax) < 0
      )
    ) {
      showMessage("Please select valid items and enter quantities and prices.");
      return;
    }

    const uniqueItems = new Set(form.items.map((item) => item.itemId));

    if (uniqueItems.size !== form.items.length) {
      showMessage("An item can only be added once per purchase order.");
      return;
    }

    const approval =
      form.status === "Draft"
        ? "Not Submitted"
        : form.status === "Pending Approval"
          ? "Pending"
          : ["Approved", "Ordered", "Partially Received", "Received"].includes(form.status)
            ? "Approved"
            : "Not Applicable";

    if (selectedOrder) {
      setOrders((previous) =>
        previous.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                ...form,
                supplier: supplier.name,
                approval,
                items: form.items.map((item) => ({
                  ...item,
                  quantity: Number(item.quantity),
                  price: Number(item.price),
                  tax: Number(item.tax),
                  received: item.received || 0,
                })),
              }
            : order
        )
      );
      showMessage("Purchase order updated successfully.");
    } else {
      const newOrder = {
        id: createOrderId(),
        ...form,
        supplier: supplier.name,
        approval,
        createdBy: "Admin",
        items: form.items.map((item) => ({
          ...item,
          quantity: Number(item.quantity),
          price: Number(item.price),
          tax: Number(item.tax),
          received: 0,
        })),
      };

      setOrders((previous) => [newOrder, ...previous]);
      showMessage("Purchase order created successfully.");
    }

    setModal("");
  };

  const updateStatus = (order, status) => {
    const approval =
      status === "Pending Approval"
        ? "Pending"
        : ["Approved", "Ordered", "Partially Received", "Received"].includes(status)
          ? "Approved"
          : status === "Draft"
            ? "Not Submitted"
            : "Not Applicable";

    setOrders((previous) =>
      previous.map((entry) =>
        entry.id === order.id ? { ...entry, status, approval } : entry
      )
    );

    if (selectedOrder?.id === order.id) {
      setSelectedOrder({ ...order, status, approval });
    }

    showMessage(`${order.id} status changed to ${status}.`);
  };

  const approveOrder = (order) => {
    updateStatus(order, "Approved");
  };

  const openReceive = (order) => {
    setSelectedOrder(order);
    setReceiveItems(order.items.map((item) => ({
      ...item,
      receivedNow: 0,
    })));
    setReceiveNote("");
    setModal("receive");
  };

  const saveReceivedItems = (event) => {
    event.preventDefault();

    const hasReceived = receiveItems.some(
      (item) => Number(item.receivedNow) > 0
    );

    if (!hasReceived) {
      showMessage("Enter at least one received quantity.");
      return;
    }

    const invalid = receiveItems.some(
      (item) =>
        Number(item.receivedNow) < 0 ||
        Number(item.received) + Number(item.receivedNow) >
          Number(item.quantity)
    );

    if (invalid) {
      showMessage("Received quantities cannot exceed ordered quantities.");
      return;
    }

    const updatedItems = receiveItems.map((item) => ({
      itemId: item.itemId,
      name: item.name,
      sku: item.sku,
      unit: item.unit,
      quantity: Number(item.quantity),
      received:
        Number(item.received) + Number(item.receivedNow),
      price: Number(item.price),
      tax: Number(item.tax),
    }));

    const allReceived = updatedItems.every(
      (item) => item.received >= item.quantity
    );

    const anyReceived = updatedItems.some((item) => item.received > 0);

    const newStatus = allReceived
      ? "Received"
      : anyReceived
        ? "Partially Received"
        : "Ordered";

    setOrders((previous) =>
      previous.map((order) =>
        order.id === selectedOrder.id
          ? {
              ...order,
              items: updatedItems,
              status: newStatus,
              approval: "Approved",
              receivingNote: receiveNote,
              lastReceivedDate: new Date().toISOString().slice(0, 10),
            }
          : order
      )
    );

    setModal("");
    showMessage("Received quantities recorded successfully.");
  };

  const openDetails = (order) => {
    setSelectedOrder(order);
    setModal("details");
  };

  const deleteOrder = () => {
    if (!deleteTarget) return;

    setOrders((previous) =>
      previous.filter((order) => order.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Purchase order deleted.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSupplierFilter("All");
    setDateFilter("");
  };

  const exportOrders = () => {
    const headers = [
      "PO Number",
      "Supplier",
      "Order Date",
      "Expected Date",
      "Status",
      "Subtotal",
      "Tax",
      "Total",
    ];

    const rows = filteredOrders.map((order) => [
      order.id,
      order.supplier,
      order.orderDate,
      order.expectedDate,
      order.status,
      getSubtotal(order.items).toFixed(2),
      getTax(order.items).toFixed(2),
      getTotal(order.items).toFixed(2),
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
    link.download = "purchase-orders.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ShoppingCart size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Purchase Orders
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Create, approve and track inventory purchases from suppliers.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportOrders}
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={openCreate}
              className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Purchase Order
            </button>
          </div>
        </div>

        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {notification}
            <button onClick={() => setNotification("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Purchase Value"
            value={currency(totalValue)}
            subtitle="Excluding cancelled orders"
            icon={IndianRupee}
            color="blue"
          />
          <StatCard
            title="Pending Approval"
            value={pendingCount}
            subtitle="Orders awaiting approval"
            icon={Clock}
            color="amber"
          />
          <StatCard
            title="Active Orders"
            value={activeCount}
            subtitle="Approved and in progress"
            icon={Truck}
            color="purple"
          />
          <StatCard
            title="Received Orders"
            value={receivedCount}
            subtitle="Fully delivered orders"
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Workflow */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-3 font-semibold text-slate-800">Purchase Workflow</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {[
              ["Draft", "Create order"],
              ["Pending Approval", "Submit for approval"],
              ["Approved", "Authorize purchase"],
              ["Ordered", "Supplier delivery"],
              ["Received", "Confirm stock received"],
            ].map(([status, description], index) => (
              <div key={status} className="flex items-start gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                  {index + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{status}</p>
                  <p className="mt-1 text-xs text-slate-400">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative xl:col-span-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search PO or supplier..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Statuses</option>
              {[
                "Draft",
                "Pending Approval",
                "Approved",
                "Ordered",
                "Partially Received",
                "Received",
                "Cancelled",
              ].map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Suppliers</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className={inputClass}
              aria-label="Filter by order date"
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredOrders.length} of {orders.length} purchase orders
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">Purchase Order List</h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage purchase requests, supplier deliveries and received stock.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredOrders.length} orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">PO Number</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Order Date</th>
                  <th className="px-4 py-3">Expected Delivery</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Total Amount</th>
                  <th className="px-4 py-3">Approval</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-blue-600">{order.id}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {order.createdBy || "Admin"}
                      </p>
                    </td>

                    <td className="px-4 py-3 font-medium text-slate-800">
                      {order.supplier}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {order.orderDate}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {order.expectedDate}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {order.items.length} items
                      </span>
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {currency(getTotal(order.items))}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold ${
                        order.approval === "Approved"
                          ? "text-emerald-600"
                          : order.approval === "Pending"
                            ? "text-amber-600"
                            : "text-slate-500"
                      }`}>
                        {order.approval}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View order"
                          onClick={() => openDetails(order)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>

                        {["Draft", "Pending Approval"].includes(order.status) && (
                          <button
                            title="Edit order"
                            onClick={() => openEdit(order)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        {order.status === "Pending Approval" && (
                          <button
                            title="Approve order"
                            onClick={() => approveOrder(order)}
                            className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {["Approved", "Ordered", "Partially Received"].includes(order.status) && (
                          <button
                            title="Record received stock"
                            onClick={() => openReceive(order)}
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Boxes size={16} />
                          </button>
                        )}

                        {!["Received", "Cancelled"].includes(order.status) && (
                          <button
                            title="Delete order"
                            onClick={() => setDeleteTarget(order)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <ClipboardList size={35} className="mx-auto text-slate-300" />
                      <p className="mt-2 font-semibold text-slate-700">
                        No purchase orders found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing the filters or create a purchase order.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create / Edit Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedOrder ? "Edit Purchase Order" : "Create Purchase Order"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Select a supplier and add the items you want to purchase.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveOrder} className="space-y-5 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <Field label="Supplier" required>
                    <select
                      required
                      value={form.supplierId}
                      onChange={(e) => setForm({ ...form, supplierId: e.target.value })}
                      className={inputClass}
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                          {supplier.name}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Order Date" required>
                    <input
                      type="date"
                      required
                      value={form.orderDate}
                      onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Expected Delivery Date" required>
                    <input
                      type="date"
                      required
                      min={form.orderDate}
                      value={form.expectedDate}
                      onChange={(e) => setForm({ ...form, expectedDate: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Order Status">
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      className={inputClass}
                    >
                      <option>Draft</option>
                      <option>Pending Approval</option>
                    </select>
                  </Field>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">Purchase Items</h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Select inventory items and enter quantity, price and tax.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addItemRow}
                      className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {form.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 p-3"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-700">
                            Item {index + 1}
                          </p>
                          <button
                            type="button"
                            disabled={form.items.length === 1}
                            onClick={() => removeItemRow(index)}
                            className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                          <div className="sm:col-span-2 lg:col-span-2">
                            <Field label="Inventory Item" required>
                              <select
                                required
                                value={item.itemId}
                                onChange={(e) => selectInventoryItem(index, e.target.value)}
                                className={inputClass}
                              >
                                <option value="">Select item</option>
                                {inventoryItems.map((entry) => (
                                  <option key={entry.id} value={entry.id}>
                                    {entry.name} ({entry.sku})
                                  </option>
                                ))}
                              </select>
                            </Field>
                          </div>

                          <Field label="Quantity" required>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              required
                              value={item.quantity}
                              onChange={(e) => updateItem(index, "quantity", e.target.value)}
                              className={inputClass}
                            />
                          </Field>

                          <Field label={`Unit Price (${item.unit || "unit"})`} required>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              required
                              value={item.price}
                              onChange={(e) => updateItem(index, "price", e.target.value)}
                              className={inputClass}
                            />
                          </Field>

                          <Field label="Tax (%)">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.01"
                              value={item.tax}
                              onChange={(e) => updateItem(index, "tax", e.target.value)}
                              className={inputClass}
                            />
                          </Field>
                        </div>

                        <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                          <span className="text-slate-500">
                            SKU: {item.sku || "Select an item"}
                          </span>
                          <span className="font-semibold text-slate-700">
                            Line Total: {currency(
                              Number(item.quantity || 0) *
                              Number(item.price || 0) *
                              (1 + Number(item.tax || 0) / 100)
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <Field label="Purchase Notes">
                    <textarea
                      rows={4}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Add delivery instructions or purchase notes..."
                      className={inputClass}
                    />
                  </Field>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <h3 className="mb-3 font-semibold text-slate-800">
                      Order Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>{currency(getSubtotal(form.items))}</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Tax</span>
                        <span>{currency(getTax(form.items))}</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900">
                        <span>Grand Total</span>
                        <span>{currency(getTotal(form.items))}</span>
                      </div>
                    </div>
                    <p className="mt-3 text-xs text-slate-400">
                      Tax is calculated individually using each item's tax rate.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    {selectedOrder ? "Save Changes" : "Create Purchase Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Order Details */}
        {modal === "details" && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedOrder.id}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">Purchase order details</p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-400">Supplier</p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {selectedOrder.supplier}
                    </h3>
                  </div>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    ["Order Date", selectedOrder.orderDate],
                    ["Expected Delivery", selectedOrder.expectedDate],
                    ["Approval", selectedOrder.approval],
                    ["Created By", selectedOrder.createdBy || "Admin"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="mb-3 font-semibold text-slate-800">Ordered Items</h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full min-w-[650px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs text-slate-500">
                        <tr>
                          <th className="px-3 py-3">Item</th>
                          <th className="px-3 py-3">Quantity</th>
                          <th className="px-3 py-3">Received</th>
                          <th className="px-3 py-3">Unit Price</th>
                          <th className="px-3 py-3">Tax</th>
                          <th className="px-3 py-3">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedOrder.items.map((item) => (
                          <tr key={item.itemId}>
                            <td className="px-3 py-3">
                              <p className="font-semibold text-slate-800">{item.name}</p>
                              <p className="text-xs text-slate-400">{item.sku}</p>
                            </td>
                            <td className="px-3 py-3">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-3 py-3">
                              <span className="font-semibold text-emerald-700">
                                {item.received} / {item.quantity}
                              </span>
                            </td>
                            <td className="px-3 py-3">{currency(item.price)}</td>
                            <td className="px-3 py-3">{item.tax}%</td>
                            <td className="px-3 py-3 font-semibold">
                              {currency(
                                item.quantity * item.price * (1 + item.tax / 100)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="ml-auto max-w-sm space-y-2 rounded-xl bg-slate-50 p-4">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Subtotal</span>
                    <span>{currency(getSubtotal(selectedOrder.items))}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Tax</span>
                    <span>{currency(getTax(selectedOrder.items))}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-3 font-bold text-slate-900">
                    <span>Grand Total</span>
                    <span>{currency(getTotal(selectedOrder.items))}</span>
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">Notes</h3>
                    <p className="mt-1 text-sm text-slate-600">{selectedOrder.notes}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  {selectedOrder.status === "Pending Approval" && (
                    <button
                      onClick={() => {
                        approveOrder(selectedOrder);
                        setModal("");
                      }}
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Check size={16} />
                      Approve Order
                    </button>
                  )}

                  {["Approved", "Ordered", "Partially Received"].includes(selectedOrder.status) && (
                    <button
                      onClick={() => openReceive(selectedOrder)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <Boxes size={16} />
                      Receive Items
                    </button>
                  )}

                  {["Draft", "Pending Approval"].includes(selectedOrder.status) && (
                    <button
                      onClick={() => openEdit(selectedOrder)}
                      className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                    >
                      <Pencil size={16} />
                      Edit Order
                    </button>
                  )}

                  <button
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Receive Stock Modal */}
        {modal === "receive" && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Receive Purchase Items
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedOrder.id} · {selectedOrder.supplier}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveReceivedItems} className="space-y-4 p-5">
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-800">
                  Enter the quantities received in this delivery. You can record
                  partial deliveries more than once.
                </div>

                <div className="space-y-3">
                  {receiveItems.map((item, index) => {
                    const remaining = item.quantity - item.received;

                    return (
                      <div key={item.itemId} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-slate-800">{item.name}</p>
                            <p className="mt-1 text-xs text-slate-400">{item.sku}</p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                            Remaining: {remaining} {item.unit}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-500">Ordered</p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Previously Received</p>
                            <p className="mt-1 font-semibold text-emerald-700">
                              {item.received} {item.unit}
                            </p>
                          </div>
                          <Field label="Received Now">
                            <input
                              type="number"
                              min="0"
                              max={remaining}
                              step="1"
                              value={item.receivedNow}
                              disabled={remaining === 0}
                              onChange={(e) =>
                                setReceiveItems((previous) =>
                                  previous.map((entry, i) =>
                                    i === index
                                      ? { ...entry, receivedNow: e.target.value }
                                      : entry
                                  )
                                )
                              }
                              className={inputClass}
                            />
                          </Field>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Field label="Receiving Notes">
                  <textarea
                    rows={2}
                    value={receiveNote}
                    onChange={(e) => setReceiveNote(e.target.value)}
                    placeholder="Delivery condition, invoice number or remarks..."
                    className={inputClass}
                  />
                </Field>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2 size={16} />
                    Confirm Received Items
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Delete Purchase Order?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete <strong>{deleteTarget.id}</strong>?
                This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteOrder}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
