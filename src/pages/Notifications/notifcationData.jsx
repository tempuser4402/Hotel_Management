
const notificationsData = [
  {
    id: "NOT001",
    title: "New reservation received",
    message:
      "A new reservation has been received for Room 204. Guest Rahul Sharma has booked a Deluxe Room.",
    category: "booking",
    priority: "high",
    isRead: false,
    isArchived: false,
    createdAt: "2026-11-06T07:45:00+05:30",
    relatedEntity: {
      type: "booking",
      id: "BK1024",
      guestName: "Rahul Sharma",
      roomNumber: "204",
    },
  },
  {
    id: "NOT002",
    title: "Payment pending",
    message:
      "A payment of ₹3,500 is pending for the guest's current reservation.",
    category: "payment",
    priority: "medium",
    isRead: false,
    isArchived: false,
    createdAt: "2026-11-06T07:30:00+05:30",
    relatedEntity: {
      type: "payment",
      id: "PAY1024",
      guestName: "Rahul Sharma",
      amount: 3500,
    },
  },
  {
    id: "NOT003",
    title: "Guest check-in completed",
    message: "Priya Verma has successfully checked into Room 108.",
    category: "check-in",
    priority: "low",
    isRead: true,
    isArchived: false,
    createdAt: "2026-11-06T06:45:00+05:30",
    relatedEntity: {
      type: "booking",
      id: "BK1020",
      guestName: "Priya Verma",
      roomNumber: "108",
    },
  },
  {
    id: "NOT004",
    title: "Room cleaning pending",
    message:
      "Room 305 requires cleaning before the next guest check-in.",
    category: "housekeeping",
    priority: "high",
    isRead: false,
    isArchived: false,
    createdAt: "2026-11-06T06:20:00+05:30",
    relatedEntity: {
      type: "room",
      id: "ROOM305",
      roomNumber: "305",
    },
  },
  {
    id: "NOT005",
    title: "Maintenance issue reported",
    message:
      "An AC problem has been reported in Room 210. Maintenance attention is required.",
    category: "maintenance",
    priority: "high",
    isRead: false,
    isArchived: false,
    createdAt: "2026-11-05T22:15:00+05:30",
    relatedEntity: {
      type: "room",
      id: "ROOM210",
      roomNumber: "210",
    },
  },
  {
    id: "NOT006",
    title: "Low inventory alert",
    message:
      "The stock of bathroom towels has reached its minimum inventory level.",
    category: "inventory",
    priority: "medium",
    isRead: true,
    isArchived: false,
    createdAt: "2026-11-05T19:30:00+05:30",
    relatedEntity: {
      type: "inventory",
      id: "INV005",
      itemName: "Bathroom Towels",
    },
  },
  {
    id: "NOT007",
    title: "Event booking confirmed",
    message:
      "The wedding event booking for the Grand Hall has been confirmed.",
    category: "event",
    priority: "medium",
    isRead: false,
    isArchived: false,
    createdAt: "2026-11-05T17:00:00+05:30",
    relatedEntity: {
      type: "event",
      id: "EVT1005",
      eventName: "Wedding Celebration",
      venueName: "Grand Hall",
    },
  },
  {
    id: "NOT008",
    title: "Guest check-out completed",
    message: "Amit Kumar has checked out from Room 112.",
    category: "check-out",
    priority: "low",
    isRead: true,
    isArchived: false,
    createdAt: "2026-11-05T12:00:00+05:30",
    relatedEntity: {
      type: "booking",
      id: "BK1015",
      guestName: "Amit Kumar",
      roomNumber: "112",
    },
  },
  {
    id: "NOT009",
    title: "Reservation cancelled",
    message:
      "Booking BK1012 has been cancelled by the guest.",
    category: "booking",
    priority: "medium",
    isRead: true,
    isArchived: true,
    createdAt: "2026-11-04T15:30:00+05:30",
    relatedEntity: {
      type: "booking",
      id: "BK1012",
      guestName: "Neha Singh",
      roomNumber: "205",
    },
  },
];

export default notificationsData;
