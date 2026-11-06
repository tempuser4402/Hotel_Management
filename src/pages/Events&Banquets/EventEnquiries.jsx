import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Phone,
  Mail,
  CalendarDays,
  Users,
  IndianRupee,
  MapPin,
  ClipboardList,
  CheckCircle2,
  Clock,
  FileText,
  UserRound,
  MessageSquare,
  ArrowRight,
  Filter,
} from "lucide-react";

const initialEnquiries = [
  {
    id: "ENQ-1001",
    customer: "Amit Sharma",
    phone: "9876543210",
    email: "amit@example.com",
    eventType: "Wedding",
    preferredDate: "2026-12-15",
    alternateDate: "2026-12-16",
    venue: "Banquet Hall",
    guests: 250,
    budget: 250000,
    source: "Phone",
    status: "Follow-up",
    priority: "High",
    assignedTo: "Rahul",
    followUpDate: "2026-11-08",
    followUpTime: "11:00",
    siteVisitDate: "2026-11-10",
    siteVisitStatus: "Scheduled",
    quotationAmount: 225000,
    quotationStatus: "Sent",
    notes: "Customer wants wedding reception arrangements with vegetarian catering.",
    createdAt: "2026-11-02",
  },
  {
    id: "ENQ-1002",
    customer: "Neha Verma",
    phone: "9876501234",
    email: "neha@example.com",
    eventType: "Birthday",
    preferredDate: "2026-11-25",
    alternateDate: "",
    venue: "Restaurant / Party Area",
    guests: 80,
    budget: 80000,
    source: "Walk-in",
    status: "New",
    priority: "Medium",
    assignedTo: "Priya",
    followUpDate: "2026-11-07",
    followUpTime: "16:00",
    siteVisitDate: "",
    siteVisitStatus: "Not Scheduled",
    quotationAmount: 0,
    quotationStatus: "Not Prepared",
    notes: "Birthday party for a family member. Decoration options required.",
    createdAt: "2026-11-05",
  },
  {
    id: "ENQ-1003",
    customer: "ABC Technologies",
    phone: "9811112233",
    email: "admin@abctech.com",
    eventType: "Corporate",
    preferredDate: "2026-12-05",
    alternateDate: "",
    venue: "Conference Hall",
    guests: 60,
    budget: 60000,
    source: "Website",
    status: "Quotation Sent",
    priority: "High",
    assignedTo: "Rahul",
    followUpDate: "2026-11-09",
    followUpTime: "12:00",
    siteVisitDate: "2026-11-08",
    siteVisitStatus: "Scheduled",
    quotationAmount: 48000,
    quotationStatus: "Sent",
    notes: "Annual corporate meeting. Projector and vegetarian lunch required.",
    createdAt: "2026-11-04",
  },
  {
    id: "ENQ-1004",
    customer: "Rohit Gupta",
    phone: "9898989898",
    email: "rohit@example.com",
    eventType: "Engagement",
    preferredDate: "2026-12-20",
    alternateDate: "2026-12-22",
    venue: "Banquet Hall",
    guests: 150,
    budget: 180000,
    source: "Referral",
    status: "Interested",
    priority: "Medium",
    assignedTo: "Priya",
    followUpDate: "2026-11-12",
    followUpTime: "10:30",
    siteVisitDate: "",
    siteVisitStatus: "Not Scheduled",
    quotationAmount: 165000,
    quotationStatus: "Draft",
    notes: "Interested in Gold package and stage decoration.",
    createdAt: "2026-11-03",
  },
];

const emptyEnquiry = {
  customer: "",
  phone: "",
  email: "",
  eventType: "Wedding",
  preferredDate: "",
  alternateDate: "",
  venue: "",
  guests: "",
  budget: "",
  source: "Phone",
  status: "New",
  priority: "Medium",
  assignedTo: "",
  followUpDate: "",
  followUpTime: "",
  siteVisitDate: "",
  siteVisitStatus: "Not Scheduled",
  quotationAmount: "",
  quotationStatus: "Not Prepared",
  notes: "",
};

const enquiryStatuses = [
  "New",
  "Contacted",
  "Interested",
  "Follow-up",
  "Quotation Sent",
  "Negotiation",
  "Converted",
  "Lost",
];

const eventTypes = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Anniversary",
  "Corporate",
  "Conference",
  "Reception",
  "Other",
];

const venueOptions = [
  "Banquet Hall",
  "Conference Hall",
  "Restaurant / Party Area",
  "Not Decided",
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

export default function EventEnquiries() {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyEnquiry);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [activeTab, setActiveTab] = useState("Details");
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [quotationAmount, setQuotationAmount] = useState("");

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.customer.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.phone.includes(query);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesEvent =
        eventFilter === "All" || item.eventType === eventFilter;

      const matchesPriority =
        priorityFilter === "All" || item.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesEvent &&
        matchesPriority
      );
    });
  }, [enquiries, search, statusFilter, eventFilter, priorityFilter]);

  const countStatus = (status) =>
    enquiries.filter((item) => item.status === status).length;

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyEnquiry);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(item.id);
    setForm({ ...item });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyEnquiry);
  };

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEnquiry = (e) => {
    e.preventDefault();

    if (
      !form.customer.trim() ||
      !/^[0-9]{10}$/.test(form.phone) ||
      !form.preferredDate ||
      !form.guests ||
      Number(form.guests) < 1
    ) {
      alert("Enter customer name, valid 10-digit phone, event date and guest count.");
      return;
    }

    const data = {
      ...form,
      guests: Number(form.guests),
      budget: Number(form.budget || 0),
      quotationAmount: Number(form.quotationAmount || 0),
    };

    if (editingId) {
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === editingId ? { ...item, ...data } : item
        )
      );
    } else {
      setEnquiries((prev) => [
        {
          ...data,
          id: `ENQ-${String(Date.now()).slice(-5)}`,
          createdAt: new Date().toISOString().slice(0, 10),
          convertedEventId: "",
        },
        ...prev,
      ]);
    }

    closeForm();
  };

  const deleteEnquiry = (item) => {
    if (item.status === "Converted") {
      alert("Converted enquiries cannot be deleted from this page.");
      return;
    }

    if (window.confirm(`Delete enquiry ${item.id}?`)) {
      setEnquiries((prev) => prev.filter((enquiry) => enquiry.id !== item.id));
      if (selectedEnquiry?.id === item.id) setSelectedEnquiry(null);
    }
  };

  const updateEnquiry = (id, updates) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      )
    );

    setSelectedEnquiry((prev) =>
      prev?.id === id ? { ...prev, ...updates } : prev
    );
  };

  const openQuotation = (item) => {
    setSelectedEnquiry(item);
    setQuotationAmount(item.quotationAmount || "");
    setShowQuotationModal(true);
  };

  const saveQuotation = (e) => {
    e.preventDefault();

    if (quotationAmount === "" || Number(quotationAmount) < 0) {
      alert("Enter a valid quotation amount.");
      return;
    }

    updateEnquiry(selectedEnquiry.id, {
      quotationAmount: Number(quotationAmount),
      quotationStatus: "Sent",
      status:
        selectedEnquiry.status === "Converted"
          ? "Converted"
          : "Quotation Sent",
    });

    setShowQuotationModal(false);
  };

  const convertToBooking = (item) => {
    if (item.status === "Converted") {
      alert(`Already converted to ${item.convertedEventId || "an event booking"}.`);
      return;
    }

    if (!window.confirm(`Convert ${item.id} into an event booking?`)) return;

    const eventId = `EVT-${String(Date.now()).slice(-5)}`;

    updateEnquiry(item.id, {
      status: "Converted",
      convertedEventId: eventId,
    });

    alert(
      `Enquiry converted. Event reference: ${eventId}\n\nCreate or link the actual event booking record in the Events module.`
    );
  };

  const updateSiteVisit = (item, date) => {
    updateEnquiry(item.id, {
      siteVisitDate: date,
      siteVisitStatus: date ? "Scheduled" : "Not Scheduled",
    });
  };

  const exportCSV = () => {
    const headers = [
      "Enquiry ID",
      "Customer",
      "Phone",
      "Email",
      "Event Type",
      "Preferred Date",
      "Venue",
      "Guests",
      "Budget",
      "Status",
      "Priority",
      "Assigned To",
      "Follow-up Date",
      "Quotation Amount",
    ];

    const rows = filteredEnquiries.map((item) => [
      item.id,
      item.customer,
      item.phone,
      item.email,
      item.eventType,
      item.preferredDate,
      item.venue,
      item.guests,
      item.budget,
      item.status,
      item.priority,
      item.assignedTo,
      item.followUpDate,
      item.quotationAmount,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "event-enquiries.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <ClipboardList size={16} />
            <span>Events & Banquets</span>
            <span>/</span>
            <span className="text-slate-800">Event Enquiries</span>
          </div>

          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            Event Enquiries
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track potential customers, follow-ups, site visits and quotations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCSV}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Export CSV
          </button>
          <button
            onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Enquiry
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Enquiries"
          value={enquiries.length}
          icon={<ClipboardList size={20} />}
          color="blue"
        />
        <StatCard
          title="New Enquiries"
          value={countStatus("New")}
          icon={<MessageSquare size={20} />}
          color="purple"
        />
        <StatCard
          title="Follow-ups Pending"
          value={countStatus("Follow-up")}
          icon={<Clock size={20} />}
          color="orange"
        />
        <StatCard
          title="Converted Bookings"
          value={countStatus("Converted")}
          icon={<CheckCircle2 size={20} />}
          color="green"
        />
      </div>

      {/* Enquiry Pipeline */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="font-semibold text-slate-900">Enquiry Pipeline</h2>
          <p className="mt-1 text-xs text-slate-500">
            Current enquiry distribution by status.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
          {enquiryStatuses.map((status) => {
            const count = countStatus(status);
            return (
              <button
                key={status}
                onClick={() =>
                  setStatusFilter(statusFilter === status ? "All" : status)
                }
                className={`rounded-lg border p-3 text-left transition ${
                  statusFilter === status
                    ? "border-blue-400 bg-blue-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <p className="text-xs text-slate-500">{status}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{count}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-4">
          <div>
            <h2 className="font-semibold text-slate-900">All Enquiries</h2>
            <p className="mt-1 text-xs text-slate-500">
              Search and manage all customer event enquiries.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ID, name or phone..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Statuses</option>
              {enquiryStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>

            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Event Types</option>
              {eventTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Enquiry / Customer</th>
                <th className="px-4 py-3">Event Details</th>
                <th className="px-4 py-3">Guests / Budget</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Assigned To</th>
                <th className="px-4 py-3">Quotation</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEnquiries.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {item.customer}
                    </p>
                    <p className="mt-1 text-xs text-blue-700">{item.id}</p>
                    <p className="mt-1 text-xs text-slate-500">{item.phone}</p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {item.eventType}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(item.preferredDate)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.venue || "Venue not decided"}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {item.guests} Guests
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Budget: {formatCurrency(item.budget)}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {formatDate(item.followUpDate)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.followUpTime || "Time not set"}
                    </p>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    {item.assignedTo || "Unassigned"}
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">
                      {formatCurrency(item.quotationAmount)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {item.quotationStatus}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                    <p className="mt-1 text-xs text-slate-500">
                      {item.priority} priority
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View details"
                        onClick={() => {
                          setSelectedEnquiry(item);
                          setActiveTab("Details");
                        }}
                      >
                        <Eye size={16} />
                      </ActionButton>

                      <ActionButton
                        title="Edit enquiry"
                        onClick={() => openEditForm(item)}
                      >
                        <Pencil size={16} />
                      </ActionButton>

                      <ActionButton
                        title="Prepare quotation"
                        onClick={() => openQuotation(item)}
                      >
                        <FileText size={16} />
                      </ActionButton>

                      <ActionButton
                        title="Delete enquiry"
                        danger
                        onClick={() => deleteEnquiry(item)}
                      >
                        <Trash2 size={16} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredEnquiries.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-12 text-center">
                    <ClipboardList
                      className="mx-auto mb-3 text-slate-300"
                      size={36}
                    />
                    <p className="font-medium text-slate-700">
                      No enquiries found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Change the filters or add a new enquiry.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Enquiry Modal */}
      {showForm && (
        <Modal
          title={editingId ? "Edit Event Enquiry" : "Add New Event Enquiry"}
          onClose={closeForm}
          wide
        >
          <form onSubmit={saveEnquiry} className="space-y-5">
            <FormSection title="Customer Information">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Customer / Company Name *">
                  <input
                    required
                    value={form.customer}
                    onChange={(e) => updateForm("customer", e.target.value)}
                    placeholder="Enter customer name"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Mobile Number *">
                  <input
                    required
                    type="tel"
                    maxLength="10"
                    value={form.phone}
                    onChange={(e) =>
                      updateForm("phone", e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="10-digit mobile number"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="customer@example.com"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Enquiry Source">
                  <select
                    value={form.source}
                    onChange={(e) => updateForm("source", e.target.value)}
                    className="form-input"
                  >
                    <option>Phone</option>
                    <option>Walk-in</option>
                    <option>Website</option>
                    <option>WhatsApp</option>
                    <option>Referral</option>
                    <option>Social Media</option>
                    <option>Other</option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Event Requirements">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Event Type *">
                  <select
                    value={form.eventType}
                    onChange={(e) => updateForm("eventType", e.target.value)}
                    className="form-input"
                  >
                    {eventTypes.map((type) => (
                      <option key={type}>{type}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Preferred Venue">
                  <select
                    value={form.venue}
                    onChange={(e) => updateForm("venue", e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select venue</option>
                    {venueOptions.map((venue) => (
                      <option key={venue}>{venue}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Preferred Event Date *">
                  <input
                    required
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) =>
                      updateForm("preferredDate", e.target.value)
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Alternative Event Date">
                  <input
                    type="date"
                    value={form.alternateDate}
                    onChange={(e) =>
                      updateForm("alternateDate", e.target.value)
                    }
                    className="form-input"
                  />
                </FormField>

                <FormField label="Expected Guest Count *">
                  <input
                    required
                    type="number"
                    min="1"
                    value={form.guests}
                    onChange={(e) => updateForm("guests", e.target.value)}
                    placeholder="Number of guests"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Estimated Budget (₹)">
                  <input
                    type="number"
                    min="0"
                    value={form.budget}
                    onChange={(e) => updateForm("budget", e.target.value)}
                    placeholder="Customer's estimated budget"
                    className="form-input"
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Follow-up & Assignment">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Enquiry Status">
                  <select
                    value={form.status}
                    onChange={(e) => updateForm("status", e.target.value)}
                    className="form-input"
                  >
                    {enquiryStatuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Priority">
                  <select
                    value={form.priority}
                    onChange={(e) => updateForm("priority", e.target.value)}
                    className="form-input"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </FormField>

                <FormField label="Assigned Staff">
                  <input
                    value={form.assignedTo}
                    onChange={(e) => updateForm("assignedTo", e.target.value)}
                    placeholder="Staff member name"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Next Follow-up Date">
                  <input
                    type="date"
                    value={form.followUpDate}
                    onChange={(e) => updateForm("followUpDate", e.target.value)}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Follow-up Time">
                  <input
                    type="time"
                    value={form.followUpTime}
                    onChange={(e) => updateForm("followUpTime", e.target.value)}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Site Visit Date">
                  <input
                    type="date"
                    value={form.siteVisitDate}
                    onChange={(e) => {
                      updateForm("siteVisitDate", e.target.value);
                      updateForm(
                        "siteVisitStatus",
                        e.target.value ? "Scheduled" : "Not Scheduled"
                      );
                    }}
                    className="form-input"
                  />
                </FormField>

                <FormField label="Site Visit Status">
                  <select
                    value={form.siteVisitStatus}
                    onChange={(e) =>
                      updateForm("siteVisitStatus", e.target.value)
                    }
                    className="form-input"
                  >
                    <option>Not Scheduled</option>
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Quotation">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Quotation Amount (₹)">
                  <input
                    type="number"
                    min="0"
                    value={form.quotationAmount}
                    onChange={(e) =>
                      updateForm("quotationAmount", e.target.value)
                    }
                    placeholder="Enter quotation amount"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Quotation Status">
                  <select
                    value={form.quotationStatus}
                    onChange={(e) =>
                      updateForm("quotationStatus", e.target.value)
                    }
                    className="form-input"
                  >
                    <option>Not Prepared</option>
                    <option>Draft</option>
                    <option>Sent</option>
                    <option>Accepted</option>
                    <option>Rejected</option>
                    <option>Expired</option>
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection title="Notes & Requirements">
              <textarea
                rows="4"
                value={form.notes}
                onChange={(e) => updateForm("notes", e.target.value)}
                placeholder="Customer requirements, menu preferences, decoration, discussion notes..."
                className="form-input resize-none"
              />
            </FormSection>

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
                {editingId ? "Update Enquiry" : "Save Enquiry"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Enquiry Details Modal */}
      {selectedEnquiry && !showQuotationModal && (
        <Modal
          title="Enquiry Details"
          onClose={() => setSelectedEnquiry(null)}
          wide
        >
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{selectedEnquiry.id}</p>
                <h3 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedEnquiry.customer}
                </h3>
              </div>
              <StatusBadge status={selectedEnquiry.status} />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              <DetailBox
                icon={<Phone size={15} />}
                label="Phone"
                value={selectedEnquiry.phone}
              />
              <DetailBox
                icon={<Mail size={15} />}
                label="Email"
                value={selectedEnquiry.email || "—"}
              />
              <DetailBox
                icon={<ClipboardList size={15} />}
                label="Event Type"
                value={selectedEnquiry.eventType}
              />
              <DetailBox
                icon={<CalendarDays size={15} />}
                label="Preferred Date"
                value={formatDate(selectedEnquiry.preferredDate)}
              />
              <DetailBox
                icon={<MapPin size={15} />}
                label="Preferred Venue"
                value={selectedEnquiry.venue || "Not decided"}
              />
              <DetailBox
                icon={<Users size={15} />}
                label="Expected Guests"
                value={selectedEnquiry.guests}
              />
              <DetailBox
                icon={<IndianRupee size={15} />}
                label="Estimated Budget"
                value={formatCurrency(selectedEnquiry.budget)}
              />
              <DetailBox
                icon={<UserRound size={15} />}
                label="Assigned Staff"
                value={selectedEnquiry.assignedTo || "Unassigned"}
              />
              <DetailBox
                icon={<FileText size={15} />}
                label="Quotation"
                value={formatCurrency(selectedEnquiry.quotationAmount)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-800">
                  Follow-up
                </h4>
                <p className="text-sm text-slate-600">
                  Date: {formatDate(selectedEnquiry.followUpDate)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Time: {selectedEnquiry.followUpTime || "Not set"}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Priority: {selectedEnquiry.priority}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 p-4">
                <h4 className="mb-3 text-sm font-semibold text-slate-800">
                  Site Visit
                </h4>
                <p className="text-sm text-slate-600">
                  Date: {formatDate(selectedEnquiry.siteVisitDate)}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Status: {selectedEnquiry.siteVisitStatus}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-800">
                Notes & Requirements
              </h4>
              <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                {selectedEnquiry.notes || "No notes added."}
              </div>
            </div>

            {selectedEnquiry.convertedEventId && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                <p className="text-sm font-medium text-green-800">
                  Converted Event Reference
                </p>
                <p className="mt-1 text-sm text-green-700">
                  {selectedEnquiry.convertedEventId}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-4">
              <button
                onClick={() => openEditForm(selectedEnquiry)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                onClick={() => openQuotation(selectedEnquiry)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <FileText size={15} />
                Quotation
              </button>

              {selectedEnquiry.status !== "Converted" && (
                <button
                  onClick={() => convertToBooking(selectedEnquiry)}
                  className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                >
                  Convert to Booking
                  <ArrowRight size={15} />
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Quotation Modal */}
      {showQuotationModal && selectedEnquiry && (
        <Modal
          title="Prepare / Update Quotation"
          onClose={() => setShowQuotationModal(false)}
        >
          <form onSubmit={saveQuotation} className="space-y-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Customer</p>
              <p className="font-semibold text-slate-800">
                {selectedEnquiry.customer}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedEnquiry.id} · {selectedEnquiry.eventType}
              </p>
            </div>

            <FormField label="Quotation Amount (₹) *">
              <input
                required
                type="number"
                min="0"
                value={quotationAmount}
                onChange={(e) => setQuotationAmount(e.target.value)}
                placeholder="Enter quotation amount"
                className="form-input"
              />
            </FormField>

            <p className="text-xs text-slate-500">
              Saving this quotation will mark it as Sent and update the enquiry
              status to Quotation Sent, unless it is already converted.
            </p>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setShowQuotationModal(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save Quotation
              </button>
            </div>
          </form>
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

function StatusBadge({ status }) {
  const styles = {
    New: "bg-blue-50 text-blue-700",
    Contacted: "bg-cyan-50 text-cyan-700",
    Interested: "bg-purple-50 text-purple-700",
    "Follow-up": "bg-orange-50 text-orange-700",
    "Quotation Sent": "bg-indigo-50 text-indigo-700",
    Negotiation: "bg-amber-50 text-amber-700",
    Converted: "bg-green-50 text-green-700",
    Lost: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
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

function FormSection({ title, children }) {
  return (
    <section className="space-y-4">
      <h3 className="border-b border-slate-200 pb-2 text-sm font-semibold text-slate-900">
        {title}
      </h3>
      {children}
    </section>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center gap-1.5 text-slate-400">
        {icon}
        <p className="text-xs">{label}</p>
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-5">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-xl ${
          wide ? "max-w-5xl" : "max-w-xl"
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