
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  BedDouble,
  Users,
  Pencil,
  Eye,
  Wrench,
  Power,
  X,
  Filter,
  ChevronDown,
  Building2,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  DoorOpen,
  RefreshCw,
} from "lucide-react";

const initialRooms = [
  {
    id: "R001",
    number: "101",
    type: "Standard",
    floor: 1,
    capacity: 2,
    rate: 2000,
    status: "Occupied",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC"],
    notes: "",
    isActive: true,
  },
  {
    id: "R002",
    number: "102",
    type: "Deluxe",
    floor: 1,
    capacity: 2,
    rate: 3000,
    status: "Available",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Mini Bar"],
    notes: "",
    isActive: true,
  },
  {
    id: "R003",
    number: "103",
    type: "Suite",
    floor: 1,
    capacity: 4,
    rate: 5500,
    status: "Reserved",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Living Area"],
    notes: "",
    isActive: true,
  },
  {
    id: "R004",
    number: "104",
    type: "Standard",
    floor: 1,
    capacity: 2,
    rate: 2000,
    status: "Cleaning",
    housekeeping: "In Progress",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV"],
    notes: "",
    isActive: true,
  },
  {
    id: "R005",
    number: "201",
    type: "Family Room",
    floor: 2,
    capacity: 5,
    rate: 4500,
    status: "Available",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Extra Bed"],
    notes: "",
    isActive: true,
  },
  {
    id: "R006",
    number: "202",
    type: "Deluxe",
    floor: 2,
    capacity: 2,
    rate: 3000,
    status: "Maintenance",
    housekeeping: "Dirty",
    maintenance: "In Progress",
    facilities: ["Wi-Fi", "TV", "AC"],
    notes: "AC repair required",
    isActive: true,
  },
  {
    id: "R007",
    number: "203",
    type: "Presidential Suite",
    floor: 2,
    capacity: 6,
    rate: 10000,
    status: "Occupied",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Jacuzzi", "Living Area"],
    notes: "",
    isActive: true,
  },
  {
    id: "R008",
    number: "204",
    type: "Standard",
    floor: 2,
    capacity: 2,
    rate: 2000,
    status: "Available",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV"],
    notes: "",
    isActive: true,
  },
  {
    id: "R009",
    number: "301",
    type: "Suite",
    floor: 3,
    capacity: 4,
    rate: 5500,
    status: "Reserved",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Living Area"],
    notes: "",
    isActive: true,
  },
  {
    id: "R010",
    number: "302",
    type: "Deluxe",
    floor: 3,
    capacity: 2,
    rate: 3000,
    status: "Available",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC"],
    notes: "",
    isActive: true,
  },
  {
    id: "R011",
    number: "303",
    type: "Family Room",
    floor: 3,
    capacity: 5,
    rate: 4500,
    status: "Cleaning",
    housekeeping: "In Progress",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV", "AC", "Extra Bed"],
    notes: "",
    isActive: true,
  },
  {
    id: "R012",
    number: "304",
    type: "Standard",
    floor: 3,
    capacity: 2,
    rate: 2000,
    status: "Available",
    housekeeping: "Clean",
    maintenance: "Normal",
    facilities: ["Wi-Fi", "TV"],
    notes: "",
    isActive: true,
  },
];

const roomTypes = [
  "Standard",
  "Deluxe",
  "Suite",
  "Family Room",
  "Presidential Suite",
];

const roomStatuses = [
  "Available",
  "Occupied",
  "Reserved",
  "Cleaning",
  "Maintenance",
];

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Occupied: "bg-blue-50 text-blue-700 border-blue-200",
  Reserved: "bg-violet-50 text-violet-700 border-violet-200",
  Cleaning: "bg-amber-50 text-amber-700 border-amber-200",
  Maintenance: "bg-rose-50 text-rose-700 border-rose-200",
};

const emptyForm = {
  number: "",
  type: "Standard",
  floor: 1,
  capacity: 2,
  rate: 2000,
  status: "Available",
  housekeeping: "Clean",
  maintenance: "Normal",
  facilities: [],
  notes: "",
};

const facilityOptions = [
  "Wi-Fi",
  "TV",
  "AC",
  "Mini Bar",
  "Extra Bed",
  "Jacuzzi",
  "Living Area",
  "Balcony",
  "Room Service",
];

export default function AllRooms() {
  const [rooms, setRooms] = useState(initialRooms);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [floorFilter, setFloorFilter] = useState("All");
  const [showInactive, setShowInactive] = useState(false);

  const [modal, setModal] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [maintenanceNote, setMaintenanceNote] = useState("");
  const [toast, setToast] = useState("");

  const activeRooms = rooms.filter((room) => room.isActive);
  const totalRooms = activeRooms.length;

  const stats = [
    {
      label: "Total Rooms",
      value: totalRooms,
      icon: BedDouble,
      color: "blue",
      description: "Active registered rooms",
    },
    {
      label: "Available",
      value: activeRooms.filter((r) => r.status === "Available").length,
      icon: DoorOpen,
      color: "emerald",
      description: "Ready for guests",
    },
    {
      label: "Occupied",
      value: activeRooms.filter((r) => r.status === "Occupied").length,
      icon: Users,
      color: "violet",
      description: "Currently occupied",
    },
    {
      label: "Maintenance",
      value: activeRooms.filter((r) => r.status === "Maintenance").length,
      icon: Wrench,
      color: "rose",
      description: "Under maintenance",
    },
  ];

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const query = search.toLowerCase();

      const matchesSearch =
        room.number.toLowerCase().includes(query) ||
        room.id.toLowerCase().includes(query) ||
        room.type.toLowerCase().includes(query) ||
        String(room.floor).includes(query);

      const matchesStatus =
        statusFilter === "All" || room.status === statusFilter;

      const matchesType =
        typeFilter === "All" || room.type === typeFilter;

      const matchesFloor =
        floorFilter === "All" || String(room.floor) === floorFilter;

      const matchesActive = showInactive
        ? !room.isActive
        : room.isActive;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesFloor &&
        matchesActive
      );
    });
  }, [rooms, search, statusFilter, typeFilter, floorFilter, showInactive]);

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const openAddModal = () => {
    setSelectedRoom(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEditModal = (room) => {
    setSelectedRoom(room);
    setForm({
      ...room,
      facilities: [...room.facilities],
    });
    setModal("form");
  };

  const openDetails = (room) => {
    setSelectedRoom(room);
    setModal("details");
  };

  const openMaintenance = (room) => {
    setSelectedRoom(room);
    setMaintenanceNote(room.notes || "");
    setModal("maintenance");
  };

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFacility = (facility) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((item) => item !== facility)
        : [...prev.facilities, facility],
    }));
  };

  const saveRoom = (e) => {
    e.preventDefault();

    const duplicate = rooms.some(
      (room) =>
        room.number.toLowerCase() === form.number.trim().toLowerCase() &&
        room.id !== selectedRoom?.id
    );

    if (duplicate) {
      notify("This room number already exists.");
      return;
    }

    const payload = {
      ...form,
      number: form.number.trim(),
      floor: Number(form.floor),
      capacity: Number(form.capacity),
      rate: Number(form.rate),
    };

    if (selectedRoom) {
      setRooms((prev) =>
        prev.map((room) =>
          room.id === selectedRoom.id ? { ...room, ...payload } : room
        )
      );
      notify("Room updated successfully.");
    } else {
      const newRoom = {
        ...payload,
        id: `R${String(Date.now()).slice(-6)}`,
        isActive: true,
      };
      setRooms((prev) => [newRoom, ...prev]);
      notify("New room added successfully.");
    }

    setModal(null);
  };

  const changeStatus = (roomId, status) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === roomId
          ? {
              ...room,
              status,
              housekeeping:
                status === "Cleaning"
                  ? "In Progress"
                  : room.housekeeping,
            }
          : room
      )
    );
    notify(`Room status changed to ${status}.`);
  };

  const saveMaintenance = (e) => {
    e.preventDefault();

    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              status: "Maintenance",
              maintenance: "In Progress",
              notes: maintenanceNote,
            }
          : room
      )
    );

    setModal(null);
    notify("Maintenance assigned successfully.");
  };

  const toggleActive = (room) => {
    const action = room.isActive ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} room ${room.number}?`)) {
      return;
    }

    setRooms((prev) =>
      prev.map((item) =>
        item.id === room.id ? { ...item, isActive: !item.isActive } : item
      )
    );

    notify(`Room ${room.number} ${action}d successfully.`);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setFloorFilter("All");
    setShowInactive(false);
  };

  const selectClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen w-full bg-slate-50 p-2 md:p-4">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Building2 size={15} />
              <span>Property Operations</span>
              <span>/</span>
              <span className="text-slate-700">All Rooms</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              All Rooms
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage room information, availability, pricing and maintenance.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add New Room
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              violet: "bg-violet-50 text-violet-600",
              rose: "bg-rose-50 text-rose-600",
            };

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      {stat.label}
                    </p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`rounded-xl p-3 ${colorMap[stat.color]}`}>
                    <Icon size={21} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Room Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Room Directory</h2>
              <p className="mt-1 text-xs text-slate-500">
                Showing {filteredRooms.length} of {rooms.length} rooms
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Show inactive rooms
            </label>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 gap-3 border-b border-slate-100 bg-slate-50/70 p-4 sm:grid-cols-2 xl:grid-cols-5">
            <div className="relative sm:col-span-2 xl:col-span-2">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search room number, ID or type..."
                className={`${inputClass} pl-9`}
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All">All Statuses</option>
              {roomStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={selectClass}
            >
              <option value="All">All Room Types</option>
              {roomTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <select
                value={floorFilter}
                onChange={(e) => setFloorFilter(e.target.value)}
                className={selectClass}
              >
                <option value="All">All Floors</option>
                {[...new Set(rooms.map((r) => r.floor))]
                  .sort((a, b) => a - b)
                  .map((floor) => (
                    <option key={floor} value={floor}>
                      Floor {floor}
                    </option>
                  ))}
              </select>

              <button
                onClick={resetFilters}
                title="Reset filters"
                className="rounded-xl border border-slate-200 bg-white px-3 text-slate-500 hover:bg-slate-100"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Room</th>
                  <th className="px-5 py-4 font-semibold">Room Type</th>
                  <th className="px-5 py-4 font-semibold">Floor</th>
                  <th className="px-5 py-4 font-semibold">Capacity</th>
                  <th className="px-5 py-4 font-semibold">Base Rate</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Housekeeping</th>
                  <th className="px-5 py-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredRooms.map((room) => (
                  <tr
                    key={room.id}
                    className={`transition hover:bg-slate-50 ${
                      !room.isActive ? "opacity-60" : ""
                    }`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <BedDouble size={19} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            Room {room.number}
                          </p>
                          <p className="text-xs text-slate-400">{room.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-slate-700">
                      {room.type}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      Floor {room.floor}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <Users size={15} className="text-slate-400" />
                        {room.capacity} Guests
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-800">
                      ₹{Number(room.rate || 0).toLocaleString("en-IN")}
                      <span className="font-normal text-slate-400"> /night</span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={room.status}
                        disabled={!room.isActive}
                        onChange={(e) => changeStatus(room.id, e.target.value)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-semibold outline-none ${statusStyles[room.status] || "bg-slate-100 text-slate-600"}`}
                      >
                        {roomStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                          room.housekeeping === "Clean"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {room.housekeeping}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openDetails(room)}
                          title="View details"
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => openEditModal(room)}
                          title="Edit room"
                          className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>
                        <button
                          onClick={() => openMaintenance(room)}
                          title="Assign maintenance"
                          className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Wrench size={17} />
                        </button>
                        <button
                          onClick={() => toggleActive(room)}
                          title={room.isActive ? "Deactivate room" : "Activate room"}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <Power size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-5 py-14 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                        <Search size={21} />
                      </div>
                      <p className="mt-3 font-medium text-slate-700">
                        No rooms found
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your search or filters.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700"
                      >
                        Clear filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 px-5 py-3 text-xs text-slate-500 sm:flex-row">
            <span>{filteredRooms.length} rooms displayed</span>
            <span>Room information is currently stored in frontend demo state.</span>
          </div>
        </div>
      </div>

      {/* Add / Edit Room Modal */}
      {modal === "form" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedRoom ? "Edit Room" : "Add New Room"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter room details and configuration.
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveRoom} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Room Number *
                  </label>
                  <input
                    required
                    value={form.number}
                    onChange={(e) => updateForm("number", e.target.value)}
                    placeholder="e.g. 105"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Room Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => updateForm("type", e.target.value)}
                    className={selectClass}
                  >
                    {roomTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Floor *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.floor}
                    onChange={(e) => updateForm("floor", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Guest Capacity *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.capacity}
                    onChange={(e) => updateForm("capacity", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Base Rate (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.rate}
                    onChange={(e) => updateForm("rate", e.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Room Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className={selectClass}
                  >
                    {roomStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Housekeeping Status
                  </label>
                  <select
                    value={form.housekeeping}
                    onChange={(e) => updateForm("housekeeping", e.target.value)}
                    className={selectClass}
                  >
                    <option>Clean</option>
                    <option>Dirty</option>
                    <option>In Progress</option>
                    <option>Inspected</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Maintenance Status
                  </label>
                  <select
                    value={form.maintenance}
                    onChange={(e) => updateForm("maintenance", e.target.value)}
                    className={selectClass}
                  >
                    <option>Normal</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Room Facilities
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {facilityOptions.map((facility) => (
                    <label
                      key={facility}
                      className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                        form.facilities.includes(facility)
                          ? "border-blue-300 bg-blue-50 text-blue-700"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="h-4 w-4 rounded border-slate-300 text-blue-600"
                      />
                      {facility}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  rows="3"
                  value={form.notes}
                  onChange={(e) => updateForm("notes", e.target.value)}
                  placeholder="Additional room information..."
                  className={inputClass}
                />
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
                  {selectedRoom ? "Save Changes" : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {modal === "details" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <p className="text-xs font-medium text-slate-400">
                  ROOM DETAILS
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Room {selectedRoom.number}
                </h2>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Room ID", selectedRoom.id],
                  ["Room Type", selectedRoom.type],
                  ["Floor", `Floor ${selectedRoom.floor}`],
                  ["Capacity", `${selectedRoom.capacity} Guests`],
                  [
                    "Base Rate",
                    `₹${Number(selectedRoom.rate || 0).toLocaleString("en-IN")}`,
                  ],
                  ["Housekeeping", selectedRoom.housekeeping],
                  ["Maintenance", selectedRoom.maintenance],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Room Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[selectedRoom.status]}`}
                  >
                    {selectedRoom.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-800">
                  Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRoom.facilities.length ? (
                    selectedRoom.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700"
                      >
                        {facility}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400">
                      No facilities added.
                    </span>
                  )}
                </div>
              </div>

              {selectedRoom.notes && (
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-slate-800">
                    Notes
                  </h3>
                  <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                    {selectedRoom.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  onClick={() => openEditModal(selectedRoom)}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={16} />
                  Edit Room
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Modal */}
      {modal === "maintenance" && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-bold text-slate-900">
                  Assign Maintenance
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Room {selectedRoom.number} · {selectedRoom.type}
                </p>
              </div>
              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveMaintenance} className="space-y-4 p-5">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-800">
                  <AlertCircle size={17} />
                  Room will be marked as Maintenance
                </div>
                <p className="mt-1 text-xs text-amber-700">
                  This room should not be assigned to a new reservation until
                  maintenance is completed.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Maintenance Issue *
                </label>
                <textarea
                  required
                  rows="4"
                  value={maintenanceNote}
                  onChange={(e) => setMaintenanceNote(e.target.value)}
                  placeholder="Describe the maintenance issue..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
                >
                  <Wrench size={16} />
                  Assign Maintenance
                </button>
              </div>
            </form>
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
