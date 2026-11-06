
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Building2,
  BedDouble,
  Users,
  IndianRupee,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Layers,
  DoorOpen,
  CheckCircle2,
  Clock,
  Wrench,
  Sparkles,
  MoreHorizontal,
  Save,
  RotateCcw,
} from "lucide-react";

const initialFloors = [
  { id: 1, number: 1, name: "Ground Floor", description: "Reception and guest rooms" },
  { id: 2, number: 2, name: "First Floor", description: "Standard and Deluxe rooms" },
  { id: 3, number: 3, name: "Second Floor", description: "Premium accommodation" },
  { id: 4, number: 4, name: "Third Floor", description: "Luxury accommodation" },
];

const initialRooms = [
  { id: "R001", number: "101", type: "Standard", floor: 1, capacity: 2, rate: 2000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal", position: 1 },
  { id: "R002", number: "102", type: "Standard", floor: 1, capacity: 2, rate: 2000, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 2 },
  { id: "R003", number: "103", type: "Deluxe", floor: 1, capacity: 3, rate: 3000, status: "Cleaning", housekeeping: "Dirty", maintenance: "Normal", position: 3 },
  { id: "R004", number: "104", type: "Deluxe", floor: 1, capacity: 3, rate: 3000, status: "Reserved", housekeeping: "Clean", maintenance: "Normal", position: 4 },
  { id: "R005", number: "105", type: "Suite", floor: 1, capacity: 4, rate: 5000, status: "Maintenance", housekeeping: "Clean", maintenance: "Repair required", position: 5 },

  { id: "R006", number: "201", type: "Standard", floor: 2, capacity: 2, rate: 2000, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 1 },
  { id: "R007", number: "202", type: "Deluxe", floor: 2, capacity: 3, rate: 3000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal", position: 2 },
  { id: "R008", number: "203", type: "Deluxe", floor: 2, capacity: 3, rate: 3000, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 3 },
  { id: "R009", number: "204", type: "Family Room", floor: 2, capacity: 5, rate: 4500, status: "Cleaning", housekeeping: "Dirty", maintenance: "Normal", position: 4 },
  { id: "R010", number: "205", type: "Suite", floor: 2, capacity: 4, rate: 5000, status: "Reserved", housekeeping: "Clean", maintenance: "Normal", position: 5 },

  { id: "R011", number: "301", type: "Deluxe", floor: 3, capacity: 3, rate: 3000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal", position: 1 },
  { id: "R012", number: "302", type: "Suite", floor: 3, capacity: 4, rate: 5000, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 2 },
  { id: "R013", number: "303", type: "Family Room", floor: 3, capacity: 5, rate: 4500, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 3 },
  { id: "R014", number: "304", type: "Presidential Suite", floor: 3, capacity: 6, rate: 10000, status: "Maintenance", housekeeping: "Clean", maintenance: "Repair required", position: 4 },

  { id: "R015", number: "401", type: "Presidential Suite", floor: 4, capacity: 6, rate: 10000, status: "Occupied", housekeeping: "Clean", maintenance: "Normal", position: 1 },
  { id: "R016", number: "402", type: "Suite", floor: 4, capacity: 4, rate: 5000, status: "Available", housekeeping: "Clean", maintenance: "Normal", position: 2 },
];

const statusStyles = {
  Available: {
    card: "border-emerald-200 bg-emerald-50",
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  Occupied: {
    card: "border-blue-200 bg-blue-50",
    dot: "bg-blue-500",
    text: "text-blue-700",
    icon: Users,
  },
  Reserved: {
    card: "border-violet-200 bg-violet-50",
    dot: "bg-violet-500",
    text: "text-violet-700",
    icon: Clock,
  },
  Cleaning: {
    card: "border-amber-200 bg-amber-50",
    dot: "bg-amber-500",
    text: "text-amber-700",
    icon: Sparkles,
  },
  Maintenance: {
    card: "border-rose-200 bg-rose-50",
    dot: "bg-rose-500",
    text: "text-rose-700",
    icon: Wrench,
  },
};

const roomStatuses = ["Available", "Occupied", "Reserved", "Cleaning", "Maintenance"];

const emptyFloorForm = {
  number: "",
  name: "",
  description: "",
};

export default function FloorPlan() {
  const [floors, setFloors] = useState(initialFloors);
  const [rooms, setRooms] = useState(initialRooms);
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [showFloorModal, setShowFloorModal] = useState(false);
  const [editingFloor, setEditingFloor] = useState(null);
  const [floorForm, setFloorForm] = useState(emptyFloorForm);

  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState(null);

  const [draggedRoom, setDraggedRoom] = useState(null);
  const [dragOverRoom, setDragOverRoom] = useState(null);
  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2500);
  };

  const currentFloor = floors.find((floor) => floor.number === selectedFloor);

  const floorRooms = useMemo(() => {
    return rooms
      .filter((room) => room.floor === selectedFloor)
      .sort((a, b) => a.position - b.position);
  }, [rooms, selectedFloor]);

  const visibleRooms = useMemo(() => {
    return floorRooms.filter((room) => {
      const matchesSearch =
        room.number.toLowerCase().includes(search.toLowerCase()) ||
        room.type.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || room.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [floorRooms, search, statusFilter]);

  const floorStats = useMemo(() => {
    const stats = {
      total: floorRooms.length,
      Available: 0,
      Occupied: 0,
      Reserved: 0,
      Cleaning: 0,
      Maintenance: 0,
    };

    floorRooms.forEach((room) => {
      if (stats[room.status] !== undefined) stats[room.status]++;
    });

    return stats;
  }, [floorRooms]);

  const overallStats = useMemo(() => {
    const stats = {
      total: rooms.length,
      Available: 0,
      Occupied: 0,
      Reserved: 0,
      Cleaning: 0,
      Maintenance: 0,
    };

    rooms.forEach((room) => {
      if (stats[room.status] !== undefined) stats[room.status]++;
    });

    return stats;
  }, [rooms]);

  const openAddFloor = () => {
    setEditingFloor(null);
    setFloorForm({
      number: String(Math.max(0, ...floors.map((f) => f.number)) + 1),
      name: "",
      description: "",
    });
    setShowFloorModal(true);
  };

  const openEditFloor = (floor) => {
    setEditingFloor(floor);
    setFloorForm({
      number: String(floor.number),
      name: floor.name,
      description: floor.description || "",
    });
    setShowFloorModal(true);
  };

  const saveFloor = (e) => {
    e.preventDefault();

    const number = Number(floorForm.number);

    if (!number || number < 0 || !floorForm.name.trim()) {
      notify("Please enter a valid floor number and name.");
      return;
    }

    const duplicate = floors.some(
      (floor) =>
        floor.number === number &&
        floor.id !== editingFloor?.id
    );

    if (duplicate) {
      notify("This floor number already exists.");
      return;
    }

    if (editingFloor) {
      const oldNumber = editingFloor.number;

      setFloors((prev) =>
        prev.map((floor) =>
          floor.id === editingFloor.id
            ? { ...floor, number, name: floorForm.name.trim(), description: floorForm.description }
            : floor
        )
      );

      if (oldNumber !== number) {
        setRooms((prev) =>
          prev.map((room) =>
            room.floor === oldNumber ? { ...room, floor: number } : room
          )
        );

        if (selectedFloor === oldNumber) setSelectedFloor(number);
      }

      notify("Floor updated successfully.");
    } else {
      const newFloor = {
        id: Date.now(),
        number,
        name: floorForm.name.trim(),
        description: floorForm.description,
      };

      setFloors((prev) => [...prev, newFloor].sort((a, b) => a.number - b.number));
      setSelectedFloor(number);
      notify("Floor created successfully.");
    }

    setShowFloorModal(false);
  };

  const deleteFloor = (floor) => {
    const assignedRooms = rooms.filter((room) => room.floor === floor.number);

    if (assignedRooms.length > 0) {
      notify("Move or remove all rooms before deleting this floor.");
      return;
    }

    if (!window.confirm(`Delete ${floor.name}?`)) return;

    setFloors((prev) => prev.filter((item) => item.id !== floor.id));
    if (selectedFloor === floor.number && floors.length > 1) {
      const nextFloor = floors.find((item) => item.id !== floor.id);
      if (nextFloor) setSelectedFloor(nextFloor.number);
    }
    notify("Floor deleted.");
  };

  const openRoomDetails = (room) => {
    setSelectedRoom(room);
  };

  const openEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      number: room.number,
      type: room.type,
      floor: String(room.floor),
      capacity: String(room.capacity),
      rate: String(room.rate),
      status: room.status,
      housekeeping: room.housekeeping,
      maintenance: room.maintenance,
    });
    setSelectedRoom(null);
    setShowRoomModal(true);
  };

  const saveRoom = (e) => {
    e.preventDefault();

    if (!roomForm.number.trim() || !roomForm.type.trim()) {
      notify("Room number and type are required.");
      return;
    }

    const duplicate = rooms.some(
      (room) =>
        room.number.toLowerCase() === roomForm.number.trim().toLowerCase() &&
        room.id !== editingRoom.id
    );

    if (duplicate) {
      notify("A room with this number already exists.");
      return;
    }

    const targetFloor = Number(roomForm.floor);

    if (!floors.some((floor) => floor.number === targetFloor)) {
      notify("Please select a valid floor.");
      return;
    }

    setRooms((prev) =>
      prev.map((room) =>
        room.id === editingRoom.id
          ? {
              ...room,
              number: roomForm.number.trim(),
              type: roomForm.type,
              floor: targetFloor,
              capacity: Number(roomForm.capacity) || 1,
              rate: Number(roomForm.rate) || 0,
              status: roomForm.status,
              housekeeping: roomForm.housekeeping,
              maintenance: roomForm.maintenance,
              position:
                room.floor === targetFloor
                  ? room.position
                  : Math.max(
                      0,
                      ...prev
                        .filter((item) => item.floor === targetFloor)
                        .map((item) => item.position)
                    ) + 1,
            }
          : room
      )
    );

    setShowRoomModal(false);
    notify("Room updated successfully.");
  };

  const moveRoom = (sourceId, targetId) => {
    if (!sourceId || !targetId || sourceId === targetId) return;

    setRooms((prev) => {
      const updated = [...prev];
      const source = updated.find((room) => room.id === sourceId);
      const target = updated.find((room) => room.id === targetId);

      if (!source || !target || source.floor !== target.floor) return prev;

      const sourcePosition = source.position;
      const targetPosition = target.position;

      updated.forEach((room) => {
        if (room.floor !== source.floor) return;

        if (room.id === sourceId) {
          room.position = targetPosition;
        } else if (
          sourcePosition < targetPosition &&
          room.position > sourcePosition &&
          room.position <= targetPosition
        ) {
          room.position -= 1;
        } else if (
          sourcePosition > targetPosition &&
          room.position >= targetPosition &&
          room.position < sourcePosition
        ) {
          room.position += 1;
        }
      });

      return updated;
    });

    setDraggedRoom(null);
    setDragOverRoom(null);
    notify("Room position updated.");
  };

  const resetFloorPositions = () => {
    if (!window.confirm("Reset room positions on this floor?")) return;

    setRooms((prev) => {
      const currentRooms = prev
        .filter((room) => room.floor === selectedFloor)
        .sort((a, b) => a.number.localeCompare(b.number));

      const positions = new Map(
        currentRooms.map((room, index) => [room.id, index + 1])
      );

      return prev.map((room) =>
        positions.has(room.id)
          ? { ...room, position: positions.get(room.id) }
          : room
      );
    });

    notify("Floor layout positions reset.");
  };

  const getStatusStyle = (status) =>
    statusStyles[status] || statusStyles.Available;

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
              <span className="font-medium text-slate-700">Floor Plan</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Floor Plan
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage floors, visualize room layouts and organize room positions.
            </p>
          </div>

          <button
            onClick={openAddFloor}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Floor
          </button>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard title="Total Rooms" value={overallStats.total} icon={BedDouble} color="blue" />
          <StatCard title="Available" value={overallStats.Available} icon={DoorOpen} color="emerald" />
          <StatCard title="Occupied" value={overallStats.Occupied} icon={Users} color="blue" />
          <StatCard title="Reserved" value={overallStats.Reserved} icon={Clock} color="violet" />
          <StatCard title="Cleaning" value={overallStats.Cleaning} icon={Sparkles} color="amber" />
          <StatCard title="Maintenance" value={overallStats.Maintenance} icon={Wrench} color="rose" />
        </div>

        {/* Floor selector */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-slate-900">Hotel Floors</h2>
              <p className="text-xs text-slate-500">
                Select a floor to view its room layout.
              </p>
            </div>
            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
              {floors.length} Floors
            </span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1">
            {floors
              .slice()
              .sort((a, b) => a.number - b.number)
              .map((floor) => {
                const count = rooms.filter((room) => room.floor === floor.number).length;
                const active = selectedFloor === floor.number;

                return (
                  <button
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor.number);
                      setSearch("");
                      setStatusFilter("All");
                    }}
                    className={`min-w-[190px] flex-1 rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Layers size={18} />
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {count} Rooms
                      </span>
                    </div>
                    <p className="mt-3 font-semibold text-slate-900">{floor.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Floor {floor.number}
                    </p>
                  </button>
                );
              })}
          </div>
        </div>

        {/* Selected floor heading */}
        {currentFloor && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">
                    {currentFloor.name}
                  </h2>
                  <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                    Floor {currentFloor.number}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {currentFloor.description || "No floor description available."}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={resetFloorPositions}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <RotateCcw size={15} />
                  Reset Layout
                </button>
                <button
                  onClick={() => openEditFloor(currentFloor)}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  <Pencil size={15} />
                  Edit Floor
                </button>
                <button
                  onClick={() => deleteFloor(currentFloor)}
                  className="inline-flex items-center gap-2 rounded-lg border border-rose-200 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                  Delete Floor
                </button>
              </div>
            </div>

            {/* Floor status summary */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {roomStatuses.map((status) => {
                const style = getStatusStyle(status);
                const Icon = style.icon;

                return (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(statusFilter === status ? "All" : status)}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${
                      statusFilter === status
                        ? "border-blue-400 ring-2 ring-blue-100"
                        : "border-slate-100 bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${style.card} ${style.text}`}>
                      <Icon size={17} />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-slate-900">
                        {floorStats[status]}
                      </p>
                      <p className="text-xs text-slate-500">{status}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Visual layout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold text-slate-900">Visual Room Layout</h2>
              <p className="mt-1 text-xs text-slate-500">
                Drag a room card onto another room to change its position.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search room or type..."
                  className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 sm:w-56"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
              >
                <option value="All">All Statuses</option>
                {roomStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-b border-slate-100 pb-4">
            {roomStatuses.map((status) => {
              const style = getStatusStyle(status);
              return (
                <div key={status} className="flex items-center gap-2 text-xs text-slate-600">
                  <span className={`h-2.5 w-2.5 rounded-full ${style.dot}`} />
                  {status}
                </div>
              );
            })}
          </div>

          {/* Layout grid */}
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 sm:p-5">
            <div className="mb-5 flex items-center justify-center">
              <div className="rounded-lg border border-slate-200 bg-white px-8 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-sm">
                Corridor
              </div>
            </div>

            {visibleRooms.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
                {visibleRooms.map((room) => {
                  const style = getStatusStyle(room.status);
                  const StatusIcon = style.icon;

                  return (
                    <div
                      key={room.id}
                      draggable
                      onDragStart={() => setDraggedRoom(room.id)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverRoom(room.id);
                      }}
                      onDragLeave={() => setDragOverRoom(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        moveRoom(draggedRoom, room.id);
                      }}
                      onDragEnd={() => {
                        setDraggedRoom(null);
                        setDragOverRoom(null);
                      }}
                      className={`group relative rounded-xl border p-3 text-left transition ${
                        style.card
                      } ${
                        draggedRoom === room.id ? "opacity-40" : ""
                      } ${
                        dragOverRoom === room.id && draggedRoom !== room.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/80 text-slate-600 shadow-sm">
                          <BedDouble size={17} />
                        </span>
                        <GripVertical
                          size={17}
                          className="cursor-grab text-slate-400 opacity-0 group-hover:opacity-100"
                        />
                      </div>

                      <button
                        onClick={() => openRoomDetails(room)}
                        className="mt-3 block w-full text-left"
                      >
                        <p className="text-lg font-bold text-slate-900">
                          {room.number}
                        </p>
                        <p className="mt-0.5 truncate text-xs font-medium text-slate-600">
                          {room.type}
                        </p>
                      </button>

                      <div className="mt-3 flex items-center justify-between gap-1">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${style.text}`}>
                          <StatusIcon size={12} />
                          {room.status}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          #{room.position}
                        </span>
                      </div>

                      <button
                        onClick={() => openRoomDetails(room)}
                        className="mt-3 w-full rounded-lg border border-white/80 bg-white/70 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-white"
                      >
                        View Details
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-14 text-center">
                <BedDouble size={32} className="mx-auto text-slate-300" />
                <p className="mt-3 font-medium text-slate-700">No rooms found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Try changing your search or status filter.
                </p>
              </div>
            )}

            <div className="mt-5 flex items-center justify-center">
              <div className="rounded-lg border border-slate-200 bg-white px-8 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 shadow-sm">
                Lift / Staircase
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Layout positions are for visual organization only; they do not represent an architectural floor drawing.
          </p>
        </div>

        {/* Room details modal */}
        {selectedRoom && (
          <Modal onClose={() => setSelectedRoom(null)} title={`Room ${selectedRoom.number}`}>
            <div className="space-y-4">
              <div className={`rounded-xl border p-4 ${getStatusStyle(selectedRoom.status).card}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">Room status</p>
                    <p className={`mt-1 text-lg font-bold ${getStatusStyle(selectedRoom.status).text}`}>
                      {selectedRoom.status}
                    </p>
                  </div>
                  <BedDouble size={30} className="text-slate-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Detail label="Room Number" value={selectedRoom.number} />
                <Detail label="Room ID" value={selectedRoom.id} />
                <Detail label="Room Type" value={selectedRoom.type} />
                <Detail label="Floor" value={selectedRoom.floor} />
                <Detail label="Capacity" value={`${selectedRoom.capacity} Guests`} />
                <Detail label="Base Rate" value={`₹${selectedRoom.rate.toLocaleString("en-IN")}`} />
                <Detail label="Housekeeping" value={selectedRoom.housekeeping} />
                <Detail label="Maintenance" value={selectedRoom.maintenance} />
                <Detail label="Layout Position" value={`Position ${selectedRoom.position}`} />
              </div>

              <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
                <button
                  onClick={() => openEditRoom(selectedRoom)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={16} />
                  Edit Room
                </button>
                <button
                  onClick={() => setSelectedRoom(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add / edit floor modal */}
        {showFloorModal && (
          <Modal
            onClose={() => setShowFloorModal(false)}
            title={editingFloor ? "Edit Floor" : "Add New Floor"}
          >
            <form onSubmit={saveFloor} className="space-y-4">
              <FormField label="Floor Number" required>
                <input
                  type="number"
                  min="0"
                  value={floorForm.number}
                  onChange={(e) => setFloorForm({ ...floorForm, number: e.target.value })}
                  className="form-input"
                  placeholder="e.g. 4"
                  required
                />
              </FormField>

              <FormField label="Floor Name" required>
                <input
                  value={floorForm.name}
                  onChange={(e) => setFloorForm({ ...floorForm, name: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Fourth Floor"
                  required
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  value={floorForm.description}
                  onChange={(e) => setFloorForm({ ...floorForm, description: e.target.value })}
                  className="form-input min-h-20 resize-y"
                  placeholder="Enter floor description..."
                />
              </FormField>

              <div className="flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFloorModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <span className="inline-flex items-center justify-center gap-2">
                    <Save size={16} />
                    {editingFloor ? "Save Changes" : "Create Floor"}
                  </span>
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Edit room modal */}
        {showRoomModal && roomForm && (
          <Modal onClose={() => setShowRoomModal(false)} title={`Edit Room ${editingRoom?.number}`}>
            <form onSubmit={saveRoom} className="space-y-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <FormField label="Room Number" required>
                  <input
                    required
                    value={roomForm.number}
                    onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Room Type" required>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm({ ...roomForm, type: e.target.value })}
                    className="form-input"
                  >
                    {["Standard", "Deluxe", "Suite", "Family Room", "Presidential Suite"].map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Floor" required>
                  <select
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    className="form-input"
                  >
                    {floors.map((floor) => (
                      <option key={floor.id} value={floor.number}>
                        {floor.name}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Capacity">
                  <input
                    type="number"
                    min="1"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Base Rate (₹)">
                  <input
                    type="number"
                    min="0"
                    value={roomForm.rate}
                    onChange={(e) => setRoomForm({ ...roomForm, rate: e.target.value })}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Room Status">
                  <select
                    value={roomForm.status}
                    onChange={(e) => setRoomForm({ ...roomForm, status: e.target.value })}
                    className="form-input"
                  >
                    {roomStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Housekeeping">
                  <select
                    value={roomForm.housekeeping}
                    onChange={(e) => setRoomForm({ ...roomForm, housekeeping: e.target.value })}
                    className="form-input"
                  >
                    {["Clean", "Dirty", "In Progress", "Inspected"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Maintenance">
                  <select
                    value={roomForm.maintenance}
                    onChange={(e) => setRoomForm({ ...roomForm, maintenance: e.target.value })}
                    className="form-input"
                  >
                    {["Normal", "Repair required", "Under Repair", "Out of Order"].map((value) => (
                      <option key={value}>{value}</option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="flex gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoomModal(false)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Room
                </button>
              </div>
            </form>
          </Modal>
        )}

        {toast && (
          <div className="fixed bottom-5 right-5 z-[100] rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl">
            {toast}
          </div>
        )}

        <style>{`
          .form-input {
            width: 100%;
            border: 1px solid #e2e8f0;
            border-radius: 9px;
            padding: 10px 12px;
            font-size: 14px;
            outline: none;
            background: white;
            color: #0f172a;
          }
          .form-input:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }
        `}</style>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-slate-500">{title}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${colors[color]}`}>
          <Icon size={16} />
        </div>
      </div>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}
