import "./App.css";
import MainLayout from "./components/MainLayout/MainLayout";
import Dashboard from "./pages/Dashboard/dashboard";
import Calender from "./pages/Calender/calender";
import Notification from "./pages/Notifications/notification";
import Reservation from "./pages/Reservations/reservation";
import AllReservations from "./pages/Reservations/AllReservations";
import NewReservation from "./pages/Reservations/NewReservations";
import CheckIn from "./pages/Reservations/CheckIn";
import CheckOut from "./pages/Reservations/CheckOut";
import WalkIn from "./pages/Reservations/WalkIn";
import Cancellations from "./pages/Reservations/Cancellation";
import Guests from "./pages/Guests/guests";
import GuestServices from "./pages/GuestServices/guestServices";
import GuestDirectory from "./pages/Guests/GuestDirectory";
import GuestProfiles from "./pages/Guests/GuestProfile";
import VIPGuests from "./pages/Guests/VIPGuests";
import GuestFeedback from "./pages/Guests/GuestFeedback";
import GuestLoyalty from "./pages/Guests/GuestLoyalty";
import EventCalender from "./pages/Events&Banquets/EventCalender";
import GuestRequests from "./pages/GuestServices/GuestRequests";
import RoomService from "./pages/GuestServices/RoomService";
import Room from "./pages/Rooms/room";
import Events from "./pages/Events&Banquets/events";
import Housekeeping from "./pages/Housekeeping/housekeeping";
import Maintenance from "./pages/Maintenance/maintenance";
import Restaurant from "./pages/Restaurant/restaurant";
import Inventory from "./pages/Inventory/inventory";
import Finance from "./pages/Finance/finance";
import Revenue from "./pages/Revenue/revenue";
import Staff from "./pages/Staff/staff";
import Report from "./pages/Reports/report";
import NightAudit from "./pages/NightAudit/nightAudit";
import AccessControl from "./pages/AccessControl/control";
import Settings from "./pages/Settings/setting";
import Integration from "./pages/Integration/integration";
import Support from "./pages/Support/support";
import { Route, Routes, HashRouter } from "react-router-dom";
import GuestComplaints from "./pages/GuestServices/GuestComplaints";
import SpecialRequests from "./pages/GuestServices/SpecialRequests";
import RoomOverview from "./pages/Rooms/RoomOverview";
import AllRooms from "./pages/Rooms/AllRooms";
import RoomTypes from "./pages/Rooms/RoomTypes";
import RoomAvailability from "./pages/Rooms/RoomAvailability";
import FloorPlan from "./pages/Events&Banquets/AllEvents";
import AllEvents from "./pages/Events&Banquets/AllEvents";
import RatePlans from "./pages/Rooms/RatePlans";
import RoomRestrictions from "./pages/Rooms/RoomRestrictions";
import NewEventBooking from "./pages/Events&Banquets/NewEventBooking";
import HousekeepingOverview from "./pages/Housekeeping/HousekeepingOverview";
import Venues from "./pages/Events&Banquets/Venues";
import Packages from "./pages/Events&Banquets/Packages";
import CleaningTasks from "./pages/Housekeeping/CleaningTask";
import RoomInspections from "./pages/Housekeeping/RoomInspections";
import EventEnquiries from "./pages/Events&Banquets/EventEnquiries";
import StaffAssignments from "./pages/Housekeeping/StaffAssignments";
import LostFound from "./pages/Housekeeping/LostFound";
import EventPayments from "./pages/Events&Banquets/EventPayments";
import EventManagement from "./pages/Events&Banquets/EventManagement";
import RestaurantOverview from "./pages/Restaurant/RestaurantOverview";
import MaintenanceOverview from "./pages/Maintenance/MaintenanceOverview";
import RestaurantOrders from "./pages/Restaurant/RestaurantOrders";
import MaintenanceOrders from "./pages/Maintenance/MaintenanceOrders";
import RestaurantMenu from "./pages/Restaurant/RestaurantMenu";
import RestaurantTables from "./pages/Restaurant/RestaurantTables";
import RestaurantKitchen from "./pages/Restaurant/RestaurantKitchen";
import MaintenanceIssues from "./pages/Maintenance/MaintenanceIssue";
import InventoryOverview from "./pages/Inventory/InventoryOverview";
import StockItems from "./pages/Inventory/StockItems";
import Suppliers from "./pages/Inventory/Suppliers";
import PreventiveMaintenance from "./pages/Maintenance/PreventMaintenance";
import PurchaseOrders from "./pages/Inventory/PurchaseOrders";
import StockTransfers from "./pages/Inventory/StockTransfers";
import LowStockAlerts from "./pages/Inventory/LowStockAlerts";
import FinanceOverview from "./pages/Finance/FinanceOverview";
import Invoices from "./pages/Finance/Invoices";
import Payments from "./pages/Finance/Payments";
import Refunds from "./pages/Finance/Refunds";
import Expenses from "./pages/Finance/Expenses";
import Taxes from "./pages/Finance/Taxes";
import CashBook from "./pages/Finance/CashBook";
import RevenueOverview from "./pages/Revenue/RevenueOverview";
import RoomPricing from "./pages/Revenue/RoomPricing";
import OccupancyForecast from "./pages/Revenue/OccupancyForecast";
import Promotions from "./pages/Revenue/Promotions";
import CorporateRates from "./pages/Revenue/CorporateRates";
import StaffDirectory from "./pages/Staff/StaffDirectory";
import Departments from "./pages/Staff/Departments";
import RolesDesignations from "./pages/Staff/RoleDesignations";
import Attendance from "./pages/Staff/Attendance";
import ShiftScheduling from "./pages/Staff/ShiftScheduling";
import LeaveManagement from "./pages/Staff/LeaveManagement";
import Payroll from "./pages/Staff/Payroll";
import BusinessOverview from "./pages/Reports/BusinessOverview";
import ReservationReports from "./pages/Reports/ReservationReport";
import RevenueReports from "./pages/Reports/RevenueReports";
import OccupancyReports from "./pages/Reports/OccupancyReports";
import GuestReports from "./pages/Reports/GuestReports";
import StaffReports from "./pages/Reports/StaffReports";
import Control from "./pages/AccessControl/control";
import { AllUsers } from "./pages/AccessControl/accessControl";
import AuditLogs from "./pages/AccessControl/AuditLogs";
import RolesPermissions from "./pages/AccessControl/RolesPermission";
import ChannelManager from "./pages/Integration/ChannelManager";
import OTAConnections from "./pages/Integration/OTAConnections";
import PaymentGateways from "./pages/Integration/PaymentGateway";
import GeneralSettings from "./pages/Settings/GeneralSettings";
import PropertyProfile from "./pages/Settings/PropertyProfile";
import TaxesPolicies from "./pages/Settings/TaxesPolicies";
import RoomConfiguration from "./pages/Settings/RoomConfiguration";
import BookingSettings from "./pages/Settings/BookingSettings";

function App() {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calender />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="reservations" element={<Reservation />}>
              <Route index element={<AllReservations />} />
              <Route path="all" element={<AllReservations />} />
              <Route path="new" element={<NewReservation />} />
              <Route path="check-in" element={<CheckIn />} />
              <Route path="check-out" element={<CheckOut />} />
              <Route path="walk-in" element={<WalkIn />} />
              <Route path="cancellations" element={<Cancellations />} />
            </Route>
            <Route path="/guests" element={<Guests />}>
              <Route index element={<GuestDirectory />} />
              <Route path="directory" element={<GuestDirectory />} />
              <Route path="/guests/profiles" element={<GuestProfiles />} />
              <Route path="/guests/vip" element={<VIPGuests />} />
              <Route path="/guests/feedback" element={<GuestFeedback />} />
              <Route path="/guests/loyalty" element={<GuestLoyalty />} />
            </Route>
            <Route path="/guest-services" element={<GuestServices />}>
              <Route index element={<GuestRequests />} />
              <Route path="requests" element={<GuestRequests />} />
              <Route path="room-service" element={<RoomService />} />
              <Route path="complaints" element={<GuestComplaints />} />
              <Route path="special-requests" element={<SpecialRequests />} />
            </Route>
            <Route path="/events" element={<Events />}>
              <Route index element={<EventCalender />} />
              <Route path="calendar" element={<EventCalender />} />
              <Route path="all" element={<AllEvents />} />
              <Route path="new" element={<NewEventBooking />} />
              <Route path="venues" element={<Venues />} />
              <Route path="packages" element={<Packages />} />
              <Route path="payments" element={<EventPayments />} />
              <Route path="enquiries" element={<EventEnquiries />} />
              <Route path="management" element={<EventManagement />} />
            </Route>
            <Route path="/rooms" element={<Room />}>
              <Route index element={<RoomOverview />} />
              <Route path="all" element={<AllRooms />} />
              <Route path="types" element={<RoomTypes />} />
              <Route path="availability" element={<RoomAvailability />} />
              <Route path="floors" element={<FloorPlan />} />
              <Route path="rates" element={<RatePlans />} />
              <Route path="restrictions" element={<RoomRestrictions />} />
            </Route>
            <Route path="/housekeeping" element={<Housekeeping />}>
              <Route index element={<HousekeepingOverview />} />
              <Route path="overview" element={<HousekeepingOverview />} />
              <Route path="tasks" element={<CleaningTasks />} />
              <Route path="inspections" element={<RoomInspections />} />
              <Route path="assignments" element={<StaffAssignments />} />
              <Route path="lost-found" element={<LostFound />} />
            </Route>
            <Route path="/maintenance" element={<Maintenance />}>
              <Route index element={<MaintenanceOverview />} />
              <Route path="orders" element={<MaintenanceOrders />} />
              <Route path="issues" element={<MaintenanceIssues />} />
              <Route path="preventive" element={<PreventiveMaintenance />} />
            </Route>
            <Route path="/restaurant" element={<Restaurant />}>
              <Route index element={<RestaurantOverview />} />
              <Route path="orders" element={<RestaurantOrders />} />
              <Route path="menu" element={<RestaurantMenu />} />
              <Route path="tables" element={<RestaurantTables />} />
              <Route path="kitchen" element={<RestaurantKitchen />} />
            </Route>
            <Route path="/inventory" element={<Inventory />}>
              <Route index element={<InventoryOverview />} />
              <Route path="items" element={<StockItems />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="transfers" element={<StockTransfers />} />
              <Route path="low-stock" element={<LowStockAlerts />} />
            </Route>
            <Route path="/finance" element={<Finance />}>
              <Route index element={<FinanceOverview />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="payments" element={<Payments />} />
              <Route path="refunds" element={<Refunds />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="taxes" element={<Taxes />} />
              <Route path="cash-book" element={<CashBook />} />
            </Route>
            <Route path="/revenue" element={<Revenue />}>
              <Route index element={<RevenueOverview />} />
              <Route path="pricing" element={<RoomPricing />} />
              <Route path="forecast" element={<OccupancyForecast />} />
              <Route path="promotions" element={<Promotions />} />
              <Route path="corporate-rates" element={<CorporateRates />} />
            </Route>
            <Route path="/staff" element={<Staff />}>
              <Route index element={<StaffDirectory />} />
              <Route path="departments" element={<Departments />} />
              <Route path="roles" element={<RolesDesignations />} />
              <Route path="attendance" element={<Attendance />} />
              <Route path="shifts" element={<ShiftScheduling />} />
              <Route path="leaves" element={<LeaveManagement />} />
              <Route path="payroll" element={<Payroll />} />
            </Route>
            <Route path="/reports" element={<Report />}>
              <Route index element={<BusinessOverview />} />
              <Route path="reservations" element={<ReservationReports />} />
              <Route path="revenue" element={<RevenueReports />} />
              <Route path="occupancy" element={<OccupancyReports />} />
              <Route path="guests" element={<GuestReports />} />
              <Route path="staff" element={<StaffReports />} />
            </Route>
            <Route path="/night-audit" element={<NightAudit />} />
            <Route path="/access-control" element={<Control />}>
              <Route index element={<AllUsers />} />
              <Route path="/access-control/users" element={<AuditLogs />} />
              <Route path="/access-control/roles" element={<RolesPermissions />} />
              <Route
                path="/access-control/audit-logs"
                element={<AuditLogs />}
              />
            </Route>
            <Route path="/settings" element={<Settings />}>
              <Route index element={<GeneralSettings />} />
              <Route path="general" element={<GeneralSettings />} />
              <Route path="property" element={<PropertyProfile />} />
              <Route path="policies" element={<TaxesPolicies />} />
              <Route path="rooms" element={<RoomConfiguration />} />
              <Route path="bookings" element={<BookingSettings />} />
            </Route>
            <Route path="/integrations" element={<Integration />}>
              <Route
                index
                element={<ChannelManager />}
              />
              <Route
                path="channel-manager"
                element={<ChannelManager />}
              />
              <Route path="ota" element={<OTAConnections />} />
              <Route path="payments" element={<PaymentGateways />} />
            </Route>
            <Route path="/support" element={<Support />} />
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
