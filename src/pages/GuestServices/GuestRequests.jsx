
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  UserRound,
  BedDouble,
  CalendarDays,
  Filter,
  X,
  ChevronDown,
  Phone,
  MessageSquare,
  MoreVertical,
} from "lucide-react";

const initialRequests = [
  {
    id: "REQ-1001",
    guest: "Rahul Sharma",
    room: "101",
    category: "Housekeeping",
    description: "Please arrange two extra towels in the room.",
    priority: "Normal",
    assignedStaff: "Priya",
    status: "New",
    createdAt: "2026-11-06T08:30:00",
    completedAt: null,
  },
  {
    id: "REQ-1002",
    guest: "Ankit Verma",
    room: "204",
    category: "Room Service",
    description: "Need two water bottles and drinking glasses.",
    priority: "High",
    assignedStaff: "Amit",
    status: "Assigned",
    createdAt: "2026-11-06T09:00:00",
    completedAt: null,
  },
  {
    id: "REQ-1003",
    guest: "Priya Singh",
    room: "305",
    category: "Housekeeping",
    description: "Request for complete room cleaning.",
    priority: "Normal",
    assignedStaff: "Neha",
    status: "In Progress",
    createdAt: "2026-11-06T09:15:00",
    completedAt: null,
  },
  {
    id: "REQ-1004",
    guest: "Mohit Agarwal",
    room: "102",
    category: "Luggage Assistance",
    description: "Help required with luggage during checkout.",
    priority: "Urgent",
    assignedStaff: "Rohit",
    status: "Completed",
    createdAt: "2026-11-06T07:45:00",
    completedAt: "2026-11-06T08:10:00",
  },
  {
    id: "REQ-1005",
    guest: "Sneha Gupta",
    room: "401",
    category: "Maintenance",
    description: "Air conditioner is not cooling properly.",
    priority: "High",
    assignedStaff: "Unassigned",
    status: "New",
    createdAt: "2026-11-06T10:00:00",
    completedAt: null,
  },
  {
    id: "REQ-1006",
    guest: "Vikram Singh",
    room: "202",
    category: "Other",
    description: "Please provide an additional blanket.",
    priority: "Low",
    assignedStaff: "Priya",
    status: "Cancelled",
    createdAt: "2026-11-05T19:30:00",
    completedAt: null,
  },
];

const staffMembers = ["Priya", "Amit", "Neha", "Rohit", "Suresh"];

const categories = [
  "Housekeeping",
  "Room Service",
  "Luggage Assistance",
  "Maintenance",
  "Concierge",
  "Other",
];

const statusOptions = [
  "New",
  "Assigned",
  "In Progress",
  "Completed",
  "Cancelled",
];

const priorityOptions = ["Low", "Normal", "High", "Urgent"];

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

const getStatusStyle = (status) => {
  const styles = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Assigned: "bg-violet-50 text-violet-700 border-violet-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return styles[status] || styles.New;
};

const getPriorityStyle = (priority) => {
  const styles = {
    Low: "bg-slate-100 text-slate-600",
    Normal: "bg-blue-50 text-blue-700",
    High: "bg-orange-50 text-orange-700",
    Urgent: "bg-red-50 text-red-700",
  };

  return styles[priority] || styles.Normal;
};

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

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${getStatusStyle(
      status
    )}`}
  >
    {status}
  </span>
);

const PriorityBadge = ({ priority }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getPriorityStyle(
      priority
    )}`}
  >
    {priority}
  </span>
);

const GuestRequests = () => {
  const [requests, setRequests] = useState(initialRequests);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [formData, setFormData] = useState({
    guest: "",
    room: "",
    category: "Housekeeping",
    description: "",
    priority: "Normal",
    assignedStaff: "Unassigned",
  });

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(search.toLowerCase()) ||
        request.guest.toLowerCase().includes(search.toLowerCase()) ||
        request.room.toLowerCase().includes(search.toLowerCase()) ||
        request.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || request.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || request.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "All" || request.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority
      );
    });
  }, [requests, search, statusFilter, categoryFilter, priorityFilter]);

  const stats = {
    total: requests.length,
    new: requests.filter((r) => r.status === "New").length,
    inProgress: requests.filter((r) => r.status === "In Progress").length,
    completed: requests.filter((r) => r.status === "Completed").length,
    urgent: requests.filter(
      (r) => r.priority === "Urgent" && r.status !== "Completed" && r.status !== "Cancelled"
    ).length,
  };

  const updateRequest = (id, field, value) => {
    setRequests((previous) =>
      previous.map((request) => {
        if (request.id !== id) return request;

        const updated = { ...request, [field]: value };

        if (field === "status" && value === "Completed") {
          updated.completedAt = new Date().toISOString();
        }

        if (field === "status" && value !== "Completed") {
          updated.completedAt = null;
        }

        return updated;
      })
    );
  };

  const openAddModal = () => {
    setSelectedRequest(null);
    setFormData({
      guest: "",
      room: "",
      category: "Housekeeping",
      description: "",
      priority: "Normal",
      assignedStaff: "Unassigned",
    });
    setShowModal(true);
  };

  const openEditModal = (request) => {
    setSelectedRequest(request);
    setFormData({
      guest: request.guest,
      room: request.room,
      category: request.category,
      description: request.description,
      priority: request.priority,
      assignedStaff: request.assignedStaff,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.guest.trim() ||
      !formData.room.trim() ||
      !formData.description.trim()
    ) {
      return;
    }

    if (selectedRequest) {
      setRequests((previous) =>
        previous.map((request) =>
          request.id === selectedRequest.id
            ? { ...request, ...formData }
            : request
        )
      );
    } else {
      const newRequest = {
        ...formData,
        id: `REQ-${Date.now().toString().slice(-6)}`,
        status: "New",
        createdAt: new Date().toISOString(),
        completedAt: null,
      };

      setRequests((previous) => [newRequest, ...previous]);
    }

    setShowModal(false);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Guest Services</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Guest Requests</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Guest Requests
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage guest needs, assign staff, and track request completion.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} />
          Add Request
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Requests"
          value={stats.total}
          subtitle="All recorded requests"
          icon={ClipboardList}
          iconStyle="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="New Requests"
          value={stats.new}
          subtitle="Waiting for assignment"
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
          subtitle="Successfully completed"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Urgent Requests"
          value={stats.urgent}
          subtitle="Require priority attention"
          icon={AlertCircle}
          iconStyle="bg-red-50 text-red-600"
        />
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, guest, room or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
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
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority} Priority
                </option>
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

      {/* Request Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 border-b border-slate-200">
          <div>
            <h2 className="font-semibold text-slate-900">
              Request Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              View and update guest service requests.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            Showing {filteredRequests.length} of {requests.length} requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Request</th>
                <th className="text-left font-medium px-4 py-3">Guest / Room</th>
                <th className="text-left font-medium px-4 py-3">Category</th>
                <th className="text-left font-medium px-4 py-3">Description</th>
                <th className="text-left font-medium px-4 py-3">Priority</th>
                <th className="text-left font-medium px-4 py-3">Assigned Staff</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Created</th>
                <th className="text-left font-medium px-4 py-3">Completed</th>
                <th className="text-left font-medium px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((request) => (
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

                  <td className="px-4 py-4 text-slate-700">
                    {request.category}
                  </td>

                  <td className="px-4 py-4 max-w-[220px]">
                    <p className="text-slate-600 line-clamp-2">
                      {request.description}
                    </p>
                  </td>

                  <td className="px-4 py-4">
                    <PriorityBadge priority={request.priority} />
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={request.assignedStaff}
                      onChange={(e) =>
                        updateRequest(
                          request.id,
                          "assignedStaff",
                          e.target.value
                        )
                      }
                      className="max-w-[130px] px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-blue-500"
                    >
                      <option value="Unassigned">Unassigned</option>
                      {staffMembers.map((staff) => (
                        <option key={staff} value={staff}>
                          {staff}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={request.status}
                      onChange={(e) =>
                        updateRequest(request.id, "status", e.target.value)
                      }
                      className="max-w-[145px] px-2 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <StatusBadge status={request.status} />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(request.createdAt)}
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(request.completedAt)}
                  </td>

                  <td className="px-4 py-4">
                    <button
                      onClick={() => openEditModal(request)}
                      className="px-3 py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      View / Edit
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center">
                    <ClipboardList
                      size={32}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="font-medium text-slate-700">
                      No requests found
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Try changing your filters or add a new request.
                    </p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
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

      {/* Add / Edit Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedRequest ? "Edit Guest Request" : "Add Guest Request"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter guest details and request information.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.guest}
                    onChange={(e) =>
                      setFormData({ ...formData, guest: e.target.value })
                    }
                    placeholder="Enter guest name"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                    placeholder="e.g. 101"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Request Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Priority *
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  >
                    {priorityOptions.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Assign Staff
                  </label>
                  <select
                    value={formData.assignedStaff}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assignedStaff: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white outline-none focus:border-blue-500"
                  >
                    <option value="Unassigned">Unassigned</option>
                    {staffMembers.map((staff) => (
                      <option key={staff} value={staff}>
                        {staff}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Request Description *
                  </label>
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
                    placeholder="Describe the guest's request..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
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
    </div>
  );
};

export default GuestRequests;
