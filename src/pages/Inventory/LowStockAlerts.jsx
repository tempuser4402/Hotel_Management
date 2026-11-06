
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Package,
  PackageX,
  Search,
  Filter,
  Plus,
  Eye,
  Pencil,
  X,
  ShoppingCart,
  Truck,
  Warehouse,
  CheckCircle2,
  Clock,
  RefreshCw,
  ArrowUpRight,
  Bell,
  Boxes,
  Save,
  Trash2,
  Download,
  ChevronRight,
} from "lucide-react";

const initialItems = [
  {
    id: "ITEM-001",
    name: "Basmati Rice",
    sku: "FOOD-001",
    category: "Food & Beverage",
    unit: "kg",
    quantity: 12,
    minimum: 25,
    reorderLevel: 30,
    suggestedQuantity: 50,
    purchasePrice: 85,
    supplier: "Fresh Foods Suppliers",
    location: "Main Store",
    expiry: "2027-06-15",
    lastUpdated: "2026-11-05",
  },
  {
    id: "ITEM-002",
    name: "Cooking Oil",
    sku: "FOOD-002",
    category: "Food & Beverage",
    unit: "litre",
    quantity: 5,
    minimum: 20,
    reorderLevel: 25,
    suggestedQuantity: 40,
    purchasePrice: 145,
    supplier: "Fresh Foods Suppliers",
    location: "Kitchen Store",
    expiry: "2027-04-10",
    lastUpdated: "2026-11-05",
  },
  {
    id: "ITEM-003",
    name: "All Purpose Flour",
    sku: "FOOD-003",
    category: "Food & Beverage",
    unit: "kg",
    quantity: 0,
    minimum: 15,
    reorderLevel: 20,
    suggestedQuantity: 40,
    purchasePrice: 42,
    supplier: "Metro Wholesale",
    location: "Main Store",
    expiry: "2027-02-20",
    lastUpdated: "2026-11-04",
  },
  {
    id: "ITEM-004",
    name: "Floor Cleaner",
    sku: "CLN-001",
    category: "Cleaning Supplies",
    unit: "litre",
    quantity: 8,
    minimum: 15,
    reorderLevel: 20,
    suggestedQuantity: 30,
    purchasePrice: 110,
    supplier: "CleanPro Distributors",
    location: "Housekeeping Store",
    expiry: "",
    lastUpdated: "2026-11-05",
  },
  {
    id: "ITEM-005",
    name: "Bath Towels",
    sku: "LIN-001",
    category: "Linen",
    unit: "piece",
    quantity: 18,
    minimum: 30,
    reorderLevel: 35,
    suggestedQuantity: 60,
    purchasePrice: 250,
    supplier: "Hotel Linen House",
    location: "Main Store",
    expiry: "",
    lastUpdated: "2026-11-03",
  },
  {
    id: "ITEM-006",
    name: "Shampoo Bottles",
    sku: "GST-001",
    category: "Guest Supplies",
    unit: "piece",
    quantity: 0,
    minimum: 50,
    reorderLevel: 60,
    suggestedQuantity: 150,
    purchasePrice: 18,
    supplier: "Hospitality Essentials",
    location: "Housekeeping Store",
    expiry: "2027-08-15",
    lastUpdated: "2026-11-04",
  },
  {
    id: "ITEM-007",
    name: "Hand Wash",
    sku: "CLN-002",
    category: "Cleaning Supplies",
    unit: "litre",
    quantity: 14,
    minimum: 20,
    reorderLevel: 25,
    suggestedQuantity: 40,
    purchasePrice: 95,
    supplier: "CleanPro Distributors",
    location: "Housekeeping Store",
    expiry: "",
    lastUpdated: "2026-11-05",
  },
  {
    id: "ITEM-008",
    name: "Tea Leaves",
    sku: "FOOD-004",
    category: "Food & Beverage",
    unit: "kg",
    quantity: 3,
    minimum: 10,
    reorderLevel: 15,
    suggestedQuantity: 25,
    purchasePrice: 420,
    supplier: "Metro Wholesale",
    location: "Restaurant Store",
    expiry: "2027-01-15",
    lastUpdated: "2026-11-05",
  },
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const currency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getStockStatus = (item) => {
  if (Number(item.quantity) <= 0) return "Out of Stock";
  if (Number(item.quantity) <= Number(item.minimum)) return "Low Stock";
  if (Number(item.quantity) <= Number(item.reorderLevel)) return "Reorder Soon";
  return "Healthy";
};

const statusStyles = {
  "Out of Stock": "bg-red-50 text-red-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Reorder Soon": "bg-orange-50 text-orange-700",
  Healthy: "bg-emerald-50 text-emerald-700",
};

function Badge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
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
    red: "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-emerald-50 text-emerald-600",
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

export default function LowStockAlerts() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [notification, setNotification] = useState("");

  const [form, setForm] = useState({
    minimum: 0,
    reorderLevel: 0,
    suggestedQuantity: 0,
    supplier: "",
    location: "",
  });

  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseNotes, setPurchaseNotes] = useState("");
  const [purchaseRequests, setPurchaseRequests] = useState([]);

  const categories = [...new Set(items.map((item) => item.category))];
  const locations = [...new Set(items.map((item) => item.location))];

  const lowStockItems = items.filter(
    (item) => getStockStatus(item) === "Low Stock"
  );

  const outOfStockItems = items.filter(
    (item) => getStockStatus(item) === "Out of Stock"
  );

  const reorderSoonItems = items.filter(
    (item) => getStockStatus(item) === "Reorder Soon"
  );

  const healthyItems = items.filter(
    (item) => getStockStatus(item) === "Healthy"
  );

  const estimatedReorderValue = items
    .filter((item) => getStockStatus(item) !== "Healthy")
    .reduce(
      (sum, item) =>
        sum + Number(item.suggestedQuantity) * Number(item.purchasePrice),
      0
    );

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const status = getStockStatus(item);
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.name.toLowerCase().includes(searchText) ||
        item.sku.toLowerCase().includes(searchText) ||
        item.supplier.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchesLocation =
        locationFilter === "All" || item.location === locationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesLocation
      );
    });
  }, [items, search, statusFilter, categoryFilter, locationFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const openThresholdEditor = (item) => {
    setEditingItem(item);
    setForm({
      minimum: item.minimum,
      reorderLevel: item.reorderLevel,
      suggestedQuantity: item.suggestedQuantity,
      supplier: item.supplier,
      location: item.location,
    });
    setModal("threshold");
  };

  const saveThreshold = (event) => {
    event.preventDefault();

    if (
      Number(form.minimum) < 0 ||
      Number(form.reorderLevel) < Number(form.minimum) ||
      Number(form.suggestedQuantity) <= 0
    ) {
      showMessage(
        "Enter valid thresholds. Reorder level must be at least the minimum level."
      );
      return;
    }

    setItems((previous) =>
      previous.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              minimum: Number(form.minimum),
              reorderLevel: Number(form.reorderLevel),
              suggestedQuantity: Number(form.suggestedQuantity),
              supplier: form.supplier,
              location: form.location,
            }
          : item
      )
    );

    setModal("");
    showMessage("Stock alert settings updated.");
  };

  const openDetails = (item) => {
    setSelectedItem(item);
    setModal("details");
  };

  const openPurchaseOrder = (item) => {
    setSelectedItem(item);
    setPurchaseQuantity(
      Math.max(1, Number(item.suggestedQuantity) || 1)
    );
    setPurchaseNotes("");
    setModal("purchase");
  };

  const createPurchaseRequest = (event) => {
    event.preventDefault();

    if (!selectedItem || Number(purchaseQuantity) <= 0) {
      showMessage("Please enter a valid purchase quantity.");
      return;
    }

    const request = {
      id: `PR-${String(purchaseRequests.length + 1).padStart(3, "0")}`,
      itemId: selectedItem.id,
      itemName: selectedItem.name,
      sku: selectedItem.sku,
      supplier: selectedItem.supplier,
      quantity: Number(purchaseQuantity),
      unit: selectedItem.unit,
      unitPrice: selectedItem.purchasePrice,
      total: Number(purchaseQuantity) * Number(selectedItem.purchasePrice),
      date: new Date().toISOString().slice(0, 10),
      status: "Draft",
      notes: purchaseNotes,
    };

    setPurchaseRequests((previous) => [request, ...previous]);
    setModal("");
    showMessage(`Purchase request ${request.id} created.`);
  };

  const updateRequestStatus = (requestId, status) => {
    setPurchaseRequests((previous) =>
      previous.map((request) =>
        request.id === requestId ? { ...request, status } : request
      )
    );
    showMessage(`Purchase request updated to ${status}.`);
  };

  const deleteItem = () => {
    if (!deleteTarget) return;

    setItems((previous) =>
      previous.filter((item) => item.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Alert item removed from this demo list.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setLocationFilter("All");
  };

  const exportAlerts = () => {
    const headers = [
      "Item",
      "SKU",
      "Category",
      "Current Stock",
      "Minimum Stock",
      "Reorder Level",
      "Suggested Quantity",
      "Unit",
      "Supplier",
      "Location",
      "Status",
    ];

    const rows = filteredItems.map((item) => [
      item.name,
      item.sku,
      item.category,
      item.quantity,
      item.minimum,
      item.reorderLevel,
      item.suggestedQuantity,
      item.unit,
      item.supplier,
      item.location,
      getStockStatus(item),
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
    link.download = "low-stock-alerts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const reorderAll = () => {
    const actionable = items.filter(
      (item) => getStockStatus(item) !== "Healthy"
    );

    if (!actionable.length) {
      showMessage("There are no items requiring reorder.");
      return;
    }

    const requests = actionable.map((item, index) => ({
      id: `PR-${String(purchaseRequests.length + index + 1).padStart(3, "0")}`,
      itemId: item.id,
      itemName: item.name,
      sku: item.sku,
      supplier: item.supplier,
      quantity: Number(item.suggestedQuantity),
      unit: item.unit,
      unitPrice: item.purchasePrice,
      total: Number(item.suggestedQuantity) * Number(item.purchasePrice),
      date: new Date().toISOString().slice(0, 10),
      status: "Draft",
      notes: "Bulk reorder generated from low-stock alerts.",
    }));

    setPurchaseRequests((previous) => [...requests, ...previous]);
    showMessage(`${requests.length} draft purchase requests created.`);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-100 p-3 text-amber-600">
              <Bell size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Low Stock Alerts
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor shortages, manage reorder levels and create purchase requests.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportAlerts}
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={16} />
              Export CSV
            </button>

            <button
              onClick={reorderAll}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <ShoppingCart size={17} />
              Reorder All Alerts
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

        {/* Alert Summary */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Alert Items"
            value={items.length - healthyItems.length}
            subtitle="Items requiring attention"
            icon={AlertTriangle}
            color="amber"
          />

          <StatCard
            title="Out of Stock"
            value={outOfStockItems.length}
            subtitle="No available quantity"
            icon={PackageX}
            color="red"
          />

          <StatCard
            title="Low Stock"
            value={lowStockItems.length}
            subtitle="Below minimum threshold"
            icon={AlertCircle}
            color="amber"
          />

          <StatCard
            title="Healthy Stock"
            value={healthyItems.length}
            subtitle="Above reorder level"
            icon={CheckCircle2}
            color="green"
          />
        </div>

        {/* Estimated Reorder Value */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-white p-2 text-blue-600">
                <ShoppingCart size={21} />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Estimated Reorder Value
                </p>
                <h2 className="mt-1 text-2xl font-bold text-blue-950">
                  {currency(estimatedReorderValue)}
                </h2>
                <p className="mt-1 text-xs text-blue-700">
                  Estimated cost using suggested reorder quantities and current purchase prices.
                </p>
              </div>
            </div>

            <button
              onClick={() => setModal("requests")}
              className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-100"
            >
              View Purchase Requests
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Alert Breakdown */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <button
            onClick={() => setStatusFilter("Out of Stock")}
            className="rounded-xl border border-red-200 bg-white p-4 text-left transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <PackageX size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Out of Stock
            </p>
            <h3 className="mt-1 text-2xl font-bold text-red-600">
              {outOfStockItems.length}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Immediate purchasing required
            </p>
          </button>

          <button
            onClick={() => setStatusFilter("Low Stock")}
            className="rounded-xl border border-amber-200 bg-white p-4 text-left transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <AlertTriangle size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Low Stock
            </p>
            <h3 className="mt-1 text-2xl font-bold text-amber-600">
              {lowStockItems.length}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Current stock is at or below minimum
            </p>
          </button>

          <button
            onClick={() => setStatusFilter("Reorder Soon")}
            className="rounded-xl border border-orange-200 bg-white p-4 text-left transition hover:shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-orange-50 p-2 text-orange-600">
                <Clock size={20} />
              </div>
              <ArrowUpRight size={18} className="text-slate-400" />
            </div>
            <p className="mt-3 text-sm font-semibold text-slate-800">
              Reorder Soon
            </p>
            <h3 className="mt-1 text-2xl font-bold text-orange-600">
              {reorderSoonItems.length}
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Stock approaching reorder threshold
            </p>
          </button>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">
              Search & Filters
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search item, SKU or supplier..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Stock Statuses</option>
              <option>Out of Stock</option>
              <option>Low Stock</option>
              <option>Reorder Soon</option>
              <option>Healthy</option>
            </select>

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
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Store Locations</option>
              {locations.map((location) => (
                <option key={location}>{location}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-slate-500">
              Showing {filteredItems.length} of {items.length} items
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Low Stock Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">
                Stock Alert List
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Current stock compared with configured minimum and reorder levels.
              </p>
            </div>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {filteredItems.filter((item) => getStockStatus(item) !== "Healthy").length} alerts
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1150px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Stock Item</th>
                  <th className="px-4 py-3">Current Stock</th>
                  <th className="px-4 py-3">Minimum Level</th>
                  <th className="px-4 py-3">Reorder Level</th>
                  <th className="px-4 py-3">Suggested Order</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  const percentage =
                    item.minimum > 0
                      ? Math.min(100, (item.quantity / item.minimum) * 100)
                      : 100;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">
                          {item.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {item.sku} · {item.category}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <div className="min-w-28">
                          <p className={`font-bold ${
                            status === "Out of Stock"
                              ? "text-red-600"
                              : status === "Healthy"
                                ? "text-emerald-600"
                                : "text-amber-600"
                          }`}>
                            {item.quantity} {item.unit}
                          </p>
                          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${
                                status === "Out of Stock"
                                  ? "bg-red-500"
                                  : status === "Healthy"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.minimum} {item.unit}
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.reorderLevel} {item.unit}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-semibold text-blue-700">
                          {item.suggestedQuantity} {item.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-700">
                          {item.supplier}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {currency(item.purchasePrice)} / {item.unit}
                        </p>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {item.location}
                      </td>

                      <td className="px-4 py-3">
                        <Badge status={status} />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View item"
                            onClick={() => openDetails(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            title="Edit alert settings"
                            onClick={() => openThresholdEditor(item)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>

                          {status !== "Healthy" && (
                            <button
                              title="Create purchase request"
                              onClick={() => openPurchaseOrder(item)}
                              className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                            >
                              <ShoppingCart size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredItems.length === 0 && (
                  <tr>
                    <td colSpan="9" className="px-4 py-12 text-center">
                      <Package size={36} className="mx-auto text-slate-300" />
                      <p className="mt-2 font-semibold text-slate-700">
                        No stock items found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Purchase Request History */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">
                Recent Purchase Requests
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Requests generated from low-stock alerts.
              </p>
            </div>

            <button
              onClick={() => setModal("requests")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View All
            </button>
          </div>

          {purchaseRequests.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 py-8 text-center">
              <ShoppingCart size={30} className="mx-auto text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-700">
                No purchase requests yet
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Create a purchase request using the reorder action above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Request ID</th>
                    <th className="px-3 py-3">Item</th>
                    <th className="px-3 py-3">Supplier</th>
                    <th className="px-3 py-3">Quantity</th>
                    <th className="px-3 py-3">Estimated Total</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {purchaseRequests.slice(0, 5).map((request) => (
                    <tr key={request.id}>
                      <td className="px-3 py-3 font-semibold text-blue-600">
                        {request.id}
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-800">
                        {request.itemName}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {request.supplier}
                      </td>
                      <td className="px-3 py-3 text-slate-600">
                        {request.quantity} {request.unit}
                      </td>
                      <td className="px-3 py-3 font-semibold text-slate-800">
                        {currency(request.total)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          status={
                            request.status === "Approved"
                              ? "Healthy"
                              : request.status === "Rejected"
                                ? "Out of Stock"
                                : "Reorder Soon"
                          }
                        />
                      </td>
                      <td className="px-3 py-3">
                        {request.status === "Draft" && (
                          <button
                            onClick={() => updateRequestStatus(request.id, "Submitted")}
                            className="text-xs font-semibold text-blue-600 hover:underline"
                          >
                            Submit
                          </button>
                        )}
                        {request.status === "Submitted" && (
                          <button
                            onClick={() => updateRequestStatus(request.id, "Approved")}
                            className="text-xs font-semibold text-emerald-600 hover:underline"
                          >
                            Approve
                          </button>
                        )}
                        {request.status === "Approved" && (
                          <span className="text-xs text-emerald-600">Approved</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Threshold Modal */}
        {modal === "threshold" && editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Edit Alert Settings
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {editingItem.name} · {editingItem.sku}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveThreshold} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Minimum Stock Level" required>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.minimum}
                      onChange={(e) =>
                        setForm({ ...form, minimum: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Reorder Level" required>
                    <input
                      type="number"
                      min="0"
                      required
                      value={form.reorderLevel}
                      onChange={(e) =>
                        setForm({ ...form, reorderLevel: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Suggested Reorder Quantity" required>
                    <input
                      type="number"
                      min="1"
                      required
                      value={form.suggestedQuantity}
                      onChange={(e) =>
                        setForm({ ...form, suggestedQuantity: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Supplier" required>
                    <input
                      required
                      value={form.supplier}
                      onChange={(e) =>
                        setForm({ ...form, supplier: e.target.value })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Storage Location">
                      <select
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        className={inputClass}
                      >
                        {[
                          "Main Store",
                          "Kitchen Store",
                          "Restaurant Store",
                          "Housekeeping Store",
                          "Maintenance Store",
                        ].map((location) => (
                          <option key={location}>{location}</option>
                        ))}
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800">
                  An alert is triggered when current stock reaches or falls below the minimum level.
                </div>

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
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <Save size={16} />
                    Save Settings
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
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedItem.id}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedItem.name}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {selectedItem.sku} · {selectedItem.category}
                    </p>
                  </div>
                  <Badge status={getStockStatus(selectedItem)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["Current Stock", `${selectedItem.quantity} ${selectedItem.unit}`],
                    ["Minimum Level", `${selectedItem.minimum} ${selectedItem.unit}`],
                    ["Reorder Level", `${selectedItem.reorderLevel} ${selectedItem.unit}`],
                    ["Suggested Order", `${selectedItem.suggestedQuantity} ${selectedItem.unit}`],
                    ["Purchase Price", currency(selectedItem.purchasePrice)],
                    ["Supplier", selectedItem.supplier],
                    ["Location", selectedItem.location],
                    ["Last Updated", selectedItem.lastUpdated],
                    ["Expiry Date", selectedItem.expiry || "Not applicable"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs text-slate-400">{label}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => openThresholdEditor(selectedItem)}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    <Pencil size={15} />
                    Edit Alert
                  </button>

                  {getStockStatus(selectedItem) !== "Healthy" && (
                    <button
                      onClick={() => openPurchaseOrder(selectedItem)}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      <ShoppingCart size={15} />
                      Create Purchase Request
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Purchase Request Modal */}
        {modal === "purchase" && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Create Purchase Request
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Generate a reorder request for {selectedItem.name}.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={createPurchaseRequest} className="space-y-4 p-5">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="font-semibold text-slate-900">
                    {selectedItem.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedItem.sku} · {selectedItem.supplier}
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-slate-400">Available Stock</p>
                      <p className="mt-1 font-semibold text-red-600">
                        {selectedItem.quantity} {selectedItem.unit}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Suggested Quantity</p>
                      <p className="mt-1 font-semibold text-blue-600">
                        {selectedItem.suggestedQuantity} {selectedItem.unit}
                      </p>
                    </div>
                  </div>
                </div>

                <Field label="Supplier">
                  <input
                    disabled
                    value={selectedItem.supplier}
                    className={`${inputClass} bg-slate-50`}
                  />
                </Field>

                <Field label={`Order Quantity (${selectedItem.unit})`} required>
                  <input
                    type="number"
                    min="1"
                    required
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <div className="rounded-lg border border-slate-200 p-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Unit Price</span>
                    <span className="font-semibold text-slate-800">
                      {currency(selectedItem.purchasePrice)}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between text-sm">
                    <span className="text-slate-500">Estimated Total</span>
                    <span className="text-lg font-bold text-blue-700">
                      {currency(Number(purchaseQuantity) * selectedItem.purchasePrice)}
                    </span>
                  </div>
                </div>

                <Field label="Purchase Notes">
                  <textarea
                    rows={3}
                    value={purchaseNotes}
                    onChange={(e) => setPurchaseNotes(e.target.value)}
                    placeholder="Add purchase instructions..."
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
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    <ShoppingCart size={16} />
                    Create Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Purchase Requests Modal */}
        {modal === "requests" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Purchase Requests
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Requests generated from low-stock alerts.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                {purchaseRequests.length === 0 ? (
                  <div className="py-12 text-center">
                    <ShoppingCart size={36} className="mx-auto text-slate-300" />
                    <p className="mt-2 font-semibold text-slate-700">
                      No purchase requests
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Create requests from the stock alert list.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[750px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-3 py-3">Request ID</th>
                          <th className="px-3 py-3">Item</th>
                          <th className="px-3 py-3">Supplier</th>
                          <th className="px-3 py-3">Quantity</th>
                          <th className="px-3 py-3">Total</th>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Status</th>
                          <th className="px-3 py-3">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {purchaseRequests.map((request) => (
                          <tr key={request.id}>
                            <td className="px-3 py-3 font-semibold text-blue-600">
                              {request.id}
                            </td>
                            <td className="px-3 py-3 font-medium text-slate-800">
                              {request.itemName}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {request.supplier}
                            </td>
                            <td className="px-3 py-3">
                              {request.quantity} {request.unit}
                            </td>
                            <td className="px-3 py-3 font-semibold">
                              {currency(request.total)}
                            </td>
                            <td className="px-3 py-3 text-slate-500">
                              {request.date}
                            </td>
                            <td className="px-3 py-3">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                {request.status}
                              </span>
                            </td>
                            <td className="px-3 py-3">
                              {request.status === "Draft" && (
                                <button
                                  onClick={() => updateRequestStatus(request.id, "Submitted")}
                                  className="text-xs font-semibold text-blue-600 hover:underline"
                                >
                                  Submit
                                </button>
                              )}
                              {request.status === "Submitted" && (
                                <button
                                  onClick={() => updateRequestStatus(request.id, "Approved")}
                                  className="text-xs font-semibold text-emerald-600 hover:underline"
                                >
                                  Approve
                                </button>
                              )}
                              {request.status === "Approved" && (
                                <span className="text-xs text-emerald-600">
                                  Approved
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex justify-end border-t border-slate-200 p-4">
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Close
                </button>
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
                Remove Alert Item?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                This removes {deleteTarget.name} from this demo alert list. It does not delete the actual inventory item.
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteItem}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
