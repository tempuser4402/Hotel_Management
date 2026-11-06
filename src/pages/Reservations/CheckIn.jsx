
import { useMemo, useState } from "react";
import styles from "./CheckIn.module.css"
import {
  Search,
  CalendarDays,
  Clock,
  Users,
  BedDouble,
  UserRound,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  X,
  ChevronRight,
  ChevronLeft,
  ClipboardCheck,
  ShieldCheck,
  IndianRupee,
  LogIn,
  Filter,
  RefreshCw,
} from "lucide-react";

import reservationsData from "./reservationData";
import { rooms } from "../Rooms/roomData";
import { roomTypes } from "../Rooms/roomTypesData";

const currency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const getToday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getRoomTypeId = (name) =>
  roomTypes.find(
    (type) => type.name.toLowerCase() === (name || "").toLowerCase()
  )?.id;

const initialRooms = rooms.map((room) => ({ ...room }));

const initialReservations = reservationsData.map((reservation) => ({
  ...reservation,
  guest: { ...reservation.guest },
  room: { ...reservation.room },
  guests: { ...reservation.guests },
  pricing: { ...reservation.pricing },
  payment: { ...reservation.payment },
}));

const steps = [
  "Reservation",
  "Guest verification",
  "Room assignment",
  "Payment",
  "Confirmation",
];

export default function CheckIn() {
  const [reservations, setReservations] = useState(initialReservations);
  const [roomList, setRoomList] = useState(initialRooms);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [form, setForm] = useState({
    idType: "Aadhaar",
    idNumber: "",
    idFile: null,
    adults: "",
    children: "",
    roomId: "",
    amountReceived: "",
    paymentMethod: "UPI",
    registrationAddress: "",
    nationality: "Indian",
    purposeOfVisit: "Personal",
    vehicleNumber: "",
    specialRequests: "",
    identityVerified: false,
    reservationVerified: false,
    guestDetailsVerified: false,
    paymentAcknowledged: false,
  });

  const today = getToday();

  const expectedArrivals = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.checkIn === today &&
        ["confirmed", "pending"].includes(reservation.status)
    );
  }, [reservations, today]);

  const alreadyCheckedIn = useMemo(() => {
    return reservations.filter(
      (reservation) =>
        reservation.checkIn === today &&
        reservation.status === "checked-in"
    );
  }, [reservations, today]);

  const filteredArrivals = expectedArrivals.filter((reservation) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      reservation.guest.name.toLowerCase().includes(searchText) ||
      reservation.reservationId.toLowerCase().includes(searchText) ||
      reservation.guest.phone.includes(searchText) ||
      reservation.room.roomNumber.includes(searchText);

    const matchesFilter =
      filter === "all" ||
      (filter === "paid" && reservation.payment.status === "paid") ||
      (filter === "partial" && reservation.payment.status === "partial") ||
      (filter === "pending" && reservation.payment.status === "pending");

    return matchesSearch && matchesFilter;
  });

  const availableRooms = useMemo(() => {
    return roomList.filter(
      (room) =>
        room.isActive &&
        room.status === "Available" &&
        room.housekeepingStatus === "Clean" &&
        room.maintenanceStatus === "Normal"
    );
  }, [roomList]);

  const selectedRoom = roomList.find(
    (room) => room.id === form.roomId
  );

  const selectedRoomType = roomTypes.find(
    (type) => type.id === selectedRoom?.roomTypeId
  );

  const selectedRoomTypeId = getRoomTypeId(
    selectedReservation?.room?.roomType
  );

  const matchingAvailableRooms = availableRooms.filter(
    (room) => room.roomTypeId === selectedRoomTypeId
  );

  const totalGuests =
    Number(form.adults || 0) + Number(form.children || 0);

  const totalAmount = Number(
    selectedReservation?.pricing?.totalAmount || 0
  );

  const alreadyPaid = Number(
    selectedReservation?.payment?.paidAmount || 0
  );

  const newPayment = Number(form.amountReceived || 0);

  const pendingAfterPayment = Math.max(
    totalAmount - alreadyPaid - newPayment,
    0
  );

  const paymentStatus =
    alreadyPaid + newPayment >= totalAmount
      ? "paid"
      : alreadyPaid + newPayment > 0
        ? "partial"
        : "pending";

  const updateForm = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setCurrentStep(0);
    setCompleted(false);

    setForm({
      idType: "Aadhaar",
      idNumber: "",
      idFile: null,
      adults: "",
      children: "",
      roomId: "",
      amountReceived: "",
      paymentMethod: "UPI",
      registrationAddress: "",
      nationality: "Indian",
      purposeOfVisit: "Personal",
      vehicleNumber: "",
      specialRequests: "",
      identityVerified: false,
      reservationVerified: false,
      guestDetailsVerified: false,
      paymentAcknowledged: false,
    });
  };

  const openCheckIn = (reservation) => {
    setSelectedReservation(reservation);
    resetForm();

    setForm((previous) => ({
      ...previous,
      adults: String(reservation.guests.adults),
      children: String(reservation.guests.children),
      registrationAddress: reservation.guest.address || "",
      specialRequests: reservation.specialRequests || "",
    }));

    setShowCheckIn(true);
  };

  const closeCheckIn = () => {
    setShowCheckIn(false);
    setSelectedReservation(null);
    resetForm();
  };

  const validateStep = () => {
    if (!selectedReservation) return false;

    if (currentStep === 0) {
      if (!form.reservationVerified) {
        alert("Please verify the reservation before continuing.");
        return false;
      }
    }

    if (currentStep === 1) {
      if (!form.idNumber.trim()) {
        alert("Please enter the guest ID proof number.");
        return false;
      }

      if (!form.identityVerified) {
        alert("Please confirm the guest identity verification.");
        return false;
      }

      if (!form.guestDetailsVerified) {
        alert("Please verify the guest registration details.");
        return false;
      }

      if (totalGuests < 1) {
        alert("At least one guest is required.");
        return false;
      }
    }

    if (currentStep === 2) {
      if (!form.roomId) {
        alert("Please assign a room.");
        return false;
      }

      if (totalGuests > (selectedRoomType?.maxOccupancy || 0)) {
        alert(
          `Maximum occupancy for this room is ${selectedRoomType.maxOccupancy}.`
        );
        return false;
      }

      if (
        selectedRoom?.status !== "Available" ||
        selectedRoom?.housekeepingStatus !== "Clean" ||
        selectedRoom?.maintenanceStatus !== "Normal"
      ) {
        alert("This room is no longer available for check-in.");
        return false;
      }
    }

    if (currentStep === 3) {
      if (form.amountReceived === "") {
        alert("Please enter the additional payment received. Enter 0 if no payment was received.");
        return false;
      }

      if (
        !Number.isFinite(newPayment) ||
        newPayment < 0 ||
        newPayment > totalAmount - alreadyPaid
      ) {
        alert("Please enter a valid payment amount.");
        return false;
      }

      if (!form.paymentAcknowledged) {
        alert("Please acknowledge the payment and outstanding balance.");
        return false;
      }
    }

    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;

    setCurrentStep((previous) => Math.min(previous + 1, 4));
  };

  const previousStep = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  };

  const confirmCheckIn = () => {
    if (!selectedReservation || !form.roomId) return;

    const roomStillAvailable = roomList.some(
      (room) =>
        room.id === form.roomId &&
        room.status === "Available" &&
        room.housekeepingStatus === "Clean" &&
        room.maintenanceStatus === "Normal" &&
        room.isActive
    );

    if (!roomStillAvailable) {
      alert("Selected room is no longer available. Please select another room.");
      setCurrentStep(2);
      return;
    }

    const checkInTime = new Date().toISOString();

    setReservations((previous) =>
      previous.map((reservation) =>
        reservation.id === selectedReservation.id
          ? {
              ...reservation,
              status: "checked-in",
              room: {
                ...reservation.room,
                roomId: selectedRoom.id,
                roomNumber: selectedRoom.roomNumber,
                roomType: selectedRoomType.name,
              },
              guests: {
                adults: Number(form.adults),
                children: Number(form.children),
              },
              payment: {
                ...reservation.payment,
                paidAmount: alreadyPaid + newPayment,
                pendingAmount: pendingAfterPayment,
                status: paymentStatus,
                method:
                  newPayment > 0
                    ? form.paymentMethod
                    : reservation.payment.method,
              },
              guest: {
                ...reservation.guest,
                address: form.registrationAddress,
                idType: form.idType,
                idNumber: form.idNumber,
                nationality: form.nationality,
              },
              specialRequests: form.specialRequests,
              checkedInAt: checkInTime,
              checkInRegistration: {
                purposeOfVisit: form.purposeOfVisit,
                vehicleNumber: form.vehicleNumber,
                idProofFileName: form.idFile?.name || null,
              },
            }
          : reservation
      )
    );

    setRoomList((previous) =>
      previous.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              status: "Occupied",
              housekeepingStatus: "Clean",
            }
          : room
      )
    );

    setCompleted(true);
  };

  const closeSuccessfulCheckIn = () => {
    setShowCheckIn(false);
    setSelectedReservation(null);
    setCompleted(false);
    setCurrentStep(0);
  };

  const stats = [
    {
      label: "Expected arrivals",
      value: expectedArrivals.length,
      icon: CalendarDays,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Checked in today",
      value: alreadyCheckedIn.length,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Available rooms",
      value: availableRooms.length,
      icon: BedDouble,
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Pending arrivals",
      value: expectedArrivals.length,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
              <span>Reservations</span>
              <ChevronRight size={14} />
              <span className="font-medium text-slate-700">Check-in</span>
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Guest Check-in
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage arrivals, verify guests and assign rooms.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <CalendarDays size={17} />
            {formatDate(today)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-900">
                      {stat.value}
                    </h2>
                  </div>

                  <div className={`rounded-xl p-3 ${stat.bg}`}>
                    <Icon className={stat.color} size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Arrivals */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Today's Expected Arrivals
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Reservations scheduled to check in today.
              </p>
            </div>

            <button
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="flex items-center gap-2 self-start rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <RefreshCw size={15} />
              Reset filters
            </button>
          </div>

          {/* Search and filters */}
          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guest, booking ID, phone or room..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="relative md:w-52">
              <Filter
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
              >
                <option value="all">All payments</option>
                <option value="paid">Paid</option>
                <option value="partial">Partially paid</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-212.5 text-left">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">Guest</th>
                  <th className="px-5 py-4 font-semibold">Booking ID</th>
                  <th className="px-5 py-4 font-semibold">Room type</th>
                  <th className="px-5 py-4 font-semibold">Stay</th>
                  <th className="px-5 py-4 font-semibold">Guests</th>
                  <th className="px-5 py-4 font-semibold">Payment</th>
                  <th className="px-5 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredArrivals.map((reservation) => (
                  <tr
                    key={reservation.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 font-semibold text-blue-700">
                          {reservation.guest.name.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold text-slate-800">
                            {reservation.guest.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {reservation.guest.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {reservation.reservationId}
                      </p>
                      <p className="mt-1 text-xs capitalize text-slate-500">
                        {reservation.bookingSource}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-700">
                        {reservation.room.roomType}
                      </p>
                      <p className="text-xs text-slate-500">
                        Preferred: {reservation.room.roomNumber}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700">
                        {formatDate(reservation.checkIn)}
                      </p>
                      <p className="text-xs text-slate-500">
                        to {formatDate(reservation.checkOut)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {reservation.guests.adults} Adults
                      {reservation.guests.children > 0 &&
                        `, ${reservation.guests.children} Children`}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {currency(reservation.payment.paidAmount)}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          reservation.payment.status === "paid"
                            ? "bg-emerald-50 text-emerald-700"
                            : reservation.payment.status === "partial"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {reservation.payment.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => openCheckIn(reservation)}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        <LogIn size={15} />
                        Check-in
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredArrivals.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center">
                      <CalendarDays
                        size={32}
                        className="mx-auto mb-3 text-slate-300"
                      />
                      <p className="font-medium text-slate-700">
                        No expected arrivals found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or payment filter.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Already checked in */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} className="text-emerald-600" />
            <h3 className="font-semibold text-slate-800">
              Already checked in today
            </h3>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              {alreadyCheckedIn.length}
            </span>
          </div>

          {alreadyCheckedIn.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">
              No guests have been checked in today.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {alreadyCheckedIn.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-xl border border-emerald-100 bg-white p-4"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-800">
                      {reservation.guest.name}
                    </p>
                    <span className="text-xs font-medium text-emerald-700">
                      Checked in
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Room {reservation.room.roomNumber} ·{" "}
                    {reservation.reservationId}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Check-in wizard modal */}
      {showCheckIn && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-2 backdrop-blur-sm sm:p-5">
          <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-7">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Check-in</span>
                  <ChevronRight size={13} />
                  <span>{selectedReservation.reservationId}</span>
                </div>
                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {completed ? "Check-in completed" : "Guest check-in"}
                </h2>
              </div>

              <button
                onClick={closeCheckIn}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            {!completed ? (
              <>
                {/* Steps */}
                <div className="overflow-x-auto border-b border-slate-100 px-5 py-5 sm:px-7">
                  <div className="flex min-w-155 items-center">
                    {steps.map((step, index) => (
                      <div
                        key={step}
                        className="flex flex-1 items-center last:flex-none"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                              currentStep > index
                                ? "bg-emerald-600 text-white"
                                : currentStep === index
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 text-slate-400"
                            }`}
                          >
                            {currentStep > index ? (
                              <CheckCircle2 size={18} />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <span
                            className={`whitespace-nowrap text-xs ${
                              currentStep === index
                                ? "font-semibold text-blue-700"
                                : "text-slate-500"
                            }`}
                          >
                            {step}
                          </span>
                        </div>

                        {index !== steps.length - 1 && (
                          <div
                            className={`mx-3 mb-5 h-0.5 flex-1 ${
                              currentStep > index
                                ? "bg-emerald-500"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">

                  {/* STEP 1: Reservation */}
                  {currentStep === 0 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Reservation verification
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Confirm the booking details before proceeding.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoCard
                          label="Guest name"
                          value={selectedReservation.guest.name}
                          icon={UserRound}
                        />
                        <InfoCard
                          label="Booking ID"
                          value={selectedReservation.reservationId}
                          icon={ClipboardCheck}
                        />
                        <InfoCard
                          label="Phone number"
                          value={selectedReservation.guest.phone}
                          icon={Phone}
                        />
                        <InfoCard
                          label="Email"
                          value={selectedReservation.guest.email}
                          icon={Mail}
                        />
                        <InfoCard
                          label="Check-in date"
                          value={formatDate(selectedReservation.checkIn)}
                          icon={CalendarDays}
                        />
                        <InfoCard
                          label="Check-out date"
                          value={formatDate(selectedReservation.checkOut)}
                          icon={CalendarDays}
                        />
                      </div>

                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                        <div className="flex gap-3">
                          <AlertCircle
                            size={20}
                            className="shrink-0 text-blue-600"
                          />
                          <div>
                            <p className="font-semibold text-blue-900">
                              Existing room assignment
                            </p>
                            <p className="mt-1 text-sm text-blue-800">
                              Preferred room:{" "}
                              {selectedReservation.room.roomNumber} (
                              {selectedReservation.room.roomType}).
                              Verify availability and select a valid room in
                              the next step.
                            </p>
                          </div>
                        </div>
                      </div>

                      <VerificationCheckbox
                        checked={form.reservationVerified}
                        onChange={(value) =>
                          updateForm("reservationVerified", value)
                        }
                        label="I have verified the reservation ID, guest details and stay dates."
                      />
                    </div>
                  )}

                  {/* STEP 2: Guest verification */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Guest identity verification
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Record the identity and registration information of
                          the primary guest.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="ID proof type" required>
                          <select
                            value={form.idType}
                            onChange={(e) =>
                              updateForm("idType", e.target.value)
                            }
                            className="form-input"
                          >
                            <option>Aadhaar</option>
                            <option>Passport</option>
                            <option>Driving License</option>
                            <option>Voter ID</option>
                            <option>Other Government ID</option>
                          </select>
                        </FormField>

                        <FormField label="ID proof number" required>
                          <input
                            value={form.idNumber}
                            onChange={(e) =>
                              updateForm("idNumber", e.target.value)
                            }
                            placeholder="Enter ID proof number"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Nationality">
                          <input
                            value={form.nationality}
                            onChange={(e) =>
                              updateForm("nationality", e.target.value)
                            }
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Purpose of visit">
                          <select
                            value={form.purposeOfVisit}
                            onChange={(e) =>
                              updateForm("purposeOfVisit", e.target.value)
                            }
                            className="form-input"
                          >
                            <option>Personal</option>
                            <option>Business</option>
                            <option>Tourism</option>
                            <option>Medical</option>
                            <option>Other</option>
                          </select>
                        </FormField>

                        <FormField label="Registration address">
                          <input
                            value={form.registrationAddress}
                            onChange={(e) =>
                              updateForm("registrationAddress", e.target.value)
                            }
                            placeholder="Guest's address"
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Vehicle number">
                          <input
                            value={form.vehicleNumber}
                            onChange={(e) =>
                              updateForm("vehicleNumber", e.target.value)
                            }
                            placeholder="Optional"
                            className="form-input"
                          />
                        </FormField>
                      </div>

                      <div className="rounded-xl border border-dashed border-slate-300 p-5">
                        <div className="flex items-center gap-2">
                          <Upload size={19} className="text-blue-600" />
                          <h4 className="font-semibold text-slate-800">
                            Upload ID proof
                          </h4>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          Select a scanned copy or photograph of the guest's
                          ID proof.
                        </p>

                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) =>
                            updateForm("idFile", e.target.files?.[0] || null)
                          }
                          className="mt-4 block w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                        />

                        {form.idFile && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-emerald-700">
                            <FileText size={17} />
                            {form.idFile.name}
                          </div>
                        )}

                        <p className="mt-3 text-xs text-slate-400">
                          Prototype only: the selected file is not uploaded or
                          permanently stored yet.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <VerificationCheckbox
                          checked={form.identityVerified}
                          onChange={(value) =>
                            updateForm("identityVerified", value)
                          }
                          label="I have visually verified the guest's identity."
                        />

                        <VerificationCheckbox
                          checked={form.guestDetailsVerified}
                          onChange={(value) =>
                            updateForm("guestDetailsVerified", value)
                          }
                          label="Guest registration details are verified."
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField label="Number of adults" required>
                          <input
                            type="number"
                            min="1"
                            value={form.adults}
                            onChange={(e) =>
                              updateForm("adults", e.target.value)
                            }
                            className="form-input"
                          />
                        </FormField>

                        <FormField label="Number of children">
                          <input
                            type="number"
                            min="0"
                            value={form.children}
                            onChange={(e) =>
                              updateForm("children", e.target.value)
                            }
                            className="form-input"
                          />
                        </FormField>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-4 text-sm">
                        Total registered guests:{" "}
                        <strong>{totalGuests}</strong>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Room assignment */}
                  {currentStep === 2 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Room assignment
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Select a clean and available room matching the
                          reservation's room category.
                        </p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <InfoCard
                          label="Required room type"
                          value={selectedReservation.room.roomType}
                          icon={BedDouble}
                        />
                        <InfoCard
                          label="Total guests"
                          value={totalGuests}
                          icon={Users}
                        />
                        <InfoCard
                          label="Matching available rooms"
                          value={matchingAvailableRooms.length}
                          icon={CheckCircle2}
                        />
                      </div>

                      {matchingAvailableRooms.length === 0 ? (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
                          No clean and available room of this category is
                          currently available. Please update housekeeping or
                          room status before continuing.
                        </div>
                      ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                          {matchingAvailableRooms.map((room) => {
                            const type = roomTypes.find(
                              (item) => item.id === room.roomTypeId
                            );

                            return (
                              <button
                                type="button"
                                key={room.id}
                                onClick={() =>
                                  updateForm("roomId", room.id)
                                }
                                className={`rounded-xl border p-4 text-left transition ${
                                  form.roomId === room.id
                                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                    : "border-slate-200 hover:border-blue-300"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-lg font-bold text-slate-900">
                                      Room {room.roomNumber}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      Floor {room.floor} · Wing {room.wing}
                                    </p>
                                  </div>

                                  {form.roomId === room.id && (
                                    <CheckCircle2
                                      size={21}
                                      className="text-blue-600"
                                    />
                                  )}
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-700">
                                    Clean
                                  </span>
                                  <span className="rounded-full bg-blue-50 px-2 py-1 text-xs text-blue-700">
                                    Available
                                  </span>
                                </div>

                                <div className="mt-4 border-t border-slate-200 pt-3">
                                  <p className="text-sm font-semibold text-slate-800">
                                    {currency(room.currentPrice)} / night
                                  </p>
                                  <p className="mt-1 text-xs text-slate-500">
                                    {type?.bedType} · Max occupancy:{" "}
                                    {type?.maxOccupancy}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {selectedRoom && (
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="font-semibold text-blue-900">
                            Selected room: {selectedRoom.roomNumber}
                          </p>
                          <p className="mt-1 text-sm text-blue-800">
                            {selectedRoomType?.name} · Maximum occupancy:{" "}
                            {selectedRoomType?.maxOccupancy}
                          </p>

                          {totalGuests >
                            (selectedRoomType?.maxOccupancy || 0) && (
                            <p className="mt-2 text-sm font-medium text-red-600">
                              Guest count exceeds the maximum occupancy.
                            </p>
                          )}
                        </div>
                      )}

                      <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-600">
                          Only rooms that are active, available, clean and not
                          under maintenance can be assigned.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Payment */}
                  {currentStep === 3 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Advance payment verification
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Verify the existing payment and record any additional
                          amount received at check-in.
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-5">
                        <div className="space-y-3">
                          <MoneyRow
                            label="Total reservation amount"
                            value={totalAmount}
                          />
                          <MoneyRow
                            label="Previously received"
                            value={alreadyPaid}
                          />
                          <div className="border-t border-slate-100 pt-3">
                            <MoneyRow
                              label="Outstanding before check-in"
                              value={Math.max(totalAmount - alreadyPaid, 0)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          label="Additional payment received"
                          required
                        >
                          <input
                            type="number"
                            min="0"
                            max={Math.max(totalAmount - alreadyPaid, 0)}
                            value={form.amountReceived}
                            onChange={(e) =>
                              updateForm("amountReceived", e.target.value)
                            }
                            placeholder="Enter amount (0 if none)"
                            className={styles.formInput}
                          />
                        </FormField>

                        <FormField label="Payment method">
                          <select
                            value={form.paymentMethod}
                            onChange={(e) =>
                              updateForm("paymentMethod", e.target.value)
                            }
                            className={styles.formInput}
                          >
                            <option>UPI</option>
                            <option>Cash</option>
                            <option>Card</option>
                            <option>Bank Transfer</option>
                          </select>
                        </FormField>
                      </div>

                      <div className="rounded-xl bg-slate-50 p-5">
                        <div className="space-y-3">
                          <MoneyRow
                            label="New payment"
                            value={newPayment}
                          />
                          <MoneyRow
                            label="Total received after check-in"
                            value={alreadyPaid + newPayment}
                          />
                          <div className="border-t border-slate-200 pt-3">
                            <MoneyRow
                              label="Remaining balance"
                              value={pendingAfterPayment}
                              highlight
                            />
                          </div>
                        </div>

                        <div className="mt-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              paymentStatus === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : paymentStatus === "partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                            }`}
                          >
                            Payment status: {paymentStatus}
                          </span>
                        </div>
                      </div>

                      <VerificationCheckbox
                        checked={form.paymentAcknowledged}
                        onChange={(value) =>
                          updateForm("paymentAcknowledged", value)
                        }
                        label="I have verified the payment received and acknowledged any remaining balance."
                      />

                      <p className="text-xs text-slate-500">
                        A guest can be checked in with an outstanding balance.
                        The pending amount remains recorded for collection.
                      </p>
                    </div>
                  )}

                  {/* STEP 5: Confirmation */}
                  {currentStep === 4 && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          Review check-in details
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Review all information before confirming.
                        </p>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <SummaryCard title="Guest information">
                          <SummaryLine
                            label="Guest"
                            value={selectedReservation.guest.name}
                          />
                          <SummaryLine
                            label="Phone"
                            value={selectedReservation.guest.phone}
                          />
                          <SummaryLine
                            label="ID type"
                            value={form.idType}
                          />
                          <SummaryLine
                            label="ID number"
                            value={form.idNumber}
                          />
                          <SummaryLine
                            label="Nationality"
                            value={form.nationality}
                          />
                        </SummaryCard>

                        <SummaryCard title="Stay and room">
                          <SummaryLine
                            label="Booking"
                            value={selectedReservation.reservationId}
                          />
                          <SummaryLine
                            label="Room"
                            value={selectedRoom?.roomNumber}
                          />
                          <SummaryLine
                            label="Room type"
                            value={selectedRoomType?.name}
                          />
                          <SummaryLine
                            label="Check-in"
                            value={formatDate(selectedReservation.checkIn)}
                          />
                          <SummaryLine
                            label="Check-out"
                            value={formatDate(selectedReservation.checkOut)}
                          />
                          <SummaryLine
                            label="Adults / Children"
                            value={`${form.adults} / ${form.children}`}
                          />
                        </SummaryCard>

                        <SummaryCard title="Payment summary">
                          <SummaryLine
                            label="Total amount"
                            value={currency(totalAmount)}
                          />
                          <SummaryLine
                            label="Previously paid"
                            value={currency(alreadyPaid)}
                          />
                          <SummaryLine
                            label="Additional payment"
                            value={currency(newPayment)}
                          />
                          <SummaryLine
                            label="Remaining balance"
                            value={currency(pendingAfterPayment)}
                          />
                          <SummaryLine
                            label="Status"
                            value={paymentStatus}
                          />
                        </SummaryCard>

                        <SummaryCard title="Registration details">
                          <SummaryLine
                            label="Purpose"
                            value={form.purposeOfVisit}
                          />
                          <SummaryLine
                            label="Address"
                            value={form.registrationAddress || "Not provided"}
                          />
                          <SummaryLine
                            label="Vehicle"
                            value={form.vehicleNumber || "Not provided"}
                          />
                          <SummaryLine
                            label="ID file"
                            value={form.idFile?.name || "Not uploaded"}
                          />
                        </SummaryCard>
                      </div>

                      {form.specialRequests && (
                        <div className="rounded-xl border border-slate-200 p-4">
                          <p className="text-sm font-semibold text-slate-800">
                            Special requests
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {form.specialRequests}
                          </p>
                        </div>
                      )}

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <div className="flex gap-3">
                          <ShieldCheck
                            size={21}
                            className="shrink-0 text-amber-600"
                          />
                          <div>
                            <p className="font-semibold text-amber-900">
                              Final confirmation
                            </p>
                            <p className="mt-1 text-sm text-amber-800">
                              Confirming will mark the reservation as checked
                              in and the assigned room as occupied.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-white px-5 py-4 sm:px-7">
                  <button
                    onClick={
                      currentStep === 0 ? closeCheckIn : previousStep
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {currentStep === 0 ? (
                      "Cancel"
                    ) : (
                      <>
                        <ChevronLeft size={17} />
                        Back
                      </>
                    )}
                  </button>

                  {currentStep < 4 ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Continue
                      <ChevronRight size={17} />
                    </button>
                  ) : (
                    <button
                      onClick={confirmCheckIn}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <CheckCircle2 size={17} />
                      Confirm check-in
                    </button>
                  )}
                </div>
              </>
            ) : (
              /* Success screen */
              <div className="overflow-y-auto px-6 py-12 text-center sm:px-12">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 size={42} className="text-emerald-600" />
                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">
                  Check-in successful!
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedReservation.guest.name} has been checked in
                  successfully.
                </p>

                <div className="mx-auto mt-7 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">
                  <SummaryLine
                    label="Booking ID"
                    value={selectedReservation.reservationId}
                  />
                  <SummaryLine
                    label="Guest"
                    value={selectedReservation.guest.name}
                  />
                  <SummaryLine
                    label="Assigned room"
                    value={selectedRoom?.roomNumber}
                  />
                  <SummaryLine
                    label="Check-in time"
                    value={new Date().toLocaleString("en-IN")}
                  />
                  <SummaryLine
                    label="Remaining payment"
                    value={currency(pendingAfterPayment)}
                  />
                </div>

                <p className="mx-auto mt-5 max-w-md text-xs text-slate-400">
                  The reservation and room changes currently exist only in
                  application state. Connect the backend to save them
                  permanently.
                </p>

                <button
                  onClick={closeSuccessfulCheckIn}
                  className="mt-7 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* Reusable components */

function InfoCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <p className="mt-2 wrap-break-word text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function FormField({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function VerificationCheckbox({ checked, onChange, label }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 accent-blue-600"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function MoneyRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span
        className={`text-sm ${
          highlight ? "font-semibold text-slate-900" : "text-slate-500"
        }`}
      >
        {label}
      </span>
      <span
        className={`text-sm font-semibold ${
          highlight ? "text-blue-700" : "text-slate-800"
        }`}
      >
        {currency(value)}
      </span>
    </div>
  );
}

function SummaryCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <h4 className="mb-3 font-semibold text-slate-800">{title}</h4>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function SummaryLine({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="max-w-[65%] wrap-break-word text-right font-medium text-slate-800">
        {value || "—"}
      </span>
    </div>
  );
}
