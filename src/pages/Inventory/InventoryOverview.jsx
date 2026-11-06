
import { useMemo, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  ArrowLeftRight,
  Search,
  Plus,
  Eye,
  Warehouse,
  CalendarDays,
  ChevronRight,
  Clock,
  CheckCircle2,
  Truck,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

const stockItems = [
  { id: 1, name: "Basmati Rice", sku: "FD-001", category: "Food Ingredients", quantity: 85, unit: "kg", minimum: 30, price: 95, location: "Main Store", supplier: "Sharma Food Suppliers", status: "In Stock" },
  { id: 2, name: "Cooking Oil", sku: "FD-002", category: "Food Ingredients", quantity: 12, unit: "L", minimum: 25, price: 145, location: "Kitchen Store", supplier: "Fresh Mart Distributors", status: "Low Stock" },
  { id: 3, name: "All Purpose Flour", sku: "FD-003", category: "Food Ingredients", quantity: 45, unit: "kg", minimum: 20, price: 42, location: "Main Store", supplier: "Sharma Food Suppliers", status: "In Stock" },
  { id: 4, name: "Floor Cleaner", sku: "HK-001", category: "Cleaning Supplies", quantity: 8, unit: "L", minimum: 15, price: 110, location: "Housekeeping Store", supplier: "CleanPro India", status: "Low Stock" },
  { id: 5, name: "Bath Towels", sku: "LN-001", category: "Linen", quantity: 120, unit: "pcs", minimum: 40, price: 280, location: "Linen Store", supplier: "Hotel Linen House", status: "In Stock" },
  { id: 6, name: "Shampoo Bottles", sku: "TO-001", category: "Toiletries", quantity: 0, unit: "pcs", minimum: 50, price: 18, location: "Housekeeping Store", supplier: "Guest Essentials Co.", status: "Out of Stock" },
  { id: 7, name: "Hand Wash", sku: "HK-002", category: "Cleaning Supplies", quantity: 18, unit: "L", minimum: 20, price: 85, location: "Main Store", supplier: "CleanPro India", status: "Low Stock" },
  { id: 8, name: "Tea Leaves", sku: "FD-004", category: "Food Ingredients", quantity: 32, unit: "kg", minimum: 10, price: 360, location: "Kitchen Store", supplier: "Fresh Mart Distributors", status: "In Stock" },
];

const purchases = [
  { id: "PO-2026-041", supplier: "Sharma Food Suppliers", date: "06 Nov 2026", items: 5, amount: 18450, status: "Received" },
  { id: "PO-2026-040", supplier: "CleanPro India", date: "05 Nov 2026", items: 3, amount: 8250, status: "Pending" },
  { id: "PO-2026-039", supplier: "Hotel Linen House", date: "04 Nov 2026", items: 4, amount: 12600, status: "Approved" },
  { id: "PO-2026-038", supplier: "Fresh Mart Distributors", date: "02 Nov 2026", items: 6, amount: 15300, status: "Received" },
];

const transfers = [
  { id: "TR-1051", item: "Basmati Rice", from: "Main Store", to: "Kitchen Store", quantity: "15 kg", date: "06 Nov 2026", status: "Completed" },
  { id: "TR-1050", item: "Bath Towels", from: "Linen Store", to: "Floor 2 Store", quantity: "20 pcs", date: "05 Nov 2026", status: "In Transit" },
  { id: "TR-1049", item: "Floor Cleaner", from: "Main Store", to: "Housekeeping Store", quantity: "5 L", date: "04 Nov 2026", status: "Completed" },
];

const consumption = [
  { month: "Jun", food: 62, cleaning: 28, linen: 18 },
  { month: "Jul", food: 72, cleaning: 35, linen: 22 },
  { month: "Aug", food: 58, cleaning: 30, linen: 20 },
  { month: "Sep", food: 84, cleaning: 42, linen: 25 },
  { month: "Oct", food: 75, cleaning: 38, linen: 21 },
  { month: "Nov", food: 92, cleaning: 48, linen: 28 },
];

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const statusClass = {
  "In Stock": "bg-emerald-50 text-emerald-700",
  "Low Stock": "bg-amber-50 text-amber-700",
  "Out of Stock": "bg-red-50 text-red-700",
  Received: "bg-emerald-50 text-emerald-700",
  Approved: "bg-blue-50 text-blue-700",
  Pending: "bg-amber-50 text-amber-700",
  Completed: "bg-emerald-50 text-emerald-700",
  "In Transit": "bg-blue-50 text-blue-700",
};

function StatCard({ title, value, subtitle, icon: Icon, color, trend }) {
  const styles = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
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
      {trend && (
        <div className="mt-3 flex items-center gap-1 text-xs text-emerald-600">
          <TrendingUp size={14} />
          {trend}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle, link, linkText = "View all" }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
      {link && (
        <Link
          to={link}
          className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          {linkText}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
}

export default function InventoryOverview() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [period, setPeriod] = useState("Last 6 months");

  const totalItems = stockItems.length;
  const totalValue = stockItems.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const lowStock = stockItems.filter(
    (item) => item.quantity > 0 && item.quantity <= item.minimum
  );
  const outOfStock = stockItems.filter((item) => item.quantity === 0);

  const filteredLowStock = useMemo(() => {
    return lowStock.filter((item) => {
      const matchesSearch =
        `${item.name} ${item.sku} ${item.supplier}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category, lowStock]);

  const categories = [...new Set(stockItems.map((item) => item.category))];

  const totalConsumption = consumption.reduce(
    (sum, item) => sum + item.food + item.cleaning + item.linen,
    0
  );

  const formatCompact = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Warehouse size={23} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Inventory & Procurement
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Monitor hotel stock, purchases, suppliers and inventory movement.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/inventory/items"
              className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Package size={16} />
              Stock Items
            </Link>
            <Link
              to="/inventory/purchase-orders"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Create Purchase Order
            </Link>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Stock Items"
            value={totalItems}
            subtitle="Registered inventory items"
            icon={Boxes}
            color="blue"
            trend="Across all categories"
          />
          <StatCard
            title="Total Stock Value"
            value={currency(totalValue)}
            subtitle="Current inventory valuation"
            icon={TrendingUp}
            color="green"
            trend="Based on purchase prices"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStock.length}
            subtitle="Below minimum threshold"
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStock.length}
            subtitle="Items requiring replenishment"
            icon={XCircle}
            color="red"
          />
          <StatCard
            title="Stock Categories"
            value={categories.length}
            subtitle="Active inventory categories"
            icon={Package}
            color="purple"
          />
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            {
              title: "Stock Items",
              description: "Manage quantities and stock details",
              icon: Package,
              path: "/inventory/items",
              color: "text-blue-600 bg-blue-50",
            },
            {
              title: "Suppliers",
              description: "Manage supplier information",
              icon: Truck,
              path: "/inventory/suppliers",
              color: "text-purple-600 bg-purple-50",
            },
            {
              title: "Purchase Orders",
              description: "Create and track purchases",
              icon: ShoppingCart,
              path: "/inventory/purchase-orders",
              color: "text-emerald-600 bg-emerald-50",
            },
            {
              title: "Stock Transfers",
              description: "Move stock between stores",
              icon: ArrowLeftRight,
              path: "/inventory/transfers",
              color: "text-orange-600 bg-orange-50",
            },
            {
              title: "Low Stock Alerts",
              description: "Review items needing restock",
              icon: AlertTriangle,
              path: "/inventory/low-stock",
              color: "text-red-600 bg-red-50",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className={`rounded-lg p-3 ${item.color}`}>
                  <Icon size={21} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.description}
                  </p>
                </div>
                <ChevronRight
                  size={17}
                  className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600"
                />
              </Link>
            );
          })}
        </div>

        {/* Consumption Chart */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-4 xl:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Stock Consumption
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Monthly consumption by inventory category
                </p>
              </div>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option>Last 6 months</option>
                <option>Last 3 months</option>
                <option>This year</option>
              </select>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Food ingredients
              </span>
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Cleaning supplies
              </span>
              <span className="flex items-center gap-2 text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
                Linen
              </span>
            </div>

            <div className="mt-6 flex h-56 items-end justify-around gap-3 border-b border-l border-slate-200 px-2 pb-0 pt-4">
              {consumption.map((month) => (
                <div
                  key={month.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <div className="flex h-full w-full max-w-12 items-end justify-center gap-0.5">
                    <div
                      title={`Food: ${month.food}`}
                      className="w-1/3 rounded-t bg-blue-500"
                      style={{ height: `${month.food}%` }}
                    />
                    <div
                      title={`Cleaning: ${month.cleaning}`}
                      className="w-1/3 rounded-t bg-emerald-500"
                      style={{ height: `${month.cleaning}%` }}
                    />
                    <div
                      title={`Linen: ${month.linen}`}
                      className="w-1/3 rounded-t bg-orange-400"
                      style={{ height: `${month.linen}%` }}
                    />
                  </div>
                  <span className="mt-2 text-xs text-slate-500">
                    {month.month}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-xs text-slate-400">
              <span>Consumption index</span>
              <span>Total: {totalConsumption} units (demo)</span>
            </div>
          </div>

          {/* Category Summary */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <SectionHeader
              title="Inventory Categories"
              subtitle="Stock distribution by category"
            />

            <div className="space-y-5">
              {categories.map((name, index) => {
                const items = stockItems.filter(
                  (item) => item.category === name
                );
                const quantity = items.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                );
                const value = items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0
                );
                const percentage = Math.round(
                  (items.length / stockItems.length) * 100
                );

                const colors = [
                  "bg-blue-500",
                  "bg-emerald-500",
                  "bg-orange-400",
                  "bg-purple-500",
                ];

                return (
                  <div key={name}>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {items.length} items · {quantity} units
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-slate-700">
                        {formatCompact(value)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-4">
            <SectionHeader
              title="Low Stock & Replenishment"
              subtitle="Items that have reached or fallen below their minimum stock level"
              link="/inventory/low-stock"
              linkText="Manage alerts"
            />

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search item, SKU or supplier..."
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <Filter
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm outline-none focus:border-blue-500 sm:w-52"
                >
                  <option value="All">All categories</option>
                  {categories.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Item</th>
                  <th className="px-4 py-3 font-semibold">Category</th>
                  <th className="px-4 py-3 font-semibold">Current Stock</th>
                  <th className="px-4 py-3 font-semibold">Minimum Stock</th>
                  <th className="px-4 py-3 font-semibold">Supplier</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLowStock.map((item) => (
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
                      <span className={`font-semibold ${item.quantity === 0 ? "text-red-600" : "text-amber-600"}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.minimum} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {item.supplier}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[item.status]}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/inventory/purchase-orders"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                      >
                        <Plus size={14} />
                        Reorder
                      </Link>
                    </td>
                  </tr>
                ))}

                {filteredLowStock.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 py-10 text-center">
                      <CheckCircle2 className="mx-auto text-emerald-500" size={30} />
                      <p className="mt-2 font-medium text-slate-700">
                        No matching low-stock items
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Change your search or category filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Purchases and Transfers */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

          {/* Purchases */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <SectionHeader
                title="Recent Purchases"
                subtitle="Latest purchase orders and their status"
                link="/inventory/purchase-orders"
              />
            </div>

            <div className="divide-y divide-slate-100">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                      <ShoppingCart size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {purchase.id}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {purchase.supplier}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {purchase.items} items · {purchase.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-800">
                      {currency(purchase.amount)}
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[purchase.status]}`}>
                      {purchase.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transfers */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-4">
              <SectionHeader
                title="Recent Stock Transfers"
                subtitle="Latest movement between hotel stores"
                link="/inventory/transfers"
              />
            </div>

            <div className="divide-y divide-slate-100">
              {transfers.map((transfer) => (
                <div
                  key={transfer.id}
                  className="p-4 hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600">
                        <ArrowLeftRight size={19} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {transfer.item}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {transfer.id} · {transfer.quantity}
                        </p>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[transfer.status]}`}>
                      {transfer.status}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 pl-12 text-xs text-slate-500">
                    <span>{transfer.from}</span>
                    <ArrowLeftRight size={13} />
                    <span>{transfer.to}</span>
                    <span className="ml-auto flex items-center gap-1 text-slate-400">
                      <CalendarDays size={13} />
                      {transfer.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock size={15} />
            Inventory overview · Demo data
          </div>
          <p className="text-xs text-slate-400">
            Stock values and activity are sample data until backend integration.
          </p>
        </div>
      </div>
    </div>
  );
}
