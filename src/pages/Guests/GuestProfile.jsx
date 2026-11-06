import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  UserRound,
  Users,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  CreditCard,
  IdCard,
  Heart,
  MessageSquare,
  Award,
  Activity,
  ChevronRight,
  MoreHorizontal,
  Download,
  Edit3,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  BedDouble,
  Wallet,
  FileText,
  ShieldCheck,
  Filter,
  ArrowUpRight,
  IndianRupee,
  CalendarCheck,
  Gift,
} from "lucide-react";

// ---------------------------------------------
// SAMPLE GUEST DATA
// ---------------------------------------------

const guestsData = [
  {
    id: "GST-001",
    name: "Rahul Sharma",
    initials: "RS",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    alternatePhone: "+91 98765 12345",
    gender: "Male",
    dob: "1995-08-15",
    nationality: "Indian",
    address: "Sector 18, Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    country: "India",
    pincode: "201301",
    idType: "Aadhaar Card",
    idNumber: "XXXX XXXX 4521",
    idVerified: true,
    guestSince: "2025-04-12",
    totalStays: 8,
    totalSpent: 48500,
    outstanding: 0,
    loyaltyTier: "Gold",
    loyaltyPoints: 1250,
    status: "Active",
    preferences: {
      room: "Deluxe Room",
      floor: "Upper Floor",
      bed: "King Bed",
      smoking: "Non-Smoking",
      food: "Vegetarian",
      language: "Hindi",
      payment: "UPI",
    },
    specialRequests: [
      { title: "Extra pillows", status: "Completed", date: "2026-10-12" },
      { title: "Early check-in", status: "Completed", date: "2026-09-05" },
      { title: "Vegetarian breakfast", status: "Active", date: "2026-11-02" },
    ],
    complaints: [
      {
        id: "CMP-001",
        subject: "AC cooling issue",
        date: "2026-09-05",
        status: "Resolved",
        description: "Air conditioning was not cooling properly.",
      },
    ],
    reservations: [
      {
        id: "RES-1025",
        room: "204",
        type: "Deluxe",
        checkIn: "2026-11-02",
        checkOut: "2026-11-05",
        amount: 7500,
        status: "Checked In",
      },
      {
        id: "RES-0892",
        room: "105",
        type: "Standard",
        checkIn: "2026-09-05",
        checkOut: "2026-09-07",
        amount: 4000,
        status: "Completed",
      },
      {
        id: "RES-0712",
        room: "301",
        type: "Premium",
        checkIn: "2026-07-12",
        checkOut: "2026-07-15",
        amount: 12000,
        status: "Completed",
      },
      {
        id: "RES-0501",
        room: "202",
        type: "Deluxe",
        checkIn: "2026-04-12",
        checkOut: "2026-04-14",
        amount: 6000,
        status: "Completed",
      },
    ],
    payments: [
      {
        id: "PAY-501",
        date: "2026-11-02",
        method: "UPI",
        amount: 5000,
        status: "Paid",
      },
      {
        id: "PAY-421",
        date: "2026-09-07",
        method: "Cash",
        amount: 4000,
        status: "Paid",
      },
      {
        id: "PAY-318",
        date: "2026-07-15",
        method: "Card",
        amount: 12000,
        status: "Paid",
      },
    ],
    activities: [
      {
        title: "Guest checked in",
        detail: "Room 204",
        date: "2026-11-02",
        time: "02:15 PM",
        type: "checkin",
      },
      {
        title: "Payment received",
        detail: "₹5,000 via UPI",
        date: "2026-11-02",
        time: "02:00 PM",
        type: "payment",
      },
      {
        title: "Reservation created",
        detail: "Reservation RES-1025",
        date: "2026-10-28",
        time: "11:30 AM",
        type: "reservation",
      },
      {
        title: "Profile updated",
        detail: "Contact information updated",
        date: "2026-09-07",
        time: "10:15 AM",
        type: "profile",
      },
    ],
  },
  {
    id: "GST-002",
    name: "Priya Verma",
    initials: "PV",
    email: "priya.verma@gmail.com",
    phone: "+91 91234 56780",
    alternatePhone: "",
    gender: "Female",
    dob: "1998-02-20",
    nationality: "Indian",
    address: "Vaishali Nagar",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    pincode: "302021",
    idType: "Driving License",
    idNumber: "RJ14 XXXX 8214",
    idVerified: true,
    guestSince: "2026-01-18",
    totalStays: 3,
    totalSpent: 18500,
    outstanding: 1500,
    loyaltyTier: "Silver",
    loyaltyPoints: 420,
    status: "Active",
    preferences: {
      room: "Standard Room",
      floor: "Lower Floor",
      bed: "Queen Bed",
      smoking: "Non-Smoking",
      food: "Vegetarian",
      language: "English",
      payment: "Card",
    },
    specialRequests: [
      { title: "Late checkout", status: "Pending", date: "2026-11-04" },
    ],
    complaints: [],
    reservations: [
      {
        id: "RES-1020",
        room: "108",
        type: "Standard",
        checkIn: "2026-11-04",
        checkOut: "2026-11-06",
        amount: 5500,
        status: "Reserved",
      },
      {
        id: "RES-0650",
        room: "201",
        type: "Deluxe",
        checkIn: "2026-06-15",
        checkOut: "2026-06-17",
        amount: 8000,
        status: "Completed",
      },
    ],
    payments: [
      {
        id: "PAY-502",
        date: "2026-11-04",
        method: "Card",
        amount: 4000,
        status: "Paid",
      },
      {
        id: "PAY-390",
        date: "2026-06-17",
        method: "UPI",
        amount: 8000,
        status: "Paid",
      },
    ],
    activities: [
      {
        title: "Reservation created",
        detail: "Reservation RES-1020",
        date: "2026-11-03",
        time: "04:00 PM",
        type: "reservation",
      },
      {
        title: "Payment received",
        detail: "₹4,000 via Card",
        date: "2026-11-04",
        time: "01:00 PM",
        type: "payment",
      },
    ],
  },
  {
    id: "GST-003",
    name: "Amit Singh",
    initials: "AS",
    email: "amit.singh@gmail.com",
    phone: "+91 99887 76655",
    alternatePhone: "",
    gender: "Male",
    dob: "1992-11-10",
    nationality: "Indian",
    address: "Civil Lines",
    city: "Bharatpur",
    state: "Rajasthan",
    country: "India",
    pincode: "321001",
    idType: "Aadhaar Card",
    idNumber: "XXXX XXXX 1234",
    idVerified: false,
    guestSince: "2025-11-10",
    totalStays: 5,
    totalSpent: 32000,
    outstanding: 2500,
    loyaltyTier: "Silver",
    loyaltyPoints: 680,
    status: "Active",
    preferences: {
      room: "Premium Room",
      floor: "Upper Floor",
      bed: "King Bed",
      smoking: "Non-Smoking",
      food: "No preference",
      language: "Hindi",
      payment: "Cash",
    },
    specialRequests: [],
    complaints: [
      {
        id: "CMP-002",
        subject: "Room service delay",
        date: "2026-10-20",
        status: "Open",
        description: "Room service took longer than expected.",
      },
    ],
    reservations: [
      {
        id: "RES-1005",
        room: "302",
        type: "Premium",
        checkIn: "2026-10-20",
        checkOut: "2026-10-22",
        amount: 9500,
        status: "Completed",
      },
      {
        id: "RES-0821",
        room: "205",
        type: "Deluxe",
        checkIn: "2026-08-21",
        checkOut: "2026-08-23",
        amount: 7000,
        status: "Completed",
      },
    ],
    payments: [
      {
        id: "PAY-480",
        date: "2026-10-22",
        method: "Cash",
        amount: 7000,
        status: "Paid",
      },
      {
        id: "PAY-401",
        date: "2026-08-23",
        method: "UPI",
        amount: 7000,
        status: "Paid",
      },
    ],
    activities: [
      {
        title: "Complaint submitted",
        detail: "Room service delay",
        date: "2026-10-21",
        time: "08:00 PM",
        type: "complaint",
      },
      {
        title: "Checkout completed",
        detail: "Room 302",
        date: "2026-10-22",
        time: "11:00 AM",
        type: "checkout",
      },
    ],
  },
];

const tabs = [
  { id: "personal", label: "Personal Information", icon: UserRound },
  { id: "contact", label: "Contact Details", icon: Phone },
  { id: "identification", label: "Identification", icon: IdCard },
  { id: "reservations", label: "Reservation History", icon: CalendarDays },
  { id: "payments", label: "Payment History", icon: CreditCard },
  { id: "preferences", label: "Preferences", icon: Heart },
  { id: "requests", label: "Special Requests", icon: MessageSquare },
  { id: "complaints", label: "Complaints & Feedback", icon: AlertCircle },
  { id: "loyalty", label: "Loyalty Information", icon: Award },
  { id: "activity", label: "Activity History", icon: Activity },
];

const formatDate = (date) =>
  new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function SectionCard({ title, description, action, children }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100">
        <div>
          <h3 className="font-semibold text-slate-800">{title}</h3>
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
          <Icon size={17} className="text-slate-500" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-800 break-words">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1.5">{label}</p>
      <div className="min-h-11 px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-100 text-sm text-slate-800">
        {value || "Not provided"}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Active: "bg-emerald-50 text-emerald-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Completed: "bg-emerald-50 text-emerald-700",
    Resolved: "bg-emerald-50 text-emerald-700",
    "Checked In": "bg-blue-50 text-blue-700",
    Reserved: "bg-blue-50 text-blue-700",
    Pending: "bg-amber-50 text-amber-700",
    Open: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] || "bg-slate-100 text-slate-600"}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------
// MAIN PAGE
// ---------------------------------------------

export default function GuestProfiles() {
  const [guests, setGuests] = useState(guestsData);
  const [selectedId, setSelectedId] = useState("GST-001");
  const [activeTab, setActiveTab] = useState("personal");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newGuest, setNewGuest] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const selectedGuest = guests.find((guest) => guest.id === selectedId);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) =>
      `${guest.name} ${guest.phone} ${guest.email} ${guest.id}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [guests, search]);

  const updateGuest = (field, value) => {
    setGuests((prev) =>
      prev.map((guest) =>
        guest.id === selectedId ? { ...guest, [field]: value } : guest,
      ),
    );
  };

  const handleAddGuest = (e) => {
    e.preventDefault();

    const guest = {
      id: `GST-${String(guests.length + 1).padStart(3, "0")}`,
      name: newGuest.name,
      initials: newGuest.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      email: newGuest.email,
      phone: newGuest.phone,
      alternatePhone: "",
      gender: "",
      dob: "",
      nationality: "Indian",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      idType: "",
      idNumber: "",
      idVerified: false,
      guestSince: new Date().toISOString().slice(0, 10),
      totalStays: 0,
      totalSpent: 0,
      outstanding: 0,
      loyaltyTier: "Bronze",
      loyaltyPoints: 0,
      status: "Active",
      preferences: {
        room: "No preference",
        floor: "No preference",
        bed: "No preference",
        smoking: "Non-Smoking",
        food: "No preference",
        language: "Hindi",
        payment: "No preference",
      },
      specialRequests: [],
      complaints: [],
      reservations: [],
      payments: [],
      activities: [
        {
          title: "Guest profile created",
          detail: "New guest registered",
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: "profile",
        },
      ],
    };

    setGuests((prev) => [...prev, guest]);
    setSelectedId(guest.id);
    setActiveTab("personal");
    setNewGuest({ name: "", email: "", phone: "" });
    setShowAddModal(false);
  };

  if (!selectedGuest) return null;

  // -------------------------------------------
  // TAB CONTENT
  // -------------------------------------------

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-5">
            <SectionCard
              title="Personal Information"
              description="Basic information about the registered guest."
              action={
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Edit3 size={15} /> Edit Details
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoItem
                  label="Full Name"
                  value={selectedGuest.name}
                  icon={UserRound}
                />
                <InfoItem
                  label="Guest ID"
                  value={selectedGuest.id}
                  icon={IdCard}
                />
                <InfoItem
                  label="Gender"
                  value={selectedGuest.gender}
                  icon={Users}
                />
                <InfoItem
                  label="Date of Birth"
                  value={selectedGuest.dob ? formatDate(selectedGuest.dob) : ""}
                  icon={CalendarDays}
                />
                <InfoItem
                  label="Nationality"
                  value={selectedGuest.nationality}
                  icon={MapPin}
                />
                <InfoItem
                  label="Guest Since"
                  value={formatDate(selectedGuest.guestSince)}
                  icon={CalendarCheck}
                />
              </div>
            </SectionCard>

            <SectionCard
              title="Guest Overview"
              description="Summary of the guest's relationship with the hotel."
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  ["Total Stays", selectedGuest.totalStays, BedDouble],
                  [
                    "Total Spending",
                    money(selectedGuest.totalSpent),
                    IndianRupee,
                  ],
                  ["Outstanding", money(selectedGuest.outstanding), Wallet],
                  ["Loyalty Points", selectedGuest.loyaltyPoints, Award],
                ].map(([label, value, Icon]) => (
                  <div
                    key={label}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <Icon size={19} className="text-slate-500 mb-3" />
                    <p className="text-lg font-bold text-slate-800">{value}</p>
                    <p className="text-xs text-slate-500 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-5">
            <SectionCard
              title="Contact Information"
              description="Guest's primary and alternate contact information."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Email Address"
                  value={selectedGuest.email}
                  icon={Mail}
                />
                <InfoItem
                  label="Primary Phone"
                  value={selectedGuest.phone}
                  icon={Phone}
                />
                <InfoItem
                  label="Alternate Phone"
                  value={selectedGuest.alternatePhone}
                  icon={Phone}
                />
              </div>
            </SectionCard>
            <SectionCard title="Residential Address">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoItem
                  label="Address"
                  value={selectedGuest.address}
                  icon={MapPin}
                />
                <InfoItem label="City" value={selectedGuest.city} />
                <InfoItem label="State" value={selectedGuest.state} />
                <InfoItem label="Country" value={selectedGuest.country} />
                <InfoItem label="PIN Code" value={selectedGuest.pincode} />
              </div>
            </SectionCard>
          </div>
        );

      case "identification":
        return (
          <div className="space-y-5">
            <SectionCard
              title="Identification Details"
              description="Guest identity verification and document records."
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoItem
                  label="Document Type"
                  value={selectedGuest.idType}
                  icon={FileText}
                />
                <InfoItem
                  label="Document Number"
                  value={selectedGuest.idNumber}
                  icon={IdCard}
                />
                <div>
                  <p className="text-xs text-slate-500 mb-2">
                    Verification Status
                  </p>
                  <StatusBadge
                    status={selectedGuest.idVerified ? "Completed" : "Pending"}
                  />
                </div>
                <InfoItem
                  label="Nationality"
                  value={selectedGuest.nationality}
                  icon={MapPin}
                />
              </div>
            </SectionCard>
            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50 flex gap-3">
              <ShieldCheck className="text-blue-600 shrink-0" size={22} />
              <div>
                <p className="text-sm font-semibold text-blue-900">
                  Identity Verification
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Verify original identification documents at check-in. Store
                  only necessary information and protect guest identity records.
                </p>
              </div>
            </div>
          </div>
        );

      case "reservations":
        return (
          <SectionCard
            title="Reservation History"
            description={`${selectedGuest.reservations.length} recorded reservations`}
          >
            {selectedGuest.reservations.length === 0 ? (
              <EmptyState text="No reservation history available." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="text-xs text-slate-500 border-b border-slate-100">
                      <th className="pb-3 font-medium">Reservation ID</th>
                      <th className="pb-3 font-medium">Room</th>
                      <th className="pb-3 font-medium">Check-in</th>
                      <th className="pb-3 font-medium">Check-out</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedGuest.reservations.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-50 text-sm"
                      >
                        <td className="py-4 font-medium text-blue-600">
                          {item.id}
                        </td>
                        <td className="py-4">
                          {item.room}{" "}
                          <span className="text-xs text-slate-400">
                            ({item.type})
                          </span>
                        </td>
                        <td className="py-4">{formatDate(item.checkIn)}</td>
                        <td className="py-4">{formatDate(item.checkOut)}</td>
                        <td className="py-4 font-medium">
                          {money(item.amount)}
                        </td>
                        <td className="py-4">
                          <StatusBadge status={item.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        );

      case "payments":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Total Spending"
                value={money(selectedGuest.totalSpent)}
                icon={Wallet}
              />
              <StatCard
                label="Outstanding Dues"
                value={money(selectedGuest.outstanding)}
                icon={AlertCircle}
              />
              <StatCard
                label="Transactions"
                value={selectedGuest.payments.length}
                icon={CreditCard}
              />
            </div>
            <SectionCard
              title="Payment Transactions"
              description="All recorded guest payments."
            >
              {selectedGuest.payments.length === 0 ? (
                <EmptyState text="No payment records available." />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[600px]">
                    <thead>
                      <tr className="text-xs text-slate-500 border-b border-slate-100">
                        <th className="pb-3 font-medium">Payment ID</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Payment Method</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGuest.payments.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-slate-50 text-sm"
                        >
                          <td className="py-4 font-medium">{item.id}</td>
                          <td className="py-4">{formatDate(item.date)}</td>
                          <td className="py-4">{item.method}</td>
                          <td className="py-4 font-semibold">
                            {money(item.amount)}
                          </td>
                          <td className="py-4">
                            <StatusBadge status={item.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SectionCard>
          </div>
        );

      case "preferences":
        return (
          <SectionCard
            title="Guest Preferences"
            description="Remember these preferences to improve the guest experience."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Preferred Room Type"
                value={selectedGuest.preferences.room}
              />
              <Field
                label="Preferred Floor"
                value={selectedGuest.preferences.floor}
              />
              <Field
                label="Preferred Bed Type"
                value={selectedGuest.preferences.bed}
              />
              <Field
                label="Smoking Preference"
                value={selectedGuest.preferences.smoking}
              />
              <Field
                label="Food Preference"
                value={selectedGuest.preferences.food}
              />
              <Field
                label="Preferred Language"
                value={selectedGuest.preferences.language}
              />
              <Field
                label="Preferred Payment Method"
                value={selectedGuest.preferences.payment}
              />
            </div>
            <p className="text-xs text-slate-400 mt-5">
              Preferences are intended to assist hotel staff and should be
              confirmed with the guest before each stay.
            </p>
          </SectionCard>
        );

      case "requests":
        return (
          <SectionCard
            title="Special Requests"
            description="Guest-specific services and accommodation requests."
            action={
              <button
                onClick={() => {
                  const title = window.prompt("Enter special request:");
                  if (title?.trim()) {
                    updateGuest("specialRequests", [
                      ...selectedGuest.specialRequests,
                      {
                        title: title.trim(),
                        status: "Pending",
                        date: new Date().toISOString().slice(0, 10),
                      },
                    ]);
                  }
                }}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium"
              >
                <Plus size={16} /> Add Request
              </button>
            }
          >
            {selectedGuest.specialRequests.length === 0 ? (
              <EmptyState text="No special requests recorded." />
            ) : (
              <div className="space-y-3">
                {selectedGuest.specialRequests.map((request, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-3 p-4 rounded-lg border border-slate-100"
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <MessageSquare size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {request.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(request.date)}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        );

      case "complaints":
        return (
          <SectionCard
            title="Complaints & Feedback"
            description="Guest complaints, service issues and resolutions."
            action={
              <button
                onClick={() => {
                  const subject = window.prompt(
                    "Enter complaint or feedback title:",
                  );
                  if (subject?.trim()) {
                    updateGuest("complaints", [
                      ...selectedGuest.complaints,
                      {
                        id: `CMP-${Date.now()}`,
                        subject: subject.trim(),
                        date: new Date().toISOString().slice(0, 10),
                        status: "Open",
                        description: "Details pending.",
                      },
                    ]);
                  }
                }}
                className="flex items-center gap-2 text-sm text-blue-600 font-medium"
              >
                <Plus size={16} /> Add Complaint
              </button>
            }
          >
            {selectedGuest.complaints.length === 0 ? (
              <EmptyState text="No complaints or feedback recorded for this guest." />
            ) : (
              <div className="space-y-4">
                {selectedGuest.complaints.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-100 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-sm font-semibold">{item.subject}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.id} · {formatDate(item.date)}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-sm text-slate-600 mt-3">
                      {item.description}
                    </p>
                    {item.status === "Open" && (
                      <button
                        onClick={() =>
                          updateGuest(
                            "complaints",
                            selectedGuest.complaints.map((c) =>
                              c.id === item.id
                                ? { ...c, status: "Resolved" }
                                : c,
                            ),
                          )
                        }
                        className="text-xs text-blue-600 font-medium mt-3 hover:underline"
                      >
                        Mark as resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        );

      case "loyalty":
        return (
          <div className="space-y-5">
            <div className="rounded-xl p-6 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute right-5 top-5 opacity-10">
                <Award size={110} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Award size={18} /> HOTEL AMAR PALACE REWARDS
                </div>
                <p className="text-xs text-slate-400 mt-6">
                  LOYALTY MEMBERSHIP
                </p>
                <h2 className="text-3xl font-bold mt-1">
                  {selectedGuest.loyaltyTier} Member
                </h2>
                <p className="text-sm text-slate-300 mt-5">
                  Guest ID: {selectedGuest.id}
                </p>
                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Available Points</p>
                    <p className="text-3xl font-bold mt-1">
                      {selectedGuest.loyaltyPoints.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <Star size={30} className="text-yellow-400" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="Membership Tier"
                value={selectedGuest.loyaltyTier}
                icon={Award}
              />
              <StatCard
                label="Available Points"
                value={selectedGuest.loyaltyPoints}
                icon={Star}
              />
              <StatCard
                label="Total Stays"
                value={selectedGuest.totalStays}
                icon={BedDouble}
              />
            </div>
            <SectionCard
              title="Loyalty Membership"
              description="Membership details and benefits."
            >
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Current Tier</span>
                  <span className="font-semibold">
                    {selectedGuest.loyaltyTier}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Points Balance</span>
                  <span className="font-semibold">
                    {selectedGuest.loyaltyPoints}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Membership Since</span>
                  <span className="font-semibold">
                    {formatDate(selectedGuest.guestSince)}
                  </span>
                </div>
              </div>
            </SectionCard>
          </div>
        );

      case "activity":
        return (
          <SectionCard
            title="Activity Timeline"
            description="Chronological record of guest interactions with the hotel."
          >
            {selectedGuest.activities.length === 0 ? (
              <EmptyState text="No activities recorded." />
            ) : (
              <div className="space-y-0">
                {selectedGuest.activities.map((item, index) => {
                  const Icon =
                    {
                      checkin: CalendarCheck,
                      checkout: CheckCircle2,
                      payment: CreditCard,
                      reservation: CalendarDays,
                      complaint: AlertCircle,
                      profile: UserRound,
                    }[item.type] || Activity;

                  return (
                    <div
                      key={index}
                      className="flex gap-4 relative pb-7 last:pb-0"
                    >
                      {index !== selectedGuest.activities.length - 1 && (
                        <div className="absolute left-5 top-10 bottom-0 w-px bg-slate-200" />
                      )}
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 relative z-10">
                        <Icon size={17} className="text-slate-600" />
                      </div>
                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatDate(item.date)} · {item.time}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Guests</span>
            <ChevronRight size={13} />
            <span className="text-slate-800">Guest Profiles</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 mt-2">
            Guest Profiles
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage guest information, reservations, payments and preferences.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 transition">
            <Download size={16} />
            Export
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm"
          >
            <Plus size={17} />
            Add Guest
          </button>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-[290px_minmax(0,1fr)] gap-4">
        {/* GUEST DIRECTORY */}
        <aside className="bg-white border border-slate-200 rounded-xl overflow-hidden h-fit">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800">Guest Directory</h2>

              <span className="text-xs px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                {guests.length} Guests
              </span>
            </div>

            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest..."
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50 transition"
              />
            </div>
          </div>

          <div className="max-h-[650px] overflow-y-auto p-2">
            {filteredGuests.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">
                No guests found.
              </p>
            ) : (
              filteredGuests.map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => {
                    setSelectedId(guest.id);
                    setActiveTab("personal");
                  }}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition mb-1 ${
                    selectedId === guest.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-slate-50 border border-transparent"
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-700 shrink-0">
                    {guest.initials}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {guest.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {guest.phone}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {guest.id}
                    </p>
                  </div>

                  {selectedId === guest.id && (
                    <ChevronRight
                      size={16}
                      className="text-blue-600 shrink-0"
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        {/* GUEST DETAILS */}
        <main className="min-w-0 space-y-4">
          {/* PROFILE HEADER */}
          <section className="bg-white border border-slate-200 rounded-xl p-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xl font-bold shrink-0">
                  {selectedGuest.initials}
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-slate-900">
                      {selectedGuest.name}
                    </h2>
                    <StatusBadge status={selectedGuest.status} />
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    {selectedGuest.id}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Mail size={13} />
                      {selectedGuest.email}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Phone size={13} />
                      {selectedGuest.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
                >
                  <Edit3 size={15} />
                  Edit Profile
                </button>

                <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition">
                  <MoreHorizontal size={19} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500">Guest Since</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {formatDate(selectedGuest.guestSince)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Stays</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {selectedGuest.totalStays}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Total Spent</p>
                <p className="text-sm font-semibold text-slate-800 mt-1">
                  {money(selectedGuest.totalSpent)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Membership</p>
                <p className="text-sm font-semibold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Award size={15} className="text-amber-500" />
                  {selectedGuest.loyaltyTier}
                </p>
              </div>
            </div>
          </section>

          {/* TABS */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="border-b border-slate-200 overflow-x-auto">
              <div className="flex min-w-max px-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 md:px-4 py-3.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-blue-600 text-blue-600 bg-blue-50/40"
                          : "border-transparent text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon size={16} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-[#F5F7FA]">{renderTabContent()}</div>
          </section>
        </main>
      </div>

      {/* ADD GUEST MODAL */}
      {showAddModal && (
        <Modal title="Add New Guest" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddGuest} className="space-y-4">
            <FieldInput
              label="Full Name"
              required
              value={newGuest.name}
              onChange={(value) => setNewGuest({ ...newGuest, name: value })}
            />

            <FieldInput
              label="Email Address"
              type="email"
              value={newGuest.email}
              onChange={(value) => setNewGuest({ ...newGuest, email: value })}
            />

            <FieldInput
              label="Phone Number"
              required
              value={newGuest.phone}
              onChange={(value) => setNewGuest({ ...newGuest, phone: value })}
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Create Guest
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* EDIT GUEST MODAL */}
      {showEditModal && (
        <Modal
          title="Edit Guest Profile"
          onClose={() => setShowEditModal(false)}
        >
          <div className="space-y-4">
            <FieldInput
              label="Full Name"
              value={selectedGuest.name}
              onChange={(value) => updateGuest("name", value)}
            />

            <FieldInput
              label="Email Address"
              type="email"
              value={selectedGuest.email}
              onChange={(value) => updateGuest("email", value)}
            />

            <FieldInput
              label="Phone Number"
              value={selectedGuest.phone}
              onChange={(value) => updateGuest("phone", value)}
            />

            <FieldInput
              label="Alternate Phone"
              value={selectedGuest.alternatePhone}
              onChange={(value) => updateGuest("alternatePhone", value)}
            />

            <FieldInput
              label="Address"
              value={selectedGuest.address}
              onChange={(value) => updateGuest("address", value)}
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setGuests((prev) =>
                    prev.map((guest) =>
                      guest.id === selectedId
                        ? {
                            ...guest,
                            initials: guest.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase(),
                          }
                        : guest,
                    ),
                  );

                  setShowEditModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------------------------------------------
// REUSABLE COMPONENTS
// ---------------------------------------------

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="p-4 bg-white border border-slate-200 rounded-xl hover:shadow-md transition">
      <div className="flex justify-between items-center">
        <p className="text-xs text-slate-500">{label}</p>
        <Icon size={18} className="text-blue-500" />
      </div>
      <p className="text-xl font-bold text-slate-800 mt-3">{value}</p>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="py-12 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
        <FileText size={21} className="text-slate-400" />
      </div>
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg"
          >
            <X size={19} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50"
      />
    </div>
  );
}
