import { useMemo, useState } from "react";
import { rooms } from "../Rooms/roomData";
import { roomTypes } from "../Rooms/roomTypesData";
import { roomAmenities } from "../Rooms/roomAmenitiesData";
import {
  UserRound,
  Search,
  UserPlus,
  Check,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  X,
  CalendarDays,
  BedDouble,
  Users,
  IndianRupee,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";

import reservationsData from "./reservationData";

const steps = [
  { label: "Guest", icon: UserRound },
  { label: "Dates", icon: CalendarDays },
  { label: "Room", icon: BedDouble },
  { label: "Guests", icon: Users },
  { label: "Pricing", icon: IndianRupee },
  { label: "Payment", icon: CreditCard },
  { label: "Confirmation", icon: ClipboardCheck },
];

export default function NewReservation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [guestMode, setGuestMode] = useState("existing");
  const [search, setSearch] = useState("");
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [occupancy, setOccupancy] = useState({
    adults: 1,
    children: 0,
  });
  const [discountType, setDiscountType] = useState("amount");
  const [discountValue, setDiscountValue] = useState(0);
  const [extraCharges, setExtraCharges] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [amountReceived, setAmountReceived] = useState("0");
  const [transactionReference, setTransactionReference] = useState("");

  const [additionalGuestNames, setAdditionalGuestNames] = useState([]);

  const [specialRequests, setSpecialRequests] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );

  const [newGuest, setNewGuest] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  // Prepare unique guest records from existing reservations.
  const existingGuests = useMemo(() => {
    const uniqueGuests = new Map();

    reservationsData.forEach((reservation) => {
      const guest = reservation.guest;

      const key = guest.phone || guest.email;

      if (key && !uniqueGuests.has(key)) {
        uniqueGuests.set(key, guest);
      }
    });

    return Array.from(uniqueGuests.values());
  }, []);

  // Search existing guests.
  const filteredGuests = existingGuests.filter((guest) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      guest.name?.toLowerCase().includes(query) ||
      guest.phone?.toLowerCase().includes(query) ||
      guest.email?.toLowerCase().includes(query)
    );
  });

  const handleNewGuestChange = (e) => {
    const { name, value } = e.target;

    setNewGuest((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setNotice("");
  };

  const pricing = useMemo(() => {
    const roomRate = Number(
      selectedRoom?.currentPrice ??
        roomTypes.find((type) => type.id === selectedRoom?.roomTypeId)
          ?.basePrice ??
        0,
    );

    const nights =
      checkIn && checkOut
        ? Math.max(
            0,
            Math.round(
              (new Date(`${checkOut}T00:00:00`) -
                new Date(`${checkIn}T00:00:00`)) /
                (1000 * 60 * 60 * 24),
            ),
          )
        : 0;

    const roomSubtotal = roomRate * nights;
    const discount =
      discountType === "percentage"
        ? (roomSubtotal * Number(discountValue || 0)) / 100
        : Number(discountValue || 0);

    const validDiscount = Math.min(Math.max(discount, 0), roomSubtotal);

    const charges = Math.max(Number(extraCharges || 0), 0);

    const taxableAmount = Math.max(roomSubtotal - validDiscount + charges, 0);

    const taxAmount = (taxableAmount * Number(taxRate || 0)) / 100;

    const grandTotal = taxableAmount + taxAmount;
    return {
      roomRate,
      nights,
      roomSubtotal,
      discount: validDiscount,
      extraCharges: charges,
      taxableAmount,
      taxRate: Number(taxRate || 0),
      taxAmount,
      grandTotal,
    };
  }, [
    selectedRoom,
    checkIn,
    checkOut,
    discountType,
    discountValue,
    extraCharges,
    taxRate,
  ]);

  const receivedAmount = Number(amountReceived || 0);

  const balanceDue = Math.max(pricing.grandTotal - receivedAmount, 0);

  const paymentStatus =
    receivedAmount <= 0
      ? "Pending"
      : receivedAmount >= pricing.grandTotal
        ? "Paid"
        : "Partially Paid";

  const handlePaymentContinue = () => {
    if (
      amountReceived.trim() === "" ||
      !Number.isFinite(receivedAmount) ||
      receivedAmount < 0
    ) {
      setNotice("Please enter a valid payment amount.");
      return;
    }

    if (receivedAmount > pricing.grandTotal) {
      setNotice("Received amount cannot exceed the total amount.");
      return;
    }

    setNotice("");
    setCurrentStep(6);
  };

  const validateGuest = () => {
    const newErrors = {};

    if (guestMode === "existing") {
      if (!selectedGuest) {
        newErrors.guest = "Please select an existing guest.";
      }
    } else {
      if (!newGuest.name.trim()) {
        newErrors.name = "Guest name is required.";
      }

      if (!newGuest.phone.trim()) {
        newErrors.phone = "Phone number is required.";
      } else if (!/^\+?[0-9\s-]{8,16}$/.test(newGuest.phone.trim())) {
        newErrors.phone = "Enter a valid phone number.";
      }

      if (
        newGuest.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newGuest.email.trim())
      ) {
        newErrors.email = "Enter a valid email address.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateGuest()) return;

    setNotice("");
    setCurrentStep(1);
  };

  const handleDatesContinue = () => {
    if (!checkIn || !checkOut) {
      setNotice("Please select both check-in and check-out dates.");
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setNotice("Check-out date must be after check-in date.");
      return;
    }

    setNotice("");
    setCurrentStep(2);
  };

  const handleSelectGuest = (guest) => {
    setSelectedGuest(guest);
    setErrors({});
    setNotice("");
  };

  const handleGuestMode = (mode) => {
    setGuestMode(mode);
    setSelectedGuest(null);
    setErrors({});
    setNotice("");
  };

  const selectedGuestData =
    guestMode === "existing"
      ? selectedGuest
      : newGuest.name.trim()
        ? newGuest
        : null;

  const selectedRoomType = roomTypes.find(
    (type) => type.id === selectedRoom?.roomTypeId,
  );

  const totalGuests = occupancy.adults + occupancy.children;

  const roomCapacity = selectedRoomType?.maxOccupancy ?? 1;

  const handleGuestsContinue = () => {
    if (!selectedRoom) {
      setNotice("Please select a room first.");
      return;
    }

    if (totalGuests > roomCapacity) {
      setNotice(`Maximum occupancy for this room is ${roomCapacity} guests.`);
      return;
    }

    setNotice("");
    setCurrentStep(4);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-2">
          <CalendarDays size={23} className="text-blue-600" />

          <h1 className="text-2xl font-bold text-slate-800">New Reservation</h1>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Create a new booking by following the reservation steps.
        </p>
      </div>

      {/* Step Progress */}
      <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800">
              Reservation Progress
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>

        <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = currentStep === index;
            const completed = currentStep > index;

            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    active
                      ? "border-blue-600 bg-blue-600 text-white"
                      : completed
                        ? "border-green-500 bg-green-50 text-green-600"
                        : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {completed ? <Check size={17} /> : <Icon size={17} />}
                </div>

                <span
                  className={`text-center text-xs font-medium ${
                    active
                      ? "text-blue-600"
                      : completed
                        ? "text-green-600"
                        : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guest Form */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <div className="flex items-center gap-2">
            <UserRound size={19} className="text-blue-600" />

            <h2 className="font-semibold text-slate-800">
              {
                [
                  "Guest Information",
                  "Select Stay Dates",
                  "Select Room",
                  "Guest Occupancy",
                  "Pricing Details",
                  "Payment Details",
                  "Reservation Confirmation",
                ][currentStep]
              }
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            {
              [
                "Select an existing guest or register a new guest.",
                "Choose check-in and check-out dates.",
                "Select an available room.",
                "Enter the guest occupancy details.",
                "Review room charges, discounts and taxes.",
                "Enter payment details and amount received.",
                "Review all reservation information.",
              ][currentStep]
            }
          </p>
        </div>

        <div className="p-5">
          {currentStep === 0 && (
            <>
              {/* Guest Mode */}
              <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleGuestMode("existing")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    guestMode === "existing"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="rounded-lg bg-white p-2 text-blue-600">
                    <Search size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Existing Guest
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Search registered guests
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleGuestMode("new")}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${
                    guestMode === "new"
                      ? "border-blue-300 bg-blue-50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="rounded-lg bg-white p-2 text-blue-600">
                    <UserPlus size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      New Guest
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Register a new guest
                    </p>
                  </div>
                </button>
              </div>

              {/* Existing Guest Search */}
              {guestMode === "existing" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Search Guest
                  </label>

                  <div className="relative">
                    <Search
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search by guest name, phone or email..."
                      className="w-full rounded-lg border border-slate-200 bg-[#F8FAFC] py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div className="mt-4 space-y-2">
                    {filteredGuests.length > 0 ? (
                      filteredGuests.map((guest) => {
                        const selected =
                          selectedGuest?.phone === guest.phone &&
                          selectedGuest?.email === guest.email;

                        return (
                          <button
                            key={guest.phone || guest.email}
                            type="button"
                            onClick={() => handleSelectGuest(guest)}
                            className={`flex w-full items-center justify-between rounded-lg border p-4 text-left transition ${
                              selected
                                ? "border-blue-300 bg-blue-50"
                                : "border-slate-200 hover:border-blue-200 hover:bg-slate-50"
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-slate-800">
                                {guest.name}
                              </p>

                              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1.5">
                                  <Phone size={13} />
                                  {guest.phone}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Mail size={13} />
                                  {guest.email}
                                </span>
                              </div>
                            </div>

                            {selected && (
                              <Check size={19} className="text-blue-600" />
                            )}
                          </button>
                        );
                      })
                    ) : (
                      <div className="rounded-lg border border-dashed border-slate-300 py-10 text-center">
                        <Users size={30} className="mx-auto text-slate-300" />

                        <p className="mt-3 text-sm font-medium text-slate-700">
                          No guests found
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Try another search or register a new guest.
                        </p>

                        <button
                          type="button"
                          onClick={() => handleGuestMode("new")}
                          className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                        >
                          Register New Guest
                        </button>
                      </div>
                    )}
                  </div>

                  {errors.guest && (
                    <p className="mt-3 text-sm text-red-500">{errors.guest}</p>
                  )}
                </div>
              )}

              {/* New Guest Form */}
              {guestMode === "new" && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-800">
                      New Guest Details
                    </h3>

                    <span className="text-xs text-slate-400">
                      * Required fields
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      label="Guest Full Name"
                      name="name"
                      value={newGuest.name}
                      onChange={handleNewGuestChange}
                      placeholder="Enter guest name"
                      required
                      error={errors.name}
                    />

                    <FormField
                      label="Phone Number"
                      name="phone"
                      value={newGuest.phone}
                      onChange={handleNewGuestChange}
                      placeholder="+91 9876543210"
                      required
                      error={errors.phone}
                    />

                    <FormField
                      label="Email Address"
                      name="email"
                      value={newGuest.email}
                      onChange={handleNewGuestChange}
                      placeholder="guest@example.com"
                      error={errors.email}
                    />

                    <FormField
                      label="Address"
                      name="address"
                      value={newGuest.address}
                      onChange={handleNewGuestChange}
                      placeholder="Enter guest address"
                    />
                  </div>
                </div>
              )}

              {/* Selected Guest Summary */}
              {selectedGuestData && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50/60 p-4">
                  <div className="flex items-center gap-2">
                    <Check size={17} className="text-green-600" />

                    <p className="text-sm font-semibold text-green-700">
                      {guestMode === "existing"
                        ? "Guest Selected"
                        : "Guest Information Entered"}
                    </p>
                  </div>

                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <SummaryItem
                      label="Guest Name"
                      value={selectedGuestData.name}
                    />

                    <SummaryItem
                      label="Phone"
                      value={selectedGuestData.phone || "Not provided"}
                    />

                    <SummaryItem
                      label="Email"
                      value={selectedGuestData.email || "Not provided"}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {currentStep === 1 && (
            <DateRangePicker
              checkIn={checkIn}
              checkOut={checkOut}
              setCheckIn={setCheckIn}
              setCheckOut={setCheckOut}
              calendarMonth={calendarMonth}
              setCalendarMonth={setCalendarMonth}
            />
          )}

          {currentStep === 2 && (
            <div>
              <div className="mb-5">
                <h2 className="text-lg font-semibold text-slate-800">
                  Select a Room
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Choose a room for the selected reservation dates.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {rooms.map((room) => {
                  const roomType = roomTypes.find(
                    (type) => type.id === room.roomTypeId,
                  );

                  const isSelected = selectedRoom?.id === room.id;

                  const roomPrice = Number(
                    room.currentPrice ?? roomType?.basePrice ?? 0,
                  );

                  const amenities = (roomType?.amenities || [])
                    .map((id) => roomAmenities.find((item) => item.id === id))
                    .filter(Boolean);

                  const isUnderMaintenance =
                    room.status === "Maintenance" ||
                    room.maintenanceStatus === "Under Maintenance";

                  return (
                    <button
                      key={room.id}
                      type="button"
                      disabled={isUnderMaintenance}
                      onClick={() => {
                        setSelectedRoom(room);
                        setNotice("");
                      }}
                      className={`rounded-xl border p-4 text-left transition ${
                        isUnderMaintenance
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-60"
                          : isSelected
                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                            : "border-slate-200 bg-white hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-lg font-bold text-slate-800">
                            Room {room.roomNumber}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {roomType?.name || "Uncategorized"} Room · Floor{" "}
                            {room.floor}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              isUnderMaintenance
                                ? "bg-red-100 text-red-700"
                                : room.status === "Occupied"
                                  ? "bg-purple-100 text-purple-700"
                                  : room.status === "Reserved"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700"
                            }`}
                          >
                            {room.status}
                          </span>

                          {isSelected && (
                            <Check size={19} className="text-blue-600" />
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-slate-400">Capacity</p>
                          <p className="text-sm font-medium text-slate-700">
                            {roomType?.maxOccupancy ?? "N/A"} Guests
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">
                            Price per night
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            ₹{roomPrice.toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Bed Type</p>
                          <p className="text-sm font-medium text-slate-700">
                            {roomType?.bedType || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Room Size</p>
                          <p className="text-sm font-medium text-slate-700">
                            {roomType?.size
                              ? `${roomType.size} ${roomType.sizeUnit || "sq.ft"}`
                              : "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="mb-2 text-xs font-medium text-slate-500">
                          Amenities
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {amenities.map((amenity) => (
                            <span
                              key={amenity.id}
                              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                            >
                              {amenity.name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {isUnderMaintenance && (
                        <p className="mt-3 text-xs font-medium text-red-600">
                          This room is under maintenance and cannot be selected.
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {selectedRoom && (
                <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm font-semibold text-green-700">
                    Selected Room: {selectedRoom.roomNumber}
                  </p>

                  <p className="mt-1 text-xs text-green-600">
                    {
                      roomTypes.find(
                        (type) => type.id === selectedRoom.roomTypeId,
                      )?.name
                    }{" "}
                    · ₹
                    {Number(selectedRoom.currentPrice || 0).toLocaleString(
                      "en-IN",
                    )}{" "}
                    per night
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Heading */}
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Guest Occupancy
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the number of people staying in the selected room.
                </p>
              </div>

              {/* Selected Room Summary */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-center gap-2">
                  <BedDouble size={18} className="text-blue-600" />

                  <p className="text-sm font-semibold text-blue-800">
                    Room {selectedRoom?.roomNumber}
                  </p>
                </div>

                <p className="mt-1 text-xs text-blue-600">
                  {selectedRoomType?.name || "Room"} · Maximum {roomCapacity}{" "}
                  guests
                </p>
              </div>

              {/* Adults and Children */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <label className="text-sm font-semibold text-slate-700">
                    Adults
                  </label>

                  <p className="mt-1 text-xs text-slate-400">
                    Age 18 and above
                  </p>

                  <input
                    type="number"
                    min="1"
                    value={occupancy.adults}
                    onChange={(e) => {
                      setOccupancy((prev) => ({
                        ...prev,
                        adults: Math.max(1, Number(e.target.value) || 1),
                      }));
                      setNotice("");
                    }}
                    className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-400"
                  />
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <label className="text-sm font-semibold text-slate-700">
                    Children
                  </label>

                  <p className="mt-1 text-xs text-slate-400">Below 18 years</p>

                  <input
                    type="number"
                    min="0"
                    value={occupancy.children}
                    onChange={(e) => {
                      setOccupancy((prev) => ({
                        ...prev,
                        children: Math.max(0, Number(e.target.value) || 0),
                      }));
                      setNotice("");
                    }}
                    className="mt-3 w-full rounded-lg border border-slate-200 px-3 py-2.5 outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Occupancy Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Guests</span>

                  <span className="text-sm font-bold text-slate-800">
                    {totalGuests} / {roomCapacity}
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all ${
                      totalGuests > roomCapacity ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        (totalGuests / roomCapacity) * 100,
                      )}%`,
                    }}
                  />
                </div>

                {totalGuests > roomCapacity && (
                  <p className="mt-2 text-xs text-red-500">
                    Maximum room capacity exceeded.
                  </p>
                )}
              </div>

              {/* Additional Guest Names */}
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Additional Guest Names
                    </h3>

                    <p className="mt-1 text-xs text-slate-400">
                      Optional guest information.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setAdditionalGuestNames((prev) => [...prev, ""])
                    }
                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-100"
                  >
                    + Add Guest
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {additionalGuestNames.map((name, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        placeholder={`Additional Guest ${index + 1}`}
                        onChange={(e) => {
                          setAdditionalGuestNames((prev) =>
                            prev.map((item, i) =>
                              i === index ? e.target.value : item,
                            ),
                          );
                        }}
                        className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setAdditionalGuestNames((prev) =>
                            prev.filter((_, i) => i !== index),
                          )
                        }
                        className="rounded-lg border border-slate-200 px-3 text-red-500 hover:bg-red-50"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Special Requests
                </label>

                <textarea
                  rows={4}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Enter special requests, extra pillows, room decoration, etc."
                  className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-400"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Pricing Header */}
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Pricing Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review the room charges, apply discounts and configure taxes.
                </p>
              </div>

              {/* Room Information */}
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Room {selectedRoom?.roomNumber}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">
                      {selectedRoomType?.name || "Room"} · {pricing.nights}{" "}
                      nights
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-blue-600">Rate per night</p>
                    <p className="text-lg font-bold text-blue-800">
                      ₹{pricing.roomRate.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Discount and Extra Charges */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Discount
                  </label>

                  <div className="mb-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscountType("amount")}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                        discountType === "amount"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      Fixed Amount (₹)
                    </button>

                    <button
                      type="button"
                      onClick={() => setDiscountType("percentage")}
                      className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                        discountType === "percentage"
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-500"
                      }`}
                    >
                      Percentage (%)
                    </button>
                  </div>

                  <input
                    type="number"
                    min="0"
                    max={discountType === "percentage" ? 100 : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder="Enter discount"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Applied discount: ₹
                    {pricing.discount.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-5">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Additional Charges
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={extraCharges}
                    onChange={(e) => setExtraCharges(e.target.value)}
                    placeholder="Enter extra charges"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Examples: extra bed, room service or other applicable
                    charges.
                  </p>
                </div>
              </div>

              {/* Tax Configuration */}
              <div className="rounded-xl border border-slate-200 p-5">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Tax Configuration
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Enter the applicable tax rate after verifying the property's
                    tax classification.
                  </p>
                </div>

                <div className="max-w-xs">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tax Rate (%)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    placeholder="Enter tax percentage"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
                  />
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="rounded-xl border border-slate-200 p-5">
                <h3 className="mb-4 text-base font-semibold text-slate-800">
                  Price Breakdown
                </h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Room Charges ({pricing.nights} nights)
                    </span>
                    <span className="font-medium text-slate-800">
                      ₹{pricing.roomSubtotal.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-green-600">
                      - ₹{pricing.discount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">Additional Charges</span>
                    <span className="font-medium text-slate-800">
                      ₹{pricing.extraCharges.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3 border-t border-slate-100 pt-3">
                    <span className="font-medium text-slate-600">
                      Taxable Amount
                    </span>
                    <span className="font-semibold text-slate-800">
                      ₹{pricing.taxableAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-slate-500">
                      Tax ({pricing.taxRate}%)
                    </span>
                    <span className="font-medium text-slate-800">
                      ₹
                      {pricing.taxAmount.toLocaleString("en-IN", {
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 rounded-lg bg-slate-900 p-4">
                  <div>
                    <p className="text-sm font-medium text-white">
                      Grand Total
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Final reservation amount
                    </p>
                  </div>

                  <p className="text-2xl font-bold text-white">
                    ₹
                    {pricing.grandTotal.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Payment Details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter the payment information for this reservation.
                </p>
              </div>

              {/* Payment Summary */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border bg-white p-4">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <h3 className="mt-2 text-xl font-bold text-gray-900">
                    ₹{pricing.grandTotal.toLocaleString("en-IN")}
                  </h3>
                </div>

                <div className="rounded-xl border bg-white p-4">
                  <p className="text-sm text-gray-500">Amount Received</p>
                  <h3 className="mt-2 text-xl font-bold text-green-600">
                    ₹{receivedAmount.toLocaleString("en-IN")}
                  </h3>
                </div>

                <div className="rounded-xl border bg-white p-4">
                  <p className="text-sm text-gray-500">Balance Due</p>
                  <h3 className="mt-2 text-xl font-bold text-red-600">
                    ₹{balanceDue.toLocaleString("en-IN")}
                  </h3>
                </div>
              </div>

              {/* Payment Form */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Payment Method
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Amount Received (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={pricing.grandTotal}
                    step="0.01"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Enter amount received"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Transaction / Reference Number
                  </label>

                  <input
                    type="text"
                    value={transactionReference}
                    onChange={(e) => setTransactionReference(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                    placeholder="Enter transaction ID (optional)"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Payment Status
                  </label>

                  <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                    <span
                      className={`font-semibold ${
                        paymentStatus === "Paid"
                          ? "text-green-600"
                          : paymentStatus === "Pending"
                            ? "text-red-600"
                            : "text-orange-600"
                      }`}
                    >
                      {paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5">
                <div className="flex items-center gap-3">
                  <Check size={24} className="text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-800">
                      Reservation Details Ready
                    </h3>
                    <p className="text-sm text-green-600">
                      Review all details before saving the reservation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border p-5">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    Guest Information
                  </h3>

                  <SummaryItem
                    label="Guest Name"
                    value={selectedGuestData?.name || "N/A"}
                  />
                  <SummaryItem
                    label="Phone"
                    value={selectedGuestData?.phone || "N/A"}
                  />
                  <SummaryItem
                    label="Email"
                    value={selectedGuestData?.email || "N/A"}
                  />
                </div>

                <div className="rounded-xl border p-5">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    Stay Information
                  </h3>

                  <SummaryItem
                    label="Room"
                    value={selectedRoom?.roomNumber || "N/A"}
                  />
                  <SummaryItem label="Check-in" value={checkIn} />
                  <SummaryItem label="Check-out" value={checkOut} />
                  <SummaryItem label="Total Nights" value={pricing.nights} />
                  <SummaryItem label="Adults" value={occupancy.adults} />
                  <SummaryItem label="Children" value={occupancy.children} />
                </div>

                <div className="rounded-xl border p-5">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    Pricing Summary
                  </h3>

                  <SummaryItem
                    label="Room Charges"
                    value={`₹${pricing.roomSubtotal.toLocaleString("en-IN")}`}
                  />
                  <SummaryItem
                    label="Discount"
                    value={`₹${pricing.discount.toLocaleString("en-IN")}`}
                  />
                  <SummaryItem
                    label="Tax"
                    value={`₹${pricing.taxAmount.toLocaleString("en-IN")}`}
                  />
                  <SummaryItem
                    label="Grand Total"
                    value={`₹${pricing.grandTotal.toLocaleString("en-IN")}`}
                  />
                </div>

                <div className="rounded-xl border p-5">
                  <h3 className="mb-4 font-semibold text-slate-800">
                    Payment Summary
                  </h3>

                  <SummaryItem label="Payment Method" value={paymentMethod} />
                  <SummaryItem
                    label="Amount Received"
                    value={`₹${receivedAmount.toLocaleString("en-IN")}`}
                  />
                  <SummaryItem
                    label="Balance Due"
                    value={`₹${balanceDue.toLocaleString("en-IN")}`}
                  />
                  <SummaryItem label="Payment Status" value={paymentStatus} />
                  <SummaryItem
                    label="Reference Number"
                    value={transactionReference || "Not provided"}
                  />
                </div>
              </div>

              {specialRequests && (
                <div className="rounded-xl border p-5">
                  <h3 className="mb-2 font-semibold text-slate-800">
                    Special Requests
                  </h3>
                  <p className="text-sm text-slate-600">{specialRequests}</p>
                </div>
              )}
            </div>
          )}
          {notice && (
            <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
              {notice}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              if (currentStep > 0) {
                setCurrentStep(currentStep - 1);
                setNotice("");
              } else {
                window.history.back();
              }
            }}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <ChevronLeft size={17} />
            Back
          </button>

          <button
            type="button"
            onClick={() => {
              if (currentStep === 0) {
                handleContinue();
              } else if (currentStep === 1) {
                handleDatesContinue();
              } else if (currentStep === 2) {
                if (!selectedRoom) {
                  setNotice("Please select a room to continue.");
                  return;
                }

                setNotice("");
                setCurrentStep(3);
              } else if (currentStep === 3) {
                handleGuestsContinue();
              } else if (currentStep === 4) {
                setNotice("");
                setCurrentStep(5);
              } else if (currentStep === 5) {
                handlePaymentContinue();
              } else if (currentStep === 6) {
                setNotice(
                  "Review completed. Reservation has not been saved yet.",
                );
              }
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            {currentStep === 0
              ? "Continue to Dates"
              : currentStep === 1
                ? "Continue to Room"
                : currentStep === 2
                  ? "Continue to Guests"
                  : currentStep === 3
                    ? "Continue to Pricing"
                    : currentStep === 4
                      ? "Continue to Payment"
                      : currentStep === 5
                        ? "Continue to Confirmation"
                        : "Finish"}
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  error,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none transition ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-100"
            : "border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        }`}
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

function DateRangePicker({
  checkIn,
  checkOut,
  setCheckIn,
  setCheckOut,
  calendarMonth,
  setCalendarMonth,
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayKey = getDateKey(today);

  const getNights = () => {
    if (!checkIn || !checkOut) return 0;

    const [sy, sm, sd] = checkIn.split("-").map(Number);
    const [ey, em, ed] = checkOut.split("-").map(Number);

    return Math.round(
      (Date.UTC(ey, em - 1, ed) - Date.UTC(sy, sm - 1, sd)) /
        (1000 * 60 * 60 * 24),
    );
  };

  const selectDate = (date) => {
    const selected = getDateKey(date);

    if (!checkIn || checkOut) {
      setCheckIn(selected);
      setCheckOut("");
      return;
    }

    if (selected <= checkIn) {
      setCheckIn(selected);
      setCheckOut("");
      return;
    }

    setCheckOut(selected);
  };

  const formatDate = (value) => {
    if (!value) return "Not selected";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const months = [
    calendarMonth,
    new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
  ];

  const previousMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
    );
  };

  const canGoBack =
    calendarMonth.getFullYear() > today.getFullYear() ||
    (calendarMonth.getFullYear() === today.getFullYear() &&
      calendarMonth.getMonth() > today.getMonth());

  const nights = getNights();

  return (
    <div>
      {/* Selected Dates */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600">Check-in</p>
          <p className="mt-2 text-lg font-bold text-slate-800">
            {formatDate(checkIn)}
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-xs font-medium text-blue-600">Check-out</p>
          <p className="mt-2 text-lg font-bold text-slate-800">
            {formatDate(checkOut)}
          </p>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="text-xs font-medium text-green-600">Total Nights</p>
          <p className="mt-2 text-lg font-bold text-slate-800">
            {nights} {nights === 1 ? "Night" : "Nights"}
          </p>
        </div>
      </div>

      {/* Calendar Instructions */}
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Select Check-in & Check-out
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            First select check-in, then select check-out.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-600" />
            Selected
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-100" />
            Date Range
          </span>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          disabled={!canGoBack}
          onClick={previousMonth}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="text-sm font-medium text-slate-600">
          Choose your stay dates
        </p>

        <button
          type="button"
          onClick={nextMonth}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Two Month Calendars */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {months.map((month, monthIndex) => {
          const year = month.getFullYear();
          const monthNumber = month.getMonth();

          const daysInMonth = new Date(year, monthNumber + 1, 0).getDate();

          const firstDay = (new Date(year, monthNumber, 1).getDay() + 6) % 7;

          const days = [
            ...Array(firstDay).fill(null),
            ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
          ];

          return (
            <div
              key={`${year}-${monthNumber}`}
              className="rounded-xl border border-slate-200 p-3 sm:p-4"
            >
              <h3 className="mb-4 text-center text-sm font-semibold text-slate-800">
                {month.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>

              <div className="mb-2 grid grid-cols-7">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-medium text-slate-400"
                    >
                      {day}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={`empty-${index}`} />;
                  }

                  const date = new Date(year, monthNumber, day);
                  const dateKey = getDateKey(date);

                  const disabled = dateKey < todayKey;
                  const isCheckIn = dateKey === checkIn;
                  const isCheckOut = dateKey === checkOut;

                  const inRange =
                    checkIn &&
                    checkOut &&
                    dateKey > checkIn &&
                    dateKey < checkOut;

                  const isToday = dateKey === todayKey;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      disabled={disabled}
                      onClick={() => selectDate(date)}
                      className={`relative flex aspect-square items-center justify-center rounded-lg text-sm transition
                        ${
                          isCheckIn || isCheckOut
                            ? "bg-blue-600 font-semibold text-white"
                            : inRange
                              ? "bg-blue-100 text-blue-700"
                              : disabled
                                ? "cursor-not-allowed text-slate-300"
                                : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                        }
                        ${isToday && !isCheckIn && !isCheckOut ? "ring-1 ring-blue-400" : ""}
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Reset Dates */}
      {(checkIn || checkOut) && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setCheckIn("");
              setCheckOut("");
            }}
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
            Clear selected dates
          </button>
        </div>
      )}

      {/* Date Validation Message */}
      {checkIn && !checkOut && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Check-in selected. Now choose your check-out date.
        </div>
      )}

      {checkIn && checkOut && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Your stay is {nights} {nights === 1 ? "night" : "nights"} long. Your
          selected dates are valid.
        </div>
      )}
    </div>
  );
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
