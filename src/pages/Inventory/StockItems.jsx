
import { useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingUp,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
  CalendarDays,
  MapPin,
  Truck,
  Save,
  ChevronDown,
} from "lucide-react";

const initialItems = [
  {
    id: "ITM-001",
    name: "Basmati Rice",
    sku: "FD-001",
    category: "Food Ingredients",
    unit: "kg",
    quantity: 85,
    minimum: 30,
    price: 95,
    location: "Main Store",
    supplier: "Sharma Food Suppliers",
    expiry: "2027-06-30",
    description: "Premium quality long-grain basmati rice.",
    history: [
      { id: 1, type: "Purchase", quantity: 100, date: "2026-11-01", note: "Purchase received" },
      { id: 2, type: "Consumption", quantity: -15, date: "2026-11-04", note: "Kitchen consumption" },
    ],
  },
  {
    id: "ITM-002",
    name: "Cooking Oil",
    sku: "FD-002",
    category: "Food Ingredients",
    unit: "L",
    quantity: 12,
    minimum: 25,
    price: 145,
    location: "Kitchen Store",
    supplier: "Fresh Mart Distributors",
    expiry: "2027-02-15",
    description: "Refined cooking oil.",
    history: [
      { id: 1, type: "Purchase", quantity: 30, date: "2026-10-25", note: "Purchase received" },
      { id: 2, type: "Consumption", quantity: -18, date: "2026-11-03", note: "Kitchen consumption" },
    ],
  },
  {
    id: "ITM-003",
    name: "All Purpose Flour",
    sku: "FD-003",
    category: "Food Ingredients",
    unit: "kg",
    quantity: 45,
    minimum: 20,
    price: 42,
    location: "Main Store",
    supplier: "Sharma Food Suppliers",
    expiry: "2027-04-20",
    description: "Multi-purpose wheat flour.",
    history: [],
  },
  {
    id: "ITM-004",
    name: "Floor Cleaner",
    sku: "HK-001",
    category: "Cleaning Supplies",
    unit: "L",
    quantity: 8,
    minimum: 15,
    price: 110,
    location: "Housekeeping Store",
    supplier: "CleanPro India",
    expiry: "",
    description: "Concentrated floor cleaning liquid.",
    history: [],
  },
  {
    id: "ITM-005",
    name: "Bath Towels",
    sku: "LN-001",
    category: "Linen",
    unit: "pcs",
    quantity: 120,
    minimum: 40,
    price: 280,
    location: "Linen Store",
    supplier: "Hotel Linen House",
    expiry: "",
    description: "Premium white hotel bath towels.",
    history: [],
  },
  {
    id: "ITM-006",
    name: "Shampoo Bottles",
    sku: "TO-001",
    category: "Toiletries",
    unit: "pcs",
    quantity: 0,
    minimum: 50,
    price: 18,
    location: "Housekeeping Store",
    supplier: "Guest Essentials Co.",
    expiry: "2027-01-15",
    description: "Guest room shampoo bottles.",
    history: [],
  },
  {
    id: "ITM-007",
    name: "Hand Wash",
    sku: "HK-002",
    category: "Cleaning Supplies",
    unit: "L",
    quantity: 18,
    minimum: 20,
    price: 85,
    location: "Main Store",
    supplier: "CleanPro India",
    expiry: "2027-03-10",
    description: "Liquid hand wash for guest areas.",
    history: [],
  },
  {
    id: "ITM-008",
    name: "Tea Leaves",
    sku: "FD-004",
    category: "Food Ingredients",
    unit: "kg",
    quantity: 32,
    minimum: 10,
    price: 360,
    location: "Kitchen Store",
    supplier: "Fresh Mart Distributors",
    expiry: "2027-08-10",
    description: "Premium tea leaves.",
    history: [],
  },
];

const suppliers = [
  "Sharma Food Suppliers",
  "Fresh Mart Distributors",
  "CleanPro India",
  "Hotel Linen House",
  "Guest Essentials Co.",
];

const categories = [
  "Food Ingredients",
  "Cleaning Supplies",
  "Toiletries",
  "Linen",
  "Beverages",
  "Maintenance",
  "Other",
];

const locations = [
  "Main Store",
  "Kitchen Store",
  "Housekeeping Store",
  "Linen Store",
  "Floor 1 Store",
  "Floor 2 Store",
];

const emptyForm = {
  name: "",
  sku: "",
  category: "Food Ingredients",
  unit: "pcs",
  quantity: "",
  minimum: "",
  price: "",
  location: "Main Store",
  supplier: suppliers[0],
  expiry: "",
  description: "",
};

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const getStatus = (item) => {
  if (Number(item.quantity) <= 0) return "Out of Stock";
  if (Number(item.quantity) <= Number(item.minimum)) return "Low Stock";
  return "In Stock";
};

const statusStyle = {
  "In Stock": "bg-emerald-50 text-emerald-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
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
          <Icon size={22} />
        </div>
      </div>
    </div>
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

export default function StockItems() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [adjustment, setAdjustment] = useState({
    type: "Add Stock",
    quantity: "",
    note: "",
  });
  const [notification, setNotification] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const totalValue = items.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.price),
    0
  );

  const lowCount = items.filter(
    (item) => getStatus(item) === "Low Stock"
  ).length;

  const outCount = items.filter(
    (item) => getStatus(item) === "Out of Stock"
  ).length;

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const text =
        `${item.name} ${item.sku} ${item.supplier} ${item.location}`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (categoryFilter === "All" || item.category === categoryFilter) &&
        (statusFilter === "All" || getStatus(item) === statusFilter) &&
        (locationFilter === "All" || item.location === locationFilter)
      );
    });
  }, [items, search, categoryFilter, statusFilter, locationFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setSelectedItem(null);
    setModal("form");
  };

  const openEdit = (item) => {
    setSelectedItem(item);
    setForm({
      name: item.name,
      sku: item.sku,
      category: item.category,
      unit: item.unit,
      quantity: String(item.quantity),
      minimum: String(item.minimum),
      price: String(item.price),
      location: item.location,
      supplier: item.supplier,
      expiry: item.expiry || "",
      description: item.description || "",
    });
    setModal("form");
  };

  const saveItem = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.sku.trim() ||
      form.quantity === "" ||
      form.minimum === "" ||
      form.price === ""
    ) {
      showMessage("Please complete all required fields.");
      return;
    }

    if (
      Number(form.quantity) < 0 ||
      Number(form.minimum) < 0 ||
      Number(form.price) < 0
    ) {
      showMessage("Quantity, minimum stock and price cannot be negative.");
      return;
    }

    const duplicate = items.some(
      (item) =>
        item.sku.toLowerCase() === form.sku.trim().toLowerCase() &&
        item.id !== selectedItem?.id
    );

    if (duplicate) {
      showMessage("This SKU already exists. Please use a unique SKU.");
      return;
    }

    if (selectedItem) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === selectedItem.id
            ? {
                ...item,
                ...form,
                quantity: Number(form.quantity),
                minimum: Number(form.minimum),
                price: Number(form.price),
              }
            : item
        )
      );
      showMessage("Stock item updated successfully.");
    } else {
      const newItem = {
        id: `ITM-${String(Date.now()).slice(-6)}`,
        ...form,
        quantity: Number(form.quantity),
        minimum: Number(form.minimum),
        price: Number(form.price),
        history: [
          {
            id: Date.now(),
            type: "Opening Stock",
            quantity: Number(form.quantity),
            date: new Date().toISOString().slice(0, 10),
            note: "Initial stock entry",
          },
        ],
      };

      setItems((previous) => [newItem, ...previous]);
      showMessage("New stock item added successfully.");
    }

    setModal("");
  };

  const openAdjustment = (item) => {
    setSelectedItem(item);
    setAdjustment({
      type: "Add Stock",
      quantity: "",
      note: "",
    });
    setModal("adjust");
  };

  const saveAdjustment = (event) => {
    event.preventDefault();

    const amount = Number(adjustment.quantity);

    if (!Number.isFinite(amount) || amount <= 0) {
      showMessage("Enter a valid adjustment quantity.");
      return;
    }

    if (!adjustment.note.trim()) {
      showMessage("Please provide an adjustment reason.");
      return;
    }

    const delta =
      adjustment.type === "Add Stock"
        ? amount
        : -amount;

    const item = items.find((entry) => entry.id === selectedItem.id);

    if (!item) return;

    if (item.quantity + delta < 0) {
      showMessage("Insufficient stock. Quantity cannot become negative.");
      return;
    }

    const historyEntry = {
      id: Date.now(),
      type: adjustment.type,
      quantity: delta,
      date: new Date().toISOString().slice(0, 10),
      note: adjustment.note.trim(),
    };

    setItems((previous) =>
      previous.map((entry) =>
        entry.id === selectedItem.id
          ? {
              ...entry,
              quantity: entry.quantity + delta,
              history: [historyEntry, ...(entry.history || [])],
            }
          : entry
      )
    );

    setModal("");
    showMessage("Stock quantity adjusted successfully.");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setItems((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Stock item deleted.");
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setModal("details");
  };

  const openHistory = (item) => {
    setSelectedItem(item);
    setModal("history");
  };

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setStatusFilter("All");
    setLocationFilter("All");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Package size={23} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Stock Items
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Manage inventory items, stock quantities, suppliers and adjustments.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Stock Item
          </button>
        </div>

        {/* Notification */}
        {notification && (
          <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <span>{notification}</span>
            <button onClick={() => setNotification("")}>
              <X size={17} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Items"
            value={items.length}
            subtitle="Registered inventory items"
            icon={Boxes}
            color="blue"
          />
          <StatCard
            title="Total Stock Value"
            value={currency(totalValue)}
            subtitle="Current quantity × purchase price"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Low Stock"
            value={lowCount}
            subtitle="Below minimum threshold"
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Out of Stock"
            value={outCount}
            subtitle="Requires immediate replenishment"
            icon={XCircle}
            color="red"
          />
        </div>

        {/* Category Summary */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {categories.slice(0, 4).map((category) => {
            const count = items.filter(
              (item) => item.category === category
            ).length;

            return (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`rounded-xl border bg-white p-4 text-left transition hover:border-blue-300 ${
                  categoryFilter === category
                    ? "border-blue-400 ring-2 ring-blue-100"
                    : "border-slate-200"
                }`}
              >
                <p className="text-sm text-slate-500">{category}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {count}
                </p>
                <p className="mt-1 text-xs text-slate-400">Registered items</p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, SKU or supplier..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Stock Status</option>
              <option>In Stock</option>
              <option>Low Stock</option>
              <option>Out of Stock</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Locations</option>
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredItems.length} of {items.length} items
            </p>
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">Inventory List</h2>
              <p className="mt-1 text-xs text-slate-500">
                View and manage all registered stock items.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredItems.length} items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Item Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Minimum</th>
                  <th className="px-4 py-3">Purchase Price</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const status = getStatus(item);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.sku}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.category}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`font-semibold ${
                          status === "Out of Stock"
                            ? "text-red-600"
                            : status === "Low Stock"
                            ? "text-amber-600"
                            : "text-slate-800"
                        }`}>
                          {item.quantity} {item.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.minimum} {item.unit}
                      </td>

                      <td className="px-4 py-3 font-medium text-slate-700">
                        {currency(item.price)}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin size={13} className="text-slate-400" />
                          {item.location}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.supplier}
                      </td>

                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[status]}`}>
                          {status}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View details"
                            onClick={() => openDetails(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Adjust stock"
                            onClick={() => openAdjustment(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                          >
                            <ArrowLeftRightIcon />
                          </button>
                          <button
                            title="Stock history"
                            onClick={() => openHistory(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                          >
                            <History size={16} />
                          </button>
                          <button
                            title="Edit item"
                            onClick={() => openEdit(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Delete item"
                            onClick={() => setDeleteTarget(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <Package size={34} className="mx-auto text-slate-300" />
                      <p className="mt-2 font-semibold text-slate-700">
                        No inventory items found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters or add a new stock item.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedItem ? "Edit Stock Item" : "Add Stock Item"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter item and inventory information.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveItem} className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Item Name" required>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter item name"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="SKU / Item Code" required>
                      <input
                        required
                        value={form.sku}
                        onChange={(e) => setForm({ ...form, sku: e.target.value })}
                        placeholder="e.g. FD-001"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Category" required>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className={inputClass}
                      >
                        {categories.map((category) => (
                          <option key={category}>{category}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Unit" required>
                      <select
                        value={form.unit}
                        onChange={(e) => setForm({ ...form, unit: e.target.value })}
                        className={inputClass}
                      >
                        {["pcs", "kg", "g", "L", "ml", "box", "pack", "set", "roll", "bottle", "dozen"].map((unit) => (
                          <option key={unit}>{unit}</option>
                        ))}
                      </select>
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Description">
                        <textarea
                          rows={2}
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Add item description..."
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Stock & Pricing
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Current Quantity" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.quantity}
                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                        placeholder="0"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Minimum Stock Level" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.minimum}
                        onChange={(e) => setForm({ ...form, minimum: e.target.value })}
                        placeholder="0"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Purchase Price (₹)" required>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        required
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="0.00"
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Storage & Supplier
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Storage Location" required>
                      <select
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className={inputClass}
                      >
                        {locations.map((location) => (
                          <option key={location}>{location}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Supplier">
                      <select
                        value={form.supplier}
                        onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                        className={inputClass}
                      >
                        {suppliers.map((supplier) => (
                          <option key={supplier}>{supplier}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Expiry Date (if applicable)">
                      <input
                        type="date"
                        value={form.expiry}
                        onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setModal("")}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    {selectedItem ? "Save Changes" : "Add Item"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stock Adjustment Modal */}
        {modal === "adjust" && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Stock Adjustment
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedItem.name} · {selectedItem.sku}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveAdjustment} className="space-y-4 p-5">
                <div className="rounded-lg bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Current stock</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>

                <Field label="Adjustment Type" required>
                  <select
                    value={adjustment.type}
                    onChange={(e) => setAdjustment({ ...adjustment, type: e.target.value })}
                    className={inputClass}
                  >
                    <option>Add Stock</option>
                    <option>Remove Stock</option>
                  </select>
                </Field>

                <Field label={`Quantity (${selectedItem.unit})`} required>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    required
                    value={adjustment.quantity}
                    onChange={(e) => setAdjustment({ ...adjustment, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    className={inputClass}
                  />
                </Field>

                <Field label="Reason / Notes" required>
                  <textarea
                    rows={3}
                    required
                    value={adjustment.note}
                    onChange={(e) => setAdjustment({ ...adjustment, note: e.target.value })}
                    placeholder="Explain why stock is being adjusted..."
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
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Save Adjustment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Item Details Modal */}
        {modal === "details" && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Stock Item Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">{selectedItem.id}</p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedItem.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selectedItem.sku}</p>
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[getStatus(selectedItem)]}`}>
                    {getStatus(selectedItem)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    ["Category", selectedItem.category],
                    ["Unit", selectedItem.unit],
                    ["Current Quantity", `${selectedItem.quantity} ${selectedItem.unit}`],
                    ["Minimum Stock", `${selectedItem.minimum} ${selectedItem.unit}`],
                    ["Purchase Price", currency(selectedItem.price)],
                    ["Stock Value", currency(selectedItem.quantity * selectedItem.price)],
                    ["Location", selectedItem.location],
                    ["Supplier", selectedItem.supplier],
                    ["Expiry Date", selectedItem.expiry || "Not applicable"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedItem.description || "No description provided."}
                  </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => openHistory(selectedItem)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    View History
                  </button>
                  <button
                    onClick={() => openEdit(selectedItem)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock History Modal */}
        {modal === "history" && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Stock Adjustment History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedItem.name} · {selectedItem.sku}
                  </p>
                </div>
                <button onClick={() => setModal("")} className="rounded-lg p-2 hover:bg-slate-100">
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                <div className="mb-4 rounded-lg bg-blue-50 p-4">
                  <p className="text-xs text-blue-600">Current stock balance</p>
                  <p className="mt-1 text-2xl font-bold text-blue-900">
                    {selectedItem.quantity} {selectedItem.unit}
                  </p>
                </div>

                {selectedItem.history?.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Type</th>
                          <th className="px-3 py-3">Quantity</th>
                          <th className="px-3 py-3">Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedItem.history.map((entry) => (
                          <tr key={entry.id}>
                            <td className="px-3 py-3">{entry.date}</td>
                            <td className="px-3 py-3">{entry.type}</td>
                            <td className={`px-3 py-3 font-semibold ${entry.quantity >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                              {entry.quantity > 0 ? "+" : ""}{entry.quantity} {selectedItem.unit}
                            </td>
                            <td className="px-3 py-3 text-slate-500">{entry.note}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <History size={32} className="mx-auto text-slate-300" />
                    <p className="mt-2 font-semibold text-slate-700">No adjustment history</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Stock transactions will appear here.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => openAdjustment(selectedItem)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Adjust Stock
                  </button>
                </div>
              </div>
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
                Delete Stock Item?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.name}</strong>? This action cannot be undone.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function ArrowLeftRightIcon() {
  return <ArrowDownToLine size={16} />;
}
