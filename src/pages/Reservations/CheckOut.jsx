
import { useMemo, useState } from "react";
import {
  Search,
  LogOut,
  CalendarDays,
  Users,
  BedDouble,
  IndianRupee,
  ClipboardList,
  X,
  Receipt,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
} from "lucide-react";

import reservationsData from "./reservationData";

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

const initialBilling = {
  restaurantCharges: "0",
  roomServiceCharges: "0",
  otherCharges: "0",
  damageCharges: "0",
  discount: "0",
  tax: "0",
};

const initialPayment = {
  amountReceived: "0",
  paymentMethod: "Cash",
  depositApplied: "0",
  refundMethod: "Cash",
};

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
};

export default function CheckOut() {
  const [search, setSearch] = useState("");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const [billing, setBilling] = useState(initialBilling);
  const [payment, setPayment] = useState(initialPayment);

  const today = getToday();

  const updateBilling = (field, value) => {
    setBilling((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updatePayment = (field, value) => {
    setPayment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Open checkout modal
  const openCheckout = (reservation) => {
    setSelectedReservation(reservation);
    setShowCheckoutModal(true);

    setShowBilling(false);
    setShowPayment(false);

    setBilling({
      ...initialBilling,
      discount: String(reservation.pricing.discount || 0),
      tax: String(reservation.pricing.tax || 0),
    });

    setPayment(initialPayment);
  };

  // Close checkout modal
  const closeCheckout = () => {
    setShowCheckoutModal(false);
    setShowBilling(false);
    setShowPayment(false);

    setSelectedReservation(null);
    setBilling(initialBilling);
    setPayment(initialPayment);
  };

  // Today's departures and overdue departures
  const departures = useMemo(() => {
    return reservationsData.filter(
      (reservation) =>
        reservation.status === "checked-in" &&
        reservation.checkOut <= today,
    );
  }, [today]);

  const filteredDepartures = departures.filter((reservation) => {
    const query = search.toLowerCase();

    return (
      reservation.guest.name.toLowerCase().includes(query) ||
      reservation.reservationId.toLowerCase().includes(query) ||
      reservation.room.roomNumber.toLowerCase().includes(query) ||
      reservation.guest.phone.includes(query)
    );
  });

  const totalPending = departures.reduce(
    (total, reservation) =>
      total + numberValue(reservation.payment.pendingAmount),
    0,
  );

  // --------------------------------
  // BILLING CALCULATIONS
  // --------------------------------

  const roomCharges = numberValue(
    selectedReservation?.pricing.roomCharges,
  );

  const existingExtraCharges = numberValue(
    selectedReservation?.pricing.extraCharges,
  );

  const alreadyPaid = numberValue(
    selectedReservation?.payment.paidAmount,
  );

  const restaurantCharges = numberValue(billing.restaurantCharges);
  const roomServiceCharges = numberValue(billing.roomServiceCharges);
  const otherCharges = numberValue(billing.otherCharges);
  const damageCharges = numberValue(billing.damageCharges);
  const discount = numberValue(billing.discount);
  const tax = numberValue(billing.tax);

  const additionalCharges =
    restaurantCharges +
    roomServiceCharges +
    otherCharges +
    damageCharges;

  const grossAmount =
    roomCharges + existingExtraCharges + additionalCharges;

  const subtotal = Math.max(grossAmount - discount, 0);

  const grandTotal = subtotal + tax;

  const pendingAmount = Math.max(grandTotal - alreadyPaid, 0);

  const excessPayment = Math.max(alreadyPaid - grandTotal, 0);

  const discountError = discount > grossAmount;

  // --------------------------------
  // PAYMENT CALCULATIONS
  // --------------------------------

  const depositApplied = numberValue(payment.depositApplied);
  const amountReceived = numberValue(payment.amountReceived);

  const balanceBeforeSettlement = Math.max(
    grandTotal - alreadyPaid,
    0,
  );

  const balanceAfterDeposit = Math.max(
    balanceBeforeSettlement - depositApplied,
    0,
  );

  const balanceAfterPayment = Math.max(
    balanceAfterDeposit - amountReceived,
    0,
  );

  const refundDue = Math.max(alreadyPaid - grandTotal, 0);

  const totalReceived =
    alreadyPaid + depositApplied + amountReceived;

  const depositAmountError =
    depositApplied > balanceBeforeSettlement;

  const paymentAmountError =
    amountReceived > balanceAfterDeposit;

  const completedCheckouts = reservationsData.filter(
    (reservation) =>
      reservation.status === "checked-out" &&
      reservation.checkOut === today,
  ).length;

  // Continue to billing
  const handleContinueBilling = () => {
    if (!selectedReservation) return;

    setShowBilling(true);
    setShowPayment(false);
  };

  // Continue to payment
  const handleContinuePayment = () => {
    if (discountError) return;

    setPayment({
      ...initialPayment,
      amountReceived: String(balanceBeforeSettlement),
    });

    setShowPayment(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Check-out Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage guest departures, final bills and payment settlements.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays size={17} />
          {formatDate(today)}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Today's Departures</p>
            <LogOut className="text-blue-600" size={20} />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {departures.length}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Pending Collection</p>
            <IndianRupee className="text-amber-600" size={20} />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {currency(totalPending)}
          </h2>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">Completed Check-outs</p>
            <ClipboardList className="text-emerald-600" size={20} />
          </div>

          <h2 className="mt-3 text-2xl font-bold text-slate-900">
            {completedCheckouts}
          </h2>
        </div>
      </div>

      {/* Departure List */}
      <div className="rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Expected Departures
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Guests who are due to check out.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guest, room or booking..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredDepartures.length > 0 ? (
            filteredDepartures.map((reservation) => (
              <div
                key={reservation.id}
                className="flex flex-col justify-between gap-4 p-5 lg:flex-row lg:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-semibold text-slate-900">
                      {reservation.guest.name}
                    </h3>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                      {reservation.reservationId}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <BedDouble size={15} />
                      Room {reservation.room.roomNumber}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Users size={15} />
                      {reservation.guests.adults} Adults,{" "}
                      {reservation.guests.children} Children
                    </span>

                    <span className="flex items-center gap-1.5">
                      <CalendarDays size={15} />
                      Check-out: {formatDate(reservation.checkOut)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="sm:mr-4">
                    <p className="text-xs text-slate-500">
                      Pending Amount
                    </p>

                    <p className="font-semibold text-slate-900">
                      {currency(reservation.payment.pendingAmount)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openCheckout(reservation)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    <LogOut size={16} />
                    Process Check-out
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="px-5 py-14 text-center">
              <ClipboardList
                size={36}
                className="mx-auto mb-3 text-slate-300"
              />

              <h3 className="font-semibold text-slate-700">
                No pending departures
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                No guests are currently scheduled to check out today.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {showPayment
                    ? "Payment Settlement"
                    : showBilling
                      ? "Final Bill & Charges"
                      : "Guest Check-out"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Reservation: {selectedReservation.reservationId}
                </p>
              </div>

              <button
                type="button"
                onClick={closeCheckout}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 p-5 sm:p-6">
              {/* STEP 1: GUEST INFORMATION */}
              {!showBilling ? (
                <>
                  <div>
                    <h3 className="mb-4 font-semibold text-slate-900">
                      Guest Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">Guest Name</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.guest.name}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Phone Number</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.guest.phone}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Email Address</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.guest.email || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Room Number</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.room.roomNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stay Summary */}
                  <div className="border-t border-slate-200 pt-5">
                    <h3 className="mb-4 font-semibold text-slate-900">
                      Stay Summary
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-xs text-slate-500">
                          Check-in Date
                        </p>
                        <p className="font-medium text-slate-900">
                          {formatDate(selectedReservation.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Check-out Date
                        </p>
                        <p className="font-medium text-slate-900">
                          {formatDate(selectedReservation.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Total Nights</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.nights}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">Guests</p>
                        <p className="font-medium text-slate-900">
                          {selectedReservation.guests.adults} Adults,{" "}
                          {selectedReservation.guests.children} Children
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Existing Payment Summary */}
                  <div className="border-t border-slate-200 pt-5">
                    <h3 className="mb-4 font-semibold text-slate-900">
                      Existing Payment Summary
                    </h3>

                    <div className="space-y-3 rounded-xl bg-slate-50 p-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Reservation Amount
                        </span>
                        <span className="font-medium">
                          {currency(
                            selectedReservation.pricing.totalAmount,
                          )}
                        </span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">
                          Amount Received
                        </span>
                        <span className="font-medium text-emerald-600">
                          {currency(alreadyPaid)}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="font-semibold text-slate-900">
                          Pending Amount
                        </span>
                        <span className="font-bold text-red-600">
                          {currency(
                            selectedReservation.payment.pendingAmount,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : !showPayment ? (
                <>
                  {/* STEP 2: BILLING */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      Final Bill Calculation
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Add additional expenses and review the final amount.
                    </p>
                  </div>

                  {/* Room Charges */}
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="mb-4 font-semibold text-slate-900">
                      Room & Existing Charges
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Room charges
                        </span>
                        <strong>{currency(roomCharges)}</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Existing extra charges
                        </span>
                        <strong>{currency(existingExtraCharges)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Additional Charges */}
                  <div>
                    <h4 className="mb-4 font-semibold text-slate-900">
                      Additional Charges
                    </h4>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {[
                        ["restaurantCharges", "Restaurant charges"],
                        ["roomServiceCharges", "Room service charges"],
                        ["otherCharges", "Other additional charges"],
                        ["damageCharges", "Damage charges"],
                      ].map(([field, label]) => (
                        <div key={field}>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {label} (₹)
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={billing[field]}
                            onChange={(e) =>
                              updateBilling(field, e.target.value)
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discount & Tax */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Discount (₹)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={billing.discount}
                        onChange={(e) =>
                          updateBilling("discount", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Tax amount (₹)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={billing.tax}
                        onChange={(e) =>
                          updateBilling("tax", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {discountError && (
                    <p className="text-sm text-red-600">
                      Discount cannot be greater than the total charges.
                    </p>
                  )}

                  {/* Bill Summary */}
                  <div className="rounded-xl bg-slate-50 p-5">
                    <div className="mb-4 flex items-center gap-2">
                      <Receipt size={19} className="text-blue-600" />
                      <h4 className="font-semibold text-slate-900">
                        Final Bill Summary
                      </h4>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Room charges</span>
                        <strong>{currency(roomCharges)}</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Existing extra charges
                        </span>
                        <strong>{currency(existingExtraCharges)}</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Additional charges
                        </span>
                        <strong>{currency(additionalCharges)}</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Discount</span>
                        <strong className="text-red-600">
                          - {currency(discount)}
                        </strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">Tax</span>
                        <strong>{currency(tax)}</strong>
                      </div>

                      <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="font-semibold text-slate-900">
                          Grand Total
                        </span>
                        <strong className="text-lg text-slate-900">
                          {currency(grandTotal)}
                        </strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Previously Received
                        </span>
                        <strong className="text-emerald-600">
                          {currency(alreadyPaid)}
                        </strong>
                      </div>

                      <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="font-bold text-slate-900">
                          {excessPayment > 0
                            ? "Excess Payment / Refund Due"
                            : "Remaining Balance"}
                        </span>

                        <strong
                          className={`text-lg ${
                            excessPayment > 0
                              ? "text-emerald-600"
                              : pendingAmount > 0
                                ? "text-red-600"
                                : "text-emerald-600"
                          }`}
                        >
                          {currency(excessPayment || pendingAmount)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500">
                    Tax is currently entered manually. Verify the applicable
                    tax treatment before issuing the final invoice.
                  </p>
                </>
              ) : (
                <>
                  {/* STEP 3: PAYMENT SETTLEMENT */}
                  <div>
                    <div className="flex items-center gap-2">
                      <Wallet size={20} className="text-blue-600" />
                      <h3 className="text-lg font-semibold text-slate-900">
                        Payment Settlement
                      </h3>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Review the outstanding balance and enter the payment
                      or refund details.
                    </p>
                  </div>

                  {/* Payment Overview */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">Final Bill</p>
                      <p className="mt-2 text-lg font-bold text-slate-900">
                        {currency(grandTotal)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">
                        Previously Received
                      </p>
                      <p className="mt-2 text-lg font-bold text-emerald-600">
                        {currency(alreadyPaid)}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <p className="text-xs text-slate-500">
                        Balance Before Settlement
                      </p>
                      <p className="mt-2 text-lg font-bold text-red-600">
                        {currency(balanceBeforeSettlement)}
                      </p>
                    </div>
                  </div>

                  {/* Security Deposit */}
                  <div className="rounded-xl border border-slate-200 p-5">
                    <h4 className="font-semibold text-slate-900">
                      Security Deposit Adjustment
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Enter the portion of a separately collected security
                      deposit being applied to this bill. Do not enter a
                      deposit already included in previous payments.
                    </p>

                    <div className="mt-4">
                      <label className="mb-1.5 block text-sm font-medium text-slate-700">
                        Deposit Applied (₹)
                      </label>

                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={payment.depositApplied}
                        onChange={(e) =>
                          updatePayment("depositApplied", e.target.value)
                        }
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />
                    </div>

                    {depositAmountError && (
                      <p className="mt-2 text-sm text-red-600">
                        Deposit adjustment cannot exceed the outstanding
                        balance.
                      </p>
                    )}

                    <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm">
                      <span className="text-slate-500">
                        Balance after deposit
                      </span>
                      <strong>{currency(balanceAfterDeposit)}</strong>
                    </div>
                  </div>

                  {/* Payment or Refund */}
                  {refundDue > 0 ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                      <div className="flex items-center gap-2">
                        <IndianRupee
                          size={20}
                          className="text-amber-700"
                        />
                        <h4 className="font-semibold text-amber-900">
                          Refund Required
                        </h4>
                      </div>

                      <p className="mt-2 text-sm text-amber-800">
                        The guest has already paid more than the final bill.
                        Review the refund amount before proceeding.
                      </p>

                      <p className="mt-4 text-2xl font-bold text-amber-900">
                        {currency(refundDue)}
                      </p>

                      <div className="mt-4">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                          Refund Method
                        </label>

                        <select
                          value={payment.refundMethod}
                          onChange={(e) =>
                            updatePayment("refundMethod", e.target.value)
                          }
                          className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                          <option value="Bank Transfer">
                            Bank Transfer
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-slate-200 p-5">
                      <div className="flex items-center gap-2">
                        <CreditCard
                          size={20}
                          className="text-blue-600"
                        />
                        <h4 className="font-semibold text-slate-900">
                          Collect Payment
                        </h4>
                      </div>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Amount Received (₹)
                          </label>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={payment.amountReceived}
                            onChange={(e) =>
                              updatePayment(
                                "amountReceived",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />

                          {paymentAmountError && (
                            <p className="mt-2 text-xs text-red-600">
                              Amount received cannot exceed the remaining
                              balance.
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            Payment Method
                          </label>

                          <select
                            value={payment.paymentMethod}
                            onChange={(e) =>
                              updatePayment(
                                "paymentMethod",
                                e.target.value,
                              )
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 outline-none focus:border-blue-500"
                          >
                            <option value="Cash">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="Card">Card</option>
                            <option value="Bank Transfer">
                              Bank Transfer
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Settlement Summary */}
                  <div className="rounded-xl bg-slate-50 p-5">
                    <h4 className="mb-4 font-semibold text-slate-900">
                      Settlement Summary
                    </h4>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Final bill amount
                        </span>
                        <strong>{currency(grandTotal)}</strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Previously received
                        </span>
                        <strong className="text-emerald-600">
                          {currency(alreadyPaid)}
                        </strong>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Security deposit applied
                        </span>
                        <strong>{currency(depositApplied)}</strong>
                      </div>

                      {refundDue === 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">
                            New payment received
                          </span>
                          <strong>{currency(amountReceived)}</strong>
                        </div>
                      )}

                      <div className="flex justify-between border-t border-slate-200 pt-3">
                        <span className="font-semibold text-slate-900">
                          Total credited
                        </span>
                        <strong className="text-emerald-600">
                          {currency(
                            refundDue > 0
                              ? alreadyPaid
                              : totalReceived,
                          )}
                        </strong>
                      </div>

                      {refundDue > 0 ? (
                        <div className="flex justify-between border-t border-slate-200 pt-3">
                          <span className="font-bold text-slate-900">
                            Refund to Guest
                          </span>
                          <strong className="text-lg text-amber-700">
                            {currency(refundDue)}
                          </strong>
                        </div>
                      ) : (
                        <div className="flex justify-between border-t border-slate-200 pt-3">
                          <span className="font-bold text-slate-900">
                            Remaining Balance
                          </span>
                          <strong
                            className={`text-lg ${
                              balanceAfterPayment > 0
                                ? "text-red-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {currency(balanceAfterPayment)}
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment Status */}
                  {refundDue === 0 &&
                    balanceAfterPayment === 0 &&
                    !depositAmountError &&
                    !paymentAmountError && (
                      <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                        <CheckCircle2
                          size={22}
                          className="shrink-0 text-emerald-600"
                        />
                        <div>
                          <p className="font-semibold text-emerald-800">
                            Payment amount settled
                          </p>
                          <p className="text-xs text-emerald-700">
                            The entered amounts cover the final bill.
                          </p>
                        </div>
                      </div>
                    )}

                  <p className="text-xs text-slate-500">
                    This screen only records the settlement details in the
                    form. No actual payment or refund has been processed yet.
                  </p>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex flex-wrap justify-between gap-3 border-t border-slate-200 bg-white p-5 sm:p-6">
              <div>
                {(showBilling || showPayment) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (showPayment) {
                        setShowPayment(false);
                      } else {
                        setShowBilling(false);
                      }
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ArrowLeft size={16} />
                    Back
                  </button>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeCheckout}
                  className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                {!showBilling && (
                  <button
                    type="button"
                    onClick={handleContinueBilling}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Continue to Billing
                    <ArrowRight size={16} />
                  </button>
                )}

                {showBilling && !showPayment && (
                  <button
                    type="button"
                    disabled={discountError}
                    onClick={handleContinuePayment}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Continue to Payment
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
