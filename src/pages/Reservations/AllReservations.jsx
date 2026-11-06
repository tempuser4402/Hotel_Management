import { useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  Users,
  BedDouble,
  IndianRupee,
  Eye,
  X,
  Phone,
  Mail,
  Clock,
  Filter,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

import reservationsData from "./reservationData";

const statusStyles = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  "checked-in": "bg-green-50 text-green-700 border-green-200",
  "checked-out": "bg-purple-50 text-purple-700 border-purple-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  "no-show": "bg-slate-100 text-slate-600 border-slate-200",
};

const paymentStyles = {
  paid: "bg-green-50 text-green-700",
  partial: "bg-amber-50 text-amber-700",
  pending: "bg-red-50 text-red-700",
  refunded: "bg-purple-50 text-purple-700",
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const formatLabel = (value = "") =>
  value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function AllReservations() {
  const [reservations] = useState(reservationsData);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const [roomType, setRoomType] = useState("all");
  const [paymentStatus, setPaymentStatus] = useState("all");
  const [bookingSource, setBookingSource] = useState("all");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedReservation, setSelectedReservation] = useState(null);

  // Summary statistics
  const totalReservations = reservations.length;

  const confirmedCount = reservations.filter(
    (item) => item.status === "confirmed",
  ).length;

  const pendingCount = reservations.filter(
    (item) => item.status === "pending",
  ).length;

  const cancelledCount = reservations.filter(
    (item) => item.status === "cancelled",
  ).length;

  // Status tabs
  const tabs = [
    { id: "all", label: "All", count: totalReservations },
    { id: "confirmed", label: "Confirmed", count: confirmedCount },
    { id: "pending", label: "Pending", count: pendingCount },
    {
      id: "checked-in",
      label: "Checked In",
      count: reservations.filter((item) => item.status === "checked-in").length,
    },
    {
      id: "checked-out",
      label: "Checked Out",
      count: reservations.filter((item) => item.status === "checked-out")
        .length,
    },
    { id: "cancelled", label: "Cancelled", count: cancelledCount },
    {
      id: "no-show",
      label: "No Show",
      count: reservations.filter((item) => item.status === "no-show").length,
    },
  ];

  // Search and filter logic
  const filteredReservations = useMemo(() => {
    return reservations
      .filter((item) => {
        if (activeTab !== "all" && item.status !== activeTab) {
          return false;
        }

        return true;
      })
      .filter((item) => {
        const query = search.toLowerCase().trim();

        if (!query) return true;

        return (
          item.reservationId.toLowerCase().includes(query) ||
          item.guest.name.toLowerCase().includes(query) ||
          item.guest.phone.toLowerCase().includes(query) ||
          item.guest.email.toLowerCase().includes(query) ||
          item.room.roomNumber.toLowerCase().includes(query)
        );
      })
      .filter((item) => {
        if (roomType !== "all" && item.room.roomType !== roomType) {
          return false;
        }

        return true;
      })
      .filter((item) => {
        if (paymentStatus !== "all" && item.payment.status !== paymentStatus) {
          return false;
        }

        return true;
      })
      .filter((item) => {
        if (bookingSource !== "all" && item.bookingSource !== bookingSource) {
          return false;
        }

        return true;
      })
      .filter((item) => {
        if (startDate && item.checkIn < startDate) return false;
        if (endDate && item.checkIn > endDate) return false;

        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [
    reservations,
    activeTab,
    search,
    roomType,
    paymentStatus,
    bookingSource,
    startDate,
    endDate,
  ]);

  const resetFilters = () => {
    setSearch("");
    setActiveTab("all");
    setRoomType("all");
    setPaymentStatus("all");
    setBookingSource("all");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters =
    search ||
    activeTab !== "all" ||
    roomType !== "all" ||
    paymentStatus !== "all" ||
    bookingSource !== "all" ||
    startDate ||
    endDate;

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays size={23} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">
              All Reservations
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage, monitor and track all hotel reservations.
          </p>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          onClick={() =>
            alert("New reservation form will be implemented next.")
          }
        >
          <span className="text-lg leading-none">+</span>
          New Reservation
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Reservations"
          value={totalReservations}
          subtitle="All recorded bookings"
          icon={CalendarDays}
          color="blue"
        />

        <SummaryCard
          title="Confirmed"
          value={confirmedCount}
          subtitle="Confirmed bookings"
          icon={CalendarDays}
          color="green"
        />

        <SummaryCard
          title="Pending"
          value={pendingCount}
          subtitle="Awaiting confirmation"
          icon={Clock}
          color="amber"
        />

        <SummaryCard
          title="Cancelled"
          value={cancelledCount}
          subtitle="Cancelled bookings"
          icon={FileText}
          color="red"
        />
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Status Tabs */}
        <div className="flex gap-6 overflow-x-auto border-b border-slate-200 px-5 pt-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 pb-3 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.label}

              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-blue-600" />
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reservation ID, guest, phone or room..."
              className="w-full rounded-lg border border-slate-200 bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter size={16} className="text-slate-400" />
            Filters
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Check-in From
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Check-in To
              </label>
              <input
                type="date"
                min={startDate || undefined}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="all">All Room Types</option>
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="Suite">Suite</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-500">
                Booking Source
              </label>
              <select
                value={bookingSource}
                onChange={(e) => setBookingSource(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400"
              >
                <option value="all">All Sources</option>
                <option value="direct">Direct</option>
                <option value="website">Website</option>
                <option value="walk-in">Walk-in</option>
                <option value="phone">Phone</option>
                <option value="ota">OTA</option>
              </select>
            </div>
          </div>

          {hasFilters && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                <RotateCcw size={14} />
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5 text-left">
            <thead className="bg-slate-50">
              <tr className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-5 py-4">Reservation / Guest</th>
                <th className="px-5 py-4">Room</th>
                <th className="px-5 py-4">Stay Details</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Payment</th>
                <th className="px-5 py-4">Source</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredReservations.length > 0 ? (
                filteredReservations.map((item) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    {/* Guest */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.reservationId}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {item.guest.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {item.guest.phone}
                      </p>
                    </td>

                    {/* Room */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-medium text-slate-700">
                        Room {item.room.roomNumber}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.room.roomType}
                      </p>
                    </td>

                    {/* Dates */}
                    <td className="px-5 py-4">
                      <p className="whitespace-nowrap text-sm text-slate-700">
                        {formatDate(item.checkIn)}
                      </p>
                      <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                        to {formatDate(item.checkOut)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.nights} nights ·{" "}
                        {item.guests.adults + item.guests.children} guests
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {formatCurrency(item.pricing.totalAmount)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Total amount
                      </p>
                    </td>

                    {/* Payment */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                          paymentStyles[item.payment.status]
                        }`}
                      >
                        {item.payment.status}
                      </span>
                      <p className="mt-1.5 whitespace-nowrap text-xs text-slate-500">
                        Paid: {formatCurrency(item.payment.paidAmount)}
                      </p>
                    </td>

                    {/* Source */}
                    <td className="px-5 py-4">
                      <span className="text-sm text-slate-600">
                        {formatLabel(item.bookingSource)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium ${
                          statusStyles[item.status]
                        }`}
                      >
                        {formatLabel(item.status)}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedReservation(item)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Eye size={15} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <CalendarDays
                      size={32}
                      className="mx-auto text-slate-300"
                    />
                    <p className="mt-3 font-semibold text-slate-700">
                      No reservations found
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      Try changing your search or filter criteria.
                    </p>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col justify-between gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center">
          <span>
            Showing {filteredReservations.length} of {totalReservations}{" "}
            reservations
          </span>

          <span>Sorted by latest booking first</span>
        </div>
      </div>

      {/* Details Drawer */}
      {selectedReservation && (
        <ReservationDetails
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}

// Summary Card
function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-800">{value}</h2>
          <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${colors[color]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

// Reservation Details Drawer
function ReservationDetails({ reservation, onClose }) {
  const { guest, room, pricing, payment } = reservation;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="font-semibold text-slate-800">
              Reservation Details
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {reservation.reservationId}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 space-y-6 p-5">
          {/* Reservation Status */}
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-md border px-3 py-1.5 text-xs font-medium ${statusStyles[reservation.status]}`}
            >
              {formatLabel(reservation.status)}
            </span>

            <span
              className={`rounded-md px-3 py-1.5 text-xs font-medium ${paymentStyles[payment.status]}`}
            >
              Payment {formatLabel(payment.status)}
            </span>
          </div>

          {/* Guest Information */}
          <section>
            <SectionTitle icon={Users} title="Guest Information" />

            <div className="mt-4 rounded-xl border border-slate-200 p-4">
              <h3 className="font-semibold text-slate-800">{guest.name}</h3>

              <div className="mt-3 space-y-3">
                <InfoRow icon={Phone} value={guest.phone} />
                <InfoRow icon={Mail} value={guest.email} />
              </div>
            </div>
          </section>

          {/* Room Information */}
          <section>
            <SectionTitle icon={BedDouble} title="Room Information" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoCard label="Room Number" value={room.roomNumber} />
              <InfoCard label="Room Type" value={room.roomType} />
              <InfoCard label="Adults" value={reservation.guests.adults} />
              <InfoCard label="Children" value={reservation.guests.children} />
            </div>
          </section>

          {/* Stay Information */}
          <section>
            <SectionTitle icon={CalendarDays} title="Stay Information" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoCard
                label="Check-in"
                value={formatDate(reservation.checkIn)}
              />
              <InfoCard
                label="Check-out"
                value={formatDate(reservation.checkOut)}
              />
              <InfoCard
                label="Duration"
                value={`${reservation.nights} Nights`}
              />
              <InfoCard
                label="Booking Source"
                value={formatLabel(reservation.bookingSource)}
              />
            </div>
          </section>

          {/* Pricing */}
          <section>
            <SectionTitle icon={IndianRupee} title="Price Breakdown" />

            <div className="mt-4 space-y-3 rounded-xl border border-slate-200 p-4">
              <PriceRow label="Room Charges" amount={pricing.roomCharges} />
              <PriceRow label="Extra Charges" amount={pricing.extraCharges} />
              <PriceRow label="Discount" amount={-pricing.discount} />
              <PriceRow label="Tax" amount={pricing.tax} />

              <div className="border-t border-dashed border-slate-200 pt-3">
                <PriceRow
                  label="Total Amount"
                  amount={pricing.totalAmount}
                  strong
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <SectionTitle icon={IndianRupee} title="Payment Information" />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoCard
                label="Paid Amount"
                value={formatCurrency(payment.paidAmount)}
                valueColor="text-green-600"
              />
              <InfoCard
                label="Pending Amount"
                value={formatCurrency(payment.pendingAmount)}
                valueColor="text-amber-600"
              />
              <InfoCard
                label="Payment Status"
                value={formatLabel(payment.status)}
              />
              <InfoCard
                label="Payment Method"
                value={payment.method || "Not recorded"}
              />
            </div>
          </section>

          {/* Requests and Notes */}
          <section>
            <SectionTitle icon={FileText} title="Requests & Notes" />

            <div className="mt-4 space-y-3">
              <InfoCard
                label="Special Requests"
                value={reservation.specialRequests || "No special requests"}
              />
              <InfoCard
                label="Internal Notes"
                value={reservation.notes || "No additional notes"}
              />
            </div>
          </section>

          {/* Booking Created */}
          <div className="text-xs text-slate-400">
            Reservation created:{" "}
            {new Date(reservation.createdAt).toLocaleString("en-IN")}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="border-t border-slate-200 p-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={17} className="text-blue-600" />
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
    </div>
  );
}

function InfoRow({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon size={15} className="text-slate-400" />
      {value}
    </div>
  );
}

function InfoCard({ label, value, valueColor = "text-slate-800" }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${valueColor}`}>{value}</p>
    </div>
  );
}

function PriceRow({ label, amount, strong = false }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`text-sm ${strong ? "font-semibold text-slate-800" : "text-slate-500"}`}
      >
        {label}
      </span>

      <span
        className={`text-sm ${strong ? "font-bold text-slate-900" : "font-medium text-slate-700"}`}
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
