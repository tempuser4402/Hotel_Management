
import { useMemo, useState } from "react";
import {
  Search,
  X,
  CalendarDays,
  IndianRupee,
  ClipboardList,
  Ban,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  RotateCcw,
  Wallet,
  ArrowRight,
  History,
  UserRound,
  BedDouble,
} from "lucide-react";

import reservationsData from "./reservationData";

// --------------------------------
// HELPERS
// --------------------------------

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
};

const cancellationReasons = [
  "Guest requested cancellation",
  "Change in travel plans",
  "Booking made by mistake",
  "Duplicate reservation",
  "Payment issue",
  "Room unavailable",
  "Hotel initiated cancellation",
  "Other",
];

const initialCancellationForm = {
  reason: "Guest requested cancellation",
  otherReason: "",
  cancellationDate: getToday(),
  cancellationCharge: "0",
  refundEligible: true,
  refundMethod: "Original Payment Method",
  notes: "",
};

// --------------------------------
// COMPONENT
// --------------------------------

export default function Cancellations() {
  // Keep a local copy so cancellation actions do not mutate the imported data.
  const [reservations, setReservations] = useState(() =>
    reservationsData.map((reservation) => ({
      ...reservation,
      guest: { ...reservation.guest },
      room: { ...reservation.room },
      pricing: { ...reservation.pricing },
      payment: { ...reservation.payment },
      cancellation: reservation.cancellation
        ? { ...reservation.cancellation }
        : null,
    })),
  );

  const [activeTab, setActiveTab] = useState("eligible");
  const [search, setSearch] = useState("");

  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showCancellationModal, setShowCancellationModal] = useState(false);

  const [form, setForm] = useState(initialCancellationForm);
  const [formError, setFormError] = useState("");

  const today = getToday();

  // --------------------------------
  // FORM HANDLERS
  // --------------------------------

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
  };

  const openCancellation = (reservation) => {
    setSelectedReservation(reservation);

    setForm({
      ...initialCancellationForm,
      cancellationDate: today,
      cancellationCharge: "0",
      refundEligible: numberValue(
        reservation.payment?.paidAmount,
      ) > 0,
    });

    setFormError("");
    setShowCancellationModal(true);
  };

  const closeCancellation = () => {
    setShowCancellationModal(false);
    setSelectedReservation(null);
    setForm(initialCancellationForm);
    setFormError("");
  };

  // --------------------------------
  // CANCELLATION CALCULATIONS
  // --------------------------------

  const selectedPaidAmount = numberValue(
    selectedReservation?.payment?.paidAmount,
  );

  const selectedCancellationCharge = numberValue(
    form.cancellationCharge,
  );

  const selectedRefundAmount = form.refundEligible
    ? Math.max(
        selectedPaidAmount - selectedCancellationCharge,
        0,
      )
    : 0;

  const cancellationChargeDue = Math.max(
    selectedCancellationCharge - selectedPaidAmount,
    0,
  );

  const selectedRefundExcess = Math.max(
    selectedPaidAmount - selectedCancellationCharge,
    0,
  );

  // --------------------------------
  // RESERVATION FILTERS
  // --------------------------------

  const eligibleReservations = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.status !== "cancelled" &&
        reservation.status !== "checked-out",
    );
  }, [reservations]);

  const cancelledReservations = useMemo(() => {
    return reservations.filter(
      (reservation) => reservation.status === "cancelled",
    );
  }, [reservations]);

  const currentList =
    activeTab === "eligible"
      ? eligibleReservations
      : cancelledReservations;

  const filteredReservations = currentList.filter((reservation) => {
    const query = search.toLowerCase();

    return (
      reservation.guest?.name?.toLowerCase().includes(query) ||
      reservation.reservationId?.toLowerCase().includes(query) ||
      reservation.room?.roomNumber?.toLowerCase().includes(query) ||
      reservation.guest?.phone?.includes(query)
    );
  });

  // --------------------------------
  // STATISTICS
  // --------------------------------

  const totalCancelled = cancelledReservations.length;

  const totalRefunds = cancelledReservations.reduce(
    (total, reservation) =>
      total +
      numberValue(reservation.cancellation?.refundAmount),
    0,
  );

  const pendingRefunds = cancelledReservations.reduce(
    (total, reservation) => {
      if (
        reservation.cancellation?.refundStatus === "pending"
      ) {
        return total +
          numberValue(reservation.cancellation?.refundAmount);
      }

      return total;
    },
    0,
  );

  const totalCancellationCharges = cancelledReservations.reduce(
    (total, reservation) =>
      total +
      numberValue(reservation.cancellation?.cancellationCharge),
    0,
  );

  // --------------------------------
  // PROCESS CANCELLATION
  // --------------------------------

  const handleCancellation = (e) => {
    e.preventDefault();

    if (!selectedReservation) return;

    if (!form.reason) {
      setFormError("Please select a cancellation reason.");
      return;
    }

    if (
      form.reason === "Other" &&
      !form.otherReason.trim()
    ) {
      setFormError("Please enter the cancellation reason.");
      return;
    }

    if (!form.cancellationDate) {
      setFormError("Please select the cancellation date.");
      return;
    }

    if (form.cancellationDate > today) {
      setFormError("Cancellation date cannot be in the future.");
      return;
    }

    const reason =
      form.reason === "Other"
        ? form.otherReason.trim()
        : form.reason;

    const cancellationCharge = selectedCancellationCharge;

    const refundAmount = form.refundEligible
      ? Math.max(selectedPaidAmount - cancellationCharge, 0)
      : 0;

    const outstandingCancellationCharge = Math.max(
      cancellationCharge - selectedPaidAmount,
      0,
    );

    const refundStatus =
      refundAmount > 0
        ? "pending"
        : "not-required";

    const cancellationRecord = {
      reason,
      cancellationDate: form.cancellationDate,
      cancellationCharge,
      refundEligible: form.refundEligible,
      refundAmount,
      refundMethod: form.refundMethod,
      refundStatus,
      refundProcessedAt: null,
      outstandingCancellationCharge,
      notes: form.notes.trim(),
      cancelledAt: new Date().toISOString(),
    };

    setReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === selectedReservation.id
          ? {
              ...reservation,

              // Preserve original booking and payment information.
              status: "cancelled",

              cancellation: cancellationRecord,
            }
          : reservation,
      ),
    );

    setActiveTab("history");
    closeCancellation();
  };

  // --------------------------------
  // MARK REFUND AS PROCESSED
  // --------------------------------

  const handleRefundProcessed = (reservationId) => {
    const confirmed = window.confirm(
      "Have you actually refunded the amount to the guest? This will mark the refund as processed.",
    );

    if (!confirmed) return;

    setReservations((prev) =>
      prev.map((reservation) => {
        if (reservation.id !== reservationId) {
          return reservation;
        }

        return {
          ...reservation,

          cancellation: {
            ...reservation.cancellation,
            refundStatus: "processed",
            refundProcessedAt: new Date().toISOString(),
          },

          // Keep the original paidAmount unchanged.
          // Record the refund separately for financial history.
          payment: {
            ...reservation.payment,
            refundedAmount: numberValue(
              reservation.cancellation?.refundAmount,
            ),
          },
        };
      }),
    );
  };

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Cancellation Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage cancelled bookings, refunds and cancellation history.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays size={17} />
          {formatDate(today)}
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Cancelled Reservations
            </p>
            <Ban size={20} className="text-red-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {totalCancelled}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Total Refunds
            </p>
            <IndianRupee size={20} className="text-emerald-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {currency(totalRefunds)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Pending Refunds
            </p>
            <Clock size={20} className="text-amber-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {currency(pendingRefunds)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Cancellation Charges
            </p>
            <Receipt size={20} className="text-blue-600" />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {currency(totalCancellationCharges)}
          </h2>
        </div>
      </div>

      {/* TABS AND SEARCH */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Reservation Records
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review eligible reservations or access cancellation history.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setActiveTab("eligible")}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  activeTab === "eligible"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Eligible ({eligibleReservations.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`rounded-md px-4 py-2 text-sm font-medium ${
                  activeTab === "history"
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                History ({totalCancelled})
              </button>
            </div>

            <div className="relative sm:w-64">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest or booking..."
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* RESERVATION LIST */}
        <div className="divide-y divide-slate-100">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => {
              const cancellation = reservation.cancellation;

              return (
                <div
                  key={reservation.id}
                  className="flex flex-col justify-between gap-4 p-5 xl:flex-row xl:items-center"
                >
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-slate-900">
                        {reservation.guest.name}
                      </h3>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {reservation.reservationId}
                      </span>

                      {activeTab === "history" && (
                        <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                          Cancelled
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <BedDouble size={15} />
                        Room {reservation.room.roomNumber}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <CalendarDays size={15} />
                        {formatDate(reservation.checkIn)} -{" "}
                        {formatDate(reservation.checkOut)}
                      </span>

                      <span className="flex items-center gap-1.5">
                        <IndianRupee size={15} />
                        {currency(reservation.pricing.totalAmount)}
                      </span>
                    </div>

                    {activeTab === "history" && cancellation && (
                      <div className="mt-3 space-y-1 text-sm">
                        <p className="text-slate-600">
                          <strong>Reason:</strong> {cancellation.reason}
                        </p>

                        <p className="text-slate-500">
                          <strong>Cancellation Date:</strong>{" "}
                          {formatDate(cancellation.cancellationDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ELIGIBLE ACTION */}
                  {activeTab === "eligible" ? (
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="sm:mr-4">
                        <p className="text-xs text-slate-500">
                          Amount Received
                        </p>

                        <p className="font-semibold text-slate-900">
                          {currency(reservation.payment.paidAmount)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => openCancellation(reservation)}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                      >
                        <Ban size={16} />
                        Cancel Reservation
                      </button>
                    </div>
                  ) : (
                    /* CANCELLATION HISTORY DETAILS */
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <div className="grid grid-cols-2 gap-x-5 gap-y-2 text-sm">
                        <div>
                          <p className="text-xs text-slate-500">
                            Cancellation Fee
                          </p>
                          <p className="font-semibold text-slate-900">
                            {currency(cancellation?.cancellationCharge)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Refund Amount
                          </p>
                          <p className="font-semibold text-emerald-600">
                            {currency(cancellation?.refundAmount)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Refund Status
                          </p>

                          <span
                            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                              cancellation?.refundStatus === "processed"
                                ? "bg-emerald-100 text-emerald-700"
                                : cancellation?.refundStatus === "pending"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {cancellation?.refundStatus === "processed"
                              ? "Processed"
                              : cancellation?.refundStatus === "pending"
                                ? "Pending"
                                : "Not Required"}
                          </span>
                        </div>
                      </div>

                      {cancellation?.refundStatus === "pending" && (
                        <button
                          type="button"
                          onClick={() =>
                            handleRefundProcessed(reservation.id)
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 px-3 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={16} />
                          Mark Refunded
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="px-5 py-14 text-center">
              {activeTab === "history" ? (
                <History
                  size={36}
                  className="mx-auto mb-3 text-slate-300"
                />
              ) : (
                <ClipboardList
                  size={36}
                  className="mx-auto mb-3 text-slate-300"
                />
              )}

              <h3 className="font-semibold text-slate-700">
                {activeTab === "history"
                  ? "No cancellation history"
                  : "No eligible reservations"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {activeTab === "history"
                  ? "Cancelled reservations will appear here."
                  : "There are currently no reservations available for cancellation."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* CANCELLATION MODAL */}
      {showCancellationModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Cancel Reservation
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Booking: {selectedReservation.reservationId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCancellation}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCancellation}>
              <div className="space-y-6 p-5 sm:p-6">
                {/* GUEST SUMMARY */}
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <UserRound size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-900">
                      Reservation Details
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs text-slate-500">Guest</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {selectedReservation.guest.name}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">Room</p>
                      <p className="mt-1 font-medium text-slate-900">
                        {selectedReservation.room.roomNumber} -{" "}
                        {selectedReservation.room.roomType}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Check-in
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(selectedReservation.checkIn)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-500">
                        Check-out
                      </p>
                      <p className="mt-1 font-medium text-slate-900">
                        {formatDate(selectedReservation.checkOut)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CANCELLATION DETAILS */}
                <div>
                  <h3 className="mb-4 font-semibold text-slate-900">
                    Cancellation Details
                  </h3>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Cancellation Reason
                      </label>

                      <select
                        value={form.reason}
                        onChange={(e) =>
                          updateField("reason", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      >
                        {cancellationReasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {reason}
                          </option>
                        ))}
                      </select>
                    </div>

                    {form.reason === "Other" && (
                      <div className="sm:col-span-2">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Specify Reason
                        </label>

                        <input
                          type="text"
                          value={form.otherReason}
                          onChange={(e) =>
                            updateField("otherReason", e.target.value)
                          }
                          placeholder="Enter cancellation reason"
                          className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Cancellation Date
                      </label>

                      <input
                        type="date"
                        max={today}
                        value={form.cancellationDate}
                        onChange={(e) =>
                          updateField(
                            "cancellationDate",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Cancellation Charges (₹)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.cancellationCharge}
                        onChange={(e) =>
                          updateField(
                            "cancellationCharge",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* REFUND ELIGIBILITY */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <h3 className="font-semibold text-slate-900">
                    Refund Eligibility
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Determine whether the guest is eligible for a refund
                    according to your hotel's cancellation policy.
                  </p>

                  <label className="mt-4 flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={form.refundEligible}
                      onChange={(e) =>
                        updateField("refundEligible", e.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-blue-600"
                    />

                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        Guest is eligible for a refund
                      </span>

                      <span className="mt-1 block text-xs text-slate-500">
                        Uncheck if the booking is non-refundable under
                        your cancellation policy.
                      </span>
                    </span>
                  </label>

                  {form.refundEligible && (
                    <div className="mt-4">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Refund Method
                      </label>

                      <select
                        value={form.refundMethod}
                        onChange={(e) =>
                          updateField("refundMethod", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                      >
                        <option value="Original Payment Method">
                          Original Payment Method
                        </option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">
                          Bank Transfer
                        </option>
                      </select>
                    </div>
                  )}
                </div>

                {/* PAYMENT ADJUSTMENT */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Wallet size={19} className="text-blue-600" />
                    <h3 className="font-semibold text-slate-900">
                      Payment Adjustment
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Original Booking Amount
                      </span>
                      <strong>
                        {currency(
                          selectedReservation.pricing.totalAmount,
                        )}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Amount Already Received
                      </span>
                      <strong className="text-emerald-600">
                        {currency(selectedPaidAmount)}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Cancellation Charges
                      </span>
                      <strong className="text-red-600">
                        {currency(selectedCancellationCharge)}
                      </strong>
                    </div>

                    <div className="flex justify-between border-t border-slate-200 pt-3">
                      <span className="font-semibold text-slate-900">
                        Refund Amount
                      </span>

                      <strong className="text-lg text-emerald-600">
                        {currency(selectedRefundAmount)}
                      </strong>
                    </div>

                    {cancellationChargeDue > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Additional Cancellation Charge Due
                        </span>
                        <strong className="text-red-600">
                          {currency(cancellationChargeDue)}
                        </strong>
                      </div>
                    )}

                    {!form.refundEligible && (
                      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                        Refund is marked as not eligible. The received
                        amount will remain in the original payment
                        history. Verify the hotel's cancellation policy
                        before confirming.
                      </div>
                    )}

                    {form.refundEligible &&
                      selectedRefundExcess === 0 &&
                      selectedPaidAmount > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                          No refund is payable because the cancellation
                          charge is equal to or greater than the amount
                          received.
                        </div>
                      )}
                  </div>
                </div>

                {/* NOTES */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Internal Notes
                  </label>

                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(e) =>
                      updateField("notes", e.target.value)
                    }
                    placeholder="Add any additional cancellation details..."
                    className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* WARNING */}
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <AlertCircle
                    size={19}
                    className="mt-0.5 shrink-0 text-amber-600"
                  />

                  <p className="text-xs leading-5 text-amber-800">
                    Cancelling this reservation will preserve its original
                    booking and payment information. The reservation will
                    not be deleted. A pending refund must be processed
                    separately.
                  </p>
                </div>

                {formError && (
                  <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {formError}
                  </p>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="sticky bottom-0 flex flex-wrap justify-between gap-3 border-t border-slate-200 bg-white p-5 sm:p-6">
                <button
                  type="button"
                  onClick={closeCancellation}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Close
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700"
                >
                  <Ban size={16} />
                  Confirm Cancellation
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
