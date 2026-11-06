
import { useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  X,
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquareWarning,
  UserRound,
  BedDouble,
  Paperclip,
  Upload,
  ArrowUpRight,
  FileText,
  Eye,
  Pencil,
  Phone,
  Star,
  ShieldAlert,
  CalendarDays,
} from "lucide-react";

const staffMembers = [
  "Priya",
  "Amit",
  "Neha",
  "Rohit",
  "Suresh",
];

const categories = [
  "Room Cleanliness",
  "Staff Behaviour",
  "Food & Beverage",
  "Room Maintenance",
  "Billing & Payment",
  "Noise Disturbance",
  "Reservation",
  "Other",
];

const severityOptions = ["Low", "Medium", "High", "Critical"];

const statusOptions = ["Open", "In Progress", "Resolved", "Closed"];

const initialComplaints = [
  {
    id: "CMP-1001",
    guest: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    room: "101",
    category: "Room Cleanliness",
    description: "Bathroom was not cleaned properly. The floor and washbasin need attention.",
    severity: "High",
    assignedStaff: "Priya",
    status: "Open",
    resolutionNotes: "",
    createdAt: "2026-11-06T08:30:00",
    firstResponseAt: null,
    resolvedAt: null,
    escalated: false,
    escalationNotes: "",
    attachments: [],
    feedback: null,
  },
  {
    id: "CMP-1002",
    guest: "Ankit Verma",
    phone: "9876543211",
    email: "ankit@example.com",
    room: "204",
    category: "Room Maintenance",
    description: "Air conditioner is making unusual noise and cooling is insufficient.",
    severity: "Critical",
    assignedStaff: "Amit",
    status: "In Progress",
    resolutionNotes: "Maintenance team has inspected the AC. Replacement part is being arranged.",
    createdAt: "2026-11-06T07:45:00",
    firstResponseAt: "2026-11-06T08:00:00",
    resolvedAt: null,
    escalated: true,
    escalationNotes: "Escalated to maintenance supervisor.",
    attachments: [],
    feedback: null,
  },
  {
    id: "CMP-1003",
    guest: "Priya Singh",
    phone: "9876543212",
    email: "priya@example.com",
    room: "305",
    category: "Food & Beverage",
    description: "The breakfast order was delivered late.",
    severity: "Medium",
    assignedStaff: "Neha",
    status: "Resolved",
    resolutionNotes: "Apologized to the guest and provided complimentary breakfast.",
    createdAt: "2026-11-05T09:00:00",
    firstResponseAt: "2026-11-05T09:20:00",
    resolvedAt: "2026-11-05T10:00:00",
    escalated: false,
    escalationNotes: "",
    attachments: [],
    feedback: {
      rating: 4,
      comment: "Issue resolved. Thank you for the quick response.",
      submittedAt: "2026-11-05T10:30:00",
    },
  },
  {
    id: "CMP-1004",
    guest: "Mohit Agarwal",
    phone: "9876543213",
    email: "mohit@example.com",
    room: "102",
    category: "Billing & Payment",
    description: "Guest noticed an incorrect charge on the room bill.",
    severity: "High",
    assignedStaff: "Rohit",
    status: "Closed",
    resolutionNotes: "Bill checked and incorrect charge removed. Revised invoice shared.",
    createdAt: "2026-11-04T15:00:00",
    firstResponseAt: "2026-11-04T15:15:00",
    resolvedAt: "2026-11-04T16:00:00",
    escalated: false,
    escalationNotes: "",
    attachments: [],
    feedback: {
      rating: 5,
      comment: "Excellent support.",
      submittedAt: "2026-11-04T16:30:00",
    },
  },
  {
    id: "CMP-1005",
    guest: "Sneha Gupta",
    phone: "9876543214",
    email: "sneha@example.com",
    room: "401",
    category: "Noise Disturbance",
    description: "Loud noise coming from the neighbouring room late at night.",
    severity: "Medium",
    assignedStaff: "Unassigned",
    status: "Open",
    resolutionNotes: "",
    createdAt: "2026-11-06T09:30:00",
    firstResponseAt: null,
    resolvedAt: null,
    escalated: false,
    escalationNotes: "",
    attachments: [],
    feedback: null,
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

const getResponseTime = (createdAt, firstResponseAt) => {
  if (!firstResponseAt) return "Not responded";

  const minutes = Math.max(
    0,
    Math.round(
      (new Date(firstResponseAt) - new Date(createdAt)) / 60000
    )
  );

  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours} hr ${remainingMinutes} min`;
};

const severityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-orange-50 text-orange-700",
  Critical: "bg-red-50 text-red-700",
};

const statusStyles = {
  Open: "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Closed: "bg-slate-100 text-slate-600 border-slate-200",
};

const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${className}`}
  >
    {children}
  </span>
);

const StatCard = ({ title, value, subtitle, icon: Icon, iconStyle }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-4">
    <div className="flex justify-between items-start">
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

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";

const GuestComplaints = () => {
  const fileInputRef = useRef(null);

  const [complaints, setComplaints] = useState(initialComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const emptyForm = {
    guest: "",
    phone: "",
    email: "",
    room: "",
    category: "Room Cleanliness",
    description: "",
    severity: "Medium",
    assignedStaff: "Unassigned",
    status: "Open",
    resolutionNotes: "",
    escalated: false,
    escalationNotes: "",
    attachments: [],
    feedback: null,
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const query = search.toLowerCase();

      const matchesSearch =
        complaint.id.toLowerCase().includes(query) ||
        complaint.guest.toLowerCase().includes(query) ||
        complaint.room.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" || complaint.status === statusFilter;

      const matchesSeverity =
        severityFilter === "All" ||
        complaint.severity === severityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSeverity &&
        matchesCategory
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    severityFilter,
    categoryFilter,
  ]);

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "Open").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter(
      (c) => c.status === "Resolved" || c.status === "Closed"
    ).length,
    escalated: complaints.filter(
      (c) => c.escalated && c.status !== "Resolved" && c.status !== "Closed"
    ).length,
  };

  const updateComplaint = (id, updates) => {
    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id === id
          ? { ...complaint, ...updates }
          : complaint
      )
    );

    setSelectedComplaint((previous) =>
      previous?.id === id ? { ...previous, ...updates } : previous
    );
  };

  const openAddModal = () => {
    setSelectedComplaint(null);
    setFormData({ ...emptyForm });
    setShowModal(true);
  };

  const openEditModal = (complaint) => {
    setSelectedComplaint(complaint);
    setFormData({
      guest: complaint.guest,
      phone: complaint.phone,
      email: complaint.email,
      room: complaint.room,
      category: complaint.category,
      description: complaint.description,
      severity: complaint.severity,
      assignedStaff: complaint.assignedStaff,
      status: complaint.status,
      resolutionNotes: complaint.resolutionNotes || "",
      escalated: complaint.escalated,
      escalationNotes: complaint.escalationNotes || "",
      attachments: complaint.attachments || [],
      feedback: complaint.feedback,
    });
    setShowModal(true);
  };

  const openDetails = (complaint) => {
    setSelectedComplaint(complaint);
    setShowDetails(true);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files || []);

    const newFiles = files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    setFormData((previous) => ({
      ...previous,
      attachments: [...previous.attachments, ...newFiles],
    }));

    event.target.value = "";
  };

  const removeAttachment = (index) => {
    setFormData((previous) => ({
      ...previous,
      attachments: previous.attachments.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.guest.trim() ||
      !formData.room.trim() ||
      !formData.description.trim()
    ) {
      return;
    }

    if (selectedComplaint) {
      const oldComplaint = selectedComplaint;

      let firstResponseAt = oldComplaint.firstResponseAt;
      let resolvedAt = oldComplaint.resolvedAt;

      if (
        !firstResponseAt &&
        ["In Progress", "Resolved", "Closed"].includes(formData.status)
      ) {
        firstResponseAt = new Date().toISOString();
      }

      if (
        ["Resolved", "Closed"].includes(formData.status) &&
        !resolvedAt
      ) {
        resolvedAt = new Date().toISOString();
      }

      if (!["Resolved", "Closed"].includes(formData.status)) {
        resolvedAt = null;
      }

      updateComplaint(oldComplaint.id, {
        ...formData,
        firstResponseAt,
        resolvedAt,
      });
    } else {
      const newComplaint = {
        ...formData,
        id: `CMP-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString(),
        firstResponseAt: null,
        resolvedAt: null,
      };

      setComplaints((previous) => [newComplaint, ...previous]);
    }

    setShowModal(false);
  };

  const handleStatusChange = (complaint, status) => {
    const updates = { status };

    if (
      !complaint.firstResponseAt &&
      ["In Progress", "Resolved", "Closed"].includes(status)
    ) {
      updates.firstResponseAt = new Date().toISOString();
    }

    if (["Resolved", "Closed"].includes(status)) {
      updates.resolvedAt = complaint.resolvedAt || new Date().toISOString();
    } else {
      updates.resolvedAt = null;
    }

    updateComplaint(complaint.id, updates);
  };

  const handleFeedback = (rating, comment) => {
    if (!selectedComplaint) return;

    const feedback = {
      rating,
      comment,
      submittedAt: new Date().toISOString(),
    };

    updateComplaint(selectedComplaint.id, { feedback });
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSeverityFilter("All");
    setCategoryFilter("All");
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>Guest Services</span>
            <span>/</span>
            <span className="text-blue-600 font-medium">Complaints</span>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            Guest Complaints
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Register complaints, track resolutions, and collect guest feedback.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
        >
          <Plus size={18} />
          Register Complaint
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard
          title="Total Complaints"
          value={stats.total}
          subtitle="All registered complaints"
          icon={MessageSquareWarning}
          iconStyle="bg-blue-50 text-blue-600"
        />

        <StatCard
          title="Open"
          value={stats.open}
          subtitle="Awaiting action"
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
          title="Resolved"
          value={stats.resolved}
          subtitle="Resolved or closed"
          icon={CheckCircle2}
          iconStyle="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Escalated"
          value={stats.escalated}
          subtitle="Require management attention"
          icon={ShieldAlert}
          iconStyle="bg-red-50 text-red-600"
        />
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
              placeholder="Search complaint ID, guest, room or description..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Severity</option>
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>{severity}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 border border-slate-200 rounded-lg bg-white text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
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

      {/* Complaint Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-semibold text-slate-900">
              Complaint Management
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Review complaints and monitor their resolution.
            </p>
          </div>

          <span className="text-sm text-slate-500">
            Showing {filteredComplaints.length} of {complaints.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px] text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="text-left font-medium px-4 py-3">Complaint ID</th>
                <th className="text-left font-medium px-4 py-3">Guest / Room</th>
                <th className="text-left font-medium px-4 py-3">Category</th>
                <th className="text-left font-medium px-4 py-3">Severity</th>
                <th className="text-left font-medium px-4 py-3">Assigned Staff</th>
                <th className="text-left font-medium px-4 py-3">Response Time</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3">Escalation</th>
                <th className="text-left font-medium px-4 py-3">Created</th>
                <th className="text-left font-medium px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-4">
                    <span className="font-semibold text-blue-600">
                      {complaint.id}
                    </span>
                    {complaint.attachments.length > 0 && (
                      <p className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                        <Paperclip size={12} />
                        {complaint.attachments.length} attachment(s)
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <p className="font-medium text-slate-800">
                      {complaint.guest}
                    </p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <BedDouble size={13} />
                      Room {complaint.room}
                    </p>
                  </td>

                  <td className="px-4 py-4 text-slate-700">
                    {complaint.category}
                  </td>

                  <td className="px-4 py-4">
                    <Badge className={severityStyles[complaint.severity]}>
                      {complaint.severity}
                    </Badge>
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={complaint.assignedStaff}
                      onChange={(e) =>
                        updateComplaint(complaint.id, {
                          assignedStaff: e.target.value,
                          ...(!complaint.firstResponseAt
                            ? { firstResponseAt: new Date().toISOString() }
                            : {}),
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

                  <td className="px-4 py-4 text-xs text-slate-600 whitespace-nowrap">
                    {getResponseTime(
                      complaint.createdAt,
                      complaint.firstResponseAt
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <select
                      value={complaint.status}
                      onChange={(e) =>
                        handleStatusChange(complaint, e.target.value)
                      }
                      className="max-w-[140px] px-2.5 py-2 border border-slate-200 rounded-lg bg-white text-xs outline-none focus:border-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <div className="mt-2">
                      <Badge className={`border ${statusStyles[complaint.status]}`}>
                        {complaint.status}
                      </Badge>
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {complaint.escalated ? (
                      <Badge className="bg-red-50 text-red-700">
                        <ArrowUpRight size={12} className="mr-1" />
                        Escalated
                      </Badge>
                    ) : (
                      <span className="text-xs text-slate-400">No</span>
                    )}
                  </td>

                  <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateTime(complaint.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openDetails(complaint)}
                        title="View complaint"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye size={17} />
                      </button>
                      <button
                        onClick={() => openEditModal(complaint)}
                        title="Edit complaint"
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredComplaints.length === 0 && (
                <tr>
                  <td colSpan="10" className="px-4 py-12 text-center">
                    <MessageSquareWarning
                      size={34}
                      className="mx-auto text-slate-300 mb-3"
                    />
                    <p className="font-medium text-slate-700">
                      No complaints found
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Try different filters or register a new complaint.
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

      {/* Register / Edit Complaint Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedComplaint ? "Edit Complaint" : "Register Complaint"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Enter guest details and complaint information.
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
              {/* Guest Information */}
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

                  <Field label="Email Address">
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="guest@example.com"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Complaint Details */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <MessageSquareWarning size={17} className="text-blue-600" />
                  Complaint Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Complaint Category" required>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className={inputClass}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Severity" required>
                    <select
                      value={formData.severity}
                      onChange={(e) =>
                        setFormData({ ...formData, severity: e.target.value })
                      }
                      className={inputClass}
                    >
                      {severityOptions.map((severity) => (
                        <option key={severity} value={severity}>{severity}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Complaint Description" required>
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
                        placeholder="Describe the complaint in detail..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>

                  <div className="sm:col-span-2">
                    <Field label="Attachments">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-5 text-center cursor-pointer transition"
                      >
                        <Upload
                          size={22}
                          className="mx-auto text-slate-400 mb-2"
                        />
                        <p className="text-sm font-medium text-slate-700">
                          Click to upload attachments
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Images, PDF or other supporting files
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*,.pdf,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>

                      {formData.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          {formData.attachments.map((file, index) => (
                            <div
                              key={`${file.name}-${index}`}
                              className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <FileText
                                  size={17}
                                  className="text-blue-600 shrink-0"
                                />
                                <span className="text-sm text-slate-700 truncate">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Assignment and Resolution */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <UserRound size={17} className="text-blue-600" />
                  Assignment & Resolution
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <Field label="Complaint Status">
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className={inputClass}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </Field>

                  <div className="sm:col-span-2">
                    <Field label="Resolution Notes">
                      <textarea
                        rows={3}
                        value={formData.resolutionNotes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            resolutionNotes: e.target.value,
                          })
                        }
                        placeholder="Enter action taken or resolution details..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100" />

              {/* Escalation */}
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldAlert size={17} className="text-red-500" />
                  Escalation
                </h3>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.escalated}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        escalated: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm text-slate-700">
                    Escalate this complaint to management
                  </span>
                </label>

                {formData.escalated && (
                  <div className="mt-4">
                    <Field label="Escalation Notes">
                      <textarea
                        rows={3}
                        value={formData.escalationNotes}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            escalationNotes: e.target.value,
                          })
                        }
                        placeholder="Reason for escalation and person notified..."
                        className={`${inputClass} resize-none`}
                      />
                    </Field>
                  </div>
                )}
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
                  {selectedComplaint ? "Save Changes" : "Register Complaint"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Details Modal */}
      {showDetails && selectedComplaint && (
        <ComplaintDetails
          complaint={
            complaints.find((c) => c.id === selectedComplaint.id) ||
            selectedComplaint
          }
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            const current = complaints.find(
              (c) => c.id === selectedComplaint.id
            );
            setShowDetails(false);
            openEditModal(current);
          }}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  );
};

const ComplaintDetails = ({
  complaint,
  onClose,
  onEdit,
  onFeedback,
}) => {
  const [rating, setRating] = useState(complaint.feedback?.rating || 0);
  const [comment, setComment] = useState(
    complaint.feedback?.comment || ""
  );

  const isResolved = ["Resolved", "Closed"].includes(complaint.status);

  const submitFeedback = () => {
    if (!rating) return;
    onFeedback(rating, comment);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
          <div>
            <p className="text-xs text-blue-600 font-semibold">
              {complaint.id}
            </p>
            <h2 className="text-lg font-semibold text-slate-900 mt-1">
              Complaint Details
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Guest Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Guest</p>
              <p className="font-semibold text-slate-900">
                {complaint.guest}
              </p>
              <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <Phone size={13} />
                {complaint.phone || "No phone"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {complaint.email || "No email"}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs text-slate-500 mb-2">Room & Category</p>
              <p className="font-semibold text-slate-900">
                Room {complaint.room}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                {complaint.category}
              </p>
              <div className="mt-2">
                <Badge className={severityStyles[complaint.severity]}>
                  {complaint.severity} Severity
                </Badge>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Complaint Description
            </h3>
            <p className="text-sm text-slate-600 leading-6 bg-white border border-slate-200 rounded-lg p-3">
              {complaint.description}
            </p>
          </div>

          {/* Attachments */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Attachments
            </h3>

            {complaint.attachments?.length ? (
              <div className="space-y-2">
                {complaint.attachments.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg text-sm text-slate-700"
                  >
                    <Paperclip size={16} className="text-blue-600" />
                    {file.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400">No attachments uploaded.</p>
            )}
          </div>

          {/* Assignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Assigned Staff</p>
              <p className="text-sm font-medium text-slate-800">
                {complaint.assignedStaff}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">Current Status</p>
              <Badge className={`border ${statusStyles[complaint.status]}`}>
                {complaint.status}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">Created At</p>
              <p className="text-sm text-slate-700">
                {formatDateTime(complaint.createdAt)}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">First Response Time</p>
              <p className="text-sm text-slate-700">
                {getResponseTime(
                  complaint.createdAt,
                  complaint.firstResponseAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">Resolved At</p>
              <p className="text-sm text-slate-700">
                {formatDateTime(complaint.resolvedAt)}
              </p>
            </div>
          </div>

          {/* Resolution */}
          <div>
            <h3 className="text-sm font-semibold text-slate-800 mb-2">
              Resolution Notes
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
              {complaint.resolutionNotes || "No resolution notes added yet."}
            </p>
          </div>

          {/* Escalation */}
          <div className={`rounded-xl p-4 border ${
            complaint.escalated
              ? "bg-red-50 border-red-200"
              : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2">
              <ShieldAlert
                size={17}
                className={complaint.escalated ? "text-red-600" : "text-slate-400"}
              />
              <h3 className="text-sm font-semibold text-slate-800">
                {complaint.escalated ? "Escalated to Management" : "Not Escalated"}
              </h3>
            </div>

            {complaint.escalated && (
              <p className="text-sm text-slate-600 mt-2">
                {complaint.escalationNotes || "No escalation notes provided."}
              </p>
            )}
          </div>

          {/* Guest Feedback */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Guest Feedback
            </h3>

            {!isResolved ? (
              <p className="text-sm text-slate-500 mt-2">
                Feedback can be collected after the complaint is resolved or closed.
              </p>
            ) : (
              <>
                {complaint.feedback ? (
                  <div className="mt-3">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={19}
                          fill={star <= complaint.feedback.rating ? "#F59E0B" : "none"}
                          className={
                            star <= complaint.feedback.rating
                              ? "text-amber-500"
                              : "text-slate-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-slate-700 mt-2">
                      {complaint.feedback.comment || "No feedback comment."}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Submitted {formatDateTime(complaint.feedback.submittedAt)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-3 space-y-3">
                    <p className="text-sm text-slate-500">
                      Record the guest's satisfaction rating.
                    </p>

                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1"
                        >
                          <Star
                            size={25}
                            fill={star <= rating ? "#F59E0B" : "none"}
                            className={
                              star <= rating
                                ? "text-amber-500"
                                : "text-slate-300"
                            }
                          />
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter guest feedback..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none resize-none focus:border-blue-500"
                    />

                    <button
                      onClick={submitFeedback}
                      disabled={!rating}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"
                    >
                      Save Feedback
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-medium"
          >
            Close
          </button>

          <button
            onClick={onEdit}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Edit Complaint
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestComplaints;
