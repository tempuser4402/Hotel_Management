
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  X,
  Clock,
  CheckCircle2,
  CalendarDays,
  BedDouble,
  UserRound,
  Plane,
  Cake,
  Heart,
  Luggage,
  Accessibility,
  Utensils,
  Bed,
  Sparkles,
  ClipboardList,
  IndianRupee,
  Pencil,
  Eye,
  AlertCircle,
  Building2,
} from "lucide-react";

const requestTypes = [
  "Early Check-in",
  "Late Checkout",
  "Birthday Decoration",
  "Airport Pickup",
  "Extra Bedding",
  "Dietary Requirements",
  "Honeymoon Arrangements",
  "Wheelchair Assistance",
];

const departments = [
  "Front Office",
  "Housekeeping",
  "Food & Beverage",
  "Transport",
  "Maintenance",
  "Guest Relations",
];

const staffMembers = [
  "Priya",
  "Amit",
  "Neha",
  "Rohit",
  "Suresh",
];

const statusOptions = [
  "New",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

const requestIcons = {
  "Early Check-in": Clock,
  "Late Checkout": CalendarDays,
  "Birthday Decoration": Cake,
  "Airport Pickup": Plane,
  "Extra Bedding": Bed,
  "Dietary Requirements": Utensils,
  "Honeymoon Arrangements": Heart,
  "Wheelchair Assistance": Accessibility,
};

const typeDepartments = {
  "Early Check-in": "Front Office",
  "Late Checkout": "Front Office",
  "Birthday Decoration": "Guest Relations",
  "Airport Pickup": "Transport",
  "Extra Bedding": "Housekeeping",
  "Dietary Requirements": "Food & Beverage",
  "Honeymoon Arrangements": "Guest Relations",
  "Wheelchair Assistance": "Housekeeping",
};

const initialRequests = [
  {
    id: "SR-1001",
    guest: "Rahul Sharma",
    phone: "9876543210",
    room: "101",
    type: "Early Check-in",
    description: "Guest requests early check-in at 10:00 AM.",
    requestDate: "2026-11-06",
    requestTime: "10:00",
    charges: 500,
    department: "Front Office",
    assignedStaff: "Priya",
    status: "Completed",
    createdAt: "2026-11-05T15:30:00",
    completedAt: "2026-11-06T09:45:00",
    notes: "Room prepared and guest checked in early.",
  },
  {
    id: "SR-1002",
    guest: "Ankit Verma",
    phone: "9876543211",
    room: "204",
    type: "Airport Pickup",
    description: "Pickup required from Delhi Airport, Terminal 3.",
    requestDate: "2026-11-07",
    requestTime: "08:30",
    charges: 1800,
    department: "Transport",
    assignedStaff: "Rohit",
    status: "Assigned",
    createdAt: "2026-11-06T08:00:00",
    completedAt: null,
    notes: "",
  },
  {
    id: "SR-1003",
    guest: "Priya Singh",
    phone: "9876543212",
    room: "305",
    type: "Birthday Decoration",
    description: "Birthday decoration with balloons and cake setup.",
    requestDate: "2026-11-08",
    requestTime: "18:00",
    charges: 2500,
    department: "Guest Relations",
    assignedStaff: "Neha",
    status: "In Progress",
    createdAt: "2026-11-06T09:00:00",
    completedAt: null,
    notes: "Decoration theme confirmed with guest.",
  },
  {
    id: "SR-1004",
    guest: "Mohit Agarwal",
    phone: "9876543213",
    room: "102",
    type: "Extra Bedding",
    description: "One additional mattress and pillow required.",
    requestDate: "2026-11-06",
    requestTime: "14:00",
    charges: 300,
    department: "Housekeeping",
    assignedStaff: "Amit",
    status: "New",
    createdAt: "2026-11-06T10:00:00",
    completedAt: null,
    notes: "",
  },
  {
    id: "SR-1005",
    guest: "Sneha Gupta",
    phone: "9876543214",
    room: "401",
    type: "Dietary Requirements",
    description: "Vegetarian meal preference. No onion and garlic.",
    requestDate: "2026-11-06",
    requestTime: "19:30",
    charges: 0,
    department: "Food & Beverage",
    assignedStaff: "Unassigned",
    status: "New",
    createdAt: "2026-11-06T10:15:00",
    completedAt: null,
    notes: "",
  },
  {
    id: "SR-1006",
    guest: "Vikram Singh",
    phone: "9876543215",
    room: "202",
    type: "Honeymoon Arrangements",
    description: "Room decoration with flowers and special dinner setup.",
    requestDate: "2026-11-09",
    requestTime: "20:00",
    charges: 4500,
    department: "Guest Relations",
    assignedStaff: "Suresh",
    status: "Assigned",
    createdAt: "2026-11-06T10:30:00",
    completedAt: null,
    notes: "Awaiting guest confirmation for decoration theme.",
  },
  {
    id: "SR-1007",
    guest: "Meera Joshi",
    phone: "9876543216",
    room: "105",
    type: "Wheelchair Assistance",
    description: "Wheelchair assistance required from reception to room.",
    requestDate: "2026-11-06",
    requestTime: "12:00",
    charges: 0,
    department: "Housekeeping",
    assignedStaff: "Priya",
    status: "Completed",
    createdAt: "2026-11-06T09:00:00",
    completedAt: "2026-11-06T11:50:00",
    notes: "Assistance provided successfully.",
  },
  {
    id: "SR-1008",
    guest: "Karan Mehta",
    phone: "9876543217",
    room: "302",
    type: "Late Checkout",
    description: "Guest requests checkout extension until 2:00 PM.",
    requestDate: "2026-11-07",
    requestTime: "14:00",
    charges: 700,
    department: "Front Office",
    assignedStaff: "Amit",
    status: "Cancelled",
    createdAt: "2026-11-06T08:45:00",
    completedAt: null,
    notes: "Guest cancelled the request.",
  },
];

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const statusStyles = {
  New: "bg-blue-50 text-blue-700 border-blue-200",
  Assigned: "bg-violet-50 text-violet-700 border-violet-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
};

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

const StatCard = ({ title, value, subtitle, icon: Icon, iconStyle }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h3 className="text-2xl font-semibold text-slate-900 mt-2">
          {value}
        </h3>
        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
      </div>

      <div className={`p-3 rounded-lg ${iconStyle}`}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const SpecialRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const emptyForm = {
    guest: "",
    phone: "",
    room: "",
    type: "Early Check-in",
    description: "",
    requestDate: "",
    requestTime: "",
    charges: 0,
    department: "Front Office",
    assignedStaff: "Unassigned",
    status: "New",
    notes: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const query = search.toLowerCase();

      const matchesSearch =
        request.id.toLowerCase().includes(query) ||
        request.guest.toLowerCase().includes(query) ||
        request.room.toLowerCase().includes(query) ||
        request.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesType =
        typeFilter === "All" || request.type === typeFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        request.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesDepartment
      );
    });
  }, [requests, search, statusFilter, typeFilter, departmentFilter]);

  const stats = {
    total: requests.length,
    pending: requests.filter((r) =>
      ["New", "Assigned"].includes(r.status)
    ).length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    revenue: requests
      .filter((r) => r.status !== "Cancelled")
      .reduce((sum, r) => sum + Number(r.charges || 0), 0),
  };

  const updateRequest = (id, updates) => {
    setRequests((previous) =>
      previous.map((request) =>
        request.id === id ? { ...request, ...updates } : request
      )
    );

    setSelectedRequest((previous) =>
      previous?.id === id ? { ...previous, ...updates } : previous
    );
  };

  const openAddModal = () => {
    setSelectedRequest(null);
    setFormData({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (request) => {
    setSelectedRequest(request);

    setFormData({
      guest: request.guest,
      phone: request.phone,
      room: request.room,
      type: request.type,
      description: request.description,
      requestDate: request.requestDate,
      requestTime: request.requestTime,
      charges: request.charges,
      department: request.department,
      assignedStaff: request.assignedStaff,
      status: request.status,
      notes: request.notes || "",
    });

    setShowModal(true);
  };

  const handleTypeChange = (type) => {
    setFormData((previous) => ({
      ...previous,
      type,
      department: typeDepartments[type] || "Guest Relations",
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.guest.trim() ||
      !formData.room.trim() ||
      !formData.description.trim() ||
      !formData.requestDate ||
      !formData.requestTime
    ) {
      return;
    }

    if (selectedRequest) {
      const updates = { ...formData };

      if (
        formData.status === "Completed" &&
        !selectedRequest.completedAt
      ) {
        updates.completedAt = new Date().toISOString();
      }

      if (formData.status !== "Completed") {
        updates.completedAt = null;
      }

      updateRequest(selectedRequest.id, updates);
    } else {
      const newRequest = {
        ...formData,
        id: `SR-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        completedAt:
          formData.status === "Completed" ? new Date().toISOString() : null,
      };

      setRequests((previous) => [newRequest, ...previous]);
    }

    setShowModal(false);
  };

  const handleStatusChange = (request, status) => {
    updateRequest(request.id, {
      status,
      completedAt:
        status === "Completed"
          ? request.completedAt || new Date().toISOString()
          : null,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
    setDepartmentFilter("All");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Guest Services</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Special Requests</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Special Requests
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage personalized guest services, charges, departments, and completion.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} />
          Add Special Request
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          subtitle="All special requests"
          icon={ClipboardList}
          iconStyle="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Pending"
          value={stats.pending}
          subtitle="New or awaiting assignment"
          icon={AlertCircle}
          iconStyle="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          subtitle="Currently being handled"
          icon={Clock}
          iconStyle="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="Successfully fulfilled"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Request Charges"
          value={formatCurrency(stats.revenue)}
          subtitle="Non-cancelled request charges"
          icon={IndianRupee}
          iconStyle="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Request Type Overview */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">
            Special Request Categories
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quick overview of the services available to guests.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
          {requestTypes.map((type) => {
            const Icon = requestIcons[type];
            const count = requests.filter((r) => r.type === type).length;

            return (
              <button
                key={type}
                onClick={() =>
                  setTypeFilter(typeFilter === type ? "All" : type)
                }
                className={`text-left p-3 rounded-xl border transition ${
                  typeFilter === type
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <Icon size={19} className="text-blue-600" />
                  <span className="text-sm font-semibold text-slate-800">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-4">
                  {type}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col xl:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, guest, room or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Request Types</option>
              {requestTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="px-3 py-2.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900">
              Special Request Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Track guest requests from registration to completion.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Request ID</th>
                <th className="text-left font-medium px-4 py-3">Guest / Room</th>
                <th className="text-left font-medium px-4 py-3">Request Type</th>
                <th className="text-left font-medium px-4 py-3">Requested For</th>
                <th className="text-left font-medium px-4 py-3">Charges</th>
                <th className="text-left font-medium px-4 py-3">Department</th>
                <th className="text-left font-medium px-4 py-3">Assigned Staff</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Completed At</th>
                <th className="text-left font-medium px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => {
                const Icon = requestIcons[request.type] || Sparkles;

                return (
                  <tr
                    key={request.id}
                    className="hover:bg-slate-50/70 transition"
                  >
                    <td className="px-4 py-4">
                      <span className="font-semibold text-blue-600">
                        {request.id}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-medium text-slate-800">
                        {request.guest}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <BedDouble size={13} />
                        Room {request.room}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Icon size={17} className="text-blue-600 shrink-0" />
                        <span>{request.type}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-slate-700">
                        {formatDate(request.requestDate)}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {request.requestTime}
                      </p>
                    </td>

                    <td className="px-4 py-4 font-medium text-slate-800 whitespace-nowrap">
                      {formatCurrency(request.charges)}
                    </td>

                    <td className="px-4 py-4 text-slate-600">
                      {request.department}
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={request.assignedStaff}
                        onChange={(e) =>
                          updateRequest(request.id, {
                            assignedStaff: e.target.value,
                            department: request.department,
                            status:
                              request.status === "New" &&
                              e.target.value !== "Unassigned"
                                ? "Assigned"
                                : request.status,
                          })
                        }
                        className="max-w-[130px] px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-blue-500"
                      >
                        <option value="Unassigned">Unassigned</option>
                        {staffMembers.map((staff) => (
                          <option key={staff} value={staff}>{staff}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-4">
                      <select
                        value={request.status}
                        onChange={(e) =>
                          handleStatusChange(request, e.target.value)
                        }
                        className="max-w-[145px] px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-blue-500"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>

                      <div className="mt-2">
                        <Badge className={`border ${statusStyles[request.status]}`}>
                          {request.status}
                        </Badge>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {formatDateTime(request.completedAt)}
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetails(true);
                          }}
                          title="View details"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          onClick={() => openEditModal(request)}
                          title="Edit request"
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                        >
                          <Pencil size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center">
                    <ClipboardList
                      size={34}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="font-medium text-slate-700">
                      No special requests found
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Try changing the filters or add a new request.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 text-sm text-blue-600 font-medium"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedRequest ? "Edit Special Request" : "Add Special Request"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter guest requirements and service details.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-6">
              {/* Guest Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <UserRound size={17} className="text-blue-600" />
                  Guest Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Guest Name" required>
                    <input
                      required
                      value={formData.guest}
                      onChange={(e) =>
                        setFormData({ ...formData, guest: e.target.value })
                      }
                      placeholder="Enter guest name"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Room Number" required>
                    <input
                      required
                      value={formData.room}
                      onChange={(e) =>
                        setFormData({ ...formData, room: e.target.value })
                      }
                      placeholder="e.g. 101"
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Phone Number">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Guest contact number"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Request Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles size={17} className="text-blue-600" />
                  Request Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Request Type" required>
                    <select
                      value={formData.type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                      className={inputClass}
                    >
                      {requestTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Request Date" required>
                    <input
                      type="date"
                      required
                      value={formData.requestDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestDate: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Request Time" required>
                    <input
                      type="time"
                      required
                      value={formData.requestTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requestTime: e.target.value,
                        })
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Charges (₹)">
                    <input
                      type="number"
                      min="0"
                      value={formData.charges}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          charges: e.target.value,
                        })
                      }
                      placeholder="Enter charges"
                      className={inputClass}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Request Description" required>
                      <textarea
                        required
                        rows={4}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the guest's special requirements..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Department and Assignment */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Building2 size={17} className="text-blue-600" />
                  Department & Assignment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Assigned Department" required>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          department: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {departments.map((department) => (
                        <option key={department} value={department}>
                          {department}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Assigned Staff">
                    <select
                      value={formData.assignedStaff}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assignedStaff: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      <option value="Unassigned">Unassigned</option>
                      {staffMembers.map((staff) => (
                        <option key={staff} value={staff}>{staff}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Request Status">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Completion / Internal Notes">
                      <textarea
                        rows={3}
                        value={formData.notes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            notes: e.target.value,
                          })
                        }
                        placeholder="Add instructions, work updates or completion notes..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  {selectedRequest ? "Save Changes" : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <p className="text-xs text-blue-600 font-semibold">
                  {selectedRequest.id}
                </p>
                <h2 className="text-lg font-semibold text-slate-900 mt-1">
                  Request Details
                </h2>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Guest Information</p>
                  <p className="font-semibold text-slate-900">
                    {selectedRequest.guest}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Room {selectedRequest.room}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {selectedRequest.phone || "No phone number"}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-500 mb-2">Request Information</p>
                  <p className="font-semibold text-slate-900">
                    {selectedRequest.type}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {formatDate(selectedRequest.requestDate)} at {selectedRequest.requestTime}
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {formatCurrency(selectedRequest.charges)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Request Description
                </p>
                <p className="text-sm text-slate-600 leading-6 border border-slate-200 rounded-lg p-3">
                  {selectedRequest.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Department</p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedRequest.department}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Assigned Staff</p>
                  <p className="text-sm font-medium text-slate-800">
                    {selectedRequest.assignedStaff}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Created At</p>
                  <p className="text-sm text-slate-700">
                    {formatDateTime(selectedRequest.createdAt)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Completed At</p>
                  <p className="text-sm text-slate-700">
                    {formatDateTime(selectedRequest.completedAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Current Status
                </p>
                <Badge className={`border ${statusStyles[selectedRequest.status]}`}>
                  {selectedRequest.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  Internal / Completion Notes
                </p>
                <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                  {selectedRequest.notes || "No notes added."}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-slate-200">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
              >
                Close
              </button>

              <button
                onClick={() => {
                  const current = requests.find(
                    (r) => r.id === selectedRequest.id
                  );
                  setShowDetails(false);
                  openEditModal(current);
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
              >
                Edit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpecialRequests;
