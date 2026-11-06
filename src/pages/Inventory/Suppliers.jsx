
import { useMemo, useState } from "react";
import {
  Truck,
  Plus,
  Search,
  Filter,
  Eye,
  Pencil,
  Trash2,
  X,
  Phone,
  Mail,
  MapPin,
  Package,
  ShoppingCart,
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Save,
  History,
  IndianRupee,
  Ban,
  CalendarDays,
} from "lucide-react";

const initialSuppliers = [
  {
    id: "SUP-001",
    name: "Rajesh Sharma",
    company: "Sharma Food Suppliers",
    phone: "+91 98765 43210",
    email: "sales@sharmafoods.in",
    address: "Sector 18, Gurgaon, Haryana",
    gst: "06ABCDE1234F1Z5",
    paymentTerms: "Net 30 Days",
    status: "Active",
    suppliedItems: ["Basmati Rice", "All Purpose Flour", "Spices"],
    notes: "Primary food ingredients supplier.",
    orders: [
      { id: "PO-101", date: "2026-11-01", amount: 18500, status: "Received" },
      { id: "PO-094", date: "2026-10-15", amount: 12400, status: "Received" },
      { id: "PO-083", date: "2026-09-20", amount: 9600, status: "Received" },
    ],
  },
  {
    id: "SUP-002",
    name: "Amit Verma",
    company: "Fresh Mart Distributors",
    phone: "+91 98111 22334",
    email: "orders@freshmart.in",
    address: "Model Town, Delhi",
    gst: "07BCDEF2345G1Z6",
    paymentTerms: "Net 15 Days",
    status: "Active",
    suppliedItems: ["Cooking Oil", "Tea Leaves", "Dairy Products"],
    notes: "Delivers food supplies twice a week.",
    orders: [
      { id: "PO-102", date: "2026-11-03", amount: 22000, status: "Received" },
      { id: "PO-090", date: "2026-10-10", amount: 15700, status: "Received" },
    ],
  },
  {
    id: "SUP-003",
    name: "Priya Mehta",
    company: "CleanPro India",
    phone: "+91 98990 12345",
    email: "support@cleanpro.in",
    address: "Industrial Area, Faridabad, Haryana",
    gst: "06CDEFG3456H1Z7",
    paymentTerms: "Net 30 Days",
    status: "Active",
    suppliedItems: ["Floor Cleaner", "Hand Wash", "Cleaning Chemicals"],
    notes: "Cleaning and housekeeping supplies.",
    orders: [
      { id: "PO-099", date: "2026-10-28", amount: 8500, status: "Received" },
    ],
  },
  {
    id: "SUP-004",
    name: "Suresh Kumar",
    company: "Hotel Linen House",
    phone: "+91 98710 45678",
    email: "sales@hotellinen.in",
    address: "Karol Bagh, New Delhi",
    gst: "07DEFGH4567J1Z8",
    paymentTerms: "Advance Payment",
    status: "Active",
    suppliedItems: ["Bath Towels", "Bed Sheets", "Pillow Covers"],
    notes: "Hotel linen and textile supplier.",
    orders: [
      { id: "PO-087", date: "2026-09-25", amount: 32000, status: "Received" },
      { id: "PO-076", date: "2026-08-14", amount: 18000, status: "Received" },
    ],
  },
  {
    id: "SUP-005",
    name: "Neha Gupta",
    company: "Guest Essentials Co.",
    phone: "+91 98100 77889",
    email: "hello@guestessentials.in",
    address: "Udyog Vihar, Gurgaon, Haryana",
    gst: "06EFGHI5678K1Z9",
    paymentTerms: "Net 15 Days",
    status: "Inactive",
    suppliedItems: ["Shampoo Bottles", "Soap", "Dental Kits"],
    notes: "Currently inactive supplier.",
    orders: [
      { id: "PO-071", date: "2026-07-12", amount: 6400, status: "Received" },
    ],
  },
];

const emptyForm = {
  name: "",
  company: "",
  phone: "",
  email: "",
  address: "",
  gst: "",
  paymentTerms: "Net 30 Days",
  status: "Active",
  suppliedItems: [],
  notes: "",
};

const paymentOptions = [
  "Advance Payment",
  "Cash on Delivery",
  "Net 7 Days",
  "Net 15 Days",
  "Net 30 Days",
  "Net 45 Days",
  "Net 60 Days",
];

const itemOptions = [
  "Basmati Rice",
  "All Purpose Flour",
  "Spices",
  "Cooking Oil",
  "Tea Leaves",
  "Dairy Products",
  "Floor Cleaner",
  "Hand Wash",
  "Cleaning Chemicals",
  "Bath Towels",
  "Bed Sheets",
  "Pillow Covers",
  "Shampoo Bottles",
  "Soap",
  "Dental Kits",
  "Other",
];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const styles = {
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
        <div className={`rounded-xl p-3 ${styles[color]}`}>
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

function StatusBadge({ status }) {
  const styles =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-slate-100 text-slate-600";

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {status}
    </span>
  );
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [notification, setNotification] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const activeCount = suppliers.filter((s) => s.status === "Active").length;
  const inactiveCount = suppliers.filter((s) => s.status === "Inactive").length;

  const totalOrders = suppliers.reduce(
    (sum, supplier) => sum + supplier.orders.length,
    0
  );

  const totalPurchases = suppliers.reduce(
    (sum, supplier) =>
      sum +
      supplier.orders.reduce((orderSum, order) => orderSum + order.amount, 0),
    0
  );

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((supplier) => {
      const searchText = [
        supplier.name,
        supplier.company,
        supplier.phone,
        supplier.email,
        supplier.id,
      ]
        .join(" ")
        .toLowerCase();

      return (
        searchText.includes(search.toLowerCase()) &&
        (statusFilter === "All" || supplier.status === statusFilter) &&
        (paymentFilter === "All" ||
          supplier.paymentTerms === paymentFilter)
      );
    });
  }, [suppliers, search, statusFilter, paymentFilter]);

  const showMessage = (message) => {
    setNotification(message);
    window.setTimeout(() => setNotification(""), 3000);
  };

  const openAdd = () => {
    setSelectedSupplier(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setForm({
      name: supplier.name,
      company: supplier.company,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      gst: supplier.gst || "",
      paymentTerms: supplier.paymentTerms,
      status: supplier.status,
      suppliedItems: [...supplier.suppliedItems],
      notes: supplier.notes || "",
    });
    setModal("form");
  };

  const saveSupplier = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.company.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.address.trim()
    ) {
      showMessage("Please complete all required supplier fields.");
      return;
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    if (!emailValid) {
      showMessage("Please enter a valid email address.");
      return;
    }

    if (form.gst.trim() && !/^[0-9A-Z]{15}$/i.test(form.gst.trim())) {
      showMessage("GSTIN must contain exactly 15 letters and numbers.");
      return;
    }

    if (selectedSupplier) {
      setSuppliers((previous) =>
        previous.map((supplier) =>
          supplier.id === selectedSupplier.id
            ? { ...supplier, ...form }
            : supplier
        )
      );
      showMessage("Supplier updated successfully.");
    } else {
      const newSupplier = {
        id: `SUP-${String(Date.now()).slice(-6)}`,
        ...form,
        orders: [],
      };

      setSuppliers((previous) => [newSupplier, ...previous]);
      showMessage("New supplier added successfully.");
    }

    setModal("");
  };

  const toggleItem = (item) => {
    setForm((previous) => ({
      ...previous,
      suppliedItems: previous.suppliedItems.includes(item)
        ? previous.suppliedItems.filter((entry) => entry !== item)
        : [...previous.suppliedItems, item],
    }));
  };

  const openDetails = (supplier) => {
    setSelectedSupplier(supplier);
    setModal("details");
  };

  const openOrders = (supplier) => {
    setSelectedSupplier(supplier);
    setModal("orders");
  };

  const toggleStatus = (supplier) => {
    const newStatus = supplier.status === "Active" ? "Inactive" : "Active";

    setSuppliers((previous) =>
      previous.map((entry) =>
        entry.id === supplier.id
          ? { ...entry, status: newStatus }
          : entry
      )
    );

    if (selectedSupplier?.id === supplier.id) {
      setSelectedSupplier({ ...supplier, status: newStatus });
    }

    showMessage(`${supplier.company} marked ${newStatus.toLowerCase()}.`);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    setSuppliers((previous) =>
      previous.filter((supplier) => supplier.id !== deleteTarget.id)
    );

    setDeleteTarget(null);
    showMessage("Supplier deleted successfully.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                <Truck size={23} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                Suppliers
              </h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Manage supplier profiles, contacts, payment terms and purchase history.
            </p>
          </div>

          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Add Supplier
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
            title="Total Suppliers"
            value={suppliers.length}
            subtitle="Registered suppliers"
            icon={Truck}
            color="blue"
          />
          <StatCard
            title="Active Suppliers"
            value={activeCount}
            subtitle="Currently available"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Inactive Suppliers"
            value={inactiveCount}
            subtitle="Currently disabled"
            icon={XCircle}
            color="amber"
          />
          <StatCard
            title="Purchase History Value"
            value={currency(totalPurchases)}
            subtitle={`${totalOrders} recorded purchase orders`}
            icon={IndianRupee}
            color="purple"
          />
        </div>

        {/* Search and Filters */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center gap-2">
            <Filter size={17} className="text-slate-500" />
            <h2 className="font-semibold text-slate-800">Search & Filters</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search supplier, company, phone or email..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Supplier Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className={inputClass}
            >
              <option value="All">All Payment Terms</option>
              {paymentOptions.map((term) => (
                <option key={term}>{term}</option>
              ))}
            </select>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              Showing {filteredSuppliers.length} of {suppliers.length} suppliers
            </p>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Supplier Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-4">
            <div>
              <h2 className="font-semibold text-slate-900">Supplier Directory</h2>
              <p className="mt-1 text-xs text-slate-500">
                Supplier contact information and purchasing details.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredSuppliers.length} suppliers
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Contact Details</th>
                  <th className="px-4 py-3">GSTIN</th>
                  <th className="px-4 py-3">Supplied Items</th>
                  <th className="px-4 py-3">Payment Terms</th>
                  <th className="px-4 py-3">Orders</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">
                        {supplier.company}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {supplier.name} · {supplier.id}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="flex items-center gap-1.5 text-slate-700">
                        <Phone size={13} className="text-slate-400" />
                        {supplier.phone}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={13} className="text-slate-400" />
                        {supplier.email}
                      </p>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {supplier.gst || "Not provided"}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex max-w-[190px] flex-wrap gap-1">
                        {supplier.suppliedItems.slice(0, 2).map((item) => (
                          <span
                            key={item}
                            className="rounded-md bg-blue-50 px-2 py-1 text-xs text-blue-700"
                          >
                            {item}
                          </span>
                        ))}
                        {supplier.suppliedItems.length > 2 && (
                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                            +{supplier.suppliedItems.length - 2}
                          </span>
                        )}
                        {supplier.suppliedItems.length === 0 && (
                          <span className="text-xs text-slate-400">No items</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {supplier.paymentTerms}
                    </td>

                    <td className="px-4 py-3">
                      <button
                        onClick={() => openOrders(supplier)}
                        className="font-semibold text-blue-600 hover:text-blue-800"
                      >
                        {supplier.orders.length} orders
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge status={supplier.status} />
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View supplier"
                          onClick={() => openDetails(supplier)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Purchase history"
                          onClick={() => openOrders(supplier)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
                        >
                          <History size={16} />
                        </button>
                        <button
                          title="Edit supplier"
                          onClick={() => openEdit(supplier)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title={supplier.status === "Active" ? "Deactivate supplier" : "Activate supplier"}
                          onClick={() => toggleStatus(supplier)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                        >
                          {supplier.status === "Active" ? (
                            <Ban size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </button>
                        <button
                          title="Delete supplier"
                          onClick={() => setDeleteTarget(supplier)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredSuppliers.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <Truck size={34} className="mx-auto text-slate-300" />
                      <p className="mt-2 font-semibold text-slate-700">
                        No suppliers found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters or add a new supplier.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Supplier Modal */}
        {modal === "form" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedSupplier ? "Edit Supplier" : "Add New Supplier"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter supplier and business information.
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveSupplier} className="space-y-5 p-5">
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Contact & Company Details
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Contact Person" required>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Enter contact person"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Company Name" required>
                      <input
                        required
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Enter company name"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Phone Number" required>
                      <input
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Email Address" required>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="supplier@example.com"
                        className={inputClass}
                      />
                    </Field>

                    <div className="sm:col-span-2">
                      <Field label="Business Address" required>
                        <textarea
                          required
                          rows={2}
                          value={form.address}
                          onChange={(e) => setForm({ ...form, address: e.target.value })}
                          placeholder="Enter complete business address"
                          className={inputClass}
                        />
                      </Field>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-3 text-sm font-semibold text-slate-800">
                    Tax & Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="GSTIN (Optional)">
                      <input
                        maxLength={15}
                        value={form.gst}
                        onChange={(e) =>
                          setForm({ ...form, gst: e.target.value.toUpperCase() })
                        }
                        placeholder="15-character GSTIN"
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Payment Terms" required>
                      <select
                        value={form.paymentTerms}
                        onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
                        className={inputClass}
                      >
                        {paymentOptions.map((term) => (
                          <option key={term}>{term}</option>
                        ))}
                      </select>
                    </Field>

                    <Field label="Supplier Status">
                      <select
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        className={inputClass}
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </Field>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <h3 className="mb-1 text-sm font-semibold text-slate-800">
                    Supplied Items
                  </h3>
                  <p className="mb-3 text-xs text-slate-500">
                    Select the products this supplier provides.
                  </p>

                  <div className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
                    {itemOptions.map((item) => (
                      <label
                        key={item}
                        className="flex cursor-pointer items-center gap-2 rounded-md p-2 text-sm text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={form.suppliedItems.includes(item)}
                          onChange={() => toggleItem(item)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        {item}
                      </label>
                    ))}
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    {form.suppliedItems.length} items selected
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <Field label="Internal Notes">
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Add supplier notes..."
                      className={inputClass}
                    />
                  </Field>
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
                    {selectedSupplier ? "Save Changes" : "Add Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Supplier Details Modal */}
        {modal === "details" && selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Supplier Details
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedSupplier.id}
                  </p>
                </div>
                <button
                  onClick={() => setModal("")}
                  className="rounded-lg p-2 hover:bg-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      {selectedSupplier.company}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Contact: {selectedSupplier.name}
                    </p>
                  </div>
                  <StatusBadge status={selectedSupplier.status} />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    [Phone, "Phone", selectedSupplier.phone],
                    [Mail, "Email", selectedSupplier.email],
                    [MapPin, "Address", selectedSupplier.address],
                    [FileText, "GSTIN", selectedSupplier.gst || "Not provided"],
                    [IndianRupee, "Payment Terms", selectedSupplier.paymentTerms],
                    [ShoppingCart, "Previous Orders", selectedSupplier.orders.length],
                  ].map(([Icon, label, value]) => (
                    <div key={label} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="rounded-lg bg-white p-2 text-slate-500">
                        <Icon size={17} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-800">
                    Supplied Items
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.suppliedItems.length > 0 ? (
                      selectedSupplier.suppliedItems.map((item) => (
                        <span
                          key={item}
                          className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                        >
                          {item}
                        </span>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No supplied items listed.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="mb-1 text-sm font-semibold text-slate-800">
                    Internal Notes
                  </h4>
                  <p className="text-sm text-slate-600">
                    {selectedSupplier.notes || "No notes available."}
                  </p>
                </div>

                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
                  <button
                    onClick={() => openOrders(selectedSupplier)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                  >
                    Purchase History
                  </button>
                  <button
                    onClick={() => openEdit(selectedSupplier)}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Edit Supplier
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchase History Modal */}
        {modal === "orders" && selectedSupplier && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
            <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 p-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Purchase History
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedSupplier.company}
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
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-blue-50 p-4">
                    <p className="text-xs text-blue-600">Total Orders</p>
                    <p className="mt-1 text-2xl font-bold text-blue-900">
                      {selectedSupplier.orders.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 p-4">
                    <p className="text-xs text-emerald-600">Purchase Value</p>
                    <p className="mt-1 text-xl font-bold text-emerald-900">
                      {currency(
                        selectedSupplier.orders.reduce(
                          (sum, order) => sum + order.amount,
                          0
                        )
                      )}
                    </p>
                  </div>
                </div>

                {selectedSupplier.orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[450px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                        <tr>
                          <th className="px-3 py-3">Order ID</th>
                          <th className="px-3 py-3">Date</th>
                          <th className="px-3 py-3">Amount</th>
                          <th className="px-3 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedSupplier.orders.map((order) => (
                          <tr key={order.id}>
                            <td className="px-3 py-3 font-semibold text-blue-600">
                              {order.id}
                            </td>
                            <td className="px-3 py-3 text-slate-600">
                              {order.date}
                            </td>
                            <td className="px-3 py-3 font-semibold text-slate-800">
                              {currency(order.amount)}
                            </td>
                            <td className="px-3 py-3">
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-10 text-center">
                    <ShoppingCart size={32} className="mx-auto text-slate-300" />
                    <p className="mt-2 font-semibold text-slate-700">
                      No purchase orders yet
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Purchase orders for this supplier will appear here.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex justify-end">
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

        {/* Delete Confirmation */}
        {deleteTarget && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-3">
            <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={22} />
              </div>
              <h2 className="mt-4 text-lg font-bold text-slate-900">
                Delete Supplier?
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <strong>{deleteTarget.company}</strong>? This will remove the
                supplier from this demo list.
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
                  Delete Supplier
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
