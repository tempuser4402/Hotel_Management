
export const calendarRooms = [
  { id: "r1", number: "101", type: "Standard", floor: 1, price: 2500 },
  { id: "r2", number: "102", type: "Standard", floor: 1, price: 2500 },
  { id: "r3", number: "103", type: "Deluxe", floor: 1, price: 3500 },
  { id: "r4", number: "201", type: "Deluxe", floor: 2, price: 3500 },
  { id: "r5", number: "202", type: "Premium", floor: 2, price: 4500 },
  { id: "r6", number: "301", type: "Suite", floor: 3, price: 6500 },
];

export const calendarBookings = [
  {
    id: "BK-1025",
    guest: "Rahul Sharma",
    phone: "9876543210",
    roomId: "r1",
    checkIn: "2026-11-06",
    checkOut: "2026-11-09",
    guests: 2,
    amount: 7500,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
  {
    id: "BK-1026",
    guest: "Priya Verma",
    phone: "9876543211",
    roomId: "r2",
    checkIn: "2026-11-05",
    checkOut: "2026-11-08",
    guests: 2,
    amount: 7500,
    status: "Checked In",
    paymentStatus: "Partially Paid",
  },
  {
    id: "BK-1027",
    guest: "Amit Kumar",
    phone: "9876543212",
    roomId: "r3",
    checkIn: "2026-11-07",
    checkOut: "2026-11-10",
    guests: 3,
    amount: 10500,
    status: "Confirmed",
    paymentStatus: "Pending",
  },
  {
    id: "BK-1028",
    guest: "Neha Singh",
    phone: "9876543213",
    roomId: "r4",
    checkIn: "2026-11-06",
    checkOut: "2026-11-08",
    guests: 2,
    amount: 7000,
    status: "Confirmed",
    paymentStatus: "Paid",
  },
];

export const calendarBlocks = [
  {
    id: "BL-101",
    roomId: "r5",
    startDate: "2026-11-06",
    endDate: "2026-11-09",
    reason: "Maintenance",
  },
];
