
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  PackageSearch,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  X,
  MapPin,
  CalendarDays,
  UserRound,
  Phone,
  ImagePlus,
  Camera,
  Filter,
  Check,
  RotateCcw,
  Package,
  FileText,
} from "lucide-react";

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
};

const initialItems = [
  {
    id: "LF-1001",
    name: "Black Leather Wallet",
    category: "Personal Belongings",
    description: "Black leather wallet containing some cards and cash.",
    location: "Room 204",
    foundDate: today(),
    foundTime: "09:30",
    foundBy: "Priya Singh",
    guestName: "Rahul Mehta",
    guestRoom: "204",
    guestPhone: "9876543210",
    storageLocation: "Security Office - Locker A1",
    status: "In Storage",
    image: "",
    notes: "Wallet handed over to housekeeping supervisor.",
    returnDate: "",
    returnedTo: "",
    returnProof: "",
  },
  {
    id: "LF-1002",
    name: "Silver Wrist Watch",
    category: "Jewellery & Accessories",
    description: "Silver-colored wrist watch found near the swimming pool.",
    location: "Swimming Pool",
    foundDate: today(),
    foundTime: "11:15",
    foundBy: "Ananya Patel",
    guestName: "",
    guestRoom: "",
    guestPhone: "",
    storageLocation: "Security Office - Locker B2",
    status: "Guest Contacted",
    image: "",
    notes: "Guest identification is pending.",
    returnDate: "",
    returnedTo: "",
    returnProof: "",
  },
  {
    id: "LF-1003",
    name: "Blue Laptop Bag",
    category: "Electronics",
    description: "Blue laptop bag with charger and accessories.",
    location: "Conference Hall",
    foundDate: today(),
    foundTime: "14:20",
    foundBy: "Rahul Verma",
    guestName: "Ankit Sharma",
    guestRoom: "305",
    guestPhone: "9876543212",
    storageLocation: "Security Office - Locker C1",
    status: "Returned",
    image: "",
    notes: "Verified with guest before handing over.",
    returnDate: today(),
    returnedTo: "Ankit Sharma",
    returnProof: "Guest signature collected at reception.",
  },
];

const categories = [
  "Personal Belongings",
  "Electronics",
  "Jewellery & Accessories",
  "Clothing",
  "Documents",
  "Cash & Cards",
  "Keys",
  "Bags & Luggage",
  "Other",
];

const locations = [
  "Guest Room",
  "Lobby",
  "Restaurant",
  "Swimming Pool",
  "Conference Hall",
  "Parking Area",
  "Reception",
  "Corridor",
  "Garden",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100";

const cn = (...classes) => classes.filter(Boolean).join(" ");

function Badge({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    purple: "bg-violet-50 text-violet-700",
  };

  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    purple: "bg-violet-50 text-violet-600",
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
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-600">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Modal({ title, subtitle, onClose, children, width = "max-w-2xl" }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={cn("max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl", width)}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

const emptyForm = {
  name: "",
  category: "Personal Belongings",
  description: "",
  location: "Guest Room",
  foundDate: today(),
  foundTime: "10:00",
  foundBy: "",
  guestName: "",
  guestRoom: "",
  guestPhone: "",
  storageLocation: "",
  status: "In Storage",
  image: "",
  notes: "",
};

export default function LostFound() {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnForm, setReturnForm] = useState({
    returnedTo: "",
    returnDate: today(),
    returnProof: "",
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const stats = useMemo(() => ({
    total: items.length,
    stored: items.filter((item) => item.status === "In Storage").length,
    contacted: items.filter((item) => item.status === "Guest Contacted").length,
    returned: items.filter((item) => item.status === "Returned").length,
  }), [items]);

  const filteredItems = useMemo(() => {
    const query = search.toLowerCase();

    return items.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.guestName.toLowerCase().includes(query) ||
        item.foundBy.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || item.status === statusFilter;
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesDate = !dateFilter || item.foundDate === dateFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesDate;
    });
  }, [items, search, statusFilter, categoryFilter, dateFilter]);

  const statusTone = (status) => {
    if (status === "Returned") return "green";
    if (status === "Guest Contacted") return "blue";
    if (status === "In Storage") return "amber";
    if (status === "Disposed") return "slate";
    return "slate";
  };

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, foundDate: today() });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      location: item.location,
      foundDate: item.foundDate,
      foundTime: item.foundTime,
      foundBy: item.foundBy,
      guestName: item.guestName,
      guestRoom: item.guestRoom,
      guestPhone: item.guestPhone,
      storageLocation: item.storageLocation,
      status: item.status,
      image: item.image,
      notes: item.notes,
    });
    setShowForm(true);
  };

  const handleImage = (event, field, setter) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      window.alert("Image size must be 5 MB or less.");
      event.target.value = "";
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setter((previous) => ({ ...previous, [field]: imageUrl }));
  };

  const saveItem = (event) => {
    event.preventDefault();

    if (editingId) {
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingId ? { ...item, ...form } : item
        )
      );
    } else {
      setItems((previous) => [
        {
          ...form,
          id: `LF-${Date.now().toString().slice(-6)}`,
          returnDate: "",
          returnedTo: "",
          returnProof: "",
        },
        ...previous,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteItem = (id) => {
    if (!window.confirm("Are you sure you want to delete this lost and found record?")) return;
    setItems((previous) => previous.filter((item) => item.id !== id));
    setSelectedItem(null);
  };

  const updateStatus = (id, status) => {
    setItems((previous) =>
      previous.map((item) => item.id === id ? { ...item, status } : item)
    );

    setSelectedItem((previous) =>
      previous && previous.id === id ? { ...previous, status } : previous
    );
  };

  const openReturnForm = (item) => {
    setReturnForm({
      returnedTo: item.guestName || "",
      returnDate: today(),
      returnProof: "",
    });
    setShowReturnForm(true);
  };

  const confirmReturn = (event) => {
    event.preventDefault();

    if (!selectedItem) return;

    const updated = {
      status: "Returned",
      returnedTo: returnForm.returnedTo,
      returnDate: returnForm.returnDate,
      returnProof: returnForm.returnProof,
    };

    setItems((previous) =>
      previous.map((item) =>
        item.id === selectedItem.id ? { ...item, ...updated } : item
      )
    );

    setSelectedItem((previous) => previous ? { ...previous, ...updated } : previous);
    setShowReturnForm(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-indigo-600">
              StayFlow / Housekeeping
            </p>
            <h1 className="text-2xl font-bold text-slate-900">Lost & Found</h1>
            <p className="mt-1 text-sm text-slate-500">
              Register found items, track storage, contact guests and record item returns.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={17} />
            Add Found Item
          </button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="Total Found Items" value={stats.total} subtitle="All registered records" icon={PackageSearch} tone="purple" />
          <StatCard title="In Storage" value={stats.stored} subtitle="Items securely stored" icon={Archive} tone="amber" />
          <StatCard title="Guest Contacted" value={stats.contacted} subtitle="Awaiting guest collection" icon={Clock} tone="blue" />
          <StatCard title="Returned Items" value={stats.returned} subtitle="Successfully handed over" icon={CheckCircle2} tone="green" />
        </div>

        {/* Process information */}
        <div className="grid gap-3 md:grid-cols-3">
          <div className="flex gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="rounded-xl bg-white p-2 text-blue-600"><Package size={19} /></div>
            <div>
              <p className="text-sm font-semibold text-blue-900">1. Register Item</p>
              <p className="mt-1 text-xs text-blue-700">Record the item, discovery location, date and staff member.</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/70 p-4">
            <div className="rounded-xl bg-white p-2 text-amber-600"><Archive size={19} /></div>
            <div>
              <p className="text-sm font-semibold text-amber-900">2. Secure Storage</p>
              <p className="mt-1 text-xs text-amber-700">Record the storage location and guest contact details.</p>
            </div>
          </div>
          <div className="flex gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="rounded-xl bg-white p-2 text-emerald-600"><CheckCircle2 size={19} /></div>
            <div>
              <p className="text-sm font-semibold text-emerald-900">3. Record Return</p>
              <p className="mt-1 text-xs text-emerald-700">Document who collected the item and proof of handover.</p>
            </div>
          </div>
        </div>

        {/* Items table */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Found Items Register</h2>
              <p className="mt-1 text-xs text-slate-400">
                {filteredItems.length} item(s) displayed
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:flex">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  className={cn(inputClass, "pl-9 xl:w-56")}
                  placeholder="Search item, guest, location..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>

              <select
                className={cn(inputClass, "xl:w-44")}
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="In Storage">In Storage</option>
                <option value="Guest Contacted">Guest Contacted</option>
                <option value="Returned">Returned</option>
                <option value="Disposed">Disposed</option>
              </select>

              <select
                className={cn(inputClass, "xl:w-48")}
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>

              <input
                type="date"
                className={cn(inputClass, "xl:w-40")}
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                title="Filter by found date"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Found At</th>
                  <th className="px-4 py-3">Found By</th>
                  <th className="px-4 py-3">Guest Details</th>
                  <th className="px-4 py-3">Storage Location</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                          ) : (
                            <PackageSearch size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.category}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-700">{item.location}</p>
                      <p className="text-xs text-slate-400">{item.foundDate} · {item.foundTime}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.foundBy}</td>
                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-700">{item.guestName || "Not identified"}</p>
                      <p className="text-xs text-slate-400">{item.guestRoom ? `Room ${item.guestRoom}` : "No room details"}</p>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.storageLocation || "Not recorded"}</td>
                    <td className="px-4 py-4">
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          title="View item"
                          onClick={() => setSelectedItem(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          title="Edit item"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          title="Delete item"
                          onClick={() => deleteItem(item.id)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredItems.length === 0 && (
              <div className="py-14 text-center">
                <PackageSearch size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-600">No found items</p>
                <p className="mt-1 text-sm text-slate-400">Change your filters or register a new found item.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Add / Edit item modal */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Found Item" : "Register Found Item"}
          subtitle="Enter the item details and where it is being securely stored."
          onClose={() => setShowForm(false)}
          width="max-w-3xl"
        >
          <form onSubmit={saveItem} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Item Name" required>
                <input
                  required
                  className={inputClass}
                  placeholder="e.g. Black leather wallet"
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                />
              </Field>

              <Field label="Category" required>
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                >
                  {categories.map((category) => <option key={category}>{category}</option>)}
                </select>
              </Field>

              <Field label="Found Location" required>
                <select
                  className={inputClass}
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                >
                  {locations.map((location) => <option key={location}>{location}</option>)}
                </select>
              </Field>

              <Field label="Specific Location / Room">
                <input
                  className={inputClass}
                  placeholder="e.g. Room 204 or near reception"
                  value={form.guestRoom}
                  onChange={(event) => setForm({ ...form, guestRoom: event.target.value })}
                />
              </Field>

              <Field label="Found Date" required>
                <input
                  required
                  type="date"
                  className={inputClass}
                  value={form.foundDate}
                  onChange={(event) => setForm({ ...form, foundDate: event.target.value })}
                />
              </Field>

              <Field label="Found Time" required>
                <input
                  required
                  type="time"
                  className={inputClass}
                  value={form.foundTime}
                  onChange={(event) => setForm({ ...form, foundTime: event.target.value })}
                />
              </Field>

              <Field label="Found By (Staff Member)" required>
                <input
                  required
                  className={inputClass}
                  placeholder="Staff member name"
                  value={form.foundBy}
                  onChange={(event) => setForm({ ...form, foundBy: event.target.value })}
                />
              </Field>

              <Field label="Storage Location" required>
                <input
                  required
                  className={inputClass}
                  placeholder="e.g. Security office - Locker A1"
                  value={form.storageLocation}
                  onChange={(event) => setForm({ ...form, storageLocation: event.target.value })}
                />
              </Field>

              <Field label="Guest Name">
                <input
                  className={inputClass}
                  placeholder="Guest name, if identified"
                  value={form.guestName}
                  onChange={(event) => setForm({ ...form, guestName: event.target.value })}
                />
              </Field>

              <Field label="Guest Phone">
                <input
                  type="tel"
                  className={inputClass}
                  placeholder="Guest contact number"
                  value={form.guestPhone}
                  onChange={(event) => setForm({ ...form, guestPhone: event.target.value })}
                />
              </Field>

              <Field label="Item Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  <option>In Storage</option>
                  <option>Guest Contacted</option>
                  <option>Returned</option>
                  <option>Disposed</option>
                </select>
              </Field>
            </div>

            <Field label="Item Description" required>
              <textarea
                required
                rows={3}
                className={inputClass}
                placeholder="Describe the item, its condition and identifying details..."
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
              />
            </Field>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-600">Item Photograph</label>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex h-28 w-36 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
                  {form.image ? (
                    <img src={form.image} alt="Found item preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400">
                      <ImagePlus size={24} className="mx-auto mb-1" />
                      <span className="text-xs">No image selected</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">
                    <Camera size={16} />
                    Upload Photograph
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => handleImage(event, "image", setForm)}
                    />
                  </label>
                  <p className="mt-2 text-xs text-slate-400">Image formats only · Maximum 5 MB</p>
                  {form.image && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, image: "" })}
                      className="mt-2 text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>
            </div>

            <Field label="Additional Notes">
              <textarea
                rows={2}
                className={inputClass}
                placeholder="Any special handling instructions or additional information..."
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                {editingId ? "Save Changes" : "Register Item"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Item details modal */}
      {selectedItem && !showReturnForm && (
        <Modal
          title={selectedItem.name}
          subtitle={`${selectedItem.id} · ${selectedItem.category}`}
          onClose={() => setSelectedItem(null)}
          width="max-w-3xl"
        >
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
              <div className="flex min-h-36 items-center justify-center overflow-hidden rounded-xl bg-slate-100 text-slate-400">
                {selectedItem.image ? (
                  <img src={selectedItem.image} alt={selectedItem.name} className="h-full max-h-52 w-full object-cover" />
                ) : (
                  <PackageSearch size={42} />
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Current Status</p>
                  <div className="mt-1"><Badge tone={statusTone(selectedItem.status)}>{selectedItem.status}</Badge></div>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Description</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedItem.description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Additional Notes</p>
                  <p className="mt-1 text-sm text-slate-700">{selectedItem.notes || "No additional notes."}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["Found Location", selectedItem.location],
                ["Found Date & Time", `${selectedItem.foundDate} · ${selectedItem.foundTime}`],
                ["Found By", selectedItem.foundBy],
                ["Storage Location", selectedItem.storageLocation],
                ["Guest Name", selectedItem.guestName || "Not identified"],
                ["Guest Room", selectedItem.guestRoom || "Not recorded"],
                ["Guest Phone", selectedItem.guestPhone || "Not recorded"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            {selectedItem.status === "Returned" && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <p className="font-semibold text-emerald-800">Return Information</p>
                <div className="mt-2 grid gap-2 text-sm text-emerald-800 sm:grid-cols-2">
                  <p>Returned to: <strong>{selectedItem.returnedTo || "—"}</strong></p>
                  <p>Return date: <strong>{selectedItem.returnDate || "—"}</strong></p>
                </div>
                <p className="mt-2 text-xs text-emerald-700">
                  Proof: {selectedItem.returnProof || "No proof details recorded."}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => deleteItem(selectedItem.id)}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
              >
                <Trash2 size={15} /> Delete
              </button>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    openEdit(selectedItem);
                    setSelectedItem(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Pencil size={15} /> Edit
                </button>
                {selectedItem.status !== "Returned" && selectedItem.status !== "Disposed" && (
                  <>
                    {selectedItem.status === "In Storage" && (
                      <button
                        type="button"
                        onClick={() => updateStatus(selectedItem.id, "Guest Contacted")}
                        className="rounded-xl border border-blue-200 px-3 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
                      >
                        Mark Guest Contacted
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => openReturnForm(selectedItem)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check size={15} /> Record Return
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Return confirmation modal */}
      {showReturnForm && selectedItem && (
        <Modal
          title="Record Item Return"
          subtitle={`Confirm handover for ${selectedItem.name}.`}
          onClose={() => setShowReturnForm(false)}
        >
          <form onSubmit={confirmReturn} className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">
              Record the person collecting the item and any available proof of handover.
            </div>

            <Field label="Returned To" required>
              <input
                required
                className={inputClass}
                placeholder="Guest or authorized person's full name"
                value={returnForm.returnedTo}
                onChange={(event) => setReturnForm({ ...returnForm, returnedTo: event.target.value })}
              />
            </Field>

            <Field label="Return Date" required>
              <input
                required
                type="date"
                className={inputClass}
                value={returnForm.returnDate}
                onChange={(event) => setReturnForm({ ...returnForm, returnDate: event.target.value })}
              />
            </Field>

            <Field label="Return Proof / Handover Notes" required>
              <textarea
                required
                rows={3}
                className={inputClass}
                placeholder="e.g. Guest signature collected, ID verified, or handover receipt number..."
                value={returnForm.returnProof}
                onChange={(event) => setReturnForm({ ...returnForm, returnProof: event.target.value })}
              />
            </Field>

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setShowReturnForm(false)}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                <Check size={16} /> Confirm Return
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
