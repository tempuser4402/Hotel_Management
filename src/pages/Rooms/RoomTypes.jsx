
import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  BedDouble,
  Users,
  Pencil,
  Eye,
  Power,
  X,
  CheckCircle2,
  Building2,
  ImagePlus,
  Trash2,
  Wifi,
  Tv,
  Wind,
  Coffee,
  Bath,
  Refrigerator,
  Star,
  RefreshCw,
} from "lucide-react";

const initialRoomTypes = [
  {
    id: "RT-001",
    name: "Standard",
    code: "STD",
    description: "Comfortable room with essential amenities for a pleasant stay.",
    maxAdults: 2,
    maxChildren: 1,
    bedConfiguration: "1 Queen Bed",
    defaultPrice: 2000,
    amenities: ["Wi-Fi", "TV", "AC", "Room Service"],
    roomCount: 40,
    image: "",
    isActive: true,
  },
  {
    id: "RT-002",
    name: "Deluxe",
    code: "DLX",
    description: "Spacious room with upgraded facilities and premium comfort.",
    maxAdults: 2,
    maxChildren: 2,
    bedConfiguration: "1 King Bed",
    defaultPrice: 3000,
    amenities: ["Wi-Fi", "TV", "AC", "Mini Bar", "Room Service"],
    roomCount: 30,
    image: "",
    isActive: true,
  },
  {
    id: "RT-003",
    name: "Suite",
    code: "STE",
    description: "Luxury accommodation with a separate living area.",
    maxAdults: 3,
    maxChildren: 2,
    bedConfiguration: "1 King Bed + Sofa Bed",
    defaultPrice: 5500,
    amenities: ["Wi-Fi", "TV", "AC", "Mini Bar", "Living Area", "Bathtub"],
    roomCount: 20,
    image: "",
    isActive: true,
  },
  {
    id: "RT-004",
    name: "Family Room",
    code: "FAM",
    description: "Large room designed for families and group accommodation.",
    maxAdults: 4,
    maxChildren: 2,
    bedConfiguration: "2 Queen Beds",
    defaultPrice: 4500,
    amenities: ["Wi-Fi", "TV", "AC", "Extra Bed", "Room Service"],
    roomCount: 20,
    image: "",
    isActive: true,
  },
  {
    id: "RT-005",
    name: "Presidential Suite",
    code: "PRS",
    description: "Premium luxury suite with exclusive facilities and spacious interiors.",
    maxAdults: 4,
    maxChildren: 3,
    bedConfiguration: "1 King Bed + 2 Single Beds",
    defaultPrice: 10000,
    amenities: [
      "Wi-Fi",
      "TV",
      "AC",
      "Mini Bar",
      "Living Area",
      "Bathtub",
      "Room Service",
    ],
    roomCount: 10,
    image: "",
    isActive: true,
  },
];

const amenityOptions = [
  "Wi-Fi",
  "TV",
  "AC",
  "Mini Bar",
  "Room Service",
  "Extra Bed",
  "Living Area",
  "Bathtub",
  "Balcony",
  "Coffee Maker",
  "Refrigerator",
  "Safe Locker",
];

const emptyForm = {
  name: "",
  code: "",
  description: "",
  maxAdults: 2,
  maxChildren: 0,
  bedConfiguration: "1 Queen Bed",
  defaultPrice: 2000,
  amenities: [],
  image: "",
};

const amenityIcons = {
  "Wi-Fi": Wifi,
  TV: Tv,
  AC: Wind,
  "Mini Bar": Refrigerator,
  "Room Service": Coffee,
  Bathtub: Bath,
  "Coffee Maker": Coffee,
};

export default function RoomTypes() {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef(null);

  const activeTypes = roomTypes.filter((type) => type.isActive);

  const totalRooms = activeTypes.reduce(
    (sum, type) => sum + Number(type.roomCount || 0),
    0
  );

  const filteredTypes = useMemo(() => {
    const query = search.toLowerCase();

    return roomTypes.filter((type) => {
      const matchesSearch =
        type.name.toLowerCase().includes(query) ||
        type.code.toLowerCase().includes(query) ||
        type.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && type.isActive) ||
        (statusFilter === "Inactive" && !type.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [roomTypes, search, statusFilter]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const openAddModal = () => {
    setSelectedType(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEditModal = (type) => {
    setSelectedType(type);
    setForm({
      ...type,
      amenities: [...type.amenities],
    });
    setModal("form");
  };

  const openDetails = (type) => {
    setSelectedType(type);
    setModal("details");
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((item) => item !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify("Please select a valid image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      notify("Image size must be less than 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => updateForm("image", reader.result);
    reader.readAsDataURL(file);
  };

  const saveRoomType = (e) => {
    e.preventDefault();

    const duplicateName = roomTypes.some(
      (type) =>
        type.name.toLowerCase() === form.name.trim().toLowerCase() &&
        type.id !== selectedType?.id
    );

    const duplicateCode = roomTypes.some(
      (type) =>
        type.code.toLowerCase() === form.code.trim().toLowerCase() &&
        type.id !== selectedType?.id
    );

    if (duplicateName) {
      notify("Room type name already exists.");
      return;
    }

    if (duplicateCode) {
      notify("Room type code already exists.");
      return;
    }

    const payload = {
      ...form,
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      maxAdults: Number(form.maxAdults),
      maxChildren: Number(form.maxChildren),
      defaultPrice: Number(form.defaultPrice),
    };

    if (selectedType) {
      setRoomTypes((prev) =>
        prev.map((type) =>
          type.id === selectedType.id ? { ...type, ...payload } : type
        )
      );
      notify("Room type updated successfully.");
    } else {
      setRoomTypes((prev) => [
        ...prev,
        {
          ...payload,
          id: `RT-${String(Date.now()).slice(-6)}`,
          roomCount: 0,
          isActive: true,
        },
      ]);
      notify("Room type created successfully.");
    }

    setModal(null);
  };

  const toggleActive = (type) => {
    const action = type.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} ${type.name}?`
      )
    ) {
      return;
    }

    setRoomTypes((prev) =>
      prev.map((item) =>
        item.id === type.id
          ? { ...item, isActive: !item.isActive }
          : item
      )
    );

    notify(`${type.name} ${action}d successfully.`);
  };

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={15} />
              Property Operations
              <span>/</span>
              <span className="text-slate-700">Room Types</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Room Types
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Configure room categories, capacities, amenities and default pricing.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Room Type
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total Room Types",
              value: roomTypes.length,
              icon: BedDouble,
              color: "blue",
            },
            {
              label: "Active Types",
              value: activeTypes.length,
              icon: CheckCircle2,
              color: "emerald",
            },
            {
              label: "Total Rooms",
              value: totalRooms,
              icon: Building2,
              color: "violet",
            },
            {
              label: "Average Base Rate",
              value: `₹${activeTypes.length
                ? Math.round(
                    activeTypes.reduce(
                      (sum, type) => sum + Number(type.defaultPrice || 0),
                      0
                    ) / activeTypes.length
                  ).toLocaleString("en-IN")
                : 0}`,
              icon: Star,
              color: "amber",
            },
          ].map((stat) => {
            const Icon = stat.icon;
            const colors = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              violet: "bg-violet-50 text-violet-600",
              amber: "bg-amber-50 text-amber-600",
            };

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${colors[stat.color]}`}>
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Room Type Directory */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">
                Room Type Directory
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredTypes.length} room types found
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
                  placeholder="Search room types..."
                  className={`${inputClass} pl-9 sm:w-64`}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`${selectClass} sm:w-36`}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                title="Reset filters"
                className="rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 hover:bg-slate-50"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 2xl:grid-cols-3">
            {filteredTypes.map((type) => (
              <div
                key={type.id}
                className="overflow-hidden rounded-2xl border border-slate-200 transition hover:border-blue-200 hover:shadow-md"
              >
                {/* Image */}
                <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-blue-50">
                  {type.image ? (
                    <img
                      src={type.image}
                      alt={type.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-blue-300">
                      <BedDouble size={42} strokeWidth={1.3} />
                      <span className="mt-2 text-xs font-medium text-slate-400">
                        No room image
                      </span>
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
                      type.isActive
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {type.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-900">
                          {type.name}
                        </h3>
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold tracking-wide text-slate-500">
                          {type.code}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {type.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <Users size={15} className="text-slate-400" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {type.maxAdults + type.maxChildren}
                      </p>
                      <p className="text-[10px] text-slate-400">Max Guests</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <BedDouble size={15} className="text-slate-400" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        {type.roomCount}
                      </p>
                      <p className="text-[10px] text-slate-400">Rooms</p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-2.5">
                      <Star size={15} className="text-slate-400" />
                      <p className="mt-1 text-sm font-bold text-slate-800">
                        ₹{Number(type.defaultPrice || 0).toLocaleString("en-IN")}
                      </p>
                      <p className="text-[10px] text-slate-400">Per Night</p>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-700">
                        Amenities
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {type.amenities.length} included
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {type.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-lg bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700"
                        >
                          {amenity}
                        </span>
                      ))}

                      {type.amenities.length > 4 && (
                        <span className="rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                          +{type.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <p className="max-w-[65%] truncate text-xs text-slate-500">
                      {type.bedConfiguration}
                    </p>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openDetails(type)}
                        title="View details"
                        className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => openEditModal(type)}
                        title="Edit room type"
                        className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => toggleActive(type)}
                        title={type.isActive ? "Deactivate" : "Activate"}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                      >
                        <Power size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTypes.length === 0 && (
              <div className="col-span-full py-14 text-center">
                <BedDouble className="mx-auto text-slate-300" size={36} />
                <p className="mt-3 font-semibold text-slate-700">
                  No room types found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Try another search or filter.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white p-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedType ? "Edit Room Type" : "Create Room Type"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure category details, capacity and amenities.
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveRoomType} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Room Type Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. Deluxe"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Type Code *
                  </label>
                  <input
                    required
                    value={form.code}
                    onChange={(e) => updateForm("code", e.target.value)}
                    placeholder="e.g. DLX"
                    maxLength={10}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Maximum Adults *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.maxAdults}
                    onChange={(e) => updateForm("maxAdults", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Maximum Children
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.maxChildren}
                    onChange={(e) => updateForm("maxChildren", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Bed Configuration *
                  </label>
                  <select
                    required
                    value={form.bedConfiguration}
                    onChange={(e) =>
                      updateForm("bedConfiguration", e.target.value)
                    }
                    className={selectClass}
                  >
                    <option>1 Single Bed</option>
                    <option>2 Single Beds</option>
                    <option>1 Queen Bed</option>
                    <option>1 King Bed</option>
                    <option>2 Queen Beds</option>
                    <option>1 King Bed + Sofa Bed</option>
                    <option>1 King Bed + 2 Single Beds</option>
                    <option>Custom Configuration</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Default Price Per Night (₹) *
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={form.defaultPrice}
                    onChange={(e) =>
                      updateForm("defaultPrice", e.target.value)
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Describe this room category..."
                  className={inputClass}
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Amenities and Facilities
                  </label>
                  <span className="text-xs text-slate-400">
                    {form.amenities.length} selected
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {amenityOptions.map((amenity) => (
                    <label
                      key={amenity}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-xs transition ${
                        form.amenities.includes(amenity)
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                      />
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Room Type Image
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />

                {form.image ? (
                  <div className="relative h-44 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={form.image}
                      alt="Room type preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateForm("image", "");
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="absolute right-2 top-2 rounded-lg bg-white p-2 text-rose-600 shadow hover:bg-rose-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-slate-500 transition hover:border-blue-300 hover:bg-blue-50"
                  >
                    <ImagePlus size={26} />
                    <span className="mt-2 text-sm font-medium">
                      Upload room image
                    </span>
                    <span className="mt-1 text-xs text-slate-400">
                      PNG, JPG or WEBP · Maximum 5 MB
                    </span>
                  </button>
                )}
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {selectedType ? "Save Changes" : "Create Room Type"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {modal === "details" && selectedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="relative h-48 bg-gradient-to-br from-slate-100 to-blue-50">
              {selectedType.image ? (
                <img
                  src={selectedType.image}
                  alt={selectedType.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-blue-300">
                  <BedDouble size={55} strokeWidth={1.2} />
                </div>
              )}

              <button
                onClick={() => setModal(null)}
                className="absolute right-3 top-3 rounded-lg bg-white/90 p-2 text-slate-500 hover:bg-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    {selectedType.code}
                  </span>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    {selectedType.name}
                  </h2>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedType.isActive
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {selectedType.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="text-sm leading-6 text-slate-500">
                {selectedType.description || "No description provided."}
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Maximum Adults", selectedType.maxAdults],
                  ["Maximum Children", selectedType.maxChildren],
                  [
                    "Total Capacity",
                    selectedType.maxAdults + selectedType.maxChildren,
                  ],
                  ["Assigned Rooms", selectedType.roomCount],
                  ["Bed Configuration", selectedType.bedConfiguration],
                  [
                    "Default Price",
                    `₹${Number(selectedType.defaultPrice || 0).toLocaleString("en-IN")} / night`,
                  ],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">
                  Included Amenities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedType.amenities.map((amenity) => {
                    const Icon = amenityIcons[amenity] || CheckCircle2;
                    return (
                      <span
                        key={amenity}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700"
                      >
                        <Icon size={14} />
                        {amenity}
                      </span>
                    );
                  })}

                  {selectedType.amenities.length === 0 && (
                    <p className="text-sm text-slate-400">
                      No amenities configured.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <button
                  onClick={() => openEditModal(selectedType)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={16} />
                  Edit Room Type
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
          <CheckCircle2 size={18} className="text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
