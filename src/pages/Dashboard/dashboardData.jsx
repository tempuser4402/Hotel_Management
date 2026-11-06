export const dashboardStats = [
  {
    title: "Total Rooms",
    value: "120",
    subtitle: "Registered hotel rooms",
    icon: "BedDouble",
    color: "blue",
    trend: "+4.5%",
    trendLabel: "vs last month",
  },
  {
    title: "Available Rooms",
    value: "32",
    subtitle: "Ready for booking",
    icon: "DoorOpen",
    color: "green",
    trend: "26.7%",
    trendLabel: "of total rooms",
  },
  {
    title: "Occupied Rooms",
    value: "76",
    subtitle: "Currently occupied",
    icon: "Hotel",
    color: "purple",
    trend: "63.3%",
    trendLabel: "occupancy rate",
  },
  {
    title: "Today's Check-ins",
    value: "18",
    subtitle: "Expected arrivals",
    icon: "LogIn",
    color: "cyan",
    trend: "+12%",
    trendLabel: "vs yesterday",
  },
  {
    title: "Today's Check-outs",
    value: "12",
    subtitle: "Expected departures",
    icon: "LogOut",
    color: "orange",
    trend: "8 completed",
    trendLabel: "today",
  },
  {
    title: "Total Reservations",
    value: "248",
    subtitle: "Current month",
    icon: "CalendarCheck",
    color: "indigo",
    trend: "+18.2%",
    trendLabel: "vs last month",
  },
  {
    title: "Today's Revenue",
    value: "₹48,500",
    subtitle: "Payments collected",
    icon: "IndianRupee",
    color: "emerald",
    trend: "+15.8%",
    trendLabel: "vs yesterday",
  },
  {
    title: "Pending Payments",
    value: "₹32,800",
    subtitle: "Outstanding balance",
    icon: "Wallet",
    color: "red",
    trend: "12 invoices",
    trendLabel: "awaiting payment",
  },
];

export const revenueData = [
  { name: "01", revenue: 12000, expenses: 5000 },
  { name: "05", revenue: 18000, expenses: 7000 },
  { name: "10", revenue: 15000, expenses: 6000 },
  { name: "15", revenue: 28000, expenses: 11000 },
  { name: "20", revenue: 22000, expenses: 9000 },
  { name: "25", revenue: 35000, expenses: 14000 },
  { name: "30", revenue: 48500, expenses: 17000 },
];

export const occupancyData = [
  { name: "Occupied", value: 76 },
  { name: "Available", value: 32 },
  { name: "Maintenance", value: 8 },
  { name: "Reserved", value: 4 },
];

export const reservationData = [
  { name: "Confirmed", value: 120 },
  { name: "Pending", value: 35 },
  { name: "Checked In", value: 50 },
  { name: "Checked Out", value: 30 },
  { name: "Cancelled", value: 13 },
];

export const roomTypeData = [
  { name: "Standard", occupied: 18, available: 7 },
  { name: "Deluxe", occupied: 24, available: 8 },
  { name: "Suite", occupied: 14, available: 6 },
  { name: "Premium", occupied: 20, available: 5 },
];

export const bookingSourceData = [
  { name: "Direct", value: 45 },
  { name: "Website", value: 30 },
  { name: "OTA", value: 25 },
  { name: "Walk-in", value: 20 },
  { name: "Corporate", value: 15 },
];

export const reservations = [
  {
    id: "BK-1025",
    guest: "Rahul Sharma",
    room: "101",

    // Display dates
    checkIn: "06 Nov 2026",
    checkOut: "08 Nov 2026",

    // Actual dates for calculations
    checkInDate: "2026-11-06",
    checkOutDate: "2026-11-08",

    // Financial data (numbers, not formatted strings)
    totalAmount: 8500,
    paidAmount: 8500,

    status: "Confirmed",
  },
  {
    id: "BK-1024",
    guest: "Priya Verma",
    room: "205",

    checkIn: "06 Nov 2026",
    checkOut: "09 Nov 2026",

    checkInDate: "2026-11-06",
    checkOutDate: "2026-11-09",

    totalAmount: 12000,
    paidAmount: 5000,

    status: "Checked In",
  },
  {
    id: "BK-1023",
    guest: "Amit Kumar",
    room: "302",

    checkIn: "07 Nov 2026",
    checkOut: "10 Nov 2026",

    checkInDate: "2026-11-07",
    checkOutDate: "2026-11-10",

    totalAmount: 15500,
    paidAmount: 2500,

    status: "Pending",
  },
  {
    id: "BK-1022",
    guest: "Neha Singh",
    room: "108",

    checkIn: "06 Nov 2026",
    checkOut: "07 Nov 2026",

    checkInDate: "2026-11-06",
    checkOutDate: "2026-11-07",

    totalAmount: 5000,
    paidAmount: 0,

    status: "Confirmed",
  },
];

export const arrivals = [
  {
    guest: "Amit Kumar",
    room: "302",
    time: "10:30 AM",
    guests: 2,
    status: "Expected",
  },
  {
    guest: "Sneha Gupta",
    room: "205",
    time: "12:00 PM",
    guests: 3,
    status: "Expected",
  },
  {
    guest: "Rohit Mehta",
    room: "110",
    time: "02:30 PM",
    guests: 1,
    status: "Arrived",
  },
];

export const transactions = [
  {
    id: "TXN-501",
    guest: "Rahul Sharma",
    method: "UPI",

    date: "06 Nov 2026",
    transactionDate: "2026-11-06",

    amount: "₹8,500",
    amountValue: 8500,

    status: "Success",
  },
  {
    id: "TXN-502",
    guest: "Priya Verma",
    method: "Card",

    date: "06 Nov 2026",
    transactionDate: "2026-11-06",

    amount: "₹5,000",
    amountValue: 5000,

    status: "Success",
  },
  {
    id: "TXN-503",
    guest: "Amit Kumar",
    method: "Cash",

    date: "06 Nov 2026",
    transactionDate: "2026-11-06",

    amount: "₹2,500",
    amountValue: 2500,

    status: "Success",
  },
];

export const notifications = [
  {
    title: "Payment Pending",
    description: "Booking BK-1023 has an outstanding payment of ₹5,000.",
    time: "10 minutes ago",
    type: "warning",
  },
  {
    title: "New Reservation",
    description: "A new reservation has been received for Room 205.",
    time: "30 minutes ago",
    type: "success",
  },
  {
    title: "Room Maintenance",
    description: "Room 401 is currently under maintenance.",
    time: "1 hour ago",
    type: "danger",
  },
];

export const rooms = [
  ...Array.from({ length: 76 }, (_, index) => ({
    roomNumber: String(101 + index),
    status: "Occupied",
  })),

  ...Array.from({ length: 32 }, (_, index) => ({
    roomNumber: String(201 + index),
    status: "Available",
  })),

  ...Array.from({ length: 8 }, (_, index) => ({
    roomNumber: String(301 + index),
    status: "Maintenance",
  })),

  ...Array.from({ length: 4 }, (_, index) => ({
    roomNumber: String(401 + index),
    status: "Reserved",
  })),
];
