
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  LifeBuoy,
  BookOpen,
  FileText,
  MessageCircle,
  ChevronRight,
  ChevronDown,
  Clock,
  CheckCircle2,
  AlertCircle,
  Paperclip,
  Send,
  X,
  Eye,
  Headphones,
  CircleHelp,
  CreditCard,
  CalendarDays,
  BedDouble,
  Settings,
  ShieldCheck,
  User,
  Filter,
  Download,
  File,
  Image,
  Trash2,
} from "lucide-react";

// --------------------------------------------------
// SAMPLE DATA
// --------------------------------------------------

const helpCategories = [
  { id: "getting-started", name: "Getting Started", icon: BookOpen },
  { id: "reservations", name: "Reservations", icon: CalendarDays },
  { id: "rooms", name: "Room Management", icon: BedDouble },
  { id: "billing", name: "Billing & Payments", icon: CreditCard },
  { id: "staff", name: "Staff & Permissions", icon: ShieldCheck },
  { id: "settings", name: "Settings", icon: Settings },
];

const documentation = [
  {
    id: 1,
    title: "Getting Started with StayFlow",
    category: "Getting Started",
    description: "Learn how to set up your hotel and navigate the dashboard.",
    readTime: "5 min read",
    type: "Documentation",
  },
  {
    id: 2,
    title: "Creating a New Reservation",
    category: "Reservations",
    description: "A complete guide to creating and managing guest bookings.",
    readTime: "7 min read",
    type: "Feature Guide",
  },
  {
    id: 3,
    title: "Managing Rooms and Room Types",
    category: "Room Management",
    description: "Configure room types, prices, amenities and room availability.",
    readTime: "6 min read",
    type: "Feature Guide",
  },
  {
    id: 4,
    title: "Guest Check-in and Check-out",
    category: "Reservations",
    description: "Understand the complete guest arrival and departure process.",
    readTime: "5 min read",
    type: "Documentation",
  },
  {
    id: 5,
    title: "Payments and Invoice Management",
    category: "Billing & Payments",
    description: "Manage payments, pending balances, refunds and invoices.",
    readTime: "8 min read",
    type: "Feature Guide",
  },
  {
    id: 6,
    title: "Managing Staff Accounts",
    category: "Staff & Permissions",
    description: "Create staff accounts and manage access permissions.",
    readTime: "4 min read",
    type: "Documentation",
  },
  {
    id: 7,
    title: "Hotel Settings and Configuration",
    category: "Settings",
    description: "Configure hotel information, preferences and system settings.",
    readTime: "6 min read",
    type: "Documentation",
  },
];

const initialFAQs = [
  {
    id: 1,
    question: "How do I create a new reservation?",
    answer:
      "Open Reservations from the sidebar and select New Reservation. Enter guest details, select dates and an available room, review pricing, record payment information and confirm the booking.",
    category: "Reservations",
  },
  {
    id: 2,
    question: "Can I modify an existing reservation?",
    answer:
      "Yes. Open All Reservations, find the booking and open its details. You can update supported reservation information, subject to availability and your staff permissions.",
    category: "Reservations",
  },
  {
    id: 3,
    question: "How can I check room availability?",
    answer:
      "Use the Booking Calendar or Room Management section to review room status and availability. Always check the requested stay dates before assigning a room.",
    category: "Room Management",
  },
  {
    id: 4,
    question: "How do I process a guest check-out?",
    answer:
      "Open Reservations and select Check-out. Find the checked-in guest, review the final bill, collect outstanding payments and complete the departure.",
    category: "Reservations",
  },
  {
    id: 5,
    question: "Can I record partial payments?",
    answer:
      "Yes. Record the amount received and the payment method. The remaining balance should be reflected in the reservation payment details.",
    category: "Billing & Payments",
  },
  {
    id: 6,
    question: "How do I add a new staff member?",
    answer:
      "Open Staff Management, create a staff account and assign an appropriate role and permissions.",
    category: "Staff & Permissions",
  },
  {
    id: 7,
    question: "What should I do if a room needs maintenance?",
    answer:
      "Open Room Management, locate the room and update its maintenance status. Rooms under maintenance should not be assigned to new guests.",
    category: "Room Management",
  },
  {
    id: 8,
    question: "How do I contact StayFlow support?",
    answer:
      "Use the Create Ticket option on this page. Select an issue category and priority, explain the problem and attach relevant screenshots or documents.",
    category: "General",
  },
];

const initialTickets = [
  {
    id: "TKT-1001",
    subject: "Payment receipt not generating",
    category: "Billing & Payments",
    description:
      "The payment was recorded successfully, but the receipt is not generating when I click the download option.",
    priority: "High",
    status: "Open",
    assignedTo: "Support Team",
    createdAt: "2026-11-05T10:30:00",
    updatedAt: "2026-11-05T11:15:00",
    attachments: [],
    replies: [
      {
        id: 1,
        sender: "You",
        role: "Hotel Staff",
        message: "The payment was recorded, but I cannot download its receipt.",
        time: "2026-11-05T10:30:00",
      },
      {
        id: 2,
        sender: "Support Team",
        role: "Support Staff",
        message:
          "Thank you for reporting this. We are investigating the receipt generation issue.",
        time: "2026-11-05T11:15:00",
      },
    ],
  },
  {
    id: "TKT-1002",
    subject: "Unable to update room status",
    category: "Room Management",
    description:
      "Room 204 is not allowing us to update its housekeeping status.",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Amit Verma",
    createdAt: "2026-11-04T14:20:00",
    updatedAt: "2026-11-05T09:00:00",
    attachments: [],
    replies: [
      {
        id: 1,
        sender: "You",
        role: "Hotel Staff",
        message: "Room 204 housekeeping status cannot be updated.",
        time: "2026-11-04T14:20:00",
      },
      {
        id: 2,
        sender: "Amit Verma",
        role: "Support Staff",
        message: "We are checking the room status update functionality.",
        time: "2026-11-05T09:00:00",
      },
    ],
  },
  {
    id: "TKT-1003",
    subject: "Dashboard report loading issue",
    category: "Technical Issue",
    description:
      "The dashboard report takes too long to load when selecting a custom date range.",
    priority: "Low",
    status: "Resolved",
    assignedTo: "Support Team",
    createdAt: "2026-11-02T12:00:00",
    updatedAt: "2026-11-03T16:30:00",
    attachments: [],
    replies: [
      {
        id: 1,
        sender: "Support Team",
        role: "Support Staff",
        message: "The report loading issue has been resolved.",
        time: "2026-11-03T16:30:00",
      },
    ],
  },
];

const supportStaff = [
  "Support Team",
  "Amit Verma",
  "Priya Singh",
  "Technical Team",
];

const categories = [
  "General",
  "Reservations",
  "Room Management",
  "Billing & Payments",
  "Staff & Permissions",
  "Technical Issue",
  "Account & Security",
  "Other",
];

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusStyles = {
  Open: "bg-blue-50 text-blue-700",
  "In Progress": "bg-amber-50 text-amber-700",
  Resolved: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-600",
};

const priorityStyles = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-700",
  High: "bg-orange-50 text-orange-700",
  Urgent: "bg-red-50 text-red-700",
};

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function Support() {
  const [activeTab, setActiveTab] = useState("overview");
  const [search, setSearch] = useState("");
  const [ticketFilter, setTicketFilter] = useState("All");
  const [faqCategory, setFaqCategory] = useState("All");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAttachments, setNewAttachments] = useState([]);
  const [replyMessage, setReplyMessage] = useState("");

  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "General",
    description: "",
    priority: "Medium",
  });

  const [notice, setNotice] = useState("");

  // --------------------------------------------------
  // TICKET STATISTICS
  // --------------------------------------------------

  const stats = useMemo(
    () => [
      {
        title: "Total Tickets",
        value: tickets.length,
        icon: MessageCircle,
        color: "blue",
      },
      {
        title: "Open Tickets",
        value: tickets.filter((ticket) => ticket.status === "Open").length,
        icon: AlertCircle,
        color: "blue",
      },
      {
        title: "In Progress",
        value: tickets.filter((ticket) => ticket.status === "In Progress")
          .length,
        icon: Clock,
        color: "amber",
      },
      {
        title: "Resolved",
        value: tickets.filter((ticket) => ticket.status === "Resolved").length,
        icon: CheckCircle2,
        color: "emerald",
      },
    ],
    [tickets]
  );

  // --------------------------------------------------
  // FILTER TICKETS
  // --------------------------------------------------

  const filteredTickets = useMemo(() => {
    const query = search.toLowerCase();

    return tickets.filter((ticket) => {
      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.category.toLowerCase().includes(query);

      const matchesStatus =
        ticketFilter === "All" || ticket.status === ticketFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, ticketFilter]);

  // --------------------------------------------------
  // FILTER DOCUMENTATION
  // --------------------------------------------------

  const filteredDocs = documentation.filter((doc) => {
    const query = search.toLowerCase();

    return (
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.category.toLowerCase().includes(query)
    );
  });

  const filteredFAQs = initialFAQs.filter((faq) => {
    const query = search.toLowerCase();

    const matchesSearch =
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query);

    const matchesCategory =
      faqCategory === "All" || faq.category === faqCategory;

    return matchesSearch && matchesCategory;
  });

  // --------------------------------------------------
  // CREATE TICKET
  // --------------------------------------------------

  const handleCreateTicket = (e) => {
    e.preventDefault();

    if (
      !ticketForm.subject.trim() ||
      !ticketForm.description.trim()
    ) {
      setNotice("Please enter a subject and issue description.");
      return;
    }

    const newTicket = {
      id: `TKT-${1004 + tickets.length - initialTickets.length}`,
      subject: ticketForm.subject.trim(),
      category: ticketForm.category,
      description: ticketForm.description.trim(),
      priority: ticketForm.priority,
      status: "Open",
      assignedTo: "Support Team",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: newAttachments.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      replies: [
        {
          id: 1,
          sender: "You",
          role: "Hotel Staff",
          message: ticketForm.description.trim(),
          time: new Date().toISOString(),
        },
      ],
    };

    setTickets((prev) => [newTicket, ...prev]);
    setShowCreateModal(false);
    setTicketForm({
      subject: "",
      category: "General",
      description: "",
      priority: "Medium",
    });
    setNewAttachments([]);
    setNotice("");
    setActiveTab("tickets");
    setSearch("");
    setTicketFilter("All");
  };

  // --------------------------------------------------
  // ADD REPLY
  // --------------------------------------------------

  const handleReply = () => {
    if (!replyMessage.trim() || !selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      updatedAt: new Date().toISOString(),
      status:
        selectedTicket.status === "Resolved" ||
        selectedTicket.status === "Closed"
          ? "Open"
          : selectedTicket.status,
      replies: [
        ...selectedTicket.replies,
        {
          id: Date.now(),
          sender: "You",
          role: "Hotel Staff",
          message: replyMessage.trim(),
          time: new Date().toISOString(),
        },
      ],
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );

    setSelectedTicket(updatedTicket);
    setReplyMessage("");
  };

  // --------------------------------------------------
  // UPDATE TICKET STATUS / ASSIGNEE
  // --------------------------------------------------

  const updateTicket = (field, value) => {
    if (!selectedTicket) return;

    const updatedTicket = {
      ...selectedTicket,
      [field]: value,
      updatedAt: new Date().toISOString(),
    };

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === updatedTicket.id ? updatedTicket : ticket
      )
    );

    setSelectedTicket(updatedTicket);
  };

  const openTicket = (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
  };

  // --------------------------------------------------
  // FILE ATTACHMENTS
  // --------------------------------------------------

  const handleFiles = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    setNewAttachments((prev) => [...prev, ...selectedFiles]);

    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setNewAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setNewAttachments([]);
    setNotice("");
  };

  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="space-y-6 pb-8">
      {/* HEADER */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <LifeBuoy size={22} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              Help & Support
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500">
            Find answers, explore guides and get assistance with ASH.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Create Support Ticket
        </button>
      </div>

      {/* QUICK SUPPORT BANNER */}

      <div className="flex flex-col justify-between gap-4 rounded-xl bg-linear-to-r from-blue-700 to-blue-500 p-6 text-white md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Headphones size={21} />
            <h2 className="text-lg font-semibold">
              Need help with ASH?
            </h2>
          </div>

          <p className="mt-2 max-w-xl text-sm text-blue-100">
            Explore our help resources or create a support ticket.
            Our support team can help you resolve your issues.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          Get Support
          <ChevronRight size={17} />
        </button>
      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-xl border border-slate-200 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">
                  {stat.title}
                </p>

                <div className={`rounded-lg p-2 ${colorStyles[stat.color]}`}>
                  <Icon size={19} />
                </div>
              </div>

              <h2 className="mt-3 text-2xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* TABS */}

      <div className="border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto">
          {[
            { id: "overview", label: "Help Center", icon: LifeBuoy },
            { id: "docs", label: "Documentation", icon: BookOpen },
            { id: "faqs", label: "FAQs", icon: CircleHelp },
            { id: "tickets", label: "Support Tickets", icon: MessageCircle },
          ].map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                }}
                className={`flex shrink-0 items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon size={17} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* OVERVIEW */}

      {activeTab === "overview" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              How can we help you?
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Search documentation, guides and common questions.
            </p>

            <div className="relative mt-4 max-w-2xl">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for help articles, features or questions..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          {/* HELP CATEGORIES */}

          <div>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Browse by Category
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {helpCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSearch("");
                      setActiveTab("docs");
                    }}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 text-left transition hover:border-blue-300 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          {category.name}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500">
                          Explore related guides
                        </p>
                      </div>
                    </div>

                    <ChevronRight size={18} className="text-slate-400" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* POPULAR ARTICLES */}

          <div className="rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Popular Help Articles
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Frequently used documentation and feature guides.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("docs")}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {documentation.slice(0, 4).map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setSearch(doc.title);
                    setActiveTab("docs");
                  }}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left hover:bg-slate-50"
                >
                  <div className="flex items-start gap-3">
                    <FileText
                      size={19}
                      className="mt-0.5 text-blue-600"
                    />
                    <div>
                      <h3 className="text-sm font-medium text-slate-800">
                        {doc.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {doc.category} · {doc.readTime}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    size={17}
                    className="shrink-0 text-slate-400"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* FAQ PREVIEW */}

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">
                  Frequently Asked Questions
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Quick answers to common questions.
                </p>
              </div>

              <button
                onClick={() => setActiveTab("faqs")}
                className="text-sm font-medium text-blue-600"
              >
                View all
              </button>
            </div>

            <div className="mt-4 divide-y divide-slate-100">
              {initialFAQs.slice(0, 3).map((faq) => (
                <button
                  key={faq.id}
                  onClick={() => {
                    setExpandedFAQ(faq.id);
                    setActiveTab("faqs");
                  }}
                  className="flex w-full items-center justify-between gap-3 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {faq.question}
                  </span>
                  <ChevronRight
                    size={17}
                    className="shrink-0 text-slate-400"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENTATION */}

      {activeTab === "docs" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Documentation & Feature Guides
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Learn how to use different StayFlow features.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documentation..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                    <FileText size={21} />
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {doc.type}
                  </span>
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  {doc.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {doc.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock size={14} />
                    {doc.readTime}
                  </span>

                  <span className="text-xs font-medium text-blue-600">
                    {doc.category}
                  </span>
                </div>
              </div>
            ))}

            {filteredDocs.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center lg:col-span-2">
                <FileText
                  size={32}
                  className="mx-auto mb-3 text-slate-300"
                />
                <p className="font-medium text-slate-700">
                  No documentation found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Try another search term.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQS */}

      {activeTab === "faqs" && (
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find quick answers to common StayFlow questions.
            </p>
          </div>

          <div className="relative max-w-xl">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", ...new Set(initialFAQs.map((faq) => faq.category))].map(
              (category) => (
                <button
                  key={category}
                  onClick={() => setFaqCategory(category)}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                    faqCategory === category
                      ? "bg-blue-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>

          <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="p-5">
                <button
                  onClick={() =>
                    setExpandedFAQ(
                      expandedFAQ === faq.id ? null : faq.id
                    )
                  }
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      {faq.question}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">
                      {faq.category}
                    </p>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-slate-400 transition ${
                      expandedFAQ === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFAQ === faq.id && (
                  <p className="mt-4 border-t border-slate-100 pt-4 text-sm leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}

            {filteredFAQs.length === 0 && (
              <p className="p-10 text-center text-sm text-slate-500">
                No matching questions found.
              </p>
            )}
          </div>
        </div>
      )}

      {/* SUPPORT TICKETS */}

      {activeTab === "tickets" && (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Support Tickets
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track issues and communicate with the support team.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={17} />
              New Ticket
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search ticket ID or subject..."
                className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="relative sm:w-48">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={ticketFilter}
                onChange={(e) => setTicketFilter(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm outline-none focus:border-blue-500"
              >
                {["All", "Open", "In Progress", "Resolved", "Closed"].map(
                  (status) => (
                    <option key={status}>{status}</option>
                  )
                )}
              </select>
              <ChevronDown
                size={15}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="hidden grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_40px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 lg:grid">
              <span>Ticket ID</span>
              <span>Subject</span>
              <span>Category</span>
              <span>Priority</span>
              <span>Status</span>
              <span></span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => openTicket(ticket)}
                  className="grid w-full grid-cols-1 gap-3 p-5 text-left transition hover:bg-slate-50 lg:grid-cols-[1fr_1.5fr_1fr_0.8fr_0.8fr_40px] lg:items-center lg:gap-4"
                >
                  <span className="text-xs font-semibold text-blue-600">
                    {ticket.id}
                  </span>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {ticket.subject}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Updated {formatDate(ticket.updatedAt)}
                    </p>
                  </div>

                  <span className="text-sm text-slate-600">
                    {ticket.category}
                  </span>

                  <span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${priorityStyles[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </span>
                  </span>

                  <span>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}
                    >
                      {ticket.status}
                    </span>
                  </span>

                  <ChevronRight
                    size={18}
                    className="hidden text-slate-400 lg:block"
                  />
                </button>
              ))}

              {filteredTickets.length === 0 && (
                <div className="p-12 text-center">
                  <MessageCircle
                    size={34}
                    className="mx-auto mb-3 text-slate-300"
                  />
                  <h3 className="font-semibold text-slate-700">
                    No tickets found
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Try changing your search or status filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE TICKET MODAL */}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">
            <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Create Support Ticket
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Describe your issue so the support team can assist you.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Issue Subject <span className="text-red-500">*</span>
                </label>

                <input
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      subject: e.target.value,
                    })
                  }
                  placeholder="Briefly describe your issue"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Ticket Category
                  </label>

                  <select
                    value={ticketForm.category}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {categories.map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Priority
                  </label>

                  <select
                    value={ticketForm.priority}
                    onChange={(e) =>
                      setTicketForm({
                        ...ticketForm,
                        priority: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {["Low", "Medium", "High", "Urgent"].map((priority) => (
                      <option key={priority}>{priority}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Issue Description <span className="text-red-500">*</span>
                </label>

                <textarea
                  rows={5}
                  value={ticketForm.description}
                  onChange={(e) =>
                    setTicketForm({
                      ...ticketForm,
                      description: e.target.value,
                    })
                  }
                  placeholder="Explain what happened, what you expected and any steps to reproduce the issue..."
                  className="w-full resize-y rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Attachments
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-center transition hover:border-blue-300 hover:bg-blue-50/30">
                  <Paperclip size={22} className="text-slate-400" />
                  <p className="mt-2 text-sm font-medium text-slate-700">
                    Click to attach files
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Screenshots, images or documents
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                </label>

                {newAttachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newAttachments.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-slate-200 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-2">
                          <File size={17} className="shrink-0 text-blue-600" />
                          <div className="min-w-0">
                            <p className="truncate text-sm text-slate-700">
                              {file.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {(file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="rounded p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {notice && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {notice}
                </p>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Send size={16} />
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TICKET DETAILS DRAWER */}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40">
          <div className="flex h-full w-full max-w-2xl flex-col bg-white shadow-xl">
            {/* DRAWER HEADER */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-xs font-semibold text-blue-600">
                  {selectedTicket.id}
                </p>
                <h2 className="mt-1 font-semibold text-slate-900">
                  Ticket Details
                </h2>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* DRAWER BODY */}

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              <div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[selectedTicket.status]}`}
                  >
                    {selectedTicket.status}
                  </span>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${priorityStyles[selectedTicket.priority]}`}
                  >
                    {selectedTicket.priority} Priority
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-slate-900">
                  {selectedTicket.subject}
                </h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {selectedTicket.description}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4">
                  <div>
                    <p className="text-xs text-slate-500">Category</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedTicket.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Created</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateTime(selectedTicket.createdAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Last Updated</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatDateTime(selectedTicket.updatedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">Assigned Staff</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {selectedTicket.assignedTo}
                    </p>
                  </div>
                </div>
              </div>

              {/* STAFF CONTROLS */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Update Status
                  </label>

                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      updateTicket("status", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {["Open", "In Progress", "Resolved", "Closed"].map(
                      (status) => (
                        <option key={status}>{status}</option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-semibold text-slate-600">
                    Assigned Support Staff
                  </label>

                  <select
                    value={selectedTicket.assignedTo}
                    onChange={(e) =>
                      updateTicket("assignedTo", e.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    {supportStaff.map((staff) => (
                      <option key={staff}>{staff}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ATTACHMENTS */}

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Paperclip size={17} />
                  Attachments ({selectedTicket.attachments.length})
                </h3>

                {selectedTicket.attachments.length > 0 ? (
                  <div className="space-y-2">
                    {selectedTicket.attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-lg border border-slate-200 p-3"
                      >
                        <File size={18} className="text-blue-600" />
                        <div className="min-w-0">
                          <p className="truncate text-sm text-slate-700">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                    No attachments available for this ticket.
                  </p>
                )}
              </div>

              {/* REPLY HISTORY */}

              <div>
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <MessageCircle size={17} />
                  Reply History ({selectedTicket.replies.length})
                </h3>

                <div className="space-y-4">
                  {selectedTicket.replies.map((reply) => {
                    const isStaff = reply.role === "Support Staff";

                    return (
                      <div
                        key={reply.id}
                        className={`flex gap-3 ${
                          isStaff ? "" : "flex-row-reverse"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                            isStaff
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <User size={17} />
                        </div>

                        <div
                          className={`max-w-[85%] rounded-xl p-4 ${
                            isStaff
                              ? "bg-blue-50"
                              : "bg-slate-100"
                          }`}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-semibold text-slate-800">
                              {reply.sender}
                            </p>
                            <span className="text-[10px] text-slate-400">
                              {reply.role}
                            </span>
                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-700">
                            {reply.message}
                          </p>

                          <p className="mt-2 text-[10px] text-slate-400">
                            {formatDateTime(reply.time)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* REPLY INPUT */}

            <div className="border-t border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Add a Reply
              </label>

              <div className="flex items-end gap-3">
                <textarea
                  rows={2}
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Write your message..."
                  className="min-h-18.75 flex-1 resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"
                />

                <button
                  onClick={handleReply}
                  disabled={!replyMessage.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
