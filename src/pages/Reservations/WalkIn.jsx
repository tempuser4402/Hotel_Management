
import { useMemo, useState } from "react";
import {
  UserRound,
  Phone,
  Mail,
  MapPin,
  BedDouble,
  CalendarDays,
  IndianRupee,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  ClipboardCheck,
  Receipt,
  X,
} from "lucide-react";

import { rooms } from "../Rooms/roomData";
import { roomTypes } from "../Rooms/roomTypesData";

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTomorrow = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount || 0);

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T00:00:00`);
  const end = new Date(`${checkOut}T00:00:00`);

  const difference = end.getTime() - start.getTime();

  return Math.max(Math.ceil(difference / (1000 * 60 * 60 * 24)), 0);
};

const initialForm = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "India",

  adults: "1",
  children: "0",

  checkIn: getToday(),
  checkOut: getTomorrow(),

  roomId: "",

  roomRate: "",
  extraCharges: "0",
  discount: "0",
  tax: "0",

  paymentAmount: "0",
  paymentMethod: "Cash",
  paymentReference: "",

  idType: "Aadhaar Card",
  idNumber: "",
  idVerified: false,

  specialRequests: "",
};

const numberValue = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(number, 0) : 0;
};

const inputClass =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-sm font-medium text-slate-700";

export default function WalkIn() {
  const [form, setForm] = useState(initialForm);
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [formError, setFormError] = useState("");

  const today = getToday();

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setFormError("");
  };

  // --------------------------------
  // ROOM AVAILABILITY
  // --------------------------------

  const availableRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
        room.isActive !== false &&
        room.status === "Available" &&
        room.housekeepingStatus === "Clean" &&
        room.maintenanceStatus === "Normal",
    );
  }, []);

  const selectedRoom = availableRooms.find(
    (room) => room.id === form.roomId,
  );

  const selectedRoomType = roomTypes.find(
    (type) => type.name === selectedRoom?.roomType,
  );

  const selectedRoomRate =
    Number(selectedRoomType?.basePrice) ||
    Number(selectedRoom?.basePrice) ||
    2000;

  // --------------------------------
  // DATE & PRICING CALCULATIONS
  // --------------------------------

  const nights = calculateNights(form.checkIn, form.checkOut);

  const roomRate = numberValue(form.roomRate);

  const roomCharges = roomRate * nights;

  const extraCharges = numberValue(form.extraCharges);
  const discount = numberValue(form.discount);
  const tax = numberValue(form.tax);

  const grossAmount = roomCharges + extraCharges;

  const subtotal = Math.max(grossAmount - discount, 0);

  const grandTotal = subtotal + tax;

  const paymentAmount = numberValue(form.paymentAmount);

  const balanceAmount = Math.max(grandTotal - paymentAmount, 0);

  const paymentError = paymentAmount > grandTotal;

  const discountError = discount > grossAmount;

  const guestName =
    `${form.firstName.trim()} ${form.lastName.trim()}`.trim();

  const isDateInvalid =
    !form.checkIn ||
    !form.checkOut ||
    form.checkIn < today ||
    form.checkOut <= form.checkIn;

  const guestCount =
    numberValue(form.adults) + numberValue(form.children);

  const occupancyError =
    selectedRoomType?.maxOccupancy &&
    guestCount > selectedRoomType.maxOccupancy;

  // --------------------------------
  // ROOM SELECTION
  // --------------------------------

  const handleRoomSelection = (roomId) => {
    const room = availableRooms.find((item) => item.id === roomId);

    const roomType = roomTypes.find(
      (type) => type.name === room?.roomType,
    );

    const rate =
      Number(roomType?.basePrice) ||
      Number(room?.basePrice) ||
      2000;

    setForm((prev) => ({
      ...prev,
      roomId,
      roomRate: String(rate),
    }));

    setFormError("");
  };

  // --------------------------------
  // BOOKING CONFIRMATION
  // --------------------------------

  const handleConfirmBooking = (e) => {
    e.preventDefault();

    if (!guestName || !form.phone || !form.address) {
      setFormError("Please complete all required guest details.");
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone)) {
      setFormError("Enter a valid 10-digit mobile number.");
      return;
    }

    if (!form.roomId || !selectedRoom) {
      setFormError("Please select an available room.");
      return;
    }

    if (isDateInvalid || nights <= 0) {
      setFormError("Please select valid check-in and check-out dates.");
      return;
    }

    if (numberValue(form.adults) < 1) {
      setFormError("At least one adult is required.");
      return;
    }

    if (occupancyError) {
      setFormError(
        `This room allows a maximum of ${selectedRoomType.maxOccupancy} guests.`,
      );
      return;
    }

    if (!form.idNumber.trim()) {
      setFormError("Please enter the guest's ID document number.");
      return;
    }

    if (!form.idVerified) {
      setFormError("Please verify the guest's ID before confirming.");
      return;
    }

    if (discountError) {
      setFormError("Discount cannot exceed the total charges.");
      return;
    }

    if (paymentError) {
      setFormError("Payment cannot exceed the final bill.");
      return;
    }

    if (paymentAmount > 0 && !form.paymentMethod) {
      setFormError("Please select a payment method.");
      return;
    }

    const reservationId = `WALK-${Date.now().toString().slice(-8)}`;

    const reservation = {
      id: reservationId,
      reservationId,
      bookingType: "walk-in",
      bookingSource: "walk-in",

      guest: {
        name: guestName,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone,
        email: form.email.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        country: form.country,
      },

      room: {
        roomId: selectedRoom.id,
        roomNumber: String(selectedRoom.roomNumber),
        roomType: selectedRoom.roomType,
      },

      checkIn: form.checkIn,
      checkOut: form.checkOut,
      nights,

      guests: {
        adults: numberValue(form.adults),
        children: numberValue(form.children),
      },

      pricing: {
        roomRate,
        roomCharges,
        extraCharges,
        discount,
        tax,
        totalAmount: grandTotal,
      },

      payment: {
        paidAmount: paymentAmount,
        pendingAmount: balanceAmount,
        status:
          balanceAmount === 0
            ? "paid"
            : paymentAmount > 0
              ? "partial"
              : "pending",
        method: paymentAmount > 0 ? form.paymentMethod : null,
        reference: form.paymentReference.trim(),
      },

      identity: {
        documentType: form.idType,
        documentNumber: form.idNumber.trim(),
        verified: form.idVerified,
      },

      specialRequests: form.specialRequests.trim(),

      status: "checked-in",
      createdAt: new Date().toISOString(),
    };

    setConfirmedReservation(reservation);
  };

  const handleNewWalkIn = () => {
    setForm({
      ...initialForm,
      checkIn: getToday(),
      checkOut: getTomorrow(),
    });

    setConfirmedReservation(null);
    setFormError("");
  };

  // --------------------------------
  // CONFIRMATION SCREEN
  // --------------------------------

  if (confirmedReservation) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-emerald-200 bg-white p-6 text-center shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 size={34} className="text-emerald-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Walk-in Guest Registered!
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            The booking details have been generated successfully.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <p className="text-xs text-slate-500">
                  Booking Reference
                </p>
                <h2 className="mt-1 text-xl font-bold text-blue-700">
                  {confirmedReservation.reservationId}
                </h2>
              </div>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Checked In
              </span>
            </div>

            <div className="grid gap-5 py-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-500">Guest Name</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.guest.name}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Mobile Number</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.guest.phone}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Room</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.room.roomNumber} -{" "}
                  {confirmedReservation.room.roomType}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Duration</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.nights} Nights
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Check-in</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.checkIn}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500">Check-out</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {confirmedReservation.checkOut}
                </p>
              </div>
            </div>

            <div className="space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Room charges</span>
                <strong>
                  {currency(confirmedReservation.pricing.roomCharges)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Extra charges</span>
                <strong>
                  {currency(confirmedReservation.pricing.extraCharges)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Discount</span>
                <strong>
                  - {currency(confirmedReservation.pricing.discount)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <strong>
                  {currency(confirmedReservation.pricing.tax)}
                </strong>
              </div>

              <div className="flex justify-between border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-900">
                  Grand Total
                </span>
                <strong className="text-xl text-slate-900">
                  {currency(confirmedReservation.pricing.totalAmount)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount Received</span>
                <strong className="text-emerald-600">
                  {currency(confirmedReservation.payment.paidAmount)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Pending Amount</span>
                <strong className="text-red-600">
                  {currency(confirmedReservation.payment.pendingAmount)}
                </strong>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Receipt size={17} />
              Print Confirmation
            </button>

            <button
              type="button"
              onClick={handleNewWalkIn}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              <UserPlus size={17} />
              Register Another Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------
  // WALK-IN REGISTRATION FORM
  // --------------------------------

  return (
    <form onSubmit={handleConfirmBooking} className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Walk-in Guest Registration
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Register a guest directly without an advance reservation.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          <CalendarDays size={17} />
          {today}
        </div>
      </div>

      {/* Guest Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-blue-50 p-2.5">
            <UserRound className="text-blue-600" size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Guest Information
            </h2>
            <p className="text-xs text-slate-500">
              Enter the guest's personal details.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              First Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              required
              value={form.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="Enter first name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Last Name</label>

            <input
              type="text"
              value={form.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Enter last name"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Mobile Number <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <Phone
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="tel"
                required
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  updateField(
                    "phone",
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                placeholder="10-digit mobile number"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Email Address</label>

            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="guest@example.com"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass}>
              Address <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <MapPin
                size={17}
                className="absolute left-3 top-3 text-slate-400"
              />

              <textarea
                required
                rows={2}
                value={form.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="Enter complete address"
                className={`${inputClass} resize-none pl-10`}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={form.city}
              onChange={(e) => updateField("city", e.target.value)}
              placeholder="Enter city"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>State</label>
            <input
              type="text"
              value={form.state}
              onChange={(e) => updateField("state", e.target.value)}
              placeholder="Enter state"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Country</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => updateField("country", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Stay Details */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-purple-50 p-2.5">
            <CalendarDays className="text-purple-600" size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Stay Details
            </h2>
            <p className="text-xs text-slate-500">
              Select dates and number of guests.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>
              Check-in Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              required
              min={today}
              value={form.checkIn}
              onChange={(e) => {
                const nextCheckIn = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  checkIn: nextCheckIn,
                  checkOut:
                    prev.checkOut <= nextCheckIn
                      ? (() => {
                          const date = new Date(
                            `${nextCheckIn}T00:00:00`,
                          );
                          date.setDate(date.getDate() + 1);

                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(
                            2,
                            "0",
                          );
                          const day = String(date.getDate()).padStart(2, "0");

                          return `${year}-${month}-${day}`;
                        })()
                      : prev.checkOut,
                }));
              }}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              Check-out Date <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              required
              min={form.checkIn || today}
              value={form.checkOut}
              onChange={(e) => updateField("checkOut", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Adults</label>

            <input
              type="number"
              min="1"
              max="20"
              value={form.adults}
              onChange={(e) => updateField("adults", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Children</label>

            <input
              type="number"
              min="0"
              max="20"
              value={form.children}
              onChange={(e) => updateField("children", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5 rounded-lg bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">Total Stay Duration</span>
            <strong className="text-lg text-blue-800">
              {nights} {nights === 1 ? "Night" : "Nights"}
            </strong>
          </div>
        </div>
      </section>

      {/* Room Selection */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2.5">
              <BedDouble className="text-emerald-600" size={21} />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                Available Rooms
              </h2>
              <p className="text-xs text-slate-500">
                Only clean, available rooms are displayed.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            {availableRooms.length} Available
          </span>
        </div>

        {availableRooms.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availableRooms.map((room) => {
              const isSelected = form.roomId === room.id;

              const roomType = roomTypes.find(
                (type) => type.name === room.roomType,
              );

              const rate =
                Number(roomType?.basePrice) ||
                Number(room.basePrice) ||
                2000;

              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => handleRoomSelection(room.id)}
                  className={`rounded-xl border p-4 text-left transition ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Room</p>
                      <h3 className="mt-1 text-xl font-bold text-slate-900">
                        {room.roomNumber}
                      </h3>
                    </div>

                    {isSelected && (
                      <CheckCircle2
                        size={20}
                        className="text-blue-600"
                      />
                    )}
                  </div>

                  <p className="mt-2 text-sm font-medium text-slate-700">
                    {room.roomType}
                  </p>

                  <p className="mt-3 text-sm font-semibold text-blue-700">
                    {currency(rate)} / night
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-emerald-700">
                      Available
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                      Clean
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-50 px-4 py-10 text-center">
            <BedDouble
              size={32}
              className="mx-auto mb-3 text-slate-300"
            />
            <p className="font-semibold text-slate-700">
              No rooms available
            </p>
            <p className="mt-1 text-sm text-slate-500">
              There are currently no clean and available rooms.
            </p>
          </div>
        )}

        {occupancyError && (
          <p className="mt-4 text-sm text-red-600">
            Selected room occupancy limit is{" "}
            {selectedRoomType.maxOccupancy} guests.
          </p>
        )}

        {selectedRoom && (
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm font-semibold text-blue-900">
              Selected Room: {selectedRoom.roomNumber}
            </p>
            <p className="mt-1 text-xs text-blue-700">
              {selectedRoom.roomType} · {currency(selectedRoomRate)} per night
            </p>
          </div>
        )}
      </section>

      {/* Pricing */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-amber-50 p-2.5">
            <IndianRupee className="text-amber-600" size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Pricing & Charges
            </h2>
            <p className="text-xs text-slate-500">
              Review the room rate and final bill.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Room Rate per Night (₹)</label>

            <input
              type="number"
              min="0"
              step="0.01"
              disabled={!selectedRoom}
              value={form.roomRate}
              onChange={(e) => updateField("roomRate", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Additional Charges (₹)</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.extraCharges}
              onChange={(e) =>
                updateField("extraCharges", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Discount (₹)</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.discount}
              onChange={(e) => updateField("discount", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Tax Amount (₹)</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.tax}
              onChange={(e) => updateField("tax", e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {discountError && (
          <p className="mt-3 text-sm text-red-600">
            Discount cannot exceed the total charges.
          </p>
        )}

        <div className="mt-6 rounded-xl bg-slate-50 p-5">
          <div className="mb-4 flex items-center gap-2">
            <Receipt size={19} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900">
              Price Summary
            </h3>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Room rate</span>
              <strong>{currency(roomRate)} / night</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Number of nights</span>
              <strong>{nights}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Room charges</span>
              <strong>{currency(roomCharges)}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Additional charges</span>
              <strong>{currency(extraCharges)}</strong>
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
              <strong className="text-xl text-slate-900">
                {currency(grandTotal)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2.5">
            <CreditCard className="text-indigo-600" size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Payment Details
            </h2>
            <p className="text-xs text-slate-500">
              Record the amount received from the guest.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Amount Received (₹)</label>

            <input
              type="number"
              min="0"
              step="0.01"
              value={form.paymentAmount}
              onChange={(e) =>
                updateField("paymentAmount", e.target.value)
              }
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Payment Method</label>

            <select
              value={form.paymentMethod}
              onChange={(e) =>
                updateField("paymentMethod", e.target.value)
              }
              className={inputClass}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>

          {form.paymentMethod !== "Cash" && (
            <div className="sm:col-span-2">
              <label className={labelClass}>
                Transaction Reference / UTR
              </label>

              <input
                type="text"
                value={form.paymentReference}
                onChange={(e) =>
                  updateField("paymentReference", e.target.value)
                }
                placeholder="Enter transaction reference"
                className={inputClass}
              />
            </div>
          )}
        </div>

        {paymentError && (
          <p className="mt-3 text-sm text-red-600">
            Payment cannot exceed the grand total.
          </p>
        )}

        <div className="mt-5 rounded-xl bg-slate-50 p-5">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Grand Total</span>
              <strong>{currency(grandTotal)}</strong>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-500">Amount Received</span>
              <strong className="text-emerald-600">
                {currency(paymentAmount)}
              </strong>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3">
              <span className="font-semibold text-slate-900">
                Pending Amount
              </span>
              <strong
                className={`text-lg ${
                  balanceAmount > 0
                    ? "text-red-600"
                    : "text-emerald-600"
                }`}
              >
                {currency(balanceAmount)}
              </strong>
            </div>
          </div>
        </div>
      </section>

      {/* ID Verification */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-lg bg-orange-50 p-2.5">
            <ShieldCheck className="text-orange-600" size={21} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">
              Identity Verification
            </h2>
            <p className="text-xs text-slate-500">
              Record the guest's identification details.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>ID Document Type</label>

            <select
              value={form.idType}
              onChange={(e) => updateField("idType", e.target.value)}
              className={inputClass}
            >
              <option value="Aadhaar Card">Aadhaar Card</option>
              <option value="Passport">Passport</option>
              <option value="Driving Licence">Driving Licence</option>
              <option value="Voter ID">Voter ID</option>
              <option value="Other Government ID">
                Other Government ID
              </option>
            </select>
          </div>

          <div>
            <label className={labelClass}>ID Document Number</label>

            <input
              type="text"
              value={form.idNumber}
              onChange={(e) => updateField("idNumber", e.target.value)}
              placeholder="Enter document number"
              className={inputClass}
            />
          </div>
        </div>

        <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-4">
          <input
            type="checkbox"
            checked={form.idVerified}
            onChange={(e) =>
              updateField("idVerified", e.target.checked)
            }
            className="mt-1 h-4 w-4 accent-blue-600"
          />

          <span>
            <span className="block text-sm font-medium text-slate-800">
              I have checked and verified the guest's original ID.
            </span>
            <span className="mt-1 block text-xs text-slate-500">
              Confirm this only after physically checking the document.
            </span>
          </span>
        </label>

        <p className="mt-3 text-xs text-slate-500">
          Follow applicable guest-registration and identity-document
          handling requirements. Avoid collecting or retaining unnecessary
          identity information.
        </p>
      </section>

      {/* Special Requests */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="mb-4 font-semibold text-slate-900">
          Special Requests / Notes
        </h2>

        <textarea
          rows={3}
          value={form.specialRequests}
          onChange={(e) =>
            updateField("specialRequests", e.target.value)
          }
          placeholder="Any special request or additional information..."
          className={`${inputClass} resize-none`}
        />
      </section>

      {/* Error Message */}
      {formError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {formError}
        </div>
      )}

      {/* Final Summary */}
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-5 sm:p-6">
        <h2 className="font-semibold text-slate-900">
          Booking Overview
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Guest</p>
            <p className="mt-1 font-semibold text-slate-900">
              {guestName || "Not entered"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Selected Room</p>
            <p className="mt-1 font-semibold text-slate-900">
              {selectedRoom
                ? `${selectedRoom.roomNumber} - ${selectedRoom.roomType}`
                : "Not selected"}
            </p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Total Payable</p>
            <p className="mt-1 text-lg font-bold text-blue-700">
              {currency(grandTotal)}
            </p>
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className="flex flex-col justify-end gap-3 border-t border-slate-200 pt-5 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setForm({
              ...initialForm,
              checkIn: getToday(),
              checkOut: getTomorrow(),
            });
            setFormError("");
          }}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reset Form
        </button>

        <button
          type="submit"
          disabled={
            !selectedRoom ||
            isDateInvalid ||
            discountError ||
            paymentError ||
            occupancyError
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ClipboardCheck size={17} />
          Confirm Walk-in & Check In
          <ArrowRight size={17} />
        </button>
      </div>
    </form>
  );
}
