
import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  Building2,
  Users,
  IndianRupee,
  FileText,
  Pencil,
  Trash2,
  X,
  Download,
  Eye,
  CheckCircle2,
  Ban,
  CalendarDays,
  Phone,
  Mail,
  BriefcaseBusiness,
  History,
} from "lucide-react";

const roomTypes = ["Standard", "Deluxe", "Super Deluxe", "Family Suite"];

const initialCompanies = [
  {
    id: "CORP-001",
    company: "ABC Technologies Pvt. Ltd.",
    contactPerson: "Rahul Mehta",
    email: "rahul@abctech.com",
    phone: "9876543210",
    gstin: "08ABCDE1234F1Z5",
    address: "Jaipur, Rajasthan",
    agreementNo: "AGR-2026-001",
    startDate: "2026-04-01",
    endDate: "2027-03-31",
    discountType: "Percentage",
    discountValue: 15,
    roomRates: {
      Standard: 1700,
      Deluxe: 2300,
      "Super Deluxe": 2900,
      "Family Suite": 4000,
    },
    eligibleRooms: ["Standard", "Deluxe", "Super Deluxe"],
    paymentTerms: "15 Days",
    creditLimit: 50000,
    status: "Active",
    notes: "Corporate accommodation agreement.",
    bookings: 12,
    invoices: 8,
    outstanding: 12500,
  },
  {
    id: "CORP-002",
    company: "Global Travels",
    contactPerson: "Amit Sharma",
    email: "amit@globaltravels.in",
    phone: "9876501234",
    gstin: "",
    address: "Bharatpur, Rajasthan",
    agreementNo: "AGR-2026-002",
    startDate: "2026-06-01",
    endDate: "2026-12-31",
    discountType: "Fixed",
    discountValue: 300,
    roomRates: {
      Standard: 1800,
      Deluxe: 2400,
      "Super Deluxe": 3000,
      "Family Suite": 4200,
    },
    eligibleRooms: ["Standard", "Deluxe"],
    paymentTerms: "7 Days",
    creditLimit: 25000,
    status: "Active",
    notes: "Travel agency negotiated rates.",
    bookings: 8,
    invoices: 5,
    outstanding: 6200,
  },
  {
    id: "CORP-003",
    company: "Rajasthan Industrial Group",
    contactPerson: "Neeraj Singh",
    email: "neeraj@rig.in",
    phone: "9876512345",
    gstin: "08FGHIJ5678K1Z2",
    address: "Alwar, Rajasthan",
    agreementNo: "AGR-2025-014",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    discountType: "Percentage",
    discountValue: 10,
    roomRates: {
      Standard: 1850,
      Deluxe: 2450,
      "Super Deluxe": 3100,
      "Family Suite": 4300,
    },
    eligibleRooms: ["Standard", "Deluxe", "Super Deluxe", "Family Suite"],
    paymentTerms: "30 Days",
    creditLimit: 100000,
    status: "Inactive",
    notes: "Agreement expired; renewal pending.",
    bookings: 21,
    invoices: 18,
    outstanding: 0,
  },
];

const initialHistory = [
  {
    id: "CH-001",
    companyId: "CORP-001",
    bookingId: "RES-1020",
    guest: "Suresh Kumar",
    roomType: "Deluxe",
    checkIn: "2026-10-12",
    checkOut: "2026-10-15",
    nights: 3,
    amount: 6900,
    invoiceNo: "INV-C-001",
    paymentStatus: "Paid",
  },
  {
    id: "CH-002",
    companyId: "CORP-001",
    bookingId: "RES-1035",
    guest: "Priya Sharma",
    roomType: "Standard",
    checkIn: "2026-10-20",
    checkOut: "2026-10-22",
    nights: 2,
    amount: 3400,
    invoiceNo: "INV-C-002",
    paymentStatus: "Pending",
  },
  {
    id: "CH-003",
    companyId: "CORP-002",
    bookingId: "RES-1040",
    guest: "Rohit Verma",
    roomType: "Deluxe",
    checkIn: "2026-10-25",
    checkOut: "2026-10-27",
    nights: 2,
    amount: 4800,
    invoiceNo: "INV-C-003",
    paymentStatus: "Partially Paid",
  },
];

const emptyForm = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  gstin: "",
  address: "",
  agreementNo: "",
  startDate: "",
  endDate: "",
  discountType: "Percentage",
  discountValue: 0,
  roomRates: {
    Standard: "",
    Deluxe: "",
    "Super Deluxe": "",
    "Family Suite": "",
  },
  eligibleRooms: [],
  paymentTerms: "15 Days",
  creditLimit: "",
  status: "Active",
  notes: "",
};

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

function Field({ label, children, hint }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function Badge({ children, color = "slate" }) {
  const styles = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    blue: "bg-blue-100 text-blue-700",
    purple: "bg-purple-100 text-purple-700",
    slate: "bg-slate-100 text-slate-600",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles[color]}`}>
      {children}
    </span>
  );
}

function Modal({ title, onClose, children, size = "max-w-3xl" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-2xl bg-white shadow-xl`}>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-800">{value}</h3>
          <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className={`rounded-xl p-3 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

function getAgreementStatus(company) {
  if (company.status === "Inactive") return "Inactive";

  const today = new Date().toISOString().slice(0, 10);

  if (today < company.startDate) return "Upcoming";
  if (today > company.endDate) return "Expired";

  return "Active";
}

export default function CorporateRates() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [history] = useState(initialHistory);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [modal, setModal] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [activeCompany, setActiveCompany] = useState(null);

  const activeCount = companies.filter(
    (company) => getAgreementStatus(company) === "Active"
  ).length;

  const totalOutstanding = companies.reduce(
    (sum, company) => sum + Number(company.outstanding || 0),
    0
  );

  const totalBookings = companies.reduce(
    (sum, company) => sum + Number(company.bookings || 0),
    0
  );

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const query = search.toLowerCase();

      const matchesSearch =
        `${company.company} ${company.contactPerson} ${company.id} ${company.agreementNo}`
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        getAgreementStatus(company) === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companies, search, statusFilter]);

  const openCreate = () => {
    setSelected(null);
    setForm({
      ...emptyForm,
      roomRates: { ...emptyForm.roomRates },
      eligibleRooms: [],
    });
    setModal("form");
  };

  const openEdit = (company) => {
    setSelected(company);
    setForm({
      ...company,
      roomRates: { ...company.roomRates },
      eligibleRooms: [...company.eligibleRooms],
    });
    setModal("form");
  };

  const saveCompany = (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.contactPerson.trim()) {
      alert("Company name and contact person are required.");
      return;
    }

    if (form.startDate > form.endDate) {
      alert("Agreement end date must be on or after the start date.");
      return;
    }

    if (
      form.discountType === "Percentage" &&
      (Number(form.discountValue) < 0 || Number(form.discountValue) > 100)
    ) {
      alert("Percentage discount must be between 0 and 100.");
      return;
    }

    if (
      !form.eligibleRooms.length ||
      form.eligibleRooms.some(
        (room) => !Number.isFinite(Number(form.roomRates[room])) ||
          Number(form.roomRates[room]) <= 0
      )
    ) {
      alert("Select eligible room types and enter a valid rate for each.");
      return;
    }

    if (Number(form.creditLimit) < 0 || Number(form.discountValue) < 0) {
      alert("Credit limit and discount cannot be negative.");
      return;
    }

    const payload = {
      ...form,
      company: form.company.trim(),
      contactPerson: form.contactPerson.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      gstin: form.gstin.trim().toUpperCase(),
      address: form.address.trim(),
      agreementNo: form.agreementNo.trim(),
      discountValue: Number(form.discountValue),
      creditLimit: Number(form.creditLimit || 0),
      roomRates: { ...form.roomRates },
      eligibleRooms: [...form.eligibleRooms],
    };

    if (selected) {
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === selected.id
            ? {
                ...payload,
                id: selected.id,
                bookings: selected.bookings,
                invoices: selected.invoices,
                outstanding: selected.outstanding,
              }
            : company
        )
      );
    } else {
      setCompanies((prev) => [
        {
          ...payload,
          id: `CORP-${String(Date.now()).slice(-6)}`,
          bookings: 0,
          invoices: 0,
          outstanding: 0,
        },
        ...prev,
      ]);
    }

    setModal("");
  };

  const deleteCompany = (company) => {
    if (!window.confirm(`Delete ${company.company}?`)) return;

    setCompanies((prev) =>
      prev.filter((item) => item.id !== company.id)
    );

    if (activeCompany?.id === company.id) setActiveCompany(null);
  };

  const toggleStatus = (company) => {
    setCompanies((prev) =>
      prev.map((item) =>
        item.id === company.id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const toggleRoom = (room) => {
    setForm((prev) => ({
      ...prev,
      eligibleRooms: prev.eligibleRooms.includes(room)
        ? prev.eligibleRooms.filter((item) => item !== room)
        : [...prev.eligibleRooms, room],
    }));
  };

  const exportCompanies = () => {
    const rows = [
      [
        "Company ID",
        "Company",
        "Contact Person",
        "Email",
        "Phone",
        "GSTIN",
        "Agreement No",
        "Start Date",
        "End Date",
        "Eligible Rooms",
        "Payment Terms",
        "Credit Limit",
        "Outstanding",
        "Status",
      ],
      ...filteredCompanies.map((company) => [
        company.id,
        company.company,
        company.contactPerson,
        company.email,
        company.phone,
        company.gstin,
        company.agreementNo,
        company.startDate,
        company.endDate,
        company.eligibleRooms.join("; "),
        company.paymentTerms,
        company.creditLimit,
        company.outstanding,
        getAgreementStatus(company),
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "corporate-rates.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const companyHistory = activeCompany
    ? history.filter((item) => item.companyId === activeCompany.id)
    : [];

  const statusColor = (status) => {
    if (status === "Active") return "green";
    if (status === "Upcoming") return "blue";
    if (status === "Expired") return "red";
    return "slate";
  };

  return (
    <div className="min-h-screen w-full space-y-6 bg-[#F5F7FA] p-4 md:p-6 lg:p-7">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Corporate Rates
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage company agreements, negotiated room rates and corporate bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportCompanies}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <Download size={17} /> Export
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} /> Add Corporate Client
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Corporate Clients"
          value={companies.length}
          subtitle="Registered company accounts"
          icon={Building2}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          title="Active Agreements"
          value={activeCount}
          subtitle="Currently valid agreements"
          icon={CheckCircle2}
          color="bg-green-50 text-green-600"
        />
        <StatCard
          title="Corporate Bookings"
          value={totalBookings}
          subtitle="Recorded company bookings"
          icon={Users}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          title="Outstanding Amount"
          value={money(totalOutstanding)}
          subtitle="Pending corporate payments"
          icon={IndianRupee}
          color="bg-orange-50 text-orange-600"
        />
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className={`${inputClass} pl-10`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, contact or agreement..."
            />
          </div>

          <select
            className={inputClass}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Agreement Statuses</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Expired">Expired</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Company Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-800">Corporate Clients</h2>
          <p className="mt-1 text-xs text-slate-500">
            Company agreements, negotiated rates and payment information.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">Company</th>
                <th className="px-5 py-3">Contact Details</th>
                <th className="px-5 py-3">Agreement</th>
                <th className="px-5 py-3">Discount</th>
                <th className="px-5 py-3">Payment Terms</th>
                <th className="px-5 py-3">Outstanding</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCompanies.map((company) => {
                const status = getAgreementStatus(company);

                return (
                  <tr key={company.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {company.company}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{company.id}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {company.contactPerson}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {company.phone}
                      </p>
                      <p className="text-xs text-slate-400">{company.email}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {company.agreementNo || "—"}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(company.startDate)} – {formatDate(company.endDate)}
                      </p>
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-700">
                      {company.discountType === "Percentage"
                        ? `${company.discountValue}%`
                        : money(company.discountValue)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {company.paymentTerms}
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {money(company.outstanding)}
                    </td>

                    <td className="px-5 py-4">
                      <Badge color={statusColor(status)}>{status}</Badge>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          title="View details and history"
                          onClick={() => setActiveCompany(company)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          title="Edit company"
                          onClick={() => openEdit(company)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          title={company.status === "Active" ? "Deactivate" : "Activate"}
                          onClick={() => toggleStatus(company)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-green-50 hover:text-green-600"
                        >
                          {company.status === "Active" ? (
                            <Ban size={16} />
                          ) : (
                            <CheckCircle2 size={16} />
                          )}
                        </button>
                        <button
                          title="Delete company"
                          onClick={() => deleteCompany(company)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-5 py-12 text-center text-slate-500">
                    No corporate clients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Company Modal */}
      {modal === "form" && (
        <Modal
          title={selected ? "Edit Corporate Client" : "Add Corporate Client"}
          onClose={() => setModal("")}
        >
          <form onSubmit={saveCompany} className="space-y-6">
            {/* Company Information */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                <Building2 size={18} className="text-blue-600" />
                Company Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Company Name *">
                  <input
                    className={inputClass}
                    value={form.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    required
                    placeholder="Enter company name"
                  />
                </Field>

                <Field label="Contact Person *">
                  <input
                    className={inputClass}
                    value={form.contactPerson}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        contactPerson: e.target.value,
                      }))
                    }
                    required
                    placeholder="Contact person name"
                  />
                </Field>

                <Field label="Email Address">
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="company@example.com"
                  />
                </Field>

                <Field label="Phone Number">
                  <input
                    type="tel"
                    className={inputClass}
                    value={form.phone}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="10-digit mobile number"
                  />
                </Field>

                <Field label="GSTIN">
                  <input
                    className={inputClass}
                    value={form.gstin}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, gstin: e.target.value }))
                    }
                    placeholder="Enter GSTIN if applicable"
                    maxLength={15}
                  />
                </Field>

                <Field label="Company Address">
                  <input
                    className={inputClass}
                    value={form.address}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, address: e.target.value }))
                    }
                    placeholder="City, State"
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Agreement */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                <FileText size={18} className="text-blue-600" />
                Agreement Details
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Agreement Number">
                  <input
                    className={inputClass}
                    value={form.agreementNo}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        agreementNo: e.target.value,
                      }))
                    }
                    placeholder="e.g. AGR-2026-003"
                  />
                </Field>

                <Field label="Agreement Status">
                  <select
                    className={inputClass}
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, status: e.target.value }))
                    }
                  >
                    <option>Active</option>
                    <option>Inactive</option>
                  </select>
                </Field>

                <Field label="Agreement Start Date">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.startDate}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    required
                  />
                </Field>

                <Field label="Agreement End Date">
                  <input
                    type="date"
                    className={inputClass}
                    value={form.endDate}
                    min={form.startDate || undefined}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, endDate: e.target.value }))
                    }
                    required
                  />
                </Field>
              </div>
            </section>

            <div className="border-t border-slate-100" />

            {/* Rates */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                <IndianRupee size={18} className="text-blue-600" />
                Corporate Room Rates
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Discount Type">
                  <select
                    className={inputClass}
                    value={form.discountType}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountType: e.target.value,
                      }))
                    }
                  >
                    <option>Percentage</option>
                    <option>Fixed</option>
                  </select>
                </Field>

                <Field
                  label={
                    form.discountType === "Percentage"
                      ? "Discount Percentage (%)"
                      : "Fixed Discount (₹)"
                  }
                >
                  <input
                    type="number"
                    min="0"
                    max={form.discountType === "Percentage" ? "100" : undefined}
                    step="0.01"
                    className={inputClass}
                    value={form.discountValue}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        discountValue: e.target.value,
                      }))
                    }
                  />
                </Field>
              </div>

              <p className="text-sm font-medium text-slate-700">
                Eligible Room Types and Negotiated Rates *
              </p>

              <div className="space-y-3">
                {roomTypes.map((room) => (
                  <div
                    key={room}
                    className="grid grid-cols-1 items-center gap-3 rounded-lg border border-slate-200 p-3 sm:grid-cols-[1fr_1fr]"
                  >
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={form.eligibleRooms.includes(room)}
                        onChange={() => toggleRoom(room)}
                        className="h-4 w-4 accent-blue-600"
                      />
                      {room}
                    </label>

                    <div className="relative">
                      <IndianRupee
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="number"
                        min="1"
                        className={`${inputClass} pl-9`}
                        placeholder="Negotiated nightly rate"
                        value={form.roomRates[room]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            roomRates: {
                              ...prev.roomRates,
                              [room]: e.target.value,
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">
                Enter the agreed nightly room rate for each selected room type.
                Only selected room types will be eligible for this agreement.
              </p>
            </section>

            <div className="border-t border-slate-100" />

            {/* Payment Terms */}
            <section className="space-y-4">
              <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                <BriefcaseBusiness size={18} className="text-blue-600" />
                Payment Terms
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Payment Terms">
                  <select
                    className={inputClass}
                    value={form.paymentTerms}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        paymentTerms: e.target.value,
                      }))
                    }
                  >
                    <option>Immediate</option>
                    <option>7 Days</option>
                    <option>15 Days</option>
                    <option>30 Days</option>
                    <option>45 Days</option>
                  </select>
                </Field>

                <Field label="Credit Limit (₹)">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={form.creditLimit}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        creditLimit: e.target.value,
                      }))
                    }
                    placeholder="Enter approved credit limit"
                  />
                </Field>
              </div>
            </section>

            <Field label="Internal Notes">
              <textarea
                rows="3"
                className={inputClass}
                value={form.notes}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Agreement notes, special conditions..."
              />
            </Field>

            <div className="flex justify-end gap-2 border-t pt-4">
              <button
                type="button"
                onClick={() => setModal("")}
                className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                {selected ? "Update Company" : "Save Company"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Company Details and Booking History */}
      {activeCompany && (
        <Modal
          title="Corporate Client Details"
          onClose={() => setActiveCompany(null)}
          size="max-w-5xl"
        >
          <div className="space-y-6">
            <div className="flex flex-col justify-between gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-start">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {activeCompany.company}
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  {activeCompany.id} · {activeCompany.agreementNo || "No agreement number"}
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Users size={15} /> {activeCompany.contactPerson}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone size={15} /> {activeCompany.phone || "—"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail size={15} /> {activeCompany.email || "—"}
                  </span>
                </div>
              </div>
              <Badge color={statusColor(getAgreementStatus(activeCompany))}>
                {getAgreementStatus(activeCompany)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Corporate Bookings</p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  {activeCompany.bookings}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Invoices</p>
                <p className="mt-2 text-xl font-bold text-slate-800">
                  {activeCompany.invoices}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 p-4">
                <p className="text-xs text-slate-500">Outstanding</p>
                <p className="mt-2 text-xl font-bold text-orange-600">
                  {money(activeCompany.outstanding)}
                </p>
              </div>
            </div>

            <section>
              <h3 className="mb-3 font-semibold text-slate-800">
                Agreement Information
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Agreement Number", activeCompany.agreementNo || "—"],
                  ["Validity", `${formatDate(activeCompany.startDate)} – ${formatDate(activeCompany.endDate)}`],
                  ["Discount", activeCompany.discountType === "Percentage" ? `${activeCompany.discountValue}%` : money(activeCompany.discountValue)],
                  ["Payment Terms", activeCompany.paymentTerms],
                  ["Credit Limit", money(activeCompany.creditLimit)],
                  ["GSTIN", activeCompany.gstin || "Not provided"],
                  ["Address", activeCompany.address || "—"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 font-semibold text-slate-800">
                Negotiated Room Rates
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[450px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Room Type</th>
                      <th className="px-4 py-3">Corporate Rate / Night</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeCompany.eligibleRooms.map((room) => (
                      <tr key={room}>
                        <td className="px-4 py-3 text-slate-700">{room}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {money(activeCompany.roomRates[room])}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center gap-2">
                <History size={18} className="text-blue-600" />
                <h3 className="font-semibold text-slate-800">
                  Corporate Booking History
                </h3>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[750px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Booking ID</th>
                      <th className="px-4 py-3">Guest</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Stay</th>
                      <th className="px-4 py-3">Invoice</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {companyHistory.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-3 font-medium text-blue-600">
                          {booking.bookingId}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {booking.guest}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {booking.roomType}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {booking.invoiceNo}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {money(booking.amount)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            color={
                              booking.paymentStatus === "Paid"
                                ? "green"
                                : booking.paymentStatus === "Pending"
                                  ? "yellow"
                                  : "blue"
                            }
                          >
                            {booking.paymentStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                    {companyHistory.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                          No sample booking history is available for this company.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setActiveCompany(null);
                  openEdit(activeCompany);
                }}
                className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
              >
                Edit Corporate Client
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Information */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <CalendarDays size={20} className="shrink-0 text-blue-600" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Corporate rate application
            </h3>
            <p className="mt-1 text-xs leading-5 text-blue-800">
              During reservation, select the corporate company and validate its
              agreement dates, eligible room type and negotiated rate. Apply
              the agreed payment terms and credit limit to the corporate
              account. Corporate invoices and outstanding balances should be
              reconciled against actual payments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
