import {
  LayoutDashboard,
  CalendarDays,
  Bell,
  CalendarCheck,
  Plus,
  List,
  LogIn,
  LogOut,
  AlertTriangle,
  Users,
  UserRound,
  Crown,
  MessageSquare,
  ConciergeBell,
  BedDouble,
  DoorOpen,
  Layers,
  Tags,
  Brush,
  ClipboardList,
  CheckCircle2,
  Wrench,
  Utensils,
  Package,
  Truck,
  Boxes,
  Wallet,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  Percent,
  UsersRound,
  Building2,
  UserCog,
  Clock3,
  CalendarClock,
  ShieldCheck,
  MoonStar,
  BarChart3,
  FileBarChart,
  Settings,
  Plug,
  LifeBuoy,
  Globe,
  KeyRound,
  ClipboardCheck,
  Sparkles,
  CalendarRange,
  PartyPopper,
  PlusCircle,
} from "lucide-react";

const sidebarMenu = [
  {
    title: "WORKSPACE",
    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
      },
      {
        label: "Booking Calendar",
        icon: CalendarDays,
        path: "/calendar",
      },
      {
        label: "Notifications",
        icon: Bell,
        path: "/notifications",
      },
    ],
  },

  {
    title: "GUEST EXPERIENCE",
    items: [
      {
        label: "Reservations",
        icon: CalendarCheck,
        path: "/reservations",
        children: [
          { label: "All Reservations", icon: List, path: "/reservations/all" },
          { label: "New Reservation", icon: Plus, path: "/reservations/new" },
          { label: "Check-in", icon: LogIn, path: "/reservations/check-in" },
          { label: "Check-out", icon: LogOut, path: "/reservations/check-out" },
          {
            label: "Walk-in Guests",
            icon: UserRound,
            path: "/reservations/walk-in",
          },
          {
            label: "Cancellations",
            icon: AlertTriangle,
            path: "/reservations/cancellations",
          },
        ],
      },
      {
        label: "Guests",
        icon: Users,
        path: "/guests",
        children: [
          { label: "Guest Directory", icon: Users, path: "/guests/directory" },
          {
            label: "Guest Profiles",
            icon: UserRound,
            path: "/guests/profiles",
          },
          { label: "VIP Guests", icon: Crown, path: "/guests/vip" },
          {
            label: "Reviews & Feedback",
            icon: MessageSquare,
            path: "/guests/feedback",
          },
          { label: "Loyalty Program", icon: Sparkles, path: "/guests/loyalty" },
        ],
      },
      {
        label: "Guest Services",
        icon: ConciergeBell,
        path: "/guest-services",
        children: [
          {
            label: "Guest Requests",
            icon: ClipboardList,
            path: "/guest-services/requests",
          },
          {
            label: "Room Service",
            icon: Utensils,
            path: "/guest-services/room-service",
          },
          {
            label: "Complaints",
            icon: MessageSquare,
            path: "/guest-services/complaints",
          },
          {
            label: "Special Requests",
            icon: CheckCircle2,
            path: "/guest-services/special-requests",
          },
        ],
      },
    ],
  },

  {
    title: "PROPERTY OPERATIONS",
    items: [
      {
        label: "Rooms & Rates",
        icon: BedDouble,
        path: "/rooms",
        children: [
          { label: "Room Overview", icon: LayoutDashboard, path: "/rooms" },
          { label: "All Rooms", icon: DoorOpen, path: "/rooms/all" },
          { label: "Room Types", icon: Layers, path: "/rooms/types" },
          {
            label: "Room Availability",
            icon: CalendarCheck,
            path: "/rooms/availability",
          },
          { label: "Floor Plan", icon: Building2, path: "/rooms/floors" },
          { label: "Rate Plans", icon: Tags, path: "/rooms/rates" },
          {
            label: "Restrictions",
            icon: ShieldCheck,
            path: "/rooms/restrictions",
          },
        ],
      },
      {
        label: "Events & Banquets",
        icon: PartyPopper,
        path: "/events",
        children: [
          {
            label: "Event Calendar",
            icon: CalendarRange,
            path: "/events/calendar",
          },
          {
            label: "All Events",
            icon: PartyPopper,
            path: "/events/all",
          },
          {
            label: "New Event Booking",
            icon: PlusCircle,
            path: "/events/new",
          },
          {
            label: "Venues & Halls",
            icon: Building2,
            path: "/events/venues",
          },
          {
            label: "Packages & Pricing",
            icon: Package,
            path: "/events/packages",
          },
          {
            label: "Event Enquiries",
            icon: MessageSquare,
            path: "/events/enquiries",
          },
          {
            label: "Payments & Contracts",
            icon: FileText,
            path: "/events/payments",
          },
          {
            label: "Event Management",
            icon: ClipboardList,
            path: "/events/management",
          },
        ],
      },
      {
        label: "Housekeeping",
        icon: Brush,
        path: "/housekeeping",
        children: [
          { label: "Overview", icon: LayoutDashboard, path: "/housekeeping" },
          {
            label: "Cleaning Tasks",
            icon: ClipboardList,
            path: "/housekeeping/tasks",
          },
          {
            label: "Room Inspections",
            icon: ClipboardCheck,
            path: "/housekeeping/inspections",
          },
          {
            label: "Staff Assignments",
            icon: Users,
            path: "/housekeeping/assignments",
          },
          {
            label: "Lost & Found",
            icon: Package,
            path: "/housekeeping/lost-found",
          },
        ],
      },
      {
        label: "Maintenance",
        icon: Wrench,
        path: "/maintenance",
        children: [
          { label: "Overview", icon: LayoutDashboard, path: "/maintenance" },
          {
            label: "Work Orders",
            icon: ClipboardList,
            path: "/maintenance/orders",
          },
          {
            label: "Issues & Repairs",
            icon: AlertTriangle,
            path: "/maintenance/issues",
          },
          {
            label: "Preventive Maintenance",
            icon: Settings,
            path: "/maintenance/preventive",
          },
        ],
      },
      {
        label: "Restaurant & Dining",
        icon: Utensils,
        path: "/restaurant",
        children: [
          {
            label: "Restaurant Overview",
            icon: LayoutDashboard,
            path: "/restaurant",
          },
          { label: "Orders", icon: ClipboardList, path: "/restaurant/orders" },
          {
            label: "Menu Management",
            icon: Utensils,
            path: "/restaurant/menu",
          },
          {
            label: "Tables & Reservations",
            icon: CalendarCheck,
            path: "/restaurant/tables",
          },
          { label: "Kitchen Orders", icon: Bell, path: "/restaurant/kitchen" },
        ],
      },
      {
        label: "Inventory & Procurement",
        icon: Package,
        path: "/inventory",
        children: [
          { label: "Stock Overview", icon: Boxes, path: "/inventory" },
          { label: "Stock Items", icon: Package, path: "/inventory/items" },
          { label: "Suppliers", icon: Truck, path: "/inventory/suppliers" },
          {
            label: "Purchase Orders",
            icon: ClipboardList,
            path: "/inventory/purchase-orders",
          },
          {
            label: "Stock Transfers",
            icon: Layers,
            path: "/inventory/transfers",
          },
          {
            label: "Low Stock Alerts",
            icon: AlertTriangle,
            path: "/inventory/low-stock",
          },
        ],
      },
    ],
  },

  {
    title: "BUSINESS MANAGEMENT",
    items: [
      {
        label: "Finance & Accounting",
        icon: Wallet,
        path: "/finance",
        children: [
          {
            label: "Finance Overview",
            icon: LayoutDashboard,
            path: "/finance",
          },
          { label: "Invoices", icon: FileText, path: "/finance/invoices" },
          { label: "Payments", icon: CreditCard, path: "/finance/payments" },
          { label: "Refunds", icon: Receipt, path: "/finance/refunds" },
          { label: "Expenses", icon: Wallet, path: "/finance/expenses" },
          { label: "Taxes & Charges", icon: Percent, path: "/finance/taxes" },
          { label: "Cash Book", icon: Receipt, path: "/finance/cash-book" },
        ],
      },
      {
        label: "Revenue & Pricing",
        icon: TrendingUp,
        path: "/revenue",
        children: [
          { label: "Revenue Overview", icon: BarChart3, path: "/revenue" },
          { label: "Room Pricing", icon: Tags, path: "/revenue/pricing" },
          {
            label: "Occupancy & Forecast",
            icon: TrendingUp,
            path: "/revenue/forecast",
          },
          {
            label: "Promotions & Offers",
            icon: Percent,
            path: "/revenue/promotions",
          },
          {
            label: "Corporate Rates",
            icon: Building2,
            path: "/revenue/corporate-rates",
          },
        ],
      },
      {
        label: "Staff & HR",
        icon: UsersRound,
        path: "/staff",
        children: [
          { label: "Staff Directory", icon: Users, path: "/staff" },
          { label: "Departments", icon: Building2, path: "/staff/departments" },
          {
            label: "Roles & Designations",
            icon: UserCog,
            path: "/staff/roles",
          },
          { label: "Attendance", icon: Clock3, path: "/staff/attendance" },
          {
            label: "Shift Scheduling",
            icon: CalendarClock,
            path: "/staff/shifts",
          },
          {
            label: "Leave Management",
            icon: CalendarDays,
            path: "/staff/leaves",
          },
          { label: "Payroll", icon: Wallet, path: "/staff/payroll" },
        ],
      },
    ],
  },

  {
    title: "INSIGHTS & CONTROL",
    items: [
      {
        label: "Reports & Analytics",
        icon: BarChart3,
        path: "/reports",
        children: [
          { label: "Business Overview", icon: FileBarChart, path: "/reports" },
          {
            label: "Reservation Reports",
            icon: CalendarCheck,
            path: "/reports/reservations",
          },
          {
            label: "Revenue Reports",
            icon: TrendingUp,
            path: "/reports/revenue",
          },
          {
            label: "Occupancy Reports",
            icon: BedDouble,
            path: "/reports/occupancy",
          },
          { label: "Guest Reports", icon: Users, path: "/reports/guests" },
          { label: "Staff Reports", icon: UsersRound, path: "/reports/staff" },
        ],
      },
      {
        label: "Night Audit",
        icon: MoonStar,
        path: "/night-audit",
      },
      {
        label: "Users & Access Control",
        icon: ShieldCheck,
        path: "/access-control",
        children: [
          { label: "All Users", icon: Users, path: "/access-control/users" },
          {
            label: "Roles & Permissions",
            icon: KeyRound,
            path: "/access-control/roles",
          },
          {
            label: "Audit Logs",
            icon: ClipboardList,
            path: "/access-control/audit-logs",
          },
        ],
      },
    ],
  },

  {
    title: "CONFIGURATION",
    items: [
      {
        label: "Property Settings",
        icon: Settings,
        path: "/settings",
        children: [
          {
            label: "General Settings",
            icon: Settings,
            path: "/settings/general",
          },
          {
            label: "Property Profile",
            icon: Building2,
            path: "/settings/property",
          },
          {
            label: "Taxes & Policies",
            icon: FileText,
            path: "/settings/policies",
          },
          {
            label: "Room Configuration",
            icon: BedDouble,
            path: "/settings/rooms",
          },
          {
            label: "Booking Settings",
            icon: CalendarCheck,
            path: "/settings/bookings",
          },
        ],
      },
      {
        label: "Integrations",
        icon: Plug,
        path: "/integrations",
        children: [
          {
            label: "Channel Manager",
            icon: Globe,
            path: "/integrations/channel-manager",
          },
          {
            label: "OTA Connections",
            icon: Building2,
            path: "/integrations/ota",
          },
          {
            label: "Payment Gateways",
            icon: CreditCard,
            path: "/integrations/payments",
          },
        ],
      },
      {
        label: "Help & Support",
        icon: LifeBuoy,
        path: "/support",
      },
    ],
  },
];

export default sidebarMenu;
