
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  Armchair,
  CalendarDays,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Pencil,
  Trash2,
  Eye,
  X,
  ArrowRightLeft,
  Utensils,
  Filter,
  MapPin,
  Phone,
  UserRound,
  ChevronDown,
  Check,
} from "lucide-react";

const initialTables = [
  { id: "T001", number: "01", capacity: 2, area: "Indoor", floor: "Ground Floor", status: "Available" },
  { id: "T002", number: "02", capacity: 4, area: "Indoor", floor: "Ground Floor", status: "Occupied" },
  { id: "T003", number: "03", capacity: 4, area: "Indoor", floor: "Ground Floor", status: "Reserved" },
  { id: "T004", number: "04", capacity: 6, area: "Outdoor", floor: "Ground Floor", status: "Available" },
  { id: "T005", number: "05", capacity: 2, area: "Outdoor", floor: "Ground Floor", status: "Available" },
  { id: "T006", number: "06", capacity: 8, area: "Private Dining", floor: "First Floor", status: "Occupied" },
  { id: "T007", number: "07", capacity: 4, area: "Indoor", floor: "First Floor", status: "Available" },
  { id: "T008", number: "08", capacity: 6, area: "Private Dining", floor: "First Floor", status: "Reserved" },
  { id: "T009", number: "09", capacity: 4, area: "Outdoor", floor: "Ground Floor", status: "Available" },
  { id: "T010", number: "10", capacity: 2, area: "Indoor", floor: "Ground Floor", status: "Occupied" },
];

const initialReservations = [
  {
    id: "RES-1001",
    guest: "Ananya Sharma",
    phone: "9876543210",
    guests: 4,
    tableId: "T003",
    date: "2026-11-06",
    time: "19:00",
    duration: 90,
    status: "Confirmed",
    notes: "Window-side seating preferred",
  },
  {
    id: "RES-1002",
    guest: "Vikram Mehta",
    phone: "9876501234",
    guests: 6,
    tableId: "T008",
    date: "2026-11-06",
    time: "20:00",
    duration: 120,
    status: "Confirmed",
    notes: "Birthday dinner",
  },
  {
    id: "RES-1003",
    guest: "Kavita Rao",
    phone: "9876512345",
    guests: 2,
    tableId: "T001",
    date: "2026-11-07",
    time: "13:00",
    duration: 60,
    status: "Pending",
    notes: "",
  },
];

const emptyTable = {
  number: "",
  capacity: 2,
  area: "Indoor",
  floor: "Ground Floor",
  status: "Available",
};

const emptyReservation = {
  guest: "",
  phone: "",
  guests: 2,
  tableId: "",
  date: "2026-11-06",
  time: "19:00",
  duration: 90,
  status: "Confirmed",
  notes: "",
};

const tableStatusStyles = {
  Available: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Reserved: "bg-amber-50 text-amber-700 border-amber-200",
  Occupied: "bg-blue-50 text-blue-700 border-blue-200",
  "Out of Service": "bg-red-50 text-red-700 border-red-200",
};

const reservationStatusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Seated: "bg-blue-50 text-blue-700",
  Completed: "bg-slate-100 text-slate-600",
  Cancelled: "bg-red-50 text-red-700",
};

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
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
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantTables() {
  const [tables, setTables] = useState(initialTables);
  const [reservations, setReservations] = useState(initialReservations);

  const [activeTab, setActiveTab] = useState("tables");
  const [tableSearch, setTableSearch] = useState("");
  const [reservationSearch, setReservationSearch] = useState("");
  const [tableStatusFilter, setTableStatusFilter] = useState("All");
  const [areaFilter, setAreaFilter] = useState("All");
  const [reservationStatusFilter, setReservationStatusFilter] = useState("All");

  const [showTableModal, setShowTableModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [editingTableId, setEditingTableId] = useState(null);
  const [editingReservationId, setEditingReservationId] = useState(null);
  const [viewReservation, setViewReservation] = useState(null);
  const [transferReservation, setTransferReservation] = useState(null);

  const [tableForm, setTableForm] = useState(emptyTable);
  const [reservationForm, setReservationForm] = useState(emptyReservation);
  const [transferTableId, setTransferTableId] = useState("");

  const availableCount = tables.filter((t) => t.status === "Available").length;
  const reservedCount = tables.filter((t) => t.status === "Reserved").length;
  const occupiedCount = tables.filter((t) => t.status === "Occupied").length;
  const outOfServiceCount = tables.filter((t) => t.status === "Out of Service").length;

  const filteredTables = useMemo(() => {
    return tables.filter((table) => {
      const matchesSearch = [
        table.number,
        table.area,
        table.floor,
      ]
        .join(" ")
        .toLowerCase()
        .includes(tableSearch.toLowerCase());

      const matchesStatus =
        tableStatusFilter === "All" || table.status === tableStatusFilter;

      const matchesArea = areaFilter === "All" || table.area === areaFilter;

      return matchesSearch && matchesStatus && matchesArea;
    });
  }, [tables, tableSearch, tableStatusFilter, areaFilter]);

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const table = tables.find((t) => t.id === reservation.tableId);
      const matchesSearch = [
        reservation.id,
        reservation.guest,
        reservation.phone,
        table?.number || "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(reservationSearch.toLowerCase());

      const matchesStatus =
        reservationStatusFilter === "All" ||
        reservation.status === reservationStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, tables, reservationSearch, reservationStatusFilter]);

  const updateTableForm = (key, value) => {
    setTableForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateReservationForm = (key, value) => {
    setReservationForm((prev) => ({ ...prev, [key]: value }));
  };

  const openNewTable = () => {
    setEditingTableId(null);
    setTableForm(emptyTable);
    setShowTableModal(true);
  };

  const openEditTable = (table) => {
    setEditingTableId(table.id);
    setTableForm({ ...table });
    setShowTableModal(true);
  };

  const saveTable = (event) => {
    event.preventDefault();

    if (!tableForm.number.trim()) {
      alert("Please enter a table number.");
      return;
    }

    const duplicate = tables.some(
      (table) =>
        table.number.toLowerCase() === tableForm.number.trim().toLowerCase() &&
        table.id !== editingTableId
    );

    if (duplicate) {
      alert("A table with this number already exists.");
      return;
    }

    if (editingTableId) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === editingTableId
            ? { ...table, ...tableForm, number: tableForm.number.trim() }
            : table
        )
      );
    } else {
      setTables((prev) => [
        ...prev,
        {
          ...tableForm,
          id: `T${Date.now().toString().slice(-6)}`,
          number: tableForm.number.trim(),
        },
      ]);
    }

    setShowTableModal(false);
    setEditingTableId(null);
  };

  const deleteTable = (table) => {
    const linkedReservation = reservations.some(
      (reservation) =>
        reservation.tableId === table.id &&
        !["Cancelled", "Completed"].includes(reservation.status)
    );

    if (linkedReservation) {
      alert("This table has an active reservation. Reassign or cancel it first.");
      return;
    }

    if (window.confirm(`Delete Table ${table.number}?`)) {
      setTables((prev) => prev.filter((t) => t.id !== table.id));
    }
  };

  const openNewReservation = () => {
    setEditingReservationId(null);
    setReservationForm({
      ...emptyReservation,
      tableId: tables.find((table) => table.status === "Available")?.id || "",
    });
    setShowReservationModal(true);
  };

  const openEditReservation = (reservation) => {
    setEditingReservationId(reservation.id);
    setReservationForm({ ...reservation });
    setShowReservationModal(true);
    setViewReservation(null);
  };

  const saveReservation = (event) => {
    event.preventDefault();

    if (!reservationForm.guest.trim()) {
      alert("Please enter the guest name.");
      return;
    }

    if (!reservationForm.tableId) {
      alert("Please assign a table.");
      return;
    }

    const table = tables.find((t) => t.id === reservationForm.tableId);
    if (!table) {
      alert("Selected table does not exist.");
      return;
    }

    if (Number(reservationForm.guests) > table.capacity) {
      alert(`This table has capacity for ${table.capacity} guests only.`);
      return;
    }

    if (table.status === "Out of Service") {
      alert("This table is out of service.");
      return;
    }

    const conflictingReservation = reservations.some((reservation) => {
      if (
        reservation.id === editingReservationId ||
        reservation.tableId !== reservationForm.tableId ||
        reservation.date !== reservationForm.date ||
        ["Cancelled", "Completed"].includes(reservation.status)
      ) {
        return false;
      }

      const startA =
        Number(reservationForm.time.split(":")[0]) * 60 +
        Number(reservationForm.time.split(":")[1]);
      const endA = startA + Number(reservationForm.duration);

      const startB =
        Number(reservation.time.split(":")[0]) * 60 +
        Number(reservation.time.split(":")[1]);
      const endB = startB + Number(reservation.duration);

      return startA < endB && startB < endA;
    });

    if (conflictingReservation) {
      alert("This table already has a reservation during that time.");
      return;
    }

    const oldReservation = reservations.find(
      (r) => r.id === editingReservationId
    );

    const reservationData = {
      ...reservationForm,
      guest: reservationForm.guest.trim(),
      guests: Number(reservationForm.guests),
      duration: Number(reservationForm.duration),
    };

    if (editingReservationId) {
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === editingReservationId
            ? { ...reservation, ...reservationData }
            : reservation
        )
      );

      if (
        oldReservation &&
        oldReservation.tableId !== reservationForm.tableId
      ) {
        const oldTable = tables.find((t) => t.id === oldReservation.tableId);
        if (oldTable?.status === "Reserved") {
          setTables((prev) =>
            prev.map((t) =>
              t.id === oldTable.id ? { ...t, status: "Available" } : t
            )
          );
        }
      }
    } else {
      setReservations((prev) => [
        {
          ...reservationData,
          id: `RES-${Date.now().toString().slice(-6)}`,
        },
        ...prev,
      ]);
    }

    if (reservationData.status === "Confirmed") {
      setTables((prev) =>
        prev.map((t) =>
          t.id === reservationData.tableId && t.status === "Available"
            ? { ...t, status: "Reserved" }
            : t
        )
      );
    }

    setShowReservationModal(false);
    setEditingReservationId(null);
  };

  const updateReservationStatus = (reservation, status) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id ? { ...r, status } : r
      )
    );

    if (status === "Seated") {
      setTables((prev) =>
        prev.map((table) =>
          table.id === reservation.tableId
            ? { ...table, status: "Occupied" }
            : table
        )
      );
    }

    if (["Cancelled", "Completed"].includes(status)) {
      setTables((prev) =>
        prev.map((table) =>
          table.id === reservation.tableId && table.status === "Reserved"
            ? { ...table, status: "Available" }
            : table
        )
      );
    }
  };

  const deleteReservation = (reservation) => {
    if (window.confirm(`Delete reservation ${reservation.id}?`)) {
      setReservations((prev) =>
        prev.filter((r) => r.id !== reservation.id)
      );

      setTables((prev) =>
        prev.map((table) =>
          table.id === reservation.tableId && table.status === "Reserved"
            ? { ...table, status: "Available" }
            : table
        )
      );
    }
  };

  const openTransfer = (reservation) => {
    setTransferReservation(reservation);
    setTransferTableId("");
    setShowTransferModal(true);
  };

  const saveTransfer = (event) => {
    event.preventDefault();

    if (!transferTableId || !transferReservation) return;

    const newTable = tables.find((t) => t.id === transferTableId);

    if (!newTable || newTable.status === "Out of Service") {
      alert("Please choose a valid table.");
      return;
    }

    if (newTable.capacity < transferReservation.guests) {
      alert(`This table can seat only ${newTable.capacity} guests.`);
      return;
    }

    const conflict = reservations.some(
      (reservation) =>
        reservation.id !== transferReservation.id &&
        reservation.tableId === transferTableId &&
        reservation.date === transferReservation.date &&
        !["Cancelled", "Completed"].includes(reservation.status)
    );

    if (conflict) {
      alert("The selected table already has an active reservation.");
      return;
    }

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === transferReservation.id
          ? { ...reservation, tableId: transferTableId }
          : reservation
      )
    );

    setTables((prev) =>
      prev.map((table) => {
        if (
          table.id === transferReservation.tableId &&
          table.status === "Reserved"
        ) {
          return { ...table, status: "Available" };
        }

        if (table.id === transferTableId && table.status === "Available") {
          return { ...table, status: "Reserved" };
        }

        return table;
      })
    );

    setShowTransferModal(false);
    setTransferReservation(null);
  };

  const tableLabel = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? `Table ${table.number}` : "Unassigned";
  };

  const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="min-h-screen w-full bg-slate-50 p-3 md:p-5">
      <div className="w-full space-y-5">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Utensils size={16} />
              <span>Restaurant & Dining</span>
              <span>/</span>
              <span className="text-slate-800">Tables & Reservations</span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-slate-900">
              Tables & Reservations
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage table availability, seating arrangements and guest bookings.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              onClick={openNewTable}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Plus size={17} />
              Add Table
            </button>
            <button
              onClick={openNewReservation}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              <CalendarDays size={17} />
              New Reservation
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Tables"
            value={tables.length}
            subtitle="Registered restaurant tables"
            icon={Armchair}
            color="blue"
          />
          <StatCard
            title="Available Tables"
            value={availableCount}
            subtitle="Ready for seating"
            icon={CheckCircle2}
            color="green"
          />
          <StatCard
            title="Reserved Tables"
            value={reservedCount}
            subtitle="Assigned to reservations"
            icon={CalendarDays}
            color="amber"
          />
          <StatCard
            title="Occupied Tables"
            value={occupiedCount}
            subtitle={`${outOfServiceCount} out of service`}
            icon={Users}
            color="purple"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("tables")}
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "tables"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <Armchair size={16} />
              Restaurant Tables ({tables.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("reservations")}
            className={`border-b-2 px-4 py-3 text-sm font-semibold ${
              activeTab === "reservations"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={16} />
              Reservations ({reservations.length})
            </span>
          </button>
        </div>

        {/* Tables tab */}
        {activeTab === "tables" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">Table Overview</h2>
                <p className="mt-1 text-xs text-slate-500">
                  View and manage your restaurant seating.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="Search tables..."
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-48"
                  />
                </div>

                <select
                  value={tableStatusFilter}
                  onChange={(e) => setTableStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  {Object.keys(tableStatusStyles).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <select
                  value={areaFilter}
                  onChange={(e) => setAreaFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="All">All Areas</option>
                  <option>Indoor</option>
                  <option>Outdoor</option>
                  <option>Private Dining</option>
                </select>
              </div>
            </div>

            {/* Table cards */}
            {filteredTables.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
                <Armchair size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="font-semibold text-slate-800">No tables found</p>
                <p className="mt-1 text-sm text-slate-500">
                  Change your filters or add a new table.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTables.map((table) => {
                  const linkedReservation = reservations.find(
                    (reservation) =>
                      reservation.tableId === table.id &&
                      !["Cancelled", "Completed"].includes(reservation.status)
                  );

                  return (
                    <div
                      key={table.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                          <Armchair size={24} />
                        </div>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${tableStatusStyles[table.status]}`}
                        >
                          {table.status}
                        </span>
                      </div>

                      <div className="mt-4">
                        <h3 className="text-xl font-bold text-slate-900">
                          Table {table.number}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          {table.area}
                        </p>
                      </div>

                      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="inline-flex items-center gap-2 text-slate-500">
                            <Users size={15} />
                            Capacity
                          </span>
                          <span className="font-semibold text-slate-800">
                            {table.capacity} guests
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="inline-flex items-center gap-2 text-slate-500">
                            <MapPin size={15} />
                            Floor
                          </span>
                          <span className="font-medium text-slate-700">
                            {table.floor}
                          </span>
                        </div>
                      </div>

                      {linkedReservation && (
                        <div className="mt-3 rounded-lg bg-amber-50 p-3">
                          <p className="text-xs font-semibold text-amber-800">
                            Upcoming reservation
                          </p>
                          <p className="mt-1 text-sm font-medium text-amber-900">
                            {linkedReservation.guest}
                          </p>
                          <p className="mt-1 text-xs text-amber-700">
                            {formatDate(linkedReservation.date)} · {linkedReservation.time}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <button
                          onClick={() =>
                            setTables((prev) =>
                              prev.map((t) =>
                                t.id === table.id
                                  ? {
                                      ...t,
                                      status:
                                        t.status === "Available"
                                          ? "Occupied"
                                          : "Available",
                                    }
                                  : t
                              )
                            )
                          }
                          disabled={table.status === "Out of Service" || table.status === "Reserved"}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {table.status === "Occupied"
                            ? "Mark Available"
                            : table.status === "Available"
                            ? "Mark Occupied"
                            : "Status Managed"}
                        </button>

                        <div className="flex gap-1">
                          <button
                            title="Edit table"
                            onClick={() => openEditTable(table)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            title="Delete table"
                            onClick={() => deleteTable(table)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Reservations tab */}
        {activeTab === "reservations" && (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Table Reservations
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Manage guest bookings and seating assignments.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={reservationSearch}
                    onChange={(e) => setReservationSearch(e.target.value)}
                    placeholder="Search reservations..."
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 sm:w-56"
                  />
                </div>

                <select
                  value={reservationStatusFilter}
                  onChange={(e) => setReservationStatusFilter(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>
                  {Object.keys(reservationStatusStyles).map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>

                <button
                  onClick={openNewReservation}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={16} />
                  Add Reservation
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Reservation ID</th>
                    <th className="px-4 py-3 font-semibold">Guest</th>
                    <th className="px-4 py-3 font-semibold">Contact</th>
                    <th className="px-4 py-3 font-semibold">Guests</th>
                    <th className="px-4 py-3 font-semibold">Table</th>
                    <th className="px-4 py-3 font-semibold">Date & Time</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredReservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {reservation.id}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">
                        {reservation.guest}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {reservation.phone || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {reservation.guests}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">
                        {tableLabel(reservation.tableId)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        <p>{formatDate(reservation.date)}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {reservation.time} · {reservation.duration} min
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={reservation.status}
                          onChange={(e) =>
                            updateReservationStatus(reservation, e.target.value)
                          }
                          className={`rounded-full border-0 px-2.5 py-1 text-xs font-semibold outline-none ${reservationStatusStyles[reservation.status]}`}
                        >
                          {Object.keys(reservationStatusStyles).map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            title="View reservation"
                            onClick={() => setViewReservation(reservation)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Transfer table"
                            onClick={() => openTransfer(reservation)}
                            disabled={["Cancelled", "Completed"].includes(reservation.status)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600 disabled:opacity-40"
                          >
                            <ArrowRightLeft size={16} />
                          </button>
                          <button
                            title="Edit reservation"
                            onClick={() => openEditReservation(reservation)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-amber-50 hover:text-amber-600"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            title="Delete reservation"
                            onClick={() => deleteReservation(reservation)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredReservations.length === 0 && (
                    <tr>
                      <td
                        colSpan="8"
                        className="px-4 py-12 text-center text-slate-500"
                      >
                        <CalendarDays
                          size={30}
                          className="mx-auto mb-2 text-slate-300"
                        />
                        No reservations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Showing {filteredReservations.length} of {reservations.length} reservations
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingTableId ? "Edit Table" : "Add New Table"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Configure table number, seating and location.
                </p>
              </div>
              <button
                onClick={() => setShowTableModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveTable}>
              <div className="space-y-4 p-5">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Table Number *
                  </label>
                  <input
                    required
                    value={tableForm.number}
                    onChange={(e) => updateTableForm("number", e.target.value)}
                    placeholder="e.g. 11"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={tableForm.capacity}
                    onChange={(e) =>
                      updateTableForm("capacity", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Area
                  </label>
                  <select
                    value={tableForm.area}
                    onChange={(e) => updateTableForm("area", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Indoor</option>
                    <option>Outdoor</option>
                    <option>Private Dining</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Floor
                  </label>
                  <select
                    value={tableForm.floor}
                    onChange={(e) => updateTableForm("floor", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option>Ground Floor</option>
                    <option>First Floor</option>
                    <option>Second Floor</option>
                    <option>Terrace</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Table Status
                  </label>
                  <select
                    value={tableForm.status}
                    onChange={(e) => updateTableForm("status", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {Object.keys(tableStatusStyles).map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setShowTableModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {editingTableId ? "Update Table" : "Save Table"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Reservation Modal */}
      {showReservationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">
                  {editingReservationId ? "Edit Reservation" : "New Table Reservation"}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Enter guest details and assign a suitable table.
                </p>
              </div>
              <button
                onClick={() => setShowReservationModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveReservation} className="overflow-y-auto">
              <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Guest Name *
                  </label>
                  <input
                    required
                    value={reservationForm.guest}
                    onChange={(e) =>
                      updateReservationForm("guest", e.target.value)
                    }
                    placeholder="Enter guest name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Phone Number
                  </label>
                  <input
                    value={reservationForm.phone}
                    onChange={(e) =>
                      updateReservationForm("phone", e.target.value)
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Number of Guests *
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    max="50"
                    value={reservationForm.guests}
                    onChange={(e) =>
                      updateReservationForm("guests", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Assign Table *
                  </label>
                  <select
                    required
                    value={reservationForm.tableId}
                    onChange={(e) =>
                      updateReservationForm("tableId", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Select a table</option>
                    {tables
                      .filter((table) => {
                        if (table.status === "Out of Service") return false;
                        if (
                          table.status === "Occupied" &&
                          table.id !== reservationForm.tableId
                        ) return false;
                        if (table.capacity < Number(reservationForm.guests)) {
                          return false;
                        }
                        return true;
                      })
                      .map((table) => (
                        <option key={table.id} value={table.id}>
                          Table {table.number} · {table.capacity} seats · {table.area}
                        </option>
                      ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Tables that cannot seat this group are excluded.
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Reservation Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={reservationForm.date}
                    onChange={(e) =>
                      updateReservationForm("date", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Reservation Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={reservationForm.time}
                    onChange={(e) =>
                      updateReservationForm("time", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Duration (minutes)
                  </label>
                  <select
                    value={reservationForm.duration}
                    onChange={(e) =>
                      updateReservationForm("duration", Number(e.target.value))
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="60">60 minutes</option>
                    <option value="90">90 minutes</option>
                    <option value="120">120 minutes</option>
                    <option value="150">150 minutes</option>
                    <option value="180">180 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Reservation Status
                  </label>
                  <select
                    value={reservationForm.status}
                    onChange={(e) =>
                      updateReservationForm("status", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {Object.keys(reservationStatusStyles).map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    Special Requests / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={reservationForm.notes}
                    onChange={(e) =>
                      updateReservationForm("notes", e.target.value)
                    }
                    placeholder="Birthday setup, window seating, dietary requirements..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setShowReservationModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Check size={16} />
                  {editingReservationId ? "Update Reservation" : "Create Reservation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transfer Table Modal */}
      {showTransferModal && transferReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Transfer Table</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Change the table assigned to this reservation.
                </p>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveTransfer}>
              <div className="space-y-4 p-5">
                <div className="rounded-lg bg-slate-50 p-3 text-sm">
                  <p className="font-semibold text-slate-800">
                    {transferReservation.guest}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {transferReservation.guests} guests · {tableLabel(transferReservation.tableId)}
                  </p>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-600">
                    New Table
                  </label>
                  <select
                    required
                    value={transferTableId}
                    onChange={(e) => setTransferTableId(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="">Choose another table</option>
                    {tables
                      .filter(
                        (table) =>
                          table.id !== transferReservation.tableId &&
                          table.status !== "Out of Service" &&
                          table.status !== "Occupied" &&
                          table.capacity >= transferReservation.guests
                      )
                      .map((table) => (
                        <option key={table.id} value={table.id}>
                          Table {table.number} · {table.capacity} seats · {table.status}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!transferTableId}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  <ArrowRightLeft size={16} />
                  Transfer Table
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation details modal */}
      {viewReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="font-bold text-slate-900">Reservation Details</h2>
                <p className="mt-1 text-xs text-blue-600">
                  {viewReservation.id}
                </p>
              </div>
              <button
                onClick={() => setViewReservation(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs text-slate-400">Guest Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {viewReservation.guest}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Phone</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-800">
                    <Phone size={14} />
                    {viewReservation.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Number of Guests</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-slate-800">
                    <Users size={14} />
                    {viewReservation.guests}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Assigned Table</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {tableLabel(viewReservation.tableId)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {viewReservation.duration} minutes
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Date</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {formatDate(viewReservation.date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Time</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {viewReservation.time}
                  </p>
                </div>
              </div>

              {viewReservation.notes && (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  <strong>Special requests:</strong> {viewReservation.notes}
                </div>
              )}

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${reservationStatusStyles[viewReservation.status]}`}
              >
                {viewReservation.status}
              </span>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 px-5 py-4">
              <button
                onClick={() => openEditReservation(viewReservation)}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Pencil size={15} />
                Edit
              </button>
              <button
                onClick={() => setViewReservation(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
