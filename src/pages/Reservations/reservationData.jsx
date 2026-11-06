const reservationsData = [
  {
    id: "RES1001",
    reservationId: "BK1024",

    guest: {
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 9876543210",
    },

    room: {
      roomId: "ROOM204",
      roomNumber: "204",
      roomType: "Deluxe",
    },

    checkIn: "2026-11-06",
    checkOut: "2026-11-08",

    guests: {
      adults: 2,
      children: 1,
    },

    nights: 2,

    pricing: {
      roomCharges: 6000,
      extraCharges: 500,
      discount: 0,
      tax: 500,
      totalAmount: 7000,
    },

    payment: {
      paidAmount: 3500,
      pendingAmount: 3500,
      status: "partial",
      method: "UPI",
    },

    bookingSource: "direct",
    status: "confirmed",

    specialRequests: "Early check-in requested.",
    notes: "Guest prefers a non-smoking room.",

    createdAt: "2026-11-04T10:30:00",
  },

  {
    id: "RES1002",
    reservationId: "BK1025",

    guest: {
      name: "Priya Verma",
      email: "priya@example.com",
      phone: "+91 9876501234",
    },

    room: {
      roomId: "ROOM108",
      roomNumber: "108",
      roomType: "Standard",
    },

    checkIn: "2026-11-07",
    checkOut: "2026-11-09",

    guests: {
      adults: 2,
      children: 0,
    },

    nights: 2,

    pricing: {
      roomCharges: 5000,
      extraCharges: 0,
      discount: 0,
      tax: 500,
      totalAmount: 5500,
    },

    payment: {
      paidAmount: 5500,
      pendingAmount: 0,
      status: "paid",
      method: "Card",
    },

    bookingSource: "website",
    status: "confirmed",

    specialRequests: "Extra pillows required.",
    notes: "",

    createdAt: "2026-11-05T09:15:00",
  },

  {
    id: "RES1003",
    reservationId: "BK1026",

    guest: {
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 9876512345",
    },

    room: {
      roomId: "ROOM305",
      roomNumber: "305",
      roomType: "Suite",
    },

    checkIn: "2026-11-08",
    checkOut: "2026-11-10",

    guests: {
      adults: 2,
      children: 2,
    },

    nights: 2,

    pricing: {
      roomCharges: 8000,
      extraCharges: 500,
      discount: 0,
      tax: 500,
      totalAmount: 9000,
    },

    payment: {
      paidAmount: 0,
      pendingAmount: 9000,
      status: "pending",
      method: null,
    },

    bookingSource: "walk-in",
    status: "pending",

    specialRequests: "Family room arrangement.",
    notes: "Confirmation pending.",

    createdAt: "2026-11-05T14:45:00",
  },

  {
    id: "RES1004",
    reservationId: "BK1027",

    guest: {
      name: "Neha Singh",
      email: "neha@example.com",
      phone: "+91 9876523456",
    },

    room: {
      roomId: "ROOM210",
      roomNumber: "210",
      roomType: "Deluxe",
    },

    checkIn: "2026-11-06",
    checkOut: "2026-11-09",

    guests: {
      adults: 1,
      children: 0,
    },

    nights: 3,

    pricing: {
      roomCharges: 7500,
      extraCharges: 0,
      discount: 500,
      tax: 700,
      totalAmount: 7700,
    },

    payment: {
      paidAmount: 7700,
      pendingAmount: 0,
      status: "paid",
      method: "Cash",
    },

    bookingSource: "phone",
    status: "checked-in",

    specialRequests: "Late checkout requested.",
    notes: "VIP guest.",

    createdAt: "2026-11-03T11:20:00",
  },

  {
    id: "RES1005",
    reservationId: "BK1028",

    guest: {
      name: "Vikram Mehta",
      email: "vikram@example.com",
      phone: "+91 9876534567",
    },

    room: {
      roomId: "ROOM112",
      roomNumber: "112",
      roomType: "Standard",
    },

    checkIn: "2026-11-04",
    checkOut: "2026-11-06",

    guests: {
      adults: 1,
      children: 0,
    },

    nights: 2,

    pricing: {
      roomCharges: 4000,
      extraCharges: 0,
      discount: 0,
      tax: 400,
      totalAmount: 4400,
    },

    payment: {
      paidAmount: 4400,
      pendingAmount: 0,
      status: "paid",
      method: "UPI",
    },

    bookingSource: "ota",
    status: "checked-out",

    specialRequests: "",
    notes: "Regular guest.",

    createdAt: "2026-11-02T16:00:00",
  },

  {
    id: "RES1006",
    reservationId: "BK1029",

    guest: {
      name: "Ananya Gupta",
      email: "ananya@example.com",
      phone: "+91 9876543211",
    },

    room: {
      roomId: "ROOM205",
      roomNumber: "205",
      roomType: "Deluxe",
    },

    checkIn: "2026-11-10",
    checkOut: "2026-11-12",

    guests: {
      adults: 2,
      children: 0,
    },

    nights: 2,

    pricing: {
      roomCharges: 6000,
      extraCharges: 0,
      discount: 0,
      tax: 600,
      totalAmount: 6600,
    },

    payment: {
      paidAmount: 0,
      pendingAmount: 6600,
      status: "pending",
      method: null,
    },

    bookingSource: "direct",
    status: "cancelled",

    specialRequests: "",
    notes: "Cancelled by guest.",

    createdAt: "2026-11-01T12:30:00",
  },

  {
    id: "RES1007",
    reservationId: "BK1030",

    guest: {
      name: "Rohit Malhotra",
      email: "rohit@example.com",
      phone: "+91 9876543212",
    },

    room: {
      roomId: "ROOM310",
      roomNumber: "310",
      roomType: "Suite",
    },

    checkIn: "2026-11-11",
    checkOut: "2026-11-13",

    guests: {
      adults: 2,
      children: 0,
    },

    nights: 2,

    pricing: {
      roomCharges: 9000,
      extraCharges: 500,
      discount: 500,
      tax: 900,
      totalAmount: 9900,
    },

    payment: {
      paidAmount: 2000,
      pendingAmount: 7900,
      status: "partial",
      method: "Card",
    },

    bookingSource: "website",
    status: "confirmed",

    specialRequests: "Airport pickup required.",
    notes: "",

    createdAt: "2026-11-05T18:00:00",
  },

  {
    id: "RES1008",
    reservationId: "BK1031",

    guest: {
      name: "Sneha Kapoor",
      email: "sneha@example.com",
      phone: "+91 9876543213",
    },

    room: {
      roomId: "ROOM115",
      roomNumber: "115",
      roomType: "Standard",
    },

    checkIn: "2026-11-05",
    checkOut: "2026-11-07",

    guests: {
      adults: 2,
      children: 0,
    },

    nights: 2,

    pricing: {
      roomCharges: 4000,
      extraCharges: 0,
      discount: 0,
      tax: 400,
      totalAmount: 4400,
    },

    payment: {
      paidAmount: 0,
      pendingAmount: 4400,
      status: "pending",
      method: null,
    },

    bookingSource: "phone",
    status: "no-show",

    specialRequests: "",
    notes: "Guest did not arrive.",

    createdAt: "2026-11-03T08:30:00",
  },
  {
    id: "RES-2026-015",
    reservationId: "BK-2026-015",

    guest: {
      id: "GUEST-015",
      name: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul.sharma@example.com",
      address: "Delhi, India",
    },

    room: {
      id: "ROOM-002",
      roomNumber: "102",
      roomType: "Standard",
      floor: 1,
    },

    checkIn: "2026-11-04",
    checkOut: "2026-11-06",
    nights: 2,

    guests: {
      adults: 2,
      children: 0,
    },

    status: "checked-in",
    bookingSource: "Walk-in",

    pricing: {
      roomPrice: 2000,
      numberOfNights: 2,
      subtotal: 4000,
      tax: 720,
      discount: 0,
      totalAmount: 4720,
    },

    payment: {
      advanceAmount: 2000,
      paidAmount: 2000,
      dueAmount: 2720,
      paymentStatus: "Partially Paid",
      paymentMethod: "UPI",
    },

    specialRequests: "Late checkout if possible.",

    createdAt: "2026-11-04T10:30:00",
    updatedAt: "2026-11-04T10:30:00",
  },
  {
    id: "RES1009",
    reservationId: "BK1032",

    guest: {
      name: "Arjun Verma",
      email: "arjun@example.com",
      phone: "+91 9876543214",
    },

    room: {
      roomId: "ROOM201",
      roomNumber: "201",
      roomType: "Deluxe",
    },

    checkIn: "2026-11-04",
    checkOut: "2026-11-06",

    guests: {
      adults: 2,
      children: 1,
    },

    nights: 2,

    pricing: {
      roomCharges: 6000,
      extraCharges: 800,
      discount: 300,
      tax: 650,
      totalAmount: 7150,
    },

    payment: {
      paidAmount: 4000,
      pendingAmount: 3150,
      status: "partial",
      method: "UPI",
    },

    bookingSource: "direct",
    status: "checked-in",

    specialRequests: "Late checkout requested.",
    notes: "Restaurant charges added to room.",

    createdAt: "2026-11-04T09:30:00",
  },
];

export default reservationsData;
