
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  Eye,
  Pencil,
  Trash2,
  Download,
  X,
  Settings,
  RefreshCw,
  History,
  Bell,
  MapPin,
  UserRound,
  IndianRupee,
  ClipboardList,
} from "lucide-react";

const technicians = [
  "Ramesh Kumar",
  "Suresh Sharma",
  "Mohan Lal",
  "External Technician",
];

const frequencies = [
  "Weekly",
  "Monthly",
  "Quarterly",
  "Half-Yearly",
  "Yearly",
];

const initialEquipment = [
  {
    id: "EQ-1001",
    name: "Split AC",
    category: "AC & HVAC",
    location: "Room 102",
    brand: "Voltas",
    model: "1.5 Ton Split AC",
    serialNumber: "VLT-10201",
    purchaseDate: "2025-04-10",
    lastServiceDate: "2026-10-06",
    nextServiceDate: "2026-11-06",
    frequency: "Monthly",
    technician: "Ramesh Kumar",
    estimatedCost: 800,
    status: "Active",
    notes: "Clean filters and inspect cooling performance.",
    history: [
      {
        date: "2026-10-06",
        technician: "Ramesh Kumar",
        work: "Filter cleaning and gas pressure check.",
        cost: 750,
      },
      {
        date: "2026-09-06",
        technician: "Ramesh Kumar",
        work: "General AC maintenance.",
        cost: 800,
      },
    ],
  },
  {
    id: "EQ-1002",
    name: "Water Pump",
    category: "Plumbing",
    location: "Pump Room",
    brand: "Kirloskar",
    model: "Centrifugal Pump",
    serialNumber: "KIR-20012",
    purchaseDate: "2024-08-15",
    lastServiceDate: "2026-08-01",
    nextServiceDate: "2027-02-01",
    frequency: "Half-Yearly",
    technician: "Suresh Sharma",
    estimatedCost: 1500,
    status: "Active",
    notes: "Inspect motor, bearings and water pressure.",
    history: [
      {
        date: "2026-08-01",
        technician: "Suresh Sharma",
        work: "Motor inspection and bearing lubrication.",
        cost: 1400,
      },
    ],
  },
  {
    id: "EQ-1003",
    name: "Fire Extinguisher",
    category: "Safety Equipment",
    location: "Main Lobby",
    brand: "Ceasefire",
    model: "ABC 4 KG",
    serialNumber: "CF-40031",
    purchaseDate: "2025-01-20",
    lastServiceDate: "2025-11-06",
    nextServiceDate: "2026-11-05",
    frequency: "Yearly",
    technician: "External Technician",
    estimatedCost: 600,
    status: "Active",
    notes: "Inspect pressure gauge and service tag.",
    history: [
      {
        date: "2025-11-06",
        technician: "External Technician",
        work: "Annual inspection and pressure check.",
        cost: 550,
      },
    ],
  },
  {
    id: "EQ-1004",
    name: "Generator",
    category: "Electrical",
    location: "Generator Room",
    brand: "Mahindra Powerol",
    model: "15 KVA Generator",
    serialNumber: "MP-15045",
    purchaseDate: "2023-06-10",
    lastServiceDate: "2026-10-20",
    nextServiceDate: "2026-11-20",
    frequency: "Monthly",
    technician: "Mohan Lal",
    estimatedCost: 2500,
    status: "Active",
    notes: "Check engine oil, battery and fuel system.",
    history: [
      {
        date: "2026-10-20",
        technician: "Mohan Lal",
        work: "Engine oil and battery inspection.",
        cost: 2200,
      },
    ],
  },
  {
    id: "EQ-1005",
    name: "Elevator",
    category: "Other",
    location: "Main Building",
    brand: "Otis",
    model: "Passenger Elevator",
    serialNumber: "OT-50021",
    purchaseDate: "2024-01-10",
    lastServiceDate: "2026-10-01",
    nextServiceDate: "2026-11-01",
    frequency: "Monthly",
    technician: "External Technician",
    estimatedCost: 3000,
    status: "Inactive",
    notes: "Equipment currently under maintenance.",
    history: [
      {
        date: "2026-10-01",
        technician: "External Technician",
        work: "Routine elevator inspection.",
        cost: 2800,
      },
    ],
  },
];

const emptyForm = {
  name: "",
  category: "Electrical",
  location: "",
  brand: "",
  model: "",
  serialNumber: "",
  purchaseDate: "",
  lastServiceDate: "",
  nextServiceDate: "",
  frequency: "Monthly",
  technician: "",
  estimatedCost: "",
  status: "Active",
  notes: "",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

function Field({ label, children }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Modal({ title, onClose, children, size = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className={`w-full ${size} max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Badge({ children, color = "slate" }) {
  const colors = {
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
    yellow: "bg-yellow-100 text-yellow-700",
    blue: "bg-blue-100 text-blue-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${colors[color]}`}>
      {children}
    </span>
  );
}

function getDueStatus(date, status) {
  if (status !== "Active") return "Inactive";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${date}T00:00:00`);
  if (Number.isNaN(due.getTime())) return "Not Scheduled";

  const difference = Math.ceil((due - today) / 86400000);

  if (difference < 0) return "Overdue";
  if (difference === 0) return "Due Today";
  if (difference <= 7) return "Upcoming";
  return "Scheduled";
}

function getDueBadge(status) {
  if (status === "Overdue") return "red";
  if (status === "Due Today") return "yellow";
  if (status === "Upcoming") return "blue";
  if (status === "Inactive") return "slate";
  return "green";
}

function calculateNextDate(date, frequency) {
  if (!date) return "";

  const next = new Date(`${date}T00:00:00`);
  if (Number.isNaN(next.getTime())) return "";

  const day = next.getDate();

  if (frequency === "Weekly") next.setDate(next.getDate() + 7);
  if (frequency === "Monthly") next.setMonth(next.getMonth() + 1);
  if (frequency === "Quarterly") next.setMonth(next.getMonth() + 3);
  if (frequency === "Half-Yearly") next.setMonth(next.getMonth() + 6);
  if (frequency === "Yearly") next.setFullYear(next.getFullYear() + 1);

  // Avoid unexpected month overflow (e.g. January 31 + one month).
  if (frequency !== "Weekly" && next.getDate() !== day) {
    next.setDate(0);
  }

  return [
    next.getFullYear(),
    String(next.getMonth() + 1).padStart(2, "0"),
    String(next.getDate()).padStart(2, "0"),
  ].join("-");
}

export default function PreventiveMaintenance() {
  const [equipment, setEquipment] = useState(initialEquipment);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dueFilter, setDueFilter] = useState("All");
  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [serviceForm, setServiceForm] = useState({
    date: new Date().toISOString().slice(0, 10),
    technician: "",
    work: "",
    cost: "",
    nextServiceDate: "",
  });

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const term = search.toLowerCase();

      const matchesSearch = [
        item.id,
        item.name,
        item.category,
        item.location,
        item.serialNumber,
        item.technician,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const dueStatus = getDueStatus(item.nextServiceDate, item.status);

      return (
        matchesSearch &&
        (statusFilter === "All" || item.status === statusFilter) &&
        (dueFilter === "All" || dueStatus === dueFilter)
      );
    });
  }, [equipment, search, statusFilter, dueFilter]);

  const activeEquipment = equipment.filter((e) => e.status === "Active");

  const stats = [
    {
      label: "Total Equipment",
      value: equipment.length,
      icon: Settings,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Equipment",
      value: activeEquipment.length,
      icon: CheckCircle2,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Overdue Services",
      value: activeEquipment.filter(
        (e) => getDueStatus(e.nextServiceDate, e.status) === "Overdue"
      ).length,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Due Today",
      value: activeEquipment.filter(
        (e) => getDueStatus(e.nextServiceDate, e.status) === "Due Today"
      ).length,
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Upcoming (7 Days)",
      value: activeEquipment.filter(
        (e) => getDueStatus(e.nextServiceDate, e.status) === "Upcoming"
      ).length,
      icon: CalendarDays,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Estimated Service Cost",
      value: money(
        activeEquipment.reduce(
          (sum, e) => sum + Number(e.estimatedCost || 0),
          0
        )
      ),
      icon: IndianRupee,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const updateField = (key, value) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const openCreate = () => {
    setSelected(null);
    setForm(emptyForm);
    setModal("form");
  };

  const openEdit = (item) => {
    setSelected(item);
    setForm({ ...item });
    setModal("form");
  };

  const saveEquipment = (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.location.trim()) {
      alert("Equipment name and location are required.");
      return;
    }

    if (
      form.purchaseDate &&
      form.lastServiceDate &&
      form.lastServiceDate < form.purchaseDate
    ) {
      alert("Last service date cannot be earlier than purchase date.");
      return;
    }

    if (
      form.lastServiceDate &&
      form.nextServiceDate &&
      form.nextServiceDate <= form.lastServiceDate
    ) {
      alert("Next service date must be after the last service date.");
      return;
    }

    if (selected) {
      setEquipment((previous) =>
        previous.map((item) =>
          item.id === selected.id
            ? { ...form, id: selected.id, estimatedCost: Number(form.estimatedCost || 0) }
            : item
        )
      );
    } else {
      const nextNumber =
        Math.max(1000, ...equipment.map((e) => Number(e.id.split("-")[1]) || 1000)) + 1;

      setEquipment((previous) => [
        {
          ...form,
          id: `EQ-${nextNumber}`,
          estimatedCost: Number(form.estimatedCost || 0),
          history: [],
        },
        ...previous,
      ]);
    }

    setModal("");
  };

  const deleteEquipment = (item) => {
    if (!window.confirm(`Delete ${item.name} (${item.id})?`)) return;

    setEquipment((previous) => previous.filter((e) => e.id !== item.id));
  };

  const openService = (item) => {
    setSelected(item);
    setServiceForm({
      date: new Date().toISOString().slice(0, 10),
      technician: item.technician || "",
      work: "",
      cost: "",
      nextServiceDate: calculateNextDate(
        new Date().toISOString().slice(0, 10),
        item.frequency
      ),
    });
    setModal("service");
  };

  const saveService = (e) => {
    e.preventDefault();

    if (!serviceForm.work.trim() || !serviceForm.technician) {
      alert("Please enter the service details and technician.");
      return;
    }

    if (serviceForm.nextServiceDate <= serviceForm.date) {
      alert("Next service date must be after the service date.");
      return;
    }

    const serviceEntry = {
      date: serviceForm.date,
      technician: serviceForm.technician,
      work: serviceForm.work,
      cost: Number(serviceForm.cost || 0),
    };

    setEquipment((previous) =>
      previous.map((item) =>
        item.id === selected.id
          ? {
              ...item,
              lastServiceDate: serviceForm.date,
              nextServiceDate: serviceForm.nextServiceDate,
              technician: serviceForm.technician,
              history: [serviceEntry, ...(item.history || [])],
            }
          : item
      )
    );

    setModal("");
  };

  const exportCSV = () => {
    const headers = [
      "Equipment ID",
      "Equipment Name",
      "Category",
      "Location",
      "Brand",
      "Model",
      "Serial Number",
      "Last Service Date",
      "Next Service Date",
      "Frequency",
      "Technician",
      "Estimated Cost",
      "Status",
    ];

    const rows = filteredEquipment.map((item) => [
      item.id,
      item.name,
      item.category,
      item.location,
      item.brand,
      item.model,
      item.serialNumber,
      item.lastServiceDate,
      item.nextServiceDate,
      item.frequency,
      item.technician,
      item.estimatedCost,
      item.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "preventive-maintenance.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const upcomingEquipment = [...activeEquipment]
    .filter((item) => {
      const status = getDueStatus(item.nextServiceDate, item.status);
      return ["Overdue", "Due Today", "Upcoming"].includes(status);
    })
    .sort((a, b) => a.nextServiceDate.localeCompare(b.nextServiceDate));

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Preventive Maintenance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Schedule equipment servicing and prevent unexpected breakdowns.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} /> Export CSV
          </button>

          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Add Equipment
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <h2 className="mt-2 text-2xl font-bold text-slate-800">
                  {stat.value}
                </h2>
              </div>
              <div className={`rounded-xl p-3 ${stat.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Service Reminders */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-2 font-semibold text-slate-800">
              <Bell size={18} className="text-orange-500" />
              Service Reminders
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Equipment that needs attention.
            </p>
          </div>
          <Badge color={upcomingEquipment.length ? "yellow" : "green"}>
            {upcomingEquipment.length} reminders
          </Badge>
        </div>

        {upcomingEquipment.length === 0 ? (
          <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
            No overdue or upcoming maintenance services.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEquipment.map((item) => {
              const dueStatus = getDueStatus(item.nextServiceDate, item.status);

              return (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.id} · {item.location}
                      </p>
                    </div>
                    <Badge color={getDueBadge(dueStatus)}>{dueStatus}</Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span>Next service</span>
                    <span className="font-semibold text-slate-700">
                      {item.nextServiceDate}
                    </span>
                  </div>

                  <button
                    onClick={() => openService(item)}
                    className="mt-3 w-full rounded-lg bg-blue-50 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Record Service
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search equipment, ID, location..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Equipment Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className={inputClass}
          >
            <option value="All">All Service Schedules</option>
            <option>Overdue</option>
            <option>Due Today</option>
            <option>Upcoming</option>
            <option>Scheduled</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredEquipment.length} of {equipment.length} equipment records</span>
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setDueFilter("All");
            }}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Clear filters
          </button>
        </div>
      </div>

      {/* Equipment Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">Equipment & Schedules</h2>
            <p className="mt-1 text-xs text-slate-500">
              Maintain equipment records and recurring service schedules.
            </p>
          </div>
          <Settings size={20} className="text-slate-400" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Equipment</th>
                <th className="px-5 py-3">Location</th>
                <th className="px-5 py-3">Last Service</th>
                <th className="px-5 py-3">Next Service</th>
                <th className="px-5 py-3">Frequency</th>
                <th className="px-5 py-3">Technician</th>
                <th className="px-5 py-3">Schedule Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredEquipment.map((item) => {
                const dueStatus = getDueStatus(item.nextServiceDate, item.status);

                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.id} · {item.category}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} /> {item.location}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.lastServiceDate || "Not recorded"}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {item.nextServiceDate || "Not scheduled"}
                    </td>

                    <td className="px-5 py-4 text-slate-600">{item.frequency}</td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.technician || "Unassigned"}
                    </td>

                    <td className="px-5 py-4">
                      <Badge color={getDueBadge(dueStatus)}>{dueStatus}</Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View equipment and history"
                          onClick={() => {
                            setSelected(item);
                            setModal("details");
                          }}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          title="Record service"
                          onClick={() => openService(item)}
                          disabled={item.status !== "Active"}
                          className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-600 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Wrench size={17} />
                        </button>

                        <button
                          title="Edit equipment"
                          onClick={() => openEdit(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          title="Delete equipment"
                          onClick={() => deleteEquipment(item)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredEquipment.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                    No equipment records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Equipment */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Equipment" : "Add Equipment"}
          onClose={() => setModal("")}
        >
          <form onSubmit={saveEquipment} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Equipment Name *">
                <input
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Split AC"
                  required
                />
              </Field>

              <Field label="Category">
                <select
                  className={inputClass}
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                >
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>AC & HVAC</option>
                  <option>Safety Equipment</option>
                  <option>Kitchen Equipment</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Location *">
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="Room, floor or facility"
                  required
                />
              </Field>

              <Field label="Brand">
                <input
                  className={inputClass}
                  value={form.brand}
                  onChange={(e) => updateField("brand", e.target.value)}
                  placeholder="Equipment brand"
                />
              </Field>

              <Field label="Model">
                <input
                  className={inputClass}
                  value={form.model}
                  onChange={(e) => updateField("model", e.target.value)}
                  placeholder="Model number"
                />
              </Field>

              <Field label="Serial Number">
                <input
                  className={inputClass}
                  value={form.serialNumber}
                  onChange={(e) => updateField("serialNumber", e.target.value)}
                  placeholder="Serial number"
                />
              </Field>

              <Field label="Purchase Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.purchaseDate}
                  onChange={(e) => updateField("purchaseDate", e.target.value)}
                />
              </Field>

              <Field label="Equipment Status">
                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => updateField("status", e.target.value)}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </Field>

              <Field label="Last Service Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.lastServiceDate}
                  onChange={(e) => updateField("lastServiceDate", e.target.value)}
                />
              </Field>

              <Field label="Next Service Date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.nextServiceDate}
                  onChange={(e) => updateField("nextServiceDate", e.target.value)}
                />
              </Field>

              <Field label="Maintenance Frequency">
                <select
                  className={inputClass}
                  value={form.frequency}
                  onChange={(e) => updateField("frequency", e.target.value)}
                >
                  {frequencies.map((f) => <option key={f}>{f}</option>)}
                </select>
              </Field>

              <Field label="Assigned Technician">
                <select
                  className={inputClass}
                  value={form.technician}
                  onChange={(e) => updateField("technician", e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {technicians.map((t) => <option key={t}>{t}</option>)}
                </select>
              </Field>

              <Field label="Estimated Service Cost (₹)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.estimatedCost}
                  onChange={(e) => updateField("estimatedCost", e.target.value)}
                  placeholder="0"
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Maintenance Notes / Instructions">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    placeholder="Describe routine maintenance tasks..."
                  />
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selected ? "Update Equipment" : "Save Equipment"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Record Service */}
      {modal === "service" && selected && (
        <Modal title="Record Equipment Service" onClose={() => setModal("")} size="max-w-xl">
          <form onSubmit={saveService} className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="font-semibold text-blue-900">{selected.name}</p>
              <p className="mt-1 text-xs text-blue-700">
                {selected.id} · {selected.location}
              </p>
            </div>

            <Field label="Service Date">
              <input
                type="date"
                className={inputClass}
                value={serviceForm.date}
                onChange={(e) => {
                  const date = e.target.value;
                  setServiceForm((previous) => ({
                    ...previous,
                    date,
                    nextServiceDate: calculateNextDate(date, selected.frequency),
                  }));
                }}
                required
              />
            </Field>

            <Field label="Technician">
              <select
                className={inputClass}
                value={serviceForm.technician}
                onChange={(e) =>
                  setServiceForm((previous) => ({
                    ...previous,
                    technician: e.target.value,
                  }))
                }
                required
              >
                <option value="">Select Technician</option>
                {technicians.map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>

            <Field label="Work Performed">
              <textarea
                rows={3}
                className={inputClass}
                value={serviceForm.work}
                onChange={(e) =>
                  setServiceForm((previous) => ({
                    ...previous,
                    work: e.target.value,
                  }))
                }
                placeholder="Describe inspection, repair or servicing performed..."
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Service Cost (₹)">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={serviceForm.cost}
                  onChange={(e) =>
                    setServiceForm((previous) => ({
                      ...previous,
                      cost: e.target.value,
                    }))
                  }
                  placeholder="0"
                />
              </Field>

              <Field label="Next Service Date">
                <input
                  type="date"
                  className={inputClass}
                  value={serviceForm.nextServiceDate}
                  onChange={(e) =>
                    setServiceForm((previous) => ({
                      ...previous,
                      nextServiceDate: e.target.value,
                    }))
                  }
                  required
                />
              </Field>
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Save Service Record
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Equipment Details and Service History */}
      {modal === "details" && selected && (
        <Modal
          title={`Equipment Details — ${selected.id}`}
          onClose={() => setModal("")}
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {selected.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {selected.brand || "No brand"} · {selected.model || "No model"}
                </p>
              </div>
              <Badge color={selected.status === "Active" ? "green" : "slate"}>
                {selected.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                ["Category", selected.category],
                ["Location", selected.location],
                ["Brand", selected.brand || "Not specified"],
                ["Model", selected.model || "Not specified"],
                ["Serial Number", selected.serialNumber || "Not specified"],
                ["Purchase Date", selected.purchaseDate || "Not specified"],
                ["Last Service", selected.lastServiceDate || "Not recorded"],
                ["Next Service", selected.nextServiceDate || "Not scheduled"],
                ["Frequency", selected.frequency],
                ["Technician", selected.technician || "Unassigned"],
                ["Estimated Cost", money(selected.estimatedCost)],
                ["Schedule Status", getDueStatus(selected.nextServiceDate, selected.status)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-medium text-slate-800">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-800">Maintenance Instructions</h4>
              <p className="mt-2 text-sm text-slate-600">
                {selected.notes || "No instructions recorded."}
              </p>
            </div>

            <div>
              <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
                <History size={18} /> Service History
              </h4>

              {(selected.history || []).length === 0 ? (
                <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                  No service history available.
                </p>
              ) : (
                <div className="space-y-3">
                  {selected.history.map((record, index) => (
                    <div
                      key={`${record.date}-${index}`}
                      className="rounded-lg border border-slate-200 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-slate-800">{record.date}</p>
                        <Badge color="green">Serviced</Badge>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{record.work}</p>
                      <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-slate-500">
                        <span>Technician: {record.technician}</span>
                        <span>Cost: {money(record.cost)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                onClick={() => openEdit(selected)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
              >
                <Pencil size={16} /> Edit
              </button>

              {selected.status === "Active" && (
                <button
                  onClick={() => openService(selected)}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Wrench size={16} /> Record Service
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
