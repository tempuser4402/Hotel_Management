import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Users,
  IndianRupee,
  CalendarDays,
  Clock,
  MapPin,
  Building2,
  CheckCircle2,
  Ban,
  Wrench,
  History,
  Ruler,
  Sparkles,
} from "lucide-react";

const initialVenues = [
  {
    id: "VEN-001",
    name: "Banquet Hall",
    type: "Banquet",
    description: "Large indoor venue suitable for weddings and grand celebrations.",
    capacity: 300,
    area: "5000 sq. ft.",
    dimensions: "100 × 50 ft.",
    rentalPrice: 50000,
    priceUnit: "Per Event",
    setupTime: 180,
    cleanupTime: 120,
    facilities: ["AC", "Stage", "Sound System", "Projector", "Changing Room", "Generator"],
    status: "Active",
    maintenanceBlocks: [],
    bookings: [
      {
        id: "EVT-1001",
        customer: "Rahul Sharma",
        event: "Wedding Reception",
        date: "2026-11-15",
        status: "Confirmed",
      },
    ],
  },
  {
    id: "VEN-002",
    name: "Conference Hall",
    type: "Conference",
    description: "Professional space for meetings, seminars and corporate events.",
    capacity: 100,
    area: "1800 sq. ft.",
    dimensions: "60 × 30 ft.",
    rentalPrice: 15000,
    priceUnit: "Per Day",
    setupTime: 60,
    cleanupTime: 45,
    facilities: ["AC", "Projector", "Wi-Fi", "Whiteboard", "Sound System"],
    status: "Active",
    maintenanceBlocks: [],
    bookings: [
      {
        id: "EVT-1002",
        customer: "ABC Technologies",
        event: "Annual Meeting",
        date: "2026-11-20",
        status: "Tentative",
      },
    ],
  },
  {
    id: "VEN-003",
    name: "Restaurant / Party Area",
    type: "Party Area",
    description: "A flexible space for birthdays, family functions and small parties.",
    capacity: 150,
    area: "2500 sq. ft.",
    dimensions: "50 × 50 ft.",
    rentalPrice: 20000,
    priceUnit: "Per Event",
    setupTime: 90,
    cleanupTime: 60,
    facilities: ["AC", "Music System", "Lighting", "Outdoor Seating", "Parking"],
    status: "Active",
    maintenanceBlocks: [],
    bookings: [],
  },
];

const emptyVenue = {
  name: "",
  type: "Banquet",
  description: "",
  capacity: "",
  area: "",
  dimensions: "",
  rentalPrice: "",
  priceUnit: "Per Event",
  setupTime: 60,
  cleanupTime: 60,
  facilities: [],
  status: "Active",
};

const facilityOptions = [
  "AC",
  "Stage",
  "Sound System",
  "Projector",
  "Wi-Fi",
  "Whiteboard",
  "Generator",
  "Changing Room",
  "Lighting",
  "Music System",
  "Outdoor Seating",
  "Parking",
  "Catering Counter",
  "Washroom",
];

const formatCurrency = (amount) =>
  `₹${Number(amount || 0).toLocaleString("en-IN")}`;

const formatDate = (date) =>
  date
    ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

export default function Venues() {
  const [venues, setVenues] = useState(initialVenues);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const [form, setForm] = useState(emptyVenue);
  const [maintenanceDate, setMaintenanceDate] = useState("");
  const [maintenanceReason, setMaintenanceReason] = useState("");

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      const matchesSearch =
        venue.name.toLowerCase().includes(search.toLowerCase()) ||
        venue.id.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || venue.status === statusFilter;

      const matchesType = typeFilter === "All" || venue.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [venues, search, statusFilter, typeFilter]);

  const totalCapacity = venues.reduce(
    (total, venue) => total + Number(venue.capacity || 0),
    0
  );

  const activeCount = venues.filter(
    (venue) => venue.status === "Active"
  ).length;

  const maintenanceCount = venues.reduce(
    (total, venue) => total + venue.maintenanceBlocks.length,
    0
  );

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyVenue);
    setShowForm(true);
  };

  const openEditForm = (venue) => {
    setEditingId(venue.id);
    setForm({
      ...venue,
      facilities: [...venue.facilities],
    });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyVenue);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleFacility = (facility) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const saveVenue = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.capacity ||
      Number(form.capacity) <= 0 ||
      form.rentalPrice === "" ||
      Number(form.rentalPrice) < 0
    ) {
      alert("Please enter a valid venue name, capacity and rental price.");
      return;
    }

    if (editingId) {
      setVenues((prev) =>
        prev.map((venue) =>
          venue.id === editingId
            ? {
                ...venue,
                ...form,
                capacity: Number(form.capacity),
                rentalPrice: Number(form.rentalPrice),
                setupTime: Number(form.setupTime),
                cleanupTime: Number(form.cleanupTime),
              }
            : venue
        )
      );
    } else {
      const newVenue = {
        ...form,
        id: `VEN-${String(Date.now()).slice(-5)}`,
        capacity: Number(form.capacity),
        rentalPrice: Number(form.rentalPrice),
        setupTime: Number(form.setupTime),
        cleanupTime: Number(form.cleanupTime),
        maintenanceBlocks: [],
        bookings: [],
      };

      setVenues((prev) => [...prev, newVenue]);
    }

    closeForm();
  };

  const toggleVenueStatus = (venueId) => {
    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === venueId
          ? {
              ...venue,
              status: venue.status === "Active" ? "Inactive" : "Active",
            }
          : venue
      )
    );

    setSelectedVenue((prev) =>
      prev?.id === venueId
        ? {
            ...prev,
            status: prev.status === "Active" ? "Inactive" : "Active",
          }
        : prev
    );
  };

  const deleteVenue = (venue) => {
    if (venue.bookings.length > 0) {
      alert("This venue has booking history and cannot be deleted.");
      return;
    }

    if (window.confirm(`Delete ${venue.name}?`)) {
      setVenues((prev) => prev.filter((item) => item.id !== venue.id));
      if (selectedVenue?.id === venue.id) setSelectedVenue(null);
    }
  };

  const addMaintenanceBlock = (e) => {
    e.preventDefault();

    if (!maintenanceDate || !maintenanceReason.trim()) {
      alert("Enter a maintenance date and reason.");
      return;
    }

    const updatedVenue = {
      ...selectedVenue,
      maintenanceBlocks: [
        ...selectedVenue.maintenanceBlocks,
        {
          id: `MT-${Date.now()}`,
          date: maintenanceDate,
          reason: maintenanceReason.trim(),
        },
      ],
    };

    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === selectedVenue.id ? updatedVenue : venue
      )
    );

    setSelectedVenue(updatedVenue);
    setMaintenanceDate("");
    setMaintenanceReason("");
  };

  const removeMaintenanceBlock = (blockId) => {
    const updatedVenue = {
      ...selectedVenue,
      maintenanceBlocks: selectedVenue.maintenanceBlocks.filter(
        (block) => block.id !== blockId
      ),
    };

    setVenues((prev) =>
      prev.map((venue) =>
        venue.id === selectedVenue.id ? updatedVenue : venue
      )
    );

    setSelectedVenue(updatedVenue);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 size={16} />
            <span>Events & Banquets</span>
            <span>/</span>
            <span className="text-slate-800">Venues & Halls</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Venues & Halls
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage venue details, capacity, pricing and maintenance schedules.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add New Venue
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Venues"
          value={venues.length}
          icon={<Building2 size={20} />}
          color="blue"
        />
        <StatCard
          title="Active Venues"
          value={activeCount}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
        <StatCard
          title="Total Guest Capacity"
          value={totalCapacity.toLocaleString("en-IN")}
          icon={<Users size={20} />}
          color="purple"
        />
        <StatCard
          title="Maintenance Blocks"
          value={maintenanceCount}
          icon={<Wrench size={20} />}
          color="orange"
        />
      </div>

      {/* Venue Listing */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">Venue Listing</h2>
            <p className="mt-1 text-xs text-slate-500">
              View and manage all available event spaces.
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
                placeholder="Search venue..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-52"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Types</option>
              <option value="Banquet">Banquet</option>
              <option value="Conference">Conference</option>
              <option value="Party Area">Party Area</option>
              <option value="Other">Other</option>
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

        <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="overflow-hidden rounded-xl border border-slate-200 transition hover:border-blue-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2.5 text-blue-700">
                    <Building2 size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {venue.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {venue.id} · {venue.type}
                    </p>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    venue.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {venue.status}
                </span>
              </div>

              <div className="space-y-4 p-4">
                <p className="text-sm text-slate-600">
                  {venue.description || "No description added."}
                </p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <InfoItem
                    icon={<Users size={16} />}
                    label="Capacity"
                    value={`${venue.capacity} Guests`}
                  />
                  <InfoItem
                    icon={<IndianRupee size={16} />}
                    label="Rental Price"
                    value={formatCurrency(venue.rentalPrice)}
                  />
                  <InfoItem
                    icon={<Ruler size={16} />}
                    label="Area"
                    value={venue.area || "Not set"}
                  />
                  <InfoItem
                    icon={<Clock size={16} />}
                    label="Setup Time"
                    value={`${venue.setupTime} min`}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Facilities
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {venue.facilities.slice(0, 5).map((facility) => (
                      <span
                        key={facility}
                        className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                      >
                        {facility}
                      </span>
                    ))}
                    {venue.facilities.length > 5 && (
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs text-blue-700">
                        +{venue.facilities.length - 5} more
                      </span>
                    )}
                    {venue.facilities.length === 0 && (
                      <span className="text-xs text-slate-400">
                        No facilities added
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays size={14} />
                      {venue.bookings.length} Bookings
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Wrench size={14} />
                      {venue.maintenanceBlocks.length} Blocks
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    <ActionButton
                      title="View Details"
                      onClick={() => {
                        setSelectedVenue(venue);
                        setActiveTab("Details");
                      }}
                    >
                      <Eye size={16} />
                    </ActionButton>

                    <ActionButton
                      title="Edit Venue"
                      onClick={() => openEditForm(venue)}
                    >
                      <Pencil size={16} />
                    </ActionButton>

                    <ActionButton
                      title={
                        venue.status === "Active"
                          ? "Deactivate Venue"
                          : "Activate Venue"
                      }
                      onClick={() => toggleVenueStatus(venue.id)}
                    >
                      {venue.status === "Active" ? (
                        <Ban size={16} />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                    </ActionButton>

                    <ActionButton
                      title="Delete Venue"
                      onClick={() => deleteVenue(venue)}
                      danger
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredVenues.length === 0 && (
            <div className="col-span-full py-12 text-center">
              <Building2 className="mx-auto mb-3 text-slate-300" size={36} />
              <p className="font-medium text-slate-700">No venues found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Venue Modal */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Venue" : "Add New Venue"}
          onClose={closeForm}
          wide
        >
          <form onSubmit={saveVenue} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Venue Name *">
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  placeholder="e.g. Banquet Hall"
                  className="form-input"
                />
              </FormField>

              <FormField label="Venue Type *">
                <select
                  value={form.type}
                  onChange={(e) => updateForm("type", e.target.value)}
                  className="form-input"
                >
                  <option value="Banquet">Banquet</option>
                  <option value="Conference">Conference</option>
                  <option value="Party Area">Party Area</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>

              <FormField label="Guest Capacity *">
                <input
                  required
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) => updateForm("capacity", e.target.value)}
                  placeholder="Maximum guests"
                  className="form-input"
                />
              </FormField>

              <FormField label="Rental Price (₹) *">
                <input
                  required
                  type="number"
                  min="0"
                  value={form.rentalPrice}
                  onChange={(e) => updateForm("rentalPrice", e.target.value)}
                  placeholder="Enter rental price"
                  className="form-input"
                />
              </FormField>

              <FormField label="Pricing Unit">
                <select
                  value={form.priceUnit}
                  onChange={(e) => updateForm("priceUnit", e.target.value)}
                  className="form-input"
                >
                  <option value="Per Event">Per Event</option>
                  <option value="Per Day">Per Day</option>
                  <option value="Per Hour">Per Hour</option>
                </select>
              </FormField>

              <FormField label="Area">
                <input
                  value={form.area}
                  onChange={(e) => updateForm("area", e.target.value)}
                  placeholder="e.g. 5000 sq. ft."
                  className="form-input"
                />
              </FormField>

              <FormField label="Dimensions">
                <input
                  value={form.dimensions}
                  onChange={(e) => updateForm("dimensions", e.target.value)}
                  placeholder="e.g. 100 × 50 ft."
                  className="form-input"
                />
              </FormField>

              <FormField label="Venue Status">
                <select
                  value={form.status}
                  onChange={(e) => updateForm("status", e.target.value)}
                  className="form-input"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </FormField>

              <FormField label="Setup Time (minutes)">
                <input
                  type="number"
                  min="0"
                  value={form.setupTime}
                  onChange={(e) => updateForm("setupTime", e.target.value)}
                  className="form-input"
                />
              </FormField>

              <FormField label="Cleanup Time (minutes)">
                <input
                  type="number"
                  min="0"
                  value={form.cleanupTime}
                  onChange={(e) => updateForm("cleanupTime", e.target.value)}
                  className="form-input"
                />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                placeholder="Describe the venue..."
                className="form-input resize-none"
              />
            </FormField>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">
                Venue Facilities
              </p>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {facilityOptions.map((facility) => (
                  <label
                    key={facility}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm text-slate-600 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={form.facilities.includes(facility)}
                      onChange={() => toggleFacility(facility)}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {facility}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                {editingId ? "Update Venue" : "Save Venue"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Venue Details Modal */}
      {selectedVenue && (
        <Modal
          title={selectedVenue.name}
          onClose={() => setSelectedVenue(null)}
          wide
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-500">
                {selectedVenue.id} · {selectedVenue.type}
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  selectedVenue.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {selectedVenue.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 border-b border-slate-200">
              {["Details", "Maintenance", "Booking History"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`border-b-2 px-3 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Details" && (
              <div className="space-y-5">
                <p className="text-sm text-slate-600">
                  {selectedVenue.description || "No description available."}
                </p>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <DetailBox
                    label="Capacity"
                    value={`${selectedVenue.capacity} Guests`}
                  />
                  <DetailBox
                    label="Rental Price"
                    value={formatCurrency(selectedVenue.rentalPrice)}
                  />
                  <DetailBox
                    label="Price Unit"
                    value={selectedVenue.priceUnit}
                  />
                  <DetailBox
                    label="Area"
                    value={selectedVenue.area || "—"}
                  />
                  <DetailBox
                    label="Dimensions"
                    value={selectedVenue.dimensions || "—"}
                  />
                  <DetailBox
                    label="Setup / Cleanup"
                    value={`${selectedVenue.setupTime} / ${selectedVenue.cleanupTime} min`}
                  />
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-semibold text-slate-800">
                    Facilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedVenue.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs text-blue-700"
                      >
                        {facility}
                      </span>
                    ))}
                    {selectedVenue.facilities.length === 0 && (
                      <span className="text-sm text-slate-400">
                        No facilities listed.
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    openEditForm(selectedVenue);
                    setSelectedVenue(null);
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                >
                  <Pencil size={15} />
                  Edit Venue
                </button>
              </div>
            )}

            {activeTab === "Maintenance" && (
              <div className="space-y-4">
                <form
                  onSubmit={addMaintenanceBlock}
                  className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 md:grid-cols-[1fr_2fr_auto]"
                >
                  <input
                    type="date"
                    value={maintenanceDate}
                    onChange={(e) => setMaintenanceDate(e.target.value)}
                    className="form-input"
                  />
                  <input
                    value={maintenanceReason}
                    onChange={(e) => setMaintenanceReason(e.target.value)}
                    placeholder="Maintenance reason"
                    className="form-input"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Add Block
                  </button>
                </form>

                {selectedVenue.maintenanceBlocks.length === 0 ? (
                  <EmptyState
                    icon={<Wrench size={28} />}
                    title="No maintenance blocks"
                    description="Add dates when this venue should not be booked."
                  />
                ) : (
                  <div className="space-y-2">
                    {selectedVenue.maintenanceBlocks.map((block) => (
                      <div
                        key={block.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {block.reason}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {formatDate(block.date)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeMaintenanceBlock(block.id)}
                          className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          title="Remove maintenance block"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Booking History" && (
              <div className="overflow-x-auto">
                {selectedVenue.bookings.length === 0 ? (
                  <EmptyState
                    icon={<History size={28} />}
                    title="No booking history"
                    description="Bookings for this venue will appear here."
                  />
                ) : (
                  <table className="w-full min-w-[600px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                      <tr>
                        <th className="p-3">Event ID</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Event</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedVenue.bookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="border-t border-slate-100"
                        >
                          <td className="p-3 font-medium text-blue-700">
                            {booking.id}
                          </td>
                          <td className="p-3">{booking.customer}</td>
                          <td className="p-3">{booking.event}</td>
                          <td className="p-3">{formatDate(booking.date)}</td>
                          <td className="p-3">
                            <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs text-green-700">
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
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

function InfoItem({ icon, label, value }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-xs">{label}</span>
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

function EmptyState({ icon, title, description }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 py-10 text-center">
      <div className="mb-2 flex justify-center text-slate-300">{icon}</div>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
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