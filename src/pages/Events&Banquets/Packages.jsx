import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Copy,
  Eye,
  X,
  IndianRupee,
  Users,
  Utensils,
  Sparkles,
  CheckCircle2,
  Package,
  Tag,
  Clock,
} from "lucide-react";

const initialPackages = [
  {
    id: "PKG-001",
    name: "Silver",
    category: "Standard",
    description: "A basic event package for small celebrations and family functions.",
    pricingType: "Per Person",
    price: 799,
    minGuests: 25,
    maxGuests: 100,
    duration: 4,
    discount: 0,
    status: "Active",
    services: ["Venue setup", "Basic decoration", "Welcome drinks", "Event coordinator"],
    menu: [
      "Welcome Drink",
      "Paneer Tikka",
      "Veg Manchurian",
      "Dal Tadka",
      "Shahi Paneer",
      "Jeera Rice",
      "Butter Naan",
      "Gulab Jamun",
    ],
  },
  {
    id: "PKG-002",
    name: "Gold",
    category: "Premium",
    description: "An enhanced package with premium vegetarian food and decoration.",
    pricingType: "Per Person",
    price: 1199,
    minGuests: 50,
    maxGuests: 200,
    duration: 5,
    discount: 5,
    status: "Active",
    services: [
      "Venue setup",
      "Stage decoration",
      "Floral decoration",
      "Welcome drinks",
      "Sound system",
      "Event coordinator",
    ],
    menu: [
      "Mocktail",
      "Paneer Tikka",
      "Hara Bhara Kebab",
      "Veg Spring Roll",
      "Shahi Paneer",
      "Dal Makhani",
      "Veg Pulao",
      "Assorted Breads",
      "Ice Cream",
      "Gulab Jamun",
    ],
  },
  {
    id: "PKG-003",
    name: "Premium",
    category: "Luxury",
    description: "A complete event experience with premium arrangements and catering.",
    pricingType: "Per Person",
    price: 1799,
    minGuests: 100,
    maxGuests: 300,
    duration: 6,
    discount: 10,
    status: "Active",
    services: [
      "Premium venue setup",
      "Luxury stage decoration",
      "Floral entrance",
      "Welcome drinks",
      "DJ and sound system",
      "Professional lighting",
      "Dedicated event coordinator",
      "Guest assistance",
    ],
    menu: [
      "Premium Mocktails",
      "Paneer Malai Tikka",
      "Dahi Ke Kebab",
      "Veg Seekh Kebab",
      "Live Chaat Counter",
      "Paneer Lababdar",
      "Dal Makhani",
      "Veg Biryani",
      "Assorted Breads",
      "Live Dessert Counter",
      "Ice Cream",
    ],
  },
  {
    id: "PKG-004",
    name: "Corporate Meeting",
    category: "Corporate",
    description: "Fixed-price conference package for business meetings and seminars.",
    pricingType: "Fixed",
    price: 18000,
    minGuests: 10,
    maxGuests: 80,
    duration: 4,
    discount: 0,
    status: "Active",
    services: [
      "Conference hall setup",
      "Projector",
      "Wi-Fi",
      "Whiteboard",
      "Tea and coffee",
      "Water bottles",
    ],
    menu: [
      "Tea",
      "Coffee",
      "Veg Sandwich",
      "Cookies",
      "Veg Lunch",
    ],
  },
];

const initialExtraServices = [
  { id: "EXT-001", name: "Stage Decoration", price: 8000, unit: "Per Event" },
  { id: "EXT-002", name: "Flower Decoration", price: 5000, unit: "Per Event" },
  { id: "EXT-003", name: "DJ and Sound System", price: 6000, unit: "Per Event" },
  { id: "EXT-004", name: "Photography", price: 10000, unit: "Per Event" },
  { id: "EXT-005", name: "Projector", price: 2000, unit: "Per Day" },
  { id: "EXT-006", name: "Additional Lighting", price: 3500, unit: "Per Event" },
  { id: "EXT-007", name: "Valet Parking", price: 1500, unit: "Per Event" },
  { id: "EXT-008", name: "Extra Event Coordinator", price: 2500, unit: "Per Event" },
];

const emptyPackage = {
  name: "",
  category: "Standard",
  description: "",
  pricingType: "Per Person",
  price: "",
  minGuests: 25,
  maxGuests: 100,
  duration: 4,
  discount: 0,
  status: "Active",
  services: [],
  menu: [],
};

const serviceOptions = [
  "Venue setup",
  "Premium venue setup",
  "Basic decoration",
  "Stage decoration",
  "Luxury stage decoration",
  "Floral decoration",
  "Floral entrance",
  "Welcome drinks",
  "Sound system",
  "DJ and sound system",
  "Professional lighting",
  "Projector",
  "Wi-Fi",
  "Whiteboard",
  "Tea and coffee",
  "Water bottles",
  "Guest assistance",
  "Event coordinator",
  "Dedicated event coordinator",
];

const menuOptions = [
  "Welcome Drink",
  "Premium Mocktails",
  "Tea",
  "Coffee",
  "Paneer Tikka",
  "Paneer Malai Tikka",
  "Hara Bhara Kebab",
  "Dahi Ke Kebab",
  "Veg Seekh Kebab",
  "Veg Manchurian",
  "Veg Spring Roll",
  "Live Chaat Counter",
  "Shahi Paneer",
  "Paneer Lababdar",
  "Dal Tadka",
  "Dal Makhani",
  "Veg Pulao",
  "Veg Biryani",
  "Jeera Rice",
  "Assorted Breads",
  "Butter Naan",
  "Veg Sandwich",
  "Cookies",
  "Ice Cream",
  "Gulab Jamun",
  "Live Dessert Counter",
];

const currency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

export default function Packages() {
  const [packages, setPackages] = useState(initialPackages);
  const [extraServices, setExtraServices] = useState(initialExtraServices);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [activeTab, setActiveTab] = useState("Packages");
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [form, setForm] = useState(emptyPackage);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    price: "",
    unit: "Per Event",
  });

  const filteredPackages = useMemo(
    () =>
      packages.filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          categoryFilter === "All" || item.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
      }),
    [packages, search, categoryFilter, statusFilter]
  );

  const activeCount = packages.filter(
    (item) => item.status === "Active"
  ).length;

  const averagePrice = packages.length
    ? Math.round(
        packages.reduce((sum, item) => sum + Number(item.price), 0) /
          packages.length
      )
    : 0;

  const openAddPackage = () => {
    setEditingId(null);
    setForm(emptyPackage);
    setShowPackageModal(true);
  };

  const openEditPackage = (item) => {
    setEditingId(item.id);
    setForm({
      ...item,
      services: [...item.services],
      menu: [...item.menu],
    });
    setShowPackageModal(true);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const savePackage = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      form.price === "" ||
      Number(form.price) < 0 ||
      Number(form.minGuests) < 1 ||
      Number(form.maxGuests) < Number(form.minGuests)
    ) {
      alert("Please enter valid package details and guest limits.");
      return;
    }

    const packageData = {
      ...form,
      price: Number(form.price),
      minGuests: Number(form.minGuests),
      maxGuests: Number(form.maxGuests),
      duration: Number(form.duration),
      discount: Number(form.discount),
    };

    if (editingId) {
      setPackages((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...packageData } : item
        )
      );
    } else {
      setPackages((prev) => [
        ...prev,
        {
          ...packageData,
          id: `PKG-${String(Date.now()).slice(-5)}`,
        },
      ]);
    }

    setShowPackageModal(false);
    setEditingId(null);
    setForm(emptyPackage);
  };

  const duplicatePackage = (item) => {
    const copy = {
      ...item,
      id: `PKG-${String(Date.now()).slice(-5)}`,
      name: `${item.name} Copy`,
      status: "Inactive",
      services: [...item.services],
      menu: [...item.menu],
    };

    setPackages((prev) => [...prev, copy]);
  };

  const togglePackageStatus = (id) => {
    setPackages((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const deletePackage = (item) => {
    if (window.confirm(`Delete the ${item.name} package?`)) {
      setPackages((prev) => prev.filter((pkg) => pkg.id !== item.id));
    }
  };

  const openAddService = () => {
    setEditingServiceId(null);
    setServiceForm({ name: "", price: "", unit: "Per Event" });
    setShowServiceModal(true);
  };

  const openEditService = (service) => {
    setEditingServiceId(service.id);
    setServiceForm({
      name: service.name,
      price: service.price,
      unit: service.unit,
    });
    setShowServiceModal(true);
  };

  const saveExtraService = (e) => {
    e.preventDefault();

    if (
      !serviceForm.name.trim() ||
      serviceForm.price === "" ||
      Number(serviceForm.price) < 0
    ) {
      alert("Enter a service name and valid price.");
      return;
    }

    if (editingServiceId) {
      setExtraServices((prev) =>
        prev.map((service) =>
          service.id === editingServiceId
            ? {
                ...service,
                ...serviceForm,
                price: Number(serviceForm.price),
              }
            : service
        )
      );
    } else {
      setExtraServices((prev) => [
        ...prev,
        {
          ...serviceForm,
          id: `EXT-${String(Date.now()).slice(-5)}`,
          price: Number(serviceForm.price),
        },
      ]);
    }

    setShowServiceModal(false);
  };

  const deleteExtraService = (service) => {
    if (window.confirm(`Delete ${service.name}?`)) {
      setExtraServices((prev) =>
        prev.filter((item) => item.id !== service.id)
      );
    }
  };

  const closePackageModal = () => {
    setShowPackageModal(false);
    setEditingId(null);
    setForm(emptyPackage);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Package size={16} />
            <span>Events & Banquets</span>
            <span>/</span>
            <span className="text-slate-800">Packages & Pricing</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Packages & Pricing
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Create event packages, manage catering menus and set additional service prices.
          </p>
        </div>

        <button
          onClick={openAddPackage}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Package
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Packages"
          value={packages.length}
          icon={<Package size={20} />}
          color="blue"
        />
        <StatCard
          title="Active Packages"
          value={activeCount}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Extra Services"
          value={extraServices.length}
          icon={<Sparkles size={20} />}
          color="purple"
        />
        <StatCard
          title="Average Package Price"
          value={currency(averagePrice)}
          icon={<IndianRupee size={20} />}
          color="orange"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200">
        {["Packages", "Additional Services"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`border-b-2 px-4 py-3 text-sm font-medium ${
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Packages" && (
        <div className="space-y-5">
          {/* Filters */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">Event Packages</h2>
              <p className="mt-1 text-xs text-slate-500">
                Manage standard and customized event packages.
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
                  placeholder="Search packages..."
                  className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-48"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
                <option value="Corporate">Corporate</option>
                <option value="Custom">Custom</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Package Cards */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 2xl:grid-cols-3">
            {filteredPackages.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-sm"
              >
                <div className="border-b border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                          {item.category}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">{item.id}</p>
                    </div>

                    <div className="rounded-lg bg-white p-2 text-blue-600 shadow-sm">
                      <Tag size={21} />
                    </div>
                  </div>

                  <p className="mt-3 min-h-10 text-sm text-slate-600">
                    {item.description || "No package description provided."}
                  </p>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-500">
                        {item.pricingType === "Per Person"
                          ? "Price per guest"
                          : "Fixed package price"}
                      </p>
                      <p className="mt-1 text-2xl font-bold text-slate-900">
                        {currency(item.price)}
                      </p>
                    </div>

                    {item.discount > 0 && (
                      <span className="rounded-lg bg-green-50 px-2.5 py-1.5 text-xs font-semibold text-green-700">
                        {item.discount}% discount
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-4 p-4">
                  <div className="grid grid-cols-3 gap-2">
                    <SmallMetric
                      icon={<Users size={15} />}
                      label="Min Guests"
                      value={item.minGuests}
                    />
                    <SmallMetric
                      icon={<Users size={15} />}
                      label="Max Guests"
                      value={item.maxGuests}
                    />
                    <SmallMetric
                      icon={<Clock size={15} />}
                      label="Duration"
                      value={`${item.duration} hrs`}
                    />
                  </div>

                  <div>
                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Included Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {item.services.slice(0, 4).map((service) => (
                        <span
                          key={service}
                          className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                        >
                          {service}
                        </span>
                      ))}
                      {item.services.length > 4 && (
                        <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                          +{item.services.length - 4} more
                        </span>
                      )}
                      {item.services.length === 0 && (
                        <span className="text-xs text-slate-400">
                          No services selected
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <Utensils size={14} />
                      Catering Menu
                    </h4>
                    <p className="text-sm text-slate-600">
                      {item.menu.length
                        ? item.menu.slice(0, 5).join(", ") +
                          (item.menu.length > 5
                            ? ` +${item.menu.length - 5} more`
                            : "")
                        : "No menu items selected"}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3">
                    <div className="flex gap-1">
                      <ActionButton
                        title="View package"
                        onClick={() => setSelectedPackage(item)}
                      >
                        <Eye size={16} />
                      </ActionButton>
                      <ActionButton
                        title="Edit package"
                        onClick={() => openEditPackage(item)}
                      >
                        <Pencil size={16} />
                      </ActionButton>
                      <ActionButton
                        title="Duplicate package"
                        onClick={() => duplicatePackage(item)}
                      >
                        <Copy size={16} />
                      </ActionButton>
                      <ActionButton
                        title="Delete package"
                        danger
                        onClick={() => deletePackage(item)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>

                    <button
                      onClick={() => togglePackageStatus(item.id)}
                      className={`rounded-lg px-3 py-2 text-xs font-medium ${
                        item.status === "Active"
                          ? "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {item.status === "Active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredPackages.length === 0 && (
              <div className="col-span-full rounded-xl border border-slate-200 bg-white py-12 text-center">
                <Package className="mx-auto mb-3 text-slate-300" size={36} />
                <p className="font-medium text-slate-700">No packages found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search or create a new package.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Additional Services" && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-900">
                Additional Services
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Set prices for services that can be added to an event booking.
              </p>
            </div>

            <button
              onClick={openAddService}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              Add Service
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Service ID</th>
                  <th className="px-4 py-3">Service Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Pricing Unit</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {extraServices.map((service) => (
                  <tr
                    key={service.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 font-medium text-blue-700">
                      {service.id}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {service.name}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {currency(service.price)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {service.unit}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <ActionButton
                          title="Edit service"
                          onClick={() => openEditService(service)}
                        >
                          <Pencil size={16} />
                        </ActionButton>
                        <ActionButton
                          title="Delete service"
                          danger
                          onClick={() => deleteExtraService(service)}
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {extraServices.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-10 text-center text-slate-500"
                    >
                      No additional services added yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Package Modal */}
      {showPackageModal && (
        <Modal
          title={editingId ? "Edit Package" : "Create New Package"}
          onClose={closePackageModal}
          wide
        >
          <form onSubmit={savePackage} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Package Name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Silver / Gold / Custom Wedding"
                  className="form-input"
                />
              </FormField>

              <FormField label="Category">
                <select
                  value={form.category}
                  onChange={(e) => updateForm("category", e.target.value)}
                  className="form-input"
                >
                  <option>Standard</option>
                  <option>Premium</option>
                  <option>Luxury</option>
                  <option>Corporate</option>
                  <option>Custom</option>
                </select>
              </FormField>

              <FormField label="Pricing Type">
                <select
                  value={form.pricingType}
                  onChange={(e) => updateForm("pricingType", e.target.value)}
                  className="form-input"
                >
                  <option>Per Person</option>
                  <option>Fixed</option>
                </select>
              </FormField>

              <FormField label="Package Price (₹) *">
                <input
                  required
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => updateForm("price", e.target.value)}
                  placeholder="Enter package price"
                  className="form-input"
                />
              </FormField>

              <FormField label="Minimum Guests">
                <input
                  type="number"
                  min="1"
                  value={form.minGuests}
                  onChange={(e) => updateForm("minGuests", e.target.value)}
                  className="form-input"
                />
              </FormField>

              <FormField label="Maximum Guests">
                <input
                  type="number"
                  min="1"
                  value={form.maxGuests}
                  onChange={(e) => updateForm("maxGuests", e.target.value)}
                  className="form-input"
                />
              </FormField>

              <FormField label="Event Duration (hours)">
                <input
                  type="number"
                  min="1"
                  value={form.duration}
                  onChange={(e) => updateForm("duration", e.target.value)}
                  className="form-input"
                />
              </FormField>

              <FormField label="Discount (%)">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discount}
                  onChange={(e) => updateForm("discount", e.target.value)}
                  className="form-input"
                />
              </FormField>

              <FormField label="Package Status">
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="form-input"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </FormField>
            </div>

            <FormField label="Package Description">
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe what this package offers..."
                className="form-input resize-none"
              />
            </FormField>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Included Services
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select services included in this package.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {serviceOptions.map((service) => (
                  <label
                    key={service}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.services.includes(service)}
                      onChange={() => toggleArrayItem("services", service)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {service}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">
                  Vegetarian Catering Menu
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Select the vegetarian food items included in this package.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {menuOptions.map((food) => (
                  <label
                    key={food}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.menu.includes(food)}
                      onChange={() => toggleArrayItem("menu", food)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {food}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={closePackageModal}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingId ? "Update Package" : "Save Package"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Additional Service Modal */}
      {showServiceModal && (
        <Modal
          title={editingServiceId ? "Edit Additional Service" : "Add Additional Service"}
          onClose={() => setShowServiceModal(false)}
        >
          <form onSubmit={saveExtraService} className="space-y-4">
            <FormField label="Service Name *">
              <input
                required
                value={serviceForm.name}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g. Photography"
                className="form-input"
              />
            </FormField>

            <FormField label="Price (₹) *">
              <input
                required
                type="number"
                min="0"
                value={serviceForm.price}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="Enter service price"
                className="form-input"
              />
            </FormField>

            <FormField label="Pricing Unit">
              <select
                value={serviceForm.unit}
                onChange={(e) =>
                  setServiceForm((prev) => ({ ...prev, unit: e.target.value }))
                }
                className="form-input"
              >
                <option>Per Event</option>
                <option>Per Day</option>
                <option>Per Hour</option>
                <option>Per Person</option>
              </select>
            </FormField>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
              >
                {editingServiceId ? "Update Service" : "Save Service"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Package Details Modal */}
      {selectedPackage && (
        <Modal
          title={`${selectedPackage.name} Package`}
          onClose={() => setSelectedPackage(null)}
          wide
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  {selectedPackage.id} · {selectedPackage.category}
                </p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">
                  {currency(selectedPackage.price)}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedPackage.pricingType === "Per Person"
                    ? "Per guest"
                    : "Fixed package price"}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedPackage.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {selectedPackage.status}
              </span>
            </div>

            <p className="text-sm text-slate-600">
              {selectedPackage.description}
            </p>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <DetailBox label="Minimum Guests" value={selectedPackage.minGuests} />
              <DetailBox label="Maximum Guests" value={selectedPackage.maxGuests} />
              <DetailBox label="Duration" value={`${selectedPackage.duration} hours`} />
              <DetailBox label="Discount" value={`${selectedPackage.discount}%`} />
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                Included Services
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedPackage.services.map((service) => (
                  <span
                    key={service}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-700"
                  >
                    {service}
                  </span>
                ))}
                {selectedPackage.services.length === 0 && (
                  <p className="text-sm text-slate-400">No services included.</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Utensils size={16} />
                Vegetarian Catering Menu
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {selectedPackage.menu.map((food) => (
                  <div
                    key={food}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
                  >
                    {food}
                  </div>
                ))}
                {selectedPackage.menu.length === 0 && (
                  <p className="text-sm text-slate-400">No menu items selected.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-4">
              <button
                onClick={() => {
                  openEditPackage(selectedPackage);
                  setSelectedPackage(null);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                <Pencil size={15} />
                Edit Package
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* Reusable Components */

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        <div className={`rounded-lg p-2 ${colors[color]}`}>{icon}</div>
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function SmallMetric({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <div className="mb-1 flex items-center gap-1 text-slate-400">
        {icon}
        <span className="text-[11px]">{label}</span>
      </div>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function ActionButton({ children, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`rounded-lg border p-2 transition ${
        danger
          ? "border-red-100 text-red-500 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function DetailBox({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ${
          wide ? "max-w-4xl" : "max-w-xl"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}