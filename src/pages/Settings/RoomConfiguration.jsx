
import { useState } from "react";
import {
  BedDouble,
  Building2,
  Layers3,
  Settings2,
  Plus,
  Pencil,
  Trash2,
  Save,
  RotateCcw,
  X,
  CheckCircle2,
  Sparkles,
  DoorOpen,
  Hash,
  ClipboardCheck,
} from "lucide-react";

const initialRoomTypes = [
  {
    id: 1,
    name: "Standard",
    code: "STD",
    description: "Comfortable standard accommodation.",
    basePrice: 2000,
    capacity: 2,
    extraBeds: 1,
    bedType: "Queen",
    amenities: ["Wi-Fi", "TV", "Air Conditioning"],
    status: "Active",
  },
  {
    id: 2,
    name: "Deluxe",
    code: "DLX",
    description: "Spacious deluxe room with upgraded facilities.",
    basePrice: 3500,
    capacity: 2,
    extraBeds: 2,
    bedType: "King",
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
    status: "Active",
  },
  {
    id: 3,
    name: "Suite",
    code: "STE",
    description: "Premium suite with separate living area.",
    basePrice: 6000,
    capacity: 4,
    extraBeds: 2,
    bedType: "King",
    amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Balcony"],
    status: "Active",
  },
];

const initialFloors = [
  { id: 1, name: "Ground Floor", code: "G", number: 0, rooms: 10, status: "Active" },
  { id: 2, name: "First Floor", code: "1", number: 1, rooms: 20, status: "Active" },
  { id: 3, name: "Second Floor", code: "2", number: 2, rooms: 20, status: "Active" },
  { id: 4, name: "Third Floor", code: "3", number: 3, rooms: 15, status: "Active" },
];

const initialAmenities = [
  "Wi-Fi",
  "TV",
  "Air Conditioning",
  "Mini Bar",
  "Balcony",
  "Telephone",
  "Room Service",
  "Coffee Maker",
  "Safe Locker",
  "Hair Dryer",
  "Work Desk",
  "Refrigerator",
];

const initialSettings = {
  bedTypes: ["Single", "Twin", "Double", "Queen", "King", "Bunk Bed"],
  defaultRoomStatus: "Available",
  numberingPrefix: "",
  numberingFormat: "floor-room",
  startingNumber: "01",
  digits: "2",
  housekeepingEnabled: true,
  autoCleanAfterCheckout: true,
  inspectionRequired: true,
  cleaningPriority: "Normal",
  cleaningDeadline: "14:00",
  defaultCleaningDuration: "45",
  maintenanceBlocksRoom: true,
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

const emptyRoomType = {
  name: "",
  code: "",
  description: "",
  basePrice: "",
  capacity: "2",
  extraBeds: "0",
  bedType: "Queen",
  amenities: [],
  status: "Active",
};

const emptyFloor = {
  name: "",
  code: "",
  number: "",
  rooms: "0",
  status: "Active",
};

function Field({ label, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, description, icon: Icon, children }) {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 px-5 py-4">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
          <Icon size={19} />
        </div>
        <div>
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && (
          <p className="mt-0.5 text-xs text-slate-500">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-blue-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
        active
          ? "bg-emerald-50 text-emerald-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function RoomConfiguration() {
  const [roomTypes, setRoomTypes] = useState(initialRoomTypes);
  const [savedRoomTypes, setSavedRoomTypes] = useState(initialRoomTypes);

  const [floors, setFloors] = useState(initialFloors);
  const [savedFloors, setSavedFloors] = useState(initialFloors);

  const [amenities, setAmenities] = useState(initialAmenities);
  const [savedAmenities, setSavedAmenities] = useState(initialAmenities);

  const [settings, setSettings] = useState(initialSettings);
  const [savedSettings, setSavedSettings] = useState(initialSettings);

  const [roomModal, setRoomModal] = useState(false);
  const [floorModal, setFloorModal] = useState(false);
  const [amenityModal, setAmenityModal] = useState(false);

  const [roomForm, setRoomForm] = useState(emptyRoomType);
  const [floorForm, setFloorForm] = useState(emptyFloor);
  const [amenityName, setAmenityName] = useState("");

  const [editingRoomId, setEditingRoomId] = useState(null);
  const [editingFloorId, setEditingFloorId] = useState(null);

  const [notice, setNotice] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
    setNotice("");
  };

  const openAddRoom = () => {
    setEditingRoomId(null);
    setRoomForm({ ...emptyRoomType, bedType: settings.bedTypes[0] || "" });
    setRoomModal(true);
  };

  const openEditRoom = (room) => {
    setEditingRoomId(room.id);
    setRoomForm({
      ...room,
      basePrice: String(room.basePrice),
      capacity: String(room.capacity),
      extraBeds: String(room.extraBeds),
      amenities: [...room.amenities],
    });
    setRoomModal(true);
  };

  const saveRoomType = (event) => {
    event.preventDefault();

    const normalizedCode = roomForm.code.trim().toUpperCase();

    if (!roomForm.name.trim() || !normalizedCode) return;

    const duplicateCode = roomTypes.some(
      (room) =>
        room.code.toLowerCase() === normalizedCode.toLowerCase() &&
        room.id !== editingRoomId
    );

    if (duplicateCode) {
      setNotice("A room type with this code already exists.");
      return;
    }

    const record = {
      ...roomForm,
      code: normalizedCode,
      name: roomForm.name.trim(),
      basePrice: Number(roomForm.basePrice) || 0,
      capacity: Number(roomForm.capacity) || 1,
      extraBeds: Number(roomForm.extraBeds) || 0,
    };

    if (editingRoomId !== null) {
      setRoomTypes((prev) =>
        prev.map((room) =>
          room.id === editingRoomId ? { ...record, id: editingRoomId } : room
        )
      );
    } else {
      setRoomTypes((prev) => [...prev, { ...record, id: Date.now() }]);
    }

    setIsDirty(true);
    setNotice("");
    setRoomModal(false);
  };

  const deleteRoomType = (id) => {
    const room = roomTypes.find((item) => item.id === id);
    if (!room) return;

    if (!window.confirm(`Delete the "${room.name}" room type?`)) return;

    setRoomTypes((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  const openAddFloor = () => {
    setEditingFloorId(null);
    setFloorForm(emptyFloor);
    setFloorModal(true);
  };

  const openEditFloor = (floor) => {
    setEditingFloorId(floor.id);
    setFloorForm({
      ...floor,
      number: String(floor.number),
      rooms: String(floor.rooms),
    });
    setFloorModal(true);
  };

  const saveFloor = (event) => {
    event.preventDefault();

    if (!floorForm.name.trim() || !floorForm.code.trim()) return;

    const duplicate = floors.some(
      (floor) =>
        floor.code.toLowerCase() === floorForm.code.trim().toLowerCase() &&
        floor.id !== editingFloorId
    );

    if (duplicate) {
      setNotice("A floor with this code already exists.");
      return;
    }

    const record = {
      ...floorForm,
      name: floorForm.name.trim(),
      code: floorForm.code.trim().toUpperCase(),
      number: Number(floorForm.number),
      rooms: Number(floorForm.rooms) || 0,
    };

    if (editingFloorId !== null) {
      setFloors((prev) =>
        prev.map((floor) =>
          floor.id === editingFloorId
            ? { ...record, id: editingFloorId }
            : floor
        )
      );
    } else {
      setFloors((prev) => [...prev, { ...record, id: Date.now() }]);
    }

    setFloorModal(false);
    setIsDirty(true);
    setNotice("");
  };

  const deleteFloor = (id) => {
    const floor = floors.find((item) => item.id === id);
    if (!floor) return;

    if (!window.confirm(`Delete "${floor.name}"?`)) return;

    setFloors((prev) => prev.filter((item) => item.id !== id));
    setIsDirty(true);
  };

  const addAmenity = (event) => {
    event.preventDefault();
    const value = amenityName.trim();

    if (!value) return;

    if (amenities.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setNotice("This amenity already exists.");
      return;
    }

    setAmenities((prev) => [...prev, value]);
    setAmenityName("");
    setAmenityModal(false);
    setIsDirty(true);
    setNotice("");
  };

  const deleteAmenity = (value) => {
    setAmenities((prev) => prev.filter((item) => item !== value));
    setRoomTypes((prev) =>
      prev.map((room) => ({
        ...room,
        amenities: room.amenities.filter((item) => item !== value),
      }))
    );
    setIsDirty(true);
  };

  const toggleRoomAmenity = (value) => {
    setRoomForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(value)
        ? prev.amenities.filter((item) => item !== value)
        : [...prev.amenities, value],
    }));
  };

  const addBedType = (event) => {
    event.preventDefault();
    const value = event.currentTarget.elements.bedType.value.trim();

    if (
      value &&
      !settings.bedTypes.some(
        (item) => item.toLowerCase() === value.toLowerCase()
      )
    ) {
      updateSetting("bedTypes", [...settings.bedTypes, value]);
      event.currentTarget.reset();
    }
  };

  const removeBedType = (value) => {
    updateSetting(
      "bedTypes",
      settings.bedTypes.filter((item) => item !== value)
    );
  };

  const saveAll = (event) => {
    event.preventDefault();

    setSavedRoomTypes([...roomTypes]);
    setSavedFloors([...floors]);
    setSavedAmenities([...amenities]);
    setSavedSettings({ ...settings, bedTypes: [...settings.bedTypes] });
    setIsDirty(false);
    setNotice("Room configuration saved for this demo session.");
  };

  const resetChanges = () => {
    setRoomTypes([...savedRoomTypes]);
    setFloors([...savedFloors]);
    setAmenities([...savedAmenities]);
    setSettings({
      ...savedSettings,
      bedTypes: [...savedSettings.bedTypes],
    });
    setIsDirty(false);
    setNotice("Unsaved changes have been reset.");
  };

  const restoreDefaults = () => {
    if (!window.confirm("Restore all room configuration sample defaults?")) return;

    setRoomTypes([...initialRoomTypes]);
    setSavedRoomTypes([...initialRoomTypes]);

    setFloors([...initialFloors]);
    setSavedFloors([...initialFloors]);

    setAmenities([...initialAmenities]);
    setSavedAmenities([...initialAmenities]);

    setSettings({
      ...initialSettings,
      bedTypes: [...initialSettings.bedTypes],
    });
    setSavedSettings({
      ...initialSettings,
      bedTypes: [...initialSettings.bedTypes],
    });

    setIsDirty(false);
    setNotice("Default room configuration has been restored.");
  };

  const currency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const totalConfiguredRooms = floors.reduce(
    (total, floor) => total + Number(floor.rooms || 0),
    0
  );

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Settings2 size={16} />
              Configuration / Room Configuration
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Room Configuration
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Configure room categories, amenities, floors, numbering, and
              housekeeping defaults.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={resetChanges}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={16} />
              Reset Changes
            </button>
            <button
              type="button"
              onClick={restoreDefaults}
              className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Restore Defaults
            </button>
          </div>
        </div>

        {notice && (
          <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <CheckCircle2 size={17} />
            {notice}
          </div>
        )}

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Room Types",
              value: roomTypes.length,
              icon: BedDouble,
            },
            {
              label: "Configured Floors",
              value: floors.length,
              icon: Layers3,
            },
            {
              label: "Configured Rooms",
              value: totalConfiguredRooms,
              icon: DoorOpen,
            },
            {
              label: "Available Amenities",
              value: amenities.length,
              icon: Sparkles,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">
                    {item.label}
                  </span>
                  <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                    <Icon size={18} />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <form onSubmit={saveAll} className="space-y-5">
          {/* Room Types */}
          <Section
            title="Room Types & Categories"
            description="Create room categories and configure their capacity, pricing, and facilities."
            icon={BedDouble}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openAddRoom}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Room Type
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Room Type</th>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Base Price</th>
                    <th className="px-4 py-3">Capacity</th>
                    <th className="px-4 py-3">Bed Type</th>
                    <th className="px-4 py-3">Amenities</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roomTypes.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-500">
                        No room types configured. Add your first room type.
                      </td>
                    </tr>
                  ) : (
                    roomTypes.map((room) => (
                      <tr key={room.id}>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-800">{room.name}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {room.description}
                          </p>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-600">
                          {room.code}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {currency(room.basePrice)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {room.capacity} guests
                          <p className="text-xs text-slate-400">
                            +{room.extraBeds} extra beds
                          </p>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{room.bedType}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {room.amenities.length} selected
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={room.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditRoom(room)}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              aria-label="Edit room type"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteRoomType(room.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              aria-label="Delete room type"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Amenities */}
          <Section
            title="Room Amenities"
            description="Maintain the list of facilities that can be assigned to room types."
            icon={Sparkles}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAmenityName("");
                  setAmenityModal(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
              >
                <Plus size={16} />
                Add Amenity
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {amenities.map((amenity) => (
                <div
                  key={amenity}
                  className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2.5"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {amenity}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteAmenity(amenity)}
                    className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                    aria-label={`Remove ${amenity}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {amenities.length === 0 && (
                <p className="col-span-full py-5 text-center text-sm text-slate-500">
                  No amenities configured.
                </p>
              )}
            </div>
          </Section>

          {/* Bed Types */}
          <Section
            title="Bed Types"
            description="Manage the available bed configurations for your rooms."
            icon={BedDouble}
          >
            <form onSubmit={addBedType} className="flex flex-col gap-2 sm:flex-row">
              <input
                name="bedType"
                required
                className={inputClass}
                placeholder="Enter a bed type, e.g. Sofa Bed"
              />
              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Bed Type
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              {settings.bedTypes.map((bed) => (
                <span
                  key={bed}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                >
                  {bed}
                  <button
                    type="button"
                    onClick={() => removeBedType(bed)}
                    className="text-slate-400 hover:text-red-600"
                    aria-label={`Remove ${bed}`}
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </Section>

          {/* Floors */}
          <Section
            title="Floor Configuration"
            description="Define floors, floor codes, and room capacity on each floor."
            icon={Layers3}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openAddFloor}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Plus size={16} />
                Add Floor
              </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[650px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Floor Name</th>
                    <th className="px-4 py-3">Floor Code</th>
                    <th className="px-4 py-3">Floor Number</th>
                    <th className="px-4 py-3">Room Count</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {floors.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                        No floors configured.
                      </td>
                    </tr>
                  ) : (
                    floors.map((floor) => (
                      <tr key={floor.id}>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {floor.name}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{floor.code}</td>
                        <td className="px-4 py-3 text-slate-600">{floor.number}</td>
                        <td className="px-4 py-3 text-slate-600">{floor.rooms}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={floor.status} />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditFloor(floor)}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              aria-label="Edit floor"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteFloor(floor.id)}
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                              aria-label="Delete floor"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Numbering */}
          <Section
            title="Room Numbering Rules"
            description="Set a default format for generating room numbers."
            icon={Hash}
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Field label="Room Number Prefix">
                <input
                  value={settings.numberingPrefix}
                  onChange={(e) => updateSetting("numberingPrefix", e.target.value.toUpperCase())}
                  className={inputClass}
                  placeholder="e.g. RM"
                />
              </Field>

              <Field label="Numbering Format">
                <select
                  value={settings.numberingFormat}
                  onChange={(e) => updateSetting("numberingFormat", e.target.value)}
                  className={inputClass}
                >
                  <option value="floor-room">Floor + Room Number</option>
                  <option value="sequential">Sequential Number</option>
                  <option value="prefix-sequential">Prefix + Sequential</option>
                </select>
              </Field>

              <Field label="Starting Number">
                <input
                  type="number"
                  min="1"
                  value={settings.startingNumber}
                  onChange={(e) => updateSetting("startingNumber", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Number of Digits">
                <select
                  value={settings.digits}
                  onChange={(e) => updateSetting("digits", e.target.value)}
                  className={inputClass}
                >
                  <option value="2">2 Digits</option>
                  <option value="3">3 Digits</option>
                  <option value="4">4 Digits</option>
                </select>
              </Field>
            </div>

            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4">
              <p className="text-xs font-medium text-blue-700">Number Preview</p>
              <p className="mt-1 text-2xl font-bold tracking-wide text-blue-900">
                {(() => {
                  const padded = String(
                    Math.max(0, Number(settings.startingNumber) || 1)
                  ).padStart(Number(settings.digits), "0");

                  if (settings.numberingFormat === "floor-room") {
                    return `${settings.numberingPrefix}1${padded}`;
                  }

                  if (settings.numberingFormat === "prefix-sequential") {
                    return `${settings.numberingPrefix}${padded}`;
                  }

                  return padded;
                })()}
              </p>
              <p className="mt-1 text-xs text-blue-700">
                Example generated room number based on the current format.
              </p>
            </div>
          </Section>

          {/* Default room status */}
          <Section
            title="Default Room Status"
            description="Choose the initial status assigned when a new room is created."
            icon={DoorOpen}
          >
            <Field label="Default Status">
              <select
                value={settings.defaultRoomStatus}
                onChange={(e) => updateSetting("defaultRoomStatus", e.target.value)}
                className={inputClass}
              >
                <option value="Available">Available</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inspected">Inspected</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>

            <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              This is the proposed initial status for newly created rooms. It
              does not automatically change the status of existing rooms.
            </div>
          </Section>

          {/* Housekeeping */}
          <Section
            title="Housekeeping Rules"
            description="Set default cleaning, inspection, and maintenance behavior."
            icon={ClipboardCheck}
          >
            <div className="space-y-3">
              <Toggle
                label="Enable Housekeeping"
                description="Enable housekeeping tasks for configured rooms."
                checked={settings.housekeepingEnabled}
                onChange={(v) => updateSetting("housekeepingEnabled", v)}
              />

              <Toggle
                label="Auto-create Cleaning Task After Checkout"
                description="Automatically create a cleaning task when a guest checks out."
                checked={settings.autoCleanAfterCheckout}
                onChange={(v) => updateSetting("autoCleanAfterCheckout", v)}
              />

              <Toggle
                label="Require Room Inspection"
                description="Require an inspection before a cleaned room is marked ready."
                checked={settings.inspectionRequired}
                onChange={(v) => updateSetting("inspectionRequired", v)}
              />

              <Toggle
                label="Block Room During Maintenance"
                description="Prevent booking while the room is marked for maintenance."
                checked={settings.maintenanceBlocksRoom}
                onChange={(v) => updateSetting("maintenanceBlocksRoom", v)}
              />
            </div>

            {settings.housekeepingEnabled && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Field label="Default Cleaning Priority">
                  <select
                    value={settings.cleaningPriority}
                    onChange={(e) => updateSetting("cleaningPriority", e.target.value)}
                    className={inputClass}
                  >
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </Field>

                <Field label="Cleaning Deadline">
                  <input
                    type="time"
                    value={settings.cleaningDeadline}
                    onChange={(e) => updateSetting("cleaningDeadline", e.target.value)}
                    className={inputClass}
                  />
                </Field>

                <Field label="Default Cleaning Duration (Minutes)">
                  <input
                    type="number"
                    min="1"
                    value={settings.defaultCleaningDuration}
                    onChange={(e) => updateSetting("defaultCleaningDuration", e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
            )}
          </Section>

          {/* Save */}
          <div className="sticky bottom-0 z-10 flex flex-col justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
            <p className="text-xs text-slate-500">
              {isDirty ? "You have unsaved changes." : "No unsaved changes."}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={resetChanges}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel Changes
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={16} />
                Save Room Configuration
              </button>
            </div>
          </div>
        </form>

        {/* Room Type Modal */}
        {roomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4">
            <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {editingRoomId !== null ? "Edit Room Type" : "Add Room Type"}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Define the category and facilities for this room type.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRoomModal(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveRoomType} className="space-y-4 p-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Room Type Name *">
                    <input
                      required
                      value={roomForm.name}
                      onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                      className={inputClass}
                      placeholder="e.g. Premium Deluxe"
                    />
                  </Field>

                  <Field label="Room Code *">
                    <input
                      required
                      value={roomForm.code}
                      onChange={(e) => setRoomForm({ ...roomForm, code: e.target.value.toUpperCase() })}
                      className={inputClass}
                      placeholder="e.g. PDL"
                    />
                  </Field>

                  <Field label="Base Price (₹)">
                    <input
                      type="number"
                      min="0"
                      value={roomForm.basePrice}
                      onChange={(e) => setRoomForm({ ...roomForm, basePrice: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Maximum Guest Capacity">
                    <input
                      type="number"
                      min="1"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Extra Bed Capacity">
                    <input
                      type="number"
                      min="0"
                      value={roomForm.extraBeds}
                      onChange={(e) => setRoomForm({ ...roomForm, extraBeds: e.target.value })}
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Bed Type">
                    <select
                      required
                      value={roomForm.bedType}
                      onChange={(e) => setRoomForm({ ...roomForm, bedType: e.target.value })}
                      className={inputClass}
                    >
                      {settings.bedTypes.map((bed) => (
                        <option key={bed} value={bed}>{bed}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Status">
                    <select
                      value={roomForm.status}
                      onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                      className={inputClass}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>

                  <Field label="Description" className="md:col-span-2">
                    <textarea
                      rows={2}
                      value={roomForm.description}
                      onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                      className={inputClass}
                      placeholder="Describe this room category..."
                    />
                  </Field>
                </div>

                <Field label="Select Room Amenities">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {amenities.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-xs text-slate-700 hover:bg-slate-50"
                      >
                        <input
                          type="checkbox"
                          checked={roomForm.amenities.includes(amenity)}
                          onChange={() => toggleRoomAmenity(amenity)}
                          className="h-4 w-4 accent-blue-600"
                        />
                        {amenity}
                      </label>
                    ))}
                    {amenities.length === 0 && (
                      <p className="col-span-full text-xs text-slate-500">
                        Add amenities before assigning them to room types.
                      </p>
                    )}
                  </div>
                </Field>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setRoomModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {editingRoomId !== null ? "Update Room Type" : "Create Room Type"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Floor Modal */}
        {floorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h3 className="font-semibold text-slate-900">
                  {editingFloorId !== null ? "Edit Floor" : "Add Floor"}
                </h3>
                <button
                  type="button"
                  onClick={() => setFloorModal(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={saveFloor} className="space-y-4 p-5">
                <Field label="Floor Name *">
                  <input
                    required
                    value={floorForm.name}
                    onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                    className={inputClass}
                    placeholder="e.g. Fourth Floor"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Floor Code *">
                    <input
                      required
                      value={floorForm.code}
                      onChange={(e) => setFloorForm({ ...floorForm, code: e.target.value.toUpperCase() })}
                      className={inputClass}
                      placeholder="e.g. 4"
                    />
                  </Field>
                  <Field label="Floor Number">
                    <input
                      type="number"
                      min="0"
                      value={floorForm.number}
                      onChange={(e) => setFloorForm({ ...floorForm, number: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Room Count">
                    <input
                      type="number"
                      min="0"
                      value={floorForm.rooms}
                      onChange={(e) => setFloorForm({ ...floorForm, rooms: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Status">
                    <select
                      value={floorForm.status}
                      onChange={(e) => setFloorForm({ ...floorForm, status: e.target.value })}
                      className={inputClass}
                    >
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </Field>
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setFloorModal(false)}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    {editingFloorId !== null ? "Update Floor" : "Create Floor"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Amenity Modal */}
        {amenityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
            <form
              onSubmit={addAmenity}
              className="w-full max-w-md space-y-4 rounded-xl bg-white p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">Add Amenity</h3>
                <button
                  type="button"
                  onClick={() => setAmenityModal(false)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <Field label="Amenity Name *">
                <input
                  autoFocus
                  required
                  value={amenityName}
                  onChange={(e) => setAmenityName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Swimming Pool"
                />
              </Field>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAmenityModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Add Amenity
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
