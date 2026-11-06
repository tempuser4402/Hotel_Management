
import { useMemo, useState } from "react";
import {
  UserRound,
  CalendarDays,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Users,
  Utensils,
  Package,
  Sparkles,
  IndianRupee,
  CreditCard,
  FileText,
  X,
  Clock,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  PartyPopper,
} from "lucide-react";

const steps = [
  { title: "Customer Details", icon: UserRound },
  { title: "Event Details", icon: CalendarDays },
  { title: "Venue Selection", icon: Building2 },
  { title: "Availability", icon: CheckCircle2 },
  { title: "Guest & Capacity", icon: Users },
  { title: "Food & Catering", icon: Utensils },
  { title: "Packages", icon: Package },
  { title: "Additional Services", icon: Sparkles },
  { title: "Pricing & Taxes", icon: IndianRupee },
  { title: "Advance Payment", icon: CreditCard },
  { title: "Contract & Confirm", icon: FileText },
];

const venues = [
  {
    id: "V001",
    name: "Banquet Hall",
    capacity: 300,
    description: "Large hall suitable for weddings and celebrations.",
    price: 50000,
  },
  {
    id: "V002",
    name: "Conference Hall",
    capacity: 100,
    description: "Professional space for meetings and conferences.",
    price: 15000,
  },
  {
    id: "V003",
    name: "Restaurant / Party Area",
    capacity: 150,
    description: "Suitable for birthdays, parties and small functions.",
    price: 20000,
  },
];

const packages = [
  {
    id: "PKG001",
    name: "Silver",
    description: "Essential event arrangement.",
    pricePerPerson: 700,
    fixedPrice: 0,
    guestLimit: 100,
    features: [
      "Basic venue arrangement",
      "Standard seating",
      "Basic vegetarian menu",
      "Normal lighting",
    ],
  },
  {
    id: "PKG002",
    name: "Gold",
    description: "Enhanced event experience.",
    pricePerPerson: 1200,
    fixedPrice: 0,
    guestLimit: 200,
    features: [
      "Premium seating arrangement",
      "Enhanced vegetarian menu",
      "Stage decoration",
      "Sound system",
    ],
  },
  {
    id: "PKG003",
    name: "Premium",
    description: "Complete premium event experience.",
    pricePerPerson: 1800,
    fixedPrice: 0,
    guestLimit: 300,
    features: [
      "Premium venue arrangement",
      "Special vegetarian menu",
      "Premium decoration",
      "Sound and lighting",
      "Dedicated event coordinator",
    ],
  },
  {
    id: "PKG004",
    name: "Fixed Event Package",
    description: "Fixed-price arrangement for smaller events.",
    pricePerPerson: 0,
    fixedPrice: 75000,
    guestLimit: 100,
    features: [
      "Fixed venue arrangement",
      "Basic decoration",
      "Standard seating",
    ],
  },
];

const cateringMenus = [
  {
    category: "Welcome Drinks",
    items: ["Fresh Lime Soda", "Mocktail", "Jaljeera", "Fresh Juice"],
  },
  {
    category: "Starters",
    items: [
      "Paneer Tikka",
      "Veg Spring Roll",
      "Hara Bhara Kebab",
      "Veg Manchurian",
    ],
  },
  {
    category: "Main Course",
    items: [
      "Shahi Paneer",
      "Dal Makhani",
      "Mix Veg",
      "Jeera Rice",
      "Veg Biryani",
    ],
  },
  {
    category: "Breads",
    items: ["Butter Naan", "Tandoori Roti", "Missi Roti"],
  },
  {
    category: "Desserts",
    items: ["Gulab Jamun", "Ice Cream", "Rasmalai", "Kheer"],
  },
];

const availableServices = [
  { id: "S001", name: "Stage Decoration", price: 12000 },
  { id: "S002", name: "Flower Decoration", price: 8000 },
  { id: "S003", name: "DJ & Sound System", price: 10000 },
  { id: "S004", name: "Photography", price: 15000 },
  { id: "S005", name: "Projector & Screen", price: 5000 },
  { id: "S006", name: "Extra Lighting", price: 6000 },
  { id: "S007", name: "Valet Parking", price: 4000 },
  { id: "S008", name: "Event Coordinator", price: 5000 },
];

const existingBookings = [
  {
    id: "EVT-1001",
    venue: "Banquet Hall",
    date: "2026-11-06",
    startTime: "10:00",
    endTime: "16:00",
    status: "Confirmed",
  },
  {
    id: "EVT-1002",
    venue: "Conference Hall",
    date: "2026-11-06",
    startTime: "11:00",
    endTime: "14:00",
    status: "Tentative",
  },
  {
    id: "EVT-1003",
    venue: "Restaurant / Party Area",
    date: "2026-11-08",
    startTime: "18:00",
    endTime: "22:00",
    status: "Confirmed",
  },
  {
    id: "EVT-1005",
    venue: "Banquet Hall",
    date: "2026-11-14",
    startTime: "17:00",
    endTime: "22:00",
    status: "Tentative",
  },
];

const initialForm = {
  customerName: "",
  phone: "",
  email: "",
  address: "",
  gstNumber: "",
  eventType: "Wedding",
  eventName: "",
  eventDate: "",
  startTime: "10:00",
  endTime: "16:00",
  eventDescription: "",
  venue: "",
  setupTime: "08:00",
  cleanupTime: "18:00",
  guests: "",
  seatingArrangement: "Theatre",
  cateringRequired: true,
  selectedMenu: [],
  specialFoodInstructions: "",
  packageId: "",
  customPackageName: "",
  services: [],
  discount: 0,
  taxRate: 18,
  advanceAmount: "",
  paymentMode: "UPI",
  paymentReference: "",
  paymentDate: new Date().toISOString().slice(0, 10),
  contractNumber: "",
  contractFileName: "",
  cancellationPolicy:
    "Advance payment is subject to the hotel's cancellation policy.",
  paymentTerms: "Advance payment required to confirm the booking.",
  signatureStatus: "Pending",
  agreementAccepted: false,
  notes: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

const Field = ({ label, required, children, hint }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1.5">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
  </div>
);

const inputClass =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white";

const sectionClass =
  "bg-white border border-slate-200 rounded-xl p-4 md:p-5 space-y-4";

export default function NewEventBooking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [bookingSaved, setBookingSaved] = useState(false);

  const update = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));

    if (
      ["venue", "eventDate", "startTime", "endTime"].includes(field)
    ) {
      setAvailabilityChecked(false);
      setAvailabilityResult(null);
    }
  };

  const selectedVenue = venues.find(
    (venue) => venue.name === form.venue
  );

  const selectedPackage = packages.find(
    (item) => item.id === form.packageId
  );

  const selectedServices = availableServices.filter((service) =>
    form.services.includes(service.id)
  );

  const packageAmount = selectedPackage
    ? selectedPackage.fixedPrice > 0
      ? selectedPackage.fixedPrice
      : selectedPackage.pricePerPerson * Number(form.guests || 0)
    : 0;

  const venueAmount = selectedVenue?.price || 0;

  const servicesAmount = selectedServices.reduce(
    (sum, service) => sum + service.price,
    0
  );

  const cateringAmount = form.cateringRequired ? 0 : 0;

  const subtotal =
    packageAmount + venueAmount + servicesAmount + cateringAmount;

  const discountAmount = Math.min(
    Math.max(0, Number(form.discount) || 0),
    subtotal
  );

  const taxableAmount = subtotal - discountAmount;
  const taxAmount =
    taxableAmount * (Math.max(0, Number(form.taxRate) || 0) / 100);

  const grandTotal = taxableAmount + taxAmount;

  const advanceAmount = Math.max(
    0,
    Number(form.advanceAmount) || 0
  );

  const balanceAmount = grandTotal - advanceAmount;

  const capacityExceeded =
    selectedVenue &&
    Number(form.guests) > selectedVenue.capacity;

  const checkAvailability = () => {
    if (
      !form.venue ||
      !form.eventDate ||
      !form.startTime ||
      !form.endTime
    ) {
      alert("Please select venue, date and event timings first.");
      return;
    }

    if (form.endTime <= form.startTime) {
      alert("End time must be later than start time.");
      return;
    }

    const conflict = existingBookings.find((booking) => {
      if (
        booking.venue !== form.venue ||
        booking.date !== form.eventDate ||
        booking.status === "Cancelled"
      ) {
        return false;
      }

      return (
        form.startTime < booking.endTime &&
        form.endTime > booking.startTime
      );
    });

    const result = conflict
      ? {
          available: false,
          message: `Venue is already occupied by ${conflict.id} (${conflict.startTime} - ${conflict.endTime}).`,
        }
      : {
          available: true,
          message: "Venue is available for the selected time slot.",
        };

    setAvailabilityResult(result);
    setAvailabilityChecked(true);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!form.customerName.trim() || !form.phone.trim()) {
          alert("Please enter customer name and phone number.");
          return false;
        }

        if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
          alert("Enter a valid 10-digit Indian mobile number.");
          return false;
        }

        return true;

      case 1:
        if (
          !form.eventName.trim() ||
          !form.eventDate ||
          !form.eventType
        ) {
          alert("Please enter event name, type and date.");
          return false;
        }

        if (form.endTime <= form.startTime) {
          alert("End time must be later than start time.");
          return false;
        }

        return true;

      case 2:
        if (!form.venue) {
          alert("Please select a venue.");
          return false;
        }

        return true;

      case 3:
        if (!availabilityChecked || !availabilityResult?.available) {
          alert("Please check and confirm venue availability first.");
          return false;
        }

        return true;

      case 4:
        if (!form.guests || Number(form.guests) <= 0) {
          alert("Please enter the expected guest count.");
          return false;
        }

        if (capacityExceeded) {
          alert("Guest count exceeds the selected venue capacity.");
          return false;
        }

        return true;

      case 5:
        if (
          form.cateringRequired &&
          form.selectedMenu.length === 0
        ) {
          alert("Please select at least one catering menu item.");
          return false;
        }

        return true;

      case 6:
        if (!form.packageId) {
          alert("Please select an event package.");
          return false;
        }

        if (
          Number(form.guests) > selectedPackage?.guestLimit
        ) {
          alert(
            `This package supports up to ${selectedPackage.guestLimit} guests.`
          );
          return false;
        }

        return true;

      case 7:
        return true;

      case 8:
        if (discountAmount > subtotal) {
          alert("Discount cannot exceed subtotal.");
          return false;
        }

        return true;

      case 9:
        if (advanceAmount > grandTotal) {
          alert("Advance amount cannot exceed total amount.");
          return false;
        }

        return true;

      case 10:
        if (!form.agreementAccepted) {
          alert("Please accept the booking terms and conditions.");
          return false;
        }

        return true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setCurrentStep((previous) => Math.min(previous + 1, steps.length - 1));
  };

  const previousStep = () => {
    setCurrentStep((previous) => Math.max(previous - 1, 0));
  };

  const handleMenuToggle = (item) => {
    setForm((previous) => ({
      ...previous,
      selectedMenu: previous.selectedMenu.includes(item)
        ? previous.selectedMenu.filter((menu) => menu !== item)
        : [...previous.selectedMenu, item],
    }));
  };

  const handleServiceToggle = (id) => {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(id)
        ? previous.services.filter((item) => item !== id)
        : [...previous.services, id],
    }));
  };

  const handleContractUpload = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm((previous) => ({
        ...previous,
        contractFileName: file.name,
      }));
    }
  };

  const handleConfirmBooking = () => {
    if (!validateStep()) return;

    const booking = {
      ...form,
      id: `EVT-${Date.now().toString().slice(-6)}`,
      venueAmount,
      packageAmount,
      servicesAmount,
      subtotal,
      discountAmount,
      taxableAmount,
      taxAmount,
      grandTotal,
      advanceAmount,
      balanceAmount,
      bookingStatus: "Tentative",
      createdAt: new Date().toISOString(),
    };

    setCompletedBooking(booking);
    setBookingSaved(true);
  };

  const resetForm = () => {
    setForm(initialForm);
    setCurrentStep(0);
    setAvailabilityChecked(false);
    setAvailabilityResult(null);
    setCompletedBooking(null);
    setBookingSaved(false);
  };

  const stepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className={sectionClass}>
            <div>
              <h3 className="font-semibold text-slate-800">
                Customer Information
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter the primary contact details for this booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Customer Name" required>
                <input
                  required
                  value={form.customerName}
                  onChange={(e) => update("customerName", e.target.value)}
                  placeholder="Enter full name"
                  className={inputClass}
                />
              </Field>

              <Field label="Mobile Number" required>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    update("phone", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="10-digit mobile number"
                  className={inputClass}
                />
              </Field>

              <Field label="Email Address">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="customer@example.com"
                  className={inputClass}
                />
              </Field>

              <Field label="GST Number">
                <input
                  value={form.gstNumber}
                  onChange={(e) =>
                    update("gstNumber", e.target.value.toUpperCase())
                  }
                  placeholder="Optional GSTIN"
                  maxLength={15}
                  className={inputClass}
                />
              </Field>

              <div className="md:col-span-2">
                <Field label="Customer Address">
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="Enter billing address"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className={sectionClass}>
            <div>
              <h3 className="font-semibold text-slate-800">
                Event Information
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Specify the type, date and timing of the function.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Event Name" required>
                <input
                  required
                  value={form.eventName}
                  onChange={(e) => update("eventName", e.target.value)}
                  placeholder="e.g. Rahul Wedding"
                  className={inputClass}
                />
              </Field>

              <Field label="Event Type" required>
                <select
                  value={form.eventType}
                  onChange={(e) => update("eventType", e.target.value)}
                  className={inputClass}
                >
                  {[
                    "Wedding",
                    "Birthday",
                    "Corporate Event",
                    "Conference",
                    "Engagement",
                    "Anniversary",
                    "Other",
                  ].map((type) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </Field>

              <Field label="Event Date" required>
                <input
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={form.eventDate}
                  onChange={(e) => update("eventDate", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Event Description">
                <input
                  value={form.eventDescription}
                  onChange={(e) =>
                    update("eventDescription", e.target.value)
                  }
                  placeholder="Short description"
                  className={inputClass}
                />
              </Field>

              <Field label="Start Time" required>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update("startTime", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="End Time" required>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => update("endTime", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800">
                Select Event Venue
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose the hall or event area for this booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {venues.map((venue) => {
                const selected = form.venue === venue.name;

                return (
                  <button
                    type="button"
                    key={venue.id}
                    onClick={() => update("venue", venue.name)}
                    className={`text-left p-4 rounded-xl border-2 transition ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-white rounded-lg text-blue-600">
                        <Building2 size={21} />
                      </div>
                      {selected && (
                        <CheckCircle2
                          size={20}
                          className="text-blue-600"
                        />
                      )}
                    </div>

                    <h4 className="font-semibold text-slate-800 mt-3">
                      {venue.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {venue.description}
                    </p>

                    <div className="flex justify-between mt-4 pt-3 border-t border-slate-200">
                      <span className="text-xs text-slate-500">
                        Capacity: {venue.capacity}
                      </span>
                      <span className="text-sm font-semibold text-slate-800">
                        {formatCurrency(venue.price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-4">
              <Field label="Setup Time">
                <input
                  type="time"
                  value={form.setupTime}
                  onChange={(e) => update("setupTime", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Cleanup Time">
                <input
                  type="time"
                  value={form.cleanupTime}
                  onChange={(e) => update("cleanupTime", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={sectionClass}>
            <div>
              <h3 className="font-semibold text-slate-800">
                Check Venue Availability
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Verify the selected venue and time slot before proceeding.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Selected Venue", form.venue || "Not selected"],
                ["Event Date", form.eventDate || "Not selected"],
                ["Start Time", form.startTime],
                ["End Time", form.endTime],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="p-3 bg-slate-50 rounded-lg"
                >
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className="font-semibold text-sm text-slate-800 mt-1">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={checkAvailability}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              <CalendarDays size={17} />
              Check Availability
            </button>

            {availabilityChecked && availabilityResult && (
              <div
                className={`p-4 rounded-lg border flex gap-3 ${
                  availabilityResult.available
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {availabilityResult.available ? (
                  <CheckCircle2
                    size={21}
                    className="text-emerald-600 shrink-0"
                  />
                ) : (
                  <AlertCircle
                    size={21}
                    className="text-red-600 shrink-0"
                  />
                )}

                <div>
                  <p
                    className={`font-semibold text-sm ${
                      availabilityResult.available
                        ? "text-emerald-800"
                        : "text-red-800"
                    }`}
                  >
                    {availabilityResult.available
                      ? "Venue Available"
                      : "Venue Not Available"}
                  </p>
                  <p className="text-xs mt-1 text-slate-600">
                    {availabilityResult.message}
                  </p>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-400">
              Note: This demonstration checks sample bookings only. Final
              availability must be validated against all saved bookings,
              maintenance blocks and setup/cleanup time in the backend.
            </p>
          </div>
        );

      case 4:
        return (
          <div className={sectionClass}>
            <h3 className="font-semibold text-slate-800">
              Guest Count & Venue Capacity
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Expected Number of Guests" required>
                <input
                  type="number"
                  min="1"
                  value={form.guests}
                  onChange={(e) => update("guests", e.target.value)}
                  placeholder="Enter guest count"
                  className={inputClass}
                />
              </Field>

              <Field label="Seating Arrangement">
                <select
                  value={form.seatingArrangement}
                  onChange={(e) =>
                    update("seatingArrangement", e.target.value)
                  }
                  className={inputClass}
                >
                  {[
                    "Theatre",
                    "Banquet",
                    "Classroom",
                    "U-Shape",
                    "Round Table",
                    "Standing",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </Field>
            </div>

            {selectedVenue && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Venue capacity</span>
                  <strong>{selectedVenue.capacity} guests</strong>
                </div>

                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-600">Expected guests</span>
                  <strong>{form.guests || 0}</strong>
                </div>

                <div className="w-full bg-blue-100 rounded-full h-2.5 mt-3">
                  <div
                    className={`h-2.5 rounded-full ${
                      capacityExceeded ? "bg-red-500" : "bg-blue-600"
                    }`}
                    style={{
                      width: `${Math.min(
                        (Number(form.guests || 0) /
                          selectedVenue.capacity) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>

                <p
                  className={`text-xs mt-2 ${
                    capacityExceeded
                      ? "text-red-600"
                      : "text-blue-700"
                  }`}
                >
                  {capacityExceeded
                    ? "Guest count exceeds venue capacity."
                    : `${Math.max(
                        0,
                        selectedVenue.capacity -
                          Number(form.guests || 0)
                      )} additional guests can be accommodated.`}
                </p>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className={sectionClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-semibold text-slate-800">
                  Food & Catering Requirements
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Select food categories and menu items.
                </p>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.cateringRequired}
                  onChange={(e) =>
                    update("cateringRequired", e.target.checked)
                  }
                  className="w-4 h-4 accent-blue-600"
                />
                Catering Required
              </label>
            </div>

            {form.cateringRequired ? (
              <div className="space-y-4">
                {cateringMenus.map((category) => (
                  <div
                    key={category.category}
                    className="border border-slate-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-sm text-slate-800 mb-3">
                      {category.category}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {category.items.map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <input
                            type="checkbox"
                            checked={form.selectedMenu.includes(item)}
                            onChange={() => handleMenuToggle(item)}
                            className="w-4 h-4 accent-blue-600"
                          />
                          {item}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <Field label="Special Food Instructions">
                  <textarea
                    rows={3}
                    value={form.specialFoodInstructions}
                    onChange={(e) =>
                      update("specialFoodInstructions", e.target.value)
                    }
                    placeholder="Allergies, Jain food, special dietary requirements..."
                    className={inputClass}
                  />
                </Field>
              </div>
            ) : (
              <div className="p-5 text-center bg-slate-50 rounded-lg">
                <Utensils
                  size={28}
                  className="mx-auto text-slate-400 mb-2"
                />
                <p className="text-sm text-slate-600">
                  Catering is not required for this event.
                </p>
              </div>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-slate-800">
                Select Event Package
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose a package based on the guest count and event needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((item) => {
                const selected = form.packageId === item.id;
                const packagePrice =
                  item.fixedPrice ||
                  item.pricePerPerson * Number(form.guests || 0);

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => update("packageId", item.id)}
                    className={`text-left p-4 rounded-xl border-2 ${
                      selected
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 bg-white hover:border-blue-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-800">
                        {item.name}
                      </h4>
                      {selected && (
                        <CheckCircle2
                          size={20}
                          className="text-blue-600"
                        />
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {item.description}
                    </p>

                    <p className="text-lg font-bold text-blue-700 mt-3">
                      {item.fixedPrice
                        ? formatCurrency(item.fixedPrice)
                        : `${formatCurrency(item.pricePerPerson)} / person`}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Maximum {item.guestLimit} guests
                    </p>

                    <div className="border-t border-slate-200 mt-3 pt-3 space-y-2">
                      {item.features.map((feature) => (
                        <p
                          key={feature}
                          className="flex items-center gap-2 text-xs text-slate-600"
                        >
                          <Check
                            size={13}
                            className="text-emerald-600"
                          />
                          {feature}
                        </p>
                      ))}
                    </div>

                    <p className="text-sm font-semibold text-slate-800 mt-4">
                      Estimated package: {formatCurrency(packagePrice)}
                    </p>
                  </button>
                );
              })}
            </div>

            <Field label="Custom Package Name (Optional)">
              <input
                value={form.customPackageName}
                onChange={(e) =>
                  update("customPackageName", e.target.value)
                }
                placeholder="Enter custom package name"
                className={inputClass}
              />
            </Field>
          </div>
        );

      case 7:
        return (
          <div className={sectionClass}>
            <div>
              <h3 className="font-semibold text-slate-800">
                Additional Services
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add extra services required for the event.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((service) => {
                const selected = form.services.includes(service.id);

                return (
                  <label
                    key={service.id}
                    className={`flex items-center justify-between gap-3 p-3 border rounded-lg cursor-pointer ${
                      selected
                        ? "border-blue-400 bg-blue-50"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() =>
                          handleServiceToggle(service.id)
                        }
                        className="w-4 h-4 accent-blue-600"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        {service.name}
                      </span>
                    </div>

                    <span className="text-sm font-semibold text-slate-800">
                      {formatCurrency(service.price)}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="p-4 bg-blue-50 rounded-lg flex justify-between">
              <span className="text-sm font-medium text-blue-800">
                Selected Services Total
              </span>
              <span className="font-bold text-blue-800">
                {formatCurrency(servicesAmount)}
              </span>
            </div>
          </div>
        );

      case 8:
        return (
          <div className={sectionClass}>
            <h3 className="font-semibold text-slate-800">
              Pricing & Tax Calculation
            </h3>

            <div className="space-y-3">
              {[
                ["Venue Rental", venueAmount],
                ["Package Amount", packageAmount],
                ["Additional Services", servicesAmount],
              ].map(([label, amount]) => (
                <div
                  key={label}
                  className="flex justify-between text-sm"
                >
                  <span className="text-slate-600">{label}</span>
                  <span className="font-medium text-slate-800">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <strong>{formatCurrency(subtotal)}</strong>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Discount Amount (₹)">
                <input
                  type="number"
                  min="0"
                  max={subtotal}
                  value={form.discount}
                  onChange={(e) => update("discount", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field
                label="Tax Rate (%)"
                hint="Confirm the applicable GST rate with your accountant before issuing the invoice."
              >
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.taxRate}
                  onChange={(e) => update("taxRate", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="space-y-3 bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Discount</span>
                <span className="text-red-600">
                  - {formatCurrency(discountAmount)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Taxable Amount</span>
                <strong>{formatCurrency(taxableAmount)}</strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  Tax ({Number(form.taxRate) || 0}%)
                </span>
                <strong>{formatCurrency(taxAmount)}</strong>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-800">
                  Grand Total
                </span>
                <span className="text-xl font-bold text-blue-700">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className={sectionClass}>
            <h3 className="font-semibold text-slate-800">
              Advance Payment Details
            </h3>

            <div className="p-4 bg-blue-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Grand Total</span>
                <strong>{formatCurrency(grandTotal)}</strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Balance Before Advance</span>
                <strong>{formatCurrency(grandTotal)}</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Advance Amount (₹)">
                <input
                  type="number"
                  min="0"
                  max={grandTotal}
                  value={form.advanceAmount}
                  onChange={(e) =>
                    update("advanceAmount", e.target.value)
                  }
                  placeholder="Enter advance amount"
                  className={inputClass}
                />
              </Field>

              <Field label="Payment Mode">
                <select
                  value={form.paymentMode}
                  onChange={(e) =>
                    update("paymentMode", e.target.value)
                  }
                  className={inputClass}
                >
                  {[
                    "Cash",
                    "UPI",
                    "Credit Card",
                    "Debit Card",
                    "Bank Transfer",
                    "Cheque",
                  ].map((mode) => (
                    <option key={mode}>{mode}</option>
                  ))}
                </select>
              </Field>

              <Field label="Payment Date">
                <input
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) =>
                    update("paymentDate", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>

              <Field label="Transaction Reference">
                <input
                  value={form.paymentReference}
                  onChange={(e) =>
                    update("paymentReference", e.target.value)
                  }
                  placeholder="UPI ID / transaction number"
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Advance Received</span>
                <strong className="text-emerald-600">
                  {formatCurrency(advanceAmount)}
                </strong>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Remaining Balance</span>
                <strong className="text-slate-800">
                  {formatCurrency(balanceAmount)}
                </strong>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full">
                <div
                  className="h-2 bg-emerald-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      grandTotal > 0
                        ? (advanceAmount / grandTotal) * 100
                        : 0,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <div className={sectionClass}>
              <h3 className="font-semibold text-slate-800">
                Contract & Booking Confirmation
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Contract Number">
                  <input
                    value={form.contractNumber}
                    onChange={(e) =>
                      update("contractNumber", e.target.value)
                    }
                    placeholder="e.g. CNT-2026-001"
                    className={inputClass}
                  />
                </Field>

                <Field label="Contract Document">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleContractUpload}
                    className={inputClass}
                  />
                  {form.contractFileName && (
                    <p className="text-xs text-emerald-600 mt-1">
                      Selected: {form.contractFileName}
                    </p>
                  )}
                </Field>

                <Field label="Signature Status">
                  <select
                    value={form.signatureStatus}
                    onChange={(e) =>
                      update("signatureStatus", e.target.value)
                    }
                    className={inputClass}
                  >
                    <option>Pending</option>
                    <option>Sent for Signature</option>
                    <option>Signed</option>
                  </select>
                </Field>

                <Field label="Payment Terms">
                  <textarea
                    rows={3}
                    value={form.paymentTerms}
                    onChange={(e) =>
                      update("paymentTerms", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>

                <div className="md:col-span-2">
                  <Field label="Cancellation Policy">
                    <textarea
                      rows={3}
                      value={form.cancellationPolicy}
                      onChange={(e) =>
                        update("cancellationPolicy", e.target.value)
                      }
                      className={inputClass}
                    />
                  </Field>
                </div>

                <div className="md:col-span-2">
                  <Field label="Internal Notes">
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => update("notes", e.target.value)}
                      placeholder="Any internal booking notes..."
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Final summary */}
            <div className={sectionClass}>
              <h3 className="font-semibold text-slate-800">
                Final Booking Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="font-semibold text-slate-800">
                    {form.customerName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Event</p>
                  <p className="font-semibold text-slate-800">
                    {form.eventName}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Date</p>
                  <p className="font-semibold text-slate-800">
                    {form.eventDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Venue</p>
                  <p className="font-semibold text-slate-800">
                    {form.venue}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Guests</p>
                  <p className="font-semibold text-slate-800">
                    {form.guests}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Package</p>
                  <p className="font-semibold text-slate-800">
                    {selectedPackage?.name || "-"}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Grand Total</span>
                  <strong>{formatCurrency(grandTotal)}</strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Advance</span>
                  <strong className="text-emerald-600">
                    {formatCurrency(advanceAmount)}
                  </strong>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Balance</span>
                  <strong>{formatCurrency(balanceAmount)}</strong>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg bg-white cursor-pointer">
              <input
                type="checkbox"
                checked={form.agreementAccepted}
                onChange={(e) =>
                  update("agreementAccepted", e.target.checked)
                }
                className="w-4 h-4 mt-0.5 accent-blue-600"
              />
              <span className="text-sm text-slate-600">
                I have reviewed the event details, pricing, payment terms
                and cancellation policy. I confirm that the information
                entered is correct.
              </span>
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  if (bookingSaved && completedBooking) {
    return (
      <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-7 flex items-center justify-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-xl w-full text-center shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={34} />
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mt-5">
            Booking Created Successfully!
          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Your event booking has been created as a tentative booking.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 mt-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Event ID</span>
              <strong>{completedBooking.id}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Customer</span>
              <strong>{completedBooking.customerName}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Event</span>
              <strong>{completedBooking.eventName}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Venue</span>
              <strong>{completedBooking.venue}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Grand Total</span>
              <strong>{formatCurrency(completedBooking.grandTotal)}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Advance</span>
              <strong className="text-emerald-600">
                {formatCurrency(completedBooking.advanceAmount)}
              </strong>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Create Another Booking
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/events/all";
              }}
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              View All Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#F5F7FA] p-4 md:p-6 lg:p-7 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <PartyPopper size={16} />
            Events & Banquets
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            New Event Booking
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage a complete event booking.
          </p>
        </div>

        <div className="text-sm text-slate-500">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-700">
            Booking Progress
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(((currentStep + 1) / steps.length) * 100)}%
          </span>
        </div>

        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-11 gap-2">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = currentStep === index;
            const completed = currentStep > index;

            return (
              <button
                type="button"
                key={step.title}
                onClick={() => {
                  if (index < currentStep) setCurrentStep(index);
                }}
                disabled={index > currentStep}
                className={`flex flex-col items-center gap-2 p-2 rounded-lg text-center transition ${
                  active
                    ? "bg-blue-50 text-blue-700"
                    : completed
                    ? "bg-emerald-50 text-emerald-700 cursor-pointer"
                    : "text-slate-400 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    active
                      ? "bg-blue-600 text-white"
                      : completed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  {completed ? <Check size={16} /> : <Icon size={16} />}
                </div>

                <span className="text-[11px] font-medium leading-tight">
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current step */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
            {(() => {
              const Icon = steps[currentStep].icon;
              return <Icon size={22} />;
            })()}
          </div>

          <div>
            <h2 className="font-bold text-lg text-slate-800">
              {currentStep + 1}. {steps[currentStep].title}
            </h2>
            <p className="text-xs text-slate-500">
              Complete this section to continue.
            </p>
          </div>
        </div>

        {stepContent()}
      </div>

      {/* Bottom navigation */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={previousStep}
          disabled={currentStep === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={17} />
          Previous
        </button>

        <p className="text-xs text-slate-400 text-center">
          {currentStep + 1} / {steps.length} sections completed in sequence
        </p>

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={nextStep}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Save & Continue
            <ChevronRight size={17} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
          >
            <CheckCircle2 size={17} />
            Confirm Booking
          </button>
        )}
      </div>
    </div>
  );
}
